// apps/web/src/components/CreateEventButton.tsx

import { Link } from "react-router-dom"

type Props = {
  to: string
}

export default function CreateEventButton({ to }: Props) {
  return (
    <Link to={to} className="create-event-fab">
      +
    </Link>
  )
}
