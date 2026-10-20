/**
 * Definições de Tipos e Interfaces do Sistema de E-commerce
 */

export interface Produto {
  id: number;
  nome: string;
  categoria: string;
  preco: number;
  estoque: number;
}

export interface Cliente {
  id: number;
  nome: string;
  email: string;
}

export interface ItemCarrinho {
  produtoId: number;
  quantidade: number;
}

export interface ItemCarrinhoDetalhado {
  produtoId: number;
  nome: string;
  categoria: string;
  precoUnitario: number;
  quantidade: number;
  subtotal: number;
}

export interface ItemPedido {
  produtoId: number;
  nome: string;
  precoUnitario: number; // Preço histórico congelado no momento da compra
  quantidade: number;
  subtotal: number;
}

export interface Pedido {
  id: number;
  clienteId: number;
  itens: ItemPedido[];
  total: number;
  data: Date;
}

export interface ResumoFinanceiro {
  totalPedidos: number;
  faturamentoTotal: number;
  ticketMedio: number;
  totalItensVendidos: number;
}
