const joi = require("joi");

const checkSchema = {
  name: joi
    .string()
    .required()
    .trim()
    .pattern(/^[a-zA-Z0-9 ]+$/)
    .messages({
      "string.base": `check name must be consists of letters & numbers only`,
      "string.empty": `check name cannot be an empty field`,
      "string.pattern.base": `check name must be consists of letters & numbers only`,
      "any.required": `check name is required`,
    }),

  url: joi.string().trim().required().messages({
    "string.base": `Invalid url`,
    "string.empty": `url cannot be an empty field`,
    "any.required": `url is required`,
  }),

  method: joi
    .string()
    .trim()
    .required()
    .valid("GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS")
    .messages({
      "string.empty": `method cannot be an empty field`,
      "string.valid": `invalid method must be one of GET POST PUT PATCH DELETE HEAD OPTIONS`,
      "any.required": `method is required`,
    }),

  protocol: joi
    .string()
    .trim()
    .required()
    .valid("HTTP", "HTTPS", "TCP")
    .messages({
      "string.empty": `protocol cannot be an empty field`,
      "string.valid": `invalid protocol must be one of HTTP HTTPS TCP`,
      "any.required": `protocol is required`,
    }),

  path: joi.string().trim().optional(),

  port: joi.number().optional(),

  webhook: joi.string().optional(),

  timeout: joi.number().optional(),

  interval: joi.number().optional(),

  threshold: joi.number().optional(),

  authentication: joi
    .object()
    .keys({
      username: joi.string().required().trim(),
      password: joi.string().required().trim(),
    })
    .optional(),

  httpHeaders: joi.array().items(
    joi.object().keys({
      key: joi.string().allow(""),
      value: joi.string().allow(""),
    })
  ),

  assert: joi
    .object()
    .keys({
      statusCode: joi.number().required(),
    })
    .optional(),

  tags: joi.array().items(joi.string()).optional(),

  ignoreSSL: joi.boolean().optional(),
};

const updateCheckSchema = {
  name: joi
    .string()
    .required()
    .trim()
    .pattern(/^[a-zA-Z0-9 ]+$/)
    .messages({
      "string.base": `check name must be consists of letters & numbers only`,
      "string.empty": `check name cannot be an empty field`,
      "string.pattern.base": `check name must be consists of letters & numbers only`,
      "any.required": `check name is required`,
    })
    .optional(),

  url: joi
    .string()
    .trim()
    .required()
    .messages({
      "string.base": `Invalid url`,
      "string.empty": `url cannot be an empty field`,
      "any.required": `url is required`,
    })
    .optional(),

  protocol: joi
    .string()
    .trim()
    .required()
    .valid("HTTP", "HTTPS", "TCP")
    .messages({
      "string.empty": `protocol cannot be an empty field`,
      "string.valid": `invalid protocol must be one of HTTP HTTPS TCP`,
      "any.required": `protocol is required`,
    })
    .optional(),

  method: joi
    .string()
    .trim()
    .required()
    .valid("GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS")
    .messages({
      "string.empty": `method cannot be an empty field`,
      "string.valid": `invalid method must be one of GET POST PUT PATCH DELETE HEAD OPTIONS`,
      "any.required": `method is required`,
    })
    .optional(),

  path: joi.string().trim().optional(),

  port: joi.number().optional(),

  webhook: joi.string().optional(),

  timeout: joi.number().optional(),

  interval: joi.number().optional(),

  threshold: joi.number().optional(),

  authentication: joi
    .object()
    .keys({
      username: joi.string().required().trim(),
      password: joi.string().required().trim(),
    })
    .optional(),

  httpHeaders: joi.array().items(
    joi.object().keys({
      key: joi.string().allow(""),
      value: joi.string().allow(""),
    })
  ),

  assert: joi
    .object()
    .keys({
      statusCode: joi.number().required(),
    })
    .optional(),

  tags: joi.array().items(joi.string()).optional(),

  ignoreSSL: joi.boolean().optional(),
};

module.exports = {
  checkInfo: joi.object(checkSchema),
  checkUpdate: joi.object(updateCheckSchema),
};
