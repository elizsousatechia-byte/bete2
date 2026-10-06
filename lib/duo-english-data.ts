export type DuoCategory = 'all' | 'animals_home' | 'animals' | 'home' | 'food' | 'daily' | 'travel' | 'actions';

export interface DuoWordItem {
  id: string;
  english: string;
  portuguese: string;
  phonetic: string;
  emoji: string;
  exampleSentenceEn: string;
  exampleSentencePt: string;
  category: DuoCategory;
  categoryName: string;
  themeColor: string;
}

export interface DuoMemoryCard {
  instanceId: string;
  pairId: string;
  type: 'english' | 'portuguese';
  title: string;
  subtitle: string;
  emoji: string;
  phonetic?: string;
  exampleEn: string;
  examplePt: string;
  category: string;
  isFlipped: boolean;
  isMatched: boolean;
  isWrong: boolean;
  isPeeked?: boolean;
  themeColor: string;
}

export const DUO_CATEGORIES_META: { id: DuoCategory; label: string; icon: string; count: number; description?: string }[] = [
  { id: 'animals_home', label: 'Animais & Casa (32P)', icon: '🐾🏠', count: 64, description: '32 Pares com Animais e Objetos de Casa' },
  { id: 'animals', label: 'Animais (32P)', icon: '🦉', count: 32, description: '32 Animais em Inglês' },
  { id: 'home', label: 'Objetos de Casa (32P)', icon: '🏠', count: 32, description: '32 Objetos do Lar em Inglês' },
  { id: 'all', label: 'Tudo Misturado', icon: '🌟', count: 120 },
  { id: 'food', label: 'Comida & Bebida', icon: '🍎', count: 12 },
  { id: 'daily', label: 'Frases do Dia a Dia', icon: '💬', count: 10 },
  { id: 'travel', label: 'Viagem & Lugares', icon: '✈️', count: 10 },
  { id: 'actions', label: 'Verbos & Ações', icon: '🏃', count: 10 },
];

