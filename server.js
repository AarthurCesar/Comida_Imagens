require('dotenv').config();
const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args)); // para node-fetch v3+
const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.get('/api/image', async (req, res) => {
  const searchTerm = req.query.q;
  console.log('searchTerm:', searchTerm); // DEBUG

  if (!searchTerm) {
    return res.status(400).json({ error: 'Parâmetro q é obrigatório' });
  }

  if (!process.env.UNSPLASH_API_KEY) {
    console.error('UNSPLASH_API_KEY não está configurada no .env');
    return res.status(500).json({ error: 'Chave da API não configurada' });
  }

  try {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchTerm)}&per_page=1&client_id=${process.env.UNSPLASH_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      return res.json({ imageUrl: data.results[0].urls.small });
    }
    return res.json({ imageUrl: `https://source.unsplash.com/300x200/?${encodeURIComponent(searchTerm)},food` });
  } catch (error) {
    console.error('Erro ao buscar imagem:', error);
    return res.status(500).json({ error: 'Erro ao buscar imagem' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
