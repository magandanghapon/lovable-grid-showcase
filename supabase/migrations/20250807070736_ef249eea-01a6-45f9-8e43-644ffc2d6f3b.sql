-- Add content field to posts table for rich text content
ALTER TABLE public.posts 
ADD COLUMN content TEXT;