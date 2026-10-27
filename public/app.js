/**
 * Lógica da Interface Web (Cal.com Style)
 * Consome e aplica as regras do motor de E-Commerce
 */

// Estado da aplicação (em memória, alinhado com o backend Node)
const state = {
  produtos: [
    { id: 1, nome: 'Teclado Mecânico RGB', categoria: 'Periféricos', preco: 250.0, estoque: 15 },
    { id: 2, nome: 'Mouse Gamer 16000 DPI', categoria: 'Periféricos', preco: 180.0, estoque: 20 },
    { id: 3, nome: 'Monitor UltraWide 29"', categoria: 'Monitores', preco: 1200.0, estoque: 8 },
    { id: 4, nome: 'Headset Wireless 7.1', categoria: 'Áudio', preco: 350.0, estoque: 12 },
    { id: 5, nome: 'Cadeira Ergonômica', categoria: 'Mobiliário', preco: 950.0, estoque: 5 }
  ],
  clientes: [
    { id: 1, nome: 'Lucas Cachoeira Werner', email: 'lucas.werner@exemplo.com' },
    { id: 2, nome: 'Beatriz Almeida Santos', email: 'beatriz.santos@exemplo.com' },
    { id: 3, nome: 'Carlos Eduardo Pereira', email: 'carlos.pereira@exemplo.com' }
  ],
  carrinho: [],
  pedidos: [],
  clienteSelecionadoId: 1,
  proximoIdPedido: 1
};

// ==========================================
// TOAST NOTIFICATIONS (ESTILO SONNER/CAL.COM)
// ==========================================
function mostrarToast(mensagem, tipo = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast toast-${tipo}`;
  
  const icon = tipo === 'success' ? '✅' : tipo === 'error' ? '❌' : 'ℹ️';
  toast.innerHTML = `<span>${icon}</span> <span>${mensagem}</span>`;
  
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.2s ease';
    setTimeout(() => toast.remove(), 200);
  }, 4000);
}

// ==========================================
// FUNÇÕES DE REGRAS DE NEGÓCIO (PRODUTOS)
// ==========================================
function cadastrarNovoProduto(novo) {
  if (!novo.nome || novo.nome.trim() === '') {
    throw new Error('O nome do produto não pode estar vazio.');
  }
  if (novo.preco <= 0) {
    throw new Error('O preço do produto deve ser maior que zero.');
  }
  if (novo.estoque < 0) {
    throw new Error('O estoque não pode ser negativo.');
  }
  if (state.produtos.some(p => p.id === novo.id)) {
    throw new Error(`Já existe um produto com o ID ${novo.id}.`);
  }
  state.produtos.push(novo);
  renderizarCatalogo();
  renderizarMetricas();
  return novo;
}

function filtrarProdutos() {
  const busca = document.getElementById('inputBusca').value.trim().toLowerCase();
  const categoria = document.getElementById('selectCategoria').value;
  
  return state.produtos.filter(p => {
    const atendeNome = p.nome.toLowerCase().includes(busca);
    const atendeCategoria = categoria === 'todas' || p.categoria === categoria;
    return atendeNome && atendeCategoria;
  });
}

function renderizarCatalogo() {
  const grid = document.getElementById('productGrid');
  const produtosFiltrados = filtrarProdutos();
  grid.innerHTML = '';

  if (produtosFiltrados.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 3rem;">Nenhum produto encontrado para estes filtros.</div>`;
    return;
  }

  produtosFiltrados.forEach(produto => {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    let estoqueClass = 'in-stock';
    let estoqueTexto = `${produto.estoque} em estoque`;
    if (produto.estoque === 0) {
      estoqueClass = 'out-stock';
      estoqueTexto = 'Sem estoque';
    } else if (produto.estoque <= 5) {
      estoqueClass = 'low-stock';
      estoqueTexto = `Apenas ${produto.estoque} restantes`;
    }

    card.innerHTML = `
      <div class="product-card-top">
        <span class="category-tag">${produto.categoria}</span>
        <span class="stock-tag ${estoqueClass}">${estoqueTexto}</span>
      </div>
      <h3 class="product-name">${produto.nome}</h3>
      <div class="product-price-row">
        <div>
          <span style="font-size:0.75rem; color:var(--text-muted); display:block;">Preço unitário</span>
          <span class="product-price">R$ ${produto.preco.toFixed(2)}</span>
        </div>
        <div class="product-actions">
          <button class="btn-primary btn-sm" onclick="adicionarProduto(${produto.id})" ${produto.estoque === 0 ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}>
            + Carrinho
          </button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// ==========================================
// FUNÇÕES DE REGRAS DE NEGÓCIO (CLIENTES)
// ==========================================
function renderizarClientes() {
  const tbody = document.getElementById('clientesTableBody');
  const select = document.getElementById('selectClienteAtivo');
  
  tbody.innerHTML = '';
  select.innerHTML = '';

  state.clientes.forEach(cliente => {
    // Tabela
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="table-cell-bold">#${cliente.id}</td>
      <td class="table-cell-bold">${cliente.nome}</td>
      <td>${cliente.email}</td>
      <td><span class="category-tag">Ativo</span></td>
    `;
    tbody.appendChild(tr);

    // Select na Topbar
    const opt = document.createElement('option');
    opt.value = cliente.id;
    opt.textContent = `${cliente.nome} (#${cliente.id})`;
    if (cliente.id === state.clienteSelecionadoId) opt.selected = true;
    select.appendChild(opt);
  });
}

