import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Play,
  Puzzle,
  BookOpen,
  Eye,
  Newspaper,
  Users,
  MoreHorizontal,
  Settings,
  HelpCircle,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  Zap,
  Trophy,
  BarChart3,
  LogOut,
} from "lucide-react";
import RatingChart from "@/components/RatingChart";
import ChessComLinkButton from "@/components/ChessComLinkButton";

export default function DashboardUpdated() {
  const { user, logout } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const [, setLocation] = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Mock data - replace with real data from API
  const userStats = {
    bulletRating: 1500,
    blitzRating: 1600,
    rapidRating: 1400,
    puzzlesSolved: 2288,
    accuracy: 68.5,
  };

  const ratingData = [
    { format: "Bullet", rating: userStats.bulletRating || 0 },
    { format: "Blitz", rating: userStats.blitzRating || 0 },
    { format: "Rapid", rating: userStats.rapidRating || 0 },
    { format: "Daily", rating: 0 },
  ];

  const navigationItems = [
    { icon: Play, label: "Play", color: "text-blue-400", action: () => setLocation("/play") },
    { icon: Puzzle, label: "Puzzles", color: "text-orange-400", action: () => setLocation("/puzzles") },
    {
      icon: BookOpen,
      label: "Learn",
      color: "text-blue-500",
      action: () => alert("Coming soon!"),
    },
    { icon: Eye, label: "Watch", color: "text-purple-400", action: () => alert("Coming soon!") },
    { icon: Newspaper, label: "News", color: "text-red-400", action: () => alert("Coming soon!") },
    { icon: Users, label: "Social", color: "text-yellow-400", action: () => alert("Coming soon!") },
    {
      icon: MoreHorizontal,
      label: "More",
      color: "text-gray-400",
      action: () => alert("Coming soon!"),
    },
  ];

  const completedGames = [
    {
      id: 1,
      opponent: "NowYouSeeMe...",
      result: "0",
      accuracy: 68.7,
      moves: 42,
      date: "Aug 3, 2022",
    },
    {
      id: 2,
      opponent: "DanielRe...",
      result: "1",
      accuracy: 61.9,
      moves: 46,
      date: "Aug 2, 2022",
    },
  ];

  return (
    <div className="min-h-screen bg-[#262421] text-white flex">
      {/* Sidebar */}
      <div
        className={`${
          sidebarCollapsed ? "w-20" : "w-48"
        } bg-[#1a1a1a] border-r border-[#3d3a35] transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-[#3d3a35] flex items-center justify-between">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center font-bold">
                ♟
              </div>
              <span className="font-bold text-sm">Chess Coach</span>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1 hover:bg-[#3d3a35] rounded"
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#3d3a35] transition-colors ${item.color} ${
                sidebarCollapsed ? "justify-center" : ""
              }`}
              title={sidebarCollapsed ? item.label : ""}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && <span className="text-sm">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="border-t border-[#3d3a35] p-4 space-y-2">
          <button
            onClick={() => setLocation("/settings")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#3d3a35] transition-colors text-gray-400 ${
              sidebarCollapsed ? "justify-center" : ""
            }`}
            title={sidebarCollapsed ? "Settings" : ""}
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span className="text-sm">Settings</span>}
          </button>
          <button
            onClick={() => alert("Help coming soon!")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#3d3a35] transition-colors text-gray-400 ${
              sidebarCollapsed ? "justify-center" : ""
            }`}
            title={sidebarCollapsed ? "Help" : ""}
          >
            <HelpCircle className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span className="text-sm">Help</span>}
          </button>
          <button
            onClick={logout}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-900/20 transition-colors text-red-400 ${
              sidebarCollapsed ? "justify-center" : ""
            }`}
            title={sidebarCollapsed ? "Logout" : ""}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-[#1a1a1a] border-b border-[#3d3a35] p-6 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {user?.name || "Guest"}!</h1>
              <p className="text-gray-400 mt-1">Continue your chess journey</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setLanguage(language === "en" ? "pt" : "en")}
                className="px-3 py-2 rounded-lg hover:bg-[#3d3a35] transition-colors text-sm"
              >
                {language === "en" ? "PT" : "EN"}
              </button>
              <button className="p-2 hover:bg-[#3d3a35] rounded-lg transition-colors">
                <Sun className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-w-7xl mx-auto">
          {/* Chess.com Link Button */}
          <ChessComLinkButton isLinked={false} />

          {/* Rating Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="bg-[#3d3a35] border-[#4a4743] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Bullet</p>
                  <p className="text-3xl font-bold text-green-400">
                    {userStats.bulletRating || "N/A"}
                  </p>
                </div>
                <Zap className="w-8 h-8 text-yellow-400" />
              </div>
            </Card>

            <Card className="bg-[#3d3a35] border-[#4a4743] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Blitz</p>
                  <p className="text-3xl font-bold text-green-400">
                    {userStats.blitzRating || "N/A"}
                  </p>
                </div>
                <Trophy className="w-8 h-8 text-orange-400" />
              </div>
            </Card>

            <Card className="bg-[#3d3a35] border-[#4a4743] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Rapid</p>
                  <p className="text-3xl font-bold text-green-400">
                    {userStats.rapidRating || "N/A"}
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-400" />
              </div>
            </Card>

            <Card className="bg-[#3d3a35] border-[#4a4743] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Puzzles</p>
                  <p className="text-3xl font-bold text-green-400">{userStats.puzzlesSolved}</p>
                </div>
                <Puzzle className="w-8 h-8 text-orange-400" />
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Button
              onClick={() => setLocation("/play")}
              className="bg-[#3d3a35] hover:bg-[#4a4743] border border-[#4a4743] text-white h-20 flex flex-col items-center justify-center"
            >
              <Zap className="w-6 h-6 mb-2" />
              <span>Play 3 min</span>
            </Button>

            <Button
              onClick={() => setLocation("/play")}
              className="bg-[#3d3a35] hover:bg-[#4a4743] border border-[#4a4743] text-white h-20 flex flex-col items-center justify-center"
            >
              <Users className="w-6 h-6 mb-2" />
              <span>Play Coach</span>
            </Button>

            <Button
              onClick={() => setLocation("/play")}
              className="bg-[#3d3a35] hover:bg-[#4a4743] border border-[#4a4743] text-white h-20 flex flex-col items-center justify-center"
            >
              <Trophy className="w-6 h-6 mb-2" />
              <span>vs Bots</span>
            </Button>

            <Button
              onClick={() => setLocation("/play")}
              className="bg-[#3d3a35] hover:bg-[#4a4743] border border-[#4a4743] text-white h-20 flex flex-col items-center justify-center"
            >
              <Users className="w-6 h-6 mb-2" />
              <span>Play a Friend</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Rating Chart */}
              <RatingChart data={ratingData} title="Ratings by Format" />

              {/* Completed Games */}
              <Card className="bg-[#3d3a35] border-[#4a4743] p-6">
                <h3 className="text-xl font-bold mb-4">Completed Games</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#4a4743]">
                        <th className="text-left py-2 px-2 text-gray-400">Players</th>
                        <th className="text-left py-2 px-2 text-gray-400">Result</th>
                        <th className="text-left py-2 px-2 text-gray-400">Accuracy</th>
                        <th className="text-left py-2 px-2 text-gray-400">Moves</th>
                        <th className="text-left py-2 px-2 text-gray-400">Date</th>
                        <th className="text-left py-2 px-2 text-gray-400">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {completedGames.map((game) => (
                        <tr key={game.id} className="border-b border-[#4a4743] hover:bg-[#2a2725]">
                          <td className="py-3 px-2">{game.opponent}</td>
                          <td className="py-3 px-2">
                            <span
                              className={
                                game.result === "1"
                                  ? "text-green-400"
                                  : game.result === "0"
                                    ? "text-red-400"
                                    : "text-yellow-400"
                              }
                            >
                              {game.result === "1" ? "Win" : game.result === "0" ? "Loss" : "Draw"}
                            </span>
                          </td>
                          <td className="py-3 px-2">{game.accuracy}%</td>
                          <td className="py-3 px-2">{game.moves}</td>
                          <td className="py-3 px-2 text-gray-400">{game.date}</td>
                          <td className="py-3 px-2">
                            <Button
                              onClick={() => setLocation(`/analysis/${game.id}`)}
                              variant="outline"
                              size="sm"
                              className="border-gray-600 hover:bg-gray-700"
                            >
                              Analyze
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            {/* Right Sidebar */}
            <div>
              <Card className="bg-[#3d3a35] border-[#4a4743] p-6 mb-6">
                <h3 className="text-xl font-bold mb-4">Stats</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Games</p>
                    <p className="text-2xl font-bold">8,941</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Puzzles</p>
                    <p className="text-2xl font-bold">12,550</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Lessons</p>
                    <p className="text-2xl font-bold">101</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-[#3d3a35] border-[#4a4743] p-6">
                <h3 className="text-xl font-bold mb-4">Insights</h3>
                <div className="space-y-3 text-sm text-gray-400">
                  <p>• Improve your opening repertoire</p>
                  <p>• Practice endgame techniques</p>
                  <p>• Solve more tactical puzzles</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
