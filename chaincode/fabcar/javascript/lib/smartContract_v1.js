'use strict';

const { Contract } = require('fabric-contract-api');

class FabCar extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const productos = [
            {
                organizacion: 'Walmart',
                sucursal: 'Universidad',
                fecha: '11/12/2021',
                hora: '9:00',
                producto: 'Jabon',
                cantidad: '10',
            },
            {
                organizacion: 'Walmart',
                sucursal: 'Universidad',
                fecha: '11/12/2021',
                hora: '10:00',
                producto: 'TV',
                cantidad: '15',
            },
            {
                organizacion: 'SamsClub',
                sucursal: 'Ejercito',
                fecha: '10/12/2021',
                hora: '9:00',
                producto: 'Telefono',
                cantidad: '16',
            },
            {
                organizacion: 'SamsClub',
                sucursal: 'Ejercito',
                fecha: '11/12/2021',
                hora: '9:00',
                producto: 'Tableta',
                cantidad: '6',
            },
            {
                organizacion: 'Superama',
                sucursal: 'Churubusco',
                fecha: '11/12/2021',
                hora: '9:00',
                producto: 'Mesa',
                cantidad: '6',
            },
            {
                organizacion: 'Superama',
                sucursal: 'Churubusco',
                fecha: '11/12/2021',
                hora: '9:00',
                producto: 'Silla',
                cantidad: '8',
            },
            {
                organizacion: 'Aurrera',
                sucursal: 'Doctores',
                fecha: '11/12/2021',
                hora: '9:00',
                producto: 'Cereal',
                cantidad: '50',
            },
            {
                organizacion: 'Aurrera',
                sucursal: 'Doctores',
                fecha: '11/12/2021',
                hora: '9:00',
                producto: 'Leche',
                cantidad: '38',
            },
            {
                organizacion: 'Bodega',
                sucursal: 'NA',
                fecha: '11/12/2021',
                hora: '9:00',
                producto: 'Jabon',
                cantidad: '100',
            },
            {
                organizacion: 'Bodega',
                sucursal: 'NA',
                fecha: '11/12/2021',
                hora: '9:00',
                producto: 'TV',
                cantidad: '100',
            },
            {
                organizacion: 'Bodega',
                sucursal: 'NA',
                fecha: '11/12/2021',
                hora: '9:00',
                producto: 'Telefono',
                cantidad: '100',
            },
            {
                organizacion: 'Bodega',
                sucursal: 'NA',
                fecha: '11/12/2021',
                hora: '9:00',
                producto: 'Tableta',
                cantidad: '100',
            },
            {
                organizacion: 'Bodega',
                sucursal: 'NA',
                fecha: '11/12/2021',
                hora: '9:00',
                producto: 'Mesa',
                cantidad: '100',
            },
            {
                organizacion: 'Bodega',
                sucursal: 'NA',
                fecha: '11/12/2021',
                hora: '9:00',
                producto: 'Silla',
                cantidad: '100',
            },
            {
                organizacion: 'Bodega',
                sucursal: 'NA',
                fecha: '11/12/2021',
                hora: '9:00',
                producto: 'Cereal',
                cantidad: '100',
            },
            {
                organizacion: 'Bodega',
                sucursal: 'NA',
                fecha: '11/12/2021',
                hora: '9:00',
                producto: 'Leche',
                cantidad: '100',
            },
        ];

        for (let i = 0; i < productos.length; i++) {
            productos[i].docType = 'producto';
            await ctx.stub.putState('ID' + i, Buffer.from(JSON.stringify(productos[i])));
            console.info('Added <--> ', productos[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    async queryProductos(ctx, organizacion) {
        const orgAsBytes = await ctx.stub.getState(organizacion); // get the car from chaincode state
        if (!orgAsBytes || orgAsBytes.length === 0) {
            throw new Error(`La organizacion ${organizacion} no existe`);
        }
        console.log(orgAsBytes.toString());
        return orgAsBytes.toString();
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

    async sellProducto(ctx, id, fecha, hora, cantidad, producto) {
        const productoAsBytes = await ctx.stub.getState(id); // get the car from chaincode state
        if (!productoAsBytes || productoAsBytes.length === 0) {
            throw new Error(`El producto ${producto} no esta disponible en la sucursal`);
        }
        const producto = JSON.parse(productoAsBytes.toString());
        if (producto.cantidad < cantidad) {
            throw new Error(`Cantidad de ${producto} insuficiente en la sucursal`);   
        }
        const temp = producto.cantidad;
        producto.cantidad = temp - cantidad;
        await ctx.stub.putState(id, Buffer.from(JSON.stringify(producto)));
    }
}

module.exports = FabCar;