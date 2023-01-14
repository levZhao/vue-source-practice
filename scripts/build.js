// 打包配置
const fs = require('fs-extra')
const execa = require('execa')

const dirs = fs.readdirSync('packages').filter(file => fs.statSync(`packages/${file}`).isDirectory())

// 并行打包
function runParaller(dirs, fn) {
    let result = []
    for(let item of dirs) {
        result.push(fn(item))
    }

    return Promise.all(result)
}
async function build(target) {
    // -c 表示执行 rollup 配置
    // { stdio: 'inherit' } 子进程输出在主进程打印
    await execa('rollup', ['-c', '--environment', `TARGET:${target}`], { stdio: 'inherit' })
}
runParaller(dirs, build).then(() => {
    console.log('success')
})