function cadastrarNovoCliente(nome, email) {
  if (!nome || nome.trim() === '') {
    throw new Error('O nome do cliente não pode estar vazio.');
  }
  if (!email || email.trim() === '') {
    throw new Error('O e-mail do cliente não pode estar vazio.');
  }
  if (state.clientes.some(c => c.email.toLowerCase() === email.trim().toLowerCase())) {
    throw new Error(`O e-mail "${email}" já está cadastrado para outro cliente.`);
  }

  const novoId = state.clientes.length > 0 ? Math.max(...state.clientes.map(c => c.id)) + 1 : 1;
  const novo = { id: novoId, nome: nome.trim(), email: email.trim() };
  state.clientes.push(novo);
  renderizarClientes();
  return novo;
}

// ==========================================
// FUNÇÕES DE REGRAS DE NEGÓCIO (CARRINHO)
// ==========================================
function adicionarProduto(produtoId, quantidade = 1) {
  try {
    const produto = state.produtos.find(p => p.id === produtoId);
    if (!produto) throw new Error('Produto inexistente.');
    
    if (quantidade <= 0) {
      throw new Error('A quantidade deve ser maior que zero.');
    }

    const itemExistente = state.carrinho.find(i => i.produtoId === produtoId);
    const qtdTotal = (itemExistente ? itemExistente.quantidade : 0) + quantidade;

    if (qtdTotal > produto.estoque) {
      throw new Error(`Quantidade solicitada (${qtdTotal}) excede o estoque disponível (${produto.estoque}) de "${produto.nome}".`);
    }

    if (itemExistente) {
      itemExistente.quantidade = qtdTotal;
    } else {
      state.carrinho.push({ produtoId, quantidade });
    }

    atualizarCarrinho();
    mostrarToast(`Adicionado: ${produto.nome}`, 'success');
  } catch (err) {
    mostrarToast(err.message, 'error');
  }
}

function alterarQuantidade(produtoId, delta) {
  const item = state.carrinho.find(i => i.produtoId === produtoId);
  const produto = state.produtos.find(p => p.id === produtoId);
  if (!item || !produto) return;

  const novaQtd = item.quantidade + delta;
  if (novaQtd <= 0) {
    removerDoCarrinho(produtoId);
    return;
  }
  if (novaQtd > produto.estoque) {
    mostrarToast(`Estoque máximo atingido (${produto.estoque} un)`, 'error');
    return;
  }
  item.quantidade = novaQtd;
  atualizarCarrinho();
}

