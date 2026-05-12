# Avaliação: Review Prompt - Edge Case Hunter

## 🔍 Estado Atual (Revisado)
O prompt foi atualizado para abandonar a passividade e adotar uma postura de investigação ativa. Agora, o agente é instruído a realizar uma **Enumeração Exaustiva de Caminhos**.

### Melhorias Implementadas
1. **Metodologia Ativa**: Substituição do olhar genérico pelo rastreamento mecânico de ramificações (if/else, try/catch).
2. **Checklist de Fronteiras**: Instruções explícitas para testar valores nulos, vazios, limites de domínio e estados de ambiente.
3. **Rastreamento de Contexto**: Obrigatoriedade de verificar definições de funções fora do diff para validar tipos e contratos.
4. **Estrutura Técnica**: Relatórios agora exigem Localização, Gatilho e Consequência, garantindo achados acionáveis.

---

Este documento serve como registro da evolução dos padrões de qualidade do projeto Vortex durante a Sprint 1.
