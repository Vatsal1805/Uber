const http = require('http');
const app=require('./app');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const port=process.env.PORT || 3001;
const server=http.createServer(app);
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});