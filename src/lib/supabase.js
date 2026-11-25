/**
 * Supabase integration placeholder.
 *
 * Not active — the site currently uses mailto: inquiries (src/services/inquiry.js).
 * To enable later (Supabase free tier):
 *
 * 1. npm install @supabase/supabase-js
 * 2. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local and to the
 *    Cloudflare Pages environment variables.
 * 3. Create an `inquiries` table with Row Level Security that allows INSERT only:
 *
 *      create table public.inquiries (
 *        id uuid primary key default gen_random_uuid(),
 *        created_at timestamptz not null default now(),
 *        name text not null,
 *        email text not null,
 *        project_type text not null,
 *        budget text,
 *        deadline date,
 *        description text not null
 *      );
 *      alter table public.inquiries enable row level security;
 *      create policy "anon can insert" on public.inquiries
 *        for insert to anon with check (true);
 *
 * 4. Replace the body below with the commented implementation and set
 *    INQUIRY_PROVIDER = 'supabase' in src/services/inquiry.js.
 */

// import { createClient } from '@supabase/supabase-js'
//
// export const supabase = createClient(
//   import.meta.env.VITE_SUPABASE_URL,
//   import.meta.env.VITE_SUPABASE_ANON_KEY,
// )
//
// export async function submitViaSupabase(values) {
//   const { error } = await supabase.from('inquiries').insert({
//     name: values.name.trim(),
//     email: values.email.trim(),
//     project_type: values.projectType,
//     budget: values.budget || null,
//     deadline: values.deadline || null,
//     description: values.description.trim(),
//   })
//   if (error) throw error
// }

export async function submitViaSupabase() {
  throw new Error('Supabase is not configured. See src/lib/supabase.js.')
}
