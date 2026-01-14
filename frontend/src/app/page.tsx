import Link from 'next/link'; // <--- Importante: Importar isso!

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-4xl font-bold">Barber Project ✂️</h1>
      <p className="mt-4 text-gray-400">Sistema de Gestão White-Label</p>
      
      <div className="mt-8 flex gap-4">
        <Link href="/login">
          <button className="rounded bg-blue-600 px-6 py-2 font-bold hover:bg-blue-700">
            Login
          </button>
        </Link>

        {/* O botão de agendar ainda não tem página, então sem link */}
        <button className="rounded border border-gray-600 px-6 py-2 font-bold hover:bg-gray-800">
          Agendar Horário
        </button>
      </div>
    </div>
  );
}