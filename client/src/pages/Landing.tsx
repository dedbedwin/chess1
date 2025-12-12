import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useEffect } from "react";

export default function Landing() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  return (
    <div className="min-h-screen bg-[#262421] text-white">
      {/* Top Navigation Bar - Chess.com style */}
      <nav className="bg-[#1a1816] border-b border-[#3d3a35] px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold text-[#81b64c]">Chess Coach</h1>
            <div className="hidden md:flex gap-4">
              <Button variant="ghost" className="text-white hover:text-[#81b64c]" onClick={() => setLocation("/play")}>
                {t("nav_play")}
              </Button>
              <Button variant="ghost" className="text-white hover:text-[#81b64c]" onClick={() => setLocation("/history")}>
                {t("nav_history")}
              </Button>
              <Button variant="ghost" className="text-white hover:text-[#81b64c]" onClick={() => setLocation("/import")}>
                Import PGN
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              className="bg-[#81b64c] hover:bg-[#6fa03c] text-white font-semibold px-6"
              onClick={() => window.location.href = getLoginUrl()}
            >
              Sign In
            </Button>
            <Button
              variant="ghost"
              onClick={() => setLocation("/settings")}
              className="text-white hover:text-[#81b64c]"
            >
              {t("nav_settings")}
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Chess.com style */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Chess board preview */}
          <div className="flex justify-center">
            <div className="w-full max-w-md aspect-square bg-[#312e2b] rounded-lg shadow-2xl p-4">
              <div className="grid grid-cols-8 gap-0 w-full h-full">
                {Array.from({ length: 64 }).map((_, i) => {
                  const row = Math.floor(i / 8);
                  const col = i % 8;
                  const isLight = (row + col) % 2 === 0;
                  return (
                    <div
                      key={i}
                      className={`aspect-square ${
                        isLight ? "bg-[#eeeed2]" : "bg-[#81b64c]"
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Hero text */}
          <div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Play Chess Online
              <br />
              <span className="text-[#81b64c]">with AI Coach!</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Improve your game with intelligent coaching, detailed analysis, and bots of all skill levels.
            </p>
            <Button
              className="bg-[#81b64c] hover:bg-[#6fa03c] text-white text-lg px-12 py-6 rounded-lg font-semibold"
              onClick={() => window.location.href = getLoginUrl()}
            >
              Sign In to Get Started
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Sections */}
      <section className="py-16 px-4 bg-[#1a1816]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-4xl font-bold mb-4">Improve Your Game with AI Coach</h2>
              <p className="text-lg text-gray-300 mb-6">
                Get real-time feedback and analysis from an AI coach that adapts to your skill level.
              </p>
              <Button
                className="bg-[#81b64c] hover:bg-[#6fa03c] text-white px-8 py-4"
                onClick={() => setLocation("/play?mode=coach")}
              >
                Start Coaching Session
              </Button>
            </div>
            <div className="bg-[#312e2b] p-8 rounded-lg">
              <div className="text-6xl mb-4">🎓</div>
              <p className="text-gray-400">
                Interactive lessons, move-by-move analysis, and personalized feedback to help you master chess.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-[#312e2b] p-8 rounded-lg order-2 md:order-1">
              <div className="text-6xl mb-4">🤖</div>
              <p className="text-gray-400">
                Challenge bots from beginner (400) to grandmaster (2800) level. Each bot has its own personality!
              </p>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-4xl font-bold mb-4">Challenge Different Bots</h2>
              <p className="text-lg text-gray-300 mb-6">
                Play against Stockfish-powered bots with varying skill levels and unique personalities.
              </p>
              <Button
                className="bg-[#81b64c] hover:bg-[#6fa03c] text-white px-8 py-4"
                onClick={() => setLocation("/play?mode=bot")}
              >
                Challenge a Bot
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">More Features</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="bg-[#312e2b] border-[#3d3a35] p-6 hover:border-[#81b64c] transition-all cursor-pointer" onClick={() => setLocation("/history")}>
              <div className="text-4xl mb-3">📜</div>
              <h3 className="text-xl font-bold mb-2">{t("nav_history")}</h3>
              <p className="text-gray-400 text-sm">Review all your past games</p>
            </Card>

            <Card className="bg-[#312e2b] border-[#3d3a35] p-6 hover:border-[#81b64c] transition-all cursor-pointer" onClick={() => setLocation("/history")}>
              <div className="text-4xl mb-3">📊</div>
              <h3 className="text-xl font-bold mb-2">{t("nav_analysis")}</h3>
              <p className="text-gray-400 text-sm">Deep analysis with Stockfish</p>
            </Card>

            <Card className="bg-[#312e2b] border-[#3d3a35] p-6 hover:border-[#81b64c] transition-all cursor-pointer" onClick={() => setLocation("/import")}>
              <div className="text-4xl mb-3">📥</div>
              <h3 className="text-xl font-bold mb-2">Import PGN</h3>
              <p className="text-gray-400 text-sm">Analyze any chess game</p>
            </Card>

            <Card className="bg-[#312e2b] border-[#3d3a35] p-6 hover:border-[#81b64c] transition-all cursor-pointer" onClick={() => setLocation("/settings")}>
              <div className="text-4xl mb-3">⚙️</div>
              <h3 className="text-xl font-bold mb-2">{t("nav_settings")}</h3>
              <p className="text-gray-400 text-sm">Customize your experience</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a1816] border-t border-[#3d3a35] py-8 px-4 mt-16">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>Chess Coach © 2024 - Powered by Stockfish & ChatGPT</p>
          <p className="text-sm mt-2">Play, Learn, and Improve Your Chess Game</p>
        </div>
      </footer>
    </div>
  );
}
