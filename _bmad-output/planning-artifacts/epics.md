---
stepsCompleted: [1]
inputDocuments:
  [
    "_bmad-output/planning-artifacts/prd.md",
    "_bmad-output/planning-artifacts/architecture.md",
    "_bmad-output/planning-artifacts/prfaq-vortex.md",
  ]
workflowType: "epics"
project_name: "vortex"
---

# vortex - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for vortex, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

- **FR1:** Usuários podem configurar e validar conexões via Wizard assistido.
- **FR2:** Usuários podem visualizar estados e métricas (CPU/RAM/IO) em tempo real.
- **FR3:** Usuários podem ordenar e agrupar recursos por saúde ou tipo.
- **FR4:** O sistema deve rastrear recursos via UUID (suporte a renomeação).
- **FR5:** O sistema deve realizar expurgo automático de recursos órfãos (Pruning).
- **FR6:** Usuários podem disparar comandos de Start, Stop e Restart com confirmação secundária para itens críticos.
- **FR7:** Usuários podem pausar, pesquisar e filtrar fluxos de logs em tempo real.
- **FR8:** O sistema deve sobrepor métricas contextuais aos logs via interação (hover).
- **FR9:** Usuários podem visualizar metadados de configuração (read-only) para debug.
- **FR10:** O sistema deve renderizar o grafo de dependências com destaque de falhas (Heatmap).
- **FR11:** Usuários podem vincular manualmente recursos que falharam no auto-discovery.
- **FR12:** O sistema deve agrupar notificações em massa durante falhas de infraestrutura.
- **FR13:** O sistema deve prover uma API REST para integrações externas.

### NonFunctional Requirements

- **NFR1:** Cobertura de testes >= 80% (Pest/Vitest).
- **NFR2:** Latência de WebSockets < 100ms para estados e < 500ms para logs.
- **NFR3:** Dashboard básico carregado (FCP) em < 1s.
- **NFR4:** Máximo de 200MB de RAM no navegador sob carga intensa.
- **NFR5:** Criptografia AES-256-GCM para chaves e SSL/TLS para tráfego.
- **NFR6:** Suporte nativo a 2FA e expiração de sessão (1h).
- **NFR7:** Contraste WCAG 2.1 AA e navegação full-keyboard para ações rápidas.
- **NFR8:** Registro imutável via Hash-Chain Pattern para auditoria.
- **NFR9:** Resiliência via Circuit Breaker e reconexão automática com drivers.

### Additional Requirements

- **AR1: Manual Clean Install.** Bootstrap manual de Laravel 11 + Fortify + Inertia + React 18 (conforme architecture.md 2.2).
- **AR2: Zustand Global Store.** Gerenciamento de estado de telemetria/logs desacoplado do ciclo React para performance.
- **AR3: Strategy Pattern Drivers.** Implementação de `ProviderInterface` e drivers stateless para Proxmox/Docker.
- **AR4: Double-Envelope Encryption.** Uso de Master Key secundária para proteção de segredos no banco.
- **AR5: Backend FSM.** Ciclo de vida de recursos gerido por Finite State Machine para evitar race conditions.
- **AR6: Stateless Proxy.** Vortex como proxy apátrida com cache de curto prazo (2-5s).
- **AR7: Capped Queue.** Limite de 1000 linhas de log por recurso no Zustand (FIFO).
- **AR8: Taskfile Automation.** Automação de setup e comandos via Taskfile.yaml.

### UX Design Requirements

- **UX-DR1: Ebony/Terminal Aesthetic.** Design premium dark focado em densidade de informação e estilo terminal.
- **UX-DR2: Layout de 3 Colunas.** Sidebar de navegação, Core Dashboard/Grafo, e Lateral de Logs/Forense.
- **UX-DR3: ATC Cards.** Cartões de recursos que se expandem em erro e colapsam quando saudáveis.
- **UX-DR4: Visual Dependency Graph.** Grafo via Canvas/WebGL com Heatmap de falhas.
- **UX-DR5: Contextual Forensics.** Overlay de métricas sobre logs via hover para correlação rápida.
- **UX-DR6: Delta Mode.** Visualização de métricas baseada em desvio de baseline.

### FR Coverage Map

- **FR1:** Epic 1 - Foundation & Secure Onboarding
- **FR2:** Epic 2 - Unified Real-time Monitoring
- **FR3:** Epic 2 - Unified Real-time Monitoring
- **FR4:** Epic 2 - Unified Real-time Monitoring
- **FR5:** Epic 2 - Unified Real-time Monitoring
- **FR6:** Epic 3 - Action Control & Contextual Forensics
- **FR7:** Epic 3 - Action Control & Contextual Forensics
- **FR8:** Epic 3 - Action Control & Contextual Forensics
- **FR9:** Epic 3 - Action Control & Contextual Forensics
- **FR10:** Epic 4 - Advanced Observability & Blast Radius
- **FR11:** Epic 4 - Advanced Observability & Blast Radius
- **FR12:** Epic 4 - Advanced Observability & Blast Radius
- **FR13:** Epic 5 - Integration & API

