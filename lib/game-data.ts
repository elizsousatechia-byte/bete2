import {
  Rocket,
  Crown,
  Sword,
  Shield,
  Gem,
  Trophy,
  Compass,
  Anchor,
  Flame,
  Zap,
  Sun,
  Moon,
  Heart,
  Music,
  Gamepad2,
  Key,
  Camera,
  Globe,
  Book,
  Feather,
  Hourglass,
  Flashlight,
  Wand2,
  FlaskConical,
  Sparkles,
  Telescope,
  Backpack,
  Headphones,
  Bell,
  Radio,
  Eye,
  Target,
  LucideIcon
} from 'lucide-react';

export type GameTheme = 'animals_house' | 'animals' | 'household' | 'classic' | 'mario';

export interface CardDefinition {
  pairId: string;
  name: string;
  emoji?: string;
  icon?: LucideIcon;
  subtitle?: string;
  category: string;
  color: string;
  bgGrad: string;
  borderAccent: string;
  syllables?: string;
  readingSentence?: string;
  curiosity?: string;
}

// Comprehensive reading and study database with syllables, example reading sentences, and fun facts
export const STUDY_READING_DATA: Record<string, { syllables: string; readingSentence: string; curiosity: string }> = {
  // Animals (32)
  leao: { syllables: 'LE • Ã • O', readingSentence: 'O leão é o rei corajoso da savana.', curiosity: 'O rugido do leão pode ser ouvido a até 8 km de distância!' },
  elefante: { syllables: 'E • LE • FAN • TE', readingSentence: 'O elefante usa sua longa tromba para beber água.', curiosity: 'O elefante é o maior mamífero terrestre do planeta Terra.' },
  girafa: { syllables: 'GI • RA • FA', readingSentence: 'A girafa alcança as folhas mais altas das árvores.', curiosity: 'A língua da girafa é azulada e mede quase 50 centímetros.' },
  tigre: { syllables: 'TI • GRE', readingSentence: 'O tigre tem belas listras pretas e alaranjadas.', curiosity: 'Nenhum tigre tem listras idênticas; são como impressões digitais.' },
  panda: { syllables: 'UR • SO • PAN • DA', readingSentence: 'O urso panda adora mastigar bambu fresquinho.', curiosity: 'Um urso panda pode passar até 12 horas por dia comendo bambu.' },
  raposa: { syllables: 'RA • PO • SA', readingSentence: 'A raposa é esperta e tem uma linda cauda peluda.', curiosity: 'As raposas usam o campo magnético da Terra para saltar nas presas.' },
  macaco: { syllables: 'MA • CA • CO', readingSentence: 'O macaco pula de galho em galho com agilidade.', curiosity: 'Macacos usam ferramentas como pedras e gravetos na floresta.' },
  zebra: { syllables: 'ZE • BRA', readingSentence: 'A zebra corre veloz em bandos pelas savanas.', curiosity: 'As listras da zebra ajudam a regular o calor e afastar moscas.' },
  lobo: { syllables: 'LO • BO', readingSentence: 'O lobo uiva para a lua cheia junto com sua alcateia.', curiosity: 'Os uivos dos lobos servem para reunir o grupo e marcar território.' },
  'urso-polar': { syllables: 'UR • SO • PO • LAR', readingSentence: 'O urso polar caminha com passos firmes sobre o gelo.', curiosity: 'A pele do urso polar sob os pelos brancos é preta para absorver calor.' },
  pinguim: { syllables: 'PIN • GUIM', readingSentence: 'O pinguim desliza na neve e nada super veloz.', curiosity: 'Pinguins não voam no ar, mas voam embaixo d água com asas fortes.' },
  golfinho: { syllables: 'GOL • FI • NHO', readingSentence: 'O golfinho salta alegremente sobre as ondas do mar.', curiosity: 'Golfinhos se comunicam por assobios e têm nomes próprios entre si.' },
  baleia: { syllables: 'BA • LEI • A', readingSentence: 'A baleia azul canta canções profundas pelo oceano.', curiosity: 'A baleia azul é o maior animal que já existiu em nosso planeta.' },
  tubarao: { syllables: 'TU • BA • RÃO', readingSentence: 'O tubarão nada veloz com sua barbatana elegante.', curiosity: 'Os tubarões têm um olfato tão apurado que sentem cheiros a quilômetros.' },
  polvo: { syllables: 'POL • VO', readingSentence: 'O polvo tem oito braços flexíveis e muda de cor.', curiosity: 'O polvo tem três corações e o sangue dele é azul.' },
  tartaruga: { syllables: 'TAR • TA • RU • GA', readingSentence: 'A tartaruga marinha viaja milhares de quilômetros.', curiosity: 'A tartaruga fêmea sempre volta à mesma praia em que nasceu para pôr ovos.' },
  aguia: { syllables: 'Á • GUI • A', readingSentence: 'A águia real enxerga pequenos detalhes lá do alto.', curiosity: 'A visão da águia é até 8 vezes mais nítida que a dos humanos.' },
  coruja: { syllables: 'CO • RU • JA', readingSentence: 'A coruja observa a noite com seus grandes olhos redondos.', curiosity: 'A coruja consegue girar a cabeça quase uma volta completa sem se mover.' },
  tucano: { syllables: 'TU • CA • NO', readingSentence: 'O tucano exibe seu bico vibrante e colorido.', curiosity: 'Apesar de grande, o bico do tucano é esponjoso, oco e bem levinho.' },
  pavao: { syllables: 'PA • VÃO', readingSentence: 'O pavão abre sua cauda deslumbrante como um leque.', curiosity: 'As penas do pavão refletem a luz e parecem olhos mágicos brilhantes.' },
  flamingo: { syllables: 'FLA • MIN • GO', readingSentence: 'O flamingo se equilibra numa perna só nas águas calmas.', curiosity: 'A cor rosa das penas do flamingo vem dos alimentos que ele come.' },
  camelo: { syllables: 'CA • ME • LO', readingSentence: 'O camelo caminha pacientemente pelas dunas do deserto.', curiosity: 'A corcova do camelo guarda gordura que ele transforma em energia e água.' },
  canguru: { syllables: 'CAN • GU • RU', readingSentence: 'O canguru dá grandes saltos e cuida do filhote na bolsa.', curiosity: 'O rabo forte do canguru funciona como uma terceira perna de apoio.' },
  coala: { syllables: 'CO • A • LA', readingSentence: 'O coala abraça os galhos de eucalipto e dorme tranquilo.', curiosity: 'O coala dorme até 20 horas por dia para economizar energia.' },
  cavalo: { syllables: 'CA • VA • LO', readingSentence: 'O cavalo galopa livre pelos campos verdes floridos.', curiosity: 'Os cavalos conseguem travar as patas e dormir em pé sem cair.' },
  rinoceronte: { syllables: 'RI • NO • CE • RON • TE', readingSentence: 'O rinoceronte tem couraça forte e chifre protetor.', curiosity: 'O chifre do rinoceronte é feito de queratina, como as nossas unhas.' },
  hipopotamo: { syllables: 'HI • PO • PÓ • TA • MO', readingSentence: 'O hipopótamo passa o dia no rio para refrescar a pele.', curiosity: 'Apesar de pesado, o hipopótamo corre muito rápido em terra firme.' },
  crocodilo: { syllables: 'CRO • CO • DI • LO', readingSentence: 'O crocodilo descansa na margem aquecendo-se ao sol.', curiosity: 'Os crocodilos já habitavam a Terra na época dos dinossauros.' },
  esquilo: { syllables: 'ES • QUI • LO', readingSentence: 'O esquilo guarda castanhas e nozes para o inverno.', curiosity: 'Muitas árvores nascem porque os esquilos esquecem onde enterraram sementes.' },
  ourico: { syllables: 'OU • RI • ÇO', readingSentence: 'O ouriço se fecha em uma bolinha cheia de espinhos.', curiosity: 'Os espinhos do ouriço servem de escudo contra qualquer perigo.' },
  sapo: { syllables: 'SA • PI • NHO', readingSentence: 'O sapinho pula perto da lagoa e canta à noite.', curiosity: 'Os sapos conseguem absorver água diretamente através da pele.' },
  borboleta: { syllables: 'BOR • BO • LE • TA', readingSentence: 'A borboleta dança no ar e pousa nas flores do jardim.', curiosity: 'As borboletas têm pequenos sensores nas patinhas para sentir o gosto das flores.' },

  // Household Objects (32)
  cama: { syllables: 'CA • MA', readingSentence: 'A cama é macia e quentinha para um sono relaxante.', curiosity: 'Dormir bem na cama ajuda o cérebro a guardar tudo o que estudamos.' },
  sofa: { syllables: 'SO • FÁ', readingSentence: 'O sofá da sala acomoda toda a família para ver histórias.', curiosity: 'O sofá é o móvel preferido para reunir amigos e relaxar em casa.' },
  geladeira: { syllables: 'GE • LA • DEI • RA', readingSentence: 'A geladeira conserva frutas, sucos e comidas fresquinhas.', curiosity: 'O motor da geladeira circula gás especial que retira o calor de dentro dela.' },
  espelho: { syllables: 'ES • PE • LHO', readingSentence: 'O espelho reflete o nosso sorriso brilhante toda manhã.', curiosity: 'Espelhos de vidro com prata foram inventados em Veneza, na Itália.' },
  abajur: { syllables: 'A • BA • JUR', readingSentence: 'O abajur ilumina o quarto com uma luz suave para ler.', curiosity: 'A palavra abajur veio do francês e significa suavizar a claridade.' },
  fogao: { syllables: 'FO • GÃO', readingSentence: 'O fogão cozinha refeições saborosas com suas chamas.', curiosity: 'O calor do fogão transforma os alimentos crus em receitas deliciosas.' },
  mesa: { syllables: 'ME • SA', readingSentence: 'A mesa de jantar reúne a família para partilhar o almoço.', curiosity: 'A mesa redonda é símbolo histórico de que todos têm a mesma importância.' },
  cadeira: { syllables: 'CA • DEI • RA', readingSentence: 'A cadeira apoia o corpo com conforto para estudar e ler.', curiosity: 'Cadeiras bem ajustadas protegem a coluna de quem adora ler livros.' },
  tv: { syllables: 'TE • LE • VI • SÃO', readingSentence: 'A televisão mostra desenhos educativos e novidades do mundo.', curiosity: 'A primeira transmissão de TV pública aconteceu em Londres no ano de 1936.' },
  'guarda-roupa': { syllables: 'GUAR • DA • ROU • PA', readingSentence: 'O guarda-roupa organiza roupas, casacos e camisas.', curiosity: 'Cabides e gavetas protegem as roupas da poeira e da umidade.' },
  relogio: { syllables: 'RE • LÓ • GIO', readingSentence: 'O relógio de parede marca as horas com seu tic-tac pontual.', curiosity: 'Os primeiros relógios da humanidade usavam a sombra do sol na terra.' },
  janela: { syllables: 'JA • NE • LA', readingSentence: 'A janela aberta deixa o ar fresco e o sol entrarem.', curiosity: 'O vidro transparente da janela protege da chuva sem tirar a claridade.' },
  porta: { syllables: 'POR • TA', readingSentence: 'A porta de entrada protege o lar e recebe as visitas.', curiosity: 'Bater à porta antes de entrar demonstra respeito e carinho por todos.' },
  chave: { syllables: 'CHA • VE', readingSentence: 'A chave dourada abre a fechadura com toda segurança.', curiosity: 'As primeiras chaves do mundo eram feitas de madeira dura no Egito antigo.' },
  computador: { syllables: 'COM • PU • TA • DOR', readingSentence: 'O computador serve para pesquisar, aprender e criar jogos.', curiosity: 'O computador processa bilhões de cálculos matemáticos em um piscar de olhos.' },
  celular: { syllables: 'CE • LU • LAR', readingSentence: 'O celular conecta as pessoas por chamadas e mensagens.', curiosity: 'Os celulares modernos funcionam através de ondas invisíveis de rádio.' },
  livro: { syllables: 'LI • VRO', readingSentence: 'O livro abre caminhos incríveis para a imaginação.', curiosity: 'Quem lê livros todos os dias desenvolve vocabulário e memória afiada!' },
  travesseiro: { syllables: 'TRA • VES • SEI • RO', readingSentence: 'O travesseiro macio apoia a cabeça na hora de dormir.', curiosity: 'Travesseiros confortáveis relaxam os músculos do pescoço à noite.' },
  cobertor: { syllables: 'CO • BER • TOR', readingSentence: 'O cobertor quentinho protege o corpo do frio noturno.', curiosity: 'O tecido do cobertor retém o ar aquecido pelo próprio corpo da pessoa.' },
  toalha: { syllables: 'TO • A • LHA', readingSentence: 'A toalha felpuda seca as gotas de água após o banho.', curiosity: 'As fibras de algodão da toalha absorvem água até 27 vezes o peso delas!' },
  chuveiro: { syllables: 'CHU • VEI • RO', readingSentence: 'O chuveiro jorra água morna e gostosa para o banho.', curiosity: 'Tomar banho no chuveiro ajuda a relaxar os músculos e descansar o corpo.' },
  sabonete: { syllables: 'SA • BO • NE • TE', readingSentence: 'O sabonete perfumado faz espuma e limpa bem as mãos.', curiosity: 'Lavar as mãos com sabonete previne mais de 80% das doenças comuns.' },
  'escova-dente': { syllables: 'ES • CO • VA', readingSentence: 'A escova de dentes mantém nosso sorriso limpo e saudável.', curiosity: 'Escovar os dentes após cada refeição afasta todas as bactérias da boca.' },
  prato: { syllables: 'PRA • TO', readingSentence: 'O prato recebe a comida colorida, cheia de vitaminas.', curiosity: 'Pratos com alimentos de várias cores são os mais nutritivos e saudáveis.' },
  xicara: { syllables: 'XÍ • CA • RA', readingSentence: 'A xícara quentinha fumega com chocolate, chá ou café.', curiosity: 'A asinha da xícara protege os dedos do calor da bebida gostosa.' },
  'garfo-faca': { syllables: 'TAL • HE • RES', readingSentence: 'Os talheres nos ajudam a comer a refeição com facilidade.', curiosity: 'O garfo e a faca facilitam cortar e saborear cada pedacinho da comida.' },
  microondas: { syllables: 'MI • CRO • ON • DAS', readingSentence: 'O micro-ondas aquece o leite e a comida em segundos.', curiosity: 'O micro-ondas usa ondas seguras que fazem a água do alimento vibrar e esquentar.' },
  liquidificador: { syllables: 'LI • QUI • DI • FI • CA • DOR', readingSentence: 'O liquidificador bate frutas gostosas e faz vitaminas cremosas.', curiosity: 'As hélices de aço do liquidificador misturam tudo de forma homogênea.' },
  ventilador: { syllables: 'VEN • TI • LA • DOR', readingSentence: 'O ventilador gira rápido e sopra uma brisa fresca.', curiosity: 'O ar em movimento do ventilador refresca a pele nos dias mais quentes.' },
  tapete: { syllables: 'TA • PE • TE', readingSentence: 'O tapete no piso deixa a sala aconchegante e quentinha.', curiosity: 'Tapetes macios abafam o som dos passos e acolhem os pés descalços.' },
  'planta-vaso': { syllables: 'PLAN • TA', readingSentence: 'A planta no vaso traz o verde da natureza para dentro de casa.', curiosity: 'As plantas produzem oxigênio puro através da luz do sol.' },
  violao: { syllables: 'VI • O • LÃO', readingSentence: 'O violão toca notas musicais para a gente cantar junto.', curiosity: 'Cada uma das seis cordas do violão emite um tom musical diferente.' },
};

