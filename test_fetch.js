const https = require('https');
https.get('https://firebasestorage.googleapis.com/v0/b/zamra-web.firebasestorage.app/o/airline_logos%2Fdefault.png?alt=media', (res) => {
  console.log('Headers:', res.headers);
});
