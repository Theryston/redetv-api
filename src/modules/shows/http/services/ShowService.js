const Source = require('../../models/Source')

module.exports = {
    createSource: async ({ poster_key, main, show_name, key }) => {
        try {
            const source = await Source.create({
                poster_key: null,
                main,
                show_name,
                views_count: 0,
                like_count: 0,
                key
            })

            return source;
        } catch (error) {
            throw error;
        }
    }
}