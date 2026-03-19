import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { placeTypeLabels } from '@/i18n/extra/placeType';
import { environmentLabels } from '@/i18n/extra/environment';
import { environmentMoreLabels } from '@/i18n/extra/environmentMore';
import { routeOptionLabels } from '@/i18n/extra/routeOptions';
import { reportProblemLabels } from '@/i18n/extra/reportProblem';
import { homeNearMeLabels } from '@/i18n/extra/homeNearMe';
import { priceRangeLabels } from '@/i18n/extra/priceRange';
import { footerLabels } from '@/i18n/extra/footer';
import { restaurantFiltersLabels } from '@/i18n/extra/restaurantFilters';
import { aboutMeDonationLabels } from '@/i18n/extra/aboutMeDonation';

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

function applyPtReferenceFallback(allResources: ResourceMap): ResourceMap {
  const ptBase = allResources?.pt?.translation || {};
  const output: ResourceMap = mergeDeep({}, allResources) as ResourceMap;

  Object.keys(output).forEach((lang) => {
    if (lang === 'pt') return;
    const current = output[lang]?.translation || {};
    output[lang] = {
      translation: mergeDeep(ptBase, current),
    };
  });

  return output;
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
        viewMore: 'Ver mais',
        noNearbyResultsRadius: 'Não há nada próximo a você...\n\nQue tal alterarmos a distância para\nlistarmos os lugares próximos?',
        locationNotSupported: 'Geolocalização não suportada neste navegador.',
        locationDeniedInstructions: '',
        outsideGreaterSP: 'Você está fora da região da Grande SP. Que tal visitar a cidade em breve? :)',
        viewPlace: 'ver local',
        viewPlaces: 'ver locais'
      },
      header: {
        title: 'Role Paulista',
        tagline: 'A melhor recomendação, a poucos cliques de distância'
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
        variablePlace: 'Sem local fixo',
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
        alreadyVisited: '✓ Já fui',
        notVisited: '⚠️ Ainda não fui',
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
        googleMapsButton: 'Abrir no mapa',
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
        visitModalEnding: '',
        whatsappButton: 'WhatsApp',
        onCall: 'Ligar'
      },
      openingHours: {
        title: 'Horários de funcionamento',
        closed: 'Fechado',
        range: 'das {{open}} às {{close}}',
        notProvided: 'Horários não informados.',
        followButton: 'Seguir',
        checkAvailabilityMessage: 'Os horários variam de acordo com a disponibilidade. Verifique no site e na página do Instagram do local para entender como funciona',
        alwaysOpenMessage: 'Este local fica aberto 24h',
        alwaysOpenLabel: 'Sempre aberto',
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
          earnLabel: 'Quanto eu ganho com isso?',
          howToHelpLabel: 'Eu posso contribuir de alguma forma?'
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
        howToHelp: [
          'Se você quer indicar um lugar, me envia uma mensagem no Instagram ou e-mail com as informações do lugar, que eu farei o possível para conhecer e assim, poder ajudar os outros que usam este site!',
          'Se você quiser ajudar contribuindo na continuidade deste projeto, para deixarmos seus rolês em SP cada vez mais leves e práticos, é só apontar a câmera para o QRCode abaixo :)'
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
        createdForYouTitle: 'Roteiros criados pra você :)',
        listTitle: 'Roteiros',
        viewRoute: 'Ver roteiro',
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
          nature: 'Natureza',
          forfun: 'Diversão',
          more: 'Mais Opções'
        },
        placesCount: '{{count}} lugares',
        tipTitle: 'Dica Importante',
        tipDescription: 'Ao caminhar na rua, fique esperto com o celular: evite mexer muito e não peça ajuda pra desconhecidos. Reparou algo estranho? Entra em um lugar movimentado e ligue 190. Em SP, o básico é: atenção total ao redor e nada de dar bobeira',
        loadingPoints: 'Carregando pontos...',
        tourPointsLoadError: 'Ainda não foi possível carregar os pontos do tour.',
        placesYouWillPass: 'Lugares por onde você vai passar',
        routePlacesLoadError: 'Ainda não foi possível carregar os lugares do roteiro.',
        openInGoogleMaps: 'Abrir no Google Maps'
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
        NATURE: 'Natureza',
        FORFUN: 'Diversão',
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
        TOURIST_SPOT: 'Turísticos',
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
        opensAt: 'Abre às {{time}}',
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
          TOURIST_SPOT: 'turístico',
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
        allowLocation: 'Ups, no encontramos tu ubicacion...\n\nPara encontrar lugares cerca de ti, haz clic en el boton de abajo:',
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
        orderNeighborhoodAsc: 'BARRIO en orden ascendente A-Z',
        variablePlace: 'Sin lugar fijo'
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
        scheduleRequired: 'Necesita reserva',
        scheduleNotRequired: 'No necesita reserva',
        anySchedule: 'Cualquiera',
        cityTitle: 'Ciudad',
        anyCity: 'Cualquier ciudad',
        priceTitle: 'Precio',
        anyPrice: 'Cualquier precio',
        button: 'Filtros'
      },
      placeDetail: {
        loading: 'Cargando detalles...',
        notFound: 'Lugar no encontrado.',
        opensMonday: 'abre los lunes',
        opensSunday: 'abre los domingos',
        opensHoliday: 'abre en feriados',
        alreadyVisited: '✓ Ya fui',
        notVisited: '⚠️ Aún no fui',
        viewHours: 'ver horarios',
        visitModalTitle: 'Sobre los lugares que visité',
        visitModalParagraph: 'Lugar pendiente de visita. La información en esta página proviene de sugerencias de otras personas que ya fueron y me lo recomendaron.',
        visitedModalParagraph: 'Lugar visitado. La información en esta página proviene de lo que recopilé durante mi visita, de lo que pedí o probé, y de datos proporcionados por los responsables del lugar.',
        neverEmphasis: '',
        priceLabel: 'Precio:',
        openNow: 'Abierto\u200B ahora',
        closedNow: 'Cerrado ahora',
        locationTitle: 'Ubicación',
        locationDescription: 'Aquí están las unidades de este establecimiento y todas las direcciones. También puedes trazar la ruta como prefieras: con Google Maps o pidiendo un Uber :)',
        websiteTitle: 'Sitio del local',
        websiteSubtitle: 'Visita el sitio de este lugar y consulta la información detallada',
        websiteButton: 'Abrir sitio',
        googleMapsButton: 'Abrir en el mapa',
        openUber: 'Abrir en Uber',
        instagramTitle: 'Instagram',
        instagramSubtitle: 'Sigue el perfil oficial:',
        follow: 'Seguir',
        phoneTitle: 'Teléfono',
        phonesSubtitle: 'Estos son los contactos oficiales de este lugar',
        menuTitle: 'Menu',
        menuSubtitle: 'Ver el menu del local',
        menuButton: 'Abrir menu',
        notesTitle: 'Notas',
        reportProblem: 'Reportar un problema',
        visitModalEnding: '',
        onCall: 'Llamar'
      },
      openingHours: { title: 'Horarios de funcionamiento', checkAvailabilityMessage: 'Los horarios varían según la disponibilidad. Consulte el sitio web y la página de Instagram del lugar para entender cómo funciona', alwaysOpenMessage: 'Este lugar está abierto las 24 horas', alwaysOpenLabel: 'Siempre abierto', checkAvailabilityLabel: 'Verificar disponibilidad' },
      footer: { home: 'Inicio', search: 'Buscar', about: 'Sobre' },
      searchPage: {
        title: 'Busca un lugar',
        subtitle: '¿Recuerdas el nombre del lugar? Escribelo abajo, es mas rapido',
        fieldLabel: 'Nombre del lugar:',
        resultsTitle: 'Resultados encontrados',
        placeholder: 'Ej.: Panaderia Pao Legal'
      },
      distanceSelect: { title: 'Seleccione la distancia', searchButton: 'Buscar' },
      nearbyMap: {
        title: 'Mapa cercano',
        noneInRadius: 'No hay puntos dentro del radio.',
        pointsDisplayed: 'Se muestran {{count}} punto(s).',
        you: 'Tu'
      },
      neighborhoodList: {
        intro: 'Descubre lugares increibles en este barrio,\nselecciona una de las opciones de abajo :)'
      },
      recommendationsOrigin: { title: '¿De dónde vienen estas recomendaciones?' },
      support: { title: 'Apoya el sitio' },
      about: { title: '¿Quién soy?', paragraph: 'Página sobre ti. Diseño vendrá después.' },
      aboutMe: {
        authorTag: 'Créateur de Role Paulista',
        photoAlt: 'Photo de Wallace Baldenebre',
        name: 'Wallace Baldenebre',
        aboutHeading: 'À propos de moi',
        motto: 'Donnez un poisson à un homme et vous le nourrissez un jour. Apprenez-lui à pêcher et vous le nourrissez toute sa vie',
        accordion: {
          aboutLabel: 'À propos de moi',
          whatIsLabel: 'Qu\'est-ce que Rolê Paulista ?',
          earnLabel: 'Combien est-ce que je gagne avec ça ?',
          howToHelpLabel: 'Puis-je contribuer d\'une quelconque manière ?'
        },
        aboutList: [
          'Ingeniero Mobile desde hace 10 anos (si mi memoria aun no me falla)',
          'Bateria, guitarra y voz, haciendolo todo perfectamente mal y fuera de sincronía con la realidad',
          'Cocino al punto de preparar un panettone salado increible',
          'Viajero solo y mochilero siempre que hay un poco de dinero para explorar el mundo',
          'Hablo portugues (BR), ingles, espanol y ruso (este ultimo sigo estudiandolo... Привет мой друг)',
          'De Osasco, amo Sao Paulo y tambien me quejo de la ciudad en cada oportunidad, pero siempre listo para recomendar lo mejor :)'
        ],
        whatIs: [
          'L\'idée est née d\'une feuille de calcul où je notais les meilleurs endroits de la ville.',
          'Al principio la completaba solo para mi, pero con el tiempo la comparti con amigos y conocidos hasta que se transformo en algo mayor.',
          'Asi nacio Role Paulista: un sitio con experiencia de app para facilitar el acceso a las mejores experiencias de la ciudad que visito.',
          'No importa si eres de Sao Paulo, de otro estado o de otro pais, la experiencia es para todos.'
        ],
        earn: [
          'La respuesta es simple: nada. Role Paulista es un proyecto personal hecho con pasion y amor por la ciudad de Sao Paulo. Tal vez en el futuro gane algo con publicaciones o AdSense, pero la idea es que el sitio SIEMPRE sea gratuito.',
          'No aceptare dinero por esto, especialmente para hablar bien de un lugar; quiero mantener el contenido autentico y honesto visitando los lugares y compartiendo la experiencia real.',
          'Puede que tarde en publicar en Instagram o en el sitio porque hoy soy todo el equipo: infraestructura, desarrollo, marketing, diseno y contenido al mismo tiempo. Perdona si algunas actualizaciones tardan :)'
        ],
        howToHelp: [
          'Si vous souhaitez recommander un lieu, envoyez-moi un message sur Instagram ou par e-mail avec les informations du lieu ; je ferai de mon mieux pour le visiter et aider les autres utilisateurs du site.',
          'Si vous souhaitez soutenir ce projet pour rendre vos sorties à SP plus légères et pratiques, pointez simplement la caméra vers le QR code ci-dessous :)'
        ],
        socialHeading: 'Redes sociales',
        socialDescription: 'Encuentrame en las redes sociales de abajo :)',
        social: {
          wallace: 'Wallace Baldenebre',
          role: 'Role Paulista',
          linkedin: 'LinkedIn',
          email: 'E-mail'
        },
        roleName: 'Role Paulista',
        bio: 'Desarrollador mobile desde hace mas de 8 anos, apasionado por tecnologia, viajes, comida y por explorar Sao Paulo.'
      },
      travelItinerary: {
        title: 'Itinerarios',
        placeholder: 'Rutas a pie sugeridas para que puedas visitar varios lugares cercanos sin gastar en transporte.',
        routeOptionsTitle: 'Opciones de ruta:',
        createdForYouTitle: 'Itinerarios creados para ti :)',
        listTitle: 'Itinerarios',
        viewRoute: 'Ver itinerario',
        modes: {
          walking: 'Recorrido a pie',
          city: 'Recorrido por la ciudad'
        },
        routeOptions: {
          free: 'Gratis',
          nightlife: 'Vida nocturna',
          bars: 'Bares',
          food: 'Gastronomico',
          history: 'Historia',
          museums: 'Museos',
          nature: 'Naturaleza',
          forfun: 'Diversión',
          more: 'Mas opciones'
        },
        placesCount: '{{count}} lugares',
        tipTitle: 'Consejo importante',
        tipDescription: 'Al caminar por la calle, mantente atento con el celular: evita usarlo demasiado y no pidas ayuda a desconocidos. ¿Notaste algo extraño? Entra en un lugar concurrido y llama al 190. En SP, lo básico es: atención total a tu alrededor y nada de bajar la guardia',
        loadingPoints: 'Cargando puntos...',
        tourPointsLoadError: 'Todavía no fue posible cargar los puntos del tour.',
        placesYouWillPass: 'Lugares por los que vas a pasar',
        routePlacesLoadError: 'Todavía no fue posible cargar los lugares del recorrido.',
        openInGoogleMaps: 'Abrir en Google Maps'
      },
      tourType: {
        ALL: 'Todo',
        FREE: 'Gratis',
        NIGHTLIFE: 'Vida nocturna',
        BARS: 'Bares',
        GASTRONOMIC: 'Gastronomico',
        HISTORY: 'Historia',
        MUSEUMS: 'Museos',
        ARTISTIC: 'Artistico',
        NATURE: 'Nature',
        FORFUN: 'Divertissement',
        OTHERS: 'Otros'
      },
      howToRecommend: { title: 'Como recomendar un lugar?' },
      placeType: {
        RESTAURANT: 'Restaurantes',
        BARS: 'Bares',
        COFFEES: 'Cafeterias',
        NIGHTLIFE: 'Vida nocturna',
        NATURE: 'Naturaleza',
        TOURIST_SPOT: 'Turísticos',
        FORFUN: 'Diversión',
        STORES: 'Tiendas',
        FREE: 'Gratis',
        PLEASURE: 'Casa de placeres'
      }
      ,
      placeList: {
        environmentTitle: 'Tipo de ambiente:',
        environmentTitlePlace: 'Tipo de lugar:',
        hoursUnavailable: 'Horario no disponible',
        opensAtHeader: 'Apertura',
        opensAt: 'Abre a las {{time}}',
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
          TOURIST_SPOT: 'turístico',
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
        nameHeader: 'Nom', neighborhoodHeader: 'Quartier', variablePlace: 'Sans lieu fixe', typeHeader: 'Type', orderNameAsc: 'NOM par ordre croissant A-Z', orderNeighborhoodAsc: 'QUARTIER par ordre croissant A-Z'
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
        alreadyVisited: '✓ Deja visite',
        notVisited: '⚠️ Pas encore alle',
        hoursTitle: 'Horaires de fonctionnement',
        viewHours: 'voir horaires',
        visitModalTitle: 'À propos des lieux visités',
        visitModalParagraph: 'Lieu en attente de visite. Les informations contenues sur cette page proviennent de suggestions d\'autres personnes qui s\'y sont rendues et me l\'ont recommandé.',
        visitedModalParagraph: 'Lieu visité. Les informations contenues sur cette page proviennent de ce que j\'ai recueilli lors de ma visite, des éléments que j\'ai commandés ou testés, et des informations fournies par les responsables du lieu',
        neverEmphasis: '',
        priceLabel: 'Prix :',
        openNow: 'Ouvert\u200B maintenant',
        closedNow: 'Fermé maintenant',
        locationTitle: 'Localisation',
        locationDescription: 'Ici, vous trouverez les unités de cet établissement et toutes les adresses. Vous pouvez aussi tracer la route comme vous préférez : avec Google Maps ou en commandant un Uber :)',
        websiteTitle: 'Site du lieu',
        websiteSubtitle: 'Visitez le site de ce lieu et consultez les informations détaillées',
        websiteButton: 'Accéder au site',
        googleMapsButton: 'Ouvrir sur la carte',
        openUber: 'Ouvrir dans Uber',
        instagramTitle: 'Instagram',
        instagramSubtitle: 'Suivez le profil officiel :',
        follow: 'Suivre',
        phoneTitle: 'Téléphone',
        phonesSubtitle: 'Voici les contacts officiels de cet endroit',
        menuTitle: 'Menu',
        menuSubtitle: 'Voir le menu',
        menuButton: 'Ouvrir menu',
        notesTitle: 'Notes',
        reportProblem: 'Signaler un problème',
        visitModalEnding: '',
        onCall: 'Appeler'
      },
      openingHours: { title: 'Horaires de fonctionnement', checkAvailabilityMessage: 'Les horaires varient selon la disponibilité. Consultez le site et la page Instagram du lieu pour en savoir plus', alwaysOpenMessage: 'Cet endroit est ouvert 24h/24', alwaysOpenLabel: 'Toujours ouvert', checkAvailabilityLabel: 'Vérifier la disponibilité' },
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
      support: { title: 'Soutenez le site' },
      about: { title: 'Qui suis-je ?', paragraph: 'Page à propos. La version complète du design arrive bientôt.' },
      aboutMe: {
        authorTag: 'Creador de Role Paulista',
        photoAlt: 'Foto de Wallace Baldenebre',
        name: 'Wallace Baldenebre',
        aboutHeading: 'Sobre mí',
        motto: 'Dale un pez a un hombre y lo alimentarás por un día. Enséñale a pescar y lo alimentarás toda la vida',
        accordion: {
          aboutLabel: 'Sobre mí',
          whatIsLabel: '¿Qué es Rolê Paulista?',
          earnLabel: '¿Cuánto gano con esto?',
          howToHelpLabel: '¿Puedo contribuir de alguna manera?'
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
        howToHelp: [
          'Si quieres recomendar un lugar, envíame un mensaje por Instagram o por correo electrónico con la información del sitio; haré lo posible por visitarlo y así ayudar a otras personas que usan este sitio.',
          'Si quieres ayudar a mantener este proyecto para que tus planes en SP sean cada vez más ligeros y prácticos, solo apunta la cámara al código QR de abajo :)'
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
        createdForYouTitle: 'Itinéraires créés pour toi :)',
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
          nature: 'Nature',
          forfun: 'Divertissement',
          more: 'Plus d\'options'
        },
        placesCount: '{{count}} lieux',
        tipTitle: 'Conseil important',
        tipDescription: 'En marchant dans la rue, reste attentif avec ton téléphone: évite de l\'utiliser trop et ne demande pas d\'aide à des inconnus. Tu as remarqué quelque chose d\'étrange? Entre dans un endroit fréquenté et appelle le 190. À SP, la base est: attention totale autour de soi et ne jamais se relâcher',
        loadingPoints: 'Chargement des points...',
        tourPointsLoadError: 'Il n\'a pas encore été possible de charger les points du tour.',
        placesYouWillPass: 'Lieux par lesquels tu vas passer',
        routePlacesLoadError: 'Il n\'a pas encore été possible de charger les lieux de l\'itinéraire.',
        openInGoogleMaps: 'Ouvrir dans Google Maps'
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
        NATURE: 'Nature',
        FORFUN: 'Divertissement',
        OTHERS: 'Autres'
      },
      howToRecommend: { title: 'Comment recommander un lieu ?' },
      placeType: {
        RESTAURANT: 'Restaurants',
        BARS: 'Bars',
        COFFEES: 'Cafés',
        NIGHTLIFE: 'Vie\u200B nocturne',
        NATURE: 'Naturaleza',
        TOURIST_SPOT: 'Touristiques',
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
        opensAt: 'Ouvre à {{time}}',
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
          TOURIST_SPOT: 'touristique',
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
      list: {
        orderNameAsc: 'ИМЯ в порядке возрастания A-Z',
        orderNeighborhoodAsc: 'РАЙОН в порядке возрастания A-Z',
        variablePlace: 'Без фиксированного места'
      },
      filters: { title: 'Фильтры', subtitle: 'Настройте фильтры ниже, чтобы уточнить результаты', sortingTitle: 'Сортировка', hoursTitle: 'Часы', openNowLabel: 'Открыто сейчас', openNow: 'Открыто сейчас', anyHourLabel: 'Любое время', anyHour: 'Любое время', scheduleTitle: 'Бронирование', scheduleRequired: 'Требуется бронирование', scheduleNotRequired: 'Бронирование не требуется', anySchedule: 'Любой', cityTitle: 'Город', anyCity: 'Любой город', priceTitle: 'Цена', anyPrice: 'Любая цена', button: 'Фильтры' },
      placeDetail: { loading: 'Загрузка деталей...', notFound: 'Место не найдено.', opensMonday: 'открыто по понедельникам', opensSunday: 'открыто по воскресеньям', opensHoliday: 'открыто в праздники', alreadyVisited: '✓ Уже был', notVisited: '⚠️ Еще не был', hoursTitle: 'Часы работы', viewHours: 'смотреть часы',
        visitModalTitle: 'О посещенных местах',
        visitModalParagraph: 'Место, ожидающее посещения. Информация на этой странице основана на рекомендациях других людей, которые побывали там и посоветовали мне посетить.',
        visitedModalParagraph: 'Место посещено. Информация на этой странице основана на том, что я собрал во время посещения: на том, что я заказывал или пробовал, а также на данных, переданных ответственными за заведение.',
        neverEmphasis: '',
        priceLabel: 'Цена:',
        openNow: 'Открыто сейчас',
        closedNow: 'Закрыто сейчас',
        locationTitle: 'Локация',
        locationDescription: 'Здесь указаны все филиалы этого места и их адреса. Вы также можете построить маршрут как вам удобнее: с Google Maps или заказав Uber :)',
        websiteTitle: 'Сайт заведения',
        websiteSubtitle: 'Перейдите на сайт этого места и ознакомьтесь с подробной информацией',
        websiteButton: 'Перейти на сайт',
        googleMapsButton: 'Открыть на карте',
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
        visitModalEnding: '',
        onCall: 'Позвонить'
      },
      openingHours: { title: 'Часы работы', checkAvailabilityMessage: 'Часы работы зависят от наличия. Проверьте сайт и страницу в Instagram заведения, чтобы узнать подробности', alwaysOpenMessage: 'Это место открыто круглосуточно', alwaysOpenLabel: 'Всегда открыто', checkAvailabilityLabel: 'Проверить доступность' },
      whereIsToday: { title: 'Итак, куда сегодня?', subtitle: 'Список мест, где я был, по категориям. Взгляните ;)', opensToday: 'Открыто сегодня' },
      placeList: {
        environmentTitle: 'Тип заведения:',
        environmentTitlePlace: 'Тип места:',
        hoursUnavailable: 'Часы работы недоступны',
        opensAtHeader: 'Открывается в',
        opensAt: 'Открывается в {{time}}',
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
      about: { title: 'Кто я?', paragraph: 'Страница «Обо мне». Полная версия дизайна появится позже.' },
      aboutMe: {
        authorTag: 'Создатель Role Paulista',
        photoAlt: 'Фото Уоллеса Балденебре',
        name: 'Wallace Baldenebre',
        aboutHeading: 'Обо мне',
        motto: 'Дай человеку рыбу — и он будет сыт один день. Научи его ловить рыбу — и он будет сыт всю жизнь',
        accordion: {
          aboutLabel: 'Обо мне',
          whatIsLabel: 'Что такое Rolê Paulista?',
          earnLabel: 'Сколько я на этом зарабатываю?',
          howToHelpLabel: 'Могу ли я как-то помочь?'
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
          'Сначала я заполнял её только для себя, но со временем начал делиться с друзьями и знакомыми, и это выросло во что-то большее.',
          'Так появился Rolê Paulista — сайт с опытом как у приложения, чтобы упростить доступ к лучшим городским впечатлениям, которые я посещаю.',
          'Неважно, вы из Сан-Паулу, из другого штата или из другого страны — этот опыт для всех.'
        ],
        earn: [
          'Ответ очень простой: ничего. Rolê Paulista — это личный проект, сделанный из любви к городу Сан-Паулу. Возможно, в будущем я что-то заработаю на публикациях или AdSense? Возможно, но идея в том, чтобы сайт ВСЕГДА оставался бесплатным — и для читателей, и для публикаций о местах.',
          'Я не буду принимать деньги за это, особенно чтобы хвалить место за оплату; хочу сохранять честность и подлинность контента, посещая места и делясь реальной опытом.',
          'Возможно, публикации в Instagram или на сайте выходят не так быстро, потому что сейчас я одновременно команда инфраструктуры, разработки, маркетинга, дизайна и контента, так что прошу прощения, если обновления занимают время :)'
        ],
        howToHelp: [
          'Если хочешь порекомендовать место, напиши мне в Instagram или на e-mail с информацией о заведении — я постараюсь посетить его и тем самым помочь другим, кто пользуется этим сайтом!',
          'Если хочешь поддержать проект, чтобы наши прогулки по СП становились ещё проще и удобнее, просто наведи камеру на QR‑код ниже :)'
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
        createdForYouTitle: 'Маршруты для тебя :)',
        listTitle: 'Маршруты',
        viewRoute: 'Видеть маршрут',
        modes: {
          walking: 'Пеший тур',
          city: 'Городской тур'
        },
        routeOptions: {
          free: 'Бесплатно',
          nightlife: 'Ночная жизнь',
          bars: 'Бары',
          food: 'Гастрономия',
          history: 'История',
          museums: 'Музеи',
          nature: 'Природа',
          forfun: 'Развлечения',
          more: 'Больше вариантов'
        },
        placesCount: '{{count}} мест',
        tipTitle: 'Важный совет',
        tipDescription: 'Выйдя на улицу, будь внимателен с телефоном: старайся меньше им пользоваться и не проси помощи у незнакомцев. Заметил что-то странное? Зайди в людное место и позвони 190. В СП базовое правило: полная внимательность вокруг и никакой беспечности',
        loadingPoints: 'Загрузка точек...',
        tourPointsLoadError: 'Пока не удалось загрузить точки тура.',
        placesYouWillPass: 'Места, через которые вы пройдёте',
        routePlacesLoadError: 'Пока не удалось загрузить места маршрута.',
        openInGoogleMaps: 'Открыть в Google Maps'
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
        NATURE: 'Природа',
        FORFUN: 'Развлечения',
        OTHERS: 'Другое'
      },
    }
  },
  zh: {
    translation: {
      home: { nearMeTitle: '附近', nearMeSubtitle: '（显示你附近 {{km}}km 半径内的地点）', allowLocation: '哎呀，我们未能找到您的位置...\n\n要查找您附近的地点，请点击下方按钮：', allowLocationButton: '允许定位', loadingCategories: '正在加载分类...', increaseRadius: '增加半径', neighborhoodsTitle: '按街区', neighborhoodsTagline: '你在这些街区之一吗？附近有好地方！', viewMoreNeighborhoods: '更多街区', viewMore: '更多选项', noNearbyResultsRadius: '你附近没有找到任何地点...\n\n要不要调整距离，\n以便列出附近的地点？', locationNotSupported: '此浏览器不支持地理定位。', locationDeniedInstructions: '', outsideGreaterSP: '您位于大圣保罗地区之外。要不要考虑近期来这座城市游玩？ :)', viewPlace: '查看地点', viewPlaces: '查看地点列表' },
      header: { title: 'Role Paulista', tagline: '最好的推荐，几次点击即可到达' },
      common: { back: '返回', details: '了解更多', selectLanguage: '选择语言', changeDistance: '增加距离', all: '全部', filter: '筛选:', close: '关闭', loading: '加载中…', loadError: '加载数据出错。', noPlaces: '未找到地点。', version: '版本' },
      list: {
        nameHeader: '名称',
        neighborhoodHeader: '街区',
        seeDetails: '查看详情',
        typeHeader: '类型',
        orderNameAsc: '名称 按升序 A-Z',
        orderNeighborhoodAsc: '街区 按升序 A-Z',
        variablePlace: '无固定地点'
      },
      footer: { home: '首页', search: '搜索', about: '关于' },
      searchPage: {
        title: '搜索地点',
        subtitle: '还记得地点名称吗？在下方输入名称会更快。',
        fieldLabel: '地点名称：',
        resultsTitle: '搜索结果',
        placeholder: '例如：Pao Legal 面包店'
      },
      filters: { title: '筛选', subtitle: '调整以下筛选以缩小结果范围', sortingTitle: '排序', hoursTitle: '营业时间', openNowLabel: '正在营业', openNow: '正在营业', anyHourLabel: '任意时间', anyHour: '任意时间', scheduleTitle: '预约', scheduleRequired: '需要预约', scheduleNotRequired: '无需预约', anySchedule: '不限', cityTitle: '城市', anyCity: '任意城市', priceTitle: '价格', anyPrice: '任意价格', button: '筛选' },
      placeDetail: { loading: '正在加载详情...', notFound: '未找到地点。', opensMonday: '周一营业', opensSunday: '周日营业', opensHoliday: '节假日营业', alreadyVisited: '✓ 我去过', notVisited: '⚠️ 还没去过', viewHours: '查看营业时间',
        priceLabel: '价格:',
        hoursTitle: '营业时间',
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
        environmentTypeLabel: '环境类型:',
        locationTitle: '地点',
        streetPrefix: '地址:',
        googleMapsButton: '在地图中打开',
        instagramTitle: 'Instagram',
        instagramSubtitle: '关注官方账号：',
        follow: '关注',
        phoneTitle: '电话',
        phonesSubtitle: '以下是该地点的官方联系方式',
        menuTitle: '菜单',
        menuSubtitle: '查看该地点菜单',
        menuButton: '打开菜单',
        notesTitle: '备注',
        reportProblem: '报告问题',
        visitModalEnding: '我也会告诉你哪些地方不值得去 :)',
        onCall: '拨打电话'
      },
      openingHours: { title: '营业时间', checkAvailabilityMessage: '营业时间可能会变动。请查看该地点官网或 Instagram 获取详情。', alwaysOpenMessage: '该地点 24 小时营业', alwaysOpenLabel: '全天开放', checkAvailabilityLabel: '查看可用性' },
      whereIsToday: { title: '那么，今天去哪里？', subtitle: '按类别整理的我去过的地点列表。来看一看 ;)', opensToday: '今日营业' },
      distanceSelect: { title: '选择距离', searchButton: '搜索' },
      placeList: {
        environmentTitle: '环境类型:',
        environmentTitlePlace: '地点类型:',
        hoursUnavailable: '营业时间不可用',
        opensAtHeader: '开张时间',
        opensAt: '于 {{time}} 开门',
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
          earnLabel: '我靠这个赚多少钱？',
          howToHelpLabel: '我可以用某种方式帮忙吗？'
        },
        aboutList: [
          '做移动工程师已经10年了（如果我的记忆还靠谱的话）',
          '打鼓、弹吉他和唱歌，把一切都完美地搞错，还常常和现实不同步',
          '我的厨艺已经到了能做出超棒咸味潘妮托内的水平',
          '只要手头有点余钱，我就会独自旅行和背包探索世界',
          '我会说葡萄牙语（巴西）、英语、西班牙语和俄语（这门还在学中... Привет мой друг）',
          '我来自奥萨斯库，热爱圣保罗；我也会逮到机会就吐槽这座城市，但总是准备好推荐最棒的地方 :)'
        ],
        whatIs: [
          '这个想法最初来自一个电子表格，我会在里面记录城市里最值得去的地方。',
          '一开始我只是给自己用，但随着时间推移，我开始分享给朋友和熟人，后来它逐渐变成了更大的项目。',
          'Rolê Paulista 就这样诞生了：一个带有 App 体验的网站，让大家更方便地找到我去过的优质城市体验。',
          '无论你来自圣保罗、巴西其他州，还是其他国家，这里的体验都面向每一个人。'
        ],
        earn: [
          '答案很简单：不赚钱。Rolê Paulista 是一个出于热爱圣保罗而做的个人项目。未来我会不会通过广告或发布内容赚点钱？也许会，但这个网站的理念是必须始终免费，不论是对访问者，还是对我发布的场所内容。',
          '我不会为此收钱，尤其不会为了夸某个地方而收钱；我希望通过亲自到访并分享真实体验，保持内容的真实与诚实。',
          '我在 Instagram 或网站上的更新有时会慢一些，因为目前我一个人包办了全部工作：基础设施、开发、营销、设计和内容，哈哈。所以如果更新慢一点，还请见谅 :)'
        ],
        howToHelp: [
          '如果你想推荐一个地方，请在 Instagram 或通过电子邮件把地点信息发给我；我会尽力去亲自体验，并把它分享给使用这个网站的其他人！',
          '如果你想支持这个项目持续运营，让你在圣保罗的出行更轻松更方便，只要把相机对准下面的二维码即可 :)'
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
        title: '路线',
        placeholder: '为你推荐步行路线，可在附近一次打卡多个地点，无需交通花费。',
        routeOptionsTitle: '路线选项:',
        createdForYouTitle: '为你创建的路线 :)',
        listTitle: '路线',
        viewRoute: '查看路线',
        modes: {
          walking: '步行路线',
          city: '城市路线'
        },
        routeOptions: {
          free: 'Gratuit',
          nightlife: 'Vie nocturne',
          bars: 'Bars',
          food: 'Food',
          history: 'History',
          museums: 'Museums',
          nature: '自然',
          forfun: '娱乐',
          more: 'More Options'
        },
        placesCount: '{{count}} places',
        tipTitle: '重要提示',
        tipDescription: '在街上行走时，请留意你的手机：尽量少用，不要向陌生人求助。发现可疑情况？进入人多的地方并拨打 190。在圣保罗（SP），基本原则是：时刻注意周围环境，绝不掉以轻心。',
        loadingPoints: '正在加载点位...',
        tourPointsLoadError: '暂时无法加载行程点位。',
        placesYouWillPass: '你将经过的地点',
        routePlacesLoadError: '暂时无法加载行程地点。',
        openInGoogleMaps: '在 Google 地图中打开'
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
        NATURE: '自然',
        FORFUN: '娱乐',
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
      distanceSelect: { title: 'Select distance', searchButton: 'Search' },
      whereIsToday: { title: 'So, where are we going today?', subtitle: 'List of places I’ve been, by category. Take a look ;)', opensToday: 'Open today' },
      list: { nameHeader: 'NAME', neighborhoodHeader: 'NEIGHBORHOOD', seeDetails: 'see details', variablePlace: 'No fixed location', typeHeader: 'Type', orderNameAsc: 'NAME in ascending order A-Z', orderNeighborhoodAsc: 'NEIGHBORHOOD in ascending order A-Z' },
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
        alreadyVisited: '✓ I’ve been there',
        notVisited: '⚠️ Not visited yet',
        viewHours: 'see hours',
        visitModalTitle: 'About this place',
        visitModalParagraph: 'Place pending a visit. The info here comes from suggestions by people who have been there and told me to check it out.',
        visitedModalParagraph: 'Visited place. The info here comes from what I noted during my visit — things I ordered or tried — plus details shared by the venue.',
        neverEmphasis: '',
        priceLabel: 'Price:',
        hoursTitle: 'Opening hours',
        openNow: 'Open now',
        closedNow: 'Closed',
        locationDescription: 'Here are the branches for this venue and their addresses. You can map the route however you like: with Google Maps or by calling an Uber :)',
        websiteTitle: 'Place website',
        websiteSubtitle: 'Visit the venue website for detailed information',
        websiteButton: 'Open website',
        openUber: 'Open in Uber',
        environmentTypeLabel: 'Environment type:',
        locationTitle: 'Location',
        streetPrefix: 'Address:',
        googleMapsButton: 'Open map',
        instagramTitle: 'Instagram',
        instagramSubtitle: 'Follow the official profile:',
        follow: 'Follow',
        phoneTitle: 'Phone',
        phonesSubtitle: 'These are the official contacts for this place',
        menuTitle: 'Menu',
        menuSubtitle: 'View the venue menu',
        menuButton: 'Open menu',
        notesTitle: 'Notes',
        reportProblem: 'Report a problem',
        visitModalEnding: '',
        whatsappButton: 'WhatsApp',
        onCall: 'Call'
      },
      openingHours: { title: 'Opening hours', checkAvailabilityMessage: 'The hours may vary. Check the venue website or Instagram page for details.', alwaysOpenMessage: 'This place is open 24/7', alwaysOpenLabel: 'Always open', checkAvailabilityLabel: 'Check availability' },
      placeList: {
        environmentTitle: 'Environment type:',
        environmentTitlePlace: 'Place type:',
        hoursUnavailable: 'Hours unavailable',
        opensAtHeader: 'Opens at',
        opensAt: 'Opens at {{time}}',
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
        motto: 'Give a man a fish and you feed him for a day. Teach him to fish and you feed him for a lifetime',
        accordion: {
          aboutLabel: 'About me',
          whatIsLabel: 'What is Rolê Paulista?',
          earnLabel: 'How much do I earn from this?',
          howToHelpLabel: 'Can I contribute in any way?'
        },
        aboutList: [
          'モバイルエンジニア歴10年（記憶が正しければ）',
          'ドラム、ギター、ボーカルをやります。現実とズレながら、全部を完璧に間違えるタイプです',
          '料理は「最高の塩味パネトーネ」を作れるくらいにはやります',
          'お金に少し余裕ができたら、ひとり旅やバックパッカーで世界を巡ります',
          'ポルトガル語（BR）、英語、スペイン語、ロシア語を話します（ロシア語はまだ勉強中... Привет мой друг）',
          'オザスコ出身で、サンパウロが大好きです。文句もよく言いますが、最高の場所をおすすめする準備はいつでもできています :)'
        ],
        whatIs: [
          'このアイデアは、街でおすすめのスポットを記録していたスプレッドシートから始まりました。',
          '最初は自分用だけでしたが、時間とともに友人や知人に共有するようになり、だんだん大きなものになっていきました。',
          'こうして Rolê Paulista が生まれました。私が実際に訪れた最高の都市体験に、アプリのような感覚でアクセスしやすくするためのサイトです。',
          'サンパウロ在住の人でも、他州の人でも、海外から来る人でも、誰でも楽しめる体験です。'
        ],
        earn: [
          '答えはシンプルです。収益はゼロです。Rolê Paulista はサンパウロへの情熱と愛から生まれた個人プロジェクトです。将来的に広告や掲載で収益化する可能性はあるかもしれませんが、このサイトは訪問者にとっても掲載先にとっても、常に無料であるべきだと考えています。',
          'この活動でお金は受け取りません。特に、場所を褒めるための報酬は受けません。実際に訪れて本当の体験を共有し、内容の誠実さと信頼性を保ちたいからです。',
          'Instagram やこのサイトへの投稿に時間がかかることがあります。現在はインフラ、開発、マーケティング、デザイン、コンテンツ制作まで、全部ひとりで担当しているためです（笑）。更新が遅いときはごめんなさい :)'
        ],
        howToHelp: [
          'If you want to recommend a place, send me a message on Instagram or by email with the place details — I’ll do my best to visit it and help other people who use this site!',
          'If you’d like to support the continuity of this project so your hangouts in SP become even lighter and more practical, just point your camera at the QR code below :)'
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
        createdForYouTitle: 'Routes made for you :)',
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
          nature: 'Nature',
          forfun: 'Fun',
          more: 'More Options'
        },
        placesCount: '{{count}} places',
        tipTitle: 'Important Tip',
        tipDescription: 'When walking on the street, stay alert with your phone: avoid using it too much and don\'t ask strangers for help. Notice something strange? Go into a busy place and call 190. In SP, the base is: full attention to your surroundings and no letting your guard down',
        loadingPoints: 'Loading points...',
        tourPointsLoadError: 'It was not possible to load the tour points yet.',
        placesYouWillPass: 'Places you\'ll pass by',
        routePlacesLoadError: 'It was not possible to load the itinerary places yet.',
        openInGoogleMaps: 'Open in Google Maps'
      },
      tourType: {
        ALL: 'All',
        FREE: 'Free',
        NIGHTLIFE: 'Nightlife',
        BARS: 'Bars',
        GASTRONOMIC: 'Gastronomic',
        HISTORY: 'History',
        MUSEUMS: 'Museums',
        ARTISTIC: 'Artistic',
        NATURE: 'Nature',
        FORFUN: 'Fun',
        OTHERS: 'Others'
      },
      nearbyMap: { title: 'Nearby map', noneInRadius: 'No points in the current radius.', pointsDisplayed: '{{count}} point(s) shown.', you: 'You' }
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
      list: { nameHeader: 'NAME', neighborhoodHeader: 'STADTTEIL', variablePlace: 'Kein fester Standort', typeHeader: 'Typ', orderNameAsc: 'NAME in aufsteigender Reihenfolge A-Z', orderNeighborhoodAsc: 'STADTTEIL in aufsteigender Reihenfolge A-Z' },
      footer: { home: 'Start', search: 'Suchen', about: 'Über' },
      searchPage: {
        title: 'Suche einen Ort',
        subtitle: 'Erinnerst du dich an den Namen des Ortes? Gib ihn unten ein, das ist schneller',
        fieldLabel: 'Name des Ortes:',
        resultsTitle: 'Gefundene Ergebnisse',
        placeholder: 'z. B.: Bäckerei Pao Legal'
      },
      distanceSelect: { title: 'Entfernung auswählen', searchButton: 'Suchen' },
      placeDetail: {
        hoursTitle: 'Öffnungszeiten',
        opensMonday: 'öffnet montags',
        opensSunday: 'öffnet sonntags',
        opensHoliday: 'öffnet an Feiertagen',
        alreadyVisited: '✓ Ich war dort',
        notVisited: '⚠️ Noch nicht dort gewesen',
        viewHours: 'Öffnungszeiten anzeigen',
        visitModalTitle: 'Über diesen Ort',
        visitModalParagraph: 'Ort noch zu besuchen. Die Informationen auf dieser Seite stammen aus Vorschlägen anderer Personen, die dort waren und mir empfohlen haben, es zu besuchen.',
        visitedModalParagraph: 'Besuchter Ort. Die Informationen auf dieser Seite stammen aus meinen Aufzeichnungen bei meinem Besuch — Dinge, die ich bestellt oder erlebt habe — sowie aus Angaben der Verantwortlichen des Ortes.',
        neverEmphasis: '',
        priceLabel: 'Preis:',
        openNow: 'Jetzt geöffnet',
        closedNow: 'Geschlossen',
        locationDescription: 'Hier findest du die Filialen dieses Ortes und alle Adressen. Du kannst die Route so planen, wie du möchtest: mit Google Maps oder indem du ein Uber bestellst :)',
        websiteTitle: 'Website',
        websiteSubtitle: 'Besuchen Sie die Website dieses Ortes und sehen Sie sich die detaillierten Informationen an',
        websiteButton: 'Website öffnen',
        openUber: 'In Uber öffnen',
        environmentTypeLabel: 'Umgebungstyp:',
        locationTitle: 'Standort',
        streetPrefix: 'Adresse:',
        googleMapsButton: 'Auf Karte öffnen',
        instagramTitle: 'Instagram',
        instagramSubtitle: 'Offizielles Profil folgen:',
        follow: 'Folgen',
        phoneTitle: 'Telefon',
        phonesSubtitle: 'Dies sind die offiziellen Kontakte dieses Ortes',
        menuTitle: 'Menü',
        menuSubtitle: 'Menü des Ortes ansehen',
        menuButton: 'Menü öffnen',
        notesTitle: 'Notizen',
        onCall: 'Anrufen'
      },
      openingHours: { title: 'Öffnungszeiten', checkAvailabilityMessage: 'Die Öffnungszeiten variieren je nach Verfügbarkeit. Prüfen Sie die Website und die Instagram-Seite des Ortes, um Details zu erfahren', alwaysOpenMessage: 'Dieser Ort ist 24 Stunden geöffnet', alwaysOpenLabel: 'Immer geöffnet', checkAvailabilityLabel: 'Verfügbarkeit prüfen' },
      whereIsToday: { title: 'Und, wo geht’s heute hin?', subtitle: 'Liste der Orte, an denen ich war, nach Kategorien. Schau mal rein ;)', opensToday: 'Heute geöffnet' },
      placeList: {
        environmentTitle: 'Umgebungstyp:',
        environmentTitlePlace: 'Ortstyp:',
        hoursUnavailable: 'Öffnungszeiten nicht verfügbar',
        opensAtHeader: 'Öffnet um',
        opensAt: 'Öffnet um {{time}}',
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
        motto: 'Gib einem Menschen einen Fisch und du ernährst ihn einen Tag. Lehre ihn zu fischen und du ernährst ihn ein Leben lang',
        accordion: {
          aboutLabel: 'Über mich',
          whatIsLabel: 'Was ist Rolê Paulista?',
          earnLabel: 'Wie viel verdiene ich damit?',
          howToHelpLabel: 'Kann ich irgendwie beitragen?'
        },
        aboutList: [
          'Mobile Engineer seit 10 Jahren (wenn mich mein Gedächtnis nicht täuscht)',
          'Schlagzeug, Gitarre und Gesang, alles perfekt falsch und völlig aus dem Takt mit der Realität',
          'Ich koche so gut, dass ich sogar ein großartiges herzhaftes Panettone machen kann',
          'Alleinreisender und Backpacker, wann immer etwas Geld übrig ist, um die Welt zu entdecken',
          'Ich spreche Portugiesisch (BR), Englisch, Spanisch und Russisch (dieses lerne ich noch... Привет мой друг)',
          'Ich komme aus Osasco, liebe São Paulo und beschwere mich auch bei jeder Gelegenheit über die Stadt, bin aber immer bereit, das Beste zu empfehlen :)'
        ],
        whatIs: [
          'Die Idee begann als Tabelle, in der ich die besten Orte der Stadt gesammelt habe.',
          'Anfangs habe ich sie nur für mich gepflegt, aber mit der Zeit habe ich sie mit Freunden und Bekannten geteilt, bis etwas Größeres daraus wurde.',
          'So entstand Rolê Paulista: eine Website mit App-ähnlicher Erfahrung, um den Zugang zu den besten Erlebnissen der Stadt zu erleichtern.',
          'Egal ob du aus São Paulo, einem anderen Bundesstaat oder einem anderen Land kommst, die Erfahrung ist für alle.'
        ],
        earn: [
          'Die Antwort ist einfach: nichts. Rolê Paulista ist ein persönliches Projekt aus Leidenschaft und Liebe zu São Paulo. Vielleicht verdiene ich in Zukunft mit Veröffentlichungen oder AdSense, aber die Idee ist, dass die Seite IMMER kostenlos bleibt.',
          'Ich werde dafür kein Geld annehmen, vor allem nicht, um gut über einen Ort zu sprechen. Ich möchte die Inhalte authentisch und ehrlich halten, indem ich Orte selbst besuche und meine echte Erfahrung teile.',
          'Es kann sein, dass ich mit Updates auf Instagram oder hier auf der Seite etwas brauche, denn aktuell bin ich das ganze Team: Infrastruktur, Entwicklung, Marketing, Design und Inhalt zugleich.'
        ],
        howToHelp: [
          'Wenn du einen Ort empfehlen möchtest, schreib mir auf Instagram oder per E‑Mail mit den Infos zum Ort — ich werde mein Bestes tun, ihn zu besuchen und damit anderen zu helfen, die diese Seite nutzen!',
          'Wenn du helfen möchtest, dieses Projekt am Laufen zu halten, damit deine Unternehmungen in SP immer leichter und praktischer werden, halte einfach die Kamera auf den QR‑Code unten :)'
        ],
        socialHeading: 'Soziale Netzwerke',
        socialDescription: 'Du findest mich auf den sozialen Netzwerken unten :)',
        social: {
          wallace: 'Wallace Baldenebre',
          role: 'Role Paulista',
          linkedin: 'LinkedIn',
          email: 'E-mail'
        },
        roleName: 'Role Paulista',
        bio: 'Mobiler Entwickler mit mehr als 8 Jahren Erfahrung, spezialisiert auf Android und iOS. Leidenschaftlich für Technologie, Reisen, Essen und das Entdecken jeder Ecke von São Paulo.'
      },
      travelItinerary: {
        title: 'Routen',
        placeholder: 'Vorgeschlagene Fußwege, damit du mehrere nahe Orte besuchen kannst, ohne für Transport auszugeben.',
        routeOptionsTitle: 'Routenoptionen:',
        createdForYouTitle: 'Routen für dich :)',
        listTitle: 'Routen',
        viewRoute: 'Route ansehen',
        modes: {
          walking: 'Rundgang zu Fuß',
          city: 'Stadttour'
        },
        routeOptions: {
          free: 'Kostenlos',
          nightlife: 'Nachtleben',
          bars: 'Bars',
          food: 'Essen',
          history: 'Geschichte',
          museums: 'Museen',
          nature: 'Natur',
          forfun: 'Spaß',
          more: 'Mehr Optionen'
        },
        placesCount: '{{count}} Orte',
        tipTitle: 'Wichtiger Hinweis',
        tipDescription: 'Wenn du auf der Straße unterwegs bist, pass mit deinem Handy auf: benutze es möglichst wenig und bitte keine Fremden um Hilfe. Kommt dir etwas seltsam vor? Geh in einen belebten Ort und ruf 190 an. In SP gilt als Grundregel: volle Aufmerksamkeit für deine Umgebung und bloß nicht unachtsam werden',
        loadingPoints: 'Punkte werden geladen...',
        tourPointsLoadError: 'Die Punkte der Tour konnten noch nicht geladen werden.',
        placesYouWillPass: 'Orte, an denen du vorbeikommst',
        routePlacesLoadError: 'Die Orte der Route konnten noch nicht geladen werden.',
        openInGoogleMaps: 'In Google Maps öffnen'
      },
      tourType: {
        ALL: 'Alles',
        FREE: 'Kostenlos',
        NIGHTLIFE: 'Nachtleben',
        BARS: 'Bars',
        GASTRONOMIC: 'Gastronomisch',
        HISTORY: 'Geschichte',
        MUSEUMS: 'Museen',
        ARTISTIC: 'Künstlerisch',
        NATURE: 'Natur',
        FORFUN: 'Spaß',
        OTHERS: 'Andere'
      },
      nearbyMap: { title: 'Karte in der Nähe', noneInRadius: 'Keine Punkte im aktuellen Radius.', pointsDisplayed: '{{count}} Punkt(e) angezeigt.', you: 'Du' }
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
      list: { nameHeader: '名前', neighborhoodHeader: '地区', variablePlace: '固定の場所なし', typeHeader: '種類', orderNameAsc: '名前 昇順 A-Z', orderNeighborhoodAsc: '地区 昇順 A-Z' },
      footer: { home: 'ホーム', search: '検索', about: '概要' },
      searchPage: {
        title: '場所を探す',
        subtitle: '場所の名前を覚えていますか？下に名前を入力すると早いです',
        fieldLabel: '場所名：',
        resultsTitle: '検索結果',
        placeholder: '例：パダリア パン・レガル'
      },
      distanceSelect: { title: '距離を選択', searchButton: '検索' },
      placeDetail: {
        hoursTitle: '営業時間',
        opensMonday: '月曜日に営業',
        opensSunday: '日曜日に営業',
        opensHoliday: '祝日に営業',
        alreadyVisited: '✓ 行ったことがあります',
        notVisited: '⚠️ まだ行っていません',
        viewHours: '営業時間を見る',
        visitModalTitle: 'この場所について',
        visitModalParagraph: '未訪問の場所。 このページの情報は、実際に訪れた他の人々が私に勧めてくれた提案に基づいています。',
        visitedModalParagraph: '訪問済みの場所。 このページの情報は、私が訪問した際に収集した内容（注文した品や体験した項目）および店家からの情報に基づいています。',
        neverEmphasis: '',
        priceLabel: '価格：',
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
        googleMapsButton: '地図で開く',
        instagramTitle: 'Instagram',
        instagramSubtitle: '公式アカウントをフォロー：',
        follow: 'フォロー',
        phoneTitle: '電話',
        phonesSubtitle: 'これらはこの場所の公式連絡先です',
        menuTitle: 'メニュー',
        menuSubtitle: '店舗のメニューを確認',
        menuButton: '開く',
        notesTitle: '備考',
        onCall: '電話する'
      },
      openingHours: { title: '営業時間', checkAvailabilityMessage: '営業時間は都度変動します。詳細は施設のウェブサイトおよびInstagramページでご確認ください', alwaysOpenMessage: 'この場所は24時間営業です', alwaysOpenLabel: '常時営業', checkAvailabilityLabel: '空き状況を確認' },
      whereIsToday: { title: 'で、今日はどこに行く？', subtitle: '行ったことのある場所をカテゴリ別でまとめた一覧です。見てみてね ;)', opensToday: '本日営業' },
      placeList: {
        environmentTitle: '環境タイプ：',
        environmentTitlePlace: '場所タイプ：',
        hoursUnavailable: '営業時間情報なし',
        opensAtHeader: '開店時間',
        opensAt: '{{time}} に開店',
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
        motto: '一人に魚を与えれば一日食べられる。釣り方を教えれば一生食べられる',
        accordion: {
          aboutLabel: '私について',
          whatIsLabel: 'Rolê Paulistaとは？',
          earnLabel: 'これでどれくらい稼げるの？',
          howToHelpLabel: '何か協力できますか？'
        },
        aboutList: [
          'モバイルエンジニア歴10年（記憶が正しければ）',
          'ドラム、ギター、ボーカルをやります。現実とズレながら、全部を完璧に間違えるタイプです',
          '料理は「最高の塩味パネトーネ」を作れるくらいにはやります',
          'お金に少し余裕ができたら、ひとり旅やバックパッカーで世界を巡ります',
          'ポルトガル語（BR）、英語、スペイン語、ロシア語を話します（ロシア語はまだ勉強中... Привет мой друг）',
          'オザスコ出身で、サンパウロが大好きです。文句もよく言いますが、最高の場所をおすすめする準備はいつでもできています :)'
        ],
        whatIs: [
          'このアイデアは、街でおすすめのスポットを記録していたスプレッドシートから始まりました。',
          '最初は自分用だけでしたが、時間とともに友人や知人に共有するようになり、だんだん大きなものになっていきました。',
          'こうして Rolê Paulista が生まれました。私が実際に訪れた最高の都市体験に、アプリのような感覚でアクセスしやすくするためのサイトです。',
          'サンパウロ在住の人でも、他州の人でも、海外から来る人でも、誰でも楽しめる体験です。'
        ],
        earn: [
          '答えはシンプルです。収益はゼロです。Rolê Paulista はサンパウロへの情熱と愛から生まれた個人プロジェクトです。将来的に広告や掲載で収益化する可能性はあるかもしれませんが、このサイトは訪問者にとっても掲載先にとっても、常に無料であるべきだと考えています。',
          'この活動でお金は受け取りません。特に、場所を褒めるための報酬は受けません。実際に訪れて本当の体験を共有し、内容の誠実さと信頼性を保ちたいからです。',
          'Instagram やこのサイトへの投稿に時間がかかることがあります。現在はインフラ、開発、マーケティング、デザイン、コンテンツ制作まで、全部ひとりで担当しているためです（笑）。更新が遅いときはごめんなさい :)'
        ],
        howToHelp: [
          'おすすめの場所があれば、Instagram かメールでお店の情報を送ってください。できる限り実際に行ってみて、このサイトを使う他の人の役に立てるようにします！',
          'このプロジェクトを継続して、SPでの外出をもっと気軽で便利にするために支援したい場合は、下のQRコードにカメラを向けるだけです :)'
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
        bio: 'モバイル開発歴8年以上。AndroidとiOSのスペシャリスト。テクノロジー、旅行、食、そしてサンパウロの隅々を探検することが大好きです。'
      },
      travelItinerary: {
        title: 'ルート',
        placeholder: '交通費をかけずに複数の近場スポットを巡れる徒歩ルートを提案します。',
        routeOptionsTitle: 'ルートオプション：',
        createdForYouTitle: 'あなたのために作成したルート :)',
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
          nature: '自然',
          forfun: 'エンタメ',
          more: '他のオプション'
        },
        placesCount: '{{count}} か所',
        tipTitle: '重要な注意',
        tipDescription: '街を歩くときはスマホに注意：使いすぎず、知らない人に助けを求めないでください。何かおかしいと感じたら、人が多い場所に入り、190に電話しましょう。SPでは基本は、周囲に常に注意を払い、油断しないことです',
        loadingPoints: 'ポイントを読み込み中...',
        tourPointsLoadError: 'ツアーのポイントをまだ読み込めませんでした。',
        placesYouWillPass: '通る場所',
        routePlacesLoadError: 'ルート上の場所をまだ読み込めませんでした。',
        openInGoogleMaps: 'Google マップで開く'
      },
      tourType: {
        ALL: 'すべて',
        FREE: '無料',
        NIGHTLIFE: 'ナイトライフ',
        BARS: 'バー',
        GASTRONOMIC: 'グルメ',
        HISTORY: '歴史',
        MUSEUMS: '博物館',
        ARTISTIC: '芸術',
        NATURE: '自然',
        FORFUN: 'エンタメ',
        OTHERS: 'その他'
      },
      nearbyMap: { title: '近くの地図', noneInRadius: '現在の半径内にポイントがありません。', pointsDisplayed: '{{count}} 件を表示中。', you: 'あなた' }
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
        allowLocation: 'عذرًا، لم نتمكن من العثور على موقعك...\n\nللعثور على أماكن قريبة منك، اضغط على الزر أدناه:',
        allowLocationButton: 'السماح بالموقع',
        noNearbyResultsRadius: 'لا يوجد شيء قريب منك...\n\nما رأيك أن نغير المسافة لكي\nنعرض الأماكن القريبة؟',
        viewMoreNeighborhoods: 'عرض المزيد من الأحياء',
        viewMore: 'عرض المزيد',
        viewPlace: 'عرض المكان',
        viewPlaces: 'عرض الأماكن',
        neighborhoodsTitle: 'حسب الحي',
        neighborhoodsTagline: 'أنت في أحد هذه الأحياء؟ هناك أشياء جميلة بالقرب منك!'
      },
      common: {
        back: 'رجوع',
        details: 'اعرف المزيد',
        changeDistance: 'زيادة المسافة',
        all: 'الكل',
        filter: 'فلتر:'
      },
      footer: { home: 'الرئيسية', search: 'بحث', about: 'حول' },
      searchPage: {
        title: 'ابحث عن مكان',
        subtitle: 'هل تتذكر اسم المكان؟ اكتب الاسم أدناه وسيكون الأمر أسرع.',
        fieldLabel: 'اسم المكان:',
        resultsTitle: 'النتائج',
        placeholder: 'مثال: Padaria Pao Legal'
      },
      filters: {
        title: 'فلاتر',
        subtitle: 'اضبط الفلاتر أدناه لتضييق النتائج',
        sortingTitle: 'الترتيب',
        hoursTitle: 'المواعيد',
        openNowLabel: 'مفتوح الآن',
        openNow: 'مفتوح الآن',
        anyHourLabel: 'أي وقت',
        anyHour: 'أي وقت',
        scheduleTitle: 'الحجز',
        scheduleRequired: 'يتطلب حجزًا',
        scheduleNotRequired: 'لا يتطلب حجزًا',
        anySchedule: 'أي خيار',
        cityTitle: 'المدينة',
        anyCity: 'أي مدينة',
        priceTitle: 'السعر',
        anyPrice: 'أي سعر',
        button: 'فلاتر'
      },
      list: {
        nameHeader: 'الاسم',
        neighborhoodHeader: 'الحي',
        typeHeader: 'النوع',
        orderNameAsc: 'الاسم بترتيب تصاعدي A-Z',
        orderNeighborhoodAsc: 'الحي بترتيب تصاعدي A-Z',
        variablePlace: 'بدون موقع ثابت'
      },
      whereIsToday: {
        title: 'طيب، فين هنروح النهاردة؟',
        subtitle: 'قائمة الأماكن اللي زرتها حسب الفئة، بص عليها ;)',
        opensToday: 'مفتوح اليوم'
      },
      distanceSelect: { title: 'حدد المسافة', searchButton: 'بحث' },
      travelItinerary: {
        title: 'المسارات',
        placeholder: 'مسارات مشي مقترحة لتتعرف على عدة أماكن قريبة دون الحاجة للإنفاق على المواصلات',
        routeOptionsTitle: 'خيارات المسار:',
        createdForYouTitle: 'مسارات أعددناها لك :)',
        listTitle: 'المسارات',
        viewRoute: 'عرض المسار',
        modes: {
          walking: 'جولة مشي',
          city: 'جولة في المدينة'
        },
        tipTitle: 'نصيحة مهمة',
        tipDescription: 'وأنت تمشي في الشارع، انتبه لهاتفك: تجنّب استخدامه كثيرًا ولا تطلب المساعدة من الغرباء. لاحظت شيئًا مريبًا؟ ادخل إلى مكان مزدحم واتصل بـ 190. في SP القاعدة الأساسية هي: انتباه كامل لما حولك ولا مجال للتهاون',
        loadingPoints: 'جارٍ تحميل النقاط...',
        tourPointsLoadError: 'لم نتمكن بعد من تحميل نقاط الجولة.',
        placesYouWillPass: 'الأماكن التي ستمر بها',
        routePlacesLoadError: 'لم نتمكن بعد من تحميل أماكن المسار.',
        openInGoogleMaps: 'فتح في خرائط Google'
      },
      openingHours: {
        title: 'ساعات العمل',
        closed: 'مغلق',
        range: 'من {{open}} إلى {{close}}',
        notProvided: 'ساعات العمل غير متوفرة.',
        followButton: 'متابعة',
        checkAvailabilityMessage: 'قد تختلف الساعات حسب التوفر. تحقق من موقع المكان أو صفحة Instagram لمعرفة التفاصيل.',
        alwaysOpenMessage: 'هذا المكان مفتوح على مدار الساعة',
        alwaysOpenLabel: 'مفتوح دائمًا',
        checkAvailabilityLabel: 'تحقق من التوفر'
      },
      placeDetail: {
        loading: 'جاري تحميل التفاصيل...',
        notFound: 'لم يتم العثور على المكان.',
        opensMonday: 'يفتح يوم الاثنين',
        opensSunday: 'يفتح يوم الأحد',
        opensHoliday: 'يفتح في العطلات الرسمية',
        alreadyVisited: '✓ زرته من قبل',
        notVisited: '⚠️ لم أزره بعد',
        visitModalTitle: 'عن الأماكن التي زرتها',
        visitModalParagraph: 'هذا المكان لم أزره بعد. المعلومات الموجودة هنا جاءت من ترشيحات أشخاص زاروه ونصحوني به.',
        visitedModalParagraph: 'مكان تمت زيارته. المعلومات الموجودة هنا مبنية على ما جمعته أثناء الزيارة: ما طلبته أو جرّبته، بالإضافة إلى المعلومات التي قدمها المسؤولون عن المكان.',
        neverEmphasis: '',
        priceLabel: 'السعر:',
        environmentTypeLabel: 'نوع الأجواء:',
        hoursTitle: 'مواعيد العمل',
        viewHours: 'عرض المواعيد',
        locationTitle: 'الموقع',
        openNow: 'مفتوح الآن',
        closedNow: 'مغلق الآن',
        locationDescription: 'هنا ستجد فروع هذا المكان وكل العناوين. ويمكنك أيضًا تحديد الطريق بالطريقة التي تناسبك: عبر Google Maps أو بطلب Uber :)',
        streetPrefix: 'العنوان:',
        googleMapsButton: 'فتح في الخريطة',
        openUber: 'فتح في Uber',
        instagramTitle: 'Instagram',
        instagramSubtitle: 'تابع الحساب الرسمي للمكان:',
        follow: 'متابعة',
        phoneTitle: 'الهاتف',
        phonesSubtitle: 'هذه هي وسائل التواصل الرسمية لهذا المكان',
        menuTitle: 'القائمة',
        menuSubtitle: 'عرض قائمة المكان',
        menuButton: 'فتح القائمة',
        websiteTitle: 'موقع المكان',
        websiteSubtitle: 'ادخل إلى موقع المكان للاطلاع على المعلومات التفصيلية',
        websiteButton: 'زيارة الموقع',
        notesTitle: 'ملاحظات',
        reportProblem: 'الإبلاغ عن مشكلة',
        visitModalEnding: '',
        whatsappButton: 'WhatsApp',
        onCall: 'اتصال'
      },
      placeList: {
        environmentTitle: 'نوع الأجواء:',
        environmentTitlePlace: 'نوع المكان:',
        hoursUnavailable: 'المواعيد غير متوفرة',
        opensAtHeader: 'الافتتاح',
        opensAt: 'يفتح الساعة {{time}}',
        openNow: 'مفتوح الآن',
        opensSoon: 'يفتح بعد قليل',
        opensTomorrowAt: 'يفتح غدًا الساعة {{time}}',
        opensOnAt: 'يفتح يوم {{day}} الساعة {{time}}',
        subtitleTemplate: 'اكتشف {{article}} {{noun}} من نفس النوع الأقرب ليك :)'
      },
      aboutMe: {
        aboutHeading: 'نبذة عني',
        motto: 'أعطِ رجلًا سمكة فتطعمه يومًا، وعلّمه الصيد فتطعمه مدى الحياة',
        accordion: {
          aboutLabel: 'نبذة عني',
          whatIsLabel: 'ما هو Role Paulista؟',
          earnLabel: 'كم أكسب من هذا؟',
          howToHelpLabel: 'هل يمكنني المساعدة بأي شكل؟'
        },
        aboutList: [
          'أعمل في هندسة تطبيقات الموبايل منذ 10 سنوات تقريبًا، إذا كانت ذاكرتي ما تزال بخير.',
          'أعزف الدرامز والجيتار وأغني، وأقوم بكل ذلك بطريقة خاطئة تمامًا ومنفصلة عن الواقع.',
          'أطبخ لدرجة أنني أستطيع إعداد بانيتوني مالح رائع جدًا.',
          'مسافر منفرد وحقائبي الظهرية جاهزة دائمًا حين يتبقى بعض المال لاكتشاف العالم.',
          'أتحدث البرتغالية البرازيلية والإنجليزية والإسبانية والروسية، وما زلت أتعلم الروسية... Привет мой друг',
          'أنا من أوساسكو وأحب ساو باولو، وأيضًا أشتكي منها عند أول فرصة، لكنني دائمًا مستعد لترشيح الأفضل فيها :)'
        ],
        whatIs: [
          'بدأت الفكرة من جدول بيانات كنت أسجل فيه أفضل الخروجات في المدينة.',
          'في البداية كنت أملؤه لنفسي فقط، لكن مع الوقت بدأت أشاركه مع الأصدقاء والمعارف حتى أصبح شيئًا أكبر.',
          'وهكذا وُلد Role Paulista: موقع بتجربة قريبة من التطبيق لتسهيل الوصول إلى أفضل التجارب في المدينة التي أنوي زيارتها.',
          'سواء كنت من ساو باولو أو من ولاية أخرى أو من بلد آخر، فهذه التجربة موجهة للجميع.'
        ],
        earn: [
          'الإجابة بسيطة جدًا: لا شيء. Role Paulista مشروع شخصي قائم على الشغف والحب لمدينة ساو باولو. ربما أكسب منه مستقبلًا عبر النشر أو الإعلانات؟ ربما، لكن الفكرة أن يظل الموقع مجانيًا دائمًا، سواء لمن يستخدمه أو للأماكن التي أنشر عنها.',
          'لن أقبل الحصول على المال مقابل ذلك، خصوصًا للحديث بشكل جيد عن مكان ما. أريد الحفاظ على نزاهة المحتوى وصدقه عبر زيارة الأماكن ونقل التجربة الحقيقية التي عشتها لكم.',
          'قد يستغرق مني بعض الوقت حتى أنشر على Instagram أو هنا في الموقع، لأنني حاليًا أقوم بدور فريق البنية التحتية والتطوير والتسويق والتصميم وصناعة المحتوى في الوقت نفسه، لذلك أعتذر إذا تأخر التحديث أحيانًا :)'
        ],
        howToHelp: [
          'إذا كنت تريد ترشيح مكان، أرسل لي رسالة على إنستغرام أو عبر البريد الإلكتروني مع معلومات المكان — سأبذل جهدي لزيارته ومساعدة الآخرين الذين يستخدمون هذا الموقع!',
          'وإذا أردت دعم استمرار هذا المشروع لجعل خروجاتك في ساو باولو أسهل وأكثر عملية، فقط وجّه الكاميرا إلى رمز QR بالأسفل :)'
        ],
        socialHeading: 'الشبكات الاجتماعية',
        socialDescription: 'يمكنك أن تجدني على الشبكات الاجتماعية أدناه :)'
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
      list: { nameHeader: 'NOME', neighborhoodHeader: 'QUARTIERE', variablePlace: 'Senza sede fissa', typeHeader: 'Tipo', orderNameAsc: 'NOME in ordine crescente A-Z', orderNeighborhoodAsc: 'QUARTIERE in ordine crescente A-Z' },
      footer: { home: 'Home', search: 'Cerca', about: 'Info' },
      searchPage: {
        title: 'Cerca un luogo',
        subtitle: 'Ricordi il nome del posto a memoria? Digita il nome qui sotto, è più veloce',
        fieldLabel: 'Nome del luogo:',
        resultsTitle: 'Risultati trovati',
        placeholder: 'Es.: Panetteria Pao Legal'
      },
      distanceSelect: { title: 'Seleziona la distanza', searchButton: 'Cerca' },
      placeDetail: {
        hoursTitle: 'Orari di apertura',
        opensMonday: 'apre il lunedì',
        opensSunday: 'apre la domenica',
        opensHoliday: 'apre nei giorni festivi',
        alreadyVisited: '✓ Ci sono gia stato',
        notVisited: '⚠️ Non ci sono ancora stato',
        viewHours: 'vedi orari',
        visitModalTitle: 'Informazioni sul luogo',
        visitModalParagraph: 'Luogo ancora da visitare. Le informazioni qui provengono dai suggerimenti di chi è già andato e me lo ha consigliato.',
        visitedModalParagraph: 'Luogo visitato. Le informazioni provengono da ciò che ho raccolto durante la visita — cose che ho ordinato o provato — e dai dettagli forniti dai responsabili.',
        neverEmphasis: '',
        priceLabel: 'Prezzo:',
        openNow: 'Aperto ora',
        closedNow: 'Chiuso',
        locationTitle: 'Posizione',
        locationDescription: 'Qui trovi le sedi di questo luogo e tutti gli indirizzi. Puoi tracciare il percorso come preferisci: con Google Maps o chiamando un Uber :)',
        websiteTitle: 'Sito del luogo',
        websiteSubtitle: 'Visita il sito di questo luogo e consulta le informazioni dettagliate',
        websiteButton: 'Apri sito',
        googleMapsButton: 'Apri sulla mappa',
        instagramTitle: 'Instagram',
        instagramSubtitle: 'Segui il profilo ufficiale:',
        follow: 'Segui',
        phoneTitle: 'Telefono',
        phonesSubtitle: 'Questi sono i contatti ufficiali di questo luogo',
        menuTitle: 'Menu',
        menuSubtitle: 'Guarda il menu del locale',
        menuButton: 'Apri menu',
        notesTitle: 'Note',
        onCall: 'Chiama'
      },
      openingHours: { title: 'Orari di apertura', checkAvailabilityMessage: 'Gli orari variano in base alla disponibilità. Controlla il sito e la pagina Instagram del luogo per maggiori dettagli', alwaysOpenMessage: 'Questo luogo è aperto 24 ore su 24', alwaysOpenLabel: 'Sempre aperto', checkAvailabilityLabel: 'Verifica disponibilità' },
      whereIsToday: { title: 'Allora, dove si va oggi?', subtitle: 'Lista dei luoghi dove sono stato, per categoria. Dai un’occhiata ;)', opensToday: 'Aperti oggi' },
      placeType: {
        RESTAURANT: 'Ristoranti',
        BARS: 'Bar',
        COFFEES: 'Caffetterie',
        NIGHTLIFE: 'Vita notturna',
        NATURE: 'Natura',
        TOURIST_SPOT: 'Turistici',
        FORFUN: 'Divertimento',
        STORES: 'Negozi',
        FREE: 'Gratis',
        PLEASURE: 'Casa del piacere'
      },
      placeList: {
        environmentTitle: 'Tipo di ambiente:',
        environmentTitlePlace: 'Tipo di luogo:',
        hoursUnavailable: 'Orari non disponibili',
        opensAtHeader: 'Apertura',
        opensAt: 'Apre alle {{time}}',
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
        motto: 'Dai un pesce a un uomo e lo nutrirai per un giorno. Insegnagli a pescare e lo nutrirai per tutta la vita',
        accordion: {
          aboutLabel: 'Su di me',
          whatIsLabel: 'Czym jest Rolê Paulista?',
          earnLabel: 'Ile na tym zarabiam?',
          howToHelpLabel: 'Posso contribuire in qualche modo?'
        },
        aboutList: [
          'Mobile Engineer da 10 anni (se la memoria non mi tradisce)',
          'Batteria, chitarra e voce, facendo tutto perfettamente male e fuori sincronia con la realtà',
          'Cucino al livello di preparare un panettone salato incredibile',
          'Viaggiatore solitario e backpacker quando c’è un po’ di soldi per esplorare il mondo',
          'Parlo portoghese (BR), inglese, spagnolo e russo (quest’ultimo lo sto ancora studiando... Привет мой друг)',
          'Di Osasco, amo São Paulo e la critico a ogni occasione, ma sempre pronto a consigliare il meglio :)'
        ],
        whatIs: [
          'L’idea è iniziata con un foglio di calcolo dove annotavo i migliori posti della città.',
          'All’inizio lo compilavo solo per me, ma con il tempo ho iniziato a condividerlo con amici e conoscenti finché è diventato qualcosa di più grande.',
          'Così è nato Rolê Paulista: un sito con esperienza simile a un’app per facilitare l’accesso alle migliori esperienze della città che visito.',
          'Che tu sia di São Paulo, di un altro stato o di un altro paese, l’esperienza è per tutti.'
        ],
        earn: [
          'La risposta è semplice: nulla. Rolê Paulista è un progetto personale fatto per passione e amore per São Paulo. Forse in futuro guadagnerò con pubblicazioni o AdSense, ma l’idea è che il sito resti SEMPRE gratuito.',
          'Non accetterò denaro per questo, soprattutto per parlare bene di un posto; voglio mantenere i contenuti autentici e onesti, visitando i luoghi e condividendo l’esperienza reale che ho avuto.',
          'Potrei impiegare un po’ di tempo ad aggiornare Instagram o il sito, perché al momento sono tutto il team: infrastruttura, sviluppo, marketing, design e contenuti.'
        ],
        howToHelp: [
          'Se vuoi consigliare un posto, mandami un messaggio su Instagram o via e‑mail con le informazioni del luogo — farò del mio meglio per visitarlo e aiutare altre persone che usano questo sito!',
          'Se vuoi aiutare a mantenere vivo questo progetto, per rendere i tuoi giri a SP sempre più leggeri e pratici, basta puntare la fotocamera sul QR code qui sotto :)'
        ],
        socialHeading: 'Reti sociali',
        socialDescription: 'Puoi trovarmi sui social qui sotto :)',
        social: {
          wallace: 'Wallace Baldenebre',
          role: 'Role Paulista',
          linkedin: 'LinkedIn',
          email: 'E-mail'
        },
        roleName: 'Role Paulista',
        bio: 'Sviluppatore mobile da oltre 8 anni, specialista Android e iOS. Appassionato di tecnologia, viaggi, cibo ed esplorazione di ogni angolo di São Paulo.'
      },
      travelItinerary: {
        title: 'Percorsi',
        placeholder: 'Percorsi a piedi suggeriti per visitare più luoghi vicini senza spendere in trasporti.',
        routeOptionsTitle: 'Opzioni di percorso:',
        createdForYouTitle: 'Itinerari creati per te :)',
        listTitle: 'Percorsi',
        viewRoute: 'Vedi percorso',
        modes: {
          walking: 'Tour a piedi',
          city: 'Tour in città'
        },
        routeOptions: {
          free: 'Gratis',
          nightlife: 'Vita notturna',
          bars: 'Bars',
          food: 'Gastronomia',
          history: 'Storia',
          museums: 'Musei',
          nature: 'Natura',
          forfun: 'Divertimento',
          more: 'Più opzioni'
        },
        placesCount: '{{count}} luoghi',
        tipTitle: 'Consiglio importante',
        tipDescription: 'Quando cammini per strada, stai attento con il telefono: evita di usarlo troppo e non chiedere aiuto agli sconosciuti. Hai notato qualcosa di strano? Entra in un luogo affollato e chiama il 190. A SP, la regola base è: massima attenzione a ciò che ti circonda e niente distrazioni',
        loadingPoints: 'Caricamento dei punti...',
        tourPointsLoadError: 'Non è stato ancora possibile caricare i punti del tour.',
        placesYouWillPass: 'Luoghi che attraverserai',
        routePlacesLoadError: 'Non è stato ancora possibile caricare i luoghi del percorso.',
        openInGoogleMaps: 'Apri in Google Maps'
      },
      tourType: {
        ALL: 'Tutto',
        FREE: 'Gratis',
        NIGHTLIFE: 'Vita notturna',
        BARS: 'Bars',
        GASTRONOMIC: 'Gastronomico',
        HISTORY: 'Storia',
        MUSEUMS: 'Musei',
        ARTISTIC: 'Artistico',
        NATURE: 'Natura',
        FORFUN: 'Divertimento',
        OTHERS: 'Altri'
      },
      nearbyMap: { title: 'Mappa vicina', noneInRadius: 'Nessun punto nel raggio attuale.', pointsDisplayed: '{{count}} punto(i) mostrati.', you: 'Tu' }
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
        close: 'Sluiten',
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
        scheduleRequired: 'Reservatie vereist',
        scheduleNotRequired: 'Geen reservering nodig',
        anySchedule: 'Elke',
        cityTitle: 'Stad',
        anyCity: 'Elke stad',
        priceTitle: 'Prijs',
        anyPrice: 'Elke prijs',
        button: 'Filters'
      },
      list: { nameHeader: 'NAAM', neighborhoodHeader: 'BUURT', variablePlace: 'Zonder vaste locatie', typeHeader: 'Type', orderNameAsc: 'NAAM in oplopende volgorde A-Z', orderNeighborhoodAsc: 'BUURT in oplopende volgorde A-Z' },
      footer: { home: 'Thuis', search: 'Zoeken', about: 'Over' },
      searchPage: {
        title: 'Zoek een plek',
        subtitle: 'Herinner je de naam van de plek nog? Typ de naam hieronder, dat is sneller',
        fieldLabel: 'Naam van de plek:',
        resultsTitle: 'Gevonden resultaten',
        placeholder: 'Bijv.: Bakkerij Pao Legal'
      },
      distanceSelect: { title: 'Selecteer de afstand', searchButton: 'Zoeken' },
      placeDetail: {
        hoursTitle: 'Openingstijden',
        opensMonday: 'open op maandag',
        opensSunday: 'open op zondag',
        opensHoliday: 'open op feestdagen',
        alreadyVisited: '✓ Ik ben hier geweest',
        notVisited: '⚠️ Ik ben er nog niet geweest',
        viewHours: 'bekijk tijden',
        visitModalTitle: 'Over deze locatie',
        visitModalParagraph: 'Locatie wacht op bezoek. De informatie op deze pagina komt van suggesties van andere mensen die er al zijn geweest en het mij hebben aangeraden.',
        visitedModalParagraph: 'Bezocht plaats. De informatie op deze pagina komt uit wat ik verzamelde tijdens mijn bezoek — elementen die ik bestelde of meemaakte — en informatie verstrekt door de verantwoordelijken van de locatie.',
        neverEmphasis: '',
        priceLabel: 'Prijs:',
        openNow: 'Nu open',
        closedNow: 'Gesloten',
        locationTitle: 'Locatie',
        locationDescription: 'Hier vind je de vestigingen van deze plek en alle adressen. Je kunt de route nog steeds plannen zoals jij wilt: met Google Maps of door een Uber te bestellen :)',
        websiteTitle: 'Website',
        websiteSubtitle: 'Bezoek de website van deze plek en bekijk de gedetailleerde informatie',
        websiteButton: 'Website openen',
        googleMapsButton: 'Openen op kaart',
        instagramTitle: 'Instagram',
        instagramSubtitle: 'Volg het officiele profiel:',
        follow: 'Volgen',
        phoneTitle: 'Telefoon',
        phonesSubtitle: 'Dit zijn de officiële contactgegevens van deze plek',
        menuTitle: 'Menu',
        menuSubtitle: 'Bekijk het menu van de locatie',
        menuButton: 'Menu openen',
        notesTitle: 'Notities',
        onCall: 'Bellen'
      },
      openingHours: { title: 'Openingstijden', checkAvailabilityMessage: 'Openingstijden variëren afhankelijk van beschikbaarheid. Controleer de website en de Instagram-pagina van de locatie voor meer informatie', alwaysOpenMessage: 'Deze locatie is 24 uur per dag open', alwaysOpenLabel: 'Altijd open', checkAvailabilityLabel: 'Controleer beschikbaarheid' },
      whereIsToday: { title: 'Dus, waar is het vandaag?', subtitle: 'Lijst met plekken waar ik ben geweest, per categorie. Kijk maar ;)', opensToday: 'Vandaag geopend' },
      placeType: {
        RESTAURANT: 'Restaurants',
        RESTAURANTS: 'Restaurants',
        BARS: 'Bars',
        COFFEES: 'Cafes',
        NIGHTLIFE: 'Nachtleven',
        NATURE: 'Natuur',
        TOURIST_SPOT: 'Toeristisch',
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
        opensAt: 'Opent om {{time}}',
        openNow: 'Nu open',
        opensSoon: 'Opent zo',
        opensTomorrowAt: 'Opent morgen om {{time}}',
        opensOnAt: 'Opent {{day}} om {{time}}',
        subtitleTemplate: 'Ontdek {{article}} {{noun}} van jouw type, dicht bij jou :)'
      },
      about: {
        title: 'Wie ben ik?',
        paragraph: 'Tijdelijke tekst voor de Over-pagina. De volledige lay-out komt later.'
      },
      aboutMe: {
        authorTag: 'Maker van Role Paulista',
        photoAlt: 'Foto van Wallace Baldenebre',
        name: 'Wallace Baldenebre',
        aboutHeading: 'Over mij',
        motto: 'Geef een man een vis en je voedt hem voor een dag. Leer hem vissen en je voedt hem voor het leven',
        accordion: {
          aboutLabel: 'Over mij',
          whatIsLabel: 'Wat is Rolê Paulista?',
          earnLabel: 'Hoeveel verdien ik hiermee?',
          howToHelpLabel: 'Kan ik op een of andere manier helpen?'
        },
        aboutList: [
          'Mobile Engineer al 10 jaar (als mijn geheugen me niet in de steek laat)',
          'Drums, gitaar en zang, alles perfect verkeerd en uit sync met de realiteit',
          'Ik kook op het niveau van een geweldige hartige panettone',
          'Solo reiziger en backpacker wanneer er wat extra geld is om de wereld te ontdekken',
          'Ik spreek Portugees (BR), Engels, Spaans en Russisch (die laatste studeer ik nog... Привет мой друг)',
          'Ik kom uit Osasco, hou van Sao Paulo, en klaag ook over de stad bij elke kans, maar altijd klaar om het beste aan te bevelen :)'
        ],
        whatIs: [
          'Het idee begon als een spreadsheet waarin ik de beste plekken van de stad bijhield.',
          'In het begin vulde ik het alleen voor mezelf in, maar na verloop van tijd begon ik het met vrienden en kennissen te delen tot het iets groters werd.',
          'Zo is Rolê Paulista ontstaan: een website met app-achtige ervaring om toegang te geven tot de beste stadsbelevingen die ik bezoek.',
          'Of je nu uit Sao Paulo komt, uit een andere staat of uit een ander land, de ervaring is voor iedereen.'
        ],
        earn: [
          'Het antwoord is simpel: niets. Rolê Paulista is een persoonlijk project uit passie en liefde voor Sao Paulo. Misschien verdien ik er in de toekomst iets aan met publicaties of AdSense, maar het idee is dat de site ALTIJD gratis blijft.',
          'Ik accepteer hier geen geld voor, vooral niet om goed te praten over een plek. Ik wil de inhoud authentiek en eerlijk houden door zelf te bezoeken en de echte ervaring te delen.',
          'Het kan even duren voordat ik updates plaats op Instagram of op de site, want op dit moment ben ik het hele team: infrastructuur, ontwikkeling, marketing, design en inhoud.'
        ],
        howToHelp: [
          'Bir yer önermek istersen, Instagram’dan ya da e‑posta ile bana mekanın bilgilerini gönder — mümkün olduğunca gidip deneyimleyerek bu siteyi kullanan diğer insanlara yardımcı olacağım!',
          'Bu projenin devamlılığına katkıda bulunup SP’deki gezilerini daha hafif ve pratik hale getirmek istersen, kameranı aşağıdaki QR koda tutman yeterli :)'
        ],
        socialHeading: 'Sociale netwerken',
        socialDescription: 'Je vindt me op de sociale netwerken hieronder :)',
        social: {
          wallace: 'Wallace Baldenebre',
          role: 'Role Paulista',
          linkedin: 'LinkedIn',
          email: 'E-mail'
        },
        roleName: 'Role Paulista',
        bio: 'Mobiele ontwikkelaar met meer dan 8 jaar ervaring, specialist in Android en iOS. Gepassioneerd door technologie, reizen, eten en het verkennen van elke hoek van Sao Paulo.'
      },
      travelItinerary: {
        title: 'Routes',
        placeholder: 'Voorgestelde wandelroutes zodat je meerdere plekken in de buurt kunt bezoeken zonder transportkosten.',
        routeOptionsTitle: 'Route-opties:',
        createdForYouTitle: 'Routes speciaal voor jou :)',
        listTitle: 'Routes',
        viewRoute: 'Bekijk route',
        modes: {
          walking: 'Wandeltour',
          city: 'Stadstour'
        },
        routeOptions: {
          free: 'Gratis',
          nightlife: 'Nachtleven',
          bars: 'Bars',
          food: 'Gastronomie',
          history: 'Geschiedenis',
          museums: 'Musea',
          nature: 'Natuur',
          forfun: 'Plezier',
          more: 'Meer opties'
        },
        placesCount: '{{count}} plekken',
        tipTitle: 'Belangrijke tip',
        tipDescription: 'Als je op straat loopt, wees alert met je telefoon: gebruik hem zo min mogelijk en vraag geen hulp aan vreemden. Zie je iets verdachts? Ga een drukke plek binnen en bel 190. In SP is de basis: volledige aandacht voor je omgeving en niet verslappen',
        loadingPoints: 'Punten worden geladen...',
        tourPointsLoadError: 'Het was nog niet mogelijk om de tourpunten te laden.',
        placesYouWillPass: 'Plekken waar je langs komt',
        routePlacesLoadError: 'Het was nog niet mogelijk om de plekken van de route te laden.',
        openInGoogleMaps: 'Openen in Google Maps'
      },
      tourType: {
        ALL: 'Alles',
        FREE: 'Gratis',
        NIGHTLIFE: 'Nachtleven',
        BARS: 'Bars',
        GASTRONOMIC: 'Gastronomisch',
        HISTORY: 'Geschiedenis',
        MUSEUMS: 'Musea',
        ARTISTIC: 'Artistiek',
        NATURE: 'Natuur',
        FORFUN: 'Plezier',
        OTHERS: 'Andere'
      },
      nearbyMap: { title: 'Kaart in de buurt', noneInRadius: 'Geen punten binnen de huidige straal.', pointsDisplayed: '{{count}} punt(en) getoond.', you: 'Jij' }
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
        noNearbyResultsRadius: 'Yakında hicbir yer yok...\n\nYakin yerleri listelemek icin mesafeyi degistirelim mi?',
        locationNotSupported: 'Tarayıcı bu konum belirleme özelliğini desteklemiyor.',
        locationDeniedInstructions: '',
        outsideGreaterSP: 'Buyuk Sao Paulo bolgesinin disindasin. Sehri yakinda ziyaret etmeye ne dersin? :)',
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
        scheduleNotRequired: 'Rezervasyon gerekmez',
        anySchedule: 'Herhangi',
        cityTitle: 'Şehir',
        anyCity: 'Herhangi bir şehir',
        priceTitle: 'Fiyat',
        anyPrice: 'Herhangi bir fiyat',
        button: 'Filtreler'
      },
      list: { nameHeader: 'İSİM', neighborhoodHeader: 'MAHALLE', variablePlace: 'Sabit konum yok', typeHeader: 'Tür', orderNameAsc: 'İSİM artan sırada A-Z', orderNeighborhoodAsc: 'MAHALLE artan sırada A-Z' },
      footer: { home: 'Anasayfa', search: 'Ara', about: 'Hakkında' },
      searchPage: {
        title: 'Bir yer ara',
        subtitle: 'Mekânın adını aklında tutuyor musun? Aşağıya adını yazmak daha hızlı',
        fieldLabel: 'Mekan adi:',
        resultsTitle: 'Bulunan sonuclar',
        placeholder: 'Örn.: Pao Legal Fırını'
      },
      distanceSelect: { title: 'Mesafeyi seç', searchButton: 'Ara' },
      placeDetail: {
        hoursTitle: 'Çalışma saatleri',
        opensMonday: 'pazartesi günü açılır',
        opensSunday: 'pazar günü açılır',
        opensHoliday: 'tatil günlerinde açılır',
        alreadyVisited: '✓ Oraya gittim',
        notVisited: '⚠️ Henuz gitmedim',
        viewHours: 'saatleri göster',
        visitModalTitle: 'Bu mekan hakkında',
        visitModalParagraph: 'Ziyarete açık yer. Bu sayfadaki bilgiler, oraya giden ve ziyaret etmemi tavsiye eden diğer kişilerin önerilerinden alınmıştır.',
        visitedModalParagraph: 'Ziyaret edilen yer. Bu sayfadaki bilgiler, ziyaretim sırasında topladıklarımdan — sipariş ettiğim veya deneyimlediğim öğelerden — ve mekân sorumluları tarafından sağlanan bilgilerden oluşmaktadır.',
        neverEmphasis: '',
        priceLabel: 'Fiyat:',
        openNow: 'Şu anda açık',
        closedNow: 'Kapalı',
        locationTitle: 'Konum',
        locationDescription: 'Burada bu mekânın tüm şubelerini ve adreslerini bulabilirsiniz. Ayrıca rotayı istediğiniz gibi çizebilirsiniz: Google Maps ile gidebilir ya da Uber çağırabilirsiniz :)',
        websiteTitle: 'Mekan web sitesi',
        websiteSubtitle: 'Bu mekânın web sitesini ziyaret edin ve detaylı bilgileri kontrol edin',
        websiteButton: 'Siteyi ac',
        googleMapsButton: 'Haritada aç',
        instagramTitle: 'Instagram',
        instagramSubtitle: 'Mekanının resmi profilini takip edin:',
        follow: 'Takip et',
        phoneTitle: 'Telefon',
        phonesSubtitle: 'Bunlar bu yerin resmi iletişim bilgileri',
        menuTitle: 'Menu',
        menuSubtitle: 'Mekan menüsünü görüntüle',
        menuButton: 'Menüyü aç',
        notesTitle: 'Notlar',
        onCall: 'Ara'
      },
      openingHours: { title: 'Çalışma saatleri', checkAvailabilityMessage: 'Çalışma saatleri kullanılabilirliğe göre değişir. Nasıl işlediğini anlamak için mekanın web sitesini ve Instagram sayfasını kontrol edin', alwaysOpenMessage: 'Bu mekan 24 saat açıktır', alwaysOpenLabel: 'Her zaman açık', checkAvailabilityLabel: 'Uygunluğu kontrol et' },
      whereIsToday: { title: 'Peki, bugün nereye gidiyoruz?', subtitle: 'Gittiğim yerlerin kategoriye göre listesi. Bir göz at ;)', opensToday: 'Bugün açık' },
      placeType: {
        RESTAURANT: 'Restoranlar',
        BARS: 'Barlar',
        COFFEES: 'Kafeler',
        NIGHTLIFE: 'Gece hayatı',
        NATURE: 'Doğa',
        TOURIST_SPOT: 'Turistik',
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
        opensAt: '{{time}} açılır',
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
        motto: 'Bir adama balik ver, onu bir gun doyurursun. Balik tutmayi ogret, onu bir omur doyurursun',
        accordion: {
          aboutLabel: 'Hakkımda',
          whatIsLabel: 'Role Paulista nedir?',
          earnLabel: 'Bundan ne kadar kazaniyorum?',
          howToHelpLabel: 'Bir şekilde katkıda bulunabilir miyim?'
        },
        aboutList: [
          '10 yildir Mobile Engineerim (hafizam beni yari yolda birakmazsa)',
          'Davul, gitar ve vokal; her seyi gerceklige tamamen ters ve uyumsuz sekilde yapmakta ustayim',
          'Harika bir tuzlu panettone yapabilecek seviyede yemek yaparim',
          'Dunyayi kesfetmek icin biraz para oldugunda solo gezgin ve backpackerim',
          'Portekizce (BR), Ingilizce, Ispanyolca ve Rusca konusuyorum (rusca hala ogreniyorum... Привет мой друг)',
          'Osasco’luyum, Sao Paulo’yu seviyorum ve firsat buldukca sehirden sikayet de ediyorum; ama en iyileri onermeye her zaman hazirim :)'
        ],
        whatIs: [
          'Fikir, sehirdeki en iyi mekanlari tuttugum bir tabloyla basladi.',
          'Baslarda sadece kendim icin dolduruyordum; zamanla arkadaslarimla ve tanidiklarla paylasmaya basladim ve bu daha buyuk bir seye donustu.',
          'Role Paulista boyle dogdu: ziyaret ettigim en iyi sehir deneyimlerine daha kolay ulasilmasi icin app benzeri deneyim sunan bir web sitesi.',
          'Ister Sao Paulo’dan ol, ister baska bir eyalet ya da ulkeden; bu deneyim herkes icin.'
        ],
        earn: [
          'Cevap basit: hicbir sey. Role Paulista, Sao Paulo’ya olan tutku ve sevgiden dogmus kisisel bir proje. Belki gelecekte yayinlardan veya AdSense\'ten gelir olur; ama fikir, sitenin HER ZAMAN ucretsiz kalmasi.',
          'Bunun icin para kabul etmeyecegim, ozellikle de bir mekanı iyi gostermek icin. Icerigin dogal ve durust kalmasini istiyorum.',
          'Instagram\'da veya sitede paylasimlar bazen gecikebilir; cunku su an altyapi, gelistirme, pazarlama, tasarim ve icerik dahil her seyi tek basima yurutuyorum.'
        ],
        howToHelp: [
          'Bir yer önermek istersen, Instagram’dan ya da e‑posta ile bana mekanın bilgilerini gönder — mümkün olduğunca gidip deneyimleyerek bu siteyi kullanan diğer insanlara yardımcı olacağım!',
          'Bu projenin devamlılığına katkıda bulunup SP’deki gezilerini daha hafif ve pratik hale getirmek istersen, kameranı aşağıdaki QR koda tutman yeterli :)'
        ],
        socialHeading: 'Sosyal aglar',
        socialDescription: 'Beni asagidaki sosyal aglarda bulabilirsin :)',
        social: {
          wallace: 'Wallace Baldenebre',
          role: 'Role Paulista',
          linkedin: 'LinkedIn',
          email: 'E-mail'
        },
        roleName: 'Role Paulista',
        bio: '8+ yil deneyimli mobile gelistirici, Android ve iOS uzmani. Teknoloji, seyahat, yemek ve Sao Paulo\'nun her kosesini kesfetmeye tutkun.'
      },
      travelItinerary: {
        title: 'Rotalar',
        placeholder: 'Ulasima para harcamadan birden fazla yakin noktayi gezebilmen icin onerilen yuruyus rotalari.',
        routeOptionsTitle: 'Rota secenekleri:',
        createdForYouTitle: 'Senin için oluşturulan rotalar :)',
        listTitle: 'Rotalar',
        viewRoute: 'Rotayi gor',
        modes: {
          walking: 'Yuruyus turu',
          city: 'Sehir turu'
        },
        routeOptions: {
          free: 'Ucretsiz',
          nightlife: 'Gece hayati',
          bars: 'Barlar',
          food: 'Yemek',
          history: 'Tarih',
          museums: 'Muzeler',
          nature: 'Doğa',
          forfun: 'Eğlence',
          more: 'Daha fazla secenek'
        },
        placesCount: '{{count}} yer',
        tipTitle: 'Önemli ipucu',
        tipDescription: 'Sokakta yürürken telefonuna karşı dikkatli ol: mümkün olduğunca az kullan ve yabancılardan yardım isteme. Garip bir şey fark ettin mi? Kalabalık bir yere gir ve 190’u ara. SP’de temel kural: çevrene tamamen dikkat et ve asla gevşeme',
        loadingPoints: 'Noktalar yükleniyor...',
        tourPointsLoadError: 'Tur noktaları henüz yüklenemedi.',
        placesYouWillPass: 'Geçeceğin yerler',
        routePlacesLoadError: 'Rota yerleri henüz yüklenemedi.',
        openInGoogleMaps: 'Google Haritalar’da aç'
      },
      tourType: {
        ALL: 'Hepsi',
        FREE: 'Ucretsiz',
        NIGHTLIFE: 'Gece hayati',
        BARS: 'Barlar',
        GASTRONOMIC: 'Gastronomik',
        HISTORY: 'Tarih',
        MUSEUMS: 'Muzeler',
        ARTISTIC: 'Sanatsal',
        NATURE: 'Doğa',
        FORFUN: 'Eğlence',
        OTHERS: 'Diger'
      },
      nearbyMap: { title: 'Yakin harita', noneInRadius: 'Mevcut yaricapta nokta yok.', pointsDisplayed: '{{count}} nokta gosterildi.', you: 'Sen' }
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
      list: { nameHeader: 'NAZWA', neighborhoodHeader: 'DZIELNICA', variablePlace: 'Bez stalej lokalizacji', typeHeader: 'Typ', orderNameAsc: 'NAZWA rosnąco A-Z', orderNeighborhoodAsc: 'DZIELNICA rosnąco A-Z' },
      footer: { home: 'Strona główna', search: 'Szukaj', about: 'O nas' },
      searchPage: {
        title: 'Wyszukaj miejsce',
        subtitle: 'Pamiętasz nazwę miejsca? Wpisz ją poniżej, tak będzie szybciej',
        fieldLabel: 'Nazwa miejsca:',
        resultsTitle: 'Znalezione wyniki',
        placeholder: 'Np.: Piekarnia Pao Legal'
      },
      distanceSelect: { title: 'Wybierz odległość', searchButton: 'Szukaj' },
      placeDetail: {
        hoursTitle: 'Godziny otwarcia',
        opensMonday: 'otwarte w poniedziałki',
        opensSunday: 'otwarte w niedziele',
        opensHoliday: 'otwarte w święta',
        alreadyVisited: '✓ Bylem',
        notVisited: '⚠️ Jeszcze nie bylem',
        viewHours: 'zobacz godziny',
        visitModalTitle: 'Informacje o miejscu',
        visitModalParagraph: 'Miejsce oczekujące na odwiedzenie. Informacje na tej stronie pochodzą od sugestii innych osób, które tam były i poleciły mi je odwiedzić.',
        visitedModalParagraph: 'Miejsce odwiedzone. Informacje na tej stronie pochodzą z tego, co zebrałem podczas wizyty — rzeczy, które zamówiłem lub przetestowałem — oraz z informacji przekazanych przez osoby odpowiedzialne za miejsce.',
        neverEmphasis: '',
        priceLabel: 'Cena:',
        openNow: 'Otwarte teraz',
        closedNow: 'Zamknięte',
        locationTitle: 'Lokalizacja',
        locationDescription: 'Tutaj znajdziesz wszystkie lokale tego miejsca i ich adresy. Trasę możesz wyznaczyć tak, jak wolisz: w Google Maps albo zamawiając Uber :)',
        websiteTitle: 'Strona miejsca',
        websiteSubtitle: 'Odwiedź stronę tego miejsca i sprawdź szczegółowe informacje',
        websiteButton: 'Otwórz stronę',
        googleMapsButton: 'Otwórz na mapie',
        instagramTitle: 'Instagram',
        instagramSubtitle: 'Śledź oficjalny profil lokalu:',
        follow: 'Śledź',
        phoneTitle: 'Telefon',
        phonesSubtitle: 'To są oficjalne kontakty tego miejsca',
        menuTitle: 'Menu',
        menuSubtitle: 'Zobacz menu miejsca',
        menuButton: 'Otwórz menu',
        notesTitle: 'Notatki',
        onCall: 'Zadzwoń'
      },
      openingHours: { title: 'Godziny otwarcia', checkAvailabilityMessage: 'Godziny otwarcia mogą się różnić w zależności od dostępności. Sprawdź stronę i profil na Instagramie, aby dowiedzieć się więcej', alwaysOpenMessage: 'To miejsce jest otwarte 24 godziny na dobę', alwaysOpenLabel: 'Zawsze otwarte', checkAvailabilityLabel: 'Sprawdź dostępność' },
      whereIsToday: { title: 'Więc, gdzie dziś?', subtitle: 'Lista miejsc, w których byłem, według kategorii. Rzuć okiem ;)', opensToday: 'Otwarte dziś' },
      placeType: {
        RESTAURANT: 'Restauracje',
        BARS: 'Bar',
        COFFEES: 'Kafeler',
        NIGHTLIFE: 'Życie nocne',
        NATURE: 'Przyroda',
        TOURIST_SPOT: 'Turystyczne',
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
        opensAt: 'Otwiera o {{time}}',
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
          whatIsLabel: 'Czym jest Rolê Paulista?',
          earnLabel: 'Ile na tym zarabiam?',
          howToHelpLabel: 'Czy mogę w jakiś sposób pomóc?'
        },
        aboutList: [
          'Mobile Engineer od 10 lat (o ile pamięć mnie nie zawodzi)',
          'Perkusja, gitara i wokal - robię wszystko perfekcyjnie źle i totalnie poza rytmem rzeczywistości',
          'Gotuję na poziomie, na którym potrafię zrobić genialny wytrawny panettone',
          'Podróżuję solo i z plecakiem zawsze, gdy tylko pojawi się trochę dodatkowych pieniędzy na odkrywanie świata',
          'Mówię po portugalsku (BR), angielsku, hiszpańsku i rosyjsku (ten ostatni nadal ćwiczę... Привет мой друг)',
          'Pochodzę z Osasco, kocham São Paulo i jednocześnie narzekam na to miasto przy każdej okazji - ale zawsze jestem gotów polecić to, co najlepsze :)'
        ],
        whatIs: [
          'Pomysł zaczął się od arkusza, w którym zapisywałem najlepsze miejscówki w mieście.',
          'Na początku prowadziłem go tylko dla siebie, ale z czasem zacząłem udostępniać go znajomym i przyjaciołom, aż przerodził się w coś większego.',
          'Tak powstał Rolê Paulista: strona z doświadczeniem podobnym do aplikacji, która ułatwia dostęp do najlepszych miejskich doświadczeń, jakie odwiedzam.',
          'Nieważne, czy jesteś z São Paulo, z innego stanu czy z innego kraju - to doświadczenie jest dla wszystkich.'
        ],
        earn: [
          'Odpowiedź jest prosta: nic. Rolê Paulista to projekt osobisty stworzony z pasji i miłości do São Paulo. Czy w przyszłości mogę zarabiać na publikacjach lub AdSense? Być może, ale idea jest taka, by strona ZAWSZE pozostała darmowa - zarówno dla odwiedzających, jak i dla publikowanych przeze mnie miejsc.',
          'Nie będę przyjmować za to pieniędzy, zwłaszcza za mówienie dobrze o danym miejscu; chcę zachować autentyczność i uczciwość treści, odwiedzając miejsca i dzieląc się prawdziwym doświadczeniem.',
          'Publikacje na Instagramie lub tutaj na stronie mogą czasem zająć trochę czasu, bo obecnie jestem całym zespołem naraz: infrastruktura, development, marketing, design i content, haha, więc wybacz, jeśli aktualizacje pojawiają się wolniej :)'
        ],
        howToHelp: [
          'Jeśli chcesz polecić jakieś miejsce, wyślij mi wiadomość na Instagramie lub e‑mail z informacjami o lokalu — postaram się je odwiedzić i w ten sposób pomóc innym, którzy korzystają z tej strony!',
          'Jeśli chcesz wesprzeć kontynuację tego projektu, aby Twoje wypady w SP były coraz łatwiejsze i wygodniejsze, wystarczy skierować aparat na kod QR poniżej :)'
        ],
        socialHeading: 'Media społecznościowe',
        socialDescription: 'Znajdziesz mnie w sieciach społecznych poniżej :)',
        social: {
          wallace: 'Wallace Baldenebre',
          role: 'Role Paulista',
          linkedin: 'LinkedIn',
          email: 'E-mail'
        },
        roleName: 'Role Paulista',
        bio: 'Programista mobile z ponad 8-letnim doświadczeniem, specjalista Android i iOS. Pasjonat technologii, podróży, jedzenia i odkrywania każdego zakątka São Paulo.'
      },
      travelItinerary: {
        title: 'Trasy',
        placeholder: 'Sugerowane trasy piesze, abyś mógł poznać kilka pobliskich miejsc bez wydawania na transport.',
        routeOptionsTitle: 'Opcje trasy:',
        createdForYouTitle: 'Trasy stworzone dla Ciebie :)',
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
          history: 'Historia',
          museums: 'Muzea',
          nature: 'Natura',
          forfun: 'Rozrywka',
          more: 'Więcej opcji'
        },
        placesCount: '{{count}} miejsc',
        tipTitle: 'Ważna wskazówka',
        tipDescription: 'Spacerując po ulicy, uważaj na telefon: używaj go jak najmniej i nie proś o pomoc nieznajomych. Zauważyłeś coś dziwnego? Wejdź do zatłoczonego miejsca i zadzwoń pod 190. W SP podstawowa zasada to: pełna uwaga na otoczenie i żadnego rozkojarzenia',
        loadingPoints: 'Ładowanie punktów...',
        tourPointsLoadError: 'Nie udało się jeszcze załadować punktów wycieczki.',
        placesYouWillPass: 'Miejsca, przez które przejdziesz',
        routePlacesLoadError: 'Nie udało się jeszcze załadować miejsc na trasie.',
        openInGoogleMaps: 'Otwórz w Google Maps'
      },
      tourType: {
        ALL: 'Wszystko',
        FREE: 'Darmowe',
        NIGHTLIFE: 'Życie nocne',
        BARS: 'Bar',
        GASTRONOMIC: 'Gastronomik',
        HISTORY: 'Historia',
        MUSEUMS: 'Muzea',
        ARTISTIC: 'Artystyczne',
        NATURE: 'Natura',
        FORFUN: 'Rozrywka',
        OTHERS: 'Inne'
      },
      nearbyMap: { title: 'Mapa w pobliżu', noneInRadius: 'Brak punktów w obecnym promieniu.', pointsDisplayed: '{{count}} punkt(y) wyświetlono.', you: 'Ty' }
    }
  }
};

const mergedResources = applyPtReferenceFallback(
  mergeResourceSets(resources, [placeTypeLabels, environmentLabels, environmentMoreLabels, routeOptionLabels, reportProblemLabels, homeNearMeLabels, priceRangeLabels, footerLabels, restaurantFiltersLabels, aboutMeDonationLabels])
);

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
