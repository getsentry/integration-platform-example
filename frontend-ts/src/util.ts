export async function makeBackendRequest(
  path: string,
  data?: Record<string, any>,
  options?: RequestInit
) {
  const baseEndpoint = process.env.REACT_APP_BACKEND_URL;
  const res = await fetch(`${baseEndpoint}${path}`, {
    mode: 'cors',
    headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
    method: 'GET',
    body: JSON.stringify(data),
    ...options,
  });
  return res.json();
}

export type Organization = any;
