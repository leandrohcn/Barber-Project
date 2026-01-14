'use client';

import { useEffect, useState } from 'react';
import api from '@/src/services/api'; // Certifique-se que o api.ts está na porta 3001
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Plus, Trash2, DollarSign, Clock, Pencil, X, FileText } from 'lucide-react';

interface ServiceItem {
  id: number;
  name: string;
  description: string; // Adicionado
  price: string | number;
  duration: number;
}

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados do Formulário
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState(''); // Novo estado
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    try {
      // Verifica se a rota no backend é 'catalogo' ou 'catalogs'. 
      // Baseado no seu Controller anterior, acho que é 'catalogo'. Se der 404, mude aqui.
      const response = await api.get('/catalogs'); 
      setServices(response.data);
    } catch (error) {
      console.error('Erro ao carregar', error);
    } finally {
      setLoading(false);
    }
  }

  // Prepara formulário para EDIÇÃO
  function handleEditSetup(item: ServiceItem) {
    setEditingId(item.id);
    setName(item.name);
    setDescription(item.description || ''); // Preenche a descrição
    setPrice(String(item.price));
    setDuration(String(item.duration));
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Cancela a edição
  function handleCancelEdit() {
    setEditingId(null);
    setName('');
    setDescription(''); // Limpa a descrição
    setPrice('');
    setDuration('');
  }

  // Salvar (Criar ou Atualizar)
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Monta o objeto garantindo os tipos certos
    const data = {
      name,
      description, // Agora enviamos a descrição obrigatória
      price: parseFloat(price),
      duration: parseInt(duration),
    };

    try {
      if (editingId) {
        // MODO EDIÇÃO
        await api.patch(`/catalogs/${editingId}`, data);
        alert('Serviço atualizado!');
      } else {
        // MODO CRIAÇÃO
        await api.post('/catalogs', data);
        alert('Serviço criado!');
      }

      handleCancelEdit(); // Limpa tudo
      loadServices(); // Recarrega a lista
    } catch (error) {
      alert('Erro ao salvar. Verifique se todos os campos estão preenchidos.');
      console.error(error);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Tem certeza que deseja excluir este serviço?')) return;
    try {
      await api.delete(`/catalogs/${id}`);
      loadServices();
    } catch (error) {
      alert('Erro ao deletar.');
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Meus Serviços</h1>

      {/* --- FORMULÁRIO DE CADASTRO --- */}
      <div className={`p-6 rounded-lg shadow-md mb-8 transition-colors ${editingId ? 'bg-blue-50 border-2 border-blue-200' : 'bg-white'}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
            {editingId ? (
              <><Pencil size={20} className="text-blue-600"/> Editando Serviço</>
            ) : (
              <><Plus size={20} className="text-green-600"/> Novo Serviço</>
            )}
          </h2>
          
          {editingId && (
            <button onClick={handleCancelEdit} className="text-sm text-red-500 hover:underline flex items-center gap-1">
              <X size={16}/> Cancelar Edição
            </button>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Linha 1: Nome, Preço, Duração */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2">
              <Input 
                label="Nome do Serviço" 
                placeholder="Ex: Corte Degradê" 
                value={name} onChange={e => setName(e.target.value)}
                required
              />
            </div>
            <div className="w-full md:w-1/4">
              <Input 
                label="Preço (R$)" 
                type="number" 
                placeholder="0.00" 
                icon={DollarSign}
                value={price} onChange={e => setPrice(e.target.value)}
                required
              />
            </div>
            <div className="w-full md:w-1/4">
              <Input 
                label="Duração (min)" 
                type="number" 
                placeholder="30" 
                icon={Clock}
                value={duration} onChange={e => setDuration(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Linha 2: Descrição (Nova) */}
          <div className="w-full">
             <Input 
                label="Descrição Detalhada" 
                placeholder="Ex: Inclui lavagem e finalização com pomada" 
                icon={FileText}
                value={description} onChange={e => setDescription(e.target.value)}
                required
              />
          </div>

          <div className="flex justify-end pt-2">
             <Button type="submit" className={editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}>
               {editingId ? 'Salvar Alterações' : 'Cadastrar Serviço'}
             </Button>
          </div>
        </form>
      </div>

      {/* --- LISTAGEM DE SERVIÇOS --- */}
      {loading ? (
        <div className="text-center py-10 text-slate-500">Carregando serviços...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((item) => (
            <div key={item.id} className="bg-white p-5 rounded-lg shadow border border-slate-200 hover:shadow-md transition flex flex-col justify-between">
              
              <div>
                <div className="flex justify-between items-start">
                    <h3 className="font-bold text-xl text-slate-800">{item.name}</h3>
                    <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">
                        R$ {Number(item.price).toFixed(2)}
                    </span>
                </div>
                
                <p className="text-slate-500 text-sm mt-2 mb-4 line-clamp-2">
                    {item.description}
                </p>
                
                <div className="flex items-center gap-1 text-xs text-slate-400 font-medium mb-4">
                    <Clock size={14}/> {item.duration} minutos
                </div>
              </div>

              <div className="flex gap-2 border-t pt-4 mt-auto">
                <button 
                  onClick={() => handleEditSetup(item)}
                  className="flex-1 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition text-sm font-bold flex items-center justify-center gap-2"
                >
                  <Pencil size={16} /> Editar
                </button>
                
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="px-3 py-2 bg-red-50 text-red-500 rounded hover:bg-red-100 transition"
                  title="Excluir"
                >
                  <Trash2 size={18} />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}