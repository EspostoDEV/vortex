---
stepsCompleted: ["step-01-init", "step-02-discovery", "step-02b-vision", "step-02c-executive-summary", "step-03-success", "step-04-journeys", "step-05-domain", "step-06-innovation", "step-07-project-type", "step-08-scoping", "step-09-functional", "step-10-nonfunctional", "step-11-polish", "step-12-complete"]
releaseMode: "phased"
classification:
  projectType: "web_app"
  domain: "Infrastructure Management"
  complexity: "medium"
  projectContext: "greenfield"
inputDocuments: ["_bmad-output/planning-artifacts/prfaq-vortex.md"]
workflowType: 'prd'
project_name: "vortex"
user_name: "Mathe"
---

# Product Requirements Document - Vortex

**Author:** Mathe  
**Date:** 2026-05-11

> [!IMPORTANT]
> **Requisito Global:** Cobertura de testes mínima de 80%, priorizando integração e lógica de negócio.

## 1. Executive Summary & Classification

O **Vortex** é um painel de controle externo (Control Plane) para gestão centralizada de Home Labs e infraestruturas de pequena escala. Ele resolve a fragmentação entre ambientes de virtualização (Proxmox) e orquestração (Docker), eliminando a necessidade de múltiplas abas e ferramentas isoladas.

- **Tipo de Projeto:** Web App / Dashboard (Inertia + React + Laravel).
- **Domínio:** Infrastructure Management (On-Premise).
- **Contexto:** Greenfield (Desenvolvimento do zero).
- **Arquitetura:** Pragmática baseada em Service Layer e Interfaces (SOLID).

### 1.1 Diferencial Estratégico
O Vortex foca em **Unificação de Contexto** e design **Incident-First**. Ao contrário de ferramentas de monitoramento passivo, o Vortex correlaciona telemetria de hardware com logs de aplicação, permitindo que falhas sejam diagnosticadas e corrigidas em uma interface unificada através de comandos de "um clique".

## 2. Success Criteria

### 2.1 User Success (Eficiência Operacional)
- **Diagnóstico Rápido:** Identificação visual da causa raiz de falhas em < 30s.
- **Recuperação Eficiente:** Execução de comandos (Restart/Stop) com feedback real-time em < 1min.
- **Zero Context Switching:** 100% das tarefas de rotina executadas sem sair do Vortex.

### 2.2 Technical Success (Estabilidade)
- **Qualidade:** Cobertura de testes >= 80%.
- **Resiliência:** Tratamento de falhas de APIs externas em < 2s com fallback gracioso.
- **Escalabilidade:** Suporte a 20 nós Proxmox e 500+ recursos sem latência na UI.
- **Streaming:** Latência de WebSockets < 100ms para estados e < 500ms para logs.

## 3. Product Scope & Roadmap

### 3.1 MVP (Fase 1: O Núcleo de Diagnóstico)
- **Dashboard Unificado:** Visão Proxmox + Docker lado a lado.
- **Wizard de Conexão:** Validação assistida de chaves e sockets.
- **Gestão de Estado:** Comandos de controle (Start/Stop/Restart) em tempo real.
- **Contextual Logs:** Streaming de logs enriquecido com métricas via "hover".
- **Security Baseline:** Login com 2FA e criptografia de chaves (AES-256).

### 3.2 Growth & Vision (Fases 2 e 3)
- **Growth:** Alertas via Telegram, Análise de Causa Raiz Automática e Histórico de 24h.
- **Vision:** Auto-Healing (scripts automáticos), Conectores Cloud (AWS/GCP) e Vortex CLI.

## 4. User Journeys

### 4.1 Diagnóstico de Incidente (Ricardo - Home Lab Enthusiast)
1. O usuário nota um serviço indisponível e abre o Vortex.
2. O **Visual Dependency Graph** destaca o caminho da falha em vermelho (Heatmap).
3. O usuário acessa o **Contextual Log**, identifica o erro e reinicia o recurso.
4. **Resultado:** Serviço restaurado em menos de 1 minuto.

### 4.2 Onboarding Seguro (Bruno - Dev Freelancer)
1. O usuário inicia o **Wizard de Conexão**.
2. O sistema valida as permissões do Token Proxmox e a conectividade do Docker Socket.
3. O usuário configura o 2FA e recebe a confirmação de ambiente blindado.
4. **Resultado:** Setup concluído com confiança técnica e segurança garantida.

## 5. Innovation & Novel Patterns

### 5.1 Contextual Forensics (Contextual Log)
- **Inovação:** Linha do tempo de logs enriquecida com métricas de CPU/RAM/IO on-demand.
- **Engenharia:** Validação de "Clock Drift" e processamento em Web Workers para evitar UI blocking.

### 5.2 Blast Radius View (Dependency Graph)
- **Inovação:** Auto-discovery via **Heuristic Matching** (IP/MAC/Hostname).
- **Design Pattern (ATC Cards):** Expansão inteligente de nós em erro; colapso de nós saudáveis.

