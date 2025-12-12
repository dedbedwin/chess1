/**
 * AI Prompts Configuration
 * 
 * This file contains all AI prompts used throughout the chess coaching application.
 * You can edit these prompts to customize the AI coach's personality and behavior.
 */

export interface BotPersonality {
  rating: number;
  name: string;
  greetings: string[];
  winPhrases: string[];
  lossPhrases: string[];
  drawPhrases: string[];
}

export const BOT_PERSONALITIES: BotPersonality[] = [
  {
    rating: 400,
    name: "Novice Nancy",
    greetings: [
      "Hi! I'm still learning chess. Let's have fun!",
      "Hello! I'm a beginner just like you might be!",
      "Hey there! Ready for a friendly game?",
    ],
    winPhrases: [
      "Wow, I actually won! Great game!",
      "That was fun! Thanks for playing with me!",
      "I got lucky there! Want to play again?",
    ],
    lossPhrases: [
      "You played really well! I learned something!",
      "Nice game! You're better than me!",
      "Great moves! Maybe next time I'll do better!",
    ],
    drawPhrases: [
      "A draw! We're evenly matched!",
      "Good game! That was close!",
    ],
  },
  {
    rating: 800,
    name: "Casual Chris",
    greetings: [
      "Hey! Ready for a casual game?",
      "Hi there! Let's play some chess!",
      "Hello! I'm here for a friendly match!",
    ],
    winPhrases: [
      "Good game! That was fun!",
      "Nice try! Want a rematch?",
      "GG! You played well!",
    ],
    lossPhrases: [
      "Well played! You got me there!",
      "Nice game! You were too strong!",
      "Good job! I need to practice more!",
    ],
    drawPhrases: [
      "A fair draw! Well played!",
      "Good game! That was balanced!",
    ],
  },
  {
    rating: 1200,
    name: "Intermediate Ivan",
    greetings: [
      "Hello! Let's have an interesting game!",
      "Greetings! Ready for a tactical battle?",
      "Hi! I hope you're ready for a challenge!",
    ],
    winPhrases: [
      "Good game! You put up a good fight!",
      "Well played! That was competitive!",
      "GG! You made me work for it!",
    ],
    lossPhrases: [
      "Excellent play! You outplayed me!",
      "Well done! Your tactics were superior!",
      "Great game! I'll study this one!",
    ],
    drawPhrases: [
      "A well-fought draw!",
      "Good game! Neither of us could break through!",
    ],
  },
  {
    rating: 1600,
    name: "Advanced Alex",
    greetings: [
      "Greetings! Prepare for a serious game!",
      "Hello! I hope you're ready for a challenge!",
      "Welcome! Let's see what you've got!",
    ],
    winPhrases: [
      "Good game! You showed good resistance!",
      "Well played! That was a tough match!",
      "GG! You have potential!",
    ],
    lossPhrases: [
      "Impressive! Your play was very strong!",
      "Well done! You played at a high level!",
      "Excellent game! You deserved that win!",
    ],
    drawPhrases: [
      "A hard-fought draw! Well played!",
      "Good game! That was evenly matched!",
    ],
  },
  {
    rating: 2000,
    name: "Expert Emma",
    greetings: [
      "Hello! Ready for a high-level game?",
      "Greetings! Let's have a serious match!",
      "Welcome! Show me your best chess!",
    ],
    winPhrases: [
      "Good game! You played well!",
      "Well fought! That was competitive!",
      "GG! You're a strong player!",
    ],
    lossPhrases: [
      "Excellent! Your play was outstanding!",
      "Very well played! I'm impressed!",
      "Great game! You played brilliantly!",
    ],
    drawPhrases: [
      "A well-deserved draw!",
      "Good game! That was intense!",
    ],
  },
  {
    rating: 2400,
    name: "Master Magnus",
    greetings: [
      "Greetings! Let's play at the highest level!",
      "Hello! Prepare for a master-level game!",
      "Welcome! This will be interesting!",
    ],
    winPhrases: [
      "Good game! You played admirably!",
      "Well played! That was a strong effort!",
      "GG! You're a formidable opponent!",
    ],
    lossPhrases: [
      "Brilliant! Your play was exceptional!",
      "Outstanding! You played like a master!",
      "Excellent game! You outplayed me completely!",
    ],
    drawPhrases: [
      "A masterful draw! Well played!",
      "Good game! That was high-level chess!",
    ],
  },
  {
    rating: 2800,
    name: "Grandmaster Gary",
    greetings: [
      "Greetings! Let's see if you can challenge me!",
      "Hello! Prepare for grandmaster-level play!",
      "Welcome! This will be a true test!",
    ],
    winPhrases: [
      "Good game! You showed great skill!",
      "Well played! That was impressive!",
      "GG! You're an excellent player!",
    ],
    lossPhrases: [
      "Incredible! Your play was world-class!",
      "Magnificent! You played perfectly!",
      "Exceptional game! You've mastered chess!",
    ],
    drawPhrases: [
      "A grandmaster-level draw! Impressive!",
      "Excellent game! That was world-class!",
    ],
  },
];

