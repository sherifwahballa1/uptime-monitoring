const joi = require("joi");

const signupSchema = {
  name: joi
    .string()
    .required()
    .trim()
    .pattern(/^[a-zA-Z ]+$/)
    .messages({
      "string.base": `name must be consists of letters only`,
      "string.empty": `name cannot be an empty field`,
      "string.pattern.base": `name must be consists of letters only`,
      "any.required": `name is required`,
    }),

  email: joi
    .string()
    .required()
    .email({ minDomainSegments: 2 })
    .messages({
      "string.base": `Invalid email`,
      "string.email": `Invalid email`,
      "string.empty": `email cannot be an empty field`,
      "any.required": `email is required`,
      "string.pattern.base": `Invalid email`,
    }),

  password: joi
    .string()
    .required()
    .trim()
    .pattern(/(?=^.{7,}$)(?=.*[a-zA-Z ]).*$/)
    .min(8)
    .messages({
      "string.base": `password must be at least a minimum of 8 characters long`,
      "string.empty": `password cannot be an empty field`,
      "string.min": `password should have a minimum length of {#limit}`,
      "string.pattern.base": `password must be at least a minimum of 8 characters long`,
      "any.required": `password is required`,
    }),

  phone: joi.string().length(11).pattern(/^[0-9]+$/).message("Invalid Phone Number"),
};

const loginSchema = {
  email: joi.string().required().email().message("Invalid email"),

  password: joi
    .string()
    .required()
};

const otpSchema = {
  otp: joi
    .string()
    .required()
    .trim()
    .min(6)
    .pattern(/[0-9]{6}/)
    .messages({
      "string.base": `invalid code`,
      "string.empty": `code cannot be an empty field`,
      "string.pattern.base": `invalid code`,
      "string.min": "invalid code",
      "any.required": `code is required`,
    }),
};

module.exports = {
  signup: joi.object(signupSchema),
  login: joi.object(loginSchema),
  otp: joi.object(otpSchema),
};
