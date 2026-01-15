"use client";

import techStackData from "@/data/techstack.json";
import { motion } from "framer-motion";
import {
  Code2,
  Database,
  Wrench,
  Palette,
  Server,
  FileCode,
  Braces,
  Globe,
  Terminal,
  GitBranch,
  Smartphone,
  Package,
  Layers,
  Box,
  CheckSquare,
  Settings,
  Activity,
  Snowflake as SnowflakeIcon,
} from "lucide-react";

interface Tech {
  name: string;
  category: string;
}

const techIcons: Record<string, any> = {
  HTML: Globe,
  CSS: Palette,
  JavaScript: FileCode,
  "C#": Code2,
  "ASP.NET": Server,
  "Node.js": Code2,
  PHP: FileCode,
  WordPress: Globe,
  React: Code2,
  Angular: Code2,
  "Next.js": Layers,
  TailwindCSS: Palette,
  Bootstrap: Palette,
  Git: GitBranch,
  "VS Code": Terminal,
  Jira: CheckSquare,
  "Unix/Linux": Terminal,
  Jenkins: Settings,
  SQL: Database,
  MySQL: Database,
  Snowflake: SnowflakeIcon,
  MongoDB: Database,
};

const techColors: Record<string, string> = {
  HTML: "239, 101, 41", // Orange
  CSS: "41, 101, 241", // Blue
  JavaScript: "240, 219, 79", // Yellow
  "C#": "154, 73, 184", // Purple
  "ASP.NET": "93, 118, 203", // Blue
  "Node.js": "112, 168, 65", // Green
  PHP: "119, 123, 180", // Purple/Blue
  WordPress: "33, 117, 155", // Blue
  React: "97, 218, 251", // Cyan
  Angular: "221, 0, 49", // Red
  "Next.js": "255, 255, 255", // White
  TailwindCSS: "56, 189, 248", // Sky Blue
  Bootstrap: "112, 68, 255", // Purple
  Git: "240, 80, 50", // Orange/Red
  "VS Code": "0, 122, 204", // Blue
  Jira: "0, 82, 204", // Blue
  "Unix/Linux": "252, 163, 17", // Yellow/Orange
  Jenkins: "209, 59, 52", // Red
  SQL: "204, 153, 0", // Gold
  MySQL: "0, 117, 143", // Teal
  Snowflake: "41, 184, 219", // Cyan
  MongoDB: "71, 162, 72", // Green
};

export default function TechStack() {
  const techStack: Tech[] = techStackData.techStack;

  const categories = Array.from(
    new Set(techStack.map((tech) => tech.category))
  );

  return (
    <section className="flex flex-col gap-6">
      <h2 className="title text-2xl sm:text-3xl">tech stack</h2>

      <div className="flex flex-col gap-6">
        {categories.map((category) => (
          <div key={category} className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              {category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {techStack
                .filter((tech) => tech.category === category)
                .map((tech) => {
                  const Icon = techIcons[tech.name] || Code2;
                  const color = techColors[tech.name] || "139, 92, 246";
                  return (
                    <motion.span
                      key={tech.name}
                      className="group relative inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2 text-xs font-medium text-foreground transition-all hover:border-foreground/50 cursor-pointer"
                      style={{
                        boxShadow: "0 0 0 rgba(0, 0, 0, 0)",
                      }}
                      whileHover={{
                        scale: 1.1,
                        y: -4,
                        boxShadow: `0 0 20px rgba(${color}, 0.6), 0 0 40px rgba(${color}, 0.4), 0 0 60px rgba(${color}, 0.2)`,
                      }}
                      whileTap={{ scale: 0.95 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 17,
                      }}
                    >
                      <motion.div
                        className="flex items-center"
                        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        <Icon className="size-4" />
                      </motion.div>
                      <span>{tech.name}</span>
                    </motion.span>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
