/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');


async function main() {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org4.example.com', 'connection-org4.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

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

        // Evaluate the specified transaction.
        // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
        // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
        //const result = await contract.evaluateTransaction('queryAllTxn');
        //const result = await contract.evaluateTransaction('queryProductos','Bodega');
        //const result = await contract.evaluateTransaction('queryAllTxn');


        //try{
        //    const result=await contract.evaluateTransaction('sellProducto','ID13', '13/12/2021','02:12', 99, 'Silla', 'ID13');
        // }
        //catch(error){
        //        console.log(`ERROR: ${error}`);
        //}
        //const result = await contract.evaluateTransaction('queryProductos','Bodega');
        //const result = await contract.evaluateTransaction('queryAllTxn');
        //console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        //console.log("======================================");
        //var ccccc1 = result.toString()
        //var ccccc1 = JSON.parse(result.toString());

        //console.log(`Transaction has been evaluated, result is: ${ccccc1.length}`);
        //console.log(`RESULTADO CON JSON: ${JSON.parse(result)}`);
        //console.log(`RESULTADO CON JSON: ${JSON.parse(result).count}`);
        //console.log(`RESULTADO CON JSON ELEMENTOS: ${JSON.parse(result)}`);
        //console.log(`RESULTADO CON JSON: ${result.length}`);

        /////////////
        /*try{
            await contract.evaluateTransaction('sellProducto','ID13', '13/12/2021','02:12', 50, 'Silla','ID80');
        }
        catch(error){
               console.log(`ERROR: ${error}`);
        }*/
        const result = await contract.evaluateTransaction('queryProductos','Walmart');
        //const result = await contract.evaluateTransaction('queryAllTxn');
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        console.log("======================================");

        /////////////


        // Disconnect from the gateway.
        await gateway.disconnect();
        
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
}

main();
[{"Key":"ID10","Record":{"articulo":"Celular","cantidad":100,"docType":"producto","fecha":"11/12/2021","hora":"9:00","organizacion":"Bodega","sucursal":"NA"}},{"Key":"ID11","Record":{"articulo":"Tableta","cantidad":100,"docType":"producto","fecha":"11/12/2021","hora":"9:00","organizacion":"Bodega","sucursal":"NA"}},{"Key":"ID12","Record":{"articulo":"Mesa","cantidad":100,"docType":"producto","fecha":"11/12/2021","hora":"9:00","organizacion":"Bodega","sucursal":"NA"}},{"Key":"ID13","Record":{"articulo":"Silla","cantidad":100,"docType":"producto","fecha":"11/12/2021","hora":"9:00","organizacion":"Bodega","sucursal":"NA"}},{"Key":"ID14","Record":{"articulo":"Cereal","cantidad":100,"docType":"producto","fecha":"11/12/2021","hora":"9:00","organizacion":"Bodega","sucursal":"NA"}},{"Key":"ID15","Record":{"articulo":"Leche","cantidad":100,"docType":"producto","fecha":"11/12/2021","hora":"9:00","organizacion":"Bodega","sucursal":"NA"}},{"Key":"ID8","Record":{"articulo":"Computadora","cantidad":100,"docType":"producto","fecha":"11/12/2021","hora":"9:00","organizacion":"Bodega","sucursal":"NA"}},{"Key":"ID9","Record":{"articulo":"TV","cantidad":100,"docType":"producto","fecha":"11/12/2021","hora":"9:00","organizacion":"Bodega","sucursal":"NA"}}]