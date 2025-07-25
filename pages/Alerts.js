import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient'; // Acesso direto para simplificar
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BellRing, Trash2, Loader2, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

// Componente para exibir um único alerta na lista
function AlertItem({ alert, onDelete }) {
    return (
        <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm">
            <div>
                <p className="font-semibold text-gray-800">{alert.search_term}</p>
                <p className="text-sm text-gray-500">Notificação por: {alert.notification_method}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => onDelete(alert.id)}>
                <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
        </motion.div>
    );
}

export default function AlertsPage() {
    const { user, signOut } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Busca os alertas existentes do usuário
    useEffect(() => {
        const fetchAlerts = async () => {
            if (!user) {
                setLoading(false);
                return;
            }
            const { data, error: fetchError } = await supabase
                .from('product_alerts')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            // Lógica de erro aprimorada
            if (fetchError) {
                console.error("Erro ao buscar alertas:", fetchError);
                setError('Não foi possível carregar seus alertas.');
                // Se o erro for relacionado à segurança (ex: JWT inválido), deslogamos
                if (fetchError.code === 'PGRST301') {
                    signOut();
                }
            } else {
                setAlerts(data);
            }
            setLoading(false);
        };
        fetchAlerts();
    }, [user,signOut]);

    // Função para criar um novo alerta
    const handleCreateAlert = async (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;

        const { data, error } = await supabase
            .from('product_alerts')
            .insert({ search_term: searchTerm, user_id: user.id, notification_method: 'email' })
            .select();

        if (error) {
            setError('Erro ao criar o alerta.');
        } else {
            setAlerts([data[0], ...alerts]);
            setSearchTerm('');
        }
    };

    // Função para deletar um alerta
    const handleDeleteAlert = async (alertId) => {
        const { error } = await supabase
            .from('product_alerts')
            .delete()
            .eq('id', alertId);

        if (error) {
            setError('Erro ao deletar o alerta.');
        } else {
            setAlerts(alerts.filter(alert => alert.id !== alertId));
        }
    };

    if (!user) {
        return (
            <div className="text-center py-20">
                <BellRing className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold">Crie Alertas de Produtos</h2>
                <p className="text-gray-600 mb-6">Faça login para ser notificado sobre as melhores ofertas.</p>
                <Link href="/Login"><Button>Entrar ou Cadastrar-se</Button></Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-3xl py-12">
            <h1 className="text-3xl font-bold mb-2">Meus Alertas de Produtos</h1>
            <p className="text-gray-600 mb-8">Seja o primeiro a saber quando um produto que você deseja entrar em promoção.</p>

            {/* Formulário para criar novo alerta */}
            <form onSubmit={handleCreateAlert} className="flex gap-2 mb-8">
                <Input
                    type="text"
                    placeholder="Ex: Monitor 4K, Air Fryer, RTX 4090..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-grow"
                />
                <Button type="submit">
                    <BellRing className="w-4 h-4 mr-2" />
                    Criar Alerta
                </Button>
            </form>

            {error && <Alert variant="destructive" className="mb-4"><AlertDescription>{error}</AlertDescription></Alert>}

            {/* Lista de alertas existentes */}
            <h2 className="text-xl font-semibold mb-4">Seus Alertas Ativos</h2>
            {loading ? (
                <div className="text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto" /></div>
            ) : alerts.length > 0 ? (
                <div className="space-y-4">
                    {alerts.map(alert => (
                        <AlertItem key={alert.id} alert={alert} onDelete={handleDeleteAlert} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 border-2 border-dashed rounded-lg">
                    <Tag className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">Você ainda não tem nenhum alerta criado.</p>
                </div>
            )}
        </div>
    );
}