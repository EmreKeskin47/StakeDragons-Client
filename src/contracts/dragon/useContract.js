import { useWallet } from 'contexts/wallet'
import { useCallback, useEffect, useState } from 'react'
import { Dragon as initContract } from './contract'

export function useDragonContract() {
  const wallet = useWallet()

  const [address, setAddress] = useState('')
  const [Dragon, setDragon] = useState()

  useEffect(() => {
    setAddress(localStorage.getItem('contract_address') || '')
  }, [])

  useEffect(() => {
    if (wallet.initialized) {
      const getBaseInstance = async () => {
        const dragonBaseContract = initContract(wallet.getClient())
        setDragon(dragonBaseContract)
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
        if (!Dragon) return reject('Contract is not initialized.')

        Dragon.instantiate(wallet.address, codeId, initMsg, label).then(resolve).catch(reject)
      })
    },
    [Dragon, wallet],
  )

  const use = useCallback(
    (customAddress = '') => {
      return Dragon?.use(address || customAddress)
    },
    [Dragon, address],
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
