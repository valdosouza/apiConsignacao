const definition = {
	openapi: "3.0.0",
	info: {
		title: "API - Consignação",
		version: "1.0.0",
		description: "API para sistema de Consignação",
        contact: {
            email: 'valdo@setes.com.br'
        }		
	},
	servers: [
		{
			url: process.env.PATH_URL_API,
		},
	],	
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            }
        }
    },
    security: [{
        bearerAuth: []
    }]
  };
  
  module.exports = {
	definition,
	apis: ['./app/routes/*.js',
           './app/cashier_statement_summary/routes.js',           
           './app/salesman/routes.js',
           './app/order_sale/orderSale.routes.js'
    ],
}