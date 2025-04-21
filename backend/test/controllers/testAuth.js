const expect = require("chai").expect;
const sinon = require("sinon");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../../models/User");
const authController = require("../../controllers/auth");

describe("Auth Controller", () => {
  beforeEach(async () => {
    await mongoose.connect(process.env.MONGO_TEST_URL);
    console.log("Database connected");
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    next = sinon.spy();
  });

  afterEach(async () => {
    await User.deleteMany({});
    sinon.restore(); // 全てのstubやspyを元に戻す
  });

  describe("Signup", () => {
    it("should create new user", async () => {
      console.log("Database connected");

      const req = {
        body: {
          email: "new email",
          password: "user password",
          confirmPassword: "user password",
        },
      };

      sinon.stub(User, "findOne").resolves(null);

      await authController.postSignup(req, res, next);

      expect(res.status.calledWith(202)).to.be.true;
      expect(res.json.calledWith({ message: "new user created" })).to.be.true;
    });

    it("should throw an error when an email exists", async () => {
      const req = {
        body: {
          email: "existing email",
          password: "user password",
          confirmPassword: "password which does not match above",
        },
      };

      sinon.stub(User, "findOne").resolves({ email: "existing email" });

      await authController.postSignup(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.getCall(0).args[0]).to.be.instanceOf(Error);
      expect(next.getCall(0).args[0].message).to.equal(
        "Pick another email or login"
      );
      expect(next.getCall(0).args[0].statusCode).to.equal(422);
    });

    it("should throw an error when password does not match to password confirmation", async () => {
      const req = {
        body: {
          email: "new email",
          password: "user password",
          confirmPassword: "password which does not match above",
        },
      };

      sinon.stub(User, "findOne").resolves(null);
      await authController.postSignup(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.getCall(0).args[0]).to.be.instanceOf(Error);
      expect(next.getCall(0).args[0].statusCode).to.equal(422);
      expect(next.getCall(0).args[0].message).to.equal(
        "Passwords do not match"
      );
    });
  });

  describe("login", () => {
    it("success login with correct args", async () => {
      const req = {
        body: {
          email: "new email",
          password: "user password",
        },
      };

      await authController.postLogin(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
    });

    it("should throw an error when no email matches", async () => {
      const req = {
        body: {
          email: "email",
          password: "password",
        },
      };

      sinon.stub(User, "findOne").resolves(null);

      await authController.postLogin(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.getCall(0).args[0]).to.be.instanceOf(Error);
      expect(next.getCall(0).args[0].message).to.equal("Please signup");
      expect(next.getCall(0).args[0].statusCode).to.equal(401);
    });

    it("should throw an error when password is incorrect", async () => {
      const req = {
        body: {
          email: "email",
          password: "password",
        },
      };

      sinon
        .stub(User, "findOne")
        .resolves({ email: "email", password: "password" });

      sinon.stub(bcrypt, "compare").resolves(false);

      await authController.postLogin(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.getCall(0).args[0]).to.be.instanceOf(Error);
      expect(next.getCall(0).args[0].message).to.equal("wrong password");
      expect(next.getCall(0).args[0].statusCode).to.equal(401);
    });
  });
});
