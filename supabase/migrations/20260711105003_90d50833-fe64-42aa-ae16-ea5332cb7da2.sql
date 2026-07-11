
-- Ensure RLS is on
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Drop existing policies so we can redefine tightly
DROP POLICY IF EXISTS "Anyone can submit a review" ON public.reviews;
DROP POLICY IF EXISTS "Published reviews are viewable by everyone" ON public.reviews;

-- SELECT: published reviews OR demo reviews
CREATE POLICY "Published or demo reviews are viewable by everyone"
ON public.reviews
FOR SELECT
TO anon, authenticated
USING (status = 'published' OR is_demo = true);

-- INSERT: anonymous/authenticated users can only insert with status='pending' and is_demo=false
CREATE POLICY "Anyone can submit a pending review"
ON public.reviews
FOR INSERT
TO anon, authenticated
WITH CHECK (
  status = 'pending'
  AND is_demo = false
  AND rating BETWEEN 1 AND 5
  AND char_length(text) BETWEEN 1 AND 2000
  AND char_length(author_name) BETWEEN 1 AND 100
);

-- No UPDATE or DELETE policy for anon/authenticated => denied by default.
-- service_role bypasses RLS, so admin/server code can still moderate.

-- Data validation at the column level (defence in depth; also enforced for service_role)
ALTER TABLE public.reviews
  DROP CONSTRAINT IF EXISTS reviews_rating_range,
  DROP CONSTRAINT IF EXISTS reviews_text_length,
  DROP CONSTRAINT IF EXISTS reviews_author_length,
  DROP CONSTRAINT IF EXISTS reviews_status_values;

ALTER TABLE public.reviews
  ADD CONSTRAINT reviews_rating_range CHECK (rating BETWEEN 1 AND 5),
  ADD CONSTRAINT reviews_text_length CHECK (char_length(text) BETWEEN 1 AND 2000),
  ADD CONSTRAINT reviews_author_length CHECK (char_length(author_name) BETWEEN 1 AND 100),
  ADD CONSTRAINT reviews_status_values CHECK (status IN ('pending','published','rejected'));