export const DUO_WORDS_DATABASE: DuoWordItem[] = [
  // 🍎 FOOD & DRINKS
  {
    id: 'apple',
    english: 'Apple',
    portuguese: 'Maçã',
    phonetic: '/ˈæp.əl/',
    emoji: '🍎',
    exampleSentenceEn: 'I eat a fresh apple every morning.',
    exampleSentencePt: 'Eu como uma maçã fresca toda manhã.',
    category: 'food',
    categoryName: 'Comida & Bebida',
    themeColor: 'from-red-500/25 to-rose-600/15 border-red-500/40'
  },
  {
    id: 'water',
    english: 'Water',
    portuguese: 'Água',
    phonetic: '/ˈwɔː.tər/',
    emoji: '💧',
    exampleSentenceEn: 'Please drink plenty of water.',
    exampleSentencePt: 'Por favor, beba bastante água.',
    category: 'food',
    categoryName: 'Comida & Bebida',
    themeColor: 'from-cyan-500/25 to-blue-600/15 border-cyan-500/40'
  },
  {
    id: 'coffee',
    english: 'Coffee',
    portuguese: 'Café',
    phonetic: '/ˈkɒf.i/',
    emoji: '☕',
    exampleSentenceEn: 'I love drinking hot coffee with milk.',
    exampleSentencePt: 'Eu amo tomar café quente com leite.',
    category: 'food',
    categoryName: 'Comida & Bebida',
    themeColor: 'from-amber-600/25 to-yellow-700/15 border-amber-600/40'
  },
  {
    id: 'bread',
    english: 'Bread',
    portuguese: 'Pão',
    phonetic: '/bred/',
    emoji: '🍞',
    exampleSentenceEn: 'Fresh bread smells delicious.',
    exampleSentencePt: 'Pão quentinho cheira delicioso.',
    category: 'food',
    categoryName: 'Comida & Bebida',
    themeColor: 'from-yellow-500/25 to-amber-600/15 border-yellow-500/40'
  },
  {
    id: 'cheese',
    english: 'Cheese',
    portuguese: 'Queijo',
    phonetic: '/tʃiːz/',
    emoji: '🧀',
    exampleSentenceEn: 'Can I have some cheese, please?',
    exampleSentencePt: 'Posso pegar um pouco de queijo, por favor?',
    category: 'food',
    categoryName: 'Comida & Bebida',
    themeColor: 'from-yellow-400/25 to-amber-500/15 border-yellow-400/40'
  },
  {
    id: 'milk',
    english: 'Milk',
    portuguese: 'Leite',
    phonetic: '/mɪlk/',
    emoji: '🥛',
    exampleSentenceEn: 'A cold glass of milk is refreshing.',
    exampleSentencePt: 'Um copo de leite gelado é refrescante.',
    category: 'food',
    categoryName: 'Comida & Bebida',
    themeColor: 'from-slate-300/25 to-cyan-500/15 border-slate-300/40'
  },
  {
    id: 'pizza',
    english: 'Pizza',
    portuguese: 'Pizza',
    phonetic: '/ˈpiːt.sə/',
    emoji: '🍕',
    exampleSentenceEn: 'We ordered pizza for dinner.',
    exampleSentencePt: 'Nós pedimos pizza para o jantar.',
    category: 'food',
    categoryName: 'Comida & Bebida',
    themeColor: 'from-orange-500/25 to-red-600/15 border-orange-500/40'
  },
  {
    id: 'egg',
    english: 'Egg',
    portuguese: 'Ovo',
    phonetic: '/eɡ/',
    emoji: '🥚',
    exampleSentenceEn: 'She eats two eggs for breakfast.',
    exampleSentencePt: 'Ela come dois ovos no café da manhã.',
    category: 'food',
    categoryName: 'Comida & Bebida',
    themeColor: 'from-amber-200/25 to-yellow-400/15 border-amber-300/40'
  },
  {
    id: 'banana',
    english: 'Banana',
    portuguese: 'Banana',
    phonetic: '/bəˈnæn.ə/',
    emoji: '🍌',
    exampleSentenceEn: 'Bananas are rich in potassium.',
    exampleSentencePt: 'Bananas são ricas em potássio.',
    category: 'food',
    categoryName: 'Comida & Bebida',
    themeColor: 'from-yellow-400/25 to-lime-500/15 border-yellow-400/40'
  },
  {
    id: 'strawberry',
    english: 'Strawberry',
    portuguese: 'Morango',
    phonetic: '/ˈstrɔː.bər.i/',
    emoji: '🍓',
    exampleSentenceEn: 'This strawberry cake is sweet and tasty.',
    exampleSentencePt: 'Este bolo de morango é doce e gostoso.',
    category: 'food',
    categoryName: 'Comida & Bebida',
    themeColor: 'from-red-500/25 to-pink-600/15 border-red-500/40'
  },
  {
    id: 'tea',
    english: 'Tea',
    portuguese: 'Chá',
    phonetic: '/tiː/',
    emoji: '🍵',
    exampleSentenceEn: 'Green tea helps you relax.',
    exampleSentencePt: 'Chá verde ajuda a relaxar.',
    category: 'food',
    categoryName: 'Comida & Bebida',
    themeColor: 'from-emerald-500/25 to-teal-600/15 border-emerald-500/40'
  },
  {
    id: 'cookie',
    english: 'Cookie',
    portuguese: 'Biscoito',
    phonetic: '/ˈkʊk.i/',
    emoji: '🍪',
    exampleSentenceEn: 'Do you want a chocolate chip cookie?',
    exampleSentencePt: 'Você quer um biscoito com gotas de chocolate?',
    category: 'food',
    categoryName: 'Comida & Bebida',
    themeColor: 'from-amber-600/25 to-orange-700/15 border-amber-600/40'
  },

  // 🦉 ANIMALS & NATURE
  {
    id: 'owl',
    english: 'Owl',
    portuguese: 'Coruja',
    phonetic: '/aʊl/',
    emoji: '🦉',
    exampleSentenceEn: 'Duo the green owl loves languages!',
    exampleSentencePt: 'Duo, a coruja verde, adora idiomas!',
    category: 'animals',
    categoryName: 'Animais & Natureza',
    themeColor: 'from-lime-500/25 to-emerald-600/15 border-lime-500/40'
  },
  {
    id: 'cat',
    english: 'Cat',
    portuguese: 'Gato',
    phonetic: '/kæt/',
    emoji: '🐱',
    exampleSentenceEn: 'My cute cat is sleeping in the sun.',
    exampleSentencePt: 'Meu gato fofo está dormindo ao sol.',
    category: 'animals',
    categoryName: 'Animais & Natureza',
    themeColor: 'from-orange-400/25 to-amber-500/15 border-orange-400/40'
  },
  {
    id: 'dog',
    english: 'Dog',
    portuguese: 'Cachorro',
    phonetic: '/dɒɡ/',
    emoji: '🐶',
    exampleSentenceEn: 'The friendly dog wags its tail.',
    exampleSentencePt: 'O cachorro amigável balança o rabo.',
    category: 'animals',
    categoryName: 'Animais & Natureza',
    themeColor: 'from-amber-500/25 to-yellow-600/15 border-amber-500/40'
  },
  {
    id: 'butterfly',
    english: 'Butterfly',
    portuguese: 'Borboleta',
    phonetic: '/ˈbʌt.ə.flaɪ/',
    emoji: '🦋',
    exampleSentenceEn: 'A blue butterfly landed on the flower.',
    exampleSentencePt: 'Uma borboleta azul pousou na flor.',
    category: 'animals',
    categoryName: 'Animais & Natureza',
    themeColor: 'from-sky-500/25 to-indigo-600/15 border-sky-500/40'
  },
  {
    id: 'lion',
    english: 'Lion',
    portuguese: 'Leão',
    phonetic: '/ˈlaɪ.ən/',
    emoji: '🦁',
    exampleSentenceEn: 'The brave lion is the king of the jungle.',
    exampleSentencePt: 'O valente leão é o rei da selva.',
    category: 'animals',
    categoryName: 'Animais & Natureza',
    themeColor: 'from-amber-500/25 to-orange-600/15 border-amber-500/40'
  },
  {
    id: 'sun',
    english: 'Sun',
    portuguese: 'Sol',
    phonetic: '/sʌn/',
    emoji: '☀️',
    exampleSentenceEn: 'The bright sun warms the earth.',
    exampleSentencePt: 'O sol brilhante aquece a terra.',
    category: 'animals',
    categoryName: 'Animais & Natureza',
    themeColor: 'from-yellow-400/25 to-amber-500/15 border-yellow-400/40'
  },
  {
    id: 'moon',
    english: 'Moon',
    portuguese: 'Lua',
    phonetic: '/muːn/',
    emoji: '🌙',
    exampleSentenceEn: 'The silver moon glows at midnight.',
    exampleSentencePt: 'A lua prateada brilha à meia-noite.',
    category: 'animals',
    categoryName: 'Animais & Natureza',
    themeColor: 'from-indigo-400/25 to-violet-600/15 border-indigo-400/40'
  },
  {
    id: 'tree',
    english: 'Tree',
    portuguese: 'Árvore',
    phonetic: '/triː/',
    emoji: '🌳',
    exampleSentenceEn: 'Birds sing happily on the big tree.',
    exampleSentencePt: 'Os pássaros cantam felizes na grande árvore.',
    category: 'animals',
    categoryName: 'Animais & Natureza',
    themeColor: 'from-emerald-500/25 to-green-600/15 border-emerald-500/40'
  },
  {
    id: 'flower',
    english: 'Flower',
    portuguese: 'Flor',
    phonetic: '/ˈflaʊ.ər/',
    emoji: '🌸',
    exampleSentenceEn: 'She received a bouquet of pink flowers.',
    exampleSentencePt: 'Ela recebeu um buquê de flores cor-de-rosa.',
    category: 'animals',
    categoryName: 'Animais & Natureza',
    themeColor: 'from-pink-400/25 to-rose-500/15 border-pink-400/40'
  },
  {
    id: 'rain',
    english: 'Rain',
    portuguese: 'Chuva',
    phonetic: '/reɪn/',
    emoji: '🌧️',
    exampleSentenceEn: 'I like listening to the rain on the window.',
    exampleSentencePt: 'Gosto de ouvir a chuva na janela.',
    category: 'animals',
    categoryName: 'Animais & Natureza',
    themeColor: 'from-cyan-500/25 to-slate-600/15 border-cyan-500/40'
  },
  {
    id: 'star',
    english: 'Star',
    portuguese: 'Estrela',
    phonetic: '/stɑːr/',
    emoji: '⭐',
    exampleSentenceEn: 'Look at that bright shooting star!',
    exampleSentencePt: 'Olhe aquela estrela cadente brilhante!',
    category: 'animals',
    categoryName: 'Animais & Natureza',
    themeColor: 'from-yellow-300/25 to-amber-500/15 border-yellow-300/40'
  },
  {
    id: 'bird',
    english: 'Bird',
    portuguese: 'Pássaro',
    phonetic: '/bɜːd/',
    emoji: '🐦',
    exampleSentenceEn: 'The little bird flies high in the sky.',
    exampleSentencePt: 'O pequeno pássaro voa alto no céu.',
    category: 'animals',
    categoryName: 'Animais & Natureza',
    themeColor: 'from-sky-400/25 to-blue-500/15 border-sky-400/40'
  },
  {
    id: 'elephant',
    english: 'Elephant',
    portuguese: 'Elefante',
    phonetic: '/ˈel.ɪ.fənt/',
    emoji: '🐘',
    exampleSentenceEn: 'The big elephant drinks water with its trunk.',
    exampleSentencePt: 'O grande elefante bebe água com sua tromba.',
    category: 'animals',
    categoryName: 'Animais & Natureza',
    themeColor: 'from-slate-400/25 to-zinc-600/15 border-slate-400/40'
  },
  {
    id: 'giraffe',
    english: 'Giraffe',
    portuguese: 'Girafa',
    phonetic: '/dʒɪˈrɑːf/',
    emoji: '🦒',
    exampleSentenceEn: 'The tall giraffe reaches the green tree leaves.',
    exampleSentencePt: 'A alta girafa alcança as folhas verdes da árvore.',
    category: 'animals',
    categoryName: 'Animais & Natureza',
    themeColor: 'from-yellow-400/25 to-amber-600/15 border-yellow-400/40'
  },
  {
    id: 'tiger',
    english: 'Tiger',
    portuguese: 'Tigre',
    phonetic: '/ˈtaɪ.ɡər/',
    emoji: '🐅',
    exampleSentenceEn: 'The fierce tiger has orange and black stripes.',
    exampleSentencePt: 'O feroz tigre possui listras laranjas e pretas.',
    category: 'animals',
    categoryName: 'Animais & Natureza',
    themeColor: 'from-orange-500/25 to-amber-700/15 border-orange-500/40'
  },
  {
    id: 'bear',
    english: 'Bear',
    portuguese: 'Urso',
    phonetic: '/beər/',
    emoji: '🐻',
    exampleSentenceEn: 'The brown bear catches fresh fish in the river.',
    exampleSentencePt: 'O urso marrom pesca peixes frescos no rio.',
    category: 'animals',
    categoryName: 'Animais & Natureza',
    themeColor: 'from-amber-700/25 to-stone-700/15 border-amber-700/40'
  },
  {
    id: 'panda',
    english: 'Panda',
    portuguese: 'Urso Panda',
    phonetic: '/ˈpæn.də/',
    emoji: '🐼',
    exampleSentenceEn: 'The lovely panda spends the whole day eating bamboo.',
    exampleSentencePt: 'O adorável panda passa o dia todo comendo bambu.',
    category: 'animals',
    categoryName: 'Animais & Natureza',
    themeColor: 'from-emerald-400/25 to-teal-600/15 border-emerald-400/40'
  },
  {
    id: 'monkey',
    english: 'Monkey',
    portuguese: 'Macaco',
    phonetic: '/ˈmʌŋ.ki/',
    emoji: '🐒',
    exampleSentenceEn: 'The funny monkey climbs the jungle vine.',
    exampleSentencePt: 'O macaco engraçado sobe no cipó da selva.',
    category: 'animals',
    categoryName: 'Animais & Natureza',
    themeColor: 'from-amber-600/25 to-yellow-600/15 border-amber-600/40'
  },
  {
    id: 'zebra',
    english: 'Zebra',
    portuguese: 'Zebra',
    phonetic: '/ˈzeb.rə/',
    emoji: '🦓',
    exampleSentenceEn: 'Each zebra has a unique pattern of stripes.',
    exampleSentencePt: 'Cada zebra tem um padrão único de listras.',
    category: 'animals',
    categoryName: 'Animais & Natureza',
    themeColor: 'from-zinc-400/25 to-slate-600/15 border-zinc-400/40'
  },
  {
    id: 'wolf',
    english: 'Wolf',
    portuguese: 'Lobo',
    phonetic: '/wʊlf/',
    emoji: '🐺',
    exampleSentenceEn: 'The gray wolf howls under the bright moonlight.',
    exampleSentencePt: 'O lobo cinzento uiva sob a luz brilhante do luar.',
    category: 'animals',
    categoryName: 'Animais & Natureza',
    themeColor: 'from-indigo-400/25 to-slate-600/15 border-indigo-400/40'
  },
  {
    id: 'fox',
    english: 'Fox',
    portuguese: 'Raposa',
    phonetic: '/fɒks/',
    emoji: '🦊',
    exampleSentenceEn: 'The clever fox runs swiftly through the autumn woods.',
    exampleSentencePt: 'A esperta raposa corre velozmente pelos bosques de outono.',
    category: 'animals',
    categoryName: 'Animais & Natureza',
    themeColor: 'from-orange-500/25 to-red-600/15 border-orange-500/40'
  },
  {
    id: 'rabbit',
    english: 'Rabbit',
    portuguese: 'Coelho',
    phonetic: '/ˈræb.ɪt/',
    emoji: '🐰',
    exampleSentenceEn: 'The white rabbit has long ears and loves carrots.',
    exampleSentencePt: 'O coelho branco tem orelhas compridas e adora cenouras.',
    category: 'animals',
    categoryName: 'Animais & Natureza',
    themeColor: 'from-pink-300/25 to-rose-400/15 border-pink-300/40'
  },
  {
    id: 'horse',
    english: 'Horse',
    portuguese: 'Cavalo',
    phonetic: '/hɔːs/',
    emoji: '🐴',
    exampleSentenceEn: 'The strong horse runs across the green meadow.',
    exampleSentencePt: 'O cavalo forte corre pelo prado verde.',
    category: 'animals',
    categoryName: 'Animais & Natureza',
    themeColor: 'from-amber-600/25 to-orange-700/15 border-amber-600/40'
  },
  {
    id: 'cow',
    english: 'Cow',
    portuguese: 'Vaca',
    phonetic: '/kaʊ/',
    emoji: '🐮',
    exampleSentenceEn: 'The gentle cow grazes peacefully in the field.',
    exampleSentencePt: 'A vaca mansa pasta tranquilamente no pasto.',
    category: 'animals',
    categoryName: 'Animais & Natureza',
    themeColor: 'from-stone-400/25 to-amber-600/15 border-stone-400/40'
  },
  {
    id: 'sheep',
    english: 'Sheep',
    portuguese: 'Ovelha',
    phonetic: '/ʃiːp/',
    emoji: '🐑',
    exampleSentenceEn: 'The farmer shears warm soft wool from the sheep.',
    exampleSentencePt: 'O fazendeiro tosa lã macia e quentinha da ovelha.',
    category: 'animals',
    categoryName: 'Animais & Natureza',
    themeColor: 'from-slate-200/25 to-zinc-400/15 border-slate-300/40'
  },
  {
    id: 'pig',
    english: 'Pig',
    portuguese: 'Porco',
    phonetic: '/pɪɡ/',
    emoji: '🐷',
    exampleSentenceEn: 'The friendly pink pig plays on the farm.',
    exampleSentencePt: 'O porquinho rosa brincalhão brinca na fazenda.',
    category: 'animals',
    categoryName: 'Animais & Natureza',
    themeColor: 'from-rose-300/25 to-pink-500/15 border-rose-300/40'
  },
  {
    id: 'duck',
    english: 'Duck',
    portuguese: 'Pato',
    phonetic: '/dʌk/',
    emoji: '🦆',
    exampleSentenceEn: 'The yellow duck splashes gently in the pond.',
    exampleSentencePt: 'O pato amarelo espalha água suavemente no lago.',
    category: 'animals',
    categoryName: 'Animais & Natureza',
    themeColor: 'from-emerald-400/25 to-teal-600/15 border-emerald-400/40'
  },
  {
    id: 'penguin',
    english: 'Penguin',
    portuguese: 'Pinguim',
    phonetic: '/ˈpeŋ.ɡwɪn/',
    emoji: '🐧',
    exampleSentenceEn: 'The cute penguin slides down the snowy hill.',
    exampleSentencePt: 'O pinguim fofinho escorrega morro de neve abaixo.',
    category: 'animals',
    categoryName: 'Animais & Natureza',
    themeColor: 'from-sky-400/25 to-cyan-600/15 border-sky-400/40'
  },
  {
    id: 'dolphin',
    english: 'Dolphin',
    portuguese: 'Golfinho',
    phonetic: '/ˈdɒl.fɪn/',
    emoji: '🐬',
    exampleSentenceEn: 'The joyful dolphin leaps gracefully above the waves.',
    exampleSentencePt: 'O alegre golfinho salta graciosamente acima das ondas.',
    category: 'animals',
    categoryName: 'Animais & Natureza',
    themeColor: 'from-teal-400/25 to-blue-600/15 border-teal-400/40'
  },
  {
    id: 'whale',
    english: 'Whale',
    portuguese: 'Baleia',
    phonetic: '/weɪl/',
    emoji: '🐋',
    exampleSentenceEn: 'The blue whale sings deeply in the deep ocean.',
    exampleSentencePt: 'A baleia-azul canta profundamente no oceano profundo.',
    category: 'animals',
    categoryName: 'Animais & Natureza',
    themeColor: 'from-blue-500/25 to-indigo-700/15 border-blue-500/40'
  },
  {
    id: 'shark',
    english: 'Shark',
    portuguese: 'Tubarão',
    phonetic: '/ʃɑːk/',
    emoji: '🦈',
    exampleSentenceEn: 'The powerful shark navigates the coral reef.',
    exampleSentencePt: 'O poderoso tubarão navega pelos recifes de corais.',
    category: 'animals',
    categoryName: 'Animais & Natureza',
    themeColor: 'from-slate-500/25 to-blue-700/15 border-slate-400/40'
  },
  {
    id: 'octopus',
    english: 'Octopus',
    portuguese: 'Polvo',
    phonetic: '/ˈɒk.tə.pəs/',
    emoji: '🐙',
    exampleSentenceEn: 'The clever octopus changes its color instantly.',
    exampleSentencePt: 'O polvo inteligente muda de cor instantaneamente.',
    category: 'animals',
    categoryName: 'Animais & Natureza',
    themeColor: 'from-purple-500/25 to-fuchsia-600/15 border-purple-500/40'
  },
  {
    id: 'turtle',
    english: 'Turtle',
    portuguese: 'Tartaruga',
    phonetic: '/ˈtɜː.təl/',
    emoji: '🐢',
    exampleSentenceEn: 'The peaceful turtle swims for miles in clear water.',
    exampleSentencePt: 'A tartaruga calma nada por quilômetros em águas claras.',
    category: 'animals',
    categoryName: 'Animais & Natureza',
    themeColor: 'from-emerald-500/25 to-green-600/15 border-emerald-500/40'
  },
  {
    id: 'frog',
    english: 'Frog',
    portuguese: 'Sapo',
    phonetic: '/frɒɡ/',
    emoji: '🐸',
    exampleSentenceEn: 'The green frog hops from lily pad to lily pad.',
    exampleSentencePt: 'O sapo verde pula de vitória-régia em vitória-régia.',
    category: 'animals',
    categoryName: 'Animais & Natureza',
    themeColor: 'from-lime-400/25 to-emerald-600/15 border-lime-400/40'
  },
  {
    id: 'bee',
    english: 'Bee',
    portuguese: 'Abelha',
    phonetic: '/biː/',
    emoji: '🐝',
    exampleSentenceEn: 'The busy little bee collects nectar from flowers.',
    exampleSentencePt: 'A pequena abelha operária colhe néctar das flores.',
    category: 'animals',
    categoryName: 'Animais & Natureza',
    themeColor: 'from-yellow-400/25 to-amber-500/15 border-yellow-400/40'
  },
  {
    id: 'eagle',
    english: 'Eagle',
    portuguese: 'Águia',
    phonetic: '/ˈiː.ɡəl/',
    emoji: '🦅',
    exampleSentenceEn: 'The golden eagle soars majestically above the mountains.',
    exampleSentencePt: 'A águia dourada plana majestosamente sobre as montanhas.',
    category: 'animals',
    categoryName: 'Animais & Natureza',
    themeColor: 'from-amber-500/25 to-yellow-600/15 border-amber-500/40'
  },
  {
    id: 'kangaroo',
    english: 'Kangaroo',
    portuguese: 'Canguru',
    phonetic: '/ˌkæŋ.ɡərˈuː/',
    emoji: '🦘',
    exampleSentenceEn: 'The red kangaroo hops swiftly across Australia.',
    exampleSentencePt: 'O canguru vermelho salta velozmente pela Austrália.',
    category: 'animals',
    categoryName: 'Animais & Natureza',
    themeColor: 'from-orange-500/25 to-amber-600/15 border-orange-500/40'
  },
  {
    id: 'squirrel',
    english: 'Squirrel',
    portuguese: 'Esquilo',
    phonetic: '/ˈskwɪr.əl/',
    emoji: '🐿️',
    exampleSentenceEn: 'The nimble squirrel collects acorns for the cold winter.',
    exampleSentencePt: 'O esquilo ágil recolhe nozes para o inverno frio.',
    category: 'animals',
    categoryName: 'Animais & Natureza',
    themeColor: 'from-amber-600/25 to-orange-700/15 border-amber-600/40'
  },

  // 💬 DAILY GREETINGS & EXPRESSIONS
  {
    id: 'hello',
    english: 'Hello',
    portuguese: 'Olá',
    phonetic: '/həˈləʊ/',
    emoji: '👋',
    exampleSentenceEn: 'Hello! How are you doing today?',
    exampleSentencePt: 'Olá! Como você está hoje?',
    category: 'daily',
    categoryName: 'Frases do Dia a Dia',
    themeColor: 'from-emerald-500/25 to-teal-600/15 border-emerald-500/40'
  },
  {
    id: 'thank_you',
    english: 'Thank you',
    portuguese: 'Obrigado',
    phonetic: '/ˈθæŋk juː/',
    emoji: '🙏',
    exampleSentenceEn: 'Thank you very much for your help!',
    exampleSentencePt: 'Muito obrigado pela sua ajuda!',
    category: 'daily',
    categoryName: 'Frases do Dia a Dia',
    themeColor: 'from-blue-500/25 to-indigo-600/15 border-blue-500/40'
  },
  {
    id: 'please',
    english: 'Please',
    portuguese: 'Por favor',
    phonetic: '/pliːz/',
    emoji: '✨',
    exampleSentenceEn: 'Could you pass the salt, please?',
    exampleSentencePt: 'Você poderia passar o sal, por favor?',
    category: 'daily',
    categoryName: 'Frases do Dia a Dia',
    themeColor: 'from-purple-500/25 to-pink-600/15 border-purple-500/40'
  },
  {
    id: 'good_morning',
    english: 'Good morning',
    portuguese: 'Bom dia',
    phonetic: '/ɡʊd ˈmɔː.nɪŋ/',
    emoji: '🌅',
    exampleSentenceEn: 'Good morning! Have a wonderful day.',
    exampleSentencePt: 'Bom dia! Tenha um dia maravilhoso.',
    category: 'daily',
    categoryName: 'Frases do Dia a Dia',
    themeColor: 'from-amber-400/25 to-yellow-500/15 border-amber-400/40'
  },
  {
    id: 'good_night',
    english: 'Good night',
    portuguese: 'Boa noite',
    phonetic: '/ɡʊd naɪt/',
    emoji: '🌌',
    exampleSentenceEn: 'Good night and sweet dreams!',
    exampleSentencePt: 'Boa noite e bons sonhos!',
    category: 'daily',
    categoryName: 'Frases do Dia a Dia',
    themeColor: 'from-indigo-600/25 to-violet-700/15 border-indigo-500/40'
  },
  {
    id: 'welcome',
    english: 'Welcome',
    portuguese: 'Bem-vindo',
    phonetic: '/ˈwel.kəm/',
    emoji: '🎉',
    exampleSentenceEn: 'Welcome to our English learning game!',
    exampleSentencePt: 'Bem-vindo ao nosso jogo de aprender inglês!',
    category: 'daily',
    categoryName: 'Frases do Dia a Dia',
    themeColor: 'from-pink-500/25 to-rose-600/15 border-pink-500/40'
  },
  {
    id: 'goodbye',
    english: 'Goodbye',
    portuguese: 'Adeus / Tchau',
    phonetic: '/ɡʊdˈbaɪ/',
    emoji: '🛫',
    exampleSentenceEn: 'Goodbye, see you tomorrow!',
    exampleSentencePt: 'Tchau, até amanhã!',
    category: 'daily',
    categoryName: 'Frases do Dia a Dia',
    themeColor: 'from-teal-500/25 to-cyan-600/15 border-teal-500/40'
  },
  {
    id: 'excuse_me',
    english: 'Excuse me',
    portuguese: 'Com licença',
    phonetic: '/ɪkˈskjuːz miː/',
    emoji: '🚪',
    exampleSentenceEn: 'Excuse me, where is the restroom?',
    exampleSentencePt: 'Com licença, onde fica o banheiro?',
    category: 'daily',
    categoryName: 'Frases do Dia a Dia',
    themeColor: 'from-sky-500/25 to-blue-600/15 border-sky-500/40'
  },
  {
    id: 'how_are_you',
    english: 'How are you?',
    portuguese: 'Como você está?',
    phonetic: '/haʊ ɑːr juː/',
    emoji: '😊',
    exampleSentenceEn: 'How are you doing today, my friend?',
    exampleSentencePt: 'Como você está hoje, meu amigo?',
    category: 'daily',
    categoryName: 'Frases do Dia a Dia',
    themeColor: 'from-green-500/25 to-emerald-600/15 border-green-500/40'
  },
  {
    id: 'you_are_welcome',
    english: "You're welcome",
    portuguese: 'De nada',
    phonetic: '/jɔːr ˈwel.kəm/',
    emoji: '🤝',
    exampleSentenceEn: "You're welcome anytime!",
    exampleSentencePt: 'De nada, à sua disposição sempre!',
    category: 'daily',
    categoryName: 'Frases do Dia a Dia',
    themeColor: 'from-violet-500/25 to-purple-600/15 border-violet-500/40'
  },

  // ✈️ TRAVEL & PLACES
  {
    id: 'airport',
    english: 'Airport',
    portuguese: 'Aeroporto',
    phonetic: '/ˈeə.pɔːt/',
    emoji: '🛫',
    exampleSentenceEn: 'We arrived early at the international airport.',
    exampleSentencePt: 'Chegamos cedo ao aeroporto internacional.',
    category: 'travel',
    categoryName: 'Viagem & Lugares',
    themeColor: 'from-sky-500/25 to-blue-600/15 border-sky-500/40'
  },
  {
    id: 'hotel',
    english: 'Hotel',
    portuguese: 'Hotel',
    phonetic: '/həʊˈtel/',
    emoji: '🏨',
    exampleSentenceEn: 'Our hotel has a lovely ocean view.',
    exampleSentencePt: 'Nosso hotel tem uma linda vista para o oceano.',
    category: 'travel',
    categoryName: 'Viagem & Lugares',
    themeColor: 'from-amber-500/25 to-orange-600/15 border-amber-500/40'
  },
  {
    id: 'passport',
    english: 'Passport',
    portuguese: 'Passaporte',
    phonetic: '/ˈpɑːs.pɔːt/',
    emoji: '🛂',
    exampleSentenceEn: 'Don’t forget your passport before traveling.',
    exampleSentencePt: 'Não se esqueça do passaporte antes de viajar.',
    category: 'travel',
    categoryName: 'Viagem & Lugares',
    themeColor: 'from-emerald-500/25 to-teal-600/15 border-emerald-500/40'
  },
  {
    id: 'beach',
    english: 'Beach',
    portuguese: 'Praia',
    phonetic: '/biːtʃ/',
    emoji: '🏖️',
    exampleSentenceEn: 'We built sandcastles on the sunny beach.',
    exampleSentencePt: 'Construímos castelos de areia na praia ensolarada.',
    category: 'travel',
    categoryName: 'Viagem & Lugares',
    themeColor: 'from-yellow-400/25 to-cyan-500/15 border-yellow-400/40'
  },
  {
    id: 'train',
    english: 'Train',
    portuguese: 'Trem',
    phonetic: '/treɪn/',
    emoji: '🚆',
    exampleSentenceEn: 'The bullet train is fast and punctual.',
    exampleSentencePt: 'O trem-bala é rápido e pontual.',
    category: 'travel',
    categoryName: 'Viagem & Lugares',
    themeColor: 'from-indigo-500/25 to-blue-600/15 border-indigo-500/40'
  },
  {
    id: 'ticket',
    english: 'Ticket',
    portuguese: 'Passagem / Ingresso',
    phonetic: '/ˈtɪk.ɪt/',
    emoji: '🎟️',
    exampleSentenceEn: 'Show your boarding ticket to the agent.',
    exampleSentencePt: 'Mostre seu bilhete de embarque ao atendente.',
    category: 'travel',
    categoryName: 'Viagem & Lugares',
    themeColor: 'from-rose-500/25 to-pink-600/15 border-rose-500/40'
  },
  {
    id: 'map',
    english: 'Map',
    portuguese: 'Mapa',
    phonetic: '/mæp/',
    emoji: '🗺️',
    exampleSentenceEn: 'Follow the city map to find the museum.',
    exampleSentencePt: 'Siga o mapa da cidade para achar o museu.',
    category: 'travel',
    categoryName: 'Viagem & Lugares',
    themeColor: 'from-emerald-500/25 to-lime-600/15 border-emerald-500/40'
  },
  {
    id: 'city',
    english: 'City',
    portuguese: 'Cidade',
    phonetic: '/ˈsɪt.i/',
    emoji: '🏙️',
    exampleSentenceEn: 'New York is a vibrant and bustling city.',
    exampleSentencePt: 'Nova York é uma cidade vibrante e movimentada.',
    category: 'travel',
    categoryName: 'Viagem & Lugares',
    themeColor: 'from-blue-600/25 to-indigo-700/15 border-blue-600/40'
  },
  {
    id: 'taxi',
    english: 'Taxi',
    portuguese: 'Táxi',
    phonetic: '/ˈtæk.si/',
    emoji: '🚕',
    exampleSentenceEn: 'Call a taxi to take us to the center.',
    exampleSentencePt: 'Chame um táxi para nos levar ao centro.',
    category: 'travel',
    categoryName: 'Viagem & Lugares',
    themeColor: 'from-yellow-400/25 to-amber-500/15 border-yellow-400/40'
  },
  {
    id: 'station',
    english: 'Station',
    portuguese: 'Estação',
    phonetic: '/ˈsteɪ.ʃən/',
    emoji: '🚉',
    exampleSentenceEn: 'Meet me at the central station entrance.',
    exampleSentencePt: 'Encontre-me na entrada da estação central.',
    category: 'travel',
    categoryName: 'Viagem & Lugares',
    themeColor: 'from-slate-400/25 to-zinc-600/15 border-slate-400/40'
  },

  // 🏃 ACTION VERBS
  {
    id: 'to_run',
    english: 'Run',
    portuguese: 'Correr',
    phonetic: '/rʌn/',
    emoji: '🏃',
    exampleSentenceEn: 'I run in the park three times a week.',
    exampleSentencePt: 'Eu corro no parque três vezes por semana.',
    category: 'actions',
    categoryName: 'Verbos & Ações',
    themeColor: 'from-orange-500/25 to-amber-600/15 border-orange-500/40'
  },
  {
    id: 'to_eat',
    english: 'Eat',
    portuguese: 'Comer',
    phonetic: '/iːt/',
    emoji: '🍽️',
    exampleSentenceEn: 'They eat dinner together as a family.',
    exampleSentencePt: 'Eles jantam juntos em família.',
    category: 'actions',
    categoryName: 'Verbos & Ações',
    themeColor: 'from-emerald-500/25 to-teal-600/15 border-emerald-500/40'
  },
  {
    id: 'to_drink',
    english: 'Drink',
    portuguese: 'Beber',
    phonetic: '/drɪŋk/',
    emoji: '🥤',
    exampleSentenceEn: 'Always drink clean water when it is hot.',
    exampleSentencePt: 'Sempre beba água limpa quando estiver calor.',
    category: 'actions',
    categoryName: 'Verbos & Ações',
    themeColor: 'from-cyan-500/25 to-blue-600/15 border-cyan-500/40'
  },
  {
    id: 'to_sleep',
    english: 'Sleep',
    portuguese: 'Dormir',
    phonetic: '/sliːp/',
    emoji: '😴',
    exampleSentenceEn: 'Try to sleep at least eight hours per night.',
    exampleSentencePt: 'Tente dormir pelo menos oito horas por noite.',
    category: 'actions',
    categoryName: 'Verbos & Ações',
    themeColor: 'from-indigo-500/25 to-purple-600/15 border-indigo-500/40'
  },
  {
    id: 'to_study',
    english: 'Study',
    portuguese: 'Estudar',
    phonetic: '/ˈstʌd.i/',
    emoji: '📚',
    exampleSentenceEn: 'Students study English to unlock opportunities.',
    exampleSentencePt: 'Estudantes estudam inglês para abrir oportunidades.',
    category: 'actions',
    categoryName: 'Verbos & Ações',
    themeColor: 'from-lime-500/25 to-emerald-600/15 border-lime-500/40'
  },
  {
    id: 'to_speak',
    english: 'Speak',
    portuguese: 'Falar',
    phonetic: '/spiːk/',
    emoji: '🗣️',
    exampleSentenceEn: 'Practice every day to speak English fluently.',
    exampleSentencePt: 'Pratique todo dia para falar inglês fluentemente.',
    category: 'actions',
    categoryName: 'Verbos & Ações',
    themeColor: 'from-sky-500/25 to-indigo-600/15 border-sky-500/40'
  },
  {
    id: 'to_listen',
    english: 'Listen',
    portuguese: 'Ouvir / Escutar',
    phonetic: '/ˈlɪs.ən/',
    emoji: '🎧',
    exampleSentenceEn: 'Listen carefully to the English pronunciation.',
    exampleSentencePt: 'Ouça com atenção a pronúncia em inglês.',
    category: 'actions',
    categoryName: 'Verbos & Ações',
    themeColor: 'from-violet-500/25 to-purple-600/15 border-violet-500/40'
  },
  {
    id: 'to_read',
    english: 'Read',
    portuguese: 'Ler',
    phonetic: '/riːd/',
    emoji: '📖',
    exampleSentenceEn: 'She loves to read inspiring adventure books.',
    exampleSentencePt: 'Ela ama ler livros inspiradores de aventura.',
    category: 'actions',
    categoryName: 'Verbos & Ações',
    themeColor: 'from-amber-500/25 to-yellow-600/15 border-amber-500/40'
  },
  {
    id: 'to_play',
    english: 'Play',
    portuguese: 'Jogar / Brincar',
    phonetic: '/pleɪ/',
    emoji: '🎮',
    exampleSentenceEn: 'Let’s play a fun game together!',
    exampleSentencePt: 'Vamos jogar um jogo divertido juntos!',
    category: 'actions',
    categoryName: 'Verbos & Ações',
    themeColor: 'from-pink-500/25 to-rose-600/15 border-pink-500/40'
  },
  {
    id: 'to_smile',
    english: 'Smile',
    portuguese: 'Sorrir',
    phonetic: '/smaɪl/',
    emoji: '😁',
    exampleSentenceEn: 'A warm smile makes everyone feel welcome.',
    exampleSentencePt: 'Um sorriso caloroso faz todos se sentirem bem-vindos.',
    category: 'actions',
    categoryName: 'Verbos & Ações',
    themeColor: 'from-yellow-400/25 to-amber-500/15 border-yellow-400/40'
  },

  // 🏠 HOUSE & EVERYDAY OBJECTS
  {
    id: 'house',
    english: 'House',
    portuguese: 'Casa',
    phonetic: '/haʊs/',
    emoji: '🏠',
    exampleSentenceEn: 'Welcome to our cozy green house.',
    exampleSentencePt: 'Bem-vindo à nossa casa verde e aconchegante.',
    category: 'home',
    categoryName: 'Casa & Objetos',
    themeColor: 'from-emerald-500/25 to-green-600/15 border-emerald-500/40'
  },
  {
    id: 'book',
    english: 'Book',
    portuguese: 'Livro',
    phonetic: '/bʊk/',
    emoji: '📕',
    exampleSentenceEn: 'Open your book to page twenty.',
    exampleSentencePt: 'Abra seu livro na página vinte.',
    category: 'home',
    categoryName: 'Casa & Objetos',
    themeColor: 'from-red-500/25 to-amber-600/15 border-red-500/40'
  },
  {
    id: 'phone',
    english: 'Phone',
    portuguese: 'Telefone / Celular',
    phonetic: '/fəʊn/',
    emoji: '📱',
    exampleSentenceEn: 'I use my smartphone to practice Duolingo.',
    exampleSentencePt: 'Uso meu smartphone para praticar no Duolingo.',
    category: 'home',
    categoryName: 'Casa & Objetos',
    themeColor: 'from-blue-500/25 to-cyan-600/15 border-blue-500/40'
  },
  {
    id: 'clock',
    english: 'Clock',
    portuguese: 'Relógio',
    phonetic: '/klɒk/',
    emoji: '⏰',
    exampleSentenceEn: 'The alarm clock rings at seven o’clock.',
    exampleSentencePt: 'O despertador toca às sete horas.',
    category: 'home',
    categoryName: 'Casa & Objetos',
    themeColor: 'from-amber-400/25 to-yellow-500/15 border-amber-400/40'
  },
  {
    id: 'key',
    english: 'Key',
    portuguese: 'Chave',
    phonetic: '/kiː/',
    emoji: '🔑',
    exampleSentenceEn: 'The golden key opens the mystery door.',
    exampleSentencePt: 'A chave dourada abre a porta misteriosa.',
    category: 'home',
    categoryName: 'Casa & Objetos',
    themeColor: 'from-yellow-500/25 to-amber-600/15 border-yellow-500/40'
  },
  {
    id: 'car',
    english: 'Car',
    portuguese: 'Carro',
    phonetic: '/kɑːr/',
    emoji: '🚗',
    exampleSentenceEn: 'We drove the electric car into town.',
    exampleSentencePt: 'Dirigimos o carro elétrico até a cidade.',
    category: 'home',
    categoryName: 'Casa & Objetos',
    themeColor: 'from-rose-500/25 to-red-600/15 border-rose-500/40'
  },
  {
    id: 'computer',
    english: 'Computer',
    portuguese: 'Computador',
    phonetic: '/kəmˈpjuː.tər/',
    emoji: '💻',
    exampleSentenceEn: 'I learn new English words on my computer.',
    exampleSentencePt: 'Aprendo novas palavras em inglês no meu computador.',
    category: 'home',
    categoryName: 'Casa & Objetos',
    themeColor: 'from-indigo-500/25 to-blue-600/15 border-indigo-500/40'
  },
  {
    id: 'door',
    english: 'Door',
    portuguese: 'Porta',
    phonetic: '/dɔːr/',
    emoji: '🚪',
    exampleSentenceEn: 'Please close the front door gently.',
    exampleSentencePt: 'Por favor, feche a porta da frente devagar.',
    category: 'home',
    categoryName: 'Casa & Objetos',
    themeColor: 'from-amber-600/25 to-yellow-700/15 border-amber-600/40'
  },
  {
    id: 'window',
    english: 'Window',
    portuguese: 'Janela',
    phonetic: '/ˈwɪn.dəʊ/',
    emoji: '🪟',
    exampleSentenceEn: 'Look outside the window; the weather is nice.',
    exampleSentencePt: 'Olhe pela janela; o tempo está agradável.',
    category: 'home',
    categoryName: 'Casa & Objetos',
    themeColor: 'from-cyan-400/25 to-sky-500/15 border-cyan-400/40'
  },
  {
    id: 'guitar',
    english: 'Guitar',
    portuguese: 'Violão / Guitarra',
    phonetic: '/ɡɪˈtɑːr/',
    emoji: '🎸',
    exampleSentenceEn: 'He plays acoustic guitar and sings songs.',
    exampleSentencePt: 'Ele toca violão acústico e canta músicas.',
    category: 'home',
    categoryName: 'Casa & Objetos',
    themeColor: 'from-orange-500/25 to-amber-600/15 border-orange-500/40'
  },
  {
    id: 'bed',
    english: 'Bed',
    portuguese: 'Cama',
    phonetic: '/bed/',
    emoji: '🛏️',
    exampleSentenceEn: 'I sleep deeply in my warm and comfortable bed.',
    exampleSentencePt: 'Eu durmo profundamente na minha cama quente e confortável.',
    category: 'home',
    categoryName: 'Casa & Objetos',
    themeColor: 'from-indigo-500/25 to-purple-600/15 border-indigo-500/40'
  },
  {
    id: 'sofa',
    english: 'Sofa',
    portuguese: 'Sofá',
    phonetic: '/ˈsəʊ.fə/',
    emoji: '🛋️',
    exampleSentenceEn: 'We sit on the cozy living room sofa to rest.',
    exampleSentencePt: 'Sentamos no sofá confortável da sala para descansar.',
    category: 'home',
    categoryName: 'Casa & Objetos',
    themeColor: 'from-amber-500/25 to-orange-600/15 border-amber-500/40'
  },
  {
    id: 'table',
    english: 'Table',
    portuguese: 'Mesa',
    phonetic: '/ˈteɪ.bəl/',
    emoji: '🪵',
    exampleSentenceEn: 'Our family gathers around the dining table.',
    exampleSentencePt: 'Nossa família se reúne em volta da mesa de jantar.',
    category: 'home',
    categoryName: 'Casa & Objetos',
    themeColor: 'from-amber-600/25 to-yellow-700/15 border-amber-600/40'
  },
  {
    id: 'chair',
    english: 'Chair',
    portuguese: 'Cadeira',
    phonetic: '/tʃeər/',
    emoji: '🪑',
    exampleSentenceEn: 'Sit down on this sturdy wooden chair.',
    exampleSentencePt: 'Sente-se nesta firme cadeira de madeira.',
    category: 'home',
    categoryName: 'Casa & Objetos',
    themeColor: 'from-stone-400/25 to-zinc-600/15 border-stone-400/40'
  },
  {
    id: 'lamp',
    english: 'Lamp',
    portuguese: 'Abajur / Luminária',
    phonetic: '/læmp/',
    emoji: '💡',
    exampleSentenceEn: 'Turn on the desk lamp when you study at night.',
    exampleSentencePt: 'Ligue o abajur da mesa quando for estudar à noite.',
    category: 'home',
    categoryName: 'Casa & Objetos',
    themeColor: 'from-yellow-400/25 to-amber-500/15 border-yellow-400/40'
  },
  {
    id: 'mirror',
    english: 'Mirror',
    portuguese: 'Espelho',
    phonetic: '/ˈmɪr.ər/',
    emoji: '🪞',
    exampleSentenceEn: 'She checked her smile in the bathroom mirror.',
    exampleSentencePt: 'Ela conferiu seu sorriso no espelho do banheiro.',
    category: 'home',
    categoryName: 'Casa & Objetos',
    themeColor: 'from-teal-400/25 to-cyan-500/15 border-teal-400/40'
  },
  {
    id: 'fridge',
    english: 'Fridge',
    portuguese: 'Geladeira',
    phonetic: '/frɪdʒ/',
    emoji: '🧊',
    exampleSentenceEn: 'Keep the milk and fresh fruit inside the fridge.',
    exampleSentencePt: 'Guarde o leite e frutas frescas dentro da geladeira.',
    category: 'home',
    categoryName: 'Casa & Objetos',
    themeColor: 'from-cyan-400/25 to-blue-500/15 border-cyan-400/40'
  },
  {
    id: 'stove',
    english: 'Stove',
    portuguese: 'Fogão',
    phonetic: '/stəʊv/',
    emoji: '🍳',
    exampleSentenceEn: 'A hot pot of soup is simmering on the stove.',
    exampleSentencePt: 'Uma panela quente de sopa está fervendo no fogão.',
    category: 'home',
    categoryName: 'Casa & Objetos',
    themeColor: 'from-orange-500/25 to-red-600/15 border-orange-500/40'
  },
  {
    id: 'microwave',
    english: 'Microwave',
    portuguese: 'Micro-ondas',
    phonetic: '/ˈmaɪ.krə.weɪv/',
    emoji: '🍲',
    exampleSentenceEn: 'Heat the food in the microwave for two minutes.',
    exampleSentencePt: 'Esquente a comida no micro-ondas por dois minutos.',
    category: 'home',
    categoryName: 'Casa & Objetos',
    themeColor: 'from-blue-400/25 to-indigo-600/15 border-blue-400/40'
  },
  {
    id: 'cup',
    english: 'Cup',
    portuguese: 'Xícara / Copo',
    phonetic: '/kʌp/',
    emoji: '☕',
    exampleSentenceEn: 'She poured hot black coffee into the ceramic cup.',
    exampleSentencePt: 'Ela colocou café preto quente na xícara de cerâmica.',
    category: 'home',
    categoryName: 'Casa & Objetos',
    themeColor: 'from-amber-600/25 to-yellow-600/15 border-amber-600/40'
  },
  {
    id: 'plate',
    english: 'Plate',
    portuguese: 'Prato',
    phonetic: '/pleɪt/',
    emoji: '🍽️',
    exampleSentenceEn: 'Put a serving plate at each person’s seat.',
    exampleSentencePt: 'Coloque um prato de servir no lugar de cada pessoa.',
    category: 'home',
    categoryName: 'Casa & Objetos',
    themeColor: 'from-slate-300/25 to-zinc-500/15 border-slate-300/40'
  },
  {
    id: 'spoon',
    english: 'Spoon',
    portuguese: 'Colher',
    phonetic: '/spuːn/',
    emoji: '🥄',
    exampleSentenceEn: 'Use a dessert spoon to eat the delicious ice cream.',
    exampleSentencePt: 'Use uma colher de sobremesa para comer o sorvete delicioso.',
    category: 'home',
    categoryName: 'Casa & Objetos',
    themeColor: 'from-zinc-300/25 to-slate-500/15 border-zinc-300/40'
  },
  {
    id: 'fork',
    english: 'Fork',
    portuguese: 'Garfo',
    phonetic: '/fɔːk/',
    emoji: '🍴',
    exampleSentenceEn: 'The fork is placed on the left side of the plate.',
    exampleSentencePt: 'O garfo é posicionado no lado esquerdo do prato.',
    category: 'home',
    categoryName: 'Casa & Objetos',
    themeColor: 'from-slate-400/25 to-blue-500/15 border-slate-400/40'
  },
  {
    id: 'knife',
    english: 'Knife',
    portuguese: 'Faca',
    phonetic: '/naɪf/',
    emoji: '🔪',
    exampleSentenceEn: 'Always hold a sharp chef knife with care.',
    exampleSentencePt: 'Sempre segure uma faca afiada de chef com cuidado.',
    category: 'home',
    categoryName: 'Casa & Objetos',
    themeColor: 'from-gray-400/25 to-slate-600/15 border-gray-400/40'
  },
  {
    id: 'pillow',
    english: 'Pillow',
    portuguese: 'Travesseiro',
    phonetic: '/ˈpɪl.əʊ/',
    emoji: '💤',
    exampleSentenceEn: 'A feather pillow provides support for your head.',
    exampleSentencePt: 'Um travesseiro de penas oferece suporte para sua cabeça.',
    category: 'home',
    categoryName: 'Casa & Objetos',
    themeColor: 'from-violet-400/25 to-purple-500/15 border-violet-400/40'
  },
  {
    id: 'blanket',
    english: 'Blanket',
    portuguese: 'Cobertor',
    phonetic: '/ˈblæŋ.kɪt/',
    emoji: '🧶',
    exampleSentenceEn: 'Wrap yourself in this warm fuzzy blanket.',
    exampleSentencePt: 'Envolva-se neste cobertor fofinho e quente.',
    category: 'home',
    categoryName: 'Casa & Objetos',
    themeColor: 'from-rose-400/25 to-pink-500/15 border-rose-400/40'
  },
  {
    id: 'towel',
    english: 'Towel',
    portuguese: 'Toalha',
    phonetic: '/ˈtaʊ.əl/',
    emoji: '🛁',
    exampleSentenceEn: 'Dry off with a fresh clean bath towel.',
    exampleSentencePt: 'Enxugue-se com uma toalha de banho limpa e fresca.',
    category: 'home',
    categoryName: 'Casa & Objetos',
    themeColor: 'from-teal-400/25 to-emerald-500/15 border-teal-400/40'
  },
  {
    id: 'shower',
    english: 'Shower',
    portuguese: 'Chuveiro',
    phonetic: '/ˈʃaʊ.ər/',
    emoji: '🚿',
    exampleSentenceEn: 'I take a refreshing warm shower in the morning.',
    exampleSentencePt: 'Tomo um banho de chuveiro quente e revigorante de manhã.',
    category: 'home',
    categoryName: 'Casa & Objetos',
    themeColor: 'from-blue-400/25 to-sky-500/15 border-blue-400/40'
  },
  {
    id: 'soap',
    english: 'Soap',
    portuguese: 'Sabonete',
    phonetic: '/səʊp/',
    emoji: '🧼',
    exampleSentenceEn: 'Wash hands thoroughly with foamy antibacterial soap.',
    exampleSentencePt: 'Lave bem as mãos com sabonete espumante antibacteriano.',
    category: 'home',
    categoryName: 'Casa & Objetos',
    themeColor: 'from-pink-300/25 to-rose-400/15 border-pink-300/40'
  },
  {
    id: 'toothbrush',
    english: 'Toothbrush',
    portuguese: 'Escova de Dentes',
    phonetic: '/ˈtuːθ.brʌʃ/',
    emoji: '🪥',
    exampleSentenceEn: 'Use toothpaste and your toothbrush every morning.',
    exampleSentencePt: 'Use pasta de dente e sua escova de dentes todas as manhãs.',
    category: 'home',
    categoryName: 'Casa & Objetos',
    themeColor: 'from-emerald-400/25 to-teal-500/15 border-emerald-400/40'
  },
  {
    id: 'wardrobe',
    english: 'Wardrobe',
    portuguese: 'Guarda-Roupa',
    phonetic: '/ˈwɔː.drəʊb/',
    emoji: '🚪',
    exampleSentenceEn: 'Hang clean shirts inside the large wardrobe.',
    exampleSentencePt: 'Pendure camisas limpas dentro do grande guarda-roupa.',
    category: 'home',
    categoryName: 'Casa & Objetos',
    themeColor: 'from-amber-700/25 to-stone-700/15 border-amber-700/40'
  },
  {
    id: 'fan',
    english: 'Fan',
    portuguese: 'Ventilador',
    phonetic: '/fæn/',
    emoji: '🌀',
    exampleSentenceEn: 'The ceiling fan keeps the whole room cool.',
    exampleSentencePt: 'O ventilador de teto mantém o quarto inteiro fresco.',
    category: 'home',
    categoryName: 'Casa & Objetos',
    themeColor: 'from-sky-400/25 to-cyan-500/15 border-sky-400/40'
  },
  {
    id: 'plant',
    english: 'Houseplant',
    portuguese: 'Planta de Vaso',
    phonetic: '/ˈhaʊs.plɑːnt/',
    emoji: '🪴',
    exampleSentenceEn: 'The green houseplant purifies indoor air naturally.',
    exampleSentencePt: 'A planta de vaso verde purifica o ar interno naturalmente.',
    category: 'home',
    categoryName: 'Casa & Objetos',
    themeColor: 'from-emerald-500/25 to-green-600/15 border-emerald-500/40'
  },
  {
    id: 'rug',
    english: 'Rug',
    portuguese: 'Tapete',
    phonetic: '/rʌɡ/',
    emoji: '🧶',
    exampleSentenceEn: 'The soft Persian rug adds warmth to the floor.',
    exampleSentencePt: 'O macio tapete persa adiciona aconchego ao chão.',
    category: 'home',
    categoryName: 'Casa & Objetos',
    themeColor: 'from-red-400/25 to-orange-500/15 border-red-400/40'
  },
];

