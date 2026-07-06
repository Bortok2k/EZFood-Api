const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require( 'swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EZ FOOD API',
      version: '1.0.0',
      description: "## Welcome!\n\nThis is **EZ FOOD**, an academic project presented as a requirement for the degree of system engineering career at Universidad del valle; it consists of a Software swit to manage restaurant compounds by a Web app and Mobile Application.\n\n **Author:** *Luis Miguel Parra Rivillas*\n\n**Institution:** Universidad del Valle\n\n**Student code:** 2559738\n\n**career:** 3743 - Systems Engineering\n\n**Contact:** luis.rivillas@correounivalle.edu.co",
    },
    servers: [
      {
        url: "https://ezfood-api.onrender.com/api/v1",
        description: "Host server"
      },
      {
        url: "http://localhost:8080/api/v1",
        description: "Local server"
      }
    ],
    // ← agregar esto
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingresa el token JWT obtenido del endpoint /auth'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./v1/routes/*.js', './documentation/components.yaml'],
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app, port) {
  // Swagger Page
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true, customCss: '.swagger-ui .topbar { display: none }', customJs: '/no-cache.js' }))
  // Documentation in JSON format
  app.get('/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
  });
}

module.exports ={
  swaggerDocs
}