-- Roles validos en check constraint de profiles.role: admin, reader
-- Seed opcional: promover administradores por email.
-- Reemplaza con tus correos reales antes de ejecutar en produccion.

update public.profiles
set role = 'admin', updated_at = now()
where lower(email) in (
  'admin@example.com'
);
