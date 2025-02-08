import swaggerJsdoc from 'swagger-jsdoc';

const doc = {
    info: {
        version: '3.0.0',
        title: 'Swagger Demo Project',
        description: 'Implementation of Swagger with TypeScript',
    },
    servers: [
        {
            url: 'http://api.caygnushacks.com',
            description: '',
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
            },
        },
    },
};

// Swagger options
const swaggerOptions = {
    definition: {
        openapi: '3.0.0', // Swagger version
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'API Documentation for the project',
        },
        servers: [
            {
                url: 'http://localhost:8080',
                description: 'Development server',
            },
            {
                url: 'salonkatta.in/',
                description: 'Prod server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'https',
                    scheme: 'bearer',
                },
            },
        },
    },
    apis: [
        './src/routes/**/*.ts',
        './src/controllers/**/*.ts',
        './src/models/**/*.ts',
    ],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
export { swaggerDocs };
