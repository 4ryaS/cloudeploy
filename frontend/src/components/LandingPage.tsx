"use client"

import { useEffect, useState } from "react"
import { Github, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

interface Repository {
  name: string;
  description: string;
  updatedAt: string;
}

export default function LandingPage() {
  const [githubId, setGithubId] = useState("")
  const [repos, setRepos] = useState<Repository[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRepos([]);
    setIsLoading(true);
    await getRepos();
    setIsLoading(false);
  }

  const getRepos = async () => {
    try {
      const response = await fetch(`https://api.github.com/users/${githubId}/repos`);
      if (!response.ok) throw new Error(`Error: ${response.status} ${response.statusText}`);

      const data = await response.json();
      const repositories = data.map((item: any) => ({
        name: item.name,
        description: item.description,
        updatedAt: new Date(item.updated_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
      }));
      setRepos(repositories)
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Responsive header with padding on small screens */}
      <header className="container mx-auto py-4 px-4 sm:py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold">Cloudeploy</h1>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-white"
          >
            <Github className="h-5 w-5 sm:h-6 sm:w-6" />
          </a>
        </div>
      </header>
      
      {/* Main content with responsive padding */}
      <main className="container mx-auto px-4 py-6 sm:py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">Deploy your projects with a single click!</h2>
          <p className="text-lg sm:text-xl mb-6 sm:mb-8">given that there are no build errors, else you will need more clicks 🙄</p>
          
          {/* Responsive form that stacks on mobile */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-12">
            <Input
              type="text"
              placeholder="Enter your GitHub username"
              value={githubId}
              onChange={(e) => setGithubId(e.target.value)}
              className="flex-grow text-white"
            />
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              <Github className="mr-2 h-4 w-4" />
              {isLoading ? "Loading..." : "Fetch Repos"}
            </Button>
          </form>
          
          {/* Repository section */}
          <div className="mt-8 sm:mt-12">
            <h3 className="text-xl sm:text-2xl font-bold mb-4">Your Repositories</h3>
            {repos.length === 0 ? (
              <Card className="bg-gray-700">
                <CardContent className="p-6 sm:p-8 text-center">
                  <p className="text-lg text-gray-300">Your repositories will be shown here.</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Enter your GitHub ID and click "Fetch Repos" to see your repositories.
                  </p>
                </CardContent>
              </Card>
            ) : (
              // Responsive grid - 1 column on mobile, 2 on tablet, 3 on desktop
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {repos.map((repo, index) => (
                  <Card key={index} className="bg-gray-700 h-full">
                    <CardContent className="p-5 sm:p-6 flex flex-col h-full">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="text-lg font-semibold break-words overflow-hidden mr-2" style={{ wordBreak: "break-word" }}>
                          {repo.name}
                        </h4>
                        <Link href={`/deploy/${githubId}/${repo.name}`}>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap flex-shrink-0">
                            <Rocket className="mr-2 h-4 w-4" /> Select
                          </Button>
                        </Link>
                      </div>
                      <p className="text-sm text-gray-300 mb-auto overflow-hidden text-ellipsis line-clamp-3">
                        {repo.description || "No description available"}
                      </p>
                      <div className="flex items-center justify-between mt-4 text-sm text-gray-400">
                        <span>Updated: {repo.updatedAt}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Responsive footer */}
      <footer className="container mx-auto py-4 sm:py-6 text-center text-gray-400 px-4">
        <p>Currently supporting only react projects</p>
      </footer>
    </div>
  )
}