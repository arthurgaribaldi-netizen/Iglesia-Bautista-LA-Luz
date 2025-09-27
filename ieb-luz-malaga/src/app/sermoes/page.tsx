"use client";

import { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Play, Calendar, User, Search, Download, FileText, Loader2 } from "lucide-react";
import { SermonsFallback } from "@/components/ui/suspense-fallbacks";

// Dynamic page with client-side data fetching
// Revalidation handled by client-side updates

interface Sermon {
  id: string
  title: string
  pastor: string
  date: string
  series?: string
  description?: string
  audioUrl?: string
  videoUrl?: string
  transcript?: string
  author: {
    name: string
  }
}

interface SermonsResponse {
  sermons: Sermon[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

// Componente interno que renderiza a lista de sermões
function SermonsList({ sermons }: { sermons: Sermon[] }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sermons.map((sermon) => (
        <Card key={sermon.id} className="group hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg group-hover:text-primary transition-colors">
              {sermon.title}
            </CardTitle>
            <CardDescription>
              <div className="flex items-center gap-1 text-sm">
                <User className="w-4 h-4" />
                {sermon.pastor}
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              {new Date(sermon.date).toLocaleDateString('pt-BR')}
            </div>
            
            {sermon.description && (
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {sermon.description}
              </p>
            )}
            
            {sermon.series && (
              <div className="text-xs text-primary font-medium">
                Série: {sermon.series}
              </div>
            )}
            
            <div className="flex gap-2">
              {sermon.audioUrl && (
                <Button size="sm" className="flex-1">
                  <Play className="w-4 h-4 mr-2" />
                  Ouvir
                </Button>
              )}
              {sermon.audioUrl && (
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function SermoesPage() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSermons();
  }, []);

  const fetchSermons = async(search?: string) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      
      const response = await fetch(`/api/sermons?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Erro ao carregar sermões');
      }
      
      const data: SermonsResponse = await response.json();
      setSermons(data.sermons);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSermons(searchTerm);
  };

  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4">

        {/* Header */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Sermões
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Ouça as pregações que edificam nossa fé e fortalecem nossa caminhada cristã
          </p>
        </section>

        {/* Search */}
        <section className="mb-12">
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input 
                  placeholder="Buscar sermões por título, pastor ou série..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </form>
          </div>
        </section>

        {/* Error State */}
        {error && (
          <section className="mb-12">
            <div className="max-w-2xl mx-auto">
              <Card className="border-red-200 bg-red-50 dark:bg-red-950">
                <CardContent className="p-6">
                  <p className="text-red-600 dark:text-red-400">
                    {error}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-4"
                    onClick={() => fetchSermons()}
                  >
                    Tentar Novamente
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* Loading State */}
        {loading && (
          <section className="mb-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                Carregando sermões...
              </p>
            </div>
          </section>
        )}

        {/* Featured Sermon */}
        {!loading && !error && sermons.length > 0 && (
          <section className="mb-16">
            <div className="max-w-4xl mx-auto">
              <Card className="overflow-hidden">
                <CardHeader className="bg-primary text-primary-foreground">
                  <CardTitle className="flex items-center gap-2">
                    <Play className="w-6 h-6" />
                    Sermão em Destaque
                  </CardTitle>
                  <CardDescription className="text-primary-foreground/80">
                    {sermons[0].title}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {sermons[0].pastor}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(sermons[0].date).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    
                    {sermons[0].description && (
                      <p className="text-gray-700 dark:text-gray-300">
                        {sermons[0].description}
                      </p>
                    )}
                    
                    {sermons[0].audioUrl && (
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                        <audio controls className="w-full">
                          <source src={sermons[0].audioUrl} type="audio/mpeg" />
                          Seu navegador não suporta o elemento de áudio.
                        </audio>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-2">
                      {sermons[0].audioUrl && (
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      )}
                      {sermons[0].transcript && (
                        <Button variant="outline" size="sm">
                          <FileText className="w-4 h-4 mr-2" />
                          Transcrição
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* Sermons List */}
        {!loading && !error && (
          <section>
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Biblioteca de Sermões
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Explore nossa coleção completa de pregações
              </p>
            </div>

            {sermons.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Nenhum sermão encontrado.
                </p>
                <Button variant="outline" onClick={() => fetchSermons()}>
                  Ver Todos os Sermões
                </Button>
              </div>
            ) : (
              <Suspense fallback={<SermonsFallback />}>
                <SermonsList sermons={sermons} />
              </Suspense>
            )}

            {/* Load More */}
            {sermons.length > 0 && (
              <div className="text-center mt-12">
                <Button variant="outline" size="lg">
                  Carregar Mais Sermões
                </Button>
              </div>
            )}
          </section>
        )}

        {/* Bible Study Section */}
        <section className="mt-20 py-16 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Estudos Bíblicos
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Além dos sermões, oferecemos estudos bíblicos detalhados para 
              aprofundar seu conhecimento das Escrituras.
            </p>
            <Button size="lg">
              Acessar Estudos Bíblicos
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
