  export default async function handler(req, res) {
    const target = 'http://sofitel-ai.ci.ciandt.tech:9000/api/vapi/chat/completions';
    try {
      const response = await fetch(target, {
        method: req.method,
        headers: { 'content-type': 'application/json' },
        body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
      });
      const text = await response.text();
      res.status(response.status).send(text);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }