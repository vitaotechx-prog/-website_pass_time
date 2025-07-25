// Requisição GET que busca e retorna
// todos os alertas do utilizador atualmente logado.

import { supabase } from '@/lib/supabaseClient';

export default async function handler(req, res) {
  // 1. Verificar se o método da requisição é GET
  // Esta rota servirá apenas para buscar dados.
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Método ${req.method} não permitido` });
  }

  try {
    // 2. Tentar obter a sessão do usuário a partir dos cookies da requisição
    // O Supabase usa um helper que extrai o token JWT seguro dos cookies.
    const { data: { user }, error: userError } = await supabase.auth.getUser(req.cookies.get('supabase-auth-token'));

    // 3. Verificar se o usuário está autenticado
    if (userError || !user) {
      // Se não houver usuário, retorna um erro de "Não Autorizado"
      return res.status(401).json({ error: 'Acesso não autorizado. Por favor, faça login.' });
    }

    // 4. Buscar os alertas no banco de dados
    // A consulta busca na tabela 'product_alerts' apenas as linhas
    // onde a coluna 'user_id' é igual ao ID do usuário autenticado.
    const { data: alerts, error: alertsError } = await supabase
      .from('product_alerts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    // 5. Verificar se houve erro na busca ao banco de dados
    if (alertsError) {
      console.error('Erro ao buscar alertas no Supabase:', alertsError);
      throw alertsError; // Lança o erro para ser pego pelo bloco catch
    }

    // 6. Retornar os alertas encontrados com sucesso
    return res.status(200).json(alerts);

  } catch (error) {
    // Bloco de captura para qualquer outro erro inesperado
    return res.status(500).json({ error: 'Erro interno do servidor.', details: error.message });
  }
}