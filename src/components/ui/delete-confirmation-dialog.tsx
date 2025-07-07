import { Loader2, Trash2 } from "lucide-react";

import { capitalize } from "@/lib/utils/functions/capitalize";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeleteConfirmationDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  itemName: string; // e.g., "camera", "site", "tag"
  itemLabel?: string; // e.g., "camera123"
  onDelete: () => void;
  isPending?: boolean;
  title?: string;
  description?: string;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  open,
  setOpen,
  itemName,
  itemLabel,
  onDelete,
  isPending = false,
  title,
  description,
}) => {
  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogContent className="w-full max-w-full overflow-x-hidden bg-white sm:max-w-xl">
        <DialogHeader className="flex flex-col items-center">
          <Trash2
            size={32}
            className="mb-3 text-red-500"
          />
          <DialogTitle className="text-center text-2xl font-bold">
            {title || `Delete ${capitalize(itemName)}`}
          </DialogTitle>
          <DialogDescription className="mt-2 text-center text-gray-600">
            {description || (
              <>
                Are you sure you want to delete the {itemName}
                {itemLabel && (
                  <span className="font-semibold text-black"> &quot;{itemLabel}&quot;</span>
                )}{" "}
                ?
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="w-full border-gray-300 text-gray-700 lg:w-28"
              disabled={isPending}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            className="w-full lg:w-28"
            disabled={isPending}
            onClick={onDelete}
          >
            Delete
            {isPending && <Loader2 className="ml-2 size-4 animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
