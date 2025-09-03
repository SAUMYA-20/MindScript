import React, { useState } from "react";
import { Lightbulb, Heart, Brain, Send } from "lucide-react";

// Custom UI Components
function Button({
  onClick,
  disabled,
  className,
  children,
  variant = "primary",
  size = "md",
}) {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500",
    secondary:
      "bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-500",
    ghost: "hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-gray-500",
  };

  const sizes = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4",
    lg: "h-12 px-6 text-lg",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${
        className || ""
      }`}
    >
      {children}
    </button>
  );
}

function Textarea({ placeholder, value, onChange, className, rows = 4 }) {
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      rows={rows}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
        className || ""
      }`}
    />
  );
}

function Card({ className, children }) {
  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 shadow-sm ${
        className || ""
      }`}
    >
      {children}
    </div>
  );
}

function CardContent({ className, children }) {
  return <div className={`p-6 ${className || ""}`}>{children}</div>;
}

function CardHeader({ className, children }) {
  return <div className={`p-6 pb-4 ${className || ""}`}>{children}</div>;
}

function CardTitle({ className, children }) {
  return (
    <h3
      className={`text-lg font-semibold leading-none tracking-tight ${
        className || ""
      }`}
    >
      {children}
    </h3>
  );
}

function Badge({ className, children, variant = "default" }) {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    outline: "border border-gray-300 bg-transparent text-gray-700",
    secondary: "bg-blue-100 text-blue-800",
  };

  return (
    <div
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        variants[variant]
      } ${className || ""}`}
    >
      {children}
    </div>
  );
}

function Switch({ id, checked, onCheckedChange }) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 ${
        checked ? "bg-blue-600" : "bg-gray-200"
      }`}
    >
      <span
        className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg transform transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

function Label({ htmlFor, className, children }) {
  return (
    <label
      htmlFor={htmlFor}
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
        className || ""
      }`}
    >
      {children}
    </label>
  );
}

