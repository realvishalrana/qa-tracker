module.exports = {
  apps: [
    {
      name: 'qa-bug-tracker-api',
      script: 'dist/server.js',
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
      },
      max_memory_restart: '512M',
    },
  ],
};
