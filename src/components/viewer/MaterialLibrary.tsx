import { useState } from "react";
import { Search, Grid3X3, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PBR_MATERIALS, MATERIAL_CATEGORIES, getMaterialsByCategory, searchMaterials } from "@/lib/materials";
import { useViewer } from "@/contexts/ViewerContext";

interface MaterialLibraryProps {
  onClose: () => void;
}

function MaterialCard({ material, onSelect }: { material: any; onSelect: () => void }) {
  return (
    <Card className="p-4 cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1 border-border" onClick={onSelect}>
      <div
        className="w-full h-20 rounded-lg mb-3 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${material.properties.color} 0%, ${material.properties.color}88 100%)` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
        {material.properties.metalness > 0.5 && <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30" />}
      </div>
      <div className="space-y-2">
        <h3 className="font-semibold text-sm text-foreground">{material.name}</h3>
        <p className="text-xs text-muted-foreground">{material.category}</p>
        <div className="flex gap-2 flex-wrap">
          {material.properties.metalness > 0.5 && <Badge variant="secondary" className="text-xs">Metallic</Badge>}
          {material.properties.roughness < 0.3 && <Badge variant="secondary" className="text-xs">Smooth</Badge>}
          {material.properties.transparent && <Badge variant="secondary" className="text-xs">Transparent</Badge>}
        </div>
        <div className="flex gap-1 flex-wrap">
          {material.tags.slice(0, 2).map((tag: string) => (
            <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0">{tag}</Badge>
          ))}
        </div>
      </div>
    </Card>
  );
}

export default function MaterialLibrary({ onClose }: MaterialLibraryProps) {
  const { state, updateObject } = useViewer();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredMaterials = searchQuery
    ? searchMaterials(searchQuery)
    : selectedCategory === "All"
    ? Object.values(PBR_MATERIALS)
    : getMaterialsByCategory(selectedCategory);

  const handleMaterialSelect = (materialId: string) => {
    if (state.selectedObjectId) {
      updateObject(state.selectedObjectId, { material: materialId as any });
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold text-foreground">Material Library</h2>
          <div className="flex items-center gap-2">
            <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search materials..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
        </div>
      </div>

      <div className="p-4 border-b border-border">
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-5 h-auto p-1">
            <TabsTrigger value="All" className="text-xs">All</TabsTrigger>
            {MATERIAL_CATEGORIES.slice(0, 4).map((category) => (
              <TabsTrigger key={category} value={category} className="text-xs">{category}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredMaterials.map((material) => (
                <MaterialCard key={material.name} material={material} onSelect={() => handleMaterialSelect(material.name.toLowerCase().replace(/\s+/g, "-"))} />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredMaterials.map((material) => (
                <Card key={material.name} className="p-3 cursor-pointer hover:shadow-md transition-all duration-200 border-border" onClick={() => handleMaterialSelect(material.name.toLowerCase().replace(/\s+/g, "-"))}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg flex-shrink-0" style={{ background: `linear-gradient(135deg, ${material.properties.color} 0%, ${material.properties.color}88 100%)` }} />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm text-foreground truncate">{material.name}</h3>
                      <p className="text-xs text-muted-foreground">{material.category}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{filteredMaterials.length} materials</span>
          {state.selectedObjectId && <span>Apply to selected object</span>}
        </div>
      </div>
    </div>
  );
}
