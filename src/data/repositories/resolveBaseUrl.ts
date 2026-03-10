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

  // Absolute base URL (rare, but valid)
  if (/^https?:\/\//i.test(rawBase)) {
    return new URL(rawBase);
  }

  // If the base is an absolute path, prefer it directly.
  // Example: '/busca-sampa/' -> always resolve under that prefix.
  if (rawBase.startsWith("/") && rawBase !== "./") {
    return new URL(rawBase, window.location.origin);
  }

  // For relative base ('./'), do NOT resolve against window.location.href.
  // On deep routes like '/restaurantes/slug', resolving './' against the current
  // URL yields '/restaurantes/' and breaks fetches to public data assets.
  //
  // Instead, infer the app "mount" path:
  // - If the first segment looks like a known route, assume app root '/'
  // - Otherwise, treat the first segment as a deployment subpath (e.g. '/busca-sampa/')
  const pathname = window.location.pathname || "/";
  const firstSegment = pathname.split("/").filter(Boolean)[0] || "";
  const knownFirstSegments = new Set([
    "restaurantes",
    "restaurants",
    "bares",
    "bars",
    "cafeterias",
    "coffees",
    "vida-noturna",
    "nightlife",
    "natureza",
    "nature",
    "pontos-turisticos",
    "tourist-spot",
    "diversao",
    "forfun",
    "lojas",
    "stores",
    "eventos",
    "events",
    "prazer",
    "pleasure",
    "free",
    "gratuito",
    "abrem-hoje",
    "bairro",
    "neighborhood",
    "place",
    "roteiros",
    "travel-itinerary",
    "search",
    "about",
    "support",
    "recommendations-origin",
    "how-to-recommend",
  ]);

  const mountPath = firstSegment && !knownFirstSegments.has(firstSegment)
    ? `/${firstSegment}/`
    : "/";

  return new URL(mountPath, window.location.origin);
}

export function resolvePublicUrl(relativePath: string): string {
  const baseUrl = resolveBaseUrl();
  const normalized = String(relativePath || "").replace(/^\//, "");
  return new URL(normalized, baseUrl).toString();
}
