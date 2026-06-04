import Link from 'next/link';
import { Scissors, Calendar, Users, TrendingUp, Bell } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-white relative overflow-hidden">
      
      {/* Background Glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[30%] h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/20 blur-[150px]" />
        <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-violet-600/20 blur-[150px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 shadow-lg">
              <Scissors className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">Agenda</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-zinc-300 transition-colors hover:text-white font-medium">
              Entrar
            </Link>
            <Link href="/register" className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-2.5 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:from-blue-500 hover:to-blue-400">
              Criar Conta
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content - Flex-1 e justify-center para centralizar verticalmente no meio da tela */}
      <main className="flex-1 w-full z-10 flex flex-col justify-center relative py-16">
        
        <section className="w-full">
          <div className="mx-auto w-full max-w-6xl px-6">
            <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
              
              {/* Left Column - Text & CTAs */}
              <div className="max-w-2xl">
                <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md">
                  <span className="h-2 w-2 rounded-full bg-green-400" />
                  <span className="text-sm font-medium">Sistema para salões e barbearias</span>
                </div>

                <h1 className="mb-6 text-5xl font-black leading-[1.1] tracking-tight md:text-6xl">
                  Organize sua agenda.<br/>
                  <span className="bg-gradient-to-r from-blue-400 to-violet-500 bg-clip-text text-transparent">
                    Cresça seu negócio.
                  </span>
                </h1>

                <p className="mb-8 max-w-xl text-lg leading-relaxed text-zinc-400">
                  Controle clientes, profissionais e agendamentos em uma única plataforma moderna, rápida e intuitiva.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link href="/register" className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-4 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:from-blue-500 hover:to-blue-400">
                    Começar grátis
                  </Link>
                  <Link href="/login" className="rounded-2xl border border-white/20 bg-white/5 px-8 py-4 font-semibold text-white transition-all hover:border-white/40 hover:bg-white/10">
                    Entrar
                  </Link>
                </div>
              </div>

              {/* Right Column - Features Grid 2x2 */}
              <div className="grid gap-4 sm:grid-cols-2 w-full max-w-xl mx-auto lg:mx-0 lg:ml-auto">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors hover:border-white/20 hover:bg-white/10 backdrop-blur-md">
                  <Calendar className="mb-4 h-6 w-6 text-blue-400" />
                  <h3 className="mb-2 font-semibold">Agenda Inteligente</h3>
                  <p className="text-sm text-zinc-400">Visualize todos os horários em tempo real.</p>
                </div>
                
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors hover:border-white/20 hover:bg-white/10 backdrop-blur-md">
                  <Users className="mb-4 h-6 w-6 text-violet-400" />
                  <h3 className="mb-2 font-semibold">Clientes</h3>
                  <p className="text-sm text-zinc-400">Histórico completo e preferências.</p>
                </div>
                
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors hover:border-white/20 hover:bg-white/10 backdrop-blur-md">
                  <TrendingUp className="mb-4 h-6 w-6 text-green-400" />
                  <h3 className="mb-2 font-semibold">Relatórios</h3>
                  <p className="text-sm text-zinc-400">Receita, métricas e desempenho.</p>
                </div>
                
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors hover:border-white/20 hover:bg-white/10 backdrop-blur-md">
                  <Bell className="mb-4 h-6 w-6 text-orange-400" />
                  <h3 className="mb-2 font-semibold">Notificações</h3>
                  <p className="text-sm text-zinc-400">Lembretes automáticos para clientes.</p>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/10 py-8 z-10 mt-auto bg-zinc-950/50 backdrop-blur-sm">
        <div className="mx-auto w-full max-w-6xl px-6 text-center text-sm text-zinc-500">
          © 2024 Agenda. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}