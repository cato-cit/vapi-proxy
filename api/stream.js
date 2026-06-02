  export const config = {
    runtime: 'edge',
  };

  export default async function handler(req) {
    const url = new URL(req.url);
    const target = `http://sofitel-ai.ci.ciandt.tech:9000/api/stream${url.search}`;

    const headers = new Headers(req.headers);
    headers.delete('host');

    return fetch(target, {
      method: req.method,
      headers,
    });
  }