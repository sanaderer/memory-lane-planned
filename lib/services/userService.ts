"use server";

import { createClient } from "@supabase/supabase-js";
import { User } from "@/types";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getAllUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from("users")
    .select("id, name, avatar, bio");

  if (error) {
    console.error("Error fetching users:", error);
    return [];
  }
  return data || [];
}

export async function getUserById(userId: string): Promise<User | null> {
  if (!userId) return null;
  const { data } = await supabase
    .from("users")
    .select("id, name, avatar, bio")
    .eq("id", userId)
    .single();

  if (!data) {
    console.log(`User with ID ${userId} not found`);
    return null;
  }

  return data;
}
