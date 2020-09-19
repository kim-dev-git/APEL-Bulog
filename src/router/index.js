import Vue from 'vue'
import VueRouter from 'vue-router'
import { auth } from '../firebase'

function lazyLoad(view){
  return() => import(`@/views/${view}.vue`)
}

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: lazyLoad('Dashboard'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/masuk',
    name: 'SignIn',
    component: lazyLoad('SignIn'),
  },
  {
    path: '/daftar',
    name: 'SignUp',
    component: lazyLoad('SignUp'),
  },
  {
    path: '/surat-masuk',
    name: 'MailIn',
    component: lazyLoad('MailIn'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/surat-masuk/:id/disposisi',
    name: 'MailInDisposition',
    component: lazyLoad('MailInDisposition'),
    props: true,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/surat-keluar',
    name: 'MailOut',
    component: lazyLoad('MailOut'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/surat-keluar/:id',
    name: 'MailOutDetail',
    props: true,
    component: lazyLoad('MailOutDetail'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/fax-masuk',
    name: 'FaxIn',
    component: lazyLoad('FaxIn'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/fax-masuk/:id/disposisi',
    name: 'FaxInDisposition',
    component: lazyLoad('FaxInDisposition'),
    props: true,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/fax-keluar',
    name: 'FaxOut',
    component: lazyLoad('FaxOut'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/fax-keluar/:id',
    name: 'FaxOutDetail',
    props: true,
    component: lazyLoad('FaxOutDetail'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/nota-intern',
    name: 'InternalNotes',
    component: lazyLoad('InternalNotes'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/nota-intern/:id/disposisi',
    name: 'InternalNotesDisposition',
    component: lazyLoad('InternalNotesDisposition'),
    props: true,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/surat-perintah',
    name: 'Warrants',
    component: lazyLoad('Warrants'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/perjanjian-kerja',
    name: 'EmploymentAgreement',
    component: lazyLoad('EmploymentAgreement'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth)

  if (requiresAuth && !auth.currentUser) {
    next('/masuk')
  } else {
    next()
  }
})

export default router
