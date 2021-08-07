module.exports = {
  openapi: "3.0.0",
  info: {
    title: "Uptime Monitoring API Doc",
    version: "0.0.1",
    description:
      "Get detailed uptime reports about URLs availability, average response time, and total `uptime/downtime`.",
    license: {
      name: "MIT",
      url: "https://spdx.org/licenses/MIT.html",
    },
    contact: {
      name: "Sherif wahballa",
      email: "sherifwahballa0@gmail.com",
    },
  },
  servers: [
    {
      url: `http://${process.env.HOST}:${process.env.PORT}`,
      description: "Server",
    },
  ],
};
