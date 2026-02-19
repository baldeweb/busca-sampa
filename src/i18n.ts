import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { placeTypeLabels } from '@/i18n/extra/placeType';
import { environmentLabels } from '@/i18n/extra/environment';
import { routeOptionLabels } from '@/i18n/extra/routeOptions';
import { reportProblemLabels } from '@/i18n/extra/reportProblem';
import { homeNearMeLabels } from '@/i18n/extra/homeNearMe';
import { priceRangeLabels } from '@/i18n/extra/priceRange';
import { footerLabels } from '@/i18n/extra/footer';

// Load persisted language or detect from device/browser (no geolocation)
const SUPPORTED_LANGS = ['pt', 'es', 'fr', 'ru', 'zh', 'en', 'de', 'ja', 'ar', 'it', 'nl', 'tr', 'pl'];

function detectPreferredLang(): string {
  if (typeof window === 'undefined') return 'pt';

  // 1) respect localStorage if user previously selected a language
  const cached = localStorage.getItem('lang');
  if (cached && SUPPORTED_LANGS.includes(cached)) return cached;

  // 2) try navigator.languages (array) then navigator.language
  try {
    const nav = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language];
    for (const tag of nav) {
      if (!tag) continue;
      const code = tag.split('-')[0];
      if (SUPPORTED_LANGS.includes(code)) return code;
    }
  } catch (e) {
    // ignore and fallback
  }

  // 3) try Intl locale
  try {
    const locale = (Intl as any)?.DateTimeFormat?.()?.resolvedOptions?.()?.locale;
    if (locale) {
      const code = locale.split('-')[0];
      if (SUPPORTED_LANGS.includes(code)) return code;
    }
  } catch (_) {}

  // default
  return 'pt';
}

const savedLang = detectPreferredLang();

type ResourceMap = Record<string, { translation: Record<string, any> }>;

function mergeDeep(target: Record<string, any>, source: Record<string, any>) {
  const output = { ...target };
  Object.keys(source || {}).forEach((key) => {
    const srcValue = source[key];
    const tgtValue = output[key];
    if (srcValue && typeof srcValue === 'object' && !Array.isArray(srcValue)) {
      output[key] = mergeDeep(tgtValue && typeof tgtValue === 'object' ? tgtValue : {}, srcValue);
    } else {
      output[key] = srcValue;
    }
  });
  return output;
}

function mergeResourceSets(base: ResourceMap, extras: ResourceMap[]) {
  let merged: ResourceMap = mergeDeep({}, base) as ResourceMap;
  extras.forEach((extra) => {
    merged = mergeDeep(merged, extra) as ResourceMap;
  });
  return merged;
}

