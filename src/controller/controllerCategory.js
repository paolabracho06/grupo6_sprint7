const db = require("../database/models");
const Category = db.Cat;
const controllerCategory = {
    list: (req,res)=>{
        Category.findAll()
        .then(result=>{
            res.render("admin/product/listCategory.ejs",{result})
        })
    },
    edit: (req,res)=>{
        Category.findByPk(req.params.id)
        .then(category=>{
            res.render("admin/product/editCategory.ejs",{category})
        })
    },
    editProcess: (req,res)=>{
        Category.update({
            name: req.body.name
        },{
            where: {id: req.params.id}
        })
        .then(result=> res.redirect('/category'));
    },
    add: (req,res)=>{
        res.render("admin/product/addCategory.ejs")
    },
    addProcess:(req,res)=>{
        Category.create({
            name: req.body.name
        })
        .then(result => res.redirect('/category'))
    }
}

module.exports = controllerCategory