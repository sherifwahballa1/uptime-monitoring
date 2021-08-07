module.exports = {
  schemas: {
    User: {
      type: "object",
      properties: {
        name: {
          type: "string",
          example: "sherif",
          description: "The name of user",
        },
        email: {
          type: "string",
          example: "asd@gmail.com",
          description: "User's email",
        },
        password: {
          type: "string",
          format: "password",
          description: "Password length must be (8) or more",
        },
        notifications: {
          type: "array",
          description:
            "Type of notifications user need to alerting if there's a problem",
          items: {
            type: "object",
            description: "notify type current now only (pushover) and userKey",
          },
          example: [
            {
              type: "pushover",
              userKey: "xxxxxxxxx",
            },
          ],
          required: false,
        },
      },
      required: ["name", "email", "password"],
    },
    Check: {
      type: "object",
      properties: {
        name: {
          type: "string",
          example: "check1",
          description: "check name",
        },
        url: {
          type: "string",
          example: "www.google.com",
          description: "check url",
        },
        protocol: {
          type: "string",
          example: "HTTP",
          description: "Must be on of  HTTP, HTTPs, TCP",
        },
        method: {
          type: "string",
          example: "GET",
          description:
            "Must be on of  GET, POST, DELETE, PUT, PATCH, HEAD, OPTIONS",
        },
        path: {
          type: "string",
          example: "/home",
          description: "A specific path to be monitored",
        },
        webhook: {
          type: "string",
          example: "http://localhost:5000/api/key",
          description: "A webhook URL to receive a notification on",
        },
        port: {
          type: "number",
          example: "8080",
          description: "The timeout of the polling request",
        },
        timeout: {
          type: "number",
          example: "5",
          description: "The timeout of the polling request ",
        },
        interval: {
          type: "number",
          example: "3",
          description: "The time interval for polling requests in minutes",
        },
        threshold: {
          type: "number",
          example: "4",
          description:
            "The threshold of failed requests that will create an alert",
        },
        authentication: {
          type: "object",
          description:
            "An HTTP authentication header, with the Basic scheme, to be sent with the polling request",
          example: {
            username: "xyz",
            password: "123",
          },
        },
        httpHeaders: {
          type: "array",
          description:
            "A list of key/value pairs custom HTTP headers to be sent with the polling request",
          items: {
            type: "object",
          },
          example: [
            {
              key: "x",
              value: "1",
            },
          ],
        },
        assert: {
          type: "object",
          description:
            "The response assertion to be used on the polling response",
          example: {
            statusCode: 200,
          },
        },
        tags: {
          type: "array",
          description: "A list of the check tags",
          example: ["tag1"],
        },
        ignoreSSL: {
          type: "boolean",
          description:
            "A flag to ignore broken/expired SSL certificates in case of using the HTTPS protocol",
          example: true,
        },
      },
      required: ["url", "name", "protocol", "method"],
    },
    UpdateCheck: {
      type: "object",
      properties: {
        name: {
          type: "string",
          example: "check1",
          description: "check name",
        },
        url: {
          type: "string",
          example: "www.google.com",
          description: "check url",
        },
        protocol: {
          type: "string",
          example: "HTTP",
          description: "Must be on of  HTTP, HTTPs, TCP",
        },
        method: {
          type: "string",
          example: "GET",
          description:
            "Must be on of  GET, POST, DELETE, PUT, PATCH, HEAD, OPTIONS",
        },
        path: {
          type: "string",
          example: "/home",
          description: "A specific path to be monitored",
        },
        webhook: {
          type: "string",
          example: "http://localhost:5000/api/key",
          description: "A webhook URL to receive a notification on",
        },
        port: {
          type: "number",
          example: "8080",
          description: "The timeout of the polling request",
        },
        timeout: {
          type: "number",
          example: "5",
          description: "The timeout of the polling request ",
        },
        interval: {
          type: "number",
          example: "3",
          description: "The time interval for polling requests in minutes",
        },
        threshold: {
          type: "number",
          example: "4",
          description:
            "The threshold of failed requests that will create an alert",
        },
        authentication: {
          type: "object",
          description:
            "An HTTP authentication header, with the Basic scheme, to be sent with the polling request",
          example: {
            username: "xyz",
            password: "123",
          },
        },
        httpHeaders: {
          type: "array",
          description:
            "A list of key/value pairs custom HTTP headers to be sent with the polling request",
          items: {
            type: "object",
          },
          example: [
            {
              key: "x",
              value: "1",
            },
          ],
        },
        assert: {
          type: "object",
          description:
            "The response assertion to be used on the polling response",
          example: {
            statusCode: 200,
          },
        },
        tags: {
          type: "array",
          description: "A list of the check tags",
          example: ["tag1"],
        },
        ignoreSSL: {
          type: "boolean",
          description:
            "A flag to ignore broken/expired SSL certificates in case of using the HTTPS protocol",
          example: true,
        },
      },
    },
    Report: {
      type: "object",
      properties: {
        status: {
          type: "string",
          example: "up",
          description: "The current status of the URL",
        },
        availability: {
          type: "number",
          example: "70.5",
          description: "A percentage of the URL availability",
        },
        outages: {
          type: "number",
          example: "0",
          description: "The total number of URL downtimes",
        },
        lastOutages: {
          type: "number",
          example: "0",
          description: "The total number of last outages",
        },
        downtime: {
          type: "number",
          example: "1000",
          description: "The total time, in seconds, of the URL downtime",
        },
        uptime: {
          type: "number",
          example: "1000",
          description: "The total time, in seconds, of the URL uptime",
        },
        responseTime: {
          type: "number",
          example: "77.5",
          description: "The average response time for the URL",
        },
      },
    },
    Feature: {
      type: "object",
      description: "Only for admins",
      properties: {
        type: {
          type: "string",
          example: "sms",
          description: "The Type of the service",
        },
        name: {
          type: "string",
          example: "pushover",
          description: "the name of the service",
        },
        providers: {
          type: "array",
          example: ["userKey", "userPhone"],
          description: "all the service required keys",
        },
      },
    },
  },
  securitySchemes: {
    jwt: {
      type: "http",
      scheme: "bearer",
      in: "header",
      bearerFormat: "JWT",
    },

    cookieAuth: {
      type: "apiKey",
      in: "cookie",
      name: "auth_token",
    },
  },
};
