
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


### Config update:
there's 3 options to use a config with anura:
1. call the ``getData()`` every time you want to access the config , this will use the last cached config that was updated:
	```javascript
	import config from 'anura-filesystem'
	const configData = config.getData()
	```
2.	pass a callback function the the options parameter in the ``initializeConfig`` function:
	```javascript
	import config from 'anura-filesystem'
	
	function updateConfig(configData){
		//..do something
	}
	const options = {
		callback:updateConfig
	}
	config.initializeConfig("http://anura-server-host:4000", "serviceName", "environmentName", options)
	```
3. call ``config.subscribe()`` you can call this function from any where in your application and it will subscribe to change in the config and will be called when the config recive update. exaclly like passing callback to the options in .2 but can be done from anywhere 
	```javascript
	import config from 'anura-filesystem'
	
	function updateConfig(configData){
		//..do something
	}
	
	config.subscribe(updateConfig)
	```