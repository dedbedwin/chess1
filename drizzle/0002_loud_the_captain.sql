CREATE TABLE `chesscom_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`chesscomUsername` varchar(100) NOT NULL,
	`chesscomUrl` text,
	`blitzRating` int,
	`rapidRating` int,
	`bulletRating` int,
	`dailyRating` int,
	`avatar` text,
	`lastSyncedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `chesscom_profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `chesscom_profiles_userId_unique` UNIQUE(`userId`),
	CONSTRAINT `chesscom_profiles_chesscomUsername_unique` UNIQUE(`chesscomUsername`)
);
--> statement-breakpoint
CREATE TABLE `imported_games` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`chesscomGameId` varchar(100) NOT NULL,
	`pgn` text NOT NULL,
	`fen` text,
	`moves` text NOT NULL,
	`whiteUsername` varchar(100),
	`blackUsername` varchar(100),
	`result` enum('win','loss','draw'),
	`timeControl` varchar(50),
	`playedAt` timestamp,
	`analyzed` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `imported_games_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `opening_books` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(200) NOT NULL,
	`description` text,
	`fileUrl` text NOT NULL,
	`fileSize` int,
	`format` enum('polyglot','ctg','bin') DEFAULT 'polyglot',
	`moves` int,
	`uploadedBy` int,
	`isPublic` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `opening_books_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `puzzle_themes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`icon` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `puzzle_themes_id` PRIMARY KEY(`id`),
	CONSTRAINT `puzzle_themes_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `puzzles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fen` text NOT NULL,
	`moves` text NOT NULL,
	`solution` text NOT NULL,
	`difficulty` enum('beginner','intermediate','advanced','expert') DEFAULT 'intermediate',
	`rating` int,
	`themeId` int,
	`description` text,
	`source` varchar(100),
	`sourceId` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `puzzles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_puzzle_attempts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`puzzleId` int NOT NULL,
	`solved` boolean DEFAULT false,
	`attempts` int DEFAULT 1,
	`timeSpent` int,
	`accuracy` decimal(5,2),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_puzzle_attempts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `puzzles` ADD CONSTRAINT `puzzles_themeId_puzzle_themes_id_fk` FOREIGN KEY (`themeId`) REFERENCES `puzzle_themes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_puzzle_attempts` ADD CONSTRAINT `user_puzzle_attempts_puzzleId_puzzles_id_fk` FOREIGN KEY (`puzzleId`) REFERENCES `puzzles`(`id`) ON DELETE no action ON UPDATE no action;