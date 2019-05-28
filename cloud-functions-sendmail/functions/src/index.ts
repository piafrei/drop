const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const cors = require('cors')({origin: true});
admin.initializeApp();

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'reportdropapp@gmail.com',
        pass: 'Drop!2019'
    }
});

exports.sendMail = functions.https.onRequest((req, res) => {
    cors(req, res, () => {

        const dest = req.query.dest;
        const dropId = req.query.dropId;
        const dropDescription = req.query.dropDescription;
        const reporterId = req.query.reporterId;
        const userId = req.query.deviceId;

        const mailOptions = {
            from: 'Drop <reportdropapp@gmail.com>', // Something like: Jane Doe <janedoe@gmail.com>
            to: dest,
            subject: 'Ein drop wurde gemeldet!', // email subject
            html:   `<div style="font-size: 16px; font-family: 'Lato', 'San Francisco', sans-serif; background: linear-gradient(to right, #8633FF, #472EE8); padding: 10px; border-radius: 10px; width: 100%">
                    <h1 style="font-size: 30px; font-family: 'Nunito', 'San Francisco', sans-serif; color: white; padding-top: 5px; padding-bottom: 5px">Gemeldeter drop</h1>
                    <div style="background-color: white; padding: 10px; border-radius: 10px; width: 95%">
                    <p style="font-size: 24px; font-family: 'Nunito', 'San Francisco', sans-serif">Hallo!</p></br>
                    <p>Der drop-Nutzer mit der ID `+reporterId+` hat einen drop gemeldet.</p>
                    <p>Dieser drop wurde gemeldet: </p></br>
                    <div style="background-color: #F0F0F0; padding: 20px; border-radius: 10px; width: 75%">
                    <p><strong>drop-ID</strong> `+dropId+` vom <strong>Nutzer </strong>`+userId+`</p></br>
                    <p><strong>Inhalt</strong></p><p> `+dropDescription+`</p></br>
                    </div>
                    <p>Der drop soll entfernt werden? Du kannst den drop direkt in Firebase löschen:</p></br></br>
                    <a href="https://console.firebase.google.com/project/newdrop-eaa98/overview"><img src="https://img.icons8.com/color/420/firebase.png" width="50" height="50" title="Link to Firebase" alt="Link to Firebase"></a></br></br>
                    <p>Liebe Grüße,</p></br>
                    <p>Dein drop-Team</p></br>
                    </div>
                    </div>`
        };

        console.log(dest, dropId, reporterId);

        // returning result
        return transporter.sendMail(mailOptions, (erro, info) => {
            if(erro){
                return res.send(erro.toString());
            }
            return res.send('Sended');
        });
    });
});