// Duo Owl Mascot Encouragement quotes
export const DUO_MASCOT_QUOTES = [
  { en: "Awesome! You're on fire! 🔥", pt: "Incrível! Você está arrasando! 🔥" },
  { en: "Great job! Keep practicing! 🦉", pt: "Ótimo trabalho! Continue praticando! 🦉" },
  { en: "You're learning fast! ⚡", pt: "Você está aprendendo super rápido! ⚡" },
  { en: "Practice makes perfect! 💎", pt: "A prática leva à perfeição! 💎" },
  { en: "Duo is so proud of you! 💚", pt: "O Duo está muito orgulhoso de você! 💚" },
  { en: "Listen closely to the English sounds! 🎧", pt: "Ouça com atenção a pronúncia em inglês! 🎧" },
  { en: "Every match expands your vocabulary! 📖", pt: "Cada par expande o seu vocabulário! 📖" },
  { en: "Fantastic memory! You got this! 🌟", pt: "Memória fantástica! Você consegue! 🌟" },
];

// Deck generator for the Duolingo memory game
export function generateDuoDeck(
  pairCount: number = 32,
  selectedCategory: DuoCategory = 'animals_home'
): DuoMemoryCard[] {
  let selectedItems: DuoWordItem[] = [];

  if (selectedCategory === 'animals_home') {
    const animalsPool = DUO_WORDS_DATABASE.filter((w) => w.category === 'animals').sort(() => Math.random() - 0.5);
    const homePool = DUO_WORDS_DATABASE.filter((w) => w.category === 'home').sort(() => Math.random() - 0.5);
    const halfCount = Math.floor(pairCount / 2);
    const pickedAnimals = animalsPool.slice(0, halfCount);
    const pickedHome = homePool.slice(0, pairCount - pickedAnimals.length);
    selectedItems = [...pickedAnimals, ...pickedHome].sort(() => Math.random() - 0.5);
  } else if (selectedCategory !== 'all') {
    let pool = DUO_WORDS_DATABASE.filter((w) => w.category === selectedCategory);
    if (pool.length < pairCount) {
      const rest = DUO_WORDS_DATABASE.filter((w) => w.category !== selectedCategory);
      pool = [...pool, ...rest];
    }
    const shuffledPool = [...pool].sort(() => Math.random() - 0.5);
    selectedItems = shuffledPool.slice(0, Math.min(pairCount, pool.length));
  } else {
    const shuffledPool = [...DUO_WORDS_DATABASE].sort(() => Math.random() - 0.5);
    selectedItems = shuffledPool.slice(0, Math.min(pairCount, DUO_WORDS_DATABASE.length));
  }

  const cards: DuoMemoryCard[] = [];

  selectedItems.forEach((item) => {
    // Card 1: English card (Word, phonetic, speaker icon)
    cards.push({
      instanceId: `card-${item.id}-en`,
      pairId: item.id,
      type: 'english',
      title: item.english,
      subtitle: item.phonetic,
      emoji: '🇺🇸',
      phonetic: item.phonetic,
      exampleEn: item.exampleSentenceEn,
      examplePt: item.exampleSentencePt,
      category: item.categoryName,
      isFlipped: false,
      isMatched: false,
      isWrong: false,
      themeColor: item.themeColor,
    });

    // Card 2: Portuguese translation card (Translation + emoji illustration + visual clue)
    cards.push({
      instanceId: `card-${item.id}-pt`,
      pairId: item.id,
      type: 'portuguese',
      title: item.portuguese,
      subtitle: item.categoryName,
      emoji: item.emoji,
      exampleEn: item.exampleSentenceEn,
      examplePt: item.exampleSentencePt,
      category: item.categoryName,
      isFlipped: false,
      isMatched: false,
      isWrong: false,
      themeColor: item.themeColor,
    });
  });

  // Fisher-Yates shuffle
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  return cards;
}
