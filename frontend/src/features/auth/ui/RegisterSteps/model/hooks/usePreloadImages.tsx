import { useEffect } from "react";

export const usePreloadImages = (imageUrls: Array<string | undefined | null>) => {
  useEffect(() => {
    const targets = imageUrls.filter(Boolean) as string[];
    if (targets.length === 0) {
      return;
    }

    const preloaded = targets.map((url) => {
      const img = new Image();
      img.decoding = "async";
      img.src = url;
      return img;
    });

    return () => {
      preloaded.forEach((img) => {
        img.src = "";
      });
    };
  }, [imageUrls]);
};
