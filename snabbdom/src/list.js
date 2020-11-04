import { h, init } from 'snabbdom'
import style from 'snabbdom/modules/style'
import eventlisteners from 'snabbdom/modules/eventlisteners'

let patch = init([
  style,
  eventlisteners
])

const tab = h('ul', [
  h('li', 'Rank'),
  h('li', 'Title'),
  h('li', 'Description')
])

const addBtn = h('button', {
  on: {
    click: addItem
  }
}, 'Add')

const vnode = h('div.container', [
  tab,
  addBtn,
  h('ul.content', [])
])

let app = document.querySelector('#app')
let oldVnode = patch(app, vnode)


let index = 0
function addItem () {
  index ++
  const newNode = h('div.container', [
    tab,
    addBtn,
    h('ul.content', [ h('li', [
      h('span', index + 'Rank'),
      h('button', {
        on: {
          click: delItem
        }
      }, '删除')
    ]) ])
  ])
  patch(oldVnode, newNode)
}

function delItem () {
  alert('删除索引如何传递？')
}
