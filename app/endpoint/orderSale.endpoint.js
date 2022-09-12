const OrderSaleController = require("../controller/orderSale.controller.js");

class OrderSaleEndPoint {

    static getList(req, res) {
        OrderSaleController.geList(req.body.institution)
            .then(data => {
                res.send(data);
            })

    }

    static insert(req, res) {
        OrderSaleController.insert(req.body)
            .then(data => {
                res.send(data);
            })
    }
}
module.exports = OrderSaleEndPoint; 