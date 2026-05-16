# 🏗️ SMARTFLOW SYSTEMS ARCHITECTURE DIAGRAMS

## System Overview

```mermaid
graph TB
    subgraph "Frontend Layer"
        WEB[Web Dashboard<br/>React 19]
        MOBILE[Mobile App<br/>React Native]
    end
    
    subgraph "API Gateway Layer"
        GATEWAY[API Gateway<br/>Express + Auth]
        RATE[Rate Limiter]
        CACHE[Redis Cache]
    end
    
    subgraph "Service Layer"
        DASH[Dashboard Service<br/>Analytics & Billing]
        SOCIAL[Social Booster<br/>AI Content & Publishing]
        QUERY[Query Engine<br/>NLP Analytics]
        CRM[CRM Service<br/>Contacts & Pipeline]
        GROWTH[Growth Toolkit<br/>Templates & Campaigns]
    end
    
    subgraph "Integration Layer"
        STRIPE[Stripe API]
        TWITTER[Twitter API]
        LINKEDIN[LinkedIn API]
        GMAIL[Gmail API]
        ANALYTICS[Google Analytics]
    end
    
    subgraph "Data Layer"
        DB[(PostgreSQL<br/>Multi-Tenant)]
        REDIS[(Redis<br/>Cache & Queue)]
        S3[S3 Storage]
    end
    
    subgraph "AI Layer"
        GPT4[GPT-4<br/>Content Gen]
        CLAUDE[Claude<br/>Analysis]
    end
    
    WEB --> GATEWAY
    MOBILE --> GATEWAY
    
    GATEWAY --> RATE
    GATEWAY --> CACHE
    
    GATEWAY --> DASH
    GATEWAY --> SOCIAL
    GATEWAY --> QUERY
    GATEWAY --> CRM
    GATEWAY --> GROWTH
    
    SOCIAL --> TWITTER
    SOCIAL --> LINKEDIN
    SOCIAL --> GPT4
    
    QUERY --> CLAUDE
    QUERY --> GPT4
    
    CRM --> GMAIL
    CRM --> ANALYTICS
    
    DASH --> STRIPE
    
    DASH --> DB
    SOCIAL --> DB
    QUERY --> DB
    CRM --> DB
    GROWTH --> DB
    
    SOCIAL --> S3
    GROWTH --> S3
    
    CACHE --> REDIS
    SOCIAL --> REDIS
    QUERY --> REDIS
```

---

## Multi-Tenant Data Isolation

```mermaid
graph LR
    subgraph "Tenant A"
        A_USER[Users]
        A_DATA[Data]
        A_SUB[Subscription]
    end
    
    subgraph "Tenant B"
        B_USER[Users]
        B_DATA[Data]
        B_SUB[Subscription]
    end
    
    subgraph "Shared Database"
        DB[(PostgreSQL)]
    end
    
    A_USER -->|tenant_id=A| DB
    A_DATA -->|tenant_id=A| DB
    A_SUB -->|tenant_id=A| DB
    
    B_USER -->|tenant_id=B| DB
    B_DATA -->|tenant_id=B| DB
    B_SUB -->|tenant_id=B| DB
    
    style A_USER fill:#FFD700
    style A_DATA fill:#FFD700
    style A_SUB fill:#FFD700
    
    style B_USER fill:#4169E1
    style B_DATA fill:#4169E1
    style B_SUB fill:#4169E1
```

---

## Event-Driven Architecture

```mermaid
sequenceDiagram
    participant User
    participant Dashboard
    participant EventBus
    participant Social
    participant CRM
    participant Query
    
    User->>Dashboard: Sign Up
    Dashboard->>EventBus: Publish user.created
    
    EventBus->>Social: Subscribe to user.created
    Social->>Social: Create social profile
    Social->>EventBus: Publish social.profile.created
    
    EventBus->>CRM: Subscribe to user.created
    CRM->>CRM: Create contact
    CRM->>EventBus: Publish crm.contact.created
    
    EventBus->>Query: Subscribe to user.created
    Query->>Query: Initialize analytics
    
    Dashboard->>User: Welcome email
```

