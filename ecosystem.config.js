module.exports = {
    apps : [
        {
          name: "app",
          script: "./out/www.js",
          watch:true,
          env: {
              "NODE_ENV": "development"
          },
          env_production: {
              "NODE_ENV": "production"
          },
          env_local: {
              "NODE_ENV": "local"
          }
        }
    ]
  }
  