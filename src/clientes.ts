import { Cliente } from './types';

// Coleção de clientes em memória (inicia com pelo menos 3 clientes conforme exigido)
export const clientes: Cliente[] = [
  { id: 1, nome: 'Lucas Cachoeira Werner', email: 'lucas.werner@exemplo.com' },
  { id: 2, nome: 'Beatriz Almeida Santos', email: 'beatriz.santos@exemplo.com' },
  { id: 3, nome: 'Carlos Eduardo Pereira', email: 'carlos.pereira@exemplo.com' }
];

/**
 * Cadastra um novo cliente no sistema após validações.
 */
export function cadastrarCliente(novoCliente: Cliente): Cliente {
  if (!novoCliente.id || novoCliente.id <= 0) {
    throw new Error('Identificador do cliente inválido. Deve ser um número positivo.');
  }

  if (!novoCliente.nome || novoCliente.nome.trim() === '') {
    throw new Error('O nome do cliente não pode estar vazio.');
  }

  if (!novoCliente.email || novoCliente.email.trim() === '') {
    throw new Error('O e-mail do cliente não pode estar vazio.');
  }

  // Validação simples de formato de e-mail
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(novoCliente.email.trim())) {
    throw new Error('Formato de e-mail inválido.');
  }

  const idExistente = clientes.some((c) => c.id === novoCliente.id);
  if (idExistente) {
    throw new Error(`Já existe um cliente cadastrado com o ID ${novoCliente.id}.`);
  }

  const emailExistente = clientes.some(
    (c) => c.email.toLowerCase() === novoCliente.email.trim().toLowerCase()
  );
  if (emailExistente) {
    throw new Error(`O e-mail "${novoCliente.email}" já está cadastrado para outro cliente.`);
  }

  const clienteFormatado: Cliente = {
    id: novoCliente.id,
    nome: novoCliente.nome.trim(),
    email: novoCliente.email.trim().toLowerCase()
  };

  clientes.push(clienteFormatado);
  return clienteFormatado;
}

/**
 * Retorna todos os clientes cadastrados.
 */
export function listarClientes(): Cliente[] {
  return [...clientes];
}

/**
 * Busca um cliente pelo seu ID.
 */
export function buscarClientePorId(id: number): Cliente | undefined {
  return clientes.find((c) => c.id === id);
}
