// pages/Login.js
import Layout from '../Layout'; // Importe o Layout no topo
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Label } from "@/components/ui/label";
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  // NOVO: Estado para controlar a visualização (login ou cadastro)
  const [isLoginView, setIsLoginView] = useState(true);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // NOVO: Campo de confirmação
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (isLoginView) {
      // --- Lógica de Login ---
      const { error } = await signIn({ email, password });
      if (error) setError(error.message);
      else router.push('/');
    } else {
      // --- Lógica de Cadastro ---
      if (password !== confirmPassword) {
        setError('As senhas não correspondem.');
        setLoading(false);
        return;
      }
      const { error } = await signUp({ email, password });
      if (error) {
        setError(error.message);
      } else {
        // CORREÇÃO: Define a mensagem de sucesso, não de erro
        setMessage('Cadastro realizado! Verifique seu e-mail para confirmação.');
        setIsLoginView(true); // Volta para a tela de login após o sucesso
      }
    }
    setLoading(false);
  };
  
  const handleGoogleLogin = async () => {
    setError('');
    const { error } = await signInWithGoogle();
    if (error) setError(error.message);
  };

  return (
    <div className="container mx-auto flex items-center justify-center py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          {/* Título dinâmico */}
          <h1 className="text-3xl font-bold">{isLoginView ? 'Acesse sua Conta' : 'Crie sua Conta'}</h1>
          <p className="text-gray-500">
            {isLoginView ? 'Entre para comentar e criar alertas.' : 'Preencha os campos para se cadastrar.'}
          </p>
        </div>
        
        {/* Exibição de Erros e Mensagens de Sucesso */}
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Ocorreu um erro</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {message && (
          <Alert variant="default" className="border-green-500 text-green-700">
            <AlertTitle>Sucesso!</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          {/* NOVO: Campo de confirmação de senha (só aparece na tela de cadastro) */}
          {!isLoginView && (
            <div>
              <Label htmlFor="confirmPassword">Confirme a Senha</Label>
              <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            <LogIn className="mr-2 h-4 w-4"/> {loading ? 'Aguarde...' : (isLoginView ? 'Entrar' : 'Cadastrar')}
          </Button>
        </form>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Ou</span>
          </div>
        </div>

        <Button onClick={handleGoogleLogin} variant="outline" className="w-full">
          Entrar com Google
        </Button>
        
        {/* Link para alternar entre as telas */}
        <p className="text-center text-sm text-gray-500">
          {isLoginView ? 'Não tem uma conta?' : 'Já tem uma conta?'}
          <Button variant="link" onClick={() => { setIsLoginView(!isLoginView); setError(''); setMessage(''); }}>
            {isLoginView ? 'Cadastre-se' : 'Faça Login'}
          </Button>
        </p>
      </div>
    </div>
  );
}
LogIn.getLayout = function getLayout(page) {
  return (
    <Layout>{page}</Layout>
  )
}