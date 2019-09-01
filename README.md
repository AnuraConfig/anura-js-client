
# anura-js-client
Official Anura client library for Node.js and the browser


### How To Use
``npm i anura-filesystem --save``

First initialize Anura and connect to the server:
```javascript
import config from 'anura-filesystem'
config.initializeConfig("http://anura-server-host:4000", "serviceName", "environmentName", options)
```
After that you can access your config anywhere in your application by: 
```javascript
import config from 'anura-filesystem'
const configData = config.getData()
```

###  Options

passing option paramater to the ``initializeConfig`` function:

| Verible | Info | Type| Default |
| ------ | ------ | ------ | ------ |
| callback | callback to be called when ever the config is updated | ``function`` | ``None``|
| defaultConfig| a default JSON object to be used as config in case of an server  | ``Object``| ``None``|
| process| a function to be called to process the config before updating the client  | ``function`` | ``None``|
| raw | if you want to retrive your config in the raw file (not as a json object)| ``Bool`` |  ``false``
| printLog| if true anura will ``console.log`` it's logs | ``Bool`` |``false`` |
| logger| function to log anrua-filesystem logs| ``function``  |``None`` |
