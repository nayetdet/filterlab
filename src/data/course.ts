import type { LessonId } from '@/stores/course';

export type LessonKind =
  | 'signal'
  | 'sampling'
  | 'aliasing'
  | 'frequency'
  | 'spectrum'
  | 'lowpass'
  | 'highpass'
  | 'response'
  | 'impulse'
  | 'windows'
  | 'discrete'
  | 'continuous'
  | 'iir'
  | 'phase';

export type Lesson = {
  id: LessonId;
  title: string;
  concept: string;
  intuition: string;
  consequence: string;
  formula: string;
  prompt: string;
  control: string;
  kind: LessonKind;
};

export type CourseModule = {
  title: string;
  summary: string;
  lessons: Lesson[];
};
export const courseModules: CourseModule[] = [
  {
    title: '01. Sinais e sistemas',
    summary: 'Descreva sons e sinais ao longo do tempo.',
    lessons: [
      {
        id: 'signals',
        title: 'Sinais contínuos e discretos',
        concept:
          'Um sinal representa uma quantidade que varia. Um microfone converte pressão sonora em tensão e o conversor mede essa tensão em instantes regulares.',
        intuition:
          'O sinal contínuo é uma curva. O sinal digital é uma sequência de medidas dessa curva, cada uma associada a um índice inteiro.',
        consequence:
          'A taxa de amostragem define quantos detalhes temporais conseguimos representar. Poucas amostras podem esconder mudanças rápidas.',
        formula: 'x[n]=A\\sin\\left(2\\pi\\frac{fn}{f_s}+\\varphi\\right)',
        prompt: 'Altere a frequência e compare o espaçamento das oscilações.',
        control: 'Frequência do tom',
        kind: 'signal',
      },
      {
        id: 'sampling',
        title: 'Amostragem',
        concept:
          'A amostragem transforma uma curva contínua em valores separados no tempo. A taxa fₛ indica quantas medidas são feitas por segundo.',
        intuition:
          'Imagine tirar fotografias de uma onda. Fotografias frequentes registram o movimento; poucas podem dar a impressão de outro movimento.',
        consequence:
          'Para representar uma frequência, a taxa de amostragem precisa ser maior que o dobro dela. Caso contrário, ocorre aliasing.',
        formula: 'x[n]=x_c\\left(\\frac{n}{f_s}\\right)',
        prompt:
          'Mude a taxa de amostragem e veja os pontos medidos sobre a onda contínua.',
        control: 'Taxa de amostragem',
        kind: 'sampling',
      },
      {
        id: 'aliasing',
        title: 'Aliasing',
        concept:
          'Aliasing acontece quando uma onda é amostrada devagar demais e aparece como uma frequência diferente da original.',
        intuition:
          'É o efeito visual de uma roda que parece girar para trás no vídeo. As amostras não conseguem distinguir o movimento real.',
        consequence:
          'Sons acima de metade da taxa de amostragem podem virar componentes graves falsas. Um filtro anti-aliasing reduz esse risco antes da conversão.',
        formula: 'f_{\\text{Nyquist}}=\\frac{f_s}{2}',
        prompt:
          'Cruze o limite de Nyquist e compare frequência original e percebida.',
        control: 'Frequência do sinal',
        kind: 'aliasing',
      },
    ],
  },
  {
    title: '02. Frequência e espectro',
    summary: 'Entenda os tons que formam um som.',
    lessons: [
      {
        id: 'frequency',
        title: 'Frequência e período',
        concept:
          'Frequência mede quantas repetições acontecem por segundo. O período é o tempo de uma repetição completa.',
        intuition:
          'Uma frequência maior significa ciclos mais rápidos e, no som, um tom mais agudo.',
        consequence:
          'Frequência e período são inversos: dobrar a frequência reduz o período à metade.',
        formula: 'T=\\frac{1}{f}',
        prompt:
          'Ajuste a frequência e observe o período mudar na forma de onda.',
        control: 'Frequência',
        kind: 'signal',
      },
      {
        id: 'spectrum',
        title: 'Espectro e FFT',
        concept:
          'O espectro mostra quanta energia existe em cada frequência. A FFT é um algoritmo eficiente para calcular essa representação a partir das amostras.',
        intuition:
          'A forma de onda é uma mistura vista no tempo. O espectro separa essa mistura em seus tons componentes.',
        consequence:
          'Picos no espectro revelam tons e interferências. A resolução depende da duração do trecho analisado.',
        formula: 'X[k]=\\sum_{n=0}^{N-1}x[n]e^{-j2\\pi kn/N}',
        prompt: 'Combine dois tons e acompanhe os picos no espectro.',
        control: 'Intensidade do segundo tom',
        kind: 'spectrum',
      },
    ],
  },
  {
    title: '03. Filtros digitais',
    summary: 'Separe frequências que deseja ouvir das que deseja reduzir.',
    lessons: [
      {
        id: 'lowpass',
        title: 'Filtro passa-baixa',
        concept:
          'O passa-baixa preserva frequências menores que o corte e reduz frequências maiores.',
        intuition:
          'Ele age como uma porta que deixa os tons graves passarem e atenua os agudos.',
        consequence:
          'Um corte baixo remove mais ruído agudo, mas também pode retirar brilho e detalhe do som desejado.',
        formula:
          'H(f)\\approx\\begin{cases}1,&|f|<f_c\\\\0,&|f|>f_c\\end{cases}',
        prompt: 'Mova o corte e compare o tom desejado e a interferência.',
        control: 'Frequência de corte',
        kind: 'lowpass',
      },
      {
        id: 'highpass',
        title: 'Filtro passa-alta',
        concept:
          'O passa-alta reduz frequências abaixo do corte e preserva as frequências acima dele.',
        intuition:
          'É como remover uma vibração lenta de fundo sem apagar os detalhes mais rápidos do sinal.',
        consequence:
          'Um corte alto remove zumbido grave, mas pode enfraquecer sons fundamentais e deixar o áudio fino.',
        formula: 'H_{\\text{PA}}(f)=1-H_{\\text{PB}}(f)',
        prompt:
          'Ajuste o corte e veja o zumbido diminuir sem perder o tom principal.',
        control: 'Frequência de corte',
        kind: 'highpass',
      },
      {
        id: 'fir',
        title: 'Resposta em frequência',
        concept:
          'A resposta em frequência informa quanto o filtro amplifica ou atenua cada frequência.',
        intuition:
          'Para cada tom de entrada, o filtro aplica um ganho. A saída combina o tom original com esse ganho.',
        consequence:
          'A transição real ocupa uma faixa, então tons perto do corte são parcialmente alterados. Um corte ideal não pode ser realizado exatamente com um filtro finito.',
        formula: '|Y(f)|=|X(f)|\\,|H(f)|',
        prompt: 'Compare o ganho ideal com uma transição realizável.',
        control: 'Largura da transição',
        kind: 'response',
      },
    ],
  },
  {
    title: '04. FIR por dentro',
    summary: 'Veja como coeficientes produzem a filtragem.',
    lessons: [
      {
        id: 'impulse',
        title: 'Resposta ao impulso',
        concept:
          'A resposta ao impulso h[n] é a saída do filtro quando a entrada é um impulso unitário.',
        intuition:
          'Para um sistema linear e invariante no tempo, essa sequência contém informação suficiente para prever a saída para qualquer entrada.',
        consequence:
          'Coeficientes mais espalhados no tempo costumam produzir uma transição mais estreita em frequência, mas aumentam atraso e custo.',
        formula: 'h[n]=\\mathcal{H}\\{\\delta[n]\\}',
        prompt:
          'Altere a largura do impulso e compare a resposta no tempo e na frequência.',
        control: 'Largura dos coeficientes',
        kind: 'impulse',
      },
      {
        id: 'windows',
        title: 'Janelas e projeto FIR',
        concept:
          'Um FIR pode ser projetado truncando uma resposta ideal e multiplicando-a por uma janela, como Hamming.',
        intuition:
          'A janela suaviza as bordas do truncamento. Isso reduz ondulações, mas alarga a faixa de transição.',
        consequence:
          'Há uma troca entre largura da transição e atenuação da faixa rejeitada. Mais coeficientes permitem transições mais estreitas ao custo de mais cálculo e atraso.',
        formula: 'h[n]=h_{\\text{ideal}}[n]w[n]',
        prompt:
          'Compare resposta ideal e janelada ao mudar o tamanho do filtro.',
        control: 'Tamanho do filtro',
        kind: 'windows',
      },
    ],
  },
  {
    title: '05. Convolução',
    summary: 'Calcule como um sistema transforma uma entrada.',
    lessons: [
      {
        id: 'convolution-discrete',
        title: 'Convolução discreta',
        concept:
          'A saída FIR é a soma dos produtos entre coeficientes e amostras alinhadas da entrada.',
        intuition:
          'Inverta e deslize os coeficientes sobre o sinal. Em cada posição, multiplique os pares e some os resultados.',
        consequence:
          'Cada amostra de saída depende de uma vizinhança da entrada. Isso explica o atraso e a suavização produzida pelo filtro.',
        formula: 'y[n]=\\sum_{k=0}^{M-1}h[k]x[n-k]',
        prompt: 'Deslize a janela e confira cada produto que forma a saída.',
        control: 'Posição da janela',
        kind: 'discrete',
      },
      {
        id: 'convolution-continuous',
        title: 'Convolução contínua',
        concept:
          'Para sinais contínuos, a soma dos produtos vira uma integral sobre todos os deslocamentos.',
        intuition:
          'O valor de saída é a área do produto entre o sinal fixo e a versão refletida e deslocada da resposta ao impulso.',
        consequence:
          'Pulsos retangulares iguais produzem um triângulo; larguras diferentes produzem um trapézio.',
        formula: 'y(t)=\\int_{-\\infty}^{\\infty}x(\\tau)h(t-\\tau)\\,d\\tau',
        prompt: 'Desloque o pulso e compare sobreposição, produto e saída.',
        control: 'Deslocamento',
        kind: 'continuous',
      },
    ],
  },
  {
    title: '06. Além do FIR',
    summary: 'Conheça recursão, fase e limites de projeto.',
    lessons: [
      {
        id: 'iir',
        title: 'Introdução a IIR',
        concept:
          'Filtros IIR usam amostras atuais e saídas anteriores. A realimentação permite respostas longas com poucos coeficientes.',
        intuition:
          'Parte da saída volta para a entrada do cálculo seguinte, como um eco que se alimenta.',
        consequence:
          'IIRs podem alcançar transições estreitas com baixo custo, mas exigem cuidado com estabilidade e distorção de fase.',
        formula: 'y[n]=\\sum_k b_kx[n-k]-\\sum_{k=1}^{P}a_ky[n-k]',
        prompt:
          'Aumente a realimentação e veja a resposta ficar mais prolongada.',
        control: 'Realimentação',
        kind: 'iir',
      },
      {
        id: 'phase',
        title: 'Fase e atraso',
        concept:
          'A fase descreve o deslocamento temporal relativo de cada componente senoidal na saída.',
        intuition:
          'Dois tons podem manter o mesmo volume e ainda assim mudar de alinhamento no tempo.',
        consequence:
          'Fase não linear pode alterar a forma de transientes mesmo quando a resposta de amplitude parece correta. FIR simétrico tem fase linear e atraso constante.',
        formula: '\\tau_g(f)=-\\frac{1}{2\\pi}\\frac{d\\phi(f)}{df}',
        prompt:
          'Compare a fase e o atraso de filtros com respostas diferentes.',
        control: 'Inclinação de fase',
        kind: 'phase',
      },
    ],
  },
];
export const courseLessons = courseModules.flatMap((module) => module.lessons);
