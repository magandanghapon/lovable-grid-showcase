-- Add support for multiple images in posts
ALTER TABLE public.posts 
ADD COLUMN image_urls TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Update existing posts to migrate single image_url to image_urls array
UPDATE public.posts 
SET image_urls = CASE 
  WHEN image_url IS NOT NULL AND image_url != '' THEN ARRAY[image_url]
  ELSE ARRAY[]::TEXT[]
END;