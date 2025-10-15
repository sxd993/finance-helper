import { useEffect } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  title?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
  widthClassName?: string;
  className?: string;
  showCloseButton?: boolean;
}

const modalRoot = typeof document !== "undefined" ? document.body : null;

export const Modal = ({
  isOpen,
  title,
  children,
  footer,
  onClose,
  widthClassName = "max-w-lg",
  className = "",
  showCloseButton = true,
}: ModalProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!modalRoot || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* затемнение фона */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* контент модалки */}
      <div
        role="dialog"
        aria-modal="true"
        className={`relative z-10 w-full ${widthClassName} bg-white rounded-2xl shadow-2xl overflow-hidden ${className}`}
      >
        {/* Заголовок */}
        {title != null && (
          <div className="relative flex items-center justify-center px-6 py-4 border-b border-gray-100">
            {typeof title === "string" ? (
              <h2 className="text-lg font-semibold text-gray-900 text-center w-full">
                {title}
              </h2>
            ) : (
              title
            )}
          </div>
        )}

        {/* Кнопка закрытия */}
        {showCloseButton && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-800 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Тело модалки */}
        <div className="px-6 pb-6">
          {children}
        </div>

        {/* Футер */}
        {footer && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            {footer}
          </div>
        )}
      </div>
    </div>,
    modalRoot
  );
};
