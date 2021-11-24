module.exports = {
    apps: [{
        name: "redetv-api",
        script: "./src/shared/server.js",
        env: {
            "PORT": 80,
            "MONGO_URL": "mongodb+srv://redetv:AP5SdUrye6GXhCdG@cluster0.x2enb.mongodb.net/redetv?retryWrites=true&w=majority"
        }
    }]
}