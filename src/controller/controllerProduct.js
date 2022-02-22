// const path = require("path")
// //let db = require("../database/models");
// //const sequelize = db.sequelize;
// const {Op} = require("sequelize");
// const controllerImage = require("./controllerImage") 

//llamamos los modelos
// const Product = db.Product;
// const Cat = db.Cat;
// const Size = db.Size;
// const Discount = db.Discount;

//eliminar fs,jsonDb y db al finalizar
//let jsonDb=require('../model/mainJson.js');
//let db=jsonDb('products');

const fs=require('fs');
const db = require("../database/models");
const controllerImage = require("./controllerImage");
const sequelize = db.sequelize;
const { Op } = require("sequelize");

//LLAMAMOS A LOS MODELOS
const Product = db.Product;
const Cat = db.Cat;
const Size = db.Size;
const Discount = db.Discount;
const Image = db.Image;


const controllerProduct={
    productos:(req, res) =>{
        Product.findAll({
            include: ["images"],
            where: {visibility:1}
        })
        .then(products =>{
            console.log(products);
            res.render('pages/productos.ejs',{db:products})
        })
    },
    create:(req,res)=>{
        let discountConsult = Discount.findAll();
        let categoryConsult = Cat.findAll();
        let sizeConsult = Size.findAll();
        Promise.all([discountConsult,categoryConsult,sizeConsult])
        .then(([discount,category,size])=>{
            res.render('admin/product/addProduct.ejs',{discount,category,size})
        })
    },
    crearAccion:(req,res)=>{
        let body = req.body;
        Product.create({
            name: req.body.name,
            price_inv: req.body.price_inv,
            price_who: req.body.price_who,
            stock: req.body.stock,
            stock_min: req.body.stock_min,
            stock_max: req.body.stock_max,
            cat_id: req.body.category,
            size_id: req.body.size,
            discount_id: req.body.discount,
            description: req.body.description,
            visibility: req.body.visibility
        })
        .then(producto =>{
            console.log(producto.id);
            controllerImage.file(producto.id,req.file.filename)
            res.redirect('/products');

        })
        .catch(e => console.log("el error es: "+ e));
    },
    edit:(req,res)=>{
        let productConsult = Product.findByPk(req.params.id);
        let sizeConsult = Size.findAll();
        let categoryConsult = Cat.findAll();
        let discountConsult = Discount.findAll();
        let imageConsult = Image.findOne({where:{id_products:req.params.id}});

        Promise.all([productConsult,sizeConsult,categoryConsult,discountConsult,imageConsult])
         .then(([product,size,category,discount,image])=>{
             res.render('admin/product/editProduct.ejs',({productoEncontrado:product, size,category,discount,image,selected:"selected"}));
         })
    },
    update:(req,res)=>{
        let id = req.params.id;
        let imageUpdate;
        let productUpdate = Product.update({
            name: req.body.name,
            price_inv: req.body.price_inv,
            price_who: req.body.price_who,
            stock: req.body.stock,
            stock_min: req.body.stock_min,
            stock_max: req.body.stock_max,
            cat_id: req.body.category,
            size_id: req.body.size,
            discount_id: req.body.discount,
            description: req.body.description,
            visibility: req.body.visibility
        },{
            where: {id: id}
        });
        if(req.file && req.file.filename !== undefined){
            let imageUpdate = Image.update({
                image: req.file.filename
            },{where: {id_products: req.params.id}})
        }
        Promise.all([productUpdate,imageUpdate])
        .then(([product,image])=>{
            res.redirect(`/products/detail/${req.params.id}`);
        })
    },
    productDelete:(req,res)=>{
        let productDelete = Product.destroy({where:{ id: req.params.id}});
        let imageDelete = Image.destroy({where:{ id_products: req.params.id}});
        Promise.all([productDelete,imageDelete])
        .then(([product,image])=>{
            res.redirect('/products')
        })
    },
    productDetail:(req, res) =>{
        Product.findByPk(req.params.id,{
            include: ["images","sizes","cats"]
        })
         .then(product =>{
             res.render('pages/productDetail.ejs',{articulo:product})
         })
    },
    search:(req,res)=>{
        let search = req.query.search;
        Product.findAll({
            where:{
                name: { [Op.like]: `%${search}%` },
                visibility: 1
            },
            include:["images"]
        })
        .then(result =>{
            if(result.length !== 0){
                res.render("pages/search.ejs",{db:result,response: true})
            }else{
                res.render("pages/search.ejs",{db:result,response:false})
            }
        })
    }   
};
module.exports=controllerProduct;