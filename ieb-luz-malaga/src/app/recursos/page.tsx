"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DailyDevotional } from "@/components/ui/daily-devotional";
import { DailyVerse, ProverbioDelDia, VersoDeOro } from "@/components/ui/daily-verse";
import { BibleSearch } from "@/components/ui/bible-search";
import { BookOpen, Search, Download, FileText, Heart, ExternalLink } from "lucide-react";
import { logger } from "@/lib/logger";

interface BibleVerse {
  reference: string
  text: string
  book: string
  chapter: number
  verse: number
}

interface BibleSearchResponse {
  query: string
  version: string
  results: BibleVerse[]
  total: number
}

interface SpiritualResource {
  id: string
  title: string
  description?: string
  type: string
  category?: string
  url?: string
  downloadUrl?: string
  isActive: boolean
}

interface UsefulLink {
  id: string
  title: string
  url: string
  description?: string
  category?: string
  isActive: boolean
}

export default function RecursosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [bibleVerses, setBibleVerses] = useState<BibleVerse[]>([]);
  const [spiritualResources, setSpiritualResources] = useState<SpiritualResource[]>([]);
  const [usefulLinks, setUsefulLinks] = useState<UsefulLink[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchResources = React.useCallback(async() => {
    try {
      setLoading(true);
      
      // Buscar recursos espirituais
      const resourcesResponse = await fetch('/api/resources');
      if (resourcesResponse.ok) {
        const resourcesData = await resourcesResponse.json();
        setSpiritualResources(resourcesData.resources);
      }
      
      // Buscar links úteis
      const linksResponse = await fetch('/api/links');
      if (linksResponse.ok) {
        const linksData = await linksResponse.json();
        setUsefulLinks(linksData.links);
      }
      
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      logger.error('Erro ao buscar recursos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchBibleVerses = React.useCallback(async(query: string) => {
    if (!query.trim()) {
      setBibleVerses([]);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/bible/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar versículos');
      }
      
      const data: BibleSearchResponse = await response.json();
      setBibleVerses(data.results);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      logger.error('Erro ao buscar versículos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchBibleVerses(searchTerm);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">

        {/* Header */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Recursos Espirituais
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Materiais para fortalecer sua fé e crescimento espiritual
          </p>
        </section>

        {/* Daily Devotional and Verses */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Recursos Diários
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Alimente sua fé com devocionais y versículos diarios
            </p>
          </div>

          <div className="grid grid-cols-1 tablet-md:grid-cols-2 gap-8 mb-12">
            {/* Devocional del día */}
            <DailyDevotional />
            
            {/* Versículos del día */}
            <div className="space-y-6">
              <ProverbioDelDia />
              <VersoDeOro />
            </div>
          </div>
        </section>

        {/* Bible Search */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Búsqueda Bíblica Avanzada
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Busca versículos por palabra clave, libro, capítulo o versículo específico
            </p>
          </div>
          
          <BibleSearch />
        </section>

        {/* Spiritual Resources */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Recursos Espirituais
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Materiais para fortalecer sua fé e crescimento espiritual
            </p>
          </div>

          {loading && (
            <div className="text-center py-8">
              <p className="text-gray-500">Carregando recursos...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4"
                onClick={fetchResources}
              >
                Tentar Novamente
              </Button>
            </div>
          )}

          <div className="grid grid-cols-1 tablet-sm:grid-cols-2 tablet-lg:grid-cols-3 gap-6">
            {spiritualResources.map((resource) => (
              <Card key={resource.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      {resource.category || resource.type}
                    </span>
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {resource.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {resource.description && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      {resource.description}
                    </p>
                  )}
                  <div className="flex gap-2">
                    {resource.url && (
                      <Button variant="outline" size="sm" className="flex-1">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Acessar
                      </Button>
                    )}
                    {resource.downloadUrl && (
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Useful Links */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Enlaces de Interés
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Links úteis para sua jornada espiritual
            </p>
          </div>

          <div className="grid grid-cols-1 tablet-sm:grid-cols-2 tablet-lg:grid-cols-3 gap-6">
            {usefulLinks.map((link) => (
              <Card key={link.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <ExternalLink className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {link.title}
                      </CardTitle>
                      {link.description && (
                        <CardDescription className="text-sm">
                          {link.description}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    {link.category && (
                      <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                        {link.category}
                      </span>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={React.useCallback(() => window.open(link.url, '_blank'), [link.url])}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visitar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Study Plans */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-primary" />
                  Planos de Estudo Bíblico
                </CardTitle>
                <CardDescription>
                  Estruturas organizadas para estudar a Palavra de Deus
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 tablet-sm:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Estudos Temáticos</h3>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="w-4 h-4 mr-2" />
                        O Fruto do Espírito
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="w-4 h-4 mr-2" />
                        As Bem-aventuranças
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="w-4 h-4 mr-2" />
                        Parábolas de Jesus
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Estudos por Livro</h3>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="w-4 h-4 mr-2" />
                        Evangelho de João
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="w-4 h-4 mr-2" />
                        Carta aos Romanos
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="w-4 h-4 mr-2" />
                        Salmos
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Prayer Requests */}
        <section className="text-center">
          <div className="max-w-2xl mx-auto">
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                  <Heart className="w-6 h-6 text-primary" />
                  Pedidos de Oração
                </CardTitle>
                <CardDescription>
                  Compartilhe seus pedidos de oração conosco
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  Acreditamos no poder da oração e gostaríamos de orar por você. 
                  Compartilhe seus pedidos conosco.
                </p>
                <Button size="lg">
                  Enviar Pedido de Oração
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
