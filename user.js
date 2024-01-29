const express = require("express")
const router =express.Router();


const {signup,login} = require('../controllers/auth.js')
const {auth,isStudent,isAdmin}= require('../middlewares/auth.js')



router.post('/signup', signup); 
router.post('/login', login);
router.get('/test',auth);

router.get('/student', auth, isStudent , (req,res)=>{

    res.json({
        msg:"you are in the student section"
    })
    console.log("you are in the student section")
})
router.get('/admin', auth, isAdmin , (req,res)=>{
    res.json({
        msg:"you are in the admin section"
    })
})


module.exports = router;