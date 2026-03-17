# Flujo De Calidad Editorial

## Objetivo

Cada post debe salir listo para competir: util, bien estructurado, alineado con SEO, con intencion comercial clara y con control de calidad repetible.

## Flujo obligatorio

1. Elegir keyword principal y definir la intencion de busqueda antes de redactar.
2. Verificar fuentes oficiales y datos actualizados para el ano objetivo.
3. Escribir introduccion de 2-3 parrafos con contexto real, no relleno.
4. Desarrollar el cuerpo en secciones claras con H2/H3 y criterio practico.
5. Incluir enlaces internos a 2 herramientas y 2 posts relacionados.
6. Cerrar con conclusion, CTA y FAQ util.
7. Ejecutar la validacion automatica antes de considerar el post publicable.

## Comando de control

```bash
npm run lint:content
```

## Criterios de salida

- Sin errores en el validador.
- Meta title y meta description dentro de longitud.
- Longitud ajustada a la intencion del articulo. Como referencia editorial:
- 800 a 1200 palabras para guias rapidas o temas tacticos.
- 800 a 1300 palabras para articulos estandar.
- 1100 a 1800 palabras para guias profundas.
- 1400 a 2200 palabras para comparativas y temas de alta complejidad.
- Tabla comparativa obligatoria en posts de tipo "Mejor" o "Mejores".
- Sin emojis.
- CTA final presente.

## Regla practica

Si el contenido no puede pasar el comando y una revision humana breve, no se publica.