module.exports = (req,res,next) => {
    let logged = null;
    let access = null;
    let cat = null;
    const db = require("../database/models");
    const User = db.User;
    if(req.session && req.session.user != undefined) {
        logged = req.session.user
        access = req.session.access
        cat = req.session.cat
    }else{
    if(req.session.user == undefined && req.cookies.userEmail != undefined){
        User.findOne({where:{email:req.cookies.userEmail}})
        .then(user=> {
            req.session.user = user.dataValues;
            req.session.access = user.dataValues.rol_id;
            logged = req.session.user
            access = req.session.access
        })
    }
}
    res.locals.user = logged
    res.locals.access = access
    res.locals.cat = cat
    return next()
}