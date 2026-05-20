// Replace with your Web3Forms access key from web3forms.com
const WEB3FORMS_KEY = '5b749d7c-2569-4905-a5b6-c275bb3cb7e8';

const STORAGE_KEY = 'purrfect-boutique-favs';

const TOASTS = [
  'noted with love 🩷',
  'the cat approves 😺',
  'added to your pile 🐾',
  'good taste, as always',
  'purring intensifies',
];

const CATEGORIES = {
  'cute-black-dresses': {
    label: 'Cute Black Dresses',
    subtitle: 'for a cute iwiwi cat so she looks even cuter.',
  },
  sarees: {
    label: 'Sarees',
    subtitle: 'because iwiwi cat likes shiny dwesss.',
  },
};

const PAW_SVG = `<svg viewBox="0 0 44 50" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
  <ellipse cx="10" cy="8" rx="5" ry="6.5"/>
  <ellipse cx="22" cy="4.5" rx="5" ry="6.5"/>
  <ellipse cx="34" cy="8" rx="5" ry="6.5"/>
  <ellipse cx="4.5" cy="21" rx="4.5" ry="6"/>
  <ellipse cx="39.5" cy="21" rx="4.5" ry="6"/>
  <ellipse cx="22" cy="37" rx="15" ry="14"/>
</svg>`;

let allListings = [];
let favorites = new Set();
let toastTimer = null;
let modalOpen = false;

document.addEventListener('DOMContentLoaded', async () => {
  favorites = new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));
  updateFavCounter();

  try {
    const res = await fetch('./listings.json');
    if (!res.ok) throw new Error('fetch failed');
    const data = await res.json();
    allListings = data.listings;
  } catch (_) {
    document.getElementById('main-content').innerHTML =
      '<div class="loading-state">Something went wrong. The koal is looking into it.</div>';
    return;
  }

  render();
  window.addEventListener('hashchange', render);

  document.getElementById('main-content').addEventListener('click', handleMainClick);
  document.getElementById('fav-btn').addEventListener('click', openModal);
  document.querySelector('.modal-backdrop').addEventListener('click', closeModal);
  document.querySelector('.modal-close').addEventListener('click', closeModal);
  document.getElementById('fav-modal').addEventListener('click', handleModalClick);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOpen) closeModal();
  });
});


// --- Routing ---

function render() {
  const hash = location.hash.slice(1);
  const main = document.getElementById('main-content');

  if (!hash || hash === 'home') {
    main.innerHTML = buildHome();
  } else if (CATEGORIES[hash]) {
    main.innerHTML = buildCategory(hash);
  } else {
    main.innerHTML = buildNotFound();
  }

  window.scrollTo(0, 0);
}


// --- Views ---

function buildHome() {
  const counts = {};
  allListings.forEach(item => {
    counts[item.category] = (counts[item.category] || 0) + 1;
  });

  const tiles = Object.entries(CATEGORIES).map(([id, cat]) => {
    const n = counts[id] || 0;
    return `<a href="#${id}" class="category-tile">
      <h2>${cat.label}</h2>
      <p class="tile-subtitle">${cat.subtitle}</p>
      <span class="tile-count">${n} piece${n !== 1 ? 's' : ''}</span>
    </a>`;
  }).join('');

  return `
    <div class="home-hero-wrap">
      <div class="home-hero">
        <h1>The Purrfect Boutique</h1>
        <p class="home-tagline">Curated by a koal for a cat of impeccable taste.</p>
        <div class="home-intro">
          <p>Welcome in. The koal has been busy: combing through rails, holding things up to the light, putting things back, picking them up again. Everything here was chosen with cat cat specifically in mind.</p>
          <p>Browse at your leisure. Tap the heart on anything you'd like, and send your picks when you're ready. The rest is a surprise. 🐾</p>
        </div>
      </div>
      <div class="hero-illustration" aria-hidden="true">
        <img src="../images/welcome-cats.svg" alt="" class="welcome-cats">
      </div>
    </div>
    <div class="category-grid">${tiles}</div>
  `;
}

function buildCategory(catId) {
  const cat = CATEGORIES[catId];
  const items = allListings.filter(item => item.category === catId);

  return `
    <div class="category-header">
      <a href="#" class="back-link">← all categories</a>
      <h2>${cat.label}</h2>
      <p class="category-subtitle">${cat.subtitle}</p>
    </div>
    <div class="cards-grid">
      ${items.map(buildCard).join('')}
    </div>
  `;
}

function buildNotFound() {
  return `
    <div class="not-found">
      <h2>This room is empty.</h2>
      <p>The koal doesn't know what you're looking for. Try the link you were sent.</p>
      <a href="#" class="back-link">← back home</a>
    </div>
  `;
}