// 32 Unique Animals with habitats and rich colors
export const ANIMALS_DATABASE: CardDefinition[] = [
  {
    pairId: 'leao',
    name: 'Leão',
    emoji: '🦁',
    subtitle: 'Rei da Savana',
    category: 'Savana',
    color: 'text-amber-400',
    bgGrad: 'from-amber-500/20 via-yellow-500/10 to-orange-500/15',
    borderAccent: 'border-amber-400/70'
  },
  {
    pairId: 'elefante',
    name: 'Elefante',
    emoji: '🐘',
    subtitle: 'Gigante Gentil',
    category: 'Savana',
    color: 'text-slate-300',
    bgGrad: 'from-slate-500/20 via-zinc-500/10 to-stone-500/15',
    borderAccent: 'border-slate-400/70'
  },
  {
    pairId: 'girafa',
    name: 'Girafa',
    emoji: '🦒',
    subtitle: 'Pescoço Mais Alto',
    category: 'Savana',
    color: 'text-yellow-400',
    bgGrad: 'from-yellow-500/20 via-amber-500/10 to-orange-400/15',
    borderAccent: 'border-yellow-400/70'
  },
  {
    pairId: 'tigre',
    name: 'Tigre',
    emoji: '🐅',
    subtitle: 'Fera Listrada',
    category: 'Selva',
    color: 'text-orange-400',
    bgGrad: 'from-orange-500/20 via-amber-600/10 to-red-500/15',
    borderAccent: 'border-orange-400/70'
  },
  {
    pairId: 'panda',
    name: 'Urso Panda',
    emoji: '🐼',
    subtitle: 'Amante de Bambu',
    category: 'Floresta',
    color: 'text-emerald-300',
    bgGrad: 'from-emerald-500/20 via-teal-500/10 to-slate-500/15',
    borderAccent: 'border-emerald-400/70'
  },
  {
    pairId: 'raposa',
    name: 'Raposa',
    emoji: '🦊',
    subtitle: 'Esperta e Ágil',
    category: 'Floresta',
    color: 'text-orange-400',
    bgGrad: 'from-orange-500/20 via-red-500/10 to-amber-500/15',
    borderAccent: 'border-orange-400/70'
  },
  {
    pairId: 'macaco',
    name: 'Macaco',
    emoji: '🐒',
    subtitle: 'Acrobata da Selva',
    category: 'Selva',
    color: 'text-amber-500',
    bgGrad: 'from-amber-600/20 via-yellow-600/10 to-orange-500/15',
    borderAccent: 'border-amber-500/70'
  },
  {
    pairId: 'zebra',
    name: 'Zebra',
    emoji: '🦓',
    subtitle: 'Listras Únicas',
    category: 'Savana',
    color: 'text-zinc-200',
    bgGrad: 'from-zinc-400/20 via-neutral-500/10 to-slate-400/15',
    borderAccent: 'border-zinc-300/70'
  },
  {
    pairId: 'lobo',
    name: 'Lobo Cinzento',
    emoji: '🐺',
    subtitle: 'Uivo Sob a Lua',
    category: 'Floresta',
    color: 'text-indigo-300',
    bgGrad: 'from-indigo-500/20 via-slate-600/10 to-blue-500/15',
    borderAccent: 'border-indigo-400/70'
  },
  {
    pairId: 'urso-polar',
    name: 'Urso Polar',
    emoji: '🐻‍❄️',
    subtitle: 'Guardião do Gelo',
    category: 'Polar',
    color: 'text-cyan-200',
    bgGrad: 'from-cyan-400/20 via-sky-500/10 to-blue-400/15',
    borderAccent: 'border-cyan-300/70'
  },
  {
    pairId: 'pinguim',
    name: 'Pinguim',
    emoji: '🐧',
    subtitle: 'Nadador Antártico',
    category: 'Polar',
    color: 'text-sky-300',
    bgGrad: 'from-sky-500/20 via-cyan-600/10 to-indigo-500/15',
    borderAccent: 'border-sky-400/70'
  },
  {
    pairId: 'golfinho',
    name: 'Golfinho',
    emoji: '🐬',
    subtitle: 'Acrobata dos Mares',
    category: 'Oceano',
    color: 'text-teal-300',
    bgGrad: 'from-teal-500/20 via-cyan-500/10 to-blue-500/15',
    borderAccent: 'border-teal-300/70'
  },
  {
    pairId: 'baleia',
    name: 'Baleia Azul',
    emoji: '🐋',
    subtitle: 'Maior Ser Vivo',
    category: 'Oceano',
    color: 'text-blue-400',
    bgGrad: 'from-blue-600/20 via-indigo-600/10 to-cyan-500/15',
    borderAccent: 'border-blue-400/70'
  },
  {
    pairId: 'tubarao',
    name: 'Tubarão',
    emoji: '🦈',
    subtitle: 'Predador dos Mares',
    category: 'Oceano',
    color: 'text-slate-300',
    bgGrad: 'from-slate-600/20 via-blue-700/10 to-cyan-600/15',
    borderAccent: 'border-slate-400/70'
  },
  {
    pairId: 'polvo',
    name: 'Polvo',
    emoji: '🐙',
    subtitle: 'Mestre dos 8 Braços',
    category: 'Oceano',
    color: 'text-purple-400',
    bgGrad: 'from-purple-500/20 via-fuchsia-500/10 to-pink-500/15',
    borderAccent: 'border-purple-400/70'
  },
  {
    pairId: 'tartaruga',
    name: 'Tartaruga',
    emoji: '🐢',
    subtitle: 'Navegadora Milenar',
    category: 'Oceano',
    color: 'text-emerald-400',
    bgGrad: 'from-emerald-500/20 via-green-600/10 to-teal-500/15',
    borderAccent: 'border-emerald-400/70'
  },
  {
    pairId: 'aguia',
    name: 'Águia Real',
    emoji: '🦅',
    subtitle: 'Soberana dos Céus',
    category: 'Aves',
    color: 'text-amber-300',
    bgGrad: 'from-amber-600/20 via-yellow-600/10 to-orange-500/15',
    borderAccent: 'border-amber-400/70'
  },
  {
    pairId: 'coruja',
    name: 'Coruja',
    emoji: '🦉',
    subtitle: 'Sábia da Noite',
    category: 'Aves',
    color: 'text-violet-300',
    bgGrad: 'from-violet-500/20 via-purple-600/10 to-indigo-500/15',
    borderAccent: 'border-violet-400/70'
  },
  {
    pairId: 'tucano',
    name: 'Tucano',
    emoji: '🦜',
    subtitle: 'Bico Arco-Íris',
    category: 'Aves',
    color: 'text-yellow-400',
    bgGrad: 'from-yellow-500/20 via-orange-500/10 to-red-500/15',
    borderAccent: 'border-yellow-400/70'
  },
  {
    pairId: 'pavao',
    name: 'Pavão Real',
    emoji: '🦚',
    subtitle: 'Caudas Radiantes',
    category: 'Aves',
    color: 'text-cyan-300',
    bgGrad: 'from-cyan-500/20 via-emerald-500/10 to-blue-500/15',
    borderAccent: 'border-cyan-400/70'
  },
  {
    pairId: 'flamingo',
    name: 'Flamingo',
    emoji: '🦩',
    subtitle: 'Elegância Rosa',
    category: 'Aves',
    color: 'text-pink-400',
    bgGrad: 'from-pink-500/20 via-rose-500/10 to-red-400/15',
    borderAccent: 'border-pink-400/70'
  },
  {
    pairId: 'camelo',
    name: 'Camelo',
    emoji: '🐫',
    subtitle: 'Navegador do Deserto',
    category: 'Deserto',
    color: 'text-amber-500',
    bgGrad: 'from-amber-600/20 via-yellow-600/10 to-orange-600/15',
    borderAccent: 'border-amber-500/70'
  },
  {
    pairId: 'canguru',
    name: 'Canguru',
    emoji: '🦘',
    subtitle: 'Saltador Veloz',
    category: 'Savana',
    color: 'text-amber-400',
    bgGrad: 'from-amber-500/20 via-orange-500/10 to-yellow-600/15',
    borderAccent: 'border-amber-400/70'
  },
  {
    pairId: 'coala',
    name: 'Coala',
    emoji: '🐨',
    subtitle: 'Dorminhoco Fofo',
    category: 'Floresta',
    color: 'text-slate-300',
    bgGrad: 'from-slate-500/20 via-stone-500/10 to-zinc-500/15',
    borderAccent: 'border-slate-400/70'
  },
  {
    pairId: 'cavalo',
    name: 'Cavalo',
    emoji: '🐴',
    subtitle: 'Galope Livre',
    category: 'Fazenda',
    color: 'text-amber-600',
    bgGrad: 'from-amber-700/20 via-yellow-600/10 to-orange-700/15',
    borderAccent: 'border-amber-600/70'
  },
  {
    pairId: 'rinoceronte',
    name: 'Rinoceronte',
    emoji: '🦏',
    subtitle: 'Couraça Forte',
    category: 'Savana',
    color: 'text-stone-300',
    bgGrad: 'from-stone-600/20 via-slate-600/10 to-zinc-600/15',
    borderAccent: 'border-stone-400/70'
  },
  {
    pairId: 'hipopotamo',
    name: 'Hipopótamo',
    emoji: '🦛',
    subtitle: 'Gigante dos Rios',
    category: 'Savana',
    color: 'text-blue-300',
    bgGrad: 'from-blue-600/20 via-slate-700/10 to-indigo-600/15',
    borderAccent: 'border-blue-400/70'
  },
  {
    pairId: 'crocodilo',
    name: 'Crocodilo',
    emoji: '🐊',
    subtitle: 'Mestre dos Pântanos',
    category: 'Pântano',
    color: 'text-emerald-500',
    bgGrad: 'from-emerald-600/20 via-green-700/10 to-teal-600/15',
    borderAccent: 'border-emerald-500/70'
  },
  {
    pairId: 'esquilo',
    name: 'Esquilo',
    emoji: '🐿️',
    subtitle: 'Guardião de Nozes',
    category: 'Floresta',
    color: 'text-amber-500',
    bgGrad: 'from-amber-600/20 via-orange-600/10 to-yellow-600/15',
    borderAccent: 'border-amber-500/70'
  },
  {
    pairId: 'ourico',
    name: 'Ouriço',
    emoji: '🦔',
    subtitle: 'Espinhos Protetores',
    category: 'Floresta',
    color: 'text-orange-300',
    bgGrad: 'from-orange-500/20 via-amber-600/10 to-stone-500/15',
    borderAccent: 'border-orange-400/70'
  },
  {
    pairId: 'sapo',
    name: 'Sapinho',
    emoji: '🐸',
    subtitle: 'Salto Verde',
    category: 'Pântano',
    color: 'text-lime-400',
    bgGrad: 'from-lime-500/20 via-emerald-500/10 to-green-600/15',
    borderAccent: 'border-lime-400/70'
  },
  {
    pairId: 'borboleta',
    name: 'Borboleta',
    emoji: '🦋',
    subtitle: 'Asas Encantadas',
    category: 'Jardim',
    color: 'text-cyan-300',
    bgGrad: 'from-cyan-500/20 via-blue-500/10 to-fuchsia-500/15',
    borderAccent: 'border-cyan-400/70'
  }
];

