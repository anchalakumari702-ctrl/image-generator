CREATE TABLE `generatedImages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`prompt` text NOT NULL,
	`style` varchar(64) NOT NULL DEFAULT 'realistic',
	`aspectRatio` varchar(16) NOT NULL DEFAULT '1:1',
	`imageUrl` text NOT NULL,
	`imageKey` varchar(255) NOT NULL,
	`generationId` varchar(255) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `generatedImages_id` PRIMARY KEY(`id`),
	CONSTRAINT `generatedImages_generationId_unique` UNIQUE(`generationId`)
);
--> statement-breakpoint
CREATE TABLE `imageGenerations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`prompt` text NOT NULL,
	`style` varchar(64) NOT NULL,
	`aspectRatio` varchar(16) NOT NULL,
	`imageCount` int NOT NULL DEFAULT 1,
	`status` enum('pending','completed','failed') NOT NULL DEFAULT 'pending',
	`errorMessage` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `imageGenerations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `generatedImages` ADD CONSTRAINT `generatedImages_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `imageGenerations` ADD CONSTRAINT `imageGenerations_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;