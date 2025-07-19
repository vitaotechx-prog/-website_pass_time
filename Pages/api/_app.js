import '@/styles/globals.css' // O caminho pode ser diferente se você não tiver o alias @ configurado ainda. Use '../styles/globals.css' se for o caso.

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}