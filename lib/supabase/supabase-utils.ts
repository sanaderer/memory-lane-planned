/* eslint-disable @typescript-eslint/no-unused-vars */
import { supabase } from "@/lib/supabase/supabase";

export async function uploadImageToSupabase(file: File): Promise<string | null> {
  try {
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const filePath = `memories/${fileName}`; 

    const { data, error } = await supabase.storage.from("memories").upload(filePath, file);

    if (error) {
      console.error("Error uploading image:", error);
      return null;
    }

    return supabase.storage.from("memories").getPublicUrl(filePath).data.publicUrl;
  } catch (error) {
    console.error("Unexpected error uploading image:", error);
    return null;
  }
}




