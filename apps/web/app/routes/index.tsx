import { createFileRoute } from "@tanstack/react-router";
// import { Card, CardContent, CardHeader } from "@/components/shadcn/card";

export const Route = createFileRoute("/")({
  component: Home,

  beforeLoad: async ({ context }) => {
    const { user } = context;
  },
  loader: () => {},
});

function Home() {
  const { user } = Route.useRouteContext();

  return <div className={"min-h-[100vh] w-full"}>index</div>;
}
