# Melhorias na Hierarquia Visual

Este documento descreve as melhorias implementadas na hierarquia visual do projeto IEB La Luz Málaga, incluindo breadcrumbs, indicadores de progresso e micro-interações.

## Componentes Implementados

### 1. Breadcrumbs (`src/components/ui/breadcrumbs.tsx`)

Componente de navegação hierárquica que mostra o caminho atual do usuário no site.

#### Características:
- Navegação hierárquica clara
- Suporte a ícones personalizados
- Responsivo e acessível
- Integração com Next.js Link

#### Uso:
```tsx
import { Breadcrumbs } from "@/components/ui/breadcrumbs"

const breadcrumbItems = [
  { label: "Eventos", href: "/eventos" },
  { label: "Detalhes do Evento" }
]

<Breadcrumbs 
  items={breadcrumbItems}
  homeLabel="Início"
  homeHref="/"
/>
```

### 2. Progress Indicator (`src/components/ui/progress-indicator.tsx`)

Indicador de progresso para formulários e processos multi-etapas.

#### Características:
- Orientação horizontal ou vertical
- Estados: completado, atual, próximo
- Suporte a descrições
- Animações suaves
- Barra de progresso visual

#### Uso:
```tsx
import { ProgressIndicator } from "@/components/ui/progress-indicator"

const steps = [
  { 
    id: 'step1', 
    label: 'Informações Pessoais', 
    description: 'Dados básicos',
    status: 'completed' 
  },
  { 
    id: 'step2', 
    label: 'Endereço', 
    description: 'Localização',
    status: 'current' 
  },
  { 
    id: 'step3', 
    label: 'Preferências', 
    description: 'Interesses',
    status: 'upcoming' 
  }
]

<ProgressIndicator 
  steps={steps}
  orientation="horizontal"
  showStepNumbers={true}
/>
```

### 3. Micro-interactions (`src/components/ui/micro-interactions.tsx`)

Coleção de componentes para feedback visual e interações.

#### Componentes Disponíveis:

##### HoverCard
Efeito de hover com escala e sombra.

```tsx
import { HoverCard } from "@/components/ui/micro-interactions"

<HoverCard scale={true} shadow={true}>
  <Card>Conteúdo do card</Card>
</HoverCard>
```

##### Shake
Animação de erro para campos de formulário.

```tsx
import { Shake } from "@/components/ui/micro-interactions"

<Shake active={hasError}>
  <Input {...props} />
</Shake>
```

##### SuccessCheck
Ícone de sucesso animado.

```tsx
import { SuccessCheck } from "@/components/ui/micro-interactions"

<SuccessCheck size="lg" />
```

##### LoadingSpinner
Spinner de carregamento personalizável.

```tsx
import { LoadingSpinner } from "@/components/ui/micro-interactions"

<LoadingSpinner size="md" color="text-primary" />
```

##### FadeIn
Animação de entrada suave.

```tsx
import { FadeIn } from "@/components/ui/micro-interactions"

<FadeIn delay={100} duration={300}>
  <div>Conteúdo que aparece suavemente</div>
</FadeIn>
```

### 4. Formulário com Progresso (`src/components/ui/form-with-progress.tsx`)

Exemplo completo de formulário multi-etapas com indicador de progresso.

#### Características:
- Formulário em 4 etapas
- Validação por etapa
- Navegação entre etapas
- Feedback visual
- Animações de transição

## Implementações nas Páginas

### Páginas com Breadcrumbs:
- `/contato` - Navegação para página de contato
- `/eventos` - Navegação para página de eventos
- `/sermoes` - Navegação para página de sermões
- `/sobre` - Navegação para página sobre nós
- `/recursos` - Navegação para página de recursos

### Página de Contato Melhorada:
- Breadcrumbs integrados
- Indicador de progresso no formulário
- Micro-interações em campos de erro
- Animações de sucesso
- Cards com efeitos hover

## Animações CSS Adicionadas

### Arquivo: `src/app/globals.css`

#### Animações Implementadas:
- `@keyframes ripple` - Efeito ripple para botões
- `@keyframes shake` - Animação de erro
- `@keyframes checkmark` - Animação de checkmark
- `@keyframes fadeInUp` - Entrada suave de baixo para cima
- `@keyframes slideInRight` - Entrada da direita
- `@keyframes bounceIn` - Entrada com bounce
- `@keyframes loading` - Efeito de carregamento

#### Classes Utilitárias:
- `.animate-ripple` - Aplica animação ripple
- `.animate-shake` - Aplica animação de erro
- `.animate-fade-in-up` - Entrada suave
- `.animate-slide-in-right` - Entrada da direita
- `.animate-bounce-in` - Entrada com bounce
- `.interactive` - Transições suaves para elementos interativos
- `.focus-ring` - Estilos de foco acessíveis
- `.loading` - Estado de carregamento

## Melhorias no Componente Button

### Arquivo: `src/components/ui/button.tsx`

#### Adicionado:
- Transições suaves (`transition-all duration-200`)
- Efeito hover com escala (`hover:scale-105`)
- Efeito active com escala (`active:scale-95`)

## Benefícios das Melhorias

### 1. Navegação Melhorada
- **Breadcrumbs**: Orientação clara do usuário no site
- **Hierarquia visual**: Estrutura de navegação intuitiva

### 2. Feedback Visual
- **Indicadores de progresso**: Usuário sabe onde está no processo
- **Micro-interações**: Feedback imediato para ações
- **Animações**: Transições suaves e profissionais

### 3. Experiência do Usuário
- **Formulários intuitivos**: Progresso claro em formulários longos
- **Estados visuais**: Loading, sucesso, erro bem definidos
- **Acessibilidade**: Foco e navegação por teclado

### 4. Profissionalismo
- **Design moderno**: Interface atual e atrativa
- **Consistência**: Padrões visuais uniformes
- **Performance**: Animações otimizadas

## Como Usar

### 1. Adicionar Breadcrumbs a uma Nova Página:
```tsx
import { Breadcrumbs } from "@/components/ui/breadcrumbs"

const breadcrumbItems = [
  { label: "Nova Página" }
]

// No JSX
<div className="mb-6">
  <Breadcrumbs items={breadcrumbItems} />
</div>
```

### 2. Criar Formulário com Progresso:
```tsx
import { FormWithProgress } from "@/components/ui/form-with-progress"

const handleSubmit = async (data) => {
  // Lógica de envio
}

<FormWithProgress onSubmit={handleSubmit} />
```

### 3. Adicionar Micro-interações:
```tsx
import { HoverCard, Shake, SuccessCheck } from "@/components/ui/micro-interactions"

// Card com hover
<HoverCard>
  <Card>Conteúdo</Card>
</HoverCard>

// Campo com animação de erro
<Shake active={hasError}>
  <Input {...props} />
</Shake>

// Ícone de sucesso
<SuccessCheck size="lg" />
```

## Próximos Passos

1. **Integrar em mais páginas**: Aplicar breadcrumbs em todas as páginas internas
2. **Formulários complexos**: Usar o sistema de progresso em formulários de registro
3. **Mais micro-interações**: Adicionar animações em outros componentes
4. **Testes de usabilidade**: Validar melhorias com usuários reais
5. **Otimizações**: Ajustar performance das animações conforme necessário

## Considerações Técnicas

- **Performance**: Animações otimizadas com CSS puro
- **Acessibilidade**: Suporte a navegação por teclado e screen readers
- **Responsividade**: Componentes adaptáveis a diferentes tamanhos de tela
- **Compatibilidade**: Funciona em navegadores modernos
- **Manutenibilidade**: Código modular e reutilizável
