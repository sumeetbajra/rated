var nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport('smtps://thandaaung94%40gmail.com:burma12345@smtp.gmail.com');

module.exports = transporter;