import { BreadcrumbsWrapper } from "@/components/layout/breadcrumbs-wrapper";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TestTube, Home, Settings, Users, Calendar } from "lucide-react";
import Link from "next/link";

export default function TestBreadcrumbsPage() {
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 flex items-center justify-center gap-3">
            <TestTube className="w-10 h-10 text-primary" />
            Teste de Breadcrumbs
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Esta página demonstra o funcionamento do sistema de breadcrumbs da IEB La Luz Málaga
          </p>
        </section>

        {/* Breadcrumbs Automáticos */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="w-5 h-5 text-primary" />
                Breadcrumbs Automáticos
              </CardTitle>
              <CardDescription>
                Os breadcrumbs acima são gerados automaticamente pelo sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <strong>Rota atual:</strong> /test-breadcrumbs
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Breadcrumbs gerados:</strong> Início → Test Breadcrumbs
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Exemplos de Breadcrumbs Customizados */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                Exemplos de Breadcrumbs Customizados
              </CardTitle>
              <CardDescription>
                Demonstração de breadcrumbs com configurações personalizadas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Exemplo 1: Breadcrumbs Simples */}
              <div>
                <h3 className="font-semibold mb-2">Breadcrumbs Simples</h3>
                <div className="bg-white dark:bg-gray-900 p-4 border rounded-lg">
                  <Breadcrumbs 
                    items={[
                      { label: "Categoria", href: "/categoria" },
                      { label: "Subcategoria", href: "/categoria/subcategoria" },
                      { label: "Página Atual" },
                    ]} 
                  />
                </div>
              </div>

              {/* Exemplo 2: Breadcrumbs com Ícones */}
              <div>
                <h3 className="font-semibold mb-2">Breadcrumbs com Ícones</h3>
                <div className="bg-white dark:bg-gray-900 p-4 border rounded-lg">
                  <Breadcrumbs 
                    items={[
                      { label: "Admin", href: "/admin", icon: <Settings className="w-4 h-4" /> },
                      { label: "Usuários", href: "/admin/usuarios", icon: <Users className="w-4 h-4" /> },
                      { label: "Perfil", icon: <Users className="w-4 h-4" /> },
                    ]} 
                  />
                </div>
              </div>

              {/* Exemplo 3: Breadcrumbs Longos */}
              <div>
                <h3 className="font-semibold mb-2">Breadcrumbs Longos (Teste de Responsividade)</h3>
                <div className="bg-white dark:bg-gray-900 p-4 border rounded-lg">
                  <Breadcrumbs 
                    items={[
                      { label: "Administração", href: "/admin" },
                      { label: "Gestão de Conteúdo", href: "/admin/conteudo" },
                      { label: "Artigos e Publicações", href: "/admin/conteudo/artigos" },
                      { label: "Categoria Específica", href: "/admin/conteudo/artigos/categoria" },
                      { label: "Artigo Muito Longo com Nome Extenso" },
                    ]} 
                  />
                </div>
              </div>

            </CardContent>
          </Card>
        </section>

        {/* Navegação de Teste */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Navegação de Teste
              </CardTitle>
              <CardDescription>
                Teste os breadcrumbs navegando para diferentes páginas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" asChild>
                  <Link href="/sobre">Sobre Nós</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/eventos">Eventos</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/sermoes">Sermões</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/contato">Contato</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/recursos">Recursos</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/enlaces">Enlaces</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/transmissoes">Transmissões</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/admin">Admin</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Informações Técnicas */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Informações Técnicas</CardTitle>
              <CardDescription>
                Detalhes sobre a implementação do sistema de breadcrumbs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Componentes</h3>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• <code>Breadcrumbs</code> - Componente principal</li>
                    <li>• <code>BreadcrumbsWrapper</code> - Wrapper automático</li>
                    <li>• <code>useBreadcrumbs</code> - Hook de geração</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Funcionalidades</h3>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Geração automática por URL</li>
                    <li>• Configuração centralizada</li>
                    <li>• Fallback inteligente</li>
                    <li>• Suporte a ícones</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Como Funciona
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  O sistema analisa a URL atual e gera breadcrumbs automaticamente baseado na 
                  configuração em <code>src/hooks/use-breadcrumbs.ts</code>. Se uma rota não 
                  estiver configurada, o sistema capitaliza automaticamente o nome da rota.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

      </div>
    </div>
  );
}
