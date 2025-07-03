"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UserAuthButton } from "@/components/auth/user-auth-button"
import { cn } from "@/lib/utils"
import { motion, useScroll, useMotionValueEvent } from "framer-motion"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import Image from "next/image"

export function Navbar({ transparent = false }: { transparent?: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const [visible, setVisible] = useState(false)
  const pathname = usePathname()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 100) {
      setVisible(true)
    } else {
      setVisible(false)
    }
  })

  const routes = [
    { name: "Home", path: "/" },
    { name: "AI Chat", path: "/ai-chat" },
    { name: "Generate README", path: "/generate-readme" },
    { name: "Git Mojis", path: "/git-mojis" },
    { name: "Repo Visualizer", path: "/repo-visualizer" },
  ]

  return (
    <motion.div ref={ref} className="fixed inset-x-0 top-0 z-50 w-full">
      <motion.div
        animate={{
          backdropFilter: !transparent && visible ? "blur(10px)" : "none",
          boxShadow: !transparent && visible
            ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
            : "none",
          width: !transparent && visible ? "40%" : "100%",
          y: !transparent && visible ? 20 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 50,
        }}
        style={{
          minWidth: "800px",
        }}
        className={cn(
          "relative z-[60] mx-auto hidden w-full max-w-7xl flex-row items-center justify-between self-start rounded-full px-4 py-3 lg:flex",
          visible
            ? "bg-white/80 dark:bg-neutral-950/80"
            : "bg-white/40 dark:bg-neutral-950/40",
        )}
      >
        <div className="flex items-center z-10">
  <Link href="/" className="flex items-center gap-2">
  <Image
  src="/gitgenius.png"
  alt="GitGenius Logo"
  width={80}
  height={80}
  className="animate-glow"
/>

  </Link>
</div>


        <motion.div className="absolute inset-0 hidden flex-1 flex-row items-center justify-center space-x-2 text-sm font-medium text-zinc-600 transition duration-200 hover:text-zinc-800 lg:flex lg:space-x-2 pointer-events-none">
          {routes.map((route) => {
            const isActive = pathname === route.path;
            return (
              <Link
                key={route.path}
                href={route.path}
                className={cn(
                  "relative px-4 py-2 text-neutral-600 dark:text-neutral-300 pointer-events-auto transition-all duration-200 rounded-full",
                  isActive &&
                    "bg-primary/15 text-primary font-semibold shadow-md",
                )}
                style={{
                  boxShadow: isActive
                    ? "0 2px 8px 0 rgba(80, 72, 229, 0.08)"
                    : undefined,
                }}
              >
                {route.name}
                {isActive && (
                  <span
                    className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 h-1 w-6 rounded-full bg-primary/80 dark:bg-primary/60 shadow"
                  />
                )}
              </Link>
            );
          })}
        </motion.div>

        <div className={`flex items-center z-10 ${visible ? "gap-1" : "gap-4"}`}>
          <ThemeToggle />
          <UserAuthButton />
        </div>
      </motion.div>

      {/* Mobile navigation */}
      <motion.div
        animate={{
          backdropFilter: !transparent && visible ? "blur(10px)" : "none",
          boxShadow: !transparent && visible
            ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
            : "none",
          width: !transparent && visible ? "90%" : "100%",
          paddingRight: !transparent && visible ? "12px" : "0px",
          paddingLeft: !transparent && visible ? "12px" : "0px",
          borderRadius: !transparent && visible ? "4px" : "2rem",
          y: !transparent && visible ? 20 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 50,
        }}
        className={cn(
          "relative z-50 mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between px-0 py-2 lg:hidden",
          visible
            ? "bg-white/80 dark:bg-neutral-950/80"
            : "bg-white/40 dark:bg-neutral-950/40",
        )}
      >
        <div className="flex w-full flex-row items-center justify-between">
          <Link href="/" className="flex items-center">
            <span className="font-bold text-lg">Git-Genius</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute inset-x-0 top-16 z-50 flex w-full flex-col items-start justify-start gap-4 rounded-lg bg-white/90 dark:bg-neutral-950/90 backdrop-blur-lg px-4 py-8 shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
          >
            {routes.map((route) => (
              <Link
                key={route.path}
                href={route.path}
                className={cn(
                  "block w-full px-3 py-2 rounded-md text-base font-medium transition-colors",
                  pathname === route.path ? "bg-primary/10 text-primary" : "hover:bg-muted",
                )}
                onClick={() => setIsOpen(false)}
              >
                {route.name}
              </Link>
            ))}
            <div className="pt-2 flex items-center gap-2">
              <ThemeToggle />
              <UserAuthButton />
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}