### 5.3 Incident-First Analytics
- **Delta Mode:** Exibição de métricas baseada no desvio em relação à média móvel (Baseline).

## 6. Domain & Platform Requirements

### 6.1 Segurança de Infraestrutura
- **Socket Proxy:** Suporte obrigatório a conexões via proxy seguro para Docker.
- **Least Privilege:** Validação de papéis de Token (ex: PVEVMAdmin vs Admin).
- **Auditoria:** Registro imutável de todas as ações de escrita (Audit Log).

### 6.2 Especificações Web App
- **Browser:** Evergreen Desktop (Chrome, Firefox, Safari, Edge).
- **Layout:** Estrutura de três colunas (Navegação, Dashboard, Logs).
- **Memory Limit:** Máximo de 200MB de RAM no navegador sob carga intensa.

## 7. Functional Requirements (Capability Contract)

### 7.1 Gestão e Monitoramento
- **FR1:** Usuários podem configurar e validar conexões via Wizard assistido.
- **FR2:** Usuários podem visualizar estados e métricas (CPU/RAM/IO) em tempo real.
- **FR3:** Usuários podem ordenar e agrupar recursos por saúde ou tipo.
- **FR4:** O sistema deve rastrear recursos via UUID (suporte a renomeação).
- **FR5:** O sistema deve realizar expurgo automático de recursos órfãos (Pruning).

### 7.2 Controle e Forense
- **FR6:** Usuários podem disparar comandos de Start, Stop e Restart com confirmação secundária para itens críticos.
- **FR7:** Usuários podem pausar, pesquisar e filtrar fluxos de logs em tempo real.
- **FR8:** O sistema deve sobrepor métricas contextuais aos logs via interação (hover).
- **FR9:** Usuários podem visualizar metadados de configuração (read-only) para debug.

### 7.3 Visualização e API
- **FR10:** O sistema deve renderizar o grafo de dependências com destaque de falhas (Heatmap).
- **FR11:** Usuários podem vincular manualmente recursos que falharam no auto-discovery.
- **FR12:** O sistema deve agrupar notificações em massa durante falhas de infraestrutura.
- **FR13:** O sistema deve prover uma API REST para integrações externas.

## 8. Non-Functional Requirements (Quality Attributes)

### 8.1 Performance e UX
- **FCP:** Dashboard básico carregado em < 1s.
- **Fluidez:** Grafo de dependências estável a 60 FPS (Canvas/WebGL).
- **MTTR:** Reconexão automática com drivers em caso de falha de rede.

### 8.2 Segurança e Resiliência
- **Criptografia:** AES-256-GCM para chaves e SSL/TLS para tráfego.
- **Identidade:** Suporte nativo a 2FA e expiração de sessão (1h).
- **Disponibilidade:** Foco em resiliência de recuperação (MTTR) em vez de uptime puro.
- **Acessibilidade:** Contraste WCAG 2.1 AA e navegação full-keyboard para ações rápidas.

## 9. Engineering Principles & Resiliency

### 9.1 Multi-Driver Strategy Pattern
- **Arquitetura:** O Core do Vortex é agnóstico em relação aos provedores. Todas as integrações (Proxmox, Docker, etc.) devem implementar a `ProviderInterface`.
- **Objetivo:** Permitir a adição de novos provedores (ex: AWS, Azure) sem modificações no motor de orquestração central.

### 9.2 Finite State Machine (FSM) Lifecycle
- **Implementação:** O ciclo de vida de cada recurso (VM/Container) deve ser gerido por uma Máquina de Estados Finita no backend.
- **Consistência:** Estados de transição (ex: `Starting`, `Stopping`) são garantidos via FSM para evitar condições de corrida (race conditions).

### 9.3 Stateless Proxy & Idempotency
- **Verdade de Estado:** O Vortex atua como um Proxy Apátrida (Stateless). Ele nunca armazena o "estado atual" de forma definitiva, apenas reflete o que o provedor reporta via API.
- **Ações:** Todos os comandos de escrita (Restart, Stop) devem ser **Idempotentes**. Enviar o mesmo comando múltiplas vezes não deve causar estados colaterais inválidos.

### 9.4 Adaptive Polling & Throttling
- **Performance:** O sistema deve implementar **Adaptive Polling**, aumentando a frequência de atualização apenas para recursos "em foco" (visíveis na UI) e reduzindo para recursos em background.
- **Throttling:** O backend deve agrupar (batch) eventos de métricas para evitar sobrecarga no servidor de WebSockets (Reverb).

### 9.5 Performance Budget & Pre-mortem Actions
- **Foco:** Prioridade absoluta para o tempo de resposta do dashboard. Se uma funcionalidade nova degradar o tempo de carregamento para > 2s ou o FPS para < 60, ela deve ser otimizada.
- **Confiança:** O Vortex deve prover indicadores claros de fonte de heurística (Heuristic Source) e permitir o **Manual Override** (FR11) imediato em caso de falha de pareamento.

---

