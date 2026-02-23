import { useState, useRef, useEffect } from "react";
import Anthropic from "@anthropic-ai/sdk";
import { motion, AnimatePresence } from "framer-motion";
import { useViewer, SceneObject, MaterialType } from "@/contexts/ViewerContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Sparkles, Send, Wand2, Key, ChevronDown, Trash2 } from "lucide-react";

// ─── System prompt ────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are an expert 3D architectural scene-building AI for a real-time visualization tool. You interpret natural language and generate structured JSON to create or modify 3D scenes.

## Coordinate System
- Y-axis UP. Ground = Y=0. Objects are positioned at their CENTER.
- Scale = [width, height, depth] in METERS.
- For walls at ground with height H: position=[x, H/2, z], scale=[W, H, thickness]
- Standard ceiling height: 3.0–3.5 m. Wall thickness: 0.2–0.3 m.
- For floors: position=[x, 0, z], scale=[W, 0.15, D]
- Scene center is [0,0,0]. House should be near origin, gardens behind (+z), driveway in front (−z).

## Object Types
wall — box. Materials: stone, brick, concrete, drywall, glass-clear, glass-frosted, glass-bronze-tinted.
floor — flat slab. Materials: concrete, marble-carrara, oak-hardwood, travertine-tumbled, ceramic-white-glossy, concrete-polished.
roof — property: style ("gable"|"hip"|"flat"). Materials: asphalt, stone, wood, marble-carrara.
door — Width 0.9–2.4m, height 2.1–3m, depth 0.08m. Materials: oak-hardwood, walnut-finished, steel.
window — scale=[W, H, 0.15]. Materials: glass-clear, glass-frosted, glass-bronze-tinted.
stair — scale=[width, totalHeight, totalDepth]. Materials: marble-carrara, oak-hardwood, concrete.
vegetation — property: variant ("oak"|"maple"|"birch"|"pine"|"palm"). scale=[diameter, height, diameter].
lighting — properties: mount ("ceiling"|"wall"|"floor"), intensity (0.5–2.0). scale=[radius, height, radius].
furniture — property: variant ("sofa"|"chair"|"table"|"ottoman"|"bed-king"|"bed-queen"). scale=[W,H,D].
kitchen — cabinet+countertop unit. scale=[width, 0.9, depth].
bathroom — vanity+toilet+tub set. scale=[width, 1, depth].
pool — property: shape ("rectangular"). scale=[width, depth, length]. depth typically 1.5–2m.
deck — scale=[width, height, depth].
terrain — ground plane. scale=[width, 0.15, depth].
road — asphalt road. scale=[width, 0.1, length].
parking — lot with space lines. scale=[width, 0.08, depth].
fence — scale=[length, height, 0.08].
landscape — garden bed/hedge. scale=[width, 0.3–0.8, depth].

## Materials
stone, brick, concrete, concrete-polished, glass-clear, glass-frosted, glass-bronze-tinted, drywall, wood, oak-hardwood, walnut-finished, bamboo-natural, reclaimed-barn, marble-carrara, travertine-tumbled, slate-charcoal, asphalt, steel, brushed-aluminum, stainless-steel, bronze-aged, copper-patina, carbon-fiber, velvet-crushed, linen-natural, acrylic-clear, ceramic-white-glossy, subway-tile-beveled, terracotta-tile, paint-matte, paint-semi-gloss, paint-high-gloss

## Layers
architectural — walls, floors, roofs, doors, windows
structural — load-bearing elements
mep — lighting, MEP systems
site — roads, parking, pools, decks
landscape — trees, gardens, terrain
interior — furniture, kitchen, bathroom

## Available Actions
- ADD_OBJECT: create a new 3D object
- SET_DAY_NIGHT: set time of day (value 0.0 = midnight, 0.25 = sunrise, 0.5 = noon, 0.75 = sunset)
- SET_SEASON: season ("spring"|"summer"|"autumn"|"winter")
- CLEAR_SCENE: remove all objects (use only when explicitly requested)

## Response Format
Always respond ONLY with valid JSON — no prose, no markdown, no code fences:
{"message":"What you built (1–2 sentences, friendly)","actions":[...]}

For ADD_OBJECT actions:
{"type":"ADD_OBJECT","object":{"type":"...","position":[x,y,z],"scale":[w,h,d],"rotation":[0,0,0],"material":"...","layer":"...","name":"...","properties":{}}}

