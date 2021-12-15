/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function main() {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org4.example.com', 'connection-org4.json');
        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('appUserOrg4');
        if (!identity) {
            console.log('An identity for the user "appUser" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUserOrg4', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('fabcar');

        // Submit the specified transaction.
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR12', 'Dave')
        //await contract.submitTransaction('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom');
        //await contract.submitTransaction('sellProducto', 'ID2','12/12/2021','10:00',6,'Celular','ID2');
        await contract.submitTransaction('supplyTienda', 'ID11', 'ID3', 20, '12/12/2021','15:00','ID50');
        console.log('Transaction has been submitted');
        await contract.submitTransaction('updateBodega', 'ID11', 20, '12/12/2021','15:00','ID51');
        console.log('Transaction has been submitted');

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

main();

[{"Key":"ID0","Record":{"articulo":"Computadora","cantidad":10,"docType":"producto","fecha":"11/12/2021","hora":"9:00","organizacion":"Walmart","sucursal":"Universidad"}},{"Key":"ID1","Record":{"articulo":"TV","cantidad":15,"docType":"producto","fecha":"11/12/2021","hora":"10:00","organizacion":"Walmart","sucursal":"Universidad"}},{"Key":"ID10","Record":{"articulo":"Celular","cantidad":100,"docType":"producto","fecha":"11/12/2021","hora":"9:00","organizacion":"Bodega","sucursal":"NA"}},{"Key":"ID11","Record":{"articulo":"Tableta","cantidad":100,"docType":"producto","fecha":"11/12/2021","hora":"9:00","organizacion":"Bodega","sucursal":"NA"}},{"Key":"ID12","Record":{"articulo":"Mesa","cantidad":100,"docType":"producto","fecha":"11/12/2021","hora":"9:00","organizacion":"Bodega","sucursal":"NA"}},{"Key":"ID13","Record":{"articulo":"Silla","cantidad":100,"docType":"producto","fecha":"11/12/2021","hora":"9:00","organizacion":"Bodega","sucursal":"NA"}},{"Key":"ID14","Record":{"articulo":"Cereal","cantidad":100,"docType":"producto","fecha":"11/12/2021","hora":"9:00","organizacion":"Bodega","sucursal":"NA"}},{"Key":"ID15","Record":{"articulo":"Leche","cantidad":100,"docType":"producto","fecha":"11/12/2021","hora":"9:00","organizacion":"Bodega","sucursal":"NA"}},{"Key":"ID2","Record":{"articulo":"Celular","cantidad":4,"docType":"producto","fecha":"12/12/2021","hora":"10:00","organizacion":"SamsClub","sucursal":"Ejercito"}},{"Key":"ID3","Record":{"articulo":"Tableta","cantidad":6,"docType":"producto","fecha":"11/12/2021","hora":"9:00","organizacion":"SamsClub","sucursal":"Ejercito"}},{"Key":"ID4","Record":{"articulo":"Mesa","cantidad":6,"docType":"producto","fecha":"11/12/2021","hora":"9:00","organizacion":"Superama","sucursal":"Churubusco"}},{"Key":"ID5","Record":{"articulo":"Silla","cantidad":8,"docType":"producto","fecha":"11/12/2021","hora":"9:00","organizacion":"Superama","sucursal":"Churubusco"}},{"Key":"ID50","Record":{"articulo":"Tableta","cantidad":26,"docType":"producto","fecha":"12/12/2021","hora":"15:00","organizacion":"SamsClub","sucursal":"Ejercito"}},{"Key":"ID51","Record":{"articulo":"Tableta","cantidad":80,"docType":"producto","fecha":"12/12/2021","hora":"15:00","organizacion":"Bodega","sucursal":"NA"}},{"Key":"ID6","Record":{"articulo":"Cereal","cantidad":50,"docType":"producto","fecha":"11/12/2021","hora":"9:00","organizacion":"Aurrera","sucursal":"Doctores"}},{"Key":"ID7","Record":{"articulo":"Leche","cantidad":38,"docType":"producto","fecha":"11/12/2021","hora":"9:00","organizacion":"Aurrera","sucursal":"Doctores"}},{"Key":"ID8","Record":{"articulo":"Computadora","cantidad":100,"docType":"producto","fecha":"11/12/2021","hora":"9:00","organizacion":"Bodega","sucursal":"NA"}},{"Key":"ID9","Record":{"articulo":"TV","cantidad":100,"docType":"producto","fecha":"11/12/2021","hora":"9:00","organizacion":"Bodega","sucursal":"NA"}},{"Key":"ID90","Record":{"articulo":"Celular","cantidad":10,"docType":"producto","fecha":"12/12/2021","hora":"10:00","organizacion":"SamsClub","sucursal":"Ejercito"}}]
