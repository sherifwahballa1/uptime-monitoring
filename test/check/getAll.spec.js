const chai = require("chai");
const mongoose = require("mongoose");
const faker = require("faker");
const app = require("../../app");
require("mocha");
const flush = require("flush-cache");
const { expect, should } = chai;

const request = require("supertest").agent(app);
const User = require("./../../components/user/user.model");
const { describe } = require("mocha");
let server;

describe("GET ALL CHECK DATA GET api/check", () => {
  let name;
  let userData;
  let tempToken;
  let otp;
  let token;
  let checkData;
  let checkId;
  let checkData2;
  let checkId2;

  before(() => {
    checkData = {
      name: faker.name.findName().split(" ")[0],
      url: faker.internet.domainName(),
      protocol: faker.random.arrayElement(["HTTP", "HTTPS", "TCP"]),
      port: faker.internet.port(),
      path: "/",
      method: faker.random.arrayElement([
        "GET",
        "POST",
        "DELETE",
        "PUT",
        "PATCH",
      ]),
    };

    checkData2 = {
      name: faker.name.findName().split(" ")[0],
      url: faker.internet.domainName(),
      protocol: faker.random.arrayElement(["HTTP", "HTTPS", "TCP"]),
      port: faker.internet.port(),
      path: "/",
      method: faker.random.arrayElement([
        "GET",
        "POST",
        "DELETE",
        "PUT",
        "PATCH",
      ]),
    };

    // console.log(checkData);
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

    // remove the check
    describe("Remove the created check", () => {
      describe("Remove Successfully", () => {
        it("Remove check successfully", () => {
          return request
            .delete(`/api/check/${checkId}`)
            .send()
            .then((response) => {
              expect(response.status).to.equal(200);
              expect(response.body).to.have.property("message");
            });
        });

        it("Remove check2 successfully", () => {
          return request
            .delete(`/api/check/${checkId2}`)
            .send()
            .then((response) => {
              expect(response.status).to.equal(200);
              expect(response.body).to.have.property("message");
            });
        });
      });
    });

    // logout
    describe("Logout to clear cookies", () => {
      describe("logout Successfully", () => {
        it("User Logout successfully", () => {
          return request
            .post("/api/user/logout")
            .send()
            .then((response) => {
              expect(response.status).to.equal(200);
              expect(response.body).not.to.be.empty;
              expect(response.body).to.have.property("status");
            });
        });
      });
    });

    // close server and clear cache
    flush();
    server.close();
    delete require.cache[require.resolve("./../../server.js")];
    done();
  });

  describe("Register user before create", () => {
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

  describe("Send OTP", () => {
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

  describe("Verify OTP", () => {
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

  describe("Login after verifying", () => {
    describe("Login Successfully", () => {
      it("User Login successfully", () => {
        return request
          .post("/api/user/login.json")
          .send({
            email: userData.email,
            password: userData.password,
          })
          .then((response) => {
            token = `bearer ${response.body.token}`;
            expect(response.status).to.equal(200);
            expect(response.body).not.to.be.empty;
            expect(response.body).to.have.property("token");
          });
      });
    });
  });

  describe("Create new checks", () => {
    describe("Check with valid schema", () => {
      describe("new check", () => {
        it("Check new check", () => {
          return request
            .post("/api/check")
            .set({ authorization: token })
            .send(checkData)
            .then((response) => {
              console.log(response.body);
              checkId = response.body._id;
              expect(response.status).to.equal(200);
              expect(response.body)
                .be.a("object")
                .to.have.property("name")
                .to.equal(checkData.name);
            });
        });
      });

      describe("new check", () => {
        it("Check new check", () => {
          return request
            .post("/api/check")
            .set({ authorization: token })
            .send(checkData2)
            .then((response) => {
              console.log(response.body);
              checkId2 = response.body._id;
              expect(response.status).to.equal(200);
              expect(response.body)
                .be.a("object")
                .to.have.property("name")
                .to.equal(checkData2.name);
            });
        });
      });
    });
  });

  describe("Logout to clear cookies", () => {
    describe("logout Successfully", () => {
      it("User Logout successfully", () => {
        return request
          .post("/api/user/logout")
          .send()
          .then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body).not.to.be.empty;
            expect(response.body).to.have.property("status");
          });
      });
    });
  });

  describe("GET All Checks", () => {
    describe("get all checks", () => {
      describe("Without credentials", () => {
        it("try to create without headers (Authorization)", () => {
          return request
            .get(`/api/check`)
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

      describe("Login again", () => {
        describe("Login Successfully", () => {
          it("User Login successfully", () => {
            return request
              .post("/api/user/login.json")
              .send({
                email: userData.email,
                password: userData.password,
              })
              .then((response) => {
                token = `bearer ${response.body.token}`;
                expect(response.status).to.equal(200);
                expect(response.body).not.to.be.empty;
                expect(response.body).to.have.property("token");
              });
          });
        });
      });

      describe("All checks", () => {
        it("Checks data", () => {
          return request
            .get(`/api/check`)
            .set({ authorization: token })
            .send()
            .then((response) => {
              expect(response.status).to.equal(200);
            });
        });
      });
    });
  });
});
