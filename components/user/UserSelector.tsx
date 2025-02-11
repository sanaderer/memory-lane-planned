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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <motion.h1
          className="text-4xl font-bold text-center mb-12 text-gray-800"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Choose Your Profile
        </motion.h1>

        {initialUsers.length === 0 ? (
          <p className="text-center text-gray-500">No users found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
                    "w-full h-full aspect-square flex flex-col items-center justify-center p-6 rounded-2xl transition-all duration-300",
                    "hover:shadow-lg hover:scale-105 hover:bg-white",
                    "border border-gray-200",
                    currentUser?.id === user.id && "bg-white ring-2 ring-black ring-offset-2"
                  )}
                  onClick={() => handleUserSelect(user)}
                >
                  <div className="relative w-32 h-32 mb-6">
                    <Image
                      src={user.avatar || "/placeholder.svg"}
                      alt={user.name}
                      fill
                      className="rounded-full object-cover ring-4 ring-gray-50"
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
          className="mt-12 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Button
            onClick={handleContinue}
            disabled={!currentUser}
            className={cn(
              "px-12 py-6 text-lg font-medium rounded-xl transition-all duration-300",
              "hover:scale-105 hover:shadow-lg",
              !currentUser ? "bg-gray-200 text-gray-400" : "bg-black text-white hover:bg-gray-900"
            )}
          >
            Continue
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
