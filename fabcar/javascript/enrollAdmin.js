/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const FabricCAServices = require('fabric-ca-client');
const { Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function main() {
    try {
        // load the network configuration
        var ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        var ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new CA client for interacting with the CA.
        var caInfo = ccp.certificateAuthorities['ca.org1.example.com'];
        var caTLSCACerts = caInfo.tlsCACerts.pem;
        var ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

        // Create a new file system based wallet for managing identities.
        var walletPath = path.join(process.cwd(), 'wallet');
        var wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the Org1 user.
        var identity = await wallet.get('adminOrg1');
        if (identity) {
            console.log('An identity for the Org1 user already exists in the wallet');
            return;
        }
        // Enroll the Org1 user, and import the new identity into the wallet.
        var enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
        var x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org1MSP',
            type: 'X.509',
        };
        await wallet.put('adminOrg1', x509Identity);
        console.log('Successfully enrolled user "Org1" and imported it into the wallet');

        //***************************** Org 2 *****************************
        // load the network configuration
        var ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org2.example.com', 'connection-org2.json');
        var ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new CA client for interacting with the CA.
        var caInfo = ccp.certificateAuthorities['ca.org2.example.com'];
        var caTLSCACerts = caInfo.tlsCACerts.pem;
        var ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

        // Create a new file system based wallet for managing identities.
        var walletPath = path.join(process.cwd(), 'wallet');
        var wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the Org2 user.
        var identity = await wallet.get('adminOrg2');
        if (identity) {
            console.log('An identity for the Org2 user already exists in the wallet');
            return;
        }

        // Enroll the Org2 user, and import the new identity into the wallet.
        var enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
        var x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org2MSP',
            type: 'X.509',
        };
        await wallet.put('adminOrg2', x509Identity);
        console.log('Successfully enrolled user "Org2" and imported it into the wallet');

        //***************************** Org 3 *****************************
        // load the network configuration
        var ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org3.example.com', 'connection-org3.json');
        var ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new CA client for interacting with the CA.
        var caInfo = ccp.certificateAuthorities['ca.org3.example.com'];
        var caTLSCACerts = caInfo.tlsCACerts.pem;
        var ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

        // Create a new file system based wallet for managing identities.
        var walletPath = path.join(process.cwd(), 'wallet');
        var wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the Org3 user.
        var identity = await wallet.get('adminOrg3');
        if (identity) {
            console.log('An identity for the Org3 user already exists in the wallet');
            return;
        }

        // Enroll the Org3 user, and import the new identity into the wallet.
        var enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
        var x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org3MSP',
            type: 'X.509',
        };
        await wallet.put('adminOrg3', x509Identity);
        console.log('Successfully enrolled user "Org3" and imported it into the wallet');

        //***************************** Org 4 *****************************
        // load the network configuration
        var ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org4.example.com', 'connection-org4.json');
        var ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new CA client for interacting with the CA.
        var caInfo = ccp.certificateAuthorities['ca.org4.example.com'];
        var caTLSCACerts = caInfo.tlsCACerts.pem;
        var ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

        // Create a new file system based wallet for managing identities.
        var walletPath = path.join(process.cwd(), 'wallet');
        var wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the Org4 user.
        var identity = await wallet.get('adminOrg4');
        if (identity) {
            console.log('An identity for the Org4 user already exists in the wallet');
            return;
        }

        // Enroll the Org4 user, and import the new identity into the wallet.
        var enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
        var x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org4MSP',
            type: 'X.509',
        };
        await wallet.put('adminOrg4', x509Identity);
        console.log('Successfully enrolled user "Org4" and imported it into the wallet');

        //***************************** Org 5 *****************************
        // load the network configuration
        var ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org5.example.com', 'connection-org5.json');
        var ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new CA client for interacting with the CA.
        var caInfo = ccp.certificateAuthorities['ca.org5.example.com'];
        var caTLSCACerts = caInfo.tlsCACerts.pem;
        var ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

        // Create a new file system based wallet for managing identities.
        var walletPath = path.join(process.cwd(), 'wallet');
        var wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the Org5 user.
        var identity = await wallet.get('adminOrg5');
        if (identity) {
            console.log('An identity for the Org5 user already exists in the wallet');
            return;
        }

        // Enroll the Org5 user, and import the new identity into the wallet.
        var enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
        var x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org5MSP',
            type: 'X.509',
        };
        await wallet.put('adminOrg5', x509Identity);
        console.log('Successfully enrolled user "Org5" and imported it into the wallet');

    } catch (error) {
        console.error(`Failed to enroll user: ${error}`);
        process.exit(1);
    }
}

main();
