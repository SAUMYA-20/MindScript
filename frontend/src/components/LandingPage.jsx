import React, { useState, useEffect } from "react";
import {
  Heart,
  Users,
  MessageCircle,
  Share2,
  ThumbsUp,
  UserPlus,
  Search,
  Plus,
  Menu,
  Bell,
  Settings,
  Activity,
  Stethoscope,
  BookOpen,
  TrendingUp,
  User,
  Edit3,
  Send,
  Eye,
  Calendar,
  Hash,
} from "lucide-react";

const HealthConnect = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [posts, setPosts] = useState([]);
  const [channels, setChannels] = useState([]);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "general",
    channel: "",
  });
  const [newChannel, setNewChannel] = useState({
    name: "",
    description: "",
    category: "general",
  });
  const [searchQuery, setSearchQuery] = useState("");

  // Sample data initialization
  useEffect(() => {
    setPosts([
      {
        id: 1,
        title: "Managing Stress in Healthcare Environments",
        content:
          "Sharing some effective techniques I've learned over 10 years in emergency medicine...",
        author: "Dr. Sarah Johnson",
        avatar: "SJ",
        category: "Mental Health",
        channel: "Emergency Medicine",
        likes: 42,
        comments: 8,
        shares: 5,
        timestamp: "2 hours ago",
        isLiked: false,
        isFollowed: false,
      },
      {
        id: 2,
        title: "Latest Research on Telemedicine Effectiveness",
        content:
          "Recent studies show remarkable improvements in patient outcomes through remote consultations...",
        author: "Dr. Michael Chen",
        avatar: "MC",
        category: "Technology",
        channel: "Digital Health",
        likes: 67,
        comments: 12,
        shares: 9,
        timestamp: "4 hours ago",
        isLiked: true,
        isFollowed: true,
      },
      {
        id: 3,
        title: "Nutrition Tips for Shift Workers",
        content:
          "Working irregular hours? Here are evidence-based nutrition strategies that actually work...",
        author: "Lisa Rodriguez, RD",
        avatar: "LR",
        category: "Nutrition",
        channel: "Wellness",
        likes: 89,
        comments: 15,
        shares: 23,
        timestamp: "6 hours ago",
        isLiked: false,
        isFollowed: true,
      },
    ]);

    setChannels([
      {
        id: 1,
        name: "Emergency Medicine",
        members: 1240,
        description: "For ER professionals and enthusiasts",
        category: "Specialty",
        isJoined: true,
      },
      {
        id: 2,
        name: "Digital Health",
        members: 890,
        description: "Technology in healthcare",
        category: "Technology",
        isJoined: true,
      },
      {
        id: 3,
        name: "Wellness",
        members: 2100,
        description: "Health and wellness discussions",
        category: "General",
        isJoined: false,
      },
      {
        id: 4,
        name: "Mental Health",
        members: 1560,
        description: "Mental health awareness and support",
        category: "Specialty",
        isJoined: false,
      },
      {
        id: 5,
        name: "Nursing",
        members: 3200,
        description: "For nursing professionals",
        category: "Profession",
        isJoined: true,
      },
    ]);
  }, []);

  const handleLike = (postId) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
              isLiked: !post.isLiked,
            }
          : post
      )
    );
  };

  const handleFollow = (postId) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, isFollowed: !post.isFollowed } : post
      )
    );
  };

  const handleCreatePost = () => {
    if (newPost.title && newPost.content) {
      const post = {
        id: Date.now(),
        ...newPost,
        author: "You",
        avatar: "Y",
        likes: 0,
        comments: 0,
        shares: 0,
        timestamp: "Now",
        isLiked: false,
        isFollowed: false,
      };
      setPosts([post, ...posts]);
      setNewPost({ title: "", content: "", category: "general", channel: "" });
      setShowCreatePost(false);
    }
  };

  const handleCreateChannel = () => {
    if (newChannel.name && newChannel.description) {
      const channel = {
        id: Date.now(),
        ...newChannel,
        members: 1,
        isJoined: true,
      };
      setChannels([...channels, channel]);
      setNewChannel({ name: "", description: "", category: "general" });
      setShowCreateChannel(false);
    }
  };

  const joinChannel = (channelId) => {
    setChannels(
      channels.map((channel) =>
        channel.id === channelId
          ? {
              ...channel,
              members: channel.isJoined
                ? channel.members - 1
                : channel.members + 1,
              isJoined: !channel.isJoined,
            }
          : channel
      )
    );
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredChannels = channels.filter(
    (channel) =>
      channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      channel.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const PostCard = ({ post }) => (
    <div className="bg-white rounded-xl shadow-sm border border-green-100 p-6 mb-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
            {post.avatar}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{post.author}</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>{post.timestamp}</span>
              <span>•</span>
              <span className="text-green-600">#{post.channel}</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => handleFollow(post.id)}
          className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
            post.isFollowed
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {post.isFollowed ? "Following" : "Follow"}
        </button>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h2>
        <p className="text-gray-700 leading-relaxed">{post.content}</p>
        <div className="mt-3">
          <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            {post.category}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-6">
          <button
            onClick={() => handleLike(post.id)}
            className={`flex items-center space-x-2 transition-colors ${
              post.isLiked
                ? "text-green-600"
                : "text-gray-500 hover:text-green-600"
            }`}
          >
            <ThumbsUp
              size={18}
              className={post.isLiked ? "fill-current" : ""}
            />
            <span className="font-medium">{post.likes}</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-500 hover:text-green-600 transition-colors">
            <MessageCircle size={18} />
            <span className="font-medium">{post.comments}</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-500 hover:text-green-600 transition-colors">
            <Share2 size={18} />
            <span className="font-medium">{post.shares}</span>
          </button>
        </div>
        <button className="text-gray-400 hover:text-green-600 transition-colors">
          <Eye size={18} />
        </button>
      </div>
    </div>
  );

  const ChannelCard = ({ channel }) => (
    <div className="bg-white rounded-xl shadow-sm border border-green-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-lg flex items-center justify-center">
            <Hash className="text-white" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{channel.name}</h3>
            <p className="text-sm text-gray-500">
              {channel.members.toLocaleString()} members
            </p>
          </div>
        </div>
        <button
          onClick={() => joinChannel(channel.id)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            channel.isJoined
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-green-100 text-green-700 hover:bg-green-200"
          }`}
        >
          {channel.isJoined ? "Joined" : "Join"}
        </button>
      </div>
      <p className="text-gray-600 mb-3">{channel.description}</p>
      <div className="flex items-center justify-between">
        <span className="inline-block px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm font-medium">
          {channel.category}
        </span>
        <button className="text-green-600 hover:text-green-700 font-medium text-sm">
          View Channel
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <Stethoscope className="text-white" size={24} />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                  MindScript
                </h1>
              </div>
            </div>

            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search posts, channels, or people..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-green-600 transition-colors">
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                <Settings size={20} />
              </button>
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                U
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-64 space-y-6">
            <nav className="bg-white rounded-xl shadow-sm border border-green-100 p-4">
              <div className="space-y-2">
                {[
                  { id: "home", label: "Home", icon: <Activity size={20} /> },
                  {
                    id: "channels",
                    label: "Channels",
                    icon: <Hash size={20} />,
                  },
                  {
                    id: "following",
                    label: "Following",
                    icon: <Users size={20} />,
                  },
                  {
                    id: "trending",
                    label: "Trending",
                    icon: <TrendingUp size={20} />,
                  },
                  {
                    id: "bookmarks",
                    label: "Bookmarks",
                    icon: <BookOpen size={20} />,
                  },
                ].map(({ id, label, icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      activeTab === id
                        ? "bg-green-100 text-green-700"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {icon}
                    <span className="font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </nav>

            <div className="bg-white rounded-xl shadow-sm border border-green-100 p-4">
              <h3 className="font-bold text-gray-900 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setShowCreatePost(true)}
                  className="w-full flex items-center space-x-3 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Edit3 size={16} />
                  <span className="font-medium">Create Post</span>
                </button>
                <button
                  onClick={() => setShowCreateChannel(true)}
                  className="w-full flex items-center space-x-3 px-3 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                >
                  <Plus size={16} />
                  <span className="font-medium">Create Channel</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-green-100 p-4">
              <h3 className="font-bold text-gray-900 mb-3">Your Channels</h3>
              <div className="space-y-2">
                {channels
                  .filter((c) => c.isJoined)
                  .slice(0, 5)
                  .map((channel) => (
                    <div
                      key={channel.id}
                      className="flex items-center space-x-2 text-sm"
                    >
                      <Hash size={14} className="text-green-600" />
                      <span className="text-gray-700">{channel.name}</span>
                    </div>
                  ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Create Post Modal */}
            {showCreatePost && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">
                      Create New Post
                    </h2>
                    <button
                      onClick={() => setShowCreatePost(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </div>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Post title..."
                      value={newPost.title}
                      onChange={(e) =>
                        setNewPost({ ...newPost, title: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <textarea
                      placeholder="Share your thoughts, tips, or insights..."
                      value={newPost.content}
                      onChange={(e) =>
                        setNewPost({ ...newPost, content: e.target.value })
                      }
                      rows={4}
                      className="w-full px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    />
                    <div className="flex space-x-4">
                      <select
                        value={newPost.category}
                        onChange={(e) =>
                          setNewPost({ ...newPost, category: e.target.value })
                        }
                        className="px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="general">General</option>
                        <option value="mental-health">Mental Health</option>
                        <option value="technology">Technology</option>
                        <option value="nutrition">Nutrition</option>
                        <option value="research">Research</option>
                      </select>
                      <select
                        value={newPost.channel}
                        onChange={(e) =>
                          setNewPost({ ...newPost, channel: e.target.value })
                        }
                        className="px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">Select Channel</option>
                        {channels
                          .filter((c) => c.isJoined)
                          .map((channel) => (
                            <option key={channel.id} value={channel.name}>
                              {channel.name}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setShowCreatePost(false)}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCreatePost}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Create Channel Modal */}
            {showCreateChannel && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">
                      Create New Channel
                    </h2>
                    <button
                      onClick={() => setShowCreateChannel(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </div>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Channel name..."
                      value={newChannel.name}
                      onChange={(e) =>
                        setNewChannel({ ...newChannel, name: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <textarea
                      placeholder="Channel description..."
                      value={newChannel.description}
                      onChange={(e) =>
                        setNewChannel({
                          ...newChannel,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    />
                    <select
                      value={newChannel.category}
                      onChange={(e) =>
                        setNewChannel({
                          ...newChannel,
                          category: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="general">General</option>
                      <option value="specialty">Specialty</option>
                      <option value="technology">Technology</option>
                      <option value="profession">Profession</option>
                    </select>
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setShowCreateChannel(false)}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCreateChannel}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Create Channel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Main Feed */}
            {activeTab === "home" && (
              <div>
                <div className="mb-6 bg-white rounded-xl shadow-sm border border-green-100 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Welcome to HealthConnect
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Connect with healthcare professionals, share knowledge, and
                    stay updated with the latest in healthcare.
                  </p>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setShowCreatePost(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Edit3 size={16} />
                      <span>Share Something</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("channels")}
                      className="flex items-center space-x-2 px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                    >
                      <Users size={16} />
                      <span>Explore Channels</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === "channels" && (
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Healthcare Channels
                  </h2>
                  <button
                    onClick={() => setShowCreateChannel(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Plus size={16} />
                    <span>Create Channel</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredChannels.map((channel) => (
                    <ChannelCard key={channel.id} channel={channel} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === "following" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Following
                </h2>
                <div className="space-y-4">
                  {filteredPosts
                    .filter((post) => post.isFollowed)
                    .map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                </div>
              </div>
            )}

            {activeTab === "trending" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Trending
                </h2>
                <div className="space-y-4">
                  {filteredPosts
                    .sort((a, b) => b.likes - a.likes)
                    .map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                </div>
              </div>
            )}

            {activeTab === "bookmarks" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Bookmarks
                </h2>
                <div className="bg-white rounded-xl shadow-sm border border-green-100 p-8 text-center">
                  <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-600">
                    No bookmarks yet. Start saving posts you want to read later!
                  </p>
                </div>
              </div>
            )}
          </main>

          {/* Right Sidebar */}
          <aside className="w-80 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-green-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Platform Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Active Users</span>
                  <span className="font-semibold text-green-600">12,450</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Posts</span>
                  <span className="font-semibold text-green-600">45,230</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Channels</span>
                  <span className="font-semibold text-green-600">1,240</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-green-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">
                Suggested Channels
              </h3>
              <div className="space-y-3">
                {channels
                  .filter((c) => !c.isJoined)
                  .slice(0, 3)
                  .map((channel) => (
                    <div
                      key={channel.id}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {channel.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {channel.members.toLocaleString()} members
                        </p>
                      </div>
                      <button
                        onClick={() => joinChannel(channel.id)}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium hover:bg-green-200 transition-colors"
                      >
                        Join
                      </button>
                    </div>
                  ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-green-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">
                    New member joined Emergency Medicine
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">
                    Dr. Chen posted in Digital Health
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-600">
                    New research paper shared
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default HealthConnect;