---

## Social Booster Flow

```mermaid
graph TB
    START[User Creates Post] --> AI{Use AI?}
    
    AI -->|Yes| GENERATE[GPT-4 Generate Content]
    AI -->|No| MANUAL[User Writes Content]
    
    GENERATE --> APPROVE{Approve?}
    MANUAL --> APPROVE
    
    APPROVE -->|Edit| GENERATE
    APPROVE -->|Yes| SCHEDULE{Schedule?}
    
    SCHEDULE -->|Now| PUBLISH[Publish to Platforms]
    SCHEDULE -->|Later| QUEUE[Add to Queue]
    
    QUEUE -->|Time Reached| PUBLISH
    
    PUBLISH --> TWITTER[Twitter]
    PUBLISH --> LINKEDIN[LinkedIn]
    PUBLISH --> FACEBOOK[Facebook]
    PUBLISH --> INSTAGRAM[Instagram]
    
    TWITTER --> ANALYTICS[Collect Analytics]
    LINKEDIN --> ANALYTICS
    FACEBOOK --> ANALYTICS
    INSTAGRAM --> ANALYTICS
    
    ANALYTICS --> DASHBOARD[Update Dashboard]
    DASHBOARD --> END[Show Results]
```

---

## Query Engine Flow

```mermaid
graph TB
    USER[User Asks Question] --> NLP[GPT-4 Parse Query]
    
    NLP --> SQL[Generate SQL]
    
    SQL --> VALIDATE{Valid?}
    
    VALIDATE -->|No| ERROR[Return Error]
    VALIDATE -->|Yes| EXECUTE[Execute on Database]
    
    EXECUTE --> DATA[Get Results]
    
    DATA --> ANALYZE[Claude Analyze]
    
    ANALYZE --> VIZ[Select Visualization]
    
    VIZ --> CHART{Chart Type}
    
    CHART -->|Time Series| LINE[Line Chart]
    CHART -->|Comparison| BAR[Bar Chart]
    CHART -->|Distribution| PIE[Pie Chart]
    CHART -->|Relationship| SCATTER[Scatter Plot]
    
    LINE --> INSIGHTS[Generate AI Insights]
    BAR --> INSIGHTS
    PIE --> INSIGHTS
    SCATTER --> INSIGHTS
    
    INSIGHTS --> DISPLAY[Display to User]
    
    ERROR --> DISPLAY
```

---

## CRM Pipeline Flow

```mermaid
graph LR
    LEAD[Lead] --> QUALIFIED{Qualified?}
    
    QUALIFIED -->|No| NURTURE[Nurture Campaign]
    QUALIFIED -->|Yes| DEMO[Schedule Demo]
    
    NURTURE --> QUALIFIED
    
    DEMO --> PROPOSAL[Send Proposal]
    
    PROPOSAL --> NEGOTIATE{Negotiate?}
    
    NEGOTIATE -->|Yes| NEGOTIATE_LOOP[Negotiation]
    NEGOTIATE -->|No| DECISION{Decision}
    
    NEGOTIATE_LOOP --> PROPOSAL
    
    DECISION -->|Won| WON[Closed Won 🎉]
    DECISION -->|Lost| LOST[Closed Lost]
    
    WON --> STRIPE[Create Stripe Customer]
    WON --> ONBOARD[Start Onboarding]
    
    LOST --> FOLLOWUP[6-Month Follow-up]
    FOLLOWUP --> LEAD
    
    style WON fill:#00FF00
    style LOST fill:#FF0000
```

---

## Subscription & Billing Flow

