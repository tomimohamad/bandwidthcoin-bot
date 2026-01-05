// index.js — Versi 100% Kompatibel dengan Vercel
import { App } from '@vercel/node';

const app = new App();

// Endpoint utama yang Discord panggil
app.post('/', async (req, res) => {
  // Baca body sebagai JSON
  let body;
  try {
    body = req.body;
  } catch (e) {
    return res.status(400).send('Invalid JSON');
  }

  const { type, id, token, data } = body;

  // 1. Discord kirim "PING" untuk verifikasi — WAJIB DIBALAS { type: 1 }
  if (type === 1) {
    return res.json({ type: 1 });
  }

  // 2. Handle command /claim
  if (type === 2 && data?.name === 'claim') {
    return res.json({
      type: 4, // CHANNEL_MESSAGE_WITH_SOURCE
      data: {
        content: '🎯 **Klaim Poin BandwidthCoin**',
        components: [
          {
            type: 1,
            components: [
              {
                type: 2,
                style: 3, // Hijau
                label: 'Ambil Poin Sekarang',
                custom_id: 'claim_button'
              }
            ]
          }
        ],
        flags: 64 // ephemeral (hanya user yang lihat)
      }
    });
  }

  // 3. Handle klik tombol
  if (type === 3 && data?.custom_id === 'claim_button') {
    return res.json({
      type: 4,
      data: {
        content: '✅ **Poin berhasil diklaim!**\nTerima kasih telah menggunakan BandwidthCoin! 💫',
        flags: 64
      }
    });
  }

  // 4. Jika tidak dikenali
  return res.status(400).json({ error: 'Unknown interaction' });
});

export default app;
