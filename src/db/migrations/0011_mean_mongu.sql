ALTER TABLE `pagos` ADD `nombre` text NOT NULL;--> statement-breakpoint
ALTER TABLE `pagos` ADD `apellido` text NOT NULL;--> statement-breakpoint
ALTER TABLE `pagos` ADD `email` text NOT NULL;--> statement-breakpoint
ALTER TABLE `pagos` ADD `subtotal` real NOT NULL;--> statement-breakpoint
ALTER TABLE `pagos` ADD `envio` real DEFAULT 0;--> statement-breakpoint
ALTER TABLE `pagos` ADD `numero_tarjeta` text(19);--> statement-breakpoint
ALTER TABLE `pagos` ADD `fecha_vencimiento` text(5);--> statement-breakpoint
ALTER TABLE `pagos` ADD `cvv` text(4);--> statement-breakpoint
ALTER TABLE `pagos` ADD `nombre_tarjeta` text;--> statement-breakpoint
ALTER TABLE `pagos` ADD `direccion` text NOT NULL;--> statement-breakpoint
ALTER TABLE `pagos` ADD `ciudad` text NOT NULL;--> statement-breakpoint
ALTER TABLE `pagos` ADD `codigo_postal` text NOT NULL;--> statement-breakpoint
ALTER TABLE `pagos` ADD `pais` text NOT NULL;--> statement-breakpoint
ALTER TABLE `pagos` ADD `terminos_aceptados` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `pagos` ADD `ip` text;--> statement-breakpoint
ALTER TABLE `pagos` ADD `user_agent` text;--> statement-breakpoint
ALTER TABLE `pagos` ADD `fecha_actualizacion` text DEFAULT 'CURRENT_TIMESTAMP';