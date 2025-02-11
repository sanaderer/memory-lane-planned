import { z } from "zod";

export const memorySchema = z.object({
  id: z.string().uuid({
    message: "Invalid UUID format",
  }),
  title: z.string().min(3, { message: "Title must be at least 3 characters long" }),
  description: z.string().min(5, { message: "Description must be at least 5 characters" }),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  location: z.string().optional(),
  image_url: z.string().url({ message: "Please provide a valid URL" }).optional(),
});

export type MemorySchema = z.infer<typeof memorySchema>;

export function validateMemory(data: unknown) {
  try {
    return memorySchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors.map((err) => err.message);
    }
    throw error;
  }
}
