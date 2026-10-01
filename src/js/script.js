/* =========================================================
   MENÚ DIGITAL: búsqueda en vivo, control segmentado con
   indicador deslizante, tarjetas de producto y sheet de detalle.
   Depende de menuData.js (RESTAURANT_INFO, MENU_CATEGORIES, MENU_ITEMS).
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Referencias del DOM ---------- */
  const DOM = {
    name: document.getElementById("restaurant-name"),
    location: document.getElementById("restaurant-location"),
    hours: document.getElementById("opening-hours"),
    statusBadge: document.getElementById("status-badge"),
    statusText: document.getElementById("status-text"),

    segmented: document.getElementById("category-control"),
    menuGrid: document.getElementById("menu-grid"),

    overlay: document.getElementById("sheet-overlay"),

    // Sheet de producto
    itemSheet: document.getElementById("item-sheet"),
    itemSheetClose: document.getElementById("item-sheet-close"),
    itemHero: document.getElementById("item-hero"),
    itemImage: document.getElementById("item-image"),
    itemFallback: document.getElementById("item-fallback"),
    itemName: document.getElementById("item-name"),
    itemRating: document.getElementById("item-rating"),
    itemPopular: document.getElementById("item-popular"),
    itemPrice: document.getElementById("item-price"),
    itemDesc: document.getElementById("item-desc"),
    itemIngredients: document.getElementById("item-ingredients")
  };

  /* ---------- Estado de la app ---------- */
  const state = {
    category: "all",
    query: "",
    activeItemId: null,
    lastFocused: null,
    openSheetEl: null,
  };

  const CATEGORY_ICONS = Object.fromEntries(
    MENU_CATEGORIES.map((category) => [category.id, category.icon])
  );

  /* =========================================================
     UTILIDADES
     ========================================================= */
 function normalizeText(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char]);
}

function formatPrice(value) {
  return `$${Number(value).toFixed(2)}`;
}

