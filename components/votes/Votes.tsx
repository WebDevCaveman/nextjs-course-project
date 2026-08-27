"use client";
import { useState } from "react";
import { toast } from "sonner";
import { HugeIconSvg } from "@/components/icons/huge/HugeIconSvg";
import { uiIcons } from "@/components/icons/huge/data/ui";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";

interface VotesProps {
  upvotes: number;
  downvotes: number;
  hasupVoted: boolean;
  hasdownVoted: boolean;
}

const Votes = ({ upvotes, downvotes, hasupVoted, hasdownVoted }: VotesProps) => {
  const session = useSession();
  const userId = session.data?.user?.id;

  const [isLoading, setIsLoading] = useState(false);
  const handleVote = (type: "upvote" | "downvote") => {
    if (!userId) {
      toast.error("You must be logged in to vote.");
      return;
    }

    setIsLoading(true);

    try {
      const successMessage =
        type === "upvote"
          ? `Upvote ${!hasupVoted ? "added" : "removed"} successfully!`
          : `Downvote ${!hasdownVoted ? "added" : "removed"} successfully!`;
      toast.info(successMessage);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to submit vote.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <button
        aria-label="Upvote"
        aria-pressed={hasupVoted}
        onClick={() => !isLoading && handleVote("upvote")}
        className={cn(
          "text-success bg-muted hover:bg-success-bg flex h-[30px] items-center gap-1.5 rounded-md px-2.5",
          hasupVoted && "bg-success-bg"
        )}
      >
        <HugeIconSvg icon={uiIcons.voteUp} size={16} />
        <span className="text-fg text-base font-semibold tabular-nums">{upvotes}</span>
      </button>

      <Separator orientation="vertical" className="mx-1" />

      <button
        aria-label="Downvote"
        aria-pressed={hasdownVoted}
        onClick={() => !isLoading && handleVote("downvote")}
        className={cn(
          "text-danger bg-muted hover:bg-danger-bg flex h-[30px] items-center gap-1.5 rounded-md px-2.5",
          hasdownVoted && "bg-danger-bg"
        )}
      >
        <HugeIconSvg icon={uiIcons.voteDown} size={16} />
        <span className="text-fg text-base font-semibold tabular-nums">{downvotes}</span>
      </button>
    </div>
  );
};

export default Votes;
