-- Migration: Add scan status columns to dropbox_settings
-- Run this in Supabase SQL Editor

alter table dropbox_settings
  add column if not exists scan_status text default 'idle',
  add column if not exists scan_completed_at timestamptz,
  add column if not exists scan_result jsonb;
