import { GRAPHQL_PATH, CONFIG_UPDATE_EVENT } from './const'
import io from 'socket.io-client'
import syncRequest from 'sync-request'
import request from 'request'

function getSocketOptions(serviceName, environment) {
    return {
        query: `serviceName=${serviceName}&environment=${environment}`
    }
}

const query = /* GraphQL */`
 query String($serviceName: String, $environment: String, $raw: Boolean){
	latestConfig(serviceName: $serviceName, environment: $environment, raw: $raw){
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
        process: defaultProcessData,
        requestTimeout: 1000
    }
}

class ConfigManager {
    initializeConfig = (url, serviceName, environment, options = {}) => {
        console.log(options)
        this.options = Object.assign({}, getDefaultOptions(options), options)
        this.serviceName = serviceName
        this.environment = environment
        this.gqlClient = url + GRAPHQL_PATH
        this.initializeSocket(url, serviceName, environment)
        this.getSyncConfigData()
    }
    initializeSocket = (url, serviceName, environment) => {
        this.socket = io(url, getSocketOptions(serviceName, environment))
        this.socket.on(CONFIG_UPDATE_EVENT, this.getConfigData)
    }

    getSyncConfigData = () => {
        const { environment, options, serviceName, raw } = this
        options.logger.log("getting the init config ", "info")
        try {
            const res = syncRequest("POST", this.gqlClient, {
                json: { query, variables: { environment, serviceName, raw: !!raw } }
            }, { timeout: options.requestTimeout })
            this._loadData(JSON.parse(res.getBody('utf8')))
        } catch (e) {
            this._errorLoadingConfig(e)
        }
    }

    getConfigData = () => {
        const { environment, options, serviceName, raw, _loadData } = this
        request.post(this.gqlClient, {
            json: { query, variables: { environment, serviceName, raw: !!raw } }
        }, (error, response, body) => {
            if (error)
                options.logger.log(error, "error")
            _loadData(body)
        })
    }

    getData = () => {
        return this.data
    }

    _loadData = (body) => {
        if (!body.data.latestConfig) return {}
        let data
        if (this.options.raw)
            data = body.data.latestConfig.data
        else
            data = JSON.parse(body.data.latestConfig.data)
        this.data = this.options.process(data)
        if (this.options.callback) this.options.callback(this.data)
    }

    _errorLoadingConfig = (error) => {
        this.options.logger.log("failed retrieving anura initial config: " + error.message, "error")
        if (this.options.defaultConfig)
            this._loadDefaultConfig()
        else
            throw error
    }

    _loadDefaultConfig = () => {
        this.options.logger.log("using default config", "info")
        this.data = this.options.process(this.options.defaultConfig)
        if (this.options.callback) this.options.callback(this.data)
    }
}

export default new ConfigManager()