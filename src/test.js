import config from './index'

const options = {
    raw: false,
    printLog: true,
    callback: console.log,
    defaultConfig: {
        test: "default config"
    }
}

config.initializeConfig('http://localhost:4000', "testService", "prod", options)
let data = config.getData()
console.log("===========================")
console.log(data)
console.log("===========================")
