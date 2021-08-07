module.exports = {
  create: {
    post: {
      tags: ["Feature"],
      summary: "Register new service",
      description: "This can only be done by Admins",
      produces: ["application/json"],
      consumes: ["application/json"],
      operationId: "createFeature",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Feature" },
          },
        },
      },
      responses: {
        200: {
          description: "Service created successfully",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Feature" },
            },
          },
        },
        401: {
            description: "Not authorized user.",
          },
        409: {
          description: "Feature already exist.",
        },
        500: {
          description: "Internal server error",
        },
      },
    },
  },
};
