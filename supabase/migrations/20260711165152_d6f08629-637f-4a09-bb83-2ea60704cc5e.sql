DROP POLICY IF EXISTS "Public read published bank_pages" ON public.bank_pages;
CREATE POLICY "Public read published bank_pages" ON public.bank_pages
  FOR SELECT USING (published = true);

GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;