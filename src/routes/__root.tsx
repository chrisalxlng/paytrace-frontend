import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ErrorPage } from "../components/ErrorPage";
import type { RouterContext } from "../main";
import { m } from "../paraglide/messages";
import { getLocale, shouldRedirect } from "../paraglide/runtime";

const RootLayout = () => (
  <>
    <HeadContent />
    <Outlet />
    <TanStackRouterDevtools />
  </>
);

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
  errorComponent: ErrorPage,
  head: () => ({
    meta: [
      {
        title: m.paytrace(),
      },
    ],
  }),
  beforeLoad: async () => {
    document.documentElement.setAttribute("lang", getLocale());

    const decision = await shouldRedirect({ url: window.location.href });

    if (decision.redirectUrl) {
      throw redirect({ href: decision.redirectUrl.href });
    }
  },
});
