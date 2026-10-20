import { pedidos } from './pedidos';
import { produtos } from './produtos';
import { ResumoFinanceiro } from './types';

/**
 * Calcula os principais indicadores financeiros e de volume de vendas.
 */
export function obterResumoFinanceiro(): ResumoFinanceiro {
  const totalPedidos = pedidos.length;

  const faturamentoTotal = pedidos.reduce((acc, pedido) => acc + pedido.total, 0);

  const totalItensVendidos = pedidos.reduce((acc, pedido) => {
    const itensNestePedido = pedido.itens.reduce((soma, item) => soma + item.quantidade, 0);
    return acc + itensNestePedido;
  }, 0);

  const ticketMedio = totalPedidos > 0 ? faturamentoTotal / totalPedidos : 0;

  return {
    totalPedidos,
    faturamentoTotal: Number(faturamentoTotal.toFixed(2)),
    ticketMedio: Number(ticketMedio.toFixed(2)),
    totalItensVendidos
  };
}

/**
 * Retorna os produtos que estão com estoque baixo (menor ou igual ao limite especificado).
 */
export function obterProdutosComEstoqueBaixo(limite: number = 5) {
  return produtos.filter((p) => p.estoque <= limite);
}

/**
 * Exibe o relatório consolidado de vendas e estoque no terminal.
 */
export function exibirRelatorioConsolidado(): void {
  const resumo = obterResumoFinanceiro();
  const produtosAlerta = obterProdutosComEstoqueBaixo(5);

  console.log('='.repeat(60));
  console.log('          📊 RELATÓRIO CONSOLIDADO DE VENDAS E ESTOQUE');
  console.log('='.repeat(60));
  console.log(`• Total de Pedidos Concluídos : ${resumo.totalPedidos}`);
  console.log(`• Total de Itens Comercializados: ${resumo.totalItensVendidos} un`);
  console.log(`• Faturamento Total           : R$ ${resumo.faturamentoTotal.toFixed(2)}`);
  console.log(`• Ticket Médio por Pedido     : R$ ${resumo.ticketMedio.toFixed(2)}`);
  console.log('-'.repeat(60));

  console.log('⚠️ Alerta de Estoque Crítico (<= 5 unidades):');
  if (produtosAlerta.length === 0) {
    console.log('  Nenhum produto em nível crítico de estoque no momento.');
  } else {
    produtosAlerta.forEach((p) => {
      console.log(`  - [ID ${p.id}] ${p.nome} | Restam apenas ${p.estoque} un | R$ ${p.preco.toFixed(2)}`);
    });
  }
  console.log('='.repeat(60));
}
