require('dotenv').config();
const listEndpoints = require('express-list-endpoints');
const app = require('./app');
console.table(listEndpoints(app));

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Finance Helper backend listening on port ${PORT}`);
});
