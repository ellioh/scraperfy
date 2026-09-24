-- Esquema de scraperfy (MySQL 5.7+ / 8 / MariaDB 10.3+)
-- Se aplica con: npm run db:init  (es idempotente)

CREATE TABLE IF NOT EXISTS posts (
  id                  VARCHAR(32)  NOT NULL,
  slug                VARCHAR(191) NOT NULL,
  titulo              VARCHAR(255) NOT NULL,
  resumen             TEXT         NOT NULL,
  contenido           MEDIUMTEXT   NOT NULL,
  categoria           VARCHAR(100) NOT NULL DEFAULT 'General',
  tags                TEXT         NOT NULL,            -- array JSON serializado
  meta_descripcion    VARCHAR(255) NOT NULL DEFAULT '',
  publicado           TINYINT(1)   NOT NULL DEFAULT 0,
  fecha_publicacion   DATETIME     NOT NULL,
  fecha_actualizacion DATETIME     NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_posts_slug (slug),
  KEY idx_posts_publicado_fecha (publicado, fecha_publicacion),
  KEY idx_posts_categoria (categoria)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS productos (
  id              VARCHAR(32)   NOT NULL,
  nombre          VARCHAR(150)  NOT NULL,
  descripcion     TEXT          NOT NULL,
  precio          DECIMAL(10,2) NOT NULL DEFAULT 0,
  moneda          VARCHAR(10)   NOT NULL DEFAULT 'S/.',
  tipo            ENUM('unico','mensual','cotizar') NOT NULL DEFAULT 'unico',
  etiqueta        VARCHAR(50)   NOT NULL DEFAULT '',
  caracteristicas TEXT          NOT NULL,               -- array JSON serializado
  cta             VARCHAR(100)  NOT NULL DEFAULT 'Solicitar',
  activo          TINYINT(1)    NOT NULL DEFAULT 1,
  orden           INT           NOT NULL DEFAULT 99,
  PRIMARY KEY (id),
  KEY idx_productos_activo_orden (activo, orden)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS solicitudes (
  id           VARCHAR(32)  NOT NULL,
  nombre       VARCHAR(150) NOT NULL,
  email        VARCHAR(190) NOT NULL,
  empresa      VARCHAR(150) NOT NULL DEFAULT '',
  url_objetivo VARCHAR(500) NOT NULL,
  frecuencia   VARCHAR(50)  NOT NULL,
  formato      VARCHAR(50)  NOT NULL,
  descripcion  TEXT         NOT NULL,
  plan         VARCHAR(100) NOT NULL DEFAULT '',
  fecha        DATETIME     NOT NULL,
  leido        TINYINT(1)   NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_solicitudes_fecha (fecha),
  KEY idx_solicitudes_leido (leido)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
