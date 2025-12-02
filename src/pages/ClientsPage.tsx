import { useState, useMemo } from "react";
import { Table, Button, Space, Popconfirm, Input, Typography, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { deleteClient } from "../store/clientsSlice";
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
