import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Send, Loader2 } from "lucide-react";
import { Streamdown } from "streamdown";

interface CoachChatProps {
  gameId: number;
  currentFen: string;
  currentEvaluation?: number;
  currentMoveNumber?: number;
}

export function CoachChat({ gameId, currentFen, currentEvaluation, currentMoveNumber }: CoachChatProps) {
  const { t } = useLanguage();
  const [message, setMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: chats, refetch } = trpc.chess.getCoachChats.useQuery({ gameId });
  const sendMessage = trpc.chess.sendCoachMessage.useMutation({
    onSuccess: () => {
      refetch();
      setMessage("");
    },
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chats]);

  const handleSend = async () => {
    if (!message.trim() || sendMessage.isPending) return;

    await sendMessage.mutateAsync({
      gameId,
      message: message.trim(),
      fen: currentFen,
      evaluation: currentEvaluation,
      moveNumber: currentMoveNumber,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="bg-[#312e2b] border-[#3d3a35] p-4 h-full flex flex-col">
      <h3 className="text-xl font-bold mb-4 text-[#81b64c]">Coach</h3>

      <ScrollArea className="flex-1 pr-4 mb-4" ref={scrollRef}>
        <div className="space-y-4">
          {!chats || chats.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <p>{t("coach_chat_placeholder")}</p>
            </div>
          ) : (
            chats.map((chat) => (
              <div
                key={chat.id}
                className={`flex ${chat.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    chat.role === "user"
                      ? "bg-[#81b64c] text-white"
                      : "bg-[#262421] text-gray-100"
                  }`}
                >
                  {chat.role === "coach" ? (
                    <Streamdown>{chat.message}</Streamdown>
                  ) : (
                    <p className="text-sm">{chat.message}</p>
                  )}
                  {chat.moveNumber && (
                    <p className="text-xs opacity-70 mt-1">
                      {t("analysis_move_number")} {chat.moveNumber}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
          {sendMessage.isPending && (
            <div className="flex justify-start">
              <div className="bg-[#262421] text-gray-100 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">{t("coach_thinking")}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={t("coach_chat_placeholder")}
          className="bg-[#262421] border-[#3d3a35] text-white"
          disabled={sendMessage.isPending}
        />
        <Button
          onClick={handleSend}
          disabled={!message.trim() || sendMessage.isPending}
          className="bg-[#81b64c] hover:bg-[#6fa03c]"
        >
          {sendMessage.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>
    </Card>
  );
}
