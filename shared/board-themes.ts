/**
 * Board and Piece Theme Configuration
 * 
 * This file allows you to easily customize the chess board appearance and piece sets.
 * 
 * To add a new board theme:
 * 1. Add a new entry to the BOARD_THEMES object
 * 2. Specify the light and dark square colors
 * 3. Reference the theme in your Chessboard component
 * 
 * To add a new piece set:
 * 1. Add piece SVG files to client/public/pieces/{pieceset-name}/
 * 2. Add a new entry to the PIECE_SETS object
 * 3. The system will automatically load pieces from the public folder
 * 
 * Piece file naming convention:
 * - wK, wQ, wR, wB, wN, wP (white pieces)
 * - bK, bQ, bR, bB, bN, bP (black pieces)
 * - Format: SVG or PNG
 */

export interface BoardTheme {
  name: string;
  label: string;
  lightSquare: string;
  darkSquare: string;
  highlightSquare?: string;
  selectedSquare?: string;
}

export interface PieceSet {
  name: string;
  label: string;
  path: string; // Path to pieces folder in public/pieces/
}

/**
 * Available board themes
 * Add your custom themes here
 */
export const BOARD_THEMES: Record<string, BoardTheme> = {
  green: {
    name: "green",
    label: "Green",
    lightSquare: "#eeeed2",
    darkSquare: "#769656",
    highlightSquare: "#baca44",
    selectedSquare: "#7fc97f",
  },
  blue: {
    name: "blue",
    label: "Blue",
    lightSquare: "#dee3e6",
    darkSquare: "#8ca8d8",
    highlightSquare: "#baca44",
    selectedSquare: "#7fc97f",
  },
  purple: {
    name: "purple",
    label: "Purple",
    lightSquare: "#f0e6dd",
    darkSquare: "#b58863",
    highlightSquare: "#baca44",
    selectedSquare: "#7fc97f",
  },
  wood: {
    name: "wood",
    label: "Wood",
    lightSquare: "#f0d9b5",
    darkSquare: "#b58863",
    highlightSquare: "#baca44",
    selectedSquare: "#7fc97f",
  },
  dark: {
    name: "dark",
    label: "Dark",
    lightSquare: "#565656",
    darkSquare: "#303030",
    highlightSquare: "#baca44",
    selectedSquare: "#7fc97f",
  },
  high_contrast: {
    name: "high_contrast",
    label: "High Contrast",
    lightSquare: "#ffffff",
    darkSquare: "#000000",
    highlightSquare: "#ffff00",
    selectedSquare: "#00ff00",
  },
};

/**
 * Available piece sets
 * Add new piece sets by:
 * 1. Creating a folder in client/public/pieces/{name}/
 * 2. Adding piece SVG files (wK, wQ, wR, wB, wN, wP, bK, bQ, bR, bB, bN, bP)
 * 3. Adding an entry here
 */
export const PIECE_SETS: Record<string, PieceSet> = {
  default: {
    name: "default",
    label: "Default",
    path: "/pieces/default",
  },
  wooden: {
    name: "wooden",
    label: "Wooden",
    path: "/pieces/wooden",
  },
  glass: {
    name: "glass",
    label: "Glass",
    path: "/pieces/glass",
  },
  metal: {
    name: "metal",
    label: "Metal",
    path: "/pieces/metal",
  },
  cartoon: {
    name: "cartoon",
    label: "Cartoon",
    path: "/pieces/cartoon",
  },
};

/**
 * Get piece image URL
 * @param pieceset - Name of the piece set
 * @param piece - Piece code (e.g., 'wK', 'bQ')
 * @returns URL to the piece image
 */
export function getPieceImageUrl(pieceset: string, piece: string): string {
  const set = PIECE_SETS[pieceset] || PIECE_SETS.default;
  return `${set.path}/${piece}.svg`;
}

/**
 * Get board theme colors
 * @param theme - Name of the board theme
 * @returns Board theme object
 */
export function getBoardTheme(theme: string): BoardTheme {
  return BOARD_THEMES[theme] || BOARD_THEMES.green;
}

/**
 * Get all available board themes
 */
export function getAllBoardThemes(): BoardTheme[] {
  return Object.values(BOARD_THEMES);
}

/**
 * Get all available piece sets
 */
export function getAllPieceSets(): PieceSet[] {
  return Object.values(PIECE_SETS);
}

/**
 * Custom theme builder
 * Use this to create custom themes programmatically
 */
export function createCustomTheme(
  name: string,
  label: string,
  lightSquare: string,
  darkSquare: string,
  highlightSquare?: string,
  selectedSquare?: string
): BoardTheme {
  return {
    name,
    label,
    lightSquare,
    darkSquare,
    highlightSquare,
    selectedSquare,
  };
}
