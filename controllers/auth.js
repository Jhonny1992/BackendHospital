const {response} = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const login = async (req,res = response)=>{

    const {email, password} = req.body;

    try {
        //verificar email
        const usuarioDB = await Usuario.findOne({email});

        if(!usuarioDB){
            return res.status(400).json({
                ok: false,
                msg: 'email no valida'
            });
        }

        //verificar contraseña
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'contraseña no valida'
            });
        }

        //generar el TOKEN - JWT
        const token = await generarJWT(usuarioDB.id);

        res.json({
            ok:true,
            token
        })

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se pudo ingresar'
        })
    }

}

module.exports = {
    login
}