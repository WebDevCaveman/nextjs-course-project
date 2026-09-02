"use client";
import { use, useState } from "react";
import { toast } from "sonner";
import { HugeIconSvg } from "@/components/icons/huge/HugeIconSvg";
import { uiIcons } from "@/components/icons/huge/data/ui";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";
import { HasVotedResponse } from "@/types/action";
import { createVote } from "@/lib/actions/vote.action";

interface VotesProps {
  upvotes: number;
  downvotes: number;
  targetType: "question" | "answer";
  targetId: string;
  hasVotedPromise: Promise<ActionResponse<HasVotedResponse>>;
}

const Votes = ({ upvotes, downvotes, targetType, targetId, hasVotedPromise }: VotesProps) => {
  const session = useSession();
  const userId = session.data?.user?.id;

  const { data } = use(hasVotedPromise);
  const [isLoading, setIsLoading] = useState(false);
  const { hasUpvoted, hasDownvoted } = data || {};

  const handleVote = async (type: "upvote" | "downvote") => {
    setIsLoading(true);

    if (!userId) {
      toast.error("You must be logged in to vote.");
      setIsLoading(false);
      return;
    }

    try {
      const result = await createVote({ targetId, targetType, voteType: type });
      if (!result.success) {
        return toast.error(result.error?.message || "Failed to submit vote.");
      }

      const successMessage =
        type === "upvote"
          ? `Upvote ${!hasUpvoted ? "added" : "removed"} successfully!`
          : `Downvote ${!hasDownvoted ? "added" : "removed"} successfully!`;
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
        aria-pressed={!!hasUpvoted}
        disabled={isLoading}
        onClick={() => handleVote("upvote")}
        className={cn(
          "text-success bg-muted hover:bg-success-bg flex h-[30px] items-center gap-1.5 rounded-md px-2.5 disabled:cursor-not-allowed disabled:opacity-50",
          hasUpvoted && "bg-success-bg"
        )}
      >
        <HugeIconSvg icon={uiIcons.voteUp} size={16} />
        <span className="text-fg text-base font-semibold tabular-nums">{upvotes}</span>
      </button>

      <Separator orientation="vertical" className="mx-1" />

      <button
        aria-label="Downvote"
        aria-pressed={!!hasDownvoted}
        disabled={isLoading}
        onClick={() => handleVote("downvote")}
        className={cn(
          "text-danger bg-muted hover:bg-danger-bg flex h-[30px] items-center gap-1.5 rounded-md px-2.5 disabled:cursor-not-allowed disabled:opacity-50",
          hasDownvoted && "bg-danger-bg"
        )}
      >
        <HugeIconSvg icon={uiIcons.voteDown} size={16} />
        <span className="text-fg text-base font-semibold tabular-nums">{downvotes}</span>
      </button>
    </div>
  );
};

export default Votes;