// 32 Household Objects (Objetos de Casa) with vibrant emojis and rich colors
export const HOUSEHOLD_DATABASE: CardDefinition[] = [
  { pairId: 'cama', name: 'Cama', emoji: '🛏️', subtitle: 'Descanso e Sonhos', category: 'Quarto', color: 'text-indigo-400', bgGrad: 'from-indigo-600/20 via-blue-500/10 to-purple-600/15', borderAccent: 'border-indigo-400/70' },
  { pairId: 'sofa', name: 'Sofá', emoji: '🛋️', subtitle: 'Conforto na Sala', category: 'Sala', color: 'text-amber-400', bgGrad: 'from-amber-600/20 via-orange-500/10 to-yellow-600/15', borderAccent: 'border-amber-400/70' },
  { pairId: 'geladeira', name: 'Geladeira', emoji: '🧊', subtitle: 'Alimentos Frescos', category: 'Cozinha', color: 'text-cyan-400', bgGrad: 'from-cyan-600/20 via-sky-500/10 to-blue-600/15', borderAccent: 'border-cyan-400/70' },
  { pairId: 'espelho', name: 'Espelho', emoji: '🪞', subtitle: 'Reflexo Cristalino', category: 'Banheiro', color: 'text-teal-300', bgGrad: 'from-teal-500/20 via-cyan-500/10 to-emerald-500/15', borderAccent: 'border-teal-400/70' },
  { pairId: 'abajur', name: 'Abajur', emoji: '💡', subtitle: 'Luz Acolhedora', category: 'Quarto', color: 'text-yellow-400', bgGrad: 'from-yellow-500/20 via-amber-500/10 to-orange-500/15', borderAccent: 'border-yellow-400/70' },
  { pairId: 'fogao', name: 'Fogão', emoji: '🍳', subtitle: 'Refeições Quentes', category: 'Cozinha', color: 'text-orange-400', bgGrad: 'from-orange-600/20 via-red-500/10 to-amber-600/15', borderAccent: 'border-orange-400/70' },
  { pairId: 'mesa', name: 'Mesa de Jantar', emoji: '🪵', subtitle: 'Reunião em Família', category: 'Sala', color: 'text-amber-500', bgGrad: 'from-amber-700/20 via-yellow-700/10 to-orange-600/15', borderAccent: 'border-amber-500/70' },
  { pairId: 'cadeira', name: 'Cadeira', emoji: '🪑', subtitle: 'Assento Confortável', category: 'Sala', color: 'text-stone-300', bgGrad: 'from-stone-600/20 via-slate-500/10 to-zinc-600/15', borderAccent: 'border-stone-400/70' },
  { pairId: 'tv', name: 'Televisão', emoji: '📺', subtitle: 'Filmes & Séries', category: 'Sala', color: 'text-purple-400', bgGrad: 'from-purple-600/20 via-indigo-600/10 to-blue-600/15', borderAccent: 'border-purple-400/70' },
  { pairId: 'guarda-roupa', name: 'Guarda-Roupa', emoji: '🚪', subtitle: 'Roupas Organizadas', category: 'Quarto', color: 'text-amber-600', bgGrad: 'from-amber-800/20 via-yellow-800/10 to-stone-600/15', borderAccent: 'border-amber-600/70' },
  { pairId: 'relogio', name: 'Relógio de Parede', emoji: '⏰', subtitle: 'Pontualidade Sempre', category: 'Sala', color: 'text-rose-400', bgGrad: 'from-rose-600/20 via-pink-600/10 to-amber-500/15', borderAccent: 'border-rose-400/70' },
  { pairId: 'janela', name: 'Janela', emoji: '🪟', subtitle: 'Brisa e Luz do Sol', category: 'Quarto', color: 'text-sky-300', bgGrad: 'from-sky-500/20 via-cyan-500/10 to-blue-500/15', borderAccent: 'border-sky-400/70' },
  { pairId: 'porta', name: 'Porta', emoji: '🚪', subtitle: 'Entrada do Lar', category: 'Entrada', color: 'text-emerald-400', bgGrad: 'from-emerald-600/20 via-green-600/10 to-teal-600/15', borderAccent: 'border-emerald-500/70' },
  { pairId: 'chave', name: 'Chave de Casa', emoji: '🔑', subtitle: 'Acesso Seguro', category: 'Entrada', color: 'text-yellow-300', bgGrad: 'from-yellow-400/20 via-amber-500/10 to-orange-400/15', borderAccent: 'border-yellow-400/70' },
  { pairId: 'computador', name: 'Computador', emoji: '💻', subtitle: 'Trabalho e Estudos', category: 'Escritório', color: 'text-blue-400', bgGrad: 'from-blue-600/20 via-indigo-600/10 to-sky-600/15', borderAccent: 'border-blue-400/70' },
  { pairId: 'celular', name: 'Celular', emoji: '📱', subtitle: 'Conexão Total', category: 'Escritório', color: 'text-cyan-300', bgGrad: 'from-cyan-500/20 via-sky-600/10 to-indigo-500/15', borderAccent: 'border-cyan-400/70' },
  { pairId: 'livro', name: 'Livro', emoji: '📕', subtitle: 'Histórias e Saber', category: 'Escritório', color: 'text-red-400', bgGrad: 'from-red-600/20 via-rose-600/10 to-amber-600/15', borderAccent: 'border-red-400/70' },
  { pairId: 'travesseiro', name: 'Travesseiro', emoji: '💤', subtitle: 'Maciez para Dormir', category: 'Quarto', color: 'text-violet-300', bgGrad: 'from-violet-500/20 via-indigo-500/10 to-purple-500/15', borderAccent: 'border-violet-400/70' },
  { pairId: 'cobertor', name: 'Cobertor Quentinho', emoji: '🧶', subtitle: 'Aquecimento no Inverno', category: 'Quarto', color: 'text-fuchsia-400', bgGrad: 'from-fuchsia-600/20 via-pink-600/10 to-purple-600/15', borderAccent: 'border-fuchsia-400/70' },
  { pairId: 'toalha', name: 'Toalha Macia', emoji: '🛁', subtitle: 'Pós Banho Fresco', category: 'Banheiro', color: 'text-teal-400', bgGrad: 'from-teal-600/20 via-cyan-600/10 to-emerald-600/15', borderAccent: 'border-teal-400/70' },
  { pairId: 'chuveiro', name: 'Chuveiro', emoji: '🚿', subtitle: 'Banho Revigorante', category: 'Banheiro', color: 'text-blue-300', bgGrad: 'from-blue-500/20 via-sky-600/10 to-cyan-500/15', borderAccent: 'border-blue-400/70' },
  { pairId: 'sabonete', name: 'Sabonete Perfumado', emoji: '🧼', subtitle: 'Limpeza e Espuma', category: 'Banheiro', color: 'text-pink-300', bgGrad: 'from-pink-500/20 via-rose-500/10 to-white/10', borderAccent: 'border-pink-400/70' },
  { pairId: 'escova-dente', name: 'Escova de Dentes', emoji: '🪥', subtitle: 'Sorriso Brilhante', category: 'Banheiro', color: 'text-emerald-300', bgGrad: 'from-emerald-500/20 via-teal-500/10 to-cyan-500/15', borderAccent: 'border-emerald-400/70' },
  { pairId: 'prato', name: 'Prato', emoji: '🍽️', subtitle: 'Servir o Almoço', category: 'Cozinha', color: 'text-slate-200', bgGrad: 'from-slate-500/20 via-zinc-500/10 to-gray-500/15', borderAccent: 'border-slate-300/70' },
  { pairId: 'xicara', name: 'Xícara de Café', emoji: '☕', subtitle: 'Café da Manhã', category: 'Cozinha', color: 'text-amber-500', bgGrad: 'from-amber-600/20 via-orange-600/10 to-yellow-600/15', borderAccent: 'border-amber-500/70' },
  { pairId: 'garfo-faca', name: 'Talheres', emoji: '🍴', subtitle: 'Garfo e Faca', category: 'Cozinha', color: 'text-slate-300', bgGrad: 'from-slate-600/20 via-blue-600/10 to-zinc-600/15', borderAccent: 'border-slate-400/70' },
  { pairId: 'microondas', name: 'Micro-ondas', emoji: '🍲', subtitle: 'Aquecer em Segundos', category: 'Cozinha', color: 'text-cyan-400', bgGrad: 'from-cyan-600/20 via-teal-600/10 to-blue-600/15', borderAccent: 'border-cyan-400/70' },
  { pairId: 'liquidificador', name: 'Liquidificador', emoji: '🥤', subtitle: 'Sucos e Vitaminas', category: 'Cozinha', color: 'text-lime-400', bgGrad: 'from-lime-600/20 via-emerald-600/10 to-teal-600/15', borderAccent: 'border-lime-400/70' },
  { pairId: 'ventilador', name: 'Ventilador', emoji: '🌀', subtitle: 'Vento Refrescante', category: 'Sala', color: 'text-sky-400', bgGrad: 'from-sky-600/20 via-cyan-600/10 to-indigo-600/15', borderAccent: 'border-sky-400/70' },
  { pairId: 'tapete', name: 'Tapete', emoji: '🧶', subtitle: 'Decoração e Calor', category: 'Sala', color: 'text-rose-400', bgGrad: 'from-rose-700/20 via-pink-600/10 to-amber-600/15', borderAccent: 'border-rose-400/70' },
  { pairId: 'planta-vaso', name: 'Planta de Vaso', emoji: '🪴', subtitle: 'Natureza em Casa', category: 'Sala', color: 'text-emerald-400', bgGrad: 'from-emerald-600/20 via-green-600/10 to-lime-600/15', borderAccent: 'border-emerald-400/70' },
  { pairId: 'violao', name: 'Violão', emoji: '🎸', subtitle: 'Música no Quarto', category: 'Quarto', color: 'text-orange-400', bgGrad: 'from-orange-600/20 via-amber-600/10 to-yellow-600/15', borderAccent: 'border-orange-400/70' },
];

