import React, { useState, useEffect } from 'react';
import { Users, Heart, MessageCircle, Send } from 'lucide-react';

interface Reaction {
  id: string;
  entryId: string;
  type: 'heart' | 'support' | 'strength';
  userId: string;
}

interface Comment {
  id: string;
  entryId: string;
  author?: string;
  content?: string;
  timestamp?: string;
  likes?: number;
}

interface Entry {
  id: string;
  date?: string;
  aiSummary?: string;
  themes?: string[];
  mood?: 'positive' | 'negative' | 'mixed';
  content?: string;
  shared?: boolean;
}

export function CommunitySpace() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<Record<string, string>>({});
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'recent' | 'popular'>('recent');

  useEffect(() => {
    fetch('http://localhost:5000/api/journals')
      .then(res => res.json())
      .then(data => setEntries(data || []))
      .catch(err => console.error('Failed to fetch entries:', err));
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const getMoodColor = (mood?: string) => {
    switch (mood) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'negative': return 'bg-red-100 text-red-800';
      case 'mixed': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEntryReactions = (entryId: string) => {
    const entryReactions = reactions.filter(r => r.entryId === entryId);
    const reactionCounts: Record<string, number> = {};
    entryReactions.forEach(r => {
      reactionCounts[r.type] = (reactionCounts[r.type] || 0) + 1;
    });
    return [
      { type: 'heart', count: reactionCounts.heart || 0 },
      { type: 'support', count: reactionCounts.support || 0 },
      { type: 'strength', count: reactionCounts.strength || 0 }
    ];
  };

  const getEntryComments = (entryId: string) => comments.filter(c => c.entryId === entryId);

  const addReaction = (entryId: string, type: 'heart' | 'support' | 'strength') => {
    setReactions(prev => [...prev, { id: Date.now().toString(), entryId, type, userId: 'current-user' }]);
  };

  const addComment = (entryId: string) => {
    const content = newComment[entryId]?.trim();
    if (!content) return;
    const comment: Comment = {
      id: Date.now().toString(),
      entryId,
      author: 'You',
      content,
      timestamp: new Date().toISOString(),
      likes: 0
    };
    setComments(prev => [...prev, comment]);
    setNewComment(prev => ({ ...prev, [entryId]: '' }));
  };

  const toggleEntryExpansion = (entryId: string) => {
    const newExpanded = new Set(expandedEntries);
    if (newExpanded.has(entryId)) newExpanded.delete(entryId);
    else newExpanded.add(entryId);
    setExpandedEntries(newExpanded);
  };

  const sortedEntries = [...entries].sort((a, b) => {
    if (viewMode === 'recent') {
      return (new Date(b.date || 0).getTime()) - (new Date(a.date || 0).getTime());
    } else {
      const aReactions = getEntryReactions(a.id).reduce((sum, r) => sum + r.count, 0);
      const bReactions = getEntryReactions(b.id).reduce((sum, r) => sum + r.count, 0);
      return bReactions - aReactions;
    }
  });

  const getReactionEmoji = (type: string) => {
    switch (type) {
      case 'heart': return '❤️';
      case 'support': return '🤗';
      case 'strength': return '💪';
      default: return '👍';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Users className="h-5 w-5 text-blue-500" />
        <h3 className="text-lg font-semibold">Community Space</h3>
        <div className="ml-auto flex gap-2">
          <button onClick={() => setViewMode('recent')} className={`${viewMode==='recent' ? 'font-bold text-blue-600' : 'text-gray-600'}`}>Recent</button>
          <button onClick={() => setViewMode('popular')} className={`${viewMode==='popular' ? 'font-bold text-blue-600' : 'text-gray-600'}`}>Popular</button>
        </div>
      </div>

      {/* Entries */}
      {sortedEntries.length === 0 ? (
        <p className="text-gray-500 text-center">No shared entries yet.</p>
      ) : sortedEntries.map(entry => {
        const entryReactions = getEntryReactions(entry.id);
        const entryComments = getEntryComments(entry.id);
        const isExpanded = expandedEntries.has(entry.id);
        return (
          <div key={entry.id} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center font-semibold text-gray-700">
                  {entry.id ? entry.id.charAt(0).toUpperCase() : 'A'}
                </div>
                <div>
                  <p className="font-medium text-gray-800">{entry.id ? 'Anonymous Friend' : 'Unknown'}</p>
                  <p className="text-xs text-gray-400">{formatDate(entry.date)}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getMoodColor(entry.mood)}`}>
                {entry.mood ? entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1) : 'Neutral'}
              </span>
            </div>

            <p className="text-gray-700 mb-2">{entry.aiSummary || 'No summary available.'}</p>
            <button
              onClick={() => toggleEntryExpansion(entry.id)}
              className="text-blue-600 text-sm mb-2 font-medium hover:underline"
            >
              {isExpanded ? 'Hide Full Entry' : 'Show Full Entry'}
            </button>

            {isExpanded && <p className="bg-gray-50 p-3 rounded mb-2 text-gray-700">{entry.content || ''}</p>}

            {entry.themes && entry.themes.length > 0 && (
              <div className="flex gap-2 flex-wrap mb-3">
                {entry.themes.map(theme => (
                  <span key={theme} className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">{theme}</span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-4 mb-3 text-sm">
              {['heart','support','strength'].map(type => {
                const r = entryReactions.find(r => r.type===type);
                return (
                  <button
                    key={type}
                    onClick={() => addReaction(entry.id, type as any)}
                    className="flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 transition"
                  >
                    {getReactionEmoji(type)} <span>{r?.count || 0}</span>
                  </button>
                );
              })}
              <div className="flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 transition">
                <MessageCircle className="w-4 h-4" /> {entryComments.length}
              </div>
            </div>

            <div className="flex gap-2 mt-2">
              <textarea
                placeholder="Add comment..."
                value={newComment[entry.id] || ''}
                onChange={e => setNewComment(prev => ({ ...prev, [entry.id]: e.target.value }))}
                className="border p-2 rounded flex-1 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none resize-none"
              />
              <button
                onClick={() => addComment(entry.id)}
                className="bg-blue-500 text-white px-3 rounded flex items-center justify-center hover:bg-blue-600 transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            {entryComments.length > 0 && (
              <div className="mt-3 space-y-2">
                {entryComments.map(c => (
                  <div key={c.id} className="bg-gray-50 p-2 rounded">
                    <p className="font-medium text-gray-800 text-sm">{c.author || 'Unknown'}</p>
                    <p className="text-gray-700 text-sm">{c.content || ''}</p>
                    <p className="text-xs text-gray-400">{formatDate(c.timestamp)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
