# IEB La Luz Málaga

Sitio web oficial de la Iglesia Evangélica Bautista La Luz en Málaga.

## 🎯 Objetivo do Projeto

Este projeto tem como objetivo melhorar o site da Iglesia Evangélica Bautista La Luz Málaga (https://ieblaluzmalaga.es/) com base nas melhores práticas dos sites de igrejas batistas do mundo, **mantendo todas as informações atuais e funcionalidades existentes**.

### 📋 Objetivos Específicos
- Preservar 100% do conteúdo atual do site original
- Implementar design moderno e responsivo
- Adicionar funcionalidades baseadas em melhores práticas internacionais
- Melhorar performance e SEO
- Criar experiência de usuário excepcional
- Implementar recursos de engajamento da comunidade

## ✨ Características Atuais

### 🏗️ Arquitetura
- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipado estático para maior confiabilidade
- **Tailwind CSS** - Estilos utilitários e design system
- **Prisma** - ORM para base de dados
- **Supabase** - Base de dados PostgreSQL e autenticação
- **Lucide React** - Iconos modernos

### 📄 Páginas Implementadas
- **Inicio** - Hero section, transmissão ao vivo, horários e ministérios
- **Sobre** - Missão, visão, história, valores e liderança
- **Sermões** - Biblioteca de pregações com áudio e transcrições
- **Eventos** - Agenda completa de eventos e atividades
- **Recursos** - Busca bíblica, devocionais e materiais para download
- **Contato** - Formulário de contato e informações da iglesia

### 🔧 Funcionalidades Técnicas
- **Design Responsivo** - Adaptável para mobile, tablet e desktop
- **Dark Mode** - Suporte para modo escuro
- **Componentes Reutilizáveis** - Sistema de design consistente
- **APIs Integradas** - Rotas para bíblia, contato, eventos e sermões
- **Base de Dados** - Estrutura completa com Prisma + Supabase

## 📊 Informações Preservadas da Iglesia

### 🏛️ Dados Oficiais
- **Nombre**: Iglesia Evangélica Bautista La Luz
- **Ubicación**: Málaga, España
- **CIF**: R2900286B
- **Ministerio de Justicia e FEREDE**: nº 016332

### ⏰ Horarios de Culto
- **Domingo 11:00** - Estudio Bíblico (Presencial)
- **Domingo 18:00** - Culto de la Tarde (Transmisión en directo)

### 📺 Transmisión en Vivo
- Integración con YouTube Live
- Horario: Domingos 18:00 CET
- Acceso directo al canal de YouTube

### 📚 Recursos Espirituales
- **Devocionales**: La Buena Semilla, Guía UMMBE, Revista Unidos UEBE
- **Proverbio del día** y **Verso de oro**
- **Búsqueda Bíblica** integrada
- **Enlaces de Interés**: UEBE, Facultad Protestante, FEREDE, etc.

## 🚀 Plan de Mejoras

### Fase 1 - Fundamentos
- [x] Análisis del estado actual
- [x] Documentación de requisitos
- [ ] Optimización de performance y SEO
- [ ] Implementación de PWA
- [ ] Mejoras en el diseño visual

### Fase 2 - Contenido
- [ ] Player de vídeo integrado
- [ ] Galería de fotos
- [ ] Sistema de newsletter
- [ ] Integración con redes sociales

### Fase 3 - Funcionalidades Avanzadas
- [ ] Sistema de donaciones
- [ ] Chat en vivo
- [ ] Sistema de miembros
- [ ] Recursos espirituales avanzados

### Fase 4 - Optimización
- [ ] Analytics y insights
- [ ] A/B testing
- [ ] Internacionalización
- [ ] Pruebas de usabilidad

## 🛠️ Configuración

Para configurar el proyecto, consulte el archivo [README-SUPABASE.md](./README-SUPABASE.md) para instrucciones detalladas de configuración con Supabase.

## 🚀 Desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Generar cliente Prisma
npm run db:generate

# Aplicar migraciones
npm run db:push
```

## 📁 Estructura del Proyecto

```
src/
├── app/                 # Páginas y rutas de la aplicación
│   ├── page.tsx         # Página principal
│   ├── sobre/           # Información sobre la iglesia
│   ├── sermoes/         # Biblioteca de sermones
│   ├── eventos/         # Eventos y actividades
│   ├── recursos/        # Recursos espirituales
│   └── contato/         # Formulario de contacto
├── components/          # Componentes reutilizables
│   ├── layout/          # Header y Footer
│   └── ui/              # Componentes base de UI
├── lib/                 # Utilidades y configuración
└── generated/          # Cliente Prisma generado
```

## 📈 Métricas de Éxito

- **Performance**: Core Web Vitals > 90
- **Engagement**: Aumento del 50% en tiempo en página
- **Conversión**: 25% más visitantes se convierten en miembros
- **Mobile**: 80% del tráfico mobile con buena experiencia
- **Accesibilidad**: Score WCAG 2.1 AA

## 🔗 Enlaces Útiles

- [Sitio Original](https://ieblaluzmalaga.es/)
- [Documentación de Mejoras](./PROJETO-MELHORIAS.md)
- [Configuración Supabase](./README-SUPABASE.md)

## 📞 Contacto

Para más información sobre el proyecto o la iglesia:

- **Teléfono**: +34 952 23 04 00
- **Dirección**: Avenida Antonio Gaudí, 4, Málaga, España

---

**A DIOS SEA TODA LA GLORIA** ✨

*Este proyecto está dedicado a servir a la comunidad de la Iglesia Evangélica Bautista La Luz Málaga, proporcionando una plataforma digital moderna que facilite la conexión, el crecimiento espiritual y el servicio a la comunidad.*