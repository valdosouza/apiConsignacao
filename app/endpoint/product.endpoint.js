const ProductController = require("../controller/product.controller.js");

class ProductEndPoint {

    static getList(req, res) {
        ProductController.geList(req.body.institution)
            .then(data => {
                res.send(data);
            })

    }    
}
module.exports = ProductEndPoint; 