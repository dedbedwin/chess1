/**
 * Internationalization (i18n) translations
 * Supports English and Portuguese
 */

export type Language = "en" | "pt";

export interface Translations {
  // Navigation
  nav_home: string;
  nav_play: string;
  nav_history: string;
  nav_settings: string;
  nav_analysis: string;

  // Game modes
  mode_bot: string;
  mode_coach: string;
  select_opponent: string;
  select_color: string;
  color_white: string;
  color_black: string;
  color_random: string;

  // Bot levels
  bot_beginner: string;
  bot_casual: string;
  bot_intermediate: string;
  bot_advanced: string;
  bot_expert: string;
  bot_master: string;
  bot_grandmaster: string;

  // Game controls
  btn_new_game: string;
  btn_resign: string;
  btn_draw: string;
  btn_analyze: string;
  btn_export_pgn: string;
  btn_import_pgn: string;

  // Game status
  status_check: string;
  status_checkmate: string;
  status_stalemate: string;
  status_draw: string;
  status_your_turn: string;
  status_opponent_turn: string;

  // Results
  result_win: string;
  result_loss: string;
  result_draw: string;

  // Move markers
  marker_brilliant: string;
  marker_excellent: string;
  marker_good: string;
  marker_book: string;
  marker_inaccuracy: string;
  marker_mistake: string;
  marker_blunder: string;

  // Settings
  settings_title: string;
  settings_board_theme: string;
  settings_piece_set: string;
  settings_language: string;
  settings_save: string;

  // Board themes
  theme_green: string;
  theme_brown: string;
  theme_blue: string;
  theme_gray: string;

  // Piece sets
  pieces_classic: string;
  pieces_modern: string;
  pieces_wood: string;

  // Coach
  coach_chat_placeholder: string;
  coach_thinking: string;
  coach_send: string;

  // Analysis
  analysis_accuracy: string;
  analysis_best_move: string;
  analysis_evaluation: string;
  analysis_move_number: string;

  // PGN Import
  pgn_import_title: string;
  pgn_import_paste: string;
  pgn_import_file: string;
  pgn_import_choose_file: string;
  pgn_import_analyze: string;
  pgn_import_info_title: string;
  pgn_import_info_1: string;
  pgn_import_info_2: string;
  pgn_import_info_3: string;

  // Common
  loading: string;
  error: string;
  save: string;
  cancel: string;
  close: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    // Navigation
    nav_home: "Home",
    nav_play: "Play",
    nav_history: "Game History",
    nav_settings: "Settings",
    nav_analysis: "Analysis",

    // Game modes
    mode_bot: "Play vs Bot",
    mode_coach: "Play with Coach",
    select_opponent: "Select Opponent",
    select_color: "Select Color",
    color_white: "White",
    color_black: "Black",
    color_random: "Random",

    // Bot levels
    bot_beginner: "Beginner (400)",
    bot_casual: "Casual (800)",
    bot_intermediate: "Intermediate (1200)",
    bot_advanced: "Advanced (1600)",
    bot_expert: "Expert (2000)",
    bot_master: "Master (2400)",
    bot_grandmaster: "Grandmaster (2800)",

    // Game controls
    btn_new_game: "New Game",
    btn_resign: "Resign",
    btn_draw: "Offer Draw",
    btn_analyze: "Analyze",
    btn_export_pgn: "Export PGN",
    btn_import_pgn: "Import PGN",

    // Game status
    status_check: "Check!",
    status_checkmate: "Checkmate!",
    status_stalemate: "Stalemate!",
    status_draw: "Draw!",
    status_your_turn: "Your turn",
    status_opponent_turn: "Opponent's turn",

    // Results
    result_win: "You won!",
    result_loss: "You lost",
    result_draw: "Draw",

    // Move markers
    marker_brilliant: "Brilliant",
    marker_excellent: "Excellent",
    marker_good: "Good",
    marker_book: "Book",
    marker_inaccuracy: "Inaccuracy",
    marker_mistake: "Mistake",
    marker_blunder: "Blunder",

    // Coach Chat
    coach_chat_placeholder: "Ask the coach a question...",
    coach_thinking: "Coach is thinking...",
    coach_send: "Send",

    // Settings
    settings_title: "Settings",
    settings_board_theme: "Board Theme",
    settings_piece_set: "Piece Set",
    settings_language: "Language",
    settings_save: "Save Settings",

    // Board themes
    theme_green: "Green",
    theme_brown: "Brown",
    theme_blue: "Blue",
    theme_gray: "Gray",

