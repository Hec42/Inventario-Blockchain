/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');
const path = require('path');

async function main() {
    try {
        // load the network configuration
        var ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        var ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new CA client for interacting with the CA.
        var caURL = ccp.certificateAuthorities['ca.org1.example.com'].url;
        var ca = new FabricCAServices(caURL);

        // Create a new file system based wallet for managing identities.
        var walletPath = path.join(process.cwd(), 'wallet');
        var wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        var userIdentity = await wallet.get('appUserOrg1');
        if (userIdentity) {
            console.log('An identity for the user "appUserOrg1" already exists in the wallet');
            return;
        }

        // Check to see if we've already enrolled the admin user.
        var adminIdentity = await wallet.get('adminOrg1');
        if (!adminIdentity) {
            console.log('An identity for the admin user "adminOrg1" does not exist in the wallet');
            console.log('Run the enrollAdmin.js application before retrying');
            return;
        }

        // build a user object for authenticating with the CA
        var provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        var adminUser = await provider.getUserContext(adminIdentity, 'adminOrg1');

        // Register the user, enroll the user, and import the new identity into the wallet.
        var secret = await ca.register({
            affiliation: 'org1.department1',
            enrollmentID: 'appUserOrg1',
            role: 'client'
        }, adminUser);
        var enrollment = await ca.enroll({
            enrollmentID: 'appUserOrg1',
            enrollmentSecret: secret
        });
        var x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org1MSP',
            type: 'X.509',
        };
        await wallet.put('appUserOrg1', x509Identity);
        console.log('Successfully registered and enrolled admin user "appUserOrg1" and imported it into the wallet');

        //******************************* Org 2 *******************************    
        // load the network configuration
        var ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org2.example.com', 'connection-org2.json');
        var ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new CA client for interacting with the CA.
        var caURL = ccp.certificateAuthorities['ca.org2.example.com'].url;
        var ca = new FabricCAServices(caURL);

        // Create a new file system based wallet for managing identities.
        var walletPath = path.join(process.cwd(), 'wallet');
        var wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        var userIdentity = await wallet.get('appUserOrg2');
        if (userIdentity) {
            console.log('An identity for the user "appUserOrg2" already exists in the wallet');
            return;
        }

        // Check to see if we've already enrolled the admin user.
        var adminIdentity = await wallet.get('adminOrg2');
        if (!adminIdentity) {
            console.log('An identity for the admin user "adminOrg2" does not exist in the wallet');
            console.log('Run the enrollAdmin.js application before retrying');
            return;
        }

        // build a user object for authenticating with the CA
        var provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        var adminUser = await provider.getUserContext(adminIdentity, 'adminOrg2');

        // Register the user, enroll the user, and import the new identity into the wallet.
        var secret = await ca.register({
            affiliation: 'org2.department1',
            enrollmentID: 'appUserOrg2',
            role: 'client'
        }, adminUser);
        var enrollment = await ca.enroll({
            enrollmentID: 'appUserOrg2',
            enrollmentSecret: secret
        });
        var x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org2MSP',
            type: 'X.509',
        };
        await wallet.put('appUserOrg2', x509Identity);
        console.log('Successfully registered and enrolled admin user "appUserOrg2" and imported it into the wallet');

        //******************************* Org 3 *******************************    
        // load the network configuration
        var ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org3.example.com', 'connection-org3.json');
        var ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new CA client for interacting with the CA.
        var caURL = ccp.certificateAuthorities['ca.org3.example.com'].url;
        var ca = new FabricCAServices(caURL);

        // Create a new file system based wallet for managing identities.
        var walletPath = path.join(process.cwd(), 'wallet');
        var wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        var userIdentity = await wallet.get('appUserOrg3');
        if (userIdentity) {
            console.log('An identity for the user "appUserOrg3" already exists in the wallet');
            return;
        }

        // Check to see if we've already enrolled the admin user.
        var adminIdentity = await wallet.get('adminOrg3');
        if (!adminIdentity) {
            console.log('An identity for the admin user "adminOrg3" does not exist in the wallet');
            console.log('Run the enrollAdmin.js application before retrying');
            return;
        }

        // build a user object for authenticating with the CA
        var provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        var adminUser = await provider.getUserContext(adminIdentity, 'adminOrg3');

        // Register the user, enroll the user, and import the new identity into the wallet.
        var secret = await ca.register({
            affiliation: 'org3.department1',
            enrollmentID: 'appUserOrg3',
            role: 'client'
        }, adminUser);
        var enrollment = await ca.enroll({
            enrollmentID: 'appUserOrg3',
            enrollmentSecret: secret
        });
        var x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org3MSP',
            type: 'X.509',
        };
        await wallet.put('appUserOrg3', x509Identity);
        console.log('Successfully registered and enrolled admin user "appUserOrg3" and imported it into the wallet');

        //******************************* Org 4 *******************************    
        // load the network configuration
        var ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org4.example.com', 'connection-org4.json');
        var ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new CA client for interacting with the CA.
        var caURL = ccp.certificateAuthorities['ca.org4.example.com'].url;
        var ca = new FabricCAServices(caURL);

        // Create a new file system based wallet for managing identities.
        var walletPath = path.join(process.cwd(), 'wallet');
        var wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        var userIdentity = await wallet.get('appUserOrg4');
        if (userIdentity) {
            console.log('An identity for the user "appUserOrg4" already exists in the wallet');
            return;
        }

        // Check to see if we've already enrolled the admin user.
        var adminIdentity = await wallet.get('adminOrg4');
        if (!adminIdentity) {
            console.log('An identity for the admin user "adminOrg4" does not exist in the wallet');
            console.log('Run the enrollAdmin.js application before retrying');
            return;
        }

        // build a user object for authenticating with the CA
        var provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        var adminUser = await provider.getUserContext(adminIdentity, 'adminOrg4');

        // Register the user, enroll the user, and import the new identity into the wallet.
        var secret = await ca.register({
            affiliation: 'org4.department1',
            enrollmentID: 'appUserOrg4',
            role: 'client'
        }, adminUser);
        var enrollment = await ca.enroll({
            enrollmentID: 'appUserOrg4',
            enrollmentSecret: secret
        });
        var x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org4MSP',
            type: 'X.509',
        };
        await wallet.put('appUserOrg4', x509Identity);
        console.log('Successfully registered and enrolled admin user "appUserOrg4" and imported it into the wallet');

        //******************************* Org 5 *******************************    
        // load the network configuration
        var ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org5.example.com', 'connection-org5.json');
        var ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new CA client for interacting with the CA.
        var caURL = ccp.certificateAuthorities['ca.org5.example.com'].url;
        var ca = new FabricCAServices(caURL);

        // Create a new file system based wallet for managing identities.
        var walletPath = path.join(process.cwd(), 'wallet');
        var wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        var userIdentity = await wallet.get('appUserOrg5');
        if (userIdentity) {
            console.log('An identity for the user "appUserOrg5" already exists in the wallet');
            return;
        }

        // Check to see if we've already enrolled the admin user.
        var adminIdentity = await wallet.get('adminOrg5');
        if (!adminIdentity) {
            console.log('An identity for the admin user "adminOrg5" does not exist in the wallet');
            console.log('Run the enrollAdmin.js application before retrying');
            return;
        }

        // build a user object for authenticating with the CA
        var provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        var adminUser = await provider.getUserContext(adminIdentity, 'adminOrg5');

        // Register the user, enroll the user, and import the new identity into the wallet.
        var secret = await ca.register({
            affiliation: 'org5.department1',
            enrollmentID: 'appUserOrg5',
            role: 'client'
        }, adminUser);
        var enrollment = await ca.enroll({
            enrollmentID: 'appUserOrg5',
            enrollmentSecret: secret
        });
        var x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org5MSP',
            type: 'X.509',
        };
        await wallet.put('appUserOrg5', x509Identity);
        console.log('Successfully registered and enrolled admin user "appUserOrg5" and imported it into the wallet');

    } catch (error) {
        console.error(`Failed to register user "appUser": ${error}`);
        process.exit(1);
    }
}

main();
