const express = require("express");
const { sequelize } = require("./models");
const morgan = require("morgan");
const logger = require("./config/logger");
const postsRouter = require("./routes/posts.js");
const commentsRouter = require("./routes/comments.js");
const usersRouter = require("./routes/users.js");

const app = express();
const port = 3000;

app.use(morgan("dev"));
// app.use(morgan("dev", { stream: logger.stream }));
sequelize
    .sync({ force: false })
    .then(() => {
        console.log("데이터베이스 연결 성공!");
    })
    .catch((err) => {
        console.error(err);
    });
app.use(express.json());
app.use("/api", [postsRouter, commentsRouter, usersRouter]);

app.get("/test/info", (req, res, next) => {
    logger.info("info test");
    res.status(200).send({
        message: "info test!",
    });
});

app.get("/test/error", (req, res, next) => {
    logger.error("error test");
    res.status(500).send({
        message: "error test!",
    });
});

// app.get("/", (req, res) => res.send("Hello World!")); //~ 엔트리포인트

app.listen(port, () => logger.info(`Server listening on port ${port}`));
