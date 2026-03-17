# TareasVirtual

Sitio editorial construido con Next.js para publicar guias de productividad, estudio, IA, finanzas, ecommerce y herramientas digitales en espanol.

## Objetivo

Construir un activo editorial util, visualmente coherente y preparado para crecer con trafico organico, enlazado interno fuerte y futuras capas de monetizacion.

## Stack

- Next.js 16 con App Router
- React 19
- TypeScript 5
- Tailwind CSS 4
- Contenido tipado en archivos TypeScript

## Estructura del proyecto

- `src/app`: rutas, metadata, sitemap y robots
- `src/components`: layout, UI y bloques del blog
- `src/content/blog`: articulos tipados del blog
- `src/content/tools.ts`: catalogo de herramientas
- `src/lib/blog.ts`: helpers y validacion editorial
- `scripts/validate-blog-content.ts`: auditoria de contenido
- `tests/smoke`: smoke tests del sitio
- `docs/roadmap.md`: plan por fases del proyecto

## Comandos principales

```bash
npm run dev
npm run build
npm run lint
npm run lint:content
npm run test:smoke
```

## Formulario de contacto

La pagina de contacto incluye un formulario validado con una ruta interna de envio. Para activarlo con Resend, define estas variables en tu entorno:

```bash
RESEND_API_KEY=re_xxxxxxxxx
CONTACT_FORM_TO_EMAIL=hola@tareasvirtual.com
CONTACT_FORM_FROM_EMAIL=onboarding@resend.dev
```

Notas:

- `CONTACT_FORM_FROM_EMAIL` puede quedarse en `onboarding@resend.dev` durante las primeras pruebas en Resend.
- Si `RESEND_API_KEY` o `CONTACT_FORM_TO_EMAIL` no existen, el formulario seguira validando pero mostrara un mensaje de configuracion y el correo directo seguira disponible.

## Analitica opcional

Si quieres conectar eventos y pageviews a Google Analytics 4, define esta variable en tu entorno:

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

La capa de eventos ya empuja interacciones a `dataLayer` y usa `gtag` cuando el script de GA4 esta activo.

## Estado local de herramientas

Las herramientas interactivas guardan estado en `localStorage` para mejorar continuidad de uso durante pruebas locales:

- generador de resumenes: texto y modo
- organizador de tareas: titulo, prioridad y lista
- corrector de redaccion: texto en revision
- temporizador pomodoro: segundos restantes y estado del cronometro

## Sistema editorial

Cada post del blog usa un modelo tipado que incluye:

- metadata SEO
- introduccion y secciones
- puntos clave
- CTA final
- FAQ
- enlaces internos
- referencias externas
- imagenes de referencia

El sitio ya cuenta con validacion editorial automatica para mantener un estandar minimo de calidad.

## Validacion de contenido

`npm run lint:content` comprueba:

- metadata SEO
- longitud de introduccion
- estructura minima
- minimo de palabras
- enlaces a herramientas
- enlaces a otros posts
- referencias externas
- imagenes de referencia
- CTA
- FAQ y key takeaways
- tabla comparativa en articulos tipo “Mejor/Mejores”

## Smoke tests

`npm run test:smoke` ejecuta comprobaciones ligeras sobre:

- render basico de rutas principales
- metadata de paginas clave
- rutas estaticas del blog
- generacion de sitemap y robots

## Estado actual

- Blog con 8 articulos largos validados al 100
- Render editorial con portada, fuentes e imagenes inline por seccion
- SEO tecnico base con Open Graph, Twitter cards, sitemap y robots
- Roadmap documentado para corto, medio y largo plazo
