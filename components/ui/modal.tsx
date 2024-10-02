'use client';

import { ReactNode } from 'react';
import { createPortal } from 'react-dom';

type ModalProps = {
  children: ReactNode;
  onClose: () => void;
};

export function Modal({ children, onClose }: ModalProps) {
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-md shadow-lg max-w-md w-full">
        {children}
      </div>
    </div>,
    document.body
  );
}
