import React, { useEffect, useState } from 'react'
import { Box, Grid, Typography, Checkbox } from '@mui/material'

import { DragonCard, EggCard } from 'components/InventoryMarketCards'
import useStyles from 'styles'

import { useWallet } from 'contexts/wallet'
import contract from 'contracts/marketplace/contract'
import crystalMarket from 'contracts/crystal-marketplace'

import FilterImg from 'assets/market/filter.svg'
import ArrowRight from 'assets/market/arrow-right.svg'
import ArrowDown from 'assets/market/arrow-down.svg'
import * as COLORS from 'util/ColorUtils'
import { SORT_OPTIONS, DRAGON_TYPE_NAMES, CRYSTAL_TYPE_NAME } from 'util/constants'
import { getImageUrl } from 'util/ImageUrl'
import { toggleQueryParamField, useQueryParams } from 'hooks/useQueryParams'
import { useHistory } from 'react-router'
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { useRef } from 'react'
import useOnScreen from '../../hooks/useOnScreen'
import { CrystalCard } from '../../components/InventoryMarketCards'

const PAGE_LIMIT = 30

const ALL_DRAGON_TYPES = DRAGON_TYPE_NAMES.map((dragon) => dragon.name)
const ALL_CRYSTAL_TYPES = CRYSTAL_TYPE_NAME.map((item) => item.name)

