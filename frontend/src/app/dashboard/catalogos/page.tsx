'use client';

import { useEffect, useState } from 'react';
import api from '@/src/services/api';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Plus, Trash2, DollarSign, Clock, Pencil, X } from 'lucide-react'; // Adicionei Pencil e X

interface ServiceItem {
  id: number;
  name: string;
  price: string | number;
  duration: number;
}

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados do Formulário
  const [editingId, setEditingId] = useState<number | null>(null); // Nulo = Criando, Número = Editando
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    try {
      const response = await api.get('/catalogs');
      setServices(response.data);
    } catch (error) {
      console.error('Erro ao carregar', error);
    } finally {
      setLoading(false);
    }
  }

  // Função que prepara o formulário para EDIÇÃO
  function handleEditSetup(item: ServiceItem) {
    setEditingId(item.id);
    setName(item.name);
    setPrice(String(item.price)); // Garante que vira string pro input
    setDuration(String(item.duration));
    
    // Rola a tela para o topo suavemente para ver o formulário
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Função para CANCELAR a edição
  function handleCancelEdit() {
    setEditingId(null);
    setName('');
    setPrice('');
    setDuration('');
  }

  // Função Unificada: Cria ou Atualiza
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    const data = {
      name,
      price: parseFloat(price),
      duration: parseInt(duration),
    };

    try {
      if (editingId) {
        // MODO EDIÇÃO: Patch
        await api.patch(`/catalogs/${editingId}`, data);
        alert('Serviço atualizado!');
      } else {
        // MODO CRIAÇÃO: Post
        await api.post('/catalogs', data);
        alert('Serviço criado!');
      }

      handleCancelEdit(); // Limpa tudo
      loadServices(); // Recarrega a lista
    } catch (error) {
      alert('Erro ao salvar.');
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

      {/* --- FORMULÁRIO INTELIGENTE --- */}
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
        
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-1/3">
            <Input 
              label="Nome" 
              placeholder="Ex: Corte Degadê" 
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
          <div className="w-full md:w-auto mb-4 flex gap-2">
             <Button type="submit" className={editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}>
               {editingId ? 'Atualizar' : 'Cadastrar'}
             </Button>
          </div>
        </form>
      </div>

      {/* --- LISTAGEM --- */}
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-lg shadow border border-slate-200 hover:shadow-md transition">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-slate-800">{item.name}</h3>
                  <div className="text-sm text-slate-500 mt-1 space-y-1">
                    <p className="flex items-center gap-1"><Clock size={14}/> {item.duration} min</p>
                    <p className="font-bold text-green-600 flex items-center gap-1">R$ {Number(item.price).toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {/* Botão EDITAR */}
                  <button 
                    onClick={() => handleEditSetup(item)}
                    className="p-2 text-blue-400 hover:text-white hover:bg-blue-500 rounded transition"
                    title="Editar"
                  >
                    <Pencil size={18} />
                  </button>
                  
                  {/* Botão EXCLUIR */}
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-red-400 hover:text-white hover:bg-red-500 rounded transition"
                    title="Excluir"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}