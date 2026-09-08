// Juanan Ruiz — blog personal. JS puro, sin dependencias.
(function () {
  var THEME_KEY = 'jr-theme';

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  function initTheme() {
    var saved = localStorage.getItem(THEME_KEY);
    var theme = saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(theme);
    var btn = document.querySelector('[data-theme-toggle]');
    if (btn) {
      btn.addEventListener('click', function () {
        var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        localStorage.setItem(THEME_KEY, next);
      });
    }
  }

  function initSearchToggle() {
    var toggleBtn = document.querySelector('[data-search-toggle]');
    var box = document.querySelector('[data-search-box]');
    var input = document.querySelector('[data-search-input]');
    if (!toggleBtn || !box) return;
    toggleBtn.addEventListener('click', function () {
      box.classList.toggle('open');
      if (box.classList.contains('open') && input) input.focus();
    });
  }

  function initHomeFiltering() {
    var input = document.querySelector('[data-search-input]');
    var posts = document.querySelectorAll('[data-post]');
    var chips = document.querySelectorAll('[data-category-chip]');
    var tagChips = document.querySelectorAll('[data-tag-chip]');
    var noResults = document.querySelector('[data-no-results]');
    if (!posts.length) return;

    var activeCategory = 'todos';
    var activeTag = null;
    var query = '';

    function applyFilters() {
      var visibleCount = 0;
      posts.forEach(function (post) {
        var matchesCategory = activeCategory === 'todos' || post.dataset.category === activeCategory;
        var tags = (post.dataset.tags || '').split(',');
        var matchesTag = !activeTag || tags.indexOf(activeTag) !== -1;
        var haystack = (post.dataset.title + ' ' + post.dataset.excerpt).toLowerCase();
        var matchesQuery = !query || haystack.indexOf(query) !== -1;
        var visible = matchesCategory && matchesTag && matchesQuery;
        post.classList.toggle('is-hidden', !visible);
        if (visible) visibleCount++;
      });
      if (noResults) noResults.style.display = visibleCount ? 'none' : 'block';
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) { c.classList.remove('active'); });
        chip.classList.add('active');
        activeCategory = chip.dataset.categoryChip;
        applyFilters();
      });
    });

    tagChips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var tag = chip.dataset.tagChip;
        if (activeTag === tag) {
          activeTag = null;
          chip.classList.remove('active');
        } else {
          tagChips.forEach(function (c) { c.classList.remove('active'); });
          activeTag = tag;
          chip.classList.add('active');
        }
        applyFilters();
      });
    });

    var params = new URLSearchParams(window.location.search);

    // Los enlaces de categoría del pie llegan como index.html?categoria=xxx
    var presetCategory = params.get('categoria');
    var presetChip = presetCategory && document.querySelector('[data-category-chip="' + presetCategory + '"]');
    if (presetChip) {
      chips.forEach(function (c) { c.classList.remove('active'); });
      presetChip.classList.add('active');
      activeCategory = presetCategory;
      applyFilters();
    }

    // ?tag=xxx activa un tag de la nube desde otra página (ej. el propio post)
    var presetTag = params.get('tag');
    var presetTagChip = presetTag && document.querySelector('[data-tag-chip="' + presetTag + '"]');
    if (presetTagChip) {
      activeTag = presetTag;
      presetTagChip.classList.add('active');
      applyFilters();
    }

    if (input) {
      input.addEventListener('input', function () {
        query = input.value.trim().toLowerCase();
        applyFilters();
      });

      var presetSearch = params.get('search');
      if (presetSearch) {
        input.value = presetSearch;
        query = presetSearch.trim().toLowerCase();
        var box = document.querySelector('[data-search-box]');
        if (box) box.classList.add('open');
        applyFilters();
      }
    }
  }

  function initSearchNavigation() {
    // On pages without a post list (e.g. post.html), Enter in the search
    // box navigates to the homepage with the query so filtering runs there.
    var input = document.querySelector('[data-search-input]');
    var hasList = document.querySelector('[data-post]');
    if (!input || hasList) return;
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && input.value.trim()) {
        window.location.href = '/?search=' + encodeURIComponent(input.value.trim());
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initSearchToggle();
    initHomeFiltering();
    initSearchNavigation();
  });
})();
