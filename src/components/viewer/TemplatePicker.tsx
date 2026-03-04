import { useState, useRef } from "react";
import { PROJECT_TEMPLATES, ProjectTemplate } from "@/lib/templates";
import { useViewer, SceneObject } from "@/contexts/ViewerContext";
import { Boxes, Zap, AlertTriangle, ArrowRight, Upload, FileText, X, Loader2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TemplatePickerProps {
  onDismiss: () => void;
}

function complexityIcon(c: ProjectTemplate["complexity"]) {
  if (c === "empty")  return <span className="text-muted-foreground"><Boxes className="w-3.5 h-3.5" /></span>;
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
  if (c === "empty")  return "text-muted-foreground";
  if (c === "light")  return "text-emerald-400";
  if (c === "medium") return "text-amber-400";
  return "text-red-400";
}

// Generate a basic house from a "blueprint" — in production this would use AI vision
function generateFromBlueprint(fileName: string): { name: string; objects: SceneObject[] } {
  const id = () => `bp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const baseName = fileName.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
  const projectName = baseName.length > 2 ? baseName.charAt(0).toUpperCase() + baseName.slice(1) : "Blueprint Import";

  const objects: SceneObject[] = [
    // Foundation
    { id: id(), type: "floor", position: [0, 0.1, 0], rotation: [0, 0, 0], scale: [12, 0.2, 10], material: "concrete-polished", layer: "architectural", visible: true, locked: false, name: "Foundation", properties: {} },
    // Walls
    { id: id(), type: "wall", position: [0, 1.6, -5], rotation: [0, 0, 0], scale: [12, 3.0, 0.25], material: "concrete", layer: "architectural", visible: true, locked: false, name: "Front Wall", properties: {} },
    { id: id(), type: "wall", position: [0, 1.6, 5], rotation: [0, 0, 0], scale: [12, 3.0, 0.25], material: "concrete", layer: "architectural", visible: true, locked: false, name: "Rear Wall", properties: {} },
    { id: id(), type: "wall", position: [-6, 1.6, 0], rotation: [0, 0, 0], scale: [0.25, 3.0, 10], material: "concrete", layer: "architectural", visible: true, locked: false, name: "Left Wall", properties: {} },
    { id: id(), type: "wall", position: [6, 1.6, 0], rotation: [0, 0, 0], scale: [0.25, 3.0, 10], material: "concrete", layer: "architectural", visible: true, locked: false, name: "Right Wall", properties: {} },
    // Interior wall
    { id: id(), type: "wall", position: [0, 1.6, 0], rotation: [0, 0, 0], scale: [0.2, 3.0, 10], material: "drywall", layer: "architectural", visible: true, locked: false, name: "Interior Partition", properties: {} },
    // Roof
    { id: id(), type: "roof", position: [0, 3.2, 0], rotation: [0, 0, 0], scale: [13, 2.4, 11], material: "slate-charcoal", layer: "architectural", visible: true, locked: false, name: "Gable Roof", properties: { style: "gable" } },
    // Front door
    { id: id(), type: "door", position: [-2, 1.2, -5], rotation: [0, 0, 0], scale: [1.0, 2.2, 0.08], material: "oak-hardwood", layer: "architectural", visible: true, locked: false, name: "Front Door", properties: {} },
    // Windows
    { id: id(), type: "window", position: [2, 1.5, -5], rotation: [0, 0, 0], scale: [1.6, 1.4, 0.12], material: "glass-clear", layer: "architectural", visible: true, locked: false, name: "Front Window", properties: {} },
    { id: id(), type: "window", position: [-4, 1.5, -5], rotation: [0, 0, 0], scale: [1.2, 1.4, 0.12], material: "glass-clear", layer: "architectural", visible: true, locked: false, name: "Front Window L", properties: {} },
    { id: id(), type: "window", position: [0, 1.5, 5], rotation: [0, 0, 0], scale: [2.0, 1.4, 0.12], material: "glass-clear", layer: "architectural", visible: true, locked: false, name: "Rear Window", properties: {} },
    // Porch
    { id: id(), type: "deck", position: [-2, 0.15, -6.2], rotation: [0, 0, 0], scale: [4, 0.2, 2], material: "oak-hardwood", layer: "site", visible: true, locked: false, name: "Front Porch", properties: {} },
    // Landscaping
    { id: id(), type: "vegetation", position: [-8, 0, -2], rotation: [0, 0, 0], scale: [3, 7, 3], material: "wood", layer: "landscape", visible: true, locked: false, name: "Oak Tree", properties: { variant: "oak" } },
    { id: id(), type: "vegetation", position: [8, 0, 3], rotation: [0, 0, 0], scale: [2, 5, 2], material: "wood", layer: "landscape", visible: true, locked: false, name: "Birch Tree", properties: { variant: "birch" } },
  ];

  return { name: projectName, objects };
}

const PIPELINE_STEPS = [
  "Uploading blueprint…",
  "Analyzing floor plan…",
  "Extracting walls & rooms…",
  "Generating 3D geometry…",
  "Applying materials…",
  "Ready!",
];

export default function TemplatePicker({ onDismiss }: TemplatePickerProps) {
  const { dispatch } = useViewer();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [uploadMode, setUploadMode] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [pipelineStep, setPipelineStep] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function pickTemplate(t: ProjectTemplate) {
    if (t.id === "blank") {
      dispatch({ type: "NEW_PROJECT" });
    } else {
      dispatch({ type: "LOAD_PROJECT", payload: { name: t.name, objects: t.objects } });
    }
    onDismiss();
  }

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setUploadedFile(file);
  }

  function startProcessing() {
    if (!uploadedFile) return;
    setProcessing(true);
    setPipelineStep(0);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step >= PIPELINE_STEPS.length) {
        clearInterval(interval);
        // Generate and load the model
        const result = generateFromBlueprint(uploadedFile.name);
        dispatch({ type: "LOAD_PROJECT", payload: { name: result.name, objects: result.objects } });
        onDismiss();
        return;
      }
      setPipelineStep(step);
    }, 800);
  }

  const uploadAccent = "#6366f1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="w-full max-w-2xl mx-4 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-border">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            {uploadMode ? "Upload Blueprint" : "Choose a starting point"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {uploadMode
              ? "Upload your floor plan and we'll generate a 3D model automatically."
              : "Pick a template, upload a blueprint, or start from scratch."}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!uploadMode ? (
            <motion.div
              key="templates"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.15 }}
            >
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
                      borderColor: hoveredId === t.id ? `${t.accent}99` : "hsl(var(--border))",
                      background: hoveredId === t.id
                        ? `linear-gradient(135deg, ${t.accent}18 0%, hsl(var(--card)) 100%)`
                        : "hsl(var(--muted) / 0.3)",
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
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <span className="font-semibold text-foreground text-sm leading-tight">{t.name}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-0.5 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-foreground" />
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-3">{t.description}</p>
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

                {/* Upload Blueprint card */}
                <button
                  onClick={() => setUploadMode(true)}
                  onMouseEnter={() => setHoveredId("upload")}
                  onMouseLeave={() => setHoveredId(null)}
                  className="group relative text-left rounded-xl border border-dashed transition-all duration-150 overflow-hidden focus:outline-none col-span-2"
                  style={{
                    borderColor: hoveredId === "upload" ? `${uploadAccent}99` : "hsl(var(--border))",
                    background: hoveredId === "upload"
                      ? `linear-gradient(135deg, ${uploadAccent}12 0%, hsl(var(--card)) 100%)`
                      : "hsl(var(--muted) / 0.15)",
                  }}
                >
                  <div className="p-4 flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"
                      style={{
                        background: hoveredId === "upload" ? `${uploadAccent}25` : `${uploadAccent}15`,
                      }}
                    >
                      <Upload className="w-5 h-5" style={{ color: uploadAccent }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-semibold text-foreground text-sm">Upload Blueprint</span>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                        Drop a PDF, DWG, or image of your floor plan — AI converts it to a 3D model.
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-foreground" />
                  </div>
                </button>
              </div>

              {/* Footer */}
              <div className="px-6 pb-5 text-center">
                <p className="text-[11px] text-muted-foreground/50">
                  You can always switch templates later via <span className="text-muted-foreground">File → New Project</span>
                </p>
              </div>
            </motion.div>
          ) : !processing ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="p-6"
            >
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.dwg,.dxf,.png,.jpg,.jpeg,.webp"
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />

              {/* Drop zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer ${
                  dragOver
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-muted-foreground"
                }`}
              >
                <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground mb-1">
                  Drop your blueprint here or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  PDF, DWG, DXF, PNG, JPG — up to 50MB
                </p>
              </div>

              {/* Uploaded file preview */}
              {uploadedFile && (
                <div className="mt-4 flex items-center gap-3 bg-muted rounded-lg px-3 py-2.5">
                  <FileText className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-sm text-foreground truncate flex-1">{uploadedFile.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {(uploadedFile.size / 1024 / 1024).toFixed(1)}MB
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); setUploadedFile(null); }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              {/* Action buttons */}
              <div className="mt-6 flex items-center gap-3">
                <button
                  onClick={() => { setUploadMode(false); setUploadedFile(null); }}
                  className="px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={startProcessing}
                  disabled={!uploadedFile}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: uploadedFile ? `linear-gradient(135deg, ${uploadAccent}, ${uploadAccent}cc)` : undefined,
                    color: uploadedFile ? "#fff" : undefined,
                    backgroundColor: !uploadedFile ? "hsl(var(--muted))" : undefined,
                  }}
                >
                  Generate 3D Model
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-8"
            >
              <div className="space-y-3 mb-6">
                {PIPELINE_STEPS.map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {i < pipelineStep ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                    ) : i === pipelineStep ? (
                      <Loader2 className="h-5 w-5 text-primary animate-spin shrink-0" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-border shrink-0" />
                    )}
                    <span className={`text-sm ${i <= pipelineStep ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${uploadAccent}, ${uploadAccent}cc)` }}
                  initial={{ width: "0%" }}
                  animate={{ width: `${Math.round((pipelineStep / (PIPELINE_STEPS.length - 1)) * 100)}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-xs text-muted-foreground text-center mt-3">
                {Math.round((pipelineStep / (PIPELINE_STEPS.length - 1)) * 100)}% complete
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
