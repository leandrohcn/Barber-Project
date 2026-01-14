'use client';

import { useEffect, useState } from 'react';
import api from '@/src/services/api';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Plus, Trash2, DollarSign, Clock } from 'lucide-react';

interface ServiceItem {
  id: number;
  name: string;
  price: string | number;
  duration: number;
  description?: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newDuration, setNewDuration] = useState('');

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    try {
      const response = await api.get('/catalogs');
      setServices(response.data);
    } catch (error) {
      console.error('Erro ao carregar serviços', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.post('/catalogs', {
        name: newName,
        price: parseFloat(newPrice),
        duration: parseInt(newDuration), 
        description: 'Serviço padrão', 
      });
      
      setNewName('');
      setNewPrice('');
      setNewDuration('');
      loadServices();
      alert('Serviço criado com sucesso!');
    } catch (error) {
      alert('Erro ao criar serviço.');
      console.error(error);
    }
  }

  async function handleDelete(id: number) {
    if(!confirm('Tem certeza?')) return;
    try {
      await api.delete(`/catalogs/${id}`);
      loadServices();
    } catch (error) {
      alert('Erro ao deletar (Talvez precise implementar no backend ainda).');
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Meus Serviços</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
          <Plus size={20} className="text-blue-600"/> Novo Serviço
        </h2>
        
        <form onSubmit={handleCreate} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-1/3">
            <Input 
              label="Nome do Serviço" 
              placeholder="Ex: Corte Degadê" 
              value={newName} onChange={e => setNewName(e.target.value)}
              required
            />
          </div>
          <div className="w-full md:w-1/4">
            <Input 
              label="Preço (R$)" 
              type="number" 
              placeholder="0.00" 
              icon={DollarSign}
              value={newPrice} onChange={e => setNewPrice(e.target.value)}
              required
            />
          </div>
          <div className="w-full md:w-1/4">
            <Input 
              label="Duração (min)" 
              type="number" 
              placeholder="30" 
              icon={Clock}
              value={newDuration} onChange={e => setNewDuration(e.target.value)}
              required
            />
          </div>
          <div className="w-full md:w-auto mb-4">
             <Button type="submit" className="w-full md:w-auto px-8">Salvar</Button>
          </div>
        </form>
      </div>

      {loading ? (
        <p>Carregando catálogo...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-lg shadow border border-slate-200 flex justify-between items-center hover:border-blue-300 transition">
              <div>
                <h3 className="font-bold text-lg text-slate-800">{item.name}</h3>
                <div className="text-sm text-slate-500 mt-1 flex gap-3">
                  <span className="flex items-center gap-1"><Clock size={14}/> {item.duration} min</span>
                  <span className="font-semibold text-green-600 flex items-center gap-1">R$ {Number(item.price).toFixed(2)}</span>
                </div>
              </div>
              
              <button 
                onClick={() => handleDelete(item.id)}
                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition"
                title="Excluir Serviço"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}