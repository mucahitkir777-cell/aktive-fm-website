import { getLeadStatusBadgeClass, getLeadStatusLabel } from "./helpers";

interface AdminStatusBadgeProps {
  status: string | null | undefined;
}

export default function AdminStatusBadge({ status }: AdminStatusBadgeProps) {
  return <span className={getLeadStatusBadgeClass(status)}>{getLeadStatusLabel(status)}</span>;
}
