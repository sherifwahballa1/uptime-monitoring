const chai = require("chai");
const jwt = require("jsonwebtoken");
const faker = require("faker");
const app = require("../../app");
require("mocha");
const flush = require("flush-cache");
const { expect, should } = chai;

const request = require("supertest").agent(app);
const User = require("./../../components/user/user.model");
const { describe } = require("mocha");
let server;

describe("Create NEW CHECK POST api/check/", () => {
  let name;
  let userData;
  let tempToken;
  let otp;
  let token;
  let checkData;
  let checkId;

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

  describe("Testing create new check", () => {
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

    describe("Check Validation Schema", () => {
      describe("Check invalid Schema", () => {
        describe("check name Validation", () => {
          let checkDataWithoutName,
            checkDataWithEmptyName,
            checkDataWithInvalidName;

          before(() => {
            checkDataWithoutName = {
              url: checkData.url,
              protocol: checkData.protocol,
              method: checkData.method,
            };

            checkDataWithEmptyName = {
              name: "",
              url: checkData.url,
              protocol: checkData.protocol,
              method: checkData.method,
            };

            checkDataWithInvalidName = {
              name: "%^$%^",
              url: checkData.url,
              protocol: checkData.protocol,
              method: checkData.method,
            };
          });

          it("Check name Required", () => {
            return request
              .post("/api/check")
              .set({ authorization: token })
              .send(checkDataWithoutName)
              .then((response) => {
                expect(response.status).to.equal(400);
                expect(response.body)
                  .be.a("object")
                  .to.have.property("message")
                  .to.equal("check name is required");
              });
          });

          it("Check name is empty filed", () => {
            return request
              .post("/api/check")
              .set({ authorization: token })
              .send(checkDataWithEmptyName)
              .then((response) => {
                expect(response.status).to.equal(400);
                expect(response.body)
                  .to.have.property("message")
                  .to.equal("check name cannot be an empty field");
              });
          });

          it("Check name Invalid", () => {
            return request
              .post("/api/check")
              .set({ authorization: token })
              .send(checkDataWithInvalidName)
              .then((response) => {
                expect(response.status).to.equal(400);
                expect(response.body)
                  .to.have.property("message")
                  .to.equal(
                    "check name must be consists of letters & numbers only"
                  );
              });
          });
        });

        describe("check url Validation", () => {
          let checkDataWithoutURL, checkDataWithEmptyURL;

          before(() => {
            checkDataWithoutURL = {
              name: checkData.name,
              protocol: checkData.protocol,
              method: checkData.method,
            };

            checkDataWithEmptyURL = {
              name: checkData.name,
              url: "",
              protocol: checkData.protocol,
              method: checkData.method,
            };

            checkDataWithInvalidName = {
              name: "%^$%^",
              url: checkData.url,
              protocol: checkData.protocol,
              method: checkData.method,
            };
          });

          it("Check url Required", () => {
            return request
              .post("/api/check")
              .set({ authorization: token })
              .send(checkDataWithoutURL)
              .then((response) => {
                expect(response.status).to.equal(400);
                expect(response.body)
                  .be.a("object")
                  .to.have.property("message")
                  .to.equal("url is required");
              });
          });

          it("Check url is empty filed", () => {
            return request
              .post("/api/check")
              .set({ authorization: token })
              .send(checkDataWithEmptyURL)
              .then((response) => {
                expect(response.status).to.equal(400);
                expect(response.body)
                  .to.have.property("message")
                  .to.equal("url cannot be an empty field");
              });
          });
        });

        describe("check method Validation", () => {
          let checkDataWithoutMethod,
            checkDataWithEmptyMethod,
            checkDataWithInvalidMethod;

          before(() => {
            checkDataWithoutMethod = {
              name: checkData.name,
              url: checkData.url,
              protocol: checkData.protocol,
            };

            checkDataWithEmptyMethod = {
              name: checkData.name,
              url: checkData.url,
              protocol: checkData.protocol,
              method: "",
            };

            checkDataWithInvalidMethod = {
              name: checkData.name,
              url: checkData.url,
              protocol: checkData.protocol,
              method: "%^$%^",
            };
          });

          it("Check method Required", () => {
            return request
              .post("/api/check")
              .set({ authorization: token })
              .send(checkDataWithoutMethod)
              .then((response) => {
                expect(response.status).to.equal(400);
                expect(response.body)
                  .be.a("object")
                  .to.have.property("message")
                  .to.equal("method is required");
              });
          });

          it("Check method is empty filed", () => {
            return request
              .post("/api/check")
              .set({ authorization: token })
              .send(checkDataWithEmptyMethod)
              .then((response) => {
                expect(response.status).to.equal(400);
                expect(response.body)
                  .to.have.property("message")
                  .to.equal(
                    "method must be one of [GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS]"
                  );
              });
          });

          it("Check method Invalid", () => {
            return request
              .post("/api/check")
              .set({ authorization: token })
              .send(checkDataWithInvalidMethod)
              .then((response) => {
                expect(response.status).to.equal(400);
                expect(response.body)
                  .to.have.property("message")
                  .to.equal(
                    "method must be one of [GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS]"
                  );
              });
          });
        });

        describe("check protocol Validation", () => {
          let checkDataWithoutProtocol,
            checkDataWithEmptyProtocol,
            checkDataWithInvalidProtocol;

          before(() => {
            checkDataWithoutProtocol = {
              name: checkData.name,
              url: checkData.url,
              method: checkData.method,
            };

            checkDataWithEmptyProtocol = {
              name: checkData.name,
              url: checkData.url,
              protocol: "",
              method: checkData.method,
            };

            checkDataWithInvalidProtocol = {
              name: checkData.name,
              url: checkData.url,
              protocol: "TYY",
              method: checkData.method,
            };
          });

          it("Check protocol Required", () => {
            return request
              .post("/api/check")
              .set({ authorization: token })
              .send(checkDataWithoutProtocol)
              .then((response) => {
                expect(response.status).to.equal(400);
                expect(response.body)
                  .be.a("object")
                  .to.have.property("message")
                  .to.equal("protocol is required");
              });
          });

          it("Check protocol is empty filed", () => {
            return request
              .post("/api/check")
              .set({ authorization: token })
              .send(checkDataWithEmptyProtocol)
              .then((response) => {
                expect(response.status).to.equal(400);
                expect(response.body)
                  .to.have.property("message")
                  .to.equal("protocol must be one of [HTTP, HTTPS, TCP]");
              });
          });

          it("Check protocol Invalid", () => {
            return request
              .post("/api/check")
              .set({ authorization: token })
              .send(checkDataWithInvalidProtocol)
              .then((response) => {
                expect(response.status).to.equal(400);
                expect(response.body)
                  .to.have.property("message")
                  .to.equal("protocol must be one of [HTTP, HTTPS, TCP]");
              });
          });
        });

        describe("check with not required fields Validation", () => {
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

          it("Check with not Required field", () => {
            return request
              .post("/api/check")
              .set({ authorization: token })
              .send(notRequiredFileds)
              .then((response) => {
                expect(response.status).to.equal(400);
                expect(response.body)
                  .be.a("object")
                  .to.have.property("message");
                // .to.equal("protocol is required");
              });
          });
        });

        describe("check with any invalid field", () => {
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

          it("Check with invalid timeout field", () => {
            return request
              .post("/api/check")
              .set({ authorization: token })
              .send(invalidFieldTimeout)
              .then((response) => {
                expect(response.status).to.equal(400);
                expect(response.body)
                  .be.a("object")
                  .to.have.property("message");
                // .to.equal("protocol is required");
              });
          });

          it("Check with invalid interval field", () => {
            return request
              .post("/api/check")
              .set({ authorization: token })
              .send(invalidFieldInterval)
              .then((response) => {
                expect(response.status).to.equal(400);
                expect(response.body)
                  .be.a("object")
                  .to.have.property("message");
                // .to.equal("protocol is required");
              });
          });

          it("Check with invalid port field", () => {
            return request
              .post("/api/check")
              .set({ authorization: token })
              .send(invalidFieldPORT)
              .then((response) => {
                expect(response.status).to.equal(400);
                expect(response.body)
                  .be.a("object")
                  .to.have.property("message");
                // .to.equal("protocol is required");
              });
          });
        });
      });

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

        describe("new check with the same name or url", () => {
          it("Check check with the same name or url", () => {
            return request
              .post("/api/check")
              .set({ authorization: token })
              .send(checkData)
              .then((response) => {
                expect(response.status).to.equal(409);
                expect(response.body)
                  .be.a("object")
                  .to.have.property("message");
              });
          });
        });
      });
    });
  });
});
