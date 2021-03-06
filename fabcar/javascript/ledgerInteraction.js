const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');


class LedgerInteraction{

    // Constructor para crear un objeto de tipo LedgerFacade
    constructor(username){
        this.gotCredentials=false
        this.username=username
    }

    // Credentials for user
    async getCredentials() {
        // load the network configuration
        //const ccpPath = path.resolve(process.cwd(), '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccpPath = path.resolve(process.cwd(),'..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org4.example.com', 'connection-org4.json');
        console.log(ccpPath);
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
    async getAllTransactions() {
        try {
            if (!this.gotCredentials){
                await this.getCredentials()
            }

            if (!this.identity) {
                console.log(`No se ha podido identificar al usuario ${this.username}`);
                return false;
            }

            const contract =await this.getContract()

            const result = await contract.evaluateTransaction('queryAllMovimientos');
            console.log(`Transaction has been evaluated, result is: ${result.toString()}`);

            await this.gateway.disconnect();
            return result

        } catch (error) {
            console.error(`Failed to evaluate transaction: ${error}`);
            process.exit(1);
        }
    }

    // Se obtiene la transacción por id
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
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);

        await this.gateway.disconnect();
        return result
    }

    // Función para crear una transacción
    async createTransaction(id,userid,fecha,monto,autor,referencia,dependencia){
        if (!this.gotCredentials){
            await this.getCredentials()
        }

        if (!this.identity) {
            console.log(`An identity for the user ${this.username} does not exist in the wallet`);
            return false;
        }

        const contract = await this.getContract()

        const result = await contract.submitTransaction('createMovimiento',id,userid,fecha,monto,autor,referencia,dependencia);
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);

        await this.gateway.disconnect();
        return result
    }

    // Función para cambiar al responsable del registro de la transacción
    async changeOwner(id,new_reponsable){
        if (!this.gotCredentials){
            await this.getCredentials()
        }

        if (!this.identity) {
            console.log(`An identity for the user ${this.username} does not exist in the wallet`);
            return false;
        }

        const contract = await this.getContract()
        const result = await contract.submitTransaction('changeMovimientoResponsable',id,new_reponsable);
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        
        await this.gateway.disconnect();
        return result
    }

}

coneccion = new LedgerInteraction('appUserOrg4');
promise_data=coneccion.queryProductos('Bodega');
promise_data.then((data)=>{
        data=data.toString()
        data=JSON.parse(data)
        console.log(data)
},(error)=>{
    console.log(error);
})