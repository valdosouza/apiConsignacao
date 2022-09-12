
const DeliveryRangeController = require("../controller/deliveryRange.controller.js");

//var distance = require('google-distance-matrix');
var origins = [''];
var destinations = [''];
//distance.key('AIzaSyDJuJYh5SABRokwihgVAMi55UnNSrfBY50');
//distance.units('metric');


class ServicesController {
    /*
    static distance = (body) => {
        const promise = new Promise((resolve, reject) => {
            var origins = [body.origins];
            var destinations = [body.destinations];

            distance.matrix(origins, destinations, function (err, distances) {
                if (err) {
                    resolve(err);
                }
                if (!distances) {
                    resolve('no distances');
                }
                if (distances.status == 'OK') {
                    resolve(distances.rows[0].elements[0]);
                }
            });
        });
        return promise;
    }

    static deliveryValue = (body) => {
        const promise = new Promise((resolve, reject) => {
            var origins = [body.origins];
            var destinations = [body.destinations];

            distance.matrix(origins, destinations, function (err, distances) {
                if (err) {
                    resolve(err);
                }
                if (!distances) {
                    resolve('no distances');
                }
                if (distances.status == 'OK') {
                    var diskm = distances.rows[0].elements[0].distance;


                    resolve(DeliveryRangeController.getDeliveryValue(diskm.value, body.tb_institution_id));

                    //resolve(distances.rows[0].elements[0]);
                }
            });
        });
        return promise;
    }
    */

    static existWord = (body) => {
        const promise = new Promise((resolve) => {

            var autoAnswer = [
                "Boa noite",
                "Promoção",
                "promocao",
                "Olá",
                "ola",
                "pizza",
                "tudo bem",
                "manda",
                "cardápio",
                "cardapio",
                "pedido"
            ];

            var msgOriginal = body.saudacao.split(" ");
            var answer = false;
            for (var w = 0, lenWord = msgOriginal.length; w < lenWord; ++w) {
                var word = msgOriginal[w];

                for (var c = 0, lenComp = autoAnswer.length; c < lenComp; ++c) {
                    var compare = autoAnswer[c];
                    if (word.toUpperCase().includes(compare.toUpperCase())) {
                        //if (word.toUpperCase() === compare.toUpperCase()) {
                        answer = true;
                        break;
                    }
                };
                if (answer) break;

            };            
            resolve(answer);
        });
        return promise;
    }

}
module.exports = ServicesController; 