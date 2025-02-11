"use client";

import type { User } from "@/types";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";

export function Header() {
  const { currentUser, setCurrentUser, allUsers } = useUserStore();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleUserChange = (user: User) => {
    setCurrentUser(user);
    router.push(`/users/${user.id}`);
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
            <span className="font-bold text-xl">Memory Lane</span>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          {allUsers.length > 0 ? (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
                  <Avatar className="h-5 w-5 mr-2">
                    <AvatarImage src={currentUser?.avatar || "/placeholder.png"} />
                    <AvatarFallback>{currentUser?.name?.[0] || "?"}</AvatarFallback>
                  </Avatar>
                  {currentUser?.name || "Select User"}
                  <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-2">
                {allUsers.map((user) => (
                  <Button key={user.id} variant="ghost" className="w-full justify-start" onClick={() => handleUserChange(user)}>
                    <Avatar className="h-5 w-5 mr-2">
                      <AvatarImage src={user.avatar || "/placeholder.png"} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    {user.name}
                  </Button>
                ))}
              </PopoverContent>
            </Popover>
          ) : (
            <p className="text-sm text-gray-500">No users found</p>
          )}
        </div>
      </div>
    </header>
  );
}
