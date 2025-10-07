import { useEffect } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
  isOpen: boolean;
  title?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
  widthClassName?: string;
}

const modalRoot = typeof document !== "undefined" ? document.body : null;

export const Modal = ({
  isOpen,
  title,
  children,
  footer,
  onClose,
  widthClassName = "max-w-lg",
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

  if (!modalRoot) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* затемнение фона */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* контент модалки */}
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`relative z-10 w-full ${widthClassName} bg-white rounded-2xl shadow-2xl overflow-hidden`}
          >
            {/* Заголовок */}
            {(title || true) && (
              <div className="relative flex items-center justify-center border-b border-gray-100 px-6 py-4">
                {typeof title === "string" ? (
                  <h2 className="text-lg font-semibold text-gray-900 text-center w-full">
                    {title}
                  </h2>
                ) : (
                  title
                )}

                {/* Кнопка закрытия */}
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Закрыть"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}

            {/* Тело модалки */}
            <div className="min-h-[250px] overflow-y-auto max-w-[sm] mx-auto">
              {children}
            </div>

            {/* Футер */}
            {footer && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    modalRoot
  );
};
