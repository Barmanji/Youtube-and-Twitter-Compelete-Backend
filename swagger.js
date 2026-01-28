import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    version: '1.2.0',            // by default: '1.0.0'
    title: 'Youtube_Twitter_Backend',              // by default: 'REST API'
    description: 'API For Backend of Youtube and Twitter. [Model Link](https://app.eraser.io/workspace/98py9WjlhcdPWbZBvwGu)'         // by default: ''
  },
    host: 'localhost:8000',                 // by default: 'localhost:3000'
  basePath: '',             // by default: '/'
  // schemes: [],              // by default: ['http']
  // consumes: [],             // by default: ['application/json']
  // produces: [],             // by default: ['application/json']
  // securityDefinitions: {},  // by default: empty object
  // definitions: {}           // by default: empty object
};

const outputFile = './swagger-output.json';
const routes = ['./src/app.js'];

swaggerAutogen()(outputFile, routes, doc);
