'use client';

import { useState, useEffect } from 'react';
import { Plus, X, Scissors } from 'lucide-react';

interface Service {
  id: number;
  name: string;
  price: number;
  duration: number;
}

interface Appointment {
  id: number;
  date: string;
  cliente: string;
  catalogo: Service;
}

export default function AgendaView() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  // CORREÇÃO 1: Inicializa explicitamente como array vazio
  const [services, setServices] = useState<Service[]>([]); 
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');
  
  const [formData, setFormData] = useState({ cliente: '', phone: '', catalogoId: '' });
  const [loading, setLoading] = useState(false);

  const INTERVALO_MINUTOS = 15;
  const HORA_INICIO = 9; 
  const HORA_FIM = 19;   

  useEffect(() => {
    fetchServices();
    fetchAppointments();
  }, []);

  const refreshData = () => fetchAppointments();

  const fetchServices = async () => {
    try {
        const res = await fetch('http://localhost:3001/catalogs');
        const data = await res.json();
        // CORREÇÃO 1: Garante que é array antes de setar o estado
        if (Array.isArray(data)) {
            setServices(data);
        } else {
            console.error("API não retornou um array de serviços:", data);
            setServices([]); 
        }
    } catch (error) { 
        console.error("Erro ao buscar serviços:", error); 
        setServices([]);
    }
  };

  const fetchAppointments = async () => {
    try {
        const res = await fetch('http://localhost:3001/agendamentos');
        const data = await res.json();
        if (Array.isArray(data)) {
            setAppointments(data);
        } else {
            setAppointments([]);
        }
    } catch (error) { console.error("Erro agendamentos", error); }
  };

  const generateTimeSlots = () => {
    const slots = [];
    let currentTime = new Date();
    currentTime.setHours(HORA_INICIO, 0, 0, 0); 
    const endTime = new Date();
    endTime.setHours(HORA_FIM, 0, 0, 0); 

    while (currentTime < endTime) {
      slots.push(currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
      currentTime.setMinutes(currentTime.getMinutes() + INTERVALO_MINUTOS);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const getAppointmentAtSlot = (slotTime: string) => {
    return appointments.find(appt => {
      const apptDate = new Date(appt.date);
      if (apptDate.toISOString().split('T')[0] !== selectedDate) return false;

      const slotMinutes = timeToMinutes(slotTime);
      const apptStartMinutes = (apptDate.getHours() * 60) + apptDate.getMinutes();
      
      const duration = appt.catalogo?.duration || 15; 
      const apptEndMinutes = apptStartMinutes + duration;

      return slotMinutes >= apptStartMinutes && slotMinutes < apptEndMinutes;
    });
  };

  const timeToMinutes = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  };

  async function handleSave() {
    setLoading(true);
    const finalDate = new Date(`${selectedDate}T${selectedTime}:00`);

    try {
      const res = await fetch('http://localhost:3001/agendamentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cliente: formData.cliente,
          phone: formData.phone,
          date: finalDate.toISOString(),
          catalogoId: Number(formData.catalogoId)
        })
      });

      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ cliente: '', phone: '', catalogoId: '' });
        refreshData();
      } else {
        alert('Erro ao agendar.');
      }
    } catch (error) {
      console.error(error);
      alert('Erro de conexão');
    } finally {
      setLoading(false);
    }
  }

  const openModal = (time: string) => {
    setSelectedTime(time);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Agenda Detalhada</h1>
          <p className="text-slate-500 text-sm">Intervalos de 15 minutos</p>
        </div>
        <input 
          type="date" 
          className="bg-white p-2 rounded-lg shadow border outline-none"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {timeSlots.map((time) => {
          const appointment = getAppointmentAtSlot(time);
          const isBusy = !!appointment;
          
          const isStart = appointment && 
            timeToMinutes(time) === (new Date(appointment.date).getHours() * 60 + new Date(appointment.date).getMinutes());
          
          return (
            <div 
              key={time} 
              className={`px-3 py-1 border-x border-b transition-all relative overflow-hidden h-16 flex flex-col justify-center
                ${isBusy 
                  ? `bg-red-50 border-red-200 ${isStart ? 'rounded-t-lg border-t mt-1' : 'border-t-0'}` 
                  : 'bg-white border-slate-200 rounded text-sm hover:border-blue-400 hover:shadow-md cursor-pointer'
                }`}
              onClick={() => !isBusy && openModal(time)}
            >
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${isBusy ? 'bg-red-500' : 'bg-green-400'}`} />

              {/* Hora e Botão */}
              <div className="pl-2 flex justify-between items-center w-full">
                <span className={`text-xs font-bold ${isBusy ? 'text-red-400' : 'text-slate-500'}`}>
                  {time}
                </span>
                {!isBusy && <Plus className="text-blue-500 opacity-30" size={14} />}
              </div>

              {/* Informações do Agendamento */}
              <div className="pl-2">
                {isBusy ? (
                  // CORREÇÃO 2: Removi o {isStart && ...}. Agora exibe SEMPRE.
                  // Adicionei opacidade condicional para diferenciar o bloco principal dos seguintes.
                  <div className={`${!isStart ? 'opacity-50' : ''}`}> 
                    
                    <p className="font-bold text-slate-800 truncate text-sm leading-tight">
                        {appointment.cliente}
                    </p>
                    
                    <div className="flex items-center gap-1 text-[10px] text-red-600 font-bold uppercase tracking-wider">
                        {appointment.catalogo?.name}
                        {/* Indicador visual de continuação */}
                        {!isStart && <span className="ml-1 text-[8px] opacity-70">(CONT.)</span>}
                    </div>

                  </div>
                ) : (
                  <p className="text-[10px] text-green-600 font-medium">Livre</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
             <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500"><X size={24} /></button>
             <h2 className="text-xl font-bold text-slate-800 mb-4">Novo Agendamento ({selectedTime})</h2>

             <div className="space-y-3">
                <input 
                  className="w-full border rounded-lg p-3 outline-none" placeholder="Nome do Cliente"
                  value={formData.cliente}
                  onChange={(e) => setFormData({...formData, cliente: e.target.value})}
                />
                <input 
                  className="w-full border rounded-lg p-3 outline-none" placeholder="Telefone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
                
                <select 
                   className="w-full border rounded-lg p-3 outline-none bg-white"
                   value={formData.catalogoId}
                   onChange={(e) => setFormData({...formData, catalogoId: e.target.value})}
                >
                  <option value="">Selecione o Serviço...</option>
                  {/* CORREÇÃO 1: Segurança extra no map */}
                  {Array.isArray(services) && services.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.duration} min)</option>
                  ))}
                </select>

                <button 
                  onClick={handleSave}
                  disabled={loading}
                  className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg mt-2 hover:bg-slate-800"
                >
                  {loading ? 'Salvando...' : 'Confirmar'}
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}