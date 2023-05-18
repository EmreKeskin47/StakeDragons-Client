import React, { useState, useEffect } from 'react'
import { Grid, Modal, Typography } from '@mui/material'
import { Box } from '@mui/system'
import TextField from '@mui/material/TextField'
import { CustomOutlinedButton } from 'components/Button'
import { CrystalBox, CosmicBox } from 'components/Crystal'
import CrystalCard from '../../components/Crystal/CrystalCard'
import CosmicCard from '../../components/Crystal/CosmicCard'
import CosmicInfo from '../../components/Crystal/CosmicInfo'
import crystalContract from '../../contracts/crystal/contract'
import cosmicContract from '../../contracts/cosmic/contract'
import crystalMarket from '../../contracts/crystal-marketplace'

import Empty from './Empty'

import * as COLORS from 'util/ColorUtils'
import useStyles from 'styles'
import { useWallet } from 'contexts/wallet'
import TransferIcon from 'assets/inventory/transfer.svg'
import { useRef } from 'react'
import useOnScreen from '../../hooks/useOnScreen'

import Divine from 'assets/crystal/Divine.png'
import Fire from 'assets/crystal/Fire.png'
import Storm from 'assets/crystal/Storm.png'
import Ice from 'assets/crystal/Ice.png'
import Udin from 'assets/crystal/Udin.png'
import SellIcon from 'assets/inventory/sell.svg'
import RemoveIcon from 'assets/inventory/remove.svg'
import { fetchWithToast, showFailToast } from '../../util/FetchUtil'

