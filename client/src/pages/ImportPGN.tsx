import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { Upload } from "lucide-react";

export default function ImportPGN() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const [pgnText, setPgnText] = useState("");

  const importPGN = trpc.chess.importPGN.useMutation({
    onSuccess: (game) => {
      if (game) {
        toast.success("PGN imported successfully!");
        setLocation(`/analysis/${game.id}`);
      }
    },
    onError: (error) => {
      toast.error(`Import failed: ${error.message}`);
    },
  });

  const handleImport = () => {
    if (!pgnText.trim()) {
      toast.error("Please enter a PGN");
      return;
    }

    importPGN.mutate({ pgn: pgnText.trim() });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setPgnText(text);
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-[#262421] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">{t("pgn_import_title")}</h1>

        <Card className="bg-[#312e2b] border-[#3d3a35] p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-lg font-semibold mb-2">
                {t("pgn_import_paste")}
              </label>
              <Textarea
                value={pgnText}
                onChange={(e) => setPgnText(e.target.value)}
                placeholder='[Event "Example Game"]&#10;[Site "?"]&#10;[Date "2024.01.01"]&#10;[White "Player1"]&#10;[Black "Player2"]&#10;[Result "1-0"]&#10;&#10;1. e4 e5 2. Nf3 Nc6...'
                className="bg-[#262421] border-[#3d3a35] text-white min-h-[300px] font-mono text-sm"
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1 border-t border-[#3d3a35]" />
              <span className="text-gray-400">or</span>
              <div className="flex-1 border-t border-[#3d3a35]" />
            </div>

            <div>
              <label
                htmlFor="pgn-file"
                className="block text-lg font-semibold mb-2 cursor-pointer"
              >
                {t("pgn_import_file")}
              </label>
              <input
                id="pgn-file"
                type="file"
                accept=".pgn"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById("pgn-file")?.click()}
                className="w-full flex items-center justify-center gap-2"
              >
                <Upload size={16} />
                {t("pgn_import_choose_file")}
              </Button>
            </div>

            <div className="pt-4">
              <Button
                className="w-full bg-[#81b64c] hover:bg-[#6fa03c] text-white"
                onClick={handleImport}
                disabled={importPGN.isPending || !pgnText.trim()}
              >
                {importPGN.isPending ? t("loading") : t("pgn_import_analyze")}
              </Button>
            </div>

            <div className="text-sm text-gray-400 mt-4">
              <p className="font-semibold mb-2">{t("pgn_import_info_title")}</p>
              <ul className="list-disc list-inside space-y-1">
                <li>{t("pgn_import_info_1")}</li>
                <li>{t("pgn_import_info_2")}</li>
                <li>{t("pgn_import_info_3")}</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
