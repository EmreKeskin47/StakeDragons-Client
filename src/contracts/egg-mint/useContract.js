import { useWallet } from 'contexts/wallet'
import { useCallback, useEffect, useState } from 'react'
import { EggMint as initContract } from './contract'

export function useEggMintContract() {
  const wallet = useWallet()

  const [address, setAddress] = useState('')
  const [EggMint, setEggMint] = useState()

  useEffect(() => {
    setAddress(localStorage.getItem('contract_address') || '')
  }, [])

  useEffect(() => {
    if (wallet.initialized) {
      const getBaseInstance = async () => {
        const eggMintBaseContract = initContract(wallet.getClient())
        setEggMint(eggMintBaseContract)
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
        if (!EggMint) return reject('Contract is not initialized.')

        EggMint.instantiate(wallet.address, codeId, initMsg, label).then(resolve).catch(reject)
      })
    },
    [EggMint, wallet],
  )

  const use = useCallback(
    (customAddress = '') => {
      return EggMint?.use(address || customAddress)
    },
    [EggMint, address],
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
