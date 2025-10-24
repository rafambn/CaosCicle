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
        mainspringStabilizers: {
          name: 'Mainspring Stabilizers',
          description: 'Generates 1 Chrono-Essence per second.',
          flavor: '"Every second costs eternity. These springs ensure time flows, never stops."'
        },
        quantumLubricantInjectors: {
          name: 'Quantum Lubricant Injectors',
          description: 'Generates 1 Entropy Shard per second.',
          flavor: '"Liquid paradox. What flows backward also moves forward—both, neither, eternally."'
        },
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
        narrative: 'Time fractures. Resetting to the last stable moment... but something remains. Memory persists.',
        timeSurvived: 'Time Survived',
        aeonFragmentsGained: 'Aeon Fragments Gained',
        totalAeonFragments: 'Total Aeon Fragments',
      },

      // Textos de Lore
      lore: {
        unlocked: 'Memory Fragment Unlocked',
        fragments: {
          10: "Who am I? Why do I remember the last cycle?",
          20: "This clock... it's been running for eons.",
          30: "I sense two factions. The Accelerators. The Architects.",
        }
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
        mainspringStabilizers: {
          name: 'Estabilizadores de Mola Principal',
          description: 'Gera 1 Chrono-Essence por segundo.',
          flavor: '"Cada segundo custa uma eternidade. Estas molas garantem que o tempo flua, e nunca pare."'
        },
        quantumLubricantInjectors: {
          name: 'Injetores de Lubrificante Quântico',
          description: 'Gera 1 Entropy Shard por segundo.',
          flavor: '"Paradoxo líquido. O que flui para trás também avança - ambos, nenhum, eternamente."'
        },
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
        narrative: 'O tempo fratura. Reiniciando para o último momento estável... mas algo permanece. A memória persiste.',
        timeSurvived: 'Tempo Sobrevivido',
        aeonFragmentsGained: 'Fragmentos de Éon Ganhos',
        totalAeonFragments: 'Total de Fragmentos de Éon',
      },
      
      // Textos de Lore
      lore: {
        unlocked: 'Fragmento de Memória Desbloqueado',
        fragments: {
          10: "Quem sou eu? Por que me lembro do último ciclo?",
          20: "Este relógio... está funcionando há eras.",
          30: "Eu sinto duas facções. Os Aceleradores. Os Arquitetos.",
        }
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