const resources = {
  pt: {
    translation: {
      home: {
        nearMeTitle: 'Perto de mim',
        nearMeSubtitle: '(mostrando lugares em um raio de {{km}}km próximo a você)',
        allowLocation: 'Ops, não encontramos sua localização...\n\nPara encontrar lugares perto de você, clique no botão abaixo:',
        allowLocationButton: 'Permitir localização',
        loadingCategories: 'Carregando categorias...',
        increaseRadius: 'Aumentar raio',
        neighborhoodsTitle: 'Por bairro',
        neighborhoodsTagline: 'Tá em algum desses bairros? Tem coisa boa por perto!',
        viewMoreNeighborhoods: 'ver mais bairros',
        viewMore: 'Mais opções',
        noNearbyResultsRadius: 'Não há nada próximo a você...\n\nQue tal alterarmos a distância para\nlistarmos os lugares próximos?',
        locationNotSupported: 'Geolocalização não suportada neste navegador.',
        locationDeniedInstructions: '',
        outsideGreaterSP: 'Você está fora da região da Grande SP. Que tal visitar a cidade em breve? :)',
        viewPlace: 'ver local',
        viewPlaces: 'ver locais'
      },
      header: {
        title: 'Role Paulista',
        tagline: 'A melhor recomendação, \na poucos cliques de distância'
      },
      common: {
        back: 'Voltar',
        details: 'Saiba mais',
        selectLanguage: 'Selecione um idioma',
        changeDistance: 'Aumentar distância',
        all: 'Tudo',
        filter: 'Filtro:',
        close: 'Fechar',
        loading: 'Carregando…',
        loadError: 'Erro ao carregar dados.',
        noPlaces: 'Nenhum lugar encontrado.',
        version: 'Versão',
      },
      list: {
        nameHeader: 'Nome',
        neighborhoodHeader: 'Bairro',
        typeHeader: 'Tipo',
        orderNameAsc: 'NOME em ordem crescente A-Z',
        orderNeighborhoodAsc: 'BAIRRO em ordem crescente A-Z',
        variablePlace: 'lugar variável',
        seeDetails: 'ver detalhes'
      },
      filters: {
        title: 'Filtros',
        subtitle: 'Ajuste os filtros abaixo para refinar os resultados',
        sortingTitle: 'Ordenação',
        hoursTitle: 'Horários',
        openNowLabel: 'Aberto agora',
        openNow: 'Aberto agora',
        anyHourLabel: 'Qualquer horário',
        anyHour: 'Qualquer horário',
        scheduleTitle: 'Agendar',
        scheduleRequired: 'Necessário agendar',
        scheduleNotRequired: 'Não precisa agendar',
        anySchedule: 'Qualquer',
        cityTitle: 'Cidade',
        anyCity: 'Qualquer cidade',
        priceTitle: 'Preço',
        anyPrice: 'Qualquer preço',
        button: 'Filtros'
      },
      whereIsToday: {
        title: 'E aí, onde é hoje?',
        subtitle: 'Lista de lugares onde fui, por categoria, dá uma olhada ;)',
        opensToday: 'Abrem hoje'
      },
      placeDetail: {
        loading: 'Carregando detalhes...',
        notFound: 'Local não encontrado.',
        opensMonday: 'abre nas segundas-feiras',
        opensSunday: 'abre aos domingos',
        opensHoliday: 'abre em feriados',
        alreadyVisited: '✓ Já fui e recomendo',
        notVisited: '⚠️ Ainda não visitei',
        visitModalTitle: 'Sobre os lugares que visitei',
        visitModalParagraph: 'Local pendente de visitação. As informações contidas nesta página são a partir de sugestões de outras pessoas que foram e me recomendaram para conhecer.',
        visitedModalParagraph: 'Local visitado. As informações contidas nesta página são a partir do que coletei quando visitei, itens que pedi ou visitei, e informações coletadas pelos responsáveis do local',
        neverEmphasis: '',
        priceLabel: 'Preço:',
        environmentTypeLabel: 'Tipo de ambiente:',
        hoursTitle: 'Horário de funcionamento',
        viewHours: 'ver horários',
        locationTitle: 'Localização',
        openNow: 'Aberto\u200B agora',
        closedNow: 'Fechado agora',
        locationDescription: 'Aqui tem as unidades deste estabelecimento, e todos os endereços. Você ainda pode traçar a rota pra lá, do jeito que preferir: se é indo com o Google Maps ou pedindo um Uber :)',
        streetPrefix: 'Rua:',
        googleMapsButton: 'Abrir no Maps',
        openUber: 'Abrir no Uber',
        instagramTitle: 'Instagram',
        instagramSubtitle: 'Siga o perfil oficial do estabelecimento:',
        follow: 'Seguir',
        phoneTitle: 'Telefone',
        phonesSubtitle: 'Estes são os contatos oficiais deste local',
        menuTitle: 'Cardápio',
        menuSubtitle: 'Veja o cardápio do estabelecimento',
        menuButton: 'Abrir cardápio',
        websiteTitle: 'Site do local',
        websiteSubtitle: 'Entre no site deste local e confira as informações detalhadas',
        websiteButton: 'Acessar site',
        notesTitle: 'Observação',
        reportProblem: 'Reportar um problema',
        visitModalEnding: ''
      },
      openingHours: {
        title: 'Horários de funcionamento',
        closed: 'Fechado',
        range: 'das {{open}} às {{close}}',
        notProvided: 'Horários não informados.',
        followButton: 'Seguir',
        checkAvailabilityMessage: 'Os horários variam de acordo com a disponibilidade. Verifique no site e na página do Instagram do local para entender como funciona',
        alwaysOpenMessage: 'Este local fica aberto 24h',
        checkAvailabilityLabel: 'Verificar disponibilidade'
      },
      footer: {
        home: 'Home',
        search: 'Buscar',
        about: 'Sobre'
      },
      searchPage: {
        title: 'Busque um lugar',
        subtitle: 'Lembra o nome do lugar de cabeça? Digite o nome dele abaixo que é mais rápido',
        fieldLabel: 'Nome do local:',
        resultsTitle: 'Resultados encontrados',
        placeholder: 'Ex.: Padaria Pão Legal'
      },
      distanceSelect: {
        title: 'Selecione a distância',
        searchButton: 'Buscar'
      },
      nearbyMap: {
        title: 'Mapa de proximidade',
        noneInRadius: 'Nenhum ponto dentro do raio atual.',
        pointsDisplayed: '{{count}} ponto(s) exibidos.',
        you: 'Você'
      },
      neighborhoodList: {
        intro: 'Descubra lugares incríveis neste bairro, escolhendo uma das opções abaixo :)'
      },
      recommendationsOrigin: {
        title: 'De onde vêm essas recomendações?'
      },
      support: {
        title: 'Ajude o site, contribuindo'
      },
      about: {
        title: 'Quem sou?',
        paragraph: 'Página sobre você. Depois a gente traz o layout do Marvel.'
      },
      aboutMe: {
        authorTag: 'Criador do Role Paulista',
        photoAlt: 'Foto de Wallace Baldenebre',
        name: 'Wallace Baldenebre',
        aboutHeading: 'Sobre mim',
        motto: 'Dê um peixe a um homem, e alimente-o por um dia. Ensine um homem a pescar, e alimente-o por toda a vida',
        accordion: {
          aboutLabel: 'Sobre mim',
          whatIsLabel: 'O que é o Rolê Paulista?',
          earnLabel: 'Quanto eu ganho com isso?'
        },
        aboutList: [
          'Mobile Engineering há 10 anos (se minha memória ainda estiver boa)',
          'Bateria, Guitarra e Vocal, fazendo tudo perfeitamente errado e desconexo com a realidade',
          'Cozinhar ao nível de saber fazer um belíssimo panetone salgado',
          'Viajante solo e mochileiro quando sobra uma graninha pra conhecer o mundo',
          'Falo Português (BR), Inglês, Espanhol e Russo (esse aqui ainda sigo estudando... Привет мой друг)',
          'Osasquense que ama São Paulo, e que também xinga a cidade na primeira oportunidade, mas sempre disposto a recomendar o melhor :)'
        ],
        whatIs: [
          'A ideia nasceu de uma planilha, na qual eu registrava os melhores rolês da cidade.',
          'Inicialmente eu preenchia apenas para mim, mas com o tempo, fui compartilhando com amigos e conhecidos, até que se tornou algo maior.',
          'Então, assim nasceu o Rolê Paulista, um site com experiência de app, para facilitar o acesso às melhores experiências da cidade nos quais eu vou visitar',
          'Independente se você é de São Paulo, ou de outro estado, ou de outro país, a experiência é para todos.'
        ],
        earn: [
          'A resposta é bem simples: nada. O Rolê Paulista é um projeto pessoal, feito por paixão e amor pela cidade de São Paulo. Talvez futuramente eu ganhe com publicação ou adsense? Talvez, mas a ideia é que o site SEMPRE seja gratuito, tanto para quem acessa, quanto as postagens que eu faço dos locais.',
          'Eu não vou aceitar receber dinheiro por isso, principalmente para falar bem de um lugar, quero manter a integridade e a autenticidade do conteúdo, indo aos lugares e passando a experiência real para vocês na qual eu tive.',
          'Talvez leve um tempo até que eu suba as postagens no Instagram ou aqui no site, porque atualmente eu sou a equipe de infraestrutura, desenvolvimento, marketing, design e conteúdo, tudo ao mesmo tempo haha, por isso peço desculpas se demorar para atualizar alguma coisa :)'
        ],
        socialHeading: 'Redes sociais',
        socialDescription: 'Me encontre nas redes sociais abaixo :)',
        social: {
          wallace: 'Wallace Baldenebre',
          role: 'Role Paulista',
          linkedin: 'LinkedIn',
          email: 'E-mail'
        },
        roleName: 'Role Paulista',
        bio: 'Desenvolvedor Mobile há mais de 8 anos, especialista em Android e iOS. Apaixonado por tecnologia, viagens, restaurantes e por explorar cada canto novo de São Paulo.'
      },
      travelItinerary: {
        title: 'Roteiros',
        placeholder: 'Roteiros a pé, sugeridos para você conhecer vários lugares próximos, sem precisar gastar com locomoção',
        routeOptionsTitle: 'Opções de Roteiro:',
        listTitle: 'Roteiros',
        viewRoute: 'Ver roteiro',
        cityComingSoon: 'Opa, essa funcionalidade está quase pronta, em breve vai estar disponível pra você usar, fica ligado :)',
        modes: {
          walking: 'Tour a Pé',
          city: 'Tour na Cidade'
        },
        routeOptions: {
          free: 'Gratuito',
          nightlife: 'Balada',
          bars: 'Bares',
          food: 'Gastronômico',
          history: 'História',
          museums: 'Museus',
          more: 'Mais Opções'
        },
        placesCount: '{{count}} lugares',
        tipTitle: 'Dica Importante',
        tipDescription: 'Ao caminhar na rua, fique esperto com o celular: evite mexer muito e não peça ajuda pra desconhecidos. Reparou algo estranho? Entra em um lugar movimentado e ligue 190. Em SP, o básico é: atenção total ao redor e nada de dar bobeira'
      },
      tourType: {
        ALL: 'Tudo',
        FREE: 'Gratuito',
        NIGHTLIFE: 'Balada',
        BARS: 'Bares',
        GASTRONOMIC: 'Gastronômico',
        HISTORY: 'História',
        MUSEUMS: 'Museus',
        ARTISTIC: 'Artístico',
        OTHERS: 'Outros'
      },
      howToRecommend: {
        title: 'Como faço para recomendar um local?'
      },
      placeType: {
        RESTAURANT: 'Restaurantes',
        BARS: 'Bares',
        COFFEES: 'Cafeterias',
        NIGHTLIFE: 'Vida Noturna',
        NATURE: 'Natureza',
        TOURIST_SPOT: 'Pontos\u200B Turísticos',
        FORFUN: 'Diversão',
        STORES: 'Lojas',
        FREE: 'Gratuitos',
        PLEASURE: 'Casa de Prazeres'
      },
      
      placeList: {
        environmentTitle: 'Tipo de ambiente:',
        environmentTitlePlace: 'Tipo de lugar:',
        hoursUnavailable: 'Horário indisponível',
        opensAtHeader: 'Abertura',
        openNow: 'Aberto agora',
        opensSoon: 'Abre em instantes',
        opensTomorrowAt: 'Abre amanhã às {{time}}',
        opensOnAt: 'Abre {{day}} às {{time}}',
        subtitleTemplate: 'Descubra {{article}} {{noun}} com o seu tipo mais perto de você :)',
        article: {
          RESTAURANT: 'o',
          BARS: 'o',
          COFFEES: 'a',
          NIGHTLIFE: 'a',
          NATURE: 'a',
          TOURIST_SPOT: 'o',
          FREE: 'o',
          PLEASURE: 'a'
        },
        noun: {
          RESTAURANT: 'restaurante',
          BARS: 'bar',
          COFFEES: 'cafeteria',
          NIGHTLIFE: 'vida noturna',
          NATURE: 'naturaleza',
          TOURIST_SPOT: 'ponto turístico',
          FREE: 'evento gratuito',
          PLEASURE: 'casa de prazeres'
        }
      }
    }
  },
  es: {
    translation: {
      home: {
        nearMeTitle: 'Cerca de mí',
        nearMeSubtitle: '(mostrando lugares en un radio de {{km}}km cerca de ti)',
        allowLocation: 'Ops, no encontramos tu ubicación...\n\nPara encontrar lugares cerca de ti, haz clic en el botón ci-dessous:',
        allowLocationButton: 'Permitir ubicación',
        loadingCategories: 'Cargando categorías...',
        increaseRadius: 'Aumentar radio',
        neighborhoodsTitle: 'Por barrio',
        neighborhoodsTagline: '¿Estás en uno de estos barrios? ¡Hay cosas buenas cerca!',
        viewMoreNeighborhoods: 'ver más barrios',
        viewMore: 'Más opciones',
        noNearbyResultsRadius: 'No hay nada cerca de ti...\n\nQue tal si cambiamos la distancia para\nlistar los lugares cercanos?',
        locationNotSupported: 'La geolocalización no es compatible con este navegador.',
        locationDeniedInstructions: '',
        outsideGreaterSP: 'Estás fuera de la región del Gran São Paulo. ¿Qué tal visitar la ciudad pronto? :)',
        viewPlace: 'ver local',
        viewPlaces: 'ver locales'
      },
      header: {
        title: 'Role Paulista',
        tagline: 'La mejor recomendación, \na pocos clics de distancia'
      },
      common: {
        back: 'Volver',
        details: 'Saber más',
        selectLanguage: 'Seleccione un idioma',
        changeDistance: 'Aumentar distancia',
        all: 'Todo',
        filter: 'Filtro:',
        close: 'Cerrar',
        loading: 'Cargando…',
        loadError: 'Error al cargar datos.',
        noPlaces: 'No se encontraron lugares.',
        version: 'Versión'
      },
      whereIsToday: { title: '¿Y entonces, dónde es hoy?', subtitle: 'Lista de lugares a los que fui, por categoría. Échale un vistazo ;)', opensToday: 'Abren hoy' },
      list: {
        nameHeader: 'Nombre',
        neighborhoodHeader: 'Barrio',
        seeDetails: 'ver detalles',
        typeHeader: 'Tipo',
        orderNameAsc: 'NOMBRE en orden ascendente A-Z',
        orderNeighborhoodAsc: 'BARRIO en orden ascendente A-Z'
      },
      filters: {
        title: 'Filtros',
        subtitle: 'Ajusta los filtros a continuación para refinar los resultados',
        sortingTitle: 'Ordenación',
        hoursTitle: 'Horarios',
        openNowLabel: 'Abierto ahora',
        openNow: 'Abierto ahora',
        anyHourLabel: 'Cualquier horario',
        anyHour: 'Cualquier horario',
        scheduleTitle: 'Reservar',
        scheduleRequired: 'Réservation requise',
        scheduleNotRequired: 'Réservation non requise',
        anySchedule: 'Peu importe',
        cityTitle: 'Ciudad',
        anyCity: 'N’importe quelle ville',
        priceTitle: 'Prix',
        anyPrice: 'N’importe quel prix',
        button: 'Filtres'
      },
      placeDetail: {
        loading: 'Cargando detalles...',
        notFound: 'Lugar no encontrado.',
        opensMonday: 'abre los lunes',
        opensSunday: 'abre los domingos',
        opensHoliday: 'abre en feriados',
        alreadyVisited: '✓ Fui y recomiendo',
        notVisited: '⚠️ Aún no fui',
        viewHours: 'voir horaires',
        visitModalTitle: 'Sobre los lugares que visité',
        visitModalParagraph: 'Lugar pendiente de visita. La información en esta página proviene de suggestions d\'autres personnes qui s\'y sont rendues et me l\'ont recommandé.',
        visitedModalParagraph: 'Lugar visité. La información en esta página proviene de ce que j\'ai recueilli lors de ma visite, des éléments que j\'ai commandés ou testés, et des informations fournies par les responsables du lieu',
        neverEmphasis: '',
        openNow: 'Abierto\u200B ahora',
        closedNow: 'Cerrado ahora',
        locationDescription: 'Aquí están las unidades de este establecimiento y todas las direcciones. También puedes trazar la ruta como prefieras: con Google Maps o pidiendo un Uber :)',
        websiteTitle: 'Sitio del local',
        websiteSubtitle: 'Visita el sitio de este lugar y consulta la información detallada',
        websiteButton: 'Accéder au site',
        openUber: 'Abrir en Uber',
        instagramTitle: 'Instagram',
        instagramSubtitle: 'Sigue el perfil oficial:',
        follow: 'Seguir',
        phoneTitle: 'Teléfono',
        phonesSubtitle: 'Voici les contacts officiels de cet endroit',
        menuTitle: 'Menu',
        menuSubtitle: 'Voir le menu',
        menuButton: 'Ouvrir menu',
        notesTitle: 'Notas',
        reportProblem: 'Signaler un problème',
        visitModalEnding: ''
      },
      openingHours: { checkAvailabilityMessage: 'Los horarios varían según la disponibilidad. Consulte el sitio web y la página de Instagram del lugar para entender cómo funciona', alwaysOpenMessage: 'Este lugar está abierto las 24 horas', checkAvailabilityLabel: 'Verificar disponibilidad' },
      footer: { home: 'Inicio', search: 'Chercher', about: 'Sobre' },
      searchPage: {
        title: 'Busca un lugar',
        subtitle: '¿Recuerdas el nombre del lugar de memoria? Saisissez son nom ci-dessous, c\'est plus rapide',
        fieldLabel: 'Nom du lieu:',
        resultsTitle: 'Résultats trouvés',
        placeholder: 'Ex. : Boulangerie Pain Legal'
      },
      distanceSelect: { title: 'Seleccione la distancia', searchButton: 'Chercher' },
      nearbyMap: {
        title: 'Mapa cercano',
        noneInRadius: 'Aucun point dans le rayon.',
        pointsDisplayed: '{{count}} point(s) affiché(s).',
        you: 'Vous'
      },
      neighborhoodList: {
        intro: 'Descubre lugares incríveis neste bairro,\nselecione uma das opções ci-dessous :)'
      },
      recommendationsOrigin: { title: '¿De dónde vienen estas recomendaciones?' },
      support: { title: 'Apoya el sitio' },
      about: { title: '¿Quién soy?', paragraph: 'Página sobre ti. Diseño vendrá después.' },
      aboutMe: {
        authorTag: 'Creador de Role Paulista',
        photoAlt: 'Foto de Wallace Baldenebre',
        name: 'Wallace Baldenebre',
        aboutHeading: 'Sobre mí',
        motto: 'Dale un pez a un hombre y lo alimentarás por un día. Enséñale a pescar y lo alimentarás toda la vida',
        accordion: {
          aboutLabel: 'Sobre mí',
          whatIsLabel: '¿Qué es Rolê Paulista?',
          earnLabel: '¿Cuánto gano con esto?'
        },
        aboutList: [
          'Ingenieur Mobile depuis 10 ans (si ma mémoire est encore bonne)',
          'Batterie, guitare et chant, en faisant tout parfaitement mal et déconnecté de la réalité',
          'Cuisiner au point de savoir faire un excellent panettone salé',
          'Voyageur solo et routard quand il y a un peu d’argent pour découvrir le monde',
          'Je parle portugais (BR), anglais, espagnol et russe (celui-ci je continue à l’étudier... Привет мой друг)',
          'D’Osasco, j’aime São Paulo, et je râle aussi sur la ville à la première occasion, mais toujours prêt à recommander le meilleur :)'
        ],
        whatIs: [
          'La idea nació de una hoja de cálculo donde registraba los mejores lugares de la ciudad.',
          'Au début, je le remplissais juste pour moi, mais avec le temps, je l’ai partagé avec des amis et des connaissances, jusqu’à ce que cela devienne quelque chose de plus grand.',
          'C’est ainsi qu’est né Rolê Paulista, un site avec une expérience d’application, pour faciliter l’accès aux meilleures expériences de la ville que je vais visiter.',
          'Peu importe si vous êtes de São Paulo, d’un autre État ou d’un autre pays, l’expérience est pour tous.'
        ],
        earn: [
          'La réponse est simple : rien. Rolê Paulista est un projet personnel, fait par passion et amour pour la ville de São Paulo. Peut-être qu’à l’avenir je gagne avec des publications ou de l’adsense ? Peut-être, mais l’idée est que le site soit TOUJOURS gratuit, tant pour ceux qui y accèdent que pour les publications que je fais sur les lieux.',
          'Je n’accepterai pas d’argent pour cela, surtout pour parler en bien d’un endroit ; je veux garder l’intégrité et l’authenticité du contenu, en allant sur place et en transmettant l’expérience réelle que j’ai eue.',
          'Il se peut que je mette du temps à publier sur Instagram ou sur le site, car actuellement je suis l’équipe infrastructure, développement, marketing, design et contenu, tout en même temps haha, donc désolé si je tarde à mettre à jour quelque chose :)'
        ],
        socialHeading: 'Réseaux sociaux',
        socialDescription: 'Retrouvez-moi sur les réseaux sociaux ci-dessous :)',
        social: {
          wallace: 'Wallace Baldenebre',
          role: 'Role Paulista',
          linkedin: 'LinkedIn',
          email: 'E-mail'
        },
        roleName: 'Role Paulista',
        bio: 'Développeur mobile depuis plus de 8 ans, passionné de technologie et d’exploration de São Paulo.'
      },
      travelItinerary: {
        title: 'Itinéraires',
        placeholder: 'Itinéraires pédestres suggérés pour vous permettre de découvrir plusieurs lieux proches, sans dépenser en transport.',
        routeOptionsTitle: 'Options d\'itinéraire:',
        listTitle: 'Itinéraires',
        viewRoute: 'Voir l’itinéraire',
        modes: {
          walking: 'Tour à pied',
          city: 'Tour en ville'
        },
        routeOptions: {
          free: 'Gratuit',
          nightlife: 'Vie nocturne',
          bars: 'Bars',
          food: 'Gastronomique',
          history: 'Histoire',
          museums: 'Musées',
          more: 'Plus d\'options'
        },
        placesCount: '{{count}} lieux',
        tipTitle: 'Conseil important',
        tipDescription: 'En marchant dans la rue, reste attentif avec ton téléphone: évite de l\'utiliser trop et ne demande pas d\'aide à des inconnus. Tu as remarqué quelque chose d\'étrange? Entre dans un endroit fréquenté et appelle le 190. À SP, la base est: attention totale autour de soi et ne jamais se relâcher'
      },
      tourType: {
        ALL: 'Tout',
        FREE: 'Gratuit',
        NIGHTLIFE: 'Vie nocturne',
        BARS: 'Bars',
        GASTRONOMIC: 'Gastronomique',
        HISTORY: 'Histoire',
        MUSEUMS: 'Musées',
        ARTISTIC: 'Artistique',
        OTHERS: 'Autres'
      },
      howToRecommend: { title: 'Comment recommander un lieu ?' },
      placeType: {
        RESTAURANT: 'Restaurants',
        BARS: 'Bars',
        COFFEES: 'Cafés',
        NIGHTLIFE: 'Vie\u200B nocturne',
        NATURE: 'Naturaleza',
        TOURIST_SPOT: 'Puntos\u200B turísticos',
        FORFUN: 'Diversión',
        STORES: 'Magasins',
        FREE: 'Gratuit',
        PLEASURE: 'Maison de plaisirs'
      }
      ,
      placeList: {
        environmentTitle: 'Tipo de ambiente:',
        environmentTitlePlace: 'Tipo de lugar:',
        hoursUnavailable: 'Horario no disponible',
        opensAtHeader: 'Apertura',
        openNow: 'Abierto ahora',
        opensSoon: 'Abre en instantes',
        opensTomorrowAt: 'Abre mañana a las {{time}}',
        opensOnAt: 'Abre {{day}} a las {{time}}',
        subtitleTemplate: 'Descubre {{article}} {{noun}} de tu tipo, más cerca de ti :)',
        article: {
          RESTAURANT: 'el',
          BARS: 'el',
          COFFEES: 'la',
          NIGHTLIFE: 'la',
          NATURE: 'la',
          TOURIST_SPOT: 'el',
          FREE: 'el',
          PLEASURE: 'la'
        },
        noun: {
          RESTAURANT: 'restaurante',
          BARS: 'bar',
          COFFEES: 'cafetería',
          NIGHTLIFE: 'vida nocturna',
          NATURE: 'naturaleza',
          TOURIST_SPOT: 'lugar turístico',
          FREE: 'evento gratuito',
          PLEASURE: 'casa de placeres'
        }
      }
    }
  },
  fr: {
    translation: {
      home: {
        nearMeTitle: 'Près de moi',
        nearMeSubtitle: '(affichant des lieux dans un rayon de {{km}} km près de vous)',
        allowLocation: 'Oups, nous n\'avons pas trouvé votre position...\n\nPour trouver des lieux près de vous, cliquez sur le bouton ci-dessous :',
        allowLocationButton: 'Autoriser la localisation',
        loadingCategories: 'Chargement des catégories...',
        increaseRadius: 'Augmenter le rayon',
        neighborhoodsTitle: 'Par quartier',
        neighborhoodsTagline: 'Vous êtes dans un de ces quartiers ? Des bons endroits à proximité !',
        viewMoreNeighborhoods: 'voir plus de quartiers',
        viewMore: 'Plus d\'options',
        noNearbyResultsRadius: 'Il n\'y a rien près de vous...\n\nQue diriez-vous de modifier la distance pour\nlister les lieux proches ? ',
        locationNotSupported: 'La géolocalisation n\'est pas prise en charge par ce navigateur.',
        locationDeniedInstructions: '',
        outsideGreaterSP: 'Vous êtes en dehors de la région du Grand São Paulo. Pourquoi ne pas visiter la ville bientôt ? :)',
        viewPlace: 'voir lieu',
        viewPlaces: 'voir lieux'
      },
      header: { title: 'Role Paulista', tagline: 'La meilleure recommandation, à quelques clics de distance' },
      common: {
        back: 'Retour', details: 'En savoir plus', selectLanguage: 'Choisir une langue', changeDistance: 'Augmenter la distance', all: 'Tout', filter: 'Filtre:', close: 'Fermer', loading: 'Chargement…', loadError: 'Erreur de chargement.', noPlaces: 'Aucun lieu trouvé.', version: 'Version'
      },
      whereIsToday: { title: 'Alors, c’est où aujourd’hui ?', subtitle: 'Liste des lieux où je suis allé, par catégorie. Jette un œil ;)', opensToday: 'Ouvrent aujourd\'hui' },
      list: {
        nameHeader: 'Nom', neighborhoodHeader: 'Quartier', variablePlace: 'lieu variable', typeHeader: 'Type', orderNameAsc: 'NOM par ordre croissant A-Z', orderNeighborhoodAsc: 'QUARTIER par ordre croissant A-Z'
      },
      filters: {
        title: 'Filtres',
        subtitle: 'Ajustez les filtres ci-dessous pour affiner les résultats',
        sortingTitle: 'Ordre',
        hoursTitle: 'Horaires',
        openNowLabel: 'Ouvert maintenant',
        openNow: 'Ouvert maintenant',
        anyHourLabel: 'N’importe quel horaire',
        anyHour: 'N’importe quel horaire',
        scheduleTitle: 'Réserver',
        scheduleRequired: 'Réservation requise',
        scheduleNotRequired: 'Réservation non requise',
        anySchedule: 'Peu importe',
        cityTitle: 'Ville',
        anyCity: 'N’importe quelle ville',
        priceTitle: 'Prix',
        anyPrice: 'N’importe quel prix',
        button: 'Filtres'
      },
      placeDetail: {
        loading: 'Chargement des détails...',
        notFound: 'Lieu introuvable.',
        opensMonday: 'ouvert le lundi',
        opensSunday: 'ouvert le dimanche',
        opensHoliday: 'ouvert les jours fériés',
        alreadyVisited: '✓ Déjà visité et recommandé',
        notVisited: '⚠️ Pas encore visité',
        viewHours: 'voir horaires',
        visitModalTitle: 'À propos des lieux visités',
        visitModalParagraph: 'Lieu en attente de visite. Les informations contenues sur cette page proviennent de suggestions d\'autres personnes qui s\'y sont rendues et me l\'ont recommandé.',
        visitedModalParagraph: 'Lieu visité. Les informations contenues sur cette page proviennent de ce que j\'ai recueilli lors de ma visite, des éléments que j\'ai commandés ou testés, et des informations fournies par les responsables du lieu',
        neverEmphasis: '',
        openNow: 'Ouvert\u200B maintenant',
        closedNow: 'Fermé maintenant',
        locationDescription: 'Ici, vous trouverez les unités de cet établissement et toutes les adresses. Vous pouvez aussi tracer la route comme vous préférez : avec Google Maps ou en commandant un Uber :)',
        websiteTitle: 'Sitio del local',
        websiteSubtitle: 'Visita el sitio de este lugar y consulta la información detallada',
        websiteButton: 'Acceder al sitio',
        openUber: 'Abrir en Uber',
        instagramTitle: 'Instagram',
        instagramSubtitle: 'Sigue el perfil oficial:',
        follow: 'Seguir',
        phoneTitle: 'Teléfono',
        phonesSubtitle: 'Voici les contacts officiels de cet endroit',
        menuTitle: 'Menu',
        menuSubtitle: 'Voir le menu',
        menuButton: 'Ouvrir menu',
        notesTitle: 'Notas',
        reportProblem: 'Signaler un problème',
        visitModalEnding: ''
      },
      openingHours: { checkAvailabilityMessage: 'Les horaires varient selon la disponibilité. Consultez le site et la page Instagram du lieu pour en savoir plus', alwaysOpenMessage: 'Cet endroit est ouvert 24h/24', checkAvailabilityLabel: 'Vérifier la disponibilité' },
      footer: { home: 'Accueil', search: 'Chercher', about: 'À propos' },
      searchPage: {
        title: 'Cherchez un lieu',
        subtitle: 'Vous vous souvenez du nom du lieu ? Saisissez son nom ci-dessous, c\'est plus rapide',
        fieldLabel: 'Nom du lieu :',
        resultsTitle: 'Résultats trouvés',
        placeholder: 'Ex. : Boulangerie Pain Legal'
      },
      distanceSelect: { title: 'Sélectionnez la distance', searchButton: 'Chercher' },
      nearbyMap: { title: 'Carte proximité', noneInRadius: 'Aucun point dans le rayon.', pointsDisplayed: '{{count}} point(s) affiché(s).', you: 'Vous' },
      neighborhoodList: {
        intro: 'Découvrez des lieux incroyables dans ce quartier,\nchoisissez l\'une des options ci‑dessous :)'
      },
      recommendationsOrigin: { title: 'De où viennent ces recommandations?' },
      support: { title: 'Apoya el sitio' },
      about: { title: '¿Quién soy?', paragraph: 'Página sobre ti. Diseño vendrá después.' },
      aboutMe: {
        authorTag: 'Creador de Role Paulista',
        photoAlt: 'Foto de Wallace Baldenebre',
        name: 'Wallace Baldenebre',
        aboutHeading: 'Sobre mí',
        motto: 'Dale un pez a un hombre y lo alimentarás por un día. Enséñale a pescar y lo alimentarás toda la vida',
        accordion: {
          aboutLabel: 'Sobre mí',
          whatIsLabel: '¿Qué es Rolê Paulista?',
          earnLabel: '¿Cuánto gano con esto?'
        },
        aboutList: [
          'Ingenieur Mobile depuis 10 ans (si ma mémoire est encore bonne)',
          'Batterie, guitare et chant, en faisant tout parfaitement mal et déconnecté de la réalité',
          'Cuisiner au point de savoir faire un excellent panettone salé',
          'Voyageur solo et routard quand il y a un peu d’argent pour découvrir le monde',
          'Je parle portugais (BR), anglais, espagnol et russe (celui-ci je continue à l’étudier... Привет мой друг)',
          'D’Osasco, j’aime São Paulo, et je râle aussi sur la ville à la première occasion, mais toujours prêt à recommander le meilleur :)'
        ],
        whatIs: [
          'La idea nació de una hoja de cálculo donde registraba los mejores lugares de la ciudad.',
          'Au début, je le remplissais juste pour moi, mais avec le temps, je l’ai partagé avec des amis et des connaissances, jusqu’à ce que cela devienne quelque chose de plus grand.',
          'C’est ainsi qu’est né Rolê Paulista, un site avec une expérience d’application, pour faciliter l’accès aux meilleures expériences de la ville que je vais visiter.',
          'Peu importe si vous êtes de São Paulo, d’un autre État ou d’un autre pays, l’expérience est pour tous.'
        ],
        earn: [
          'La réponse est simple : rien. Rolê Paulista est un projet personnel, fait par passion et amour pour la ville de São Paulo. Peut-être qu’à l’avenir je gagne avec des publications ou de l’adsense ? Peut-être, mais l’idée est que le site soit TOUJOURS gratuit, tant pour ceux qui y accèdent que pour les publications que je fais sur les lieux.',
          'Je n’accepterai pas d’argent pour cela, surtout pour parler en bien d’un endroit ; je veux garder l’intégrité et l’authenticité du contenu, en allant sur place et en transmettant l’expérience réelle que j’ai eue.',
          'Il se peut que je mette du temps à publier sur Instagram ou sur le site, car actuellement je suis l’équipe infrastructure, développement, marketing, design et contenu, tout en même temps haha, donc désolé si je tarde à mettre à jour quelque chose :)'
        ],
        socialHeading: 'Réseaux sociaux',
        socialDescription: 'Retrouvez-moi sur les réseaux sociaux ci-dessous :)',
        social: {
          wallace: 'Wallace Baldenebre',
          role: 'Role Paulista',
          linkedin: 'LinkedIn',
          email: 'E-mail'
        },
        roleName: 'Role Paulista',
        bio: 'Développeur mobile depuis plus de 8 ans, passionné de technologie et d’exploration de São Paulo.'
      },
      travelItinerary: {
        title: 'Itinéraires',
        placeholder: 'Itinéraires pédestres suggérés pour vous permettre de découvrir plusieurs lieux proches, sans dépenser en transport.',
        routeOptionsTitle: 'Options d\'itinéraire:',
        listTitle: 'Itinéraires',
        viewRoute: 'Voir l’itinéraire',
        modes: {
          walking: 'Tour à pied',
          city: 'Tour en ville'
        },
        routeOptions: {
          free: 'Gratuit',
          nightlife: 'Vie nocturne',
          bars: 'Bars',
          food: 'Gastronomique',
          history: 'Histoire',
          museums: 'Musées',
          more: 'Plus d\'options'
        },
        placesCount: '{{count}} lieux',
        tipTitle: 'Conseil important',
        tipDescription: 'En marchant dans la rue, reste attentif avec ton téléphone: évite de l\'utiliser trop et ne demande pas d\'aide à des inconnus. Tu as remarqué quelque chose d\'étrange? Entre dans un endroit fréquenté et appelle le 190. À SP, la base est: attention totale autour de soi et ne jamais se relâcher'
      },
      tourType: {
        ALL: 'Tout',
        FREE: 'Gratuit',
        NIGHTLIFE: 'Vie nocturne',
        BARS: 'Bars',
        GASTRONOMIC: 'Gastronomique',
        HISTORY: 'Histoire',
        MUSEUMS: 'Musées',
        ARTISTIC: 'Artistique',
        OTHERS: 'Autres'
      },
      howToRecommend: { title: 'Comment recommander un lieu ?' },
      placeType: {
        RESTAURANT: 'Restaurants',
        BARS: 'Bars',
        COFFEES: 'Cafés',
        NIGHTLIFE: 'Vie\u200B nocturne',
        NATURE: 'Naturaleza',
        TOURIST_SPOT: 'Puntos\u200B turísticos',
        FORFUN: 'Diversión',
        STORES: 'Magasins',
        FREE: 'Gratuit',
        PLEASURE: 'Maison de plaisirs'
      }
      ,
      placeList: {
        environmentTitle: 'Type d’ambiance :',
        environmentTitlePlace: 'Type de lieu :',
        hoursUnavailable: 'Horaires indisponibles',
        opensAtHeader: 'Ouverture',
        openNow: 'Ouvert maintenant',
        opensSoon: 'Ouvre dans un instant',
        opensTomorrowAt: 'Ouvre demain à {{time}}',
        opensOnAt: 'Ouvre {{day}} à {{time}}',
        subtitleTemplate: 'Découvrez {{article}} {{noun}} de votre type, au plus près de vous :)',
        article: {
          RESTAURANT: 'le',
          BARS: 'le',
          COFFEES: 'le',
          NIGHTLIFE: 'la',
          NATURE: 'la',
          TOURIST_SPOT: 'le',
          FREE: 'le',
          PLEASURE: 'la'
        },
        noun: {
          RESTAURANT: 'restaurant',
          BARS: 'bar',
          COFFEES: 'café',
          NIGHTLIFE: 'vie nocturne',
          NATURE: 'nature',
          TOURIST_SPOT: 'lieu touristique',
          FREE: 'événement gratuit',
          PLEASURE: 'maison de plaisirs'
        }
      }
    }
  },
  ru: {
    translation: {
      home: { nearMeTitle: 'Рядом со мной', nearMeSubtitle: '（показаны места в радиусе {{km}} км рядом с вами)', allowLocation: 'Упс, мы не нашли ваше местоположение...\n\nЧтобы найти места рядом с вами, нажмите кнопку ниже:', allowLocationButton: 'Разрешить геолокацию', loadingCategories: 'Загрузка категорий...', increaseRadius: 'Увеличить радиус', neighborhoodsTitle: 'По район', neighborhoodsTagline: 'Вы в одном из этих районов? Рядом есть интересное!', viewMoreNeighborhoods: 'ещё районы', viewMore: 'Больше вариантов', noNearbyResultsRadius: 'Рядом с вами ничего нет...\n\nКак насчёт изменить расстояние, чтобы\nпоказать ближайшие места?', locationNotSupported: 'Геолокация не поддерживается в этом браузере.', locationDeniedInstructions: '', outsideGreaterSP: 'Вы находитесь вне региона Большого Сан-Паулу. Как насчёт посетить город в ближайшее время? :)', viewPlace: 'посмотреть место', viewPlaces: 'посмотреть места' },
      header: { title: 'Role Paulista', tagline: 'Лучшие рекомендации, в нескольких кликах' },
      common: { back: 'Назад', details: 'Узнать больше', selectLanguage: 'Выберите язык', changeDistance: 'Увеличить расстояние', all: 'Все', filter: 'Фильтр:', close: 'Закрыть', loading: 'Загрузка…', loadError: 'Ошибка загрузки данных.', noPlaces: 'Ничего не найдено.', version: 'Версия' },
      filters: { title: 'Фильтры', subtitle: 'Настройте фильтры ниже, чтобы уточнить результаты', sortingTitle: 'Сортировка', hoursTitle: 'Часы', openNowLabel: 'Открыто сейчас', openNow: 'Открыто сейчас', anyHourLabel: 'Любое время', anyHour: 'Любое время', scheduleTitle: 'Бронирование', scheduleRequired: 'Требуется бронирование', scheduleNotRequired: 'Бронирование не требуется', anySchedule: 'Любой', cityTitle: 'Город', anyCity: 'Любой город', priceTitle: 'Цена', anyPrice: 'Любая цена', button: 'Фильтры' },
      placeDetail: { loading: 'Загрузка деталей...', notFound: 'Место не найдено.', opensMonday: 'открыто по понедельникам', opensSunday: 'открыто по воскресеньям', opensHoliday: 'открыто в праздники', alreadyVisited: '✓ Был и рекомендую', notVisited: '⚠️ Еще не был', viewHours: 'смотреть часы',
        visitModalTitle: 'О посещенных местах',
        visitModalParagraph: 'Место, ожидающее посещения. Информация на этой странице основана на рекомендациях других людей, которые побывали там и посоветовали мне посетить.',
        visitedModalParagraph: 'Место посещено. Информация на этой странице основана на том, что я собрал во время посещения: на том, что я заказывал или пробовал, а также на данных, переданных ответственными за заведение.',
        neverEmphasis: '',
        openNow: 'Открыто сейчас',
        closedNow: 'Закрыто сейчас',
        locationDescription: 'Здесь указаны все филиалы этого места и их адреса. Вы также можете построить маршрут как вам удобнее: с Google Maps или заказав Uber :)',
        websiteTitle: 'Сайт заведения',
        websiteSubtitle: 'Перейдите на сайт этого места и ознакомьтесь с подробной информацией',
        websiteButton: 'Перейти на сайт',
        openUber: 'Открыть в Uber',
        instagramTitle: 'Instagram',
        instagramSubtitle: 'Подписаться на официальный профиль:',
        follow: 'Подписаться',
        phoneTitle: 'Телефон',
        phonesSubtitle: 'Это официальные контакты этого места',
        menuTitle: 'Меню',
        menuSubtitle: 'Посмотреть меню',
        menuButton: 'Открыть меню',
        notesTitle: 'Заметки',
        reportProblem: 'Сообщить о проблеме',
        visitModalEnding: ''
      },
      openingHours: { checkAvailabilityMessage: 'Часы работы зависят от наличия. Проверьте сайт и страницу в Instagram заведения, чтобы узнать подробности', alwaysOpenMessage: 'Это место открыто круглосуточно', checkAvailabilityLabel: 'Проверить доступность' },
      whereIsToday: { title: 'Итак, куда сегодня?', subtitle: 'Список мест, где я был, по категориям. Взгляните ;)', opensToday: 'Открыто сегодня' },
      placeList: {
        environmentTitle: 'Тип заведения:',
        environmentTitlePlace: 'Тип места:',
        hoursUnavailable: 'Часы работы недоступны',
        opensAtHeader: 'Открывается в',
        openNow: 'Открыто сейчас',
        opensSoon: 'Скоро откроется',
        opensTomorrowAt: 'Откроется завтра в {{time}}',
        opensOnAt: 'Откроется {{day}} в {{time}}',
        subtitleTemplate: 'Откройте {{article}} {{noun}} вашего типа рядом с вами :)'
      },
      footer: { home: 'Главная', search: 'Поиск', about: 'О сайте' },
      searchPage: {
        title: 'Найдите место',
        subtitle: 'Помните название места? Введите его ниже — так быстрее',
        fieldLabel: 'Название места:',
        resultsTitle: 'Найденные результаты',
        placeholder: 'Напр.: Пекарня Pao Legal'
      },
      distanceSelect: { title: 'Выберите расстояние', searchButton: 'Искать' },
      nearbyMap: { title: 'Карта рядом', noneInRadius: 'Нет точек в текущем радиусе.', pointsDisplayed: '{{count}} точк(и).', you: 'Вы' },
      neighborhoodList: {
        intro: 'Откройте для себя потрясающие места в этом районе,\nвыберите один из вариантов ниже :)'
      },
      recommendationsOrigin: { title: 'Откуда эти рекомендации?' },
      support: { title: 'Поддержите сайт' },
      about: { title: 'Кто я?', paragraph: 'Пágina sobre ti. Diseño vendrá después.' },
      aboutMe: {
        authorTag: 'Создатель Role Paulista',
        photoAlt: 'Фото Уоллеса Балденебре',
        name: 'Wallace Baldenebre',
        aboutHeading: 'Обо мне',
        motto: 'Дай человеку рыбу — и он будет сыт один день. Научи его ловить рыбу — и он будет сыт всю жизнь',
        accordion: {
          aboutLabel: 'Обо мне',
          whatIsLabel: 'Что такое Rolê Paulista?',
          earnLabel: 'Сколько я на этом зарабатываю?'
        },
        aboutList: [
          'Мобильный инженер уже 10 лет (если память меня не подводит)',
          'Барабаны, гитара и вокал — делаю всё идеально неправильно и совершенно не в такт реальности',
          'Я готовлю на уровне «умею делать отличный солёный панеттоне»',
          'Путешественник-одиночка и бэкпекер, когда удаётся отложить немного денег на мир',
          'Я говорю португальским (BR), английским, испанским и русским (этот всё ещё изучаю... Привет мой друг)',
          'Д’Осаско, я люблю Сан-Паулу, и я ругаю город при первой возможности, но всегда готов рекомендовать лучшее :)'
        ],
        whatIs: [
          'Идея родилась из таблицы, где я записывал лучшие места города.',
          'На początku я заполнял её только для себя, но со временем я начал делиться с друзьями и знакомыми, и это выросло во что-то большее.',
          'Так появился Rolê Paulista — сайт с опытом как у приложения, чтобы упростить доступ к лучшим городским впечатлениям, которые я посещаю.',
          'Неважно, вы из Сан-Паулу, из другого штата или из другого страны — этот опыт для всех.'
        ],
        earn: [
          'Ответ очень простой: ничего. Rolê Paulista — это личный проект, сделанный из любви к городу Сан-Паулу. Возможно, в будущем я что-то заработаю на публикациях или AdSense? Возможно, но идея в том, чтобы сайт ВСЕГДА оставался бесплатным — и для читателей, и для публикаций о местах.',
          'Я не буду принимать деньги за это, особенно чтобы хвалить место за оплату; хочу сохранять честность и подлинность контента, посещая места и делясь реальной опытом.',
          'Возможно, публикации в Instagram или на сайте выходят не так быстро, потому что сейчас я одновременно команда инфраструктуры, разработки, маркетинга, дизайна и контента, так что прошу прощения, если обновления занимают время :)'
        ],
        socialHeading: 'Соцсети',
        socialDescription: 'Найдите меня в соцсетях ниже :)',
        social: {
          wallace: 'Wallace Baldenebre',
          role: 'Role Paulista',
          linkedin: 'LinkedIn',
          email: 'E-mail'
        },
        roleName: 'Role Paulista',
        bio: 'Мобильный разработчик 8+ лет. Люблю технологии, путешествия и исследовать Сан-Паулу.'
      },
      howToRecommend: { title: 'Как порекомендовать место?' },
      travelItinerary: {
        title: 'Маршруты',
        placeholder: 'Пешие маршруты, предлагаемые, чтобы вы могли посетить несколько близлежащих мест, без траты на транспорт.',
        routeOptionsTitle: 'Опции маршрута:',
        listTitle: 'Маршруты',
        viewRoute: 'Видеть маршрут',
        modes: {
          walking: 'Пеший тур',
          city: 'Городской тур'
        },
        routeOptions: {
          free: 'Бесплатно',
          nightlife: 'Ночная жизнь',
          bars: 'Bars',
          food: 'Гастрономия',
          history: 'История',
          museums: 'Музеи',
          more: 'Больше вариантов'
        },
        placesCount: '{{count}} мест',
        tipTitle: 'Важный совет',
        tipDescription: 'Выйдя на улицу, будь внимателен с телефоном: старайся меньше им пользоваться и не проси помощи у незнакомцев. Заметил что-то странное? Зайди в людное место и позвони 190. В СП базовое правило: полная внимательность вокруг и никакой беспечности'
      },
      tourType: {
        ALL: 'Все',
        FREE: 'Бесплатно',
        NIGHTLIFE: 'Ночная жизнь',
        BARS: 'Bars',
        GASTRONOMIC: 'Гастрономия',
        HISTORY: 'История',
        MUSEUMS: 'Музеи',
        ARTISTIC: 'Культурный',
        OTHERS: 'Другое'
      },
    }
  },
  zh: {
    translation: {
      home: { nearMeTitle: '附近', nearMeSubtitle: '（显示你附近 {{km}}km 半径内的地点）', allowLocation: '哎呀，我们未能找到您的位置...\n\n要查找您附近的地点，请点击下方按钮：', allowLocationButton: '允许定位', loadingCategories: '正在加载分类...', increaseRadius: '增加半径', neighborhoodsTitle: '按街区', neighborhoodsTagline: '你在这些街区之一吗？附近有好地方！', viewMoreNeighborhoods: '更多街区', viewMore: '更多选项', noNearbyResultsRadius: '你附近没有找到任何地点...\n\n要不要调整距离，\n以便列出附近的地点？', locationNotSupported: '此浏览器不支持地理定位。', locationDeniedInstructions: '', outsideGreaterSP: '您位于大圣保罗地区之外。要不要考虑近期来这座城市游玩？ :)', viewPlace: '查看地点', viewPlaces: '查看地点列表' },
      header: { title: 'Role Paulista', tagline: '最好的推荐，几次点击即可到达' },
      common: { back: '返回', details: '了解更多', selectLanguage: '选择语言', changeDistance: '增加距离', all: '全部', filter: '筛选:', close: '关闭', loading: '加载中…', loadError: '加载数据出错。', noPlaces: '未找到地点。', version: '版本' },
      filters: { title: '筛选', subtitle: '调整以下筛选以缩小结果范围', sortingTitle: '排序', hoursTitle: '营业时间', openNowLabel: '正在营业', openNow: '正在营业', anyHourLabel: '任意时间', anyHour: '任意时间', scheduleTitle: '预约', scheduleRequired: '需要预约', scheduleNotRequired: '无需预约', anySchedule: '不限', cityTitle: '城市', anyCity: '任意城市', priceTitle: '价格', anyPrice: '任意价格', button: '筛选' },
      placeDetail: { loading: '正在加载详情...', notFound: '未找到地点。', opensMonday: '周一营业', opensSunday: '周日营业', opensHoliday: '节假日营业', alreadyVisited: '✓ 我去过并推荐', notVisited: '⚠️ 还没去过', viewHours: '查看营业时间',
        visitModalTitle: '关于该地点',
        visitModalParagraph: '此地点尚未亲访。页面信息来自已去过并推荐给我的人提供的建议。',
        visitedModalParagraph: '此地点已亲访。页面信息来自我拜访时记录的内容（点过的菜、体验过的项目）以及店家提供的资料。',
        neverEmphasis: '',
        openNow: '正在营业',
        closedNow: '已打烊',
        locationDescription: '这里列出了该场所的所有分店和地址。你可以选择用 Google Maps 导航，或直接叫一辆 Uber :)',
        websiteTitle: '网站',
        websiteSubtitle: '访问此地点的网站查看详细信息',
        websiteButton: '打开网站',
        openUber: '打开 Uber',
        environmentTypeLabel: 'Umgebungstyp:',
        locationTitle: 'Lokation',
        streetPrefix: 'Adresse:',
        googleMapsButton: 'Google Maps',
        instagramTitle: 'Instagram',
        instagramSubtitle: '关注官方账号：',
        follow: '关注',
        phoneTitle: '电话',
        phonesSubtitle: 'These are the official contacts for this place',
        menuTitle: 'Menu',
        menuSubtitle: 'View the venue menu',
        menuButton: 'Open menu',
        notesTitle: '备注',
        reportProblem: '报告问题',
        visitModalEnding: 'I’ll also tell you which places not to visit :)'
      },
      openingHours: { checkAvailabilityMessage: 'The hours may vary. Check the venue website or Instagram page for details.', alwaysOpenMessage: 'This place is open 24/7', checkAvailabilityLabel: 'Check availability' },
      whereIsToday: { title: '那么，今天去哪里？', subtitle: '按类别整理的我去过的地点列表。来看一看 ;)', opensToday: '今日营业' },
      placeList: {
        environmentTitle: '环境类型:',
        environmentTitlePlace: '地点类型:',
        hoursUnavailable: '营业时间不可用',
        opensAtHeader: '开张时间',
        openNow: '正在营业',
        opensTomorrowAt: '明天 {{time}} 开张',
        subtitleTemplate: '发现 {{article}} {{noun}} 与您类型相符，最近的地点 :)'
      },
      about: {
        title: '我是谁？',
        paragraph: '关于页面。稍后提供设计。'
      },
      aboutMe: {
        authorTag: 'Role Paulista 创作者',
        photoAlt: 'Wallace Baldenebre 的照片',
        name: 'Wallace Baldenebre',
        aboutHeading: '关于我',
        motto: '给一个男人一条鱼，他能吃一天。教他钓鱼，他能吃一辈子',
        accordion: {
          aboutLabel: '关于我',
          whatIsLabel: '什么是 Rolê Paulista?',
          earnLabel: '我靠这个赚多少钱？'
        },
        aboutList: [
          'Mobile Engineer for 10 years (if my memory still serves me right)',
          'Drums, guitar and vocals, doing everything perfectly wrong and out of sync with reality',
          'I cook to the level of making an amazing savory panettone',
          'Solo traveler and backpacker whenever there is some extra money to explore the world',
          'I speak Portuguese (BR), English, Spanish and Russian (still studying this one... Привет мой друг)',
          'From Osasco, I love São Paulo, and I also complain about the city at every chance, but always ready to recommend the best :)'
        ],
        whatIs: [
          'The idea started as a spreadsheet where I kept track of the best hangouts in the city.',
          'At first I filled it out only for myself, but over time I started sharing it with friends and acquaintances until it became something bigger.',
          'That is how Rolê Paulista was born: a website with an app-like experience to make it easier to access the best city experiences I visit.',
          'Whether you are from São Paulo, another state, or another country, the experience is for everyone.'
        ],
        earn: [
          'The answer is simple: nothing. Rolê Paulista is a personal project made out of passion and love for São Paulo. Maybe in the future I will earn from publishing or AdSense? Maybe, but the idea is that the site should ALWAYS remain free, both for visitors and for the place posts I publish.',
          'I will not accept money for this, especially to speak well about a place; I want to keep the content authentic and honest by visiting places and sharing the real experience I had.',
          'It may take me some time to post on Instagram or here on the site because I am currently the whole team: infrastructure, development, marketing, design, and content, all at once haha, so sorry if updates take a while :)'
        ],
        socialHeading: '社交网络',
        socialDescription: '你可以在下面的社交平台找到我 :)',
        social: {
          wallace: 'Wallace Baldenebre',
          role: 'Role Paulista',
          linkedin: 'LinkedIn',
          email: 'E-mail'
        },
        roleName: 'Role Paulista',
        bio: 'Mobile developer for 8+ years, Android & iOS specialist. Passionate about tech, travel, food, and exploring every corner of São Paulo.'
      },
      travelItinerary: {
        title: 'Routen',
        placeholder: 'Suggested walking routes so you can visit several nearby places without spending on transport.',
        routeOptionsTitle: 'Route options:',
        listTitle: 'Routes',
        viewRoute: 'Voir l’itinéraire',
        modes: {
          walking: 'Walking Tour',
          city: 'City Tour'
        },
        routeOptions: {
          free: 'Gratuit',
          nightlife: 'Vie nocturne',
          bars: 'Bars',
          food: 'Food',
          history: 'History',
          museums: 'Museums',
          more: 'More Options'
        },
        placesCount: '{{count}} places',
        tipTitle: 'Important Tip',
        tipDescription: 'When walking on the street, stay alert with your phone: avoid using it too much and don\'t ask strangers for help. Notice something strange? Go into a busy place and call 190. In SP, the base is: full attention to your surroundings and no letting your guard down'
      },
      tourType: {
        ALL: 'Tout',
        FREE: 'Gratuit',
        NIGHTLIFE: 'Vie nocturne',
        BARS: 'Bars',
        GASTRONOMIC: 'Gastronomique',
        HISTORY: 'Histoire',
        MUSEUMS: 'Musées',
        ARTISTIC: 'Artistique',
        OTHERS: 'Autres'
      },
      nearbyMap: { title: 'Mapa vicino', noneInRadius: 'Nessun punto nel raggio attuale.', pointsDisplayed: '{{count}} punti mostrati.', you: 'Tu' }
    }
  },
  en: {
    translation: {
      home: {
        nearMeTitle: 'Near Me',
        nearMeSubtitle: '(showing places in a {{km}}km radius near you)',
        allowLocation: 'Oops, we couldn\'t find your location...\n\nTo find places near you, click the button below:',
        allowLocationButton: 'Allow Location',
        loadingCategories: 'Loading categories...',
        increaseRadius: 'Increase radius',
        neighborhoodsTitle: 'By Neighborhood',
        neighborhoodsTagline: 'Are you in one of these neighborhoods? Good stuff nearby!',
        viewMoreNeighborhoods: 'see more neighborhoods',
        viewMore: 'More options',
        noNearbyResultsRadius: 'There\'s nothing near you...\n\nHow about changing the distance to\nlist nearby places?',
        locationNotSupported: 'Geolocation is not supported by this browser.',
        locationDeniedInstructions: '',
        outsideGreaterSP: 'You are outside the Greater São Paulo region. How about visiting the city soon? :)',
        viewPlace: 'see place',
        viewPlaces: 'see places'
      },
      header: {
        title: 'Role Paulista',
        tagline: 'The best recommendation, just a few clicks away'
      },
      common: {
        back: 'Back',
        details: 'Learn more',
        selectLanguage: 'Select a language',
        changeDistance: 'Increase distance',
        all: 'All',
        filter: 'Filter:',
        close: 'Close',
        loading: 'Loading…',
        loadError: 'Error loading data.',
        noPlaces: 'No places found.',
        version: 'Version',
      },
      searchPage: {
        title: 'Search for a place',
        subtitle: 'Remember the place name by heart? Type its name below, it is faster',
        fieldLabel: 'Place name:',
        resultsTitle: 'Results found',
        placeholder: 'E.g.: Pao Legal Bakery'
      },
      whereIsToday: { title: 'So, where are we going today?', subtitle: 'List of places I’ve been, by category. Take a look ;)', opensToday: 'Open today' },
      list: { nameHeader: 'NAME', neighborhoodHeader: 'QUARTIER', typeHeader: 'Type', orderNameAsc: 'NAME in ascending order A-Z', orderNeighborhoodAsc: 'QUARTIER in ascending order A-Z' },
      filters: {
        title: 'Filters',
        subtitle: 'Adjust the filters below to refine results',
        sortingTitle: 'Sorting',
        hoursTitle: 'Hours',
        openNowLabel: 'Open now',
        openNow: 'Open now',
        anyHourLabel: 'Any time',
        anyHour: 'Any time',
        scheduleTitle: 'Reservation',
        scheduleRequired: 'Reservation required',
        scheduleNotRequired: 'No reservation needed',
        anySchedule: 'Any',
        cityTitle: 'City',
        anyCity: 'Any city',
        priceTitle: 'Price',
        anyPrice: 'Any price',
        button: 'Filters'
      },
      placeDetail: {
        loading: 'Loading details...',
        notFound: 'Place not found.',
        opensMonday: 'open on Mondays',
        opensSunday: 'open on Sundays',
        opensHoliday: 'open on holidays',
        alreadyVisited: '✓ I’ve been there and recommend it',
        notVisited: '⚠️ Not visited yet',
        viewHours: 'see hours',
        visitModalTitle: 'About this place',
        visitModalParagraph: 'Place pending a visit. The info here comes from suggestions by people who have been there and told me to check it out.',
        visitedModalParagraph: 'Visited place. The info here comes from what I noted during my visit — things I ordered or tried — plus details shared by the venue.',
        neverEmphasis: '',
        openNow: 'Open now',
        closedNow: 'Closed',
        locationDescription: 'Here are the branches for this venue and their addresses. You can map the route however you like: with Google Maps or by calling an Uber :)',
        websiteTitle: 'Place website',
        websiteSubtitle: 'Visit the venue website for detailed information',
        websiteButton: 'Open website',
        openUber: 'Open in Uber',
        environmentTypeLabel: 'Umgebungstyp:',
        locationTitle: 'Lokation',
        streetPrefix: 'Adresse:',
        googleMapsButton: 'Google Maps',
        instagramTitle: 'Instagram',
        instagramSubtitle: 'Follow the official profile:',
        follow: 'Follow',
        phoneTitle: 'Phone',
        phonesSubtitle: 'These are the official contacts for this place',
        menuTitle: 'Menu',
        menuSubtitle: 'View the venue menu',
        menuButton: 'Open menu',
        notesTitle: 'Notes'
      },
      openingHours: { checkAvailabilityMessage: 'The hours may vary. Check the venue website or Instagram page for details.', alwaysOpenMessage: 'This place is open 24/7', checkAvailabilityLabel: 'Check availability' },
      placeList: {
        environmentTitle: 'Environment type:',
        environmentTitlePlace: 'Place type:',
        hoursUnavailable: 'Hours unavailable',
        opensAtHeader: 'Opens at',
        openNow: 'Open now',
        opensSoon: 'Opens soon',
        opensTomorrowAt: 'Opens tomorrow at {{time}}',
        opensOnAt: 'Opens {{day}} at {{time}}',
        subtitleTemplate: 'Discover {{article}} {{noun}} of your type, closest to you :)'
      },
      about: {
        title: 'Who am I?',
        paragraph: 'Placeholder for the About page. The full layout will arrive soon.'
      },
      aboutMe: {
        authorTag: 'Creator of Role Paulista',
        photoAlt: 'Photo of Wallace Baldenebre',
        name: 'Wallace Baldenebre',
        aboutHeading: 'About me',
        motto: 'Dajem jednomu człowiekowi rybę, a nakarmisz go na jeden dzień. Naucz go łowić, a nakarmisz go na całe życie',
        accordion: {
          aboutLabel: 'About me',
          whatIsLabel: 'What is Rolê Paulista?',
          earnLabel: 'How much do I earn from this?'
        },
        aboutList: [
          'Mobile Engineer for 10 years (if my memory still serves me right)',
          'Drums, guitar and vocals, doing everything perfectly wrong and out of sync with reality',
          'I cook to the level of making an amazing savory panettone',
          'Solo traveler and backpacker whenever there is some extra money to explore the world',
          'I speak Portuguese (BR), English, Spanish and Russian (still studying this one... Привет мой друг)',
          'From Osasco, I love São Paulo, and I also complain about the city at every chance, but always ready to recommend the best :)'
        ],
        whatIs: [
          'The idea started as a spreadsheet where I kept track of the best hangouts in the city.',
          'At first I filled it out only for myself, but over time I started sharing it with friends and acquaintances until it became something bigger.',
          'That is how Rolê Paulista was born: a website with an app-like experience to make it easier to access the best city experiences I visit.',
          'Whether you are from São Paulo, another state, or another country, the experience is for everyone.'
        ],
        earn: [
          'The answer is simple: nothing. Rolê Paulista is a personal project made out of passion and love for São Paulo. Maybe in the future I will earn from publishing or AdSense? Maybe, but the idea is that the site should ALWAYS remain free, both for visitors and for the place posts I publish.',
          'I will not accept money for this, especially to speak well about a place; I want to keep the content authentic and honest by visiting places and sharing the real experience I had.',
          'It may take me some time to post on Instagram or here on the site because I am currently the whole team: infrastructure, development, marketing, design, and content, all at once haha, so sorry if updates take a while :)'
        ],
        socialHeading: 'Social networks',
        socialDescription: 'Find me on the social networks below :)',
        social: {
          wallace: 'Wallace Baldenebre',
          role: 'Role Paulista',
          linkedin: 'LinkedIn',
          email: 'E-mail'
        },
        roleName: 'Role Paulista',
        bio: 'Mobile developer for 8+ years, Android & iOS specialist. Passionate about tech, travel, food, and exploring every corner of São Paulo.'
      },
      travelItinerary: {
        title: 'Routes',
        placeholder: 'Suggested walking routes so you can visit several nearby places without spending on transport.',
        routeOptionsTitle: 'Route options:',
        listTitle: 'Routes',
        viewRoute: 'View route',
        modes: {
          walking: 'Walking Tour',
          city: 'City Tour'
        },
        routeOptions: {
          free: 'Free',
          nightlife: 'Nightlife',
          bars: 'Bars',
          food: 'Food',
          history: 'History',
          museums: 'Museums',
          more: 'More Options'
        },
        placesCount: '{{count}} places',
        tipTitle: 'Important Tip',
        tipDescription: 'When walking on the street, stay alert with your phone: avoid using it too much and don\'t ask strangers for help. Notice something strange? Go into a busy place and call 190. In SP, the base is: full attention to your surroundings and no letting your guard down'
      },
      tourType: {
        ALL: 'Tout',
        FREE: 'Gratuit',
        NIGHTLIFE: 'Vie nocturne',
        BARS: 'Bars',
        GASTRONOMIC: 'Gastronomique',
        HISTORY: 'Histoire',
        MUSEUMS: 'Musées',
        ARTISTIC: 'Artistique',
        OTHERS: 'Autres'
      },
      nearbyMap: { title: 'Mapa vicino', noneInRadius: 'Nessun punto nel raggio attuale.', pointsDisplayed: '{{count}} punti mostrati.', you: 'Tu' }
    }
  }
  ,
  de: {
    translation: {
      home: {
        nearMeTitle: 'In meiner Nähe',
        nearMeSubtitle: '(zeigt Orte in einem Umkreis von {{km}} km in Ihrer Nähe)',
        allowLocation: 'Ups, wir konnten deinen Standort nicht finden...\n\nUm Orte in deiner Nähe zu finden, klicke auf die Schaltfläche unten:',
        allowLocationButton: 'Standort erlauben',
        loadingCategories: 'Kategorien werden geladen...',
        increaseRadius: 'Radius vergrößern',
        neighborhoodsTitle: 'Nach Viertel',
        neighborhoodsTagline: 'Bist du in einem von diesen Vierteln? Gute Orte in der Nähe!',
        viewMoreNeighborhoods: 'mehr Viertel anzeigen',
        viewMore: 'Meer Optionen',
        noNearbyResultsRadius: 'In Ihrer Nähe gibt es nichts...\n\nWie wäre es, die Entfernung zu ändern, um\nnahegelegene Orte aufzulisten?',
        locationNotSupported: 'Geolokalisierung wird von diesem Browser nicht unterstützt.',
        locationDeniedInstructions: '',
        outsideGreaterSP: 'Sie befinden sich außerhalb der Metropolregion São Paulo. Wie wäre es, die Stadt bald zu besuchen? :)',
        viewPlace: 'Ort ansehen',
        viewPlaces: 'Orte ansehen'
      },
      header: {
        title: 'Role Paulista',
        tagline: 'Die beste Empfehlung, nur wenige Klicks entfernt'
      },
      common: {
        back: 'Zurück',
        details: 'Meer info',
        selectLanguage: 'Wählen Sie eine Sprache',
        changeDistance: 'Entfernung erhöhen',
        all: 'Alle',
        filter: 'Filter:',
        close: 'Schließen',
        loading: 'Lädt…',
        loadError: 'Fehler beim Laden der Daten.',
        noPlaces: 'Keine Orte gefunden.',
        version: 'Version'
      },
      filters: {
        title: 'Filter',
        subtitle: 'Passen Sie die Filter unten an, um die Ergebnisse einzugrenzen',
        sortingTitle: 'Sortierung',
        hoursTitle: 'Öffnungszeiten',
        openNowLabel: 'Jetzt geöffnet',
        openNow: 'Jetzt geöffnet',
        anyHourLabel: 'Beliebige Uhrzeit',
        anyHour: 'Beliebige Uhrzeit',
        scheduleTitle: 'Reservierung',
        scheduleRequired: 'Reservierung erforderlich',
        scheduleNotRequired: 'Keine Reservierung erforderlich',
        anySchedule: 'Beliebig',
        cityTitle: 'Stadt',
        anyCity: 'Beliebige Stadt',
        priceTitle: 'Preis',
        anyPrice: 'Beliebiger Preis',
        button: 'Filter'
      },
      list: { nameHeader: 'NAAM', neighborhoodHeader: 'STADTTEIL', typeHeader: 'Typ', orderNameAsc: 'NAAM artan sırada A-Z', orderNeighborhoodAsc: 'STADTTEIL artan sırada A-Z' },
      footer: { home: 'Start', search: 'Chercher', about: 'Über' },
      searchPage: {
        title: 'Cherchez un lieu',
        subtitle: 'Vous vous souvenez du nom du lieu ? Saisissez son nom ci-dessous, c\'est plus rapide',
        fieldLabel: 'Nom du lieu:',
        resultsTitle: 'Résultats trouvés',
        placeholder: 'z. B.: Bäckerei Pao Legal'
      },
      placeDetail: {
        hoursTitle: 'Öffnungszeiten',
        opensMonday: 'öffnet montags',
        opensSunday: 'öffnet sonntags',
        opensHoliday: 'öffnet an Feiertagen',
        alreadyVisited: '✓ Ich war dort und empfehle',
        notVisited: '⚠️ Noch nicht besucht',
        viewHours: 'Öffnungszeiten anzeigen',
        visitModalTitle: 'Über diesen Ort',
        visitModalParagraph: 'Ort noch zu besuchen. Die Informationen auf dieser Seite stammen aus Vorschlägen anderer Personen, die dort waren und mir empfohlen haben, es zu besuchen.',
        visitedModalParagraph: 'Besuchter Ort. Die Informationen auf dieser Seite stammen aus meinen Aufzeichnungen bei meinem Besuch — Dinge, die ich bestellt oder erlebt habe — sowie aus Angaben der Verantwortlichen des Ortes.',
        neverEmphasis: '',
        openNow: 'Jetzt geöffnet',
        closedNow: 'Geschlossen',
        locationDescription: 'Hier findest du die Filialen dieses Ortes und alle Adressen. Du kannst die Route so planen, wie du möchtest: mit Google Maps oder indem du ein Uber bestellst :)',
        websiteTitle: 'Website',
        websiteSubtitle: 'Besuchen Sie die Website dieses Ortes und sehen Sie sich die detaillierten Informationen an',
        websiteButton: 'Website öffnen',
        openUber: 'In Uber öffnen',
        environmentTypeLabel: 'Umgebungstyp:',
        locationTitle: 'Lokation',
        streetPrefix: 'Adresse:',
        googleMapsButton: 'Google Maps',
        instagramTitle: 'Instagram',
        instagramSubtitle: 'Follow the official profile:',
        follow: 'Follow',
        phoneTitle: 'Telefon',
        phonesSubtitle: 'Diese sind die offiziellen Kontakte dieses Ortes',
        menuTitle: 'Menu',
        menuSubtitle: 'View the venue menu',
        menuButton: 'Open menu',
        notesTitle: 'Notizen'
      },
      openingHours: { checkAvailabilityMessage: 'Die Öffnungszeiten variieren je nach Verfügbarkeit. Prüfen Sie die Website und die Instagram-Seite des Ortes, um Details zu erfahren', alwaysOpenMessage: 'Dieser Ort ist 24 Stunden geöffnet', checkAvailabilityLabel: 'Verfügbarkeit prüfen' },
      whereIsToday: { title: 'Und, wo geht’s heute hin?', subtitle: 'Liste der Orte, an denen ich war, nach Kategorien. Schau mal rein ;)', opensToday: 'Heute geöffnet' },
      placeList: {
        environmentTitle: 'Umgebungstyp:',
        environmentTitlePlace: 'Ortstyp:',
        hoursUnavailable: 'Öffnungszeiten nicht verfügbar',
        opensAtHeader: 'Öffnet um',
        openNow: 'Jetzt geöffnet',
        opensTomorrowAt: 'Öffnet morgen um {{time}}',
        subtitleTemplate: 'Entdecke {{article}} {{noun}} in Ihrer Nähe, passend zu Ihrem Stil :)'
      },
      about: {
        title: 'Wer bin ich?',
        paragraph: 'Platzhalter für die „Über“-Seite. Das vollständige Layout folgt später.'
      },
      aboutMe: {
        authorTag: 'Ersteller von Role Paulista',
        photoAlt: 'Foto von Wallace Baldenebre',
        name: 'Wallace Baldenebre',
        aboutHeading: 'Über mich',
        motto: 'Dajem jednomu człowiekowi rybę, a nakarmisz go na jeden dzień. Naucz go łowić, a nakarmisz go na całe życie',
        accordion: {
          aboutLabel: 'Über mich',
          whatIsLabel: 'Was ist Rolê Paulista?',
          earnLabel: 'Wie viel verdiene ich damit?'
        },
        aboutList: [
          'Mobile Engineer al 10 jaar (als mijn geheugen me niet in de steek laat)',
          'Drums, gitaar en zang, alles perfect verkeerd en volledig los van de realiteit',
          'Ik kook op het niveau van een geweldige hartige panettone maken',
          'Solo reiziger en backpacker wanneer er wat geld over is om de wereld te ontdekken',
          'Ik spreek Portugees (BR), Engels, Spaans en Russisch (die laatste leer ik nog... Привет мой друг)',
          'From Osasco, I love São Paulo, and I also complain about the city at every chance, but always ready to recommend the best :)'
        ],
        whatIs: [
          'The idea started as a spreadsheet where I kept track of the best hangouts in the city.',
          'At first I filled it out only for myself, but over time I started sharing it with friends and acquaintances until it became something bigger.',
          'That is how Rolê Paulista was born: a website with an app-like experience to make it easier to access the best city experiences I visit.',
          'Whether you are from São Paulo, another state, or another country, the experience is for everyone.'
        ],
        earn: [
          'The answer is simple: nothing. Rolê Paulista is a personal project made out of passion and love for São Paulo. Maybe in the future I will earn from publishing or AdSense? Maybe, but the idea is that the site should ALWAYS remain free, both for visitors and for the place posts I publish.',
          'I will not accept money for this, especially to speak well about a place; I want to keep the content authentic and honest by visiting places and sharing the real experience I had.',
          'It may take me some time to post on Instagram or here on the site because I am currently the whole team: infrastructure, development, marketing, design, and content, all at once haha, so sorry if updates take a while :)'
        ],
        socialHeading: 'Sociale netwerken',
        socialDescription: 'Vind me op de sociale netwerken hieronder :)',
        social: {
          wallace: 'Wallace Baldenebre',
          role: 'Role Paulista',
          linkedin: 'LinkedIn',
          email: 'E-mail'
        },
        roleName: 'Role Paulista',
        bio: 'Mobiele ontwikkelaar met meer dan 8 jaar ervaring, specialist in Android & iOS. Gepassioneerd over technologie, reizen, restaurants en het verkennen van elk hoekje van São Paulo.'
      },
      travelItinerary: {
        title: 'Routes',
        placeholder: 'Suggested walking routes so you can visit several nearby places without spending on transport.',
        routeOptionsTitle: 'Route options:',
        listTitle: 'Routes',
        viewRoute: 'View route',
        modes: {
          walking: 'Walking Tour',
          city: 'City Tour'
        },
        routeOptions: {
          free: 'Free',
          nightlife: 'Nightlife',
          bars: 'Bars',
          food: 'Food',
          history: 'History',
          museums: 'Museums',
          more: 'More Options'
        },
        placesCount: '{{count}} places',
        tipTitle: 'Important Tip',
        tipDescription: 'When walking on the street, stay alert with your phone: avoid using it too much and don\'t ask strangers for help. Notice something strange? Go into a busy place and call 190. In SP, the base is: full attention to your surroundings and no letting your guard down'
      },
      tourType: {
        ALL: 'Tout',
        FREE: 'Gratuit',
        NIGHTLIFE: 'Vie nocturne',
        BARS: 'Bars',
        GASTRONOMIC: 'Gastronomique',
        HISTORY: 'Histoire',
        MUSEUMS: 'Musées',
        ARTISTIC: 'Artistique',
        OTHERS: 'Autres'
      },
      nearbyMap: { title: 'Mapa vicino', noneInRadius: 'Nessun punto nel raggio attuale.', pointsDisplayed: '{{count}} punti mostrati.', you: 'Tu' }
    }
  },
  ja: {
    translation: {
      home: {
        nearMeTitle: '近くの場所',
        nearMeSubtitle: '（あなたの近く{{km}}kmの範囲内の場所を表示）',
        allowLocation: 'おっと、あなたの位置情報が見つかりませんでした...\n\n近くの場所を見つけるには、下のボタンをクリックしてください：',
        allowLocationButton: '位置情報を許可',
        loadingCategories: 'カテゴリを読み込み中...',
        increaseRadius: '半径を広げる',
        neighborhoodsTitle: '地域別',
        neighborhoodsTagline: 'これらの地域のどれかにいますか？近くに良い場所があります！',
        viewMoreNeighborhoods: 'もっと見る',
        viewMore: 'その他のオプション',
        noNearbyResultsRadius: '近くには何も見つかりませんでした...\n\n距離を変更して、\n近くの場所を表示しませんか？',
        locationNotSupported: 'このブラウザは位置情報をサポートしていません。',
        locationDeniedInstructions: '',
        outsideGreaterSP: 'あなたはグランサンパウロ地域の外にいます。近いうちに街を訪れてみませんか？ :)',
        viewPlace: '場所を見る',
        viewPlaces: '場所を見る'
      },
      header: {
        title: 'Role Paulista',
        tagline: '私が行った場所のおすすめ — 数回のクリックで'
      },
      common: {
        back: '戻る',
        details: '詳しく見る',
        selectLanguage: '言語を選択',
        changeDistance: '距離を増やす',
        all: '全部',
        filter: 'フィルター：',
        close: '閉じる',
        loading: '読み込み中…',
        loadError: 'データの読み込み中にエラーが発生しました。',
        noPlaces: '未見つかりました。',
        version: 'バージョン'
      },
      filters: {
        title: 'フィルター',
        subtitle: '調整以下フィルターで結果を絞り込みます',
        sortingTitle: '並び替え',
        hoursTitle: '営業時間',
        openNowLabel: '営業中',
        openNow: '営業中',
        anyHourLabel: '任意の時間',
        anyHour: '任意の時間',
        scheduleTitle: '予約',
        scheduleRequired: '予約が必要',
        scheduleNotRequired: '予約不要',
        anySchedule: '任意',
        cityTitle: '都市',
        anyCity: '任意の都市',
        priceTitle: '値下げ',
        anyPrice: '任意の値下げ',
        button: 'フィルター'
      },
      list: { nameHeader: '名前', neighborhoodHeader: '地区', typeHeader: '種類', orderNameAsc: '名前 昇順 A-Z', orderNeighborhoodAsc: '地区 昇順 A-Z' },
      footer: { home: 'ホーム', search: '検索', about: '概要' },
      searchPage: {
        title: '場所を探す',
        subtitle: '場所の名前を覚えていますか？下に名前を入力すると早いです',
        fieldLabel: '場所名：',
        resultsTitle: '検索結果',
        placeholder: '例：パダリア パン・レガル'
      },
      placeDetail: {
        hoursTitle: '営業時間',
        opensMonday: '月曜日に営業',
        opensSunday: '日曜日に営業',
        opensHoliday: '祝日に営業',
        alreadyVisited: '✓ 行ったことがありおすすめします',
        notVisited: '⚠️ まだ行っていません',
        viewHours: '営業時間を見る',
        visitModalTitle: 'この場所について',
        visitModalParagraph: '未訪問の場所。 このページの情報は、実際に訪れた他の人々が私に勧めてくれた提案に基づいています。',
        visitedModalParagraph: '訪問済みの場所。 このページの情報は、私が訪問した際に収集した内容（注文した品や体験した項目）および店家からの情報に基づいています。',
        neverEmphasis: '',
        openNow: '営業中',
        closedNow: '閉店',
        websiteTitle: '公式サイト',
        websiteSubtitle: 'この施設のサイトにアクセスして詳細情報をご確認ください',
        websiteButton: '開く',
        openUber: 'Uberで開く',
        environmentTypeLabel: '環境タイプ：',
        locationTitle: '場所',
        locationDescription: 'ここにはこのお店の各店舗（ユニット）と住所がすべて表示されます。Google マップで行くか、Uber を呼ぶか、好きな方法でルートを確認できます :)',
        streetPrefix: '住所：',
        googleMapsButton: 'Google マップで開く',
        instagramTitle: 'Instagram',
        instagramSubtitle: '公式アカウントをフォロー：',
        follow: 'フォロー',
        phoneTitle: '電話',
        phonesSubtitle: 'これらはこの場所の公式連絡先です',
        menuTitle: 'メニュー',
        menuSubtitle: '店舗のメニューを確認',
        menuButton: '開く',
        notesTitle: '備考'
      },
      openingHours: { checkAvailabilityMessage: '営業時間は都度変動します。詳細は施設のウェブサイトおよびInstagramページでご確認ください', alwaysOpenMessage: 'この場所は24時間営業です', checkAvailabilityLabel: '空き状況を確認' },
      whereIsToday: { title: 'で、今日はどこに行く？', subtitle: '行ったことのある場所をカテゴリ別でまとめた一覧です。見てみてね ;)', opensToday: '本日営業' },
      placeList: {
        environmentTitle: '環境タイプ：',
        environmentTitlePlace: '場所タイプ：',
        hoursUnavailable: '営業時間情報なし',
        opensAtHeader: '開店時間',
        openNow: '営業中',
        opensSoon: 'まもなく開店',
        opensTomorrowAt: '明日 {{time}} に開店',
        opensOnAt: '{{day}} {{time}} に開店',
        subtitleTemplate: 'あなたのタイプに合う{{article}} {{noun}}を、いちばん近くで見つけよう :)'
      },
      about: {
        title: '私は誰？',
        paragraph: '概要ページのプレースホルダー。完全なレイアウトは後で追加します。'
      },
      aboutMe: {
        authorTag: 'Role Paulista の作成者',
        photoAlt: 'Wallace Baldenebre の写真',
        name: 'Wallace Baldenebre',
        aboutHeading: '私について',
        motto: 'Dajem jednomu człowiekowi rybę, a nakarmisz go na jeden dzień. Naucz go łowić, a nakarmisz go na całe życie',
        accordion: {
          aboutLabel: '私について',
          whatIsLabel: 'Cos’è Rolê Paulista?',
          earnLabel: 'Quanto guadagno con questo?'
        },
        aboutList: [
          'Mobile Engineer for 10 years (if my memory still serves me right)',
          'Drums, guitar and vocals, doing everything perfectly wrong and out of sync with reality',
          'I cook to the level of making an amazing savory panettone',
          'Solo traveler and backpacker whenever there is some extra money to explore the world',
          'I speak Portuguese (BR), English, Spanish and Russian (still studying this one... Привет мой друг)',
          'From Osasco, I love São Paulo, and I also complain about the city at every chance, but always ready to recommend the best :)'
        ],
        whatIs: [
          'The idea started as a spreadsheet where I kept track of the best hangouts in the city.',
          'At first I filled it out only for myself, but over time I started sharing it with friends and acquaintances until it became something bigger.',
          'That is how Rolê Paulista was born: a website with an app-like experience to make it easier to access the best city experiences I visit.',
          'Whether you are from São Paulo, another state, or another country, the experience is for everyone.'
        ],
        earn: [
          'The answer is simple: nothing. Rolê Paulista is a personal project made out of passion and love for São Paulo. Maybe in the future I will earn from publishing or AdSense? Maybe, but the idea is that the site should ALWAYS remain free, both for visitors and for the place posts I publish.',
          'I will not accept money for this, especially to speak well about a place; I want to keep the content authentic and honest by visiting places and sharing the real experience I had.',
          'It may take me some time to post on Instagram or here on the site because I am currently the whole team: infrastructure, development, marketing, design, and content, all at once haha, so sorry if updates take a while :)'
        ],
        socialHeading: 'ソーシャルネットワーク',
        socialDescription: 'あなたは以下のSNSで見つけることができます :)',
        social: {
          wallace: 'Wallace Baldenebre',
          role: 'Role Paulista',
          linkedin: 'LinkedIn',
          email: 'E-mail'
        },
        roleName: 'Role Paulista',
        bio: 'Mobile developer for 8+ years, Android & iOS specialist. Passionate about tech, travel, food, and exploring every corner of São Paulo.'
      },
      travelItinerary: {
        title: 'ルート',
        placeholder: 'ペーストロート、複数の近くの場所を探索できる徒歩ルートの提案です。',
        routeOptionsTitle: 'ルートオプション：',
        listTitle: 'ルート',
        viewRoute: 'ルートを見る',
        modes: {
          walking: '徒歩ツアー',
          city: 'シティツアー'
        },
        routeOptions: {
          free: '無料',
          nightlife: 'ナイトライフ',
          bars: 'バー',
          food: 'グルメ',
          history: '歴史',
          museums: '博物館',
          more: '他のオプション'
        },
        placesCount: '{{count}} か所',
        tipTitle: '重要提示',
        tipDescription: '街を歩くときは、携帯には注意: 使い過ぎず、知らない人に助けを求めないでください。何かおかしいと感じたら、人が多い場所に入り、190に電話してください。在SPでは基本は、周囲への注意を徹底し、油断しないことです'
      },
      tourType: {
        ALL: '全部',
        FREE: '無料',
        NIGHTLIFE: 'ナイトライフ',
        BARS: 'バー',
        GASTRONOMIC: 'グルメ',
        HISTORY: '歴史',
        MUSEUMS: '博物館',
        ARTISTIC: '芸術',
        OTHERS: 'その他'
      },
      nearbyMap: { title: 'Mapa vicino', noneInRadius: 'Nessun punto nel raggio attuale.', pointsDisplayed: '{{count}} punti mostrati.', you: 'Tu' }
    }
  }
  ,
  ar: {
    translation: {
      header: {
        title: 'Role Paulista',
        tagline: 'افضل توصية، على بعد نقرات قليلة'
      },
      home: {
        nearMeTitle: 'بالقرب مني',
        nearMeSubtitle: '(عرض أماكن ضمن نطاق {{km}} كم بالقرب منك)',
        noNearbyResultsRadius: 'لا يوجد شيء قريب منك...\n\nما رأيك أن نغير المسافة لكي\nنعرض الأماكن القريبة؟',
        neighborhoodsTitle: 'حسب الحي',
        neighborhoodsTagline: 'أنت في أحد هذه الأحياء؟ هناك أشياء جميلة بالقرب منك!'
      },
      filters: {
        title: 'فلاتر',
        sortingTitle: 'الترتيب',
        hoursTitle: 'المواعيد',
        scheduleTitle: 'الحجز',
        cityTitle: 'المدينة',
        priceTitle: 'السعر'
      },
      whereIsToday: {
        title: 'طيب، فين هنروح النهاردة؟',
        subtitle: 'قائمة الأماكن اللي زرتها حسب الفئة، بص عليها ;)',
        opensToday: 'مفتوح اليوم'
      },
      travelItinerary: {
        title: 'المسارات',
        placeholder: 'مسارات مشي مقترحة لتتعرف على عدة أماكن قريبة دون الحاجة للإنفاق على المواصلات',
        routeOptionsTitle: 'خيارات المسار:',
        listTitle: 'المسارات',
        viewRoute: 'عرض المسار',
        modes: {
          walking: 'جولة مشي',
          city: 'جولة في المدينة'
        }
      },
      placeList: {
        environmentTitle: 'نوع الأجواء:',
        environmentTitlePlace: 'نوع المكان:',
        subtitleTemplate: 'اكتشف {{article}} {{noun}} من نفس النوع الأقرب ليك :)'
      }
    }
  },
  it: {
    translation: {
      home: {
        nearMeTitle: 'Vicino a me',
        nearMeSubtitle: '(mostrando luoghi in un raggio di {{km}}km vicino a te)',
        allowLocation: 'Ops, non abbiamo trovato la tua posizione...\n\nPer trovare luoghi vicino a te, clicca sul pulsante qui sotto:',
        allowLocationButton: 'Consenti posizione',
        loadingCategories: 'Caricamento categorie...',
        increaseRadius: 'Aumenta raggio',
        neighborhoodsTitle: 'Per quartiere',
        neighborhoodsTagline: 'Sei in uno di questi quartieri? Ci sono bei posti nelle vicinanze!',
        viewMoreNeighborhoods: 'vedi altri quartieri',
        viewMore: 'Più opzioni',
        noNearbyResultsRadius: 'Non c\'è nulla vicino a te...\n\nChe ne dici di modificare la distanza per\nelencare i luoghi vicini?',
        locationNotSupported: 'La geolocalizzazione non è supportata da questo browser.',
        locationDeniedInstructions: '',
        outsideGreaterSP: 'Sei al di fuori della regione della Grande San Paolo. Che ne dici di visitare la città presto? :)',
        viewPlace: 'vedi luogo',
        viewPlaces: 'vedi luoghi'
      },
      header: { title: 'Role Paulista', tagline: 'La migliore raccomandazione, a pochi clic di distanza' },
      common: {
        back: 'Indietro',
        details: 'Dettagli',
        selectLanguage: 'Seleziona una lingua',
        changeDistance: 'Aumenta distanza',
        all: 'Tutto',
        filter: 'Filtro:',
        close: 'Chiudi',
        loading: 'Caricamento…',
        loadError: 'Errore nel caricamento dei dati.',
        noPlaces: 'Nessun luogo trovato.',
        version: 'Versione'
      },
      filters: {
        title: 'Filtri',
        subtitle: 'Regola i filtri qui sotto per affinare i risultati',
        sortingTitle: 'Ordinamento',
        hoursTitle: 'Orari',
        openNowLabel: 'Aperto ora',
        openNow: 'Aperto ora',
        anyHourLabel: 'Qualsiasi orario',
        anyHour: 'Qualsiasi orario',
        scheduleTitle: 'Prenotazione',
        scheduleRequired: 'Prenotazione richiesta',
        scheduleNotRequired: 'Non serve prenotare',
        anySchedule: 'Qualsiasi',
        cityTitle: 'Città',
        anyCity: 'Qualsiasi città',
        priceTitle: 'Prezzo',
        anyPrice: 'Qualsiasi prezzo',
        button: 'Filtri'
      },
      list: { nameHeader: 'NAZWA', neighborhoodHeader: 'QUARTIERE', typeHeader: 'Tipo', orderNameAsc: 'NAZWA rosnąco A-Z', orderNeighborhoodAsc: 'QUARTIERE rosnąco A-Z' },
      footer: { home: 'Home', search: 'Cerca', about: 'Info' },
      searchPage: {
        title: 'Cerca un luogo',
        subtitle: 'Ricordi il nome del posto a memoria? Digita il nome qui sotto, è più veloce',
        fieldLabel: 'Nome del luogo:',
        resultsTitle: 'Risultati trovati',
        placeholder: 'Es.: Panetteria Pao Legal'
      },
      placeDetail: {
        hoursTitle: 'Orari di apertura',
        opensMonday: 'apre il lunedì',
        opensSunday: 'apre la domenica',
        opensHoliday: 'apre nei giorni festivi',
        alreadyVisited: '✓ Ci sono stato e lo consiglio',
        notVisited: '⚠️ Non ancora visitato',
        viewHours: 'vedi orari',
        visitModalTitle: 'Informazioni sul luogo',
        visitModalParagraph: 'Luogo ancora da visitare. Le informazioni qui provengono dai suggerimenti di chi è già andato e me lo ha consigliato.',
        visitedModalParagraph: 'Luogo visitato. Le informazioni provengono da ciò che ho raccolto durante la visita — cose che ho ordinato o provato — e dai dettagli forniti dai responsabili.',
        neverEmphasis: '',
        openNow: 'Nu open',
        closedNow: 'Chiuso',
        locationDescription: 'Qui trovi le sedi di questo luogo e tutti gli indirizzi. Puoi tracciare il percorso come preferisci: con Google Maps o chiamando un Uber :)',
        websiteTitle: 'Sito del luogo',
        websiteSubtitle: 'Visita il sito di questo luogo e consulta le informazioni dettagliate',
        websiteButton: 'Otwórz stronę',
        instagramTitle: 'Instagram',
        instagramSubtitle: 'Segui il profilo ufficiale:',
        follow: 'Segui',
        phoneTitle: 'Telefon',
        phonesSubtitle: 'Dit sono i contatti ufficiali di questo luogo',
        menuTitle: 'Menu',
        menuSubtitle: 'Guarda il menu del locale',
        menuButton: 'Menüyü aç',
        notesTitle: 'Notlar'
      },
      openingHours: { checkAvailabilityMessage: 'Gli orari variano in base alla disponibilità. Controlla il sito e la pagina Instagram del luogo per maggiori dettagli', alwaysOpenMessage: 'Questo luogo è aperto 24 ore su 24', checkAvailabilityLabel: 'Verifica disponibilità' },
      whereIsToday: { title: 'Allora, dove si va oggi?', subtitle: 'Lista dei luoghi dove sono stato, per categoria. Dai un’occhiata ;)', opensToday: 'Aperti oggi' },
      placeType: {
        RESTAURANT: 'Ristoranti',
        BARS: 'Bar',
        COFFEES: 'Koffiebars',
        NIGHTLIFE: 'Vita notturna',
        NATURE: 'Naturaleza',
        TOURIST_SPOT: 'Punti\u200B turísticos',
        FORFUN: 'Plezier',
        STORES: 'Winkels',
        FREE: 'Gratis',
        PLEASURE: 'Plezierhuis'
      },
      placeList: {
        environmentTitle: 'Tipo di ambiente:',
        environmentTitlePlace: 'Tipo di luogo:',
        hoursUnavailable: 'Orari non disponibili',
        opensAtHeader: 'Apertura',
        openNow: 'Aperto ora',
        opensSoon: 'Apre tra poco',
        opensTomorrowAt: 'Apre domani alle {{time}}',
        opensOnAt: 'Apre {{day}} alle {{time}}',
        subtitleTemplate: 'Scopri {{article}} {{noun}} del tuo tipo più vicino a te :)'
      },
      about: {
        title: 'Chi sono?',
        paragraph: 'Pagina "Chi sono". Il layout completo sarà aggiunto più tardi.'
      },
      aboutMe: {
        authorTag: 'Creatore di Role Paulista',
        photoAlt: 'Foto di Wallace Baldenebre',
        name: 'Wallace Baldenebre',
        aboutHeading: 'Su di me',
        motto: 'Dajem jednomu człowiekowi rybę, a nakarmisz go na jeden dzień. Naucz go łowić, a nakarmisz go na całe życie',
        accordion: {
          aboutLabel: 'Su di me',
          whatIsLabel: 'Cos’è Rolê Paulista?',
          earnLabel: 'Quanto guadagno con questo?'
        },
        aboutList: [
          'Mobile Engineer for 10 years (if my memory still serves me right)',
          'Drums, guitar and vocals, doing everything perfectly wrong and out of sync with reality',
          'I cook to the level of making an amazing savory panettone',
          'Solo traveler and backpacker whenever there is some extra money to explore the world',
          'I speak Portuguese (BR), English, Spanish and Russian (still studying this one... Привет мой друг)',
          'From Osasco, I love São Paulo, and I also complain about the city at every chance, but always ready to recommend the best :)'
        ],
        whatIs: [
          'The idea started as a spreadsheet where I kept track of the best hangouts in the city.',
          'At first I filled it out only for myself, but over time I started sharing it with friends and acquaintances until it became something bigger.',
          'That is how Rolê Paulista was born: a website with an app-like experience to make it easier to access the best city experiences I visit.',
          'Whether you are from São Paulo, another state, or another country, the experience is for everyone.'
        ],
        earn: [
          'The answer is simple: nothing. Rolê Paulista is a personal project made out of passion and love for São Paulo. Maybe in the future I will earn from publishing or AdSense? Maybe, but the idea is that the site should ALWAYS remain free, both for visitors and for the place posts I publish.',
          'I will not accept money for this, especially to speak well about a place; I want to keep the content authentic and honest by visiting places and sharing the real experience I had.',
          'It may take me some time to post on Instagram or here on the site because I am currently the whole team: infrastructure, development, marketing, design, and content, all at once haha, so sorry if updates take a while :)'
        ],
        socialHeading: 'Sociale netwerken',
        socialDescription: 'Vind me op de sociale netwerken hieronder :)',
        social: {
          wallace: 'Wallace Baldenebre',
          role: 'Role Paulista',
          linkedin: 'LinkedIn',
          email: 'E-mail'
        },
        roleName: 'Role Paulista',
        bio: 'Mobiele ontwikkelaar met meer dan 8 jaar ervaring, specialist in Android & iOS. Gepassioneerd over technologie, reizen, restaurants en het verkennen van elk hoekje van São Paulo.'
      },
      travelItinerary: {
        title: 'Routes',
        placeholder: 'Suggested walking routes so you can visit several nearby places without spending on transport.',
        routeOptionsTitle: 'Route options:',
        listTitle: 'Routes',
        viewRoute: 'View route',
        modes: {
          walking: 'Walking Tour',
          city: 'City Tour'
        },
        routeOptions: {
          free: 'Free',
          nightlife: 'Nightlife',
          bars: 'Bars',
          food: 'Food',
          history: 'History',
          museums: 'Museums',
          more: 'More Options'
        },
        placesCount: '{{count}} places',
        tipTitle: 'Important Tip',
        tipDescription: 'When walking on the street, stay alert with your phone: avoid using it too much and don\'t ask strangers for help. Notice something strange? Go into a busy place and call 190. In SP, the base is: full attention to your surroundings and no letting your guard down'
      },
      tourType: {
        ALL: 'Tout',
        FREE: 'Gratuit',
        NIGHTLIFE: 'Vie nocturne',
        BARS: 'Bars',
        GASTRONOMIC: 'Gastronomique',
        HISTORY: 'Histoire',
        MUSEUMS: 'Musées',
        ARTISTIC: 'Artistique',
        OTHERS: 'Autres'
      },
      nearbyMap: { title: 'Mapa vicino', noneInRadius: 'Nessun punto nel raggio attuale.', pointsDisplayed: '{{count}} punti mostrati.', you: 'Tu' }
    }
  },
  nl: {
    translation: {
      home: {
        nearMeTitle: 'Bij mij in de buurt',
        nearMeSubtitle: '(plaatsen tonen binnen een straal van {{km}}km bij jou)',
        allowLocation: 'Oeps, we hebben je locatie niet gevonden...\n\nOm plaatsen bij jou in de buurt te vinden, klik op de knop hieronder:',
        allowLocationButton: 'Locatie toestaan',
        loadingCategories: 'Categorieën laden...',
        increaseRadius: 'Vergroot straal',
        neighborhoodsTitle: 'Per buurt',
        neighborhoodsTagline: 'Ben je in een van deze buurten? Leuke plekken in de buurt!',
        viewMoreNeighborhoods: 'meer buurten bekijken',
        viewMore: 'Meer opties',
        noNearbyResultsRadius: 'Er is niets bij jou in de buurt...\n\nWat dacht je ervan de afstand te wijzigen om\nplaatsen in de buurt te tonen?',
        locationNotSupported: 'Geolocatie wordt niet ondersteund door deze browser.',
        locationDeniedInstructions: '',
        outsideGreaterSP: 'Je bevindt je buiten de regio Groot-São Paulo. Wat dacht je ervan om de stad binnenkort te bezoeken? :)',
        viewPlace: 'bekijk plaats',
        viewPlaces: 'bekijk plaatsen'
      },
      header: { title: 'Role Paulista', tagline: 'De beste aanbeveling, op een paar klikken afstand' },
      common: {
        back: 'Terug',
        details: 'Meer info',
        selectLanguage: 'Selecteer een taal',
        changeDistance: 'Afstand vergroten',
        all: 'Alles',
        filter: 'Filter:',
        close: 'Kapat',
        loading: 'Laden…',
        loadError: 'Fout bij het laden van gegevens.',
        noPlaces: 'Geen plaatsen gevonden.',
        version: 'Versie'
      },
      filters: {
        title: 'Filters',
        subtitle: 'Pas de filters hieronder aan om de resultaten te verfijnen',
        sortingTitle: 'Sorteren',
        hoursTitle: 'Openingstijden',
        openNowLabel: 'Nu open',
        openNow: 'Nu open',
        anyHourLabel: 'Elke tijd',
        anyHour: 'Elke tijd',
        scheduleTitle: 'Reservatie',
        scheduleRequired: 'Reservatie gerekte',
        scheduleNotRequired: 'Geen reservering nodig',
        anySchedule: 'Elke',
        cityTitle: 'Stad',
        anyCity: 'Elke stad',
        priceTitle: 'Prijs',
        anyPrice: 'Elke prijs',
        button: 'Filters'
      },
      list: { nameHeader: 'NAAM', neighborhoodHeader: 'BUURT', typeHeader: 'Type', orderNameAsc: 'NAAM artan sırada A-Z', orderNeighborhoodAsc: 'BUURT artan sırada A-Z' },
      footer: { home: 'Anasayfa', search: 'Zoeken', about: 'Hakkında' },
      searchPage: {
        title: 'Zoek een plek',
        subtitle: 'Herinner je de naam van de plek nog? Typ de naam hieronder, dat is sneller',
        fieldLabel: 'Naam van de plek:',
        resultsTitle: 'Znalezen wyniki',
        placeholder: 'Bijv.: Bakkerij Pao Legal'
      },
      placeDetail: {
        hoursTitle: 'Openingstijden',
        opensMonday: 'open op maandag',
        opensSunday: 'open op zondag',
        opensHoliday: 'open op feestdagen',
        alreadyVisited: '✓ Ik ben hier geweest en beveel het aan',
        notVisited: '⚠️ Nog niet bezocht',
        viewHours: 'bekijk tijden',
        visitModalTitle: 'Over deze locatie',
        visitModalParagraph: 'Locatie wacht op bezoek. De informatie op deze pagina komt van suggestions d\'autres personnes qui s\'y sont rendues et me l\'ont recommandé.',
        visitedModalParagraph: 'Bezocht plaats. De informatie op deze pagina komt uit wat ik verzamelde tijdens mijn bezoek — elementen die ik bestelde of meemaakte — en informatie verstrekt door de verantwoordelijken van de locatie.',
        neverEmphasis: '',
        openNow: 'Nu open',
        closedNow: 'Gesloten',
        locationDescription: 'Hier vind je de vestigingen van deze plek en alle adressen. Je kunt de route nog steeds plannen zoals jij wilt: met Google Maps of door een Uber te bestellen :)',
        websiteTitle: 'Website',
        websiteSubtitle: 'Bezoek de website van deze plek en bekijk de gedetailleerde informatie',
        websiteButton: 'Otwórz stronę',
        instagramTitle: 'Instagram',
        instagramSubtitle: 'Mekanının resmi profilini takip edin:',
        follow: 'Takip et',
        phoneTitle: 'Telefon',
        phonesSubtitle: 'Dit zijn de officiële contactgegevens van deze plek',
        menuTitle: 'Menu',
        menuSubtitle: 'Mekan menüsünü görüntüle',
        menuButton: 'Menüyü aç',
        notesTitle: 'Notlar'
      },
      openingHours: { checkAvailabilityMessage: 'Openingstijden variëren afhankelijk van beschikbaarheid. Controleer de website en de Instagram-pagina van de locatie voor meer informatie', alwaysOpenMessage: 'Deze locatie is 24 uur per dag open', checkAvailabilityLabel: 'Uygunluğu kontrol et' },
      whereIsToday: { title: 'Dus, waar is het vandaag?', subtitle: 'Lijst met plekken waar ik ben geweest, per categorie. Kijk maar ;)', opensToday: 'Vandaag geopend' },
      placeType: {
        RESTAURANT: 'Restaurants',
        RESTAURANTS: 'Restaurants',
        BARS: 'Bars',
        COFFEES: 'Cafes',
        NIGHTLIFE: 'Nachtleven',
        NATURE: 'Natuur',
        TOURIST_SPOT: 'Toeristische plekken',
        FORFUN: 'Plezier',
        STORES: 'Winkels',
        FREE: 'Gratis',
        PLEASURE: 'Plezierhuis'
      },
      placeList: {
        environmentTitle: 'Type omgeving:',
        environmentTitlePlace: 'Type plek:',
        hoursUnavailable: 'Openingstijden niet beschikbaar',
        opensAtHeader: 'Opening',
        openNow: 'Nu open',
        opensSoon: 'Opent zo',
        opensTomorrowAt: 'Opent morgen om {{time}}',
        opensOnAt: 'Opent {{day}} om {{time}}',
        subtitleTemplate: 'Ontdek {{article}} {{noun}} van jouw type, dicht bij jou :)'
      },
      about: {
        title: 'Ben kimim?',
        paragraph: 'Hakkında sayfası yer tutucu. Tam düzen daha sonra eklenecek.'
      },
      aboutMe: {
        authorTag: 'Role Paulista Oluşturucusu',
        photoAlt: 'Wallace Baldenebre fotoğrafı',
        name: 'Wallace Baldenebre',
        aboutHeading: 'Hakkımda',
        motto: 'Dajem jednomu człowiekowi rybę, a nakarmisz go na jeden dzień. Naucz go łowić, a nakarmisz go na całe życie',
        accordion: {
          aboutLabel: 'Hakkımda',
          whatIsLabel: 'Cos’è Rolê Paulista?',
          earnLabel: 'Quanto guadagno con questo?'
        },
        aboutList: [
          'Mobile Engineer for 10 years (if my memory still serves me right)',
          'Drums, guitar and vocals, doing everything perfectly wrong and out of sync with reality',
          'I cook to the level of making an amazing savory panettone',
          'Solo traveler and backpacker whenever there is some extra money to explore the world',
          'I speak Portuguese (BR), English, Spanish and Russian (still studying this one... Привет мой друг)',
          'From Osasco, I love São Paulo, and I also complain about the city at every chance, but always ready to recommend the best :)'
        ],
        whatIs: [
          'The idea started as a spreadsheet where I kept track of the best hangouts in the city.',
          'At first I filled it out only for myself, but over time I started sharing it with friends and acquaintances until it became something bigger.',
          'That is how Rolê Paulista was born: a website with an app-like experience to make it easier to access the best city experiences I visit.',
          'Whether you are from São Paulo, another state, or another country, the experience is for everyone.'
        ],
        earn: [
          'The answer is simple: nothing. Rolê Paulista is a personal project made out of passion and love for São Paulo. Maybe in the future I will earn from publishing or AdSense? Maybe, but the idea is that the site should ALWAYS remain free, both for visitors and for the place posts I publish.',
          'I will not accept money for this, especially to speak well about a place; I want to keep the content authentic and honest by visiting places and sharing the real experience I had.',
          'It may take me some time to post on Instagram or here on the site because I am currently the whole team: infrastructure, development, marketing, design, and content, all at once haha, so sorry if updates take a while :)'
        ],
        socialHeading: 'Sociale netwerki',
        socialDescription: 'Znajdziesz mnie w sieciach społecznych poniżej :)',
        social: {
          wallace: 'Wallace Baldenebre',
          role: 'Role Paulista',
          linkedin: 'LinkedIn',
          email: 'E-mail'
        },
        roleName: 'Role Paulista',
        bio: 'Programista mobile z ponad 8-letnim doświadczeniem, specjalista Android i iOS. Pasjonat technologii, reizen, restaurants en het verkennen van elk hoekje van São Paulo.'
      },
      travelItinerary: {
        title: 'Trasy',
        placeholder: 'Sugerowane trasy piesze, abyś mógł poznać kilka pobliskich miejsc bez wydawania na transport.',
        routeOptionsTitle: 'Opcje trasy:',
        listTitle: 'Trasy',
        viewRoute: 'Zobacz trasę',
        modes: {
          walking: 'Spacer',
          city: 'Wycieczka po mieście'
        },
        routeOptions: {
          free: 'Za darmo',
          nightlife: 'Życie nocne',
          bars: 'Bar',
          food: 'Gastronomia',
          history: 'Storia',
          museums: 'Musea',
          more: 'Więcej opcji'
        },
        placesCount: '{{count}} miejsc',
        tipTitle: 'Ważna wskazówka',
        tipDescription: 'Spacerując po ulicy, stawaj na telefon: używaj go jak najmniej i nie proś o pomoc nieznajomych. Zauważyłeś coś dziwnego? Wejdź do zatłoczonego miejsca i zadzwoń pod 190. W SP podstawowa zasada to: pełna uwaga na otoczenie i żadnego rozkojarzenia'
      },
      tourType: {
        ALL: 'Wszystko',
        FREE: 'Darmowe',
        NIGHTLIFE: 'Życie nocne',
        BARS: 'Bar',
        GASTRONOMIC: 'Gastronomik',
        HISTORY: 'Storia',
        MUSEUMS: 'Musea',
        ARTISTIC: 'Artystyczne',
        OTHERS: 'Inne'
      },
      nearbyMap: { title: 'Mapa w pobliżu', noneInRadius: 'Brak punktów w obecnym promieniu.', pointsDisplayed: '{{count}} punkt(y) wyświetlono.', you: 'Ty' }
    }
  }
  ,
  tr: {
    translation: {
      home: {
        nearMeTitle: 'Yakınımda',
        nearMeSubtitle: '({{km}}km yarıçapında yakınınızdaki yerleri gösterir)',
        allowLocation: 'Ups, konumunu bulamadık...\n\nYakınındaki yerleri bulmak için, aşağıdaki düğmeye tıkla:',
        allowLocationButton: 'Konuma izin ver',
        loadingCategories: 'Kategoriler yükleniyor...',
        increaseRadius: 'Yarıçapı artır',
        neighborhoodsTitle: 'Mahalleye göre',
        neighborhoodsTagline: 'Bu mahallelerden birindeyseniz? Yakında güzel yerler var!',
        viewMoreNeighborhoods: 'daha fazla mahalle göster',
        viewMore: 'Daha fazla seçenek',
        noNearbyResultsRadius: 'W pobliżu nie ma nic...\n\nMoże zmienimy odległość, aby\nwyświetlić pobliskie miejsca?',
        locationNotSupported: 'Tarayıcı bu konum belirleme özelliğini desteklemiyor.',
        locationDeniedInstructions: '',
        outsideGreaterSP: 'Znajdujesz się poza regionem Wielkiego São Paulo. Może odwiedzisz miasto wkrótce? :)',
        viewPlace: 'mekanı gör',
        viewPlaces: 'mekanları gör'
      },
      header: { title: 'Role Paulista', tagline: 'Gittiğim yerlerin en iyi önerisi — birkaç tık uzağında' },
      common: {
        back: 'Geri', details: 'Daha fazla bilgi', selectLanguage: 'Bir dil seçin', changeDistance: 'Mesafeyi artır', all: 'Hepsi', filter: 'Filtre:', close: 'Kapat', loading: 'Yükleniyor…', loadError: 'Veri yüklenirken hata oluştu.', noPlaces: 'Hiç yer bulunamadı.', version: 'Sürüm'
      },
      filters: {
        title: 'Filtreler',
        subtitle: 'Sonuçları daraltmak için aşağıdaki filtreleri ayarlayın',
        sortingTitle: 'Sıralama',
        hoursTitle: 'Saatler',
        openNowLabel: 'Şu an açık',
        openNow: 'Şu an açık',
        anyHourLabel: 'Herhangi bir saat',
        anyHour: 'Herhangi bir saat',
        scheduleTitle: 'Rezervasyon',
        scheduleRequired: 'Rezervasyon gerekli',
        scheduleNotRequired: 'Geen reservering nodig',
        anySchedule: 'Herhangi',
        cityTitle: 'Şehir',
        anyCity: 'Herhangi bir şehir',
        priceTitle: 'Fiyat',
        anyPrice: 'Herhangi bir fiyat',
        button: 'Filtreler'
      },
      list: { nameHeader: 'İSİM', neighborhoodHeader: 'MAHALLE', typeHeader: 'Tür', orderNameAsc: 'İSİM artan sırada A-Z', orderNeighborhoodAsc: 'MAHALLE artan sırada A-Z' },
      footer: { home: 'Anasayfa', search: 'Ara', about: 'Hakkında' },
      searchPage: {
        title: 'Bir yer ara',
        subtitle: 'Mekânın adını aklında tutuyor musun? Aşağıya adını yazmak daha hızlı',
        fieldLabel: 'Nazım yer:',
        resultsTitle: 'Znalezen wyniki',
        placeholder: 'Örn.: Pao Legal Fırını'
      },
      placeDetail: {
        hoursTitle: 'Çalışma saatleri',
        opensMonday: 'pazartesi günü açılır',
        opensSunday: 'pazar günü açılır',
        opensHoliday: 'tatil günlerinde açılır',
        alreadyVisited: '✓ Ziyaret ettim ve tavsiye ediyorum',
        notVisited: '⚠️ Henüz ziyaret etmedim',
        viewHours: 'saatleri göster',
        visitModalTitle: 'Bu mekan hakkında',
        visitModalParagraph: 'Ziyarete açık yer. Bu sayfadaki bilgiler, oraya giden ve ziyaret etmemi tavsiye eden diğer kişilerin önerilerinden alınmıştır.',
        visitedModalParagraph: 'Ziyaret edilen yer. Bu sayfadaki bilgiler, ziyaretim sırasında topladıklarımdan — sipariş ettiğim veya deneyimlediğim öğelerden — ve mekân sorumluları tarafından sağlanan bilgilerden oluşmaktadır.',
        neverEmphasis: '',
        openNow: 'Şu anda açık',
        closedNow: 'Kapalı',
        locationDescription: 'Burada bu mekânın tüm şubelerini ve adreslerini bulabilirsiniz. Ayrıca rotayı istediğiniz gibi çizebilirsiniz: Google Maps ile gidebilir ya da Uber çağırabilirsiniz :)',
        websiteTitle: 'Mekan web sitesi',
        websiteSubtitle: 'Bu mekânın web sitesini ziyaret edin ve detaylı bilgileri kontrol edin',
        websiteButton: 'Otwórz stronę',
        instagramTitle: 'Instagram',
        instagramSubtitle: 'Mekanının resmi profilini takip edin:',
        follow: 'Takip et',
        phoneTitle: 'Telefon',
        phonesSubtitle: 'Bunlar bu yerin resmi iletişim bilgileri',
        menuTitle: 'Menu',
        menuSubtitle: 'Mekan menüsünü görüntüle',
        menuButton: 'Menüyü aç',
        notesTitle: 'Notlar'
      },
      openingHours: { checkAvailabilityMessage: 'Çalışma saatleri kullanılabilirliğe göre değişir. Nasıl işlediğini anlamak için mekanın web sitesini ve Instagram sayfasını kontrol edin', alwaysOpenMessage: 'Bu mekan 24 saat açıktır', checkAvailabilityLabel: 'Uygunluğu kontrol et' },
      whereIsToday: { title: 'Peki, bugün nereye gidiyoruz?', subtitle: 'Gittiğim yerlerin kategoriye göre listesi. Bir göz at ;)' },
      placeType: {
        RESTAURANT: 'Restoranlar',
        BARS: 'Barlar',
        COFFEES: 'Kafeler',
        NIGHTLIFE: 'Gece hayatı',
        NATURE: 'Doğa',
        TOURIST_SPOT: 'Turistik noktalar',
        FORFUN: 'Eğlence',
        STORES: 'Mağazalar',
        FREE: 'Ücretsiz',
        PLEASURE: 'Eğlence evleri'
      },
      placeList: {
        environmentTitle: 'Mekan türü:',
        environmentTitlePlace: 'Yer türü:',
        hoursUnavailable: 'Çalışma saatleri mevcut değil',
        opensAtHeader: 'Açılış',
        openNow: 'Şu an açık',
        opensSoon: 'Yakında açılır',
        opensTomorrowAt: 'Yarın {{time}} açılır',
        opensOnAt: '{{day}} {{time}} açılır',
        subtitleTemplate: 'Sana en yakın, türündeki {{noun}} yerini keşfet :)'
      },
      aboutMe: {
        authorTag: 'Role Paulista Oluşturucusu',
        photoAlt: 'Wallace Baldenebre fotoğrafı',
        name: 'Wallace Baldenebre',
        aboutHeading: 'Hakkımda',
        motto: 'Dajem jednomu człowiekowi rybę, a nakarmisz go na jeden dzień. Naucz go łowić, a nakarmisz go na całe życie',
        accordion: {
          aboutLabel: 'Hakkımda',
          whatIsLabel: 'Cos’è Rolê Paulista?',
          earnLabel: 'Quanto guadagno con questo?'
        },
        aboutList: [
          'Mobile Engineer for 10 years (if my memory still serves me right)',
          'Drums, guitar and vocals, doing everything perfectly wrong and out of sync with reality',
          'I cook to the level of making an amazing savory panettone',
          'Solo traveler and backpacker whenever there is some extra money to explore the world',
          'I speak Portuguese (BR), English, Spanish and Russian (still studying this one... Привет мой друг)',
          'From Osasco, I love São Paulo, and I also complain about the city at every chance, but always ready to recommend the best :)'
        ],
        whatIs: [
          'The idea started as a spreadsheet where I kept track of the best hangouts in the city.',
          'At first I filled it out only for myself, but over time I started sharing it with friends and acquaintances until it became something bigger.',
          'That is how Rolê Paulista was born: a website with an app-like experience to make it easier to access the best city experiences I visit.',
          'Whether you are from São Paulo, another state, or another country, the experience is for everyone.'
        ],
        earn: [
          'The answer is simple: nothing. Rolê Paulista is a personal project made out of passion and love for São Paulo. Maybe in the future I will earn from publishing or AdSense? Maybe, but the idea is that the site should ALWAYS remain free, both for visitors and for the place posts I publish.',
          'I will not accept money for this, especially to speak well about a place; I want to keep the content authentic and honest by visiting places and sharing the real experience I had.',
          'It may take me some time to post on Instagram or here on the site because I am currently the whole team: infrastructure, development, marketing, design, and content, all at once haha, so sorry if updates take a while :)'
        ],
        socialHeading: 'Sociale netwerki',
        socialDescription: 'Znajdziesz mnie w sieciach społecznych poniżej :)',
        social: {
          wallace: 'Wallace Baldenebre',
          role: 'Role Paulista',
          linkedin: 'LinkedIn',
          email: 'E-mail'
        },
        roleName: 'Role Paulista',
        bio: 'Programista mobile z ponad 8-letnim doświadczeniem, specjalista Android i iOS. Pasjonat technologii, reizen, restaurants en het verkennen van elk hoekje van São Paulo.'
      },
      travelItinerary: {
        title: 'Trasy',
        placeholder: 'Sugerowane trasy piesze, abyś mógł poznać kilka pobliskich miejsc bez wydawania na transport.',
        routeOptionsTitle: 'Opcje trasy:',
        listTitle: 'Trasy',
        viewRoute: 'Zobacz trasę',
        modes: {
          walking: 'Spacer',
          city: 'Wycieczka po mieście'
        },
        routeOptions: {
          free: 'Za darmo',
          nightlife: 'Życie nocne',
          bars: 'Bar',
          food: 'Food',
          history: 'History',
          museums: 'Musea',
          more: 'Więcej opcji'
        },
        placesCount: '{{count}} miejsc',
        tipTitle: 'Ważna wskazówka',
        tipDescription: 'When walking on the street, stay alert with your phone: avoid using it too much and don\'t ask strangers for help. Notice something strange? Go into a busy place and call 190. In SP, the base is: full attention to your surroundings and no letting your guard down'
      },
      tourType: {
        ALL: 'Wszystko',
        FREE: 'Darmowe',
        NIGHTLIFE: 'Życie nocne',
        BARS: 'Bar',
        GASTRONOMIC: 'Gastronomik',
        HISTORY: 'Storia',
        MUSEUMS: 'Musea',
        ARTISTIC: 'Artystyczne',
        OTHERS: 'Inne'
      },
      nearbyMap: { title: 'Mapa w pobliżu', noneInRadius: 'Brak punktów w obecnym promieniu.', pointsDisplayed: '{{count}} punkt(y) wyświetlono.', you: 'Ty' }
    }
  },
  pl: {
    translation: {
      home: {
        nearMeTitle: 'W pobliżu',
        nearMeSubtitle: '({{km}}km promieniu w pobliżu Ciebie)',
        allowLocation: 'Ups, nie znaleźliśmy Twojej lokalizacji...\n\nAby znaleźć miejsca w pobliżu, kliknij przycisk poniżej:',
        allowLocationButton: 'Zezwól na lokalizację',
        loadingCategories: 'Ładowanie kategorii...',
        increaseRadius: 'Zwiększ promień',
        neighborhoodsTitle: 'Według dzielnicy',
        neighborhoodsTagline: 'Jesteś w jednym z tych dzielnic? Dobre miejsca w pobliżu!',
        viewMoreNeighborhoods: 'zobacz więcej dzielnic',
        viewMore: 'Więcej opcji',
        noNearbyResultsRadius: 'W pobliżu nie ma nic...\n\nMoże zmienimy odległość, aby\nwyświetlić pobliskie miejsca?',
        locationNotSupported: 'Geolokalizacja nie jest obsługiwana przez tę przeglądarkę.',
        locationDeniedInstructions: '',
        outsideGreaterSP: 'Znajdujesz się poza regionem Wielkiego São Paulo. Może odwiedzisz miasto wkrótce? :)',
        viewPlace: 'zobacz miejsce',
        viewPlaces: 'zobacz miejsca'
      },
      header: { title: 'Role Paulista', tagline: 'Najlepsza rekomendacja — o kilka kliknięć stąd' },
      common: {
        back: 'Wstecz', details: 'Dowiedz się więcej', selectLanguage: 'Wybierz język', changeDistance: 'Zwiększ odległość', all: 'Wszystko', filter: 'Filtr:', close: 'Zamknij', loading: 'Ładowanie…', loadError: 'Błąd ładowania danych.', noPlaces: 'Nie znaleziono miejsc.', version: 'Wersja'
      },
      filters: {
        title: 'Filtry',
        subtitle: 'Dostosuj filtry poniżej, aby zawęzić wyniki',
        sortingTitle: 'Sortowanie',
        hoursTitle: 'Godziny',
        openNowLabel: 'Otwarte teraz',
        openNow: 'Otwarte teraz',
        anyHourLabel: 'Dowolna pora',
        anyHour: 'Dowolna pora',
        scheduleTitle: 'Rezerwacja',
        scheduleRequired: 'Wymagana rezerwacja',
        scheduleNotRequired: 'Rezerwacja nie jest wymagana',
        anySchedule: 'Dowolne',
        cityTitle: 'Miasto',
        anyCity: 'Dowolne miasto',
        priceTitle: 'Cena',
        anyPrice: 'Dowolna cena',
        button: 'Filtry'
      },
      list: { nameHeader: 'NAZWA', neighborhoodHeader: 'DZIELNICA', typeHeader: 'Typ', orderNameAsc: 'NAZWA rosnąco A-Z', orderNeighborhoodAsc: 'DZIELNICA rosnąco A-Z' },
      footer: { home: 'Strona główna', search: 'Szukaj', about: 'O nas' },
      searchPage: {
        title: 'Wyszukaj miejsce',
        subtitle: 'Pamiętasz nazwę miejsca? Wpisz ją poniżej, tak będzie szybciej',
        fieldLabel: 'Nazwa miejsca:',
        resultsTitle: 'Znalezione wyniki',
        placeholder: 'Np.: Piekarnia Pao Legal'
      },
      placeDetail: {
        hoursTitle: 'Godziny otwarcia',
        opensMonday: 'otwarte w poniedziałki',
        opensSunday: 'otwarte w niedziele',
        opensHoliday: 'otwarte w święta',
        alreadyVisited: '✓ Byłem i polecam',
        notVisited: '⚠️ Jeszcze nie odwiedziłem',
        viewHours: 'zobacz godziny',
        visitModalTitle: 'Informacje o miejscu',
        visitModalParagraph: 'Miejsce oczekujące na odwiedzenie. Informacje na tej stronie pochodzą od sugestii innych osób, które tam były i poleciły mi je odwiedzić.',
        visitedModalParagraph: 'Miejsce odwiedzone. Informacje na tej stronie pochodzą z tego, co zebrałem podczas wizyty — rzeczy, które zamówiłem lub przetestowałem — oraz z informacji przekazanych przez osoby odpowiedzialne za miejsce.',
        neverEmphasis: '',
        openNow: 'Otwarte teraz',
        closedNow: 'Zamknięte',
        locationDescription: 'Tutaj znajdziesz wszystkie lokale tego miejsca i ich adresy. Trasę możesz wyznaczyć tak, jak wolisz: w Google Maps albo zamawiając Uber :)',
        websiteTitle: 'Strona miejsca',
        websiteSubtitle: 'Odwiedź stronę tego miejsca i sprawdź szczegółowe informacje',
        websiteButton: 'Otwórz stronę',
        instagramTitle: 'Instagram',
        instagramSubtitle: 'Śledź oficjalny profil lokalu:',
        follow: 'Śledź',
        phoneTitle: 'Telefon',
        phonesSubtitle: 'To są oficjalne kontakty tego miejsca',
        menuTitle: 'Menu',
        menuSubtitle: 'Zobacz menu miejsca',
        menuButton: 'Otwórz menu',
        notesTitle: 'Notatki'
      },
      openingHours: { checkAvailabilityMessage: 'Godziny otwarcia mogą się różnić w zależności od dostępności. Sprawdź stronę i profil na Instagramie, aby dowiedzieć się więcej', alwaysOpenMessage: 'To miejsce jest otwarte 24 godziny na dobę', checkAvailabilityLabel: 'Sprawdź dostępność' },
      whereIsToday: { title: 'Więc, gdzie dziś?', subtitle: 'Lista miejsc, w których byłem, według kategorii. Rzuć okiem ;)' },
      placeType: {
        RESTAURANT: 'Restauracje',
        BARS: 'Bar',
        COFFEES: 'Kafeler',
        NIGHTLIFE: 'Życie nocne',
        NATURE: 'Przyroda',
        TOURIST_SPOT: 'Atrakcje turystyczne',
        FORFUN: 'Dla zabawy',
        STORES: 'Sklepy',
        FREE: 'Darmowe',
        PLEASURE: 'Dom rozkoszy'
      },
      placeList: {
        environmentTitle: 'Typ miejsca:',
        environmentTitlePlace: 'Rodzaj miejsca:',
        hoursUnavailable: 'Godziny niedostępne',
        opensAtHeader: 'Otwarcie',
        openNow: 'Otwarte teraz',
        opensSoon: 'Wkrótce otwarte',
        opensTomorrowAt: 'Otwiera się jutro o {{time}}',
        opensOnAt: 'Otwiera się {{day}} o {{time}}',
        subtitleTemplate: 'Odkryj {{article}} {{noun}} w Twoim stylu, najbliżej Ciebie :)'
      },
      aboutMe: {
        authorTag: 'Twórca Role Paulista',
        photoAlt: 'Zdjęcie Wallace’a Baldenebre',
        name: 'Wallace Baldenebre',
        aboutHeading: 'O mnie',
        motto: 'Daj człowiekowi rybę, a nakarmisz go na jeden dzień. Naucz go łowić, a nakarmisz go na całe życie',
        accordion: {
          aboutLabel: 'O mnie',
          whatIsLabel: 'Cos’è Rolê Paulista?',
          earnLabel: 'Quanto guadagno con questo?'
        },
        aboutList: [
          'Mobile Engineer for 10 years (if my memory still serves me right)',
          'Drums, guitar and vocals, doing everything perfectly wrong and out of sync with reality',
          'I cook to the level of making an amazing savory panettone',
          'Solo traveler and backpacker whenever there is some extra money to explore the world',
          'I speak Portuguese (BR), English, Spanish and Russian (still studying this one... Привет мой друг)',
          'From Osasco, I love São Paulo, and I also complain about the city at every chance, but always ready to recommend the best :)'
        ],
        whatIs: [
          'The idea started as a spreadsheet where I kept track of the best hangouts in the city.',
          'At first I filled it out only for myself, but over time I started sharing it with friends and acquaintances until it became something bigger.',
          'That is how Rolê Paulista was born: a website with an app-like experience to make it easier to access the best city experiences I visit.',
          'Whether you are from São Paulo, another state, or another country, the experience is for everyone.'
        ],
        earn: [
          'The answer is simple: nothing. Rolê Paulista is a personal project made out of passion and love for São Paulo. Maybe in the future I will earn from publishing or AdSense? Maybe, but the idea is that the site should ALWAYS remain free, both for visitors and for the place posts I publish.',
          'I will not accept money for this, especially to speak well about a place; I want to keep the content authentic and honest by visiting places and sharing the real experience I had.',
          'It may take me some time to post on Instagram or here on the site because I am currently the whole team: infrastructure, development, marketing, design, and content, all at once haha, so sorry if updates take a while :)'
        ],
        socialHeading: 'Sociale netwerki',
        socialDescription: 'Znajdziesz mnie w sieciach społecznych poniżej :)',
        social: {
          wallace: 'Wallace Baldenebre',
          role: 'Role Paulista',
          linkedin: 'LinkedIn',
          email: 'E-mail'
        },
        roleName: 'Role Paulista',
        bio: 'Programista mobile z ponad 8-letnim doświadczeniem, specjalista Android i iOS. Pasjonat technologii, reizen, restaurants en het verkennen van elk hoekje van São Paulo.'
      },
      travelItinerary: {
        title: 'Trasy',
        placeholder: 'Sugerowane trasy piesze, abyś mógł poznać kilka pobliskich miejsc bez wydawania na transport.',
        routeOptionsTitle: 'Opcje trasy:',
        listTitle: 'Trasy',
        viewRoute: 'Zobacz trasę',
        modes: {
          walking: 'Spacer',
          city: 'Wycieczka po mieście'
        },
        routeOptions: {
          free: 'Za darmo',
          nightlife: 'Życie nocne',
          bars: 'Bar',
          food: 'Food',
          history: 'History',
          museums: 'Musea',
          more: 'Więcej opcji'
        },
        placesCount: '{{count}} miejsc',
        tipTitle: 'Ważna wskazówka',
        tipDescription: 'When walking on the street, stay alert with your phone: avoid using it too much and don\'t ask strangers for help. Notice something strange? Go into a busy place and call 190. In SP, the base is: full attention to your surroundings and no letting your guard down'
      },
      tourType: {
        ALL: 'Wszystko',
        FREE: 'Darmowe',
        NIGHTLIFE: 'Życie nocne',
        BARS: 'Bar',
        GASTRONOMIC: 'Gastronomik',
        HISTORY: 'Storia',
        MUSEUMS: 'Musea',
        ARTISTIC: 'Artystyczne',
        OTHERS: 'Inne'
      },
      nearbyMap: { title: 'Mapa w pobliżu', noneInRadius: 'Brak punktów w obecnym promieniu.', pointsDisplayed: '{{count}} punkt(y) wyświetlono.', you: 'Ty' }
    }
  }
};

const mergedResources = mergeResourceSets(resources, [placeTypeLabels, environmentLabels, routeOptionLabels, reportProblemLabels, homeNearMeLabels, priceRangeLabels, footerLabels]);

i18n
  .use(initReactI18next)
  .init({
    resources: mergedResources,
    lng: savedLang,
    fallbackLng: 'pt',
    interpolation: { escapeValue: false }
  });

// Persist selection and reflect on <html> when language changes
i18n.on('languageChanged', (lng) => {
  if (typeof window !== 'undefined') {
    try { localStorage.setItem('lang', lng); } catch(_) {}
    document.documentElement.lang = lng;
  }
});

// Ensure document language is set initially
if (typeof window !== 'undefined') {
  try { document.documentElement.lang = i18n.language || savedLang; } catch (_) {}
}

export default i18n;
