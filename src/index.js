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
    console.log(`Anura (${level}):   ${message}`)
}

const defaultOptions = {
    logger: { log }
}
class ConfigManager {
    initializeConfig(url, serviceId, environment, options = defaultOptions) {
        this.options = options
        this.serviceId = serviceId
        this.environment = environment
        this.gqlClient = url + GRAPHQL_PATH
        this.logger = options.logger
        this.initializeSocket(url, serviceId, environment)
        this.getSyncConfigData()
    }
    initializeSocket(url, serviceID, environment) {
        this.socket = io(url, getSocketOptions(serviceID, environment))
        this.socket.on(CONFIG_UPDATE_EVENT, this.getConfigData)
    }
    getSyncConfigData() {
        const res = syncRequest("POST", this.gqlClient, {
            json: { query, variables: { environment: this.environment, serviceId: this.serviceId } }
        })
        const data = JSON.parse(res.getBody('utf8')).data;
        this.data = JSON.parse(data.latestConfig)
        if (this.options.callback) this.options.callback(this.data)
    }

    getConfigData() {
        request.post(this.gqlClient, {
            json: { query, variables: { environment: this.environment, serviceId: this.serviceId } }
        }, (error, response, body) => {
            this.logger.log(error, "error")
            if (this.options.raw)
                this.data = body.data.latestConfig
            else
                this.data = JSON.parse(body.data.latestConfig)
            if (this.options.callback) this.options.callback(this.data)
        })
    }

    getData() {
        return this.data
    }
}

export default new ConfigManager()