function findItem(id) {
  return MENU_ITEMS.find((item) => item.id === id) || null;
}
  /* =========================================================
     HORARIO Y ESTADO DEL NEGOCIO
     ========================================================= */
  function getRestaurantTime() {
    return new Date(
      new Date().toLocaleString("en-US", { timeZone: RESTAURANT_INFO.timezone })
    );
  }

  function getHoursFor(date) {
    return RESTAURANT_INFO.hours[date.getDay()] || null;
  }

  function toMinutes(hhmm) {
    const [hours, minutes] = hhmm.split(":").map(Number);
    return hours * 60 + minutes;
  }

  function formatTime(hhmm) {
    const [hours, minutes] = hhmm.split(":").map(Number);
    const suffix = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 || 12;
    return `${hour12}:${String(minutes).padStart(2, "0")} ${suffix}`;
  }

  function isOpenAt(date) {
    const hours = getHoursFor(date);
    if (!hours) return false;

    const now = date.getHours() * 60 + date.getMinutes();
    const open = toMinutes(hours.open);
    const close = toMinutes(hours.close);

    return close > open
      ? now >= open && now < close
      : now >= open || now < close;
  }

  function renderHeader() {
    const today = getHoursFor(getRestaurantTime());

    DOM.name.textContent = "PanaBurger";
    DOM.location.textContent = `San Mateo, Estado Aragua 📍`;
    DOM.hours.textContent = today
      ? `Hoy ${formatTime(today.open)} – ${formatTime(today.close)}`
      : "Cerrado hoy";
  }

  function updateStatus() {
    const isOpen = isOpenAt(getRestaurantTime());
    DOM.statusBadge.classList.toggle("status-badge--open", isOpen);
    DOM.statusText.textContent = isOpen ? "Abierto Ahora" : "Cerrado";
  }

  /* =========================================================
     CONTROL SEGMENTADO DE CATEGORÍAS
     ========================================================= */
  function renderNav() {
    const buttons = MENU_CATEGORIES.map((category) => `
      <button
        type="button"
        class="segmented__btn"
        role="tab"
        data-category="${escapeHTML(category.id)}"
        aria-selected="${category.id === state.category}"
      >${escapeHTML(category.label)}</button>
    `).join("");

    DOM.segmented.innerHTML = `<span class="segmented__indicator" aria-hidden="true"></span>${buttons}`;
  }

  function updateNavState() {
    DOM.segmented.querySelectorAll(".segmented__btn").forEach((button) => {
      button.setAttribute(
        "aria-selected",
        String(button.dataset.category === state.category)
      );
    });
  }

  function moveIndicator(animate = true) {
    const indicator = DOM.segmented.querySelector(".segmented__indicator");
    const active = DOM.segmented.querySelector('.segmented__btn[aria-selected="true"]');
    if (!indicator || !active) return;

    indicator.classList.toggle("is-static", !animate);
    indicator.style.width = `${active.offsetWidth}px`;
    indicator.style.transform = `translateX(${active.offsetLeft}px)`;
  }

  function scrollActiveTabIntoView() {
    const active = DOM.segmented.querySelector('.segmented__btn[aria-selected="true"]');
    if (!active) return;

    const target = active.offsetLeft - (DOM.segmented.clientWidth - active.offsetWidth) / 2;
    DOM.segmented.scrollTo({ left: target, behavior: "smooth" });
  }

  /* =========================================================
     RENDERIZADO DEL MENÚ
     ========================================================= */
  function getVisibleItems() {
    const query = state.query.trim().toLowerCase();

    return MENU_ITEMS
      .filter((item) => {
        const inCategory = state.category === "all" || item.category === state.category;
        const matchesQuery =
          !query ||
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.ingredients.some((ingredient) => ingredient.toLowerCase().includes(query));

        return inCategory && matchesQuery;
      })
      .sort((a, b) => Number(b.available) - Number(a.available));
  }

  function createCardHTML(item) {
    const soldOut = !item.available;
    const icon = CATEGORY_ICONS[item.category] || "🍽️";

    const popularBadge = item.popular && !soldOut
      ? `<span class="pill pill--popular">🔥 Popular</span>`
      : "";

    const soldOutBadge = soldOut
      ? `<span class="pill pill--sold-out">Agotado</span>`
      : "";

    return `
      <article class="card${soldOut ? " card--unavailable" : ""}" data-id="${escapeHTML(item.id)}">
        <div class="card__media">
          <span class="card__fallback" aria-hidden="true">${icon}</span>
          <img
            class="card__image"
            src="${escapeHTML(item.image)}"
            alt="${escapeHTML(item.name)}"
            width="800"
            height="500"
            loading="lazy"
            decoding="async"
          />
          <div class="card__badges">
            <span class="pill pill--rating">⭐ ${item.rating.toFixed(1)}</span>
            ${popularBadge}
            ${soldOutBadge}
          </div>
          <span class="pill card__price">${formatPrice(item.price)}</span>
        </div>

        <div class="card__body">
          <h3 class="card__title">${escapeHTML(item.name)}</h3>
          <p class="card__desc">${escapeHTML(item.description)}</p>
        </div>
      </article>
    `;
  }

  function renderMenu() {
    const items = getVisibleItems();

    if (items.length === 0) {
      const message = state.query.trim()
        ? "No encontramos productos con ese nombre."
        : "No hay productos disponibles en esta categoría.";
      DOM.menuGrid.innerHTML = `<p class="menu-empty">${message}</p>`;
      return;
    }

    DOM.menuGrid.innerHTML = items.map(createCardHTML).join("");
  }

  /* =========================================================
     SHEETS: apertura y cierre compartidos
     ========================================================= */
  function openSheet(sheetEl, focusEl) {
    state.openSheetEl = sheetEl;
    state.lastFocused = document.activeElement;

    DOM.overlay.classList.add("is-open");
    sheetEl.classList.add("is-open");
    sheetEl.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-locked");

    requestAnimationFrame(() => focusEl?.focus({ preventScroll: true }));
  }

  function closeSheet() {
    const sheetEl = state.openSheetEl;
    if (!sheetEl) return;

    DOM.overlay.classList.remove("is-open");
    sheetEl.classList.remove("is-open");
    sheetEl.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-locked");
    state.openSheetEl = null;

    if (state.lastFocused && typeof state.lastFocused.focus === "function") {
      state.lastFocused.focus({ preventScroll: true });
    }
  }

  /* =========================================================
     SHEET DE DETALLE DE PRODUCTO
     ========================================================= */
  function openItemSheet(itemId) {
    const item = findItem(itemId);
    if (!item) return;

    state.activeItemId = item.id;

    DOM.itemHero.classList.remove("sheet__hero--fallback");
    DOM.itemImage.src = item.image;
    DOM.itemImage.alt = item.name;
    DOM.itemFallback.textContent = CATEGORY_ICONS[item.category] || "🍽️";

    DOM.itemName.textContent = item.name;
    DOM.itemRating.textContent = `⭐ ${item.rating.toFixed(1)}`;
    DOM.itemPopular.hidden = !item.popular || !item.available;
    DOM.itemPrice.textContent = formatPrice(item.price);
    DOM.itemDesc.textContent = item.description;
    DOM.itemIngredients.innerHTML = item.ingredients
      .map((ingredient) => `<li class="chip">${escapeHTML(ingredient)}</li>`)
      .join("");
    
    DOM.itemSheet.querySelector(".sheet__body").scrollTo(0, 0);
    openSheet(DOM.itemSheet, DOM.itemSheetClose);
  }

  /* =========================================================
     MANEJADORES DE EVENTOS
     ========================================================= */
  function handleCategoryClick(event) {
    const button = event.target.closest(".segmented__btn");
    if (!button) return;

    const { category } = button.dataset;
    if (category === state.category) return;

    state.category = category;
    updateNavState();
    moveIndicator(true);
    scrollActiveTabIntoView();
    renderMenu();
  }

  function handleGridClick(event) {
    const card = event.target.closest(".card");
    if (card) openItemSheet(card.dataset.id);
  }

  function handleImageError(event) {
    if (event.target.tagName !== "IMG") return;
    const media = event.target.closest(".card__media");
    if (media) media.classList.add("card__media--fallback");
  }

  function handleKeydown(event) {
    if (event.key === "Escape") closeSheet();
  }

  function bindEvents() {
    DOM.segmented.addEventListener("click", handleCategoryClick);
    DOM.menuGrid.addEventListener("click", handleGridClick);
    DOM.menuGrid.addEventListener("error", handleImageError, true);

    DOM.overlay.addEventListener("click", closeSheet);
    document.addEventListener("keydown", handleKeydown);
    window.addEventListener("resize", () => moveIndicator(false));

    // Sheet de producto
    DOM.itemSheetClose.addEventListener("click", closeSheet);
    DOM.itemImage.addEventListener("error", () =>
      DOM.itemHero.classList.add("sheet__hero--fallback")
    );
  }

  /* =========================================================
     INICIALIZACIÓN
     ========================================================= */
  function init() {
    renderHeader();
    updateStatus();
    renderNav();
    renderMenu();
    moveIndicator(false);
    bindEvents();

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => moveIndicator(false));
    }

    setInterval(() => {
      renderHeader();
      updateStatus();
    }, 60 * 1000);
  }

  init();
})();