## Epic List

### Epic 1: Foundation & Secure Onboarding
Setup inicial do projeto e conexão segura com os primeiros provedores (Proxmox/Docker).
**FRs covered:** FR1.

### Epic 2: Unified Real-time Monitoring
Dashboard Ebony/Premium com telemetria (CPU/RAM/IO) via WebSockets e agrupamento inteligente.
**FRs covered:** FR2, FR3, FR4, FR5.

### Epic 3: Action Control & Contextual Forensics
Controle de estado (FSM) e investigação profunda de falhas via logs enriquecidos com métricas.
**FRs covered:** FR6, FR7, FR8, FR9.

### Epic 4: Advanced Observability & Blast Radius
Visualização da topologia do lab via Grafo WebGL e gestão de impacto de incidentes.
**FRs covered:** FR10, FR11, FR12.

### Epic 5: Integration & API
Exposição de endpoints REST para automação e integração com sistemas externos.
**FRs covered:** FR13.

## Epic 1: Foundation & Secure Onboarding

Setup inicial do projeto e conexão segura com os primeiros provedores (Proxmox/Docker).

### Story 1.1: Project Bootstrap & Environment Setup

As a Developer,
I want a clean Laravel 11 setup with Inertia, React, and Taskfile automation,
So that I have a solid, manual foundation without opinionated kit bloat.

**Acceptance Criteria:**

**Given** a fresh project directory
**When** I execute the manual installation commands from Architecture 2.2
**Then** Laravel 11 is installed with Fortify, Inertia, and React 18
**And** a `Taskfile.yaml` exists with `setup`, `dev`, and `test` commands
**And** the project structure follows the defined tree (app/Core, tests/Backend, etc.)

### Story 1.2: Vault & Double-Envelope Encryption

As a Developer,
I want a secure encryption layer (Vault) for provider keys,
So that I can prevent key leakage even if the database is compromised.

**Acceptance Criteria:**

**Given** a secondary `VORTEX_MASTER_KEY` defined in the .env file
**When** the system saves a provider secret
**Then** it must use "Double-Envelope" encryption (APP_KEY + Master Key)
**And** the encrypted value must be stored using Laravel's Encrypted Casts
**And** sensitive keys must be masked in logs using `#[SensitiveParameter]`

### Story 1.3: Secure Authentication (Headless)

As an Admin,
I want to authenticate via Laravel Fortify and setup 2FA,
So that I can ensure only authorized users access the Control Plane.

**Acceptance Criteria:**

**Given** Fortify is installed in headless mode
**When** I access the `/login` route
**Then** I can authenticate via an Inertia-based login page
**And** I can enable 2FA and verify it with a TOTP app
**And** session duration is enforced to 1 hour (NFR6)

### Story 1.4: Connection Wizard UI (Ebony Style)

As an Admin,
I want a premium dark-themed Wizard UI for adding connections,
So that I have a high-quality onboarding experience.

**Acceptance Criteria:**

**Given** the "Ebony/Terminal" design tokens
**When** I open the `/wizard` route
**Then** a 3-step wizard (Introduction -> Data Entry -> Validation) is displayed
**And** the layout is responsive and follows WCAG 2.1 AA contrast guidelines
**And** input fields include real-time validation feedback

### Story 1.5: Provider Validation & Handshake

As an Admin,
I want to test my Proxmox/Docker connections before saving them,
So that I can ensure the keys are working as expected.

**Acceptance Criteria:**

**Given** connection details (URL, Token/Socket) provided in the Wizard
**When** I click the "Test Connection" button
**Then** the corresponding Driver (Core\Drivers) performs a handshake with the remote API
**And** a success/failure message is displayed with the technical reason for failure
**And** successful validation allows proceeding to the final "Save" step (FR1)
## Epic 2: Unified Real-time Monitoring

Dashboard Ebony/Premium com telemetria (CPU/RAM/IO) via WebSockets e agrupamento inteligente.

### Story 2.1: Unified Monitoring Dashboard (Base Layout)

As an Admin,
I want a 3-column Ebony layout with a searchable resource sidebar,
So that I can manage my entire lab from a single context.

**Acceptance Criteria:**

