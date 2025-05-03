"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { X } from "lucide-react";
import * as React from "react";
import { Button } from "./ui/button";
import { Spinner } from "./spinner";
type ModalProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  trigger: React.ReactNode;
  onSubmit: () => Promise<void>;
  cancelText?: string;
  submitText?: string;
  isLoading?: boolean;
  onSubmitEnd?: () => void;
};

export function ModalWrapper({
  title,
  description,
  children,
  trigger,
  onSubmit,
  cancelText = "Cancel",
  submitText = "Submit",
  isLoading = false,
  onSubmitEnd,
}: ModalProps) {
  const [open, setOpen] = React.useState(false);

  const handleSubmit = async () => {
    try {
      await onSubmit();
      if (typeof onSubmitEnd === "function") {
        onSubmitEnd();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setOpen(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <Button
          onClick={() => setOpen(false)}
          variant={"ghost"}
          className="absolute top-4 right-4"
          type="button"
          size={"icon"}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        {children}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleSubmit();
              //   setOpen(false);
            }}
            className="w-32"
          >
            {isLoading ? <Spinner /> : submitText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
