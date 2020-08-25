import swaggerJSDoc = require('swagger-jsdoc');

const options = {
  apis: ['**/*.ts'],
  host: 'http://127.0.0.1:3333',
  swaggerDefinition: {
    info: {
      title: 'Rest API with TypeScript, TypeORM (MySql) and JWT',
      version: '1.0.0',
      description: 'Simple API CRUD with TS and MySql',
      contact: {
        email: 'diegocecconcwb@outlook.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    host: 'localhost:3333',
    basePath: '/api/v1',
    securityDefinitions: {
      bearerAuth: {
        type: 'apiKey',
        scheme: 'bearer',
        name: 'Authorization',
        bearerFormat: 'JWT',
        description: 'Enter your bearer token in the format **Bearer &lt;token>**'
      }
    },
    security: [{
      bearerAuth: []
    }],
    externalDocs: {
      description: 'Diego Ceccon',
      url: 'https://www.linkedin.com/in/diego-ceccon/'
    }
  }
};

const specs = swaggerJSDoc(options);

export default specs;