```mermaid
sequenceDiagram
    participant User
    participant Dashboard
    participant Stripe
    participant Webhook
    participant DB
    participant Email
    
    User->>Dashboard: Click "Upgrade to Pro"
    Dashboard->>Stripe: Create Checkout Session
    Stripe->>User: Redirect to Checkout
    User->>Stripe: Enter Payment Info
    Stripe->>Webhook: subscription.created
    Webhook->>DB: Update subscription
    DB->>Dashboard: Refresh UI
    Dashboard->>User: Show Pro Features
    Email->>User: Welcome to Pro email
    
    Note over Stripe,Webhook: Monthly billing cycle
    
    Stripe->>Webhook: invoice.payment_succeeded
    Webhook->>DB: Log payment
    Email->>User: Receipt email
    
    Note over Stripe,Webhook: Usage limit reached
    
    Dashboard->>User: 80% usage alert
    User->>Dashboard: View upgrade options
```

---

## Authentication & Authorization Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Gateway
    participant Auth
    participant Service
    participant DB
    
    User->>Frontend: Login (email + password)
    Frontend->>Gateway: POST /auth/login
    Gateway->>Auth: Validate credentials
    Auth->>DB: Check user exists
    DB->>Auth: User data
    Auth->>Auth: Verify password (bcrypt)
    Auth->>Auth: Generate JWT token
    Auth->>Gateway: Return token
    Gateway->>Frontend: { token, user }
    Frontend->>Frontend: Store token in localStorage
    
    Note over User,DB: Authenticated requests
    
    User->>Frontend: Request protected resource
    Frontend->>Gateway: GET /api/data (Authorization: Bearer token)
    Gateway->>Auth: Validate token
    Auth->>Auth: Decode JWT
    Auth->>Auth: Check expiration
    Auth->>Gateway: { userId, tenantId, role }
    Gateway->>Service: Forward request (+ user context)
    Service->>DB: Query data WHERE tenant_id = ?
    DB->>Service: Return tenant data only
    Service->>Gateway: Response
    Gateway->>Frontend: Response
    Frontend->>User: Display data
```

---

## Deployment Architecture

```mermaid
graph TB
    subgraph "CDN Layer"
        CF[Cloudflare CDN]
    end
    
    subgraph "Load Balancer"
        LB[AWS ALB]
    end
    
    subgraph "Application Servers"
        APP1[App Server 1<br/>EC2 t3.medium]
        APP2[App Server 2<br/>EC2 t3.medium]
        APP3[App Server 3<br/>EC2 t3.medium]
    end
    
    subgraph "Worker Servers"
        WORKER1[Queue Worker 1]
        WORKER2[Queue Worker 2]
    end
    
    subgraph "Database Layer"
        PRIMARY[(Primary DB<br/>RDS PostgreSQL)]
        REPLICA[(Read Replica<br/>RDS PostgreSQL)]
    end
    
    subgraph "Cache Layer"
        REDIS_MASTER[(Redis Master<br/>ElastiCache)]
        REDIS_REPLICA[(Redis Replica<br/>ElastiCache)]
    end
    
    subgraph "Storage"
        S3_BUCKET[S3 Bucket<br/>Files & Uploads]
    end
    
    subgraph "Monitoring"
        SENTRY[Sentry<br/>Error Tracking]
        DATADOG[Datadog<br/>Metrics & Logs]
    end
    
    USER[Users] --> CF
    CF --> LB
    
    LB --> APP1
    LB --> APP2
    LB --> APP3
    
    APP1 --> PRIMARY
    APP2 --> PRIMARY
    APP3 --> PRIMARY
    
    APP1 --> REPLICA
    APP2 --> REPLICA
    APP3 --> REPLICA
    
    APP1 --> REDIS_MASTER
    APP2 --> REDIS_MASTER
    APP3 --> REDIS_MASTER
    
    REDIS_MASTER --> REDIS_REPLICA
    
    WORKER1 --> REDIS_MASTER
    WORKER2 --> REDIS_MASTER
    
    WORKER1 --> PRIMARY
    WORKER2 --> PRIMARY
    
    APP1 --> S3_BUCKET
    APP2 --> S3_BUCKET
    APP3 --> S3_BUCKET
    
    APP1 --> SENTRY
    APP2 --> SENTRY
    APP3 --> SENTRY
    
    APP1 --> DATADOG
    APP2 --> DATADOG
    APP3 --> DATADOG
```

---

## Data Flow: User Journey

```mermaid
graph TB
    START[User Visits Landing Page] --> SIGNUP[Sign Up]
    
    SIGNUP --> EVENT1[Event: user.created]
    
    EVENT1 --> WELCOME[Send Welcome Email]
    EVENT1 --> ANALYTICS[Track in Analytics]
    EVENT1 --> CRM_CREATE[Create CRM Contact]
    
    WELCOME --> ONBOARD[Onboarding Tour]
    
    ONBOARD --> CONNECT[Connect First Integration]
    
    CONNECT --> EVENT2[Event: integration.connected]
    
    EVENT2 --> SOCIAL_INIT[Initialize Social Accounts]
    EVENT2 --> MILESTONE[Achievement: First Integration]
    
    SOCIAL_INIT --> POST[Create First Post]
    
    POST --> EVENT3[Event: social.post.published]
    
    EVENT3 --> ENGAGEMENT[Track Engagement]
    
    ENGAGEMENT --> USAGE[Monitor Usage]
    
    USAGE --> LIMIT{Approaching Limit?}
    
    LIMIT -->|Yes| UPSELL[Show Upgrade Prompt]
    LIMIT -->|No| CONTINUE[Continue Using]
    
    UPSELL --> UPGRADE{Upgrade?}
    
    UPGRADE -->|Yes| STRIPE[Stripe Checkout]
    UPGRADE -->|No| CONTINUE
    
    STRIPE --> EVENT4[Event: subscription.created]
    
    EVENT4 --> PRO_FEATURES[Unlock Pro Features]
    EVENT4 --> COMMISSION[Track Referral Commission]
    
    PRO_FEATURES --> POWER_USER[Power User Journey]
    
    CONTINUE --> USAGE
```

---

## Microservices Communication

```mermaid
graph TB
    subgraph "Synchronous (REST)"
        SYNC_DASH[Dashboard] -->|HTTP/JSON| SYNC_SOCIAL[Social Service]
        SYNC_DASH -->|HTTP/JSON| SYNC_QUERY[Query Service]
        SYNC_DASH -->|HTTP/JSON| SYNC_CRM[CRM Service]
    end
    
    subgraph "Asynchronous (Events)"
        ASYNC_DASH[Dashboard] -->|Publish| EVENT_BUS[Event Bus<br/>Redis Pub/Sub]
        EVENT_BUS -->|Subscribe| ASYNC_SOCIAL[Social Service]
        EVENT_BUS -->|Subscribe| ASYNC_QUERY[Query Service]
        EVENT_BUS -->|Subscribe| ASYNC_CRM[CRM Service]
        EVENT_BUS -->|Subscribe| ASYNC_GROWTH[Growth Service]
    end
    
    subgraph "Background Jobs"
        QUEUE[Job Queue<br/>Bull/Redis] -->|Process| WORKER1[Worker 1]
        QUEUE -->|Process| WORKER2[Worker 2]
        
        WORKER1 -->|Schedule Posts| ASYNC_SOCIAL
        WORKER1 -->|Send Emails| ASYNC_GROWTH
        
        WORKER2 -->|Sync Data| ASYNC_CRM
        WORKER2 -->|Generate Reports| ASYNC_QUERY
    end
```

---

## Security Layers

```mermaid
graph TB
    USER[User Request] --> WAF[Web Application Firewall]
    
    WAF --> SSL[SSL/TLS Termination]
    
    SSL --> DDOS[DDoS Protection]
    
    DDOS --> RATE[Rate Limiting]
    
    RATE --> AUTH{Authenticated?}
    
    AUTH -->|No| LOGIN[Redirect to Login]
    AUTH -->|Yes| TOKEN[Validate JWT Token]
    
    TOKEN --> RBAC{Has Permission?}
    
    RBAC -->|No| FORBIDDEN[403 Forbidden]
    RBAC -->|Yes| TENANT{Correct Tenant?}
    
    TENANT -->|No| FORBIDDEN
    TENANT -->|Yes| SANITIZE[Input Sanitization]
    
    SANITIZE --> VALIDATE[Input Validation]
    
    VALIDATE --> SQL_SAFE{SQL Injection Safe?}
    
    SQL_SAFE -->|No| ERROR[400 Bad Request]
    SQL_SAFE -->|Yes| XSS_SAFE{XSS Safe?}
    
    XSS_SAFE -->|No| ERROR
    XSS_SAFE -->|Yes| PROCESS[Process Request]
    
    PROCESS --> AUDIT[Log to Audit Trail]
    
    AUDIT --> RESPONSE[Return Response]
    
    RESPONSE --> ENCRYPT[Encrypt Sensitive Data]
    
    ENCRYPT --> USER
```

---

## Growth Funnel

```mermaid
graph TB
    VISITOR[Website Visitor<br/>10,000/mo] --> SIGNUP{Sign Up?}
    
    SIGNUP -->|2%| TRIAL[Free Trial Users<br/>200/mo]
    SIGNUP -->|98%| LOST1[Bounce]
    
    TRIAL --> ACTIVATE{Activate?}
    
    ACTIVATE -->|60%| ACTIVE[Active Users<br/>120/mo]
    ACTIVATE -->|40%| LOST2[Inactive]
    
    ACTIVE --> INTEGRATE{Connect Integration?}
    
    INTEGRATE -->|80%| ENGAGED[Engaged Users<br/>96/mo]
    INTEGRATE -->|20%| LOST3[Not Engaged]
    
    ENGAGED --> LIMIT{Hit Limit?}
    
    LIMIT -->|50%| UPSELL[See Upgrade Prompt<br/>48/mo]
    LIMIT -->|50%| CONTINUE[Continue Free]
    
    UPSELL --> CONVERT{Upgrade?}
    
    CONVERT -->|25%| PRO[Pro Customers<br/>12/mo]
    CONVERT -->|75%| LOST4[Decline]
    
    PRO --> ENTERPRISE{Need More?}
    
    ENTERPRISE -->|15%| ENT[Enterprise Customers<br/>2/mo]
    ENTERPRISE -->|85%| STAY_PRO[Stay on Pro]
    
    PRO --> CHURN{Churn?}
    CHURN -->|5%| LOST5[Cancelled]
    CHURN -->|95%| RENEW[Renewed]
    
    RENEW --> PRO
    
    style TRIAL fill:#FFD700
    style ACTIVE fill:#FFD700
    style ENGAGED fill:#FFD700
    style PRO fill:#00FF00
    style ENT fill:#00FF00
    style LOST1 fill:#FF0000
    style LOST2 fill:#FF0000
    style LOST3 fill:#FF0000
    style LOST4 fill:#FF0000
    style LOST5 fill:#FF0000
```

---

## Tech Stack Overview

```mermaid
mindmap
  root((SmartFlow<br/>Systems))
    Frontend
      React 19
      TypeScript
      Tailwind CSS
      Vite
      shadcn/ui
    Backend
      Node.js 20+
      Express.js
      PostgreSQL
      Redis
      Drizzle ORM
    AI/ML
      OpenAI GPT-4
      Anthropic Claude
      Hugging Face
    Infrastructure
      AWS EC2
      AWS RDS
      AWS S3
      Cloudflare
      Vercel
    Payments
      Stripe
      Paddle (backup)
    Analytics
      Mixpanel
      Google Analytics
      Datadog
    Communication
      SendGrid
      Twilio
      Slack API
    Social
      Twitter API
      LinkedIn API
      Facebook Graph
      Instagram Graph
