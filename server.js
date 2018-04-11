var mqtt = require('mqtt');
var argv = require('minimist')(process.argv.slice(2), {
	alias: {
		b: 'url',
		t: 'port',
		u: 'username',
		p: 'password',
		c: 'cmdrun',
		i: 'interval'
	},
	default: {
		b: '218.53.242.111',
		t: '1883',
		c: false,
		i: 3000
	}
});

var thingplug_mqtt_info = {
	host: argv.b,
	port: argv.t,
	username: argv.u,
	password: argv.p,
	clientId: argv.u + '_' + Math.random().toString(16).substr(2, 8),
};

var thingplug_device = require('./routes/tp_devicelist');
var thingplug_params = {
	device_list : thingplug_device,
	sub_topic : 'v1/usr/'+ thingplug_mqtt_info.username +'/down',
	pub_topic : 'v1/usr/'+ thingplug_mqtt_info.username +'/up',
	cmd_run : argv.c,
	cmd_interval : argv.i
};

var mqtt_client = mqtt.connect(thingplug_mqtt_info);
var router = require('./routes/_mqtt')(mqtt_client,thingplug_params);

