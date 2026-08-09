import { createApp } from './app';
import { config } from './config';

const app = createApp();

app.listen(config.port, () => {
  console.log(`API running on http://localhost:${config.port}`);
  console.log(`Swagger docs at http://localhost:${config.port}/api/v1/docs`);
});
