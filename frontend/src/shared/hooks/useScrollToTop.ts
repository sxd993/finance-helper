import { useEffect } from "react";

/**
 * Скроллит страницу к началу при монтировании компонента.
 */
export const useScrollToTop = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);
};

