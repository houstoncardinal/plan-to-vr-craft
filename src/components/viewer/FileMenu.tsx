import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useViewer } from "@/contexts/ViewerContext";
import { mansionObjects, MANSION_PROJECT_NAME, blankObjects } from "@/lib/mansionProject";
import {
  FilePlus,
  FolderOpen,
  Save,
  Download,
  Upload,
  Clock,
  ChevronRight,
  FileText,
  Trash2,
  X,
} from "lucide-react";

// ─── localStorage helpers ──────────────────────────────────────────────────────
const STORAGE_KEY = "vr-craft-projects";
const CURRENT_KEY = "vr-craft-current";

interface SavedProject {
  id: string;
  name: string;
  savedAt: string;
  preview?: string; // first object type as hint
}

function listProjects(): SavedProject[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveProject(name: string, objects: any[], dayNight: number, season: string): string {
  const id = `proj_${Date.now()}`;
  const data = { version: "1.0", name, savedAt: new Date().toISOString(), objects, dayNight, season };
  localStorage.setItem(`vr-craft-project-${id}`, JSON.stringify(data));
  const list = listProjects().filter((p) => p.name !== name); // replace if same name
  list.unshift({ id, name, savedAt: data.savedAt, preview: objects[0]?.type });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 20)));
  localStorage.setItem(CURRENT_KEY, id);
  return id;
}

