// app/providers.tsx

import { useLocation, useRouteContext } from "@tanstack/react-router";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react";
import { Suspense, useEffect, useState } from "react";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const { user } = useRouteContext({ from: "__root__" });
  useEffect(() => {
    posthog.init(
      "phc_E899W2RJtuTN2akyIIbkZwBgmAko5sZLRtnlDsw2lvq",
      // ??
      // ((import.meta.env.VITE_PUBLIC_POSTHOG_KEY as string) ||
      // (process.env.VITE_PUBLIC_POSTHOG_KEY as string))
      {
        api_host: "https://eu.i.posthog.com",
        // import.meta.env.VITE_PUBLIC_POSTHOG_API_HOST ||
        // "https://eu.i.posthog.com",
        // ui_host:
        //   import.meta.env.VITE_PUBLIC_POSTHOG_UI_HOST ||
        //   "https://eu.posthog.com",
        person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
        capture_pageview: false, // Disable automatic pageview capture, as we capture manually
        capture_pageleave: false, // Disable automatic pageleave capture
        persistence: window.Cookiebot?.consent?.statistics
          ? "localStorage+cookie"
          : "memory", // Use memory persistence to avoid storing cookies
        bootstrap: {
          distinctID: user?.id,
        },
        debug: true,
      },
    );

    // if (!window.Cookiebot?.consent?.statistics && window.Cookiebot) {
    //   console.debug("PostHog: Opting out of capturing");
    //   posthog.opt_out_capturing();
    // } else {
    //   console.debug("PostHog: Opting in to capturing");
    //   posthog.opt_in_capturing();
    // }
  }, [user?.id]);

  return (
    <PHProvider client={posthog}>
      <SuspendedPostHogPageView />
      {children}
    </PHProvider>
  );
}

function PostHogPageView() {
  // const { pathname } = useLocation();

  // const search = useSearch({ strict: false });
  // // console.log(search)
  // const posthog = usePostHog();

  // Track pageviews
  // useEffect(() => {
  //   if (pathname && posthog) {
  //     let url = window.origin + pathname;
  //     if (search.toString()) {
  //       url = `${url}`;
  //     }
  //     // console.log("PostHog: Capturing pageview", url);
  //     // console.log(window)
  //     posthog.capture("$pageview", { $current_url: url, search });
  //   }
  // }, [pathname, search, posthog]);
  usePageTracking();

  return null;
}

export function usePageTracking() {
  const { pathname } = useLocation();
  const posthog = usePostHog();
  const [prevPathname, setPrevPathname] = useState<string | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: reason
  useEffect(() => {
    if (prevPathname && prevPathname !== pathname) {
      posthog.capture("$pageleave", { $pathname: prevPathname });
    }
    posthog.capture("$pageview");
    setPrevPathname(pathname);
  }, [pathname, prevPathname]);

  return null;
}

// Wrap PostHogPageView in Suspense to avoid the useSearchParams usage above
// from de-opting the whole app into client-side rendering
// See: https://nextjs.org/docs/messages/deopted-into-client-rendering
function SuspendedPostHogPageView() {
  return (
    <Suspense fallback={null}>
      <PostHogPageView />
    </Suspense>
  );
}
