const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PAYMENTS_OS_CONFIG = {
  BASE_URL: 'https://api.paymentsos.com',
  APP_ID: process.env.APP_ID,
  PRIVATE_KEY: process.env.PRIVATE_KEY,
  PUBLIC_KEY: process.env.PUBLIC_KEY,
  ENVIRONMENT: 'test'
};

app.post('/process-payment', async (req, res) => {
  try {
    const tokenizeResponse = await axios.post(
      `${PAYMENTS_OS_CONFIG.BASE_URL}/tokens`, 
      req.body.cardDetails,
      {
        headers: {
          'Content-Type': 'application/json',
          'api-version': '1.3.0',
          'x-payments-os-env': PAYMENTS_OS_CONFIG.ENVIRONMENT,
          'app_id': PAYMENTS_OS_CONFIG.APP_ID,
          'public_key': PAYMENTS_OS_CONFIG.PUBLIC_KEY
        }
      }
    );

    const paymentResponse = await axios.post(
      `${PAYMENTS_OS_CONFIG.BASE_URL}/payments`,
      {
        amount: req.body.amount,
        currency: req.body.currency,
        statement_soft_descriptor: 'Mobile App Purchase'
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'api-version': '1.3.0',
          'x-payments-os-env': PAYMENTS_OS_CONFIG.ENVIRONMENT,
          'app_id': PAYMENTS_OS_CONFIG.APP_ID,
          'private_key': PAYMENTS_OS_CONFIG.PRIVATE_KEY,
          'idempotency_key': `payment-${Date.now()}`
        }
      }
    );

    const chargeResponse = await axios.post(
      `${PAYMENTS_OS_CONFIG.BASE_URL}/payments/${paymentResponse.data.id}/charges`,
      {
        payment_method: {
          type: 'tokenized',
          token: tokenizeResponse.data.token
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'api-version': '1.3.0',
          'x-payments-os-env': PAYMENTS_OS_CONFIG.ENVIRONMENT,
          'app_id': PAYMENTS_OS_CONFIG.APP_ID,
          'private_key': PAYMENTS_OS_CONFIG.PRIVATE_KEY,
          'idempotency_key': `charge-${Date.now()}`
        }
      }
    );

    res.json({
      success: true,
      paymentId: paymentResponse.data.id,
      chargeId: chargeResponse.data.id
    });
  } catch (error) {
    console.error('Payment Processing Error:', error.response ? error.response.data : error.message);
    res.status(500).json({
      success: false,
      error: error.response ? error.response.data : error.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

