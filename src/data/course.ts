import type { LessonId } from '@/stores/course';

export type LessonSymbol = {
  symbol: string;
  name: string;
  unit: string;
  meaning: string;
};

export type LessonStep = { explanation: string; equation?: string };

export type LessonExample = {
  question: string;
  steps: LessonStep[];
  result: string;
};

export type LessonControl = {
  label: string;
  symbol: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  digits: number;
};

export type Lesson = {
  id: LessonId;
  title: string;
  concept: string;
  intuition: string;
  consequence: string;
  formula: string;
  symbols: LessonSymbol[];
  derivation: LessonStep[];
  example: LessonExample;
  prompt: string;
  control: LessonControl;
};

export type CourseModule = {
  title: string;
  summary: string;
  lessons: Lesson[];
};

export const courseModules: CourseModule[] = [
  {
    title: '01. Sinais e sistemas',
    summary: 'Descreva sons e sistemas no tempo e em amostras.',
    lessons: [
      {
        id: 'signals',
        title: 'Sinais contínuos e discretos',
        concept:
          'Um sinal é uma quantidade que varia e carrega informação. Um microfone transforma variações de pressão em tensão, e um conversor mede essa tensão em instantes regulares. O índice n identifica cada medida digital, enquanto t identifica qualquer instante do sinal contínuo.',
        intuition:
          'Pense na curva contínua como o movimento completo de uma onda e nas amostras como fotografias tiradas em intervalos iguais. A sequência digital preserva a ordem e o valor das fotografias, mas não contém automaticamente todos os instantes entre elas.',
        consequence:
          'O modelo escolhido determina quais operações fazem sentido. Em tempo contínuo usamos t e integrais. Em tempo discreto usamos n inteiro e somas. Confundir essas representações pode levar a unidades e frequências incorretas.',
        formula: 'x[n]=A\\sin\\left(2\\pi\\frac{fn}{f_s}+\\varphi\\right)',
        symbols: [
          {
            symbol: 'x[n]',
            name: 'Amostra do sinal',
            unit: 'unidade do sinal',
            meaning:
              'Valor medido no índice n. Sua sequência descreve a forma de onda digital.',
          },
          {
            symbol: 'A',
            name: 'Amplitude',
            unit: 'unidade do sinal',
            meaning:
              'Define a escala vertical. Aumentar A multiplica todas as amostras pelo mesmo fator.',
          },
          {
            symbol: 'f',
            name: 'Frequência do tom',
            unit: 'Hz',
            meaning:
              'Define quantos ciclos ocorrem por segundo. Frequência maior produz oscilações mais próximas no tempo.',
          },
          {
            symbol: 'n',
            name: 'Índice da amostra',
            unit: 'adimensional',
            meaning:
              'Conta as amostras a partir de zero. Cada incremento avança um período de amostragem.',
          },
          {
            symbol: 'f_s',
            name: 'Taxa de amostragem',
            unit: 'amostras/s',
            meaning:
              'Define quantas amostras são registradas por segundo e converte n em tempo.',
          },
          {
            symbol: '\\varphi',
            name: 'Fase inicial',
            unit: 'rad',
            meaning:
              'Desloca a senoide no ciclo sem mudar sua frequência ou amplitude.',
          },
        ],
        derivation: [
          {
            explanation:
              'O instante associado ao índice n é n períodos de amostragem. Como T_s=1/f_s, esse instante também pode ser escrito como n/f_s.',
            equation: 't_n=nT_s=\\frac{n}{f_s}',
          },
          {
            explanation:
              'A senoide contínua é avaliada nesse instante. Substituir t por t_n transforma a expressão contínua em uma sequência discreta.',
            equation: 'x[n]=A\\sin(2\\pi f t_n+\\varphi)',
          },
          {
            explanation:
              'Aplicando t_n=n/f_s, obtemos a fase de cada amostra em função do índice e da taxa de amostragem.',
            equation: 'x[n]=A\\sin\\left(2\\pi\\frac{fn}{f_s}+\\varphi\\right)',
          },
        ],
        example: {
          question:
            'Uma senoide tem amplitude 2, frequência 440 Hz e taxa de amostragem 16 kHz. Qual é a amostra n=4, com fase inicial zero?',
          steps: [
            {
              explanation:
                'Substitua os valores e converta a frequência para ciclos por amostra.',
              equation:
                'x[4]=2\\sin\\left(2\\pi\\frac{440\\cdot4}{16000}\\right)',
            },
            {
              explanation: 'O argumento é aproximadamente 0,691 rad.',
              equation: 'x[4]\\approx2\\sin(0{,}691)',
            },
          ],
          result:
            'x[4] é aproximadamente 1,27. O valor é menor que a amplitude 2 porque a senoide ainda está subindo em direção ao pico.',
        },
        prompt: 'Ajuste a frequência e acompanhe o espaçamento das amostras.',
        control: {
          label: 'Frequência',
          symbol: 'f',
          unit: 'Hz',
          min: 200,
          max: 2000,
          step: 50,
          digits: 0,
        },
      },
      {
        id: 'signal-parameters',
        title: 'Parâmetros de uma senoide',
        concept:
          'Uma senoide é definida por amplitude, frequência e fase. A amplitude A controla o tamanho dos picos, f controla a rapidez das oscilações, e φ determina onde o ciclo começa. Em sinais amostrados, f_s também define o intervalo entre pontos.',
        intuition:
          'Imagine a senoide como uma roda girando. A amplitude aumenta ou diminui a altura da trajetória, a frequência muda a velocidade da roda e a fase escolhe a posição inicial do ponteiro.',
        consequence:
          'Alterar um parâmetro muda uma propriedade diferente do sinal. Aumentar a amplitude não altera o período; aumentar a frequência reduz o período; mudar a fase desloca a curva sem mudar seu formato.',
        formula: 'x(t)=A\\sin(2\\pi ft+\\varphi)',
        symbols: [
          {
            symbol: 'x(t)',
            name: 'Valor do sinal',
            unit: 'unidade do sinal',
            meaning: 'Amplitude instantânea no tempo t.',
          },
          {
            symbol: 'A',
            name: 'Amplitude',
            unit: 'unidade do sinal',
            meaning: 'Controla o valor máximo e mínimo, que são A e -A.',
          },
          {
            symbol: 'f',
            name: 'Frequência',
            unit: 'Hz',
            meaning:
              'Controla o número de ciclos por segundo. Se f dobra, o período cai pela metade.',
          },
          {
            symbol: 't',
            name: 'Tempo',
            unit: 's',
            meaning: 'Localiza o ponto da senoide que está sendo avaliado.',
          },
          {
            symbol: '\\varphi',
            name: 'Fase inicial',
            unit: 'rad',
            meaning:
              'Desloca o ciclo no tempo. Em t=0, define o valor inicial da senoide.',
          },
        ],
        derivation: [
          {
            explanation:
              'Uma volta completa da fase mede 2π radianos e corresponde a um ciclo.',
            equation: '\\theta(t)=2\\pi ft+\\varphi',
          },
          {
            explanation:
              'A função seno transforma a fase em um valor periódico entre -1 e 1.',
            equation: 'u(t)=\\sin(\\theta(t))',
          },
          {
            explanation:
              'Multiplicar por A ajusta os limites do sinal para -A e A.',
            equation: 'x(t)=A\\sin(2\\pi ft+\\varphi)',
          },
        ],
        example: {
          question: 'Para A=1,5, f=4 Hz, φ=π/2 e t=0, qual é o valor inicial?',
          steps: [
            {
              explanation: 'No instante inicial, o termo 2πft vale zero.',
              equation: 'x(0)=1{,}5\\sin(0+\\frac{\\pi}{2})',
            },
            {
              explanation: 'O seno de π/2 é 1.',
              equation: 'x(0)=1{,}5\\cdot1',
            },
          ],
          result:
            'x(0)=1,5. A fase inicial posicionou a senoide exatamente no pico positivo.',
        },
        prompt: 'Mude a amplitude e observe os picos sem alterar o período.',
        control: {
          label: 'Amplitude',
          symbol: 'A',
          unit: 'unid.',
          min: 0.2,
          max: 2,
          step: 0.1,
          digits: 1,
        },
      },
      {
        id: 'sampling',
        title: 'Amostragem',
        concept:
          'A amostragem converte um sinal contínuo x_c(t) em uma sequência x[n] ao medir o sinal em instantes separados por T_s. A taxa f_s é o inverso desse intervalo e é expressa em amostras por segundo.',
        intuition:
          'Aumentar a taxa de amostragem equivale a tirar fotografias com mais frequência. Os pontos ficam mais próximos e representam melhor as mudanças rápidas do sinal.',
        consequence:
          'A taxa precisa ser escolhida a partir das frequências presentes no sinal. Amostrar mais rápido aumenta a quantidade de dados, enquanto amostrar devagar demais pode tornar frequências diferentes indistinguíveis.',
        formula: 'x[n]=x_c(nT_s),\\qquad T_s=\\frac{1}{f_s}',
        symbols: [
          {
            symbol: 'x[n]',
            name: 'Amostra',
            unit: 'unidade do sinal',
            meaning: 'Valor digital obtido na posição n.',
          },
          {
            symbol: 'x_c(t)',
            name: 'Sinal contínuo',
            unit: 'unidade do sinal',
            meaning: 'Curva original que é medida pelo conversor.',
          },
          {
            symbol: 'n',
            name: 'Índice',
            unit: 'adimensional',
            meaning: 'Número inteiro que identifica cada medida.',
          },
          {
            symbol: 'T_s',
            name: 'Período de amostragem',
            unit: 's',
            meaning:
              'Intervalo de tempo entre medidas consecutivas. Um T_s menor gera mais amostras por segundo.',
          },
          {
            symbol: 'f_s',
            name: 'Taxa de amostragem',
            unit: 'Hz ou amostras/s',
            meaning:
              'Quantidade de medidas por segundo. Aumentar f_s reduz T_s.',
          },
        ],
        derivation: [
          {
            explanation:
              'A amostra de índice n é capturada n intervalos depois do início.',
            equation: 't_n=nT_s',
          },
          {
            explanation:
              'A sequência digital é o valor da curva nesse instante.',
            equation: 'x[n]=x_c(t_n)',
          },
          {
            explanation:
              'Como T_s=1/f_s, o instante também pode ser expresso com a taxa de amostragem.',
            equation: 'x[n]=x_c\\left(\\frac{n}{f_s}\\right)',
          },
        ],
        example: {
          question:
            'Com f_s=8000 amostras/s, quanto tempo separa duas amostras?',
          steps: [
            {
              explanation: 'Use o inverso da taxa.',
              equation: 'T_s=\\frac{1}{8000}\\text{ s}',
            },
            {
              explanation: 'Converta segundos para milissegundos.',
              equation: 'T_s=0{,}000125\\text{ s}=0{,}125\\text{ ms}',
            },
          ],
          result: 'Cada amostra é capturada 0,125 ms depois da anterior.',
        },
        prompt: 'Ajuste f_s e compare a curva contínua aos pontos medidos.',
        control: {
          label: 'Taxa de amostragem',
          symbol: 'f_s',
          unit: 'Hz',
          min: 2000,
          max: 16000,
          step: 500,
          digits: 0,
        },
      },
      {
        id: 'sampling-reconstruction',
        title: 'Reconstrução e limite de Nyquist',
        concept:
          'Um sinal limitado em banda pode ser reconstruído a partir de suas amostras quando a taxa ultrapassa duas vezes a maior frequência presente. Essa condição evita que as cópias do espectro produzidas pela amostragem se sobreponham.',
        intuition:
          'Cada amostra contribui para a curva reconstruída por meio de uma função sinc. Quando as amostras são densas o bastante, essas contribuições se somam para recuperar o sinal original.',
        consequence:
          'A reconstrução ideal exige banda limitada e uma taxa superior a 2f_max. Sinais reais não são perfeitamente limitados, por isso sistemas práticos usam filtros anti-aliasing e uma margem acima do limite teórico.',
        formula:
          'f_s>2f_{\\max},\\qquad x_c(t)=\\sum_{n=-\\infty}^{\\infty}x[n]\\operatorname{sinc}\\left(\\frac{t-nT_s}{T_s}\\right)',
        symbols: [
          {
            symbol: 'f_s',
            name: 'Taxa de amostragem',
            unit: 'Hz',
            meaning:
              'Define a distância entre as réplicas do espectro. Deve superar 2f_max para permitir reconstrução ideal.',
          },
          {
            symbol: 'f_{\\max}',
            name: 'Maior frequência do sinal',
            unit: 'Hz',
            meaning:
              'Limite superior das frequências presentes no sinal antes da amostragem.',
          },
          {
            symbol: 'x[n]',
            name: 'Amostra',
            unit: 'unidade do sinal',
            meaning:
              'Valor registrado no instante nT_s e usado na interpolação.',
          },
          {
            symbol: 'T_s',
            name: 'Período de amostragem',
            unit: 's',
            meaning: 'Espaçamento temporal entre amostras.',
          },
          {
            symbol: '\\operatorname{sinc}(u)',
            name: 'Função de interpolação',
            unit: 'adimensional',
            meaning:
              'Peso aplicado a cada amostra para formar o valor reconstruído no instante t.',
          },
        ],
        derivation: [
          {
            explanation:
              'A frequência máxima determina a largura do espectro original.',
            equation: '|f|\\leq f_{\\max}',
          },
          {
            explanation:
              'A amostragem repete esse espectro a cada f_s. Para evitar sobreposição, as réplicas precisam ficar separadas.',
            equation: 'f_s-f_{\\max}>f_{\\max}',
          },
          {
            explanation:
              'Reorganizando a desigualdade, obtemos o limite de Nyquist para reconstrução ideal.',
            equation: 'f_s>2f_{\\max}',
          },
        ],
        example: {
          question:
            'Um sinal contém frequências até 3 kHz. Qual taxa satisfaz a condição ideal?',
          steps: [
            {
              explanation: 'Calcule duas vezes a maior frequência.',
              equation: '2f_{\\max}=2\\cdot3000=6000\\text{ Hz}',
            },
            {
              explanation: 'Escolha uma taxa estritamente acima desse valor.',
              equation: 'f_s=8000\\text{ Hz}>6000\\text{ Hz}',
            },
          ],
          result:
            '8 kHz atende ao limite ideal. Um sistema real ainda precisa de margem e filtragem antes do conversor.',
        },
        prompt:
          'Cruze o limite de Nyquist e observe a reconstrução perder precisão.',
        control: {
          label: 'Taxa de amostragem',
          symbol: 'f_s',
          unit: 'Hz',
          min: 1000,
          max: 12000,
          step: 500,
          digits: 0,
        },
      },
      {
        id: 'aliasing',
        title: 'Aliasing',
        concept:
          'Aliasing é a sobreposição de frequências que ocorre quando a taxa de amostragem é insuficiente. Depois de amostradas, frequências separadas por múltiplos de f_s podem produzir a mesma sequência digital.',
        intuition:
          'É parecido com uma roda filmada em poucos quadros por segundo. O movimento entre quadros não foi registrado, então outra velocidade parece explicar os mesmos quadros.',
        consequence:
          'A frequência falsa não pode ser removida depois com um filtro digital, porque ela já está misturada com frequências válidas. A prevenção é limitar a banda com um filtro analógico antes de amostrar.',
        formula:
          'f_{\\text{alias}}=|f_0-kf_s|,\\qquad k=\\operatorname{round}\\left(\\frac{f_0}{f_s}\\right)',
        symbols: [
          {
            symbol: 'f_0',
            name: 'Frequência original',
            unit: 'Hz',
            meaning: 'Frequência do sinal contínuo antes da amostragem.',
          },
          {
            symbol: 'f_s',
            name: 'Taxa de amostragem',
            unit: 'Hz',
            meaning:
              'Espaçamento entre as réplicas espectrais e referência para calcular o alias.',
          },
          {
            symbol: 'k',
            name: 'Número da réplica',
            unit: 'inteiro',
            meaning: 'Escolhe o múltiplo de f_s mais próximo de f_0.',
          },
          {
            symbol: 'f_{\\text{alias}}',
            name: 'Frequência aparente',
            unit: 'Hz',
            meaning:
              'Frequência observada na sequência amostrada dentro da faixa de Nyquist.',
          },
        ],
        derivation: [
          {
            explanation:
              'Frequências separadas por um múltiplo da taxa têm a mesma fase em cada instante de amostragem.',
            equation:
              '2\\pi(f_0-kf_s)\\frac{n}{f_s}=2\\pi\\frac{f_0n}{f_s}-2\\pi kn',
          },
          {
            explanation:
              'O termo 2πkn corresponde a voltas inteiras e não muda os valores amostrados.',
            equation: '\\sin(2\\pi kn+\\theta)=\\sin(\\theta)',
          },
          {
            explanation:
              'A frequência aparente é a distância até a réplica mais próxima.',
            equation: 'f_{\\text{alias}}=|f_0-kf_s|',
          },
        ],
        example: {
          question:
            'Com f_s=8 kHz, que frequência aparece ao amostrar um tom de 7 kHz?',
          steps: [
            {
              explanation: 'A réplica mais próxima usa k=1.',
              equation: 'f_{\\text{alias}}=|7000-1\\cdot8000|',
            },
            {
              explanation: 'Calcule a distância até essa réplica.',
              equation: 'f_{\\text{alias}}=1000\\text{ Hz}',
            },
          ],
          result:
            'O tom de 7 kHz aparece como 1 kHz. A sequência não permite distinguir esses dois tons sem informação adicional.',
        },
        prompt:
          'Varie f_0 e compare o tom original com o tom que os pontos sugerem.',
        control: {
          label: 'Frequência original',
          symbol: 'f_0',
          unit: 'Hz',
          min: 500,
          max: 7500,
          step: 100,
          digits: 0,
        },
      },
    ],
  },
  {
    title: '02. Frequência e espectro',
    summary: 'Relacione ciclos no tempo aos componentes de frequência.',
    lessons: [
      {
        id: 'frequency',
        title: 'Frequência e período',
        concept:
          'Frequência mede quantos ciclos completos ocorrem por segundo. O período mede o tempo de um ciclo, e a frequência angular mede a velocidade de variação da fase em radianos por segundo.',
        intuition:
          'Frequência e período são duas formas de descrever o mesmo ritmo. Se os ciclos acontecem duas vezes mais rápido, cada ciclo dura metade do tempo.',
        consequence:
          'A unidade evita confundir ciclos por segundo com radianos por segundo. Essa distinção importa ao substituir valores em senoides e ao interpretar eixos de frequência.',
        formula: 'T=\\frac{1}{f},\\qquad \\omega=2\\pi f',
        symbols: [
          {
            symbol: 'T',
            name: 'Período',
            unit: 's',
            meaning:
              'Tempo necessário para completar um ciclo. Período menor significa repetição mais rápida.',
          },
          {
            symbol: 'f',
            name: 'Frequência',
            unit: 'Hz ou ciclos/s',
            meaning: 'Quantidade de ciclos por segundo.',
          },
          {
            symbol: '\\omega',
            name: 'Frequência angular',
            unit: 'rad/s',
            meaning: 'Velocidade de avanço da fase em radianos por segundo.',
          },
        ],
        derivation: [
          {
            explanation:
              'Em um segundo ocorrem f ciclos. Portanto, cada ciclo ocupa a fração 1/f de segundo.',
            equation: 'T=\\frac{1\\text{ s}}{f\\text{ ciclos}}=\\frac{1}{f}',
          },
          {
            explanation:
              'Um ciclo corresponde a 2π radianos. Multiplique os ciclos por segundo por 2π radianos por ciclo.',
            equation: '\\omega=2\\pi f',
          },
        ],
        example: {
          question:
            'Qual é o período e a frequência angular de um tom de 500 Hz?',
          steps: [
            {
              explanation: 'Inverta a frequência para encontrar o período.',
              equation: 'T=\\frac{1}{500}=0{,}002\\text{ s}',
            },
            {
              explanation:
                'Converta para milissegundos e calcule a frequência angular.',
              equation:
                'T=2\\text{ ms},\\qquad \\omega=2\\pi(500)=1000\\pi\\text{ rad/s}',
            },
          ],
          result:
            'O tom completa um ciclo a cada 2 ms e sua fase avança 1000π rad/s.',
        },
        prompt: 'Ajuste a frequência e observe o período de um ciclo.',
        control: {
          label: 'Frequência',
          symbol: 'f',
          unit: 'Hz',
          min: 100,
          max: 1000,
          step: 25,
          digits: 0,
        },
      },
      {
        id: 'frequency-components',
        title: 'Componentes senoidais',
        concept:
          'Sinais periódicos podem ser descritos como somas de senoides. Cada componente tem amplitude, frequência e fase próprias. Essa decomposição transforma uma forma de onda complexa em partes que podem ser analisadas separadamente.',
        intuition:
          'Pense em cada senoide como uma nota pura. Somar componentes produz uma forma de onda composta, mas as frequências continuam identificáveis no espectro.',
        consequence:
          'A amplitude de um componente define sua participação na saída. Componentes com frequências diferentes não se cancelam permanentemente, embora possam se somar ou se opor em instantes específicos.',
        formula: 'x(t)=A_1\\sin(2\\pi f_1t)+A_2\\sin(2\\pi f_2t)',
        symbols: [
          {
            symbol: 'x(t)',
            name: 'Sinal composto',
            unit: 'unidade do sinal',
            meaning: 'Soma instantânea de todas as componentes.',
          },
          {
            symbol: 'A_1,A_2',
            name: 'Amplitudes',
            unit: 'unidade do sinal',
            meaning: 'Controlam quanto cada componente contribui para a soma.',
          },
          {
            symbol: 'f_1,f_2',
            name: 'Frequências',
            unit: 'Hz',
            meaning: 'Determinam a rapidez de cada oscilação.',
          },
          {
            symbol: 't',
            name: 'Tempo',
            unit: 's',
            meaning: 'Instante em que as componentes são avaliadas.',
          },
        ],
        derivation: [
          {
            explanation:
              'Escreva cada componente como uma senoide com amplitude e frequência próprias.',
            equation:
              'x_1(t)=A_1\\sin(2\\pi f_1t),\\quad x_2(t)=A_2\\sin(2\\pi f_2t)',
          },
          {
            explanation:
              'Pela propriedade de superposição, some os valores no mesmo instante.',
            equation: 'x(t)=x_1(t)+x_2(t)',
          },
          {
            explanation:
              'A expressão mostra que as frequências permanecem separadas mesmo quando as ondas se somam no tempo.',
            equation: 'x(t)=A_1\\sin(2\\pi f_1t)+A_2\\sin(2\\pi f_2t)',
          },
        ],
        example: {
          question:
            'Some uma componente de amplitude 1 a 100 Hz com uma componente de amplitude 0,5 a 300 Hz no instante t=2,5 ms.',
          steps: [
            {
              explanation:
                'A fase da primeira componente é π/2, então ela vale 1.',
              equation: 'x_1=1\\sin(2\\pi\\cdot100\\cdot0{,}0025)=1',
            },
            {
              explanation:
                'A fase da segunda componente é 3π/2, então ela vale -0,5.',
              equation: 'x_2=0{,}5\\sin(2\\pi\\cdot300\\cdot0{,}0025)=-0{,}5',
            },
          ],
          result:
            'O sinal composto vale 0,5 nesse instante. Em outros instantes, a relação de fase entre as ondas muda.',
        },
        prompt: 'Aumente a amplitude da segunda componente e observe a soma.',
        control: {
          label: 'Amplitude da segunda componente',
          symbol: 'A_2',
          unit: 'unid.',
          min: 0,
          max: 1.5,
          step: 0.05,
          digits: 2,
        },
      },
      {
        id: 'spectrum',
        title: 'Espectro e FFT',
        concept:
          'A transformada discreta de Fourier representa N amostras como N componentes complexas. A FFT é uma família de algoritmos que calcula essa transformada com menos operações que a soma direta.',
        intuition:
          'No tempo vemos a mistura. No espectro vemos quanto cada frequência contribui. O módulo mostra amplitude e o argumento complexo contém informação de fase.',
        consequence:
          'A FFT não cria informação que não foi amostrada. A interpretação depende da taxa, do tamanho da janela temporal, do alinhamento das frequências com os bins e da escala usada para o módulo.',
        formula: 'X[k]=\\sum_{n=0}^{N-1}x[n]e^{-j2\\pi kn/N}',
        symbols: [
          {
            symbol: 'X[k]',
            name: 'Coeficiente espectral',
            unit: 'complexo',
            meaning:
              'Módulo indica contribuição da frequência k e argumento indica sua fase.',
          },
          {
            symbol: 'x[n]',
            name: 'Amostra de entrada',
            unit: 'unidade do sinal',
            meaning: 'Valor do sinal no índice n.',
          },
          {
            symbol: 'n',
            name: 'Índice temporal',
            unit: 'inteiro',
            meaning: 'Percorre as N amostras analisadas.',
          },
          {
            symbol: 'k',
            name: 'Índice de frequência',
            unit: 'inteiro',
            meaning: 'Seleciona um bin da transformada.',
          },
          {
            symbol: 'N',
            name: 'Número de amostras',
            unit: 'amostras',
            meaning:
              'Define a duração analisada e a separação entre bins quando f_s é fixa.',
          },
          {
            symbol: 'j',
            name: 'Unidade imaginária',
            unit: 'adimensional',
            meaning: 'Codifica seno e cosseno em uma exponencial complexa.',
          },
        ],
        derivation: [
          {
            explanation:
              'Para cada bin k, compare todas as amostras com uma senoide complexa de referência.',
            equation: 'e^{-j2\\pi kn/N}',
          },
          {
            explanation:
              'Multiplique cada amostra pela referência e some os N produtos.',
            equation: 'X[k]=\\sum_{n=0}^{N-1}x[n]e^{-j2\\pi kn/N}',
          },
          {
            explanation:
              'O módulo de X[k], com normalização adequada, fornece a amplitude naquele bin.',
            equation: 'A[k]=\\frac{2}{N}|X[k]|',
          },
        ],
        example: {
          question:
            'Para f_s=8000 Hz e N=8, qual frequência corresponde ao bin k=1?',
          steps: [
            {
              explanation: 'Calcule o espaçamento entre bins.',
              equation:
                '\\Delta f=\\frac{f_s}{N}=\\frac{8000}{8}=1000\\text{ Hz}',
            },
            {
              explanation: 'Multiplique o espaçamento pelo índice k.',
              equation: 'f_1=1\\cdot1000=1000\\text{ Hz}',
            },
          ],
          result:
            'O bin 1 representa 1 kHz. Com apenas oito amostras, os bins ficam bastante espaçados.',
        },
        prompt:
          'Mude a amplitude do segundo tom e compare os picos do espectro.',
        control: {
          label: 'Frequência do segundo tom',
          symbol: 'f_2',
          unit: 'Hz',
          min: 500,
          max: 4000,
          step: 100,
          digits: 0,
        },
      },
      {
        id: 'fft-resolution',
        title: 'Resolução da FFT',
        concept:
          'A distância entre bins da DFT é a taxa de amostragem dividida pelo número de amostras. A capacidade de separar dois tons próximos depende da duração observada e da janela, não apenas de preencher a FFT com mais pontos.',
        intuition:
          'Observar o sinal por mais tempo ajuda a distinguir ritmos próximos. Acrescentar zeros depois do trecho apenas interpola o desenho do espectro, mas não acrescenta observações novas.',
        consequence:
          'Com f_s fixa, aumentar N estreita a separação nominal dos bins. Janelas reduzem vazamento espectral, mas mudam a largura do lóbulo principal e podem tornar picos próximos mais difíceis de separar.',
        formula:
          '\\Delta f=\\frac{f_s}{N},\\qquad T_{\\text{obs}}=\\frac{N}{f_s}',
        symbols: [
          {
            symbol: '\\Delta f',
            name: 'Espaçamento entre bins',
            unit: 'Hz',
            meaning: 'Separação nominal entre frequências avaliadas pela DFT.',
          },
          {
            symbol: 'f_s',
            name: 'Taxa de amostragem',
            unit: 'Hz',
            meaning:
              'Define a frequência de amostragem e, junto com N, a largura do trecho.',
          },
          {
            symbol: 'N',
            name: 'Número de amostras',
            unit: 'amostras',
            meaning:
              'Aumentá-lo com f_s fixa prolonga a observação e reduz Δf.',
          },
          {
            symbol: 'T_{\\text{obs}}',
            name: 'Duração observada',
            unit: 's',
            meaning: 'Tempo coberto pelo trecho analisado.',
          },
        ],
        derivation: [
          {
            explanation:
              'A DFT divide a faixa de 0 a f_s em N intervalos iguais.',
            equation: '\\Delta f=\\frac{f_s}{N}',
          },
          {
            explanation:
              'O trecho de N amostras dura N períodos de amostragem.',
            equation: 'T_{\\text{obs}}=N\\frac{1}{f_s}',
          },
          {
            explanation:
              'Logo, resolução mais fina vem de um trecho mais longo, mantendo a taxa.',
            equation: '\\Delta f=\\frac{1}{T_{\\text{obs}}}',
          },
        ],
        example: {
          question: 'Qual é o espaçamento entre bins para f_s=16 kHz e N=1024?',
          steps: [
            {
              explanation: 'Use a taxa em hertz e o número de amostras.',
              equation: '\\Delta f=\\frac{16000}{1024}',
            },
            {
              explanation: 'Avalie a divisão.',
              equation: '\\Delta f=15{,}625\\text{ Hz}',
            },
          ],
          result:
            'Bins separados por 15,625 Hz. Tons mais próximos exigem um trecho maior e também dependem da janela usada.',
        },
        prompt: 'Aumente N e veja os bins ficarem mais próximos.',
        control: {
          label: 'Número de amostras',
          symbol: 'N',
          unit: 'amostras',
          min: 32,
          max: 512,
          step: 16,
          digits: 0,
        },
      },
    ],
  },
  {
    title: '03. Filtros digitais',
    summary: 'Entenda as faixas que um filtro preserva ou atenua.',
    lessons: [
      {
        id: 'lowpass',
        title: 'Filtro passa-baixa',
        concept:
          'Um passa-baixa preserva componentes abaixo da frequência de corte e reduz componentes acima dela. A resposta real tem uma transição gradual, pois um filtro de comprimento finito não produz um degrau ideal.',
        intuition:
          'Imagine uma porta que deixa passar mudanças lentas e reduz mudanças rápidas. O corte define aproximadamente onde a porta começa a fechar.',
        consequence:
          'Reduzir o corte remove mais ruído agudo, mas também pode retirar harmônicos e detalhes importantes do som. A escolha depende da separação entre o conteúdo útil e a interferência.',
        formula:
          'H_{\\text{PB}}(f)=\\begin{cases}1,&|f|\\leq f_c\\\\0,&|f|>f_c\\end{cases}',
        symbols: [
          {
            symbol: 'H_{\\text{PB}}(f)',
            name: 'Ganho do passa-baixa',
            unit: 'adimensional',
            meaning:
              'Razão entre amplitude de saída e entrada para um tom de frequência f.',
          },
          {
            symbol: 'f',
            name: 'Frequência analisada',
            unit: 'Hz',
            meaning: 'Localiza o tom no eixo horizontal.',
          },
          {
            symbol: 'f_c',
            name: 'Frequência de corte',
            unit: 'Hz',
            meaning:
              'Define a fronteira ideal entre a faixa preservada e a faixa atenuada.',
          },
        ],
        derivation: [
          {
            explanation:
              'O modelo ideal preserva sem alteração cada frequência dentro da faixa passante.',
            equation: 'H_{\\text{PB}}(f)=1,\\quad |f|\\leq f_c',
          },
          {
            explanation:
              'Frequências acima do corte são rejeitadas no modelo ideal.',
            equation: 'H_{\\text{PB}}(f)=0,\\quad |f|>f_c',
          },
          {
            explanation:
              'Um filtro real arredonda a mudança para uma transição finita.',
            equation: '0<|H(f)|<1\\quad\\text{perto de }f_c',
          },
        ],
        example: {
          question:
            'Um tom de 440 Hz passa por um passa-baixa ideal com corte em 1000 Hz. Qual ganho ele recebe?',
          steps: [
            {
              explanation: 'Compare a frequência com o corte.',
              equation: '|440|<1000',
            },
            {
              explanation: 'O tom está na faixa passante.',
              equation: 'H_{\\text{PB}}(440)=1',
            },
          ],
          result:
            'A amplitude permanece igual no modelo ideal. Um filtro real pode alterá-la levemente conforme a largura da transição.',
        },
        prompt: 'Mova o corte e observe quais frequências continuam passando.',
        control: {
          label: 'Frequência de corte',
          symbol: 'f_c',
          unit: 'Hz',
          min: 500,
          max: 4000,
          step: 100,
          digits: 0,
        },
      },
      {
        id: 'highpass',
        title: 'Filtro passa-alta',
        concept:
          'Um passa-alta reduz frequências abaixo do corte e preserva frequências acima dele. Ele pode ser derivado da resposta complementar de um passa-baixa ideal.',
        intuition:
          'O filtro remove variações lentas, como um deslocamento ou zumbido grave, e conserva mudanças mais rápidas.',
        consequence:
          'Elevar o corte remove mais ruído grave, mas também pode enfraquecer a frequência fundamental de um som. O resultado pode ficar fino mesmo que os agudos permaneçam.',
        formula: 'H_{\\text{PA}}(f)=1-H_{\\text{PB}}(f)',
        symbols: [
          {
            symbol: 'H_{\\text{PA}}(f)',
            name: 'Ganho do passa-alta',
            unit: 'adimensional',
            meaning: 'Ganho aplicado a um tom de frequência f pelo passa-alta.',
          },
          {
            symbol: 'H_{\\text{PB}}(f)',
            name: 'Ganho do passa-baixa complementar',
            unit: 'adimensional',
            meaning:
              'Resposta que é subtraída de 1 para formar o passa-alta ideal.',
          },
          {
            symbol: 'f',
            name: 'Frequência analisada',
            unit: 'Hz',
            meaning: 'Localiza o componente no espectro.',
          },
        ],
        derivation: [
          {
            explanation:
              'O complemento de uma resposta de ganho 1 é ganho 0, e vice-versa.',
            equation: 'H_{\\text{PA}}(f)=1-H_{\\text{PB}}(f)',
          },
          {
            explanation:
              'Abaixo do corte, o passa-baixa vale 1, então o passa-alta vale 0.',
            equation: '|f|<f_c\\Rightarrow H_{\\text{PA}}(f)=0',
          },
          {
            explanation:
              'Acima do corte, o passa-baixa vale 0 e o passa-alta vale 1.',
            equation: '|f|>f_c\\Rightarrow H_{\\text{PA}}(f)=1',
          },
        ],
        example: {
          question:
            'Um passa-alta ideal tem corte em 200 Hz. Qual ganho aplica a um zumbido de 80 Hz?',
          steps: [
            {
              explanation: 'O tom está abaixo do corte.',
              equation: '80\\text{ Hz}<200\\text{ Hz}',
            },
            {
              explanation: 'A faixa inferior é rejeitada.',
              equation: 'H_{\\text{PA}}(80)=0',
            },
          ],
          result:
            'O componente de 80 Hz é removido no modelo ideal, enquanto tons acima de 200 Hz passam.',
        },
        prompt: 'Ajuste o corte e veja a faixa grave ser reduzida.',
        control: {
          label: 'Frequência de corte',
          symbol: 'f_c',
          unit: 'Hz',
          min: 100,
          max: 2000,
          step: 50,
          digits: 0,
        },
      },
      {
        id: 'filter-bands',
        title: 'Bandas e atenuação em decibéis',
        concept:
          'Filtros reais são descritos por faixa passante, faixa de transição e faixa de rejeição. A atenuação em decibéis expressa a razão entre amplitudes em uma escala logarítmica.',
        intuition:
          'Uma queda de 20 dB significa que a amplitude ficou dez vezes menor. Decibéis facilitam comparar ganhos muito diferentes em um único gráfico.',
        consequence:
          'Uma especificação como atenuação mínima de 40 dB descreve um requisito mensurável. Ela não afirma que o ganho seja exatamente zero, pois zero de amplitude corresponde a menos infinito dB.',
        formula:
          'G_{\\text{dB}}=20\\log_{10}|H(f)|,\\qquad |H(f)|=10^{G_{\\text{dB}}/20}',
        symbols: [
          {
            symbol: 'G_{\\text{dB}}',
            name: 'Ganho em decibéis',
            unit: 'dB',
            meaning:
              'Escala logarítmica da razão de amplitudes. Valores negativos indicam atenuação.',
          },
          {
            symbol: 'H(f)',
            name: 'Resposta em frequência',
            unit: 'adimensional',
            meaning: 'Ganho linear aplicado à frequência f.',
          },
          {
            symbol: 'f',
            name: 'Frequência',
            unit: 'Hz',
            meaning:
              'Determina se o tom está na faixa passante, transição ou rejeição.',
          },
        ],
        derivation: [
          {
            explanation:
              'A definição de decibéis para uma razão de amplitudes usa vinte vezes o logaritmo decimal.',
            equation: 'G_{\\text{dB}}=20\\log_{10}|H(f)|',
          },
          {
            explanation:
              'Isole o módulo do ganho usando a operação inversa do logaritmo.',
            equation: '\\frac{G_{\\text{dB}}}{20}=\\log_{10}|H(f)|',
          },
          {
            explanation:
              'A forma linear pode ser recuperada elevando dez ao resultado.',
            equation: '|H(f)|=10^{G_{\\text{dB}}/20}',
          },
        ],
        example: {
          question:
            'Que atenuação em dB corresponde a um ganho de amplitude igual a 0,1?',
          steps: [
            {
              explanation: 'Aplique a definição de ganho em decibéis.',
              equation: 'G_{\\text{dB}}=20\\log_{10}(0{,}1)',
            },
            {
              explanation: 'Como log10(0,1)=-1, multiplique por vinte.',
              equation: 'G_{\\text{dB}}=-20\\text{ dB}',
            },
          ],
          result:
            'A amplitude caiu para um décimo do valor de entrada. A potência caiu para um centésimo.',
        },
        prompt:
          'Aumente a atenuação da faixa rejeitada e observe a escala em dB.',
        control: {
          label: 'Atenuação de rejeição',
          symbol: 'A_s',
          unit: 'dB',
          min: 20,
          max: 80,
          step: 5,
          digits: 0,
        },
      },
      {
        id: 'fir',
        title: 'Resposta em frequência',
        concept:
          'A resposta em frequência descreve como um sistema LTI altera amplitude e fase de cada senoide. Para um tom isolado, a amplitude de saída é a amplitude de entrada multiplicada pelo módulo da resposta.',
        intuition:
          'Cada frequência atravessa o filtro com um ganho próprio. O filtro não escolhe um único volume para o sinal inteiro, ele escala cada componente de modo diferente.',
        consequence:
          'O espectro da saída resulta da combinação do espectro de entrada com a resposta do filtro. Tons próximos ao corte podem receber ganhos intermediários.',
        formula: '|Y(f)|=|X(f)|\\,|H(f)|',
        symbols: [
          {
            symbol: 'Y(f)',
            name: 'Espectro de saída',
            unit: 'unidade do sinal',
            meaning: 'Amplitude complexa do sinal depois do filtro.',
          },
          {
            symbol: 'X(f)',
            name: 'Espectro de entrada',
            unit: 'unidade do sinal',
            meaning: 'Amplitude complexa antes do filtro.',
          },
          {
            symbol: 'H(f)',
            name: 'Resposta do filtro',
            unit: 'adimensional',
            meaning: 'Ganho aplicado à componente de frequência f.',
          },
          {
            symbol: 'f',
            name: 'Frequência',
            unit: 'Hz',
            meaning: 'Identifica a componente que está sendo analisada.',
          },
        ],
        derivation: [
          {
            explanation:
              'Um sistema LTI aplica H(f) a cada componente espectral da entrada.',
            equation: 'Y(f)=X(f)H(f)',
          },
          {
            explanation: 'O módulo do produto é o produto dos módulos.',
            equation: '|Y(f)|=|X(f)|\\,|H(f)|',
          },
          {
            explanation:
              'A fase também soma: fase de saída é fase de entrada mais fase do filtro.',
            equation: '\\angle Y(f)=\\angle X(f)+\\angle H(f)',
          },
        ],
        example: {
          question:
            'Uma componente de entrada tem amplitude 0,8 e o filtro aplica ganho 0,5. Qual é a amplitude de saída?',
          steps: [
            {
              explanation:
                'Multiplique a amplitude de entrada pelo módulo do ganho.',
              equation: '|Y(f)|=0{,}8\\cdot0{,}5',
            },
          ],
          result:
            'A amplitude de saída é 0,4. O tom perdeu metade da amplitude, equivalente a aproximadamente -6,02 dB.',
        },
        prompt:
          'Mude a largura de transição e compare o ganho ideal com o real.',
        control: {
          label: 'Largura de transição',
          symbol: '\\Delta f',
          unit: 'Hz',
          min: 100,
          max: 1500,
          step: 50,
          digits: 0,
        },
      },
    ],
  },
  {
    title: '04. FIR por dentro',
    summary: 'Entenda coeficientes, impulso e projeto por janelas.',
    lessons: [
      {
        id: 'impulse',
        title: 'Resposta ao impulso',
        concept:
          'A resposta ao impulso h[n] é a saída de um sistema quando a entrada é o impulso unitário δ[n]. Em um sistema linear e invariante no tempo, h[n] determina completamente a relação entre entrada e saída.',
        intuition:
          'O impulso testa a reação do filtro em um único instante. A resposta obtida pode ser deslocada e somada para prever o efeito sobre qualquer sequência.',
        consequence:
          'Coeficientes concentrados no tempo tendem a produzir transições mais largas em frequência. Respostas longas podem separar melhor frequências, mas exigem mais cálculo e geram maior atraso.',
        formula: '\\delta[n]\\xrightarrow{\\mathcal{H}}h[n]',
        symbols: [
          {
            symbol: '\\delta[n]',
            name: 'Impulso unitário',
            unit: 'adimensional',
            meaning: 'Sequência igual a 1 em n=0 e 0 nos demais índices.',
          },
          {
            symbol: 'h[n]',
            name: 'Resposta ao impulso',
            unit: 'adimensional',
            meaning:
              'Coeficientes que descrevem como o sistema responde ao impulso.',
          },
          {
            symbol: '\\mathcal{H}',
            name: 'Sistema',
            unit: 'operador',
            meaning: 'Transformação aplicada à entrada para produzir a saída.',
          },
        ],
        derivation: [
          {
            explanation:
              'Represente qualquer sequência como soma de impulsos deslocados e ponderados.',
            equation: 'x[n]=\\sum_{k=-\\infty}^{\\infty}x[k]\\delta[n-k]',
          },
          {
            explanation:
              'Pela invariância no tempo, a resposta ao impulso deslocado é h[n-k].',
            equation: '\\delta[n-k]\\xrightarrow{\\mathcal{H}}h[n-k]',
          },
          {
            explanation:
              'Pela linearidade, some todas as respostas ponderadas.',
            equation: 'y[n]=\\sum_{k=-\\infty}^{\\infty}x[k]h[n-k]',
          },
        ],
        example: {
          question:
            'Se a entrada é δ[n] e h[0]=1, h[1]=0,5, h[2]=0, qual é a saída?',
          steps: [
            {
              explanation:
                'A resposta do sistema ao impulso é, por definição, h[n].',
              equation: 'x[n]=\\delta[n]\\Rightarrow y[n]=h[n]',
            },
          ],
          result:
            'A saída é a sequência 1, 0,5, 0. Ela mostra diretamente os coeficientes e a duração da resposta.',
        },
        prompt:
          'Altere o comprimento e observe como a resposta se espalha no tempo.',
        control: {
          label: 'Comprimento da resposta',
          symbol: 'M',
          unit: 'coeficientes',
          min: 9,
          max: 65,
          step: 2,
          digits: 0,
        },
      },
      {
        id: 'windows',
        title: 'Janelas e projeto FIR',
        concept:
          'Um passa-baixa ideal possui resposta ao impulso infinita. O método da janela trunca essa resposta e multiplica os coeficientes por uma janela finita, como Hamming, para reduzir as descontinuidades do truncamento.',
        intuition:
          'Cortar uma sequência no meio cria bordas abruptas. A janela suaviza essas bordas, reduzindo ondulações espectrais, mas alargando a transição do filtro.',
        consequence:
          'Existe uma troca entre largura da transição e atenuação da faixa rejeitada. Mais coeficientes reduzem a largura da transição, mas elevam custo e atraso.',
        formula:
          'h[n]=h_{\\text{ideal}}[n]w[n],\\qquad w_H[n]=0{,}54-0{,}46\\cos\\left(\\frac{2\\pi n}{M-1}\\right)',
        symbols: [
          {
            symbol: 'h[n]',
            name: 'Coeficiente FIR',
            unit: 'adimensional',
            meaning: 'Peso aplicado à amostra de entrada atrasada.',
          },
          {
            symbol: 'h_{\\text{ideal}}[n]',
            name: 'Resposta ideal',
            unit: 'adimensional',
            meaning: 'Resposta infinita que representa o corte ideal.',
          },
          {
            symbol: 'w_H[n]',
            name: 'Janela de Hamming',
            unit: 'adimensional',
            meaning:
              'Peso que suaviza as extremidades dos coeficientes truncados.',
          },
          {
            symbol: 'n',
            name: 'Índice do coeficiente',
            unit: 'inteiro',
            meaning: 'Posição do coeficiente dentro do filtro.',
          },
          {
            symbol: 'M',
            name: 'Número de coeficientes',
            unit: 'coeficientes',
            meaning: 'Controla a duração e influencia a largura da transição.',
          },
        ],
        derivation: [
          {
            explanation:
              'Comece com a resposta ideal, que geralmente se estende para todos os índices.',
            equation: 'h_{\\text{ideal}}[n]',
          },
          {
            explanation:
              'Trunque para M amostras e aplique a janela termo a termo.',
            equation: 'h[n]=h_{\\text{ideal}}[n]w_H[n],\\quad 0\\leq n<M',
          },
          {
            explanation:
              'A janela Hamming usa cosseno para reduzir os valores nas bordas.',
            equation:
              'w_H[n]=0{,}54-0{,}46\\cos\\left(\\frac{2\\pi n}{M-1}\\right)',
          },
        ],
        example: {
          question:
            'Para M=5, quais são os pesos Hamming nas extremidades e no centro?',
          steps: [
            {
              explanation: 'Na extremidade n=0, o cosseno vale 1.',
              equation: 'w_H[0]=0{,}54-0{,}46=0{,}08',
            },
            {
              explanation:
                'No centro n=2, o argumento é π e o cosseno vale -1.',
              equation: 'w_H[2]=0{,}54+0{,}46=1',
            },
          ],
          result:
            'A janela preserva o centro e reduz as bordas, suavizando o truncamento.',
        },
        prompt:
          'Compare os coeficientes retangulares e Hamming para diferentes comprimentos.',
        control: {
          label: 'Número de coeficientes',
          symbol: 'M',
          unit: 'coeficientes',
          min: 9,
          max: 65,
          step: 2,
          digits: 0,
        },
      },
    ],
  },
  {
    title: '05. Convolução',
    summary: 'Calcule como uma entrada se combina com a resposta do sistema.',
    lessons: [
      {
        id: 'convolution-discrete',
        title: 'Convolução discreta',
        concept:
          'A convolução discreta soma produtos entre amostras da entrada e coeficientes da resposta ao impulso. Para cada saída, uma cópia invertida e deslocada de h[k] se alinha com x[n-k].',
        intuition:
          'Deslize a janela de coeficientes sobre a entrada. Em cada posição, multiplique os valores alinhados e some os produtos para obter uma amostra da saída.',
        consequence:
          'A saída depende de uma vizinhança da entrada. A forma dessa vizinhança explica suavização, atraso e resposta a transientes.',
        formula: 'y[n]=\\sum_{k=0}^{M-1}h[k]x[n-k]',
        symbols: [
          {
            symbol: 'y[n]',
            name: 'Amostra de saída',
            unit: 'unidade do sinal',
            meaning: 'Resultado da soma dos produtos para o índice n.',
          },
          {
            symbol: 'x[n-k]',
            name: 'Amostra da entrada',
            unit: 'unidade do sinal',
            meaning: 'Amostra selecionada pela posição k da janela deslocada.',
          },
          {
            symbol: 'h[k]',
            name: 'Coeficiente',
            unit: 'adimensional',
            meaning:
              'Peso que determina quanto a amostra correspondente contribui.',
          },
          {
            symbol: 'k',
            name: 'Índice da soma',
            unit: 'inteiro',
            meaning: 'Percorre os M coeficientes do filtro.',
          },
          {
            symbol: 'M',
            name: 'Comprimento do filtro',
            unit: 'coeficientes',
            meaning: 'Número de produtos somados para formar cada saída.',
          },
        ],
        derivation: [
          {
            explanation:
              'A entrada pode ser decomposta em impulsos ponderados.',
            equation: 'x[n]=\\sum_kx[k]\\delta[n-k]',
          },
          {
            explanation: 'Cada impulso produz uma cópia deslocada de h[n].',
            equation: 'y[n]=\\sum_kx[k]h[n-k]',
          },
          {
            explanation:
              'Reindexar a soma apresenta os coeficientes como uma janela que desliza sobre a entrada.',
            equation: 'y[n]=\\sum_{k=0}^{M-1}h[k]x[n-k]',
          },
        ],
        example: {
          question: 'Calcule y[1] para x=[1,2,0] e h=[1,1].',
          steps: [
            {
              explanation: 'Alinhe h[0] com x[1] e h[1] com x[0].',
              equation: 'y[1]=h[0]x[1]+h[1]x[0]',
            },
            {
              explanation: 'Substitua os valores.',
              equation: 'y[1]=1\\cdot2+1\\cdot1=3',
            },
          ],
          result:
            'A amostra de saída é 3. Cada termo pode ser conferido diretamente na sequência.',
        },
        prompt: 'Escolha uma amostra e confira os produtos que formam y[n].',
        control: {
          label: 'Índice da saída',
          symbol: 'n',
          unit: 'amostra',
          min: 0,
          max: 6,
          step: 1,
          digits: 0,
        },
      },
      {
        id: 'convolution-continuous',
        title: 'Convolução contínua',
        concept:
          'Na convolução contínua, a soma dos produtos vira uma integral sobre o deslocamento τ. Para cada t, a resposta h(t-τ) é refletida e deslocada em relação à entrada x(τ).',
        intuition:
          'O valor da saída é a área do produto entre as duas curvas. Sem sobreposição, a área é zero. À medida que a sobreposição cresce, a saída aumenta.',
        consequence:
          'A geometria da sobreposição determina a forma da saída. Dois pulsos retangulares iguais geram um triângulo; larguras diferentes geram um trapézio.',
        formula: 'y(t)=\\int_{-\\infty}^{\\infty}x(\\tau)h(t-\\tau)\\,d\\tau',
        symbols: [
          {
            symbol: 'y(t)',
            name: 'Saída',
            unit: 'unidade do sinal',
            meaning: 'Área acumulada do produto no deslocamento t.',
          },
          {
            symbol: 'x(\\tau)',
            name: 'Entrada fixa',
            unit: 'unidade do sinal',
            meaning: 'Sinal que permanece parado durante a operação.',
          },
          {
            symbol: 'h(t-\\tau)',
            name: 'Resposta deslocada',
            unit: 'adimensional',
            meaning: 'Resposta refletida e deslocada pela posição t.',
          },
          {
            symbol: '\\tau',
            name: 'Variável de integração',
            unit: 's',
            meaning: 'Percorre os instantes locais usados para medir a área.',
          },
          {
            symbol: 't',
            name: 'Deslocamento',
            unit: 's',
            meaning: 'Posição atual da resposta e instante da saída calculada.',
          },
        ],
        derivation: [
          {
            explanation:
              'Inverta h em relação ao tempo e desloque-a para a posição t.',
            equation: 'h(t-\\tau)',
          },
          {
            explanation: 'Multiplique os valores que se sobrepõem.',
            equation: 'p_t(\\tau)=x(\\tau)h(t-\\tau)',
          },
          {
            explanation:
              'Integre o produto para obter a área e a saída naquele deslocamento.',
            equation: 'y(t)=\\int_{-\\infty}^{\\infty}p_t(\\tau)\\,d\\tau',
          },
        ],
        example: {
          question:
            'Dois pulsos de altura 1 e larguras 1 s e 2 s estão alinhados pelo centro. Qual é a área de sobreposição?',
          steps: [
            {
              explanation:
                'A largura menor determina o comprimento da interseção.',
              equation: 'L_{\\cap}=\\min(1,2)=1\\text{ s}',
            },
            {
              explanation: 'A altura do produto é 1 vezes 1.',
              equation: 'y(0)=1\\cdot1\\text{ s}=1',
            },
          ],
          result:
            'A saída no alinhamento central é 1. Ao deslocar o pulso, a área muda com o comprimento da interseção.',
        },
        prompt: 'Desloque o pulso e acompanhe a área que forma y(t).',
        control: {
          label: 'Deslocamento',
          symbol: 't',
          unit: 's',
          min: -2,
          max: 2,
          step: 0.1,
          digits: 1,
        },
      },
    ],
  },
  {
    title: '06. Além do FIR',
    summary: 'Compare recursão, estabilidade, fase e atraso.',
    lessons: [
      {
        id: 'iir',
        title: 'Introdução a IIR',
        concept:
          'Filtros IIR usam amostras atuais e anteriores da entrada, além de saídas anteriores. A realimentação permite respostas longas com poucos coeficientes.',
        intuition:
          'Parte da saída volta para o cálculo seguinte. É como um eco que continua influenciando o sistema depois que a entrada inicial terminou.',
        consequence:
          'Poucos coeficientes podem produzir respostas estreitas, mas a recursão exige verificar estabilidade e precisão numérica. Uma saída passada pode amplificar erros futuros.',
        formula: 'y[n]=\\sum_{k=0}^{Q}b_kx[n-k]-\\sum_{k=1}^{P}a_ky[n-k]',
        symbols: [
          {
            symbol: 'y[n]',
            name: 'Saída atual',
            unit: 'unidade do sinal',
            meaning:
              'Valor produzido no índice n pela entrada e pela realimentação.',
          },
          {
            symbol: 'x[n-k]',
            name: 'Entrada atrasada',
            unit: 'unidade do sinal',
            meaning: 'Amostra atual ou passada da entrada.',
          },
          {
            symbol: 'b_k',
            name: 'Coeficiente direto',
            unit: 'adimensional',
            meaning: 'Pondera as amostras de entrada.',
          },
          {
            symbol: 'a_k',
            name: 'Coeficiente de realimentação',
            unit: 'adimensional',
            meaning: 'Pondera as saídas anteriores e define a recursão.',
          },
          {
            symbol: 'P,Q',
            name: 'Ordens do filtro',
            unit: 'inteiros',
            meaning:
              'Indicam quantos atrasos de saída e entrada entram na equação.',
          },
        ],
        derivation: [
          {
            explanation:
              'Some as contribuições das amostras atuais e passadas da entrada.',
            equation: '\\sum_{k=0}^{Q}b_kx[n-k]',
          },
          {
            explanation:
              'Some também as contribuições das saídas passadas com os sinais definidos pelo denominador.',
            equation: '-\\sum_{k=1}^{P}a_ky[n-k]',
          },
          {
            explanation:
              'A combinação produz a equação de diferenças do filtro IIR.',
            equation: 'y[n]=\\sum_{k=0}^{Q}b_kx[n-k]-\\sum_{k=1}^{P}a_ky[n-k]',
          },
        ],
        example: {
          question:
            'Para y[n]=0,5x[n]+0,5y[n-1], entrada unitária e estado inicial zero, calcule as duas primeiras saídas.',
          steps: [
            {
              explanation: 'No primeiro instante não há saída anterior.',
              equation: 'y[0]=0{,}5(1)+0{,}5(0)=0{,}5',
            },
            {
              explanation:
                'No próximo instante, a saída anterior retorna pela realimentação.',
              equation: 'y[1]=0{,}5(1)+0{,}5(0{,}5)=0{,}75',
            },
          ],
          result:
            'A saída cresce gradualmente. O coeficiente de realimentação controla quanto do estado anterior permanece.',
        },
        prompt: 'Ajuste a realimentação e compare a duração da resposta.',
        control: {
          label: 'Coeficiente de realimentação',
          symbol: 'r',
          unit: 'adimensional',
          min: 0.1,
          max: 0.95,
          step: 0.05,
          digits: 2,
        },
      },
      {
        id: 'iir-stability',
        title: 'Estabilidade de filtros IIR',
        concept:
          'Um sistema BIBO estável produz saída limitada para qualquer entrada limitada. Em um IIR causal de primeira ordem, a resposta ao impulso é r^n u[n], e a soma absoluta converge apenas quando |r|<1.',
        intuition:
          'A cada passo, a resposta é multiplicada por r. Se |r|<1, ela diminui. Se |r|=1, não decai. Se |r|>1, cresce sem limite.',
        consequence:
          'Filtros instáveis podem saturar a saída e amplificar ruído ou erros de arredondamento. Para sistemas racionais causais, os polos precisam estar dentro do círculo unitário.',
        formula: 'h[n]=r^nu[n],\\qquad |r|<1',
        symbols: [
          {
            symbol: 'h[n]',
            name: 'Resposta ao impulso',
            unit: 'adimensional',
            meaning:
              'Sequência cuja soma absoluta determina a estabilidade BIBO do sistema LTI.',
          },
          {
            symbol: 'r',
            name: 'Polo de primeira ordem',
            unit: 'adimensional',
            meaning:
              'Multiplicador entre amostras consecutivas. Seu módulo determina se a resposta decai ou cresce.',
          },
          {
            symbol: 'u[n]',
            name: 'Degrau unitário',
            unit: 'adimensional',
            meaning: 'Ativa a resposta para n maior ou igual a zero.',
          },
          {
            symbol: 'n',
            name: 'Índice',
            unit: 'inteiro',
            meaning: 'Conta os passos da resposta recursiva.',
          },
        ],
        derivation: [
          {
            explanation:
              'Uma recursão de primeira ordem multiplica cada saída anterior por r.',
            equation: 'h[n]=r h[n-1]',
          },
          {
            explanation:
              'Partindo de h[0]=1, repetir a relação n vezes produz uma potência.',
            equation: 'h[n]=r^n u[n]',
          },
          {
            explanation:
              'A soma absoluta de uma série geométrica converge somente se o módulo da razão for menor que 1.',
            equation: '\\sum_{n=0}^{\\infty}|r|^n<\\infty\\iff|r|<1',
          },
        ],
        example: {
          question:
            'Compare a resposta para r=0,8 e r=1,1 nos quatro primeiros índices.',
          steps: [
            {
              explanation: 'Para r=0,8, cada amostra diminui.',
              equation: '1,\\;0{,}8,\\;0{,}64,\\;0{,}512',
            },
            {
              explanation: 'Para r=1,1, cada amostra cresce.',
              equation: '1,\\;1{,}1,\\;1{,}21,\\;1{,}331',
            },
          ],
          result:
            'r=0,8 é estável. r=1,1 produz crescimento e viola a condição de estabilidade.',
        },
        prompt: 'Cruze |r|=1 e observe a resposta deixar de decair.',
        control: {
          label: 'Polo',
          symbol: 'r',
          unit: 'adimensional',
          min: 0.5,
          max: 1.1,
          step: 0.02,
          digits: 2,
        },
      },
      {
        id: 'phase',
        title: 'Fase e atraso',
        concept:
          'A fase descreve o deslocamento angular aplicado a cada componente senoidal. Em um filtro FIR simétrico, a fase pode variar linearmente com a frequência, o que corresponde a um atraso constante em amostras.',
        intuition:
          'Dois sinais podem ter o mesmo volume e frequências, mas estar deslocados no tempo. Se todas as frequências atrasam pela mesma quantidade, a forma do sinal é preservada, apenas aparece mais tarde.',
        consequence:
          'Atraso de grupo variável pode deformar transientes. FIRs lineares em fase mantêm alinhamento temporal entre componentes, embora introduzam atraso de processamento.',
        formula:
          '\\tau_g(\\omega)=-\\frac{d\\phi(\\omega)}{d\\omega},\\qquad \\phi(\\omega)=-D\\omega',
        symbols: [
          {
            symbol: '\\tau_g',
            name: 'Atraso de grupo',
            unit: 'amostras',
            meaning:
              'Derivada negativa da fase em relação à frequência angular.',
          },
          {
            symbol: '\\phi(\\omega)',
            name: 'Fase',
            unit: 'rad',
            meaning:
              'Deslocamento angular aplicado à componente de frequência ω.',
          },
          {
            symbol: '\\omega',
            name: 'Frequência angular',
            unit: 'rad/amostra',
            meaning: 'Frequência discreta usada na resposta do sistema.',
          },
          {
            symbol: 'D',
            name: 'Atraso constante',
            unit: 'amostras',
            meaning:
              'Deslocamento temporal comum a todas as frequências em fase linear.',
          },
        ],
        derivation: [
          {
            explanation:
              'Uma sequência atrasada D amostras tem fase linear com inclinação -D.',
            equation: '\\phi(\\omega)=-D\\omega',
          },
          {
            explanation:
              'A definição de atraso de grupo é a inclinação negativa da fase.',
            equation: '\\tau_g(\\omega)=-\\frac{d\\phi(\\omega)}{d\\omega}',
          },
          {
            explanation:
              'Derivar -Dω retorna -D, e o sinal negativo da definição resulta em D.',
            equation: '\\tau_g=D',
          },
        ],
        example: {
          question:
            'Um FIR linear em fase atrasa o sinal em 3 amostras. Qual é o atraso de grupo?',
          steps: [
            {
              explanation: 'A fase é -3ω.',
              equation: '\\phi(\\omega)=-3\\omega',
            },
            {
              explanation:
                'A derivada é -3, então aplique o sinal negativo da definição.',
              equation: '\\tau_g=-\\frac{d(-3\\omega)}{d\\omega}=3',
            },
          ],
          result:
            'Todas as componentes atrasam 3 amostras. Para f_s=16 kHz, isso equivale a 0,1875 ms.',
        },
        prompt: 'Ajuste o atraso e observe a inclinação da fase.',
        control: {
          label: 'Atraso',
          symbol: 'D',
          unit: 'amostras',
          min: 0,
          max: 16,
          step: 1,
          digits: 0,
        },
      },
    ],
  },
];

export const courseLessons = courseModules.flatMap((module) => module.lessons);
