import React from 'react'
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'
import 'styles/core.scss'
import Layout from 'containers/Layout'

import Home from 'pages/Home'
import AppHome from 'pages/AppHome'
import Inventory from 'pages/Inventory'
import Hatching from 'pages/Hatching'
import Stake from 'pages/Stake'
import Dashboard from 'pages/Dashboard'
import { Market } from 'pages/Market'
import { BuyDragon } from 'pages/Market'
import DragonBox from '../pages/DragonBox'
import CrystalAttunement from '../pages/CrystalAttunement'
import CrystalInventory from '../pages/CrystalInventory'
import DragonUp from '../pages/DragonUp'
import { BuyEgg } from 'pages/Market'
import BuyCrystal from 'pages/Market/BuyCrystal'
import MarketFloorPrices from 'pages/MarketFloorPrices'

const routes = () => (
  <Router>
    <Layout>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/app" component={AppHome} />
        <Route exact path="/inventory/:inventoryType" component={Inventory} />
        <Route exact path="/crystal-inventory" component={CrystalInventory} />
        <Route exact path="/hatching" component={Hatching} />
        <Route exact path="/stake" component={Stake} />
        <Route exact path="/market" component={Market} />
        <Route path="/buy-dragon" component={BuyDragon} />
        <Route path="/buy-egg" component={BuyEgg} />
        <Route path="/buy-crystal" component={BuyCrystal} />
        <Route exact path="/dashboard" component={Dashboard} />
        <Route exact path="/dragon-box" component={DragonBox} />
        <Route exact path="/crystal-attunement" component={CrystalAttunement} />
        <Route exact path="/dragon-up" component={DragonUp} />
        <Route exact path='/market-floor-prices' component={MarketFloorPrices} />
        <Redirect to="/" />
      </Switch>
    </Layout>
  </Router>
)

export default routes
