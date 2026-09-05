import { HugeIcon } from "@/components/icons/huge";

interface StatsProps {
  totalQuestions: number;
  totalAnswers: number;
  badges: BadgeCounts;
}

// 15500 -> "15.5K", tak jak na designie
const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });

const BADGE_TIERS = [
  { key: "gold", label: "Gold Badges", tint: "bg-gold-bg text-gold" },
  { key: "silver", label: "Silver Badges", tint: "bg-silver-bg text-silver" },
  { key: "bronze", label: "Bronze Badges", tint: "bg-bronze-bg text-bronze" },
] as const;

const Stats = ({ totalQuestions, totalAnswers, badges }: StatsProps) => {
  return (
    <section className="flex flex-col gap-5">
      <h2>Stats</h2>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-3">
        <div className="border-line bg-background shadow-card grid grid-cols-2 gap-3 rounded-xl border p-4">
          {[
            { value: totalQuestions, label: "Questions" },
            { value: totalAnswers, label: "Answers" },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center gap-1.5">
              <span className="text-2xl font-semibold tabular-nums">{compact.format(value)}</span>
              <span className="text-fg-subtle text-sm">{label}</span>
            </div>
          ))}
        </div>

        {BADGE_TIERS.map(({ key, label, tint }) => (
          <div
            key={key}
            className="border-line bg-background shadow-card flex items-center gap-3 rounded-xl border p-4"
          >
            <span className={`flex size-11 shrink-0 items-center justify-center rounded-full ${tint}`}>
              <HugeIcon name="education/medal-01" size={20} />
            </span>

            <div className="flex flex-col gap-1.5">
              <span className="text-2xl font-semibold tabular-nums">{compact.format(badges[key])}</span>
              <span className="text-fg-subtle text-sm">{label}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Stats;
