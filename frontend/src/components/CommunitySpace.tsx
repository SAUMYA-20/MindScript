import React, { useState } from 'react';
import { Users, Heart, MessageCircle, Send, TrendingUp, Clock } from 'lucide-react';

// Custom UI Components
function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className || ''}`}>
      {children}
    </div>
  );
}

function CardContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`p-6 ${className || ''}`}>
      {children}
    </div>
  );
}

function CardHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`p-6 pb-4 ${className || ''}`}>
      {children}
    </div>
  );
}

function CardTitle({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <h3 className={`text-lg font-semibold leading-none tracking-tight ${className || ''}`}>
      {children}
    </h3>
  );
}

function Badge({ className, children, variant = 'default' }: { 
  className?: string; 
  children: React.ReactNode; 
  variant?: 'default' | 'outline' | 'secondary' 
}) {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    outline: 'border border-gray-300 bg-transparent text-gray-700',
    secondary: 'bg-blue-100 text-blue-800',
  };
  
  return (
    <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${variants[variant]} ${className || ''}`}>
      {children}
    </div>
  );
}

function Button({ 
  onClick, 
  disabled, 
  className, 
  children, 
  variant = 'primary', 
  size = 'md' 
}: { 
  onClick?: () => void; 
  disabled?: boolean; 
  className?: string; 
  children: React.ReactNode; 
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'; 
  size?: 'sm' | 'md' | 'lg' 
}) {
  const baseClasses = 'inline-flex items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-500',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus-visible:ring-gray-500',
    ghost: 'hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-gray-500',
  };
  
  const sizes = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4',
    lg: 'h-12 px-6 text-lg',
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className || ''}`}
    >
      {children}
    </button>
  );
}

function Textarea({ 
  placeholder, 
  value, 
  onChange, 
  className, 
  rows = 4 
}: { 
  placeholder?: string; 
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; 
  className?: string; 
  rows?: number 
}) {
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      rows={rows}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${className || ''}`}
    />
  );
}

