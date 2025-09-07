"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Copy, Download } from "lucide-react"


export default function AvatarGenerator() {
  const [text, setText] = useState("John Doe")
  const [style, setStyle] = useState("pastel")
  const [size, setSize] = useState("120")
  

  const avatarUrl = `/api/avatar/${encodeURIComponent(text)}?style=${style}&size=${size}`
  const fullUrl = typeof window !== "undefined" ? `${window.location.origin}${avatarUrl}` : avatarUrl

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
     console.log('copied!')
    } catch (err) {
      console.log('failed to copy');
    }
  }

  const downloadAvatar = () => {
    const link = document.createElement("a")
    link.href = avatarUrl
    link.download = `avatar-${text.replace(/\s+/g, "-").toLowerCase()}.svg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const examples = [
    { text: "John Doe", style: "pastel" },
    { text: "Jane Smith", style: "vibrant" },
    { text: "Alex Johnson", style: "monochrome" },
    { text: "Sarah Wilson", style: "pastel" },
    { text: "Mike Brown", style: "vibrant" },
    { text: "Lisa Davis", style: "monochrome" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 pt-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Avatar Generator</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Generate beautiful avatars via URL. Perfect for user profiles, placeholders, and more. Just like boring
            avatars but with more style options!
          </p>
        </div>

        {/* Main Generator */}
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>Generate Your Avatar</CardTitle>
            <CardDescription>Enter text (name, initials, etc.) and customize the style</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Preview */}
            <div className="flex justify-center">
              <div className="relative">
                <img
                  src={avatarUrl || "/placeholder.svg"}
                  alt={`Avatar for ${text}`}
                  className="rounded-lg shadow-lg"
                  width={Number.parseInt(size)}
                  height={Number.parseInt(size)}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Text</label>
                <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter name or initials" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Style</label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pastel">Pastel</SelectItem>
                    <SelectItem value="vibrant">Vibrant</SelectItem>
                    <SelectItem value="monochrome">Monochrome</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Size</label>
                <Select value={size} onValueChange={setSize}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="64">64px</SelectItem>
                    <SelectItem value="120">120px</SelectItem>
                    <SelectItem value="200">200px</SelectItem>
                    <SelectItem value="300">300px</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* URL Display */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Generated URL</label>
              <div className="flex gap-2">
                <Input value={fullUrl} readOnly className="font-mono text-sm" />
                <Button variant="outline" size="icon" onClick={() => copyToClipboard(fullUrl)}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={downloadAvatar}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Examples</CardTitle>
            <CardDescription>Click any example to try it out</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {examples.map((example, index) => (
                <div
                  key={index}
                  className="text-center space-y-2 cursor-pointer group"
                  onClick={() => {
                    setText(example.text)
                    setStyle(example.style)
                  }}
                >
                  <img
                    src={`/api/avatar/${encodeURIComponent(example.text)}?style=${example.style}&size=80`}
                    alt={`Avatar for ${example.text}`}
                    className="mx-auto rounded-lg shadow-md group-hover:shadow-lg transition-shadow"
                    width={80}
                    height={80}
                  />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{example.text}</p>
                    <Badge variant="secondary" className="text-xs">
                      {example.style}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* API Documentation */}
        <Card>
          <CardHeader>
            <CardTitle>API Usage</CardTitle>
            <CardDescription>How to use the avatar generator in your applications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Basic Usage</h4>
              <code className="block bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm font-mono">
                /api/avatar/John+Doe
              </code>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">With Parameters</h4>
              <code className="block bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm font-mono">
                /api/avatar/John+Doe?style=vibrant&size=200
              </code>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Parameters</h4>
              <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
                <li>
                  <strong>style:</strong> pastel, vibrant, monochrome (default: pastel)
                </li>
                <li>
                  <strong>size:</strong> 16-512 pixels (default: 120)
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
