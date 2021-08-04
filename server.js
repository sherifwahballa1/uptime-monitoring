const mongoose = require("mongoose");
const http = require("http");
const fs = require("fs")
mongoose.Promise = global.Promise;
require("dotenv").config({ path: "./env/config.env" }); //for config files;
const Config = require("./config");
const Logger = require("./utils/logger.js");


process.on("uncaughtException", (err, origin) => {
    fs.writeSync(
        process.stderr.fd,
        `Caught exception: ${err}\n` + `Exception origin: ${origin} \n`
    );
    console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
    console.log(err.name, err.message);
    process.exit(1);
});

const app = require("./app.js");


console.log("Connected ---- connect to cloud DB");
mongoose.connect(Config.dbURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
});

Logger.dbConnection(mongoose);

/**
 * Get port from environment and store in Express.
 */
const PORT = normalizePort(process.env.PORT || "5000");

// set port
app.set("port", PORT);

const server = http.createServer(app).listen(PORT, () => {
    console.log(
        ` ################## War-games App \n ##################  ${Config.currentEnv} `
            .blue.bold
    );
});;


server.on("error", onError);
server.on("listening", onListening);


process.on("unhandledRejection", async (err) => {
    console.log("UNHANDLED REJECTION! 💥 Shutting down...");
    console.log(err.name, err.message);
    gracefulShutdown();
});

// when all your requests to the server is respond and not any data processing work left.
// generic signal used to cause program termination.
// Unlike SIGKILL, this signal can be blocked, handled, and ignored.
// It is the normal way to politely ask a program to terminate
process.on("SIGTERM", gracefulShutdown);

// 'SIGINT' generated with <Ctrl>+C in the terminal.
process.on("SIGINT", gracefulShutdown);

process.on("exit", (code) => {
    console.log("Process exit event with code: ", code);
});

process.on("warning", (warning) => {
    console.warn(warning.name); // Print the warning name
    console.warn(warning.message); // Print the warning message
    console.warn(warning.stack); // Print the stack trace
});

// the number of seconds the current Node.js process has been running
console.log(
    `The time needed to running process ${Math.floor(process.uptime())}`
);

console.log(`This platform is ${process.platform}`);

console.log(`This processor architecture is ${process.arch}`);

/**
 * Normalize a port into a number, string, or false.
 */


function gracefulShutdown() {
    // Handle process kill signal
    // Stop new requests from client
    // Close all data process
    // Exit from process

    // Handle process kill signal
    console.info("👋 SIGTERM RECEIVED. Shutting down gracefully");
    console.log("Closing http server.");
    shutdown();
}

function normalizePort(val) {
    let port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== "listen") {
        throw error;
    }

    var bind = typeof PORT === "string" ? "Pipe " + PORT : "Port " + PORT;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    let addr = server.address();
    let bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
    console.log(`################## running on ${bind}`.cyan.bold);
}


const shutdown = async function() {
    try {
      // Clear out the old sessions from the database
      console.log('ShutDown')
    } catch (e) {
      console.log(`Error clearing tokens from database: ${e}`)
    } finally {
      // Close out the server, the database connection, and the program
      server.close(function() {
        console.log('Closing server');
        mongoose.connection.close(false, function() {
          console.log('Closing database connection');
          process.exit(0);
        });
      });
    }
  };

module.exports = server;
