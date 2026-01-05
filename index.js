// index.js — Versi Optimized untuk Vercel
import { App } from '@vercel/node';
import { InteractionType, InteractionResponseType } from 'discord-interactions';

const app = new App();

// Endpoint utama Vercel — menerima POST dari Discord
app.post('/', async (req, res) => {
  const { type, id, token } = req.body;

  // ACK ping dari Discord
  if (type === 1) {
    return res.json({ type: 1 });
  }

  // Handle tombol klaim
  if (type === 3 && req.body.data.custom_id === 'claim_button') {
    return res.json({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: `✅ Poin berhasil diklaim!`,
        flags: 64 // ephemeral (hanya user lihat)
      }
    });
  }

  // Handle /claim command
  if (type === 2 && req.body.data.name === 'claim') {
    return res.json({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: `🎯 Ketuk tombol di bawah untuk klaim poin!`,
        components: [{
          type: 1,
          components: [{
            type: 2,
            style: 3,
            label: 'Klaim Poin',
            custom_id: 'claim_button'
          }]
        }]
      }
    });
  }

  res.status(400).send('Unknown interaction');
});

export default app;
