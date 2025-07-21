import './home.module.css'
import styles from './home.module.css'
import {BsSearch} from 'react-icons/bs'
import {Link, useNavigate} from 'react-router-dom'
import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'

export interface CoinProps{
  id: string,
  name: string, 
  symbol: string, 
  priceUsd: string,
  changePercent24Hr: string,
  vwap24Hr: string,
  rank: string,
  supply: string,
  maxSupply: string,
  marketCapUsd: string,
  volumeUsd24Hr: string,
  explorer: string, 
  formatedPrice?: string,
  formatedMarket?: string,
  formatedVolume?: string,
  formatedchangePercent24Hr?: string
}

interface DataProp{
  data: CoinProps[]
}

export function Home() {
  const navigate = useNavigate()
  const [input, setInput] = useState("")
  const [coins, setCoins] = useState<CoinProps[]>([])
  const [offset, setOffset] = useState(0)

  useEffect(()=>{
    getData()
  }, [offset])

  async function getData(){
    fetch(`https://rest.coincap.io/v3/assets?limit=10&offset=${offset}&apiKey=fb0635970d325fc13d161f23a70e4b8d703fa1c8ee82b6aa2e7bb19eb7edd710`)

    .then(response => response.json())
    .then((data: DataProp)=>{
      const coinsData = data.data

      const price = Intl.NumberFormat("en-US", {
        style: 'currency',
        currency: "USD" 
      })

      const priceCompact = Intl.NumberFormat("en-US", {
        style: 'currency',
        currency: "USD",
        notation: "compact",
      })

      const formataResult = coinsData.map((item) => {
        const formated = {
          ...item, formatedPrice: price.format(Number(item.priceUsd)), formatedMarket: priceCompact.format(Number(item.marketCapUsd)), 
          formatedVolume: priceCompact.format(Number(item.volumeUsd24Hr)), 
          formatedchangePercent24Hr: Number(item.changePercent24Hr).toFixed(3)
        } 

        return formated
      })
      
      const listedCoins = [...coins, ...formataResult]
      setCoins(listedCoins)
    })
  }

  function handleSubmit(e: FormEvent){
    e.preventDefault()

    if (input===""){
      return
    }

    navigate(`/detail/${input}`)
  }

  function handleGetMore(){
    if (offset === 0){
      setOffset(10)
      return
    }
    setOffset(offset + 10)
  }
 
  return (
    <main className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input type="text" 
        placeholder='Digite o nome da moeda... EX bitcoin' 
        value={input}
        onChange={e => setInput(e.target.value)} />

        <button type='submit'>
          <BsSearch size={30} color='white'/>
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th scope='col'>Moeda</th>
            <th scope='col'>Valor Mercado</th>
            <th scope='col'>Preço</th>
            <th scope='col'>Volume</th>
            <th scope='col'>Mudança 24h</th>
          </tr>
        </thead>

        <tbody id='tbody'>
          {coins.length > 0 && coins.map((coin) => (
            <tr className={styles.tr} key={coin.id}>
            <td className={styles.tdLabel} data-label="Moeda">
              <div className={styles.name}>
                <img src={`https://assets.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png`} alt="logo Cripto" width={25} className={styles.coinLogo}/>
                <Link to={`/detail/${coin.id}`}>
                  <span>
                    {coin.name} ({coin.symbol.toUpperCase()})
                  </span>
                </Link> 
              </div>
            </td>

            <td className={styles.tdLabel} data-label="Valor Mercado">
              {coin.formatedMarket}
            </td>

            <td className={styles.tdLabel} data-label="Preço">
              {coin.formatedPrice}
            </td>

            <td className={styles.tdLabel} data-label="Volume">
              {coin.formatedVolume}
            </td>
            
            <td className={Number(coin.changePercent24Hr) > 0 ? styles.tdProfit : styles.tdLoss} data-label="Mudança 24h">
              <span>${coin.formatedchangePercent24Hr}</span>
            </td>
          </tr>
            ))}
        </tbody>
      </table>

      <button className={styles.button_more} onClick={handleGetMore}>
        more...
      </button>
    </main>
  );
}