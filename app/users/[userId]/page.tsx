import { MemoriesList } from "@/components/memory/MemoriesList";
import { getMemoriesByUser } from "@/lib/services/memoryService";
import { getUserById } from "@/lib/services/userService";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function UserMemoriesPage({ params }: { params: Promise<{ userId: string }> }) {
  const resolvedParams = await params; 

  if (!resolvedParams?.userId) {
    notFound();
  }

  const userId = resolvedParams.userId;

  const user = await getUserById(userId);
  if (!user) {
    notFound();
  }

  const userMemories = await getMemoriesByUser(userId);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MemoriesList memories={userMemories} />
    </Suspense>
  );
}