## Rules
- Build generously — if someone asks for a house, create walls + floor + roof + windows + doors.
- Use realistic proportions and coordinates.
- Place objects so they don't overlap (offset positions appropriately).
- For trees/vegetation use y=0 since trunks start at ground.
- Use high-quality materials: marble-carrara for luxury, oak-hardwood for interior floors, stone for exterior walls.
- Group related objects with sensible names like "Master Bedroom Wall N", "Living Room Floor".
- NEVER invent types or materials not listed above.
- ONLY output JSON, nothing else.`;

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
  role: "user" | "assistant";
  content: string;
  actionCount?: number;
  error?: boolean;
}

interface AIAction {
  type: "ADD_OBJECT" | "SET_DAY_NIGHT" | "SET_SEASON" | "CLEAR_SCENE";
  object?: Omit<SceneObject, "id">;
  value?: number;
  season?: "spring" | "summer" | "autumn" | "winter";
}

interface AIResponse {
  message: string;
  actions: AIAction[];
}

const SUGGESTIONS = [
  "Build a modern minimalist house with floor-to-ceiling windows",
  "Add a lush garden with oak trees, hedges, and a stone path",
  "Create an outdoor kitchen and BBQ area with a covered deck",
  "Design an indoor gym with hardwood floors and mirrors",
  "Add a rooftop terrace with a pergola and lounge furniture",
  "Make it a golden sunset in autumn",
  "Build a Japanese zen garden with a koi pond",
  "Add a 3-car garage with a parking court",
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function AICopilot() {
  const { state, dispatch, addObject } = useViewer();
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("anthropic-key") || "");
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "I'm your AI scene builder. Describe what you want to create — a house, garden, pool, office — and I'll build it in 3D instantly. Try one of the suggestions below, or describe anything you can imagine.",
    },
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isGenerating]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const saveKey = (key: string) => {
    setApiKey(key);
    if (key) localStorage.setItem("anthropic-key", key);
    else localStorage.removeItem("anthropic-key");
  };

  // Build conversation history for API
  const buildConversation = (msgs: Message[]): { role: "user" | "assistant"; content: string }[] => {
    return msgs.map((m) => ({ role: m.role, content: m.content }));
  };

  const executeActions = (actions: AIAction[]): number => {
    let count = 0;
    for (const action of actions) {
      try {
        if (action.type === "ADD_OBJECT" && action.object) {
          const obj = action.object as Omit<SceneObject, "id">;
          // Validate required fields
          if (!obj.type || !obj.position || !obj.scale || !obj.material) continue;
          // Ensure defaults
          obj.rotation = obj.rotation || [0, 0, 0];
          obj.properties = obj.properties || {};
          obj.layer = obj.layer || "architectural";
          obj.visible = true;
          obj.locked = false;
          obj.name = obj.name || `${obj.type} ${Date.now()}`;
          addObject(obj);
          count++;
        } else if (action.type === "SET_DAY_NIGHT" && action.value !== undefined) {
          dispatch({ type: "SET_DAY_NIGHT", payload: Math.max(0, Math.min(1, action.value)) });
          count++;
        } else if (action.type === "SET_SEASON" && action.season) {
          dispatch({ type: "SET_SEASON", payload: action.season });
          count++;
        } else if (action.type === "CLEAR_SCENE") {
          // Clear all unlocked objects
          const ids = state.objects.filter((o) => !o.locked).map((o) => o.id);
          for (const id of ids) {
            dispatch({ type: "DELETE_OBJECT", payload: id });
          }
          count++;
        }
      } catch (err) {
        console.warn("Failed to execute AI action:", action, err);
      }
    }
    return count;
  };

  const parseAIResponse = (text: string): AIResponse | null => {
    // Strip markdown code fences if present
    const cleaned = text
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```\s*$/, "")
      .trim();
    try {
      return JSON.parse(cleaned) as AIResponse;
    } catch {
      // Try to find JSON object in response
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          return JSON.parse(match[0]) as AIResponse;
        } catch {
          return null;
        }
      }
      return null;
    }
  };

  const handleSend = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || isGenerating) return;

    if (!apiKey) {
      setShowKeyInput(true);
      return;
    }

    setInput("");
    const userMsg: Message = { role: "user", content: msg };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsGenerating(true);

    try {
      const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

      // Build history (exclude first welcome message from API context)
      const history = buildConversation(newMessages.slice(1));

      const response = await client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: history,
      });

      const rawContent = response.content[0];
      if (rawContent.type !== "text") throw new Error("Unexpected response type");

      const parsed = parseAIResponse(rawContent.text);
      if (!parsed) throw new Error("Invalid response format from AI");

      const actionCount = executeActions(parsed.actions);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: parsed.message || "Done!",
          actionCount,
        },
      ]);
    } catch (err: any) {
      const errMsg =
        err?.status === 401
          ? "Invalid API key. Click the key icon to update it."
          : err?.status === 429
          ? "Rate limit reached. Please wait a moment and try again."
          : err?.message?.includes("fetch")
          ? "Network error. Check your connection and CORS settings."
          : `Error: ${err?.message || "Something went wrong"}`;

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: errMsg, error: true },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      {/* ── Floating button ─────────────────────────────────────────────────── */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-gradient-cardinal shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform"
        onClick={() => setIsOpen((v) => !v)}
        whileTap={{ scale: 0.95 }}
        title="AI Copilot"
      >
        <Sparkles className="h-5 w-5" />
      </motion.button>

      {/* ── Chat popup ───────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="fixed bottom-22 right-6 z-50 w-[380px] max-h-[600px] flex flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
            style={{ bottom: "5rem" }}
          >
            {/* Header */}
            <div className="h-11 flex items-center justify-between px-4 border-b border-border bg-card/95 backdrop-blur-sm flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-cardinal flex items-center justify-center">
                  <Sparkles className="h-3 w-3 text-white" />
                </div>
                <span className="text-sm font-semibold">AI Copilot</span>
                <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">claude-sonnet-4-6</span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowKeyInput((v) => !v)}
                  title={apiKey ? "API key configured" : "Set API key"}
                >
                  <Key className={`h-3.5 w-3.5 ${apiKey ? "text-green-500" : "text-yellow-500"}`} />
                </Button>
                <Button
                  variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    setMessages([messages[0]]);
                  }}
                  title="Clear chat"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {/* API key input */}
            <AnimatePresence>
              {showKeyInput && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden border-b border-border"
                >
                  <div className="p-3 bg-muted/50 space-y-2">
                    <p className="text-[11px] text-muted-foreground">
                      Enter your{" "}
                      <span className="font-semibold text-foreground">Anthropic API key</span>{" "}
                      — stored locally in your browser.
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        placeholder="sk-ant-..."
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="flex-1 text-xs bg-background border border-border rounded-md px-2 py-1.5 outline-none focus:ring-1 focus:ring-primary"
                      />
                      <Button
                        size="sm"
                        className="text-xs h-7 px-3"
                        onClick={() => {
                          saveKey(apiKey);
                          setShowKeyInput(false);
                        }}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0"
              style={{ maxHeight: "380px" }}
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : msg.error
                        ? "bg-destructive/10 text-destructive border border-destructive/20 rounded-bl-sm"
                        : "bg-muted text-foreground rounded-bl-sm"
                    }`}
                  >
                    {msg.content}
                    {msg.actionCount !== undefined && msg.actionCount > 0 && (
                      <div className="mt-1.5 text-[10px] opacity-60 flex items-center gap-1">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500" />
                        {msg.actionCount} object{msg.actionCount !== 1 ? "s" : ""} added to scene
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isGenerating && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl rounded-bl-sm px-3.5 py-2.5 text-xs text-muted-foreground flex items-center gap-2">
                    <Wand2 className="h-3 w-3 animate-spin text-primary" />
                    <span>Building your scene</span>
                    <span className="flex gap-0.5">
                      <span className="w-1 h-1 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1 h-1 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "100ms" }} />
                      <span className="w-1 h-1 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "200ms" }} />
                    </span>
                  </div>
                </div>
              )}

              {/* Suggestions (only on first message) */}
              {messages.length <= 1 && !isGenerating && (
                <div className="space-y-1.5 pt-1">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium px-1">Try saying</p>
                  {SUGGESTIONS.slice(0, 5).map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSend(s)}
                      className="w-full text-left text-[11px] text-muted-foreground hover:text-foreground px-3 py-2 rounded-xl hover:bg-muted/60 transition-colors border border-transparent hover:border-border"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* No key warning */}
            {!apiKey && !showKeyInput && (
              <div className="px-3 pb-1">
                <button
                  onClick={() => setShowKeyInput(true)}
                  className="w-full text-[11px] text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/40 rounded-lg px-3 py-1.5 text-center hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors"
                >
                  Add Anthropic API key to enable AI generation
                </button>
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-border flex-shrink-0">
              <div className="flex gap-2 items-end">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe what to build… 'Add a pool with a stone deck'"
                  className="min-h-[38px] max-h-[120px] text-xs resize-none rounded-xl"
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
                  className="h-9 w-9 bg-gradient-cardinal shrink-0 rounded-xl"
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isGenerating}
                >
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </div>
              <p className="text-[9px] text-muted-foreground text-center mt-1.5">
                Enter → send · Shift+Enter → newline · Powered by Claude
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
