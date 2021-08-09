const jwt = require("jsonwebtoken");
const Userdetail = require("../models/Userdetail")

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (token !== undefined) {
            const verifyUser = jwt.verify(token, "mynameisjawedahmedfullstackdeveloper");
            console.log(verifyUser);
            const user = await Userdetail.findOne({ _id: verifyUser._id });
            console.log(user.name);
            req.token = token
            req.user = user

            next();
        }else{
            req.flash('error_msg', 'You must Login first')
            res.redirect("/users/login");
        }

    }
    catch (error) {
        res.status(401).send(error);
    }
}
module.exports = auth;
