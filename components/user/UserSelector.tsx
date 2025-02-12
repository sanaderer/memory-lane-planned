"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion } from "framer-motion";
import type { User } from "@/types";
import { useUserStore } from "@/store/useUserStore";
import { cn } from "@/lib/utils/utils";

interface UserSelectionProps {
  initialUsers: User[];
}

export function UserSelection({ initialUsers }: UserSelectionProps) {
  const router = useRouter();
  const { currentUser, setCurrentUser, setAllUsers } = useUserStore();

  const handleUserSelect = useCallback(
    (user: User) => {
      setCurrentUser(user);
      setAllUsers(initialUsers);
    },
    [setCurrentUser, setAllUsers, initialUsers]
  );

  const handleContinue = () => {
    if (currentUser) {
      router.push(`/users/${currentUser.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 flex items-center justify-center">
      <div className="w-full max-w-5xl mx-auto">
        <div className="mb-12 text-center">
          <motion.h1
            className={`text-6xl text-gray-900 mb-4 font-handwriting`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Welcome to Memory Lane
          </motion.h1>
          <motion.p
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Your personal space to capture and share life&apos;s precious moments. Select your profile to continue your journey.
          </motion.p>
        </div>

        {initialUsers.length === 0 ? (
          <p className="text-center text-gray-500">No users found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {initialUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-full aspect-[3/4] flex flex-col items-center justify-center p-8 rounded-2xl transition-all duration-300",
                    "hover:shadow-lg hover:scale-105 hover:bg-white",
                    "border border-gray-200",
                    currentUser?.id === user.id && "bg-white ring-2 ring-black ring-offset-2"
                  )}
                  onClick={() => handleUserSelect(user)}
                >
                  <div className="relative w-28 h-28 sm:w-36 sm:h-36 mb-6 rounded-full overflow-hidden flex items-center justify-center">
                    <Image
                      src={user.avatar || "/placeholder.svg"}
                      alt={user.name}
                      fill
                      className="rounded-full object-cover object-center"
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <span className="text-xl font-semibold text-gray-800">{user.name}</span>
                </Button>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          className="mt-10 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Button
            onClick={handleContinue}
            disabled={!currentUser}
            className={cn(
              "px-8 py-4 text-base font-medium rounded-xl transition-all duration-300",
              "hover:scale-102 hover:shadow-lg",
              !currentUser ? "bg-gray-200 text-gray-400" : "bg-black text-white hover:bg-gray-900"
            )}
          >
            Continue to Your Lane
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
