const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');
const { Console } = require('console');


class LedgerInteraction{

    // Constructor para crear un objeto de tipo LedgerFacade
    constructor(username){
        this.gotCredentials=false
        this.username=username
    }

    // Credentials for user
    async getCredentials() {
        var chainCodePath = {'appUserOrg1':{'p1':'org1.example.com', 'p2':'connection-org1.json'},
                             'appUserOrg2':{'p1':'org2.example.com', 'p2':'connection-org2.json'},
                             'appUserOrg3':{'p1':'org3.example.com', 'p2':'connection-org3.json'},
                             'appUserOrg4':{'p1':'org4.example.com', 'p2':'connection-org4.json'},
                             'appUserOrg5':{'p1':'org5.example.com', 'p2':'connection-org5.json'},
        }
        // load the network configuration
        const ccpPath = path.resolve(process.cwd(), '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        //const ccpPath = path.resolve(process.cwd(),'..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org4.example.com', 'connection-org4.json');
        
        this.ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
         // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        this.wallet = await Wallets.newFileSystemWallet(walletPath);

        this.identity = await this.wallet.get(this.username);
        // Check to see if we've already enrolled the user.
        if(this.identity){
            console.log("Se encontraron las credenciales")
            this.gotCredentials=true
        }else{
            this.gotCredentials=false
            console.log("No se encontraron las credenciales")
        }
    }

    // Get the contract from the network.
    async getContract(){
        this.gateway = new Gateway();
        var wallet=this.wallet
        var identity=this.identity
        var ccp=this.ccp
        var username=this.username
        await this.gateway.connect(ccp, {wallet, identity: username, discovery: { enabled: true, asLocalhost: true } });

        const network = await this.gateway.getNetwork('mychannel');

        const contract = network.getContract('fabcar');
        return contract
    }

    // Función para obtener todas las transacciones
    async queryAllTxn() {
        try {
            if (!this.gotCredentials){
                await this.getCredentials()
            }

            if (!this.identity) {
                console.log(`No se ha podido identificar al usuario ${this.username}`);
                return false;
            }

            const contract =await this.getContract()

            const result = await contract.evaluateTransaction('queryAllTxn');
            console.log(`Transaction has been evaluated, result is: ${result.toString()}`);

            await this.gateway.disconnect();
            return result

        } catch (error) {
            console.error(`Failed to evaluate transaction: ${error}`);
            process.exit(1);
        }
    }

    // Se obtiene todos los productos que tiene la organizacion
    async queryProductos(org){
        if (!this.gotCredentials){
            await this.getCredentials()
        }

        if (!this.identity) {
            console.log(`An identity for the user ${this.username} does not exist in the wallet`);
            return false;
        }

        const contract =await this.getContract()

        const result = await contract.evaluateTransaction('queryProductos',org);
        //console.log(`Transaction has been evaluated, result is: ${result.toString()}`);

        await this.gateway.disconnect();
        return result
    }

    // Realiza una transaccion de venta
    async sellProducto(p_id, p_cantidad){
        if (!this.gotCredentials){
            await this.getCredentials()
        }

        if (!this.identity) {
            console.log(`An identity for the user ${this.username} does not exist in the wallet`);
            return false;
        }

        const contract = await this.getContract();

        var timeNow = new Date().toLocaleTimeString('en-GB'); 
        var dateNow = new Date().toLocaleDateString('en-GB');
        
        try{
            const result = await contract.submitTransaction('sellProducto',p_id, dateNow, timeNow, p_cantidad);
            console.log(`Transaction has been submitted`);
            await this.gateway.disconnect();
            return true;
        }catch(error){
            await this.gateway.disconnect();
            return `Cantidad insuficiente en la sucursal`;
        }  
    }

    async supplyTienda(id_prodBodega, producBodega, org, cantidad){
        if (!this.gotCredentials){
            await this.getCredentials()
        }

        if (!this.identity) {
            console.log(`An identity for the user ${this.username} does not exist in the wallet`);
            return false;
        }
        const contract = await this.getContract();
        var productosOrganizacion = await contract.evaluateTransaction('queryProductos',org);
        productosOrganizacion = JSON.parse(productosOrganizacion);
        //Busqueda de un producto igual al de la bodega en la tienda
        for (const i of productosOrganizacion){
            if (i.Record.articulo === producBodega){
                var id_producTienda = i.Key;
            }
        }
        if (!id_producTienda){
            await this.gateway.disconnect();
            return `¡No existe el producto ${producBodega} en la tienda !`;
        }

        var timeNow = new Date().toLocaleTimeString('en-GB'); 
        var dateNow = new Date().toLocaleDateString('en-GB');
        
        // Suministro a tienda
        try{
            const result = await contract.submitTransaction('supplyTienda',id_prodBodega, id_producTienda, cantidad, dateNow, timeNow);
            console.log(`Transaction has been submitted`);
        }catch(error){
            await this.gateway.disconnect();
            return `Cantidad de ${producBodega} insuficiente en la bodega`;
        } 
        // Resta inventario a la bodega
        try{
            const result = await contract.submitTransaction('updateBodega',id_prodBodega, cantidad, dateNow, timeNow);
            console.log(`Transaction has been submitted`);
            await this.gateway.disconnect();
            return true;
        }catch(error){
            await this.gateway.disconnect();
            return error;
        } 

        
        
    }
}
module.exports = LedgerInteraction;