
class Vue {
    $data: any

    constructor(instance) {
        this.$data = instance.$data
        Observer(this.$data)
        complile(instance.el, this)
    }
}

// 数据劫持 - 监听实例数据
function Observer(rawObject) {
    // 递归终止条件
    if (!rawObject || typeof rawObject !== 'object') return
    const deps = new Dep()
    Object.keys(rawObject).forEach(key => {
        let value = rawObject[key]
        Observer(value) // 递归 - 子属性数据劫持
        Object.defineProperty(rawObject, key, {
            enumerable: true,
            configurable: true,
            get() {
                Dep.dep && deps.addSub(Dep.dep)
                return value
            },
            set(newValue) {
                value = newValue
                Observer(newValue)
                deps.notify()
            }
        })
    })
}

// HTML解析，渲染函数
function complile(el, vm) {
    vm.$el = document.querySelector(el)
    const fragment = document.createDocumentFragment()
    let child
    while (child = vm.$el.firstChild) {
        fragment.append(child)
    }
    fragmentCompile(fragment)
    function fragmentCompile(node) {
        const pattern = /\{\{\s*(\S+)\s*\}\}/
        if(node.nodeType === 3) {
            const res = pattern.exec(node.nodeValue)
            const nodeValue = node.nodeValue
            if(res) {
                const arr = res[1].split('.')
                // 嵌套的 key 值获取
                const value = arr.reduce((prev, current) => prev[current], vm.$data)
                new Watcher(vm, res[1], newValue => {
                    node.nodeValue = nodeValue.replace(pattern, newValue )
                })
            }
            return
        }
        node.childNodes.forEach(child => {
            fragmentCompile(child)
        })
    }
    vm.$el.append(fragment)
}

// 依赖（观察者） - 收集/通知订阅者
class Dep {
    subscribers: any[]
    static dep: any
    constructor() {
        this.subscribers = []
    }
    // 添加订阅者
    addSub(sub) {
        this.subscribers.push(sub)
    }
    // 通知订阅者
    notify() {
        this.subscribers.forEach(sub => sub.update())
    }
}

// 订阅者
class Watcher {
    vm: any
    key: any
    callback: any
    constructor(vm, key, callback) {
        this.vm = vm
        this.key =key
        this.callback = callback
        // 临时属性，触发getter
        Dep.dep = this
        key.split('.').reduce((prev, current) => prev[current], vm.$data)
        Dep.dep = null
    }
    update() {
        const value = this.key.split('.').reduce((prev, current) => prev[current], this.vm.$data)
        this.callback(value)
    }
}