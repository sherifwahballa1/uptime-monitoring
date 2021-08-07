const chai = require("chai");
const app = require("../../app");
const { expect, should } = chai;
require("mocha");
const request = require("supertest").agent(app);
const faker = require("faker");
const Feature = require("./../../components/notify-feature/notify-feature.model");
const User = require("./../../components/user/user.model");
let server;

describe("Registration", () => {
  let name;
  let password;
  let email;
  before(() => {
    name = faker.name.firstName();
    email = faker.internet.email(name);
    password = faker.internet.password(7, false) + "0I@";
    featureName = faker.name.firstName();
    server = require("../../server");
  });

  after((done) => {
    console.log("Sign up Done Successfully");

    // remove the created feature
    Feature.findOneAndDelete({ name: featureName }).then((data) => {
      console.log("Done");
    });

    // remove the created user

    User.findOneAndDelete({ email }).then((data) => {
      console.log("Done");
    });

    // close server and clear cache
    server.close();
    delete require.cache[require.resolve("./../../server")];
    done();
  });

  describe("Testing User Register POST api/user/signup.json", () => {
    describe("Signup Validation Schema", () => {
      describe("User name Validation", () => {
        let userDataWithoutName, userDataWithEmptyName, userDataWithInvalidName;

        before(() => {
          userDataWithoutName = {
            email,
            password,
          };

          userDataWithEmptyName = {
            name: "",
            email,
            password,
          };

          userDataWithInvalidName = {
            name: faker.name.title() + faker.datatype.number(50),
            email: faker.internet.email(name),
            password: password,
          };
        });

        it("User name Required", () => {
          return request
            .post("/api/user/signup.json")
            .send(userDataWithoutName)
            .then((response) => {
              expect(response.status).to.equal(400);
              expect(response.body)
                .be.a("object")
                .to.have.property("message")
                .to.equal("name is required");
            });
        });

        it("User name is empty filed", () => {
          return request
            .post("/api/user/signup.json")
            .send(userDataWithEmptyName)
            .then((response) => {
              expect(response.status).to.equal(400);
              expect(response.body)
                .to.have.property("message")
                .to.equal("name cannot be an empty field");
            });
        });

        it("User name Invalid", () => {
          return request
            .post("/api/user/signup.json")
            .send(userDataWithInvalidName)
            .then((response) => {
              expect(response.status).to.equal(400);
              expect(response.body)
                .to.have.property("message")
                .to.equal("name must be consists of letters only");
            });
        });
      });

      describe("User Email Validation", () => {
        let userWithoutEmail, userWithEmptyEmail, userWithInvalidEmail;
        before(() => {
          userWithoutEmail = {
            name,
            password,
          };

          userWithEmptyEmail = {
            name,
            email: "",
            password,
          };

          userWithInvalidEmail = {
            name,
            email: faker.name.gender(),
            password,
          };
        });

        it("User email Required", () => {
          return request
            .post("/api/user/signup.json")
            .send(userWithoutEmail)
            .then((response) => {
              expect(response.status).to.equal(400);
              expect(response.body)
                .to.have.property("message")
                .to.equal("email is required");
            });
        });

        it("User Email is empty filed", () => {
          return request
            .post("/api/user/signup.json")
            .send(userWithEmptyEmail)
            .then((response) => {
              expect(response.status).to.equal(400);
              expect(response.body)
                .to.have.property("message")
                .to.equal("email cannot be an empty field");
            });
        });

        it("User Email Invalid", () => {
          return request
            .post("/api/user/signup.json")
            .send(userWithInvalidEmail)
            .then((response) => {
              expect(response.status).to.equal(400);
              expect(response.body)
                .to.have.property("message")
                .to.equal("Invalid email");
            });
        });
      });

      describe("User Password Validation", () => {
        let userWithoutPassword, userWithEmptyPassword, userWithInvalidPassword;
        before(() => {
          // team name
          userWithoutPassword = {
            name,
            email,
          };

          userWithEmptyPassword = {
            name,
            email,
            password: "",
          };

          userWithInvalidPassword = {
            name,
            email,
            password: faker.name.firstName().length,
          };
        });

        it("User password Required", () => {
          return request
            .post("/api/user/signup.json")
            .send(userWithoutPassword)
            .then((response) => {
              expect(response.status).to.equal(400);
              expect(response.body)
                .to.have.property("message")
                .to.equal("password is required");
            });
        });

        it("User password is empty filed", () => {
          return request
            .post("/api/user/signup.json")
            .send(userWithEmptyPassword)
            .then((response) => {
              expect(response.status).to.equal(400);
              expect(response.body)
                .to.have.property("message")
                .to.equal("password cannot be an empty field");
            });
        });

        it("User password Invalid", () => {
          return request
            .post("/api/user/signup.json")
            .send(userWithInvalidPassword)
            .then((response) => {
              expect(response.status).to.equal(400);
              expect(response.body)
                .to.have.property("message")
                .to.equal(
                  "password must be at least a minimum of 8 characters long"
                );
            });
        });
      });

      describe("Notifications Validation", () => {
        let emptyNotificationData,
          emptyArrNotificationData,
          notAllowedNotificationType,
          notAllowedNotificationData,
          newCheck;
        before(async () => {
          // create new feature;
          newCheck = await Feature.create({
            type: "voice",
            name: featureName,
            providers: ["userKey"],
          });

          emptyNotificationData = {
            name,
            email,
            password,
            notifications: "",
          };

          emptyArrNotificationData = {
            name,
            email,
            password,
            notifications: [],
          };

          notAllowedNotificationType = {
            name,
            email,
            password,
            notifications: [
              {
                type: name,
              },
            ],
          };

          notAllowedNotificationData = {
            name,
            email,
            password,
            notifications: [
              {
                type: featureName,
              },
            ],
          };
        });

        it("Notifications field Invalid", () => {
          return request
            .post("/api/user/signup.json")
            .send(emptyNotificationData)
            .then((response) => {
              console.log(response.body.message);
              expect(response.status).to.equal(400);
              expect(response.body)
                .to.have.property("message")
                .to.equal("notifications must be an array");
            });
        });

        it("Notifications field Invalid Empty array", () => {
          return request
            .post("/api/user/signup.json")
            .send(emptyArrNotificationData)
            .then((response) => {
              expect(response.status).to.equal(400);
              expect(response.body).to.have.property("message");
            });
        });

        it("Notifications feature not allowed", () => {
          return request
            .post("/api/user/signup.json")
            .send(notAllowedNotificationType)
            .then((response) => {
              expect(response.status).to.equal(400);
              expect(response.body).to.have.property("message");
            });
        });

        it("Notifications keys data not valid", () => {
          return request
            .post("/api/user/signup.json")
            .send(notAllowedNotificationData)
            .then((response) => {
              expect(response.status).to.equal(400);
              expect(response.body).to.have.property("message");
            });
        });
      });
    });

    describe("Signup with Valid Schema", () => {
      let userData;
      before(() => {
        userData = {
          name,
          email,
          password,
        };
      });
      describe("Register and send temporary token", () => {
        it("Save User Data and Send temp token", () => {
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

      describe("Register Email Already registered before", () => {
        it("Email Already used before", () => {
          return request
            .post("/api/user/signup.json")
            .send(userData)
            .then((response) => {
              expect(response.status).to.equal(409);
              expect(response.body)
                .to.have.property("message")
                .to.equal("Email already registered before");
            });
        });
      });
    });
  });
});
