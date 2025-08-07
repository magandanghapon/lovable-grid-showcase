-- Create storage bucket for post images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('post-images', 'post-images', true);

-- Create policies for post images
CREATE POLICY "Post images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'post-images');

CREATE POLICY "Authenticated users can upload post images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'post-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own post images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'post-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own post images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'post-images' AND auth.uid()::text = (storage.foldername(name))[1]);