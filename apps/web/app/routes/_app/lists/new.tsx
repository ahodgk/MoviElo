import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/lists/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/lists/new"!</div>
}
