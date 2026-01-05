// index.js — Versi Minimal & Valid untuk Vercel + Discord
export default async (req, res) => {
  // Hanya terima POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  let body;
  try {
    // Parse body sebagai JSON
    body = JSON.parse(req.body || '{}');
  } catch (e) {
    // Jika tidak bisa parse, kirim 400
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  // Jika Discord kirim PING (type: 1), balas WAJIB { type: 1 }
  if (body.type === 1) {
    return res.json({ type: 1 });
  }

  // Untuk interaksi lain, kirim 400 (tidak didukung)
  return res.status(400).json({ error: 'Unsupported interaction' });
};
