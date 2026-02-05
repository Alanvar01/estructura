CREATE TABLE `info_proveedor` (
	`id_proveedor` int AUTO_INCREMENT NOT NULL,
	`nombre` varchar(100) NOT NULL,
	`telefono` varchar(20),
	`correo` varchar(100),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `info_proveedor_id_proveedor` PRIMARY KEY(`id_proveedor`)
);
--> statement-breakpoint
CREATE TABLE `maquinas` (
	`id_maquina` int AUTO_INCREMENT NOT NULL,
	`tipo_maquina` varchar(100) NOT NULL,
	`capacidad` varchar(50),
	`transmision` varchar(100),
	`motor` varchar(100),
	`hp` varchar(50),
	`corriente_luz` varchar(50),
	`material_fabricacion` varchar(100),
	`uso` varchar(255),
	`comentario_adicional` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `maquinas_id_maquina` PRIMARY KEY(`id_maquina`)
);
--> statement-breakpoint
CREATE TABLE `productos` (
	`id_producto` int AUTO_INCREMENT NOT NULL,
	`nombre_producto` varchar(150) NOT NULL,
	`total` int DEFAULT 0,
	`unidad_medida` varchar(50),
	`costo_por_unidad` decimal(10,2),
	`clasificacion` varchar(100),
	`precio_publico` decimal(10,2),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `productos_id_producto` PRIMARY KEY(`id_producto`)
);
--> statement-breakpoint
CREATE TABLE `usuarios` (
	`id_usuario` int AUTO_INCREMENT NOT NULL,
	`username` varchar(100) NOT NULL,
	`password` varchar(255) NOT NULL,
	`role` enum('admin','empleado','RH') NOT NULL DEFAULT 'empleado',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `usuarios_id_usuario` PRIMARY KEY(`id_usuario`)
);
