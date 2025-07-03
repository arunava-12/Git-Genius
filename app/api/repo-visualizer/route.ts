import { NextRequest, NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";

// Initialize Octokit
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN, // Optional: for higher rate limits
});

// Parse GitHub URL to extract owner/repo
function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  try {
    const githubRegex = /github\.com\/([^\/]+)\/([^\/]+)/;
    const match = url.match(githubRegex);
    if (match) {
      return { owner: match[1], repo: match[2].replace(/\.git$/, '') };
    }
    return null;
  } catch {
    return null;
  }
}

// Parse owner/repo format
function parseOwnerRepo(input: string): { owner: string; repo: string } | null {
  const match = input.match(/^([\w-]+)\/([\w.-]+)$/);
  if (match) {
    return { owner: match[1], repo: match[2] };
  }
  return null;
}

// Detect code relationships (basic implementation)
function detectCodeRelationships(tree: any[]): any[] {
  const relationships: any[] = [];
  const files = tree.filter(item => item.type === 'blob' && 
    /\.(js|ts|jsx|tsx|py|java|cpp|c|cs|php|rb|go|rs|swift|kt)$/i.test(item.path));
  
  // Group files by directory
  const dirGroups: Record<string, any[]> = {};
  files.forEach(file => {
    const dir = file.path.split('/').slice(0, -1).join('/') || 'root';
    if (!dirGroups[dir]) dirGroups[dir] = [];
    dirGroups[dir].push(file);
  });

  // Add relationships within directories
  Object.values(dirGroups).forEach(group => {
    if (group.length > 1) {
      group.forEach((file, i) => {
        if (i < group.length - 1) {
          relationships.push({
            source: file.path,
            target: group[i + 1].path,
            type: 'co-located'
          });
        }
      });
    }
  });

  return relationships;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const input = searchParams.get("repo");
  
  if (!input) {
    return NextResponse.json({ error: "Repository input is required" }, { status: 400 });
  }

  let owner: string;
  let repo: string;

  // Try parsing as GitHub URL first
  const urlParse = parseGitHubUrl(input);
  if (urlParse) {
    owner = urlParse.owner;
    repo = urlParse.repo;
  } else {
    // Try parsing as owner/repo format
    const repoParse = parseOwnerRepo(input);
    if (!repoParse) {
      return NextResponse.json({ 
        error: "Invalid format. Please provide a GitHub URL or owner/repo format" 
      }, { status: 400 });
    }
    owner = repoParse.owner;
    repo = repoParse.repo;
  }

  try {
    // Fetch repo metadata using Octokit
    const { data: repoData } = await octokit.repos.get({
      owner,
      repo,
    });

    // Fetch file tree using Octokit
    const { data: treeData } = await octokit.git.getTree({
      owner,
      repo,
      tree_sha: repoData.default_branch,
      recursive: 'true',
    });

    // Detect code relationships
    const relationships = detectCodeRelationships(treeData.tree);

    // Compose response
    return NextResponse.json({
      name: repoData.name,
      description: repoData.description,
      language: repoData.language,
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      visibility: repoData.private ? "Private" : "Public",
      html_url: repoData.html_url,
      default_branch: repoData.default_branch,
      size: repoData.size,
      created_at: repoData.created_at,
      updated_at: repoData.updated_at,
      tree: treeData.tree,
      relationships,
      stats: {
        total_files: treeData.tree.length,
        files: treeData.tree.filter((item: any) => item.type === 'blob').length,
        directories: treeData.tree.filter((item: any) => item.type === 'tree').length,
        languages: getLanguageStats(treeData.tree),
      }
    });

  } catch (error: any) {
    console.error('GitHub API Error:', error);
    
    if (error.status === 404) {
      return NextResponse.json({ 
        error: "Repository not found. Please check the URL and ensure it's a public repository." 
      }, { status: 404 });
    }
    
    if (error.status === 403) {
      return NextResponse.json({ 
        error: "Rate limit exceeded. Please try again later or add a GitHub token for higher limits." 
      }, { status: 429 });
    }

    return NextResponse.json({ 
      error: error.message || "Failed to fetch repository data" 
    }, { status: 500 });
  }
}

// Helper function to get language statistics
function getLanguageStats(tree: any[]): Record<string, number> {
  const languageStats: Record<string, number> = {};
  
  tree.forEach(item => {
    if (item.type === 'blob') {
      const ext = item.path.split('.').pop()?.toLowerCase();
      if (ext) {
        languageStats[ext] = (languageStats[ext] || 0) + 1;
      }
    }
  });
  
  return languageStats;
} 