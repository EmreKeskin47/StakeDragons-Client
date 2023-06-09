export const mainnetConfig = {
  chainId: 'juno-1',
  chainName: 'Juno',
  addressPrefix: 'juno',
  rpcUrl: 'https://rpc-juno.mib.tech/',
  feeToken: 'ujuno',
  stakingToken: 'ujuno',
  coinMap: {
    ujuno: { denom: 'JUNO', fractionalDigits: 6 },
  },
  gasPrice: 0.025,
  fees: {
    upload: 1500000,
    init: 500000,
    exec: 200000,
  },
}

export const uniTestnetConfig = {
  chainId: 'uni-3',
  chainName: 'JunoTestnet',
  addressPrefix: 'juno',
  rpcUrl: 'https://rpc.uni.junonetwork.io/',
  httpUrl: 'https://lcd.uni.juno.deuslabs.fi',
  feeToken: 'ujunox',
  stakingToken: 'ujunox',
  coinMap: {
    ujuno: { denom: 'JUNO', fractionalDigits: 6 },
    ujunox: { denom: 'JUNOX', fractionalDigits: 6 },
  },
  gasPrice: 0.025,
  fees: {
    upload: 1500000,
    init: 500000,
    exec: 200000,
  },
}

export const getConfig = (network) => {
  if (network === 'mainnet') return mainnetConfig
  return mainnetConfig
}
