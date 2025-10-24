// Internacionalização (i18n) - Sistema de Strings Centralizadas
// Suporta múltiplos idiomas facilmente

const i18n = {
  currentLanguage: 'en', // 'en' ou 'pt'

  translations: {
    en: {
      // UI de Recursos
      resources: {
        chronoEssence: 'Chrono-Essence',
        entropyShards: 'Entropy Shards',
        aeonFragments: 'Aeon Fragments',
      },

      // Estruturas
      structures: {
        mainspringStabilizers: 'Mainspring Stabilizers',
        quantumLubricantInjectors: 'Quantum Lubricant Injectors',
      },

      // Botões de Ações
      buttons: {
        generateChrono: 'Generate Chrono',
        generateEntropy: 'Generate Entropy',
        buyStabilizer: 'Buy Stabilizer',
        buyInjector: 'Buy Injector',
        witnessNextCycle: 'Witness the Next Cycle',
      },

      // Textos de Custo
      cost: 'Cost',

      // Textos de Game Over
      gameOver: {
        title: 'The Gears Have Shattered',
        timeSurvived: 'Time Survived',
        aeonFragmentsGained: 'Aeon Fragments Gained',
      },

      // Texto de Colapso (countdown)
      collapse: 'Collapse in',
    },

    pt: {
      // UI de Recursos
      resources: {
        chronoEssence: 'Essência Crônica',
        entropyShards: 'Fragmentos de Caos',
        aeonFragments: 'Fragmentos de Éon',
      },

      // Estruturas
      structures: {
        mainspringStabilizers: 'Estabilizadores de Mola Principal',
        quantumLubricantInjectors: 'Injetores de Lubrificante Quântico',
      },

      // Botões de Ações
      buttons: {
        generateChrono: 'Gerar Crono',
        generateEntropy: 'Gerar Caos',
        buyStabilizer: 'Comprar Estabilizador',
        buyInjector: 'Comprar Injetor',
        witnessNextCycle: 'Testemunhe o Próximo Ciclo',
      },

      // Textos de Custo
      cost: 'Custo',

      // Textos de Game Over
      gameOver: {
        title: 'As Engrenagens se Quebraram',
        timeSurvived: 'Tempo Sobrevivido',
        aeonFragmentsGained: 'Fragmentos de Éon Ganhos',
      },

      // Texto de Colapso (countdown)
      collapse: 'Colapso em',
    },
  },

  /**
   * Obtém uma tradução baseado no caminho (path notation)
   * @param {string} key - Caminho da chave (ex: 'resources.chronoEssence')
   * @param {string} language - Idioma (opcional, usa currentLanguage por padrão)
   * @returns {string} Texto traduzido
   */
  get(key, language = null) {
    const lang = language || this.currentLanguage;
    const keys = key.split('.');
    let value = this.translations[lang];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`i18n: Chave não encontrada: ${key} (idioma: ${lang})`);
        return key; // Retorna a chave se não encontrar a tradução
      }
    }

    return value;
  },

  /**
   * Define o idioma atual
   * @param {string} language - Código do idioma ('en' ou 'pt')
   */
  setLanguage(language) {
    if (language in this.translations) {
      this.currentLanguage = language;
    } else {
      console.warn(`i18n: Idioma não suportado: ${language}`);
    }
  },

  /**
   * Obtém lista de idiomas disponíveis
   * @returns {Array<string>}
   */
  getAvailableLanguages() {
    return Object.keys(this.translations);
  },
};

export default i18n;
