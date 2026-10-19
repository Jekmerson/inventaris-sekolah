const express = require('express');
const router = express.Router();
const { activateLicense, getLicenseStatus, resetLicense } = require('../controllers/licenseController');
const { validateLicense } = require('../middleware/validation');

router.post('/activate', validateLicense, activateLicense);
router.get('/status', getLicenseStatus);
router.post('/reset', resetLicense);

module.exports = router;
