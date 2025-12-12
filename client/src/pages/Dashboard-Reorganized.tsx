import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Play,
  Puzzle,
  BookOpen,
  Eye,
  Newspaper,
  Users,
  MoreHorizontal,
  Moon,
  Sun,
  Zap,
  Trophy,
  LogOut,
  Flame,
  Clock,
  Link2,
  Globe,
  ChevronDown,
  BarChart3,
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { UserPreferencesManager } from "@/lib/userPreferences";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

export default function DashboardReorganized() {
  const [, navigate] = useLocation();
  const { user, logout } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const [playerName, setPlayerName] = useState("Guest");
  const [isLinked, setIsLinked] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const prefs = UserPreferencesManager.getPreferences();
    setPlayerName(prefs.playerName);
    setIsLinked(prefs.isChessComLinked);
  }, []);

  const handleLogout = () => {
    logout();
    UserPreferencesManager.clearPreferences();
    setShowUserMenu(false);
    navigate("/");
  };

  // Sample chart data
  const chartData = [
    { date: "27/09", value: 420 },
    { date: "04/10", value: 410 },
    { date: "11/10", value: 415 },
    { date: "18/10", value: 420 },
    { date: "25/10", value: 430 },
    { date: "01/11", value: 445 },
    { date: "04/11", value: 490 },
    { date: "11/11", value: 495 },
    { date: "18/11", value: 500 },
    { date: "25/11", value: 505 },
    { date: "02/12", value: 510 },
    { date: "12/12", value: 515 },
  ];

  const ratingStats = [
    {
      title: language === "pt" ? "Rápida" : "Rapid",
      rating: isLinked ? 1400 : "N/A",
      icon: <Clock className="w-6 h-6 text-green-400" />,
      data: chartData,
    },
    {
      title: language === "pt" ? "Ultra-Rápidas" : "Blitz",
      rating: isLinked ? 1600 : "N/A",
      icon: <Zap className="w-6 h-6 text-yellow-400" />,
      data: chartData,
    },
    {
      title: language === "pt" ? "Todos" : "All",
      rating: isLinked ? "1467" : "N/A",
      icon: <BarChart3 className="w-6 h-6 text-blue-400" />,
      data: chartData,
    },
  ];

  const gameHistory = [
    {
      mode: "Rapid",
      modeIcon: <Clock className="w-5 h-5 text-green-400" />,
      opponent: "Remzon",
      rating: 481,
      avatar: "👤",
      result: "win",
      accuracy: "64.4%",
    },
    {
      mode: "Bullet",
      modeIcon: <Flame className="w-5 h-5 text-gray-400" />,
      opponent: "SHIELD_No1",
      rating: 544,
      avatar: "🎮",
      result: "loss",
      accuracy: "58.2%",
    },
    {
      mode: "Rapid",
      modeIcon: <Clock className="w-5 h-5 text-green-400" />,
      opponent: "arthuronaogati",
      rating: 508,
      avatar: "👤",
      result: "loss",
      accuracy: "52.1%",
    },
    {
      mode: "Blitz",
      modeIcon: <Zap className="w-5 h-5 text-yellow-400" />,
      opponent: "JManuel-Olivares",
      rating: 525,
      avatar: "🌳",
      result: "loss",
      accuracy: "45.8%",
    },
  ];

  return (
    <div className="flex h-screen bg-[#2a2725] text-white">
      {/* Sidebar */}
      <div className="w-48 bg-[#1a1815] border-r border-[#4a4743] flex flex-col">
        {/* Logo */}
        <div className="p-3 flex items-center gap-2 border-b border-[#4a4743] h-16">
          <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">♟</span>
          </div>
          <span className="font-bold text-sm">Chess Coach</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          <NavItem
            icon={<Play size={20} className="text-blue-400" />}
            label="Play"
          />
          <NavItem
            icon={<Puzzle size={20} className="text-orange-400" />}
            label="Puzzles"
          />
          <NavItem
            icon={<BookOpen size={20} className="text-blue-400" />}
            label="Learn"
          />
          <NavItem
            icon={<Eye size={20} className="text-cyan-400" />}
            label="Watch"
          />
          <NavItem
            icon={<Newspaper size={20} className="text-red-400" />}
            label="News"
          />
          <NavItem
            icon={<Users size={20} className="text-orange-400" />}
            label="Social"
          />
          <NavItem
            icon={<MoreHorizontal size={20} className="text-gray-400" />}
            label="More"
          />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto flex flex-col">
        {/* Top Bar */}
        <div className="h-16 bg-[#2a2725] border-b border-[#4a4743] flex items-center justify-between px-6">
          {/* Left: User Display or Link Button */}
          <div>
            {isLinked ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <span>{language === "pt" ? "Logado como" : "Logged in as"} {playerName}</span>
                  <ChevronDown size={16} />
                </Button>
                {showUserMenu && (
                  <div className="absolute top-full left-0 mt-1 bg-[#3d3a35] border border-[#4a4743] rounded shadow-lg z-50">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-400 hover:bg-[#4a4743]"
                      onClick={handleLogout}
                    >
                      <LogOut size={16} className="mr-2" />
                      {language === "pt" ? "Sair" : "Logout"}
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <Button className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">
                <Link2 size={16} />
                {language === "pt" ? "Ligar Conta Chess.com" : "Link Chess.com Account"}
              </Button>
            )}
          </div>

          {/* Right: Controls */}
          <div className="flex items-center gap-3">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as "en" | "pt")}
              className="bg-[#3d3a35] border border-[#4a4743] rounded px-2 py-1 text-sm text-white"
            >
              <option value="en">English</option>
              <option value="pt">Português</option>
            </select>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hover:bg-[#3d3a35]"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button className="bg-[#3d3a35] hover:bg-[#4a4743] h-16 flex flex-col items-center justify-center gap-2">
                <Zap className="w-6 h-6" />
                <span className="text-sm">Analyze</span>
              </Button>
              <Button className="bg-[#3d3a35] hover:bg-[#4a4743] h-16 flex flex-col items-center justify-center gap-2">
                <Users className="w-6 h-6" />
                <span className="text-sm">vs Coach</span>
              </Button>
              <Button className="bg-[#3d3a35] hover:bg-[#4a4743] h-16 flex flex-col items-center justify-center gap-2">
                <Trophy className="w-6 h-6" />
                <span className="text-sm">vs Bots</span>
              </Button>
              <Button className="bg-[#3d3a35] hover:bg-[#4a4743] h-16 flex flex-col items-center justify-center gap-2">
                <Puzzle className="w-6 h-6" />
                <span className="text-sm">Play Puzzles</span>
              </Button>
            </div>

            {/* Main Content: Charts (1/5) + History (4/5) */}
            <div className="flex gap-6">
              {/* Left Side: Rating Charts (1/5) */}
              <div className="w-1/5 space-y-4">
                {ratingStats.map((stat, idx) => (
                  <Card key={idx} className="bg-[#3d3a35] border-[#4a4743] p-4">
                    <div className="flex items-center gap-2 mb-3">
                      {stat.icon}
                      <div>
                        <p className="text-gray-400 text-xs">{stat.title}</p>
                        <p className="text-2xl font-bold">{stat.rating}</p>
                      </div>
                    </div>

                    {/* Mini Chart */}
                    <div className="h-24 -mx-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={stat.data} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                          <defs>
                            <linearGradient id={`colorValue${idx}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                            </linearGradient>
                          </defs>
                          <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill={`url(#colorValue${idx})`}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Right Side: Game History (4/5) */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold">
                    {language === "pt" ? "Histórico" : "Game History"}
                  </h3>
                  <Button variant="ghost" className="text-gray-400">
                    387 →
                  </Button>
                </div>

                <Card className="bg-[#3d3a35] border-[#4a4743] overflow-hidden">
                  <div className="space-y-2 p-4">
                    {isLinked ? (
                      gameHistory.map((game, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-4 bg-[#2a2725] rounded hover:bg-[#4a4743] transition"
                        >
                          <div className="flex items-center gap-4 flex-1">
                            {/* Game Mode Icon */}
                            <div className="flex-shrink-0">{game.modeIcon}</div>

                            {/* Player Info */}
                            <div className="flex items-center gap-3 flex-1">
                              <div className="w-10 h-10 bg-gray-600 rounded flex items-center justify-center text-lg">
                                {game.avatar}
                              </div>
                              <div>
                                <p className="font-semibold">
                                  {game.opponent} ({game.rating})
                                </p>
                                <p className="text-xs text-gray-400">{game.mode}</p>
                              </div>
                            </div>
                          </div>

                          {/* Result & Accuracy */}
                          <div className="flex items-center gap-4">
                            <div
                              className={`px-3 py-1 rounded font-semibold ${
                                game.result === "win"
                                  ? "bg-green-900 text-green-400"
                                  : "bg-red-900 text-red-400"
                              }`}
                            >
                              {game.result === "win"
                                ? language === "pt"
                                  ? "Vitória"
                                  : "Win"
                                : language === "pt"
                                  ? "Derrota"
                                  : "Loss"}
                            </div>
                            <p className="text-gray-400 w-16 text-right">{game.accuracy}</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-400 hover:text-white"
                            >
                              🔍
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-center text-gray-400">
                        {language === "pt"
                          ? "Ligue sua conta Chess.com para ver o histórico"
                          : "Link your Chess.com account to see history"}
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
}

function NavItem({ icon, label }: NavItemProps) {
  return (
    <Button
      variant="ghost"
      className="w-full justify-start text-gray-400 hover:text-white hover:bg-[#3d3a35] text-sm"
    >
      {icon}
      <span className="ml-3">{label}</span>
    </Button>
  );
}
