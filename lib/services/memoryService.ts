"use server";

import { supabase } from "@/lib/supabase/supabase";
import { Memory } from "@/types";
import { revalidatePath } from "next/cache";
import { config } from "dotenv";

config();

type FilterType = "all" | "thisYear" | "lastYear";
type SortType = "newest" | "oldest";

interface GetMemoriesOptions {
  filter?: FilterType;
  sort?: SortType;
  limit?: number;
  offset?: number;
}

export async function getMemoriesByUser(userId: string, options: GetMemoriesOptions = {}): Promise<Memory[]> {
  if (!userId) {
    console.error("getMemoriesByUser: Missing userId");
    return [];
  }

  let query = supabase
    .from("memories")
    .select("id, title, description, image_url, created_at, date, user_id, location")
    .eq("user_id", userId);

  const currentYear = new Date().getFullYear();

  if (options.filter === "thisYear") {
    query = query.gte("date", `${currentYear}-01-01`).lt("date", `${currentYear + 1}-01-01`);
  } else if (options.filter === "lastYear") {
    query = query.gte("date", `${currentYear - 1}-01-01`).lt("date", `${currentYear}-01-01`);
  }

  query = query.order("date", { ascending: options.sort === "oldest" });

  if (options.limit) query = query.limit(options.limit);
  if (options.offset) query = query.range(options.offset, options.offset + (options.limit || 10) - 1);

  const { data, error } = await query;

  if (error) {
    console.error(`Error fetching memories for user ${userId}:`, error.message);
    return [];
  }

  return (
    data?.map((memory) => ({
      id: memory.id,
      title: memory.title,
      description: memory.description,
      image_url: memory.image_url || "",
      created_at: memory.created_at,
      date: memory.date || memory.created_at,
      user_id: memory.user_id,
      location: memory.location || "Unknown",
    })) ?? []
  );
}

export async function deleteMemory(memoryId: string, password: string) {
  if (!memoryId) throw new Error("Memory ID is required");

  if (password !== process.env.DELETE_CONFIRM_PASSWORD) {
    throw new Error("Invalid password");
  }

  const { error } = await supabase.from("memories").delete().eq("id", memoryId);

  if (error) {
    console.error("Error deleting memory:", error.message);
    throw new Error(error.message);
  }

  revalidatePath(`/users/`);

  return true;
}

export async function createMemory(memory: Memory, password: string) {
  if (!memory) throw new Error("Memory data is required");

  if (password !== process.env.DELETE_CONFIRM_PASSWORD) {
    throw new Error("Invalid password");
  }

  try {
    const { error } = await supabase.from("memories").insert(memory);

    if (error) {
      console.error("Error creating memory:", error.message);
      throw new Error(error.message);
    }

    revalidatePath(`/users/`);

    return true;
  } catch (err) {
    console.error("Unexpected error creating memory:", err);
    throw new Error("Failed to create memory. Please try again later.");
  }
}
