import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  title?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
  widthClassName?: string;
}

const modalRoot = typeof document !== 'undefined' ? document.body : null;

export const Modal = ({
  isOpen,
  title,
  children,
  footer,
  onClose,
  widthClassName = 'max-w-2xl',
}: ModalProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !modalRoot) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        className={`relative w-full ${widthClassName} mx-4 rounded-3xl bg-white shadow-xl`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          {typeof title === 'string' ? (
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          ) : (
            title
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 transition hover:text-gray-600"
            aria-label="Закрыть модалку"
          >
            ×
          </button>
        </div>

        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
          {children}
        </div>

        {footer && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-3xl">
            {footer}
          </div>
        )}
      </div>
    </div>,
    modalRoot,
  );
};
