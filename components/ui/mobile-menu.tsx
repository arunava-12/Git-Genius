"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { ThemeToggle } from "./theme-toggle"
import { UserAuthButton } from "@/components/auth/user-auth-button"

interface Route {
  name: string
  path: string
}

interface MobileMenuProps {
  routes: Route[]
}

export function MobileMenu({ routes }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const toggleMenu = () => setIsOpen(!isOpen)

  const menuVariants = {
    closed: {
      opacity: 0,
      y: "-100%",
      transition: {
        duration: 0.3,
        staggerChildren: 0.05,
        staggerDirection: -1,
        when: "afterChildren",
      },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05,
        staggerDirection: 1,
        when: "beforeChildren",
      },
    },
  }

  const itemVariants = {
    closed: { opacity: 0, y: -10 },
    open: { opacity: 1, y: 0 },
  }

  return (
    <div className="md:hidden">
      <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Toggle menu">
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed inset-x-0 top-16 z-50 bg-background/95 backdrop-blur-md border-b shadow-lg"
          >
            <div className="p-4 space-y-2">
              {routes.map((route) => (
                <motion.div key={route.path} variants={itemVariants}>
                  <Link
                    href={route.path}
                    className={cn(
                      "block px-3 py-3 rounded-md text-base font-medium transition-colors",
                      pathname === route.path ? "bg-primary/10 text-primary" : "hover:bg-muted",
                    )}
                    onClick={toggleMenu}
                  >
                    {route.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div variants={itemVariants} className="pt-2 flex items-center justify-between">
                <ThemeToggle />
                <UserAuthButton />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
