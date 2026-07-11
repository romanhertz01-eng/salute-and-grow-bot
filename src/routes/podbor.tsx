import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/podbor')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/podbor"!</div>
}
