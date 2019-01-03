var haversine = require('haversine-distance')


     var a = { latitude: 37.8136, longitude: 144.9631 }
            var b = { latitude: 33.8650, longitude: 151.2094 }
 
// 714504.18 (in meters)
console.log(haversine(a, b))