/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class FabCar extends Contract {
    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const prods = [
            {
                organizacion: 'Walmart',
                sucursal: 'Universidad',
                fecha: '11/12/2021',
                hora: '09:00:00',
                articulo: 'Computadora',
                cantidad: 10
            },
            {
                organizacion: 'Walmart',
                sucursal: 'Universidad',
                fecha: '11/12/2021',
                hora: '10:00',
                articulo: 'TV',
                cantidad: 15
            },
            {
                organizacion: 'SamsClub',
                sucursal: 'Ejercito',
                fecha: '10/12/2021',
                hora: '09:00:00',
                articulo: 'Celular',
                cantidad: 16
            },
            {
                organizacion: 'SamsClub',
                sucursal: 'Ejercito',
                fecha: '11/12/2021',
                hora: '09:00:00',
                articulo: 'Tableta',
                cantidad: 6
            },
            {
                organizacion: 'Superama',
                sucursal: 'Churubusco',
                fecha: '11/12/2021',
                hora: '09:00:00',
                articulo: 'Mesa',
                cantidad: 6
            },
            {
                organizacion: 'Superama',
                sucursal: 'Churubusco',
                fecha: '11/12/2021',
                hora: '09:00:00',
                articulo: 'Silla',
                cantidad: 8
            },
            {
                organizacion: 'Aurrera',
                sucursal: 'Doctores',
                fecha: '11/12/2021',
                hora: '09:00:00',
                articulo: 'Cereal',
                cantidad: 50
            },
            {
                organizacion: 'Aurrera',
                sucursal: 'Doctores',
                fecha: '11/12/2021',
                hora: '09:00:00',
                articulo: 'Leche',
                cantidad: 38
            },
            {
                organizacion: 'Bodega',
                sucursal: 'NA',
                fecha: '11/12/2021',
                hora: '09:00:00',
                articulo: 'Computadora',
                cantidad: 100
            },
            {
                organizacion: 'Bodega',
                sucursal: 'NA',
                fecha: '11/12/2021',
                hora: '09:00:00',
                articulo: 'TV',
                cantidad: 100
            },
            {
                organizacion: 'Bodega',
                sucursal: 'NA',
                fecha: '11/12/2021',
                hora: '09:00:00',
                articulo: 'Celular',
                cantidad: 100
            },
            {
                organizacion: 'Bodega',
                sucursal: 'NA',
                fecha: '11/12/2021',
                hora: '09:00:00',
                articulo: 'Tableta',
                cantidad: 100
            },
            {
                organizacion: 'Bodega',
                sucursal: 'NA',
                fecha: '11/12/2021',
                hora: '09:00:00',
                articulo: 'Mesa',
                cantidad: 100
            },
            {
                organizacion: 'Bodega',
                sucursal: 'NA',
                fecha: '11/12/2021',
                hora: '09:00:00',
                articulo: 'Silla',
                cantidad: 100
            },
            {
                organizacion: 'Bodega',
                sucursal: 'NA',
                fecha: '11/12/2021',
                hora: '09:00:00',
                articulo: 'Cereal',
                cantidad: 100
            },
            {
                organizacion: 'Bodega',
                sucursal: 'NA',
                fecha: '11/12/2021',
                hora: '09:00:00',
                articulo: 'Leche',
                cantidad: 100
            }
        ];

        for (let i = 0; i < prods.length; i++) {
            prods[i].docType = 'producto';
            await ctx.stub.putState('ID' + i, Buffer.from(JSON.stringify(prods[i])));
            console.info('Added <--> ', prods[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    async queryAllTxn(ctx) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    async queryProductos(ctx, org) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            if (record.organizacion == org){
                allResults.push({ Key: key, Record: record });
            }
        }
        if (allResults.length == 0){
            throw new Error(`La organización ${org} no está registrada`);
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    async sellProducto(ctx, p_id, p_fecha, p_hora, p_cantidad) {
        const productoAsBytes = await ctx.stub.getState(p_id);
        if (!productoAsBytes || productoAsBytes.length === 0) {
            throw new Error(`El producto no está disponible en la sucursal`);
        }
        const c_producto = JSON.parse(productoAsBytes.toString());
        if (c_producto.cantidad < p_cantidad) {
            throw new Error(`Cantidad de ${c_producto.articulo} insuficiente en la sucursal`);   
        }
        const temp = c_producto.cantidad;
        c_producto.cantidad = temp - p_cantidad;

        const newItem = {
            organizacion: c_producto.organizacion,
            docType: 'producto',
            sucursal: c_producto.sucursal,
            fecha: p_fecha,
            hora: p_hora,
            articulo: c_producto.articulo,
            cantidad: c_producto.cantidad
        };

        await ctx.stub.putState(p_id, Buffer.from(JSON.stringify(newItem)));
    }
    
    async supplyTienda(ctx, p_prodBodegaid, p_prodID, p_cantidad, p_fecha, p_hora) {
        const productoBodegaAsBytes = await ctx.stub.getState(p_prodBodegaid);
        if (!productoBodegaAsBytes || productoBodegaAsBytes.length === 0) {
            throw new Error(`Producto inexistente en bodega`);
        }
        const c_prodBodega = JSON.parse(productoBodegaAsBytes.toString());
        if (c_prodBodega.cantidad < p_cantidad) {
            throw new Error(`Cantidad de ${c_prodBodega.articulo} insuficiente en la bodega`);   
        }
        
        const prodSucursalAsBytes = await ctx.stub.getState(p_prodID);
        if (!prodSucursalAsBytes || prodSucursalAsBytes.length === 0) {
            throw new Error(`Producto inexistente en sucursal`);
        }
        const c_prod = JSON.parse(prodSucursalAsBytes.toString());

        const temp = parseInt(c_prod.cantidad);
        c_prod.cantidad = temp + parseInt(p_cantidad);

        const newItem = {
            organizacion: c_prod.organizacion,
            docType: 'producto',
            sucursal: c_prod.sucursal,
            fecha: p_fecha,
            hora: p_hora,
            articulo: c_prod.articulo,
            cantidad: c_prod.cantidad
        };

        await ctx.stub.putState(p_prodID, Buffer.from(JSON.stringify(newItem)));
    }
    
    async updateBodega(ctx, p_prodBodegaid, p_cantidad, p_fecha, p_hora) {
        const productoBodegaAsBytes = await ctx.stub.getState(p_prodBodegaid);
        const c_prodBodega = JSON.parse(productoBodegaAsBytes.toString());

        const temp = c_prodBodega.cantidad;
        c_prodBodega.cantidad = temp - p_cantidad;

        const newItem = {
            organizacion: c_prodBodega.organizacion,
            docType: 'producto',
            sucursal: c_prodBodega.sucursal,
            fecha: p_fecha,
            hora: p_hora,
            articulo: c_prodBodega.articulo,
            cantidad: c_prodBodega.cantidad
        };

        await ctx.stub.putState(p_prodBodegaid, Buffer.from(JSON.stringify(newItem)));
    }
}

module.exports = FabCar;
