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
        updatedAt: item.updated_at,
      }));
      setRepos([...repos, ...repositories])
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <header className="container mx-auto py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold ml-4">Cloudeploy</h1>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-white mr-4"
          >
            <Github className="h-6 w-6" />
          </a>
        </div>
      </header>
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Deploy your projects with a single click!</h2>
          <p className="text-xl mb-8">given that there are no build errors, else you will need more clicks 🙄</p>
          <form onSubmit={handleSubmit} className="flex gap-4 mb-12">
            <Input
              type="text"
              placeholder="Enter your GitHub ID"
              value={githubId}
              onChange={(e) => setGithubId(e.target.value)}
              className="flex-grow text-black"
            />
            <Button type="submit" disabled={isLoading}>
              <Github className="mr-2 h-4 w-4" />
              {isLoading ? "Loading..." : "Fetch Repos"}
            </Button>
          </form>
          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-4">Your Repositories</h3>
            {repos.length === 0 ? (
              <Card className="bg-gray-700">
                <CardContent className="p-8 text-center">
                  <p className="text-lg text-gray-300">Your repositories will be shown here.</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Enter your GitHub ID and click "Fetch Repos" to see your repositories.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {repos.map((repo, index) => (
                  <Card key={index} className="bg-gray-700">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <h4 className="text-lg font-semibold">{repo.name}</h4>
                        <Link href={`/deploy/${repo.name}`}>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            <Rocket className="mr-2 h-4 w-4" /> Deploy
                          </Button>
                        </Link>
                      </div>
                      <p className="text-sm text-gray-300 mt-2">{repo.description}</p>
                      <div className="flex items-center justify-between mt-4 text-sm text-gray-400">
                        <span>{repo.updatedAt}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <footer className="container mx-auto py-6 text-center text-gray-400">
        <p>Currently supporting only react projects</p>
      </footer>
    </div>
  )
}

