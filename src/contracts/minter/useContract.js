import { useWallet } from 'contexts/wallet'
import { useCallback, useEffect, useState } from 'react'
import { Minter as initContract } from './contract'

export function useMinterContract() {
  const wallet = useWallet()

  const [address, setAddress] = useState('')
  const [Minter, setMinter] = useState()

  useEffect(() => {
    setAddress(localStorage.getItem('contract_address') || '')
  }, [])

  useEffect(() => {
    if (wallet.initialized) {
      const getBaseInstance = async () => {
        const eggMintBaseContract = initContract(wallet.getClient())
        setMinter(eggMintBaseContract)
      }

      getBaseInstance()
    }
  }, [wallet])

  const updateContractAddress = (contractAddress) => {
    setAddress(contractAddress)
  }

  const instantiate = useCallback(
    (codeId, initMsg, label) => {
      return new Promise((resolve, reject) => {
        if (!Minter) return reject('Contract is not initialized.')

        Minter.instantiate(wallet.address, codeId, initMsg, label).then(resolve).catch(reject)
      })
    },
    [Minter, wallet],
  )

  const use = useCallback(
    (customAddress = '') => {
      return Minter?.use(address || customAddress)
    },
    [Minter, address],
  )
  const getContractAddress = () => {
    return address
  }

  return {
    instantiate,
    use,
    updateContractAddress,
    getContractAddress,
  }
}
