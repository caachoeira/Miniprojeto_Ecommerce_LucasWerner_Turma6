import { ItemCarrinho, ItemCarrinhoDetalhado } from './types';
import { buscarProdutoPorId } from './produtos';

// Armazena os itens presentes no carrinho de compras
export const carrinho: ItemCarrinho[] = [];

/**
 * Adiciona um produto ao carrinho.
 * Se o produto já estiver no carrinho, atualiza a quantidade somando a nova quantia.
 * Impede quantidades <= 0, produtos inexistentes ou quantia que ultrapasse o estoque atual.
 */
export function adicionarAoCarrinho(produtoId: number, quantidade: number): ItemCarrinho {
  if (quantidade <= 0) {
    throw new Error('A quantidade a ser adicionada deve ser maior que zero.');
  }

  const produto = buscarProdutoPorId(produtoId);
  if (!produto) {
    throw new Error(`Não foi possível adicionar ao carrinho: produto com ID ${produtoId} não encontrado.`);
  }

  const itemExistente = carrinho.find((item) => item.produtoId === produtoId);
  const quantidadeTotalPretendida = (itemExistente ? itemExistente.quantidade : 0) + quantidade;

  if (quantidadeTotalPretendida > produto.estoque) {
    throw new Error(
      `Quantidade solicitada (${quantidadeTotalPretendida}) excede o estoque disponível (${produto.estoque}) para "${produto.nome}".`
    );
  }

  if (itemExistente) {
    itemExistente.quantidade = quantidadeTotalPretendida;
    return itemExistente;
  } else {
    const novoItem: ItemCarrinho = { produtoId, quantidade };
    carrinho.push(novoItem);
    return novoItem;
  }
}

/**
 * Altera a quantidade de um produto específico no carrinho.
 */
export function alterarQuantidadeNoCarrinho(produtoId: number, novaQuantidade: number): ItemCarrinho {
  if (novaQuantidade <= 0) {
    throw new Error('A nova quantidade deve ser maior que zero. Para remover o item, utilize a função de remoção.');
  }

  const itemExistente = carrinho.find((item) => item.produtoId === produtoId);
  if (!itemExistente) {
    throw new Error(`Item com produto ID ${produtoId} não se encontra no carrinho.`);
  }

  const produto = buscarProdutoPorId(produtoId);
  if (!produto) {
    throw new Error(`Produto com ID ${produtoId} não existe.`);
  }

  if (novaQuantidade > produto.estoque) {
    throw new Error(
      `Quantidade solicitada (${novaQuantidade}) excede o estoque disponível (${produto.estoque}) para "${produto.nome}".`
    );
  }

  itemExistente.quantidade = novaQuantidade;
  return itemExistente;
}

/**
 * Remove um item do carrinho pelo ID do produto.
 */
export function removerDoCarrinho(produtoId: number): boolean {
  const indice = carrinho.findIndex((item) => item.produtoId === produtoId);
  if (indice === -1) {
    throw new Error(`Não foi possível remover: produto com ID ${produtoId} não está no carrinho.`);
  }

  carrinho.splice(indice, 1);
  return true;
}

/**
 * Retorna os itens do carrinho enriquecidos com informações do produto e cálculo de subtotal.
 */
export function listarItensDoCarrinho(): ItemCarrinhoDetalhado[] {
  return carrinho.map((item) => {
    const produto = buscarProdutoPorId(item.produtoId);
    const precoUnitario = produto ? produto.preco : 0;
    const nome = produto ? produto.nome : 'Produto Desconhecido';
    const categoria = produto ? produto.categoria : 'Sem Categoria';
    const subtotal = precoUnitario * item.quantidade;

    return {
      produtoId: item.produtoId,
      nome,
      categoria,
      precoUnitario,
      quantidade: item.quantidade,
      subtotal
    };
  });
}

/**
 * Calcula o subtotal de um item individual (preço * quantidade).
 */
export function calcularSubtotalItem(precoUnitario: number, quantidade: number): number {
  return Number((precoUnitario * quantidade).toFixed(2));
}

/**
 * Calcula o valor total da compra somando todos os subtotais do carrinho.
 */
export function calcularTotalDoCarrinho(): number {
  const itensDetalhados = listarItensDoCarrinho();
  const total = itensDetalhados.reduce((acumulador, item) => acumulador + item.subtotal, 0);
  return Number(total.toFixed(2));
}

/**
 * Limpa todos os itens do carrinho de compras.
 */
export function limparCarrinho(): void {
  carrinho.length = 0;
}
