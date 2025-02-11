import { MemoriesList } from "@/components/memory/MemoriesList";
import { getMemoriesByUser } from "@/lib/services/memoryService";
import { getUserById } from "@/lib/services/userService";
import { notFound } from "next/navigation";
import { Suspense } from "react";
export default async function UserMemoriesPage({
  params,
}: {
  params: { userId: string };
}) {
  const { userId } = await params;

  if (!userId) {
    notFound();
  }

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
