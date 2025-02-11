import { useState } from "react";
import { MemoryDetailModal } from "@/components/memory/MemoryDetailModal";
import { MemoryCardImageCarousel } from "@/components/memory/MemoryCardImageCarousel";
import { MapPin } from "lucide-react";
import type { Memory } from "@/types";

interface MemoryCardProps {
  memory: Memory;
}

export function MemoryCard({ memory }: MemoryCardProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const images = memory.image_url ? [memory.image_url] : [];

  return (
    <>
      <div className="flex items-center justify-center min-h-[500px]">
        <div
          className="w-96 bg-white shadow-xl transform transition-all duration-200 hover:scale-105 hover:rotate-1 relative cursor-pointer"
          onClick={() => setIsDetailOpen(true)}
        >
          <MemoryCardImageCarousel images={images} />
          <div className="p-4 bg-white">
            <h3 className="font-handwriting text-xl mb-2 line-clamp-1">{memory.title}</h3>
            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{memory.description}</p>
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <div className="flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                <span className="line-clamp-1">{memory.location || "Unknown location"}</span>
              </div>
              <div>
                {new Date(memory.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <MemoryDetailModal memory={memory} isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} />
    </>
  );
}
