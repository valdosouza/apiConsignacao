const nodemailer = require('nodemailer');
const config = require("../config/db.config.js");

const transporter = nodemailer.createTransport({
    secure:false,
    pool: true,
    host: config.HOSTSENDER,
    port: config.PORTSENDER,
    secure: false, // true for 465, false for other ports
    auth: {
        user: config.EMAILSENDER,
        pass: config.PASSWORDSENDER
    },
    tls: { rejectUnauthorized: true },
    dkim: {
      domainName: config.DOMAINSENDER,
      keySelector: 'mail',
      //privateKey: require('fs').readFileSync('data/mail.private', {
      //    encoding: 'utf8'
      //})
    }    
  });

class SendMailController  {   

    static async recoveryPassword(body) {
        const promise = new Promise((resolve, reject) => {
            try{              
              var htmlText = 
              '<p><br /> '+
              'Ol&aacute;</p> '+
              '<p>Voc&ecirc; requisitou uma troca de senha.</p> '+
              '<p>SE n&atilde;o foi voc&ecirc; quem requisitou por favor igonore este email</p> '+
              '<p>Caso contr&aacute;rio utilize o codigo [ ' + body.salt + ' ] para confirmar a alteração de senha</p> '+              
              '<p>at</p> '+
              '<p>WebMaster</p>';
              //Apaga item para dar o retorno sem o code que deve ser revisado pelo email
              delete body["salt"];
              const mailOptions = {
                  from: 'webmaster@industriadechocolatesamor.com.br',
                  to: body.email,
                  subject: 'Solicitação recuperação de senha',
                  html : htmlText,
                  text: 'Solicitação de troca de senha'
                };

                transporter.sendMail(mailOptions, function(error, info){
                  if (error) {
                    reject(error);
                  } else {                    
                    resolve(body);
                  }
                });                
            } catch (e) {            
              reject("Erro Found:" + e);
            }  
        });
        return promise;
    }

}
module.exports = SendMailController; 