function removerDoCarrinho(produtoId) {
  const index = state.carrinho.findIndex(i => i.produtoId === produtoId);
  if (index !== -1) {
    state.carrinho.splice(index, 1);
    atualizarCarrinho();
    mostrarToast('Item removido do carrinho.', 'info');
  }
}

function calcularTotalCarrinho() {
  return state.carrinho.reduce((acc, item) => {
    const prod = state.produtos.find(p => p.id === item.produtoId);
    return acc + (prod ? prod.preco * item.quantidade : 0);
  }, 0);
}

function atualizarCarrinho() {
  const totalItens = state.carrinho.reduce((acc, i) => acc + i.quantidade, 0);
  document.getElementById('cartCountBadge').textContent = totalItens;
  
  const drawerBody = document.getElementById('drawerCartBody');
  const drawerFooter = document.getElementById('drawerCartFooter');

  if (state.carrinho.length === 0) {
    drawerBody.innerHTML = `
      <div class="cart-empty-message">
        <div style="font-size:2.5rem; margin-bottom:0.75rem;">🛒</div>
        Seu carrinho está vazio.<br/>Adicione produtos do catálogo para começar.
      </div>
    `;
    drawerFooter.style.display = 'none';
    return;
  }

  drawerFooter.style.display = 'flex';
  drawerBody.innerHTML = '';

  state.carrinho.forEach(item => {
    const prod = state.produtos.find(p => p.id === item.produtoId);
    if (!prod) return;
    const subtotal = prod.preco * item.quantidade;

    const div = document.createElement('div');
    div.className = 'cart-item-card';
    div.innerHTML = `
      <div class="cart-item-top">
        <div>
          <div class="cart-item-title">${prod.nome}</div>
          <div class="cart-item-price">R$ ${prod.preco.toFixed(2)} cada</div>
        </div>
        <button class="btn-remove-item" onclick="removerDoCarrinho(${prod.id})">Remover</button>
      </div>
      <div class="cart-item-bottom">
        <div class="qty-control">
          <button class="qty-btn" onclick="alterarQuantidade(${prod.id}, -1)">-</button>
          <span class="qty-val">${item.quantidade}</span>
          <button class="qty-btn" onclick="alterarQuantidade(${prod.id}, 1)">+</button>
        </div>
        <span class="cart-item-subtotal">R$ ${subtotal.toFixed(2)}</span>
      </div>
    `;
    drawerBody.appendChild(div);
  });

  const total = calcularTotalCarrinho();
  document.getElementById('cartTotalDisplay').textContent = `R$ ${total.toFixed(2)}`;
}

// ==========================================
// FINALIZAÇÃO DE PEDIDOS & TRANSAÇÃO ATÔMICA
// ==========================================
function realizarCheckout() {
  try {
    const cliente = state.clientes.find(c => c.id === state.clienteSelecionadoId);
    if (!cliente) throw new Error('Cliente selecionado inválido.');

    if (state.carrinho.length === 0) {
      throw new Error('Não é possível finalizar compra com carrinho vazio.');
    }

    // 1. Verificação prévia de estoque (consistência atômica)
    for (const item of state.carrinho) {
      const prod = state.produtos.find(p => p.id === item.produtoId);
      if (!prod || prod.estoque < item.quantidade) {
        throw new Error(`Estoque insuficiente para "${prod ? prod.nome : 'Produto'}". Transação cancelada.`);
      }
    }

    // 2. Debita estoque e congela histórico
    const itensPedido = state.carrinho.map(item => {
      const prod = state.produtos.find(p => p.id === item.produtoId);
      prod.estoque -= item.quantidade;
      return {
        produtoId: prod.id,
        nome: prod.nome,
        precoUnitario: prod.preco,
        quantidade: item.quantidade,
        subtotal: prod.preco * item.quantidade
      };
    });

    const totalPedido = itensPedido.reduce((acc, i) => acc + i.subtotal, 0);

    const novoPedido = {
      id: state.proximoIdPedido++,
      clienteId: cliente.id,
      clienteNome: cliente.nome,
      itens: itensPedido,
      total: totalPedido,
      data: new Date()
    };

    state.pedidos.unshift(novoPedido);
    state.carrinho = [];

    atualizarCarrinho();
    renderizarCatalogo();
    renderizarPedidos();
    renderizarMetricas();
    fecharCarrinho();

    mostrarToast(`🎉 Pedido #${novoPedido.id} concluído com sucesso! Total: R$ ${totalPedido.toFixed(2)}`, 'success');
  } catch (err) {
    mostrarToast(err.message, 'error');
  }
}