export function JournalEditor({ onAddEntry }) {
  const [content, setContent] = useState("");
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [shareWithCommunity, setShareWithCommunity] = useState(false);

  // const reflectionPrompts = [
  //   "What made you feel most grateful today?",
  //   "What challenge did you overcome, and how?",
  //   "How did you show kindness to yourself or others?",
  //   "What patterns do you notice in your thoughts today?",
  //   "What would you like to improve tomorrow?",
  //   "What emotions came up for you today and why?",
  //   "What was the highlight of your day?",
  //   "How did you handle stress or difficult moments?",
  // ];

  // const analyzeEntry = async () => {
  //   if (!content.trim()) return;

  //   setIsAnalyzing(true);
  //   setTimeout(() => {
  //     const positiveWords = ['happy', 'good', 'great', 'wonderful', 'excited', 'grateful', 'proud', 'accomplished'];
  //     const negativeWords = ['sad', 'anxious', 'worried', 'stressed', 'tired', 'difficult', 'challenging'];

  //     const contentLower = content.toLowerCase();
  //     const hasPositive = positiveWords.some(word => contentLower.includes(word));
  //     const hasNegative = negativeWords.some(word => contentLower.includes(word));

  //     let mood = 'neutral';
  //     if (hasPositive && !hasNegative) mood = 'positive';
  //     else if (hasNegative && !hasPositive) mood = 'negative';
  //     else if (hasPositive && hasNegative) mood = 'mixed';

  //     const themes = [];
  //     if (contentLower.includes('work')) themes.push('work');
  //     if (contentLower.includes('family') || contentLower.includes('friend')) themes.push('relationships');
  //     if (contentLower.includes('exercise') || contentLower.includes('health')) themes.push('health');
  //     if (contentLower.includes('goal') || contentLower.includes('achievement')) themes.push('goals');
  //     if (contentLower.includes('stress') || contentLower.includes('anxiety')) themes.push('stress');

  //     const summary = `${content}`;

  //     const randomPrompts = reflectionPrompts
  //       .sort(() => Math.random() - 0.5)
  //       .slice(0, 3);

  //     setAiAnalysis({
  //       mood,
  //       summary,
  //       themes,
  //       prompts: randomPrompts
  //     });

  //     setIsAnalyzing(false);
  //   }, 2000);
  // };

  const analyzeEntry = async () => {
    if (!content.trim()) return;
    setIsAnalyzing(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/journals/analyze",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        }
      );

      if (!response.ok) throw new Error("Failed to reach backend");

      const data = await response.json();
      const normalizedMood = (data.mood || "neutral")
        .replace(/['"]+/g, "")
        .toLowerCase();
      setAiAnalysis({
        mood: normalizedMood, // ✅ trust backend, fallback to neutral
        summary: data.summary || "No summary generated.",
        themes: data.themes || [], // if you add themes later
        prompts: data.prompts || [],
      });
      // console.log("📩 Backend response:", data);
    } 
    // eslint-disable-next-line no-unused-vars
    catch (err) {
      // console.error("Error analyzing entry:", err);
      setAiAnalysis({
        mood: "neutral",
        summary: "Could not generate summary.",
        themes: [],
        prompts: [],
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const saveEntry = async () => {
  if (!content.trim() || !aiAnalysis) return;

  const entry = {
    content: content,
    date: new Date(),
    mood: aiAnalysis.mood || "",
    aiSummary: aiAnalysis.summary || "",
    themes: aiAnalysis.themes || [],
    prompts: aiAnalysis.prompts || [],
    shared: shareWithCommunity || false,
  };

  try {
    const res = await fetch("http://localhost:5000/api/journals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || "Failed to save entry");
    }

    const savedEntry = await res.json();
    console.log("✅ Entry saved:", savedEntry);

    onAddEntry(savedEntry);

    setContent("");
    setAiAnalysis(null);
    setShareWithCommunity(false);
  } catch (err) {
    console.error("Failed to save entry:", err);
  }
};


  const getMoodColor = (mood) => {
    switch (mood) {
      case "positive":
        return "bg-green-100 text-green-800";
      case "negative":
        return "bg-red-100 text-red-800";
      case "mixed":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-500" />
            Today's Journal Entry
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="What's on your mind today? Write about your thoughts, feelings, experiences, or anything you'd like to reflect on..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[200px]"
          />

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {content.length} characters •{" "}
              {content.split(" ").filter((w) => w.length > 0).length} words
            </div>
            <Button
              onClick={analyzeEntry}
              disabled={!content.trim() || isAnalyzing}
              className="flex items-center gap-2"
            >
              <Brain className="h-4 w-4" />
              {isAnalyzing ? "Analyzing..." : "Analyze with AI"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {aiAnalysis && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Brain className="h-5 w-5" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-blue-700">
                Mood Analysis
              </Label>
              {aiAnalysis.mood ? (
                <Badge className={getMoodColor(aiAnalysis.mood)}>
                  {aiAnalysis.mood.charAt(0).toUpperCase() +
                    aiAnalysis.mood.slice(1)}
                </Badge>
              ) : (
                <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>
              )}
            </div>

            <div>
              <Label className="text-sm font-medium text-blue-700">
                Summary
              </Label>
              <p className="mt-1 text-sm text-blue-800">{aiAnalysis.summary}</p>
            </div>

            {aiAnalysis.themes.length > 0 && (
              <div>
                <Label className="text-sm font-medium text-blue-700">
                  Themes
                </Label>
                <div className="mt-1 flex flex-wrap gap-2">
                  {aiAnalysis.themes.map((theme) => (
                    <Badge
                      key={theme}
                      variant="outline"
                      className="text-blue-700 border-blue-300"
                    >
                      {theme}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Label className="text-sm font-medium text-blue-700 flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Reflection Prompts
              </Label>
              <div className="space-y-2">
                {aiAnalysis.prompts.map((prompt, index) => (
                  <div
                    key={index}
                    className="p-3 bg-white rounded-lg border border-blue-200"
                  >
                    <p className="text-sm text-blue-800">{prompt}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-4 border-t border-blue-200">
              <Switch
                id="share-community"
                checked={shareWithCommunity}
                onCheckedChange={setShareWithCommunity}
              />
              <Label
                htmlFor="share-community"
                className="text-sm text-blue-700"
              >
                Share with community (your full content stays private)
              </Label>
            </div>

            <Button
              type="button"
              onClick={saveEntry}
              className="w-full flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              Save Entry
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
