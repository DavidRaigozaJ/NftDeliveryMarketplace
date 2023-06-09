import Head from 'next/head';
import type { NextPage } from 'next';
import {useAccount} from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import MarketPlace from './marketplace'

const Home: NextPage = () => {

const { address } = useAccount()

  return (
    <div>
      <Head>
        <title>Marketplace</title>
        <meta name="description" content="Created with 🏗 scaffold-eth-2" />
      </Head>
      <Address address={address}/>
      <MarketPlace/>
    </div>
  )
}

export default Home
