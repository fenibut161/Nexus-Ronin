const path = require('path');
const express = require('express');

const app = express();

const PORT = process.env.PORT || 3000;
const PUBLIC_URL = process.env.PUBLIC_URL || `http://localhost:${PORT}`;

app.use(express.json());

// Отдаём WebApp
app.use('/webapp', express.static(path.join(__dirname, '..', 'webapp')));

// Главная страница ведёт в WebApp
app.get('/', (req, res) => {
  res.redirect('/webapp');
});

// Проверка сервера
app.get('/health', (req, res) => {
  res.json({
    ok: true,
    service: 'nexus-ronin',
    version: '0.1.0',
    publicUrl: PUBLIC_URL,
    webappUrl: `${PUBLIC_URL}/webapp`
  });
});

// Тестовый API
app.get('/api/test', (req, res) => {
  res.json({
    ok: true,
    message: 'Nexus Ronin API works'
  });
});
// Обработчик вебхука от Telegram
app.post('/webhook', async (req, res) => {
  try {
    const update = req.body; // это объект с данными о сообщении/колбэке
    console.log('Received update:', update);
    console.log('Webhook received at', new Date().toISOString());

    // Здесь вы будете обрабатывать входящие сообщения.
    // Например, простой эхо-бот:
    if (update.message && update.message.text) {
      const chatId = update.message.chat.id;
      const text = update.message.text;

      // Отвечаем через Telegram API (пример с использованием fetch)
      await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: `Вы сказали: ${text}`
        })
      });
    }

    // Всегда отвечайте 200 OK, чтобы Telegram знал, что всё принято
    res.sendStatus(200);
  } catch (error) {
    console.error('Webhook error:', error);
    res.sendStatus(500);
  }
});
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Nexus Ronin server is running on port ${PORT}`);
  console.log(`WebApp: ${PUBLIC_URL}/webapp`);
});