function buildCard(item) {
  const isFav = favorites.has(item.id);
  const url = safeUrl(item.sourceUrl);
  return `
    <article class="card${item.koalaPick ? ' card--koala-pick' : ''}" data-id="${escAttr(item.id)}">
      ${item.koalaPick ? `<div class="koala-badge">🐨 the koal thinks this would be especially cute on cat</div>` : ''}
      <div class="card-image-wrap">
        <img
          src="../${escAttr(item.image)}"
          alt="${escAttr(item.title)}"
          class="card-image"
          loading="lazy"
        >
        <div class="paw-stamp-el" aria-hidden="true">${PAW_SVG}</div>
      </div>
      <div class="card-body">
        <p class="card-brand">${escHtml(item.brand)}</p>
        <h3 class="card-title">${escHtml(item.title)}</h3>
        <p class="card-note">${escHtml(item.curatorNote)}</p>
        <div class="card-footer">
          <a
            href="${url}"
            target="_blank"
            rel="noopener noreferrer"
            class="card-source-link"
          >see the full piece</a>
          <button
            class="card-heart${isFav ? ' card-heart--active' : ''}"
            data-id="${escAttr(item.id)}"
            data-action="toggle-fav"
            aria-label="${isFav ? 'remove from favorites' : 'add to favorites'}"
            aria-pressed="${isFav}"
          >
            <svg class="heart-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span class="heart-label">${isFav ? 'a favorite 🐾' : 'add to favorites'}</span>
          </button>
        </div>
      </div>
    </article>
  `;
}


// --- Event handlers ---

function handleMainClick(e) {
  const btn = e.target.closest('[data-action="toggle-fav"]');
  if (!btn) return;
  e.preventDefault();
  e.stopPropagation();
  toggleFavorite(btn.dataset.id);
}

function handleModalClick(e) {
  const target = e.target.closest('[data-action]');
  if (!target) return;

  const action = target.dataset.action;
  if (action === 'remove-pick') {
    const id = target.dataset.id;
    favorites.delete(id);
    saveFavorites();
    updateCardHeart(id, false);
    updateFavCounter();
    renderModalContent('picks');
  } else if (action === 'send-picks') {
    handleSend();
  } else if (action === 'copy-picks') {
    handleCopy();
  }
}


// --- Favorites ---

function toggleFavorite(id) {
  const adding = !favorites.has(id);
  if (adding) {
    favorites.add(id);
    showToast();
    animatePaw(id);
  } else {
    favorites.delete(id);
  }
  saveFavorites();
  updateCardHeart(id, adding);
  updateFavCounter();
}

function saveFavorites() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...favorites]));
}

function updateCardHeart(id, isActive) {
  const btn = document.querySelector(`.card-heart[data-id="${CSS.escape(id)}"]`);
  if (!btn) return;
  btn.classList.toggle('card-heart--active', isActive);
  btn.setAttribute('aria-pressed', String(isActive));
  btn.setAttribute('aria-label', isActive ? 'remove from favorites' : 'add to favorites');
  const label = btn.querySelector('.heart-label');
  if (label) label.textContent = isActive ? 'a favorite 🐾' : 'add to favorites';
}

function updateFavCounter() {
  const n = favorites.size;
  const el = document.getElementById('fav-label');
  if (!el) return;
  if (n === 0) el.textContent = 'your picks 🐾';
  else if (n === 1) el.textContent = '1 favorite 🐾';
  else el.textContent = `${n} favorites 🐾`;
}


// --- Paw animation ---

function animatePaw(id) {
  const card = document.querySelector(`.card[data-id="${CSS.escape(id)}"]`);
  if (!card) return;
  const paw = card.querySelector('.paw-stamp-el');
  if (!paw) return;
  paw.classList.remove('paw-stamp-el--active');
  void paw.offsetWidth;
  paw.classList.add('paw-stamp-el--active');
  setTimeout(() => paw.classList.remove('paw-stamp-el--active'), 900);
}


// --- Toast ---

function showToast() {
  const el = document.getElementById('toast');
  if (toastTimer) {
    clearTimeout(toastTimer);
    el.classList.remove('toast--visible');
    void el.offsetWidth;
  }
  el.textContent = TOASTS[Math.floor(Math.random() * TOASTS.length)];
  el.classList.add('toast--visible');
  toastTimer = setTimeout(() => {
    el.classList.remove('toast--visible');
    toastTimer = null;
  }, 2400);
}


// --- Modal ---

function openModal() {
  const modal = document.getElementById('fav-modal');
  modal.classList.add('modal--open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');
  modalOpen = true;
  renderModalContent('picks');
  setTimeout(() => {
    const first = modal.querySelector('.modal-close');
    if (first) first.focus();
  }, 80);
}

