  export default async function handler(req, res) {
    const path = req.url.replace(/^\/api\/proxy/, '');
    const target = `http://sofitel-ai.ci.ciandt.tech:9000/${path}`;
    const response = await fetch(target, {
      method: req.method,
      headers: { 'content-type': req.headers['content-type'] || 'application/json' },
      body: req.method !== 'GET' ? req.body : undefined,
    });
    const text = await response.text();
    res.status(response.status).send(text);
  }
