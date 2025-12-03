import { useState, useMemo, useEffect } from "react";
import { Table, Button, Space, Popconfirm, Input, Typography, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { deleteClient, addClient } from "../store/clientsSlice";
import { getClients } from "../services/clients";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import ClientDrawerForm from "../components/ClientDrawerForm";

const { Search } = Input;
const { Title } = Typography;

export function ClientsPage() {
  const clients = useSelector((s: any) => s.clients.list);
  const dispatch = useDispatch();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query) return clients;
    const q = query.toLowerCase();
    return clients.filter(
      (c: any) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q)
    );
  }, [clients, query]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const apiClients: any[] = await getClients(8);
        if (!mounted) return;
        let added = 0;
        apiClients.forEach((u) => {
          const exists = clients.some((c: any) => c.email === u.email);
          if (!exists) {
            const address = u.address
              ? `${u.address.street || ''} ${u.address.suite || ''} - ${u.address.city || ''}`.trim()
              : '';
            try {
              dispatch(
                addClient({
                  name: u.name || u.username || 'Cliente',
                  email: u.email || '',
                  phone: u.phone || '',
                  address,
                  status: 'active',
                })
              );
              added += 1;
            } catch (e) {}
          }
        });
        if (added > 0) {
          message.success(`${added} cliente(s) adicionados a partir da API.`);
        }
      } catch (e) {
        // ignore fetch errors
      }
    })();
    return () => { mounted = false };
  }, []);

  const columns = [
    { title: "Nome", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Telefone", dataIndex: "phone", key: "phone" },
    { title: "Endereço", dataIndex: "address", key: "address" },
    {
      title: "Ações",
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingClient(record);
              setDrawerOpen(true);
            }}
          >
            Editar
          </Button>

          <Popconfirm
            title="Remover esse cliente?"
            onConfirm={() => {
              dispatch(deleteClient(record.id));
              message.success("Cliente removido");
            }}
          >
            <Button danger icon={<DeleteOutlined />}>
              Excluir
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Space
        style={{
          width: "100%",
          justifyContent: "center",
          marginTop: 90,
          marginBottom: 20,
        }}
      >
        <Space>
          <Search
            placeholder="Procure por um cliente..."
            allowClear
            onChange={(e) => setQuery(e.target.value)}
            style={{ width: 300 }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingClient(null);
              setDrawerOpen(true);
            }}
          >
            Adicionar Cliente
          </Button>
        </Space>
      </Space>

      <Table
        columns={columns}
        dataSource={filtered}
        rowKey="id"
        pagination={{ pageSize: 7 }}
      />

      <ClientDrawerForm
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setEditingClient(null);
        }}
        client={editingClient}
      />
    </div>
  );
}
