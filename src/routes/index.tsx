import { createFileRoute, type LinkProps } from "@tanstack/react-router";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { keycloak } from "../auth";
import { Button } from "../components/Button";
import { Text } from "../components/Text";
import { m } from "../paraglide/messages";
import { useAuthStore } from "../stores/AuthStore";

const MOCK_DATA = [
  {
    order: 1,
    value: 50,
  },
  {
    order: 2,
    value: 150,
  },
  {
    order: 3,
    value: 200,
  },
  {
    order: 4,
    value: 300,
  },
  {
    order: 5,
    value: 350,
  },
  {
    order: 6,
    value: 450,
  },
];

export const Landing = () => {
  const dashboardPath: LinkProps["to"] = "/dashboard";
  const redirectUri = `${window.location.origin}${dashboardPath}`;

  const handleDemoLogin = async () => {
    try {
      const baseLoginUrl = await keycloak.createLoginUrl({
        loginHint: import.meta.env.VITE_DEMO_EMAIL,
        redirectUri,
      });

      const finalLoginUrl = new URL(baseLoginUrl);
      finalLoginUrl.searchParams.append(
        "password",
        import.meta.env.VITE_DEMO_PASSWORD,
      );

      window.location.href = finalLoginUrl.toString();
    } catch (error) {
      console.error("Demo URL generation failed", error);
    }
  };

  return (
    <div className="flex flex-col gap-4 h-dvh">
      <main className="grow">
        <div className="w-full flex justify-between items-center gap-2 p-4">
          <div className="flex gap-3 items-center cursor-pointer">
            <img
              src="/logo.svg"
              alt={m.paytrace_logo()}
              className="w-8.75 h-8.75"
            />
            <Text color="attention" variant="heading">
              {m.paytrace()}
            </Text>
          </div>
          <Button
            className="hover:bg-subtle-darker active:bg-subtle-darkest"
            onClick={() => {
              keycloak.login({
                redirectUri,
              });
            }}
          >
            <Text color="subtle">{m.sign_in()}</Text>
          </Button>
        </div>
        <div className="max-w-3xl mt-10 sm:mt-20 mx-auto flex flex-col gap-8 px-4 items-center text-center">
          <h1 className="font-base text-attention font-semibold text-4xl sm:text-6xl">
            {m.copy_title()}
          </h1>
          <Text color="subtle">{m.copy_subtitle()}</Text>
          <div className="h-70 sm:h-100 w-full rounded-b-md -mt-10 sm:-mt-30 -z-50">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_DATA} className="outline-hidden">
                <XAxis dataKey="order" hide />
                <YAxis domain={[0, "auto"]} hide />
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-primary)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-primary)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <Area
                  dataKey="value"
                  type="monotone"
                  fillOpacity={0.4}
                  fill="url(#gradient)"
                  strokeWidth={2}
                  stroke="var(--color-primary)"
                  activeDot={() => null}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <Button
            className="bg-primary hover:bg-primary-darker active:bg-primary-darkest w-full sm:w-fit mt-10"
            onClick={handleDemoLogin}
          >
            <Text>{m.start_demo()}</Text>
          </Button>
        </div>
      </main>
      <footer className="flex justify-center items-center px-4 pt-8 pb-4 shrink-0">
        <Text variant="caption" color="subtle">
          {m.copyright({ year: new Date().getFullYear() })}
        </Text>
      </footer>
    </div>
  );
};

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    const { authenticated } = useAuthStore.getState();
    if (authenticated) throw Route.redirect({ to: "/dashboard" });
  },
  component: Landing,
});
