import Layout from '../Layout'; // Importe o Layout no topo
import { useState, useEffect } from 'react';
import { useAuth ,fetchProfile  } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient'; // Importe o cliente Supabase
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

export default function ProfilePage() {
    const { user, fetchProfile } = useAuth();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [fullName, setFullName] = useState('');
    const [message, setMessage] = useState('');

    // Efeito para proteger a rota e buscar dados
    useEffect(() => {
        if (!user) {
            router.push('/Login'); // Redireciona se não estiver logado
            return;
        }

       setLoading(true);
        // Busca os dados do perfil diretamente do Supabase,
        // o cliente já está autenticado.
        supabase
            .from('profiles')
            .select('full_name')
            .eq('id', user.id)
            .single()
            .then(({ data, error }) => {
                if (error) {
                    console.warn('Erro ao buscar perfil:', error);
                } else if (data) {
                    setFullName(data.full_name || '');
                }
                setLoading(false);
            });
    }, [user, router]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setMessage('');

        const { error } = await supabase
            .from('profiles')
            .update({ full_name: fullName, updated_at: new Date() })
            .eq('id', user.id);

        if (error) {
            setMessage(`Erro ao atualizar: ${error.message}`);
            // Se o erro indicar uma violação de chave estrangeira (usuário não existe)
            if (error.code === '23503') { 
                setMessage('Seu usuário não foi encontrado. Deslogando...');
                setTimeout(() => signOut(), 2000); // Força o logout
            }
        } else {
            setMessage('Perfil atualizado com sucesso!');
            await fetchProfile(user); // <<--- CHAME A FUNÇÃO AQUI
        }
    };

    if (!user || loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-2xl py-12">
            <h1 className="text-3xl font-bold mb-6">Meu Perfil</h1>
            {message && <Alert className="mb-4"><AlertDescription>{message}</AlertDescription></Alert>}

            <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={user.email} disabled className="bg-gray-100" />
                </div>
                <div>
                    <Label htmlFor="fullName">Nome Social</Label>
                    <Input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </div>
                <Button type="submit">Salvar Alterações</Button>
            </form>
        </div>
    );
}
ProfilePage.getLayout = function getLayout(page) {
  return (
    <Layout>{page}</Layout>
  )
}