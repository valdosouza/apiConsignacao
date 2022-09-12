const OrderConsigmentController = require("../controller/orderConsignment.controller.js");

class OrderSaleEndPoint {

    static getList(req, res) {
        OrderConsigmentController.geList(req.body.institution)
            .then(data => {
                res.send(data);
            })

    }

    static insert(req, res) {
        OrderConsigmentController.insert(req.body)
            .then(data => {
                res.send(data);
            })
    }
}
module.exports = OrderSaleEndPoint; 