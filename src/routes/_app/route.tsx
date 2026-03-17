import { RiAddLargeFill } from "@remixicon/react";
import {
  createFileRoute,
  Outlet,
  useMatches,
  useRouterState,
} from "@tanstack/react-router";
import classNames from "classnames";
import { keycloak } from "../../auth";
import { FloatingActionButton } from "../../components/FloatingActionButton";
import { Header } from "../../components/Header";
import { LoadingIndicator } from "../../components/LoadingIndicator";
import { Text } from "../../components/Text";
import { UploadManager } from "../../components/UploadManager";
import { m } from "../../paraglide/messages";
import { useAuthStore } from "../../stores/AuthStore";

const RouteLayout = () => {
  const isLoading = useRouterState({
    select: (state) => state.status === "pending",
  });

  const title = useMatches({
    select: (matches) => matches.at(-1)?.staticData.title,
  });

  const inset =
    useMatches({
      select: (matches) => matches.at(-1)?.staticData.inset,
    }) ?? "all";

  const renderFloatingButton =
    useMatches({
      select: (matches) => matches.at(-1)?.staticData.renderFloatingButton,
    }) ?? true;

  return (
    <>
      <UploadManager />
      {renderFloatingButton && (
        <FloatingActionButton icon={<RiAddLargeFill />} to="/upload" />
      )}
      <div className="flex flex-col h-dvh w-dvw relative">
        {title && <Header title={title} className="h-17.5" />}
        <main className="pt-17.5 grow flex flex-col">
          <div
            className={classNames("flex flex-col gap-2 h-full overflow-auto", {
              "p-4": inset === "all",
              "py-4": inset === "vertical",
            })}
          >
            {isLoading && <LoadingIndicator />}
            <Outlet />
          </div>
        </main>
        <footer className="flex justify-center items-center px-4 pt-8 pb-4 shrink-0">
          <Text variant="caption" color="subtle">
            {m.copyright({ year: new Date().getFullYear() })}
          </Text>
        </footer>
      </div>
    </>
  );
};

export const Route = createFileRoute("/_app")({
  component: RouteLayout,
  beforeLoad: async () => {
    const { initialized } = useAuthStore.getState();

    if (!initialized) {
      await new Promise<void>((resolve) => {
        const checkInterval = setInterval(() => {
          if (useAuthStore.getState().initialized) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 50);
      });
    }

    const state = useAuthStore.getState();
    if (!state.authenticated) {
      const loginUrl = await keycloak.createLoginUrl({
        redirectUri: window.location.origin + window.location.pathname,
      });
      window.location.href = loginUrl;
      await new Promise(() => {});
    }
  },
});
