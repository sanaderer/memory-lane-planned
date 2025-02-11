"use server";

import { supabase } from "@/lib/supabase/supabase";
import type { Memory } from "@/types";
import { revalidatePath } from "next/cache";

export async function updateMemory(
  memoryId: string,
  updatedMemory: Partial<Memory>
) {
  if (!memoryId) throw new Error("Memory ID is required");

  const { data, error } = await supabase
    .from("memories")
    .update(updatedMemory)
    .eq("id", memoryId)
    .select()
    .single();

  revalidatePath(`/users/`);

  if (error) {
    console.error("Error updating memory:", error.message);
    throw new Error(error.message);
  }

  return data;
}
