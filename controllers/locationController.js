const AWS = require('aws-sdk');

const location = new AWS.Location({
  region: 'eu-north-1',
  credentials: {
    accessKeyId: "AKIAQK6EYEIENP5VAUYN",
    secretAccessKey: "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",
  },
});

exports.searchLocation = (req, res) => {
  const params = {
    IndexName: 'Zimabwe',
    Text: req.query.query,
  };

  location.searchPlaceIndexForText(params, (err, data) => {
    if (err) {
      console.log(err, err.stack);
      res.status(500).send('Error searching for place');
    } else {
      res.json(data);
    }
  });
};