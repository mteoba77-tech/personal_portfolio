/* eslint-disable @next/next/no-img-element -- image paths are editable and may be any URL */
"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";

type Props = { images: string[]; alt: string };

export default function ImageGallery({ images, alt }: Props) {
  const [index, setIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-video items-center justify-center bg-cat-steel text-cat-line">
        <ImageIcon className="h-14 w-14" aria-label="No screenshot yet" />
      </div>
    );
  }

  const step = (delta: number) => setIndex((i) => (i + delta + images.length) % images.length);
  const arrowClass =
    "absolute top-1/2 -translate-y-1/2 rounded-full bg-cat-black/70 p-1.5 text-cat-yellow hover:bg-cat-black";

  return (
    <div className="relative aspect-video bg-cat-steel">
      <img
        src={images[index]}
        alt={`${alt} screenshot ${index + 1} of ${images.length}`}
        className="h-full w-full object-cover"
      />
      {images.length > 1 && (
        <>
          <button type="button" onClick={() => step(-1)} className={`${arrowClass} left-2`} aria-label="Previous image">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button type="button" onClick={() => step(1)} className={`${arrowClass} right-2`} aria-label="Next image">
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((src, i) => (
              <span
                key={src}
                className={`h-2 w-2 rounded-full ${i === index ? "bg-cat-yellow" : "bg-white/40"}`}
                aria-hidden
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
