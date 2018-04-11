module.exports = function(mqtt_client, thingplug_params)
{
	//ThingPlug 2.0 MQTT Client
	var descriptor = require('./tp_descriptor')
	
	mqtt_client.on('connect', function () {
		mqtt_client.subscribe(thingplug_params.sub_topic, function(){
			console.log("subscribe topic");
		});
		
		setDelist();
		setEnlist();
		
		if(thingplug_params.cmd_run){
			cmdrun('tp_reset', thingplug_params.cmd_interval);
		}
	});

	function setEnlist(){
		for(var i=0; thingplug_params.device_list.devicelist[i]!=undefined; i++){		
			if(thingplug_params.device_list.devicelist[i].status == 'running'){
				var cmd_id = thingplug_params.device_list.devicelist[i].id;
				var service = thingplug_params.device_list.service;
				var device = thingplug_params.device_list.devicelist[i].name;
				var enlist_msg ={
					"cmd" : "enlist",
					"serviceName": service,
					"deviceName": device,
					"isTargetAll" : false,
					"telemetry": ["*"],
					"attribute":["*"],
					"cmdId": cmd_id
				};
				
				mqtt_client.publish(thingplug_params.pub_topic, JSON.stringify(enlist_msg));
				
				console.log("Enlist " + device);
			}
		}
	};
	
	function setDelist(){
		
		for(var i=0; thingplug_params.device_list.devicelist[i]!=undefined; i++){
				
			if(thingplug_params.device_list.devicelist[i].status == 'stop'){
				var cmd_id = thingplug_params.device_list.devicelist[i].id;
				var service = thingplug_params.device_list.service;
				var device = thingplug_params.device_list.devicelist[i].name;
				var enlist_msg ={
					"cmd" : "delist",
					"serviceName": service,
					"deviceName": device,
					"isTargetAll" : false,
					"telemetry": ["*"],
					"attribute":["*"],
					"cmdId": cmd_id
				};
				
				mqtt_client.publish(thingplug_params.pub_topic, JSON.stringify(enlist_msg));
				
				console.log("Delist " + device);
			}
		}
	};
	
	mqtt_client.on('message', function (topic, message){
		
		try{
		  var jsonobj = JSON.parse(message);
		}catch (e){
			console.log("not json");
		}
		
		if(!isCmdMsg(jsonobj)){
			if(descriptor.format == 'json') {
				for(var i=0; descriptor.jsonForm.telemetries[i]!=undefined; i++){
					var cmdId = jsonobj.cmdId;
					var key = descriptor.jsonForm.telemetries[i].name;
					var value = jsonobj[key];
					if(value){
						handleMsgTelemetry(cmdId, key, value);
					}
				}
				
				for(var i=0; descriptor.jsonForm.attributes[i]!=undefined; i++){
					var cmdId = jsonobj.cmdId;
					var key = descriptor.jsonForm.attributes[i].name;
					var value = jsonobj[key];
					if(value){
						handleMsgAttribute(cmdId, key, value);
					}
				}
			}
		}
		else {
			console.log(jsonobj.result, jsonobj.cmdId);
		}
	});
	
	function isCmdMsg(message){
		return message.result;
	};
	
	function handleMsgAttribute(cmdId, key, value){
		console.log('Change status : '+ cmdId + ', ' + key + ', ' + value[0] + ', ' + value[1]);
	};

	function handleMsgTelemetry(cmdId, key, value){
		
		console.log('telemetry data : '+ cmdId + ', ' + key + ', ' + value[0] + ', ' + value[1]);
	};
	
	function cmdrun(method, interval){
		setInterval( function(){
			for(var i=0; thingplug_params.device_list.devicelist[i]!=undefined; i++){
				
				if(thingplug_params.device_list.devicelist[i].status == 'running'){
					var cmd_id = thingplug_params.device_list.devicelist[i].id;
					var service = thingplug_params.device_list.service;
					var device = thingplug_params.device_list.devicelist[i].name;
					var rpc_msg = {
						"cmd":"jsonRpc",
						"cmdId": cmd_id,
						"serviceName": service,
						"deviceName":device,
						"rpcReq":{
							"jsonrpc":"2.0",
							"method": method,
							"params": ["test1234"],
							"id":1
						},
						"rpcMode":"oneway"	
					};
					
					mqtt_client.publish(thingplug_params.pub_topic, JSON.stringify(rpc_msg));
				}
			}			
		},interval); 
	}
}