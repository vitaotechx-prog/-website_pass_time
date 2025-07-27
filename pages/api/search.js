// -website-pass-time/pages/api/search.js
import { google } from 'googleapis';
import { supabase } from '@/lib/supabaseClient';

async function logSearchToSheet(searchTerm) {
  // A lógica de salvar no Google Sheets continua a mesma
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const sheets = google.sheets({ version: 'v4', auth });
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEETS_SHEET_ID,
      range: 'A:B',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[searchTerm, new Date().toLocaleString('pt-BR')]],
      },
    });
  } catch (error) {
    console.error('Erro ao salvar busca no Google Sheets:', error);
  }
}

export default async function handler(req, res) {
  const { q: searchQuery } = req.query;

  if (!searchQuery) {
    return res.status(400).json({ error: 'O termo de busca (q) é obrigatório.' });
  }

  // Inicia o logging sem esperar
  logSearchToSheet(searchQuery);

  try {
    // --- ALTERAÇÃO PRINCIPAL AQUI ---
    // Em vez de 'textSearch', chamamos nossa nova função 'search_products' via RPC
    const { data: products, error } = await supabase.rpc('search_products', {
      search_term: searchQuery
    });
    // --- FIM DA ALTERAÇÃO ---

    if (error) throw error;

    // A busca via RPC não junta as categorias automaticamente. Precisamos fazer isso.
    if (products && products.length > 0) {
        const productIds = products.map(p => p.id);
        const { data: categoriesData, error: categoriesError } = await supabase
            .from('categories')
            .select(`id, name, products!inner(id)`)
            .in('products.id', productIds);

        if (categoriesError) throw categoriesError;

        const productsWithCategories = products.map(product => {
            const category = categoriesData.find(c => c.products.some(p => p.id === product.id));
            return {
                ...product,
                categories: category ? { id: category.id, name: category.name } : null
            };
        });
        
        return res.status(200).json(productsWithCategories);
    }

    return res.status(200).json(products);
    
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return res.status(500).json({ error: 'Erro ao buscar produtos.' });
  }
}