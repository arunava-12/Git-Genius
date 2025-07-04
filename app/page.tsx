"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion";
import {
  Code,
  GitBranch,
  GitPullRequest,
  FileText,
  Sparkles,
  FileCode,
  GitCommit,
  MessageSquare,
  User,
  Smile,
  Clock,
  GitGraph,
  Zap,
  HelpCircle,
} from "lucide-react";
import React from "react";
import { AnimatePresence } from "framer-motion";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { useTheme } from "next-themes";
import BadgeShine from "@/components/ui/badge-shine";
import TextAnimatedGradient from "@/components/ui/text-animated-gradient";
import { AnimatedBeams } from "@/components/ui/animated-beams";
import { Navbar } from "@/components/ui/navbar";
import { DynamicStars } from "@/components/core/dynamic-stars";

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const heroRef = useRef(null);
  const howItWorksRef = useRef(null);
  const { theme, setTheme } = useTheme();
  const isHowItWorksInView = useInView(howItWorksRef, {
    once: false,
    amount: 0.2,
  });

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const { scrollYProgress: howItWorksScrollProgress } = useScroll({
    target: howItWorksRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const springY = useSpring(y, { stiffness: 100, damping: 30 });
  const springOpacity = useSpring(opacity, { stiffness: 100, damping: 30 });

  // Scroll-driven animations for How It Works section
  const sectionScale = useTransform(
    howItWorksScrollProgress,
    [0, 0.2],
    [0.95, 1]
  );
  const sectionOpacity = useTransform(
    howItWorksScrollProgress,
    [0, 0.2],
    [0.5, 1]
  );
  // State for interactive elements in the How It Works section
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const textVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Define the bento grid cards for the How It Works section
  const bentoCards = [
    {
      id: 1,
      title: "Git and GitHub Helper",
      description:
        "Navigate complex Git workflows with ease, get command suggestions, and resolve common issues with our intelligent assistant.",
      icon: <GitBranch className="w-8 h-8" />,
      color: "from-purple-500 to-indigo-600",
      lightColor: "from-purple-400 to-indigo-500",
      bgLight: "bg-gradient-to-br from-purple-50 to-indigo-50",
      bgDark: "bg-gradient-to-br from-purple-900/20 to-indigo-900/20",
      nodeIcon: <Code className="w-3 h-3" />,
      secondaryIcon: <GitCommit className="w-3 h-3" />,
      pattern: "linear",
      link: "/ai-chat",
    },
    {
      id: 2,
      title: "GitHub Repo Generator",
      description:
        "Create professional README files and project documentation automatically with our AI-powered generator for any repository.",
      icon: <FileCode className="w-8 h-8" />,
      color: "from-purple-500 to-indigo-600",
      lightColor: "from-purple-400 to-indigo-500",
      bgLight: "bg-gradient-to-br from-purple-50 to-indigo-50",
      bgDark: "bg-gradient-to-br from-purple-900/20 to-indigo-900/20",
      nodeIcon: <FileText className="w-3 h-3" />,
      pattern: "hexagon",
      link: "/generate-readme",
    },
    {
      id: 3,
      title: "AI Chat",
      description:
        "Get instant answers to your Git and GitHub questions with our specialized AI chatbot that understands developer workflows.",
      icon: <MessageSquare className="w-8 h-8" />,
      color: "from-purple-500 to-indigo-600",
      lightColor: "from-purple-400 to-indigo-500",
      bgLight: "bg-gradient-to-br from-purple-50 to-indigo-50",
      bgDark: "bg-gradient-to-br from-purple-900/20 to-indigo-900/20",
      nodeIcon: <User className="w-3 h-3" />,
      pattern: "radial",
      link: "/ai-chat",
    },
    {
      id: 4,
      title: "GitHub Emoji Generator",
      description:
        "Create expressive commit messages with the perfect emojis that follow Git commit conventions and enhance readability.",
      icon: <Smile className="w-8 h-8" />,
      color: "from-purple-500 to-indigo-600",
      lightColor: "from-purple-400 to-indigo-500",
      bgLight: "bg-gradient-to-br from-purple-50 to-indigo-50",
      bgDark: "bg-gradient-to-br from-purple-900/20 to-indigo-900/20",
      nodeIcon: <Sparkles className="w-3 h-3" />,
      pattern: "orbit",
      link: "/git-mojis",
    },
    {
      id: 5,
      title: "GitHub Repository Visualization",
      description:
        "Turn any GitHub repository into an interactive diagram for visualization in seconds. Perfect for understanding complex codebases and explaining project architecture.",
      icon: <GitGraph className="w-8 h-8" />,
      color: "from-purple-500 to-indigo-600",
      lightColor: "from-purple-400 to-indigo-500",
      bgLight: "bg-gradient-to-br from-purple-50 to-indigo-50",
      bgDark: "bg-gradient-to-br from-purple-900/20 to-indigo-900/20",
      nodeIcon: <GitCommit className="w-3 h-3" />,
      secondaryIcon: <FileCode className="w-3 h-3" />,
      pattern: "circular",
      link: "/repo-visualizer",
    },
  ];

  // Add state for controlling animation sequence
  const [showWelcome, setShowWelcome] = useState(true);
  const [showUserPrompt, setShowUserPrompt] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const [showResponse, setShowResponse] = useState(false);

  // Add useEffect for animation sequence
  useEffect(() => {
    const sequence = async () => {
      // Reset all states
      setShowWelcome(false);
      setShowUserPrompt(false);
      setShowTyping(false);
      setShowResponse(false);

      // Wait a moment before starting
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Start sequence
      setShowWelcome(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setShowUserPrompt(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setShowTyping(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setShowResponse(true);
      await new Promise((resolve) => setTimeout(resolve, 4000));
    };

    // Run sequence and repeat
    const runSequence = () => {
      sequence();
      const interval = setInterval(sequence, 11500); // Total duration of sequence
      return () => clearInterval(interval);
    };

    runSequence();
  }, []);

  return (
    <div className="flex min-h-screen flex-col relative overflow-hidden">
      {/* Noise overlay */}
      <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.015] bg-repeat bg-noise"></div>
      {/* Dynamic Stars background */}
      <DynamicStars count={15} />

      {/* Animated beams background */}
      <AnimatedBeams className="z-0" />

      {/* Modern Navbar */}
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section
          ref={heroRef}
          className="relative overflow-hidden py-20 md:py-40"
        >
          <motion.div
            className="absolute inset-0 -z-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 50% 0%, hsl(var(--primary)/0.2) 0%, transparent 50%)",
              y: springY,
              opacity: springOpacity,
            }}
          />
          <div className="absolute inset-0 -z-10 bg-grid-pattern opacity-[0.02]"></div>

          <div className="container relative z-10">
            <motion.div
              className="mx-auto max-w-3xl text-center"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div variants={textVariant} transition={{ type: "spring", stiffness: 100, damping: 15 }} className="mb-6">
                <BadgeShine>AI-Powered Git Assistant</BadgeShine>
              </motion.div>
              <motion.h1
                className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6"
                variants={textVariant}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
              >
                Make Git <TextAnimatedGradient>Simple</TextAnimatedGradient>{" "}
                Again
              </motion.h1>
              <motion.p
                className="mt-6 text-lg text-muted-foreground md:text-xl"
                variants={textVariant}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
              >
                Git Genius simplifies complex Git workflows with AI assistance,
                making version control intuitive and collaborative for
                developers of all skill levels.
              </motion.p>
            </motion.div>

            {/* AI Chatbot Interface */}
            <motion.div
              className="mt-12 mx-auto max-w-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="rounded-xl border bg-card shadow-xl overflow-hidden">
                {/* Chat Header */}
                <div className="flex items-center justify-between border-b p-6 bg-muted/30"></div>

                {/* Chat Messages */}
                <div className="p-6 h-[500px] overflow-y-auto bg-muted/10">
                  <AnimatePresence>
                    {showWelcome && (
                      <motion.div
                        key="welcome"
                        className="flex gap-3 mb-4"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center">
                          <GitBranch className="h-4 w-4 text-primary" />
                        </div>
                        <div className="bg-muted/30 rounded-lg rounded-tl-none p-3 max-w-[80%]">
                          <p className="text-sm">
                            Hi there! I'm Git Genius, your AI assistant for Git.
                            How can I help you today?
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {showUserPrompt && (
                      <motion.div
                        key="user-prompt"
                        className="flex flex-row-reverse gap-3 mb-4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="h-8 w-8 rounded-full bg-primary flex-shrink-0 flex items-center justify-center">
                          <User className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <div className="bg-primary text-primary-foreground rounded-lg rounded-tr-none p-3 max-w-[80%]">
                          <p className="text-sm">
                            How to revert the last commit?
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {showTyping && (
                      <motion.div
                        key="typing"
                        className="flex gap-3 mb-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center">
                          <GitBranch className="h-4 w-4 text-primary" />
                        </div>
                        <div className="bg-muted/30 rounded-lg rounded-tl-none p-3">
                          <div className="flex space-x-1">
                            <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]"></div>
                            <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]"></div>
                            <div className="h-2 w-2 animate-bounce rounded-full bg-primary"></div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {showResponse && (
                      <motion.div
                        key="response"
                        className="flex gap-3"
                        initial={{ opacity: 0, height: 0, overflow: "hidden" }}
                        animate={{
                          opacity: 1,
                          height: "auto",
                          overflow: "visible",
                        }}
                        exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center">
                          <GitBranch className="h-4 w-4 text-primary" />
                        </div>
                        <div className="bg-muted/30 rounded-lg rounded-tl-none p-3 max-w-[85%]">
                          <p className="text-sm mb-2">
                            There are two main ways to revert the last commit:
                          </p>
                          <div className="mb-2">
                            <p className="text-sm font-medium mb-1">
                              Option 1: Using git reset (if not pushed)
                            </p>
                            <div className="bg-background/80 p-2 rounded text-xs font-mono mb-1 overflow-x-auto">
                              git reset --soft HEAD~1
                            </div>
                            <p className="text-xs text-muted-foreground">
                              This keeps your changes but undoes the commit.
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium mb-1">
                              Option 2: Using git revert (safer option)
                            </p>
                            <div className="bg-background/80 p-2 rounded text-xs font-mono mb-1 overflow-x-auto">
                              git revert HEAD
                            </div>
                            <p className="text-xs text-muted-foreground">
                              This creates a new commit that undoes the changes
                              from the last commit.
                            </p>
                          </div>
                          <div className="mt-2 pt-2 border-t border-border/30">
                            <p className="text-xs text-primary">
                              💡 Tip: Use git revert if you've already pushed
                              your changes to a shared repository.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
        </section>

        <section
          id="how-it-works"
          className="py-28 md:py-36 relative overflow-hidden"
          ref={howItWorksRef}
        >
          {/* Background elements */}
          <div className="absolute inset-0 -z-10 bg-grid-pattern-enhanced opacity-5"></div>
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-background/80 to-background/20"></div>

          {/* Light theme specific background */}
          <div className="absolute inset-0 -z-10 light-theme-bg opacity-10 dark:opacity-0"></div>

          {/* Dark theme specific background */}
          <div className="absolute inset-0 -z-10 dark:bg-black/50 opacity-0 dark:opacity-70"></div>

          {/* Animated background elements */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/5 blur-3xl"
            animate={
              isHowItWorksInView
                ? {
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }
                : {}
            }
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />

          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl"
            animate={
              isHowItWorksInView
                ? {
                    scale: [1.2, 1, 1.2],
                    opacity: [0.2, 0.4, 0.2],
                  }
                : {}
            }
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              delay: 2,
            }}
          />

          {/* <div className="hidden dark:block" suppressHydrationWarning>
            {Array.from({ length: 50 }).map((_, i) => {
              // Use fixed values based on index
              const width = 1 + (i % 3) * 0.5;
              const height = 1 + ((i + 1) % 3) * 0.5;
              const top = (i * 2) % 100;
              const left = (i * 3 + 10) % 100;
              const opacity = 0.1 + (i % 5) * 0.1;
              const delay = (i % 5) * 0.5;
              const duration = 2 + (i % 3);

              return (
                <div
                  key={i}
                  className="absolute bg-white rounded-full twinkle"
                  style={{
                    width: `${width}px`,
                    height: `${height}px`,
                    top: `${top}%`,
                    left: `${left}%`,
                    opacity,
                    animationDelay: `${delay}s`,
                    animationDuration: `${duration}s`,
                  }}
                />
              );
            })}
          </div> */}

          <motion.div
            className="container mx-auto relative"
            style={{
              scale: sectionScale,
              opacity: sectionOpacity,
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-gradient-to-r from-primary/20 to-indigo-500/20 dark:from-primary/30 dark:to-indigo-500/30 text-primary dark:text-primary-foreground text-sm font-medium mb-4">
                <Zap className="w-4 h-4 mr-2" />
                Powerful Tools
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                How Git Genius <span className="text-gradient">Works</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Discover our suite of tools designed to make Git and GitHub
                workflows simpler and more efficient for developers.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {bentoCards.map((card, index) => {
                // Make the GitHub Repository Visualization card full width
                const isFullWidth = card.id === 5;
                return (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className={`${
                      isFullWidth ? "md:col-span-2" : ""
                    } bento-card group`}
                    whileHover={{
                      scale: 1.02,
                      transition: { duration: 0.2 },
                    }}
                  >
                    <Link href={card.link} className="block h-full">
                      <div
                        className={`
              relative overflow-hidden rounded-2xl border border-transparent 
              transition-all duration-500 h-full
              shadow-md hover:shadow-xl
              dark:border-white/5 dark:hover:border-white/10
              light-card hover:light-card-hover
              dark:bg-black/30 dark:backdrop-blur-sm
            `}
                      >
                        {/* Background gradient with enhanced animation */}
                        <motion.div
                          className={`
                absolute inset-0 opacity-30 transition-opacity duration-500
                light:${card.bgLight} dark:${card.bgDark}
              `}
                          animate={{
                            background: [
                              `radial-gradient(circle at 0% 0%, ${card.color
                                .split(" ")[0]
                                .replace("from-", "")}20, transparent 50%)`,
                              `radial-gradient(circle at 100% 100%, ${card.color
                                .split(" ")[1]
                                .replace("to-", "")}20, transparent 50%)`,
                              `radial-gradient(circle at 0% 0%, ${card.color
                                .split(" ")[0]
                                .replace("from-", "")}20, transparent 50%)`,
                            ],
                          }}
                          transition={{
                            duration: 5,
                            repeat: Number.POSITIVE_INFINITY,
                          }}
                        />

                        {/* Ambient glow effect with enhanced animation */}
                        <motion.div
                          className={`
                absolute -inset-[100px] opacity-10 dark:opacity-5
                transition-opacity duration-700 blur-3xl
                bg-gradient-to-br ${card.lightColor} dark:${card.color}
              `}
                          animate={{
                            opacity: [0.1, 0.2, 0.1],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "reverse",
                          }}
                        />

                        {/* Content container */}
                        <div
                          className={`
                relative z-10 p-6 md:p-8 h-full flex ${
                  isFullWidth ? "flex-col md:flex-row items-center" : "flex-col"
                }
              `}
                        >
                          {/* Icon with connections - enhanced animations */}
                          <div
                            className={`
                  relative flex justify-center items-center 
                  h-40 mb-6
                  ${isFullWidth ? 'md:w-1/3' : ''}
                `}
                          >
                            {/* Central icon with improved animation */}
                            <motion.div
                              className={`
                    absolute w-20 h-20 rounded-full flex items-center justify-center z-10
                    border border-white/10 backdrop-blur-sm
                    bg-gradient-to-br ${card.lightColor} dark:${card.color}
                    text-white shadow-lg
                  `}
                              animate={{
                                boxShadow: [
                                  `0 0 20px 0 rgba(139, 92, 246, 0.3)`,
                                  `0 0 40px 0 rgba(139, 92, 246, 0.6)`,
                                  `0 0 20px 0 rgba(139, 92, 246, 0.3)`,
                                ],
                                scale: [1, 1.05, 1],
                              }}
                              transition={{
                                duration: 4,
                                repeat: Number.POSITIVE_INFINITY,
                                repeatType: "reverse",
                              }}
                            >
                              <motion.div
                                animate={{
                                  rotate: [0, 5, 0, -5, 0],
                                }}
                                transition={{
                                  duration: 8,
                                  repeat: Number.POSITIVE_INFINITY,
                                  repeatType: "reverse",
                                }}
                              >
                                {card.icon}
                              </motion.div>
                            </motion.div>

                            {/* Git and GitHub Helper - Enhanced glowing line animations */}
                            {card.pattern === "linear" && (
                              <>
                                <motion.div
                                  className="absolute left-1/4 top-1/2 h-[2px] bg-gradient-to-l from-primary/80 to-transparent"
                                  animate={{
                                    width: [12, 30, 12],
                                    opacity: [0.5, 1, 0.5],
                                    boxShadow: [
                                      "0 0 5px 0 rgba(139, 92, 246, 0.3)",
                                      "0 0 10px 0 rgba(139, 92, 246, 0.8)",
                                      "0 0 5px 0 rgba(139, 92, 246, 0.3)",
                                    ],
                                  }}
                                  transition={{
                                    duration: 3,
                                    repeat: Number.POSITIVE_INFINITY,
                                    repeatType: "reverse",
                                  }}
                                />
                                <motion.div
                                  className="absolute right-1/4 top-1/2 h-[2px] bg-gradient-to-r from-primary/80 to-transparent"
                                  animate={{
                                    width: [12, 30, 12],
                                    opacity: [0.5, 1, 0.5],
                                    boxShadow: [
                                      "0 0 5px 0 rgba(139, 92, 246, 0.3)",
                                      "0 0 10px 0 rgba(139, 92, 246, 0.8)",
                                      "0 0 5px 0 rgba(139, 92, 246, 0.3)",
                                    ],
                                  }}
                                  transition={{
                                    duration: 3,
                                    repeat: Number.POSITIVE_INFINITY,
                                    repeatType: "reverse",
                                    delay: 0.5,
                                  }}
                                />

                                <motion.div
                                  className="absolute left-[15%] top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-card/50 dark:bg-black/60 flex items-center justify-center border border-primary/20"
                                  animate={{
                                    scale: [1, 1.2, 1],
                                    backgroundColor: [
                                      "rgba(255,255,255,0.3)",
                                      "rgba(255,255,255,0.5)",
                                      "rgba(255,255,255,0.3)",
                                    ],
                                    boxShadow: [
                                      "0 0 5px 0 rgba(139, 92, 246, 0.3)",
                                      "0 0 15px 0 rgba(139, 92, 246, 0.6)",
                                      "0 0 5px 0 rgba(139, 92, 246, 0.3)",
                                    ],
                                  }}
                                  transition={{
                                    duration: 4,
                                    repeat: Number.POSITIVE_INFINITY,
                                    repeatType: "reverse",
                                  }}
                                >
                                  {card.nodeIcon}
                                </motion.div>

                                <motion.div
                                  className="absolute right-[15%] top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-card/50 dark:bg-black/60 flex items-center justify-center border border-primary/20"
                                  animate={{
                                    scale: [1, 1.2, 1],
                                    backgroundColor: [
                                      "rgba(255,255,255,0.3)",
                                      "rgba(255,255,255,0.5)",
                                      "rgba(255,255,255,0.3)",
                                    ],
                                    boxShadow: [
                                      "0 0 5px 0 rgba(139, 92, 246, 0.3)",
                                      "0 0 15px 0 rgba(139, 92, 246, 0.6)",
                                      "0 0 5px 0 rgba(139, 92, 246,  92, 246, 0.3)",
                                    ],
                                  }}
                                  transition={{
                                    duration: 4,
                                    repeat: Number.POSITIVE_INFINITY,
                                    repeatType: "reverse",
                                    delay: 1.5,
                                  }}
                                >
                                  {card.secondaryIcon || card.nodeIcon}
                                </motion.div>
                              </>
                            )}

                            {/* Repo Generator - Text generation animation */}
                            {card.pattern === "hexagon" && (
                              <>
                                {/* Animated text generation effect */}
                                <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                                  <motion.div
                                    className="text-xs font-mono bg-black/20 dark:bg-white/10 rounded px-2 py-1 text-primary"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 1 }}
                                  >
                                    <motion.span
                                      initial={{ width: 0 }}
                                      animate={{ width: "auto" }}
                                      transition={{
                                        duration: 2,
                                        repeat: Number.POSITIVE_INFINITY,
                                        repeatType: "loop",
                                        repeatDelay: 3,
                                      }}
                                      className="inline-block overflow-hidden whitespace-nowrap"
                                    >
                                      Generating README.md...
                                    </motion.span>
                                  </motion.div>
                                </div>

                                {[45, 90, 135, 225, 270, 315].map(
                                  (angle, i) => (
                                    <React.Fragment key={i}>
                                      <motion.div
                                        className="absolute w-16 h-[1px] bg-primary/50 dark:bg-primary/60"
                                        style={{
                                          transform: `rotate(${angle}deg)`,
                                          transformOrigin: "center",
                                        }}
                                        animate={{
                                          opacity: [0.3, 0.8, 0.3],
                                          width: [16, 20, 16],
                                          boxShadow: [
                                            "0 0 2px 0 rgba(139, 92, 246, 0.3)",
                                            "0 0 8px 0 rgba(139, 92, 246, 0.8)",
                                            "0 0 2px 0 rgba(139, 92, 246, 0.3)",
                                          ],
                                        }}
                                        transition={{
                                          duration: 3,
                                          repeat: Number.POSITIVE_INFINITY,
                                          repeatType: "reverse",
                                          delay: i * 0.2,
                                        }}
                                      />

                                      <motion.div
                                        className="absolute w-6 h-6 rounded-full bg-card/50 dark:bg-black/60 border border-primary/20 flex items-center justify-center"
                                        style={{
                                          transform: `translate(${
                                            Math.cos((angle * Math.PI) / 180) *
                                            80
                                          }px, ${
                                            Math.sin((angle * Math.PI) / 180) *
                                            80
                                          }px)`,
                                        }}
                                        animate={{
                                          scale: [1, 1.2, 1],
                                          backgroundColor: [
                                            "rgba(255,255,255,0.3)",
                                            "rgba(255,255,255,0.5)",
                                            "rgba(255,255,255,0.3)",
                                          ],
                                          boxShadow: [
                                            "0 0 5px 0 rgba(139, 92, 246, 0.3)",
                                            "0 0 10px 0 rgba(139, 92, 246, 0.6)",
                                            "0 0 5px 0 rgba(139, 92, 246, 0.3)",
                                          ],
                                        }}
                                        transition={{
                                          duration: 3,
                                          repeat: Number.POSITIVE_INFINITY,
                                          repeatType: "reverse",
                                          delay: i * 0.3,
                                        }}
                                      >
                                        {card.nodeIcon}
                                      </motion.div>
                                    </React.Fragment>
                                  )
                                )}
                              </>
                            )}

                            {/* AI Chat - Visual representation of user prompts and AI responses */}
                            {card.pattern === "radial" && (
                              <>
                                {/* Chat bubbles animation */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="relative w-full h-full">
                                    {/* User message */}
                                    <motion.div
                                      className="absolute right-5 top-5 bg-primary text-white text-xs rounded-xl rounded-tr-sm px-2 py-1 max-w-[80px]"
                                      initial={{
                                        opacity: 0,
                                        y: 10,
                                        scale: 0.8,
                                      }}
                                      animate={{ opacity: 1, y: 0, scale: 1 }}
                                      transition={{
                                        duration: 0.5,
                                        repeat: Number.POSITIVE_INFINITY,
                                        repeatType: "loop",
                                        repeatDelay: 5,
                                        delay: 1,
                                      }}
                                    >
                                      How do I merge?
                                    </motion.div>

                                    {/* AI response */}
                                    <motion.div
                                      className="absolute left-5 bottom-5 bg-card dark:bg-black/60 border border-primary/20 text-xs rounded-xl rounded-tl-sm px-2 py-1 max-w-[100px]"
                                      initial={{
                                        opacity: 0,
                                        y: 10,
                                        scale: 0.8,
                                      }}
                                      animate={{ opacity: 1, y: 0, scale: 1 }}
                                      transition={{
                                        duration: 0.5,
                                        repeat: Number.POSITIVE_INFINITY,
                                        repeatType: "loop",
                                        repeatDelay: 5,
                                        delay: 2.5,
                                      }}
                                    >
                                      Use git merge branch_name
                                    </motion.div>
                                  </div>
                                </div>

                                {[0, 45, 90, 135, 180, 225, 270, 315].map(
                                  (angle, i) => (
                                    <React.Fragment key={i}>
                                      <motion.div
                                        className={`absolute w-24 h-[1px] bg-gradient-to-r from-primary/70 to-transparent`}
                                        style={{
                                          transform: `rotate(${angle}deg)`,
                                          transformOrigin: "center",
                                          opacity: i % 2 === 0 ? 0.7 : 0.4,
                                        }}
                                        animate={{
                                          width: [24, 32, 24],
                                          opacity:
                                            i % 2 === 0
                                              ? [0.7, 0.9, 0.7]
                                              : [0.4, 0.7, 0.4],
                                          boxShadow: [
                                            "0 0 3px 0 rgba(139, 92, 246, 0.3)",
                                            "0 0 8px 0 rgba(139, 92, 246, 0.7)",
                                            "0 0 3px 0 rgba(139, 92, 246, 0.3)",
                                          ],
                                        }}
                                        transition={{
                                          duration: 3,
                                          repeat: Number.POSITIVE_INFINITY,
                                          repeatType: "reverse",
                                          delay: i * 0.1,
                                        }}
                                      />

                                      <motion.div
                                        className="absolute w-6 h-6 rounded-full bg-card/50 dark:bg-black/60 border border-primary/20 flex items-center justify-center"
                                        style={{
                                          transform: `translate(${
                                            Math.cos((angle * Math.PI) / 180) *
                                            70
                                          }px, ${
                                            Math.sin((angle * Math.PI) / 180) *
                                            70
                                          }px)`,
                                          opacity: i % 2 === 0 ? 1 : 0.7,
                                        }}
                                        animate={{
                                          scale: [1, 1.2, 1],
                                          backgroundColor: [
                                            "rgba(255,255,255,0.3)",
                                            "rgba(255,255,255,0.5)",
                                            "rgba(255,255,255,0.3)",
                                          ],
                                          boxShadow: [
                                            "0 0 5px 0 rgba(139, 92, 246, 0.3)",
                                            "0 0 10px 0 rgba(139, 92, 246, 0.6)",
                                            "0 0 5px 0 rgba(139, 92, 246, 0.3)",
                                          ],
                                        }}
                                        transition={{
                                          duration: 3,
                                          repeat: Number.POSITIVE_INFINITY,
                                          repeatType: "reverse",
                                          delay: i * 0.15,
                                        }}
                                      >
                                        {card.nodeIcon}
                                      </motion.div>
                                    </React.Fragment>
                                  )
                                )}
                              </>
                            )}

                            {/* GitHub Emoji Generator - Enhanced emoji orbit animation */}
                            {card.pattern === "orbit" && (
                              <>
                                <motion.div
                                  className="absolute w-32 h-32 rounded-full border border-dashed border-primary/50 dark:border-primary/60"
                                  animate={{ rotate: 360 }}
                                  transition={{
                                    duration: 15,
                                    repeat: Number.POSITIVE_INFINITY,
                                    ease: "linear",
                                  }}
                                />

                                <motion.div
                                  className="absolute w-48 h-48 rounded-full border border-dashed border-primary/40 dark:border-primary/50"
                                  animate={{ rotate: -360 }}
                                  transition={{
                                    duration: 20,
                                    repeat: Number.POSITIVE_INFINITY,
                                    ease: "linear",
                                  }}
                                />

                                {/* Orbiting emojis with enhanced animation */}
                                {[0, 72, 144, 216, 288].map((angle, i) => (
                                  <motion.div
                                    key={i}
                                    className="absolute w-8 h-8 rounded-full bg-card/50 dark:bg-black/60 border border-primary/20 flex items-center justify-center"
                                    style={{
                                      transformOrigin: "center",
                                    }}
                                    animate={{
                                      x: Array.from({ length: 60 }).map(
                                        (_, j) =>
                                          Math.cos(
                                            ((angle + j * 6) * Math.PI) / 180
                                          ) * 60
                                      ),
                                      y: Array.from({ length: 60 }).map(
                                        (_, j) =>
                                          Math.sin(
                                            ((angle + j * 6) * Math.PI) / 180
                                          ) * 60
                                      ),
                                      scale: [1, 1.3, 1],
                                      boxShadow: [
                                        "0 0 5px 0 rgba(139, 92, 246, 0.3)",
                                        "0 0 15px 0 rgba(139, 92, 246, 0.7)",
                                        "0 0 5px 0 rgba(139, 92, 246, 0.3)",
                                      ],
                                    }}
                                    transition={{
                                      x: {
                                        duration: 8,
                                        repeat: Number.POSITIVE_INFINITY,
                                        ease: "linear",
                                      },
                                      y: {
                                        duration: 8,
                                        repeat: Number.POSITIVE_INFINITY,
                                        ease: "linear",
                                      },
                                      scale: {
                                        duration: 2,
                                        repeat: Number.POSITIVE_INFINITY,
                                        repeatType: "reverse",
                                        delay: i * 0.2,
                                      },
                                      boxShadow: {
                                        duration: 2,
                                        repeat: Number.POSITIVE_INFINITY,
                                        repeatType: "reverse",
                                        delay: i * 0.2,
                                      },
                                    }}
                                  >
                                    <motion.div
                                      animate={{ rotate: [0, 360] }}
                                      transition={{
                                        duration: 3,
                                        repeat: Number.POSITIVE_INFINITY,
                                        ease: "linear",
                                      }}
                                    >
                                      {["✨", "🚀", "🔥", "💡", "🎉"][i]}
                                    </motion.div>
                                  </motion.div>
                                ))}
                              </>
                            )}

                            {card.pattern === "circular" && (
                              <>
                                <motion.div
                                  className="absolute w-52 h-52 rounded-full border border-primary/20 dark:border-primary/30"
                                  animate={{ scale: [1, 1.05, 1] }}
                                  transition={{
                                    duration: 3,
                                    repeat: Number.POSITIVE_INFINITY,
                                    repeatType: "reverse",
                                  }}
                                />

                                <motion.div
                                  className="absolute w-36 h-36 rounded-full border border-primary/30 dark:border-primary/40"
                                  animate={{ scale: [1, 1.1, 1] }}
                                  transition={{
                                    duration: 3,
                                    repeat: Number.POSITIVE_INFINITY,
                                    repeatType: "reverse",
                                    delay: 0.5,
                                  }}
                                />

                                <motion.div
                                  className="absolute w-4 h-4 rounded-full bg-primary/40 dark:bg-primary/50 top-6 left-1/2 blur-[1px]"
                                  animate={{
                                    opacity: [0.3, 0.8, 0.3],
                                    scale: [1, 1.3, 1],
                                    boxShadow: [
                                      "0 0 5px 0 rgba(139, 92, 246, 0.3)",
                                      "0 0 15px 0 rgba(139, 92, 246, 0.7)",
                                      "0 0 5px 0 rgba(139, 92, 246, 0.3)",
                                    ],
                                  }}
                                  transition={{
                                    duration: 2,
                                    repeat: Number.POSITIVE_INFINITY,
                                    repeatType: "reverse",
                                  }}
                                />

                                <motion.div
                                  className="absolute w-3 h-3 rounded-full bg-primary/40 dark:bg-primary/50 bottom-8 right-8 blur-[1px]"
                                  animate={{
                                    opacity: [0.3, 0.8, 0.3],
                                    scale: [1, 1.3, 1],
                                    boxShadow: [
                                      "0 0 5px 0 rgba(139, 92, 246, 0.3)",
                                      "0 0 15px 0 rgba(139, 92, 246, 0.7)",
                                      "0 0 5px 0 rgba(139, 92, 246, 0.3)",
                                    ],
                                  }}
                                  transition={{
                                    duration: 2,
                                    repeat: Number.POSITIVE_INFINITY,
                                    repeatType: "reverse",
                                    delay: 0.3,
                                  }}
                                />

                                <motion.div
                                  className="absolute w-2 h-2 rounded-full bg-primary/40 dark:bg-primary/50 bottom-12 left-8 blur-[1px]"
                                  animate={{
                                    opacity: [0.3, 0.8, 0.3],
                                    scale: [1, 1.3, 1],
                                    boxShadow: [
                                      "0 0 5px 0 rgba(139, 92, 246, 0.3)",
                                      "0 0 15px 0 rgba(139, 92, 246, 0.7)",
                                      "0 0 5px 0 rgba(139, 92, 246, 0.3)",
                                    ],
                                  }}
                                  transition={{
                                    duration: 2,
                                    repeat: Number.POSITIVE_INFINITY,
                                    repeatType: "reverse",
                                    delay: 0.6,
                                  }}
                                />

                                <motion.div
                                  className="absolute w-2 h-2 rounded-full bg-primary/40 dark:bg-primary/50 top-10 right-10 blur-[1px]"
                                  animate={{
                                    opacity: [0.3, 0.8, 0.3],
                                    scale: [1, 1.3, 1],
                                    boxShadow: [
                                      "0 0 5px 0 rgba(139, 92, 246, 0.3)",
                                      "0 0 15px 0 rgba(139, 92, 246, 0.7)",
                                      "0 0 5px 0 rgba(139, 92, 246, 0.3)",
                                    ],
                                  }}
                                  transition={{
                                    duration: 2,
                                    repeat: Number.POSITIVE_INFINITY,
                                    repeatType: "reverse",
                                    delay: 0.9,
                                  }}
                                />

                                {/* Animated elements */}
                                {[
                                  {
                                    top: "20%",
                                    left: "30%",
                                    icon: card.nodeIcon,
                                    delay: 0,
                                  },
                                  {
                                    top: "70%",
                                    right: "30%",
                                    icon: card.secondaryIcon || card.nodeIcon,
                                    delay: 1,
                                  },
                                  {
                                    top: "40%",
                                    right: "20%",
                                    icon: (
                                      <GitPullRequest className="w-2 h-2 text-primary/70" />
                                    ),
                                    delay: 1.5,
                                  },
                                  {
                                    bottom: "20%",
                                    left: "40%",
                                    icon: (
                                      <FileCode className="w-2 h-2 text-primary/70" />
                                    ),
                                    delay: 0.5,
                                  },
                                ].map((pos, i) => (
                                  <motion.div
                                    key={i}
                                    className="absolute w-4 h-4 rounded-full bg-card/50 dark:bg-black/60 border border-primary/20 flex items-center justify-center"
                                    style={pos}
                                    animate={{
                                      scale: [1, 1.3, 1],
                                      opacity: [0.7, 1, 0.7],
                                      boxShadow: [
                                        "0 0 5px 0 rgba(139, 92, 246, 0.3)",
                                        "0 0 10px 0 rgba(139, 92, 246, 0.6)",
                                        "0 0 5px 0 rgba(139, 92, 246, 0.3)",
                                      ],
                                    }}
                                    transition={{
                                      duration: 2,
                                      repeat: Number.POSITIVE_INFINITY,
                                      repeatType: "reverse",
                                      delay: pos.delay,
                                    }}
                                  >
                                    {pos.icon}
                                  </motion.div>
                                ))}
                              </>
                            )}
                          </div>

                          <div
                            className={`
                              ${isFullWidth
                                ? "w-full md:w-2/3 md:ml-8 md:text-left text-center"
                                : "text-center"
                              }
                            `}
                          >
                            <h3 className="text-2xl font-bold mb-3 text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
                              {card.title}
                            </h3>
                            <p className="text-muted-foreground dark:text-gray-400">
                              {card.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </section>

        <section className="py-28 md:py-36 relative overflow-hidden">
          {/* Background elements */}
          <div className="absolute inset-0 -z-10 bg-grid-pattern-enhanced opacity-5"></div>
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-background/80 to-background/20"></div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="container mx-auto"
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-12">
              {/* LEFT SIDE - Heading & Description */}
              <div className="md:w-5/12 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <HelpCircle className="w-4 h-4" />
                  FAQ
                </div>

                <h2 className="text-3xl md:text-4xl font-bold leading-tight text-foreground">
                  Your Questions. <br />
                  <span className="text-primary">Answered Clearly.</span>
                </h2>

                <p className="text-base text-muted-foreground max-w-md">
                  Find answers to common questions about how Git Genius works,
                  what AI features are available, and how to make the most of
                  the experience.
                </p>
              </div>

              {/* RIGHT SIDE - Accordion */}
              <Accordion
                className="flex w-full flex-col max-w-3xl mx-auto md:mx-0 md:w-7/12"
                type="single"
                collapsible
                defaultValue="getting-started"
              >
                <AccordionItem
                  value="getting-started"
                  className="py-2 border-b border-border/40"
                >
                  <AccordionTrigger className="w-full py-4 text-left text-foreground hover:no-underline">
                    <motion.div className="flex items-center gap-2">
                      <motion.div className="h-4 w-4 text-foreground"></motion.div>
                      <span className="text-foreground font-medium">
                        How do I get started with Git Genius?
                      </span>
                    </motion.div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="pl-6 pr-2 py-4 text-muted-foreground">
                        Getting started with Git Genius is easy! Simply install
                        our extension or use our web interface. You'll have
                        access to our AI-powered Git assistant, commit message
                        generator, and other powerful tools to streamline your
                        Git workflow.
                      </p>
                    </motion.div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="ai-features"
                  className="py-2 border-b border-border/40"
                >
                  <AccordionTrigger className="w-full py-4 text-left text-foreground hover:no-underline">
                    <motion.div className="flex items-center gap-2">
                      <motion.div className="h-4 w-4 text-foreground"></motion.div>
                      <span className="text-foreground font-medium">
                        What AI features are available?
                      </span>
                    </motion.div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="pl-6 pr-2 py-4 text-muted-foreground">
                        Git Genius offers several AI-powered features including
                        intelligent commit message generation, code review
                        assistance, and natural language Git command
                        suggestions. Our AI understands context and helps you
                        write better commit messages and handle complex Git
                        operations.
                      </p>
                    </motion.div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="security"
                  className="py-2 border-b border-border/40"
                >
                  <AccordionTrigger className="w-full py-4 text-left text-foreground hover:no-underline">
                    <motion.div className="flex items-center gap-2">
                      <motion.div className="h-4 w-4 text-foreground"></motion.div>
                      <span className="text-foreground font-medium">
                        Is my code and data secure?
                      </span>
                    </motion.div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="pl-6 pr-2 py-4 text-muted-foreground">
                        Yes, security is our top priority. Git Genius processes
                        your code locally and only sends necessary information
                        to our AI services. We never store your code or
                        sensitive data, and all communications are encrypted.
                        You maintain full control over your repository.
                      </p>
                    </motion.div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="pricing"
                  className="py-2 border-b border-border/40"
                >
                  <AccordionTrigger className="w-full py-4 text-left text-foreground hover:no-underline">
                    <motion.div className="flex items-center gap-2">
                      <motion.div className="h-4 w-4 text-foreground"></motion.div>
                      <span className="text-foreground font-medium">
                        What are the pricing options?
                      </span>
                    </motion.div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="pl-6 pr-2 py-4 text-muted-foreground">
                        Git Genius offers a free tier with basic features,
                        perfect for individual developers. But in future we
                        might add subscriptions
                      </p>
                    </motion.div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </motion.div>
        </section>
      </main>
      <footer className="border-t/40 py-16 relative">
        <div className="absolute inset-0 -z-10 bg-grid-pattern opacity-[0.02]"></div>
        <div className="container">
          <div className="flex flex-col md:flex-row md:justify-between items-center text-center md:text-left gap-12">
            {/* Branding */}
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="flex items-center gap-2">
                <GitBranch className="h-5 w-5 text-primary/80" />
                <span className="text-lg font-medium tracking-tight">
                  Git Genius
                </span>
              </div>
              <p className="text-sm text-muted-foreground/90 max-w-xs leading-relaxed text-justify">
                Git Genius is a tool that helps beginners to learn and
                understand git and github related issues and helps them to solve
                their issues through AI Chat. This tool is also helps to
                generate README.md file for your projects which saves your time
                and effort.
              </p>
              <Link
                href="https://github.com/arunava-12/Gut-Genius"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-muted-foreground/70 hover:text-foreground transition-all duration-300"
              >
                <svg
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-5 w-5 transition-transform duration-300 group-hover:scale-110"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                  <path d="M9 18c-4.51 2-5-2-7-2"></path>
                </svg>
                <span className="text-sm hidden sm:inline">
                  Star on GitHub
                </span>
              </Link>
            </div>

            {/* Navigation */}
            <div className="flex flex-col items-center md:items-end gap-4">
  <p className="text-xs text-muted-foreground/60 mt-2">
    © {new Date().getFullYear()} Git Genius. All rights reserved.
  </p>
  <p className="text-xs text-muted-foreground/60">
    Crafted with care by <span className="font-medium text-foreground">Arunava Mondal</span>
  </p>
</div>

          </div>
        </div>
      </footer>
    </div>
  );
}
