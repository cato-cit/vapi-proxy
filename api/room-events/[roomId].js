  // Serverless Node.js (not edge) — proxies guest room SSE from CI backend
  export const config = { maxDuration: 60, supportsResponseStreaming: true };

  export default async function handler(req, res) {
    const roomId = req.query.roomId;
    const target = `http://sofitel-ai.ci.ciandt.tech:9000/api/room-events/${roomId}`;

    let upstream;
    try {
      upstream = await fetch(target, {
        headers: { Accept: 'text/event-stream', 'Cache-Control': 'no-cache' },
      });
    } catch (_) {
      res.writeHead(502).end();
      return;
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    const reader = upstream.body.getReader();
    const decoder = new TextDecoder();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(decoder.decode(value, { stream: true }));
      }
    } catch (_) {
      // client disconnected or upstream gone
    } finally {
      reader.cancel();
      res.end();
    }
  }