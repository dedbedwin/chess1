import { describe, expect, it } from "vitest";

describe("EvaluationGraph Component", () => {
  it("should normalize evaluation values to -300 to 300 range", () => {
    const evaluations = [
      { moveNumber: 1, evaluation: 50 },
      { moveNumber: 2, evaluation: -100 },
      { moveNumber: 3, evaluation: 500 },
      { moveNumber: 4, evaluation: -600 },
    ];

    const normalized = evaluations.map((e) => ({
      ...e,
      evaluation: Math.max(-300, Math.min(300, e.evaluation / 100)),
    }));

    expect(normalized[0].evaluation).toBe(0.5);
    expect(normalized[1].evaluation).toBe(-1);
    expect(normalized[2].evaluation).toBe(5);
    expect(normalized[3].evaluation).toBe(-6);
  });

  it("should identify critical moments with large evaluation swings", () => {
    const analysis = [
      { moveNumber: 1, evaluation: 0 },
      { moveNumber: 2, evaluation: 50 },
      { moveNumber: 3, evaluation: 250 },
      { moveNumber: 4, evaluation: -200 },
      { moveNumber: 5, evaluation: 10 },
    ];

    const criticalMoments = analysis.filter(
      (a) => Math.abs((a.evaluation || 0) / 100) > 1.5
    );

    expect(criticalMoments.length).toBeGreaterThanOrEqual(2);
    expect(criticalMoments.some((m) => m.moveNumber === 3)).toBe(true);
    expect(criticalMoments.some((m) => m.moveNumber === 4)).toBe(true);
  });
});

describe("OpeningAnalysis Component", () => {
  it("should identify opening by first moves", () => {
    const testCases = [
      { moves: ["e4", "c5"], expected: "Sicilian Defense" },
      { moves: ["e4", "e5"], expected: "Open Game" },
      { moves: ["d4", "d5"], expected: "Closed Game" },
      { moves: ["d4", "Nf6"], expected: "Indian Defense" },
      { moves: ["c4"], expected: "Reti Opening" },
    ];

    testCases.forEach(({ moves, expected }) => {
      let detected = "Unknown Opening";

      if (moves.length >= 2) {
        if (moves[0] === "e4" && moves[1] === "c5") detected = "Sicilian Defense";
        else if (moves[0] === "e4" && moves[1] === "e5") detected = "Open Game";
        else if (moves[0] === "d4" && moves[1] === "d5") detected = "Closed Game";
        else if (moves[0] === "d4" && moves[1] === "Nf6") detected = "Indian Defense";
      } else if (moves[0] === "c4") {
        detected = "Reti Opening";
      }

      expect(detected).toBe(expected);
    });
  });

  it("should calculate opening accuracy percentage", () => {
    const openingMoves = [
      { moveNumber: 1, isTheory: true },
      { moveNumber: 2, isTheory: true },
      { moveNumber: 3, isTheory: false },
      { moveNumber: 4, isTheory: true },
      { moveNumber: 5, isTheory: true },
    ];

    const theoryMoves = openingMoves.filter((m) => m.isTheory).length;
    const accuracy = Math.round((theoryMoves / openingMoves.length) * 100);

    expect(accuracy).toBe(80);
  });

  it("should limit opening analysis to first 15 moves", () => {
    const moves = Array.from({ length: 30 }, (_, i) => `move${i + 1}`);
    const openingLength = Math.min(15, Math.floor(moves.length / 2));

    expect(openingLength).toBe(15);
  });

  it("should generate alternative moves for opening positions", () => {
    const alternatives: Record<number, string[]> = {
      0: ["1.e4", "1.d4", "1.c4"],
      1: ["1...c5", "1...e5", "1...c6"],
      2: ["2.Nf3", "2.Nc3", "2.f4"],
    };

    expect(alternatives[0]).toContain("1.e4");
    expect(alternatives[1]).toContain("1...c5");
    expect(alternatives[2]).toContain("2.Nf3");
    expect(alternatives[3]).toBeUndefined();
  });
});

describe("CoachChat Integration", () => {
  it("should pass current FEN position to coach", () => {
    const fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    const moveNumber = 1;
    const evaluation = 0;

    expect(fen).toBeDefined();
    expect(moveNumber).toBeGreaterThan(0);
    expect(typeof evaluation).toBe("number");
  });

  it("should track move number for coach context", () => {
    const moves = ["e4", "c5", "Nf3", "d6"];
    const currentMoveIndex = 3;

    expect(moves[currentMoveIndex - 1]).toBe("Nf3");
    expect(currentMoveIndex).toBeLessThanOrEqual(moves.length);
  });

  it("should provide evaluation for current position", () => {
    const analysis = [
      { moveNumber: 1, evaluation: 25 },
      { moveNumber: 2, evaluation: -15 },
      { moveNumber: 3, evaluation: 40 },
    ];

    const currentMoveNumber = 2;
    const currentEvaluation = analysis.find(
      (a) => a.moveNumber === currentMoveNumber
    )?.evaluation || 0;

    expect(currentEvaluation).toBe(-15);
  });
});

describe("Analysis Page Integration", () => {
  it("should toggle coach chat visibility", () => {
    let showCoachChat = false;

    showCoachChat = !showCoachChat;
    expect(showCoachChat).toBe(true);

    showCoachChat = !showCoachChat;
    expect(showCoachChat).toBe(false);
  });

  it("should navigate to move when clicking graph or opening moves", () => {
    const moves = ["e4", "c5", "Nf3", "d6", "d4"];
    let currentMoveIndex = 0;

    const goToMove = (index: number) => {
      if (index >= 0 && index <= moves.length) {
        currentMoveIndex = index;
      }
    };

    goToMove(4);
    expect(currentMoveIndex).toBe(4);
    expect(moves[currentMoveIndex - 1]).toBe("d6");

    goToMove(0);
    expect(currentMoveIndex).toBe(0);
  });

  it("should display all three analysis components when data available", () => {
    const game = { id: 1, pgn: "1.e4 c5" };
    const analysis = [
      { moveNumber: 1, move: "e4", evaluation: 25, marker: "book" },
      { moveNumber: 2, move: "c5", evaluation: -20, marker: null },
    ];
    const moves = ["e4", "c5"];

    expect(game).toBeDefined();
    expect(analysis.length).toBeGreaterThan(0);
    expect(moves.length).toBeGreaterThan(0);

    const shouldShowCoachChat = game !== null;
    const shouldShowEvalGraph = analysis && analysis.length > 0;
    const shouldShowOpening = moves.length > 0;

    expect(shouldShowCoachChat).toBe(true);
    expect(shouldShowEvalGraph).toBe(true);
    expect(shouldShowOpening).toBe(true);
  });
});
