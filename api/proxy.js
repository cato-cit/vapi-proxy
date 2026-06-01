  export default async function handler(req, res) {
    const target = `http://sofitel-ai.ci.ciandt.tech:9000${req.url}`;
    try {
      const fetchOptions = {
        method: req.method,
        headers: { 'content-type': req.headers['content-type'] || 'application/json' },
      };
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        fetchOptions.body = JSON.stringify(req.body);
      }
      const response = await fetch(target, fetchOptions);
      const contentType = response.headers.get('content-type') || '';
      const data = await response.arrayBuffer();
      res.setHeader('content-type', contentType);
      res.status(response.status).send(Buffer.from(data));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }