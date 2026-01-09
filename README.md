# mfe-home (Host Dashboard)

[![Angular](https://img.shields.io/badge/Angular-16+-dd0031?logo=angular)](https://angular.io/)
[![Micro Frontend](https://img.shields.io/badge/Micro--Frontend-Architecture-blue)]()
[![RxJS](https://img.shields.io/badge/RxJS-Reactive-purple?logo=reactivex)](https://rxjs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Realtime-FFCA28?logo=firebase)](https://firebase.google.com/)

---

## 📌 Overview

O `mfe-home` atua como o **Host Orquestrador** do ecossistema de Micro Frontends. Ele evoluiu de um simples container para um gerenciador de estado financeiro reativo, integrando autenticação, persistência em tempo real e composição dinâmica de interfaces.

Ele é responsável por:
* **Orquestração de Layout**: Composição da página principal utilizando Module Federation.
* **Gestão de Estado Reativo**: Sincronização automática entre transações, saldos e gráficos via RxJS.
* **Segurança e Infraestrutura**: Gerenciamento de tokens de autenticação via interceptors HTTP e integração com Firebase.

---

## 🧩 Micro Frontend Architecture & Data Flow

Diferente de uma abordagem estática, este Host utiliza **Dependency Inversion** para compartilhar dados entre MFEs. O Host provê as "portas" (Tokens) e os MFEs consomem os streams de dados.

### Estrutura de Camadas (Arquitetura Evoluída)

```text
mfe-host-app
│
├── home/                  # Componentes e seus view model contendo as regras de exibição de dados
│   └── models/
│  
├── port/                  # Contratos (Interfaces + Injection Tokens)
│   ├── screen.port.ts
│   ├── transaction.port.ts
│   ├── user.port.ts
│   └── transaction.token.ts
│
├── infra/                 # Adapters e Integrações com regras de negócio
│   ├── firebase/          # Implementações REST API (Firestore)
│   └── interceptors/      # AuthToken & ErrorHandling
│
└── ui/                    # ViewModels + ViewComponents
    └── welcome-card/      # Consome streams de saldo e transações
```

## 🧱 Clean Architecture & Reatividade

O projeto aplica **Clean Architecture** para isolar o Firebase (detalhe de infraestrutura) da UI (componentes).

---

## Responsabilidades Reativas

### 🖼 UI (ViewModels)
- Utilizam o padrão **MVVM** para expor dados à View através de **Observables**.
- Não manipulam o Firebase diretamente.
- Utilizam o **async pipe** para garantir performance e evitar *memory leaks*.

### 🔌 Infra (Firebase Adapters)
Implementam a lógica de persistência usando operadores avançados do **RxJS**:

- **switchMap**: Para encadear a criação de transações com o recarregamento do saldo.
- **tap**: Para disparar efeitos colaterais de atualização de estado interno (*BehaviorSubjects*).
- **catchError**: Para tratamento resiliente de permissões do Firestore.

---

## 🧠 SOLID Aplicado à Gestão de Estado
- **Single Responsibility (SRP)**:  
  O `BalanceFirebaseService` apenas gerencia o valor monetário; o `TransactionsFirebaseService` gerencia o histórico de transações;
  `UserFirebaseService` gerencia apenas questões como recuperação de dados do usuário logado.
- **Dependency Inversion (DIP)**:  
  A UI depende de um **InjectionToken (TRANSACTION)**, permitindo trocar a implementação do Firebase por um *Mock* em testes sem alterar um componente sequer.
- **Interface Segregation (ISP)**:  
  O componente de Saldo só “enxerga” o que é necessário para exibir o montante, ignorando complexidades do CRUD de transações.

---

## 🚀 Fluxo de Sincronização (Reatividade em Tempo Real)

Este projeto implementa o conceito de **Single Source of Truth (Fonte Única da Verdade)**:

1. **Ação**: O usuário salva uma nova transação no MFE de formulário.
2. **Persistência**: O `TransactionsFirebaseService` envia o dado para o Firebase.
3. **Difusão**: Através do operador **tap**, o Service dispara uma nova emissão no stream `transactions$`.
4. **Reação**:
   - O componente de **Extrato** reflete a nova linha instantaneamente.
   - O **WelcomeCard** (via ViewModel) recalcula o saldo total automaticamente.
   - O `BalanceFirebaseService` persiste o novo saldo calculado no banco de dados.

---

## 🚀 Getting Started

### Pré-requisitos

* Node.js 16+
* Angular CLI 16+
* MFEs (`mfe-navbar` e `mfe-home`) rodando localmente

---

### Instalação

```bash
npm install
```

---

### Executar a aplicação

```bash
npm start
```

A aplicação ficará disponível em:

```
http://localhost:4202
```
  
Para ver a aplicação completa rodando o ideal é clonar os 4 mfes ([mfe-host](https://github.com/GuilhermeFontanella/POS-TECH-MODULO-2-host-app), [mfe-home](https://github.com/GuilhermeFontanella/POS-TECH-MODULO-2-mfe-home), [mfe-navbar](https://github.com/GuilhermeFontanella/POS-TECH-MODULO-2-mfe-navbar) e [mfe-login](https://github.com/GuilhermeFontanella/POS-TECH-MODULO-4-mfe-login) )  
As aplicações ficarão disponíveis em:
```
http://localhost:4200  
http://localhost:4201  
http://localhost:4202
http://localhost:4203
```
---

## 🌍 Deploy

* Hospedado no **Azure** (Desconsiderar)
* Cada MFE possui pipeline independente
* Host não precisa ser redeployado para alterações internas dos MFEs

---
