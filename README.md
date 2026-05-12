# Secure Markdown Reader MVP

Base inicial del MVP privado con arquitectura SaaS minima.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS
- Supabase Auth + PostgreSQL + RLS

## Rutas base

- `/login`
- `/library`
- `/books/[bookSlug]`
- `/books/[bookSlug]/chapters/[chapterSlug]`
- `/progress`
- `/settings`
- `/admin`

## Variables de entorno

Copia `.env.example` a `.env.local` y completa:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` o `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Desarrollo

```bash
npm install
npm run dev
```

## Estado implementado

- Fase 0: estructura de contenido.
- Fase 1: setup tecnico y rutas protegidas.
- Fase 2: DB + RLS + policies.
- Fase 3: sync-content real a Supabase.
- Fase 4: biblioteca server-side con filtros.
- Fase 5: lector markdown seguro + progreso.
- Fase 6: admin MVP (libros, capitulos, usuarios, grants).

## Pruebas manuales recomendadas

1. Usuario sin sesion
- Abrir `/library` debe redirigir a `/login`.

2. Usuario reader sin grants
- Login exitoso.
- `/library` carga sin libros o sin libros restringidos.
- `/admin` debe devolver 403.

3. Usuario reader con grant activo
- En `/admin/users`, crear grant manual para un libro publicado.
- Reader entra a `/library` y ve el libro.
- Puede abrir `/books/<bookSlug>` y `/books/<bookSlug>/chapters/<chapterSlug>`.
- Puede marcar capitulo como completado.

4. Usuario admin
- `/admin` accesible.
- En `/admin/books`, toggles de publicar/ocultar funcionan.
- En `/admin/users`, crear y revocar grants funciona.

## Notas

- Contenido markdown privado en `content/books` (nunca en `/public`).
- Acceso a contenido validado en servidor.
- Advertencia actual de Next 16: `middleware.ts` migrara a `proxy.ts` en una iteracion futura.
