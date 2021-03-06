const axios = require('axios');
const OneDriveSecret = require('../models/OneDriveSecret')


setInterval(async() => {
    try {
        let onedrive = await OneDriveSecret.findOne();

        const response = await axios.post('https://login.microsoftonline.com/common/oauth2/v2.0/token', `
            grant_type=refresh_token
            &refresh_token=${onedrive.refresh_token}
            &client_id=b3ea0bfb-f31b-4645-9975-b3c1134aff50
            &client_secret=gl37Q~rxBCBa5uNAuNy3mK1rXOsJ-wcwjz6YM
            &scope=offline_access%20Files.Read%20Files.ReadWrite%20Files.ReadWrite.All%20Sites.ReadWrite.All
            &redirect_uri=http%3A%2F%2Flocalhost%3A3000
        `, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        await OneDriveSecret.deleteMany({ token_type: 'Bearer' })
        await OneDriveSecret.create(response.data);
        console.log('new onedrive token saved successfully')
    } catch (error) {
        console.log('error at update onedrive token: ' + error.message)
    }
}, 2 * 60 * 1000)