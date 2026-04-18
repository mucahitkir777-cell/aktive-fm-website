import { emptyStateClass } from "./styles";

interface AdminEmptyStateProps {
  message: string;
}

export default function AdminEmptyState({ message }: AdminEmptyStateProps) {
  return <div className={emptyStateClass}>{message}</div>;
}
