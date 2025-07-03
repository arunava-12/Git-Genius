"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { User } from "firebase/auth"

interface UserProfileAvatarProps {
  user: User | null
  className?: string
  size?: "sm" | "md" | "lg"
}

export function UserProfileAvatar({ user, className = "", size = "md" }: UserProfileAvatarProps) {
  if (!user) return null

  // Determine size classes
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
  }

  // Get the first letter of the user's name or email
  const getInitial = () => {
    if (user.displayName) {
      return user.displayName.charAt(0).toUpperCase()
    } else if (user.email) {
      return user.email.charAt(0).toUpperCase()
    }
    return "U"
  }

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      {user.photoURL ? (
        <AvatarImage src={user.photoURL} alt={user.displayName || "User"} />
      ) : (
        <AvatarFallback className="font-medium">{getInitial()}</AvatarFallback>
      )}
    </Avatar>
  )
}
