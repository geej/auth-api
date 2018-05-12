# auth-api

An OAuth 2.0 ([RFC-6749](https://tools.ietf.org/html/rfc6749)) provider built on:
* Serverless
* AWS Lambda
* DynamoDB
* ES2017
* Webpack
* Babel
* Preact with SSR and hydration (eventually!)
* Material UI

... in under 15KB.

# Dependencies
* Node 8.9.3

# Running
## Locally
```JWT_ISSUER=<issuer> JWT_SECRET=<secret> npm start```

## Watch mode
```JWT_ISSUER=<issuer> JWT_SECRET=<secret> npm run watch```

## Tests
```npm run test```

## Lint
```npm run lint```