// 32 Pairs Mix: 16 Animals + 16 Household Objects for the best mixed challenge!
export const ANIMALS_AND_HOUSE_DATABASE: CardDefinition[] = [
  ...ANIMALS_DATABASE.slice(0, 16),
  ...HOUSEHOLD_DATABASE.slice(0, 16),
];

// Classic theme fallback
export const CLASSIC_DATABASE: CardDefinition[] = [
  { pairId: 'coroa', name: 'Coroa Real', icon: Crown, category: 'Fantasia', color: 'text-amber-500', bgGrad: 'from-amber-500/15 to-yellow-500/10', borderAccent: 'border-amber-400' },
  { pairId: 'diamante', name: 'Diamante Azul', icon: Gem, category: 'Fantasia', color: 'text-cyan-500', bgGrad: 'from-cyan-500/15 to-blue-500/10', borderAccent: 'border-cyan-400' },
  { pairId: 'foguete', name: 'Foguete Estelar', icon: Rocket, category: 'Cosmos', color: 'text-rose-500', bgGrad: 'from-rose-500/15 to-orange-500/10', borderAccent: 'border-rose-400' },
  { pairId: 'trofeu', name: 'Troféu Ouro', icon: Trophy, category: 'Arcade', color: 'text-yellow-500', bgGrad: 'from-yellow-500/15 to-amber-500/10', borderAccent: 'border-yellow-400' },
  { pairId: 'espada', name: 'Espada Mítica', icon: Sword, category: 'Fantasia', color: 'text-indigo-500', bgGrad: 'from-indigo-500/15 to-violet-500/10', borderAccent: 'border-indigo-400' },
  { pairId: 'escudo', name: 'Escudo Sagrado', icon: Shield, category: 'Fantasia', color: 'text-blue-500', bgGrad: 'from-blue-500/15 to-sky-500/10', borderAccent: 'border-blue-400' },
  { pairId: 'raio', name: 'Raio de Trovão', icon: Zap, category: 'Arcade', color: 'text-amber-400', bgGrad: 'from-amber-400/15 to-orange-500/10', borderAccent: 'border-amber-300' },
  { pairId: 'fogo', name: 'Fogo Mágico', icon: Flame, category: 'Fantasia', color: 'text-orange-500', bgGrad: 'from-orange-500/15 to-red-500/10', borderAccent: 'border-orange-400' },
  { pairId: 'bussola', name: 'Bússola de Ouro', icon: Compass, category: 'Aventura', color: 'text-teal-500', bgGrad: 'from-teal-500/15 to-emerald-500/10', borderAccent: 'border-teal-400' },
  { pairId: 'ancora', name: 'Âncora Náutica', icon: Anchor, category: 'Aventura', color: 'text-slate-600', bgGrad: 'from-slate-500/15 to-blue-600/10', borderAccent: 'border-slate-400' },
  { pairId: 'sol', name: 'Sol Radiante', icon: Sun, category: 'Cosmos', color: 'text-amber-500', bgGrad: 'from-amber-500/15 to-yellow-400/10', borderAccent: 'border-amber-400' },
  { pairId: 'lua', name: 'Lua Mística', icon: Moon, category: 'Cosmos', color: 'text-violet-500', bgGrad: 'from-violet-500/15 to-purple-500/10', borderAccent: 'border-violet-400' },
  { pairId: 'coracao', name: 'Coração Rubro', icon: Heart, category: 'Arcade', color: 'text-rose-600', bgGrad: 'from-rose-500/15 to-pink-500/10', borderAccent: 'border-rose-400' },
  { pairId: 'musica', name: 'Nota Melódica', icon: Music, category: 'Arcade', color: 'text-fuchsia-500', bgGrad: 'from-fuchsia-500/15 to-pink-500/10', borderAccent: 'border-fuchsia-400' },
  { pairId: 'gamepad', name: 'Controle Retro', icon: Gamepad2, category: 'Arcade', color: 'text-emerald-500', bgGrad: 'from-emerald-500/15 to-green-500/10', borderAccent: 'border-emerald-400' },
  { pairId: 'chave', name: 'Chave Dourada', icon: Key, category: 'Aventura', color: 'text-yellow-600', bgGrad: 'from-yellow-600/15 to-amber-500/10', borderAccent: 'border-yellow-500' },
  { pairId: 'camera', name: 'Câmera Vintage', icon: Camera, category: 'Aventura', color: 'text-stone-600', bgGrad: 'from-stone-500/15 to-zinc-500/10', borderAccent: 'border-stone-400' },
  { pairId: 'globo', name: 'Globo Mundi', icon: Globe, category: 'Aventura', color: 'text-sky-600', bgGrad: 'from-sky-500/15 to-cyan-500/10', borderAccent: 'border-sky-400' },
  { pairId: 'grimorio', name: 'Grimório Arcano', icon: Book, category: 'Fantasia', color: 'text-purple-600', bgGrad: 'from-purple-500/15 to-indigo-500/10', borderAccent: 'border-purple-400' },
  { pairId: 'pena', name: 'Pena de Fênix', icon: Feather, category: 'Fantasia', color: 'text-red-500', bgGrad: 'from-red-500/15 to-orange-400/10', borderAccent: 'border-red-400' },
  { pairId: 'ampulheta', name: 'Ampulheta do Tempo', icon: Hourglass, category: 'Aventura', color: 'text-amber-600', bgGrad: 'from-amber-600/15 to-yellow-500/10', borderAccent: 'border-amber-500' },
  { pairId: 'lanterna', name: 'Lanterna Guia', icon: Flashlight, category: 'Aventura', color: 'text-lime-600', bgGrad: 'from-lime-500/15 to-emerald-500/10', borderAccent: 'border-lime-500' },
  { pairId: 'varinha', name: 'Varinha Encantada', icon: Wand2, category: 'Fantasia', color: 'text-violet-600', bgGrad: 'from-violet-600/15 to-fuchsia-500/10', borderAccent: 'border-violet-500' },
  { pairId: 'pocao', name: 'Elixir Cósmico', icon: FlaskConical, category: 'Fantasia', color: 'text-cyan-600', bgGrad: 'from-cyan-600/15 to-teal-500/10', borderAccent: 'border-cyan-500' },
  { pairId: 'cristal', name: 'Cristal Astral', icon: Sparkles, category: 'Fantasia', color: 'text-pink-500', bgGrad: 'from-pink-500/15 to-rose-400/10', borderAccent: 'border-pink-400' },
  { pairId: 'telescopio', name: 'Telescópio Óptico', icon: Telescope, category: 'Cosmos', color: 'text-indigo-600', bgGrad: 'from-indigo-600/15 to-blue-500/10', borderAccent: 'border-indigo-500' },
  { pairId: 'mochila', name: 'Mochila de Viagem', icon: Backpack, category: 'Aventura', color: 'text-amber-700', bgGrad: 'from-amber-700/15 to-orange-600/10', borderAccent: 'border-amber-600' },
  { pairId: 'headset', name: 'Headphone Gamer', icon: Headphones, category: 'Arcade', color: 'text-blue-600', bgGrad: 'from-blue-600/15 to-indigo-500/10', borderAccent: 'border-blue-500' },
  { pairId: 'sino', name: 'Sino Dourado', icon: Bell, category: 'Arcade', color: 'text-yellow-500', bgGrad: 'from-yellow-500/15 to-amber-400/10', borderAccent: 'border-yellow-400' },
  { pairId: 'radio', name: 'Rádio Sintonia', icon: Radio, category: 'Arcade', color: 'text-teal-600', bgGrad: 'from-teal-600/15 to-cyan-500/10', borderAccent: 'border-teal-500' },
  { pairId: 'visao', name: 'Olho Místico', icon: Eye, category: 'Fantasia', color: 'text-purple-500', bgGrad: 'from-purple-500/15 to-violet-500/10', borderAccent: 'border-purple-400' },
  { pairId: 'alvo', name: 'Mira Certeira', icon: Target, category: 'Arcade', color: 'text-red-600', bgGrad: 'from-red-600/15 to-rose-500/10', borderAccent: 'border-red-500' }
];

