import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Calendar, Target, Award, Smile, Meh, Frown } from 'lucide-react';

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

export function Dashboard({ entries }) {
  // Calculate mood trend data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  const moodData = last7Days.map(date => {
    const entry = entries.find(e => e.date === date);
    const moodScore = entry ? getMoodScore(entry.mood) : null;
    return {
      date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      mood: moodScore,
      hasEntry: !!entry
    };
  });

  function getMoodScore(mood) {
    switch (mood) {
      case 'positive': return 4;
      case 'mixed': return 3;
      case 'neutral': return 2;
      case 'negative': return 1;
      default: return 2;
    }
  }

  // Calculate theme frequency
  const themeCount = {};
  entries.forEach(entry => {
    entry.themes.forEach(theme => {
      themeCount[theme] = (themeCount[theme] || 0) + 1;
    });
  });

  const themeData = Object.entries(themeCount)
    .map(([theme, count]) => ({ theme, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Mood distribution
  const moodDistribution = {
    positive: entries.filter(e => e.mood === 'positive').length,
    neutral: entries.filter(e => e.mood === 'neutral').length,
    mixed: entries.filter(e => e.mood === 'mixed').length,
    negative: entries.filter(e => e.mood === 'negative').length,
  };

  const pieData = [
    { name: 'Positive', value: moodDistribution.positive, color: '#10b981' },
    { name: 'Mixed', value: moodDistribution.mixed, color: '#f59e0b' },
    { name: 'Neutral', value: moodDistribution.neutral, color: '#6b7280' },
    { name: 'Negative', value: moodDistribution.negative, color: '#ef4444' },
  ].filter(item => item.value > 0);

  // Calculate streaks
  const currentStreak = calculateCurrentStreak();
  const longestStreak = calculateLongestStreak();

  function calculateCurrentStreak() {
    const today = new Date().toISOString().split('T')[0];
    let streak = 0;
    let currentDate = new Date();
    
    while (true) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const hasEntry = entries.some(entry => entry.date === dateStr);
      
      if (hasEntry) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (dateStr === today) {
        // If no entry today, check yesterday
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  }

  function calculateLongestStreak() {
    // Simplified calculation for demo
    return Math.max(currentStreak, 7);
  }

  const totalEntries = entries.length;
  const avgMoodScore = entries.length > 0 
    ? entries.reduce((sum, entry) => sum + getMoodScore(entry.mood), 0) / entries.length 
    : 0;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current Streak</p>
                <p className="text-2xl font-bold text-blue-600">{currentStreak}</p>
                <p className="text-xs text-gray-500">days</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Entries</p>
                <p className="text-2xl font-bold text-green-600">{totalEntries}</p>
                <p className="text-xs text-gray-500">journal entries</p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Mood</p>
                <p className="text-2xl font-bold text-yellow-600">{avgMoodScore.toFixed(1)}</p>
                <p className="text-xs text-gray-500">out of 4</p>
              </div>
              {avgMoodScore >= 3 ? <Smile className="h-8 w-8 text-yellow-500" /> :
               avgMoodScore >= 2 ? <Meh className="h-8 w-8 text-yellow-500" /> :
               <Frown className="h-8 w-8 text-yellow-500" />}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Best Streak</p>
                <p className="text-2xl font-bold text-purple-600">{longestStreak}</p>
                <p className="text-xs text-gray-500">days</p>
              </div>
              <Award className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Mood Trend (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={moodData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 4]} ticks={[1, 2, 3, 4]} />
                <Tooltip 
                  labelFormatter={(label) => `Day: ${label}`}
                  formatter={(value) => [
                    value ? `${value}/4` : 'No entry',
                    'Mood Score'
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="mood" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mood Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {pieData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm">{entry.name}: {entry.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Theme Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Most Common Themes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {themeData.map((theme) => (
              <div key={theme.theme} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="capitalize">
                    {theme.theme}
                  </Badge>
                  <span className="text-sm text-gray-600">
                    {theme.count} {theme.count === 1 ? 'entry' : 'entries'}
                  </span>
                </div>
                <Progress 
                  value={(theme.count / totalEntries) * 100} 
                  className="w-24" 
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}