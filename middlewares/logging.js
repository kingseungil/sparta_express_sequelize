const logger = require("../config/logger");
module.exports = (req, res, next) => {
    let logStr = {};

    try {
        // 메소드
        logStr.method = req.method;

        switch (req.method) {
            case "GET":
                logStr.query = req.query;
                break;
            case "POST":
                logStr.body = req.body;
                break;
            case "PUT":
                logStr.body = req.body;
                break;
            case "DELETE":
                logStr.query = req.query;
                break;
        }

        logger.info(JSON.stringify(logStr));

        next();
    } catch (Err) {
        logger.error(Err);
        res.send({ success: false });
    }
};