export interface CardState {
  instanceId: string;
  pairId: string;
  name: string;
  emoji?: string;
  icon?: LucideIcon;
  subtitle?: string;
  category: string;
  color: string;
  bgGrad: string;
  borderAccent: string;
  syllables?: string;
  readingSentence?: string;
  curiosity?: string;
  isFlipped: boolean;
  isMatched: boolean;
  isPeeked: boolean;
  isWrong: boolean;
}

// Fisher-Yates shuffle
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// 32 Legendary Super Mario Cards
export const MARIO_DATABASE: CardDefinition[] = [
  { pairId: 'mario', name: 'Mario', emoji: '🔴', subtitle: 'Super Herói de Bigode', category: 'Heróis', color: 'text-red-500', bgGrad: 'from-red-600/25 via-blue-600/15 to-red-500/10', borderAccent: 'border-red-500/70', syllables: 'MA • RIO', readingSentence: 'O Mario salva o reino e pula bem alto!' },
  { pairId: 'luigi', name: 'Luigi', emoji: '🟢', subtitle: 'Irmão Fiel de Macacão', category: 'Heróis', color: 'text-emerald-400', bgGrad: 'from-emerald-600/25 via-blue-600/15 to-green-500/10', borderAccent: 'border-emerald-500/70', syllables: 'LUI • GI', readingSentence: 'O Luigi é corajoso e leal ao seu irmão.' },
  { pairId: 'peach', name: 'Princesa Peach', emoji: '👑', subtitle: 'Soberana dos Cogumelos', category: 'Realeza', color: 'text-pink-400', bgGrad: 'from-pink-500/25 via-rose-400/15 to-amber-400/10', borderAccent: 'border-pink-400/70', syllables: 'PRIN • CE • SA', readingSentence: 'A Princesa Peach governa com muita bondade.' },
  { pairId: 'bowser', name: 'Bowser', emoji: '🐲', subtitle: 'Rei Tirano dos Koopas', category: 'Chefes', color: 'text-orange-500', bgGrad: 'from-orange-600/25 via-red-600/15 to-amber-600/10', borderAccent: 'border-orange-500/70', syllables: 'BOW • SER', readingSentence: 'O Bowser cospe fogo no castelo de lava.' },
  { pairId: 'yoshi', name: 'Yoshi', emoji: '🦖', subtitle: 'Dinossauro Companheiro', category: 'Amigos', color: 'text-green-400', bgGrad: 'from-green-500/25 via-emerald-400/15 to-lime-400/10', borderAccent: 'border-green-400/70', syllables: 'YO • SHI', readingSentence: 'O dinossauro Yoshi come frutas com a língua rápida.' },
  { pairId: 'toad', name: 'Toad', emoji: '🍄', subtitle: 'Guardião Fiel do Castelo', category: 'Amigos', color: 'text-red-400', bgGrad: 'from-red-500/25 via-blue-500/15 to-white/10', borderAccent: 'border-red-400/70', syllables: 'TO • AD', readingSentence: 'O Toad corre ligeiro para ajudar os amigos.' },
  { pairId: 'donkey-kong', name: 'Donkey Kong', emoji: '🦍', subtitle: 'Força Bruta e Barris', category: 'Aliados', color: 'text-amber-700', bgGrad: 'from-amber-700/25 via-yellow-600/15 to-orange-600/10', borderAccent: 'border-amber-600/70', syllables: 'DON • KEY', readingSentence: 'O gorila Donkey Kong adora bananas doces.' },
  { pairId: 'wario', name: 'Wario', emoji: '🟡', subtitle: 'Rival Fanático por Moedas', category: 'Rivais', color: 'text-yellow-400', bgGrad: 'from-yellow-500/25 via-purple-600/15 to-amber-500/10', borderAccent: 'border-yellow-400/70', syllables: 'WA • RIO', readingSentence: 'O Wario procura moedas de ouro pelo castelo.' },
  { pairId: 'waluigi', name: 'Waluigi', emoji: '🟣', subtitle: 'Mestre da Trapaça Roxa', category: 'Rivais', color: 'text-purple-400', bgGrad: 'from-purple-600/25 via-indigo-600/15 to-fuchsia-600/10', borderAccent: 'border-purple-400/70', syllables: 'WA • LUI • GI', readingSentence: 'O Waluigi dá risadas travessas no tênis.' },
  { pairId: 'rosalina', name: 'Rosalina', emoji: '🌟', subtitle: 'Mãe dos Lumas Galácticos', category: 'Realeza', color: 'text-cyan-300', bgGrad: 'from-cyan-500/25 via-sky-500/15 to-blue-500/10', borderAccent: 'border-cyan-300/70', syllables: 'RO • SA • LI • NA', readingSentence: 'A princesa Rosalina viaja pelo espaço cósmico.' },
  { pairId: 'daisy', name: 'Princesa Daisy', emoji: '🌼', subtitle: 'Alegria de Sarasaland', category: 'Realeza', color: 'text-yellow-300', bgGrad: 'from-yellow-500/25 via-orange-500/15 to-amber-400/10', borderAccent: 'border-yellow-400/70', syllables: 'DAI • SY', readingSentence: 'A princesa Daisy é animada e joga muito bem.' },
  { pairId: 'bowser-jr', name: 'Bowser Jr.', emoji: '🖌️', subtitle: 'Pincel Mágico do Terror', category: 'Chefes', color: 'text-amber-500', bgGrad: 'from-amber-600/25 via-red-500/15 to-yellow-500/10', borderAccent: 'border-amber-500/70', syllables: 'BOW • SER • JÚ • NIOR', readingSentence: 'O Bowser Jr. pilota seu carrinho voador.' },
  { pairId: 'goomba', name: 'Goomba', emoji: '🌰', subtitle: 'Tropeço Marrom Clássico', category: 'Vilões', color: 'text-stone-300', bgGrad: 'from-stone-600/25 via-amber-800/15 to-zinc-600/10', borderAccent: 'border-stone-500/70', syllables: 'GOOM • BA', readingSentence: 'O Goomba caminha em linha reta pelo caminho.' },
  { pairId: 'koopa', name: 'Koopa Troopa', emoji: '🐢', subtitle: 'Soldado do Casco Verde', category: 'Vilões', color: 'text-emerald-400', bgGrad: 'from-emerald-600/25 via-green-600/15 to-yellow-500/10', borderAccent: 'border-emerald-400/70', syllables: 'KOO • PA', readingSentence: 'A tartaruga Koopa se esconde dentro do casco verde.' },
  { pairId: 'boo', name: 'Boo Fantasma', emoji: '👻', subtitle: 'Fica Tímido ao Olhar', category: 'Vilões', color: 'text-slate-200', bgGrad: 'from-slate-400/25 via-zinc-500/15 to-indigo-500/10', borderAccent: 'border-slate-300/70', syllables: 'FAN • TAS • MA', readingSentence: 'O fantasminha Boo tapa o rosto de vergonha.' },
  { pairId: 'shy-guy', name: 'Shy Guy', emoji: '🎭', subtitle: 'Mascarado Curioso', category: 'Vilões', color: 'text-rose-400', bgGrad: 'from-rose-600/25 via-red-600/15 to-slate-500/10', borderAccent: 'border-rose-400/70', syllables: 'SHY • GUY', readingSentence: 'O Shy Guy usa uma máscara branca misteriosa.' },
  { pairId: 'bob-omb', name: 'Bob-omba', emoji: '💣', subtitle: 'Pavio Aceso e Explosivo', category: 'Vilões', color: 'text-blue-400', bgGrad: 'from-slate-700/25 via-blue-900/15 to-red-600/10', borderAccent: 'border-blue-400/70', syllables: 'BO • BOM • BA', readingSentence: 'A bombinha dá corda e anda com pezinhos amarelos.' },
  { pairId: 'piranha', name: 'Planta Piranha', emoji: '🌺', subtitle: 'Dentes Afiados no Cano', category: 'Vilões', color: 'text-red-400', bgGrad: 'from-red-600/25 via-green-600/15 to-white/10', borderAccent: 'border-red-500/70', syllables: 'PI • RA • NHA', readingSentence: 'A planta piranha sai do cano verde com folhas abertas.' },
  { pairId: 'cogumelo-super', name: 'Cogumelo Super', emoji: '🍄', subtitle: 'Cresce e Fica Invencível', category: 'Poderes', color: 'text-red-400', bgGrad: 'from-red-600/25 via-amber-500/15 to-yellow-400/10', borderAccent: 'border-red-400/70', syllables: 'CO • GU • ME • LO', readingSentence: 'O cogumelo vermelho faz o herói crescer de tamanho.' },
  { pairId: 'cogumelo-1up', name: 'Cogumelo 1-UP', emoji: '🟢', subtitle: 'Vida Extra Preciosa', category: 'Poderes', color: 'text-emerald-400', bgGrad: 'from-emerald-500/25 via-green-600/15 to-teal-400/10', borderAccent: 'border-emerald-400/70', syllables: 'VI • DA • EX • TRA', readingSentence: 'O cogumelo verde dá uma vida extra valiosa!' },
  { pairId: 'flor-fogo', name: 'Flor de Fogo', emoji: '🔥', subtitle: 'Dispara Bolas Incandescentes', category: 'Poderes', color: 'text-orange-400', bgGrad: 'from-orange-500/25 via-red-500/15 to-yellow-400/10', borderAccent: 'border-orange-400/70', syllables: 'FLOR • DE • FO • GO', readingSentence: 'A flor de fogo atira bolas brilhantes para proteger.' },
  { pairId: 'estrela', name: 'Super Estrela', emoji: '⭐', subtitle: 'Invencibilidade Cósmica', category: 'Poderes', color: 'text-yellow-300', bgGrad: 'from-yellow-400/25 via-amber-400/15 to-orange-400/10', borderAccent: 'border-yellow-300/70', syllables: 'ES • TRE • LA', readingSentence: 'A estrela amarela deixa o herói invencível e veloz!' },
  { pairId: 'moeda', name: 'Moeda Dourada', emoji: '🪙', subtitle: 'Junte 100 para Ganhar Vida', category: 'Itens', color: 'text-amber-400', bgGrad: 'from-amber-400/25 via-yellow-500/15 to-orange-500/10', borderAccent: 'border-amber-400/70', syllables: 'MO • E • DA', readingSentence: 'A moeda dourada brilha no bloco misterioso.' },
  { pairId: 'bloco-interrogacao', name: 'Bloco ?', emoji: '❓', subtitle: 'Caixa Misteriosa com Itens', category: 'Itens', color: 'text-amber-400', bgGrad: 'from-amber-500/25 via-yellow-600/15 to-stone-500/10', borderAccent: 'border-amber-400/70', syllables: 'BLO • CO', readingSentence: 'Bata a cabeça no bloco amarelo para soltar prêmios.' },
  { pairId: 'cano-verde', name: 'Cano Verde', emoji: '🟩', subtitle: 'Entrada Secreta dos Mundos', category: 'Cenário', color: 'text-emerald-400', bgGrad: 'from-emerald-600/25 via-green-700/15 to-teal-600/10', borderAccent: 'border-emerald-500/70', syllables: 'CA • NO', readingSentence: 'O cano verde esconde passagens secretas no subsolo.' },
  { pairId: 'ovo-yoshi', name: 'Ovo de Yoshi', emoji: '🥚', subtitle: 'Ninho dos Dinossauros', category: 'Itens', color: 'text-green-300', bgGrad: 'from-green-400/25 via-emerald-500/15 to-white/10', borderAccent: 'border-green-400/70', syllables: 'O • VO', readingSentence: 'O ovo pintadinho choca um amigo dinossauro.' },
  { pairId: 'casco-vermelho', name: 'Casco Vermelho', emoji: '🔴', subtitle: 'Projétil Rastreador Veloz', category: 'Itens', color: 'text-red-400', bgGrad: 'from-red-600/25 via-rose-600/15 to-orange-600/10', borderAccent: 'border-red-400/70', syllables: 'CAS • CO', readingSentence: 'O casco vermelho desliza e acerta o alvo certeiro.' },
  { pairId: 'pena-capa', name: 'Pena Voadora', emoji: '🪶', subtitle: 'Voo das Alturas com Capa', category: 'Poderes', color: 'text-yellow-400', bgGrad: 'from-yellow-500/25 via-amber-500/15 to-orange-400/10', borderAccent: 'border-yellow-400/70', syllables: 'PE • NA', readingSentence: 'A pena mágica abre uma capa para planar nas nuvens.' },
  { pairId: 'flor-gelo', name: 'Flor de Gelo', emoji: '❄️', subtitle: 'Poder Glacial Congelante', category: 'Poderes', color: 'text-cyan-300', bgGrad: 'from-cyan-400/25 via-sky-500/15 to-blue-500/10', borderAccent: 'border-cyan-300/70', syllables: 'FLOR • DE • GE • LO', readingSentence: 'A flor de gelo solta bolas azuis e congelantes.' },
  { pairId: 'super-sino', name: 'Super Sino', emoji: '🔔', subtitle: 'Garras de Gato Ágeis', category: 'Poderes', color: 'text-amber-300', bgGrad: 'from-amber-400/25 via-yellow-400/15 to-orange-400/10', borderAccent: 'border-amber-300/70', syllables: 'SI • NO', readingSentence: 'O sino dourado transforma o herói em um gatinho veloz.' },
  { pairId: 'castelo', name: 'Castelo da Peach', emoji: '🏰', subtitle: 'Coração de Todo o Reino', category: 'Cenário', color: 'text-pink-300', bgGrad: 'from-pink-500/25 via-red-500/15 to-amber-400/10', borderAccent: 'border-pink-400/70', syllables: 'CAS • TE • LO', readingSentence: 'O grande castelo tem torres altas e bandeiras rosadas.' },
  { pairId: 'mastro-bandeira', name: 'Mastro Final', emoji: '🚩', subtitle: 'Saltar no Topo da Bandeira', category: 'Cenário', color: 'text-rose-400', bgGrad: 'from-rose-600/25 via-amber-500/15 to-yellow-400/10', borderAccent: 'border-rose-400/70', syllables: 'BAN • DEI • RA', readingSentence: 'Pule no topo do mastro para comemorar a vitória!' }
];

