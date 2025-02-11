import Image from "next/image";

interface MemoryCardImageCarouselProps {
  images: string[];
}

export function MemoryCardImageCarousel({ images }: MemoryCardImageCarouselProps) {
  return (
    <div className="relative aspect-[3/3] overflow-hidden rounded-lg">
      <Image
        src={images[0] || "/placeholder.png"}
        alt="Uploaded image"
        fill
        className="object-cover"
        priority
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
}
