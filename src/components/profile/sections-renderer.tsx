"use client";

import { Tile, TileSection } from "@/types/profile";
import { SectionGrid } from "@/components/ui/section-grid";
import { BentoTile } from "./bento-tile";
import { motion } from "framer-motion";

interface SectionsRendererProps {
  tiles: Tile[];
  maxCols?: number;
}

const SECTION_ORDER: { id: TileSection; title: string; description?: string }[] = [
  { id: 'socials',    title: 'Connect',           description: "Find me around the web" },
  { id: 'projects',   title: 'Projects',          description: "Things I've built or maintain" },
  { id: 'experience', title: 'Experience',        description: "Where I've worked" },
  { id: 'sponsors',   title: 'Sponsors & community' },
  { id: 'contact',    title: 'Get in touch' },
  { id: 'general',    title: '' },
];

export function SectionsRenderer({ tiles, maxCols = 4 }: SectionsRendererProps) {
  // group tiles by section (default 'general')
  const grouped: Record<TileSection, Tile[]> = {
    socials: [], projects: [], experience: [], sponsors: [], contact: [], general: [],
  };
  for (const t of tiles) {
    const s = t.metadata?.section ?? 'general';
    if (grouped[s]) grouped[s].push(t);
    else grouped.general.push(t);
  }

  // Stable order: tiles in the order they appear in the input array
  const sortByIndex = (arr: Tile[]) => {
    const idx = new Map(tiles.map((t, i) => [t.id, i] as const));
    return arr.sort((a, b) => (idx.get(a.id) ?? 0) - (idx.get(b.id) ?? 0));
  };

  return (
    <div className="w-full space-y-12">
      {SECTION_ORDER.map((section) => {
        const list = sortByIndex(grouped[section.id]);
        if (list.length === 0) return null;
        return (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <SectionGrid title={section.title} description={section.description} maxCols={maxCols}>
              {list.map((tile) => (
                <BentoTile key={tile.id} tile={tile} />
              ))}
            </SectionGrid>
          </motion.div>
        );
      })}
    </div>
  );
}
