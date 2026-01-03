'use client';
import React, { ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
  DialogDescription,
  DialogPortal,
} from '@radix-ui/react-dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/60 z-[1000]" />
        <DialogContent className="fixed left-1/2 top-1/2 z-[1001] w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-h-[90vh] overflow-y-auto">
            <DialogTitle>
              <VisuallyHidden>Modal Title</VisuallyHidden>
            </DialogTitle>
            <DialogDescription>
              <VisuallyHidden>Modal Description</VisuallyHidden>
            </DialogDescription>
            {children}
            <button onClick={onClose} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
              Close
            </button>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default Modal;