**Given** an authenticated user
**When** I access the `/dashboard` route
**Then** a 3-column layout is rendered (Navigation, Main Canvas, Contextual Sidebar)
**And** the Sidebar displays a grouped list of resources (Proxmox VMs, Docker Containers)
**And** a global search filter is available in the Sidebar (FR3)

### Story 2.2: Zustand Telemetry Store

As a Developer,
I want a high-performance global store for metrics,
So that I can update the UI at 60 FPS without React render bottlenecks.

**Acceptance Criteria:**

**Given** the Zustand integration
**When** a JSON payload with metrics is received via WebSocket
**Then** the store updates only the specific resource entry by UUID (FR4)
**And** components subscribed to that specific resource re-render independently
**And** memory usage remains below 200MB (NFR4)

### Story 2.3: Real-time Metric Streaming (Reverb)

As an Admin,
I want resource metrics to update automatically in real-time,
So that I have immediate awareness of my infrastructure health.

**Acceptance Criteria:**

**Given** the Laravel Reverb broadcasting server
**When** a resource is "In-Focus" (visible on screen)
**Then** the backend broadcasts metrics (CPU/RAM/IO) every 2-5s
**And** the frontend listener updates the Zustand store automatically (NFR2)
**And** an "Out-of-Sync" indicator appears if the WebSocket connection drops
**And** the UI must automatically re-sync state upon reconnection without data duplication.

### Story 2.4: Resource Card (ATC Card) - Visual States

As an Admin,
I want resource cards that react visually to health changes,
So that I can identify failures instantly.

**Acceptance Criteria:**

**Given** the main dashboard canvas
**When** a resource status changes to "Error"
**Then** the ATC Card must auto-expand to show detailed error info (UX-DR3)
**And** when the status is "Healthy", the card colapses to a condensed metric view
**And** the card includes a mini-chart (Sparkline) of recent CPU activity

### Story 2.5: Delta Mode & Adaptive Polling

As an Admin,
I want metrics focused on deviations and efficient background polling,
So that I can focus on anomalies while saving server resources.

**Acceptance Criteria:**

**Given** the "Delta Mode" toggle is enabled
**When** a metric deviates from the 5-minute moving average baseline
**Then** the UI highlights the delta percentage (e.g., +15% CPU)
**And** polling frequency for resources that are off-screen decreases to 30s (Adaptive Polling)
**And** resource pruning (FR5) occurs for items that have been offline for > 10 minutes
## Epic 3: Action Control & Contextual Forensics

Controle de estado (FSM) e investigação profunda de falhas via logs enriquecidos com métricas.

### Story 3.1: Command Engine & FSM Lifecycle

As an Admin,
I want reliable and deterministic resource state transitions,
So that I can prevent race conditions and inconsistent states during operations.

**Acceptance Criteria:**

**Given** a resource in a known state (e.g., "Stopped")
**When** I trigger a "Start" command
**Then** the Backend FSM moves the resource state to "Starting" immediately
**And** the state only transitions to "Running" once the Driver confirms success via Handshake
**And** failed transitions must return a `Result Object` with the error for the UI.

### Story 3.2: Immutable Audit Log (Hash-Chain)

As a Security Auditor,
I want a tamper-proof history of all write actions (Start/Stop/Restart),
So that I can ensure the integrity of the forensics data.

**Acceptance Criteria:**

**Given** a write action is triggered on a resource
**When** the audit log entry is persisted in PostgreSQL
**Then** it must include a SHA-256 hash calculated from (current_action_data + hash_of_previous_entry)
**And** an artisan command `vortex:audit:verify` exists to validate the chain integrity
**And** all sensitive parameters are masked in the log entry.

### Story 3.3: Real-time Log Streamer (Capped Queue)

As an Admin,
I want to stream logs in real-time without crashing my browser,
So that I can debug high-volume services safely.

**Acceptance Criteria:**

**Given** a resource has log streaming enabled
**When** the backend receives log lines from the Driver
**Then** it broadcasts them via Laravel Reverb with a 500ms throttle
**And** the `useLogStore` in Zustand adds them to the buffer
**And** the buffer removes the oldest line (FIFO) once it exceeds 1000 lines (AR7).

### Story 3.4: Contextual Forensics Panel

As an Admin,
I want to see logs correlated with metrics via hover interaction,
So that I can identify if a log error matches a hardware spike.

**Acceptance Criteria:**

**Given** the Contextual Logs panel is open
**When** I hover over a log line with a specific timestamp
**Then** a tooltip displays the resource's CPU/RAM usage at that exact second (FR8)
**And** I can pause, resume, and search the log buffer in real-time (FR7)
**And** I can view read-only configuration metadata for the resource (FR9).

### Story 3.5: Resource Management UI (Control Buttons)

As an Admin,
I want easy access to control commands with protection for critical items,
So that I can respond to incidents quickly and safely.

