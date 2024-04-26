const base64 = require('base-64');

module.exports.basicAuthorizer = async (event) => {
  const authorizationHeader = event.authorizationToken;
  if (!authorizationHeader) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        message: "Unauthorized: Authorization header not provided",
      }),
    };
  }

  const tokenParts = authorizationHeader.split(' ');
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Basic') {
    return {
      statusCode: 403,
      body: JSON.stringify({
        message: "Forbidden: Invalid token format",
      }),
    };
  }

  const encodedCredentials = tokenParts[1];
  const decodedCredentials = base64.decode(encodedCredentials);

  const [username, password] = decodedCredentials.split(':');

  const storedPassword = process.env[username];

  if (storedPassword && password === storedPassword) {
    const policy = {
      principalId: username,
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Allow",
            Resource: event.methodArn,
          },
        ],
      },
    };
    return policy;
  } else {
    return {
      statusCode: 403,
      body: JSON.stringify({
        message: "Forbidden: Access denied",
      }),
    };
  }
};
