
-- Ensure search_path is fixed (defence against search_path attacks)
ALTER FUNCTION public.has_role(uuid, public.app_role) SET search_path = public;

-- Revoke public/anon access; keep authenticated so the admin panel can call rpc('has_role')
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
