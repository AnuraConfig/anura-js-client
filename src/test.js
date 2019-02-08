import config from './index'
const options = {
    raw: true,
    printLog: true
}

config.initializeConfig('http://localhost:4000', "34eb75d0-5f8a-47cd-8e05-042ada1ba8e7", "adsda", options)
let data = config.getData()
console.log("===========================")
console.log(data)
console.log("===========================")
