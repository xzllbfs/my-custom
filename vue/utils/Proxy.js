// 模拟 Vue 中的 data 选项
let data = {
  msg: 'hello',
  count: 10
}

// 模拟vue实例
let vm = new Proxy(data, {
  // 执行代理行为的函数
  // 当访问vm的成员会执行
  get (target, key) {
    return target[key]
  },
  // 当设置 vm 的成员会执行
  set (target, key, newValue) {
    if (newValue === target[key]) {
      return
    }
    target[key] = newValue
    // 数据更改，更新 DOM 的值
    document.querySelector('#app').textContent = target[key]
  }
})
// 测试
vm.msg = 'Hello word'
console.log(vm.msg)