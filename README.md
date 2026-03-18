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
- `src/lib/blog-topics.ts`: hubs estrategicos, taxonomia editorial y relacionados automaticos
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

## Medicion de rendimiento

El proyecto ya puede reportar Core Web Vitals desde cliente cuando GA4 esta activo.

- Se reportan `CLS`, `INP`, `LCP`, `FCP` y `TTFB`.
- Cada metrica se envia como evento `web_vital` y tambien como evento de GA4 con el nombre de la metrica.
- Los exploradores pesados del blog y de herramientas usan `content-visibility: auto` para reducir trabajo inicial de render en secciones por debajo del primer viewport.

Flujo recomendado:

1. define `NEXT_PUBLIC_GA_MEASUREMENT_ID`
2. ejecuta `npm run dev`
3. navega por `/`, `/blog`, `/blog/categorias/finanzas`, `/tools` y un post largo
4. revisa DebugView en GA4
5. complementa con Lighthouse en mobile y desktop

## Variables de entorno utiles

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxxxxxxxx
NEXT_PUBLIC_ADSENSE_SLOT_HOME_INLINE=1234567890
NEXT_PUBLIC_ADSENSE_SLOT_BLOG_INLINE=1234567890
NEXT_PUBLIC_ADSENSE_SLOT_BLOG_POST_INLINE=1234567890
NEXT_PUBLIC_ADSENSE_SLOT_TOOLS_INLINE=1234567890
NEXT_PUBLIC_ADSENSE_SLOT_TOOL_DETAIL_INLINE=1234567890
RESEND_API_KEY=re_xxxxxxxxx
CONTACT_FORM_TO_EMAIL=hola@tareasvirtual.com
CONTACT_FORM_FROM_EMAIL=onboarding@resend.dev
```

Notas:

- si no defines `NEXT_PUBLIC_GA_MEASUREMENT_ID`, no se envian pageviews ni Core Web Vitals a GA4
- si no defines `NEXT_PUBLIC_ADSENSE_CLIENT_ID`, la capa de anuncios y consentimiento no renderiza slots reales

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

Ademas, el sitio ya usa:

- hubs estrategicos por categoria en Finanzas, Productividad, IA y Ecommerce
- relacionados automaticos por categoria, tags compartidos y cluster tematico
- enlazado entre blog y herramientas para reforzar profundidad de sesion

## Flujo editorial y hubs

La arquitectura actual del blog no depende solo de slugs individuales.

- `src/lib/blog-topics.ts` define hubs estrategicos y criterios de pertenencia
- las rutas de hubs viven en `/blog/categorias/[slug]`
- un post puede reforzar mas de un hub si comparte categoria, tags o prioridad editorial
- los relacionados automaticos ponderan categoria, tags compartidos, hub comun y enlaces internos ya existentes

Hubs estrategicos actuales:

1. Finanzas
2. Productividad
3. IA
4. Ecommerce

## Flujo de desarrollo recomendado

1. `npm run lint`
2. `npm run lint:content`
3. `npm run test:smoke`
4. `npm run build`

Para cambios en blog, hubs o SEO:

1. valida metadata y canonical
2. revisa enlazado interno y relacionados automaticos
3. comprueba que el sitemap incluya la ruta nueva si aplica
4. revisa lectura movil y densidad visual

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

- Blog con articulos largos validados y hubs estrategicos por categoria
- Render editorial con portada, fuentes e imagenes inline por seccion
- SEO tecnico base con Open Graph, Twitter cards, sitemap, robots y hubs indexables
- Relacionados automaticos para mejorar profundidad de sesion
- Roadmap documentado para corto, medio y largo plazo
