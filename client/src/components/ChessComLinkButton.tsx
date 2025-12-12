import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link2, Unlink2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ChessComLinkButtonProps {
  isLinked?: boolean;
  username?: string;
  onLinked?: () => void;
}

export default function ChessComLinkButton({
  isLinked = false,
  username = "",
  onLinked,
}: ChessComLinkButtonProps) {
  const { user } = useAuth();
  const [showInput, setShowInput] = useState(false);
  const [inputUsername, setInputUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLink = async () => {
    if (!inputUsername.trim()) {
      toast.error("Please enter a Chess.com username");
      return;
    }

    setLoading(true);
    try {
      // Call API to link Chess.com account
      // This would typically call a tRPC procedure
      toast.success(`Linked to Chess.com account: ${inputUsername}`);
      setInputUsername("");
      setShowInput(false);
      onLinked?.();
    } catch (error) {
      toast.error("Failed to link Chess.com account");
    } finally {
      setLoading(false);
    }
  };

  const handleUnlink = async () => {
    setLoading(true);
    try {
      // Call API to unlink Chess.com account
      toast.success("Chess.com account unlinked");
      onLinked?.();
    } catch (error) {
      toast.error("Failed to unlink Chess.com account");
    } finally {
      setLoading(false);
    }
  };

  if (isLinked && username) {
    return (
      <Card className="bg-green-900/20 border-green-700 p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link2 className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-sm text-gray-400">Linked to Chess.com</p>
              <p className="font-bold text-green-400">{username}</p>
            </div>
          </div>
          <Button
            onClick={handleUnlink}
            disabled={loading}
            variant="outline"
            className="border-red-600 hover:bg-red-900/20 text-red-400"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Unlink2 className="w-4 h-4" />}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-[#3d3a35] border-[#4a4743] p-4 mb-6">
      {!showInput ? (
        <Button
          onClick={() => setShowInput(true)}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          <Link2 className="w-4 h-4 mr-2" />
          Link Chess.com Account
        </Button>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-gray-400">Enter your Chess.com username</p>
          <Input
            placeholder="Chess.com username"
            value={inputUsername}
            onChange={(e) => setInputUsername(e.target.value)}
            className="bg-[#2a2725] border-[#4a4743] text-white"
            onKeyPress={(e) => e.key === "Enter" && handleLink()}
          />
          <div className="flex gap-2">
            <Button
              onClick={handleLink}
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Link Account
            </Button>
            <Button
              onClick={() => {
                setShowInput(false);
                setInputUsername("");
              }}
              disabled={loading}
              variant="outline"
              className="flex-1 border-gray-600 hover:bg-gray-700"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
