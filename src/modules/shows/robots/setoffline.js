const InternalService = require('../http/services/InternalService');
const View = require('../models/View');

setInterval(async () => {
    try {
        const views = await View.find({ 'online': true })
        for (view of views) {
            await InternalService.setViewOffline(view.ip);
        }
        console.log('View set offline');
    } catch (error) {
        console.log('Error in set offline')
    }
}, 10000);