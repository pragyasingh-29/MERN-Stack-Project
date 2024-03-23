const User = require("../models/user");

module.exports.renderSignupForm = (req, res)=>{
    res.render("users/signup.ejs");
}

module.exports.renderLoginForm = (req, res)=>{
    res.render("users/login.ejs");
}

module.exports.login = (req, res)=>{
    req.flash("success","Welcome back to Wanderlust.");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout =  (req, res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
    req.flash("success","you are logged out !");
    res.redirect("/listings");
 })
}



module.exports.signup = async (req, res)=>{
    try{
        let {username, email, phone, password} = req.body;
        const newUser = new User({email, username, phone});
        const registeredUser = await User.register(newUser,password);
        req.login(registeredUser,(err)=>{ // For direct login afetr signup
            if(err){
                return next(err);
            }
            console.log(registeredUser);
            req.flash("success","Welcome to Wanderlust !");
            res.redirect("/listings");
        })
    }
 catch(e){
    req.flash("error",e.message);
    res.redirect("/signup");
    }
}


