"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="space-y-3">
      <div className="bg-surface relative aspect-square overflow-hidden rounded-lg">
        <Image
          src={images[activeIndex]}
          alt={`${title} — image ${activeIndex + 1} of ${images.length}`}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          preload={activeIndex === 0}
          className="object-cover"
        />
      </div>
      <ul className="grid grid-cols-4 gap-3">
        {images.map((image, index) => (
          <li key={image}>
            <button
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show image ${index + 1}`}
              aria-pressed={index === activeIndex}
              className={cn(
                "focus-visible:outline-primary relative block aspect-square w-full overflow-hidden rounded-md border-2 transition focus-visible:outline-2",
                index === activeIndex
                  ? "border-primary"
                  : "border-transparent opacity-70 hover:opacity-100",
              )}
            >
              <Image
                src={image}
                alt=""
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
