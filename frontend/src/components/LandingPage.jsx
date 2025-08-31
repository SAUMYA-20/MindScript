import React, { useState } from "react"
import { JournalEditor } from "./JournalEditor"
import { Dashboard } from "./Dashboard"
import { CommunitySpace } from "./CommunitySpace"
import { InsightsPanel } from "./InsightsPanel"
import { BookOpen, BarChart3, Users, Brain } from "lucide-react"

// Tabs container
function Tabs({ defaultValue, className, children }) {
  const [activeTab, setActiveTab] = useState(defaultValue)

  return (
    <div className={className} data-active-tab={activeTab}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, { activeTab, setActiveTab })
          : child
      )}
    </div>
  )
}

// Tabs header
function TabsList({ className, children, activeTab, setActiveTab }) {
  return (
    <div
      className={`flex gap-2 border-b border-gray-200 bg-gray-50 px-4 py-2 ${className || ""}`}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, { activeTab, setActiveTab })
          : child
      )}
    </div>
  )
}

// Single tab button
function TabsTrigger({ value, className, children, activeTab, setActiveTab }) {
  const isActive = activeTab === value
  return (
    <button
      onClick={() => setActiveTab?.(value)}
      className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all ${
        isActive
          ? "bg-white text-blue-600 shadow-sm border border-gray-200"
          : "text-gray-600 hover:text-gray-900 hover:bg-white/70"
      } ${className || ""}`}
    >
      {children}
    </button>
  )
}

// Tab content
function TabsContent({ value, className, children, activeTab }) {
  if (activeTab !== value) return null
  return <div className={`p-6 ${className || ""}`}>{children}</div>
}

// Card wrapper
function Card({ className, children }) {
  return (
    <div
      className={`bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden ${className || ""}`}
    >
      {children}
    </div>
  )
}

export default function App() {
  const [entries, setEntries] = useState([
    {
      id: "1",
      content:
        "Had a great day at work today. Completed the project I've been working on for weeks. Feeling accomplished and proud.",
      date: "2024-01-15",
      mood: "positive",
      aiSummary:
        "Feeling accomplished after completing a significant work project.",
      themes: ["work", "achievement", "pride"],
      shared: true,
    },
    {
      id: "2",
      content:
        "Woke up feeling anxious about the presentation tomorrow. Need to practice more and prepare better.",
      date: "2024-01-14",
      mood: "anxious",
      aiSummary: "Experiencing pre-presentation nerves, focusing on preparation.",
      themes: ["anxiety", "work", "preparation"],
      shared: false,
    },
  ])

  const addEntry = (newEntry) => {
    const entry = { ...newEntry, id: Date.now().toString() }
    setEntries((prev) => [entry, ...prev])
  }

  const updateEntry = (id, updates) => {
    setEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, ...updates } : entry))
    )
  }

  const sharedEntries = entries.filter((entry) => entry.shared)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            MindScript Journal
          </h1>
          <p className="text-gray-600 text-lg">
            AI-powered journaling for mental well-being
          </p>
        </div>

        <Card>
          <Tabs defaultValue="journal">
            <TabsList className={"flex justify-center"}>
              <TabsTrigger value="journal">
                <BookOpen className="h-5 w-5" />
                Journal
              </TabsTrigger>
              <TabsTrigger value="dashboard">
                <BarChart3 className="h-5 w-5" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="insights">
                <Brain className="h-5 w-5" />
                Insights
              </TabsTrigger>
              <TabsTrigger value="community">
                <Users className="h-5 w-5" />
                Community
              </TabsTrigger>
            </TabsList>

            <TabsContent value="journal">
              <JournalEditor onAddEntry={addEntry} />
            </TabsContent>

            <TabsContent value="dashboard">
              <Dashboard entries={entries} />
            </TabsContent>

            <TabsContent value="insights">
              <InsightsPanel entries={entries} />
            </TabsContent>

            <TabsContent value="community">
              <CommunitySpace
                sharedEntries={sharedEntries}
                onUpdateEntry={updateEntry}
              />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}
