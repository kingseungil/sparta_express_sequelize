const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const { secretKey, option } = require("../config/secretKey");
const authMiddleware = require("../middlewares/auth-middleware");
const logging = require("../middlewares/logging");
const { Op } = require("sequelize");
const { User } = require("../models");
const bcrypt = require("bcrypt");

// 유효성 검사
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    return res.status(400).json({ message: errors.array() });
};

//~ 회원가입
router.post(
    "/signup",
    logging,
    [
        body("nickname")
            .trim()
            .isAlphanumeric()
            .withMessage("알파벳과 숫자만 가능합니다")
            .isLength({ min: 3 })
            .withMessage("닉네임은 3글자 이상!"),
        body("password")
            .trim()
            .isLength({ min: 4 })
            .withMessage("비밀번호는 4글자 이상!"),
        validate,
    ],
    async (req, res) => {
        const { nickname, password, confirmPassword } = req.body;

        // 비밀번호 확인
        if (password !== confirmPassword) {
            return res.status(412).send({
                errorMessage: "패스워드가 일치하지 않습니다.",
            });
        }
        if (password.includes(nickname) == true) {
            return res.status(412).send({
                errorMessage: "닉네임이 포함되면 안돼용",
            });
        }

        // 닉네임 중복확인
        const existNickname = await User.findAll({
            where: {
                [Op.or]: [{ nickname }],
            },
        });
        if (existNickname.length > 0) {
            return res.status(412).send({
                errorMessage: "중복된 닉네임입니다.",
            });
        }
        await User.create({
            nickname,
            password: bcrypt.hashSync(password, 10),
        });
        res.status(201).send({
            message: "회원가입 완료!",
        });
    }
);

//~ 로그인
router.post("/login", logging, async (req, res) => {
    const { nickname, password } = req.body;
    const user = await User.findOne({
        where: {
            nickname,
        },
    });
    const payload = {
        userId: user.id,
        nickname: user.nickname,
    };
    const passwordValid = bcrypt.compareSync(password, user.password);
    if (!user || !passwordValid) {
        res.status(412).send({
            errorMessage: "닉네임 또는 패스워드를 확인해주세요",
        });
        return;
    } else {
        res.send({
            token: jwt.sign(payload, secretKey, option),
            nickname,
        });
    }
});

//~ 내 정보 가져오기
router.get("/users/me", logging, authMiddleware, async (req, res) => {
    res.json({ user: res.locals.user });
});

module.exports = router;
