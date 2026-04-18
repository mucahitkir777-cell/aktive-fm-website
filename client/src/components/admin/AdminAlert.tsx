import { errorAlertClass, successAlertClass } from "./styles";

interface AdminAlertProps {
  type: "success" | "error";
  message: string;
  className?: string;
}

export default function AdminAlert({ type, message, className = "" }: AdminAlertProps) {
  const baseClass = type === "success" ? successAlertClass : errorAlertClass;
  return <div className={`${baseClass} ${className}`.trim()}>{message}</div>;
}