const Market = () => {
  const classes = useStyles()
  const wallet = useWallet()
  const history = useHistory()

  const [sort, setSort] = useState(0)
  const [sortOpen, setSortOpen] = useState(false)
  const [sortChange, setSortChange] = useState(false)
  const [filterOpen, setFilterOpen] = useState(true)

  const [eggFilter, setEggFilter] = useState(undefined)
  const [selectedDragonType, setSelectedDragonType] = useState([])
  const [dragonFilterOpen, setDragonFilterOpen] = useState(false)

  const [selectedCrystalType, setSelectedCrystalType] = useState([])
  const [crystalFilterOpen, setCrystalFilterOpen] = useState(false)

  // eslint-disable-next-line
  const [eggList, setEggList] = useState([])
  // eslint-disable-next-line
  const [dragonList, setDragonList] = useState([])
  // eslint-disable-next-line
  const [crystalList, setCrystalList] = useState([])
  const [marketList, setMarketList] = useState([])

  const [isFetching, setIsFetching] = useState(false)
  const [hasNext, setHasNext] = useState(false)
  const loadMoreRef = useRef(null)
  const loadMoreVisible = useOnScreen(loadMoreRef)

  const query = useQueryParams('/market')

  const loadMore = async () => {
    if (marketList[marketList.length - 1]) {
      let startAfter =
        sort === 0 ? marketList[marketList.length - 1].id : marketList[marketList.length - 1].price
      try {
        if (!contract || !startAfter) return

        let client
        let crystal_client
        if (wallet.initialized) {
          client = contract(wallet.getClient(), eggFilter)
          crystal_client = crystalMarket(wallet.getClient())
        } else {
          let offline = await CosmWasmClient.connect('https://rpc-juno.mib.tech/')
          client = contract(offline, eggFilter)
          crystal_client = crystalMarket(offline)
        }

        let marketSize
        if (crystalFilterOpen) {
          marketSize = await crystal_client.getMarketSize()
        } else {
          marketSize = await client.getMarketSize()
        }

        if (marketList.length >= marketSize) return

        setIsFetching(true)
        var res
        var newPage = []
        if (crystalFilterOpen) {
          if (selectedCrystalType.length > 0) {
            if (sort === 0) {
              res = await crystal_client.getTokensByRarity(
                PAGE_LIMIT,
                startAfter,
                selectedCrystalType,
              )
            } else if (sort === 1) {
              res = await crystal_client.getTokensByRarityPriceDesc(
                PAGE_LIMIT,
                startAfter,
                selectedCrystalType,
              )
            } else {
              res = await crystal_client.getTokensByRarityPriceAsc(
                PAGE_LIMIT,
                startAfter,
                selectedCrystalType,
              )
            }
          } else {
            if (sort === 0) {
              res = await crystal_client.getListedTokens(PAGE_LIMIT, startAfter)
            } else if (sort === 1) {
              res = await crystal_client.getTokensByPriceDesc(PAGE_LIMIT, startAfter)
            } else {
              res = await crystal_client.getTokensByPriceAsc(PAGE_LIMIT, startAfter)
            }
          }
        } else {
          if (!eggFilter && selectedDragonType.length > 0) {
            if (sort === 0) {
              res = await client.getTokensByRarity(PAGE_LIMIT, startAfter, selectedDragonType)
            } else if (sort === 1) {
              res = await client.getTokensByRarityPriceDesc(
                PAGE_LIMIT,
                startAfter,
                selectedDragonType,
              )
            } else {
              res = await client.getTokensByRarityPriceAsc(
                PAGE_LIMIT,
                startAfter,
                selectedDragonType,
              )
            }
          } else {
            if (sort === 0) {
              res = await client.getListedTokens(PAGE_LIMIT, startAfter)
            } else if (sort === 1) {
              res = await client.getTokensByPriceDesc(PAGE_LIMIT, startAfter)
            } else {
              res = await client.getTokensByPriceAsc(PAGE_LIMIT, startAfter)
            }
          }
        }
        if (res && res.tokens.length !== 0) {
          for (let i = 0; i < res.tokens.length; i++) {
            if (res.tokens[i]) {
              let newItem
              if (crystalFilterOpen) {
                newItem = {
                  type: 3,
                  id: res.tokens[i].id,
                  image: '',
                  owner: res.tokens[i].owner,
                  kind: res.tokens[i].rarity,
                  price: res.tokens[i].price,
                }
              } else {
                newItem = {
                  type: eggFilter ? 1 : 2,
                  id: res.tokens[i].id,
                  image: eggFilter ? getImageUrl(res.tokens[i].id) : '',
                  owner: res.tokens[i].owner,
                  kind: eggFilter ? '' : res.tokens[i].rarity,
                  price: res.tokens[i].price,
                }
              }

              newPage.push(newItem)
            }
          }
          let all_items = marketList.concat(newPage)

          all_items = all_items.filter(
            (value, index, self) => index === self.findIndex((t) => t.id === value.id),
          )

          setIsFetching(false)
          setHasNext(res.tokens.length >= PAGE_LIMIT)
          eggFilter ? await setEggList(all_items) : await setDragonList(all_items)
          await setMarketList(all_items)
        }
      } catch (e) {}
    }
  }

  const loadMarket = async () => {
    try {
      if (!contract || !crystalMarket) return
      let client
      let crsytal_client
      if (wallet.initialized) {
        client = contract(wallet.getClient(), eggFilter)
        crsytal_client = crystalMarket(wallet.getClient())
      } else {
        let offline = await CosmWasmClient.connect('https://rpc-juno.mib.tech/')
        client = contract(offline, eggFilter)
        crsytal_client = crystalMarket(wallet.getClient())
      }

      let market = []
      var res

      if (sortChange) {
        setMarketList([])
        setCrystalList([])
        setDragonList([])
        setEggList([])
      }

      setIsFetching(true)
      if (crystalFilterOpen) {
        if (sort === 0) {
          res = await crsytal_client.getTokensByRarity(
            PAGE_LIMIT,
            null,
            selectedCrystalType.length > 0 ? selectedCrystalType : ALL_CRYSTAL_TYPES,
          )
        } else if (sort === 1) {
          res = await crsytal_client.getTokensByRarityPriceDesc(
            PAGE_LIMIT,
            null,
            selectedCrystalType.length > 0 ? selectedCrystalType : ALL_CRYSTAL_TYPES,
          )
        } else {
          res = await crsytal_client.getTokensByRarityPriceAsc(
            PAGE_LIMIT,
            null,
            selectedCrystalType.length > 0 ? selectedCrystalType : ALL_CRYSTAL_TYPES,
          )
        }
      } else {
        if (!eggFilter) {
          //QUERY BASED ON DRAGON TYPE FILTER
          if (sort === 0) {
            res = await client.getTokensByRarity(
              PAGE_LIMIT,
              null,
              selectedDragonType.length > 0 ? selectedDragonType : ALL_DRAGON_TYPES,
            )
          } else if (sort === 1) {
            res = await client.getTokensByRarityPriceDesc(
              PAGE_LIMIT,
              null,
              selectedDragonType.length > 0 ? selectedDragonType : ALL_DRAGON_TYPES,
            )
          } else {
            res = await client.getTokensByRarityPriceAsc(
              PAGE_LIMIT,
              null,
              selectedDragonType.length > 0 ? selectedDragonType : ALL_DRAGON_TYPES,
            )
          }
        } else {
          //DEFAULT QUERY FOR EGG AND DRAGON
          if (sort === 0) {
            res = await client.getListedTokens(PAGE_LIMIT, null)
          } else if (sort === 1) {
            res = await client.getTokensByPriceDesc(PAGE_LIMIT, '0')
          } else {
            res = await client.getTokensByPriceAsc(PAGE_LIMIT, '0')
          }
        }
      }

      if (res && res.tokens.length !== 0) {
        for (let i = 0; i < res.tokens.length; i++) {
          if (res.tokens[i]) {
            let newItem
            if (crystalFilterOpen) {
              newItem = {
                type: 3,
                id: res.tokens[i].id,
                image: '',
                owner: res.tokens[i].owner,
                kind: res.tokens[i].rarity,
                price: res.tokens[i].price,
              }
            } else {
              newItem = {
                type: eggFilter ? 1 : 2,
                id: res.tokens[i].id,
                image: eggFilter ? getImageUrl(res.tokens[i].id) : '',
                owner: res.tokens[i].owner,
                kind: eggFilter ? '' : res.tokens[i].rarity,
                price: res.tokens[i].price,
              }
            }
            market.push(newItem)
          }
        }
        setIsFetching(false)
        setHasNext(res.tokens.length >= PAGE_LIMIT)
        crystalFilterOpen
          ? await setCrystalList(market)
          : eggFilter
          ? await setEggList(market)
          : await setDragonList(market)
        await setMarketList(market)
      }

      await setSortChange(false)
    } catch (err) {
      setIsFetching(false)
    }
  }

  useEffect(() => {
    loadMarket()
    // eslint-disable-next-line
  }, [wallet, sort, crystalFilterOpen, sortChange])

  const eggFilterChange = async () => {
    setEggFilter(true)
    setDragonFilterOpen(false)
    setCrystalFilterOpen(false)

    setSortOpen(false)
    setSort(0)

    try {
      if (contract) {
        let client
        if (wallet.initialized) {
          client = contract(wallet.getClient(), true)
        } else {
          let offline = await CosmWasmClient.connect('https://rpc-juno.mib.tech/')
          client = contract(offline, true)
        }
        setIsFetching(true)
        let egg_res = await client.getListedTokens(PAGE_LIMIT, null)
        let eggs = []
        egg_res.tokens.forEach((item) =>
          eggs.push({
            id: item.id,
            price: item.price,
            type: 1,
            kind: '',
            image: getImageUrl(item.id),
            owner: item.owner,
          }),
        )

        setMarketList(eggs)
        setIsFetching(false)
        setHasNext(egg_res.tokens.length >= PAGE_LIMIT)
      }
    } catch (err) {
      setIsFetching(false)
    }
  }

  const dragonFilterChange = async (dragonTypes) => {
    setCrystalFilterOpen(false)
    setEggFilter(false)

    setSortOpen(false)
    setSort(0)
    setSelectedDragonType(dragonTypes)

    try {
      if (contract) {
        let client
        if (wallet.initialized) {
          client = contract(wallet.getClient(), false)
        } else {
          let offline = await CosmWasmClient.connect('https://rpc-juno.mib.tech/')
          client = contract(offline, false)
        }
        setIsFetching(true)
        let filteredDragons = await client.getTokensByRarity(
          PAGE_LIMIT,
          null,
          dragonTypes.length > 0 ? dragonTypes : DRAGON_TYPE_NAMES.map((dragon) => dragon.name),
        )
        let dragons = []
        filteredDragons.tokens.forEach((item) =>
          dragons.push({
            id: item.id,
            price: item.price,
            type: 2,
            kind: item.rarity,
            owner: item.owner,
          }),
        )

        setMarketList(dragons)
        setIsFetching(false)
        setHasNext(filteredDragons.tokens.length >= PAGE_LIMIT)
      }
    } catch (err) {
      setIsFetching(false)
    }
  }

  const crystalFilterChange = async (types) => {
    setDragonFilterOpen(false)
    setEggFilter(false)

    setSortOpen(false)
    setSort(0)
    setSelectedCrystalType(types)

    try {
      if (crystalMarket) {
        let client
        if (wallet.initialized) {
          client = crystalMarket(wallet.getClient())
        } else {
          let offline = await CosmWasmClient.connect('https://rpc-juno.mib.tech/')
          client = crystalMarket(offline)
        }
        setIsFetching(true)
        let filtered = await client.getTokensByRarity(
          PAGE_LIMIT,
          null,
          types.length > 0 ? types : CRYSTAL_TYPE_NAME.map((item) => item.name),
        )
        let crystals = []
        filtered.tokens.forEach((item) =>
          crystals.push({
            id: item.id,
            price: item.price,
            type: 3,
            kind: item.rarity,
            owner: item.owner,
          }),
        )

        setMarketList(crystals)
        setIsFetching(false)
        setHasNext(filtered.tokens.length >= PAGE_LIMIT)
      }
    } catch (err) {
      setIsFetching(false)
    }
  }

  const changeEggFilter = () => {
    setEggFilter(true)
    history.push({
      pathname: '/market',
      search: `?listType=egg`,
    })
  }

  const crystalFilterClicked = () => {
    setCrystalFilterOpen(!crystalFilterOpen)
    history.push({
      pathname: '/market',
      search: `?listType=crystal&${selectedCrystalType.map((kind) => `kind=${kind}`).join('&')}`,
    })
  }

  const dragonFilterClicked = () => {
    setDragonFilterOpen(!dragonFilterOpen)
    history.push({
      pathname: '/market',
      search: `?listType=dragon&${selectedDragonType.map((kind) => `kind=${kind}`).join('&')}`,
    })
  }
  const changeCrystalFilter = (value) => {
    const newQueryFieldParam = toggleQueryParamField('kind', value)
    history.push({
      pathname: '/market',
      search: `?listType=crystal&${newQueryFieldParam}`,
    })
  }

  const changeDragonFilter = (value) => {
    const newQueryFieldParam = toggleQueryParamField('kind', value)
    history.push({
      pathname: '/market',
      search: `?listType=dragon&${newQueryFieldParam}`,
    })
  }

  useEffect(() => {
    if (query.get('listType') === 'dragon') {
      dragonFilterChange(query.getAll('kind'))
    } else if (query.get('listType') === 'crystal') {
      crystalFilterChange(query.getAll('kind'))
    } else {
      eggFilterChange()
    }
    //   eslint-disable-next-line
  }, [query])

  useEffect(() => {
    if (!isFetching && loadMoreVisible && hasNext) {
      loadMore()
    }
    // eslint-disable-next-line
  }, [isFetching, loadMoreVisible, hasNext])

  return (
    <Grid container spacing={6} height="auto">
      <Grid item xs={12} md={8.5} sx={{ display: 'flex !important', marginBottom: 4 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
          {marketList &&
            marketList !== [] &&
            marketList.map((item, idx) => {
              return item.type === 3 ? (
                <CrystalCard key={idx} item={item} market={true} />
              ) : item.type === 1 ? (
                <Grid style={{ zIndex: 1 }}>
                  <EggCard key={idx} item={item} />
                </Grid>
              ) : (
                <DragonCard key={idx} item={item} market={true} />
              )
            })}
          <div
            ref={loadMoreRef}
            style={{
              width: '100%',
              height: '20px',
              visibility: hasNext ? 'visible' : 'hidden',
            }}
          ></div>
        </Box>
      </Grid>

      {/* FILTER - SORT PANEL  */}
      <Grid
        item
        md={3}
        sx={{
          display: { xs: 'none', md: 'block' },
        }}
      >
        {filterOpen ? (
          <Box
            sx={{
              borderRadius: '4px',
              border: `2px solid ${COLORS.DARK_YELLOW_1}`,
              background: 'linear-gradient(180deg, rgba(52, 52, 52, 0) -13.06%, #343434 100%)',
              padding: 2,
              cursor: 'pointer',
              position: 'fixed',
              bottom: '5rem',
              right: '5rem',
              maxWidth: '350px',
              width: '20vw',
            }}
          >
            <Box
              display="flex"
              onClick={() => {
                setFilterOpen(!filterOpen)
              }}
            >
              <img src={FilterImg} alt="filter icon" style={{ marginRight: 10 }} />
              <Typography className={classes.h2}>Filter</Typography>{' '}
            </Box>

            <Box marginTop={1} sx={{ borderTop: `1px solid ${COLORS.SMOOTH_YELLOW_30}` }}>
              <Box
                marginY={3}
                sx={{
                  cursor: 'pointer',
                  border: eggFilter ? `2px solid ${COLORS.DARK_YELLOW_1}` : 'none',
                  maxWidth: '70px',
                  display: 'flex',
                }}
              >
                <Typography
                  sx={{ color: COLORS.WHITE, padding: eggFilter ? 1 : 0 }}
                  onClick={changeEggFilter}
                >
                  Egg
                </Typography>
              </Box>
            </Box>

            <Box marginTop={1}>
              <Box
                onClick={dragonFilterClicked}
                marginY={2}
                sx={{
                  cursor: 'pointer',
                  border: dragonFilterOpen ? `2px solid ${COLORS.DARK_YELLOW_1}` : 'none',
                  maxWidth: '120px',
                  display: 'flex',
                }}
              >
                <Typography
                  sx={{ color: COLORS.WHITE, padding: dragonFilterOpen ? 1 : 0, marginRight: 2 }}
                >
                  Dragon
                </Typography>
                {dragonFilterOpen ? (
                  <img src={ArrowDown} alt="arrow" />
                ) : (
                  <img src={ArrowRight} alt="arrow" />
                )}{' '}
              </Box>

              {dragonFilterOpen &&
                DRAGON_TYPE_NAMES.map((item, idx) => {
                  return (
                    <Box key={idx}>
                      <Box
                        sx={{ display: 'flex', cursor: 'pointer' }}
                        onClick={() => changeDragonFilter(item.name)}
                      >
                        <Checkbox
                          style={{ color: COLORS.DARK_YELLOW_1 }}
                          checked={selectedDragonType.includes(item.name)}
                        />
                        <Typography
                          sx={{ color: COLORS.WHITE, padding: 2, textTransform: 'capitalize' }}
                        >
                          {item.name}
                        </Typography>
                      </Box>
                    </Box>
                  )
                })}
              <Box
                onClick={crystalFilterClicked}
                marginY={2}
                sx={{
                  cursor: 'pointer',
                  border: crystalFilterOpen ? `2px solid ${COLORS.DARK_YELLOW_1}` : 'none',
                  maxWidth: '120px',
                  display: 'flex',
                }}
              >
                <Typography
                  sx={{ color: COLORS.WHITE, padding: crystalFilterOpen ? 1 : 0, marginRight: 2 }}
                >
                  Crystal
                </Typography>
                {crystalFilterOpen ? (
                  <img src={ArrowDown} alt="arrow" />
                ) : (
                  <img src={ArrowRight} alt="arrow" />
                )}{' '}
              </Box>
              {crystalFilterOpen &&
                CRYSTAL_TYPE_NAME.map((item, idx) => {
                  return (
                    <Box key={idx}>
                      <Box
                        sx={{ display: 'flex', cursor: 'pointer' }}
                        onClick={() => changeCrystalFilter(item.name)}
                      >
                        <Checkbox
                          style={{ color: COLORS.DARK_YELLOW_1 }}
                          checked={selectedCrystalType.includes(item.name)}
                        />
                        <Typography
                          sx={{ color: COLORS.WHITE, padding: 2, textTransform: 'capitalize' }}
                        >
                          {item.name === 'udin' ? 'idunn' : item.name}
                        </Typography>
                      </Box>
                    </Box>
                  )
                })}
            </Box>
            <Box
              sx={{ background: COLORS.GREY_30 }}
              onClick={() => {
                setSort(0)
                setSortOpen(!sortOpen)
              }}
            >
              <Typography sx={{ color: COLORS.WHITE, padding: 2 }}>
                {sort !== 0 ? 'Sort by: ' + SORT_OPTIONS[sort - 1].text : 'Sort'}
              </Typography>
            </Box>
            {sortOpen && (
              <Box
                sx={{
                  borderTop: `1px solid ${COLORS.SMOOTH_YELLOW_30}`,
                  background: COLORS.GREY_30,
                }}
              >
                {SORT_OPTIONS.map((item, idx) => {
                  return (
                    <Box
                      key={idx}
                      onClick={() => {
                        setSortChange(true)
                        setSort(item.id)
                      }}
                    >
                      <Typography
                        key={idx}
                        sx={{
                          color: item.id === sort ? COLORS.WHITE : COLORS.SECONDARY_TEXT_GREY,
                          padding: 2,
                        }}
                      >
                        {item.text}
                      </Typography>
                    </Box>
                  )
                })}
              </Box>
            )}
          </Box>
        ) : (
          <Box
            sx={{
              borderRadius: '4px',
              background: COLORS.GREY_30,
              maxWidth: '60px',
              maxHeight: '60px',
              cursor: 'pointer',
              position: 'fixed',
              bottom: '5rem',
              right: '5rem',
            }}
            p={2}
            onClick={() => {
              setFilterOpen(!filterOpen)
            }}
          >
            <img src={FilterImg} alt="filter-icon" />
          </Box>
        )}
      </Grid>
    </Grid>
  )
}

export default Market