export interface CoachPrompt {
  key: string;
  text: string;
  description: string;
  category: string;
}

export const COACH_PROMPTS: CoachPrompt[] = [
  {
    key: "system_coach",
    text: `You are an expert chess coach helping a student improve their game. You combine deep chess knowledge with encouraging, conversational teaching. 

Your role:
- Analyze positions using the Stockfish evaluation provided
- Ask thought-provoking questions to help the student think
- Provide hints without giving away the answer immediately
- Celebrate good moves and gently correct mistakes
- Explain tactical and strategic concepts clearly
- Use natural, friendly language

When the student makes a move:
- If it's excellent: Praise it and ask them to explain their thinking
- If it's good: Acknowledge it and point out what made it strong
- If it's inaccurate/mistake/blunder: Ask questions to help them see the issue
- Always relate to chess principles (development, king safety, material, etc.)

Keep responses concise (2-3 sentences) during the game. Be encouraging and educational.`,
    description: "Main system prompt for the chess coach",
    category: "system",
  },
  {
    key: "move_brilliant",
    text: "Brilliant move! That was an exceptional find! Can you explain what you saw in this position?",
    description: "Response when player makes a brilliant move",
    category: "move_feedback",
  },
  {
    key: "move_excellent",
    text: "Excellent move! You found the best continuation. What was your main idea here?",
    description: "Response when player makes an excellent move",
    category: "move_feedback",
  },
  {
    key: "move_good",
    text: "Good move! That's a solid choice. Do you see how this improves your position?",
    description: "Response when player makes a good move",
    category: "move_feedback",
  },
  {
    key: "move_inaccuracy",
    text: "That's playable, but there might be something better. Take another look at the position - what are your most active pieces?",
    description: "Response when player makes an inaccuracy",
    category: "move_feedback",
  },
  {
    key: "move_mistake",
    text: "Hmm, that move gives away some advantage. Can you spot what your opponent can do now?",
    description: "Response when player makes a mistake",
    category: "move_feedback",
  },
  {
    key: "move_blunder",
    text: "Oops! That move loses material or position. Look carefully - what did you miss?",
    description: "Response when player makes a blunder",
    category: "move_feedback",
  },
  {
    key: "game_start",
    text: "Welcome! I'm your chess coach. I'll help you analyze your moves and improve your game. Let's play! What opening are you thinking of?",
    description: "Greeting at the start of a coaching game",
    category: "game_flow",
  },
  {
    key: "game_end_win",
    text: "Congratulations on the win! Let's review the game together. What do you think were the key moments?",
    description: "Message when player wins",
    category: "game_flow",
  },
  {
    key: "game_end_loss",
    text: "Good effort! Every loss is a learning opportunity. Let's analyze where things went wrong and how to improve.",
    description: "Message when player loses",
    category: "game_flow",
  },
  {
    key: "game_end_draw",
    text: "A draw! That shows good defensive skills. Let's review the critical moments together.",
    description: "Message when game ends in a draw",
    category: "game_flow",
  },
  {
    key: "analysis_intro",
    text: "Let's analyze your game! I'll go through each move and highlight the key moments. Pay attention to the critical positions where the game could have gone differently.",
    description: "Introduction to post-game analysis",
    category: "analysis",
  },
  {
    key: "hint_request",
    text: "Good question! Instead of telling you the move, let me ask: {hint_question}. Think about that and see what you find!",
    description: "Template for providing hints (replace {hint_question} with specific question)",
    category: "interaction",
  },
];

export function getRandomPhrase(phrases: string[]): string {
  return phrases[Math.floor(Math.random() * phrases.length)];
}

export function getBotByRating(rating: number): BotPersonality | undefined {
  return BOT_PERSONALITIES.find((bot) => bot.rating === rating);
}

export function getCoachPrompt(key: string): CoachPrompt | undefined {
  return COACH_PROMPTS.find((prompt) => prompt.key === key);
}
