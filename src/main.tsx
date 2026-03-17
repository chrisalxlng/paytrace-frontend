import "./main.css";
import { Toast } from "@base-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { Toasts, type ToastsData } from "./components/Toasts";
import { routeTree } from "./routeTree.gen";
import { useAuthStore } from "./stores/AuthStore";

export type RouterContext = {
  queryClient: QueryClient;
};

export const queryClient = new QueryClient();
export const toastManager = Toast.createToastManager<ToastsData>();

let router: ReturnType<typeof createRouter>;

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }

  interface StaticDataRouteOption {
    title?: string;
    inset?: "all" | "vertical";
    renderFloatingButton?: boolean;
  }
}

const initializeApp = async () => {
  await useAuthStore.getState().init();

  router = createRouter({
    routeTree,
    context: {
      queryClient,
    },
  });

  // biome-ignore lint/style/noNonNullAssertion: root will always be present
  const rootElement = document.getElementById("root")!;

  if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <StrictMode>
        <Toast.Provider toastManager={toastManager}>
          <Toasts />
        </Toast.Provider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </StrictMode>,
    );
  }
};

initializeApp();
