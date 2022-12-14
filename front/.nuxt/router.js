import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _68e2ad91 = () => interopDefault(import('../pages/profile.vue' /* webpackChunkName: "pages/profile" */))
const _dc172040 = () => interopDefault(import('../pages/signup.vue' /* webpackChunkName: "pages/signup" */))
const _528e29df = () => interopDefault(import('../pages/hashtag/_id.vue' /* webpackChunkName: "pages/hashtag/_id" */))
const _9ac18dda = () => interopDefault(import('../pages/post/_id.vue' /* webpackChunkName: "pages/post/_id" */))
const _afc59d84 = () => interopDefault(import('../pages/user/_id.vue' /* webpackChunkName: "pages/user/_id" */))
const _070ac43a = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/profile",
    component: _68e2ad91,
    name: "profile"
  }, {
    path: "/signup",
    component: _dc172040,
    name: "signup"
  }, {
    path: "/hashtag/:id?",
    component: _528e29df,
    name: "hashtag-id"
  }, {
    path: "/post/:id?",
    component: _9ac18dda,
    name: "post-id"
  }, {
    path: "/user/:id?",
    component: _afc59d84,
    name: "user-id"
  }, {
    path: "/",
    component: _070ac43a,
    name: "index"
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}
