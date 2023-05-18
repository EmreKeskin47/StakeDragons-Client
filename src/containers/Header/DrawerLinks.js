import dragondrop from 'assets/drawer/dragondrop.svg'
import hatching from 'assets/drawer/hatching.svg'
import inventory from 'assets/drawer/inventory.svg'
import market from 'assets/drawer/market.svg'
import stake from 'assets/drawer/stake.svg'
import hatchingSelected from 'assets/drawer/hatching-selected.svg'
import inventorySelected from 'assets/drawer/inventory-selected.svg'
import marketSelected from 'assets/drawer/market-selected.svg'
import stakeSelected from 'assets/drawer/stake-selected.svg'
import dragondropSelected from 'assets/drawer/dragondrop-selected.svg'
import dashboard from 'assets/drawer/dashboard.svg'
import dashboardSelected from 'assets/drawer/dashboard-selected.svg'
import boxCrystal from 'assets/drawer/box-crystal.svg'
import boxCrystalSelected from 'assets/drawer/box-crystal-selected.svg'
import dragonBox from 'assets/drawer/dragon-box.svg'
import dragonBoxSelected from 'assets/drawer/dragon-box-selected.svg'
import crystal from 'assets/drawer/crystal.svg'
import crystalSelected from 'assets/drawer/crystal-selected.svg'
import inventoryDragon from 'assets/drawer/inventory-dragon.svg'
import inventoryDragonSelected from 'assets/drawer/inventory-dragon-selected.svg'
import inventoryEgg from 'assets/drawer/inventory-egg.svg'
import inventoryEggSelected from 'assets/drawer/inventory-egg-selected.svg'
import inventoryCrystal from 'assets/drawer/inventory-crystal.svg'
import inventoryCrystalSelected from 'assets/drawer/inventory-crystal-selected.svg'
import marketFloorPrices from 'assets/drawer/market-floor-price.svg'
import DashboardandFloorPrice from 'assets/drawer/Dashboard-and-Floor-Price.svg'
import DashboardandFloorPriceSelected from 'assets/drawer/Dashboard-and-Floor-Price-selected.svg'
import marketFloorPricesSelected from 'assets/drawer/market-floor-price-selected.svg'

export const DRAWER_ITEMS = [
  {
    text: 'Hatching',
    image: hatching,
    selected: hatchingSelected,
    link: '/hatching',
  },
  {
    text: 'Dragon Box and Crystal Attunement',
    image: boxCrystal,
    selected: boxCrystalSelected,
    submenus: [
      {
        text: 'Dragon Box',
        image: dragonBox,
        selected: dragonBoxSelected,
        link: '/dragon-box',
      },
      {
        text: 'Crystal Attunement',
        image: crystal,
        selected: crystalSelected,
        link: '/crystal-attunement',
      },
    ]
  },
  {
    text: 'Dragonup',
    image: dragondrop,
    selected: dragondropSelected,
    link: '/dragon-up',
  },
  {
    text: 'Inventory',
    image: inventory,
    selected: inventorySelected,
    submenus: [
      {
        text: 'Dragon',
        image: inventoryDragon,
        selected: inventoryDragonSelected,
        link: '/inventory/dragon',
      },
      {
        text: 'Egg',
        image: inventoryEgg,
        selected: inventoryEggSelected,
        link: '/inventory/egg',
      },
      {
        text: 'Crystal',
        image: inventoryCrystal,
        selected: inventoryCrystalSelected,
        link: '/crystal-inventory',
      },
    ]
  },
  {
    text: 'Dragon Staking',
    image: stake,
    selected: stakeSelected,
    link: '/stake',
  },
  {
    text: 'Marketplace',
    image: market,
    selected: marketSelected,
    link: '/market',
  },
  {
    text: 'Dashboard and Floor Price',
    image: DashboardandFloorPrice,
    selected: DashboardandFloorPriceSelected,
    submenus: [
  {
    text: 'Dashboard',
    image: dashboard,
    selected: dashboardSelected,
    link: '/dashboard',
  },
  {
    text: 'Market Floor Prices',
    image: marketFloorPrices,
    selected: marketFloorPricesSelected,
    link: '/market-floor-prices',
  }
  ]
}
]
