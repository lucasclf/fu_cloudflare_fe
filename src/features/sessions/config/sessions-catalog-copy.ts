export const SESSIONS_CATALOG_COPY = {
  sidebar: {
    headerTitle: "Sessões",
    headerSubtitle: "Registro de sessões da campanha",
    loadingMessage: "Carregando sessões...",
    listAriaLabel: "Lista de sessões",
  },

  search: {
    placeholder: "Buscar por sessão, número ou título...",
  },

  filters: {
    clearButtonLabel: "Limpar busca",
  },

  main: {
    loadingMessage: "Carregando sessões...",
  },

  emptyState: {
    title: "Nenhuma sessão encontrada",
    descriptionWithoutFilters: "Nenhuma sessão está disponível no momento.",
    descriptionWithFilters: "Tente limpar a busca ou procurar outro termo.",
  },

  session: {
    badgeLabel: "Sessão",
    summaryTitle: "Resumo",
    notesTitle: "Notas",
    showAllButtonLabel: "Mostrar todas",
    emptySidebarMessage: "Nenhuma sessão encontrada.",
    emptyPanelMessage: "Nenhuma sessão para exibir.",
  },

  error: {
    loadSessionsMessage: "Não foi possível carregar as sessões.",
  },
} as const;
