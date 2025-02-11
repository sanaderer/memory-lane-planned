import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MemoryCardImageCarousel } from "@/components/memory/MemoryCardImageCarousel";
import { useMemoryEdit } from "@/hooks/useMemoryEdit";
import type { Memory } from "@/types";
import { MapPin, Trash, Edit, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { deleteMemory } from "@/lib/services/memoryService";
import { updateMemory } from "@/lib/services/updateMemoryService";

interface MemoryDetailModalProps {
  memory: Memory;
  isOpen: boolean;
  onClose: () => void;
}

export function MemoryDetailModal({ memory, isOpen, onClose }: MemoryDetailModalProps) {
  const { editedMemory, setEditedMemory, isEditing, setIsEditing } = useMemoryEdit(memory);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const { toast } = useToast();

  const handleSaveEdit = async () => {
    try {
      const updatedMemoryData = {
        title: editedMemory.title,
        description: editedMemory.description,
        date: editedMemory.date,
        location: editedMemory.location || null,
      };

      const memoryToUpdate = {
        ...updatedMemoryData,
        location: updatedMemoryData.location || undefined,
      };

      const result = await updateMemory(memory.id, memoryToUpdate);

      if (result) {
        toast({
          title: "Memory Updated",
          description: "Your memory has been successfully updated.",
        });

        setIsEditing(false);
      } else {
        toast({
          title: "Update Failed",
          description: "Unable to update the memory. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred while updating the memory.",
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditedMemory(memory);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    try {
      await deleteMemory(memory.id);
      toast({ title: "Memory deleted", description: "Successfully deleted." });

      onClose();
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Memory" : "Memory Details"}</DialogTitle>
          </DialogHeader>

          {isEditing ? (
            <div className="space-y-4">
              <Input
                value={editedMemory.title}
                onChange={(e) => setEditedMemory({ ...editedMemory, title: e.target.value })}
                placeholder="Title"
              />
              <Textarea
                value={editedMemory.description}
                onChange={(e) =>
                  setEditedMemory({
                    ...editedMemory,
                    description: e.target.value,
                  })
                }
                placeholder="Description"
              />
              <Input
                type="date"
                value={editedMemory.date}
                onChange={(e) => setEditedMemory({ ...editedMemory, date: e.target.value })}
              />
              <Input
                value={editedMemory.location || ""}
                onChange={(e) => setEditedMemory({ ...editedMemory, location: e.target.value })}
                placeholder="Location"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <MemoryCardImageCarousel images={memory.image_url ? [memory.image_url] : []} />
              <h3 className="text-2xl font-semibold">{memory.title}</h3>
              <p className="text-muted-foreground">{memory.description}</p>

              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{memory.location || "Unknown location"}</span>
                </div>
                <div>
                  {new Date(memory.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancelEdit}>
                  <X className="h-4 w-4 mr-1" /> Cancel
                </Button>
                <Button onClick={handleSaveEdit}>Save Changes</Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button variant="destructive" onClick={() => setIsConfirmingDelete(true)}>
                  <Trash className="h-4 w-4 mr-2" /> Delete
                </Button>
                <Button onClick={onClose}>Close</Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isConfirmingDelete} onOpenChange={setIsConfirmingDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">Are you sure you want to delete this memory? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmingDelete(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash className="h-4 w-4 mr-2" /> Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