function renderizarPedidos() {
  const tbody = document.getElementById('pedidosTableBody');
  tbody.innerHTML = '';

  if (state.pedidos.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 2.5rem; color: var(--text-muted);">Nenhum pedido realizado ainda.</td></tr>`;
    return;
  }

  state.pedidos.forEach(p => {
    const tr = document.createElement('tr');
    const resumoItens = p.itens.map(i => `${i.quantidade}x ${i.nome}`).join(', ');
    tr.innerHTML = `
      <td class="table-cell-bold">#${p.id}</td>
      <td class="table-cell-bold">${p.clienteNome}</td>
      <td><span style="font-size:0.8rem; color:var(--text-secondary);">${resumoItens}</span></td>
      <td class="table-cell-bold" style="color:var(--text-primary);">R$ ${p.total.toFixed(2)}</td>
      <td>${p.data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</td>
    `;
    tbody.appendChild(tr);
  });
}

// ==========================================
// MÉTRICAS E INDICADORES (RELATÓRIOS)
// ==========================================
function renderizarMetricas() {
  const totalPedidos = state.pedidos.length;
  const faturamentoTotal = state.pedidos.reduce((acc, p) => acc + p.total, 0);
  const ticketMedio = totalPedidos > 0 ? faturamentoTotal / totalPedidos : 0;
  const totalItens = state.pedidos.reduce((acc, p) => acc + p.itens.reduce((s, i) => s + i.quantidade, 0), 0);
  const produtosCriticos = state.produtos.filter(p => p.estoque <= 5);

  document.getElementById('metricFaturamento').textContent = `R$ ${faturamentoTotal.toFixed(2)}`;
  document.getElementById('metricPedidos').textContent = totalPedidos;
  document.getElementById('metricTicket').textContent = `R$ ${ticketMedio.toFixed(2)}`;
  document.getElementById('metricItens').textContent = `${totalItens} un`;

  const alertaDiv = document.getElementById('alertEstoqueCritico');
  if (produtosCriticos.length === 0) {
    alertaDiv.innerHTML = `<span style="color:var(--badge-green-text); font-weight:600;">✅ Todos os produtos possuem estoque saudável (> 5 unidades).</span>`;
  } else {
    const listHtml = produtosCriticos.map(p => `<strong>${p.nome}</strong> (${p.estoque} un restantes)`).join(', ');
    alertaDiv.innerHTML = `⚠️ <strong>Estoque Crítico ($\le 5$ un):</strong> ${listHtml}`;
  }
}

// ==========================================
// TEST PLAYGROUND (VALIDAÇÕES OBRIGATÓRIAS)
// ==========================================
window.testarPrecoNegativo = function() {
  const resultEl = document.getElementById('resTest1');
  try {
    cadastrarNovoProduto({
      id: 999,
      nome: 'Mouse Inválido',
      categoria: 'Teste',
      preco: -49.90,
      estoque: 10
    });
    resultEl.textContent = 'Falha: cadastrou produto com preço negativo!';
  } catch (err) {
    resultEl.innerHTML = `<span style="color:var(--badge-green-text);">✅ Validação interceptada:</span><br/>${err.message}`;
    mostrarToast(err.message, 'error');
  }
};

window.testarExcessoEstoque = function() {
  const resultEl = document.getElementById('resTest2');
  try {
    adicionarProduto(5, 50); // Cadeira tem apenas 5
    resultEl.textContent = 'Falha: adicionou mais que o estoque!';
  } catch (err) {
    resultEl.innerHTML = `<span style="color:var(--badge-green-text);">✅ Validação interceptada:</span><br/>${err.message}`;
  }
};

