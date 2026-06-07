"use client";

import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface BentoCardProps {
  title?: string;
  description?: string;
  imageUrl?: string;
  href?: string;
  accentChip?: string;
  /** visual treatment */
  variant?: "plain" | "gradient" | "image" | "brand" | "glow";
  /** tailwind class for the card surface (e.g. 'bg-black text-white') */
  className?: string;
  /** when true, the card expands to fill its grid cell (default true) */
  fill?: boolean;
  children?: ReactNode;
  /** explicit onClick handler — when set, the card becomes interactive even without href */
  onClick?: () => void;
}

/**
 * BentoCard — the visual shell around any tile content.
 *
 * Variants:
 *  - plain: neutral surface, hover lifts
 *  - gradient: gradient background
 *  - image: full-bleed background image with title pill at bottom
 *  - brand: solid brand color (used for socials)
 *  - glow: subtle gradient with glow on hover
 */
export function BentoCard({
  title,
  description,
  imageUrl,
  href,
  accentChip,
  variant = "plain",
  className,
  fill = true,
  children,
  onClick,
}: BentoCardProps) {
  const baseSurface =
    "relative w-full h-full overflow-hidden rounded-2xl border border-border/40 transition-all duration-300";

  const interactive = "group/bento cursor-pointer";

  const variantClass: Record<NonNullable<BentoCardProps["variant"]>, string> = {
    plain:    "bg-card text-card-foreground hover:shadow-lg",
    gradient: "bg-gradient-to-br from-violet-500/90 to-fuchsia-500/90 text-white hover:shadow-xl",
    image:    "bg-zinc-900 text-white",
    brand:    "bg-zinc-900 text-white hover:shadow-xl",
    glow:     "bg-gradient-to-br from-sky-500/20 via-violet-500/20 to-pink-500/20 hover:shadow-[0_0_30px_rgba(139,92,246,0.35)]",
  };

  const Tag = href ? "a" : onClick ? "button" : "div";
  const tagProps: Record<string, unknown> = {};
  if (href) {
    tagProps.href = href;
    tagProps.target = href.startsWith("http") ? "_blank" : undefined;
    tagProps.rel = "noopener noreferrer";
  }
  if (onClick) tagProps.onClick = onClick;

  return (
    <motion.div
      className={cn(baseSurface, variantClass[variant], interactive, className)}
      style={fill ? undefined : { display: "inline-block" }}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
    >
      <Tag
        {...(tagProps as Record<string, unknown>)}
        className="block w-full h-full"
      >
        {/* background image variant */}
        {variant === "image" && imageUrl && (
          <>
            <motion.img
              src={imageUrl}
              alt={title ?? ""}
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />
          </>
        )}

        {/* children: the tile body, rendered above bg */}
        {children && (
          <div className="relative z-10 w-full h-full">{children}</div>
        )}

        {/* top-right arrow chip (visible on hover) */}
        {(href || onClick) && (
          <div className="absolute top-2 right-2 z-20 opacity-0 group-hover/bento:opacity-100 transition-opacity duration-200">
            <div className="w-7 h-7 rounded-full bg-white/95 text-zinc-900 flex items-center justify-center shadow-lg">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>
        )}

        {/* top-left accent chip (always visible if provided) */}
        {accentChip && (
          <div className="absolute top-2 left-2 z-20">
            <span className="text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/95 text-zinc-900 shadow-sm">
              {accentChip}
            </span>
          </div>
        )}

        {/* bottom-left caption pill (Figma reference "Add a caption..." pattern) */}
        {variant === "image" && title && (
          <div className="absolute bottom-2 left-2 z-20">
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/95 text-zinc-900 shadow-md">
              {title}
            </span>
          </div>
        )}

        {/* bottom title + description (hover-reveal) */}
        {variant === "image" && description && (
          <div className="absolute bottom-0 left-0 right-0 z-20 p-3 pt-7 transform translate-y-1 group-hover/bento:translate-y-0 transition-transform duration-300">
            <p className="text-white/90 text-[10px] line-clamp-2">
              {description}
            </p>
          </div>
        )}
      </Tag>
    </motion.div>
  );
}
