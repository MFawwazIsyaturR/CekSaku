import { ChevronDown, LogOut, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Ganti ini dari 'next/router'

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export function UserNav({
  userName,
  profilePicture,
  onLogout,
}: {
  userName: string;
  profilePicture: string;
  onLogout: () => void;
}) {
  const navigate = useNavigate(); 

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative !bg-transparent h-8 w-auto px-2 rounded-full !gap-1 !cursor-pointer"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={profilePicture || ""} />
            <AvatarFallback className="!bg-[var(--secondary-dark-color)] border !border-gray-700 !text-white">
              {userName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <ChevronDown className="!w-3 !h-3 text-white" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-56 !bg-[var(--secondary-dark-color)] !text-white !border-gray-700"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="flex flex-col items-start gap-1">
          <span className="font-semibold">{userName}</span>
          
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="!bg-gray-700" />

        <DropdownMenuGroup>
          <DropdownMenuItem
            className="hover:!bg-gray-800 hover:!text-white"
            onClick={() => navigate("/settings")}
          >
            <Settings className="w-4 h-4 mr-2" />
            Pengaturan
          </DropdownMenuItem>

          <DropdownMenuItem
            className="hover:!bg-gray-800 hover:!text-white"
            onClick={onLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Keluar
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
