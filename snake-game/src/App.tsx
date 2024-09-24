import React, { useState, useEffect } from 'react';
import { ChakraProvider, Container, Heading, Button } from "@chakra-ui/react";
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Provider } from "react-redux";
import CanvasBoard from "./components/CanvasBoard";
import ScoreCard from "./components/ScoreCard";
import store from "./store";

import { shortenAddress, useEthers, useLookupAddress } from "@usedapp/core";

const btnCls = css`
align-items: center;
border-color: #f39b4b;
border-radius: 6px;
display: flex;
flex-direction: row;
height: 32px;
justify-content: center;
margin-right: 15px;
margin-left: 15px;
width: 160px;

background: #f39b4b;
color: #000;
border-color: #f39b4b;

&.connect, &.connect-btn, &:hover {
  background: #f39b4b;
  color: #000;
  border-color: #f39b4b;
}
`

const styles: any = {
  connect: btnCls,
  menuBox: css`
    width: 100%;
    height: 58px;
    background: #1F1A15;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  `,
  logoBox: css`
    margin-left: 46px;
    width: 28px;
    height: 28px;
  `,
  logo: css`
    width: 100%;
    height: 100%;
  `,
  menu: css`
    width: 309px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  `,
  menuItem: css`
    color: #fff;
    font-size: 14px;
    text-decoration: none;
    font-family: 'NeueHaasDisplayMediu';
  `,
}

function WalletButton() {
  const [rendered, setRendered] = useState("");
  const { ens } = useLookupAddress('');
  const { account, activateBrowserWallet, deactivate, error } = useEthers();

  useEffect(() => {
    if (ens) {
      setRendered(ens);
    } else if (account) {
      setRendered(shortenAddress(account));
    } else {
      setRendered("");
    }
  }, [account, ens, setRendered]);

  useEffect(() => {
    if (error) {
      console.error("Error while connecting wallet:", error.message);
    }
  }, [error]);

  return (
    <Button
      css={btnCls}
      // className={styles['connect']}
      variant="contained" size="medium"
      // style={{ padding: '4px 5px', marginBottom: '12px' }}
      onClick={() => {
        if (!account) {
          activateBrowserWallet();
        } else {
          deactivate();
        }
      }}>
      <div className={styles['connect-btn']}>
        {rendered === "" && "Connect AGLD"}
        {rendered !== "" && rendered}
      </div>
    </Button>
  );
}

const App = () => {
  return (
    <Provider store={store}>
      <ChakraProvider>
        <Container maxW="container.lg" centerContent>
          <Heading as="h1" size="xl">SNAKE GAME</Heading>
          <ScoreCard />
          <div style={{marginBottom: "12px"}}>
            <WalletButton />
          </div>
          <CanvasBoard height={600} width={1000} />
        </Container>
      </ChakraProvider>
    </Provider>
  );
};

export default App;
