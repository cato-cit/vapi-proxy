  const AUTH_USER = 'sofitel';
  const AUTH_PASS = 'sofitel2026';

  function checkAuth(req) {
    const auth = req.headers['authorization'];
    if (!auth || !auth.startsWith('Basic ')) return false;
    const [user, pass] = Buffer.from(auth.slice(6), 'base64').toString().split(':');
    return user === AUTH_USER && pass === AUTH_PASS;
  }

  export default async function handler(req, res) {
    // API 路由不拦截（Vapi、登录等都走 /api/）
    if (!req.url.startsWith('/api/')) {
      if (!checkAuth(req)) {
        res.setHeader('WWW-Authenticate', 'Basic realm="Sofitel POC"');
        return res.status(401).send('Unauthorized');
      }
    }

    const target = `http://sofitel-ai.ci.ciandt.tech:9000${req.url}`;
    try {
      const headers = { ...req.headers };
      delete headers['host'];
      const fetchOptions = { method: req.method, headers };
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