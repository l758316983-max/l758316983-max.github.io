(() => {
  const root = document.documentElement
  const storageKey = 'snhz-wiki-appearance'
  const system = matchMedia('(prefers-color-scheme: dark)')
  let choice

  function savedChoice() {
    try { return localStorage.getItem(storageKey) }
    catch { return null }
  }

  function update() {
    const night = (choice ?? (system.matches ? 'night' : 'day')) === 'night'
    root.dataset.wikiAppearance = night ? 'night' : 'day'
    for (const button of document.querySelectorAll('[data-appearance-toggle]')) {
      button.setAttribute('aria-pressed', String(night))
    }
  }

  function updateLanguageLinks() {
    for (const link of document.querySelectorAll('[data-wiki-language-link]')) {
      const canonical = new URL(link.getAttribute('href'), location.origin)
      canonical.search = location.search
      canonical.hash = location.hash
      link.href = canonical.href
    }
  }

  choice = savedChoice()
  update()
  system.addEventListener('change', update)
  addEventListener('storage', event => {
    if (event.key === storageKey) {
      choice = savedChoice()
      update()
    }
  })
  document.addEventListener('click', event => {
    if (event.target.closest?.('[data-appearance-toggle]')) {
      choice = root.dataset.wikiAppearance === 'night' ? 'day' : 'night'
      try { localStorage.setItem(storageKey, choice) } catch {}
      update()
    }
  })
  function sync() {
    update()
    updateLanguageLinks()
  }
  document.addEventListener('DOMContentLoaded', sync)
  addEventListener('pageshow', sync)
  addEventListener('hashchange', updateLanguageLinks)
  addEventListener('wiki:route-changed', () => requestAnimationFrame(sync))
})()
