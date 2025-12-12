import { useEffect, useState } from "react";
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
  Flame,
  Clock,
  Link2,
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import ChessComLinkButton from "@/components/ChessComLinkButton";
import IndividualRatingChart from "@/components/IndividualRatingChart";
import { UserPreferencesManager } from "@/lib/userPreferences";

export default function DashboardFinal() {
  const [, navigate] = useLocation();
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [playerName, setPlayerName] = useState("Guest");
  const [isLinked, setIsLinked] = useState(false);

  useEffect(() => {
    // Load preferences from cookies
    const prefs = UserPreferencesManager.getPreferences();
    setPlayerName(prefs.playerName);
    setIsLinked(prefs.isChessComLinked);
  }, []);

  const userStats = {
    bulletRating: 1500,
    blitzRating: 1600,
    rapidRating: 1400,
    dailyRating: 1350,
    puzzlesRolved: 2288,
    gamesPlayed: 8941,
  };

  const ratingData = [
    { date: "Mon", rating: 1480 },
    { date: "Tue", rating: 1490 },
    { date: "Wed", rating: 1500 },
    { date: "Thu", rating: 1495 },
    { date: "Fri", rating: 1510 },
  ];

  const handleLogout = () => {
    logout();
    UserPreferencesManager.clearPreferences();
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-[#2a2725] text-white">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-48" : "w-20"
        } bg-[#1a1815] border-r border-[#4a4743] transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-4 flex items-center gap-2 border-b border-[#4a4743]">
          <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">♟</span>
          </div>
          {sidebarOpen && <span className="font-bold">Chess Coach</span>}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <NavItem icon={<Play size={20} />} label="Play" open={sidebarOpen} />
          <NavItem icon={<Puzzle size={20} />} label="Puzzles" open={sidebarOpen} />
          <NavItem icon={<BookOpen size={20} />} label="Learn" open={sidebarOpen} />
          <NavItem icon={<Eye size={20} />} label="Watch" open={sidebarOpen} />
          <NavItem icon={<Newspaper size={20} />} label="News" open={sidebarOpen} />
          <NavItem icon={<Users size={20} />} label="Social" open={sidebarOpen} />
          <NavItem icon={<MoreHorizontal size={20} />} label="More" open={sidebarOpen} />
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-[#4a4743] space-y-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-green-400 hover:bg-[#3d3a35]"
          >
            {sidebarOpen ? "Upgrade" : "⬆"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start hover:bg-[#3d3a35]"
          >
            {sidebarOpen ? <Settings size={16} /> : <Settings size={16} />}
            {sidebarOpen && "Settings"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start hover:bg-[#3d3a35]"
          >
            {sidebarOpen ? <HelpCircle size={16} /> : <HelpCircle size={16} />}
            {sidebarOpen && "Help"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start hover:bg-[#3d3a35]"
            onClick={handleLogout}
          >
            {sidebarOpen ? <LogOut size={16} /> : <LogOut size={16} />}
            {sidebarOpen && "Logout"}
          </Button>
        </div>

        {/* Collapse Button */}
        <div className="p-4 border-t border-[#4a4743]">
          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header with Chess.com Link Button */}
          <div className="mb-8">
            <ChessComLinkButton isLinked={isLinked} />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Button className="bg-[#3d3a35] hover:bg-[#4a4743] h-16 flex flex-col items-center justify-center gap-2">
              <Zap className="w-6 h-6" />
              <span>Analyze</span>
            </Button>
            <Button className="bg-[#3d3a35] hover:bg-[#4a4743] h-16 flex flex-col items-center justify-center gap-2">
              <Users className="w-6 h-6" />
              <span>vs Coach</span>
            </Button>
            <Button className="bg-[#3d3a35] hover:bg-[#4a4743] h-16 flex flex-col items-center justify-center gap-2">
              <Trophy className="w-6 h-6" />
              <span>vs Bots</span>
            </Button>
            <Button className="bg-[#3d3a35] hover:bg-[#4a4743] h-16 flex flex-col items-center justify-center gap-2">
              <Puzzle className="w-6 h-6" />
              <span>Play Puzzles</span>
            </Button>
          </div>

          {/* Main Layout: 1/5 Ratings + 4/5 History */}
          <div className="grid grid-cols-5 gap-6">
            {/* Left: Individual Rating Charts (1/5) */}
            <div className="col-span-1 space-y-4">
              <IndividualRatingChart
                title="Bullet"
                rating={userStats.bulletRating}
                data={ratingData}
                color="text-gray-300"
                icon={<Flame className="w-5 h-5 text-gray-400" />}
              />
              <IndividualRatingChart
                title="Blitz"
                rating={userStats.blitzRating}
                data={ratingData}
                color="text-yellow-400"
                icon={<Zap className="w-5 h-5 text-yellow-400" />}
              />
              <IndividualRatingChart
                title="Rapid"
                rating={userStats.rapidRating}
                data={ratingData}
                color="text-green-400"
                icon={<Clock className="w-5 h-5 text-green-400" />}
              />
              <IndividualRatingChart
                title="Puzzles"
                rating={userStats.puzzlesRolved}
                data={ratingData}
                color="text-orange-400"
                icon={<Puzzle className="w-5 h-5 text-orange-400" />}
              />
            </div>

            {/* Right: Game History (4/5) */}
            <div className="col-span-4">
              <Card className="bg-[#3d3a35] border-[#4a4743] p-6">
                <h3 className="text-xl font-bold mb-4">Completed Games</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#4a4743]">
                        <th className="text-left py-2 px-4">Players</th>
                        <th className="text-left py-2 px-4">Result</th>
                        <th className="text-left py-2 px-4">Accuracy</th>
                        <th className="text-left py-2 px-4">Moves</th>
                        <th className="text-left py-2 px-4">Date</th>
                        <th className="text-left py-2 px-4">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[#4a4743] hover:bg-[#4a4743]">
                        <td className="py-3 px-4">You vs Computer</td>
                        <td className="py-3 px-4">
                          <span className="text-green-400">Win</span>
                        </td>
                        <td className="py-3 px-4">87%</td>
                        <td className="py-3 px-4">42</td>
                        <td className="py-3 px-4">Today</td>
                        <td className="py-3 px-4">
                          <Button size="sm" variant="ghost">
                            Analyze
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Card>
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
  open: boolean;
}

function NavItem({ icon, label, open }: NavItemProps) {
  return (
    <Button
      variant="ghost"
      className="w-full justify-start text-gray-400 hover:text-white hover:bg-[#3d3a35]"
    >
      {icon}
      {open && <span className="ml-3">{label}</span>}
    </Button>
  );
}
