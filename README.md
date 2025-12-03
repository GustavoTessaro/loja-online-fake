# 🛒 Loja Online — Trabalho Prático II  
**Gustavo Tessaro e Lucas Oliveira Bleyer**

## 📌 Objetivo
Este projeto integra os conteúdos desenvolvidos ao longo da disciplina, resultando na implementação completa de uma Loja Online utilizando **React**, **Redux Toolkit**, **Ant Design** e **Fake Store API**.  
A aplicação inclui HomePage, Products, Clients, carrinho de compras, edição de dados e tema dinâmico.

---

## 🚀 Funcionalidades Principais

### 1. Estrutura Geral
A aplicação contém três páginas principais:
- **HomePage** — lista os cinco produtos principais.
- **Products** — exibe todos os produtos, com CRUD completo.
- **Clients** — lista, cadastra e edita clientes.

Navegação feita por um **header fixo**.

---

## 🔧 Funcionalidades Implementadas

### a) Edição e Exclusão de Produtos
- Botões de editar e excluir.
- Drawer com formulário carregando dados do produto.
- Popconfirm para confirmar exclusão.
- Persistência via **LocalStorage + Redux Toolkit**.

### b) Carrinho de Compras
- Carrinho integrado ao header.
- Adicionar produtos via botão **Buy**.
- Drawer lateral para exibir itens do carrinho.
- Quantidades, valores e total calculado.
- Remover itens individualmente.
- Limpar carrinho / finalizar compra.
- Persistência automática em **LocalStorage**.

### c) Tema Claro/Escuro
- Integração nativa com Ant Design.
- Comutador de tema no header.
- Persistência em LocalStorage.

---

## 📦 Tecnologias Utilizadas
- **React + Vite**  
- **TypeScript**  
- **Redux Toolkit**  
- **Ant Design (AntD)**  
- **Fake Store API**  
- **LocalStorage**  

---

# 📦 Instalação das Dependências + 🚀 Como Rodar  
*(TUDO JUNTO, SEM QUEBRA)*

```bash
# 1️⃣ Clonar o projeto
git clone https://github.com/seu-repo/aqui.git
cd nome-do-projeto

# 2️⃣ Instalar TODAS as dependências
npm install

# 3️⃣ Rodar o servidor
npm run dev
