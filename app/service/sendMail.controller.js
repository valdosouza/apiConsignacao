const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: "mail.industriadechocolatesamor.com.br",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: "webmaster@industriadechocolatesamor.com.br",
        pass: "Sucessoem2022!"
    },
    tls: { rejectUnauthorized: false }
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
              '<p>Caso contr&aacute;rio clique no link abaixo para prosseguir com a altera&ccedil;&atilde;o da senha</p> '+
              '<p><a href="https://app.industriadechocolatesamor.com.br/changepasswword/">https://app.industriadechocolatesamor.com.br/changepasswword/</a></p> '+
              '<p>at</p> '+
              '<p>WebMaster</p>';
              
              const mailOptions = {
                  from: 'webmaster@industriadechocolatesamor.com.br',
                  to: body,
                  subject: 'Solicitação recuperação de senha',
                  html : htmlText,
                  text: 'Solicitação de troca de senha'
                };

                transporter.sendMail(mailOptions, function(error, info){
                  if (error) {
                    console.log(error);
                  } else {                    
                    resolve('Email enviado: ' + info.response);
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

