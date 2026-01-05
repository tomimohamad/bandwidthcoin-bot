// index.js — Versi Minimal & Valid untuk Vercel + Discord
import { App } from '@vercel/node';

const app = new App();

app.post('/', (req, res) => {
  // Baca body sebagai JSON
  const body = req.body;

  // Jika Discord kirim PING (type: 1), balas dengan { type: 1 }
  if (body && body.type === 1) {
    return res.json({ type: 1 });
  }

  // Untuk interaksi lain (command/tombol), kirim error sementara
  return res.status(400).json({ error: 'Unsupported interaction' });
});

export default app;
