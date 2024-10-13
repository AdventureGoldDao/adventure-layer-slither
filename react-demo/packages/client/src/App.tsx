import React, { useState, useEffect } from 'react';
import { useComponentValue } from "@latticexyz/react";
import { Container, Heading, Button } from "@chakra-ui/react";
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useMUD } from "./MUDContext";
import CanvasBoard from "./components/CanvasBoard";
import ScoreCard from "./components/ScoreCard";
import MaxScoreCard from "./components/MaxScoreCard";
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
        console.log('Connect', account)
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

export const App = () => {
  const {
    network : { playerEntity },
    components: { Counter },
    systemCalls: { reStartGame },
  } = useMUD();

  const counter = useComponentValue(Counter, playerEntity);
  if (counter === undefined) {
      reStartGame();
  }
  return (
    <>
      <Container maxW="container.lg" centerContent>
        <Heading as="h1" size="xl">SNAKE GAME</Heading>
        {false && <div style={{marginTop: "12px"}}>
          <WalletButton />
        </div>}
        <Heading as="h2" size="md" mt={5} mb={0}>Max Score: {counter?.maxScore ?? "0"}</Heading>
        <Heading as="h2" size="md" mt={5} mb={5}>Current Score: {counter?.curScore ?? "0"}</Heading>
        <CanvasBoard height={600} width={1000} />
      </Container>
    </>
  );
};
