export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`http://localhost:3333${path}`);
  if (!response.ok) {
    throw new Error("Failed to fetch");
  }
  return response.json();
}

export async function apiPost<T>(path: string, body: any): Promise<T> {
  const response = await fetch(`http://localhost:3333${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch");
  }
  return response.json();
}
