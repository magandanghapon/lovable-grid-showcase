-- Update the posts table RLS policy to allow public viewing of all posts
-- while keeping other permissions restricted to post owners

-- Drop the existing restrictive SELECT policy
DROP POLICY IF EXISTS "Users can view their own posts" ON public.posts;

-- Create a new policy that allows anyone to view all posts
CREATE POLICY "Posts are publicly viewable" 
ON public.posts 
FOR SELECT 
USING (true);