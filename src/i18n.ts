import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

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
        changeDistance: 'Alterar distância',
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
        priceTitle: 'Preço',
        anyPrice: 'Qualquer preço',
        button: 'Filtros'
      },
      whereIsToday: {
        title: 'E aí, onde é hoje?',
        subtitle: 'lista de lugares onde fui, por categoria, dá uma olhada ;)',
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
        aboutHeading: 'Sobre mim',
        socialHeading: 'Redes sociais',
        bio: 'Desenvolvedor Mobile há mais de 8 anos, especialista em Android e iOS. Apaixonado por tecnologia, viagens, restaurantes e por explorar cada canto novo de São Paulo.'
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
        PLEASURE: "Casa de Prazeres"
      },
      
      placeList: {
        environmentTitle: 'Tipo de ambiente:',
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
          NATURE: 'natureza',
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
        changeDistance: 'Cambiar distancia',
        all: 'Todo',
        filter: 'Filtro:',
        close: 'Cerrar',
        loading: 'Cargando…',
        loadError: 'Error al cargar datos.',
        noPlaces: 'No se encontraron lugares.',
        version: 'Versión'
      },
      whereIsToday: { title: '¿Y entonces, dónde es hoy?', subtitle: 'lista de lugares onde fui, por categoria, dá uma olhada ;)', opensToday: 'Abren hoy' },
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
        scheduleRequired: 'Es necesario reservar',
        scheduleNotRequired: 'No es necesario reservar',
        anySchedule: 'Cualquiera',
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
        alreadyVisited: '✓ Fui y recomiendo',
        notVisited: '⚠️ Aún no fui',
        visitModalTitle: 'Sobre los lugares que visité',
        visitModalParagraph: 'Lugar pendiente de visita. La información en esta página proviene de sugerencias de otras personas que fueron y me recomendaron conocer.',
        visitedModalParagraph: 'Local visitado. La información en esta página proviene de lo que recopilé cuando lo visité, elementos que pedí o probé, y la información recopilada por los responsables del lugar',
        neverEmphasis: '',
        priceLabel: 'Precio:',
        environmentTypeLabel: 'Tipo de ambiente:',
        hoursTitle: 'Horario de funcionamiento',
        viewHours: 'ver horarios',
        locationTitle: 'Ubicación',
        openNow: 'Abierto\u200B ahora',
        closedNow: 'Cerrado ahora',
        locationDescription: 'Aquí están las unidades de este establecimiento y todas las direcciones. También puedes trazar la ruta como prefieras: con Google Maps o pidiendo un Uber :)',
        streetPrefix: 'Calle:',
        googleMapsButton: 'Abrir en Google Maps',
        openUber: 'Abrir en Uber',
        instagramTitle: 'Instagram',
        instagramSubtitle: 'Sigue el perfil oficial:',
        follow: 'Seguir',
        phoneTitle: 'Teléfono',
        phonesSubtitle: 'Estos son los contactos oficiales de este lugar',
        menuTitle: 'Menú',
        menuSubtitle: 'Ver el menú del lugar',
        menuButton: 'Abrir menú',
        websiteTitle: 'Sitio del local',
        websiteSubtitle: 'Visita el sitio de este lugar y consulta la información detallada',
        websiteButton: 'Acceder al sitio',
        notesTitle: 'Notas',
        reportProblem: 'Reportar un problema',
        visitModalEnding: ''
      },
      openingHours: {
        title: 'Horarios de funcionamiento',
        closed: 'Cerrado',
        range: 'de {{open}} a {{close}}',
        notProvided: 'Horarios no informados.',
        followButton: 'Seguir',
        checkAvailabilityMessage: 'Los horarios varían según la disponibilidad. Verifica en el sitio web y en la página de Instagram del lugar para entender cómo funciona',
        alwaysOpenMessage: 'Este lugar está abierto las 24 horas',
        checkAvailabilityLabel: 'Verificar disponibilidad'
      },
      footer: { home: 'Inicio', search: 'Buscar', about: 'Sobre' },
      distanceSelect: { title: 'Seleccione la distancia', searchButton: 'Buscar' },
      nearbyMap: {
        title: 'Mapa cercano',
        noneInRadius: 'No hay puntos en el radio actual.',
        pointsDisplayed: '{{count}} punto(s) mostrados.',
        you: 'Tú'
      },
      neighborhoodList: {
        intro: 'Descubre lugares increíbles en este barrio,\nselecciona una de las opciones ci-dessous :)'
      },
      recommendationsOrigin: { title: '¿De dónde vienen estas recomendaciones?' },
      support: { title: 'Apoya el sitio' },
      about: { title: '¿Quién soy?', paragraph: 'Página sobre ti. Diseño vendrá después.' },
      aboutMe: {
        authorTag: 'Creador de Role Paulista',
        aboutHeading: 'Sobre mí',
        socialHeading: 'Redes sociales',
        bio: 'Desarrollador móvil hace más de 8 años. Apasionado por tecnología, viajes y explorar São Paulo.'
      },
      howToRecommend: { title: '¿Cómo recomiendo un lugar?' },
      placeType: {
        RESTAURANT: 'Restaurantes', BARS: 'Bares', COFFEES: 'Cafeterías', NIGHTLIFE: 'Vida\u200B nocturna', NATURE: 'Naturaleza', TOURIST_SPOT: 'Puntos\u200B turísticos', FORFUN: 'Diversión', STORES: 'Tiendas', FREE: 'Gratuitos', PLEASURE: 'Casa de Prazeres'
      }
      ,
      placeList: {
        environmentTitle: 'Tipo de ambiente:',
        hoursUnavailable: 'Horario no disponible',
        opensAtHeader: 'Abre a las...',
        openNow: 'Abierto ahora',
        opensTomorrowAt: 'Abre mañana a las {{time}}',
        // placeholder from pt
        // 'Abertura'
        subtitleTemplate: 'Descubre {{article}} {{noun}} de tu tipo, más cerca de ti :)',
        article: {
          RESTAURANT: 'el',
          BARS: 'el',
          COFFEES: 'la',
          NIGHTLIFE: 'la',
          NATURE: 'la',
          TOURIST_SPOT: 'el',
          FREE: 'el'
        },
        noun: {
          RESTAURANT: 'restaurante',
          BARS: 'bar',
          COFFEES: 'cafeteria',
          NIGHTLIFE: 'vida nocturna',
          NATURE: 'naturaleza',
          TOURIST_SPOT: 'lugar turístico',
          FREE: 'evento gratuito'
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
        back: 'Retour', details: 'En savoir plus', selectLanguage: 'Choisir une langue', changeDistance: 'Changer distance', all: 'Tout', filter: 'Filtre:', close: 'Fermer', loading: 'Chargement…', loadError: 'Erreur de chargement.', noPlaces: 'Aucun lieu trouvé.', version: 'Version'
      },
      whereIsToday: { title: 'Alors, c’est où aujourd’hui?', subtitle: 'lista de lugares onde fui, por categoria, dá uma olhada ;)', opensToday: 'Ouvrent aujourd\'hui' },
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
        visitModalTitle: 'À propos des lieux visités',
        visitModalParagraph: 'Lieu en attente de visite. Les informations contenues sur cette page proviennent de suggestions d\'autres personnes qui s\'y sont rendues et me l\'ont recommandé.',
        visitedModalParagraph: 'Lieu visité. Les informations contenues sur cette page proviennent de ce que j\'ai recueilli lors de ma visite, des éléments que j\'ai commandés ou testés, et des informations fournies par les responsables du lieu',
        neverEmphasis: '',
        priceLabel: 'Prix :',
        environmentTypeLabel: 'Type d’ambiance :',
        hoursTitle: 'Horaires',
        viewHours: 'voir horaires',
        locationTitle: 'Localisation',
        openNow: 'Ouvert\u200B maintenant',
        closedNow: 'Fermé maintenant',
        locationDescription: 'Ici, vous trouverez les unités de cet établissement et toutes les adresses. Vous pouvez aussi tracer l’itinéraire comme vous préférez : avec Google Maps ou en commandant un Uber :)',
        streetPrefix: 'Rue :',
        googleMapsButton: 'Ouvrir Google Maps',
        openUber: 'Ouvrir dans Uber',
        instagramTitle: 'Instagram',
        instagramSubtitle: 'Suivez le profil officiel :',
        follow: 'Suivre',
        phoneTitle: 'Téléphone',
        phonesSubtitle: 'Voici les contacts officiels de cet endroit',
        menuTitle: 'Menu',
        menuSubtitle: 'Voir le menu',
        menuButton: 'Ouvrir menu',
        websiteTitle: 'Site du lieu',
        websiteSubtitle: 'Visitez le site de ce lieu et consultez les informations détaillées',
        websiteButton: 'Accéder au site',
        notesTitle: 'Notes',
        reportProblem: 'Signaler un problème',
        visitModalEnding: ''
      },
      openingHours: { title: 'Horaires', closed: 'Fermé', range: 'de {{open}} à {{close}}', notProvided: 'Horaires non fournis.', followButton: 'Suivre', checkAvailabilityMessage: 'Les horaires varient selon la disponibilité. Consultez le site et la page Instagram du lieu pour en savoir plus', alwaysOpenMessage: 'Cet endroit est ouvert 24h/24', checkAvailabilityLabel: 'Vérifier la disponibilité' },
      footer: { home: 'Accueil', search: 'Chercher', about: 'À propos' },
      distanceSelect: { title: 'Sélectionnez la distance', searchButton: 'Chercher' },
      nearbyMap: { title: 'Carte proximité', noneInRadius: 'Aucun point dans le rayon.', pointsDisplayed: '{{count}} point(s) affiché(s).', you: 'Vous' },
      neighborhoodList: {
        intro: 'Découvrez des lieux incroyables dans ce quartier,\nchoisissez l\'une des options ci‑dessous :)'
      },
      recommendationsOrigin: { title: '¿De dónde vienen estas recomendaciones?' },
      support: { title: 'Soutenir le site' },
      about: { title: 'Qui suis-je ?', paragraph: 'Page à propos. Maquette à venir.' },
      aboutMe: { authorTag: 'Créateur de Role Paulista', aboutHeading: 'À propos de moi', socialHeading: 'Réseaux sociaux', bio: 'Développeur mobile depuis plus de 8 ans, passionné de technologie et d’exploration de São Paulo.' },
      howToRecommend: { title: 'Comment recommander un lieu ?' },
      placeType: { RESTAURANT: 'Restaurants', BARS: 'Bars', COFFEES: 'Cafés', NIGHTLIFE: 'Vie\u200B nocturne', NATURE: 'Naturaleza', TOURIST_SPOT: 'Sites\u200B touristiques', FORFUN: 'Divertissement', STORES: 'Magasins', FREE: 'Gratuit', PLEASURE: 'Casa de Prazeres' }
    }
  },
  ru: {
    translation: {
      home: { nearMeTitle: 'Рядом со мной', nearMeSubtitle: '(показаны места в радиусе {{km}} км рядом с вами)', allowLocation: 'Упс, мы не нашли ваше местоположение...\n\nЧтобы найти места рядом с вами, нажмите кнопку ниже:', allowLocationButton: 'Разрешить геолокацию', loadingCategories: 'Загрузка категорий...', increaseRadius: 'Увеличить радиус', neighborhoodsTitle: 'По район', neighborhoodsTagline: 'Вы в одном из этих районов? Рядом есть интересное!', viewMoreNeighborhoods: 'ещё районы', viewMore: 'Больше вариантов', noNearbyResultsRadius: 'Рядом с вами ничего нет...\n\nКак насчёт изменить расстояние, чтобы\nпоказать ближайшие места?', locationNotSupported: 'Геолокация не поддерживается в этом браузере.', locationDeniedInstructions: '', outsideGreaterSP: 'Вы находитесь вне региона Большого Сан-Паулу. Как насчёт посетить город в ближайшее время? :)', viewPlace: 'посмотреть место', viewPlaces: 'посмотреть места' },
      header: { title: 'Role Paulista', tagline: 'Лучшие рекомендации, в нескольких кликах' },
      common: { back: 'Назад', details: 'Узнать больше', selectLanguage: 'Выберите язык', changeDistance: 'Изменить расстояние', all: 'Все', filter: 'Фильтр:', close: 'Закрыть', loading: 'Загрузка…', loadError: 'Ошибка загрузки данных.', noPlaces: 'Ничего не найдено.', version: 'Версия' },
      filters: { title: 'Фильтры', subtitle: 'Настройте фильтры ниже, чтобы уточнить результаты', sortingTitle: 'Сортировка', hoursTitle: 'Часы', openNowLabel: 'Открыто сейчас', openNow: 'Открыто сейчас', anyHourLabel: 'Любое время', anyHour: 'Любое время', scheduleTitle: 'Бронирование', scheduleRequired: 'Требуется бронирование', scheduleNotRequired: 'Бронирование не требуется', anySchedule: 'Любой', priceTitle: 'Цена', anyPrice: 'Любая цена', button: 'Фильтры' },
      placeDetail: { loading: 'Загрузка деталей...', notFound: 'Место не найдено.', opensMonday: 'открыто по понедельникам', opensSunday: 'открыто по воскресеньям', opensHoliday: 'открыто в праздники', alreadyVisited: '✓ Был и рекомендую', notVisited: '⚠️ Еще не был', visitModalTitle: 'О посещенных местах', visitModalParagraph: 'Место, ожидающее посещения. Информация на этой странице основана на рекомендациях других людей, которые побывали там и посоветовали мне посетить.', visitedModalParagraph: 'Место посещено. Информация на этой странице основана на том, что я собрал во время посещения: на том, что я заказывал или пробовал, а также на данных, переданных ответственными за заведение.', neverEmphasis: '', priceLabel: 'Цена:', environmentTypeLabel: 'Тип атмосферы:', hoursTitle: 'Время работы', viewHours: 'смотреть часы', locationTitle: 'Локация', openNow: 'Открыто\u200B сейчас', closedNow: 'Закрыто сейчас', locationDescription: 'Здесь указаны все филиалы этого места и их адреса. Вы также можете построить маршрут как вам удобнее: через Google Maps или заказав Uber :)', streetPrefix: 'Улица:', googleMapsButton: 'Открыть в Google Maps', instagramTitle: 'Instagram', instagramSubtitle: 'Подписаться на официальный профиль:', follow: 'Подписаться', phoneTitle: 'Телефон', phonesSubtitle: 'Это официальные контакты этого места', menuTitle: 'Меню', menuSubtitle: 'Посмотреть меню', menuButton: 'Открыть меню', websiteTitle: 'Сайт заведения', websiteSubtitle: 'Перейдите на сайт этого места и ознакомьтесь с подробной информацией', websiteButton: 'Перейти на сайт', notesTitle: 'Заметки', reportProblem: 'Сообщить о проблеме', visitModalEnding: '' },
      openingHours: { title: 'Время работы', closed: 'Закрыто', range: 'с {{open}} до {{close}}', notProvided: 'Время не указано.', followButton: 'Подписаться', checkAvailabilityMessage: 'Часы работы зависят от наличия. Проверьте сайт и страницу в Instagram заведения, чтобы узнать подробности', alwaysOpenMessage: 'Это место открыто круглосуточно', checkAvailabilityLabel: 'Проверить доступность' },
      footer: { home: 'Главная', search: 'Поиск', about: 'О сайте' },
      distanceSelect: { title: 'Выберите расстояние', searchButton: 'Искать' },
      nearbyMap: { title: 'Карта рядом', noneInRadius: 'Нет точек в текущем радиусе.', pointsDisplayed: '{{count}} точк(и).', you: 'Вы' },
      neighborhoodList: {
        intro: 'Откройте для себя потрясающие места в этом районе,\nвыберите один из вариантов ниже :)'
      },
      recommendationsOrigin: { title: 'Откуда эти рекомендации?' },
      support: { title: 'Поддержите сайт' },
      about: { title: 'Кто я?', paragraph: 'Страница о вас. Макет позже.' },
      aboutMe: { authorTag: 'Создатель Role Paulista', aboutHeading: 'Обо мне', socialHeading: 'Соцсети', bio: 'Мобильный разработчик 8+ лет. Люблю технологии, путешествия и исследовать Сан-Паулу.' },
      howToRecommend: { title: 'Как порекомендовать место?' },
      placeList: {
        environmentTitle: 'Тип окружения:',
        hoursUnavailable: 'Часы недоступны',
        opensAtHeader: 'Открывается в',
        openNow: 'Открыто сейчас',
        opensTomorrowAt: 'Откроется завтра в {{time}}',
        // placeholder from pt: 'Abertura'
        subtitleTemplate: 'Откройте {{article}} {{noun}} вашего типа, ближайший к вам :)'
      }
    }
  },
  zh: {
    translation: {
      home: { nearMeTitle: '附近', nearMeSubtitle: '（显示你附近 {{km}}km 半径内的地点）', allowLocation: '哎呀，我们未能找到您的位置...\n\n要查找您附近的地点，请点击下方按钮：', allowLocationButton: '允许定位', loadingCategories: '正在加载分类...', increaseRadius: '增加半径', neighborhoodsTitle: '按街区', neighborhoodsTagline: '你在这些街区之一吗？附近有好地方！', viewMoreNeighborhoods: '更多街区', viewMore: '更多选项', noNearbyResultsRadius: '你附近没有找到任何地点...\n\n要不要调整距离，\n以便列出附近的地点？', locationNotSupported: '此浏览器不支持地理定位。', locationDeniedInstructions: '', outsideGreaterSP: '您位于大圣保罗地区之外。要不要考虑近期来这座城市游玩？ :)', viewPlace: '查看地点', viewPlaces: '查看地点列表' },
      header: { title: 'Role Paulista', tagline: '最好的推荐，几次点击即可到达' },
      common: { back: '返回', details: '了解更多', selectLanguage: '选择语言', changeDistance: '更改距离', all: '全部', filter: '筛选:', close: '关闭', loading: '加载中…', loadError: '加载数据出错。', noPlaces: '未找到地点。', version: '版本' },
      filters: { title: '筛选', subtitle: '调整以下筛选以缩小结果范围', sortingTitle: '排序', hoursTitle: '营业时间', openNowLabel: '正在营业', openNow: '正在营业', anyHourLabel: '任意时间', anyHour: '任意时间', scheduleTitle: '预约', scheduleRequired: '需要预约', scheduleNotRequired: '无需预约', anySchedule: '不限', priceTitle: '价格', anyPrice: '任意价格', button: '筛选' },
      placeDetail: { loading: '正在加载详情...', notFound: '未找到地点。', opensMonday: '周一营业', opensSunday: '周日营业', opensHoliday: '节假日营业', alreadyVisited: '✓ 我去过并推荐', notVisited: '⚠️ 还没去过', viewHours: 'Öffnungszeiten anzeigen',
        visitModalTitle: '关于该地点',
        visitModalParagraph: '待访问地点。本页面的信息来自其他曾去过并推荐我去的人士的建议。',
        visitedModalParagraph: '已访问地点。本页信息来自我访问时收集的内容、我点过或体验过的项目，以及场所负责人提供的信息。',
        neverEmphasis: '',
        openNow: '正在营业',
        closedNow: '已打烊',
        locationDescription: '这里列出了这家店的所有门店与地址。你也可以按自己喜欢的方式规划路线：用 Google Maps 或叫一辆 Uber :)',
        websiteTitle: '网站',
        websiteSubtitle: '访问该地点的网站并查看详细信息',
        websiteButton: '访问网站',
        openUber: 'In Uber öffnen',
        instagramTitle: 'Instagram',
        instagramSubtitle: '关注官方账号：',
        follow: '关注',
        phoneTitle: '电话',
        phonesSubtitle: '这些是该地点的官方联系方式',
        menuTitle: '菜单',
        menuSubtitle: '查看店铺菜单',
        menuButton: '打开菜单',
        notesTitle: '备注',
        reportProblem: '报告问题',
        visitModalEnding: 'Ich werde Orte empfehlen, die Sie nicht besuchen sollten :)'
      },
      openingHours: { checkAvailabilityMessage: 'Die Öffnungszeiten variieren je nach Verfügbarkeit. Prüfen Sie die Website und die Instagram-Seite des Ortes, um Details zu erfahren', alwaysOpenMessage: 'Dieser Ort ist 24 Stunden geöffnet', checkAvailabilityLabel: 'Verfügbarkeit prüfen' },
      footer: { home: '首页', search: '搜索', about: '关于' },
      distanceSelect: { title: '选择距离', searchButton: '搜索' },
      nearbyMap: { title: '附近地图', noneInRadius: '当前半径内无点。', pointsDisplayed: '{{count}} 个点。', you: '你' },
      neighborhoodList: {
        intro: '在这个街区发现超棒的地方，\n请选择下面的选项之一 :)'
      },
      recommendationsOrigin: { title: '这些推荐来自哪里？' },
      support: { title: '支持本网站' },
      about: { title: '我是谁？', paragraph: '关于页面。稍后提供设计。' },
      aboutMe: { authorTag: 'Role Paulista 创作者', aboutHeading: '关于我', socialHeading: '社交网络', bio: '8+年移动开发，热爱技术、旅行、美食及探索圣保罗。' },
      howToRecommend: { title: '如何推荐一个地点？' },
      placeType: { RESTAURANT: '餐厅', BARS: '酒吧', COFFEES: '咖啡店', NIGHTLIFE: '夜生活', NATURE: '自然', TOURIST_SPOT: '旅游景点', FORFUN: '娱乐', STORES: '商店', FREE: '免费', PLEASURE: 'Casa de Prazeres' }
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
        outsideGreaterSP: 'You are outside the Greater São Paulo region. How about visiting the city soon? :)'
      },
      header: {
        title: 'Role Paulista',
        tagline: 'The best recommendation, just a few clicks away'
      },
      common: {
        back: 'Back',
        details: 'Learn more',
        selectLanguage: 'Select a language',
        changeDistance: 'Change distance',
        all: 'All',
        filter: 'Filter:',
        close: 'Close',
        loading: 'Loading…',
        loadError: 'Error loading data.',
        noPlaces: 'No places found.',
        version: 'Version',
      },
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
        alreadyVisited: '✓ I have been and recommend',
        notVisited: '⚠️ Not visited yet',
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
        instagramTitle: 'Instagram',
        instagramSubtitle: 'Follow the official profile:',
        follow: 'Follow',
        phoneTitle: 'Phone',
        phonesSubtitle: 'Dies sind die offiziellen Kontakte dieses Ortes',
        menuTitle: 'Menu',
        menuSubtitle: 'Speisekarte des Standorts anzeigen',
        menuButton: 'Speisekarte öffnen',
        notesTitle: 'Hinweise',
        reportProblem: 'Ein Problem melden',
        visitModalEnding: 'Ich werde Orte empfehlen, die Sie nicht besuchen sollten :)'
      },
      openingHours: { checkAvailabilityMessage: 'Die Öffnungszeiten variieren je nach Verfügbarkeit. Prüfen Sie die Website und die Instagram-Seite des Ortes, um Details zu erfahren', alwaysOpenMessage: 'Dieser Ort ist 24 Stunden geöffnet', checkAvailabilityLabel: 'Verfügbarkeit prüfen' },
      placeList: {
        environmentTitle: 'Environment type:',
        hoursUnavailable: 'Hours unavailable',
        opensAtHeader: 'Opens at',
        openNow: 'Open now',
        opensTomorrowAt: 'Opens tomorrow at {{time}}',
        subtitleTemplate: 'Discover {{article}} {{noun}} of your type closest to you :)'
      },
      about: {
        title: 'Who bin ich?',
        paragraph: 'Platzhalter für die „Über“-Seite. Das vollständige Layout folgt später.'
      },
      aboutMe: {
        authorTag: 'Ersteller von Role Paulista',
        aboutHeading: 'Über mich',
        socialHeading: 'Soziale Netzwerke',
        bio: 'Mobile-Entwickler mit über 8 Jahren Erfahrung, Spezialist für Android & iOS. Begeistert von Technologie, Reisen, Restaurants und dem Erkunden von São Paulo.'
      }
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
        neighborhoodsTagline: 'Bist du in einem dieser Viertel? Gute Orte in der Nähe!',
        viewMoreNeighborhoods: 'mehr Viertel anzeigen',
        viewMore: 'Mehr Optionen',
        noNearbyResultsRadius: 'In Ihrer Nähe gibt es nichts...\n\nWie wäre es, die Entfernung zu ändern, um\nnahegelegene Orte aufzulisten?',
        locationNotSupported: 'Geolokalisierung wird von diesem Browser nicht unterstützt.',
        locationDeniedInstructions: '',
        outsideGreaterSP: 'Sie befinden sich außerhalb der Metropolregion São Paulo. Wie wäre es, die Stadt bald zu besuchen? :)'
      },
      header: {
        title: 'Role Paulista',
        tagline: 'Die beste Empfehlung, nur wenige Klicks entfernt'
      },
      common: {
        back: 'Zurück',
        details: 'Mehr erfahren',
        selectLanguage: 'Wählen Sie eine Sprache',
        changeDistance: 'Entfernung ändern',
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
        priceTitle: 'Preis',
        anyPrice: 'Beliebiger Preis',
        button: 'Filter'
      },
      list: { nameHeader: 'NAME', neighborhoodHeader: 'STADTTEIL', typeHeader: 'Typ', orderNameAsc: 'NAME in aufsteigender Reihenfolge A-Z', orderNeighborhoodAsc: 'STADTTEIL in aufsteigender Reihenfolge A-Z' },
      footer: { home: 'Start', search: 'Suchen', about: 'Über' },
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
        instagramTitle: 'Instagram',
        instagramSubtitle: 'Follow the official profile:',
        follow: 'Follow',
        phoneTitle: 'Telefon',
        phonesSubtitle: 'Dies sind die offiziellen Kontakte dieses Ortes',
        menuTitle: 'Speisekarte',
        menuSubtitle: 'Speisekarte des Standorts anzeigen',
        menuButton: 'Speisekarte öffnen',
        notesTitle: 'Hinweise',
        reportProblem: 'Ein Problem melden',
        visitModalEnding: 'Ich werde Orte empfehlen, die Sie nicht besuchen sollten :)'
      },
      openingHours: { checkAvailabilityMessage: 'Die Öffnungszeiten variieren je nach Verfügbarkeit. Prüfen Sie die Website und die Instagram-Seite des Ortes, um Details zu erfahren', alwaysOpenMessage: 'Dieser Ort ist 24 Stunden geöffnet', checkAvailabilityLabel: 'Verfügbarkeit prüfen' },
      placeList: {
        environmentTitle: 'Umgebungstyp:',
        hoursUnavailable: 'Öffnungszeiten nicht verfügbar',
        opensAtHeader: 'Öffnet um',
        openNow: 'Jetzt geöffnet',
        opensTomorrowAt: 'Öffnet morgen um {{time}}',
        subtitleTemplate: 'Entdecken Sie {{article}} {{noun}} in Ihrer Nähe, passend zu Ihrem Stil :)'
      },
      about: {
        title: 'Wer bin ich?',
        paragraph: 'Platzhalter für die „Über“-Seite. Das vollständige Layout folgt später.'
      },
      aboutMe: {
        authorTag: 'Ersteller von Role Paulista',
        aboutHeading: 'Über mich',
        socialHeading: 'Soziale Netzwerke',
        bio: 'Mobile-Entwickler mit über 8 Jahren Erfahrung, Spezialist für Android & iOS. Begeistert von Technologie, Reisen, Restaurants und dem Erkunden von São Paulo.'
      }
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
        outsideGreaterSP: 'あなたはグランサンパウロ地域の外にいます。近いうちに街を訪れてみませんか？ :)'
      },
      header: {
        title: 'Role Paulista',
        tagline: '私が行った場所のおすすめ — 数回のクリックで'
      },
      common: {
        back: '戻る',
        details: '詳しく見る',
        selectLanguage: '言語を選択',
        changeDistance: '距離を変更',
        all: 'すべて',
        filter: 'フィルター：',
        close: '閉じる',
        loading: '読み込み中…',
        loadError: 'データの読み込み中にエラーが発生しました。',
        noPlaces: '場所が見つかりません。',
        version: 'バージョン'
      },
      filters: {
        title: 'フィルター',
        subtitle: '以下のフィルターで結果を絞り込みます',
        sortingTitle: '並び替え',
        hoursTitle: '営業時間',
        openNowLabel: '営業中',
        openNow: '営業中',
        anyHourLabel: '任意の時間',
        anyHour: '任意の時間',
        scheduleTitle: '予約',
        scheduleRequired: '予約が必要',
        scheduleNotRequired: '予約不要',
        anySchedule: '指定なし',
        priceTitle: '価格',
        anyPrice: '任意の価格',
        button: 'フィルター'
      },
      list: { nameHeader: '名前', neighborhoodHeader: '地区', typeHeader: '種類', orderNameAsc: '名前 昇順 A-Z', orderNeighborhoodAsc: '地区 昇順 A-Z' },
      footer: { home: 'ホーム', search: '検索', about: '概要' },
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
        visitedModalParagraph: '訪問済みの場所。 このページの情報は、私が訪問した際に収集した内容（注文した品や体験した項目）および現地の担当者から提供された情報に基づいています。',
        neverEmphasis: '',
        openNow: '営業中',
        closedNow: '閉店',
        websiteTitle: '公式サイト',
        websiteSubtitle: 'この施設のサイトにアクセスして詳細情報をご確認ください',
        websiteButton: 'サイトを開く',
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
        menuButton: 'メニューを開く',
        notesTitle: '備考'
      },
      openingHours: { checkAvailabilityMessage: '営業時間は都度変動します。詳細は施設のウェブサイトおよびInstagramページでご確認ください', alwaysOpenMessage: 'この場所は24時間営業です', checkAvailabilityLabel: '空き状況を確認' },
      placeList: {
        environmentTitle: '環境タイプ：',
        hoursUnavailable: '営業時間情報なし',
        opensAtHeader: '開店時間',
        openNow: '営業中',
        opensTomorrowAt: '明日 {{time}} に開店',
        subtitleTemplate: 'あなたのタイプに合った{{article}} {{noun}}で、最も近いものを見つけよう :)'
      },
      about: {
        title: '私は誰？',
        paragraph: '概要ページのプレースホルダー。完全なレイアウトは後で追加します。'
      },
      aboutMe: {
        authorTag: 'Role Paulista の作成者',
        aboutHeading: '私について',
        socialHeading: 'ソーシャルネットワーク',
        bio: 'モバイル開発者（8年以上）、Android と iOS の専門家。テクノロジー、旅行、レストラン、サンパウロのあらゆる場所を探索することに情熱を持っています。'
      }
    }
  }
  ,
  ar: {
    translation: {
      home: {
        nearMeTitle: 'بالقرب مني',
        nearMeSubtitle: '(يعرض الأماكن ضمن دائرة نصف قطرها {{km}} كم بالقرب منك)',
        allowLocation: 'عذرًا، لم نتمكن من العثور على موقعك...\n\nللعثور على أماكن بالقرب منك، انقر على الزر أدناه:',
        allowLocationButton: 'السماح بالموقع',
        loadingCategories: 'جارٍ تحميل الفئات...',
        increaseRadius: 'زيادة النطاق',
        neighborhoodsTitle: 'حسب الحي',
        neighborhoodsTagline: 'هل أنت في أحد هذه الأحياء؟ هناك أماكن جيدة بالقرب منك!',
        viewMoreNeighborhoods: 'عرض المزيد من الأحياء >',
        viewMore: 'خيارات أكثر',
        noNearbyResultsRadius: 'لا يوجد شيء بالقرب منك...\n\nما رأيك بتغيير المسافة\nلعرض الأماكن القريبة؟',
        locationNotSupported: 'المتصفح لا يدعم تحديد الموقع الجغرافي.',
        locationDeniedInstructions: '',
        outsideGreaterSP: 'أنت خارج منطقة ساو باولو الكبرى. ماذا عن زيارة المدينة قريبًا؟ :)'
      },
      header: {
        title: 'Role Paulista',
        tagline: 'أفضل توصية، على بعد بضع نقرات'
      },
      common: {
        back: 'رجوع',
        details: 'اعرف المزيد',
        selectLanguage: 'اختر اللغة',
        changeDistance: 'تغيير المسافة',
        all: 'الكل',
        filter: 'تصفية:',
        close: 'إغلاق',
        loading: 'جارٍ التحميل…',
        loadError: 'خطأ في تحميل البيانات.',
        noPlaces: 'لم يتم العثور على أماكن.',
        version: 'الإصدار'
      },
      filters: {
        title: 'الفلاتر',
        filter: 'الفلاتر',
        subtitle: 'قم بضبط الفلاتر أدناه لتحسين النتائج',
        sortingTitle: 'الترتيب',
        hoursTitle: 'ساعات العمل',
        openNowLabel: 'مفتوح الآن',
        openNow: 'مفتوح الآن',
        anyHourLabel: 'أي وقت',
        anyHour: 'أي وقت',
        scheduleTitle: 'الحجز',
        scheduleRequired: 'الحجز مطلوب',
        scheduleNotRequired: 'لا يحتاج حجز',
        anySchedule: 'أي',
        priceTitle: 'السعر',
        anyPrice: 'أي سعر',
        button: 'الفلاتر'
      },
      list: { nameHeader: 'الاسم', neighborhoodHeader: 'الحي', typeHeader: 'النوع', orderNameAsc: 'الاسم بترتيب تصاعدي A-Z', orderNeighborhoodAsc: 'الحي بترتيب تصاعدي A-Z' },
      footer: { home: 'الرئيسية', search: 'بحث', about: 'حول' },
      placeDetail: {
        hoursTitle: 'ساعات العمل',
        opensMonday: 'يفتح أيام الإثنين',
        opensSunday: 'يفتح أيام الأحد',
        opensHoliday: 'يفتح في العطلات',
        alreadyVisited: '✓ زرت وأوصي',
        notVisited: '⚠️ لم أزر بعد',
        viewHours: 'عرض الساعات',
        visitModalTitle: 'حول هذا المكان',
        visitModalParagraph: 'مكان قيد الزيارة. المعلومات الواردة في هذه الصفحة مأخوذة من اقتراحات أشخاص آخرين زاروا المكان ونصحوا بزيارته.',
        visitedModalParagraph: 'المكان الذي زُرتُه. المعلومات في هذه الصفحة تأتي مما جمعته عند زيارتي — العناصر التي طلبتها أو جربتها — والمعلومات التي قدمها المسؤولون عن المكان.',
        neverEmphasis: '',
        openNow: 'مفتوح الآن',
        closedNow: 'مغلق الآن',
        locationDescription: 'هنا ستجد فروع هذا المكان وجميع العناوين. ويمكنك أيضًا تحديد الطريق بالطريقة التي تفضلها: عبر خرائط Google أو بطلب Uber :)',
        websiteTitle: 'موقع المكان',
        websiteSubtitle: 'ادخل إلى موقع هذا المكان وتحقق من المعلومات التفصيلية',
        websiteButton: 'زيارة الموقع',
        openUber: 'افتح في Uber',
        instagramTitle: 'Instagram',
        instagramSubtitle: 'تابع الملف الرسمي للمكان:',
        follow: 'تابع',
        phoneTitle: 'هاتف',
        phonesSubtitle: 'هذه هي وسائل الاتصال الرسمية لهذا المكان',
        menuTitle: 'القائمة',
        menuSubtitle: 'عرض قائمة المطعم',
        menuButton: 'فتح القائمة',
        notesTitle: 'ملاحظات'
      },
      openingHours: { checkAvailabilityMessage: 'تختلف أوقات العمل حسب التوفر. تحقق من موقع المكان وصفحة الإنستغرام لمعرفة التفاصيل', alwaysOpenMessage: 'هذا المكان مفتوح على مدار 24 ساعة', checkAvailabilityLabel: 'تحقق من التوفر' },
      whereIsToday: { title: 'فأين نذهب اليوم؟', subtitle: 'lista de lugares onde fui, por categoria, dá uma olhada ;)' },
      placeType: {
        RESTAURANT: 'مطاعم',
        BARS: 'بارات',
        COFFEES: 'مقاهي',
        NIGHTLIFE: 'الحياة الليلية',
        NATURE: 'طبيعة',
        TOURIST_SPOT: 'معالم سياحية',
        FORFUN: 'للترفيه',
        STORES: 'متاجر',
        FREE: 'مجاني',
        PLEASURE: 'Casa de Prazeres'
      },
      placeList: {
        environmentTitle: 'نوع البيئة:',
        hoursUnavailable: 'ساعات العمل غير متوفرة',
        opensAtHeader: 'الافتتاح',
        openNow: 'مفتوح الآن',
        opensTomorrowAt: 'يفتح غدًا الساعة {{time}}',
        subtitleTemplate: 'اكتشف أماكن رائعة في هذا الحي، باختيار إحدى الخيارات أدناه :)'
      },
      about: {
        title: 'من أنا؟',
        paragraph: 'صفحة "حول". سيتم إضافة التصميم الكامل لاحقًا.'
      },
      aboutMe: {
        authorTag: 'مبتكر Role Paulista',
        aboutHeading: 'نبذة عني',
        socialHeading: 'وسائل التواصل الاجتماعي',
        bio: 'مطور تطبيقات جوال لأكثر من 8 سنوات، متخصص في Android و iOS. شغوف بالتقنية والسفر والمطاعم واستكشاف كل زاوية في ساو باولو.'
      },
      nearbyMap: { title: 'خريطة القرب', noneInRadius: 'لا توجد نقاط ضمن النطاق الحالي.', pointsDisplayed: '{{count}} نقطة معروضة.', you: 'أنت' }
      ,
      neighborhoodList: {
        intro: 'اكتشف أماكن رائعة في هذا الحي، باختيار إحدى الخيارات أدناه :)'
      }
    }
  }
  ,
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
        viewMore: 'Meer opties',
        noNearbyResultsRadius: 'Non c\'è nulla vicino a te...\n\nChe ne dici di modificare la distanza per\nelencare i luoghi vicini?',
        locationNotSupported: 'La geolocalizzazione non è supportata da questo browser.',
        locationDeniedInstructions: '',
        outsideGreaterSP: 'Sei al di fuori della regione della Grande San Paolo. Che ne dici di visitare la città presto? :)'
      },
      header: { title: 'Role Paulista', tagline: 'La migliore raccomandazione, a pochi clic di distanza' },
      common: {
        back: 'Indietro',
        details: 'Meer info',
        selectLanguage: 'Selecteer een taal',
        changeDistance: 'Afstand wijzigen',
        all: 'Alles',
        filter: 'Filter:',
        close: 'Kapat',
        loading: 'Laden…',
        loadError: "Errore nel caricamento dei dati.",
        noPlaces: 'Nessun luogo trovato.',
        version: 'Versie'
      },
      filters: {
        title: 'Filtri',
        subtitle: 'Regola i filtri sotto per affinare i risultati',
        sortingTitle: 'Sorteren',
        hoursTitle: 'Orari',
        openNowLabel: 'Nu aperto',
        openNow: 'Nu aperto',
        anyHourLabel: 'Elke tijd',
        anyHour: 'Elke tijd',
        scheduleTitle: 'Prenotazione',
        scheduleRequired: 'Prenotazione richiesta',
        scheduleNotRequired: 'Geen reservering nodig',
        anySchedule: 'Elke',
        priceTitle: 'Prezzo',
        anyPrice: 'Elke prezzo',
        button: 'Filtri'
      },
      list: { nameHeader: 'NAAM', neighborhoodHeader: 'BUURT', typeHeader: 'Tipo', orderNameAsc: 'NAAM artan sırada A-Z', orderNeighborhoodAsc: 'BUURT artan sırada A-Z' },
      footer: { home: 'Anasayfa', search: 'Zoeken', about: 'Info' },
      placeDetail: {
        hoursTitle: 'Orari di apertura',
        opensMonday: 'apre il lunedì',
        opensSunday: 'apre la domenica',
        opensHoliday: 'apre nei giorni festivi',
        alreadyVisited: '✓ Ik ben hier geweest en beveel het aan',
        notVisited: '⚠️ Nog niet bezocht',
        viewHours: 'bekijk tijden',
        visitModalTitle: 'Informazioni sul luogo',
        visitModalParagraph: 'Locatie wacht op bezoek. De informatie op deze pagina komt van suggesties van andere mensen die er zijn geweest en mij hebben aangeraden het te bezoeken.',
        visitedModalParagraph: 'Bezocht plaats. De informatie op deze pagina komt uit wat ik verzamelde tijdens mijn bezoek — elementen die ik bestelde of meemaakte — en informatie verstrekt door de verantwoordelijken van de locatie.',
        neverEmphasis: '',
        openNow: 'Nu open',
        closedNow: 'Gesloten',
        locationDescription: 'Hier vind je de vestigingen van deze plek en alle adressen. Je kunt de route nog steeds plannen zoals jij wilt: met Google Maps of door een Uber te bestellen :)',
        websiteTitle: 'Website',
        websiteSubtitle: 'Bezoek de website van deze plek en bekijk de gedetailleerde informatie',
        websiteButton: 'Open website',
        instagramTitle: 'Instagram',
        instagramSubtitle: 'Volg het officiële profiel van de locatie:',
        follow: 'Volgen',
        phoneTitle: 'Telefon',
        phonesSubtitle: 'Dit zijn de officiële contactgegevens van deze locatie',
        menuTitle: 'Menu',
        menuSubtitle: 'Bekijk het menu van de locatie',
        menuButton: 'Open menu',
        notesTitle: 'Opmerkingen'
      },
      openingHours: { checkAvailabilityMessage: 'Gli orari variano in base alla disponibilità. Controlla il sito e la pagina Instagram del luogo per maggiori dettagli', alwaysOpenMessage: 'Deze locatie is 24 uur per dag open', checkAvailabilityLabel: 'Beschikbaarheid controleren' },
      whereIsToday: { title: 'Dus, waar is het vandaag?', subtitle: 'lista de lugares onde fui, por categoria, dá uma olhada ;)' },
      placeType: {
        RESTAURANT: 'Ristoranti',
        BARS: 'Bar',
        COFFEES: 'Caffetterie',
        NIGHTLIFE: 'Gece hayatı',
        NATURE: 'Doğa',
        TOURIST_SPOT: 'Toeristische bezienswaardigheden',
        FORFUN: 'Eğlence için',
        STORES: 'Mağazalar',
        FREE: 'Ücretsiz',
        PLEASURE: 'Casa de Prazeres'
      },
      placeList: {
        environmentTitle: 'Tipo di ambiente:',
        hoursUnavailable: 'Orari non disponibili',
        opensAtHeader: 'Apertura',
        openNow: 'Nu open',
        opensTomorrowAt: 'Opent morgen om {{time}}',
        subtitleTemplate: 'Ontdek {{article}} {{noun}} van jouw type, dicht bij jou :)'
      },
      about: {
        title: 'Chi sono?',
        paragraph: 'Pagina "Chi sono". Il layout completo sarà aggiunto più tardi.'
      },
      aboutMe: {
        authorTag: 'Maker van Role Paulista',
        aboutHeading: 'Over mij',
        socialHeading: 'Sociale netwerken',
        bio: 'Mobiele ontwikkelaar met meer dan 8 jaar ervaring, specialist in Android & iOS. Gepassioneerd over technologie, reizen, restaurants en het verkennen van elk hoekje van São Paulo.'
      },
      nearbyMap: { title: 'Kaart in de buurt', noneInRadius: 'Geen punten binnen de huidige straal.', pointsDisplayed: '{{count}} punten weergegeven.', you: 'Jij' }
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
        outsideGreaterSP: 'Je bevindt je buiten de regio Groot-São Paulo. Wat dacht je ervan om de stad binnenkort te bezoeken? :)'
      },
      header: { title: 'Role Paulista', tagline: 'De beste aanbeveling, op een paar klikken afstand' },
      common: {
        back: 'Terug',
        details: 'Meer info',
        selectLanguage: 'Selecteer een taal',
        changeDistance: 'Afstand wijzigen',
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
        scheduleTitle: 'Reserveren',
        scheduleRequired: 'Reservering vereist',
        scheduleNotRequired: 'Geen reservering nodig',
        anySchedule: 'Elke',
        priceTitle: 'Prijs',
        anyPrice: 'Elke prijs',
        button: 'Filters'
      },
      list: { nameHeader: 'NAAM', neighborhoodHeader: 'BUURT', typeHeader: 'Type', orderNameAsc: 'NAAM artan sırada A-Z', orderNeighborhoodAsc: 'BUURT artan sırada A-Z' },
      footer: { home: 'Anasayfa', search: 'Zoeken', about: 'Over' },
      placeDetail: {
        hoursTitle: 'Openingstijden',
        opensMonday: 'open op maandag',
        opensSunday: 'open op zondag',
        opensHoliday: 'open op feestdagen',
        alreadyVisited: '✓ Ik ben hier geweest en beveel het aan',
        notVisited: '⚠️ Nog niet bezocht',
        viewHours: 'bekijk tijden',
        visitModalTitle: 'Over deze locatie',
        visitModalParagraph: 'Locatie wacht op bezoek. De informatie op deze pagina komt van suggesties van andere mensen die er zijn geweest en mij hebben aangeraden het te bezoeken.',
        visitedModalParagraph: 'Bezocht plaats. De informatie op deze pagina komt uit wat ik verzamelde tijdens mijn bezoek — elementen die ik bestelde of meemaakte — en informatie verstrekt door de verantwoordelijken van de locatie.',
        neverEmphasis: '',
        openNow: 'Nu open',
        closedNow: 'Gesloten',
        locationDescription: 'Hier vind je de vestigingen van deze plek en alle adressen. Je kunt de route nog steeds plannen zoals jij wilt: met Google Maps of door een Uber te bestellen :)',
        websiteTitle: 'Website',
        websiteSubtitle: 'Bezoek de website van deze plek en bekijk de gedetailleerde informatie',
        websiteButton: 'Open website',
        instagramTitle: 'Instagram',
        instagramSubtitle: 'Volg het officiële profiel van de locatie:',
        follow: 'Volgen',
        phoneTitle: 'Telefon',
        phonesSubtitle: 'Dit zijn de officiële contactgegevens van deze locatie',
        menuTitle: 'Menu',
        menuSubtitle: 'Bekijk het menu van de locatie',
        menuButton: 'Open menu',
        notesTitle: 'Opmerkingen'
      },
      openingHours: { checkAvailabilityMessage: 'Openingstijden variëren afhankelijk van beschikbaarheid. Controleer de website en de Instagram-pagina van de locatie voor meer informatie', alwaysOpenMessage: 'Deze locatie is 24 uur per dag open', checkAvailabilityLabel: 'Beschikbaarheid controleren' },
      whereIsToday: { title: 'Dus, waar is het vandaag?', subtitle: 'lista de lugares onde fui, por categoria, dá uma olhada ;)' },
      placeType: {
        RESTAURANT: 'Restaurants',
        BARS: 'Bars',
        COFFEES: 'Koffiebars',
        NIGHTLIFE: 'Gece hayatı',
        NATURE: 'Doğa',
        TOURIST_SPOT: 'Toeristische bezienswaardigheden',
        FORFUN: 'Eğlence için',
        STORES: 'Mağazalar',
        FREE: 'Ücretsiz',
        PLEASURE: 'Casa de Prazeres'
      },
      placeList: {
        environmentTitle: 'Type omgeving:',
        hoursUnavailable: 'Openingstijden niet beschikbaar',
        opensAtHeader: 'Açılış saati',
        openNow: 'Nu open',
        opensTomorrowAt: 'Opent morgen om {{time}}',
        subtitleTemplate: 'Ontdek {{article}} {{noun}} van jouw type, dicht bij jou :)'
      },
      about: {
        title: 'Wie ben ik?',
        paragraph: 'Pagina over mij. We voegen later de volledige lay-out toe.'
      },
      aboutMe: {
        authorTag: 'Maker van Role Paulista',
        aboutHeading: 'Over mij',
        socialHeading: 'Sociale netwerken',
        bio: 'Mobiele ontwikkelaar met meer dan 8 jaar ervaring, specialist in Android & iOS. Gepassioneerd over technologie, reizen, restaurants en het verkennen van elk hoekje van São Paulo.'
      },
      nearbyMap: { title: 'Kaart in de buurt', noneInRadius: 'Geen punten binnen de huidige straal.', pointsDisplayed: '{{count}} punten weergegeven.', you: 'Jij' }
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
        noNearbyResultsRadius: 'Yakınında hiçbir şey yok...\n\nMesafeyi değiştirip\nyakın yerleri listelemeye ne dersin?',
        locationNotSupported: 'Tarayıcı bu konum belirleme özelliğini desteklemiyor.',
        locationDeniedInstructions: '',
        outsideGreaterSP: 'Büyük São Paulo bölgesi dışında bulunuyorsunuz. Yakında şehri ziyaret etmeye ne dersiniz? :)'
      },
      header: { title: 'Role Paulista', tagline: 'Gittiğim yerlerin en iyi önerisi — birkaç tık uzağında' },
      common: {
        back: 'Geri', details: 'Daha fazla bilgi', selectLanguage: 'Bir dil seçin', changeDistance: 'Mesafeyi değiştir', all: 'Hepsi', filter: 'Filtre:', close: 'Kapat', loading: 'Yükleniyor…', loadError: 'Veri yüklenirken hata oluştu.', noPlaces: 'Hiç yer bulunamadı.', version: 'Sürüm'
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
        priceTitle: 'Fiyat',
        anyPrice: 'Herhangi bir fiyat',
        button: 'Filtreler'
      },
      list: { nameHeader: 'İSİM', neighborhoodHeader: 'MAHALLE', typeHeader: 'Tür', orderNameAsc: 'İSİM artan sırada A-Z', orderNeighborhoodAsc: 'MAHALLE artan sırada A-Z' },
      footer: { home: 'Anasayfa', search: 'Ara', about: 'Hakkında' },
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
      whereIsToday: { title: 'Peki, bugün nereye gidiyoruz?', subtitle: 'lista de lugares onde fui, por categoria, dá uma olhada ;)' },
      placeType: {
        RESTAURANT: 'Restoranlar',
        BARS: 'Barlar',
        COFFEES: 'Kafeler',
        NIGHTLIFE: 'Gece hayatı',
        NATURE: 'Doğa',
        TOURIST_SPOT: 'Toeristische bezienswaardigheden',
        FORFUN: 'Eğlence için',
        STORES: 'Mağazalar',
        FREE: 'Ücretsiz',
        PLEASURE: 'Casa de Prazeres'
      },
      placeList: {
        environmentTitle: 'Mekan türü:',
        hoursUnavailable: 'Çalışma saatleri mevcut değil',
        opensAtHeader: 'Açılış saati',
        openNow: 'Şu anda açık',
        opensTomorrowAt: 'Otwierze się jutro o {{time}}',
        subtitleTemplate: 'Odkryj {{article}} {{noun}} w Twoim stylu, najbliżej Ciebie :)'
      },
      about: {
        title: 'Ben kimim?',
        paragraph: 'Hakkında sayfası yer tutucu. Tam düzen daha sonra eklenecek.'
      },
      aboutMe: {
        authorTag: 'Role Paulista Oluşturucusu',
        aboutHeading: 'Hakkımda',
        socialHeading: 'Sosyal ağlar',
        bio: '8 yılı aşkın süredir mobil geliştirici, Android ve iOS uzmanı. Gepassioneerd over technologie, reizen, restaurants en het verkennen van elk hoekje van São Paulo.'
      },
      nearbyMap: { title: 'Yakındaki Harita', noneInRadius: 'Brak punktów w obecnym promieniu.', pointsDisplayed: '{{count}} punkt(y) wyświetlono.', you: 'Ty' }
    }
  },
  pl: {
    translation: {
      home: {
        nearMeTitle: 'W pobliżu',
        nearMeSubtitle: '(wyświetlając miejsca w promieniu {{km}}km w pobliżu Ciebie)',
        allowLocation: 'Ups, nie znaleźliśmy Twojej lokalizacji...\n\nAby znaleźć miejsca w pobliżu, kliknij przycisk poniżej:',
        allowLocationButton: 'Zezwól na lokalizację',
        loadingCategories: 'Ładowanie kategorii...',
        increaseRadius: 'Zwiększ promień',
        neighborhoodsTitle: 'Według dzielnicy',
        neighborhoodsTagline: 'Jesteś w jednej z tych dzielnic? Dobre miejsca w pobliżu!',
        viewMoreNeighborhoods: 'zobacz więcej dzielnic',
        viewMore: 'Więcej opcji',
        noNearbyResultsRadius: 'W pobliżu nie ma nic...\n\nMoże zmienimy odległość, aby\nwyświetlić pobliskie miejsca?',
        locationNotSupported: 'Geolokalizacja nie jest obsługiwana przez tę przeglądarkę.',
        locationDeniedInstructions: '',
        outsideGreaterSP: 'Znajdujesz się poza regionem Wielkiego São Paulo. Może odwiedzisz miasto wkrótce? :)'
      },
      header: { title: 'Role Paulista', tagline: 'Najlepsza rekomendacja — o kilka kliknięć stąd' },
      common: {
        back: 'Wstecz', details: 'Dowiedz się więcej', selectLanguage: 'Wybierz język', changeDistance: 'Zmień odległość', all: 'Wszystko', filter: 'Filtr:', close: 'Zamknij', loading: 'Ładowanie…', loadError: 'Błąd ładowania danych.', noPlaces: 'Nie znaleziono miejsc.', version: 'Wersja'
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
        priceTitle: 'Cena',
        anyPrice: 'Dowolna cena',
        button: 'Filtry'
      },
      list: { nameHeader: 'NAZWA', neighborhoodHeader: 'DZIELNICA', typeHeader: 'Typ', orderNameAsc: 'NAZWA rosnąco A-Z', orderNeighborhoodAsc: 'DZIELNICA rosnąco A-Z' },
      footer: { home: 'Strona główna', search: 'Szukaj', about: 'O nas' },
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
        locationDescription: 'Tutaj znajdziesz wszystkie lokale tego miejsca i ich adresy. Trasę możesz wyznaczyć tak, jak wolisz: w Google Maps albo zamawiając Ubera :)',
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
      whereIsToday: { title: 'A więc, gdzie dziś?', subtitle: 'lista de lugares onde fui, por categoria, dá uma olhada ;)' },
      placeType: {
        RESTAURANT: 'Restauracje',
        BARS: 'Bary',
        COFFEES: 'Kawiarnie',
        NIGHTLIFE: 'Życie nocne',
        NATURE: 'Przyroda',
        TOURIST_SPOT: 'Atrakcje turystyczne',
        FORFUN: 'Dla zabawy',
        STORES: 'Sklepy',
        FREE: 'Darmowe',
        PLEASURE: 'Casa de Prazeres'
      },
      placeList: {
        environmentTitle: 'Typ miejsca:',
        hoursUnavailable: 'Godziny otwarcia niedostępne',
        opensAtHeader: 'Otwarcie',
        openNow: 'Otwarte teraz',
        opensTomorrowAt: 'Otwiera się jutro o {{time}}',
        subtitleTemplate: 'Odkryj {{article}} {{noun}} w Twoim stylu, najbliżej Ciebie :)'
      },
      nearbyMap: { title: 'Mapa w pobliżu', noneInRadius: 'Brak punktów w obecnym promieniu.', pointsDisplayed: '{{count}} punkt(y) wyświetlono.', you: 'Ty' }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
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
