/**
 * Composable para formatar percentuais de forma acessível para leitores de tela
 *
 * O problema: "46,5%" pode ser lido como "465%" pelos leitores de tela
 * A solução: Usar aria-label com formatação que substitua vírgula por "vírgula"
 * ou use ponto como separador decimal
 */

export function useAccessiblePercentage() {
  /**
   * Formata um número percentual para exibição visual (com vírgula)
   * @param value - Valor numérico (ex: 46.5)
   * @param decimals - Número de casas decimais (padrão: 1)
   * @returns String formatada (ex: "46,5%")
   */
  const formatPercentage = (value: number, decimals: number = 1): string => {
    return (
      value.toLocaleString('pt-BR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }) + '%'
    );
  };

  /**
   * Formata um número percentual para aria-label (acessível para leitores de tela)
   * Substitui vírgula por "vírgula" para leitura correta
   * @param value - Valor numérico (ex: 46.5)
   * @param decimals - Número de casas decimais (padrão: 1)
   * @returns String formatada para aria-label (ex: "46 vírgula 5 por cento")
   */
  const formatPercentageForAria = (
    value: number,
    decimals: number = 1,
  ): string => {
    const formatted = value.toLocaleString('pt-BR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

    // Substitui vírgula por "vírgula" para leitura correta
    const accessible = formatted.replace(',', ' vírgula ');
    return `${accessible} por cento`;
  };

  /**
   * Formata um número percentual já formatado (string) para aria-label
   * Útil quando o valor já vem formatado como string
   * @param formattedValue - String já formatada (ex: "46,5%")
   * @returns String formatada para aria-label (ex: "46 vírgula 5 por cento")
   */
  const formatPercentageStringForAria = (formattedValue: string): string => {
    // Remove o símbolo % se existir
    const withoutPercent = formattedValue.replace('%', '').trim();
    // Substitui vírgula por "vírgula" para leitura correta
    const accessible = withoutPercent.replace(',', ' vírgula ');
    return `${accessible} por cento`;
  };

  return {
    formatPercentage,
    formatPercentageForAria,
    formatPercentageStringForAria,
  };
}