window.testarCarrinhoVazio = function() {
  const resultEl = document.getElementById('resTest3');
  try {
    if (state.carrinho.length > 0) state.carrinho = [];
    atualizarCarrinho();
    realizarCheckout();
    resultEl.textContent = 'Falha: finalizou com carrinho vazio!';
  } catch (err) {
    resultEl.innerHTML = `<span style="color:var(--badge-green-text);">✅ Validação interceptada:</span><br/>${err.message}`;
  }
};

window.testarEmailDuplicado = function() {
  const resultEl = document.getElementById('resTest4');
  try {
    cadastrarNovoCliente('Outro Usuário', 'lucas.werner@exemplo.com');
    resultEl.textContent = 'Falha: permitiu e-mail duplicado!';
  } catch (err) {
    resultEl.innerHTML = `<span style="color:var(--badge-green-text);">✅ Validação interceptada:</span><br/>${err.message}`;
    mostrarToast(err.message, 'error');
  }
};

// ==========================================
// NAVEGAÇÃO ENTRE ABAS
// ==========================================
function setupTabs() {
  const tabs = document.querySelectorAll('.nav-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      
      tab.classList.add('active');
      const targetPanel = document.getElementById(tab.dataset.target);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });
}

// Drawer Controls
function abrirCarrinho() {
  document.getElementById('drawerCart').classList.add('open');
}

function fecharCarrinho() {
  document.getElementById('drawerCart').classList.remove('open');
}

// Modal Controls
function abrirModalProduto() {
  document.getElementById('modalProduto').classList.add('open');
}

function fecharModalProduto() {
  document.getElementById('modalProduto').classList.remove('open');
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  setupTabs();
  renderizarClientes();
  renderizarCatalogo();
  atualizarCarrinho();
  renderizarPedidos();
  renderizarMetricas();

  // Event Listeners
  document.getElementById('btnOpenCart').addEventListener('click', abrirCarrinho);
  document.getElementById('btnCloseCart').addEventListener('click', fecharCarrinho);
  document.getElementById('drawerCart').addEventListener('click', (e) => {
    if (e.target.id === 'drawerCart') fecharCarrinho();
  });

  document.getElementById('btnCheckout').addEventListener('click', realizarCheckout);

  document.getElementById('selectClienteAtivo').addEventListener('change', (e) => {
    state.clienteSelecionadoId = Number(e.target.value);
    const cliente = state.clientes.find(c => c.id === state.clienteSelecionadoId);
    mostrarToast(`Cliente ativo alterado para: ${cliente.nome}`, 'info');
  });

  document.getElementById('inputBusca').addEventListener('input', renderizarCatalogo);
  document.getElementById('selectCategoria').addEventListener('change', renderizarCatalogo);

  // Form Produto
  document.getElementById('formNovoProduto').addEventListener('submit', (e) => {
    e.preventDefault();
    try {
      const nome = document.getElementById('novoProdNome').value;
      const categoria = document.getElementById('novoProdCat').value;
      const preco = parseFloat(document.getElementById('novoProdPreco').value);
      const estoque = parseInt(document.getElementById('novoProdEstoque').value, 10);
      const novoId = Math.max(...state.produtos.map(p => p.id)) + 1;

      cadastrarNovoProduto({ id: novoId, nome, categoria, preco, estoque });
      fecharModalProduto();
      e.target.reset();
      mostrarToast(`Produto "${nome}" cadastrado com sucesso!`, 'success');
    } catch (err) {
      mostrarToast(err.message, 'error');
    }
  });

  // Form Cliente
  document.getElementById('formNovoCliente').addEventListener('submit', (e) => {
    e.preventDefault();
    try {
      const nome = document.getElementById('novoCliNome').value;
      const email = document.getElementById('novoCliEmail').value;
      cadastrarNovoCliente(nome, email);
      e.target.reset();
      mostrarToast(`Cliente "${nome}" cadastrado com sucesso!`, 'success');
    } catch (err) {
      mostrarToast(err.message, 'error');
    }
  });
});
