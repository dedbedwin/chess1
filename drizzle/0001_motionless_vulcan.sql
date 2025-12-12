CREATE TABLE `ai_prompts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`prompt_key` varchar(100) NOT NULL,
	`prompt_text` text NOT NULL,
	`description` text,
	`category` varchar(50) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ai_prompts_id` PRIMARY KEY(`id`),
	CONSTRAINT `ai_prompts_prompt_key_unique` UNIQUE(`prompt_key`)
);
--> statement-breakpoint
CREATE TABLE `coach_chats` (
	`id` int AUTO_INCREMENT NOT NULL,
	`game_id` int NOT NULL,
	`role` enum('user','coach','system') NOT NULL,
	`message` text NOT NULL,
	`move_number` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `coach_chats_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `game_analysis` (
	`id` int AUTO_INCREMENT NOT NULL,
	`game_id` int NOT NULL,
	`move_number` int NOT NULL,
	`move` varchar(20) NOT NULL,
	`evaluation` int,
	`marker` enum('brilliant','excellent','good','book','inaccuracy','mistake','blunder'),
	`best_move` varchar(20),
	`comment` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `game_analysis_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `games` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`opponent_type` enum('bot','coach') NOT NULL,
	`opponent_name` varchar(100) NOT NULL,
	`opponent_rating` int,
	`player_color` enum('white','black') NOT NULL,
	`result` enum('win','loss','draw','ongoing') NOT NULL DEFAULT 'ongoing',
	`pgn` text NOT NULL,
	`fen` text NOT NULL,
	`moves` text NOT NULL,
	`started_at` timestamp NOT NULL DEFAULT (now()),
	`ended_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `games_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`board_theme` varchar(50) NOT NULL DEFAULT 'green',
	`piece_set` varchar(50) NOT NULL DEFAULT 'classic',
	`language` varchar(10) NOT NULL DEFAULT 'en',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_settings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `coach_chats` ADD CONSTRAINT `coach_chats_game_id_games_id_fk` FOREIGN KEY (`game_id`) REFERENCES `games`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `game_analysis` ADD CONSTRAINT `game_analysis_game_id_games_id_fk` FOREIGN KEY (`game_id`) REFERENCES `games`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `games` ADD CONSTRAINT `games_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_settings` ADD CONSTRAINT `user_settings_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;