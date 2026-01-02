require("dotenv").config();
const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Simulasi database
let userPoints = {};

client.once('ready', () => {
  console.log(`🚀 Bot aktif! - ${client.user.tag}`);

  // Ganti dengan Server ID Anda
  const guildId = '1455050454244266017'; // ← PASTE DI SINI!
  const guild = client.guilds.cache.get(guildId);
  
  if (guild) {
    // Daftarkan command dasar
    guild.commands.set([{ 
      name: 'claim', 
      description: 'Klaim poin bandwidth' 
    }]);
    console.log('✅ Slash command terdaftar');
  }
});

  // Kirim panel utama ke #general
  const generalChannel = client.channels.cache.find(
    (c) => c.name === "general",
  );
  if (generalChannel) {
    sendMainPanel(generalChannel);
  }
});

// Fungsi kirim panel utama
async function sendMainPanel(channel) {
  // Hapus pesan lama
  await channel.bulkDelete(100).catch(() => {});

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("claim")
      .setLabel("🎯 Klaim Poin")
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId("leaderboard")
      .setLabel("🏆 Leaderboard")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId("referral")
      .setLabel("📨 Referral")
      .setStyle(ButtonStyle.Secondary),
  );

  await channel.send({
    content:
      "✨ **Selamat datang di BandwidthCoin!**\nKlik tombol di bawah untuk mulai:",
    components: [row],
  });
}

// Handler tombol
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  const userId = interaction.user.id;
  const username = interaction.user.username;

  // Tombol Klaim
  if (interaction.customId === "claim") {
    const userId = interaction.user.id;
    const username = interaction.user.username;
    const bandwidth = Math.floor(Math.random() * 11) + 5;
    const earned = Math.floor(bandwidth * 0.5);
    userPoints[userId] = (userPoints[userId] || 0) + earned;

    // Notifikasi ke #klaim-activity
    const activityChannel = interaction.guild.channels.cache.find(
      (c) => c.name === "klaim-activity",
    );
    if (activityChannel) {
      activityChannel.send(
        `🎉 <@${userId}> baru saja klaim **${earned} Poin**!`,
      );
    }

    // 🎯 TUNJUKKAN MITRA BERDASARKAN JUMLAH POIN
    let rewardMessage = "";
    if (userPoints[userId] >= 100) {
      rewardMessage =
        "\n🎁 **Hadiah:** 1 Kopi Gratis di **Warung Kopi XYZ** (Tunjukkan screenshot ini!)";
    } else if (userPoints[userId] >= 50) {
      rewardMessage = "\n🎁 **Hadiah:** Diskon 20% di **Konter Pulsa ABC**";
    }
    if (userPoints[userId] >= 1000) {
      rewardMessage =
        "\n👕 **Hadiah Spesial!** 1 Kaos Gratis di **[Nama Toko]** (Tunjukkan screenshot + kode BWC-SG2025)";
    }

    await interaction.reply({
      content: `✅ **Klaim Berhasil!**\n📶 Bandwidth idle: **${bandwidth} Mbps**\n📊 Total Poin: **${userPoints[userId]} Poin**${rewardMessage}`,
      flags: 64,
    });
  }

  // Tombol Leaderboard
  if (interaction.customId === "leaderboard") {
    const topUsers = Object.entries(userPoints)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const embed = new EmbedBuilder()
      .setTitle("🏆 Leaderboard BandwidthCoin")
      .setColor(0x4361ee)
      .setDescription(
        topUsers.length
          ? topUsers
              .map(
                ([id, points], idx) =>
                  `${idx + 1}. <@${id}> - **${points} Poin**`,
              )
              .join("\n")
          : "Belum ada user!",
      );

    await interaction.reply({ embeds: [embed], flags: 64 });
  }

  // Tombol Referral
  if (interaction.customId === "referral") {
    const inviteLink = "https://discord.gg/yCnUr33S4d"; // GANTI DENGAN LINK ANDA
    await interaction.reply({
      content: `✨ **Link Referral Anda:**\n${inviteLink}\n\n🎁 Setiap teman yang klaim via link ini, Anda dapat **10 Poin bonus**!`,
      flags: 64,
    });
  }
});

client.login(process.env.DISCORD_TOKEN);
