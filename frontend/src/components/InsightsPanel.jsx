import React from 'react';
import { Brain, Lightbulb, TrendingUp, TrendingDown, Target, Heart, Clock, Sun } from 'lucide-react';

// Custom UI Components
function Card({ className, children }) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className || ''}`}>
      {children}
    </div>
  );
}

function CardContent({ className, children }) {
  return (
    <div className={`p-6 ${className || ''}`}>
      {children}
    </div>
  );
}

function CardHeader({ className, children }) {
  return (
    <div className={`p-6 pb-4 ${className || ''}`}>
      {children}
    </div>
  );
}

function CardTitle({ className, children }) {
  return (
    <h3 className={`text-lg font-semibold leading-none tracking-tight ${className || ''}`}>
      {children}
    </h3>
  );
}

function Badge({ className, children, variant = 'default' }) {
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

function Progress({ value, className }) {
  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 ${className || ''}`}>
      <div 
        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

export function InsightsPanel({ entries }) {
  // Analyze patterns
  const patterns = analyzePatterns(entries);
  const suggestions = generateSuggestions(patterns, entries);
  const achievements = calculateAchievements(entries);

  function analyzePatterns(entries) {
    const themeFrequency = {};
    const moodFrequency = {};
    
    entries.forEach(entry => {
      entry.themes.forEach(theme => {
        themeFrequency[theme] = (themeFrequency[theme] || 0) + 1;
      });
      moodFrequency[entry.mood] = (moodFrequency[entry.mood] || 0) + 1;
    });

    const dominantMood = Object.entries(moodFrequency)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'neutral';
    
    const topThemes = Object.entries(themeFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([theme]) => theme);

    // Calculate mood trend
    const recentEntries = entries.slice(0, 5);
    const olderEntries = entries.slice(5, 10);
    
    const getMoodScore = (mood) => {
      switch (mood) {
        case 'positive': return 4;
        case 'mixed': return 3;
        case 'neutral': return 2;
        case 'negative': return 1;
        default: return 2;
      }
    };

    const recentAvg = recentEntries.length > 0 
      ? recentEntries.reduce((sum, entry) => sum + getMoodScore(entry.mood), 0) / recentEntries.length 
      : 0;
    
    const olderAvg = olderEntries.length > 0 
      ? olderEntries.reduce((sum, entry) => sum + getMoodScore(entry.mood), 0) / olderEntries.length 
      : 0;

    const moodTrend = recentAvg > olderAvg ? 'improving' : 
                     recentAvg < olderAvg ? 'declining' : 'stable';

    return {
      dominantMood,
      topThemes,
      moodTrend,
      totalEntries: entries.length,
      themeFrequency,
      moodFrequency
    };
  }

  function generateSuggestions(patterns) {
    const suggestions = [];

    // Mood-based suggestions
    if (patterns.dominantMood === 'negative') {
      suggestions.push({
        type: 'wellbeing',
        icon: Heart,
        title: 'Self-Care Focus',
        description: 'Your recent entries show challenging emotions. Consider incorporating mindfulness practices or reaching out to support networks.',
        action: 'Try guided meditation or talk to a friend'
      });
    }

    if (patterns.dominantMood === 'positive') {
      suggestions.push({
        type: 'growth',
        icon: TrendingUp,
        title: 'Momentum Building',
        description: 'You\'re in a positive space! This is a great time to set new goals or tackle challenges you\'ve been postponing.',
        action: 'Set a new personal goal'
      });
    }

    // Theme-based suggestions
    if (patterns.topThemes.includes('work')) {
      suggestions.push({
        type: 'balance',
        icon: Clock,
        title: 'Work-Life Balance',
        description: 'Work appears frequently in your entries. Consider reflecting on work-life balance and setting boundaries.',
        action: 'Schedule dedicated personal time'
      });
    }

    if (patterns.topThemes.includes('stress')) {
      suggestions.push({
        type: 'stress',
        icon: Sun,
        title: 'Stress Management',
        description: 'Stress is a recurring theme. Explore stress-reduction techniques like deep breathing or physical exercise.',
        action: 'Try a 5-minute breathing exercise'
      });
    }

    // Trend-based suggestions
    if (patterns.moodTrend === 'declining') {
      suggestions.push({
        type: 'support',
        icon: TrendingDown,
        title: 'Mood Support',
        description: 'Your mood trend shows some decline. This is normal, but consider extra self-care or professional support if needed.',
        action: 'Practice gratitude or seek support'
      });
    }

    // General suggestions
    suggestions.push({
      type: 'consistency',
      icon: Target,
      title: 'Journaling Consistency',
      description: 'Regular journaling helps track patterns. Try to write at the same time each day for better insights.',
      action: 'Set a daily reminder'
    });

    return suggestions.slice(0, 4); // Limit to 4 suggestions
  }

  function calculateAchievements(entries) {
    const achievements = [];

    if (entries.length >= 1) {
      achievements.push({
        title: 'First Entry',
        description: 'Started your journaling journey',
        icon: '🌱',
        unlocked: true
      });
    }

    if (entries.length >= 7) {
      achievements.push({
        title: 'Weekly Warrior',
        description: 'Completed 7 journal entries',
        icon: '📝',
        unlocked: true
      });
    }

    if (entries.length >= 30) {
      achievements.push({
        title: 'Monthly Master',
        description: 'Completed 30 journal entries',
        icon: '🏆',
        unlocked: true
      });
    } else {
      achievements.push({
        title: 'Monthly Master',
        description: `Complete ${30 - entries.length} more entries`,
        icon: '🏆',
        unlocked: false
      });
    }

    const positiveEntries = entries.filter(e => e.mood === 'positive').length;
    if (positiveEntries >= 5) {
      achievements.push({
        title: 'Positivity Pro',
        description: 'Had 5 positive mood entries',
        icon: '☀️',
        unlocked: true
      });
    } else {
      achievements.push({
        title: 'Positivity Pro',
        description: `Need ${5 - positiveEntries} more positive entries`,
        icon: '☀️',
        unlocked: false
      });
    }

    const sharedEntries = entries.filter(e => e.shared).length;
    if (sharedEntries >= 3) {
      achievements.push({
        title: 'Community Contributor',
        description: 'Shared 3 entries with community',
        icon: '🤝',
        unlocked: true
      });
    } else {
      achievements.push({
        title: 'Community Contributor',
        description: `Share ${3 - sharedEntries} more entries`,
        icon: '🤝',
        unlocked: false
      });
    }

    return achievements;
  }

  const getSuggestionColor = (type) => {
    switch (type) {
      case 'wellbeing': return 'border-pink-200 bg-pink-50';
      case 'growth': return 'border-green-200 bg-green-50';
      case 'balance': return 'border-blue-200 bg-blue-50';
      case 'stress': return 'border-orange-200 bg-orange-50';
      case 'support': return 'border-purple-200 bg-purple-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Personal Insights Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-500" />
            Your Personal Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Dominant Mood</p>
              <p className="text-lg font-bold text-blue-800 capitalize">{patterns.dominantMood}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Mood Trend</p>
              <p className="text-lg font-bold text-green-800 capitalize">{patterns.moodTrend}</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-600 font-medium">Top Theme</p>
              <p className="text-lg font-bold text-purple-800 capitalize">
                {patterns.topThemes[0] || 'None yet'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Personalized Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestions.map((suggestion, index) => {
              const IconComponent = suggestion.icon;
              return (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg border ${getSuggestionColor(suggestion.type)}`}
                >
                  <div className="flex items-start gap-3">
                    <IconComponent className="h-5 w-5 mt-1 text-gray-600" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{suggestion.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{suggestion.description}</p>
                      <Badge variant="outline" className="mt-2 text-xs">
                        {suggestion.action}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-500" />
            Achievements & Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg border ${
                  achievement.unlocked 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{achievement.icon}</span>
                  <div className="flex-1">
                    <h4 className={`font-medium ${
                      achievement.unlocked ? 'text-green-800' : 'text-gray-600'
                    }`}>
                      {achievement.title}
                    </h4>
                    <p className={`text-sm ${
                      achievement.unlocked ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {achievement.description}
                    </p>
                  </div>
                  {achievement.unlocked && (
                    <Badge className="bg-green-100 text-green-800">
                      Unlocked
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Progress Tracking */}
      <Card>
        <CardHeader>
          <CardTitle>Progress Tracking</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Monthly Goal (30 entries)</span>
                <span>{entries.length}/30</span>
              </div>
              <Progress value={(entries.length / 30) * 100} />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Positive Mood Ratio</span>
                <span>
                  {entries.length > 0 
                    ? Math.round((patterns.moodFrequency.positive || 0) / entries.length * 100)
                    : 0}%
                </span>
              </div>
              <Progress 
                value={entries.length > 0 
                  ? (patterns.moodFrequency.positive || 0) / entries.length * 100 
                  : 0} 
              />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Community Engagement</span>
                <span>
                  {entries.filter(e => e.shared).length}/{entries.length} shared
                </span>
              </div>
              <Progress 
                value={entries.length > 0 
                  ? (entries.filter(e => e.shared).length / entries.length) * 100 
                  : 0} 
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}