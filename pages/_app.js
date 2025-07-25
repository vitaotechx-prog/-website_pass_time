import Layout from '../Layout';
import '@/styles/globals.css';
import { AuthProvider } from '../contexts/AuthContext';
import { Toaster } from "@/components/ui/toaster";

function MyApp({ Component, pageProps }) {
  return (
  <AuthProvider>
     <Layout>
        <Component {...pageProps} />
     </Layout>

     {/* O Toaster fica aqui para exibir as notificações */}
     <Toaster />
    </AuthProvider>
  );
}

export default MyApp;