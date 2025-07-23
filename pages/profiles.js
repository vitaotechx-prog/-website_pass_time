// pages/profile.js
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function ProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function getProfile() {
      if (!user) return;

      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select(`full_name, avatar_url`)
        .eq('id', user.id)
        .single();

      if (error) {
        console.warn('Erro ao buscar perfil:', error);
      } else if (data) {
        setFullName(data.full_name || '');
        setAvatarUrl(data.avatar_url || '');
      }
      setLoading(false);
    }

    getProfile();
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage('');
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName })
      .eq('id', user.id);

    if (error) setMessage(`Erro ao atualizar: ${error.message}`);
    else setMessage('Perfil atualizado com sucesso!');
  };

  const handleUpdatePassword = async () => {
    if (newPassword.length < 6) {
        setMessage('A nova senha deve ter pelo menos 6 caracteres.');
        return;
    }
    setMessage('');
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) setMessage(`Erro ao atualizar senha: ${error.message}`);
    else setMessage('Senha atualizada com sucesso!');
    setNewPassword('');
  };

  return (
    <div className="container mx-auto max-w-2xl py-12">
      <h1 className="text-3xl font-bold mb-6">Editar Perfil</h1>
      {message && <Alert className="mb-4"><AlertDescription>{message}</AlertDescription></Alert>}

      <form onSubmit={handleUpdateProfile} className="space-y-6">
        {/* Espaço para o Avatar (a lógica de upload virá depois) */}
        <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-2xl text-gray-500">?</span>
            </div>
            <Button type="button" variant="outline" disabled>Mudar Foto (em breve)</Button>
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={user?.email} disabled />
        </div>
        <div>
          <Label htmlFor="fullName">Nome Social</Label>
          <Input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </form>

      <div className="mt-12 border-t pt-6 space-y-4">
          <h2 className="text-xl font-semibold">Alterar Senha</h2>
          <div>
            <Label htmlFor="newPassword">Nova Senha</Label>
            <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
          <Button onClick={handleUpdatePassword} variant="destructive">
            Atualizar Senha
          </Button>
      </div>
    </div>
  );
}