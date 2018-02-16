// MathQuill requires jquery. For public, we load through CDN.
// For tests, we need to prove it as a global variable.
import $ from 'jquery'
global.$ = global.jQuery = $
