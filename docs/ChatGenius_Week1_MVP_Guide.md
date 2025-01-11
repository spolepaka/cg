# ChatGenius Week 1 MVP Guide

Below is a feature-by-feature breakdown of recommended technical decisions and implementation details for your Week 1 MVP in **Next.js** (with the App Router), using **Supabase** as your backend for Auth, Database, and Realtime. Each section covers whether to use server-side or client-side rendering, plus any relevant configuration details. The schema is not to be taken to be the final schema, but rather a guide to the MVP.

---

## 1. Authentication

### Approach
1. **Supabase Auth**: Use Supabase’s built-in authentication for email/password or social logins.
2. **Next.js Integration**:
   - **Server Components**: Validate tokens and fetch secure data.
   - **Client Components**: Handle login/signup forms; maintain user session via Supabase’s client SDK.
   - Store the session in cookies or local storage.

### Implementation Tips
- Enable **Row-Level Security (RLS)** in Supabase to protect channel-specific data.
- Use **Next.js Middleware** for guarding routes if needed.

---

## 2. Real-Time Messaging

### Approach
1. **Supabase Realtime**:
   - **Client-Side** subscription to the `messages` table using the Supabase JS client.
   - Minimizes server overhead by letting Supabase handle WebSocket connections.

2. **Schema**:
   - **messages** table: `id`, `channel_id`, `user_id`, `content`, `created_at`.

### Implementation Tips
- Use `createClient` from `@supabase/supabase-js` in a **Client Component** to receive live updates.
- For advanced or large-scale transformations, consider an intermediary server route, but start simple.

---

## 3. Channel/DM Organization

### Approach
1. **Database Schema**:
   - **channels** table: `id`, `name`, `is_dm`, `created_at`.
   - **channel_members** table: tracks which users are in each channel.
   - For **DMs**, set `is_dm = true` and have exactly two members.

2. **Rendering**:
   - **Server Components** for fetching channel lists on initial load.
   - **Client Components** for real-time creation/updates to channels.

### Implementation Tips
- You can create channels in a Next.js **Server Action** or **API route** for secure logic.
- For direct user-to-user messaging, treat it like a normal channel with `is_dm` set.

---

## 4. File Sharing

### Approach
1. **Supabase Storage**:
   - Use Supabase’s S3-like storage for file uploads.
   - Generate a public or signed URL after upload.

2. **Upload Flow**:
   - **Client-Side** file input; upload via the Supabase client SDK.
   - Store file metadata (URL, file name, size) in a dedicated table or directly in the message record.

### Implementation Tips
- For private files, generate **signed URLs** to prevent unauthorized access.
- Ensure your Storage policies only allow authenticated users to upload.

---

## 5. Search

### Approach
1. **Full-Text Search** with PostgreSQL:
   - Create GIN/GIST indexes on `messages.content`.
   - Query with `to_tsquery` or `plainto_tsquery`.

2. **Client or Server**:
   - Use **Server Actions** or **API Routes** to run search queries, returning results to the client.
   - Avoid exposing direct DB queries in client code.

### Implementation Tips
- Good enough for an MVP. For advanced AI-driven search, consider vector embeddings later.
- You can do SSR for search results or do them client-side by calling an API route.

---

## 6. User Presence & Status

### Approach
1. **Supabase Realtime**:
   - Maintain a `user_status` table with fields like `user_id`, `status`, `last_active_at`.
   - Subscribe to changes so the UI reflects who’s online/offline.

2. **Client-Side**:
   - Update presence on login/logout or at set intervals (heartbeat).

### Implementation Tips
- Listen for `onAuthStateChange` to mark a user “online” or “offline.”
- Keep a small time buffer to automatically set status to “away” if no activity.

---

## 7. Emoji Reactions

### Approach
1. **Database Schema**:
   - **reactions** table: `id`, `message_id`, `user_id`, `emoji`, `created_at`.

2. **Client-Side**:
   - On user click, insert a new record in `reactions`.
   - Subscribing to the `reactions` table means you see updates in real time.

### Implementation Tips
- Optionally, track reaction counts in the `messages` table or use a separate aggregator.
- For a simple MVP, counting them on the client from the `reactions` table is straightforward.

---

## 8. Thread Support

### Approach
1. **Enhance `messages` Table**:
   - Add `parent_message_id`. If `NULL`, it’s a root message; otherwise it references a parent.

2. **Fetching Threads**:
   - **Client-Side**: Subscribe to `messages` table where `parent_message_id` equals a specific message ID for real-time thread updates.

### Implementation Tips
- This approach supports Slack-like nested threads.
- You can fetch a parent message and all replies in one query or subscribe in real time.

---

## Overall Recommendations

1. **Use Next.js App Router**:
   - **Server Components** for initial data and SSR.
   - **Client Components** for real-time subscriptions and interactive UIs.

2. **Rely on Supabase**:
   - Authentication, Database (with RLS), Storage, and Realtime all integrated.
   - Keep the logic straightforward for your MVP.

3. **API Routes or Server Actions**:
   - For search queries, file uploads, and any tasks needing secure server logic.

4. **Plan for Scaling**:
   - All data in Supabase for now.
   - Migrate to specialized solutions (vector DB, caching layers) as advanced AI features grow.

---
