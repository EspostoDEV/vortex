---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
workflowType: 'architecture'
project_name: "vortex"
user_name: "Mathe"
date: "2026-05-11"
lastStep: 8
status: 'complete'
completedAt: '2026-05-11'
---

# Architecture Decision Document - Vortex

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

---
## 1. Project Context Analysis

### 1.1 Requirements Overview

**Functional Requirements:**
A arquitetura deve suportar a orquestração de provedores heterogêneos (Proxmox/Docker). Os FRs demandam uma camada de abstração (**Strategy Pattern**) que padronize estados e comandos (Start/Stop/Restart) via **Result Objects** para evitar falhas silenciosas. O fluxo de dados deve ser gerido por uma **Máquina de Estados Finita (FSM)** no backend.

**Non-Functional Requirements:**
- **Performance:** Latência de WebSockets < 100ms e carregamento inicial < 2s. Implementação de **Adaptive Polling** para reduzir carga nos provedores.
- **Segurança:** Criptografia AES-256-GCM para chaves e Auditoria Imutável. **Zero Credenciais no Frontend**.
- **Resiliência:** Mecanismos de Self-healing e Reconexão Automática.
- **UX:** Fluidez de 60 FPS no grafo de dependências via Canvas/WebGL.

### 1.2 Architectural Principles (First Principles & Seniority Signals)
- **Contract-First Abstraction:** O Core fala apenas a língua de "Recursos Genéricos". Drivers são tradutores isolados.
- **Stateless Proxy with TTL Cache:** O Vortex não armazena o estado do provedor, mas implementa uma camada de **Shared TTL Cache (2-5s)** para evitar sobrecarga (Hammering) de APIs externas.
- **Clock Sync Protocol:** Normalização de todos os timestamps para o **Horário do Servidor Vortex** no handshake do WebSocket para garantir correlação precisa de métricas/logs.
- **Idempotency:** Todos os comandos de escrita devem ser seguros para execução múltipla sem efeitos colaterais inválidos.

### 1.3 Scale, Complexity & Risks
- **Complexity level:** Medium/High (Real-time integration & Forensics).
- **Primary domain:** Infrastructure Management (Full-stack Laravel/React).
- **Risk Mitigation (Browser):** Uso de **Virtual Scrolling** e **Buffer Limitado** para logs para respeitar o limite de 200MB de RAM.
- **Risk Mitigation (Reliability):** Indicação visual clara de **Stale Data** caso a conexão WebSocket caia.

## 2. Starter Template Evaluation

### 2.1 Identified Domain
**Full-stack Web Control Plane** (Laravel + React + Inertia).

### 2.2 Selected Foundation: Manual Clean Install
Em vez de usar um Starter Kit opinativo (como Breeze ou Jetstream), optamos por uma instalação manual para garantir controle total sobre a performance e a estética do sistema.

**Rationale for Selection:**
- **Performance:** Uso de **Zustand** para gerenciamento de estado global de logs/métricas, evitando o "re-render hell" do React padrão.
- **Aesthetics:** Liberdade total para implementar uma UI "Premium/Dark" sem o overhead de estilos pré-definidos.
- **Security:** Uso do **Laravel Fortify** como motor de autenticação headless, mantendo a robustez do Laravel sem acoplamento de UI.
- **Precision:** Configuração explícita do **Laravel Reverb** para streaming de alta frequência.

**Implementation Command (Reference):**
```bash
composer create-project laravel/laravel vortex
cd vortex
composer require laravel/fortify inertiajs/inertia-laravel
php artisan fortify:install
npm install @inertiajs/react react react-dom zustand lucide-react
php artisan install:broadcasting # Select 'Reverb'
```

**Architectural Decisions Established:**
- **State Management:** Zustand (Global Store para telemetria).
- **Styling:** Vanilla Tailwind CSS (sem plugins de UI invasivos).
- **Auth:** Headless (Fortify + Inertia Controllers).
- **Optimization:** Code Splitting e Lazy Loading por módulo (Graph, Logs, Config).

## 3. Core Architectural Decisions

### 3.1 Data Architecture
- **Database:** **PostgreSQL** (estabilidade, suporte a JSONB e integridade referencial).
- **Cache & Real-time:** **Redis** (Buffer de logs, TTL cache de desduplicidade e motor de broadcasting para o Reverb).
- **Audit Log:** Implementação de **Hash-Chain Pattern**. Cada entrada de log armazena o hash da entrada anterior, tornando o histórico de auditoria à prova de adulteração.

### 3.2 Security & Secrets
- **Encryption:** **Double-Envelope Encryption**. Uso de `APP_KEY` + uma Master Key secundária (fornecida pelo usuário) para criptografar tokens de provedores.
- **Sensitive Data:** Uso obrigatório de **`#[SensitiveParameter]`** (PHP 8.2+) para mascarar chaves em logs e traces.
- **Client Security:** **Zero Credentials on Frontend**. Toda autenticação e requisição a provedores é intermediada pelo Backend Proxy.

### 3.3 Domain & Communication Patterns
- **Driver IQ:** Drivers são **Stateless Translators**. Eles normalizam dados de provedores em **DTOs rígidos** e retornam **Result Objects** (Success/Failure).
- **Resiliency:** A lógica de retentativa (Retry) e reconexão deve residir na **Service Layer**, mantendo os drivers simples e testáveis.
- **State Management:** Uso de **Zustand** no frontend para telemetria em tempo real, desacoplando o fluxo de logs do ciclo de vida padrão de props do React.

---



## 4. Implementation Patterns & Consistency Rules

