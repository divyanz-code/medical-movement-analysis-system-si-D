import { Badge } from "./ui/badge";

interface StatusChipProps {
  status: "aligned" | "compensatory" | "warning" | "success" | "processing";
  label?: string;
}

export function StatusChip({ status, label }: StatusChipProps) {
  const statusConfig = {
    aligned: {
      label: label || "Aligned",
      className: "bg-success/10 text-success border-success/20",
    },
    compensatory: {
      label: label || "Compensatory",
      className: "bg-warning/10 text-warning border-warning/20",
    },
    warning: {
      label: label || "Warning",
      className: "bg-destructive/10 text-destructive border-destructive/20",
    },
    success: {
      label: label || "Complete",
      className: "bg-success/10 text-success border-success/20",
    },
    processing: {
      label: label || "Processing",
      className: "bg-accent/10 text-accent border-accent/20",
    },
  };

  const config = statusConfig[status];

  return (
    <Badge variant="outline" className={`${config.className} font-medium`}>
      {config.label}
    </Badge>
  );
}
