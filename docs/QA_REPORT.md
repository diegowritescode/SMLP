# QA Report MVP - Secure Markdown Reader

Fecha: 2026-05-12
Entorno: local (`http://localhost:3000`) + Supabase proyecto `obgoqeiqnskqsajcghjs`
Branch: `develop`

## Alcance probado

- Auth Google con Supabase.
- Autorizacion por rol (`admin`, `reader`).
- Biblioteca con restricciones por `access_grants`.
- Lector markdown seguro + progreso.
- Panel admin (publish/unpublish, grants).

## Casos de prueba

1. Sin sesion en `/library`
- Resultado esperado: redireccion a `/login`.
- Resultado: OK.

2. Login Google
- Resultado esperado: autenticacion y retorno a `/library`.
- Resultado: OK.

3. Reader sin grants
- Resultado esperado: no ver libros en biblioteca.
- Resultado: OK.

4. Reader sin rol admin
- Resultado esperado: acceso a `/admin` bloqueado y redireccion a `/forbidden`.
- Resultado: OK.

5. Admin publica/oculta libro y capitulo
- Resultado esperado: cambios persistidos en DB y reflejados en UI.
- Resultado: OK.

6. Admin crea y revoca grant
- Resultado esperado: `access_grants` actualizado y feedback visual en UI.
- Resultado: OK.

7. Reader con grant activo
- Resultado esperado: libro visible, acceso a capitulo habilitado.
- Resultado: OK.

8. Reader marca capitulo completado
- Resultado esperado: `reading_progress` upsert con `is_completed = true`.
- Resultado: OK.

9. Auto tracking por visita de capitulo
- Resultado esperado: al abrir capitulo se registra progreso inicial (en curso).
- Resultado: OK.

10. Auto-completado al pasar al siguiente capitulo
- Resultado esperado: al presionar "Siguiente capitulo" se marca el actual como completado.
- Resultado: OK.

11. Estado visible por capitulo en vista de libro
- Resultado esperado: cada capitulo muestra `Pendiente`, `En curso` o `Completado`.
- Resultado: OK.

12. Seguridad de contenido
- Resultado esperado: markdown no expuesto desde `/public`.
- Resultado: OK.

## Riesgos/reservas abiertas

- Turbopack emite warning no bloqueante por lectura de markdown desde filesystem.
- Se recomienda validar smoke test adicional en deploy staging (Vercel) antes de produccion.