    // Piece sets
    pieces_classic: "Classic",
    pieces_modern: "Modern",
    pieces_wood: "Wood",

    // Analysis
    analysis_accuracy: "Accuracy",
    analysis_best_move: "Best Move",
    analysis_evaluation: "Evaluation",
    analysis_move_number: "Move",

    // PGN Import
    pgn_import_title: "Import PGN",
    pgn_import_paste: "Paste PGN",
    pgn_import_file: "Upload PGN File",
    pgn_import_choose_file: "Choose File",
    pgn_import_analyze: "Import and Analyze",
    pgn_import_info_title: "Supported formats:",
    pgn_import_info_1: "Standard PGN format with headers",
    pgn_import_info_2: "Single game or multiple games",
    pgn_import_info_3: "Automatic analysis will be performed after import",

    // Common
    loading: "Loading...",
    error: "Error",
    save: "Save",
    cancel: "Cancel",
    close: "Close",
  },
  pt: {
    // Navigation
    nav_home: "Início",
    nav_play: "Jogar",
    nav_history: "Histórico de Jogos",
    nav_settings: "Configurações",
    nav_analysis: "Análise",

    // Game modes
    mode_bot: "Jogar vs Bot",
    mode_coach: "Jogar com Treinador",
    select_opponent: "Selecionar Adversário",
    select_color: "Selecionar Cor",
    color_white: "Brancas",
    color_black: "Pretas",
    color_random: "Aleatório",

    // Bot levels
    bot_beginner: "Iniciante (400)",
    bot_casual: "Casual (800)",
    bot_intermediate: "Intermediário (1200)",
    bot_advanced: "Avançado (1600)",
    bot_expert: "Especialista (2000)",
    bot_master: "Mestre (2400)",
    bot_grandmaster: "Grande Mestre (2800)",

    // Game controls
    btn_new_game: "Novo Jogo",
    btn_resign: "Desistir",
    btn_draw: "Oferecer Empate",
    btn_analyze: "Analisar",
    btn_export_pgn: "Exportar PGN",
    btn_import_pgn: "Importar PGN",

    // Game status
    status_check: "Xeque!",
    status_checkmate: "Xeque-mate!",
    status_stalemate: "Afogamento!",
    status_draw: "Empate!",
    status_your_turn: "Sua vez",
    status_opponent_turn: "Vez do adversário",

    // Results
    result_win: "Você ganhou!",
    result_loss: "Você perdeu",
    result_draw: "Empate",

    // Move markers
    marker_brilliant: "Brilhante",
    marker_excellent: "Excelente",
    marker_good: "Bom",
    marker_book: "Teoria",
    marker_inaccuracy: "Imprecisão",
    marker_mistake: "Erro",
    marker_blunder: "Capivarada",

    // Coach Chat
    coach_chat_placeholder: "Faça uma pergunta ao coach...",
    coach_thinking: "Coach está a pensar...",
    coach_send: "Enviar",

    // Settings
    settings_title: "Configurações",
    settings_board_theme: "Tema do Tabuleiro",
    settings_piece_set: "Conjunto de Peças",
    settings_language: "Idioma",
    settings_save: "Salvar Configurações",

    // Board themes
    theme_green: "Verde",
    theme_brown: "Marrom",
    theme_blue: "Azul",
    theme_gray: "Cinza",

    // Piece sets
    pieces_classic: "Clássico",
    pieces_modern: "Moderno",
    pieces_wood: "Madeira",

    // Analysis
    analysis_accuracy: "Precisão",
    analysis_best_move: "Melhor Jogada",
    analysis_evaluation: "Avaliação",
    analysis_move_number: "Jogada",

    // PGN Import
    pgn_import_title: "Importar PGN",
    pgn_import_paste: "Colar PGN",
    pgn_import_file: "Carregar Ficheiro PGN",
    pgn_import_choose_file: "Escolher Ficheiro",
    pgn_import_analyze: "Importar e Analisar",
    pgn_import_info_title: "Formatos suportados:",
    pgn_import_info_1: "Formato PGN padrão com cabeçalhos",
    pgn_import_info_2: "Jogo único ou múltiplos jogos",
    pgn_import_info_3: "Análise automática será realizada após importação",

    // Common
    loading: "Carregando...",
    error: "Erro",
    save: "Salvar",
    cancel: "Cancelar",
    close: "Fechar",
  },
};

export function getTranslation(lang: Language, key: keyof Translations): string {
  return translations[lang][key];
}
