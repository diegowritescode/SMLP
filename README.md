# Secure Markdown Reader MVP

Base inicial del MVP privado con arquitectura SaaS minima.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS
- Supabase Auth + PostgreSQL + RLS

## Variables de entorno

Copia `.env.example` a `.env.local` y completa:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` o `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL=http://localhost:3000`

## Desarrollo

```bash
npm install
npm run dev
```

## Scripts

- `npm run validate:content`
- `npm run sync:content`
- `npm run lint`
- `npm run build`

## Estado por fases

- Fase 0: completada.
- Fase 1: completada.
- Fase 2: completada.
- Fase 3: completada.
- Fase 4: completada.
- Fase 5: completada.
- Fase 6: completada.
- Fase 7: completada.

## QA manual minima

1. Sin sesion: `/library` redirige a `/login`.
2. Login Google: autentica y vuelve a `/library`.
3. Reader sin grant: no ve libros, no ve boton admin.
4. Reader en `/admin`: redirige a `/forbidden`.
5. Admin: puede publicar/ocultar libros y capitulos.
6. Admin: puede crear/revocar grants.
7. Reader con grant: ve libro, abre capitulo y puede marcar completado.

## Seguridad checklist

- [x] Markdown no se expone desde `/public`.
- [x] Rutas privadas requieren sesion.
- [x] Rutas admin requieren rol `admin` en DB.
- [x] RLS habilitado en tablas sensibles.
- [x] Service role key solo en servidor.
- [x] Usuarios no pueden gestionar sus propios grants.
- [x] Reader no ve capitulos no publicados.

## Notas tecnicas

- En este proyecto se mantiene `middleware.ts` por estabilidad runtime con Turbopack en entorno local actual.
- El lector usa sanitizacion con `rehype-sanitize`.
- Warning de Turbopack por lectura de archivos markdown desde disco: no bloquea build.
