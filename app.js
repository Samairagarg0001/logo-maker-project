const fs = require('fs'); 
require('dotenv').config();
const express = require('express');
const https = require('https'); // 1. We must use HTTPS library
const socketIo = require('socket.io');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const connectDB = require('./config/db');
const helmet = require('helmet');

const app = express();

// --- HTTPS SETUP ---
// We try to read the certs. If they don't exist, we will crash (so you know to run generateCert.js)
let key, cert;
try {
  key = fs.readFileSync(path.join(__dirname, 'key.pem'));
  cert = fs.readFileSync(path.join(__dirname, 'cert.pem'));
} catch (e) {
  console.error("❌ ERROR: SSL Certificates (key.pem/cert.pem) not found!");
  console.error("   Please run: node generateCert.js");
  process.exit(1);
}

const options = { key: key, cert: cert };

// 2. Create the Secure Server
const server = https.createServer(options, app); 
const io = socketIo(server);

const port = process.env.PORT || 3000;

// Connect to DB
connectDB();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session Setup
app.use(session({
  secret: 'secret_key_change_this',
  resave: false,
  saveUninitialized: false,
}));

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Socket.io Logic
let activeUsers = 0;
io.on('connection', (socket) => {
    activeUsers++;
    io.emit('userCount', activeUsers);
    socket.on('disconnect', () => {
        activeUsers--;
        io.emit('userCount', activeUsers);
    });
});

// Routes
const apiFeaturesRoutes = require('./routes/api/features');
const apiLogosRoutes = require('./routes/api/logos');
const viewRoutes = require('./routes/views');
const authRoutes = require('./routes/auth');

app.use('/api/features', apiFeaturesRoutes);
app.use('/api/logos', apiLogosRoutes);
app.use('/', authRoutes);
app.use('/', viewRoutes);

// 404 & Error Handlers
app.use((req, res, next) => res.status(404).send("Page not found"));
app.use((err, req, res, next) => { console.error(err.stack); res.status(500).send('Server Error'); });

// 3. LISTEN ON THE SECURE SERVER
server.listen(port, () => {
  console.log(`🚀 SECURE Server running at https://localhost:${port}`);
});