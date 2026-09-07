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
import Link from "next/link";
import { toast } from "sonner";

interface ActionBtnsProps {
  type: "question" | "answer";
  targetId: string;
}

const ActionBtns = ({ type, targetId }: ActionBtnsProps) => {
  const handleDelete = async () => {
    if (type === "question") {
      // Call API to delete question
      toast.success("Question deleted successfully");
    } else if (type === "answer") {
      // Call API to delete answer
      toast.success("Answer deleted successfully");
    }
  };

  return (
    <div className="flex items-center gap-2.5">
      <Button variant="icon" size="icon" aria-label={`Edit ${type}`} asChild>
        <Link href={type === "question" ? ROUTES.QUESTION_EDIT(targetId) : ROUTES.ANSWER_EDIT(targetId)}>
          <HugeIconSvg icon={uiIcons.edit} size={16} />
        </Link>
      </Button>

      <Dialog>
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

            <Button variant="primary" size="sm" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ActionBtns;
