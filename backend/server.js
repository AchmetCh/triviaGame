const express = require("express");
const dotenv = require("dotenv");
const cors = require('cors');
const connection = require('./config/db')
const routes = require('./Routes/routes')
dotenv.config();
const port = 8000;
const app = express();
app.use(express.json());

app.options('*', cors())
app.use(cors({
  origin: '*', // Allow multiple origins
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,x-auth-token',
  credentials: true, // Enable credentials if needed
  optionsSuccessStatus: 200
}));

//route
app.use('/', routes)



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
