import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

// this layout exists to auth protect these routes
export const Route = createFileRoute("/_app/admin")({
  beforeLoad: ({ context, location }) => {
    if (!context.user || !context.user.isAdmin) {
      throw redirect({ to: "/login" });
    }
    return {
      ...context,
      user: context.user,
    };
  },
  component: () => {
    return (
      <>
        <Outlet />
      </>
    );
  },
});
