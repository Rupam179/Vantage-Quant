const app = require('./src/app');
const env = require('./src/config/env');

app.listen(env.port, () => {
  console.log(`\n🚀 AlgoTrade server running on http://localhost:${env.port}`);
  console.log(`   Allowed client origin: ${env.clientUrl}`);
  console.log(`   Environment: ${env.nodeEnv}\n`);
});
