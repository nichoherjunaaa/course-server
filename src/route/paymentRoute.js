import express from 'express';
import { handlePayment } from '../controller/paymentController.js';
const paymentRoute = express.Router();

paymentRoute.post('/handle-payment-midtrans', handlePayment)

export default paymentRoute