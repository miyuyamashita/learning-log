const expect = require("chai").expect;
const sinon = require("sinon");
const isAuthMiddleWare = require("../middleware/isAuth");
const jwt = require("jsonwebtoken");

describe("Auth middleware", () => {
  beforeEach(() => {
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    next = sinon.spy();
  });

  afterEach(() => {
    sinon.restore(); // 全てのstubやspyを元に戻す
  });

  it("should throw an error when authorization header is missing", () => {
    const req = {
      get: () => {
        return null;
      },
    };

    isAuthMiddleWare(req, res, next);

    expect(next.calledOnce).to.be.true;
    const nextArg = next.getCall(0).args[0];
    expect(nextArg).to.be.an("error");
    expect(nextArg.message).to.equal("No Authorization Header attached");
    expect(nextArg.statusCode).to.equal(401);
  });

  it("should throw an error when authorization header cannot be splitted", () => {
    const req = {
      get: () => {
        return "OneStringHeader";
      },
    };

    isAuthMiddleWare(req, res, next);

    expect(next.calledOnce).to.be.true;
    const nextArg = next.getCall(0).args[0];
    expect(nextArg).to.be.an("error");
    expect(nextArg.message).to.equal(
      "Token not provided in expected format: 'Bearer <token>'"
    );
    expect(nextArg.statusCode).to.equal(401);
  });

  it("should throw an error when token is not valid", () => {
    const req = {
      get: () => {
        return "Bearer invalidToken";
      },
    };

    isAuthMiddleWare(req, res, next);

    expect(next.calledOnce).to.be.true;
    const nextArg = next.getCall(0).args[0];
    expect(nextArg).to.be.instanceOf(Error); //throw (JsonWebTokenError)
  });

  it("should have req.userId when user is verified", () => {
    const req = {
      get: () => {
        return "Bearer validToken";
      },
    };
    sinon.stub(jwt, "verify").returns({ userId: "userId" });

    isAuthMiddleWare(req, res, next);

    expect(next.calledOnce).to.be.true;
    expect(req).to.have.ownProperty("userId");
    expect(req.userId).to.equal("userId");
  });
});
