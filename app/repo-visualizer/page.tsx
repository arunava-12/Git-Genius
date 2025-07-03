"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/ui/navbar";
import {
  Loader2,
  Star,
  GitFork,
  Folder,
  FileText,
  Globe,
  Calendar,
  HardDrive,
  GitBranch,
  Link,
  Copy,
  Check,
} from "lucide-react";
import dynamic from "next/dynamic";
import { toast } from "sonner";

const ForceGraph3D = dynamic(() => import("react-force-graph-3d"), {
  ssr: false,
});

// Format GitHub tree into text-based tree diagram
function formatTree(tree: any[]) {
  const root: any = { name: "", children: {} };

  // Step 1: Nest tree structure
  for (const item of tree) {
    const parts = item.path.split("/");
    let current = root;
    for (const part of parts) {
      if (!current.children[part]) {
        current.children[part] = { name: part, children: {} };
      }
      current = current.children[part];
    }
  }

  // Step 2: Recursively format with ├──, │, └──
  function render(node: any, prefix = "", isLast = true): string {
    const keys = Object.keys(node.children);
    return keys
      .map((key, index) => {
        const isLastChild = index === keys.length - 1;
        const branch = isLastChild ? "└── " : "├── ";
        const subPrefix = isLastChild ? "    " : "│   ";
        const line = `${prefix}${branch}${key}`;
        const subtree = render(node.children[key], prefix + subPrefix, isLastChild);
        return line + (subtree ? `\n${subtree}` : "");
      })
      .join("\n");
  }

  return render(root);
}

// Convert GitHub tree to 3D force graph
function buildGraph(tree: any[], relationships: any[] = []) {
  const nodes: any[] = [];
  const links: any[] = [];
  const nodeMap: Record<string, any> = {};
  nodeMap["root"] = { id: "root", name: "root", isFolder: true };
  nodes.push(nodeMap["root"]);
  
  for (const item of tree) {
    const parts = item.path.split("/");
    let parentId = "root";
    let currentPath = "";
    for (let i = 0; i < parts.length; i++) {
      currentPath = currentPath ? `${currentPath}/${parts[i]}` : parts[i];
      if (!nodeMap[currentPath]) {
        nodeMap[currentPath] = {
          id: currentPath,
          name: parts[i],
          isFolder: i !== parts.length - 1 || item.type === "tree",
        };
        nodes.push(nodeMap[currentPath]);
        links.push({ source: parentId, target: currentPath, type: 'structure' });
      }
      parentId = currentPath;
    }
  }

  // Add code relationships
  relationships.forEach(rel => {
    if (nodeMap[rel.source] && nodeMap[rel.target]) {
      links.push({ 
        source: rel.source, 
        target: rel.target, 
        type: 'relationship',
        color: '#ff6b6b'
      });
    }
  });

  return { nodes, links };
}

