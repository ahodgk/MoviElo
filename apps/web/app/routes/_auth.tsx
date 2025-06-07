import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  beforeLoad: async ({ context }) => {
    const { user } = context;
    if (user) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: Layout,
});

export default function Layout() {
  return <Outlet />;
}
