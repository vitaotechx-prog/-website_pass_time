/**
 * Cria uma URL de página padronizada.
 * @param {string} pageName - O nome da página ou rota (ex: "ProductDetail?id=123").
 * @returns {string} A URL formatada (ex: "/ProductDetail?id=123").
 */
export const createPageUrl = (pageName) => {
  return `/${pageName}`;
};