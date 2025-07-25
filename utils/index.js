/**
 * Cria uma URL de página padronizada.
 * @param {string} pageName - O nome da página ou rota (ex: "ProductDetail?id=123").
 * @returns {string} A URL formatada (ex: "/ProductDetail?id=123").
 */
export const createPageUrl = (pageName) => {
  return `/${pageName}`;
};
/**
 * Calcula o tempo decorrido desde uma data até agora.
 * @param {string} dateString - A data em formato de string (ex: "2024-07-25T10:00:00Z").
 * @returns {string} O tempo formatado (ex: "há 5 horas", "há 3 dias").
 */
export function timeAgo(dateString) {
  if (!dateString) return '';

  const now = new Date();
  const past = new Date(dateString);
  const secondsPast = (now.getTime() - past.getTime()) / 1000;

  if (secondsPast < 60) {
    return 'agora mesmo';
  }
  if (secondsPast < 3600) {
    return `há ${Math.round(secondsPast / 60)} minutos`;
  }
  if (secondsPast <= 86400) { // 86400 segundos = 24 horas
    const hours = Math.round(secondsPast / 3600);
    return `há ${hours} hora${hours > 1 ? 's' : ''}`;
  }

  const days = Math.round(secondsPast / 86400);
  return `há ${days} dia${days > 1 ? 's' : ''}`;
}