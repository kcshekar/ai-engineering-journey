import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { FolderGit2, ExternalLink, Cpu, MessageSquare } from "lucide-react"

export default async function ProjectsPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }

  return (
    <div>
      <div className="section-title"><FolderGit2 /> Projects</div>
      <div className="projects-grid">
        <a
          className="project-card"
          href="https://github.com/kcshekar/ai-engineering-journey/tree/main/projects/cuva-ai"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div className="card-icon cyan"><Cpu /></div>
          <div className="card-name">Cuva AI</div>
          <div className="card-desc">AI-powered workflow orchestration platform using AutoGen agents for complex task automation.</div>
          <div className="card-tags">
            <span className="card-tag">AutoGen</span>
            <span className="card-tag">Orchestration</span>
            <span className="card-tag">Python</span>
          </div>
          <div className="card-link">Architecture notes <ExternalLink /></div>
        </a>
        <a
          className="project-card"
          href="https://github.com/kcshekar/ai-engineering-journey/tree/main/projects/nuraknect"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div className="card-icon purple"><MessageSquare /></div>
          <div className="card-name">NuraKnect AI</div>
          <div className="card-desc">AI-powered Instagram DM management platform that classifies, responds to, and manages direct messages.</div>
          <div className="card-tags">
            <span className="card-tag">NLP</span>
            <span className="card-tag">Classification</span>
            <span className="card-tag">LLM APIs</span>
          </div>
          <div className="card-link">Architecture notes <ExternalLink /></div>
        </a>
      </div>
    </div>
  )
}