export function generateDeck(pairsCount: number = 32, theme: GameTheme = 'animals_house'): CardState[] {
  let database = ANIMALS_AND_HOUSE_DATABASE;
  if (theme === 'animals_house') database = ANIMALS_AND_HOUSE_DATABASE;
  else if (theme === 'animals') database = ANIMALS_DATABASE;
  else if (theme === 'household') database = HOUSEHOLD_DATABASE;
  else if (theme === 'classic') database = CLASSIC_DATABASE;
  else if (theme === 'mario') database = MARIO_DATABASE;
  const selectedDefs = database.slice(0, pairsCount);
  const deck: CardState[] = [];

  selectedDefs.forEach((def) => {
    const studyInfo = STUDY_READING_DATA[def.pairId];
    const syllables = def.syllables || studyInfo?.syllables || def.name.toUpperCase();
    const readingSentence = def.readingSentence || studyInfo?.readingSentence || `${def.name} para ler e estudar.`;
    const curiosity = def.curiosity || studyInfo?.curiosity || def.subtitle;

    // Card 1
    deck.push({
      instanceId: `${def.pairId}-1`,
      pairId: def.pairId,
      name: def.name,
      emoji: def.emoji,
      icon: def.icon,
      subtitle: def.subtitle,
      category: def.category,
      color: def.color,
      bgGrad: def.bgGrad,
      borderAccent: def.borderAccent,
      syllables,
      readingSentence,
      curiosity,
      isFlipped: false,
      isMatched: false,
      isPeeked: false,
      isWrong: false
    });
    // Card 2
    deck.push({
      instanceId: `${def.pairId}-2`,
      pairId: def.pairId,
      name: def.name,
      emoji: def.emoji,
      icon: def.icon,
      subtitle: def.subtitle,
      category: def.category,
      color: def.color,
      bgGrad: def.bgGrad,
      borderAccent: def.borderAccent,
      syllables,
      readingSentence,
      curiosity,
      isFlipped: false,
      isMatched: false,
      isPeeked: false,
      isWrong: false
    });
  });

  return shuffleArray(deck);
}
