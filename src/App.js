import React, { useEffect, useReducer } from 'react'
import { Heading, Center, Text, VStack } from '@chakra-ui/core'
// https://docs.ethers.io/v5/
import { ethers } from 'ethers'

const web3Reducer = (state, action) => {
  switch (action.type) {
    case 'SET_isWeb3':
      return { ...state, isWeb3: action.isWeb3 }
    case 'SET_enabled':
      return { ...state, isEnabled: action.isEnabled }
    case 'SET_account':
      return { ...state, account: action.account }
    case 'SET_provider':
      return { ...state, provider: action.provider }
    case 'SET_network':
      return { ...state, network: action.network }
    case 'SET_balance':
      return { ...state, balance: action.balance }
    default:
      throw new Error(`Unhandled action ${action.type} in web3Reducer`)
  }
}

const initialWeb3State = {
  isWeb3: false,
  isEnabled: false,
  account: ethers.constants.AddressZero,
  provider: null,
  network: null,
  balance: '0',
}

function App() {
  const [state, dispatch] = useReducer(web3Reducer, initialWeb3State)

  //Check if Web3 is injected
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      dispatch({ type: 'SET_isWeb3', isWeb3: true })
    } else {
      dispatch({ type: 'SET_isWeb3', isWeb3: false })
    }
  }, [])

  //Check if Metamask is Enabled and get account
  useEffect(() => {
    const connect2MetaMask = async () => {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        })
        dispatch({ type: 'SET_enabled', isEnabled: true })
        dispatch({ type: 'SET_account', account: accounts[0] })
      } catch (e) {
        console.log('Error:', e)
        dispatch({ type: 'SET_enabled', isEnabled: false })
      }
    }
    if (state.isWeb3) {
      connect2MetaMask()
    }
  }, [state.isWeb3])

  // Connect to provider
  useEffect(() => {
    const connect2Provider = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      dispatch({ type: 'SET_provider', provider: provider })
      // https://docs.ethers.io/v5/api/providers/provider/#Provider-getBalance
      const network = await provider.getNetwork()
      dispatch({ type: 'SET_network', network: network })
      // https://docs.ethers.io/v5/api/providers/provider/#Provider-getBalance
      const _balance = await provider.getBalance(state.account)
      const balance = ethers.utils.formatEther(_balance)
      dispatch({ type: 'SET_balance', balance: balance })
    }

    if (state.isEnabled && state.account !== ethers.constants.AddressZero) {
      connect2Provider()
    }
  }, [state.isEnabled, state.account])

  return (
    <>
      <Center>
        <Heading mb={10}>Web3 demo 1</Heading>
      </Center>
      <VStack>
        <Text>Web3 : {state.isWeb3 ? 'injected' : 'not found'}</Text>
        <Text>
          MetaMask status: {state.isEnabled ? 'connected' : 'disconnected'}
        </Text>
        {state.isEnabled && <Text>account: {state.account}</Text>}
        <Text>balance: {state.balance}</Text>
        {state.network && (
          <>
            <Text>Network name: {state.network.name}</Text>
            <Text>Network id: {state.network.chainId}</Text>
          </>
        )}
      </VStack>
    </>
  )
}

export default App
