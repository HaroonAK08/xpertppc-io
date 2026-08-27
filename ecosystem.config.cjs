module.exports = {
  apps: [
    {
      name: "xpertppc-io",
      cwd: "/var/www/xpertppc-io",
      script: "node_modules/next/dist/bin/next",
      args: "start -H 0.0.0.0 -p 3011",
      env: {
        NODE_ENV: "production",
        PORT: "3011",
      },
    },
  ],
};
