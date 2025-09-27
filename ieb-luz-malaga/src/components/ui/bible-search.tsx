'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, BookOpen, Filter, RefreshCw, Share2, Copy } from 'lucide-react';

interface BibleVerse {
  reference: string
  text: string
  book: string
  chapter: number
  verse: number
}

interface SearchResults {
  query: string
  version: string
  results: BibleVerse[]
  total: number
}

interface BibleSearchProps {
  showAdvanced?: boolean
  compact?: boolean
}

export function BibleSearch({ showAdvanced = true, compact = false }: BibleSearchProps) {
  const [query, setQuery] = useState('');
  const [book, setBook] = useState('');
  const [chapter, setChapter] = useState('');
  const [verse, setVerse] = useState('');
  const [version, setVersion] = useState('RVR1960');
  const [useRegex, setUseRegex] = useState(false);
  const [useAllBibles, setUseAllBibles] = useState(false);
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  const bibleBooks = [
    'Génesis', 'Éxodo', 'Levítico', 'Números', 'Deuteronomio',
    'Josué', 'Jueces', 'Rut', '1 Samuel', '2 Samuel', '1 Reyes', '2 Reyes',
    '1 Crónicas', '2 Crónicas', 'Esdras', 'Nehemías', 'Ester',
    'Job', 'Salmos', 'Proverbios', 'Eclesiastés', 'Cantares',
    'Isaías', 'Jeremías', 'Lamentaciones', 'Ezequiel', 'Daniel',
    'Oseas', 'Joel', 'Amós', 'Abdías', 'Jonás', 'Miqueas',
    'Nahum', 'Habacuc', 'Sofonías', 'Hageo', 'Zacarías', 'Malaquías',
    'Mateo', 'Marcos', 'Lucas', 'Juan', 'Hechos', 'Romanos',
    '1 Corintios', '2 Corintios', 'Gálatas', 'Efesios', 'Filipenses',
    'Colosenses', '1 Tesalonicenses', '2 Tesalonicenses', '1 Timoteo',
    '2 Timoteo', 'Tito', 'Filemón', 'Hebreos', 'Santiago', '1 Pedro',
    '2 Pedro', '1 Juan', '2 Juan', '3 Juan', 'Judas', 'Apocalipsis',
  ];

  const versions = [
    { value: 'RVR1960', label: 'Reina-Valera 1960' },
    { value: 'NVI', label: 'Nueva Versión Internacional' },
    { value: 'DHH', label: 'Dios Habla Hoy' },
  ];

  const searchBible = async() => {
    if (!query && !book && !chapter && !verse) {
      setError('Por favor, ingresa al menos un criterio de búsqueda');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (book) params.append('book', book);
      if (chapter) params.append('chapter', chapter);
      if (verse) params.append('verse', verse);
      params.append('version', version);
      params.append('useRegex', useRegex.toString());
      params.append('useAllBibles', useAllBibles.toString());

      const response = await fetch(`/api/bible/search?${params.toString()}`);
      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setResults(data);
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const copyVerse = (verse: BibleVerse) => {
    const text = `${verse.reference}: "${verse.text}"`;
    navigator.clipboard.writeText(text);
  };

  const shareVerse = async(verse: BibleVerse) => {
    const text = `${verse.reference}: "${verse.text}"`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Versículo Bíblico',
          text: text,
          url: window.location.href,
        });
      } catch (err) {
        navigator.clipboard.writeText(text);
      }
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setBook('');
    setChapter('');
    setVerse('');
    setResults(null);
    setError(null);
  };

  return (
    <div className={compact ? 'w-full' : 'max-w-4xl mx-auto'}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Búsqueda en la Biblia
          </CardTitle>
          <CardDescription>
            Busca versículos por palabra clave, libro, capítulo o versículo específico
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Formulario de búsqueda */}
          <div className="space-y-4">
            {/* Búsqueda por palabra clave */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Palabra a buscar
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="Ej: amor, fe, esperanza..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && searchBible()}
                />
                <Button onClick={searchBible} disabled={loading}>
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Búsqueda por referencia específica */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Libro
                </label>
                <Input
                  placeholder="Ej: Juan, Salmos..."
                  value={book}
                  onChange={(e) => setBook(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Capítulo
                </label>
                <Input
                  placeholder="Ej: 3"
                  type="number"
                  value={chapter}
                  onChange={(e) => setChapter(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Versículo
                </label>
                <Input
                  placeholder="Ej: 16"
                  type="number"
                  value={verse}
                  onChange={(e) => setChapter(e.target.value)}
                />
              </div>
            </div>

            {/* Opciones avanzadas */}
            {showAdvanced && (
              <div className="space-y-4">
                <Button
                  variant="outline"
                  onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                  className="w-full"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Opciones Avanzadas
                </Button>

                {showAdvancedOptions && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Versión
                      </label>
                      <select
                        className="w-full p-2 border rounded-md"
                        value={version}
                        onChange={(e) => setVersion(e.target.value)}
                      >
                        {versions.map(v => (
                          <option key={v.value} value={v.value}>
                            {v.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={useRegex}
                          onChange={(e) => setUseRegex(e.target.checked)}
                        />
                        <span className="text-sm">Usar expresiones regulares</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={useAllBibles}
                          onChange={(e) => setUseAllBibles(e.target.checked)}
                        />
                        <span className="text-sm">Buscar en todas las versiones</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex gap-2">
              <Button onClick={searchBible} disabled={loading}>
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                Buscar
              </Button>
              <Button variant="outline" onClick={clearSearch}>
                Limpiar
              </Button>
            </div>
          </div>

          {/* Resultados */}
          {loading && (
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {results && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Resultados ({results.total})
                </h3>
                <p className="text-sm text-gray-500">
                  Versión: {results.version}
                </p>
              </div>

              {results.results.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No se encontraron resultados</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {results.results.map((verse, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-primary">
                          {verse.reference}
                        </h4>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyVerse(verse)}
                            title="Copiar versículo"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => shareVerse(verse)}
                            title="Compartir versículo"
                          >
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 italic">
                        "{verse.text}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Componente compacto para sidebar
export function BibleSearchCompact() {
  return <BibleSearch showAdvanced={false} compact={true} />;
}
