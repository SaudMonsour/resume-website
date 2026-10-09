const field = document.getElementById('article-search');
if (field) {
  const cards = [...document.querySelectorAll('[data-search]')];
  const status = document.getElementById('search-status');
  field.addEventListener('input', () => {
    const words = field.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
    let count = 0;
    for (const card of cards) {
      card.hidden = !words.every(word => card.dataset.search.includes(word));
      if (!card.hidden) count++;
    }
    status.textContent = count === 0 ? 'No articles match your search.' : `${count} article${count === 1 ? '' : 's'}`;
  });
}

