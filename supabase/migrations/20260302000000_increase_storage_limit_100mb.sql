-- Migration: Increase Supabase Storage bucket file size limit to 100 MB (104,857,600 bytes)
UPDATE storage.buckets 
SET file_size_limit = 104857600 
WHERE id IN ('af12-media', 'af12-finance-receipts');

