const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { secretKey } = require("../config/secretKey");

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    // authType: Bearer , authToken: 토큰 값
    const [authType, authToken] = authorization.split(" ");
    console.log([authType, authToken]);
    if (!authToken || authType !== "Bearer") {
        res.status(401).send({
            errorMessage: "로그인 후 이용 가능합니다~",
        });
        return;
    }
    try {
        const { userId } = jwt.verify(authToken, secretKey);
        console.log(userId);
        User.findByPk(userId).then((user) => {
            res.locals.user = user;
            next();
        });
    } catch (err) {
        res.status(401).send({
            errorMessage: "로그인 후 이용 가능합니다!",
        });
    }
};
