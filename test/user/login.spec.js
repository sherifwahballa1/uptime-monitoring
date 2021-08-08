const chai = require("chai");
const jwt = require("jsonwebtoken");
const faker = require("faker");
const app = require("../../app");
require("mocha");
const flush = require("flush-cache");
const { expect, should } = chai;

const request = require("supertest").agent(app);
const User = require("./../../components/user/user.model");
const config = require("../../config");
const mongoose = require("mongoose");
let server;

describe("Login", () => {
  let name;
  let userData;
  let tempToken;
  let otp;

  before(() => {
    userData = {
      name: faker.name.firstName(),
      email: faker.internet.email(name),
      password: faker.internet.password(7, false) + "0I@",
    };

    server = require("../../server");
  });

  after((done) => {
    console.log("Sign up Done Successfully");

    // remove the created user
    User.findOneAndDelete({ email: userData.email }).then((data) => {
      console.log(userData.email);
      console.log("Done");
    });

    // close server and clear cache
    flush();
    server.close();
    delete require.cache[require.resolve("./../../server")];
    done();
  });

  describe("Create user ", () => {
    it("temp token", async () => {
      return request
        .post("/api/user/signup.json")
        .send(userData)
        .then((response) => {
          tempToken = response.body.temp;
          expect(response.status).to.equal(200);
          expect(response.body).to.have.property("temp");
        });
    });
  });

  describe("Login not verified Account", () => {
    it("User not verified", () => {
      return request
        .post("/api/user/login.json")
        .send({
          email: userData.email,
          password: userData.password,
        })
        .then((response) => {
          console.log(response.body);
          expect(response.status).to.equal(201);
          expect("Content-Type", /json/);
          expect(response.body)
            .to.have.property("message")
            .to.equal("Email  not verified please check email address");
        });
    });
  });

  describe("Send OTP POST api/user/verification-code.json", () => {
    describe("Send OTP With credentials", () => {
      it("send otp", () => {
        return request
          .post("/api/user/verification-code.json")
          .set({ authorization: `bearer ${tempToken}` })
          .send()
          .then((response) => {
            expect(response.status).to.equal(200);
            expect("Content-Type", /json/);
            expect(response.body)
              .to.have.property("message")
              .to.equal("Please Check your Email");
          });
      });
    });

    describe("Get the otp", () => {
      it("get user otp", async () => {
        let userInfo = await User.findOne({ email: userData.email }).select(
          "otp"
        );
        otp = userInfo.otp;
        // console.log(userInfo);
      });
    });

    describe("Send OTP Again in 1 minute(!) With credentials", () => {
      it("Waiting 5 minutes to send again", () => {
        return request
          .post("/api/user/verification-code.json")
          .set({ authorization: `bearer ${tempToken}` })
          .send()
          .then((response) => {
            expect(response.status).to.equal(400);
            expect("Content-Type", /json/);
            expect(response.body).to.have.property("message");
          });
      });
    });
  });

  describe("Verify OTP POST api/user/verify.json", () => {
    describe("With valid OTP", () => {
      it("try to verify valid otp", () => {
        // console.log(otp);
        return request
          .post("/api/user/verify.json")
          .set({ authorization: `bearer ${tempToken}` })
          .send({ otp })
          .then((response) => {
            // console.log(response.body);
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property("verified").to.equal(true);
          });
      });
    });
  });

  describe("Testing Login after verifying POST api/user/login.json", () => {
    describe("Login Validation schema", () => {
      describe("Email Validation", () => {
        describe("Email Required", () => {
          it("email Required", () => {
            return request
              .post("/api/user/login.json")
              .send({
                password: userData.password,
              })
              .then((response) => {
                expect(response.status).to.equal(400);
                expect("Content-Type", /json/);
                expect(response.body)
                  .to.have.property("message")
                  .to.equal("email is required");
              });
          });
        });

        describe("Email not valid", () => {
          it("Email Invalid", () => {
            return request
              .post("/api/user/login.json")
              .send({
                email: faker.name.firstName(),
                password: userData.password,
              })
              .then((response) => {
                expect(response.status).to.equal(400);
                expect("Content-Type", /json/);
                expect(response.body)
                  .to.have.property("message")
                  .to.equal("Invalid email");
              });
          });
        });
      });

      describe("Password Validation", () => {
        describe("Password required", () => {
          it("Password Required", () => {
            return request
              .post("/api/user/login.json")
              .send({
                email: userData.email,
              })
              .then((response) => {
                expect(response.status).to.equal(400);
                expect("Content-Type", /json/);
                expect(response.body)
                  .to.have.property("message")
                  .to.equal("password is required");
              });
          });
        });
      });
    });

    describe("Login Valid schema", () => {
      describe("User Email not found", () => {
        it("email not exists", () => {
          return request
            .post("/api/user/login.json")
            .send({
              email: faker.internet.email(faker.name.firstName()),
              password: userData.password,
            })
            .then((response) => {
              expect(response.status).to.equal(401);
              expect("Content-Type", /json/);
              expect(response.body)
                .to.have.property("message")
                .to.equal("Invalid email or password");
            });
        });
      });
      describe("password not exists not valid", () => {
        it("Password not Valid", () => {
          return request
            .post("/api/user/login.json")
            .send({
              email: userData.email,
              password: faker.internet.password(5, false),
            })
            .then((response) => {
              expect(response.status).to.equal(401);
              expect("Content-Type", /json/);
              expect(response.body)
                .to.have.property("message")
                .to.equal("Invalid email or password");
            });
        });
      });
    });

    describe("Login Successfully", () => {
      it("User Login successfully", () => {
        return request
          .post("/api/user/login.json")
          .send({
            email: userData.email,
            password: userData.password,
          })
          .then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body).not.to.be.empty;
            expect(response.body).to.have.property("token");
          });
      });
    });
  });
});
