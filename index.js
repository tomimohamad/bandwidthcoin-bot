// index.js — Versi PASTI JALAN di Vercel
export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  let body;
  try {
    body = JSON.parse(req.body || '{}');
  } catch (e) {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  if (body.type === 1) {
    return res.json({ type: 1 }); // WAJIB untuk verifikasi
  }

  return res.status(400).json({ error: 'Unsupported' });
};
