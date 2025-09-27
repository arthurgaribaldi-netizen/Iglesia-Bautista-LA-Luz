import { YouTubePlayer } from "@/components/ui/youtube-player";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Calendar, Users, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function TransmissoesPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Transmissões ao Vivo
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Acompanhe nossos cultos e eventos em tempo real através do nosso canal no YouTube
          </p>
        </div>

        {/* Main Player */}
        <div className="max-w-6xl mx-auto mb-12">
          <YouTubePlayer 
            channelId="UCiahUfyUv3VbwrMjgLh-WzA"
            autoPlay={false}
            showLatest={true}
          />
        </div>

        {/* Schedule and Info */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 mb-12">
          {/* Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Horários de Transmissão
              </CardTitle>
              <CardDescription>
                Nossos cultos regulares transmitidos ao vivo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <h4 className="font-semibold">Culto Dominical</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Transmissão ao vivo do culto principal
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-primary font-semibold">
                    <Clock className="w-4 h-4" />
                    18:00
                  </div>
                  <p className="text-xs text-gray-500">Domingos</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <h4 className="font-semibold">Escola Bíblica</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Escola Bíblica para adultos e crianças
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-primary font-semibold">
                    <Clock className="w-4 h-4" />
                    11:00
                  </div>
                  <p className="text-xs text-gray-500">Domingos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Channel Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Nosso Canal
              </CardTitle>
              <CardDescription>
                Conecte-se conosco através do YouTube
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                  IEB La Luz Málaga
                </h4>
                <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                  Inscreva-se em nosso canal para receber notificações de novas transmissões e vídeos.
                </p>
                <Button 
                  asChild 
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <a 
                    href="https://www.youtube.com/channel/UCiahUfyUv3VbwrMjgLh-WzA"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visitar Canal
                  </a>
                </Button>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Transmissões ao vivo regulares</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Sermões e estudos bíblicos</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Eventos especiais da igreja</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Resources */}
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Recursos Adicionais</CardTitle>
              <CardDescription>
                Outras formas de se conectar conosco
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Button variant="outline" asChild className="h-auto p-4">
                  <Link href="/sermoes">
                    <div className="text-center">
                      <h4 className="font-semibold mb-1">Sermões</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Acesse nossa biblioteca de sermões
                      </p>
                    </div>
                  </Link>
                </Button>
                
                <Button variant="outline" asChild className="h-auto p-4">
                  <Link href="/eventos">
                    <div className="text-center">
                      <h4 className="font-semibold mb-1">Eventos</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Veja nossa agenda de eventos
                      </p>
                    </div>
                  </Link>
                </Button>
                
                <Button variant="outline" asChild className="h-auto p-4">
                  <Link href="/contato">
                    <div className="text-center">
                      <h4 className="font-semibold mb-1">Contato</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Entre em contato conosco
                      </p>
                    </div>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
