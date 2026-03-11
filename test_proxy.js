const https = require('https');
https.get('https://corsproxy.io/?' + encodeURIComponent('https://firebasestorage.googleapis.com/v0/b/zamra-web.firebasestorage.app/o/logo.png'), (res) => {
  console.log(res.statusCode);
});
