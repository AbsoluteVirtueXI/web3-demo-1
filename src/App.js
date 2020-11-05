import React, { useEffect, useReducer } from 'react'
import {
  Heading,
  Center,
  Text,
  VStack,
  UnorderedList,
  ListItem,
} from '@chakra-ui/core'
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
    case 'SET_signer':
      return { ...state, signer: action.signer }
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
  signer: null,
  network: null,
  balance: '0',
}

function App() {
  const [web3State, web3Dispatch] = useReducer(web3Reducer, initialWeb3State)

  //Check if Web3 is injected
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      web3Dispatch({ type: 'SET_isWeb3', isWeb3: true })
    } else {
      web3Dispatch({ type: 'SET_isWeb3', isWeb3: false })
    }
  }, [])

  //Check if Metamask is Enabled and get account
  useEffect(() => {
    const connect2MetaMask = async () => {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        })
        web3Dispatch({ type: 'SET_enabled', isEnabled: true })
        web3Dispatch({ type: 'SET_account', account: accounts[0] })
      } catch (e) {
        console.log('Error:', e)
        web3Dispatch({ type: 'SET_enabled', isEnabled: false })
      }
    }
    if (web3State.isWeb3) {
      connect2MetaMask()
    }
  }, [web3State.isWeb3])

  // Connect to provider
  useEffect(() => {
    const connect2Provider = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        web3Dispatch({ type: 'SET_provider', provider: provider })
        const signer = provider.getSigner()
        web3Dispatch({ type: 'SET_signer', signer: signer })
        // https://docs.ethers.io/v5/api/providers/provider/#Provider-getBalance
        const network = await provider.getNetwork()
        web3Dispatch({ type: 'SET_network', network: network })
        // https://docs.ethers.io/v5/api/providers/provider/#Provider-getBalance
        const _balance = await provider.getBalance(web3State.account)
        // https://docs.ethers.io/v5/api/utils/display-logic/#utils-formatEther
        const balance = ethers.utils.formatEther(_balance)
        web3Dispatch({ type: 'SET_balance', balance: balance })
      } catch (e) {
        web3Dispatch({ type: 'SET_network', network: initialWeb3State.network })
        web3Dispatch({ type: 'SET_balance', balance: initialWeb3State.balance })
      }
    }

    if (
      web3State.isEnabled &&
      web3State.account !== ethers.constants.AddressZero
    ) {
      connect2Provider()
    }
  }, [web3State.isEnabled, web3State.account])

  return (
    <>
      <Center>
        <Heading mb={10}>Web3 demo 1</Heading>
      </Center>
      <VStack>
        <UnorderedList>
          <ListItem>
            {web3State.isWeb3 ? (
              <Text color="green.500">Web3: Injected</Text>
            ) : (
              <Text color="red.500">Web3: Not found</Text>
            )}
          </ListItem>
          <ListItem>
            {web3State.isEnabled ? (
              <Text color="green.500">MetaMask status: connected</Text>
            ) : (
              <Text color="red.500">MetaMask status: disconnected</Text>
            )}
          </ListItem>
          {web3State.isEnabled && (
            <>
              <ListItem>
                <Text>account: {web3State.account}</Text>
              </ListItem>
              <ListItem>
                <Text>balance: {web3State.balance}</Text>
              </ListItem>
              {web3State.network && (
                <>
                  <ListItem>
                    <Text>Network name: {web3State.network.name}</Text>
                  </ListItem>
                  <ListItem>
                    <Text>Network id: {web3State.network.chainId}</Text>
                  </ListItem>
                </>
              )}
            </>
          )}
        </UnorderedList>
      </VStack>
    </>
  )
}

export default App
