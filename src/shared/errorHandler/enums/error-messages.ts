export const errorMessages = {
  NOT_FOUND: (resource: string) => `${resource} não encontrado.`,
  INVALID_ID: (id: string) => `Id inválido: ${id}`,
  BAD_REQUEST: (reason?: string) => (reason ? reason : "Requisição inválida"),
  RESOURCE_CONFLICT: (resource: string) => `${resource} já existente.`,
  /** Estoque insuficiente para concluir a compra (qtd_atual = 0). */
  INSUFFICIENT_STOCK: (item: string) =>
    `Estoque insuficiente para "${item}". Não há unidades disponíveis para compra.`,
  INTERNAL_SERVER_ERROR: "Erro interno do servidor.",
  SERVICE_UNAVAILABLE: "Serviço indisponível, tente novamente mais tarde.",
} as const;
