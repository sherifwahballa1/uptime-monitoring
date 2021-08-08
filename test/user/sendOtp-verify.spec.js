const chai = require("chai");
const jwt = require("jsonwebtoken");
const faker = require("faker");
const app = require("../../app");
require("mocha");
const { expect, should } = chai;
const flush = require("flush-cache");

const request = require("supertest").agent(app);
const User = require("./../../components/user/user.model");
const config = require("../../config");
const mongoose = require("mongoose");
let server;

describe("Send OTP and Verify it", () => {
  let name;
  let userData;
  let tempToken;
  let expiredTokenSession;
  let tempTokenInvalidID;
  let tempTokenUserNotFound;
  let otp;

  before(() => {
    userData = {
      name: faker.name.firstName(),
      email: faker.internet.email(name),
      password: faker.internet.password(7, false) + "0I@",
    };

    expiredTokenSession = jwt.sign(
      { _id: "111111", email: userData.email },
      config.tempTokenSecret,
      {
        algorithm: "HS256",
        expiresIn: `1ms`,
      }
    );

    tempTokenInvalidID = jwt.sign(
      { _id: "1111", email: faker.internet.email(name) },
      config.tempTokenSecret,
      {
        algorithm: "HS256",
        expiresIn: `1h`,
      }
    );

    tempTokenUserNotFound = jwt.sign(
      { _id: mongoose.Types.ObjectId(), email: faker.internet.email(name) },
      config.tempTokenSecret,
      {
        algorithm: "HS256",
        expiresIn: `1h`,
      }
    );

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
    server.close();
    flush();
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

  describe("Testing Send OTP POST api/user/verification-code.json", () => {
    describe("Without credentials", () => {
      it("try to request otp without headers (Authorization)", () => {
        return request
          .post("/api/user/verification-code.json")
          .send()
          .then((response) => {
            expect(response.status).to.equal(401);
            expect("Content-Type", /json/);
            expect(response.body)
              .to.have.property("message")
              .to.equal("Not authorized user");
          });
      });
    });

    describe("With expired credentials", () => {
      it("create with expired headers (Authorization)", () => {
        return request
          .post("/api/user/verification-code.json")
          .set({ authorization: expiredTokenSession })
          .send()
          .then((response) => {
            expect(response.status).to.equal(401);
            expect("Content-Type", /json/);
            expect(response.body)
              .to.have.property("message")
              .to.equal("OTP validation time expired");
          });
      });
    });

    describe("With credentials for not valid user", () => {
      it("create with headers (Authorization) for not valid user id", () => {
        return request
          .post("/api/user/verification-code.json")
          .set({ authorization: `bearer ${tempTokenInvalidID}` })
          .send()
          .then((response) => {
            expect(response.status).to.equal(400);
            expect("Content-Type", /json/);
            expect(response.body)
              .to.have.property("message")
              .to.equal("Invalid User Id");
          });
      });
    });

    describe("With credentials for not exists user", () => {
      it("create with headers (Authorization) for not exists user", () => {
        return request
          .post("/api/user/verification-code.json")
          .set({ authorization: `bearer ${tempTokenUserNotFound}` })
          .send()
          .then((response) => {
            expect(response.status).to.equal(401);
            expect("Content-Type", /json/);
            expect(response.body)
              .to.have.property("message")
              .to.equal("user not authorized");
          });
      });
    });

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

  describe("Testing Verify OTP POST api/user/verify.json", () => {
    describe("Without credentials", () => {
      it("create without headers (Authorization)", () => {
        return request
          .post("/api/user/verify.json")
          .send({ otp: "818761" })
          .then((response) => {
            expect(response.status).to.equal(401);
            expect("Content-Type", /json/);
            expect(response.body)
              .to.have.property("message")
              .to.equal("Not authorized user");
          });
      });
    });

    describe("With expired credentials", () => {
      it("create with expired headers (Authorization)", () => {
        return request
          .post("/api/user/verify.json")
          .set({ authorization: `bearer ${expiredTokenSession}` })
          .send({ otp: "818761" })
          .then((response) => {
            expect(response.status).to.equal(401);
            expect("Content-Type", /json/);
            expect(response.body)
              .to.have.property("message")
              .to.equal("OTP validation time expired");
          });
      });
    });

    describe("With credentials for not exists user", () => {
      it("create with headers (Authorization) for not exists user", () => {
        return request
          .post("/api/user/verify.json")
          .set({ authorization: `bearer ${tempTokenUserNotFound}` })
          .send({ otp: "818761" })
          .then((response) => {
            expect(response.status).to.equal(401);
            expect("Content-Type", /json/);
            expect(response.body)
              .to.have.property("message")
              .to.equal("User is not found");
          });
      });
    });

    describe("OTP Validation", () => {
      describe("Without OTP", () => {
        it("try to verify otp without otp", () => {
          return request
            .post("/api/user/verify.json")
            .set({ authorization: `bearer ${tempToken}` })
            .send({})
            .then((response) => {
              expect(response.status).to.equal(400);
              expect(response.body)
                .to.have.property("message")
                .to.equal("code is required");
            });
        });
      });

      describe("With empty OTP", () => {
        it("try to verify otp with empty otp", () => {
          return request
            .post("/api/user/verify.json")
            .set({ authorization: `bearer ${tempToken}` })
            .send({ otp: "" })
            .then((response) => {
              expect(response.status).to.equal(400);
              expect(response.body)
                .to.have.property("message")
                .to.equal("code cannot be an empty field");
            });
        });
      });

      describe("With invalid OTP validation", () => {
        it("try to verify otp with invalid otp", () => {
          return request
            .post("/api/user/verify.json")
            .set({ authorization: `bearer ${tempToken}` })
            .send({ otp: "df5" })
            .then((response) => {
              expect(response.status).to.equal(400);
              expect(response.body)
                .to.have.property("message")
                .to.equal("invalid code");
            });
        });
      });
    });

    describe("With invalid OTP verification", () => {
      it("try to verify otp invalid otp", () => {
        return request
          .post("/api/user/verify.json")
          .set({ authorization: `bearer ${tempToken}` })
          .send({ otp: "123456" }) // otp not valid for this verification
          .then((response) => {
            expect(response.status).to.equal(400);
            expect(response.body).to.have.property("message");
            // .to.equal("Invalid code");
          });
      });
    });

    describe("With valid OTP", () => {
      it("try to verify valid otp", () => {
        // console.log(otp);
        return request
          .post("/api/user/verify.json")
          .set({ authorization: `bearer ${tempToken}` })
          .send({ otp })
          .then((response) => {
            console.log(response.body);
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property("verified").to.equal(true);
          });
      });
    });
  });
});
