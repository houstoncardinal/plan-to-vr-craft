import { useState } from "react";
import { PROJECT_TEMPLATES, ProjectTemplate } from "@/lib/templates";
import { useViewer } from "@/contexts/ViewerContext";
import { Boxes, Zap, AlertTriangle, ArrowRight } from "lucide-react";

interface TemplatePickerProps {
  onDismiss: () => void;
}

function complexityIcon(c: ProjectTemplate["complexity"]) {
  if (c === "empty")  return <span className="text-slate-400"><Boxes className="w-3.5 h-3.5" /></span>;
  if (c === "light")  return <span className="text-emerald-400"><Zap className="w-3.5 h-3.5" /></span>;
  if (c === "medium") return <span className="text-amber-400"><Zap className="w-3.5 h-3.5" /></span>;
  return <span className="text-red-400"><AlertTriangle className="w-3.5 h-3.5" /></span>;
}

function complexityLabel(c: ProjectTemplate["complexity"]) {
  if (c === "empty")  return "Empty";
  if (c === "light")  return "Fast";
  if (c === "medium") return "Medium";
  return "Slow — heavy scene";
}

function complexityColor(c: ProjectTemplate["complexity"]) {
  if (c === "empty")  return "text-slate-400";
  if (c === "light")  return "text-emerald-400";
  if (c === "medium") return "text-amber-400";
  return "text-red-400";
}

export default function TemplatePicker({ onDismiss }: TemplatePickerProps) {
  const { dispatch } = useViewer();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  function pickTemplate(t: ProjectTemplate) {
    if (t.id === "blank") {
      dispatch({ type: "NEW_PROJECT" });
    } else {
      dispatch({ type: "LOAD_PROJECT", payload: { name: t.name, objects: t.objects } });
    }
    onDismiss();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-2xl mx-4 bg-[#0f1117] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-white/8">
          <h1 className="text-2xl font-bold text-white tracking-tight">Choose a starting point</h1>
          <p className="mt-1 text-sm text-white/40">Pick a template to get started, or build from scratch.</p>
        </div>

        {/* Template grid */}
        <div className="p-6 grid grid-cols-2 gap-3">
          {PROJECT_TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => pickTemplate(t)}
              onMouseEnter={() => setHoveredId(t.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="group relative text-left rounded-xl border transition-all duration-150 overflow-hidden focus:outline-none"
              style={{
                borderColor: hoveredId === t.id ? `${t.accent}99` : "rgba(255,255,255,0.08)",
                background: hoveredId === t.id
                  ? `linear-gradient(135deg, ${t.accent}22 0%, #0f1117 100%)`
                  : "rgba(255,255,255,0.03)",
              }}
            >
              {/* Accent bar */}
              <div
                className="h-1 w-full transition-opacity duration-150"
                style={{
                  background: `linear-gradient(90deg, ${t.accent}, ${t.accent}44)`,
                  opacity: hoveredId === t.id ? 1 : 0.35,
                }}
              />

              <div className="p-4">
                {/* Name row */}
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="font-semibold text-white text-sm leading-tight">{t.name}</span>
                  <ArrowRight
                    className="w-3.5 h-3.5 text-white/30 flex-shrink-0 mt-0.5 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-white/60"
                  />
                </div>

                {/* Description */}
                <p className="text-xs text-white/45 leading-relaxed mb-3">{t.description}</p>

                {/* Footer chips */}
                <div className="flex items-center gap-2">
                  <span
                    className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                    style={{
                      background: `${t.accent}33`,
                      color: `${t.accent}ee`,
                      border: `1px solid ${t.accent}44`,
                    }}
                  >
                    {t.tag}
                  </span>
                  <span className={`flex items-center gap-1 text-[10px] font-medium ${complexityColor(t.complexity)}`}>
                    {complexityIcon(t.complexity)}
                    {complexityLabel(t.complexity)}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 text-center">
          <p className="text-[11px] text-white/25">
            You can always switch templates later via <span className="text-white/45">File → New Project</span>
          </p>
        </div>
      </div>
    </div>
  );
}
