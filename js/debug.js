// Ferramentas de Debug para acesso via console do navegador

class Debug {
  /**
   * @param {Phaser.Scene} scene A instância da MainScene para manipular o estado do jogo.
   */
  constructor(scene) {
    this.scene = scene;
    console.log('Debug tools loaded. Use window.dev.help() to see available commands.');
  }

  /**
   * Mostra todos os comandos de debug disponíveis.
   */
  help() {
    console.log('--- Comandos de Debug Disponíveis ---');
    console.log('dev.help() - Mostra esta mensagem de ajuda.');
    console.log('dev.reset() - Reseta todo o progresso do jogo (localStorage) e reinicia.');
    console.log("dev.setResource('creatorEssence', 1000) - Define um valor para um recurso. Recursos: 'creatorEssence', 'chaoticEssence', 'balanceBoost'");
    console.log('dev.listEvents() - Lista todos os IDs de eventos disponíveis para disparo.');
    console.log("dev.triggerEvent('frozenGear') - Dispara um evento específico pelo seu ID.");
    console.log('-------------------------------------');
  }

  /**
   * Limpa todos os dados salvos e reinicia o jogo.
   */
  reset() {
    console.warn('Resetando todos os dados do jogo...');
    localStorage.removeItem('caosCicleSave');
    this.scene.scene.restart();
    console.log('Jogo resetado.');
  }

  /**
   * Define o valor de um recurso específico.
   * @param {string} resource - O nome do recurso ('creatorEssence', 'chaoticEssence', 'balanceBoost').
   * @param {number} amount - O valor a ser definido.
   */
  setResource(resource, amount) {
    if (typeof this.scene[resource] !== 'undefined') {
      this.scene[resource] = amount;
      console.log(`Recurso ${resource} definido para ${amount}.`);
    } else {
      console.error(`Erro: Recurso '${resource}' não encontrado. Recursos disponíveis: 'creatorEssence', 'chaoticEssence', 'balanceBoost'.`);
    }
  }

  /**
   * Lista todos os IDs de eventos disponíveis.
   */
  listEvents() {
    if (this.scene.eventsData && this.scene.eventsData.length > 0) {
      console.log('--- IDs de Eventos Disponíveis ---');
      this.scene.eventsData.forEach(event => console.log(event.id));
      console.log('-----------------------------------');
    } else {
      console.log('Nenhum evento definido na cena.');
    }
  }

  /**
   * Dispara um evento específico pelo seu ID.
   * @param {string} eventId - O ID do evento a ser disparado.
   */
  triggerEvent(eventId) {
    if (!this.scene.eventsData) {
      console.error('Sistema de eventos não parece estar inicializado na cena.');
      return;
    }
    
    const eventToTrigger = this.scene.eventsData.find(event => event.id === eventId);

    if (eventToTrigger) {
      // Verifica se o evento já está ativo para evitar duplicatas
      const isEventActive = this.scene.activeEvents.some(active => active.id === eventId);
      if (isEventActive) {
        console.warn(`Evento '${eventId}' já está ativo.`);
        return;
      }
      
      console.log(`Disparando evento: ${eventId}`);
      this.scene.triggerEvent(eventToTrigger);
      // Reseta o cooldown global para permitir testes consecutivos
      this.scene.eventCooldown = 0; 
    } else {
      console.error(`Erro: Evento com ID '${eventId}' não encontrado.`);
      this.listEvents();
    }
  }
}

export default Debug;
