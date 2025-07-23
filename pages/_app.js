// pages/_app.js
import Layout from '../Layout';
import '@/styles/globals.css';
import { AuthProvider } from '../components/AuthContext'; // Importe o AuthProvider

function App({ Component, pageProps }) {
  return (
    <AuthProvider> {/* Envolva tudo com o AuthProvider */}
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  );
}

export default App;