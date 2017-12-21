/*eslint no-extend-native: 0 */
// we need to add a method to Number
/** Converts numeric degrees to radians */
if (typeof (Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  };
}

export const distanceFromLocation = (coords1, coords2) => {
  var R = 6371; // Radius of the earth in km
  var dLat = (coords2.lat - coords1.lat).toRad();  // Javascript functions in radians
  var dLon = (coords2.lon - coords1.lon).toRad();
  var a = (Math.sin(dLat / 2) * Math.sin(dLat / 2)) +
    (Math.cos(coords1.lat.toRad()) * Math.cos(coords2.lat.toRad()) * Math.sin(dLon / 2) * Math.sin(dLon / 2));
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = parseInt(R * c * 1000); // Distance in meter
  return d;
};

const _sortByDistance = (a, b) => {
  if (!a.distance) {
    return 1;
  }
  if (!b.distance) {
    return -1;
  }
  if (a.distance > b.distance) {
    return 1;
  }
  if (a.distance < b.distance) {
    return -1;
  }
  // a is equal to b
  return 0;
};

// get user location: use GPS location. If there is no GPS, use building location
const _getLocation = (building, isUseMyLocation) => {
  return new Promise((resolve, reject) => {
    // Check if feature use_my_location_setting is on
    if (window.__ENV__.NODE_ENV === 'development' || process.env.NODE_ENV === 'test' || window.__ENV__['use_my_location_setting']) {
      if (!isUseMyLocation) {
        return resolve({
          lon: building.geolocation[0],
          lat: building.geolocation[1]
        });
      }
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        return resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
      }, (err) => {
        let isBlockedLocation = false;
        if (err.code === 1 && err.message === 'User denied Geolocation') {
          isBlockedLocation = true;
        }
        return resolve({
          lon: building.geolocation[0],
          lat: building.geolocation[1],
          isBlockedLocation: isBlockedLocation
        });
      }, {timeout: 30000, enableHighAccuracy: true, maximumAge: 75000});
    } else {
      return resolve({
        lon: building.geolocation[0],
        lat: building.geolocation[1]
      });
    }
  });
};

// convert meters to km if the distance is > 1500m
// param is the distance in meters
export const convertDistance = (param) => {
  if (param) {
    if (param > 1500) {
      // converts meters to km get 2 decimal places
      const converted = Math.round((param / 1000) * 100) / 100;
      return converted + ' km';
    } else {
      return param + ' m';
    }
  }
  return '∞ m';
};

// distances from user to building's services
export const calculateServicesDistance = async (building, isUseMyLocation) => {
  const coords1 = await _getLocation(building, isUseMyLocation);
  const services = building.services.map(svc => {
    if (!svc.geolocation || !svc.address) {
      return svc;
    }
    const coords2 = {
      lon: svc.geolocation[0],
      lat: svc.geolocation[1]
    };
    svc.distance = distanceFromLocation(coords1, coords2);
    return svc;
  });
  // sort services by distance
  services.sort(_sortByDistance);

  return {
    services: services,
    isBlockedLocation: coords1.isBlockedLocation
  };
};

// distances from user to stops
export const calculateStopsDistance = async (building, stops, isUseMyLocation) => {
  const coords1 = await _getLocation(building, isUseMyLocation);
  const result = stops.map(stop => {
    if (!stop.coord || !stop.coord.length) {
      return stop;
    }
    const coords2 = {
      lon: stop.coord[0],
      lat: stop.coord[1]
    };
    stop.distance = distanceFromLocation(coords1, coords2);
    return stop;
  });
  // sort stops by distance
  result.sort(_sortByDistance);
  return {
    stops: result,
    isBlockedLocation: coords1.isBlockedLocation
  };
};

/** Get user current location
* Input: isUseMyLocation from user config
* Output:
* location: {lat: '', lon: ''} if geolocation available and isUseMyLocation == true
* > 0: geoloation error
* 0: isUseMyLocation == false
* -1: if geolocation is not supported
* -2: Browser denied location
*/
export const getUserLocation = (isUseMyLocation) => {
  return new Promise((resolve, reject) => {
    if (isUseMyLocation !== undefined && !isUseMyLocation) {
      return reject({
        errorCode: 0,
        errorMsg: 'Not use current location'
      });
    }

    if (!navigator.geolocation) {
      return reject({
        errorCode: -1,
        errorMsg: 'geolocation is not available'
      });
    }

    navigator.geolocation.getCurrentPosition((position) => {
      return resolve(position);
    }, (err) => {
      if (err.code === 1 && err.message === 'User denied Geolocation') {
        return reject({
          errorCode: -2,
          errorMsg: 'Browser denied Geolocation'
        });
      } else {
        return reject({
          errorCode: err.code,
          errorMsg: err.message
        });
      }
    }, { timeout: 30000, enableHighAccuracy: true, maximumAge: 75000 });
  });
};
