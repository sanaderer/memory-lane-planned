"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { createMemory } from "@/lib/services/memoryService";
import { uploadImage } from "@/lib/services/uploadService";
import { useUserStore } from "@/store/useUserStore";

interface MemoryFormProps {
  onClose?: () => void;
}

export function MemoryForm({ onClose }: MemoryFormProps) {
  const { currentUser } = useUserStore();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    created_at: "",
    user_id: currentUser?.id,
    imageUrl: "",
    file: null as File | null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = useCallback(() => {
    setFormData({
      title: "",
      description: "",
      date: "",
      location: "",
      created_at: "",
      user_id: currentUser?.id,
      imageUrl: "",
      file: null,
    });
    setError(null);
  }, [currentUser?.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFormData((prev) => ({
        ...prev,
        file: selectedFile,
        imageUrl: URL.createObjectURL(selectedFile),
      }));
    }
  };

  useEffect(() => {
    return () => {
      if (formData.imageUrl) {
        URL.revokeObjectURL(formData.imageUrl);
      }
    };
  }, [formData.imageUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);

    if (!formData.title.trim() || !formData.description.trim() || !formData.date || !formData.location.trim()) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      let uploadedImageUrl = formData.imageUrl;

      if (formData.file) {
        const uploadResult = await uploadImage(formData.file);
        if (!uploadResult) throw new Error("Failed to upload image.");
        uploadedImageUrl = uploadResult;
      }

      const newMemory = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        date: formData.date,
        image_url: uploadedImageUrl,
        location: formData.location.trim(),
        user_id: currentUser?.id || "",
        created_at: new Date().toISOString(),
      };

      await createMemory(newMemory);

      resetForm();
      if (onClose) onClose();
    } catch (err) {
      setError("Failed to add memory. Please try again.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="relative w-full h-48 mb-4 bg-gray-100 rounded-t-lg overflow-hidden group">
        {formData.imageUrl ? (
          <>
            <Image src={formData.imageUrl} alt="Memory Preview" fill className="object-cover" priority />
            <label
              htmlFor="file-upload"
              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center"
            >
              <div className="text-center text-white">
                <div className="flex justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-12 w-12"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                </div>
                <span className="mt-2 block text-sm font-medium">Click to change image</span>
              </div>
            </label>
          </>
        ) : (
          <label htmlFor="file-upload" className="cursor-pointer flex items-center justify-center h-full">
            <div className="text-center">
              <div className="flex justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-12 w-12 text-gray-400"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                </svg>
              </div>
              <span className="mt-2 block text-sm font-medium text-gray-600">Click to add a cover image</span>
            </div>
          </label>
        )}
        <Input id="file-upload" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleInputChange} required />
        <Textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleInputChange}
          required
        />
        <Input type="date" name="date" value={formData.date} onChange={handleInputChange} required />
        <Input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleInputChange}
          required
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Saving..." : "Add Memory"}
        </Button>
      </form>
    </div>
  );
}
