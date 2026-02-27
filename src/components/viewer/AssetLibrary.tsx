import { useState } from "react";
import { motion } from "framer-motion";
import { useViewer } from "@/contexts/ViewerContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Search, DoorOpen, SquareDashedBottom, Armchair, Trees, Car, Lamp, Building2, Fence } from "lucide-react";

const categories = [
  {
    name: "Doors",
    icon: DoorOpen,
    items: [
      { name: "Single Door", type: "door" as const, preview: "🚪", defaultScale: [1, 2.1, 0.1] },
      { name: "Double Door", type: "door" as const, preview: "🚪🚪", defaultScale: [1.8, 2.1, 0.1] },
      { name: "Sliding Door", type: "door" as const, preview: "⬜", defaultScale: [2.4, 2.1, 0.1] },
      { name: "Storefront", type: "door" as const, preview: "🏪", defaultScale: [3, 2.8, 0.1] },
    ],
  },
  {
    name: "Windows",
    icon: SquareDashedBottom,
    items: [
      { name: "Standard", type: "window" as const, preview: "🪟", defaultScale: [1.2, 1.4, 0.08] },
      { name: "Floor-to-Ceiling", type: "window" as const, preview: "🏢", defaultScale: [1.5, 2.8, 0.08] },
      { name: "Bay Window", type: "window" as const, preview: "◻️", defaultScale: [2, 1.6, 0.6] },
      { name: "Skylight", type: "window" as const, preview: "☀️", defaultScale: [1, 0.08, 1] },
    ],
  },
  {
    name: "Furniture",
    icon: Armchair,
    items: [
      { name: "Desk", type: "asset" as const, preview: "🪑", defaultScale: [1.5, 0.75, 0.75] },
      { name: "Chair", type: "asset" as const, preview: "💺", defaultScale: [0.5, 0.9, 0.5] },
      { name: "Sofa", type: "asset" as const, preview: "🛋️", defaultScale: [2, 0.85, 0.9] },
      { name: "Table", type: "asset" as const, preview: "🪵", defaultScale: [1.2, 0.75, 0.8] },
    ],
  },
  {
    name: "Landscape",
    icon: Trees,
    items: [
      { name: "Oak Tree", type: "vegetation" as const, preview: "🌳", defaultScale: [3, 6, 3] },
      { name: "Pine Tree", type: "vegetation" as const, preview: "🌲", defaultScale: [2, 8, 2] },
      { name: "Bush", type: "vegetation" as const, preview: "🌿", defaultScale: [1.5, 1, 1.5] },
      { name: "Flower Bed", type: "vegetation" as const, preview: "🌸", defaultScale: [2, 0.3, 1] },
    ],
  },
  {
    name: "Vehicles",
    icon: Car,
    items: [
      { name: "Sedan", type: "asset" as const, preview: "🚗", defaultScale: [4.5, 1.5, 1.8] },
      { name: "SUV", type: "asset" as const, preview: "🚙", defaultScale: [4.8, 1.8, 2] },
      { name: "Truck", type: "asset" as const, preview: "🚛", defaultScale: [6, 2.5, 2.2] },
    ],
  },
  {
    name: "Site",
    icon: Building2,
    items: [
      { name: "Street Light", type: "asset" as const, preview: "🔦", defaultScale: [0.3, 5, 0.3] },
      { name: "Bench", type: "asset" as const, preview: "🪑", defaultScale: [1.5, 0.8, 0.5] },
      { name: "Bollard", type: "asset" as const, preview: "🔵", defaultScale: [0.2, 1, 0.2] },
      { name: "Fence Section", type: "asset" as const, preview: "🏗️", defaultScale: [3, 1.2, 0.05] },
    ],
  },
];

export default function AssetLibrary() {
  const { state, dispatch, addObject } = useViewer();
  const [search, setSearch] = useState("");
  const [expandedCat, setExpandedCat] = useState<string | null>("Doors");

  if (state.rightPanel !== "assets") return null;

  const handlePlaceAsset = (item: typeof categories[0]["items"][0]) => {
    addObject({
      type: item.type,
      position: [0, item.defaultScale[1] / 2, 0],
      rotation: [0, 0, 0],
      scale: item.defaultScale as [number, number, number],
      properties: { variant: item.name },
      material: item.type === "vegetation" ? "wood" : "concrete",
      layer: item.type === "vegetation" ? "landscape" : "architectural",
      visible: true,
      locked: false,
      name: item.name,
    });
  };

  return (
    <motion.aside
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 340, damping: 32 }}
      className="fixed right-0 top-12 bottom-0 w-72 border-l border-border bg-card flex flex-col z-40 shadow-2xl"
    >
      <div className="h-10 border-b border-border flex items-center justify-between px-3">
        <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Assets</span>
        <Button
          variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground"
          onClick={() => dispatch({ type: "SET_RIGHT_PANEL", payload: null })}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="px-3 py-2">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search assets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 text-xs pl-7"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-2 pb-4">
          {categories
            .filter((c) =>
              !search || c.items.some((i) => i.name.toLowerCase().includes(search.toLowerCase()))
            )
            .map((cat) => (
              <div key={cat.name} className="mb-1">
                <button
                  onClick={() => setExpandedCat(expandedCat === cat.name ? null : cat.name)}
                  className="w-full flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground rounded hover:bg-muted/50 transition-colors"
                >
                  <cat.icon className="h-3.5 w-3.5" />
                  {cat.name}
                  <span className="ml-auto text-[10px] text-muted-foreground">{cat.items.length}</span>
                </button>

                {expandedCat === cat.name && (
                  <div className="grid grid-cols-2 gap-1.5 px-1 py-1">
                    {cat.items
                      .filter((i) => !search || i.name.toLowerCase().includes(search.toLowerCase()))
                      .map((item) => (
                        <button
                          key={item.name}
                          onClick={() => handlePlaceAsset(item)}
                          className="flex flex-col items-center gap-1 p-2.5 rounded-lg border border-border hover:border-primary/30 hover:bg-primary/5 transition-all text-center group"
                        >
                          <span className="text-2xl group-hover:scale-110 transition-transform">{item.preview}</span>
                          <span className="text-[10px] text-muted-foreground group-hover:text-foreground leading-tight">{item.name}</span>
                        </button>
                      ))}
                  </div>
                )}
              </div>
            ))}
        </div>
      </ScrollArea>
    </motion.aside>
  );
}
