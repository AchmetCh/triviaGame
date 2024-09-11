const express = require("express");
const router = express.Router()
const {generateQuestion , NewUser, topTenUsersScore, getHighScores, deleteUsersNotInTopTen} = require('../controllers/Controllers');
const { auth } = require("../middlewares/auth");

router.get('/generate-questions', generateQuestion)
router.post('/register', NewUser )
router.post('/update-score',topTenUsersScore)
router.get('/high-scores',getHighScores)
router.delete('/deleteUsers', deleteUsersNotInTopTen)

module.exports = router