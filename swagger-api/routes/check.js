module.exports = {
  create: {
    post: {
      tags: ["Check"],
      summary: "Create new check",
      produces: ["application/json"],
      consumes: ["application/json"],
      operationId: "createCheck",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Check" },
          },
        },
      },
      responses: {
        200: {
          description: "Check successfully created",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Check" },
            },
          },
        },
        409: {
          description: "Check url already exists.",
        },
        400: {
          description: "Some body inputs invalid or required.",
        },
        401: {
          description: "not authorized user.",
        },
        500: {
          description: "Internal server error",
        },
      },
    },
  },
  getAllChecks: {
    get: {
      tags: ["Check"],
      summary: "Get the list of all checks",
      produces: ["application/json"],
      consumes: ["application/json"],
      operationId: "listOfCheck",
      parameters: [
        {
          in: "query",
          name: "limitNo",
          type: "number",
        },
        {
          in: "query",
          name: "pageNo",
          type: "number",
        },
      ],
      responses: {
        200: {
          description: "Return all the checks.",
        },
        204: {
          description: "no checks.",
        },
        400: {
          description: "invlaid query params.",
        },
        401: {
          description: "not authorized user.",
        },
        500: {
          description: "Internal server error",
        },
      },
    },
  },
  getChecksByTag: {
    get: {
      tags: ["Check"],
      summary: "Get the list of checks by tag name",
      produces: ["application/json"],
      consumes: ["application/json"],
      operationId: "listOfCheckByTag",
      parameters: [
        {
          in: "path",
          name: "tagName",
          type: "string",
        },
        {
          in: "query",
          name: "limitNo",
          type: "number",
        },
        {
          in: "query",
          name: "pageNo",
          type: "number",
        },
      ],
      responses: {
        200: {
          description: "Return the checks by tag name.",
        },
        400: {
          description: "invlaid query params.",
        },
        401: {
          description: "not authorized user.",
        },
        500: {
          description: "Internal server error",
        },
      },
    },
  },
  getCheckByName: {
    get: {
      tags: ["Check"],
      summary: "Get the check by check name",
      produces: ["application/json"],
      consumes: ["application/json"],
      operationId: "checkByName",
      parameters: [
        {
          in: "path",
          name: "checkName",
          type: "string",
        },
      ],
      responses: {
        200: {
          description: "Return the check by name.",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateCheck" },
            },
          },
        },
        400: {
          description: "invlaid params name.",
        },
        401: {
          description: "not authorized user.",
        },
        404: {
          description: "not found check.",
        },
        500: {
          description: "Internal server error",
        },
      },
    },
  },
  getCheckById: {
    get: {
      tags: ["Check"],
      summary: "Get the check by check id",
      produces: ["application/json"],
      consumes: ["application/json"],
      operationId: "checkById",
      parameters: [
        {
          in: "path",
          name: "checkId",
          required: true,
          type: "string",
        },
      ],
      responses: {
        200: {
          description: "Return the check by id.",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateCheck" },
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
          description: "not found check.",
        },
        500: {
          description: "Internal server error",
        },
      },
    },
  },
  update: {
    patch: {
      tags: ["Check"],
      summary: "Edit check data",
      produces: ["application/json"],
      consumes: ["application/json"],
      operationId: "editCheck",
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          type: "string",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/UpdateCheck" },
          },
        },
      },
      responses: {
        200: {
          description: "Check successfully created",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    description: "check updated successfully",
                  },
                },
              },
            },
          },
        },
        429: {
          description: "Name used before",
        },
        400: {
          description: "Some body inputs invalid or required.",
        },
        401: {
          description: "not authorized user.",
        },
        404: {
          description: "Check not found.",
        },
        500: {
          description: "Internal server error",
        },
      },
    },
  },
  toggleCheck: {
    post: {
      tags: ["Check"],
      summary: "Pause or active the check",
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
          description: "Return Check status",
        },
        400: {
          description: "invlaid check.",
        },
        401: {
          description: "not authorized user.",
        },
        404: {
          description: "not found check.",
        },
        500: {
          description: "Internal server error",
        },
      },
    },
  },
  removeAllChecks: {
    delete: {
      tags: ["Check"],
      summary: "remove all user checks",
      produces: ["application/json"],
      consumes: ["application/json"],
      operationId: "removeAllChecks",
      responses: {
        200: {
          description: "All checks deleted successfully !",
        },
        400: {
          description: "invlaid check.",
        },
        401: {
          description: "not authorized user.",
        },
        409: {
          description: "not checks founded",
        },
        500: {
          description: "Internal server error",
        },
      },
    },
  },
  removeChecksByTagName: {
    delete: {
      tags: ["Check"],
      summary: "remove user checks by tag name",
      produces: ["application/json"],
      consumes: ["application/json"],
      operationId: "removeChecksByTag",
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
          description: "All checks with tagName deleted successfully !",
        },
        401: {
          description: "not authorized user.",
        },
        404: {
          description: "no checks founded",
        },
        500: {
          description: "Internal server error",
        },
      },
    },
  },
  removeCheckById: {
    delete: {
      tags: ["Check"],
      summary: "remove user check by id",
      produces: ["application/json"],
      consumes: ["application/json"],
      operationId: "removeCheck",
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
          description: "Check deleted successfully",
        },
        400: {
          description: "Invalid check",
        },
        401: {
          description: "not authorized user.",
        },
        404: {
          description: "check not found",
        },
        500: {
          description: "Internal server error",
        },
      },
    },
  },
};
