import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { usePostHog } from "posthog-js/react";
import type * as React from "react";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

import { PostHogProvider } from "~/components/context/Posthog";
import {
  getThemeCookieFn,
  ThemeProvider,
} from "~/components/context/ThemeContext";
import { DefaultCatchBoundary } from "~/components/DefaultCatchBoundary.js";
import { Footer } from "~/components/Footer";
import { Navbar } from "~/components/Navbar";
import { NotFound } from "~/components/NotFound.js";
import { fetchUserQueryOptions } from "~/lib/queries/user";

import appCss from "~/styles/globals.css?url";
import { seo } from "~/utils/seo";

var hasWelcomed = false;
export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      ...seo({
        title: "MoviElo",
        description:
          "A platform for sharing and discovering skincare-related content",
      }),
    ],
    links: [
      { rel: "stylesheet", href: appCss, suppressHydrationWarning: true },

      {
        rel: "apple-touch-icon",
        sizes: "192x192",
        href: "/healhive-app-logo@192.png",
      },
      { rel: "manifest", href: "/site.webmanifest", color: "#fffff" },
      { rel: "icon", href: "/favicon.ico" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap",
      },
    ],
  }),

  beforeLoad: async ({ context }) => {
    // todo refactor this a queryOpts
    const theme = context.queryClient.ensureQueryData({
      queryKey: ["theme"],
      queryFn: async () => {
        return await getThemeCookieFn();
      },
    });

    const queryClient = context.queryClient;
    const user = await queryClient.ensureQueryData(fetchUserQueryOptions());
    // const user = await fetchUser();
    return {
      user,
      cheese: "edam",
      theme: await theme,
    };
  },
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    );
  },
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
});

function RootComponent() {
  const { user } = Route.useRouteContext();
  const posthog = usePostHog();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    try {
      posthog.identify(user?.id, {
        email: user?.email,
        name: `${user?.firstName} ${user?.lastName}`,
      });
    } catch (e) {
      console.error("Error identifying user", e);
    }
  }, [user]);

  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const { theme } = Route.useRouteContext();

  return (
    <html className={`${theme}`} lang="en">
      <head suppressHydrationWarning>
        <HeadContent />
        {/* <CookieBotScript /> */}
      </head>
      <body>
        <PostHogProvider>
          <ThemeProvider defaultTheme={theme}>
            <Toaster
              toastOptions={{
                className: "dark:!bg-neutral-900 dark:!text-white",
              }}
            />
            <main className={"min-h-screen flex flex-col relative h-full/"}>
              <Navbar />
              {children}
              <Footer />
            </main>
          </ThemeProvider>
        </PostHogProvider>

        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  );
}

// export default function CookieBotScript() {
//   return (
//     <script
//       id="Cookiebot"
//       src="https://consent.cookiebot.com/uc.js"
//       data-cbid="7a83f6d4-ce19-4c27-b1d3-23d00eb3eed3"
//       data-blockingmode="auto"
//       type="text/javascript"
//       async
//     />
//   );
// }

declare global {
  interface Window {
    Cookiebot: {
      renew: () => void;
      consent: {
        necessary: boolean;
        preferences: boolean;
        statistics: boolean;
        marketing: boolean;
      };
    };
  }
}
