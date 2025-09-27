# Guia de Breakpoints Responsivos - IEB La Luz

## Visão Geral

Este documento descreve os breakpoints responsivos configurados no projeto para garantir uma experiência otimizada em todos os dispositivos.

## Breakpoints Padrão

### Breakpoints Principais
- **xs**: `475px` - Dispositivos móveis pequenos (iPhone SE, etc.)
- **sm**: `640px` - Dispositivos móveis padrão (smartphones)
- **md**: `768px` - Tablets pequenos e móveis grandes
- **lg**: `1024px` - Laptops e tablets grandes
- **xl**: `1280px` - Desktops padrão
- **2xl**: `1536px` - Desktops grandes e monitores wide

### Breakpoints Intermediários
- **sm-md**: `720px` - Entre small e medium (transição suave)
- **md-lg**: `896px` - Entre medium e large (tablets grandes)
- **lg-xl**: `1152px` - Entre large e extra large (laptops grandes)
- **xl-2xl**: `1408px` - Entre extra large e 2x large (desktops grandes)

### Breakpoints Específicos para Tablets
- **tablet-sm**: `600px` - Tablets pequenos (iPad mini)
- **tablet-md**: `768px` - Tablets médios (iPad padrão)
- **tablet-lg**: `1024px` - Tablets grandes (iPad Pro)
- **tablet-xl**: `1200px` - Tablets extra grandes

### Breakpoints para Grid Otimizado
- **grid-sm**: `640px` - Grid 1 coluna -> 2 colunas
- **grid-md**: `768px` - Grid 2 colunas -> 3 colunas
- **grid-lg**: `1024px` - Grid 3 colunas -> 4 colunas
- **grid-xl**: `1280px` - Grid 4 colunas -> 5 colunas

## Breakpoints Específicos por Componente

### Navegação
- **nav**: `900px` - Transição entre menu mobile e desktop
  - `< nav:` = Menu mobile
  - `nav:` = Menu desktop

### Seção Hero
- **hero**: `768px` - Responsividade da seção principal
  - Usado para ajustar tamanhos de fonte e espaçamentos

### Grid de Cards
- **cards**: `1024px` - Layout de cards em grid
  - Usado para seções de ministérios, recursos, etc.

### Sidebar Admin
- **sidebar**: `1200px` - Sidebar do painel administrativo
  - Garante espaço adequado para conteúdo admin

## Uso Recomendado

### Para Textos
```tsx
// Títulos principais
className="text-5xl xs:text-6xl md:text-7xl lg:text-8xl"

// Subtítulos
className="text-xl sm:text-2xl md:text-3xl"

// Texto corpo
className="text-sm sm:text-base md:text-lg"
```

### Para Layouts
```tsx
// Grid responsivo com breakpoints de tablet
className="grid grid-cols-1 tablet-sm:grid-cols-2 tablet-lg:grid-cols-3"

// Grid com breakpoints específicos
className="grid grid-cols-1 grid-sm:grid-cols-2 grid-md:grid-cols-3"

// Navegação
className="hidden nav:flex" // Desktop
className="nav:hidden"      // Mobile

// Espaçamentos
className="px-4 sm:px-6 tablet-md:px-8 lg:px-12"
```

### Para Componentes Específicos
```tsx
// Header
className="hidden sm-md:flex" // CTA buttons
className="nav:hidden"        // Mobile menu

// Footer
className="grid grid-cols-1 sm-md:grid-cols-2 md-lg:grid-cols-3 lg:grid-cols-6"
```

## Estratégia de Implementação

### 1. Mobile First
Sempre comece com estilos para mobile e use breakpoints para melhorar em telas maiores:

```tsx
// ❌ Desktop first (não recomendado)
className="lg:text-sm md:text-base sm:text-lg text-xl"

// ✅ Mobile first (recomendado)
className="text-xl sm:text-lg md:text-base lg:text-sm"
```

### 2. Breakpoints Intermediários
Use breakpoints intermediários para transições mais suaves:

```tsx
// ❌ Salto muito grande
className="text-sm lg:text-xl"

// ✅ Transição suave
className="text-sm sm:text-base md:text-lg lg:text-xl"
```

### 3. Componentes Específicos
Use breakpoints específicos para componentes que precisam de controle fino:

```tsx
// Navegação
className="hidden nav:flex"

// Cards
className="grid grid-cols-1 cards:grid-cols-3"
```

## Testando Responsividade

### Dispositivos de Teste
- **Mobile**: 320px - 640px
- **Tablet**: 641px - 1024px  
- **Desktop**: 1025px - 1920px

### Ferramentas Recomendadas
- Chrome DevTools (F12)
- Firefox Responsive Design Mode
- BrowserStack para testes reais

## Exemplos Práticos

### Header Responsivo
```tsx
<nav className="hidden nav:flex items-center space-x-2">
  {/* Menu desktop */}
</nav>

<Button className="nav:hidden">
  {/* Botão mobile */}
</Button>
```

### Grid de Cards
```tsx
<div className="grid grid-cols-1 tablet-sm:grid-cols-2 tablet-lg:grid-cols-3 gap-8">
  {/* Cards responsivos */}
</div>
```

### Texto Responsivo
```tsx
<h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
  Título Principal
</h1>
```

## Manutenção

### Adicionando Novos Breakpoints
1. Adicione no `tailwind.config.ts`:
```ts
screens: {
  'custom': '1234px',
}
```

2. Use no código:
```tsx
className="hidden custom:block"
```

### Atualizando Breakpoints Existentes
- Sempre teste em dispositivos reais
- Considere o impacto em componentes existentes
- Documente mudanças significativas

## Conclusão

Os breakpoints intermediários proporcionam:
- ✅ Transições mais suaves entre dispositivos
- ✅ Melhor controle sobre layouts específicos
- ✅ Experiência otimizada em todos os tamanhos de tela
- ✅ Manutenção mais fácil do código responsivo

Para dúvidas ou sugestões, consulte a equipe de desenvolvimento.
