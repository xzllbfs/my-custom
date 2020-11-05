import { h, init } from 'snabbdom'
import style from 'snabbdom/modules/style'
import eventlisteners from 'snabbdom/modules/eventlisteners'

let patch = init([style, eventlisteners])

let movies = [
  { id: 1, rank: 8, name:'The Good, the Bad and the Ugly', description: 'A bounty hunting scam joins two men in an uneasy alliance against a third in a race to find a fortune in gold buried in a remote cemetery.' },
  { id: 2, rank: 7, name:'12 Angry Men', description: 'A dissenting juror in a murder trial slowly manages to convince the others that the case is not as obviously clear as it seemed in court.' },
  { id: 3, rank: 10, name:'Fight Club', description: 'An insomniac office worker looking for a way to changes his life crosses paths with a devil-may-care soap maker and they form an underground fight club that evolves into something much, much more...' }
]

let lastId = movies[movies.length - 1] ? movies[movies.length - 1].id + 1 : 1;

let oldVnode = null;
function view (data) {
  return h('div.container', [
    h('h1', 'Top 10 movies'),
    h('div.header', [
      h('span.left', 'Sort by:'),
      h('ul.tab.left', [
        h('li.btn', {
          on: {
            click: [showItem, 'rank']
          }
        }, 'Rank'),
        h('li.btn', {
          on: {
            click: [showItem, 'name']
          }
        }, 'Title'),
        h('li.btn', {
          on: {
            click: [showItem, 'description']
          }
        }, 'Description')
      ]),
      h('span.btn.right', {
        on: {
          click: addItem
        }
      }, 'Add'),
    ]),
    h(
      'ul.content',
      data.map(item => {
        return h(
          'li',
          {
            key: item.id
          },
          [
            item.rank ? h('span.rank', item.rank) : null,
            item.name ? h('span.name', item.name) : null,
            item.description ? h('span.description', item.description) : null,
            h('span.right.close', {
              on: {
                click: [delItem, item.id]
              }
            }, 'x')
          ]
        )
      })
    )
  ])
}

function addItem () {
  lastId ++
  movies.push({
    name: 'movie Title',
    rank: Math.floor(Math.random() * 10),
    description: 'this is a description',
    id: lastId
  })
  oldVnode = patch(oldVnode, view(movies))
}

function delItem (id) {
  movies = movies.filter((movie) => {
    if (movie.id !== id) {
      return movie
    }
    return null
  })
  oldVnode = patch(oldVnode, view(movies))
}

let showKey = ''
function showItem (key) {
  let filterMovies = movies.map((movie) => {
    let obj = {}
    obj.id = movie.id
    obj[key] = movie[key]
    if (key !== showKey) {
      return obj
    } else {
      return movie
    }
  })
  oldVnode = patch(oldVnode, view(filterMovies))
  showKey = key === showKey ? '' : key
}

let app = document.querySelector('#app')
oldVnode = patch(app, view(movies))
