module.exports = {
  apps: [
    {
      name: "backend",
      cwd: "./packages/backend",
      script: "dist/main.js",
      watch: true,
      exec_mode: "cluster",
      instances: 1,
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
    {
      name: "web",
      script: "serve",
      cwd: "./packages/web",
      watch: true,
      env: {
        PM2_SERVE_PATH: '.',
        PM2_SERVE_SPA: 'true',
        PM2_SERVE_HOMEPAGE: './index.html',
        PM2_SERVE_PORT: 80
      },
    },
  ],
};
