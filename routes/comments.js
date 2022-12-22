const express = require("express");
const router = express.Router();
const { Comment, Post, User } = require("../models");

const authMiddleware = require("../middlewares/auth-middleware");

/**
 * 댓글 목록 조회 API
 * 조회하는 게시글에 작성된 모든 댓글을 목록 형식으로 볼 수 있게 하기
 * 작성 날짜 기준으로 내림차순 정렬
 * ! 목록 => 페이지네이션 있으면 좋음
 */
router.get("/comments/:postId", async (req, res) => {
    const { postId } = req.params;
    const comments = await Comment.findAll({
        attributes: ["id", "comment", "user_id"],
        where: { post_id: postId },
        order: [["createdAt", "DESC"]],
        include: {
            model: User,
            attributes: ["nickname"],
        },
    });
    if (comments.length > 0) {
        res.status(200).json({ data: comments });
    } else {
        res.status(400).json({ message: "댓글이 없습니다" });
    }
});

/**
 * 댓글 작성 API
 * 댓글 내용을 비워둔 채 댓글 작성 APi를 호출하면 "댓글 내용을 입력해주세요"라는 메세지를 return
 */
router.post("/comments/:postId", authMiddleware, async (req, res) => {
    const { postId } = req.params;
    const user = JSON.stringify(res.locals.user);
    const authUser = JSON.parse(user);
    const { comment } = req.body;
    const post = await Post.findOne({ where: { id: postId } });
    if (!post) {
        return res.status(400).json({
            message: "해당하는 게시글이 없습니다",
        });
    }
    if (!comment) {
        return res.status(400).json({
            success: false,
            message: "댓글 내용을 입력해주세요",
        });
    }
    await Comment.create({ comment, post_id: postId, user_id: authUser.id });
    res.status(201).json({
        message: "댓글을 생성하였습니다",
    });
});

/**
 * 댓글 수정 API
 * 댓글 내용을 비워둔 채 댓글 수정 API를 호출하면 "댓글 내용을 입력해주세요" 라는 메세지를 return
 */
router.put("/comments/:commentId", authMiddleware, async (req, res) => {
    const { commentId } = req.params;
    const { comment } = req.body;
    const user = JSON.stringify(res.locals.user);
    const authUser = JSON.parse(user);
    if (!comment) {
        return res.status(400).json({
            success: false,
            message: "댓글 내용을 입력해주세요",
        });
    }
    const comment2 = await Comment.findOne({
        where: { id: commentId },
    });
    if (comment2 && comment2.user_id == authUser.id) {
        await Comment.update({ comment }, { where: { id: commentId } });
        res.status(201).json({ message: "댓글을 수정하였습니다." });
    } else {
        return res.status(404).json({
            message: "해당하는 댓글이 없습니다",
        });
    }
});

/**
 * 댓글 삭제 API
 * 원하는 댓글 삭제
 */
router.delete("/comments/:commentId", authMiddleware, async (req, res) => {
    const { commentId } = req.params;
    const user = JSON.stringify(res.locals.user);
    const authUser = JSON.parse(user);
    const comment = await Comment.findOne({ where: { id: commentId } });
    if (comment && comment.user_id == authUser.id) {
        await Comment.destroy({ where: { id: commentId } });
        return res.status(200).json({ message: "댓글을 삭제하였습니다." });
    } else {
        return res.status(404).json({
            message: "해당하는 댓글이 없습니다",
        });
    }
});

module.exports = router;
