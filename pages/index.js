import Head from 'next/head';
import React from "react";
import styles from '../styles/Home.module.css';

const Home = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Music Social App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <button>Login with Spotify</button>
    </div>
  )
}

export default Home;
