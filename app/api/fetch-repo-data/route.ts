import { Octokit } from "@octokit/rest"
import { type NextRequest, NextResponse } from "next/server"

const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN,
})

export async function POST(req: NextRequest) {
  try {
    const { repoUrl } = await req.json()

    const match = repoUrl.match(/github\.com\/(.+?)\/(.+?)(?:\.git)?$/)
    if (!match) {
      return NextResponse.json({ error: "Invalid GitHub URL" }, { status: 400 })
    }

    const [_, owner, repo] = match

    const { data: repoData } = await octokit.repos.get({ owner, repo })

    const { data: contents } = await octokit.repos.getContent({ owner, repo, path: "" })

    const files = Array.isArray(contents) ? contents.map((file) => ({ name: file.name, type: file.type })) : []

    const languages = await fetchLanguages(owner, repo)

    return NextResponse.json({
      name: repoData.name,
      description: repoData.description,
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      languages,
      files,
    })
  } catch (error: any) {
    console.error("Error fetching repo data:", error)
    return NextResponse.json({ error: "Failed to fetch repository data", details: error.message }, { status: 500 })
  }
}

async function fetchLanguages(owner: string, repo: string) {
  const { data } = await octokit.repos.listLanguages({ owner, repo })
  return data
}
