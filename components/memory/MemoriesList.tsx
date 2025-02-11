"use client";
import { MemoryCard } from "./MemoryCard";
import { MemoryModal } from "./MemoryModal";
import { useQueryParams } from "@/hooks/useQueryParams";
import { Memory } from "@/types";
import { useUserStore } from "@/store/useUserStore";
import { Header } from "../layout/Header";
import { ProfileHeader } from "../layout/ProfileHeader";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface MemoriesListProps {
  memories: Memory[];
}

export function MemoriesList({ memories }: MemoriesListProps) {
  const { filterType, sortOrder, updateQueryParams } = useQueryParams();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { currentUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="border-b">
          <div className="relative">
            <Skeleton className="w-full h-48" />
            <div className="container mx-auto px-4">
              <div className="relative -mt-16 pb-6">
                <div className="flex justify-between">
                  <div className="flex flex-col items-start space-y-4">
                    <Skeleton className="h-32 w-32 rounded-full border-4 border-background" />
                    <div className="space-y-2">
                      <Skeleton className="h-8 w-48" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                  <div className="flex gap-4 self-end mb-2">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-32" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto">
            {[...Array(3)].map((_, yearIndex) => (
              <div key={yearIndex} className="mb-16">
                <h2 className="font-handwriting text-6xl text-center mb-16">
                  <Skeleton className="h-16 w-32 mx-auto" />
                </h2>
                <div className="grid grid-cols-1 gap-16 relative">
                  {[...Array(3)].map((_, memoryIndex) => (
                    <div key={memoryIndex} className="relative">
                      {memoryIndex < 2 && <div className="absolute left-1/2 top-full h-16 w-px bg-gray-200 -translate-x-1/2" />}
                      <div className="flex items-center justify-center min-h-[500px]">
                        <div className="w-96 bg-white shadow-xl transform transition-all duration-200 hover:scale-105 hover:rotate-1 overflow-hidden rounded-sm">
                          <Skeleton className="aspect-[16/9] w-full" />
                          <div className="p-4">
                            <Skeleton className="h-7 w-4/5 mb-3" />
                            <div className="space-y-2 mb-4">
                              <Skeleton className="h-4 w-full" />
                              <Skeleton className="h-4 w-4/5" />
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-1">
                                <Skeleton className="h-4 w-4 rounded-full" />
                                <Skeleton className="h-3 w-24" />
                              </div>
                              <Skeleton className="h-3 w-16" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const filteredAndSortedMemories = memories
    ?.filter((memory) => {
      const date = new Date(memory.date);
      const now = new Date();
      const thisYear = now.getFullYear();

      switch (filterType) {
        case "thisYear":
          return date.getFullYear() === thisYear;
        case "lastYear":
          return date.getFullYear() === thisYear - 1;
        default:
          return true;
      }
    })
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

  const groupedMemories = filteredAndSortedMemories.reduce((groups, memory) => {
    const year = new Date(memory.date).getFullYear();
    if (!groups[year]) {
      groups[year] = [];
    }
    groups[year].push(memory);
    return groups;
  }, {} as Record<number, Memory[]>);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {currentUser && (
        <ProfileHeader
          memoriesCount={filteredAndSortedMemories.length}
          user={currentUser}
          onAddMemory={() => setIsAddModalOpen(true)}
          onSort={(type) => updateQueryParams({ sort: type })}
          onFilter={(type) => updateQueryParams({ filter: type })}
          onClearFilters={() => updateQueryParams({ sort: undefined, filter: undefined })}
        />
      )}

      <main className="container mx-auto px-4 py-8">
        {filteredAndSortedMemories.length > 0 ? (
          <div className="max-w-5xl mx-auto">
            {Object.entries(groupedMemories)
              .sort(([yearA], [yearB]) =>
                sortOrder === "newest" ? Number(yearB) - Number(yearA) : Number(yearA) - Number(yearB)
              )
              .map(([year, yearMemories]) => (
                <div key={year} className="mb-16">
                  <h2 className="font-handwriting text-6xl text-center mb-16">{year}</h2>
                  <div className="grid grid-cols-1 gap-16 relative">
                    {yearMemories.map((memory, index) => (
                      <div key={memory.id} className="relative">
                        {index < yearMemories.length - 1 && (
                          <div className="absolute left-1/2 top-full h-16 w-px bg-gray-200 -translate-x-1/2" />
                        )}
                        <MemoryCard memory={memory} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="h-[50vh] flex items-center justify-center">
            <p className="text-gray-500 text-lg">No memories found.</p>
          </div>
        )}
      </main>

      <MemoryModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
}
