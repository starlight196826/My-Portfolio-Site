/**
 * Print row counts per portfolio table (uses service role if set, else anon).
 * Run: npm run db:verify
 */
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

const tables = [
  'profile',
  'work_experience',
  'projects',
  'articles',
  'skills',
  'testimonials',
] as const;

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  const key = serviceKey || anonKey;

  if (!url || url === 'your_supabase_project_url') {
    console.error('Set NEXT_PUBLIC_SUPABASE_URL in .env.local');
    process.exit(1);
  }
  if (!key) {
    console.error('Set SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
    process.exit(1);
  }

  const supabase = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log(`Using ${serviceKey ? 'service_role' : 'anon'} key\n`);

  for (const t of tables) {
    const { count, error } = await supabase.from(t).select('*', { count: 'exact', head: true });
    if (error) {
      console.log(`${t}: ERROR — ${error.message} (code ${error.code})`);
    } else {
      console.log(`${t}: ${count ?? 0} rows`);
    }
  }
}

main().catch((e) => {
  console.error(e?.message ?? e);
  process.exit(1);
});
