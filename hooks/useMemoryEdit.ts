"use client";

import { useState } from "react";
import type { Memory } from "@/types";
import { updateMemory } from "@/lib/services/updateMemoryService";

export function useMemoryEdit(initialMemory: Memory) {
  const [editedMemory, setEditedMemory] = useState(initialMemory);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const resetEdit = () => {
    setEditedMemory(initialMemory);
    setIsEditing(false);
    setUpdateError(null);
  };

  const saveEdit = async () => {
    setIsUpdating(true);
    setUpdateError(null);

    try {
      const updated = await updateMemory(editedMemory.id, editedMemory);
      setEditedMemory(updated); 
      setIsEditing(false);
    } catch (error) {
      setUpdateError(error instanceof Error ? error.message : "Update failed");
    } finally {
      setIsUpdating(false);
    }
  };

  return { editedMemory, setEditedMemory, isEditing, setIsEditing, resetEdit, saveEdit, isUpdating, updateError };
}
