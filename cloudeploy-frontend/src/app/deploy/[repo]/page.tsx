"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function DeploymentStatus() {
  const params = useParams()
  const { repo } = params
  const [status, setStatus] = useState("pending")

  useEffect(() => {
    // Simulating deployment process
    const timer = setTimeout(() => {
      setStatus("completed")
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Deployment Status: {repo}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center p-6">
                {status === "pending" ? (
                  <>
                    <Loader2 className="h-16 w-16 animate-spin text-blue-500 mb-4" />
                    <p className="text-xl">Deployment in progress...</p>
                  </>
                ) : (
                  <>
                    <div className="text-green-500 text-6xl mb-4">✓</div>
                    <p className="text-xl mb-4">Deployment completed successfully!</p>
                    <p className="text-gray-400 mb-4">Your app is now live at:</p>
                    <a
                      href={`https://${repo}.example.com`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline mb-6"
                    >
                      https://{repo}.example.com
                    </a>
                  </>
                )}
              </div>
              <div className="flex justify-center mt-6">
                <Link href="/">
                  <Button>Back to Repositories</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

