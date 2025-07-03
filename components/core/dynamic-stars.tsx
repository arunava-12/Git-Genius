import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";

const PURPLE_SHADES = [
  "#a78bfa", // purple-400
  "#8b5cf6", // purple-500
  "#7c3aed", // purple-600
  "#6d28d9", // purple-700
  "#c4b5fd", // purple-300
];

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

interface Star {
  top: string;
  left: string;
  size: number;
  delay: number;
  duration: number;
  color: string;
  orbitRadius: number;
  orbitAngle: number;
  moveDuration: number;
  fadeDuration: number;
  fadeDelay: number;
}

export const DynamicStars: React.FC<{ count?: number }> = ({ count = 60 }) => {
  const { theme } = useTheme();
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const newStars: Star[] = Array.from({ length: count }).map(() => {
      const top = `${Math.random() * 100}%`;
      const left = `${Math.random() * 100}%`;
      const size = getRandomInt(1, 3);
      const delay = Math.random() * 3;
      const duration = 2 + Math.random() * 2;
      const color = theme === "dark"
        ? "#fff"
        : PURPLE_SHADES[getRandomInt(0, PURPLE_SHADES.length - 1)];
      // For movement
      const orbitRadius = getRandomInt(6, 18); // px
      const orbitAngle = Math.random() * 360; // deg
      const moveDuration = 3 + Math.random() * 4; // seconds
      // For fade in/out
      const fadeDuration = 2 + Math.random() * 2; // seconds
      const fadeDelay = Math.random() * 5; // seconds
      return {
        top,
        left,
        size,
        delay,
        duration,
        color,
        orbitRadius,
        orbitAngle,
        moveDuration,
        fadeDuration,
        fadeDelay,
      };
    });
    setStars(newStars);
  }, [count, theme]);

  return (
    <div className="fixed inset-0 pointer-events-none z-30" aria-hidden>
      {stars.map((star, i) => {
        // Each star gets a unique movement and fade animation
        const moveName = `starMove${i}`;
        const fadeName = `starFade${i}`;
        // Calculate movement in a small circle/ellipse
        const orbitX = Math.cos((star.orbitAngle * Math.PI) / 180) * star.orbitRadius;
        const orbitY = Math.sin((star.orbitAngle * Math.PI) / 180) * star.orbitRadius;
        return (
          <React.Fragment key={i}>
            <div
              style={{
                position: "absolute",
                top: star.top,
                left: star.left,
                width: star.size,
                height: star.size,
                background: star.color,
                borderRadius: "50%",
                opacity: 0,
                boxShadow: `0 0 6px 1px ${star.color}`,
                animation: `${moveName} ${star.moveDuration}s linear infinite, ${fadeName} ${star.fadeDuration}s ease-in-out ${star.fadeDelay}s infinite`,
                animationDelay: `${star.delay}s, ${star.fadeDelay}s`,
                willChange: "transform, opacity",
              }}
            />
            <style>{`
              @keyframes ${moveName} {
                0% { transform: translate(0px, 0px); }
                25% { transform: translate(${orbitX / 2}px, ${orbitY / 2}px); }
                50% { transform: translate(${orbitX}px, ${orbitY}px); }
                75% { transform: translate(${orbitX / 2}px, ${orbitY / 2}px); }
                100% { transform: translate(0px, 0px); }
              }
              @keyframes ${fadeName} {
                0% { opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { opacity: 0; }
              }
            `}</style>
          </React.Fragment>
        );
      })}
    </div>
  );
}; 