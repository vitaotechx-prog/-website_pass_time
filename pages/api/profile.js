import { supabase } from '@/lib/supabaseClient';

export default async function handler(req, res) {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return res.status(401).json({ error: 'Não autorizado' });
    }

    if (req.method === 'GET') {
        const { data, error } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('id', user.id)
            .single();

        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json(data);
    }

    if (req.method === 'PUT') {
        const { full_name } = req.body;
        const { error } = await supabase
            .from('profiles')
            .update({ full_name, updated_at: new Date() })
            .eq('id', user.id);

        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json({ message: 'Perfil atualizado com sucesso!' });
    }

    res.setHeader('Allow', ['GET', 'PUT']);
    res.status(405).end(`Método ${req.method} não permitido`);
}