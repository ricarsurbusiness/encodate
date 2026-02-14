import { QueryClient } from "@tanstack/react-query";

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 100,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        retry: 1,
        gcTime: 5 * 60 * 1000,
      },
      mutations: {
        retry: false,
      },
    },
  });
}
let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  // En el servidor, siempre crear un nuevo QueryClient
  if (typeof window === "undefined") {
    return makeQueryClient();
  }

  // En el navegador, reutilizar el mismo QueryClient
  // para evitar recrearlo en cada render
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }

  return browserQueryClient;
}