```

---

## Roadmap Timeline

```mermaid
gantt
    title SmartFlow Systems Implementation Roadmap
    dateFormat YYYY-MM-DD
    section Phase 1
    Dashboard Core           :done, p1, 2026-01-01, 30d
    UI/UX Polish            :done, p1b, 2026-01-15, 15d
    
    section Phase 2
    Shared Infrastructure    :active, p2, 2026-05-16, 28d
    Event Bus               :p2a, 2026-05-16, 14d
    API Gateway             :p2b, 2026-05-23, 14d
    
    section Phase 3
    Social Booster          :p3, 2026-06-13, 28d
    OAuth Integration       :p3a, 2026-06-13, 7d
    AI Content Gen          :p3b, 2026-06-20, 14d
    Analytics               :p3c, 2026-06-27, 7d
    
    section Phase 4
    Query Engine            :p4, 2026-07-11, 28d
    NLP Parser              :p4a, 2026-07-11, 14d
    Visualization           :p4b, 2026-07-18, 14d
    
    section Phase 5
    CRM Integration         :p5, 2026-08-08, 28d
    Contact Management      :p5a, 2026-08-08, 14d
    Pipeline & Scoring      :p5b, 2026-08-15, 14d
    
    section Phase 6
    Growth Toolkit          :p6, 2026-09-05, 28d
    Template Library        :p6a, 2026-09-05, 14d
    Campaign Builder        :p6b, 2026-09-12, 14d
    
    section Phase 7
    Polish & Launch         :p7, 2026-10-03, 28d
    Performance Optimization:p7a, 2026-10-03, 7d
    Security Audit          :p7b, 2026-10-10, 7d
    Documentation           :p7c, 2026-10-17, 7d
    Public Launch           :milestone, 2026-10-31, 1d
```

---

## Component Dependencies

```mermaid
graph LR
    subgraph "Core Dependencies"
        AUTH[Shared Auth]
        DB[Database Schema]
        EVENT[Event Bus]
    end
    
    subgraph "Service Dependencies"
        DASH[Dashboard] --> AUTH
        DASH --> DB
        DASH --> EVENT
        
        SOCIAL[Social Booster] --> AUTH
        SOCIAL --> DB
        SOCIAL --> EVENT
        
        QUERY[Query Engine] --> AUTH
        QUERY --> DB
        QUERY --> EVENT
        
        CRM[CRM] --> AUTH
        CRM --> DB
        CRM --> EVENT
        
        GROWTH[Growth Toolkit] --> AUTH
        GROWTH --> DB
        GROWTH --> EVENT
    end
    
    subgraph "External Dependencies"
        STRIPE[Stripe]
        GPT[GPT-4]
        CLAUDE[Claude]
        
        DASH --> STRIPE
        SOCIAL --> GPT
        QUERY --> GPT
        QUERY --> CLAUDE
    end
```

---

## Cost Structure (Per Month)

```mermaid
pie title Monthly Operating Costs ($)
    "AWS Infrastructure" : 500
    "Database (RDS)" : 200
    "Redis (ElastiCache)" : 150
    "S3 Storage" : 50
    "Cloudflare" : 20
    "OpenAI API" : 300
    "Anthropic Claude" : 200
    "SendGrid" : 100
    "Monitoring (Datadog)" : 150
    "Stripe Fees" : 150
    "Domain & SSL" : 30
```

**Total: ~$1,850/month at 100 customers**  
**Break-even: ~48 Pro customers or 10 Enterprise customers**

---

These diagrams visualize the complete SmartFlow Systems architecture, showing how all components work together as one unified ecosystem! 🚀