const CrystalInventory = () => {
  const classes = useStyles()
  const wallet = useWallet()

  const crystalLimit = 5

  const CRYSTAL_CONTRACT_ADDRESS = process.env.REACT_APP_EGG_CONTRACT_ADDRESS

  const [selected, setSelected] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [selectedItemId, setSelectedItemId] = useState(null)
  const [selectedItemPrice, setSelectedItemPrice] = useState('0')
  const [error, setError] = useState(false)
  const [refresh, setRefresh] = useState(true)

  const [ownedCrystalList, setOwnedCrystalList] = useState([])
  const [ownedCosmicList, setOwnedCosmicList] = useState([])
  const [listedCrystals, setListedCrystals] = useState([])

  const [pricePanel, setPricePanel] = useState(false)
  const [price, setPrice] = useState('')
  const [transferPanel, setTransferPanel] = useState(false)
  const [transferTarget, setTransferTarget] = useState('')
  const [display, setDisplay] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [hasNext, setHasNext] = useState(false)
  const [hasNextCosmic, setHasNextCosmic] = useState(false)
  const [boxImage, setBoxImage] = useState(Fire)

  const loadMoreRef = useRef(null)
  const loadMoreVisible = useOnScreen(loadMoreRef)

  const loadMore = async () => {
    try {
      if (!wallet.initialized) return
      let crystalStartAfter
      crystalStartAfter = ownedCrystalList[ownedCrystalList.length - 1].token_id
      const crystal_client = crystalContract(wallet.getClient())
      const res_crystal = await crystal_client.rangeUserCrystals(
        wallet.address,
        crystalStartAfter,
        crystalLimit,
      )
      let all_items = ownedCrystalList.concat(res_crystal)
      setOwnedCrystalList(all_items)

      setHasNext(res_crystal.length >= crystalLimit)
      setIsFetching(false)
    } catch (e) {
      setIsFetching(false)
    }
  }

  const loadMoreCosmic = async () => {
    try {
      if (!wallet.initialized) return

      const cosmic_client = cosmicContract(wallet.getClient())
      const res_cosmic = await cosmic_client.queryUserCosmic(wallet.address, '0', crystalLimit)
      // eslint-disable-next-line
      let all_items = all_items.concat(res_cosmic)
      all_items = ownedCosmicList.concat(res_cosmic)
      setOwnedCosmicList(all_items)

      setHasNextCosmic(res_cosmic.length >= crystalLimit)
      setIsFetching(false)
    } catch (e) {
      setIsFetching(false)
    }
  }

  useEffect(() => {
    const queryUserCrystals = async () => {
      try {
        if (!wallet.initialized) return
        const crystal_client = crystalContract(wallet.getClient())
        const cosmic_client = cosmicContract(wallet.getClient())
        const market = crystalMarket(wallet.getClient())

        setIsFetching(true)
        const res_crystal = await crystal_client.rangeUserCrystals(
          wallet.address,
          '0',
          crystalLimit,
        )
        let listed = await market.getListedTokensByOwner(crystalLimit, null, wallet.address)

        await setListedCrystals(listed.tokens)
        const res_cosmic = await cosmic_client.queryUserCosmic(wallet.address)
        setOwnedCrystalList(res_crystal)
        setOwnedCosmicList(res_cosmic)

        setError(res_crystal.length === 0 && listed.tokens.length === 0 && res_cosmic.length === 0)

        setHasNext(res_crystal.length >= crystalLimit || listed.tokens.length >= crystalLimit)
        setHasNextCosmic(res_cosmic.length >= crystalLimit)
        setSelected(false)
        setPricePanel(false)
        setPrice('')
        setSelectedItemPrice('0')
        setTransferPanel(false)
        setTransferTarget('')

        setRefresh(false)
        setIsFetching(false)
      } catch (e) {
        console.log(e)
        setIsFetching(false)
      }
    }
    if (wallet) {
      queryUserCrystals()
    }
    // eslint-disable-next-line
  }, [wallet, crystalContract, CRYSTAL_CONTRACT_ADDRESS, refresh])

  useEffect(() => {
    if (!isFetching && loadMoreVisible && hasNext) {
      loadMore()
    }
    // eslint-disable-next-line
  }, [isFetching, loadMoreVisible, hasNext])
  useEffect(() => {
    if (!isFetching && loadMoreVisible && hasNextCosmic) {
      loadMoreCosmic()
    }
    // eslint-disable-next-line
  }, [isFetching, loadMoreVisible, hasNextCosmic])

  useEffect(() => {
    setIsFetching(false)
    setHasNext(true)
    // eslint-disable-next-line
  }, [])

  const scrollToSelected = async (item, id, price) => {
    setSelected(true)
    setSelectedItem(item)
    setSelectedItemId(id)
    setSelectedItemPrice(price)
    let kind = price === '0' ? item.kind : item.rarity
    switch (kind) {
      case 'udin':
        setBoxImage(Udin)
        break
      case 'storm':
        setBoxImage(Storm)
        break
      case 'ice':
        setBoxImage(Ice)
        break
      case 'fire':
        setBoxImage(Fire)
        break
      case 'divine':
        setBoxImage(Divine)
        break
      default:
        setBoxImage(Fire)
    }
  }

  const OpenClosePricePanel = () => {
    setPricePanel(!pricePanel)
  }

  const OpenCloseTransferPanel = () => {
    setTransferPanel(!transferPanel)
  }

  const transferOnClick = async () => {
    try {
      if (!wallet) return
      const client = crystalContract(wallet.getClient())
      await fetchWithToast(client.transferNft(wallet.address, transferTarget, selectedItemId))
      setRefresh(true)
    } catch (err) {
      showFailToast('Transaction Failed', 'Transaction Rejected')
    }
  }

  const transferOnClickCosmic = async () => {
    try {
      if (!wallet) return
      const client = cosmicContract(wallet.getClient())
      await fetchWithToast(client.transferNft(wallet.address, transferTarget, selectedItemId))
      setRefresh(true)
    } catch (err) {
      showFailToast('Transaction Failed', 'Transaction Rejected')
    }
  }

  const renderTransferField = () => {
    return (
      <Box
        className={classes.goldBox2}
        style={{ borderStyle: 'none solid solid ' }}
        sx={{ display: 'flex', flexDirection: 'column', p: 4 }}
      >
        <Typography className={classes.h3Grey} sx={{ textAlign: 'left !important' }}>
          Transfer To
        </Typography>
        <Box className={classes.goldBox1} sx={{ mt: 3 }}>
          <TextField
            fullWidth
            id="standard-basic"
            label=""
            sx={{
              width: '100%',
              input: { width: '100%', color: COLORS.SECONDARY_TEXT_GREY, px: 3, height: '46px' },
            }}
            InputProps={{ disableUnderline: true }}
            variant="standard"
            onChange={(e) => setTransferTarget(e.target.value)}
            value={transferTarget}
          />
        </Box>

        <Box sx={{ width: '100%', justifyContent: 'end', display: 'flex', mt: 3 }}>
          <Box marginRight={3} alignItems="center" display="flex" sx={{ cursor: 'pointer' }}>
            <Typography className={classes.h3} onClick={OpenCloseTransferPanel}>
              Cancel
            </Typography>
          </Box>
          <CustomOutlinedButton
            title={'Transfer'}
            styles={{ paddingY: '10px', paddingX: 6, margin: 0 }}
            onClick={() => {
              selectedItem && selectedItem.kind ? transferOnClick() : transferOnClickCosmic()
            }}
          />
        </Box>
      </Box>
    )
  }

  const listToken = async () => {
    try {
      if (!wallet || !crystalMarket) return

      const client = crystalMarket(wallet.getClient())
      await fetchWithToast(
        client.listToken(wallet.address, selectedItemId, price, selectedItem.kind, '', ''),
      )
      setRefresh(true)
    } catch (err) {
      showFailToast('Transaction Failed', 'Transaction Rejected')
    }
  }

  const updatePrice = async () => {
    try {
      if (!wallet || !crystalMarket) return

      const client = crystalMarket(wallet.getClient())

      await fetchWithToast(client.updatePrice(wallet.address, selectedItemId, price))

      setRefresh(true)
    } catch (err) {
      showFailToast('Transaction Failed', 'Transaction Rejected')
    }
  }
  // TODO: Get the correct tokenId and delete default value
  const pricePanelOnClick = async (isSell) => {
    if (isSell) listToken(isSell)
    else updatePrice(isSell)
  }

  const removeListingOnClick = async () => {
    try {
      if (!wallet || !crystalMarket) return

      const client = crystalMarket(wallet.getClient())
      await fetchWithToast(client.delistTokens(wallet.address, selectedItemId))
      setRefresh(true)
    } catch (err) {
      showFailToast('Transaction Failed', 'Transaction Rejected')
    }
  }

  const renderPriceContainer = (isSell, title) => {
    return (
      <Box
        className={classes.goldBox2}
        style={{ borderStyle: 'none solid solid ' }}
        sx={{ display: 'flex', flexDirection: 'column', p: 4 }}
      >
        <Typography className={classes.h3Grey} sx={{ textAlign: 'left !important' }}>
          Price
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} lg={8}>
            <Box className={classes.goldBox1}>
              <Typography
                className={classes.h3Grey}
                sx={{ textAlign: 'left !important', padding: '13px' }}
              >
                DRGN
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Box className={classes.goldBox1}>
              <TextField
                id="standard-basic"
                label=""
                type="tel"
                sx={{
                  width: '100%',
                  input: {
                    width: '100%',
                    color: COLORS.SECONDARY_TEXT_GREY,
                    px: 3,
                    height: '46px',
                  },
                }}
                onChange={(e) => setPrice(e.target.value)}
                value={price}
                InputProps={{ disableUnderline: true }}
                variant="standard"
              />
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end', mt: 3 }}>
          <Box
            marginRight={3}
            onClick={OpenClosePricePanel}
            alignItems="center"
            display="flex"
            sx={{ cursor: 'pointer' }}
          >
            <Typography className={classes.h3}>Cancel</Typography>
          </Box>
          <CustomOutlinedButton
            title={title}
            styles={{ paddingY: '10px', paddingX: 6, margin: 0 }}
            onClick={() => pricePanelOnClick(isSell)}
          />
        </Box>
      </Box>
    )
  }

  const renderItem = () => {
    return (
      <Grid item xs={12} lg={4} className={classes.goldBox4}>
        {selectedItem && selectedItem.kind === undefined ? (
          <CosmicBox styles={{ padding: 4 }} />
        ) : (
          <CrystalBox styles={{ padding: 4 }} img={boxImage} />
        )}
        {selectedItem && selectedItem.kind === undefined && <CosmicInfo item={selectedItem} />}
        {selectedItem && !selectedItem.is_staked && (
          <>
            {selectedItem && (
              <CustomOutlinedButton
                title={'Sell on Marketplace'}
                styles={{ width: '100%', background: COLORS.DARK_YELLOW_1, marginY: 2 }}
                img={SellIcon}
                onClick={OpenClosePricePanel}
              />
            )}
            {pricePanel && renderPriceContainer(true, 'Sell')}

            <CustomOutlinedButton
              title="Transfer"
              styles={{ width: '100%', marginRight: '10%' }}
              img={TransferIcon}
              onClick={OpenCloseTransferPanel}
            />
            {transferPanel && renderTransferField()}
          </>
        )}
      </Grid>
    )
  }

  const renderListedItem = () => {
    return (
      <Grid item xs={12} lg={4} className={classes.goldBox4}>
        {selectedItem && <CrystalBox styles={{ padding: 4 }} img={boxImage} />}
        <CustomOutlinedButton
          title={'Update Price'}
          styles={{ width: '100%', background: COLORS.DARK_YELLOW_1, marginY: 2 }}
          img={SellIcon}
          onClick={OpenClosePricePanel}
        />
        {pricePanel && renderPriceContainer(false, 'Update')}

        <CustomOutlinedButton
          title={'Remove Listing'}
          styles={{ width: '100%', background: COLORS.DARK_YELLOW_1 }}
          img={RemoveIcon}
          onClick={removeListingOnClick}
        />
      </Grid>
    )
  }

  if (error) {
    return display && <Empty />
  } else {
    return (
      <>
        <div
          style={{
            overflow: 'scroll',
            msOverflowStyle: '0px !important',
            scrollbarWidth: '0px !important',
            overflowX: 'hidden',
            height: '100%',
          }}
        >
          <Grid>
            <Grid
              sx={{
                width: '100%',
              }}
            >
              <Typography className={classes.h2}>Crystals</Typography>
              <Grid container direction={'row'} marginTop={5} height="auto" overflow="auto">
                <>
                  {ownedCrystalList &&
                    ownedCrystalList.map((item, idx) => {
                      return (
                        <Grid key={idx} m={1} item>
                          <Grid onClick={() => scrollToSelected(item, item.token_id, '0')}>
                            <CrystalCard
                              height={'410px'}
                              maxWidth={'275px'}
                              imgHeight={'180px'}
                              item={item}
                              price={'0'}
                            />
                          </Grid>
                        </Grid>
                      )
                    })}
                  {listedCrystals &&
                    listedCrystals.map((item, idx) => {
                      return (
                        <Grid key={idx} m={1} item>
                          <Grid onClick={() => scrollToSelected(item, item.id, item.price)}>
                            <CrystalCard
                              height={'410px'}
                              maxWidth={'275px'}
                              imgHeight={'180px'}
                              item={{ token_id: item.id, kind: item.rarity }}
                              price={item.price}
                            />
                          </Grid>
                        </Grid>
                      )
                    })}
                  {ownedCosmicList &&
                    ownedCosmicList.map((item, idx) => {
                      return (
                        <Grid key={idx} m={1} item>
                          <Grid onClick={() => scrollToSelected(item, item.token_id, '0')}>
                            <CosmicCard
                              height={'410px'}
                              maxWidth={'275px'}
                              imgHeight={'180px'}
                              item={item}
                              price={'0'}
                            />
                          </Grid>
                        </Grid>
                      )
                    })}
                </>
                <Grid m={1} item xs={12}>
                  <div
                    ref={loadMoreRef}
                    style={{
                      width: '100%',
                      height: '10vh',
                      color: COLORS.DARK_YELLOW_1,
                      fontSize: 24,
                      visibility: hasNext ? 'visible' : 'hidden',
                    }}
                  ></div>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>

        <Modal
          open={selected}
          onClose={() => setRefresh(true)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          className={classes.modalContainer}
        >
          <Box className={classes.modalStyle} sx={{ marginTop: pricePanel && '150px' }}>
            {selectedItemPrice === '0' ? renderItem() : renderListedItem()}
          </Box>
        </Modal>
      </>
    )
  }
}

export default CrystalInventory