### 4.1 Naming Patterns
- **Database & API JSON:** **Strict `snake_case`**. Não haverá mapeamento (aliasing) de chaves no Frontend. O que vem do PHP chega ao React como `snake_case` para garantir consistência total.
- **PHP Code:** Classes em `PascalCase`, métodos em `camelCase`, variáveis/propriedades em `snake_case`.
- **React Code:** Componentes em `PascalCase`, funções/variáveis em `camelCase`. Arquivos de componentes em `PascalCase` (ex: `ResourceCard.tsx`).
- **ESLint/Linting:** Configurado para permitir `snake_case` em propriedades de objetos, mas exigir `camelCase` para nomes de variáveis locais.

### 4.2 Structural Patterns
- **Unified Tests:** Todos os testes residem na pasta raiz **`/tests`**, dividida em `/tests/Backend` (Pest) e `/tests/Frontend` (Vitest).
- **Core Organization:**
    - Drivers: `app/Core/Drivers/`
    - Service Layer: `app/Services/`
    - DTOs: `app/Core/DTOs/`
- **Frontend Pages:** Localizadas em `resources/js/Pages/` seguindo o padrão Inertia.

### 4.3 Resilience & State Patterns
- **Rehydration Protocol:** Na reconexão do WebSocket (Reverb), o Frontend deve disparar um sync silencioso para atualizar o estado atual de todos os recursos no Zustand store.
- **Capped Queue (Logs):** O store de logs no Zustand deve limitar a memória a **1000 linhas por recurso**, removendo a mais antiga (FIFO) ao exceder o limite.
- **Versioned Updates:** Cada payload de telemetria deve conter um `timestamp_at_source`. O frontend ignora pacotes que cheguem fora de ordem cronológica.

---
## 5. Project Structure & Boundaries

### 5.1 Complete Project Tree
```text
vortex/
├── app/
│   ├── Core/                     <-- Domínio Agnóstico (FSM, Vault, Contracts)
│   │   ├── Drivers/              <-- Implementações Proxmox/Docker
│   │   ├── DTOs/                 <-- Objetos de Dados Normalizados
│   │   └── Contracts/            <-- Interfaces de Provedores
│   ├── Http/                     <-- Controllers (Inertia Props) e Middleware
│   ├── Models/                   <-- Eloquent (Provider, AuditLog, User)
│   └── Services/                 <-- Orquestração de Negócio e Cache
├── resources/
│   └── js/
│       ├── Components/           <-- UI Pura (Botões, Cards, Grafos)
│       ├── Pages/                <-- Páginas Inertia (React)
│       └── Stores/               <-- Zustand (useResourceStore, useLogStore)
├── tests/                        <-- Unificação de Testes
│   ├── Backend/                  <-- Pest (Feature & Unit)
│   └── Frontend/                 <-- Vitest (UI & Stores)
├── Taskfile.yaml                 <-- Automação de Setup e Comandos
└── composer.json / package.json  <-- Versões Travadas (Trio de Ouro)
```

### 5.2 Architectural Boundaries
- **Domain Isolation:** O diretório `app/Core` não possui dependências de Framework (Laravel). Ele pode ser testado em isolamento total.
- **Service Orchestration:** A camada `app/Services` é a única autorizada a falar com `app/Core/Drivers` e disparar eventos de auditoria simultaneamente.
- **Data Flow:**
    - **Inbound:** Provedor -> Driver -> DTO -> Service -> Dashboard.
    - **Outbound:** Dashboard -> Controller -> Service -> FSM -> Driver -> Provedor.

### 5.3 Requirements Mapping
- **Drivers & Connectivity:** `app/Core/Drivers/`, `app/Core/Contracts/`.
- **Forensic Analytics:** `app/Models/AuditLog.php`, `resources/js/Pages/Forensics/`.
- **Real-time Telemetry:** `app/Services/MonitoringService.php`, `resources/js/Stores/`.
- **Security (Double-Encryption):** `app/Core/Vault/`.

## 6. Architecture Validation Results

### 6.1 Coherence & Coverage ✅
- **Coherence:** A stack Laravel/React/Reverb está em total harmonia com o modelo de **Stateless Proxy**. A decisão de **Instalação Manual** garante que o Zustand e o Fortify não sofram conflitos de boilerplate.
- **Requirements Coverage:** Todos os Épicos (Wizard, Connectivity, Real-time, Forensics) possuem suporte direto na estrutura de diretórios e padrões definidos.
- **NFR Coverage:** Performance (Capped Queue), Segurança (Double-Encryption) e Resiliência (Circuit Breaker) estão arquitetados no nível de fundação.

### 6.2 Gap Analysis & Resolutions
- **Metrics History:** Resolvido via **On-demand Retrieval**. O Vortex atua como um narrador dos dados históricos já presentes no Proxmox/Docker (RRD/Stats API), sem duplicar storage desnecessariamente.
- **Storage Sustainability:** Implementação de **Retention Policy (TTL 7 dias)** para logs brutos e **Tabelas Particionadas** para manter a performance do Postgres em Home Labs.
- **Backward Compatibility:** Uso de **Schema Versioning** em todos os payloads JSON para garantir que atualizações de drivers não quebrem logs de auditoria antigos.

### 6.3 Implementation Readiness Assessment
**Overall Status:** **READY FOR IMPLEMENTATION** 🚀
**Confidence Level:** High

**Key Strengths:**
- Desacoplamento total via Strategy Pattern.
- Segurança de nível enterprise (Double-Envelope).
- UI ultra-responsiva (Zustand + Reverb).

### 6.4 Implementation Handoff
**First Implementation Priority:**
O Bootstrap deve seguir a ordem:
1. `composer create-project` (Clean install).
2. Configuração do `Taskfile.yaml` e ambiente Docker (Postgres/Redis).
3. Instalação manual do Inertia, React e Fortify.
4. Implementação da `ProviderInterface` e o primeiro Driver (Mock ou Docker).

---