function closeModal() {
  const modal = document.getElementById('fav-modal');
  modal.classList.remove('modal--open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
  modalOpen = false;
}

function renderModalContent(view, extraData) {
  const el = document.getElementById('modal-content');

  if (view === 'picks') {
    const picks = allListings.filter(item => favorites.has(item.id));

    if (picks.length === 0) {
      el.innerHTML = `
        <h2 class="modal-title" id="modal-title">Your picks</h2>
        <div class="empty-favs">
          <p>Nothing here yet.</p>
          <p>The koal is waiting for u to choose things, u feral cat.</p>
        </div>
      `;
      return;
    }

    const itemRows = picks.map(item => `
      <li class="picks-item">
        <div class="picks-item-info">
          <p class="picks-item-title">${escHtml(item.title)}</p>
          <p class="picks-item-retailer">${escHtml(item.retailer)}</p>
        </div>
        <button
          class="picks-remove"
          data-action="remove-pick"
          data-id="${escAttr(item.id)}"
          aria-label="Remove ${escAttr(item.title)}"
        >×</button>
      </li>
    `).join('');

    el.innerHTML = `
      <h2 class="modal-title" id="modal-title">Your picks</h2>
      <p class="modal-intro">Here's what you've gathered so far. Take your time. Add a note if there's something koal should know (a size, an occasion, a "this one specifically"), and send it over when you're ready.</p>
      <ul class="picks-list">${itemRows}</ul>
      <label class="note-label" for="koala-note">A note for the koal (optional) (leaf accepted but not required)</label>
      <textarea id="koala-note" class="note-textarea" placeholder="anything you'd like me to know..."></textarea>
      <button class="send-btn" data-action="send-picks">send my picks 🐾</button>
    `;
  }

  if (view === 'sending') {
    el.innerHTML = `<div class="loading-state" style="min-height:14rem;">sending your picks...</div>`;
  }

  if (view === 'success') {
    el.innerHTML = `
      <div class="confirmation">
        <h2 id="modal-title">Delivered 🐾✨</h2>
        <p>Your picks are on their way. The koal has noted them carefully and will be in touch.</p>
        <p>Thank u for letting her catch thimgs.</p>
      </div>
    `;
  }

  if (view === 'error') {
    const picks = extraData || [];
    const itemRows = picks.map((item, i) =>
      `<li>${i + 1}. ${escHtml(item.title)} — ${escHtml(item.retailer)}</li>`
    ).join('');

    el.innerHTML = `
      <div class="fallback-panel">
        <h3 id="modal-title">Hmm, something went wrong. Maybe koal fell off twee.</h3>
        <p class="modal-intro">Here are your picks. Copy and send them directly:</p>
        <ul class="fallback-list">${itemRows}</ul>
        <button class="copy-btn" data-action="copy-picks">copy to clipboard</button>
      </div>
    `;
  }
}


// --- Submit ---

async function handleSend() {
  const picks = allListings.filter(item => favorites.has(item.id));
  const note = document.getElementById('koala-note')?.value?.trim() || '';

  renderModalContent('sending');

  let message = 'Picks from The Purrfect Boutique:\n\n';
  picks.forEach((item, i) => {
    message += `${i + 1}. ${item.title}\n   Retailer: ${item.retailer}\n   Link: ${item.sourceUrl}\n\n`;
  });
  if (note) message += `Note from the cat:\n${note}`;

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject: 'The Purrfect Boutique: New Picks',
        from_name: 'The Purrfect Boutique',
        message,
      }),
    });
    const data = await res.json();

    if (data.success) {
      favorites.clear();
      saveFavorites();
      updateFavCounter();
      renderModalContent('success');
    } else {
      renderModalContent('error', picks);
    }
  } catch (_) {
    renderModalContent('error', picks);
  }
}

function handleCopy() {
  const picks = allListings.filter(item => favorites.has(item.id));
  let text = 'My picks from The Purrfect Boutique:\n\n';
  picks.forEach((item, i) => {
    text += `${i + 1}. ${item.title}\n   ${item.retailer}: ${item.sourceUrl}\n\n`;
  });

  navigator.clipboard.writeText(text).then(() => {
    const btn = document.querySelector('[data-action="copy-picks"]');
    if (!btn) return;
    const original = btn.textContent;
    btn.textContent = 'copied!';
    setTimeout(() => { btn.textContent = original; }, 2000);
  });
}


// --- Utilities ---

function safeUrl(url) {
  try {
    const u = new URL(url);
    return (u.protocol === 'https:' || u.protocol === 'http:') ? url : '#';
  } catch (_) {
    return '#';
  }
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escAttr(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
