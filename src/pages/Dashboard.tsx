import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Plus,
  Upload,
  FileText,
  X,
  CheckCircle2,
  Loader2,
  Eye,
  Clock,
  Building2,
} from "lucide-react";
import { Link } from "react-router-dom";

interface Project {
  id: string;
  name: string;
  status: "processing" | "ready" | "draft";
  progress: number;
  date: string;
  files: number;
}

const mockProjects: Project[] = [
  { id: "1", name: "Meridian Tower — Phase 2", status: "ready", progress: 100, date: "Feb 18, 2026", files: 12 },
  { id: "2", name: "Harbor View Residences", status: "processing", progress: 67, date: "Feb 19, 2026", files: 8 },
  { id: "3", name: "Civic Center Renovation", status: "draft", progress: 0, date: "Feb 17, 2026", files: 3 },
];

const pipelineSteps = [
  "Uploading files…",
  "AI analyzing plans…",
  "Extracting geometry…",
  "Building 3D model…",
  "Applying materials…",
  "Ready to explore!",
];

export default function Dashboard() {
  const [showUpload, setShowUpload] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [pipelineStep, setPipelineStep] = useState(0);
  const [pipelineProgress, setPipelineProgress] = useState(0);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    setUploadedFiles((prev) => [...prev, ...Array.from(files)]);
  };

  const startProcessing = () => {
    setProcessing(true);
    setPipelineStep(0);
    setPipelineProgress(0);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step >= pipelineSteps.length) {
        clearInterval(interval);
        return;
      }
      setPipelineStep(step);
      setPipelineProgress(Math.round((step / (pipelineSteps.length - 1)) * 100));
    }, 1500);
  };

  const statusBadge = (status: Project["status"]) => {
    const map = {
      ready: "bg-green-50 text-green-700 border-green-200",
      processing: "bg-amber-50 text-amber-700 border-amber-200",
      draft: "bg-secondary text-muted-foreground border-border",
    };
    return (
      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${map[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container pt-24 pb-16">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Projects</h1>
            <p className="text-muted-foreground mt-1">Manage your architectural models</p>
          </div>
          <Button
            onClick={() => setShowUpload(true)}
            className="bg-gradient-cardinal text-primary-foreground shadow-cardinal hover:opacity-90"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {mockProjects.map((project) => (
            <Card
              key={project.id}
              className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-cardinal-light flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                {statusBadge(project.status)}
              </div>
              <h3 className="font-semibold text-foreground mb-1">{project.name}</h3>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {project.date}
                </span>
                <span className="flex items-center gap-1">
                  <FileText className="h-3 w-3" /> {project.files} files
                </span>
              </div>
              {project.status === "processing" && (
                <Progress value={project.progress} className="h-1.5 mb-3" />
              )}
              <Link to="/viewer">
                <Button variant="outline" size="sm" className="w-full" disabled={project.status === "processing"}>
                  <Eye className="mr-2 h-3.5 w-3.5" />
                  {project.status === "ready" ? "View Model" : project.status === "processing" ? "Processing…" : "Upload Files"}
                </Button>
              </Link>
            </Card>
          ))}
        </div>

        {/* Upload Modal */}
        <AnimatePresence>
          {showUpload && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4"
              onClick={() => !processing && setShowUpload(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-card rounded-2xl border border-border shadow-lg w-full max-w-lg p-8"
              >
                {!processing ? (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-display text-xl font-semibold text-foreground">
                        Upload Plans
                      </h2>
                      <button onClick={() => setShowUpload(false)} className="text-muted-foreground hover:text-foreground">
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <div
                      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
                      className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer ${
                        dragOver ? "border-primary bg-cardinal-light" : "border-border hover:border-muted-foreground"
                      }`}
                      onClick={() => document.getElementById("file-input")?.click()}
                    >
                      <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                      <p className="text-sm font-medium text-foreground mb-1">
                        Drop files here or click to browse
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PDF, DWG, DXF, DOCX — up to 50MB each
                      </p>
                      <input
                        id="file-input"
                        type="file"
                        multiple
                        accept=".pdf,.dwg,.dxf,.docx"
                        className="hidden"
                        onChange={(e) => handleFiles(e.target.files)}
                      />
                    </div>

                    {uploadedFiles.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {uploadedFiles.map((file, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 text-sm bg-secondary rounded-lg px-3 py-2"
                          >
                            <FileText className="h-4 w-4 text-primary shrink-0" />
                            <span className="text-foreground truncate flex-1">{file.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {(file.size / 1024 / 1024).toFixed(1)}MB
                            </span>
                            <button
                              onClick={() => setUploadedFiles((prev) => prev.filter((_, j) => j !== i))}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <Button
                      onClick={startProcessing}
                      disabled={uploadedFiles.length === 0}
                      className="w-full mt-6 bg-gradient-cardinal text-primary-foreground shadow-cardinal hover:opacity-90"
                    >
                      Start AI Processing
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <h2 className="font-display text-xl font-semibold text-foreground mb-8">
                      Processing Your Plans
                    </h2>
                    <div className="space-y-4 text-left mb-8">
                      {pipelineSteps.map((step, i) => (
                        <div key={i} className="flex items-center gap-3">
                          {i < pipelineStep ? (
                            <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                          ) : i === pipelineStep ? (
                            <Loader2 className="h-5 w-5 text-primary animate-spin shrink-0" />
                          ) : (
                            <div className="h-5 w-5 rounded-full border-2 border-border shrink-0" />
                          )}
                          <span
                            className={`text-sm ${
                              i <= pipelineStep ? "text-foreground font-medium" : "text-muted-foreground"
                            }`}
                          >
                            {step}
                          </span>
                        </div>
                      ))}
                    </div>
                    <Progress value={pipelineProgress} className="h-2 mb-4" />
                    <p className="text-xs text-muted-foreground">
                      {pipelineProgress}% complete
                    </p>
                    {pipelineStep === pipelineSteps.length - 1 && (
                      <Link to="/viewer">
                        <Button className="mt-6 bg-gradient-cardinal text-primary-foreground shadow-cardinal">
                          <Eye className="mr-2 h-4 w-4" />
                          View 3D Model
                        </Button>
                      </Link>
                    )}
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
