"use client";
import { MemoryCard } from "./MemoryCard";
import { MemoryModal } from "./MemoryModal";
import { useQueryParams } from "@/hooks/useQueryParams";
import { Memory } from "@/types";
import { useUserStore } from "@/store/useUserStore";
import { Header } from "../layout/Header";
import { ProfileHeader } from "../layout/ProfileHeader";
import { useState } from "react";

interface MemoriesListProps {
  memories: Memory[];
}

export function MemoriesList({ memories }: MemoriesListProps) {
  const { filterType, sortOrder, updateQueryParams } = useQueryParams();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { currentUser } = useUserStore();

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
            {Object.entries(groupedMemories).sort(([yearA], [yearB]) => Number(yearB) - Number(yearA)).map(([year, yearMemories]) => (
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
