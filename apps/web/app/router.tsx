import { QueryClient } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";
import toast from "react-hot-toast";
import { DefaultCatchBoundary } from "./components/DefaultCatchBoundary";
import { NotFound } from "./components/NotFound";
import { routeTree } from "./routeTree.gen";

export function createRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: {
        throwOnError(error) {
          if (error instanceof Error) {
            console.error("Mutation error:", error.message);
          } else {
            console.error("Mutation error:", error);
          }

          return false;
        },
        onError(error) {
          if (error instanceof Error) {
            console.error("Mutation error:", error.message);
          } else {
            console.error("Mutation error:", error);
          }
          toast.error(`An unknown error occurred (${error.name})`);
        },
      },
      queries: {
        staleTime: 1000 * 60 * 10, // 5 minutes,

        throwOnError(error) {
          if (error instanceof Error) {
            console.error("Query error:", error.message);
          } else {
            console.error("Query error:", error);
          }

          toast.error(`An unknown error occurred (${error.name})`);

          return false;
        },
      },
    },
  });
  const router = createTanStackRouter({
    routeTree,
    context: { queryClient },
    defaultPreload: "intent",
    defaultErrorComponent: DefaultCatchBoundary,
    defaultNotFoundComponent: () => <NotFound />,

    scrollRestoration: true,
  });

  return routerWithQueryClient(router, queryClient, { handleRedirects: true });
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
