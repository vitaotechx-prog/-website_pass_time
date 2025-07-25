import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

export default function ProfilePage() {
    const { user } = useAuth();
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
        fetch('/api/profile')
            .then(res => res.json())
            .then(data => {
                if (data) setFullName(data.full_name || '');
                setLoading(false);
            });
    }, [user, router]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        const response = await fetch('/api/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ full_name: fullName }),
        });

        const data = await response.json();
        setMessage(data.message || data.error);
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