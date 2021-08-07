module.exports = {
  signup: {
    post: {
      tags: ["User"],
      summary: "Register an user account",
      description: "This can only be done by user in the first time.",
      produces: ["application/json"],
      consumes: ["application/json"],
      operationId: "registerUser",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/User" },
          },
        },
      },
      responses: {
        200: {
          description:
            "User successfully created. and temprory token that used in send verification send.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  temp: {
                    type: "string",
                    description: "Temporary token expired after 1 hour.",
                  },
                },
              },
            },
          },
        },
        409: {
          description: "Email already exist.",
        },
        400: {
          description: "Some body inputs invalid or required.",
        },
        500: {
          description: "Internal server error",
        },
      },
    },
  },
  sendOtp: {
    post: {
      tags: ["User"],
      summary: "Send verification code",
      description: "The verification code will be send to user email.",
      produces: ["application/json"],
      consumes: ["application/json"],
      operationId: "sendOTP",
      responses: {
        200: {
          description: "Verification code sent successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    description: "Successfully otp sent",
                  },
                  timeInSeconds: {
                    type: "number",
                    description: "Successfully otp sent",
                  },
                  email: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
        401: {
          description: "User is not authorized.",
        },
        400: {
          description: "Invalid userID or email service.",
        },
        500: {
          description: "Internal server error",
        },
      },
    },
  },
  verifyOTP: {
    post: {
      tags: ["User"],
      summary: "Verify code",
      description: "Verify account with otp.",
      produces: ["application/json"],
      consumes: ["application/json"],
      operationId: "verifyOTP",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                otp: {
                  type: "string",
                  example: "123456",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Verification code sent successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  token: {
                    type: "string",
                    description: "User token",
                  },
                  isVerified: {
                    type: "boolean",
                  },
                },
              },
            },
          },
        },
        401: {
          description: "User is not authorized.",
        },
        400: {
          description: "Invalid OTP",
        },
        500: {
          description: "Internal server error",
        },
      },
    },
  },
  login: {
    post: {
      tags: ["User"],
      summary: "User login with email and password",
      produces: ["application/json"],
      consumes: ["application/json"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                email: {
                  type: "string",
                  example: "asd@email.com",
                },
                password: {
                  type: "string",
                  example: "xxxxxxxxxx",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Login successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  token: {
                    type: "string",
                    description: "User token",
                  },
                  verified: {
                    type: "boolean",
                  },
                },
              },
            },
          },
        },
        201: {
          description: "Email  not verified please check email address.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  temp: {
                    type: "string",
                    description: "Temprory token",
                  },
                  verified: {
                    type: "boolean",
                  },
                  message: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
        401: {
          description: "Invalid email or password.",
        },
        400: {
          description: "Invalid inputs",
        },
        500: {
          description: "Internal server error",
        },
      },
    },
  },
  logout: {
    post: {
      tags: ["User"],
      summary: "Sign Out",
      produces: ["application/json"],
      consumes: ["application/json"],
      responses: {
        200: {
          description: "Logout successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "boolean",
                  },
                },
              },
            },
          },
        },
        304: {
          description: "Logout successfully.",
        },
        500: {
          description: "Internal server error",
        },
      },
    },
  },
};
