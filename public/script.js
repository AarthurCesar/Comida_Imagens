document.addEventListener('DOMContentLoaded', async () => {
  const cards = document.querySelectorAll('.card');

  async function translateToEnglish(text) {
    try {
      const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=pt|en`);
      const data = await response.json();
      return data.responseData.translatedText;
    } catch (e) {
      console.error('Erro ao traduzir:', e);
      return text;
    }
  }

  async function fetchImageFromBackend(searchTerm) {
    try {
      const response = await fetch(`/api/image?q=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();
      return data.imageUrl;
    } catch (e) {
      console.error('Erro ao buscar imagem no backend:', e);
      return `https://source.unsplash.com/300x200/?${encodeURIComponent(searchTerm)}`;
    }
  }

  const promises = Array.from(cards).map(async (card) => {
    const img = card.querySelector('img');
    const altText = img.alt || card.querySelector('p').textContent;
    const cleanText = altText.replace(/à|artesanal|de|do|da|dos|das/gi, '').trim();

    const translatedText = await translateToEnglish(cleanText);
    const imageUrl = await fetchImageFromBackend(translatedText);

    img.src = imageUrl;

    img.onerror = async function () {
      this.src = await fetchImageFromBackend(translatedText.split(' ')[0]);
    };
  });

  await Promise.all(promises);
});

setTimeout(() => {
  const loading = document.getElementById('loading');
  if (loading) {
    loading.style.display = 'none';
  }
}, 2000);
