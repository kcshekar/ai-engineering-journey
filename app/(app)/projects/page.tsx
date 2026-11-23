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
        <div className="project-card">
          <div className="card-icon cyan"><Cpu /></div>
          <div className="card-name">Enterprise workflow agents</div>
          <div className="card-desc">Day-job work: multi-agent workflow orchestration with AutoGen for complex task automation. Details are private.</div>
          <div className="card-tags">
            <span className="card-tag">AutoGen</span>
            <span className="card-tag">Orchestration</span>
            <span className="card-tag">Python</span>
          </div>
        </div>
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
