//@desc     bring request info to console
const logger = (req, res, next) => {
    console.log(` ${req.protocol}s://${req.host}${req.originalUrl}`);
    next()
};

module.exports=logger
