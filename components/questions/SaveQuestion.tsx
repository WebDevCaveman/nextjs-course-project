"use client";

import { HugeIconSvg } from "@/components/icons/huge/HugeIconSvg";
import { uiIcons } from "@/components/icons/huge/data/ui";
import { toggleSaveQuestion } from "@/lib/actions/collection.action";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { use, useState } from "react";
import { toast } from "sonner";

interface SaveQuestionProps {
  questionId: string;
  hasSavedPromise: Promise<ActionResponse<{ saved: boolean }>>;
}

const SaveQuestion = ({ questionId, hasSavedPromise }: SaveQuestionProps) => {
  const session = useSession();
  const userId = session.data?.user?.id;

  const { data } = use(hasSavedPromise);
  const [isLoading, setIsLoading] = useState(false);
  const [saved, setSaved] = useState(!!data?.saved);

  const handleSave = async (questionId: string) => {
    setIsLoading(true);

    if (!userId) {
      toast.error("You must be logged in to save a question.");
      setIsLoading(false);
      return;
    }

    try {
      const { success, data, error } = await toggleSaveQuestion({ questionId });
      if (!success) {
        return toast.error(error?.message || "Failed to save question.");
      }

      setSaved(!!data?.saved);
      toast.success(`Question ${data?.saved ? "saved" : "removed"} successfully.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save question.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      aria-label="Save question"
      aria-pressed={!!saved}
      disabled={isLoading}
      onClick={() => handleSave(questionId)}
      className={cn(
        "text-fg-muted hover:text-warning disabled:cursor-not-allowed disabled:opacity-50",
        saved && "text-warning"
      )}
    >
      <HugeIconSvg icon={uiIcons.star} size={18} />
    </button>
  );
};

export default SaveQuestion;
