import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/context/auth-context"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Git Genius - Make Git Simple Again",
  description:
    "Git Genius simplifies complex Git workflows, making version control intuitive and collaborative for developers of all skill levels.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <Suspense>{children}</Suspense>
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
