import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { useAuth } from "@/_core/hooks/useAuth";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Play from "./pages/Play";
import History from "./pages/History";
import Analysis from "./pages/Analysis";
import Settings from "./pages/Settings";
import ImportPGN from "./pages/ImportPGN";
import Puzzles from "./pages/Puzzles";
import PuzzleGame from "./pages/PuzzleGame";

function Router() {
  const { isAuthenticated } = useAuth();

  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/landing" component={Landing} />
      <Route path="/play" component={Play} />
      <Route path="/history" component={History} />
      <Route path="/analysis/:id" component={Analysis} />
      <Route path="/settings" component={Settings} />
      <Route path="/import" component={ImportPGN} />
      <Route path="/puzzles" component={Puzzles} />
      <Route path="/puzzle-game/:id" component={PuzzleGame} />
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#262421] flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  // Redirect to landing if not authenticated
  if (!isAuthenticated && window.location.pathname === "/") {
    window.location.href = "/landing";
    return null;
  }

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
