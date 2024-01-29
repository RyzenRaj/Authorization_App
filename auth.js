const bcrypt = require('bcrypt');
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const { options } = require('../routes/user');
require('dotenv').config();

const signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user with the same name or email already exists
        const existingEntry = await User.findOne({email});
        if (existingEntry) {
            return res.status(400).json({ msg: "User already exists" });
        }

        // Hash the password
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        } catch (error) {
            return res.status(500).json({ msg: "Error hashing password", error });
        }

        // Create a new user
        const result = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        });
        if (result){

            return res.status(201).json({ msg: "User created" });
        }

    } catch (error) {
        console.error("Error in signup:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};



//login 

const login = async (req, res) => {
    try {
        if (!req.body || !req.body.email || !req.body.password) {
            return res.status(400).json({ msg: "Please fill all the details" });
        }

        const { email, password } = req.body;

        const entryCheck = await User.findOne({ email });
        if (!entryCheck) {
            return res.status(400).json({ msg: "Please provide a valid email" });
        }
 
        const userData = {
            email: entryCheck.email,
            password: entryCheck.password,
            role: entryCheck.role
        };

        const isValidPassword = await bcrypt.compare(password, userData.password);
        if (!isValidPassword) {
            return res.status(400).json({ msg: "Password doesn't match" });
        }

        jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) {
                console.error("Error signing JWT:", err);
                return res.status(500).json({ msg: "Error signing JWT" });
            }

            userData.token = token;
            userData.password = undefined;

            const options = {
                expiresIn:new Date(Date.now()+ 30000),
                httpOnly: true,
                
            };
            
            res.cookie("token", token, options).status(200).json({
                success:true,
                userData,
                msg:"user logged in successfully"
            })



            
        });
    } catch (error) {
        console.error("Error in login:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};


module.exports = {signup,login};
