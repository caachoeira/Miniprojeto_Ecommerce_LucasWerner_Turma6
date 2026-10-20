/**
 * Demonstração Completa do Sistema de E-commerce
 * Desenvolvido por: Lucas Cachoeira Werner
 * Turma: Turma 6 Ciclo 2
 */

import {
  cadastrarProduto,
  listarProdutos,
  buscarProdutoPorId,
  buscarProdutosPorNome,
  filtrarProdutosPorCategoria,
  atualizarProduto
} from './produtos';

import {
  cadastrarCliente,
  listarClientes,
  buscarClientePorId
} from './clientes';

import {
  adicionarAoCarrinho,
  alterarQuantidadeNoCarrinho,
  listarItensDoCarrinho,
  calcularTotalDoCarrinho
} from './carrinho';

import {
  finalizarPedido,
  listarTodosPedidos,
  buscarPedidosPorCliente
} from './pedidos';

import { exibirRelatorioConsolidado } from './relatorios';

function separador(titulo: string) {
  console.log('\n' + '='.repeat(70));
  console.log(`📌 ${titulo}`);
  console.log('='.repeat(70));
}

function subseparador(subtitulo: string) {
  console.log(`\n--- ${subtitulo} ---`);
}

function executarDemonstracao() {
  console.log('🚀 INICIANDO DEMONSTRAÇÃO DO SISTEMA DE GERENCIAMENTO DE E-COMMERCE');
  console.log('Desenvolvedor: Lucas Cachoeira Werner | Turma: Turma 6 Ciclo 2\n');

  // =========================================================================
  // 1. GERENCIAMENTO E CONSULTAS DE PRODUTOS
  // =========================================================================
  separador('1. CATÁLOGO DE PRODUTOS');

  console.log('Listando produtos iniciais em estoque:');
  console.table(listarProdutos());

  subseparador('Cadastrando um novo produto no catálogo');
  const novoProduto = cadastrarProduto({
    id: 6,
    nome: 'Microfone Condensador USB',
    categoria: 'Áudio',
    preco: 280.0,
    estoque: 10
  });
  console.log('✅ Produto cadastrado com sucesso:', novoProduto);

  subseparador('Buscando produtos por nome parcial ("Micro")');
  const buscaNome = buscarProdutosPorNome('Micro');
  console.log('Resultado da busca:', buscaNome);

  subseparador('Filtrando produtos por categoria ("Periféricos")');
  const perifericos = filtrarProdutosPorCategoria('Periféricos');
  console.table(perifericos);

  subseparador('Atualizando preço de um produto existente (ID 1)');
  const produtoAtualizado = atualizarProduto(1, { preco: 239.9 });
  console.log('✅ Produto atualizado:', produtoAtualizado);

  // =========================================================================
  // 2. CADASTRO E CONSULTA DE CLIENTES
  // =========================================================================
  separador('2. CLIENTES');

  console.log('Clientes cadastrados inicialmente (mínimo de 3):');
  console.table(listarClientes());

  subseparador('Cadastrando um novo cliente');
  const novoCliente = cadastrarCliente({
    id: 4,
    nome: 'Mariana Silva Costa',
    email: 'mariana.costa@exemplo.com'
  });
  console.log('✅ Novo cliente cadastrado com sucesso:', novoCliente);

  subseparador('Buscando cliente pelo ID 1');
  const clienteEncontrado = buscarClientePorId(1);
  console.log('Cliente encontrado:', clienteEncontrado);

  // =========================================================================
  // 3. OPERAÇÕES DO CARRINHO DE COMPRAS
  // =========================================================================
  separador('3. CARRINHO DE COMPRAS');

  console.log('Adicionando itens ao carrinho:');
  adicionarAoCarrinho(1, 2); // 2 Teclados Mecânicos (R$ 239.90 cada)
  console.log('• Adicionado: 2 unidades do Produto ID 1');

  adicionarAoCarrinho(2, 1); // 1 Mouse Gamer (R$ 180.00)
  console.log('• Adicionado: 1 unidade do Produto ID 2');

  subseparador('Adicionando o mesmo produto novamente para testar incremento');
  adicionarAoCarrinho(1, 1); // Deve somar para 3 unidades do Produto ID 1
  console.log('• Adicionado +1 unidade do Produto ID 1. Verificando carrinho consolidado:');
  console.table(listarItensDoCarrinho());

  subseparador('Alterando a quantidade do produto ID 2 no carrinho para 2 unidades');
  alterarQuantidadeNoCarrinho(2, 2);
  console.table(listarItensDoCarrinho());

  const totalCarrinho = calcularTotalDoCarrinho();
  console.log(`💰 Valor Total do Carrinho: R$ ${totalCarrinho.toFixed(2)}`);

  // =========================================================================
  // 4. FINALIZAÇÃO DE PEDIDO E ATUALIZAÇÃO DE ESTOQUE
  // =========================================================================
  separador('4. FINALIZAÇÃO DE PEDIDOS & ESTOQUE');

  const prod1Antes = buscarProdutoPorId(1);
  const prod2Antes = buscarProdutoPorId(2);
  console.log('Estoque ANTES do fechamento do pedido:');
  console.log(`• ${prod1Antes?.nome}: ${prod1Antes?.estoque} unidades`);
  console.log(`• ${prod2Antes?.nome}: ${prod2Antes?.estoque} unidades`);

  subseparador('Finalizando pedido para o Cliente ID 1 (Lucas Cachoeira Werner)');
  const pedidoRealizado = finalizarPedido(1);
  console.log('🎉 Pedido realizado com sucesso!');
  console.log(`• Pedido ID: ${pedidoRealizado.id}`);
  console.log(`• Data: ${pedidoRealizado.data.toLocaleString('pt-BR')}`);
  console.log(`• Total Pago: R$ ${pedidoRealizado.total.toFixed(2)}`);
  console.log('• Itens com preços congelados:');
  console.table(pedidoRealizado.itens);

  console.log('\nEstoque DEPOIS do fechamento do pedido:');
  const prod1Depois = buscarProdutoPorId(1);
  const prod2Depois = buscarProdutoPorId(2);
  console.log(`• ${prod1Depois?.nome}: ${prod1Depois?.estoque} unidades (Deduzidas 3 un)`);
  console.log(`• ${prod2Depois?.nome}: ${prod2Depois?.estoque} unidades (Deduzidas 2 un)`);

  subseparador('Consultando pedidos registrados para o Cliente ID 1');
  const pedidosCliente1 = buscarPedidosPorCliente(1);
  console.log(`Total de pedidos do cliente: ${pedidosCliente1.length}`);

  // =========================================================================
  // 5. DEMONSTRAÇÃO DE TESTES DE SITUAÇÕES INVÁLIDAS (REQUISITO AVALIATIVO)
  // =========================================================================
  separador('5. TESTE DE SITUAÇÕES INVÁLIDAS / TRATAMENTO DE ERROS');
  console.log('Demonstrando a resiliência do sistema e validações de regras de negócio:\n');

  // Caso 1: Tentar cadastrar produto com preço negativo
  try {
    console.log('▶ Teste 1: Tentar cadastrar produto com preço negativo:');
    cadastrarProduto({
      id: 99,
      nome: 'Produto Inválido',
      categoria: 'Teste',
      preco: -49.9,
      estoque: 10
    });
  } catch (error: any) {
    console.log('❌ Validação disparada com sucesso:', error.message);
  }

  // Caso 2: Tentar adicionar ao carrinho quantidade superior ao estoque
  try {
    console.log('\n▶ Teste 2: Tentar adicionar ao carrinho quantidade superior ao estoque:');
    const cadeira = buscarProdutoPorId(5); // Cadeira tem 5 un
    console.log(`(Estoque atual de "${cadeira?.nome}": ${cadeira?.estoque} unidades)`);
    adicionarAoCarrinho(5, 50); // Tentando pedir 50
  } catch (error: any) {
    console.log('❌ Validação disparada com sucesso:', error.message);
  }

  // Caso 3: Tentar finalizar pedido com carrinho vazio
  try {
    console.log('\n▶ Teste 3: Tentar finalizar compra com carrinho vazio:');
    // O carrinho foi esvaziado pelo pedido anterior
    finalizarPedido(1);
  } catch (error: any) {
    console.log('❌ Validação disparada com sucesso:', error.message);
  }

  // Caso 4: Tentar cadastrar cliente com e-mail duplicado
  try {
    console.log('\n▶ Teste 4: Tentar cadastrar cliente com e-mail já existente:');
    cadastrarCliente({
      id: 99,
      nome: 'Outro Lucas',
      email: 'lucas.werner@exemplo.com' // E-mail já utilizado pelo cliente 1
    });
  } catch (error: any) {
    console.log('❌ Validação disparada com sucesso:', error.message);
  }

  // =========================================================================
  // 6. APRESENTAÇÃO DE RELATÓRIOS CONSOLIDADOS
  // =========================================================================
  separador('6. RELATÓRIOS DO SISTEMA');
  exibirRelatorioConsolidado();

  console.log('\n✅ DEMONSTRAÇÃO CONCLUÍDA COM SUCESSO!');
}

executarDemonstracao();