function loadProject(id: string) {
  try {
    const raw = localStorage.getItem(`vr-craft-project-${id}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function deleteProject(id: string) {
  localStorage.removeItem(`vr-craft-project-${id}`);
  const list = listProjects().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

// ─── Confirm dialog ────────────────────────────────────────────────────────────
function ConfirmDialog({
  message,
  onConfirm,
  onCancel,
}: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-card border border-border rounded-xl shadow-2xl p-6 w-80 max-w-[90vw]"
      >
        <p className="text-sm text-foreground mb-5 leading-relaxed">{message}</p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-1.5 rounded-md text-xs bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
          >
            Discard &amp; Continue
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Rename input dialog ────────────────────────────────────────────────────────
function RenameDialog({
  current,
  onConfirm,
  onCancel,
}: {
  current: string;
  onConfirm: (name: string) => void;
  onCancel: () => void;
}) {
  const [value, setValue] = useState(current);
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-card border border-border rounded-xl shadow-2xl p-6 w-80"
      >
        <p className="text-sm font-medium text-foreground mb-3">Save Project As</p>
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && value.trim()) onConfirm(value.trim()); if (e.key === "Escape") onCancel(); }}
          className="w-full bg-muted border border-border rounded-md px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50 mb-4"
          placeholder="Project name"
        />
        <div className="flex gap-2 justify-end">
          <button onClick={onCancel} className="px-3 py-1.5 rounded-md text-xs text-muted-foreground hover:bg-muted/60 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => value.trim() && onConfirm(value.trim())}
            className="px-3 py-1.5 rounded-md text-xs bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Save
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── FileMenu component ────────────────────────────────────────────────────────
export default function FileMenu() {
  const { state, dispatch } = useViewer();
  const [open, setOpen] = useState(false);
  const [showRecent, setShowRecent] = useState(false);
  const [confirm, setConfirm] = useState<{ message: string; action: () => void } | null>(null);
  const [showRename, setShowRename] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const close = () => { setOpen(false); setShowRecent(false); };

  const withConfirm = (message: string, action: () => void) => {
    if (state.objects.length === 0) { action(); return; }
    setConfirm({ message, action });
  };

  const handleNew = () => {
    close();
    withConfirm(
      "Starting a new project will discard your current scene. Continue?",
      () => dispatch({ type: "NEW_PROJECT" })
    );
  };

  const handleDemo = () => {
    close();
    withConfirm(
      "Loading the demo will replace your current scene. Continue?",
      () => dispatch({ type: "LOAD_PROJECT", payload: { name: MANSION_PROJECT_NAME, objects: mansionObjects } })
    );
  };

  const handleSave = () => {
    saveProject(state.projectName, state.objects, state.dayNightCycle, state.season);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    close();
  };

  const handleSaveAs = () => {
    close();
    setShowRename(true);
  };

  const handleRenameConfirm = (name: string) => {
    dispatch({ type: "RENAME_PROJECT", payload: name });
    saveProject(name, state.objects, state.dayNightCycle, state.season);
    setShowRename(false);
  };

  const handleExport = () => {
    const data = {
      version: "1.0",
      name: state.projectName,
      exportedAt: new Date().toISOString(),
      objects: state.objects,
      dayNightCycle: state.dayNightCycle,
      season: state.season,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${state.projectName.replace(/\s+/g, "-").toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    close();
  };

  const handleImport = () => {
    fileInputRef.current?.click();
    close();
  };

  const handleFileRead = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        if (data.objects) {
          dispatch({ type: "LOAD_PROJECT", payload: { name: data.name || file.name, objects: data.objects } });
        }
      } catch {
        alert("Invalid project file.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleLoadRecent = (id: string) => {
    const data = loadProject(id);
    if (!data) return;
    close();
    withConfirm(
      "Loading a saved project will replace your current scene. Continue?",
      () => dispatch({ type: "LOAD_PROJECT", payload: { name: data.name, objects: data.objects } })
    );
  };

  const recentProjects = listProjects();

  const menuItems = [
    { icon: FilePlus, label: "New Project", shortcut: "⌘N", action: handleNew },
    { icon: FileText, label: "Demo: Ashford Manor", shortcut: null, action: handleDemo },
    null,
    { icon: FolderOpen, label: "Open / Import…", shortcut: "⌘O", action: handleImport },
    { icon: Clock, label: "Recent Projects", shortcut: null, action: () => setShowRecent((v) => !v), hasSubmenu: true },
    null,
    { icon: Save, label: saved ? "Saved!" : "Save", shortcut: "⌘S", action: handleSave, highlight: saved },
    { icon: Save, label: "Save As…", shortcut: "⌘⇧S", action: handleSaveAs },
    { icon: Download, label: "Export JSON", shortcut: null, action: handleExport },
    { icon: Upload, label: "Import JSON", shortcut: null, action: handleImport },
  ] as const;

  return (
    <>
      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleFileRead} />

      {/* Trigger button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`h-7 px-3 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
          open
            ? "bg-muted text-foreground"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
        }`}
      >
        <FileText className="h-3.5 w-3.5" />
        File
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-[100]" onClick={close} />
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.97 }}
              transition={{ duration: 0.12 }}
              className="absolute left-0 top-full mt-1 w-60 bg-card border border-border/80 rounded-xl shadow-2xl z-[110] overflow-hidden"
            >
              {/* Project header */}
              <div className="px-3 pt-2.5 pb-2 border-b border-border/50">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-semibold mb-0.5">Current Project</p>
                <p className="text-xs font-semibold text-foreground truncate">{state.projectName}</p>
                <p className="text-[10px] text-muted-foreground/60">{state.objects.length} objects</p>
              </div>

              {/* Menu items */}
              <div className="p-1.5">
                {menuItems.map((item, i) =>
                  item === null ? (
                    <div key={i} className="h-px bg-border/40 my-1" />
                  ) : (
                    <button
                      key={item.label}
                      onClick={item.action}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-[6px] rounded-md text-left transition-colors group ${
                        item.highlight
                          ? "text-primary bg-primary/8"
                          : "text-foreground hover:bg-muted/60"
                      }`}
                    >
                      <item.icon className={`h-3.5 w-3.5 flex-shrink-0 ${item.highlight ? "text-primary" : "text-muted-foreground"}`} />
                      <span className="text-xs flex-1">{item.label}</span>
                      {"hasSubmenu" in item && item.hasSubmenu && (
                        <ChevronRight className={`h-3 w-3 text-muted-foreground/40 transition-transform ${showRecent ? "rotate-90" : ""}`} />
                      )}
                      {item.shortcut && !("hasSubmenu" in item) && (
                        <span className="text-[10px] text-muted-foreground/40">{item.shortcut}</span>
                      )}
                    </button>
                  )
                )}

                {/* Recent projects submenu */}
                <AnimatePresence>
                  {showRecent && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-3 mt-1 border-l border-border/40 pl-2 space-y-0.5">
                        {recentProjects.length === 0 ? (
                          <p className="text-[10px] text-muted-foreground/50 px-2 py-1">No saved projects</p>
                        ) : (
                          recentProjects.map((proj) => (
                            <div key={proj.id} className="flex items-center gap-1 group/proj">
                              <button
                                onClick={() => handleLoadRecent(proj.id)}
                                className="flex-1 flex flex-col px-2 py-1 rounded-md hover:bg-muted/60 text-left transition-colors"
                              >
                                <span className="text-[11px] text-foreground truncate">{proj.name}</span>
                                <span className="text-[9px] text-muted-foreground/50">
                                  {new Date(proj.savedAt).toLocaleDateString()}
                                </span>
                              </button>
                              <button
                                onClick={() => { deleteProject(proj.id); setShowRecent(false); setShowRecent(true); }}
                                className="opacity-0 group-hover/proj:opacity-100 p-1 rounded hover:text-destructive transition-all"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Confirm dialog */}
      {confirm && (
        <ConfirmDialog
          message={confirm.message}
          onConfirm={() => { confirm.action(); setConfirm(null); }}
          onCancel={() => setConfirm(null)}
        />
      )}

      {/* Save As / Rename dialog */}
      {showRename && (
        <RenameDialog
          current={state.projectName}
          onConfirm={handleRenameConfirm}
          onCancel={() => setShowRename(false)}
        />
      )}
    </>
  );
}
