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

describe("Update CHECK DATA PATCH api/check/${id}", () => {
  let name;
  let userData;
  let tempToken;
  let otp;
  let token;
  let checkData2;
  let checkId;
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

  describe("Create a check", () => {
    describe("Check with valid schema", () => {
      describe("new check", () => {
        it("Check new check", () => {
          return request
            .post("/api/check")
            .set({ authorization: token })
            .send(checkData)
            .then((response) => {
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

  describe("Update the check", () => {
    describe("Without credentials", () => {
      it("try to create without headers (Authorization)", () => {
        return request
          .post("/api/check")
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

    describe("Update Check invalid check", () => {
      describe("invalid check", () => {
        let notRequiredFileds;

        before(() => {
          notRequiredFileds = {
            name: checkData.name,
            url: checkData.url,
            method: checkData.method,
            protocol: checkData.protocol,
          };
        });

        it("invalid check id", () => {
          return request
            .patch(`/api/check/123`)
            .set({ authorization: token })
            .send(notRequiredFileds)
            .then((response) => {
              expect(response.status).to.equal(404);
              expect(response.body)
                .be.a("object")
                .to.have.property("message")
                .to.equal("Invalid check");
            });
        });

        it("check not exits", () => {
          return request
            .patch(`/api/check/${mongoose.Types.ObjectId()}`)
            .set({ authorization: token })
            .send(notRequiredFileds)
            .then((response) => {
              expect(response.status).to.equal(404);
              expect(response.body)
                .be.a("object")
                .to.have.property("message")
                .to.equal("Check not found");
            });
        });
      });

      describe("update check with any invalid field", () => {
        let invalidFieldTimeout, invalidFieldInterval, invalidFieldPORT;

        before(() => {
          invalidFieldTimeout = {
            name: checkData.name,
            url: checkData.url,
            method: checkData.method,
            protocol: checkData.protocol,
            timeout: "this is string",
          };

          invalidFieldInterval = {
            name: checkData.name,
            url: checkData.url,
            method: checkData.method,
            protocol: checkData.protocol,
            interval: "this is string",
          };

          invalidFieldPORT = {
            name: checkData.name,
            url: checkData.url,
            method: checkData.method,
            protocol: checkData.protocol,
            interval: 5,
            port: "not port",
          };
        });

        it("update Check with invalid timeout field", () => {
          return request
            .patch(`/api/check/${checkId}`)
            .set({ authorization: token })
            .send(invalidFieldTimeout)
            .then((response) => {
              expect(response.status).to.equal(400);
              expect(response.body).be.a("object").to.have.property("message");
              // .to.equal("protocol is required");
            });
        });

        it("update Check with invalid interval field", () => {
          return request
            .patch(`/api/check/${checkId}`)
            .set({ authorization: token })
            .send(invalidFieldInterval)
            .then((response) => {
              expect(response.status).to.equal(400);
              expect(response.body).be.a("object").to.have.property("message");
              // .to.equal("protocol is required");
            });
        });

        it("update Check with invalid port field", () => {
          return request
            .patch(`/api/check/${checkId}`)
            .set({ authorization: token })
            .send(invalidFieldPORT)
            .then((response) => {
              expect(response.status).to.equal(400);
              expect(response.body).be.a("object").to.have.property("message");
              // .to.equal("protocol is required");
            });
        });
      });
    });

    describe("Check invalid Schema", () => {
      describe("update check with not required fields Validation", () => {
        let notRequiredFileds;

        before(() => {
          notRequiredFileds = {
            name: checkData.name,
            url: checkData.url,
            method: checkData.method,
            protocol: checkData.protocol,
            key: "NOT Valid field",
          };
        });

        it("Check with not required field", () => {
          return request
            .patch(`/api/check/${checkId}`)
            .set({ authorization: token })
            .send(notRequiredFileds)
            .then((response) => {
              expect(response.status).to.equal(400);
              expect(response.body).be.a("object").to.have.property("message");
              // .to.equal("protocol is required");
            });
        });
      });

      describe("update check with any invalid field", () => {
        let invalidFieldTimeout, invalidFieldInterval, invalidFieldPORT;

        before(() => {
          invalidFieldTimeout = {
            name: checkData.name,
            url: checkData.url,
            method: checkData.method,
            protocol: checkData.protocol,
            timeout: "this is string",
          };

          invalidFieldInterval = {
            name: checkData.name,
            url: checkData.url,
            method: checkData.method,
            protocol: checkData.protocol,
            interval: "this is string",
          };

          invalidFieldPORT = {
            name: checkData.name,
            url: checkData.url,
            method: checkData.method,
            protocol: checkData.protocol,
            interval: 5,
            port: "not port",
          };
        });

        it("update Check with invalid timeout field", () => {
          return request
            .patch(`/api/check/${checkId}`)
            .set({ authorization: token })
            .send(invalidFieldTimeout)
            .then((response) => {
              expect(response.status).to.equal(400);
              expect(response.body).be.a("object").to.have.property("message");
              // .to.equal("protocol is required");
            });
        });

        it("update Check with invalid interval field", () => {
          return request
            .patch(`/api/check/${checkId}`)
            .set({ authorization: token })
            .send(invalidFieldInterval)
            .then((response) => {
              expect(response.status).to.equal(400);
              expect(response.body).be.a("object").to.have.property("message");
              // .to.equal("protocol is required");
            });
        });

        it("update Check with invalid port field", () => {
          return request
            .patch(`/api/check/${checkId}`)
            .set({ authorization: token })
            .send(invalidFieldPORT)
            .then((response) => {
              expect(response.status).to.equal(400);
              expect(response.body).be.a("object").to.have.property("message");
              // .to.equal("protocol is required");
            });
        });
      });
    });

    describe("update Check valid Schema", () => {
      let nameUserbefore, validCheckInfo;

      before(() => {
        nameUserbefore = {
          name: checkData2.name,
        };
        validCheckInfo = {
          interval: 5,
        };
      });
      describe("update with name used before", () => {
        it("check name used before", () => {
          return request
            .patch(`/api/check/${checkId}`)
            .set({ authorization: token })
            .send(nameUserbefore)
            .then((response) => {
              console.log(response.body);
              expect(response.status).to.equal(429);
              expect(response.body)
                .be.a("object")
                .to.have.property("message")
                .to.equal("check name used before");
            });
        });
      });

      describe("update check", () => {
        it("update check successfully", () => {
          return request
            .patch(`/api/check/${checkId}`)
            .set({ authorization: token })
            .send(validCheckInfo)
            .then((response) => {
              expect(response.status).to.equal(200);
              expect(response.body)
                .be.a("object")
                .to.have.property("message")
                .to.equal("check updated successfully");
            });
        });
      });
    });
  });
});
