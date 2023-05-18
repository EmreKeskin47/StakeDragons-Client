const createDistribution = (array, weights, size) => {
  const distribution = []
  const sum = weights.reduce((a, b) => a + b)
  const quant = size / sum
  for (let i = 0; i < array.length; ++i) {
    const limit = quant * weights[i]
    for (let j = 0; j < limit; ++j) {
      distribution.push(i)
    }
  }
  return distribution
}

const randomIndex = (distribution) => {
  const index = Math.floor(distribution.length * Math.random())
  return distribution[index]
}

export const getRandomType = () => {
  let res = []
  const array = ['8', 'Q', 'J', 'A', '2', 'W', '3', 'G', '4', 'K', 'P']
  const weights = [0.15, 0.15, 0.15, 0.15, 0.2, 0.2, 0.1, 0.1, 0.035, 0.035, 0.0001]

  const distribution = createDistribution(array, weights, 100)

  for (let i = 0; i < 100; ++i) {
    const index = randomIndex(distribution)
    res.push(array[index])
  }
  const count = {}

  for (const element of res) {
    if (count[element]) {
      count[element] += 1
    } else {
      count[element] = 1
    }
  }

  return res.join('')
}

export const getRandomCrystal = () => {
  let res = []
  const array = ['G', '2', 'N', '5', 'V', 'S', '7', '1', 'B', '9', 'L', 'C']
  const weights = [0.125, 0.125, 0.125, 0.125, 0.1, 0.1, 0.025, 0.025, 0.05, 0.05, 0.05, 0.05]

  const distribution = createDistribution(array, weights, 100)

  for (let i = 0; i < 100; ++i) {
    const index = randomIndex(distribution)
    res.push(array[index])
  }
  const count = {}

  for (const element of res) {
    if (count[element]) {
      count[element] += 1
    } else {
      count[element] = 1
    }
  }

  return res.join('')
}


export const getRandomUpgradeSuccess = (extraSuccessRate) => {
  let res = []

  const successRate = (0.125 + (extraSuccessRate / 400))
  const failRate = (0.125 - (extraSuccessRate / 400))

  const array = ['a', 'b', 'c', 'd', 'j', '2', '8', 'H']
  const weights = [successRate, successRate, successRate, successRate, failRate, failRate, failRate, failRate]

  const distribution = createDistribution(array, weights, 100)

  for (let i = 0; i < 100; ++i) {
    const index = randomIndex(distribution)
    res.push(array[index])
  }
  const count = {}

  for (const element of res) {
    if (count[element]) {
      count[element] += 1
    } else {
      count[element] = 1
    }
  }

  return res.join('')
}
