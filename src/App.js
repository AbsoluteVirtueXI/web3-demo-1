import React, { useReducer } from 'react'
import { Heading, Center, Text, VStack } from '@chakra-ui/core'
// https://docs.ethers.io/v5/
import { ethers } from 'ethers'

const web3Reducer = (state, action) => {
  switch (action.type) {
    case 'SET_isWeb3':
      return { ...state, isWeb3: action.isWeb3 }
    default:
      throw new Error(`Unhandled action ${action.type} in web3Reducer`)
  }
}

const initialWeb3State = {
  isWeb3: false,
}

function App() {
  const [state, disptach] = useReducer(web3Reducer, initialWeb3State)
  return (
    <>
      <Center>
        <Heading mb={10}>Web3 demo 1</Heading>
      </Center>
      <VStack>
        <Text>Web3 : {state.isWeb3 ? 'injected' : 'not found'}</Text>
      </VStack>
    </>
  )
}

export default App
