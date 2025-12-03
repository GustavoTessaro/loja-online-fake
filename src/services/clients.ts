// serviço simples para buscar clientes de exemplo
const API = "https://jsonplaceholder.typicode.com/users";

export async function getClients(limit?: number) {
  const url = limit ? `${API}?_limit=${limit}` : API;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Erro ao buscar clientes');
  const data = await res.json();
  return data;
}

export default getClients;
