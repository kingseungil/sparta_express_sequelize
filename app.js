const express = require("express");
const { sequelize } = require("./models");
const morgan = require("morgan");
const app = express();
const port = 3000;

const postsRouter = require("./routes/posts.js");
const commentsRouter = require("./routes/comments.js");
const usersRouter = require("./routes/users.js");
app.use(morgan("dev"));
sequelize
    .sync({ force: false })
    .then(() => {
        console.log("데이터베이스 연결 성공");
    })
    .catch((err) => {
        console.error(err);
    });
app.use(express.json());
app.use("/api", [postsRouter, commentsRouter, usersRouter]);

app.get("/", (req, res) => res.send("Hello World!")); //~ 엔트리포인트

app.listen(port, () => console.log(port, "포트로 서버가 열렸습니다"));
