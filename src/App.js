import React from 'react'
import { Heading, Center, Text, VStack } from '@chakra-ui/core'
// https://docs.ethers.io/v5/
import { ethers } from 'ethers'

const initialWeb3State = {
  isWeb3: false,
}

function App() {
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
      </VStack>
    </>
  )
}

export default App
