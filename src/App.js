import React from 'react'
import { Heading, Center, Text, VStack } from '@chakra-ui/core'
// https://docs.ethers.io/v5/
import { ethers } from 'ethers'

//Is web3 injected?

const initialWeb3State = {
  isWeb3: false,
  isEnabled: false,
  //isMetaMask: false
  account: '0x0',
  provider: null,
  balance: 0,
  network: null,
  signer: null,
}

function App() {
  // m
  return (
    <>
      <Center>
        <Heading mb={10}>Web3 demo 1</Heading>
      </Center>
      <VStack>
        <Text>
          Web3 environment:
          {initialWeb3State.isWeb3 ? 'injected' : 'uninjected'}
        </Text>
        <Text>
          MetaMask status:{' '}
          {initialWeb3State.isEnabled ? 'connected' : 'disconnected'}
        </Text>
        <Text>account: {initialWeb3State.account}</Text>
        <Text>balance: {initialWeb3State.balance}</Text>
        <Text>network: {'unknown'}</Text>
      </VStack>
    </>
  )
}

export default App
