import React, { useContext } from 'react';
import { GlobalStateContext } from '../providers/globalState';
import { useActor } from '@xstate/react';
import FormikForm from './FormikForm';
import UploadAttestation from './UploadAttestation';
import ButtonRegister from './ButtonRegister';
import ButtonMintEcoID from './ButtonMintEcoID';
import { Button, Grid, Typography } from '@mui/material';
import download from "../utilities/download";
import {  useSigner } from 'wagmi'
import LinearProgress from '@mui/material/LinearProgress';


function ClaimEcoID() {


    const globalServices = useContext(GlobalStateContext);
    const [state, send] = useActor(globalServices.stateService);
    const { data: signer } = useSigner();


    return (

        <Grid container display="flex" justifyContent="center" alignItems="center" flexDirection="column" spacing={2}>

            <Grid>
                <Button size="small" color="inherit" onClick={() => window.history.back()}>
                    ← Back
                </Button>

                <Typography component="h1" variant="h5">
                    Claim Attestation - Sign
                </Typography>

                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                Sign attestation with your address. You can then mint an Eco ID ou download the new attestation
                </Typography>
            </Grid>

        <div style={{
            padding: "50px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "100%"
        }}>


            {state.matches({ "connected": { "claim eco id": { "attestation is loaded": "attestation is valid" } } }) ? <FormikForm></FormikForm> : ""}
            {state.matches({ "connected": { "claim eco id": "idle" } }) ? <UploadAttestation></UploadAttestation> : ""}
            {state.matches({"connected":{"claim eco id":{"attestation is loaded":"attestation miss receiver signature"}}}) ? <Button variant="contained" color="success" onClick={
                //@ts-ignore
                ()=> send({type : "sign", signer})
            }>Sign</Button> : ""}

            {state.matches({ "connected": { "claim eco id": { "attestation is loaded": "signing" } } }) ? 
                <Grid>
                    <Typography variant="overline" display="block" gutterBottom>
                        Waiting for signature
                    </Typography>
                    <LinearProgress color="success" />
                </Grid>
                : ""}

            {state.matches({"connected":{"claim eco id":{"attestation is loaded":"attestation signed by receiver"}}}) && 
                <Grid container display="flex" justifyContent="center" alignItems="center" flexDirection="column" spacing={5}>
                    <Grid>
                        <Button variant="contained" color="success" onClick={()=> send("self mint")}>Mint your Eco ID</Button> 
                    </Grid>
                    <Grid>
                        <Button variant="contained" color="success" onClick={()=> {
                            send("download");
                            //@ts-ignore   
                            download("attestation-" + state.context.attestation.message.recipient, state.context.attestation)
                            }}>Download attestation</Button>                
                    </Grid>
                </Grid>
            }

            {state.matches({ "connected": { "claim eco id": { "attestation is loaded": "attestation ready to be registered" } } }) ? <ButtonRegister></ButtonRegister> : ""}
            {state.matches({ "connected": { "claim eco id": { "attestation is loaded": "calling register" } } }) ? 
                <Grid>
                    <Typography variant="overline" display="block" gutterBottom>
                        Calling smart contract : register method
                    </Typography>
                    <LinearProgress color="success" />
                </Grid>
                : ""}
            
            {state.matches({"connected":{"claim eco id":{"attestation is loaded":"registered"}}}) ? <ButtonMintEcoID></ButtonMintEcoID> : ""}
            {state.matches({ "connected": { "claim eco id": { "attestation is loaded": "calling mint" } } }) ? 
                <Grid>
                    <Typography variant="overline" display="block" gutterBottom>
                        Calling mint : register method
                    </Typography>
                    <LinearProgress color="success" />
                </Grid>
                : ""}
        </div>
        </Grid>
    );
};

export default ClaimEcoID






