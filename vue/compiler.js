// 负责解析指令/插值表达式
class Compiler {
  constructor (vm) {
    this.el = vm.$el
    this.vm = vm
    this.addHandler(vm.methods)
    // 编译模板
    this.compile(this.el)
  }
  addHandler (methods) {
    Object.keys(methods).forEach(name => {
      this[name] = methods[name]
    })
  }
  // 编译模板，处理文本节点和元素节点
  compile (el) {
    let childNodes = el.childNodes
    Array.from(childNodes).forEach(node => {
      // 判断是文本节点还是元素节点，处理文本节点
      if (this.isTextNode(node)) {
        this.compileText(node)
      } else if (this.isElementNode(node)) {
        // 处理元素节点
        this.compileElement(node)
      }

      // 判断node节点，是否有子节点，如果有子节点，要递归调用compile
      if (node.childNodes && node.childNodes.length) {
        this.compile(node)
      }
    })
  }
  
  // 编译文本节点，处理差值表达式
  compileText (node) {
    // 正则匹配差值表达式 {{  msg }}
    let reg = /\{\{(.+?)\}\}/
    // 文本节点的内容
    let value = node.textContent
    if (reg.test(value)) {
      let key = RegExp.$1.trim()
      node.textContent = value.replace(reg, this.vm[key])

      // 创建watcher对象，当数据改变更新视图
      new Watcher(this.vm, key, (newValue) => {
        node.textContent = newValue
      })
    }
  }

  // 负责编译元素的指令，处理 v-text 的首次渲染，处理 v-model 的首次渲染
  compileElement (node) {
    // 遍历所有的属性节点的属性node.attributes
    Array.from(node.attributes).forEach(attr => { // 注意：这里使用箭头函数是为了不改变this指向
      // 判断是否是指令
      let attrName = attr.name
      if (this.isDirective(attrName)) {
        // v-text --> text
        attrName = attrName.substr(2)
        let key = attr.value
        if (attrName === 'on') {
          this.triggerHandler(node, key)
        } else {
          this.update(node, key, attrName)
        }
      }
    })
  }

  triggerHandler (node, key) {
    node.addEventListener('click', () => {
      this[key]()
    })
  }

  update (node, key, attrName) {
    let updateFn = this[attrName + 'Updater']
    // 改变this指向，将传入watcher中的this指向Compiler类
    updateFn && updateFn.call(this, node, this.vm[key], key)
  }

  htmlUpdater (node, value, key) {
    node.innerHTML = value
    new Watcher(this.vm, key, (newValue) => {
      node.innerHTML = newValue
    })
  }

  // 处理 v-text 指令
  textUpdater (node, value, key) {
    node.textContent = value
    
    // 创建watcher对象，当数据改变更新视图
    new Watcher(this.vm, key, (newValue) => {
      node.textContent = newValue
    })
  }

  // v-model
  modelUpdater (node, value, key) {
    node.value = value
    
    // 创建watcher对象，当数据改变更新视图
    new Watcher(this.vm, key, (newValue) => {
      node.value = newValue
    })
 
    // 双向绑定
    node.addEventListener('input', () => {
      this.vm[key] = node.value
    })
  }

  // 判断元素属性是否是指令
  isDirective (attrName) {
    return attrName.startsWith('v-')
  }
  // 判断节点是否是文本节点
  isTextNode (node) {
    return node.nodeType === 3
  }
  // 判断节点是否是元素节点
  isElementNode (node) {
    return node.nodeType === 1
  }
}