// Dados fixos da loja. Edite aqui para trocar nome, contatos e horários.
export const LOJA = {
  nome: 'MultiCar',
  nomeVendedor: 'MultiCar Seminovos',
  cidade: 'São Paulo - SP',
  endereco: 'Avenida Ruston. Nº900 - São Paulo',
  telefone: '(12) 98168-0413',
  whatsapp: '5512981680413',
  email: 'contato@multicar.com.br',
  desde: '2015',
  horarioTexto: 'Seg a Sex - 08H30 às 18h00 | Sáb - 09h00 às 14h00',
  // 0 = domingo … 6 = sábado. [abre, fecha] em horas decimais (horário de Brasília).
  horario: { 1: [8.5, 18], 2: [8.5, 18], 3: [8.5, 18], 4: [8.5, 18], 5: [8.5, 18], 6: [9, 14] } as Record<
    number,
    [number, number]
  >,
  redes: { instagram: '#', facebook: '#', youtube: '#' },
} as const;

export const CORES = [
  { value: 'preto', label: 'Preto', hex: '#111111' },
  { value: 'cinza', label: 'Cinza', hex: '#7a7a7a' },
  { value: 'branco', label: 'Branco', hex: '#ffffff' },
  { value: 'azul', label: 'Azul', hex: '#1f5fd6' },
  { value: 'prata', label: 'Prata', hex: '#c9ccd1' },
  { value: 'vermelho', label: 'Vermelho', hex: '#d0021b' },
  { value: 'outra', label: 'Outra', hex: '#b58a5a' },
] as const;

export const CAMBIOS = ['Automática', 'Manual', 'CVT', 'Automatizada'] as const;
export const CARROCERIAS = ['Hatch', 'Sedã', 'SUV', 'Picape', 'Cupê', 'Conversível', 'Minivan', 'Utilitário'] as const;
export const COMBUSTIVEIS = ['Gasolina e álcool', 'Gasolina', 'Álcool', 'Diesel', 'Híbrido', 'Elétrico'] as const;

export const TAXA_FINANCIAMENTO = 0.0149;

export const whatsappLink = (texto: string) =>
  `https://wa.me/${LOJA.whatsapp}?text=${encodeURIComponent(texto)}`;

// Itens que aparecem como caixinhas no cadastro de veículo (outros podem ser digitados à mão).
export const ITENS_COMUNS = [
  'Airbag', 'Alarme', 'Ar condicionado', 'Direção elétrica', 'Freio ABS', 'Travas elétricas',
  'Vidros elétricos', 'Retrovisores elétricos', 'Limpador traseiro', 'USB', 'Bluetooth',
  'Rodas de liga leve', 'Bancos em couro', 'Bancos com aquecimento', 'Teto solar', 'Câmera de ré',
  'Sensor de estacionamento', 'Controle automático de velocidade', 'Controle de estabilidade',
  'Tela multimídia', 'Espelhamento com smartphone', 'GPS', 'Faróis de LED', 'Chave presencial',
  'Botão de partida', 'Sensor de chuva', 'Tração 4x4', '7 lugares',
] as const;
