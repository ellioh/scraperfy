# Despliegue de scraperfy en una VPS

Dos caminos. **A (Docker)** es el recomendado: un solo comando levanta MySQL, crea las tablas y arranca la app.

Requisitos comunes: una VPS Linux (Ubuntu 22.04/24.04), 1 GB de RAM como minimo (2 GB recomendado), y el dominio apuntando a la IP de la VPS (registro `A` para `scraperfy.com` y `www`).

> **HTTPS es obligatorio para el admin.** En produccion la cookie de sesion se marca `Secure`: por `http://` el login parece funcionar pero el navegador descarta la cookie. Usa el Caddy incluido (HTTPS automatico) o tu propio nginx con certificado.

---

## A) Docker Compose (recomendado)

### 1. Preparar la VPS

```bash
# Docker + plugin compose (si no lo tienes)
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER   # cerrar sesion y volver a entrar

# Firewall: solo SSH + web. MySQL NO se expone nunca.
sudo ufw allow OpenSSH && sudo ufw allow 80,443/tcp && sudo ufw enable
```

### 2. Traer el codigo y configurar

```bash
git clone https://github.com/ellioh/scraperfy.git /opt/scraperfy
cd /opt/scraperfy
cp .env.vps.example .env
nano .env
```

Completa como minimo `ADMIN_PASSWORD`, `ADMIN_TOKEN_SECRET`, `DB_ROOT_PASSWORD` y `DB_PASSWORD`.
Genera los secretos con `openssl rand -base64 32`. Compose se niega a arrancar si falta alguno.

### 3. Levantar

```bash
# Con HTTPS automatico (Caddy, requiere DNS ya apuntando a la VPS):
docker compose --profile proxy up -d --build

# O sin Caddy, si ya tienes nginx u otro proxy (la app queda en 127.0.0.1:3000):
docker compose up -d --build
```

Orden de arranque (lo gestiona compose): `mysql` (espera a estar sano) -> `migrate` (crea tablas y siembra los datos iniciales; es idempotente) -> `app`.

Verificar:

```bash
docker compose ps
docker compose logs -f app
curl -I http://127.0.0.1:3000
```

Panel admin: `https://scraperfy.com/admin`.

### 4. Actualizar a una version nueva

```bash
cd /opt/scraperfy && git pull && docker compose --profile proxy up -d --build
```

`migrate` corre en cada `up` y no toca datos existentes (solo siembra si las tablas estan vacias).
Si un cambio futuro modifica el esquema, hay que aplicarlo a mano sobre la base existente (`db/schema.sql` usa `CREATE TABLE IF NOT EXISTS`, no altera tablas ya creadas).

### nginx en vez de Caddy

Levanta sin `--profile proxy` y usa algo asi (con certbot para el certificado):

```nginx
server {
    server_name scraperfy.com www.scraperfy.com;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

---

## Llevar los datos de tu MySQL local a la VPS

`db:init` ya siembra los 3 posts y 4 servicios iniciales. Si en local creaste o editaste contenido desde el admin y quieres llevarlo:

```bash
# En tu PC (Windows, MariaDB de XAMPP):
C:\xampp8.2.12\mysql\bin\mysqldump.exe -u root --default-character-set=utf8mb4 scraperfy > scraperfy.sql

# Copiar a la VPS y cargar:
scp scraperfy.sql usuario@IP_VPS:/opt/scraperfy/
ssh usuario@IP_VPS
cd /opt/scraperfy
docker compose exec -T mysql sh -c 'mysql -u root -p"$MYSQL_ROOT_PASSWORD" --default-character-set=utf8mb4 scraperfy' < scraperfy.sql
```

Esto **reemplaza** las tablas de la VPS por las del dump. Hazlo antes de recibir solicitudes reales, o exporta primero un respaldo (ver abajo).

---

## Respaldos

```bash
# Manual
docker compose exec -T mysql sh -c 'mysqldump -u root -p"$MYSQL_ROOT_PASSWORD" --single-transaction scraperfy' | gzip > backup-$(date +%F).sql.gz

