const active = document.querySelector('#limited-available')
const ended = document.querySelector('#limited-ended')
const endedItems = document.querySelector('#limited-ended-items')
const count = document.querySelector('#limited-ended-count')
const sources = [...document.querySelectorAll('[data-timed-source]')].map(element => ({
  element, windows: JSON.parse(element.dataset.windows)
}))

function refreshWindows() {
  const now = Date.now() / 1000
  let next = Infinity
  const available = [], expired = []
  for (const { element, windows } of sources) {
    const isOpen = windows.some(([start, end]) => now >= start && now < end + 1)
    for (const [start, end] of windows) {
      if (start > now) next = Math.min(next, start)
      if (end + 1 > now) next = Math.min(next, end + 1)
    }
    const label = isOpen ? '可獲得' : '已結束'
    const state = element.querySelector('[data-source-state]')
    if (state.textContent !== label) element.open = isOpen
    state.textContent = label
    ;(isOpen ? available : expired).push(element)
  }
  available.sort((a, b) => Number(b.dataset.shop) - Number(a.dataset.shop))
  active.append(...available)
  endedItems.append(...expired)
  ended.hidden = !expired.length
  count.textContent = String(expired.length)
  if (Number.isFinite(next)) window.setTimeout(refreshWindows, Math.min(2147483647, Math.max(50, (next - now) * 1000 + 10)))
}
if (sources.length) refreshWindows()