// Format file size
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Format date
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export default function RepoVisualizerPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<any>(null);
  const [view, setView] = useState<"tree" | "3d" | "stats">("tree");
  const [copied, setCopied] = useState(false);

  const graphRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<any>(null);
  const [graphSize, setGraphSize] = useState({ width: 600, height: 500 });

  useEffect(() => {
  if (!graphRef.current) return;
  const observer = new ResizeObserver(() => {
    const { width, height } = graphRef.current?.getBoundingClientRect() ?? { width: 600, height: 500 };
    setGraphSize({ width, height });
  });
  observer.observe(graphRef.current);
  return () => observer.disconnect();
}, []);


  useEffect(() => {
    if (view === "3d" && fgRef.current) {
      setTimeout(() => {
        fgRef.current.zoomToFit(400, 0);
      }, 100);
    }
  }, [view, data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setData(null);
    
    if (!input.trim()) {
      setError("Please enter a GitHub repository URL or owner/repo format");
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch(`/api/repo-visualizer?repo=${encodeURIComponent(input.trim())}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch repo data");
      }
      const json = await res.json();
      setData(json);
      toast.success(`Successfully loaded ${json.name}`);
    } catch (err: any) {
      setError(err.message || "Unknown error");
      toast.error(err.message || "Failed to load repository");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text.includes('github.com')) {
        setInput(text);
        toast.success("GitHub URL pasted!");
      } else {
        toast.error("No GitHub URL found in clipboard");
      }
    } catch (err) {
      toast.error("Failed to read clipboard");
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Landing page style radial gradient background */}
      <div className="fixed inset-0 -z-10" style={{backgroundImage: "radial-gradient(circle at 50% 0%, hsl(var(--primary)/0.2) 0%, transparent 50%)"}} />
      <Navbar />
      <div className="pt-16">
        <div className="container max-w-4xl mx-auto py-16">
        <h1 className="text-4xl font-bold mb-2 text-center">GitHub Repo Visualizer</h1>
        <p className="text-muted-foreground text-center mb-8">
          Visualize the structure and key info of any public GitHub repository. 
          Paste a GitHub URL or enter owner/repo format.
        </p>
        
        <form onSubmit={handleSubmit} className="flex gap-2 mb-8 justify-center">
          <div className="relative flex-1 max-w-md">
            <Input
              placeholder="https://github.com/owner/repo or owner/repo"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="pr-20"
              disabled={loading}
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handlePaste}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              disabled={loading}
            >
              <Link className="w-4 h-4" />
            </Button>
          </div>
          <Button type="submit" disabled={loading || !input.trim()}>
            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Visualize"}
          </Button>
        </form>
        
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        {data && (
          <>
            <Card className="p-6 mb-8">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <Folder className="w-8 h-8 text-primary" />
                  <div>
                    <h2 className="text-2xl font-semibold">{data.name}</h2>
                    <p className="text-muted-foreground text-sm">{data.description}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(data.html_url)}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <Badge variant="outline" className="justify-center">
                  <Globe className="w-3 h-3 mr-1" />
                  {data.visibility}
                </Badge>
                <Badge variant="outline" className="justify-center">
                  <Star className="w-3 h-3 mr-1" />
                  {data.stars?.toLocaleString()}
                </Badge>
                <Badge variant="outline" className="justify-center">
                  <GitFork className="w-3 h-3 mr-1" />
                  {data.forks?.toLocaleString()}
                </Badge>
                <Badge variant="outline" className="justify-center">
                  <FileText className="w-3 h-3 mr-1" />
                  {data.language || 'N/A'}
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <GitBranch className="w-4 h-4" />
                  <span>{data.default_branch}</span>
                </div>
                <div className="flex items-center gap-1">
                  <HardDrive className="w-4 h-4" />
                  <span>{formatFileSize(data.size * 1024)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Created {formatDate(data.created_at)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Updated {formatDate(data.updated_at)}</span>
                </div>
              </div>

              <a
                href={data.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline text-sm inline-flex items-center gap-1 mt-4"
              >
                View on GitHub
              </a>
            </Card>

            <div className="mb-8">
              <div className="flex gap-2 mb-4 justify-center">
                <Button
                  variant={view === "tree" ? "default" : "outline"}
                  onClick={() => setView("tree")}
                >
                  Tree View
                </Button>
                <Button
                  variant={view === "3d" ? "default" : "outline"}
                  onClick={() => setView("3d")}
                >
                  3D Graph
                </Button>
                <Button
                  variant={view === "stats" ? "default" : "outline"}
                  onClick={() => setView("stats")}
                >
                  Statistics
                </Button>
              </div>

              {view === "tree" && (
                <div className="bg-card rounded-xl p-6 shadow">
                  <h3 className="text-lg font-semibold mb-4 text-purple-300">File/Folder Structure</h3>
                  <div className="min-h-[300px] max-h-[600px] overflow-auto">
                  <pre className="font-mono text-sm whitespace-pre text-purple-300">
  {formatTree(data.tree)}
</pre>

                  </div>
                </div>
              )}

              {view === "3d" && (
                <div className="bg-card rounded-xl shadow w-full max-w-full overflow-hidden">
                  <div className="p-6 pb-0">
                    <h3 className="text-lg font-semibold mb-4">3D Repo Graph</h3>
                  </div>
                  <div ref={graphRef} className="relative w-full h-[600px]">
                    <ForceGraph3D
                      ref={fgRef}
                      graphData={buildGraph(data.tree, data.relationships)}
                      nodeAutoColorBy="isFolder"
                      nodeLabel={(node) => node.name}
                      linkDirectionalParticles={2}
                      linkDirectionalArrowLength={3}
                      linkDirectionalArrowRelPos={1}
                      backgroundColor="#18181b"
                      width={graphSize.width}
                      height={graphSize.height}
                    />
                  </div>
                </div>
              )}

              {view === "stats" && (
                <div className="bg-card rounded-xl p-6 shadow">
                  <h3 className="text-lg font-semibold mb-4">Repository Statistics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">{data.stats.total_files}</div>
                      <div className="text-sm text-muted-foreground">Total Items</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-500">{data.stats.files}</div>
                      <div className="text-sm text-muted-foreground">Files</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-500">{data.stats.directories}</div>
                      <div className="text-sm text-muted-foreground">Directories</div>
                    </div>
                  </div>
                  
                  {Object.keys(data.stats.languages).length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-md font-semibold mb-3">File Types</h4>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(data.stats.languages)
                          .sort(([,a], [,b]) => (b as number) - (a as number))
                          .slice(0, 10)
                          .map(([ext, count]) => (
                            <Badge key={ext} variant="secondary">
                              .{ext}: {count as number}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  )}

                  {data.relationships && data.relationships.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-md font-semibold mb-3">Code Relationships</h4>
                      <div className="text-sm text-muted-foreground">
                        {data.relationships.length} co-located file relationships detected
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
        </div>
      </div>
    </div>
  );
}
