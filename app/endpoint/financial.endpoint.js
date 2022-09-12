const FinancialController = require("../controller/financial.controller.js");

class FinancialEndPoint {

    static getClosed(req, res) {
        FinancialController.getClosed(req.body)
            .then(data => {
                res.send(data);
            })

    }    
}
module.exports = FinancialEndPoint; 