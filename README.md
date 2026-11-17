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

- Resumen con KPIs, **por jefe**, **por ejecutivo de venta (Dueño Claro)**, olas, rubros, presencia y potencial
- **Próximas reuniones** en Resumen: solo estado **Confirmado** (Bloqueo no aparece ahí)
- Cuentas: filtros jefe / ejecutivo de venta / propuesto por el equipo
- Ficha: asignar **ejecutivo de venta**, capturar **facturación promedio (L)** si falta, señales técnicas (VPN, casa/proyecto, SAP ECC), preguntas y soluciones del catálogo
- **KPIs Claro** en ficha: líneas móviles (cantidad aprox.), servicios fijos (internet / DID / MPLS) y **SVA** (casi todo el catálogo de preventa; foco del equipo)
- Ajustes: **jefe por asesor** (las cuentas del asesor siguen al nuevo jefe en filtros/KPIs)
- Rubros: abajo, **soluciones que aplican** (Claro / Partner / A la medida) según el filtro
- Agenda base + reuniones programadas desde fichas
- Catálogo Claro / Partner / A la medida (`web/data/medida.json`); SAP / migración vía **Global HITSS**
- Hasta **30 versiones locales** del seguimiento en Ajustes (solo este navegador)

## Operación rápida (seguimiento)

1. Cargar cartera en Ajustes (JSON local).
2. En ficha: asignar ejecutivo, marcar hallazgos (VPN, ECC…), revisar preguntas y agregar oferta.
3. Si no hay facturación: guardar promedio en Lps en la ficha.
4. En Ajustes, mover jefe de un asesor si hace falta.
5. Exportar **respaldo de seguimiento** (incluye overrides: ejecutivo, jefe, facturación, señales).

## Ejecutar en local

```bash
go run .
```

Abre http://localhost:8080 (o abre `web/` con cualquier servidor estático).

## Fuera de alcance ahora

Servidor compartido (Docker, API, claves por persona, sync cada 20s) queda para cuando haya VPS. Hoy todo es GitHub Pages + navegador.
