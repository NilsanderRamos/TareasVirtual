# Estructura Tecnica del Blog

Cada articulo nuevo debe apuntar a esta estructura MDX:

- Ubicacion: `src/content/blog/[slug].mdx`
- Frontmatter obligatorio: `title`, `description`, `date`, `author`, `category`, `tags`, `image`, `imageAlt`
- Cuerpo obligatorio: introduccion de 2 a 3 parrafos, seccion principal con H2 y H3, tabla comparativa si aplica, seccion practica, herramienta relacionada, conclusion y FAQ

## Reglas editoriales aplicadas a la estructura

- El `title` debe incluir la keyword principal.
- La `description` funciona como meta description y no debe pasar de 155 caracteres.
- `imageAlt` debe describir la imagen para SEO y accesibilidad.
- La introduccion debe explicar el problema, el contexto y lo que encontrara el lector.
- La seccion principal debe concentrar el contenido mas valioso y profundo.
- La longitud debe responder a la intencion de busqueda: no se fuerza una cifra unica para todos los posts.
- La tabla comparativa es obligatoria en articulos tipo "Mejor X".
- La seccion practica debe dar pasos, ejemplos o tutoriales accionables.
- La herramienta relacionada debe enlazar a una herramienta gratuita de TareasVirtual con CTA claro.
- La conclusion debe cerrar con recomendacion y siguiente paso.
- El FAQ debe incluir entre 3 y 5 preguntas orientadas a featured snippets.

## Estado actual del proyecto

Las dependencias para MDX ya existen en el proyecto, pero el blog actual todavia consume contenido desde modulos TypeScript en `src/content/blog/*.ts`.

La plantilla base para futuros articulos MDX esta en `src/content/blog/_template.mdx`.

Si se decide migrar el blog completo a MDX, habra que adaptar el pipeline de lectura, frontmatter y renderizado antes de reemplazar los posts actuales.