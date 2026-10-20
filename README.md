# Sistema de Gerenciamento de E-Commerce em TypeScript

**Projeto Avaliativo** — Módulo 1 - Semana 07 (Desenvolvedor Back-End Node [T6])  
**Estudante:** Lucas Cachoeira Werner  
**Turma:** Turma 6 Ciclo 2  
**Repositório:** `Miniprojeto_Ecommerce_LucasWerner_Turma6`

---

## 📌 1. Objetivo da Aplicação

O objetivo desta aplicação é gerenciar as operações comerciais essenciais de uma loja virtual, abrangendo o controle do catálogo de produtos, gerenciamento de clientes, manipulação do carrinho de compras e registro transacional de pedidos com consolidação de relatórios.

O sistema foi desenvolvido utilizando **TypeScript** e executado no ambiente **Node.js**, aplicando conceitos de programação modular, tipagem estrita de dados, métodos de alta ordem para coleções em memória (`map`, `filter`, `reduce`, `find`, `some`) e consistência nas regras de negócio.

---

## 🛠️ 2. Tecnologias Utilizadas

- **Runtime:** [Node.js](https://nodejs.org/) (v18+)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/) (v5.7+)
- **Transpilador:** `tsc` (TypeScript Compiler)
- **Executor de Desenvolvimento:** `tsx`
- **Tipagens do Node:** `@types/node`

---

## 🚀 3. Funcionalidades Implementadas

### A. Gerenciamento de Produtos (`src/produtos.ts`)
- Cadastrar novos produtos com validação de unicidade de ID e consistência de valores.
- Listar todos os produtos em catálogo.
- Buscar produto por ID único.
- Buscar produtos por termo no nome (busca parcial insensível a maiúsculas/minúsculas).
- Filtrar produtos por categoria.
- Atualizar atributos (nome, categoria, preço e estoque) com validações.
- Remover produtos do catálogo.
- Atualização atômica de estoque na finalização de compras.

### B. Gestão de Clientes (`src/clientes.ts`)
- Inicia previamente com **3 clientes pré-cadastrados** para testes imediatos.
- Cadastrar novos clientes com validação de nome, e-mail e formato.
- Impedir duplicidade de ID ou de e-mail.
- Listar clientes cadastrados.
- Buscar cliente por ID.

### C. Carrinho de Compras (`src/carrinho.ts`)
- Adicionar produtos ao carrinho. Se o produto já estiver inserido, sua quantidade é somada automaticamente em vez de duplicar itens.
- Bloquear quantidades $\le 0$ ou solicitações maiores que o estoque disponível.
- Alterar quantidade de itens presentes no carrinho.
- Remover item do carrinho.
- Listagem detalhada dos itens com enriquecimento dos dados do catálogo.
- Cálculo de subtotal por item (`preço * quantidade`) e total consolidado do carrinho (`reduce`).
- Esvaziamento seguro após conclusão da compra.

### D. Finalização e Histórico de Pedidos (`src/pedidos.ts`)
- Validação atômica/consistente de compra: se faltar estoque para qualquer item ou se o cliente não existir, **a compra é abortada e nenhum estoque é debitado**.
- Congelamento dos preços históricos: armazena o preço vigente no momento exato da compra, garantindo que reajustes futuros no catálogo não afetem pedidos anteriores.
- Dedução automática e definitiva das unidades do estoque dos produtos.
- Geração de identificador sequencial único para o pedido.
- Consulta geral de pedidos e filtro de pedidos por cliente.

### E. Relatórios e Indicadores (`src/relatorios.ts`)
- Cálculo do total de pedidos realizados e faturamento bruto acumulado.
- Cálculo do ticket médio por pedido e total de itens comercializados.
- Alerta automático de estoque crítico ($\le 5$ unidades).

---

## 📂 4. Estrutura do Projeto

```text
Miniprojeto_Ecommerce_LucasWerner_Turma6/
├── src/
│   ├── types.ts          # Interfaces e contratos de dados
│   ├── produtos.ts       # Módulo de catálogo e estoque
│   ├── clientes.ts       # Módulo de clientes
│   ├── carrinho.ts       # Operações do carrinho e cálculos de valores
│   ├── pedidos.ts        # Finalização transacional e histórico de pedidos
│   ├── relatorios.ts     # Funções de consolidação e métricas
│   └── main.ts           # Ponto de entrada com fluxo demonstrativo e testes de erro
├── dist/                 # Código JavaScript gerado pelo compilador TypeScript
├── package.json          # Metadados e scripts de execução
├── tsconfig.json         # Configurações do compilador TypeScript
├── .gitignore            # Arquivos ignorados pelo controle de versão
└── README.md             # Documentação técnica do projeto
```

---

## ⚙️ 5. Instruções de Instalação, Compilação e Execução

### Pré-requisitos
Ter o **Node.js** e o **npm** instalados na sua máquina.

### Passo 1: Instalar dependências
No terminal, dentro da pasta do projeto, execute:
```bash
npm install
```

### Passo 2: Compilar o código TypeScript
Para transpilar os arquivos `.ts` da pasta `src/` para JavaScript na pasta `dist/`:
```bash
npm run build
```

### Passo 3: Executar a aplicação compilada
Para executar a aplicação com o Node.js:
```bash
npm start
```

*(Opcional) Execução direta em modo desenvolvimento:*
```bash
npm run dev
```

---

## 🧪 6. Demonstração e Testes de Situações Inválidas

Ao executar `npm start` ou `npm run dev`, o script [main.ts](src/main.ts) executa automaticamente o fluxo completo e apresenta saídas formatadas no terminal.

O arquivo demonstra com clareza o tratamento de erros e validação em **4 situações inválidas**:
1. **Tentativa de cadastrar produto com preço negativo ou $\le 0$** $\rightarrow$ Dispara exceção informativa e impede inclusão.
2. **Tentativa de adicionar ao carrinho quantidade superior ao estoque** $\rightarrow$ Dispara erro informando a quantidade requisitada versus o saldo atual em estoque.
3. **Tentativa de finalizar compra com carrinho vazio** $\rightarrow$ Validação impede a geração de pedido sem itens.
4. **Tentativa de cadastrar cliente com e-mail duplicado** $\rightarrow$ Bloqueio garantindo a unicidade de contato.

---

## ⚖️ 7. Regras de Negócio Implementadas

1. **Unicidade de Identificadores:** Nenhum produto, cliente ou pedido pode compartilhar o mesmo `id`.
2. **Preço e Estoque Válidos:** O preço deve ser estritamente maior que zero (`preco > 0`) e o estoque não pode ser negativo (`estoque >= 0`).
3. **Consistência do Carrinho:** Não é permitida a adição de itens com quantidade nula ou negativa, nem que ultrapassem a disponibilidade física do produto.
4. **Agrupamento de Itens:** Adicionar um item já existente no carrinho resulta na soma das quantidades, evitando duplicidade de linhas.
5. **Transacionalidade Atômica:** Se qualquer item de uma compra não puder ser atendido integralmente, o pedido é rejeitado sem deduzir estoque de outros produtos do pedido.
6. **Imutabilidade de Preços:** O valor registrado no pedido é congelado na data da compra, mantendo a fidelidade contábil mesmo se o catálogo for reajustado posteriormente.

---

## ⚠️ 8. Limitações Conhecidas do Sistema

- **Persistência em Memória:** Os dados existem enquanto a aplicação está em execução no processo Node.js. Ao encerrar o processo, o catálogo e os pedidos retornam ao estado inicial.
- **Ambiente Single-Thread:** O controle de concorrência é gerenciado sincronicamente pela fila de eventos do Node.js, sem travas distribuídas.
- **Interface Console:** A interação é realizada via terminal (`console.table`, `console.log`), sem interface gráfica ou rotas HTTP/REST (conforme as diretrizes e escopo do mini-projeto).
