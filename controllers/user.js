const User = require("../models/user.js");
const { v4: uuidv4} = require("uuid")
const {setUser} = require('../service/auth.js');
const { response } = require("express");
async function handleUserSignup(req, res) {
    const { name, email, password } = req.body;
    const user = await User.create({
        name,
        email,
        password,
        // isAdmin: false,
    });
    return res.redirect("/");
}
async function handleUserLogin(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) return res.render("login", {
        error: "Invalid username or password",
    })
   
    let token = setUser(user);
    res.cookie('token', token);
    return res.redirect('/');
}

module.exports = {
    handleUserSignup,
    handleUserLogin,
}