import { Produto } from './types';

// Coleção de produtos em memória
export const produtos: Produto[] = [
  { id: 1, nome: 'Teclado Mecânico RGB', categoria: 'Periféricos', preco: 250.0, estoque: 15 },
  { id: 2, nome: 'Mouse Gamer 16000 DPI', categoria: 'Periféricos', preco: 180.0, estoque: 20 },
  { id: 3, nome: 'Monitor UltraWide 29"', categoria: 'Monitores', preco: 1200.0, estoque: 8 },
  { id: 4, nome: 'Headset Wireless 7.1', categoria: 'Áudio', preco: 350.0, estoque: 12 },
  { id: 5, nome: 'Cadeira Ergonômica', categoria: 'Mobiliário', preco: 950.0, estoque: 5 }
];

/**
 * Cadastra um novo produto no catálogo respeitando as regras de validação.
 */
export function cadastrarProduto(novoProduto: Produto): Produto {
  if (!novoProduto.id || novoProduto.id <= 0) {
    throw new Error('Identificador do produto inválido. Deve ser um número positivo.');
  }

  if (!novoProduto.nome || novoProduto.nome.trim() === '') {
    throw new Error('O nome do produto não pode estar vazio.');
  }

  if (novoProduto.preco <= 0) {
    throw new Error('O preço do produto deve ser maior que zero.');
  }

  if (novoProduto.estoque < 0) {
    throw new Error('O estoque não pode ser negativo.');
  }

  const idExistente = produtos.some((p) => p.id === novoProduto.id);
  if (idExistente) {
    throw new Error(`Já existe um produto cadastrado com o ID ${novoProduto.id}.`);
  }

  produtos.push(novoProduto);
  return novoProduto;
}

/**
 * Retorna todos os produtos disponíveis no catálogo.
 */
export function listarProdutos(): Produto[] {
  return [...produtos];
}

/**
 * Busca um produto específico pelo seu ID.
 */
export function buscarProdutoPorId(id: number): Produto | undefined {
  return produtos.find((p) => p.id === id);
}

/**
 * Busca produtos pelo nome (busca parcial e insensível a maiúsculas/minúsculas).
 */
export function buscarProdutosPorNome(termo: string): Produto[] {
  const termoFormatado = termo.trim().toLowerCase();
  if (!termoFormatado) return [];
  return produtos.filter((p) => p.nome.toLowerCase().includes(termoFormatado));
}

/**
 * Filtra produtos por categoria exata ou parcial.
 */
export function filtrarProdutosPorCategoria(categoria: string): Produto[] {
  const categoriaFormatada = categoria.trim().toLowerCase();
  return produtos.filter((p) => p.categoria.toLowerCase() === categoriaFormatada);
}

/**
 * Atualiza os dados de um produto existente.
 */
export function atualizarProduto(
  id: number,
  dadosAtualizados: Partial<Omit<Produto, 'id'>>
): Produto {
  const produto = buscarProdutoPorId(id);
  if (!produto) {
    throw new Error(`Produto com ID ${id} não foi encontrado para atualização.`);
  }

  if (dadosAtualizados.nome !== undefined) {
    if (!dadosAtualizados.nome || dadosAtualizados.nome.trim() === '') {
      throw new Error('O nome do produto não pode ficar vazio.');
    }
    produto.nome = dadosAtualizados.nome;
  }

  if (dadosAtualizados.categoria !== undefined) {
    if (!dadosAtualizados.categoria || dadosAtualizados.categoria.trim() === '') {
      throw new Error('A categoria do produto não pode ficar vazia.');
    }
    produto.categoria = dadosAtualizados.categoria;
  }

  if (dadosAtualizados.preco !== undefined) {
    if (dadosAtualizados.preco <= 0) {
      throw new Error('O preço do produto deve ser maior que zero.');
    }
    produto.preco = dadosAtualizados.preco;
  }

  if (dadosAtualizados.estoque !== undefined) {
    if (dadosAtualizados.estoque < 0) {
      throw new Error('O estoque não pode ser negativo.');
    }
    produto.estoque = dadosAtualizados.estoque;
  }

  return produto;
}

/**
 * Remove um produto do catálogo pelo seu ID.
 */
export function removerProduto(id: number): boolean {
  const indice = produtos.findIndex((p) => p.id === id);
  if (indice === -1) {
    throw new Error(`Não foi possível remover: produto com ID ${id} não encontrado.`);
  }

  produtos.splice(indice, 1);
  return true;
}

/**
 * Deduz a quantidade vendida do estoque do produto.
 */
export function decrementarEstoque(id: number, quantidade: number): void {
  const produto = buscarProdutoPorId(id);
  if (!produto) {
    throw new Error(`Produto com ID ${id} não encontrado.`);
  }
  if (produto.estoque < quantidade) {
    throw new Error(`Estoque insuficiente para o produto "${produto.nome}". Disponível: ${produto.estoque}, Solicitado: ${quantidade}.`);
  }
  produto.estoque -= quantidade;
}
