const express = require("express");
const router = express.Router();
const { Post, Like, User } = require("../models");
//~ 로그인 검사
const authMiddleware = require("../middlewares/auth-middleware");

/**
 * 전체 게시글 목록 조회 API
 * 작성 날짜 기준으로 내림차순 정렬
 */
router.get("/posts", async (req, res) => {
    const posts = await Post.findAll({
        order: [["createdAt", "DESC"]],
        include: {
            model: User,
            attributes: ["nickname"],
        },
    });
    res.status(200).json({ data: posts });
});

// 게시글 작성 API
router.post("/posts", authMiddleware, async (req, res) => {
    const { title, content, likes } = req.body;
    const authUser = JSON.stringify(res.locals.user);
    const User = JSON.parse(authUser);
    await Post.create({ title, content, user_id: User.id, likes });

    res.status(201).json({
        message: "게시글 작성완료!",
    });
});

// 특정 게시글 조회 API
router.get("/posts/:postId", async (req, res) => {
    const { postId } = req.params;
    const post = await Post.findOne({
        where: {
            id: postId,
        },
    });
    if (post) {
        const result = await Post.findOne({
            where: { id: postId },
            include: {
                model: User,
                attributes: ["nickname"],
            },
        });
        res.status(200).json({ data: result });
    } else {
        res.status(404).json({
            message: "해당하는 게시글이 없습니다~",
        });
    }
});

/**
 * 게시글 수정 API
 * */
router.put("/posts/:postId", authMiddleware, async (req, res) => {
    const { postId } = req.params;
    const { title, content } = req.body;
    const authUser = JSON.stringify(res.locals.user);
    const User2 = JSON.parse(authUser);
    const post = await Post.findOne({ where: { id: postId } });
    if (post && post.user_id == User2.id) {
        await Post.update({ title, content }, { where: { id: postId } });
        res.status(201).json({ message: "게시글을 수정하였습니다." });
    } else {
        res.status(400).json({ message: "게시글이 존재하지 않습니다" });
    }
});

/**
 * 게시글 삭제 API
 */
router.delete("/posts/:postId", authMiddleware, async (req, res) => {
    const { postId } = req.params;
    const authUser = JSON.stringify(res.locals.user);
    const User2 = JSON.parse(authUser);
    const post = await Post.findOne({ where: { id: postId } });
    if (post && post.user_id == User2.id) {
        await Post.destroy({ where: { id: postId } });
        res.status(200).json({ message: "게시글을 삭제하였습니다." });
    } else {
        res.status(404).json({ message: "해당하는 게시글이 없습니다." });
    }
});

// 게시글 좋아요 API
router.post("/posts/:postId/like", authMiddleware, async (req, res, next) => {
    const { postId } = req.params;
    const authUser = JSON.stringify(res.locals.user);
    const User = JSON.parse(authUser);
    const post = await Post.findOne({ where: { id: postId } });

    if (post) {
        const post2 = await Post.findOne({ where: { id: postId } });
        await post2
            .addLiker(User.id)
            .then(Post.increment({ likes: 1 }, { where: { id: postId } }));
        res.status(200).json({ message: "좋아요 완료" });
    } else {
        res.status(404).json({ message: "해당하는 게시글이 없습니다." });
    }
});

// 게시글 좋아요 취소 API
router.delete("/posts/:postId/like", authMiddleware, async (req, res) => {
    const { postId } = req.params;
    const authUser = JSON.stringify(res.locals.user);
    const User = JSON.parse(authUser);
    const post = await Post.findOne({ where: { id: postId } });
    if (post) {
        const post2 = await Post.findOne({ where: { id: postId } });
        await post2
            .removeLiker(User.id)
            .then(Post.decrement({ likes: 1 }, { where: { id: postId } }));
        res.status(200).json({ message: "좋아요 취소 완료" });
    } else {
        res.status(404).json({ message: "해당하는 게시글이 없습니다." });
    }
});

// 좋아요 게시글 조회
router.get("/posts/list/like", authMiddleware, async (req, res) => {
    const authUser = JSON.stringify(res.locals.user);
    const User2 = JSON.parse(authUser);

    const posts = await Post.findAll({
        order: [["likes", "DESC"]],
        include: [
            {
                model: Like,
                where: { UserId: User2.id },
                // require: false, // left outer join
            },
        ],
    });
    res.status(200).json({ data: posts });
});

module.exports = router;
