/**
 * Resolves Vite's `import.meta.env.BASE_URL` into an absolute URL, then builds
 * absolute URLs for files served from `/public` (or copied assets).
 *
 * Motivation: when `base: './'` is used, BASE_URL can be './' which can lead to
 * request paths like '/./data/...'. Some hosts normalize that with redirects,
 * adding latency and worsening Lighthouse "redirect" audits.
 */
export function resolveBaseUrl(): URL {
  const rawBase = import.meta.env.BASE_URL || "/";
  // Ensure the base is absolute so URL resolution works in both dev and prod.
  return new URL(rawBase, window.location.href);
}

export function resolvePublicUrl(relativePath: string): string {
  const baseUrl = resolveBaseUrl();
  const normalized = String(relativePath || "").replace(/^\//, "");
  return new URL(normalized, baseUrl).toString();
}
