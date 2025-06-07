import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/account/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_app/account/settings"!</div>;
}
