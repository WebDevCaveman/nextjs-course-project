"use client";

import { HugeIconSvg } from "@/components/icons/huge/HugeIconSvg";
import { uiIcons } from "@/components/icons/huge/data/ui";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ROUTES from "@/constants/routes";
import { deleteQuestion } from "@/lib/actions/question.action";
import { deleteAnswer } from "@/lib/actions/answer.action";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";

interface ActionBtnsProps {
  type: "question" | "answer";
  targetId: string;
}

const ActionBtns = ({ type, targetId }: ActionBtnsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      if (type === "question") {
        const { success } = await deleteQuestion({ questionId: targetId });
        if (success) {
          toast.success("Question deleted successfully");
          setIsOpen(false);
        } else {
          toast.error(`Failed to delete the ${type}`);
        }
      } else if (type === "answer") {
        const { success } = await deleteAnswer({ answerId: targetId });
        if (success) {
          toast.success("Answer deleted successfully");
          setIsOpen(false);
        } else {
          toast.error(`Failed to delete the ${type}`);
        }
      }
    } catch (error) {
      toast.error(`${error instanceof Error ? error.message : "Failed to delete the " + type}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2.5">
      <Button variant="icon" size="icon" aria-label={`Edit ${type}`} asChild>
        <Link href={type === "question" ? ROUTES.QUESTION_EDIT(targetId) : ROUTES.ANSWER_EDIT(targetId)}>
          <HugeIconSvg icon={uiIcons.edit} size={16} />
        </Link>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="icon" size="icon" aria-label={`Delete ${type}`}>
            <HugeIconSvg icon={uiIcons.trash} size={16} />
          </Button>
        </DialogTrigger>

        <DialogContent role="alertdialog" showCloseButton={false} onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Delete this {type}?</DialogTitle>
            <DialogDescription>
              This {type} will be removed permanently. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" size="sm">
                Cancel
              </Button>
            </DialogClose>

            <Button variant="primary" size="sm" onClick={handleDelete} disabled={isLoading}>
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ActionBtns;
