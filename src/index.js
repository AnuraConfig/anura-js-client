import { GRAPHQL_PATH, CONFIG_UPDATE_EVENT } from './const'
import { GraphQLClient } from 'graphql-request'
import io from 'socket.io-client'


function getSocketOptions(serviceId, environment) {
    return {
        query: `serviceId=${serviceId}&environment=${environment}`
    }
}
const query = /* GraphQL */`
 query String($serviceId: String, $environment: String){
	latestConfig(serviceId: $serviceId, environment: $environment)
}`


class ConfigManager {
    constructor() {

    }
    async initializeConfig(url, serviceId, environment, options) {
        this.options = options || {}
        this.serviceId = serviceId
        this.environment = environment
        this.gqlClient = new GraphQLClient(url + GRAPHQL_PATH)
        this.initializeSocket(url, serviceId, environment)
        await this.getConfigData()
    }
    initializeSocket(url, serviceID, environment) {
        this.socket = io(url, getSocketOptions(serviceID, environment))
        this.socket.on(CONFIG_UPDATE_EVENT, this.getConfigData)
    }
    async getConfigData() {
        const data = await this.gqlClient.request(query, { environment: this.environment, serviceId: this.serviceId })
        this.data = JSON.parse(data.latestConfig)
        if (this.options.callback) this.options.callback()
    }
    getData() {
        return this.data
    }

}
export default new ConfigManager()