"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Filter, SortDesc, Plus, Check, X } from "lucide-react";
import Image from "next/image";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { User } from "@/types";
import { CopyToClipboard } from "@/lib/utils/copy-to-clipboard";
import { useToast } from "@/hooks/use-toast";
import clsx from "clsx";

interface ProfileHeaderProps {
  user: User;
  memoriesCount: number;
  onAddMemory: () => void;
  onSort: (type: "newest" | "oldest") => void;
  onFilter: (type: "all" | "thisYear" | "lastYear") => void;
  onClearFilters: () => void;
}

export function ProfileHeader({ user, onSort, onFilter, onAddMemory, onClearFilters }: ProfileHeaderProps) {
  const { toast } = useToast();
  const [isSharing, setIsSharing] = useState(false);

  const handleFilterChange = useCallback((type: "all" | "thisYear" | "lastYear") => () => onFilter(type), [onFilter]);
  const handleSortChange = useCallback((type: "newest" | "oldest") => () => onSort(type), [onSort]);
  const handleClearFilters = useCallback(() => onClearFilters(), [onClearFilters]);

  const handleShare = async () => {
    try {
      setIsSharing(true);
      await CopyToClipboard(window.location.href);
      toast({ title: "Link copied!", description: "The profile URL has been copied to your clipboard.", duration: 2000 });
      setTimeout(() => setIsSharing(false), 1000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try copying the URL manually.",
        variant: "destructive",
        duration: 2000,
      });
      setIsSharing(false);
      console.error(err);
    }
  };

  return (
    <div className="relative pt-2 px-4">
      <div className="h-40 relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500" />
      </div>

      <div className="relative px-6">
        <div className="absolute -top-16 left-8">
          <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-white shadow-xl">
            <Image
              src={user.avatar || "/placeholder.png"}
              alt={user.name}
              width={128}
              height={128}
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        <div className="pt-20 pl-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">{user.name}</h1>
              <p className="text-sm text-gray-600 mt-1 max-w-1xl">{user.bio || "No bio available"}</p>
            </div>

            <div className="flex items-center justify-between w-full sm:justify-end sm:w-auto gap-2 shrink-0">
              <Button
                onClick={onAddMemory}
                className="sm:order-2 bg-black hover:bg-stone-800 text-white shadow-sm transition-all duration-200 h-9 px-4"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Memory
              </Button>

              <div className="sm:order-1 bg-white/80 rounded-lg shadow-sm flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-gray-100/80">
                      <Filter className="h-4 w-4 text-gray-600" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="center" className="w-48 p-2">
                    <div className="flex flex-col space-y-1">
                      <Button variant="ghost" className="justify-start" onClick={handleFilterChange("all")}>
                        All Memories
                      </Button>
                      <Button variant="ghost" className="justify-start" onClick={handleFilterChange("thisYear")}>
                        This Year
                      </Button>
                      <Button variant="ghost" className="justify-start" onClick={handleFilterChange("lastYear")}>
                        Last Year
                      </Button>
                      <Button variant="ghost" className="justify-start text-red-500" onClick={onClearFilters}>
                        <X className="h-4 w-4 mr-2" /> Clear Filters
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-gray-100/80">
                      <SortDesc className="h-4 w-4 text-gray-600" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="center" className="w-48 p-2">
                    <div className="flex flex-col space-y-1">
                      <Button variant="ghost" className="justify-start" onClick={handleSortChange("newest")}>
                        Newest First
                      </Button>
                      <Button variant="ghost" className="justify-start" onClick={handleSortChange("oldest")}>
                        Oldest First
                      </Button>
                      <Button variant="ghost" className="justify-start text-red-500" onClick={handleClearFilters}>
                        <X className="h-4 w-4 mr-2" /> Clear Sorting
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>

                <Button
                  variant="ghost"
                  size="icon"
                  className={clsx("h-9 w-9 hover:bg-gray-100/80", { "text-green-500": isSharing })}
                  onClick={handleShare}
                >
                  {isSharing ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4 text-gray-600" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
