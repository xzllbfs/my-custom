import Vue from 'vue'

let _Vue = null

class VueRouter {
  constructor (options) {
    this.mode = options.mode || 'hash'
    this.options = options
    this.routeMap = {}
    this.app = new Vue({
      data: {
        // 当前的默认路径
        current: '/'
      }
    })
  }

  static install (Vue) {
    // 如果插件已经安装直接返回
    // @ts-ignore
    if (VueRouter.install.installed && _Vue === Vue) return

    // @ts-ignore
    VueRouter.install.installed = true
    _Vue = Vue // 将vue构造函数记录到全局变量

    // this在这里代表的是VueRouter类本身，mixin可以改变this指向
    // 把创建Vue的实例传入的router对象注入到Vue实例
    _Vue.mixin({
      beforeCreate () {
        // 判断 router 对象是否已经挂载了 Vue 实例上
        if (this.$option && this.$option.router) {
          // this代表的是每一个vue组件的vue实例
          _Vue.prototype.$router = this.$option.router
          this.$options.router.init()
        }
      }
    })
  }

  init () {
    this.initRouteMap()
    this.initComponents()
    this.initEvent()
  }

  initRouteMap () {
    // 遍历所有的路由信息
    // routes => [{ name: '', path: '', component: }]
    this.options.routes.forEach(route => {
      // 记录路径和组件的映射
      this.routeMap[route.path] = route.component
    })
  }

  initComponents () {
    const _this = this

    _Vue.component('RouterLink', {
      name: 'RouterLink',
      props: {
        to: String
      },
      render (h) {
        if (_this.options.mode === 'hash') {
          return h('a', {
            attrs: {
              href: `#${this.to}`
            }
          }, [this.$slots.default])
        } else {
          return h('a', {
            attrs: {
              href: this.to
            },
            on: {
              click: this.clickhander
            }
          }, [this.$slots.default])
        }
      },
      methods: {
        clickhander (e) {
          // @ts-ignore
          history.pushState({}, '', this.to)
          // @ts-ignore
          this.$router.app.current = this.to
          e.preventDefault()
        }
      }
    })

    _Vue.component('RouterView', {
      name: 'RouterView',
      render (h) {
        // 根据当前路径找到对应的组件，注意 this 的问题
        const cm = _this.routeMap[_this.app.current]
        return h(cm)
      }
    })
  }

  initEvent () {
    // 当路径变化之后，重新获取当前路径并记录到 current
    if (this.options.mode === 'hash') {
      window.addEventListener('hashchange', this.onHashChange.bind(this))
      window.addEventListener('load', this.onHashChange.bind(this))
    }

    if (this.options.mode === 'history') {
      window.addEventListener('popstate', () => {
        this.app.current = window.location.pathname
      })
    }
  }

  onHashChange () {
    this.app.current = window.location.hash.substr(1) || '/'
  }
}

export default VueRouter
