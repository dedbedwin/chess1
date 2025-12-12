/**
 * User preferences management with cookie persistence
 */

export interface UserPreferences {
  playerName: string;
  bulletRating: number | null;
  blitzRating: number | null;
  rapidRating: number | null;
  dailyRating: number | null;
  puzzlesRating: number | null;
  isChessComLinked: boolean;
  language: "en" | "pt";
}

const COOKIE_NAME = "chess_coach_prefs";
const COOKIE_EXPIRY_DAYS = 365;

export class UserPreferencesManager {
  private static readonly DEFAULT_PREFERENCES: UserPreferences = {
    playerName: "Guest",
    bulletRating: null,
    blitzRating: null,
    rapidRating: null,
    dailyRating: null,
    puzzlesRating: null,
    isChessComLinked: false,
    language: "en",
  };

  /**
   * Get all user preferences
   */
  static getPreferences(): UserPreferences {
    const cookie = this.getCookie(COOKIE_NAME);
    if (cookie) {
      try {
        return JSON.parse(decodeURIComponent(cookie));
      } catch (error) {
        console.error("Error parsing preferences cookie:", error);
      }
    }
    return { ...this.DEFAULT_PREFERENCES };
  }

  /**
   * Save user preferences
   */
  static savePreferences(prefs: Partial<UserPreferences>): void {
    const current = this.getPreferences();
    const updated = { ...current, ...prefs };
    const value = encodeURIComponent(JSON.stringify(updated));
    this.setCookie(COOKIE_NAME, value, COOKIE_EXPIRY_DAYS);
  }

  /**
   * Update player name
   */
  static setPlayerName(name: string): void {
    this.savePreferences({ playerName: name });
  }

  /**
   * Update ratings
   */
  static setRatings(ratings: {
    bullet?: number | null;
    blitz?: number | null;
    rapid?: number | null;
    daily?: number | null;
    puzzles?: number | null;
  }): void {
    this.savePreferences({
      bulletRating: ratings.bullet ?? undefined,
      blitzRating: ratings.blitz ?? undefined,
      rapidRating: ratings.rapid ?? undefined,
      dailyRating: ratings.daily ?? undefined,
      puzzlesRating: ratings.puzzles ?? undefined,
    });
  }

  /**
   * Mark Chess.com as linked/unlinked
   */
  static setChessComLinked(linked: boolean): void {
    this.savePreferences({ isChessComLinked: linked });
  }

  /**
   * Set language preference
   */
  static setLanguage(language: "en" | "pt"): void {
    this.savePreferences({ language });
  }

  /**
   * Clear all preferences (logout)
   */
  static clearPreferences(): void {
    this.deleteCookie(COOKIE_NAME);
  }

  /**
   * Get player name with fallback
   */
  static getPlayerName(): string {
    const prefs = this.getPreferences();
    return prefs.playerName || "Guest";
  }

  /**
   * Get language preference
   */
  static getLanguage(): "en" | "pt" {
    const prefs = this.getPreferences();
    return prefs.language || "en";
  }

  /**
   * Cookie helpers
   */
  private static setCookie(name: string, value: string, days: number): void {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
  }

  private static getCookie(name: string): string | null {
    const nameEQ = `${name}=`;
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(nameEQ)) {
        return cookie.substring(nameEQ.length);
      }
    }
    return null;
  }

  private static deleteCookie(name: string): void {
    this.setCookie(name, "", -1);
  }
}
