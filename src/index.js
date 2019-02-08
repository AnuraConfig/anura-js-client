import { GRAPHQL_PATH, CONFIG_UPDATE_EVENT } from './const'
import io from 'socket.io-client'
import syncRequest from 'sync-request'
import request from 'request'

function getSocketOptions(serviceId, environment) {
    return {
        query: `serviceId=${serviceId}&environment=${environment}`
    }
}

const query = /* GraphQL */`
 query String($serviceId: String, $environment: String, $raw: Boolean){
	latestConfig(serviceId: $serviceId, environment: $environment, raw: $raw){
        data
    }
}`

function log(message, level) {
    console.log(`Anura [${level}]: ${message}`)
}

function getLogger(isLog) {
    if (isLog)
        return { log }
    return { log: () => { } }
}

function defaultProcessData(data) {
    return data
}

const getDefaultOptions = ({ printLog }) => {
    return {
        logger: getLogger(printLog),
        raw: false,
        process: defaultProcessData
    }
}

class ConfigManager {
    initializeConfig(url, serviceId, environment, options = {}) {
        this.options = Object.assign({}, getDefaultOptions(options), options)
        this.serviceId = serviceId
        this.environment = environment
        this.gqlClient = url + GRAPHQL_PATH
        this.initializeSocket(url, serviceId, environment)
        this.getSyncConfigData()
    }
    initializeSocket(url, serviceID, environment) {
        this.socket = io(url, getSocketOptions(serviceID, environment))
        this.socket.on(CONFIG_UPDATE_EVENT, this.getConfigData)
    }
    getSyncConfigData() {
        this.options.logger.log("getting the intit config ", "info")
        const res = syncRequest("POST", this.gqlClient, {
            json: { query, variables: { environment: this.environment, serviceId: this.serviceId } }
        })
        this._loadData(JSON.parse(res.getBody('utf8')))
    }

    getConfigData() {
        request.post(this.gqlClient, {
            json: { query, variables: { environment: this.environment, serviceId: this.serviceId } }
        }, (error, response, body) => {
            this.options.logger.log(error, "error")
            this._loadData(body)
        })
    }

    getData() {
        return this.data
    }

    _loadData(body) {
        let data
        if (this.options.raw)
            data = body.data.latestConfig.data
        else
            data = JSON.parse(body.data.latestConfig.data)
        this.data = this.options.process(data)
        if (this.options.callback) this.options.callback(this.data)
    }
}

export default new ConfigManager()