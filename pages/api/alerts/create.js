import { supabase } from '@/lib/supabaseClient';

export default async function handler(req, res) {
  // 1. Verificar se o método da requisição é POST
  // Esta rota servirá apenas para criar novos alertas.
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Método ${req.method} não permitido` });
  }

  try {
    // 2. Tentar obter a sessão do usuário a partir dos cookies
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    // 3. Verificar se o usuário está autenticado
    if (userError || !user) {
      return res.status(401).json({ error: 'Acesso não autorizado. Por favor, faça login.' });
    }

    // 4. Extrair os dados do corpo da requisição
    const { search_term, notification_method } = req.body;

    // 5. Validação básica dos dados recebidos
    if (!search_term || !notification_method) {
      return res.status(400).json({ error: 'Dados incompletos. O termo de busca e o método de notificação são obrigatórios.' });
    }

    // 6. Criar o objeto do novo alerta, associando ao ID do usuário logado
    const newAlert = {
      user_id: user.id,
      search_term,
      notification_method,
      is_active: true, // Define o alerta como ativo por padrão
    };

    // 7. Inserir o novo alerta na tabela 'product_alerts'
    const { data, error: insertError } = await supabase
      .from('product_alerts')
      .insert(newAlert)
      .select() // Retorna o objeto que acabou de ser criado
      .single(); // Esperamos que apenas um objeto seja retornado

    // 8. Verificar se houve erro na inserção no banco de dados
    if (insertError) {
      console.error('Erro ao criar alerta no Supabase:', insertError);
      // As políticas de segurança (RLS) que criamos devem impedir isso, mas é uma boa prática verificar
      throw insertError;
    }

    // 9. Retornar o alerta recém-criado com sucesso
    return res.status(201).json(data);

  } catch (error) {
    // Bloco de captura para qualquer outro erro inesperado
    return res.status(500).json({ error: 'Erro interno do servidor.', details: error.message });
  }
}