function Avatar({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className || ''}`}>
      {children}
    </div>
  );
}

function AvatarFallback({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`flex h-full w-full items-center justify-center rounded-full bg-gray-100 ${className || ''}`}>
      {children}
    </div>
  );
}

interface Reaction {
  id: string;
  entryId: string;
  type: 'heart' | 'support' | 'strength';
  userId: string;
}

interface Comment {
  id: string;
  entryId: string;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
}

interface Entry {
  id: string;
  date: string;
  aiSummary: string;
  themes: string[];
  mood: 'positive' | 'negative' | 'mixed';
  content: string;
  shared: boolean;
}

export function CommunitySpace({ 
  sharedEntries, 
  onUpdateEntry 
}: { 
  sharedEntries: Entry[]; 
  onUpdateEntry: (id: string, data: Partial<Entry>) => void 
}) {
  const [viewMode, setViewMode] = useState<'recent' | 'popular'>('recent');
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      entryId: '1',
      author: 'Anonymous Helper',
      content: 'Thank you for sharing! It\'s wonderful to see someone celebrating their achievements. Your hard work really paid off! 🎉',
      timestamp: '2024-01-15',
      likes: 3
    },
    {
      id: '2',
      entryId: '1',
      author: 'Supportive Friend',
      content: 'This is so inspiring! I love seeing positive energy in the community. Keep up the great work!',
      timestamp: '2024-01-15',
      likes: 2
    }
  ]);
  const [newComment, setNewComment] = useState<Record<string, string>>({});
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set());

  const sortedEntries = [...sharedEntries].sort((a, b) => {
    if (viewMode === 'recent') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      // Popular - sort by reaction count (simplified)
      const aReactions = getEntryReactions(a.id).reduce((sum, r) => sum + (r.count || 0), 0);
      const bReactions = getEntryReactions(b.id).reduce((sum, r) => sum + (r.count || 0), 0);
      return bReactions - aReactions;
    }
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const getMoodColor = (mood: string) => {
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
    
    entryReactions.forEach(reaction => {
      reactionCounts[reaction.type] = (reactionCounts[reaction.type] || 0) + 1;
    });

    return [
      { type: 'heart', count: reactionCounts.heart || 0 },
      { type: 'support', count: reactionCounts.support || 0 },
      { type: 'strength', count: reactionCounts.strength || 0 }
    ];
  };

  const getEntryComments = (entryId: string) => {
    return comments.filter(comment => comment.entryId === entryId);
  };

  const addReaction = (entryId: string, type: 'heart' | 'support' | 'strength') => {
    setReactions(prev => [...prev, {
      id: Date.now().toString(),
      entryId,
      type,
      userId: 'current-user'
    }]);
  };

  const addComment = (entryId: string) => {
    const content = newComment[entryId]?.trim();
    if (!content) return;

    const comment: Comment = {
      id: Date.now().toString(),
      entryId,
      author: 'You',
      content,
      timestamp: new Date().toISOString().split('T')[0],
      likes: 0
    };

    setComments(prev => [...prev, comment]);
    setNewComment(prev => ({ ...prev, [entryId]: '' }));
  };

  const getReactionEmoji = (type: string) => {
    switch (type) {
      case 'heart': return '❤️';
      case 'support': return '🤗';
      case 'strength': return '💪';
      default: return '👍';
    }
  };

  const toggleEntryExpansion = (entryId: string) => {
    const newExpanded = new Set(expandedEntries);
    if (newExpanded.has(entryId)) {
      newExpanded.delete(entryId);
    } else {
      newExpanded.add(entryId);
    }
    setExpandedEntries(newExpanded);
  };

  return (
    <div className="space-y-6">
      {/* Community Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            Community Space
          </CardTitle>
          <p className="text-gray-600">
            Connect with others through anonymous AI-generated summaries. Share support and find inspiration.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button 
              variant={viewMode === 'recent' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('recent')}
            >
              Recent
            </Button>
            <Button 
              variant={viewMode === 'popular' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('popular')}
            >
              Popular
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Shared Entries */}
      {sortedEntries.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No shared entries yet</h3>
            <p className="text-gray-500">Be the first to share your AI summary with the community!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedEntries.map((entry) => {
            const entryReactions = getEntryReactions(entry.id);
            const entryComments = getEntryComments(entry.id);
            const isExpanded = expandedEntries.has(entry.id);
            
            return (
              <Card key={entry.id} className="border-l-4 border-l-blue-400">
                <CardContent className="p-6">
                  {/* Entry Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          A{entry.id.slice(-1)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Anonymous Friend</p>
                        <p className="text-xs text-gray-500">{formatDate(entry.date)}</p>
                      </div>
                    </div>
                    <Badge className={getMoodColor(entry.mood)}>
                      {entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)}
                    </Badge>
                  </div>

                  {/* AI Summary */}
                  <div className="mb-4">
                    <p className="text-gray-700 leading-relaxed">{entry.aiSummary}</p>
                  </div>

                  {/* Full Content Toggle */}
                  <div className="mb-4">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => toggleEntryExpansion(entry.id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {isExpanded ? 'Hide Full Entry' : 'Show Full Entry'}
                    </Button>
                  </div>

                  {/* Full Content (shown when expanded) */}
                  {isExpanded && (
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-800">{entry.content}</p>
                    </div>
                  )}

                  {/* Themes */}
                  {entry.themes.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {entry.themes.map((theme) => (
                          <Badge key={theme} variant="outline" className="text-xs">
                            {theme}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Reactions */}
                  <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
                    <div className="flex gap-2">
                      {[
                        { type: 'heart', label: 'Support' },
                        { type: 'support', label: 'Relate' },
                        { type: 'strength', label: 'Strength' }
                      ].map(({ type, label }) => {
                        const reaction = entryReactions.find(r => r.type === type);
                        return (
                          <Button
                            key={type}
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-1 h-8 px-2"
                            onClick={() => addReaction(entry.id, type as 'heart' | 'support' | 'strength')}
                          >
                            <span>{getReactionEmoji(type)}</span>
                            <span className="text-sm">{reaction?.count || 0}</span>
                          </Button>
                        );
                      })}
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-sm">{entryComments.length}</span>
                    </div>
                  </div>

                  {/* Comments */}
                  {entryComments.length > 0 && (
                    <div className="space-y-3 mb-4">
                      {entryComments.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                              {comment.author.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="text-sm font-medium text-gray-800 mb-1">{comment.author}</p>
                              <p className="text-sm text-gray-700">{comment.content}</p>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-gray-500">{formatDate(comment.timestamp)}</span>
                              <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-gray-500">
                                <Heart className="h-3 w-3 mr-1" />
                                {comment.likes}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Comment */}
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Share a supportive message..."
                      value={newComment[entry.id] || ''}
                      onChange={(e) => setNewComment(prev => ({ 
                        ...prev, 
                        [entry.id]: e.target.value 
                      }))}
                      className="min-h-[60px]"
                    />
                    <Button
                      onClick={() => addComment(entry.id)}
                      disabled={!newComment[entry.id]?.trim()}
                      className="shrink-0"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Community Guidelines */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="text-yellow-800">Community Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="text-yellow-700 space-y-2">
          <p className="text-sm">• Be kind, supportive, and respectful in all interactions</p>
          <p className="text-sm">• Share encouragement and positive energy</p>
          <p className="text-sm">• Respect others' experiences and perspectives</p>
          <p className="text-sm">• Report any inappropriate content or behavior</p>
          <p className="text-sm">• Remember that everyone is on their own journey</p>
        </CardContent>
      </Card>
    </div>
  );
}