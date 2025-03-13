"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function DeploymentStatus() {
  const params = useParams()
  const { username, repo } = params;

  const [status, setStatus] = useState("deploying");
  const [id, setId] = useState(null);
  const [deploy, setDeploy] = useState(false);

  async function deployRepo() {
    const response = await fetch("/api/deploy", {
      method: "POST",
      body: JSON.stringify({
        repoUrl: `https://github.com/${username}/${repo}.git`
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
    const data = await response.json();
    console.log(data); 
    setId(data.id);

  }

  useEffect(() => {
    if (!id) return;

    const interval = setInterval(async () => {
      const response = await fetch("/api/getStatus", {
        method: "POST",
        body: JSON.stringify({ id }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      setStatus(data.message);

      if (data.message === "deployed") {
        clearInterval(interval);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [id]);




  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Deploying repository: {repo}</CardTitle>
            </CardHeader>
            {
              deploy === false &&
              <CardContent>
                <div className="flex flex-col items-center justify-center p-6">
                  <Button onClick={() => {
                    setDeploy(true);
                    deployRepo();
                  }}>Deploy</Button>
                </div>
              </CardContent>
            }
            {
              deploy === true ? <CardContent>
                <div className="flex flex-col items-center justify-center p-6">
                  {status === "deploying" ? (
                    <>
                      <Loader2 className="h-16 w-16 animate-spin text-blue-500 mb-4" />
                      <p className="text-xl">Deployment in progress...</p>
                      {
                        id !== null &&
                        <>
                          <p className="text-lg">Your app will be live on: </p>
                          <a href={`http://${id}.0xdevs.xyz`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline mb-6"
                          >
                            http://{id}.0xdevs.xyz
                          </a>
                        </>
                      }

                    </>
                  ) : (
                    <>
                      <div className="text-green-500 text-6xl mb-4">✓</div>
                      <p className="text-xl mb-4">Deployment completed successfully!</p>
                      <p className="text-gray-400 mb-4">Your app is now live at:</p>
                      <a
                        href={`http://${id}.0xdevs.xyz/index.html`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline mb-6"
                      >
                        http://{id}.0xdevs.xyz
                      </a>
                    </>
                  )}
                </div>
                <div className="flex justify-center mt-6">
                  <Link href="/">
                    <Button>Back to Repositories</Button>
                  </Link>
                </div>
              </CardContent> :
                <>
                </>
            }

          </Card>
        </div>
      </main>
    </div>
  )
}

