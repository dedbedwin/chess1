import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2 } from "lucide-react";
import GameReplay from "./GameReplay";

interface Message {
  role: "user" | "coach";
  content: string;
  timestamp: Date;
}

interface ReplayWithCoachProps {
  pgn: string;
  gameResult?: string;
}

export default function ReplayWithCoach({ pgn, gameResult }: ReplayWithCoachProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Simulate coach response (in production, call tRPC procedure)
      const coachResponse: Message = {
        role: "coach",
        content: `That's a great question about move ${currentMoveIndex + 1}! Let me analyze this position for you...`,
        timestamp: new Date(),
      };

      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setMessages((prev) => [...prev, coachResponse]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Replay Section */}
      <div className="lg:col-span-2">
        <GameReplay pgn={pgn} onMoveSelect={setCurrentMoveIndex} />
      </div>

      {/* Coach Chat Section */}
      <div className="flex flex-col h-full">
        <Card className="bg-[#3d3a35] border-[#4a4743] p-4 flex-1 flex flex-col">
          <h3 className="text-lg font-bold mb-4">Coach Analysis</h3>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto mb-4 space-y-3 min-h-96">
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <p>Ask me about any move in this game!</p>
                <p className="text-sm mt-2">Select a move and ask a question.</p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg ${
                      msg.role === "user"
                        ? "bg-green-600 text-white"
                        : "bg-[#4a4743] text-gray-200"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {msg.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#4a4743] text-gray-200 px-3 py-2 rounded-lg">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <Input
              placeholder="Ask about this move..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !isLoading) {
                  handleSendMessage();
                }
              }}
              disabled={isLoading}
              className="bg-[#2a2725] border-[#4a4743] text-white"
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
