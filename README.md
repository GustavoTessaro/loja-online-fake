# 🛒 Loja Online — Trabalho Prático II Gustavo Tessaro e Lucas Oliveira Bleyer

## 📌 Objetivo
Este projeto tem como objetivo integrar os conteúdos desenvolvidos nas atividades anteriores da disciplina, resultando na implementação de uma Loja Online utilizando React, Redux e Ant Design. A aplicação reúne funcionalidades de HomePage, Products e Clients, adicionando novos recursos como edição de produtos, carrinho de compras e tema dinâmico.

---

## 🚀 Funcionalidades Principais

### 1. Estrutura Geral
A aplicação contém três páginas principais:

- **HomePage**: exibe os cinco produtos principais da Fake Store API.
- **Products**: lista de produtos com busca, cadastro, edição e exclusão.
- **Clients**: listagem, cadastro e edição de clientes.

A navegação é feita através de um header fixo.

---

## 🔧 Funcionalidades Implementadas

### a) Edição e Exclusão de Produtos
- Botões de editar e excluir para cada item.
- Edição via Drawer com dados carregados.
- Exclusão com Popconfirm.
- Persistência via LocalStorage + Redux.
- Lista atualiza automaticamente.

### b) Carrinho de Compras
- Componente de carrinho integrado ao header.
- Adicionar produtos via botão **Buy**.
- Exibição de itens, quantidades e valor total.
- Remover itens individualmente.
- Finalizar compra (mensagem de sucesso).
- Limpar carrinho.
- Persistência via LocalStorage.
- Exibição em Drawer.

### c) Integração Visual e Tema
- Layout padronizado utilizando Ant Design.
- Tema claro e escuro (dark/light).
- Interface totalmente responsiva.

---

## 📦 Tecnologias Utilizadas
- React + Vite  
- TypeScript  
- Redux Toolkit  
- Ant Design  
- Fake Store API  
- LocalStorage  

---

## ▶️ Como Executar o Projeto

### 1. Instalar dependências:
```bash
npm install
