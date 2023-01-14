// 打包配置

import json from "@rollup/plugin-json";
import typescript from "rollup-plugin-typescript2"; // 解析ts
import nodeResolve from "@rollup/plugin-node-resolve"; // 解析插件
import path from 'path'

const packagesDir = path.resolve(__dirname, 'packages')
// 获取需要打包的包
const packageDir = path.resolve(packagesDir, process.env.TARGET)

const resolve = p => path.resolve(packageDir, p)