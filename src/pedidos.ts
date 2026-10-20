import { Pedido, ItemPedido } from './types';
import { buscarClientePorId } from './clientes';
import { buscarProdutoPorId, decrementarEstoque } from './produtos';
import { carrinho, limparCarrinho } from './carrinho';

// Coleção de pedidos registrados em memória
export const pedidos: Pedido[] = [];

// Gerador de identificadores únicos sequenciais para pedidos
let proximoIdPedido = 1;

/**
 * Finaliza a compra do carrinho para um cliente especificado.
 * Realiza validação atômica de integridade:
 * - O carrinho não pode estar vazio.
 * - O cliente deve existir.
 * - Todos os itens devem ter estoque suficiente.
 * Se houver qualquer inconsistência, nada é deduzido do estoque e nenhum pedido é salvo.
 */
export function finalizarPedido(clienteId: number): Pedido {
  // 1. Validação de cliente
  const cliente = buscarClientePorId(clienteId);
  if (!cliente) {
    throw new Error(`Não é possível finalizar o pedido: cliente com ID ${clienteId} não foi encontrado.`);
  }

  // 2. Validação de itens no carrinho
  if (carrinho.length === 0) {
    throw new Error('Não é possível finalizar a compra: o carrinho está vazio.');
  }

  // 3. Validação preliminar de estoque para TODOS os itens (consistência atômica)
  for (const item of carrinho) {
    const produto = buscarProdutoPorId(item.produtoId);
    if (!produto) {
      throw new Error(`Inconsistência: produto ID ${item.produtoId} presente no carrinho não existe no catálogo.`);
    }
    if (produto.estoque < item.quantidade) {
      throw new Error(
        `Falha na finalização: estoque insuficiente para "${produto.nome}". Disponível: ${produto.estoque}, Requisitado: ${item.quantidade}. O pedido foi cancelado e nenhum estoque foi alterado.`
      );
    }
  }

  // 4. Se todos os itens têm estoque garantido, congela os dados históricos e debita o estoque
  const itensPedido: ItemPedido[] = [];
  let totalPedido = 0;

  for (const item of carrinho) {
    const produto = buscarProdutoPorId(item.produtoId)!;
    const subtotal = Number((produto.preco * item.quantidade).toFixed(2));

    itensPedido.push({
      produtoId: produto.id,
      nome: produto.nome,
      precoUnitario: produto.preco, // Preço congelado no momento da compra
      quantidade: item.quantidade,
      subtotal
    });

    totalPedido += subtotal;

    // Deduz do estoque
    decrementarEstoque(produto.id, item.quantidade);
  }

  totalPedido = Number(totalPedido.toFixed(2));

  // 5. Gera o pedido registrado
  const novoPedido: Pedido = {
    id: proximoIdPedido++,
    clienteId: cliente.id,
    itens: itensPedido,
    total: totalPedido,
    data: new Date()
  };

  pedidos.push(novoPedido);

  // 6. Esvazia o carrinho após finalização com sucesso
  limparCarrinho();

  return novoPedido;
}

/**
 * Retorna todos os pedidos registrados no sistema.
 */
export function listarTodosPedidos(): Pedido[] {
  return [...pedidos];
}

/**
 * Consulta todos os pedidos realizados por um cliente específico.
 */
export function buscarPedidosPorCliente(clienteId: number): Pedido[] {
  const cliente = buscarClientePorId(clienteId);
  if (!cliente) {
    throw new Error(`Cliente com ID ${clienteId} não encontrado.`);
  }
  return pedidos.filter((pedido) => pedido.clienteId === clienteId);
}
