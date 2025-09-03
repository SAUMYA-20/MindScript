import React, { useEffect, useState } from "react";
import { JournalEditor } from "./JournalEditor";
import { Dashboard } from "./Dashboard";
import { CommunitySpace } from "./CommunitySpace";
import { InsightsPanel } from "./InsightsPanel";
import { BookOpen, BarChart3, Users, Brain } from "lucide-react";

function Tabs({ defaultValue, children }) {
  const [activeTab, setActiveTab] = useState(defaultValue);
  return (
    <div data-active-tab={activeTab}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, { activeTab, setActiveTab })
          : child
      )}
    </div>
  );
}

function TabsList({ children, activeTab, setActiveTab }) {
  return (
    <div className="flex justify-evenly gap-2 border-b border-gray-200 bg-gray-50 px-4 py-2">
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, { activeTab, setActiveTab })
          : child
      )}
    </div>
  );
}

function TabsTrigger({ value, children, activeTab, setActiveTab }) {
  const isActive = activeTab === value;
  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all ${
        isActive
          ? "bg-white text-blue-600 shadow-sm border border-gray-200"
          : "text-gray-600 hover:text-gray-900 hover:bg-white/70"
      }`}
    >
      {children}
    </button>
  );
}

function TabsContent({ value, children, activeTab }) {
  if (activeTab !== value) return null;
  return <div className="p-6">{children}</div>;
}

function Card({ children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
      {children}
    </div>
  );
}

export default function App() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/journals")
      .then((res) => res.json())
      .then((data) => setEntries(data))
      .catch((err) => console.error(err));
  }, []);

  const addEntry = (savedEntry) => {
    // ✅ Only update state, don't POST again
    setEntries((prev) => [savedEntry, ...prev]);
  };

  const updateEntry = async (id, updates) => {
    try {
      const res = await fetch(`http://localhost:5000/api/journals/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update entry");
      const updated = await res.json();
      setEntries((prev) =>
        prev.map((entry) => (entry._id === id ? updated : entry))
      );
    } catch (err) {
      console.error(err.message);
    }
  };

  const sharedEntries = entries.filter((entry) => entry.shared);

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
            <TabsList>
              <TabsTrigger value="journal">
                <BookOpen className="h-5 w-5" /> Journal
              </TabsTrigger>
              <TabsTrigger value="dashboard">
                <BarChart3 className="h-5 w-5" /> Dashboard
              </TabsTrigger>
              <TabsTrigger value="insights">
                <Brain className="h-5 w-5" /> Insights
              </TabsTrigger>
              <TabsTrigger value="community">
                <Users className="h-5 w-5" /> Community
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
  );
}
