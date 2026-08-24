import { HugeIcon, type HugeIconName } from "@/components/icons/huge";

interface MetricProps {
  number: number;
  type: "upvotes" | "downvotes" | "answers" | "views";
}

const data: Record<MetricProps["type"], { icon: HugeIconName; label: string }> = {
  upvotes: { icon: "arrows/up-arrow-01", label: "Upvotes" },
  downvotes: { icon: "arrows/down-arrow-01", label: "Downvotes" },
  answers: { icon: "communication/chat-01", label: "Answers" },
  views: { icon: "interface/eye", label: "Views" },
};

const Metric = ({ number, type }: MetricProps) => {
  const { icon, label } = data[type];

  return (
    <span className="flex items-center gap-1.5">
      <HugeIcon name={icon} size={16} />
      {number} {label}
    </span>
  );
};

export default Metric;