**Acceptance Criteria:**

**Given** the Resource Card (ATC Card) in the dashboard
**When** I access the "Actions" menu
**Then** Start, Stop, and Restart options are available based on the current FSM state
**And** if the resource is tagged as "critical", a secondary confirmation modal is required (FR6)
**And** command feedback is displayed via real-time "Toast" notifications.
## Epic 4: Advanced Observability & Blast Radius

Visualização da topologia do lab via Grafo WebGL e gestão de impacto de incidentes.

### Story 4.1: Visual Dependency Graph (Canvas Setup)

As an Admin,
I want a high-performance Canvas area for my infrastructure map,
So that I can visualize resource nodes without UI lag.

**Acceptance Criteria:**

**Given** the main dashboard view
**When** I switch to the "Graph View"
**Then** a Canvas/WebGL container is initialized and rendered
**And** all current resources are displayed as basic static nodes in a force-directed layout
**And** the UI maintains a stable 60 FPS (UX-DR4).

### Story 4.2: Auto-Discovery & Heuristic Matching

As a Developer,
I want automatic mapping between VMs and Containers,
So that I have zero-config visibility into my stack.

**Acceptance Criteria:**

**Given** active Proxmox and Docker providers
**When** resources are synchronized
**Then** the backend must correlate containers with their host VMs using Heuristic Matching (IP, MAC, or Hostname)
**And** a "Belongs To" relationship is established in the domain model
**And** the system indicates the source of the heuristic (Auto vs Manual).

### Story 4.3: Manual Dependency Override

As an Admin,
I want to manually fix or add missing resource dependencies,
So that I can ensure perfect accuracy when auto-discovery fails.

**Acceptance Criteria:**

**Given** the Graph View or a Resource Details page
**When** I trigger the "Link Resource" action
**Then** I can manually select a parent/child relationship (FR11)
**And** the manual override is saved to the database and takes precedence over heuristics
**And** the graph updates immediately via WebSocket.

### Story 4.4: Incident Heatmap & Blast Radius

As an Admin,
I want to visualize the cascade impact of a resource failure,
So that I can perform rapid triage during major outages.

**Acceptance Criteria:**

**Given** a parent node (e.g., a VM) is in "Error" status
**When** I view the Dependency Graph
**Then** the failed node is highlighted in high-contrast red (Heatmap)
**And** all its dependent children (Blast Radius) pulse in red to indicate potential impact (FR10)
**And** the "Delta Mode" highlighting is integrated into the node's visual state.

### Story 4.5: Mass Incident Grouping

As an Admin,
I want grouped notifications for cascade failures,
So that I can avoid alert fatigue during infrastructure outages.

**Acceptance Criteria:**

**Given** multiple resources failing simultaneously due to a shared parent failure
**When** the system generates incident notifications
**Then** it must group them into a single "Incident Card" in the UI (FR12)
**And** the card displays a summary of the root cause and the total count of affected items
**And** clicking the card navigates the user to the Blast Radius view in the Graph.
## Epic 5: Integration & API

Exposição de endpoints REST para automação e integração com sistemas externos.

### Story 5.1: REST API - Resource Inventory & States

As a Developer,
I want to access my lab's resource data programmatically via REST,
So that I can integrate Vortex data with custom scripts or external monitoring stacks.

**Acceptance Criteria:**

**Given** a valid and authorized API Key
**When** I perform a GET request to `/api/v1/resources`
**Then** the system returns a JSON list of all resources including UUID, Type, Name, and current Health Status
**And** the API response time must be under 200ms
**And** the data follows the strict `snake_case` naming convention (AR4).

### Story 5.2: REST API - Remote Command Execution

As a Developer,
I want to trigger resource commands (Start/Stop/Restart) via API,
So that I can automate lab maintenance tasks using external triggers.

**Acceptance Criteria:**

**Given** a valid API Key with "control" scope
**When** I perform a POST request to `/api/v1/resources/{uuid}/command` with a valid action payload
**Then** the backend triggers the corresponding FSM transition (FR13)
**And** the system returns a `202 Accepted` status with a link to the audit log entry
**And** the action is recorded in the Immutable Audit Log, identified as an API-triggered action.

### Story 5.3: API Key Management & Scoping

As an Admin,
I want to manage and restrict external API access,
So that I can maintain granular security for my integrations.

**Acceptance Criteria:**

**Given** the "API Settings" page
**When** I generate a new API Key
**Then** I can assign specific scopes (Read-Only, Control, Admin)
**And** the full API key is shown only once and stored using one-way hashing (SHA-256)
**And** I can revoke or rename any key at any time
**And** all API access is logged in the system audit for forensic analysis.
