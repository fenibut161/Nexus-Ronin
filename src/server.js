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

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Nexus Ronin server is running on port ${PORT}`);
  console.log(`WebApp: ${PUBLIC_URL}/webapp`);
});
