import { Drawer, Form, Input, Button, message } from "antd";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addClient, updateClient } from "../store/clientsSlice";

interface Props {
  open: boolean;
  onClose: () => void;
  client: any;
}

export default function ClientDrawerForm({ open, onClose, client }: Props) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    if (client) form.setFieldsValue(client);
    else form.resetFields();
  }, [client, form, open]);

  const onFinish = (values: any) => {
    if (client) {
      dispatch(updateClient({ ...client, ...values }));
      message.success("Cliente atualizado com sucesso!");
    } else {
      dispatch(addClient(values));
      message.success("Cliente cadastrado com sucesso!");
    }
    form.resetFields();
    onClose();
  };

  return (
    <Drawer
      title={client ? "Editar Cliente" : "Novo Cliente"}
      width={360}
      open={open}
      onClose={onClose}
      footer={
        <div style={{ textAlign: "right" }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Cancelar
          </Button>
          <Button type="primary" onClick={() => form.submit()}>
            Adicionar Cliente
          </Button>
        </div>
      }
    >
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item
          name="name"
          label="Nome"
          rules={[
            { required: true, message: "Informe o nome do cliente" },
            { min: 3, message: "Nome deve ter pelo menos 3 caracteres" },
          ]}
        >
          <Input placeholder="Ex: Raul Silva" />
        </Form.Item>

        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            { required: true, message: "Informe o e-mail do cliente" },
            { type: "email", message: "E-mail inválido" },
          ]}
        >
          <Input placeholder="Ex: raul@gmail.com" type="email" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Telefone"
          rules={[
            { required: true, message: "Informe o telefone do cliente" },
            {
              pattern: /^\(\d{2}\) \d{4,5}-\d{4}$/,
              message: "Formato: (XX) XXXXX-XXXX",
            },
          ]}
        >
          <Input placeholder="Ex: (49) 98765-4321" />
        </Form.Item>

        <Form.Item
          name="address"
          label="Endereço"
          rules={[
            { required: true, message: "Informe o endereço do cliente" },
            { min: 5, message: "Endereço deve ter pelo menos 5 caracteres" },
          ]}
        >
          <Input placeholder="Ex: Jardim Boa Vista, 255" />
        </Form.Item>
      </Form>
    </Drawer>
  );
}
