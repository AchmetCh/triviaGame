const express = require("express");
const router = express.Router()
const {generateQuestion , NewUser, topTenUsersScore, getHighScores} = require('../controllers/Controllers');
const { auth } = require("../middlewares/auth");

router.get('/generate-questions', generateQuestion)
router.post('/register', NewUser )
router.post('/update-score', auth, topTenUsersScore)
router.get('/high-scores', getHighScores)

module.exports = router