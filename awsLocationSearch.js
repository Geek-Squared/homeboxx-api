const AWS = require('aws-sdk');

const location = new AWS.Location({
  region: 'us-west-2',
  credentials: {
    accessKeyId: 'your-access-key-id',
    secretAccessKey: 'your-secret-access-key',
  },
});

const params = {
  IndexName: 'YourPlaceIndexName', // Replace with your Place index name
  Text: 'Seattle', // Replace with the place you want to search for
};

location.searchPlaceIndexForText(params, (err, data) => {
  if (err) console.log(err, err.stack);
  else console.log(data);
});