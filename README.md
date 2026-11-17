# Wallet Preventa Honduras

Seguimiento de cuentas PYME: clientes, tecnologías, ofertas, agenda (.ics), presencia digital, potencial de compra e indicadores. Sitio estático en JavaScript, sin dependencias. Se publica con **GitHub Pages**.

## Publicar en GitHub Pages

1. Settings → Pages → origen **GitHub Actions**.
2. Cada push a `main` publica la carpeta `web/` (workflow `.github/workflows/pages.yml`).

**Importante:** Pages es público aunque el repo sea privado. El sitio solo lleva **datos de demostración**. La facturación real de Claro **no** va al repositorio.

## Cómo carga data el equipo

1. Cada persona abre el sitio de Pages.
2. Va a **Ajustes → Cargar datos de cuentas** y sube `datos-wallet-claro.json` (archivo local / canal interno).
3. La cartera queda en el **navegador** (`localStorage`), no en GitHub.
4. Opcional: poner el **nombre** en Ajustes para etiquetar notas, ofertas y reuniones.
5. Para pasar seguimiento a otra persona: **Descargar / Importar respaldo**.

`datos-wallet-claro.json` está en `.gitignore`. Hay copia de seguridad local recomendada fuera del repo.

## Qué incluye

- Resumen con KPIs, olas, rubros, **presencia digital** y **potencial de compra**
- Cuentas con filtros (incluye presencia, oficinas, potencial)
- Ficha: playbook, tecnologías, ofertas, notas, **perfil de presencia**, **programar reunión** (hora/duración + .ics + aviso de choques)
- Agenda base + reuniones programadas desde fichas
- Catálogo Claro / Partner / A la medida (`web/data/medida.json`)
- Hasta **30 versiones locales** del seguimiento en Ajustes (solo este navegador)

## Ejecutar en local

```bash
go run .
```

Abre http://localhost:8080 (o abre `web/` con cualquier servidor estático).

## Fuera de alcance ahora

Servidor compartido (Docker, API, claves por persona, sync cada 20s) queda para cuando haya VPS. Hoy todo es GitHub Pages + navegador.
