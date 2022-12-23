const express = require("express");
const router = express.Router();
const { Post, Like, User } = require("../models");
const logging = require("../middlewares/logging");

//~ 로그인 검사
const authMiddleware = require("../middlewares/auth-middleware");

/**
 * 전체 게시글 목록 조회 API
 * 작성 날짜 기준으로 내림차순 정렬
 */
router.get("/posts", logging, async (req, res) => {
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
router.post("/posts", logging, authMiddleware, async (req, res) => {
    const { title, content, likes } = req.body;
    const authUser = res.locals.user;
    await Post.create({ title, content, user_id: authUser.id, likes });

    res.status(201).json({
        message: "게시글 작성완료!",
    });
});

// 특정 게시글 조회 API
router.get("/posts/:postId", logging, async (req, res) => {
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
            errorMessage: "해당하는 게시글이 없습니다~",
        });
    }
});

/**
 * 게시글 수정 API
 * */
router.put("/posts/:postId", logging, authMiddleware, async (req, res) => {
    const { postId } = req.params;
    const { title, content } = req.body;
    const authUser = res.locals.user;
    const post = await Post.findOne({ where: { id: postId } });
    if (post && post.user_id === authUser.id) {
        await Post.update({ title, content }, { where: { id: postId } });
        res.status(201).json({ message: "게시글을 수정하였습니다." });
    } else {
        res.status(400).json({ errorMessage: "게시글이 존재하지 않습니다" });
    }
});

/**
 * 게시글 삭제 API
 */
router.delete("/posts/:postId", logging, authMiddleware, async (req, res) => {
    const { postId } = req.params;
    const authUser = res.locals.user;
    const post = await Post.findOne({ where: { id: postId } });
    if (post && post.user_id === authUser.id) {
        await Post.destroy({ where: { id: postId } });
        res.status(200).json({ message: "게시글을 삭제하였습니다." });
    } else {
        res.status(404).json({ errorMessage: "해당하는 게시글이 없습니다." });
    }
});

// 게시글 좋아요 API
router.post(
    "/posts/:postId/like",
    logging,
    authMiddleware,
    async (req, res, next) => {
        const { postId } = req.params;
        const authUser = res.locals.user;
        const post = await Post.findOne({ where: { id: postId } });
        const like = await Like.findOne({
            where: { post_id: postId, user_id: authUser.id },
        });
        try {
            if (!post) {
                return res
                    .status(404)
                    .json({ errorMessage: "게시글 존재하지 않습니다" });
            }
            if (!like) {
                await Like.create({
                    post_id: postId,
                    user_id: authUser.id,
                }).then(
                    Post.increment({ likes: 1 }, { where: { id: postId } })
                );
                return res.json({ message: "좋아요 완료" });
            } else {
                like.destroy().then(
                    Post.decrement({ likes: 1 }, { where: { id: postId } })
                );
                res.json({ message: "좋아요 취소" });
            }
        } catch {
            res.status(400).json({ errorMessage: "좋아요 실패" });
        }

        // if (post) {
        //     const post2 = await Post.findOne({ where: { id: postId } });
        //     await post2
        //         .addUser(User.id)
        //         .then(Post.increment({ likes: 1 }, { where: { id: postId } }));
        //     res.status(200).json({ message: "좋아요 완료" });
        // } else {
        //     res.status(404).json({ message: "해당하는 게시글이 없습니다." });
        // }
    }
);

// 좋아요 게시글 조회
router.get("/posts/list/like", logging, authMiddleware, async (req, res) => {
    const authUser = res.locals.user;

    //     const posts = await Post.findAll({
    //         order: [["likes", "DESC"]],
    //         include: [
    //             {
    //                 model: Like,
    //                 where: { UserId: User2.id },
    //                 // require: false, // left outer join
    //             },
    //         ],
    //     });
    //     res.status(200).json({ data: posts });
    // });
    const likePosts = await Like.findAll({
        attributes: ["post_id", "user_id"],
        where: { user_id: authUser.id },
        include: [
            {
                model: Post,
                attributes: ["title", "content", "likes"],
                include: [
                    {
                        model: User,
                        attributes: ["nickname"],
                    },
                ],
            },
        ],
    });
    // console.log(likePosts);
    if (likePosts.length > 0) {
        return res.status(200).json({ data: likePosts });
    } else {
        // if (likePosts.length == 0) {
        return res
            .status(404)
            .json({ errorMessage: "좋아요한 게시글이 존재하지 않습니다" });
    }
});

module.exports = router;
