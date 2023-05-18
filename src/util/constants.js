import PurpleDragon from 'assets/market/LegendaryDragon.png'
import EpicDragon from 'assets/market/EpicDragon.png'
import RareDragon from 'assets/market/RareDragon.png'
import UncommonDragon from 'assets/market/UncommonDragon.png'
import CommonDragon from 'assets/market/CommonDragon.png'

export const NETWORK = process.env.NEXT_PUBLIC_NETWORK

export const SORT_OPTIONS = [
  {
    id: 1,
    text: 'Lowest Price',
  },
  {
    id: 2,
    text: 'Highest Price',
  },
]

export const DRAGON_TYPE_NAMES = [
  {
    id: 0,
    name: 'common',
    color: '#72736D',
  },
  {
    id: 1,
    name: 'uncommon',
    color: '#279D51',
  },
  {
    id: 2,
    name: 'rare',
    color: '#1764C0',
  },
  {
    id: 3,
    name: 'epic',
    color: '#8F3C74',
  },
  {
    id: 4,
    name: 'legendary',
    color: '#D75D2A',
  },
]

export const CRYSTAL_TYPE_NAME = [
  {
    id: 0,
    name: 'fire',
    color: '#f8654b',
  },
  {
    id: 1,
    name: 'ice',
    color: '#6aebf8',
  },
  {
    id: 2,
    name: 'storm',
    color: '#e7ecf6',
  },
  {
    id: 3,
    name: 'udin',
    color: '#4bc879',
  },
  {
    id: 4,
    name: 'divine',
    color: '#d2c849',
  },
]

export const getDragonPropertiesByKind = (dragonType) => {
  let background = '#72736D'
  let width = '40%'
  let img = CommonDragon
  let rarity = 1

  if (!dragonType) return { background, width, img, rarity }

  if (dragonType.startsWith('uncommon')) {
    background = '#279D51'
    width = '50%'
    img = UncommonDragon
    rarity = 2
  }

  if (dragonType.startsWith('rare')) {
    background = '#1764C0'
    width = '68%'
    img = RareDragon
    rarity = 3
  }

  if (dragonType.startsWith('epic')) {
    background = '#8F3C74'
    width = '86%'
    img = EpicDragon
    rarity = 4
  }

  if (dragonType.startsWith('legendary')) {
    background = '#D75D2A'
    width = '100%'
    img = PurpleDragon
    rarity = 5
  }

  return { background, width, img, rarity }
}