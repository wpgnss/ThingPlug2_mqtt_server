/*
 * ThingPlug descriptor 
*/

module.exports = {

  "format": "json",
  "jsonForm": {
    "telemetries": [
      {
        "name": "temperature",
        "tag": "temperature"
      }
    ],
    "attributes": [
      {
        "name": "LED",
        "commandable": true,
        "commandableValues": [
          "on",
          "off"
        ]
      }
    ]
  }
  
};