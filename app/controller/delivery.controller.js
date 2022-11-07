const Order = require("../controller/order.controller.js");
const OrderSale = require("../controller/orderSale.controller.js");
const orderItemDetached = require("../controller/orderItemDetached.controller.js")
const Customer  = require("../controller/customer.controller.js");
class DeliveryController {

    static async save(data) {
        const promise = new Promise((resolve, reject) => {
            (async () => {  
                let order =  data.order;
                let customer =  order.customer;              
                Customer.saveObject(customer);               
                
                
                order = await Order.insert(data.order);                
                
                //let ordersale = await OrderSale.insert(data.order);                
                //let items = await orderItemDetached.insertList(data.order);
                s

                 return order.id;
             })()
             .then((data) => {                    
                resolve(data);
                
            })
            .catch(err => {
                reject(new Error("Erro: " + err));
              });            

        });     
        
        return promise;        
    }

    static findOne(data) {     
        const promise = new Promise((resolve, reject) => {
            Order.findOne(data)
            .then((data) => {                 
                 resolve( data);
             })  
            .catch(err => {
                reject(new Error("Erro: " + err));
              });            
        });
        return promise;   
    }

    static sincronize(data) {  
        
        const promise = new Promise((resolve, reject) => {
            Order.sincronize(data)
            .then((data) => {                 
                 resolve( data);
             })  
            .catch(err => {
                reject(new Error("Erro: " + err));
              });            
        });
        return promise;   
    }    


}

module.exports = DeliveryController;

