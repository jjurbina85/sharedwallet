# Wallet Preventa Honduras

Seguimiento de cuentas PYME: clientes, tecnologías que tienen, ofertas, agenda con descarga de calendario (.ics) e indicadores. Sitio estático en JavaScript, sin dependencias.

## Publicar en GitHub Pages
1. Crea un repositorio (privado) y sube estos archivos.
2. En Settings > Pages, elige "GitHub Actions" como origen.
3. Cada push a `main` publica la carpeta `web/`.

Importante: GitHub Pages es público aunque el repositorio sea privado (el acceso privado a Pages solo existe en Enterprise Cloud). Por eso el sitio trae solo **datos de demostración** con cuentas ficticias. Los datos reales (facturación de Claro) se cargan desde Ajustes en el navegador de cada persona y no se suben al repositorio. `datos-wallet-claro.json` está en `.gitignore`.

## Cómo se guarda el seguimiento
En el navegador (localStorage). Cada persona tiene su copia. Para pasarla a otra persona: Ajustes > Descargar respaldo / Importar respaldo.

## Ejecutar en local
`go run .` y abre http://localhost:8080 (o abre `web/index.html` con cualquier servidor estático).

## Siguiente fase
API en Go con base de datos (SQLite o Postgres) y login con Microsoft, para que el equipo comparta el seguimiento. `main.go` ya tiene el lugar para las rutas `/api`.
