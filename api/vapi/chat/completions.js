  export const config = {
    runtime: 'edge',
  };

  export default async function handler(req) {
    const target = 'http://sofitel-ai.ci.ciandt.tech:9000/api/vapi/chat/completions';

    const headers = new Headers(req.headers);
    headers.delete('host');

    const body = req.method !== 'GET' && req.method !== 'HEAD'
      ? await req.text()
      : undefined;

    return fetch(target, {
      method: req.method,
      headers,
      body,
    });
  }