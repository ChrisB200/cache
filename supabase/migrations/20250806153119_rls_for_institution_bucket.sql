CREATE POLICY public_read_object
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'institutions');

CREATE POLICY authenticated_upload_to_institutions_images
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated'
    AND bucket_id = 'institutions'
    AND name LIKE 'images/%'
  );

