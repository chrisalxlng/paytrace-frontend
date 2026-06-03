import type { LinkProps } from "@tanstack/react-router";
import { create } from "zustand";
import { keycloak } from "../auth";

type UserInfo = {
  firstName: string;
  lastName: string;
  emailAddress: string;
  isDemo: boolean;
};

type AuthState = {
  initialized: boolean;
  authenticated: boolean;
  token?: string;
  userInfo?: UserInfo;
  login: () => Promise<void>;
  logout: () => void;
  init: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  initialized: false,
  authenticated: false,
  token: undefined,

  init: async () => {
    try {
      const authenticated = await keycloak.init({
        onLoad: "check-sso",
      });

      let userInfo: UserInfo | undefined;

      if (authenticated) {
        const userInfoResponse = await keycloak.loadUserInfo();
        userInfo = {
          emailAddress: userInfoResponse?.email ?? "",
          firstName: userInfoResponse?.given_name ?? "",
          lastName: userInfoResponse?.family_name ?? "",
          isDemo: userInfoResponse?.is_demo ?? false,
        };
      }

      set({
        initialized: true,
        authenticated,
        token: keycloak.token ?? undefined,
        userInfo,
      });

      if (authenticated) {
        setInterval(async () => {
          try {
            await keycloak.updateToken(30);
            set({ token: keycloak.token ?? undefined });
          } catch {
            console.warn("Token refresh failed");
            get().logout();
          }
        }, 10_000);
      }
    } catch (error) {
      console.error("Keycloak init failed", error);
      set({ initialized: true, authenticated: false });
    }
  },

  login: async () => {
    await keycloak.login();
  },

  logout: () => {
    const rootPath: LinkProps["to"] = "/";
    const redirectUri = `${window.location.origin}${rootPath}`;

    keycloak.logout({
      redirectUri,
    });
    set({ authenticated: false, token: undefined });
  },
}));
