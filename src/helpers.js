import { ROUNDS_PER_GAME } from './constants'

export function loadImage (src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

export async function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function loadDetails (celebId) {
  const res = await fetch(`https://cameo-explorer.netlify.app/celebs/${celebId}.json`)
  const details = await res.json()
  await loadImage(details.image)
  return details
}

export function select (celebs, lookup, category) {
  const filtered = celebs.filter((c) => {
    return c.categories.includes(category)
  })

  const seen = new Set()
  const selection = []

  let i = ROUNDS_PER_GAME
  while (i--) {
    const n = Math.random()
    const ai = Math.floor(n * filtered.length)
    const a = filtered[ai]

    // remove a from the array so this person can't be picked again
    remove(filtered, ai)

    let b

    // if this celeb has 'similar' celebs, decide whether to pick one
    const similar = a.similar.filter((id) => !seen.has(id))
    if (similar.length > 0 && Math.random() < 0.75) {
      const id = pickRandom(similar)
      b = lookup.get(id)
    } else {
      b = pickRandom(filtered)
    }

    selection.push({ a, b })

    seen.add(a.id)
    seen.add(b.id)

    // remove b from the array so this person can't be picked again
    remove(filtered, filtered.indexOf(b))
  }

  return selection
}

export function pickRandom (array) {
  const index = Math.floor(array.length * Math.random())
  return array[index]
}

function remove (array, index) {
  // if a 'similar' account was picked, there's no
  // guarantee that it's in the filtered array
  if (index === -1) return

  // this is much faster than splicing the array
  array[index] = array[array.length - 1]
  array.pop()
}
