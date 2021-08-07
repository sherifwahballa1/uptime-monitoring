module.exports = {
  getReportByCheckId: {
    get: {
      tags: ["Report"],
      summary: "Get the report by check id",
      produces: ["application/json"],
      consumes: ["application/json"],
      operationId: "checkById",
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          type: "string",
        },
      ],
      responses: {
        200: {
          description: "Return the report by check id.",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Report" },
            },
          },
        },
        400: {
          description: "invlaid id.",
        },
        401: {
          description: "not authorized user.",
        },
        404: {
          description: "not found reports.",
        },
        500: {
          description: "Internal server error",
        },
      },
    },
  },
  getReportByCheckName: {
    get: {
      tags: ["Report"],
      summary: "Get the report by check name",
      produces: ["application/json"],
      consumes: ["application/json"],
      operationId: "reportByCheckName",
      parameters: [
        {
          in: "path",
          name: "checkName",
          required: true,
          type: "string",
        },
      ],
      responses: {
        200: {
          description: "Return the report by check name.",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Report" },
            },
          },
        },
        401: {
          description: "not authorized user.",
        },
        404: {
          description: "not found reports.",
        },
        500: {
          description: "Internal server error",
        },
      },
    },
  },
  getReportByCheckTagName: {
    get: {
      tags: ["Report"],
      summary: "Get the reports by check tag name",
      produces: ["application/json"],
      consumes: ["application/json"],
      operationId: "reportByCheckTag",
      parameters: [
        {
          in: "path",
          name: "tagName",
          required: true,
          type: "string",
        },
      ],
      responses: {
        200: {
          description: "Return the reports by check tag name.",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Report" },
            },
          },
        },
        401: {
          description: "not authorized user.",
        },
        404: {
          description: "not found reports.",
        },
        500: {
          description: "Internal server error",
        },
      },
    },
  },
};
