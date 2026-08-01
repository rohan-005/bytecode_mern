const app = require('./app');
const config = require('./src/config/email.config');

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`🚀 Email Microservice running on port ${PORT}`);
});
