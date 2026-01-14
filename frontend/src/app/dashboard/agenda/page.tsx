'use client';

import { useState, useEffect } from 'react';
import { Plus, X, CheckCircle, Trash2 } from 'lucide-react';
import api from '@/src/services/api';

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
  phone: string;
  catalogo: Service;
  customDuration?: number;
  // AQUI ESTÁ EM PORTUGUÊS AGORA
  status: 'SOLICITADO' | 'CONFIRMADO' | 'FINALIZADO' | 'CANCELADO';
}

export default function AgendaView() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');
  
  // Agendamento selecionado
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  // Form State
  const [formData, setFormData] = useState({ cliente: '', phone: '', catalogoId: '' });
  const [loading, setLoading] = useState(false);

  const INTERVALO_MINUTOS = 15;
  const HORA_INICIO = 9; 
  const HORA_FIM = 19;   

  useEffect(() => {
    fetchServices();
    fetchAppointments();
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [selectedDate]);

  const fetchServices = async () => {
    try {
        const res = await api.get('/catalogo');
        if (Array.isArray(res.data)) setServices(res.data);
    } catch (error) { console.error("Erro serviços", error); }
  };

  const fetchAppointments = async () => {
    try {
        const res = await api.get('/agendamentos');
        const all = Array.isArray(res.data) ? res.data : [];
        
        // Filtra apenas os que NÃO estão cancelados (PORTUGUÊS)
        const active = all.filter((a: Appointment) => a.status !== 'CANCELADO');
        setAppointments(active);
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
      
      const duration = appt.customDuration || appt.catalogo?.duration || 15; 
      const apptEndMinutes = apptStartMinutes + duration;

      return slotMinutes >= apptStartMinutes && slotMinutes < apptEndMinutes;
    });
  };

  const timeToMinutes = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  };

  // --- AÇÕES DO SISTEMA ---

  // 1. Criar Novo
  async function handleCreate() {
    setLoading(true);
    const finalDate = new Date(`${selectedDate}T${selectedTime}:00`);

    try {
      await api.post('/agendamentos', {
          cliente: formData.cliente,
          phone: formData.phone,
          date: finalDate.toISOString(),
          catalogoId: Number(formData.catalogoId),
          status: 'SOLICITADO' // Garante que cria como SOLICITADO
      });
      alert('Agendado com sucesso!');
      closeModal();
      fetchAppointments();
    } catch (error) {
      alert('Erro ao agendar.');
    } finally {
      setLoading(false);
    }
  }

  // 2. Mudar Status (Usando termos em Português)
  async function handleStatusChange(status: 'FINALIZADO' | 'CANCELADO') {
    if (!selectedAppointment) return;
    
    const message = status === 'CANCELADO' 
      ? 'Tem certeza que deseja cancelar este agendamento?' 
      : 'Confirmar a conclusão do serviço?';

    if (!confirm(message)) return;

    setLoading(true);
    try {
      // Envia o status em PORTUGUÊS para o backend
      await api.patch(`/agendamentos/${selectedAppointment.id}`, { status });
      
      alert(status === 'CANCELADO' ? 'Agendamento cancelado.' : 'Atendimento concluído!');
      closeModal();
      fetchAppointments(); 
    } catch (error) {
      console.error(error);
      alert('Erro ao atualizar status.');
    } finally {
      setLoading(false);
    }
  }

  const openModal = (time: string, existingAppt?: Appointment) => {
    setSelectedTime(time);
    
    if (existingAppt) {
      setSelectedAppointment(existingAppt);
    } else {
      setSelectedAppointment(null);
      setFormData({ cliente: '', phone: '', catalogoId: '' });
    }
    
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  }

  return (
    <div className="max-w-6xl mx-auto pb-20">
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Agenda</h1>
          <p className="text-slate-500 text-sm">Gerenciamento de atendimentos</p>
        </div>
        <input 
          type="date" 
          className="bg-white p-2 rounded-lg shadow border outline-none cursor-pointer"
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
          
          // Verifica se está FINALIZADO (Português)
          const isCompleted = appointment?.status === 'FINALIZADO';

          let bgClass = 'bg-white border-slate-200 hover:border-blue-400';
          let textClass = 'text-slate-500';
          let barClass = 'bg-slate-300';

          if (isBusy) {
            if (isCompleted) {
              // Verde para FINALIZADO
              bgClass = 'bg-green-50 border-green-200';
              textClass = 'text-green-800';
              barClass = 'bg-green-600';
            } else {
              // Azul para SOLICITADO ou CONFIRMADO
              bgClass = 'bg-blue-50 border-blue-200';
              textClass = 'text-blue-700';
              barClass = 'bg-blue-600';
            }
          }

          return (
            <div 
              key={time} 
              className={`px-3 py-1 border-x border-b transition-all relative overflow-hidden h-16 flex flex-col justify-center cursor-pointer hover:shadow-md
                ${bgClass}
                ${isBusy && isStart ? 'rounded-t-lg border-t mt-1' : ''} 
                ${isBusy && !isStart ? 'border-t-0' : 'rounded border-t'} 
                ${!isBusy ? 'opacity-80 hover:opacity-100' : ''}
              `}
              onClick={() => openModal(time, appointment)}
            >
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${barClass}`} />

              <div className="pl-2 flex justify-between items-center w-full">
                <span className={`text-xs font-bold ${textClass}`}>
                  {time}
                </span>
                {!isBusy && <Plus className="text-slate-400 opacity-30" size={14} />}
              </div>

              <div className="pl-2">
                {isBusy && (
                  <div className={`${!isStart ? 'opacity-50' : ''}`}> 
                    <p className="font-bold truncate text-sm leading-tight" style={{ color: isCompleted ? '#166534' : '#1e293b' }}>
                        {appointment?.cliente}
                    </p>
                    <div className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${isCompleted ? 'text-green-600' : 'text-blue-600'}`}>
                        {appointment?.catalogo?.name}
                        {isCompleted && <span>(OK)</span>}
                    </div>
                  </div>
                )}
                {!isBusy && <p className="text-[10px] text-slate-400 font-medium">Livre</p>}
              </div>
            </div>
          );
          })}
        </div>

      {/* --- MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
             <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-red-500"><X size={24} /></button>
             
             {selectedAppointment ? (
               // --- MODO VISUALIZAÇÃO / AÇÕES ---
               <div>
                  <h2 className="text-xl font-bold text-slate-800 mb-1">Detalhes do Agendamento</h2>
                  <p className="text-slate-500 mb-6">{selectedDate} às {selectedTime}</p>

                  <div className="bg-slate-50 p-4 rounded-lg mb-6 border border-slate-100">
                    <p className="text-sm text-slate-500 uppercase font-bold tracking-wider mb-1">Cliente</p>
                    <p className="text-lg font-bold text-slate-800 mb-3">{selectedAppointment.cliente}</p>
                    
                    <p className="text-sm text-slate-500 uppercase font-bold tracking-wider mb-1">Serviço</p>
                    <p className="text-lg font-bold text-blue-700">{selectedAppointment.catalogo.name}</p>
                    <p className="text-sm text-slate-600">R$ {Number(selectedAppointment.catalogo.price).toFixed(2)}</p>
                    
                    <p className="text-sm text-slate-400 mt-2 text-right italic font-medium">
                      Status: {selectedAppointment.status}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      // Manda 'FINALIZADO' (Português)
                      onClick={() => handleStatusChange('FINALIZADO')}
                      className="flex flex-col items-center justify-center p-3 bg-green-50 text-green-700 border border-green-200 rounded-xl hover:bg-green-100 transition"
                    >
                      <CheckCircle size={24} className="mb-1"/>
                      <span className="font-bold text-sm">Finalizar</span>
                    </button>

                    <button 
                      // Manda 'CANCELADO' (Português)
                      onClick={() => handleStatusChange('CANCELADO')}
                      className="flex flex-col items-center justify-center p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl hover:bg-red-100 transition"
                    >
                      <Trash2 size={24} className="mb-1"/>
                      <span className="font-bold text-sm">Cancelar</span>
                    </button>
                  </div>
               </div>
             ) : (
               // --- MODO CRIAÇÃO ---
               <div>
                  <h2 className="text-xl font-bold text-slate-800 mb-4">Novo Agendamento ({selectedTime})</h2>
                  <div className="space-y-3">
                      <input 
                        className="w-full border rounded-lg p-3 outline-none" placeholder="Nome do Cliente"
                        value={formData.cliente}
                        onChange={(e) => setFormData({...formData, cliente: e.target.value})}
                      />
                      <input 
                        className="w-full border rounded-lg p-3 outline-none" placeholder="Telefone / WhatsApp"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                      <select 
                        className="w-full border rounded-lg p-3 outline-none bg-white"
                        value={formData.catalogoId}
                        onChange={(e) => setFormData({...formData, catalogoId: e.target.value})}
                      >
                        <option value="">Selecione o Serviço...</option>
                        {Array.isArray(services) && services.map(s => (
                          <option key={s.id} value={s.id}>{s.name} ({s.duration} min)</option>
                        ))}
                      </select>

                      <button 
                        onClick={handleCreate}
                        disabled={loading}
                        className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg mt-2 hover:bg-slate-800"
                      >
                        {loading ? 'Salvando...' : 'Agendar'}
                      </button>
                  </div>
               </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
}