export const getQueryParam = (
  parameter: string
): { encoded: string; decoded: string } => {
  const queryParams = new URLSearchParams(location.search);
  const decoded = decodeURIComponent(queryParams.get(parameter) || "");
  const encoded = encodeURIComponent(decoded);

  return { encoded, decoded };
};

export const getRedirect = (): string => {
  const redirect = getQueryParam("redirect").decoded;
  if (redirect === "") return "/";
  return redirect;
};

interface MakeURLParams {
  baseUrl: string;
  routeParam?: string;
  queryParams?: Record<string, string | number | boolean | null | undefined>;
}

export function makeURL({
  baseUrl,
  routeParam,
  queryParams = {},
}: MakeURLParams): string {
  let url = baseUrl;

  if (routeParam) {
    url += `/${encodeURIComponent(routeParam)}`;
  }

  // remove null or undefined query parameters
  const cleanedParams = Object.fromEntries(
    Object.entries(queryParams).filter(([_, v]) => v != null)
  );

  const queryString = new URLSearchParams(
    cleanedParams as Record<string, string>
  ).toString();

  if (queryString) {
    url += `?${queryString}`;
  }

  return url;
}