# Diario a las 3 am, conservando 14 dias (crontab -e)
0 3 * * * cd /opt/scraperfy && docker compose exec -T mysql sh -c 'mysqldump -u root -p"$MYSQL_ROOT_PASSWORD" --single-transaction scraperfy' | gzip > /var/backups/scraperfy-$(date +\%F).sql.gz && find /var/backups -name 'scraperfy-*.sql.gz' -mtime +14 -delete
```

Copia los respaldos fuera de la VPS (otro servidor, S3, etc.): un respaldo en el mismo disco no protege si la VPS se pierde.

Restaurar: `gunzip -c backup.sql.gz | docker compose exec -T mysql sh -c 'mysql -u root -p"$MYSQL_ROOT_PASSWORD" scraperfy'`

---

## B) Sin Docker (Node + MySQL instalados en la VPS)

```bash
# Node 22 y MySQL
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - && sudo apt install -y nodejs mysql-server nginx
sudo npm i -g pm2

# Base y usuario dedicados
sudo mysql <<'SQL'
CREATE DATABASE scraperfy CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'scraperfy'@'localhost' IDENTIFIED BY 'CAMBIAR_PASSWORD';
GRANT ALL ON scraperfy.* TO 'scraperfy'@'localhost';
SQL

git clone https://github.com/ellioh/scraperfy.git /opt/scraperfy && cd /opt/scraperfy
cp .env.example .env.local && nano .env.local     # ADMIN_*, DB_HOST=127.0.0.1, DB_USER, DB_PASSWORD, DB_NAME
npm ci
npm run db:init                                    # tablas + semilla
npm run build
cp -r .next/static .next/standalone/.next/static && cp -r public .next/standalone/public

cd .next/standalone
NODE_ENV=production PORT=3000 HOSTNAME=127.0.0.1 pm2 start server.js --name scraperfy --node-args="--env-file=/opt/scraperfy/.env.local"
pm2 save && pm2 startup
```

Luego nginx + certbot como en la seccion anterior. Para actualizar: `git pull && npm ci && npm run build`, repetir los dos `cp` y `pm2 restart scraperfy`.

---

## n8n

Si n8n corre en la misma VPS (otro contenedor/compose), usa su URL interna o publica en `N8N_WEBHOOK_URL`, p. ej. `https://n8n.tudominio.com/webhook/scraperfy-solicitud`.
En el nodo **Webhook** de n8n: metodo `POST`, y en *Authentication* elige *Header Auth* con nombre `X-Scraperfy-Secret` y el mismo valor que `N8N_WEBHOOK_SECRET`.

El cuerpo que recibe:

```json
{
  "evento": "solicitud.nueva",
  "solicitud": {
    "id": "1790209596690", "nombre": "...", "email": "...", "empresa": "...",
    "url_objetivo": "https://...", "frecuencia": "diario", "formato": "JSON",
    "descripcion": "...", "plan": "Pro", "fecha": "2026-09-24T00:26:36.690Z", "leido": false
  }
}
```

Si n8n esta caido, la solicitud igual se guarda en MySQL (queda registrado el error en los logs de la app).

---

## Problemas frecuentes

| Sintoma | Causa / solucion |
|---|---|
| Login "correcto" pero vuelve al formulario | Estas entrando por `http://`: la cookie `Secure` se descarta. Usa HTTPS (o un tunel: `ssh -L 3000:127.0.0.1:3000 usuario@IP` y abre `http://localhost:3000`). |
| `docker compose` dice "define DB_PASSWORD en .env" | Falta completar `.env` (copiado de `.env.vps.example`). |
| La app da 500 en home/blog/servicios | La BD no esta accesible: `docker compose logs migrate app`. Revisa `DB_*`. |
| `migrate` avisa "No se pudo crear la base" | Normal: el usuario no tiene `CREATE DATABASE`, pero la base ya existe (la creo el contenedor). |
| Cambiaste `DB_PASSWORD` y ya no conecta | MySQL fija las credenciales solo la primera vez que crea el volumen. Cambialas dentro de MySQL (`ALTER USER`) o recrea el volumen (**borra los datos**). |
