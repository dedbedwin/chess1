import { Chess } from "chess.js";

export interface WeakArea {
  name: string;
  description: string;
  frequency: number;
  puzzleThemes: string[];
  recommendedDifficulty: number;
}

export interface TrainingPlan {
  weakAreas: WeakArea[];
  recommendedPuzzles: string[];
  focusAreas: string[];
  estimatedTrainingTime: number;
  priority: "high" | "medium" | "low";
}

export class PersonalizedTrainingSystem {
  /**
   * Analyze game for weak areas
   */
  static analyzeGameWeaknesses(pgn: string, moveAnalysis: any[]): WeakArea[] {
    const weakAreas: WeakArea[] = [];
    const game = new Chess();
    game.loadPgn(pgn);

    const weaknessMap = new Map<string, number>();

    // Analyze each move
    moveAnalysis.forEach((analysis, index) => {
      if (analysis.marker === "blunder" || analysis.marker === "mistake") {
        const move = analysis.move;
        const position = analysis.position;

        // Identify weakness type
        const weakness = this.identifyWeakness(position, move);
        if (weakness) {
          weaknessMap.set(weakness, (weaknessMap.get(weakness) || 0) + 1);
        }
      }
    });

    // Convert to WeakArea objects
    weaknessMap.forEach((frequency, weakness) => {
      const area = this.mapWeaknessToTraining(weakness, frequency);
      if (area) {
        weakAreas.push(area);
      }
    });

    return weakAreas.sort((a, b) => b.frequency - a.frequency);
  }

  /**
   * Identify weakness type from position and move
   */
  private static identifyWeakness(position: string, move: string): string | null {
    // Analyze FEN position to identify weakness
    // This is a simplified version - in production, use deeper analysis

    const weaknessTypes = [
      "tactical_blindness",
      "opening_knowledge",
      "endgame_technique",
      "time_management",
      "piece_coordination",
      "pawn_structure",
      "king_safety",
      "position_evaluation",
    ];

    // Return a random weakness for demonstration
    return weaknessTypes[Math.floor(Math.random() * weaknessTypes.length)];
  }

  /**
   * Map weakness to training area
   */
  private static mapWeaknessToTraining(weakness: string, frequency: number): WeakArea | null {
    const trainingMap: Record<string, WeakArea> = {
      tactical_blindness: {
        name: "Tactical Blindness",
        description: "Missing tactical opportunities and threats",
        frequency,
        puzzleThemes: ["tactics", "forks", "pins", "skewers"],
        recommendedDifficulty: 1200,
      },
      opening_knowledge: {
        name: "Opening Knowledge",
        description: "Weak opening principles and preparation",
        frequency,
        puzzleThemes: ["opening", "development", "center_control"],
        recommendedDifficulty: 1000,
      },
      endgame_technique: {
        name: "Endgame Technique",
        description: "Poor endgame conversion and technique",
        frequency,
        puzzleThemes: ["endgame", "king_and_pawn", "basic_mates"],
        recommendedDifficulty: 1500,
      },
      time_management: {
        name: "Time Management",
        description: "Poor time usage leading to blunders",
        frequency,
        puzzleThemes: ["tactics", "calculation"],
        recommendedDifficulty: 1400,
      },
      piece_coordination: {
        name: "Piece Coordination",
        description: "Difficulty coordinating pieces effectively",
        frequency,
        puzzleThemes: ["tactics", "combination"],
        recommendedDifficulty: 1300,
      },
      pawn_structure: {
        name: "Pawn Structure",
        description: "Weak understanding of pawn structures",
        frequency,
        puzzleThemes: ["strategy", "pawn_endgame"],
        recommendedDifficulty: 1100,
      },
      king_safety: {
        name: "King Safety",
        description: "Exposing king to unnecessary risks",
        frequency,
        puzzleThemes: ["attack", "defense", "king_safety"],
        recommendedDifficulty: 1200,
      },
      position_evaluation: {
        name: "Position Evaluation",
        description: "Difficulty evaluating positions accurately",
        frequency,
        puzzleThemes: ["strategy", "calculation"],
        recommendedDifficulty: 1300,
      },
    };

    return trainingMap[weakness] || null;
  }

  /**
   * Generate personalized training plan
   */
  static generateTrainingPlan(weakAreas: WeakArea[]): TrainingPlan {
    const topWeakAreas = weakAreas.slice(0, 3);
    const recommendedPuzzles: string[] = [];
    const focusAreas: string[] = [];

    topWeakAreas.forEach((area) => {
      focusAreas.push(area.name);
      area.puzzleThemes.forEach((theme) => {
        recommendedPuzzles.push(theme);
      });
    });

    // Calculate training time (in minutes)
    const estimatedTrainingTime = topWeakAreas.reduce((sum, area) => {
      return sum + area.frequency * 5; // 5 minutes per weakness occurrence
    }, 0);

    const priority =
      topWeakAreas[0]?.frequency > 5 ? "high" : topWeakAreas[0]?.frequency > 2 ? "medium" : "low";

    return {
      weakAreas: topWeakAreas,
      recommendedPuzzles: Array.from(new Set(recommendedPuzzles)),
      focusAreas,
      estimatedTrainingTime,
      priority,
    };
  }

  /**
   * Get training recommendations
   */
  static getTrainingRecommendations(trainingPlan: TrainingPlan): string[] {
    const recommendations: string[] = [];

    trainingPlan.weakAreas.forEach((area) => {
      if (area.frequency > 5) {
        const themes = area.puzzleThemes.join(", ");
        recommendations.push(
          `Focus on ${area.name}: ${area.description}. Try ${themes} puzzles.`
        );
      }
    });

    if (trainingPlan.estimatedTrainingTime > 0) {
      recommendations.push(
        `Recommended training time: ${Math.round(trainingPlan.estimatedTrainingTime / 60)} hours`
      );
    }

    recommendations.push(`Priority level: ${trainingPlan.priority.toUpperCase()}`);

    return recommendations;
  }
}
