// require('dotenv').config();
const Message = require('../models/Message');
const nodemailer = require('nodemailer');
const AWS = require('aws-sdk');

AWS.config.update({
    region: 'us-east-1',
    accessKeyId: "AKIAQK6EYEIENP5VAUYN",
    secretAccessKey: "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",
});

const SES = new AWS.SES({
    apiVersion: '2010-12-01'
});

exports.getAllMessages = async (req, res) => {
    const messages = await Message.find();
    res.json(messages);
};

exports.getMessage = async (req, res) => {
    const message = await Message.findById(req.params.id);
    res.json(message);
};

exports.createMessage = async (req, res) => {
    try {
        const { from, to, subject, text } = req.body;

        // Create and save the message in the database
        const message = new Message({ from, to, subject, text });
        await message.save();

        // Send the email
        let transporter = nodemailer.createTransport({
            SES: {
                ses: SES,
                aws: AWS
            }
        });

        let mailOptions = {
            from,
            to,
            subject,
            text,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ error: 'Error sending email' });
            } else {
                console.log('Email sent: ' + info.response);
                res.json(message);
            }
        });
    } catch (err) {
        console.log('Error in createMessage: ', err);
        return res.status(500).json({ error: 'An error occurred while creating the message.' });
    }
};

exports.deleteMessage = async (req, res) => {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message deleted' });
};