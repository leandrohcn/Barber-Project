'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Save, AlertCircle, Clock, Toggle2 } from 'lucide-react';

interface Horario {
  id: string;
  diaSemana: number;
  horaInicio: string;
  horaFim: string;
  estaAtivo: boolean;
}

interface HorarioForm {
  [key: number]: {
    horaInicio: string;
    horaFim: string;
    estaAtivo: boolean;
  };
}

const DIAS_SEMANA = [
  { id: 1, nome: 'Segunda-feira', label: 'Seg' },
  { id: 2, nome: 'Terça-feira', label: 'Ter' },
  { id: 3, nome: 'Quarta-feira', label: 'Qua' },
  { id: 4, nome: 'Quinta-feira', label: 'Qui' },
  { id: 5, nome: 'Sexta-feira', label: 'Sex' },
  { id: 6, nome: 'Sábado', label: 'Sab' },
  { id: 0, nome: 'Domingo', label: 'Dom' },
];

export default function StaffDisponibilidadePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [horarios, setHorarios] = useState<Horario[]>([]);

  // Form state
  const [formData, setFormData] = useState<HorarioForm>({});

  const [staffId, setStaffId] = useState<string | null>(null);

  // Carregar horários
  useEffect(() => {
    const loadHorarios = async () => {
      try {
        // Buscar funcionarioId do staff logado
        const meResponse = await api.getMeAsStaff();
        const { funcionarioId, horarios: horariosData } = meResponse.data;

        if (!funcionarioId) {
          setError('Não foi possível identificar seu perfil de funcionário');
          setLoading(false);
          return;
        }

        setStaffId(funcionarioId);
        setHorarios(horariosData || []);

        // Inicializar form com horários existentes
        const form: HorarioForm = {};
        DIAS_SEMANA.forEach((dia) => {
          const horarioExistente = (horariosData || []).find(h => h.diaSemana === dia.id);
          form[dia.id] = {
            horaInicio: horarioExistente?.horaInicio || '09:00',
            horaFim: horarioExistente?.horaFim || '17:00',
            estaAtivo: horarioExistente?.estaAtivo ?? true,
          };
        });
        setFormData(form);
      } catch (err: any) {
        console.error('Erro ao carregar horários:', err);
        // Inicializar com valores padrão se não conseguir carregar
        const form: HorarioForm = {};
        DIAS_SEMANA.forEach((dia) => {
          form[dia.id] = {
            horaInicio: '09:00',
            horaFim: '17:00',
            estaAtivo: dia.id !== 0, // Domingo desativado por padrão
          };
        });
        setFormData(form);
      } finally {
        setLoading(false);
      }
    };

    loadHorarios();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!staffId) {
      setError('Erro: Não foi possível identificar seu perfil');
      return;
    }

    setIsSaving(true);

    try {
      // Preparar dados para upsert
      const horariosParaSalvar = DIAS_SEMANA.map((dia) => {
        const formValue = formData[dia.id];
        return {
          funcionarioId: staffId,
          diaSemana: dia.id,
          horaInicio: formValue.horaInicio,
          horaFim: formValue.horaFim,
          estaAtivo: formValue.estaAtivo,
        };
      });

      // Usar novo endpoint de upsert
      await api.upsertHorariosBatch(staffId, horariosParaSalvar);

      // Recarregar horários após salvar
      const meResponse = await api.getMeAsStaff();
      const { horarios: horariosAtualizados } = meResponse.data;
      setHorarios(horariosAtualizados || []);

      setSuccess('Disponibilidade salva com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('Erro ao salvar:', err);
      setError(err.response?.data?.message || 'Erro ao salvar disponibilidade');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-slate-500">Carregando disponibilidade...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Clock className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-slate-900">Disponibilidade</h1>
        </div>
        <p className="text-slate-500">Defina seus horários de trabalho</p>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          ✅ {success}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSave} className="space-y-4">
        {DIAS_SEMANA.map((dia) => (
          <div
            key={dia.id}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">{dia.nome}</h3>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData[dia.id]?.estaAtivo || false}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [dia.id]: {
                        ...formData[dia.id],
                        estaAtivo: e.target.checked,
                      },
                    })
                  }
                  className="w-5 h-5 rounded"
                />
                <span className="text-sm text-slate-600">Trabalhar neste dia</span>
              </label>
            </div>

            {formData[dia.id]?.estaAtivo && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Início
                  </label>
                  <input
                    type="time"
                    value={formData[dia.id]?.horaInicio || '09:00'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [dia.id]: {
                          ...formData[dia.id],
                          horaInicio: e.target.value,
                        },
                      })
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Fim
                  </label>
                  <input
                    type="time"
                    value={formData[dia.id]?.horaFim || '17:00'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [dia.id]: {
                          ...formData[dia.id],
                          horaFim: e.target.value,
                        },
                      })
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {!formData[dia.id]?.estaAtivo && (
              <p className="text-sm text-slate-500 italic">Folga neste dia</p>
            )}
          </div>
        ))}

        {/* Botão Salvar */}
        <div className="flex gap-3">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="gap-2 flex-1"
            isLoading={isSaving}
          >
            <Save className="w-4 h-4" />
            Salvar Disponibilidade
          </Button>
        </div>
      </form>
    </div>
  );
}
