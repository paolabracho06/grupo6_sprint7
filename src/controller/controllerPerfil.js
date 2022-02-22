const path = require("path")
let db = require("../database/models");
const sequelize = db.sequelize;
const {Op} = require("sequelize");
const { compareSync, hashSync }= require('bcryptjs');
//llamamos los modelos
const User = db.User
const Address = db.Address;
const controllerPerfil={
    detail:(req,res)=>{
        // db.User.findAll()
        //  .then((a)=>{
        //     res.send(a)
        //  })
        //  .catch(e=> console.log(e))
        User.findByPk(req.params.id)
        .then((user)=>{
             console.log(user);
             if(user !== null){
                 res.render('user/profile.ejs',{title: "Perfil",userData:user.dataValues})
             }else{
                 res.redirect('/');
             }
         })
    },
    edit: (req,res)=>{
        let userConsult = User.findByPk(req.params.id);
        let addressConsult = Address.findOne({where:{user_id:req.params.id}});
        Promise.all([userConsult,addressConsult])
        .then(([user,address])=>{
            res.render("user/profileEdit.ejs",{user,address})
        })
    },
    addressProcess: (req,res)=>{
        Address.update({
            province: req.body.province,
            city: req.body.city,
            street: req.body.street,
            number: req.body.number,
            cp: req.body.cp,
            phone: req.body.phone,
            floor: req.body.floor,
            user_id: req.params.id,
        },{where:{user_id:req.params.id}})
         .then(result => res.redirect(`/perfil/${req.params.id}`))
         .catch(e=>console.log(e))
    },
    userInfoProcess:(req,res)=>{
        User.update({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            pass: hashSync(req.body.pass,10)
        },{
            where:{id:req.params.id}
        })
        .then(r => res.redirect('/perfil/'+req.params.id))
    }
}
module.exports=controllerPerfil; 