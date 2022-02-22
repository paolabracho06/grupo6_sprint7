const fs = require('fs');
const path=require('path');

const mainController=function(archivojson) {
    return{
        archivo:path.resolve(__dirname,'../data/',`${archivojson}.json`),
        
        //leemos el Archivo Json
        readFile:function () {
            let contentDb=fs.readFileSync(this.archivo,'utf-8')
            return JSON.parse(contentDb) || [];
        },
        //Escribir sobre el json
        writeFile:function (contenido) {
            let contentDb=JSON.stringify(contenido,null,'');
            fs.writeFileSync(this.archivo,contentDb)
        },
        //auto incremento de ID
        nextId: function(){
            let fila=this.readFile();
            let ultimaFila=fila.pop();

            return ultimaFila.id? ++ultimaFila.id:1;
        },
        //leo los registros del archivo
        all:function(){
            return this.readFile();
        },
        //buscar por id producto
        buscar:function(id){
            let fila=this.readFile();
            return fila.find(e=>e.id==id);
        },
        //buscar por mail
        findMail:function(email){
            let fila=this.readFile();
            return fila.find(e=>e.email==email)
        },
        //crear nuevo producto
        crear:function(fila){
            let filas=this.readFile();
            fila.id=this.nextId();
            filas.push(fila);
            this.writeFile(filas)
        },
        //actualizo el archivo
        actualizar: function(fila){
            let filas=this.readFile();
            let actualizarFilas=filas.map(unafila=>{
                if(unafila.id==fila.id){
                    return fila;
                }
                return unafila
            });
            this.writeFile(actualizarFilas);
        },
        eliminar:function(id){
            let filas=this.readFile();
            let actualizarFilas=filas.filter(fila=>{
                return fila.id !=id;
            })
            this.writeFile(actualizarFilas);
        }
       
    }
}

module.exports=mainController;