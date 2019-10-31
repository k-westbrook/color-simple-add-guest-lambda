const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({ region: "us-west-1" });

exports.handler = (event, context, callback) => {

  const params = {
    TableName: "EVENT_DETAILS",
    Key: {
      "event_id": event.event_id
    },
    UpdateExpression: "set attendees = :a",
    ExpressionAttributeValues: {
      ":a": event.attendees
    }
  };
  docClient.update(params, function (err, data) {

    let recordReturned = data.Items[0];

    if (err || (recordReturned.password !== event.password)) {

      data = {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: {
          message: JSON.stringify('ERROR, did not add guest.')
        }
      };
      callback(null, data);

    } else {

      data = {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: {

          message: JSON.stringify('Successful update to add guest.'),
          attendees: recordReturned.attendees
        }

      };

      callback(null, data);

    }
  })
};
