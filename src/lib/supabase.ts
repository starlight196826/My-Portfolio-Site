import { createClient } from '@supabase/supabase-js';

/** Valid placeholders so `createClient` never throws when env is missing (e.g. misconfigured Vercel env). Queries still fail safely. */
const PLACEHOLDER_URL = 'https://placeholder.supabase.co';
const PLACEHOLDER_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJvbGUiOiJhbm9uIn0.placeholder';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
const configured = Boolean(
  url && key && url !== 'your_supabase_project_url' && !key.includes('your_')
);

export const supabase = createClient(
  configured ? url! : PLACEHOLDER_URL,
  configured ? key! : PLACEHOLDER_ANON_KEY
);
