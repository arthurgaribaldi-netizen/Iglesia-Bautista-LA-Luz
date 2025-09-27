import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Church, Users, Heart, Globe, Award, BookOpen } from "lucide-react";
import Link from "next/link";

// Static page - no revalidation needed
export const revalidate = false;

export default function SobrePage() {
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">

        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Sobre Nossa Igreja
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            A Iglesia Evangélica Bautista La Luz Málaga é uma comunidade de fé 
            dedicada a servir a Deus e amar ao próximo.
          </p>
        </section>

        {/* Mission & Vision */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-6 h-6 text-primary" />
                  Nossa Missão
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Proclamar o evangelho de Jesus Cristo, edificar os crentes na fé 
                  e servir nossa comunidade com amor e compaixão, seguindo os 
                  ensinamentos bíblicos.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-6 h-6 text-primary" />
                  Nossa Visão
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Ser uma igreja vibrante e acolhedora que transforma vidas através 
                  do poder do evangelho, formando discípulos que impactam positivamente 
                  nossa sociedade.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* History */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Nossa História
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Uma jornada de fé e crescimento
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-8">
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 mb-6">
                    A Iglesia Evangélica Bautista La Luz Málaga foi fundada em 1977 e 
                    oficialmente estabelecida como igreja em 1978. Desde nossos primeiros 
                    dias, temos nos dedicado ao estudo da Palavra de Deus e ao crescimento 
                    espiritual de nossos membros.
                  </p>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-6">
                    Nossa igreja está registrada oficialmente no Ministério de Justicia 
                    e faz parte da FEREDE (Federación de Entidades Religiosas Evangélicas 
                    de España) sob o número 016332. Nosso CIF é R2900286B.
                  </p>
                  
                  <p className="text-gray-700 dark:text-gray-300">
                    Ao longo dos anos, temos crescido como uma família espiritual, 
                    oferecendo cultos regulares, estudos bíblicos, programas para jovens 
                    e crianças, e atividades comunitárias que fortalecem os laços de 
                    amizade e fé entre nossos membros.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Values */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Nossos Valores
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Princípios que guiam nossa comunidade
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>Fé Bíblica</CardTitle>
                <CardDescription>
                  Acreditamos na autoridade e suficiência das Escrituras como 
                  guia para nossa fé e prática.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>Comunidade</CardTitle>
                <CardDescription>
                  Valorizamos o relacionamento fraterno e o apoio mútuo entre 
                  os membros de nossa igreja.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Award className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>Excelência</CardTitle>
                <CardDescription>
                  Buscamos oferecer o melhor em nossos cultos, programas e 
                  serviços à comunidade.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* Leadership */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Nossa Liderança
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Pastores e líderes que servem nossa comunidade
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <Church className="w-12 h-12 text-gray-500" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Pastor Eliezer Bueno Martín</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Liderando nossa comunidade com sabedoria e amor
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    O Pastor Eliezer Bueno Martín dedica-se ao ensino bíblico, 
                    aconselhamento pastoral e liderança espiritual da igreja, 
                    sempre buscando o crescimento espiritual de cada membro.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Join Us */}
        <section className="text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Venha Fazer Parte
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Estamos sempre abertos para receber novos membros em nossa 
              família espiritual. Venha conhecer nossa comunidade!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/contato">Entre em Contato</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/eventos">Próximos Eventos</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
