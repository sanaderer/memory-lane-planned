'use server';

import { supabase } from "@/lib/supabase/supabase";

export async function uploadImage(file: File): Promise<string | null> {
  try {
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const filePath = `memories/${fileName}`;

    const { error } = await supabase.storage.from("memories").upload(filePath, file);
    if (error) throw new Error(error.message);

    const { data } = supabase.storage.from("memories").getPublicUrl(filePath);
    if (!data) throw new Error("Failed to retrieve public URL");

    return data.publicUrl;
  } catch (error) {
    console.error("Image upload error:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to upload image.");
  }
}
