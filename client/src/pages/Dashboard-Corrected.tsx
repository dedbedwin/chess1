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
  Settings,
  HelpCircle,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  Zap,
  Trophy,
  LogOut,
  Flame,
  Clock,
  Link2,
  Globe,
  Palette,
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import ChessComLinkButton from "@/components/ChessComLinkButton";
import IndividualRatingChart from "@/components/IndividualRatingChart";
import { UserPreferencesManager } from "@/lib/userPreferences";

export default function DashboardCorrected() {
  const [, navigate] = useLocation();
  const { user, logout } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [playerName, setPlayerName] = useState("Guest");
  const [isLinked, setIsLinked] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    // Load preferences from cookies
    const prefs = UserPreferencesManager.getPreferences();
    setPlayerName(prefs.playerName);
    setIsLinked(prefs.isChessComLinked);
  }, []);

  const userStats = {
    bulletRating: isLinked ? 1500 : null,
    blitzRating: isLinked ? 1600 : null,
    rapidRating: isLinked ? 1400 : null,
    dailyRating: isLinked ? 1350 : null,
    puzzlesRolved: isLinked ? 2288 : null,
    gamesPlayed: isLinked ? 8941 : null,
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
          <NavItem
            icon={<Play size={20} className="text-blue-400" />}
            label="Play"
            open={sidebarOpen}
          />
          <NavItem
            icon={<Puzzle size={20} className="text-orange-400" />}
            label="Puzzles"
            open={sidebarOpen}
          />
          <NavItem
            icon={<BookOpen size={20} className="text-blue-400" />}
            label="Learn"
            open={sidebarOpen}
          />
          <NavItem
            icon={<Eye size={20} className="text-cyan-400" />}
            label="Watch"
            open={sidebarOpen}
          />
          <NavItem
            icon={<Newspaper size={20} className="text-red-400" />}
            label="News"
            open={sidebarOpen}
          />
          <NavItem
            icon={<Users size={20} className="text-orange-400" />}
            label="Social"
            open={sidebarOpen}
          />
          <NavItem
            icon={<MoreHorizontal size={20} className="text-gray-400" />}
            label="More"
            open={sidebarOpen}
          />
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-[#4a4743] space-y-2">
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
          {/* Top Bar with Controls */}
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-[#4a4743]">
            <ChessComLinkButton isLinked={isLinked} />
            <div className="flex items-center gap-4">
              {/* Language Selector */}
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as "en" | "pt")}
                className="bg-[#3d3a35] border border-[#4a4743] rounded px-3 py-2 text-sm text-white"
              >
                <option value="en">English</option>
                <option value="pt">Português</option>
              </select>

              {/* Theme Selector */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="hover:bg-[#3d3a35]"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </Button>

              {/* Settings */}
              <Button variant="ghost" size="sm" className="hover:bg-[#3d3a35]">
                <Settings size={18} />
              </Button>
            </div>
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

          {/* Main Layout: 4/5 History + 1/5 Ratings */}
          <div className="grid grid-cols-5 gap-6">
            {/* Left: Game History (4/5) */}
            <div className="col-span-4">
              <Card className="bg-[#3d3a35] border-[#4a4743] p-6">
                <h3 className="text-xl font-bold mb-4">
                  {language === "pt" ? "Histórico" : "Game History"}
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#4a4743]">
                        <th className="text-left py-2 px-4">
                          {language === "pt" ? "Jogadores" : "Players"}
                        </th>
                        <th className="text-left py-2 px-4">
                          {language === "pt" ? "Resultado" : "Result"}
                        </th>
                        <th className="text-left py-2 px-4">
                          {language === "pt" ? "Precisão" : "Accuracy"}
                        </th>
                        <th className="text-left py-2 px-4">
                          {language === "pt" ? "Movimentos" : "Moves"}
                        </th>
                        <th className="text-left py-2 px-4">
                          {language === "pt" ? "Data" : "Date"}
                        </th>
                        <th className="text-left py-2 px-4">
                          {language === "pt" ? "Ação" : "Action"}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLinked ? (
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
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-gray-400">
                            {language === "pt"
                              ? "Ligue sua conta Chess.com para ver o histórico"
                              : "Link your Chess.com account to see history"}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            {/* Right: Individual Rating Charts (1/5) */}
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
