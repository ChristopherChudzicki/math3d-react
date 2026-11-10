// Scene-only rendering for the math3d-next migration audit's headless
// screenshots, enabled by a `frame` query parameter (e.g. `/<key>?frame`). It
// mirrors math3d-next's `/app/frame/:sceneKey`: no editor UI, and
// `data-scene-ready="true"` on #mathbox once drawn, or `data-scene-error` if
// the scene didn't load. Delete this file and its call sites after the cutover.
// It takes `mathbox` as an argument because importing MathBoxScene here would
// form a cycle through MathBox.js.

export const isFrameMode = new URLSearchParams(window.location.search).has('frame')

// The quiet period of math3d-next's stillReadiness.ts, so both apps wait alike:
// https://github.com/ChristopherChudzicki/math3d-next/blob/main/packages/app/src/features/viewport/mathbox/stillReadiness.ts
const QUIET_MS = 500

// `loaded` resolves to a truthy value once the scene is in the store.
export function renderFrame(mathbox, loaded) {
  const element = document.getElementById('mathbox')
  // #mathbox is fixed but has no offsets, so it would sit below #root.
  element.style.top = '0'
  element.style.left = '0'
  const markError = () => { element.dataset.sceneError = 'true' }
  loaded.then(
    scene => scene ? markReadyWhenDrawn(mathbox, element) : markError(),
    markError
  )
}

// React 16 commits the loaded scene synchronously inside the dispatch, so its
// objects are already in mathbox's warmup queue when this starts.
function markReadyWhenDrawn(mathbox, element) {
  let lastNonEmpty = performance.now()
  requestAnimationFrame(function tick() {
    const now = performance.now()
    if (mathbox._context.getPending() > 0) {
      lastNonEmpty = now
    }
    if (now - lastNonEmpty >= QUIET_MS) {
      mathbox.three.Loop.stop()
      // On slow frames the splash's fade-out can still be running.
      element.querySelector('.mathbox-loader').style.display = 'none'
      element.dataset.sceneReady = 'true'
      return
    }
    requestAnimationFrame(tick)
  } )
}
