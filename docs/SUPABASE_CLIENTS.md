# Supabase client entry points

Use the client that matches the runtime and security boundary. Do not create a
new Supabase client module or instantiate a service-role client in a new route.

| Role                | Entry point                                                    | Use                                                                                                                                                    |
| ------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Browser             | `getSupabaseBrowserClient` from `@/lib/supabase/client`        | Client components using the public anon key and browser-managed auth session.                                                                          |
| Cookie-aware server | `createRouteHandlerClient` from `@/lib/supabase/route-handler` | Server components and route handlers that need the current request's user session and row-level security.                                              |
| Admin               | `getSupabaseAdmin` from `@/lib/server/supabaseAdmin`           | Server-only operations that deliberately bypass row-level security. Keep the service-role key on the server and authorize the request before using it. |

## Existing compatibility modules

These modules predate the canonical entry points. Avoid adding new imports from
them; migrate a touched call site to the matching entry point above when
practical:

- `@/lib/supabase/server` exports `supabaseUser`, an anon-key client without
  request cookies. It is suitable only for public, non-user-scoped server
  queries. Use the cookie-aware entry point when auth state or user-scoped RLS
  is required.
- `@/lib/supabase/supabase-server` exports `supabaseServer`, which uses the
  service-role key despite its generic name. It is an admin client, not a
  cookie-aware server client.
- `@/lib/supabase/supabase` exports older `supabaseUser` and `supabaseAdmin`
  instances. Prefer the canonical browser or server entry point for user work
  and `getSupabaseAdmin` for privileged work.
- Some existing API routes create service-role clients locally to preserve
  route-specific configuration or initialization behavior. Do not copy that
  pattern into new code; use `getSupabaseAdmin` unless a documented requirement
  needs a separate client.

## Security and session guidance

- The anon key is public, but user requests should use the cookie-aware server
  client so Supabase can validate the user's session and apply row-level
  security.
- The service-role key bypasses row-level security. Authenticate and authorize
  the caller before performing privileged operations, and never import the
  admin entry point into a client component.
- `createRouteHandlerClient` reads and refreshes cookies from the current Next.js
  request context. Do not instantiate it at module scope.
- Use `getSupabaseBrowserClient` in browser code rather than a server SDK client
  or a service-role credential.
