const fs=require('fs');
let db= require("../database/models");
const { compareSync, hashSync }= require('bcryptjs');
const {validatioResult, validationResult}=require('express-validator');
const { Op, where } = require("sequelize");

const User = db.User;
const Address = db.Address;
const Product = db.Product;
const Visited = db.Visited;
const Image = db.Image

const controllerPages = {
    'home': async(req, res) => {
        let popularConsult = await Visited.findAll({
            limit: 3,
            where:{
                visited: {[Op.gte]:3}
            },
            include:[{
                association: 'products',
                include:['images','discounts']
            }],
            order:[['visited','DESC']]
        })
        res.render('pages/home.ejs',{popularConsult})
    },
    'login': (req, res) => {
        res.render('pages/login.ejs')
    },
    'loginProcess': async(req, res) => {
        let user = await User.findOne({where:{email:req.body.email}})
        let address = await Address.findOne({where:{user_id:user.dataValues.id}})
            if(user !== null){
                let confirm = compareSync(req.body.pass,user.dataValues.pass);
                if(!confirm){
                    return res.render('pages/login.ejs',{password: !confirm ? "La contraseña ingresada no es correcta" : null, oldEmail: req.body.email})
                }
                req.session.user = user.dataValues;
                req.session.access = user.dataValues.rol_id;
                req.session.address = address.dataValues;
                if(req.body.recordarUsuario !== undefined){
                    res.cookie('userEmail', req.body.email, { maxAge: (1000 * 60) * 60 })
                }
                return res.redirect("/")                
            }else{
                res.render('pages/login.ejs',{email: !user ? "El email ingresado no es correcto" : null})
            }
    },
    'logout': (req,res)=>{
        delete req.session.user;
        res.cookie('userEmail', req.body.email, {maxAge: -1})
        res.redirect("/")
    },
    'register':(req,res) =>{
        res.render('pages/register.ejs')
    },
    'regProcess':(req,res)=>{
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            return res.render('pages/register.ejs',{
                errors:errors.mapped(),
                oldData:req.body,
            })
        }
        User.findOne({where: {email:req.body.email}})
         .then(data =>{
            if(data === null){
                User.create({
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email: req.body.email,
                    pass: hashSync(req.body.pass,10),
                    avatar_id: 1,
                    rol_id: req.body.rol
                })
                .then(userCreate =>{
                    addressCreate = Address.create({
                        province: "",
                        city: "",
                        street:"",
                        number:"",
                        cp:"",         
                        phone:"",
                        floor:"",
                        user_id: userCreate.id,
                    })
                    .then(result => res.redirect('/'))
                })
                .catch(e=> console.log(e))
            }else{
                return res.render('pages/register.ejs',{
                    errors: {
                        email:{
                            msg: "email registrado"
                        }
                    },
                    oldData:req.body,
                });
            }
         })
    },
    'contacto':(req, res) =>{
        res.render('pages/contacto.ejs') 
    },
    'somos':(req, res) =>{
        res.render('pages/somos.ejs') /* res.render muestra el motor de plantilla/ valor */
    },
    'install':(req,res)=>{
        let verification;
        User.findAll()
        .then(resolve =>{
            if(resolve.length > 0){
                verification = 1;
            }else{
                verification = 0;
            }
            res.render("admin/install.ejs",{verification})
        })
        .catch(e=>console.log(e))
    },
    'installProcess':async(req,res)=>{
        //Creando registro de roles
        let adminRol = await db.Rol.create({rol: "Admin"});
        let mayRol = await db.Rol.create({rol: "Mayorista"});
        let minRol = await db.Rol.create({rol: "Minorista"});

        //Crear registro de avatar
        let avatarReg = await db.Avatar.create({avatar:"avatar.jpg"});

        //Crear usuarios
        let userAdmin = await User.create({
            first_name:"Admin",
            last_name:"DH",
            email:"admin@dh.com",
            pass:"$2a$10$0Xhs.ir9MpmkZoYYj92rs.oWRi2crKnqJDKvMdzIYYWxi.KMB74mK",
            avatar_id:1,
            rol_id:1,
        });
        let addressAdmin = await Address.create({
            province: "",
            city: "",
            street:"",
            number:"",
            cp:"",         
            phone:"",
            floor:"",
            user_id: userAdmin.id,
        });
        let userMayorista = await User.create({
            first_name:"Mayorista",
            last_name:"DH",
            email:"mayorista@dh.com",
            pass:"$2a$10$0Xhs.ir9MpmkZoYYj92rs.oWRi2crKnqJDKvMdzIYYWxi.KMB74mK",
            avatar_id:1,
            rol_id:2,
        });
        let addressMayorista = await Address.create({
            province: "",
            city: "",
            street:"",
            number:"",
            cp:"",         
            phone:"",
            floor:"",
            user_id: userMayorista.id,
        });
        let userMinorista = await User.create({
            first_name:"Minorista",
            last_name:"DH",
            email:"minorista@dh.com",
            pass:"$2a$10$0Xhs.ir9MpmkZoYYj92rs.oWRi2crKnqJDKvMdzIYYWxi.KMB74mK",
            avatar_id:1,
            rol_id:3,
        });
        let addressMinorista = await Address.create({
            province: "",
            city: "",
            street:"",
            number:"",
            cp:"",         
            phone:"",
            floor:"",
            user_id: userMinorista.id,
        });
        //creacion de categorias
        await db.Cat.create({
            name: "De 0 a 24 meses"
        })
        await db.Cat.create({
            name: "De 2 a 3 años"
        })
        await db.Cat.create({
            name: "De 4 a 6 años"
        })
        //Creacion de tamaños
        await db.Size.create({
            size: "Pequeño"
        })
        await db.Size.create({
            size: "Mediano"
        })
        await db.Size.create({
            size: "Grande"
        })
        //descuentos
        await db.Discount.create({discount: "0"})
        await db.Discount.create({discount: "5"})
        await db.Discount.create({discount: "10"})
        await db.Discount.create({discount: "15"})
        await db.Discount.create({discount: "20"})
        //Productos
        let bulkPr = db.Product.bulkCreate([{
            name: "Producto 1",
            price_inv: "200",
            price_who: "100",
            stock: "100",
            stock_min: "50",
            stock_max: "100",
            cat_id: 1,
            size_id: 1,
            discount_id: 1,
            description: "Una descripción corta",
            visibility: 1
        },
        {
            name: "Producto 2",
            price_inv: "200",
            price_who: "100",
            stock: "100",
            stock_min: "50",
            stock_max: "100",
            cat_id: 1,
            size_id: 1,
            discount_id: 1,
            description: "Una descripción corta",
            visibility: 1
        },
        {
            name: "Producto 3",
            price_inv: "200",
            price_who: "100",
            stock: "100",
            stock_min: "50",
            stock_max: "100",
            cat_id: 1,
            size_id: 1,
            discount_id: 1,
            description: "Una descripción corta",
            visibility: 1
        },
        {
            name: "Producto 4",
            price_inv: "200",
            price_who: "100",
            stock: "100",
            stock_min: "50",
            stock_max: "100",
            cat_id: 1,
            size_id: 1,
            discount_id: 1,
            description: "Una descripción corta",
            visibility: 1
        },
        {
            name: "Producto 5",
            price_inv: "200",
            price_who: "100",
            stock: "100",
            stock_min: "50",
            stock_max: "100",
            cat_id: 2,
            size_id: 1,
            discount_id: 1,
            description: "Una descripción corta",
            visibility: 1
        },
        {
            name: "Producto 6",
            price_inv: "200",
            price_who: "100",
            stock: "100",
            stock_min: "50",
            stock_max: "100",
            cat_id: 2,
            size_id: 1,
            discount_id: 1,
            description: "Una descripción corta",
            visibility: 1
        },
        {
            name: "Producto 7",
            price_inv: "200",
            price_who: "100",
            stock: "100",
            stock_min: "50",
            stock_max: "100",
            cat_id: 2,
            size_id: 1,
            discount_id: 1,
            description: "Una descripción corta",
            visibility: 1
        },
        {
            name: "Producto 8",
            price_inv: "200",
            price_who: "100",
            stock: "100",
            stock_min: "50",
            stock_max: "100",
            cat_id: 2,
            size_id: 1,
            discount_id: 1,
            description: "Una descripción corta",
            visibility: 1
        },
        {
            name: "Producto 9",
            price_inv: "200",
            price_who: "100",
            stock: "100",
            stock_min: "50",
            stock_max: "100",
            cat_id: 3,
            size_id: 1,
            discount_id: 1,
            description: "Una descripción corta",
            visibility: 1
        },
        {
            name: "Producto 10",
            price_inv: "200",
            price_who: "100",
            stock: "100",
            stock_min: "50",
            stock_max: "100",
            cat_id: 3,
            size_id: 1,
            discount_id: 1,
            description: "Una descripción corta",
            visibility: 1
        },
        {
            name: "Producto 11",
            price_inv: "200",
            price_who: "100",
            stock: "100",
            stock_min: "50",
            stock_max: "100",
            cat_id: 3,
            size_id: 1,
            discount_id: 1,
            description: "Una descripción corta",
            visibility: 1
        },
        {
            name: "Producto 12",
            price_inv: "200",
            price_who: "100",
            stock: "100",
            stock_min: "50",
            stock_max: "100",
            cat_id: 3,
            size_id: 1,
            discount_id: 1,
            description: "Una descripción corta",
            visibility: 1
        }])
        for(let i=1; i<=12;i++){
            await db.Image.create({
                image: "default.jpg",
                id_products: i
            })
        } 
        await db.Payment.bulkCreate([
            {name: "Efectivo"},
            {name: "Tarjeta"},
            {name: "Cheque"}
        ]) 
        await db.Status.bulkCreate([
            {status: "Pago"},
            {status: "Procesando"},
            {status: "Inpago"}
        ])
        await db.PromoCode.bulkCreate([
            {code: "CYBERGUGU", active: 1, discount: 10},
            {code: "DH", active: 1, discount: 100},
        ])
        res.redirect('/install')
    }
}
module.exports = controllerPages;