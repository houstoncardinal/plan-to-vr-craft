import { useState } from "react";
import { motion } from "framer-motion";
import { useViewer } from "@/contexts/ViewerContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Sparkles, Send, Wand2 } from "lucide-react";

const suggestions = [
  "Build a modern 4-bedroom house",
  "Create a parking lot for 120 cars",
  "Generate a shopping center with 8 stores",
  "Add a two-story office building",
  "Design a residential subdivision layout",
  "Create a landscape with trees and pathways",
];

interface Message {
  role: "user" | "ai";
  content: string;
}

export default function AICopilot() {
  const { state, dispatch, addObject } = useViewer();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content: "I'm your AI building assistant. Describe what you want to create and I'll generate an editable 3D layout. Try one of the suggestions below!",
    },
  ]);
  const [isGenerating, setIsGenerating] = useState(false);

  if (state.rightPanel !== "ai") return null;

  const handleSend = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setIsGenerating(true);

    // Simulate AI generation
    await new Promise((r) => setTimeout(r, 1500));

    // Generate a simple building based on the prompt
    const isParking = msg.toLowerCase().includes("parking");
    const isHouse = msg.toLowerCase().includes("house") || msg.toLowerCase().includes("bedroom");

    if (isParking) {
      addObject({ type: "parking", position: [0, 0.05, 0], rotation: [0, 0, 0], scale: [20, 0.1, 15], properties: { spaces: 40 }, material: "asphalt", layer: "site", visible: true, locked: false, name: "Parking Lot" });
      setMessages((prev) => [...prev, { role: "ai", content: "✅ Generated a parking lot. I've added it to the scene — you can select it to adjust dimensions, add striping, and configure the number of spaces." }]);
    } else if (isHouse) {
      // Generate walls for a simple house
      const walls = [
        { pos: [0, 1.5, -5] as [number, number, number], scale: [10, 3, 0.2] as [number, number, number] },
        { pos: [0, 1.5, 5] as [number, number, number], scale: [10, 3, 0.2] as [number, number, number] },
        { pos: [-5, 1.5, 0] as [number, number, number], scale: [0.2, 3, 10] as [number, number, number] },
        { pos: [5, 1.5, 0] as [number, number, number], scale: [0.2, 3, 10] as [number, number, number] },
      ];
      walls.forEach((w, i) => {
        addObject({ type: "wall", position: w.pos, rotation: [0, 0, 0], scale: w.scale, properties: {}, material: "drywall", layer: "architectural", visible: true, locked: false, name: `Wall ${i + 1}` });
      });
      addObject({ type: "floor", position: [0, 0, 0], rotation: [0, 0, 0], scale: [10, 0.15, 10], properties: {}, material: "concrete", layer: "architectural", visible: true, locked: false, name: "Ground Floor" });
      addObject({ type: "roof", position: [0, 4, 0], rotation: [0, 0, 0], scale: [12, 2, 12], properties: { style: "gable" }, material: "wood", layer: "architectural", visible: true, locked: false, name: "Roof" });
      setMessages((prev) => [...prev, { role: "ai", content: "✅ Generated a house layout with 4 walls, floor, and gable roof. Select any element to edit dimensions, materials, or position. Add doors and windows from the asset library." }]);
    } else {
      // Generic building
      addObject({ type: "wall", position: [0, 2, -6], rotation: [0, 0, 0], scale: [12, 4, 0.2], properties: {}, material: "concrete", layer: "architectural", visible: true, locked: false, name: "Front Wall" });
      addObject({ type: "wall", position: [0, 2, 6], rotation: [0, 0, 0], scale: [12, 4, 0.2], properties: {}, material: "concrete", layer: "architectural", visible: true, locked: false, name: "Back Wall" });
      addObject({ type: "wall", position: [-6, 2, 0], rotation: [0, 0, 0], scale: [0.2, 4, 12], properties: {}, material: "concrete", layer: "architectural", visible: true, locked: false, name: "Left Wall" });
      addObject({ type: "wall", position: [6, 2, 0], rotation: [0, 0, 0], scale: [0.2, 4, 12], properties: {}, material: "concrete", layer: "architectural", visible: true, locked: false, name: "Right Wall" });
      addObject({ type: "floor", position: [0, 0, 0], rotation: [0, 0, 0], scale: [12, 0.15, 12], properties: {}, material: "concrete", layer: "architectural", visible: true, locked: false, name: "Floor Slab" });
      setMessages((prev) => [...prev, { role: "ai", content: `✅ Generated a building structure based on: "${msg}". All elements are fully editable — adjust walls, add openings, and customize materials.` }]);
    }

    setIsGenerating(false);
  };

  return (
    <motion.aside
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 20, opacity: 0 }}
      className="w-80 border-l border-border bg-card flex flex-col"
    >
      <div className="h-10 border-b border-border flex items-center justify-between px-3">
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-semibold text-foreground uppercase tracking-wider">AI Copilot</span>
        </div>
        <Button
          variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground"
          onClick={() => dispatch({ type: "SET_RIGHT_PANEL", payload: null })}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`rounded-lg p-3 text-xs leading-relaxed ${
                msg.role === "ai"
                  ? "bg-muted text-foreground"
                  : "bg-primary text-primary-foreground ml-6"
              }`}
            >
              {msg.content}
            </div>
          ))}

          {isGenerating && (
            <div className="bg-muted rounded-lg p-3 text-xs text-muted-foreground flex items-center gap-2">
              <Wand2 className="h-3.5 w-3.5 animate-spin" />
              Generating 3D layout...
            </div>
          )}

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div className="space-y-1.5 pt-2">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Try saying</p>
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="w-full text-left text-[11px] text-muted-foreground hover:text-foreground p-2 rounded-md hover:bg-muted/50 transition-colors border border-transparent hover:border-border"
                >
                  "{s}"
                </button>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-3 border-t border-border">
        <div className="flex gap-1.5">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe what to build..."
            className="min-h-[36px] max-h-[100px] text-xs resize-none"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button
            size="icon"
            className="h-9 w-9 bg-gradient-cardinal shrink-0"
            onClick={() => handleSend()}
            disabled={!input.trim() || isGenerating}
          >
            <Send className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </motion.aside>
  );
}
