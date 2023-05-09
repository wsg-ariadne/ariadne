const baseUrl = import.meta.env.VITE_API_URL + '/api/v1';

export const ApiGet = (endpoint, callback, errorCallback) => {
  if (typeof callback !== 'function') {
    console.error('api/request(ApiGet): Expected function callback, got ' + typeof callback);
  }

  fetch(baseUrl + endpoint, {
    method: 'GET'
  }).then((response) => response.json())
    .then((data) => callback(data))
    .catch((error) => {
      console.error('api/request(ApiGet) Error fetching ' + endpoint + ':', error);
      if (typeof errorCallback === 'function') errorCallback(error);
    });
}

export const ApiPost = (endpoint, body, callback, errorCallback) => {
  if (typeof callback !== 'function') {
    console.error('api/request(ApiPost): Expected function callback, got ' + typeof callback);
  }

  fetch(baseUrl + endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }).then((response) => response.json())
    .then((data) => callback(data))
    .catch((error) => {
      console.error('api/request(ApiPost) Error fetching ' + endpoint + ':', error);
      if (typeof errorCallback === 'function') errorCallback(error);
    });
}
