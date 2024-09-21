const express = require('express');
const userRouter = require('./userRouter')
const taskRouter = require('./taskRouter')

const router = express.Router();

router.use('/user', userRouter);
router.use('/task', taskRouter);

module.exports = router;