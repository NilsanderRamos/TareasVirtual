import { BlogPost } from "@/types";

const baseBlogArticleStandards = {
  originalityRequired: true,
  noEmojis: true,
  updatedForYear: 2026,
  minToolLinks: 2,
  minRelatedPostLinks: 2,
} as const;

export const compactBlogArticleStandards = {
  ...baseBlogArticleStandards,
  minWords: 800,
  maxWords: 1200,
} as const;

export const standardBlogArticleStandards = {
  ...baseBlogArticleStandards,
  minWords: 800,
  maxWords: 1300,
} as const;

export const deepGuideBlogArticleStandards = {
  ...baseBlogArticleStandards,
  minWords: 1100,
  maxWords: 1800,
} as const;

export const comparisonBlogArticleStandards = {
  ...baseBlogArticleStandards,
  minWords: 1400,
  maxWords: 2200,
} as const;

export const blogArticleStandards = standardBlogArticleStandards;

export const blogArticleTemplate: BlogPost = {
  title: "[H1] Keyword principal del articulo",
  description:
    "Resumen editorial original del articulo en una o dos frases orientadas a SEO y claridad.",
  date: "2026-03-11",
  slug: "keyword-principal-del-articulo",
  category: "Categoria del blog",
  tags: [
    "keyword principal",
    "keyword secundaria 1",
    "keyword secundaria 2",
    "keyword secundaria 3",
  ],
  image: "/images/blog/nombre-de-la-imagen.jpg",
  imageAlt: "Descripcion clara y especifica de la imagen del articulo",
  author: "Equipo TareasVirtual",
  seo: {
    metaTitle: "Meta title SEO del articulo | TareasVirtual",
    metaDescription:
      "Meta description persuasiva, original y de hasta 155 caracteres con la keyword principal.",
    primaryKeyword: "keyword principal",
    secondaryKeywords: [
      "keyword secundaria 1",
      "keyword secundaria 2",
      "keyword secundaria 3",
    ],
  },
  introduction: [
    "Parrafo 1 de introduccion. Presenta el problema, la intencion de busqueda y el beneficio principal para el lector.",
    "Parrafo 2 de introduccion. Explica el contexto de 2026 y por que este tema importa ahora.",
    "Parrafo 3 opcional. Anticipa que aprendera el lector y como elegir la mejor opcion o estrategia.",
  ],
  sections: [
    {
      heading: "H2 con keyword secundaria principal",
      paragraphs: [
        "Desarrollo original del primer bloque del articulo. Cada parrafo debe aportar valor real, datos o criterio de decision.",
        "Segundo parrafo del mismo bloque con ejemplos, contexto o metodologia clara.",
      ],
    },
    {
      heading: "H2 sobre comparativa, metodo o mejores opciones",
      subheading: "H3 para profundizar en un criterio importante",
      paragraphs: [
        "Explica como comparar opciones, herramientas, precios o resultados de forma practica y actualizada.",
        "Incluye ventajas, limites y escenarios de uso para ayudar a tomar decisiones con criterio.",
      ],
    },
    {
      heading: "H2 final con recomendaciones accionables",
      paragraphs: [
        "Cierra el desarrollo con recomendaciones concretas, errores comunes y mejores practicas aplicables hoy.",
      ],
    },
  ],
  comparisonTable: [
    {
      name: "Opcion 1",
      price: "Precio 2026",
      keyFeatures: ["Funcion clave 1", "Funcion clave 2", "Funcion clave 3"],
      verdict: "Ideal para un tipo de usuario concreto.",
    },
    {
      name: "Opcion 2",
      price: "Precio 2026",
      keyFeatures: ["Funcion clave 1", "Funcion clave 2", "Funcion clave 3"],
      verdict: "Buena alternativa si priorizas simplicidad o costo.",
    },
    {
      name: "Opcion 3",
      price: "Precio 2026",
      keyFeatures: ["Funcion clave 1", "Funcion clave 2", "Funcion clave 3"],
      verdict: "Recomendable para equipos en crecimiento.",
    },
    {
      name: "Opcion 4",
      price: "Precio 2026",
      keyFeatures: ["Funcion clave 1", "Funcion clave 2", "Funcion clave 3"],
      verdict: "Destaca por integraciones o automatizacion.",
    },
    {
      name: "Opcion 5",
      price: "Precio 2026",
      keyFeatures: ["Funcion clave 1", "Funcion clave 2", "Funcion clave 3"],
      verdict: "Solo si necesitas una funcion muy especifica.",
    },
  ],
  keyTakeaways: [
    "Resumen de la idea principal numero uno.",
    "Resumen de la idea principal numero dos.",
    "Resumen de la idea principal numero tres.",
    "Resumen de la idea principal numero cuatro.",
  ],
  internalLinks: [
    {
      title: "Generador de Resumenes",
      href: "/tools#generador-de-resumenes",
      type: "tool",
    },
    {
      title: "Organizador de Tareas",
      href: "/tools#organizador-de-tareas",
      type: "tool",
    },
    {
      title: "Articulo relacionado 1",
      href: "/blog/slug-articulo-relacionado-1",
      type: "post",
    },
    {
      title: "Articulo relacionado 2",
      href: "/blog/slug-articulo-relacionado-2",
      type: "post",
    },
  ],
  externalReferences: [
    {
      title: "Fuente oficial o recurso de apoyo principal",
      href: "https://ejemplo.com/recurso-principal",
      publisher: "Nombre de la fuente",
      description: "Que valida esta fuente dentro del articulo.",
    },
    {
      title: "Segunda fuente complementaria",
      href: "https://ejemplo.com/recurso-secundario",
      publisher: "Nombre de la fuente",
      description: "Dato, metodologia o contexto que amplia el contenido.",
    },
  ],
  referenceImages: [
    {
      src: "/images/blog/referencia-visual-principal.svg",
      alt: "Descripcion concreta de la imagen de referencia.",
      caption: "Que representa esta imagen dentro del articulo.",
      href: "https://ejemplo.com/recurso-principal",
      label: "Visual principal",
      sectionHeading: "H2 con keyword secundaria principal",
    },
    {
      src: "/images/blog/referencia-visual-secundaria.svg",
      alt: "Descripcion concreta de la segunda imagen de referencia.",
      caption: "Como usar esta segunda imagen para reforzar el contenido.",
      href: "https://ejemplo.com/recurso-secundario",
      label: "Visual secundario",
      sectionHeading: "H2 sobre comparativa, metodo o mejores opciones",
    },
    {
      src: "/images/blog/referencia-visual-terciaria.svg",
      alt: "Descripcion concreta de la tercera imagen de referencia.",
      caption: "Que aporta este tercer apoyo visual dentro del articulo.",
      href: "https://ejemplo.com/recurso-terciario",
      label: "Visual terciario",
      sectionHeading: "H2 final con recomendaciones accionables",
    },
  ],
  conclusion: [
    "Primer parrafo de conclusion. Resume la decision o aprendizaje principal sin repetir el articulo entero.",
    "Segundo parrafo de conclusion. Refuerza el siguiente paso recomendado para el lector.",
  ],
  cta: {
    title: "CTA final del articulo",
    description:
      "Invita a usar una herramienta gratuita de TareasVirtual o a leer un articulo relacionado.",
    href: "/tools",
    label: "Probar herramienta gratuita",
  },
  standards: blogArticleStandards,
  faq: [
    {
      question: "Pregunta frecuente 1 con intencion de busqueda real",
      answer:
        "Respuesta clara, especifica y original basada en datos o criterio actualizado para 2026.",
    },
    {
      question: "Pregunta frecuente 2 sobre comparacion, precio o uso",
      answer:
        "Respuesta util que resuelva la duda sin relleno y con enfoque practico.",
    },
    {
      question: "Pregunta frecuente 3 sobre una objecion comun",
      answer:
        "Respuesta orientada a ayudar al lector a tomar una decision mejor informada.",
    },
  ],
};

export const blogArticleChecklist = [
  "Contenido 100% original y sin copiar de otras fuentes.",
  "Sin emojis en titulo, cuerpo, FAQs y CTA.",
  "H1 con keyword principal y subtitulos H2/H3 con keywords secundarias.",
  "Introduccion de 2 a 3 parrafos y conclusion con call to action.",
  "Meta title de maximo 60 caracteres y meta description de maximo 155.",
  "Slug corto y limpio; alt text obligatorio para la imagen.",
  "Minimo 2 enlaces a herramientas gratuitas y 2 enlaces a articulos relacionados.",
  "Minimo 2 referencias externas y 2 imagenes de referencia enlazadas.",
  "Si es un articulo tipo 'Mejor X', incluir tabla comparativa con 5 opciones.",
  "Longitud orientada por intencion: 800-1200 en guias compactas, 800-1300 en articulos estandar, 1100-1800 en guias profundas y 1400-2200 en comparativas.",
  "Cada parrafo debe aportar informacion concreta, contexto o criterio de decision.",
] as const;