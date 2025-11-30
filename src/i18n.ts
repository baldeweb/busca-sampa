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
        nearMeSubtitle: '(com menos de {{km}}km de distância)',
        allowLocation: 'Permitir localização',
        loadingCategories: 'Carregando categorias...',
        increaseRadius: 'Aumentar raio',
        neighborhoodsTitle: 'Por bairro',
        neighborhoodsTagline: 'Tá em algum desses bairros? Tem coisa boa por perto!',
        viewMoreNeighborhoods: 'ver mais bairros ►',
        noNearbyResultsRadius: 'Não há nada dentro das proximidades no raio escolhido.'
      },
      header: {
        title: 'Role Paulista',
        tagline: 'A melhor recomendação de onde fui, com apenas um toque de distância'
      },
      common: {
        back: 'Voltar',
        details: 'ver detalhes',
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
        orderNameAsc: 'NOME em ordem alfabética A-Z',
        orderNameDesc: 'NOME em ordem alfabética Z-A',
        orderNeighborhoodAsc: 'BAIRRO em ordem alfabética A-Z',
        orderNeighborhoodDesc: 'BAIRRO em ordem alfabética Z-A'
      },
      whereIsToday: { title: 'E aí, onde é hoje?', subtitle: 'lista de lugares onde fui, por categoria, dá uma olhada ;)', opensToday: 'Abrem hoje' },
      placeDetail: {
        loading: 'Carregando detalhes...',
        notFound: 'Local não encontrado.',
        opensMonday: 'abre nas segundas-feiras',
        opensSunday: 'abre aos domingos',
        opensHoliday: 'abre em feriados',
        alreadyVisited: '✓ Já fui e recomendo',
        notVisited: '⚠️ Ainda não visitei',
        visitModalTitle: 'Sobre os lugares que visitei',
        visitModalParagraph: 'Todas recomendações que no site, são lugares que eu fui e recomendo, lugares diferentes que me recomendaram e eu ainda não fui.',
        neverEmphasis: 'JAMAIS',
        priceLabel: 'Preço:',
        environmentTypeLabel: 'Tipo de ambiente:',
        hoursTitle: 'Horário de funcionamento',
        viewHours: 'ver horários ▼',
        locationTitle: 'Localização',
        openNow: 'Aberto\u200B agora',
        closedNow: 'Fechado agora',
        locationDescription: 'Aqui tem a unidade e o endereço do estabelecimento, e você pode traçar a rota pra lá clicando no botão abaixo',
        streetPrefix: 'Rua:',
        googleMapsButton: 'Abrir no Google Maps',
        instagramTitle: 'Instagram',
        instagramSubtitle: 'Siga o perfil oficial do estabelecimento:',
        follow: 'Seguir',
        menuTitle: 'Cardápio',
        menuSubtitle: 'Veja o cardápio do estabelecimento',
        menuButton: 'Abrir cardápio',
        notesTitle: 'Observação',
        reportProblem: 'Reportar um problema',
        visitModalEnding: 'vou recomendar lugares que você não deve ir :)'
      },
      openingHours: {
        title: 'Horários de funcionamento',
        closed: 'Fechado',
        range: 'das {{open}} às {{close}}',
        notProvided: 'Horários não informados.',
        followButton: 'Seguir'
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
        intro: 'Descubra lugares incríveis neste bairro,\nescolhendo uma das opções abaixo :)'
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
        BAR: 'Bares',
        COFFEE: 'Cafeterias',
        NIGHTLIFE: 'Vida Noturna',
        NATURE: 'Natureza',
        TOURIST_SPOT: 'Pontos\u200B Turísticos',
        FREE: 'Gratuitos'
      },
      placeList: {
        environmentTitle: 'Tipo de ambiente:',
        opensAtHeader: 'Abertura',
        openNow: 'Aberto agora',
        opensSoon: 'Abre em instantes',
        subtitleTemplate: 'Descubra {{article}} {{noun}} com o seu tipo mais perto de você :)',
        article: {
          RESTAURANT: 'o',
          BAR: 'o',
          COFFEE: 'a',
          NIGHTLIFE: 'a',
          NATURE: 'a',
          TOURIST_SPOT: 'o',
          FREE: 'o'
        },
        noun: {
          RESTAURANT: 'restaurante',
          BAR: 'bar',
          COFFEE: 'cafeteria',
          NIGHTLIFE: 'vida noturna',
          NATURE: 'natureza',
          TOURIST_SPOT: 'ponto turístico',
          FREE: 'evento gratuito'
        }
      }
    }
  },
  es: {
    translation: {
      home: {
        nearMeTitle: 'Cerca de mí',
        allowLocation: 'Permitir ubicación',
        loadingCategories: 'Cargando categorías...',
        increaseRadius: 'Aumentar radio',
        neighborhoodsTitle: 'Por barrio',
        neighborhoodsTagline: '¿Estás en uno de estos barrios? ¡Hay cosas buenas cerca!',
        viewMoreNeighborhoods: 'ver más barrios >',
        noNearbyResultsRadius: 'No hay lugares dentro del radio elegido.'
      },
      header: {
        title: 'Role Paulista',
        tagline: 'La mejor recomendación de donde he ido, a un toque'
      },
      common: {
        back: 'Volver',
        details: 'ver detalles',
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
      whereIsToday: { title: '¿Y entonces, dónde es hoy?', opensToday: 'Abren hoy' },
      list: {
        nameHeader: 'Nombre',
        neighborhoodHeader: 'Barrio',
        typeHeader: 'Tipo',
        orderNameAsc: 'NOMBRE A-Z',
        orderNameDesc: 'NOMBRE Z-A',
        orderNeighborhoodAsc: 'BARRIO A-Z',
        orderNeighborhoodDesc: 'BARRIO Z-A'
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
        visitModalParagraph: 'Todas las recomendaciones en el sitio son lugares donde fui y recomiendo, más lugares diferentes que me recomendaron y aún no fui.',
        neverEmphasis: 'NUNCA',
        priceLabel: 'Precio:',
        environmentTypeLabel: 'Tipo de ambiente:',
        hoursTitle: 'Horario de funcionamiento',
        viewHours: 'ver horarios ▼',
        locationTitle: 'Ubicación',
        openNow: 'Abierto\u200B ahora',
        closedNow: 'Cerrado ahora',
        locationDescription: 'Aquí la unidad y dirección; traza la ruta con el botón abajo',
        streetPrefix: 'Calle:',
        googleMapsButton: 'Abrir en Google Maps',
        instagramTitle: 'Instagram',
        instagramSubtitle: 'Sigue el perfil oficial:',
        follow: 'Seguir',
        menuTitle: 'Menú',
        menuSubtitle: 'Ver el menú del lugar',
        menuButton: 'Abrir menú',
        notesTitle: 'Notas',
        reportProblem: 'Reportar un problema',
        visitModalEnding: 'recomendaría lugares a los que no debes ir :)'
      },
      openingHours: {
        title: 'Horarios de funcionamiento',
        closed: 'Cerrado',
        range: 'de {{open}} a {{close}}',
        notProvided: 'Horarios no informados.',
        followButton: 'Seguir'
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
        intro: 'Descubre lugares increíbles en este barrio,\nselecciona una de las opciones a continuación :)'
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
        RESTAURANT: 'Restaurantes', BAR: 'Bares', COFFEE: 'Cafeterías', NIGHTLIFE: 'Vida\u200B nocturna', NATURE: 'Naturaleza', TOURIST_SPOT: 'Puntos\u200B turísticos', FREE: 'Gratuitos'
      }
      ,
      placeList: {
        environmentTitle: 'Tipo de ambiente:',
        opensAtHeader: 'Abre a las...',
        subtitleTemplate: 'Descubra {{article}} {{noun}} cerca de ti más cerca de ti :)',
        article: {
          RESTAURANT: 'el',
          BAR: 'el',
          COFFEE: 'la',
          NIGHTLIFE: 'la',
          NATURE: 'la',
          TOURIST_SPOT: 'el',
          FREE: 'el'
        },
        noun: {
          RESTAURANT: 'restaurante',
          BAR: 'bar',
          COFFEE: 'cafetería',
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
        allowLocation: 'Autoriser la localisation',
        loadingCategories: 'Chargement des catégories...',
        increaseRadius: 'Augmenter le rayon',
        neighborhoodsTitle: 'Par quartier',
        neighborhoodsTagline: 'Vous êtes dans un de ces quartiers ? Des bons endroits à proximité !',
        viewMoreNeighborhoods: 'voir plus de quartiers >',
        noNearbyResultsRadius: 'Aucun endroit dans le rayon choisi.'
      },
      header: { title: 'Role Paulista', tagline: 'La meilleure recommandation des lieux visités, à portée de main' },
      common: {
        back: 'Retour', details: 'voir détails', selectLanguage: 'Choisir une langue', changeDistance: 'Changer distance', all: 'Tout', filter: 'Filtre:', close: 'Fermer', loading: 'Chargement…', loadError: 'Erreur de chargement.', noPlaces: 'Aucun lieu trouvé.', version: 'Version'
      },
      whereIsToday: { title: 'Alors, c’est où aujourd’hui?', opensToday: 'Ouvrent aujourd\'hui' },
            placeList: {
              opensAtHeader: 'Ouvre à...'
            },
      list: {
        nameHeader: 'Nom', neighborhoodHeader: 'Quartier', typeHeader: 'Type', orderNameAsc: 'NOM A-Z', orderNameDesc: 'NOM Z-A', orderNeighborhoodAsc: 'QUARTIER A-Z', orderNeighborhoodDesc: 'QUARTIER Z-A'
      },
      placeDetail: {
        loading: 'Chargement des détails...', notFound: 'Lieu introuvable.', opensMonday: 'ouvert le lundi', opensSunday: 'ouvert le dimanche', opensHoliday: 'ouvert les jours fériés', alreadyVisited: '✓ Déjà visité et recommandé', notVisited: '⚠️ Pas encore visité', visitModalTitle: 'À propos des lieux visités', visitModalParagraph: 'Toutes les recommandations sont des lieux que j’ai visités et recommande, plus d’autres encore non visités.', neverEmphasis: 'JAMAIS', priceLabel: 'Prix :', environmentTypeLabel: 'Type d’ambiance :', hoursTitle: 'Horaires', viewHours: 'voir horaires ▼', locationTitle: 'Localisation', openNow: 'Ouvert\u200B maintenant', closedNow: 'Fermé maintenant', locationDescription: 'Unité et adresse ici; tracez la route via le bouton ci-dessous', streetPrefix: 'Rue :', googleMapsButton: 'Ouvrir Google Maps', instagramTitle: 'Instagram', instagramSubtitle: 'Suivez le profil officiel :', follow: 'Suivre', menuTitle: 'Menu', menuSubtitle: 'Voir le menu', menuButton: 'Ouvrir menu', notesTitle: 'Notes', reportProblem: 'Signaler un problème', visitModalEnding: 'recommanderais des lieux à éviter :)'
      },
      openingHours: { title: 'Horaires', closed: 'Fermé', range: 'de {{open}} à {{close}}', notProvided: 'Horaires non fournis.', followButton: 'Suivre' },
      footer: { home: 'Accueil', search: 'Chercher', about: 'À propos' },
      distanceSelect: { title: 'Sélectionnez la distance', searchButton: 'Chercher' },
      nearbyMap: { title: 'Carte proximité', noneInRadius: 'Aucun point dans le rayon.', pointsDisplayed: '{{count}} point(s) affiché(s).', you: 'Vous' },
      neighborhoodList: {
        intro: 'Découvrez des lieux incroyables dans ce quartier,\nchoisissez l\'une des options ci‑dessous :)'
      },
      recommendationsOrigin: { title: 'D’où viennent ces recommandations ?' },
      support: { title: 'Soutenir le site' },
      about: { title: 'Qui suis-je ?', paragraph: 'Page à propos. Maquette à venir.' },
      aboutMe: { authorTag: 'Créateur de Role Paulista', aboutHeading: 'À propos de moi', socialHeading: 'Réseaux sociaux', bio: 'Développeur mobile depuis plus de 8 ans, passionné de technologie et d’exploration de São Paulo.' },
      howToRecommend: { title: 'Comment recommander un lieu ?' },
      placeType: { RESTAURANT: 'Restaurants', BAR: 'Bars', COFFEE: 'Cafés', NIGHTLIFE: 'Vie\u200B nocturne', NATURE: 'Nature', TOURIST_SPOT: 'Sites\u200B touristiques', FREE: 'Gratuit' }
    }
  },
  ru: {
    translation: {
      home: { nearMeTitle: 'Рядом со мной', allowLocation: 'Разрешить геолокацию', loadingCategories: 'Загрузка категорий...', increaseRadius: 'Увеличить радиус', neighborhoodsTitle: 'По району', neighborhoodsTagline: 'Вы в одном из этих районов? Рядом есть интересное!', viewMoreNeighborhoods: 'ещё районы >', noNearbyResultsRadius: 'Нет мест в выбранном радиусе.' },
      header: { title: 'Role Paulista', tagline: 'Лучшие рекомендации мест, где я был — в один клик' },
      common: { back: 'Назад', details: 'подробнее', selectLanguage: 'Выберите язык', changeDistance: 'Изменить расстояние', all: 'Все', filter: 'Фильтр:', close: 'Закрыть', loading: 'Загрузка…', loadError: 'Ошибка загрузки данных.', noPlaces: 'Ничего не найдено.', version: 'Версия' },
      whereIsToday: { title: 'Ну что, где сегодня?', opensToday: 'Открываются сегодня'},
      list: { nameHeader: 'Название', neighborhoodHeader: 'Район', typeHeader: 'Тип', orderNameAsc: 'ИМЯ A-Z', orderNameDesc: 'ИМЯ Z-A', orderNeighborhoodAsc: 'РАЙОН A-Z', orderNeighborhoodDesc: 'РАЙОН Z-A' },
      placeDetail: { loading: 'Загрузка деталей...', notFound: 'Место не найдено.', opensMonday: 'открыто по понедельникам', opensSunday: 'открыто по воскресеньям', opensHoliday: 'открыто в праздники', alreadyVisited: '✓ Был и рекомендую', notVisited: '⚠️ Еще не был', visitModalTitle: 'О посещенных местах', visitModalParagraph: 'Все рекомендации — места где я был и рекомендую, плюс те, что мне советовали и я еще не посетил.', neverEmphasis: 'НИКОГДА', priceLabel: 'Цена:', environmentTypeLabel: 'Тип атмосферы:', hoursTitle: 'Время работы', viewHours: 'смотреть часы ▼', locationTitle: 'Локация', openNow: 'Открыто\u200B сейчас', closedNow: 'Закрыто сейчас', locationDescription: 'Здесь адрес и можно проложить маршрут кнопкой ниже', streetPrefix: 'Улица:', googleMapsButton: 'Открыть в Google Maps', instagramTitle: 'Instagram', instagramSubtitle: 'Подписаться на официальный профиль:', follow: 'Подписаться', menuTitle: 'Меню', menuSubtitle: 'Посмотреть меню', menuButton: 'Открыть меню', notesTitle: 'Заметки', reportProblem: 'Сообщить о проблеме', visitModalEnding: 'рекомендовал бы места куда не стоит идти :)' },
      openingHours: { title: 'Время работы', closed: 'Закрыто', range: 'с {{open}} до {{close}}', notProvided: 'Время не указано.', followButton: 'Подписаться' },
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
      placeType: { RESTAURANT: 'Рестораны', BAR: 'Бары', COFFEE: 'Кофейни', NIGHTLIFE: 'Ночная\u200B жизнь', NATURE: 'Природа', TOURIST_SPOT: 'Достопримечательности', FREE: 'Бесплатно' }
    }
  },
  zh: {
    translation: {
      home: { nearMeTitle: '附近', allowLocation: '允许定位', loadingCategories: '正在加载分类...', increaseRadius: '增加半径', neighborhoodsTitle: '按街区', neighborhoodsTagline: '你在这些街区之一吗？附近有好地方！', viewMoreNeighborhoods: '更多街区 >', noNearbyResultsRadius: '所选半径内没有地点。' },
      header: { title: 'Role Paulista', tagline: '我去过的最佳推荐，一触即达' },
      common: { back: '返回', details: '查看详情', selectLanguage: '选择语言', changeDistance: '更改距离', all: '全部', filter: '筛选:', close: '关闭', loading: '加载中…', loadError: '加载数据出错。', noPlaces: '未找到地点。', version: '版本' },
      whereIsToday: { title: '那今天去哪儿?', opensToday: '今天开放' },
      list: { nameHeader: '名称', neighborhoodHeader: '街区', typeHeader: '类型', orderNameAsc: '名称 A-Z', orderNameDesc: '名称 Z-A', orderNeighborhoodAsc: '街区 A-Z', orderNeighborhoodDesc: '街区 Z-A' },
      placeDetail: { loading: '正在加载详情...', notFound: '未找到地点。', opensMonday: '周一营业', opensSunday: '周日营业', opensHoliday: '节假日营业', alreadyVisited: '✓ 我去过并推荐', notVisited: '⚠️ 还没去过', visitModalTitle: '关于我去过的地方', visitModalParagraph: '所有推荐都是我去过并推荐的地方，另有一些别人推荐我还没去。', neverEmphasis: '绝不', priceLabel: '价格:', environmentTypeLabel: '环境类型:', hoursTitle: '营业时间', viewHours: '查看时间 ▼', locationTitle: '位置', openNow: '正在营业', closedNow: '已打烊', locationDescription: '这里是地址，点击下方按钮可规划路线', streetPrefix: '街道:', googleMapsButton: '打开 Google 地图', instagramTitle: 'Instagram', instagramSubtitle: '关注官方账号：', follow: '关注', menuTitle: '菜单', menuSubtitle: '查看店铺菜单', menuButton: '打开菜单', notesTitle: '备注', reportProblem: '报告问题', visitModalEnding: '会推荐你不该去的地方 :)' },
      openingHours: { title: '营业时间', closed: '关闭', range: '{{open}} - {{close}}', notProvided: '未提供时间。', followButton: '关注' },
      footer: { home: '首页', search: '搜索', about: '关于' },
      distanceSelect: { title: '选择距离', searchButton: '搜索' },
      nearbyMap: { title: '附近地图', noneInRadius: '当前半径内无点。', pointsDisplayed: '显示 {{count}} 个点。', you: '你' },
      neighborhoodList: {
        intro: '在这个街区发现超棒的地方，\n请选择下面的选项之一 :)'
      },
      recommendationsOrigin: { title: '这些推荐来自哪里？' },
      support: { title: '支持本网站' },
      about: { title: '我是谁？', paragraph: '关于页面。稍后提供设计。' },
      aboutMe: { authorTag: 'Role Paulista 创作者', aboutHeading: '关于我', socialHeading: '社交网络', bio: '8+年移动开发，热爱技术、旅行、美食及探索圣保罗。' },
      howToRecommend: { title: '如何推荐一个地点？' },
      placeType: { RESTAURANT: '餐厅', BAR: '酒吧', COFFEE: '咖啡店', NIGHTLIFE: '夜生活', NATURE: '自然', TOURIST_SPOT: '旅游景点', FREE: '免费' }
    }
  },
  en: {
    translation: {
      home: {
        nearMeTitle: 'Near Me',
        nearMeSubtitle: '(com menos de {{km}}km de distância)',
        allowLocation: 'Allow Location',
        loadingCategories: 'Loading categories...',
        increaseRadius: 'Increase radius',
        neighborhoodsTitle: 'By Neighborhood',
        neighborhoodsTagline: 'Are you in one of these neighborhoods? Good stuff nearby!',
        viewMoreNeighborhoods: 'see more neighborhoods >',
        noNearbyResultsRadius: 'No places within the chosen radius.'
      },
      header: {
        title: 'Role Paulista',
        tagline: 'The best recommendation of where I have been, just a tap away'
      },
      common: {
        back: 'Back',
        details: 'see details',
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
      whereIsToday: { title: 'So, where is it today?'},
      list: {
        nameHeader: 'Name',
        neighborhoodHeader: 'Neighborhood',
        typeHeader: 'Type',
        orderNameAsc: 'NAME alphabetical A-Z',
        orderNameDesc: 'NAME alphabetical Z-A',
        orderNeighborhoodAsc: 'NEIGHBORHOOD alphabetical A-Z',
        orderNeighborhoodDesc: 'NEIGHBORHOOD alphabetical Z-A'
      },
      placeDetail: {
        loading: 'Loading details...',
        notFound: 'Place not found.',
        opensMonday: 'open on Mondays',
        opensSunday: 'open on Sundays',
        opensHoliday: 'open on holidays',
        alreadyVisited: '✓ I have been and recommend',
        notVisited: '⚠️ Not visited yet',
        visitModalTitle: 'About the places I have visited',
        visitModalParagraph: 'All recommendations on the site are places I went and recommend, plus different places recommended to me that I have not visited yet.',
        neverEmphasis: 'NEVER',
        priceLabel: 'Price:',
        environmentTypeLabel: 'Environment type:',
        hoursTitle: 'Opening hours',
        viewHours: 'see hours ▼',
        locationTitle: 'Location',
        openNow: 'Open\u200B now',
        closedNow: 'Closed now',
        locationDescription: 'Here is the unit and the address; you can trace the route by clicking the button below',
        streetPrefix: 'Street:',
        googleMapsButton: 'Open in Google Maps',
        instagramTitle: 'Instagram',
        instagramSubtitle: 'Follow the official profile:',
        follow: 'Follow',
        menuTitle: 'Menu',
        menuSubtitle: 'See the place menu',
        menuButton: 'Open menu',
        notesTitle: 'Notes',
        reportProblem: 'Report a problem',
        visitModalEnding: 'will recommend places you should not go :)'
      },
      openingHours: {
        title: 'Opening hours',
        closed: 'Closed',
        range: 'from {{open}} to {{close}}',
        notProvided: 'Hours not provided.',
        followButton: 'Follow'
      },
      footer: {
        home: 'Home',
        search: 'Search',
        about: 'About'
      },
      distanceSelect: {
        title: 'Select distance',
        searchButton: 'Search'
      },
      nearbyMap: {
        title: 'Nearby Map',
        noneInRadius: 'No points within current radius.',
        pointsDisplayed: '{{count}} point(s) displayed.',
        you: 'You'
      },
      neighborhoodList: {
        intro: 'Discover amazing places in this neighborhood,\nby choosing one of the options below :)'
      },
      recommendationsOrigin: {
        title: 'Where do these recommendations come from?'
      },
      support: {
        title: 'Support the site'
      },
      about: {
        title: 'Who am I?',
        paragraph: 'About page placeholder. We will bring Marvel layout later.'
      },
      aboutMe: {
        authorTag: 'Creator of Role Paulista',
        aboutHeading: 'About me',
        socialHeading: 'Social networks',
        bio: 'Mobile developer for over 8 years, Android & iOS specialist. Passionate about technology, travel, restaurants and exploring every new corner of São Paulo.'
      },
      howToRecommend: {
        title: 'How can I recommend a place?'
      },
      placeType: {
        RESTAURANT: 'Restaurants',
        BAR: 'Bars',
        COFFEE: 'Coffee Shops',
        NIGHTLIFE: 'Nightlife',
        NATURE: 'Nature',
        TOURIST_SPOT: 'Tourist Spots',
        FREE: 'Free'
      },
      placeList: {
        environmentTitle: 'Environment type:',
        subtitleTemplate: 'Discover {{article}} {{noun}} of your type closest to you :)',
        article: {
          RESTAURANT: 'the',
          BAR: 'the',
          COFFEE: 'the',
          NIGHTLIFE: 'the',
          NATURE: 'the',
          TOURIST_SPOT: 'the',
          FREE: 'the'
        },
        noun: {
          RESTAURANT: 'restaurant',
          BAR: 'bar',
          COFFEE: 'coffee shop',
          NIGHTLIFE: 'nightlife spot',
          NATURE: 'nature spot',
          TOURIST_SPOT: 'tourist spot',
          FREE: 'free event'
        }
      }
    }
  }
  ,
  de: {
    translation: {
      home: {
        nearMeTitle: 'In meiner Nähe',
        nearMeSubtitle: '(innerhalb von {{km}}km Entfernung)',
        allowLocation: 'Standort erlauben',
        loadingCategories: 'Kategorien werden geladen...',
        increaseRadius: 'Radius vergrößern',
        neighborhoodsTitle: 'Nach Viertel',
        neighborhoodsTagline: 'Bist du in einem dieser Viertel? Gute Orte in der Nähe!',
        viewMoreNeighborhoods: 'mehr Viertel anzeigen >',
        noNearbyResultsRadius: 'Keine Orte im ausgewählten Radius.'
      },
      header: {
        title: 'Role Paulista',
        tagline: 'Die beste Empfehlung, wo ich war — mit nur einer Berührung'
      },
      common: {
        back: 'Zurück',
        details: 'Details ansehen',
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
      footer: { home: 'Start', search: 'Suchen', about: 'Über' },
      placeDetail: {
        openNow: 'Jetzt geöffnet',
        closedNow: 'Geschlossen'
      },
      whereIsToday: { title: 'Also, wo ist es heute?' },
      placeType: {
        RESTAURANT: 'Restaurants',
        BAR: 'Bars',
        COFFEE: 'Cafés',
        NIGHTLIFE: 'Nachtleben',
        NATURE: 'Natur',
        TOURIST_SPOT: 'Sehenswürdigkeiten',
        FREE: 'Kostenlos'
      }
    }
  },
  ja: {
    translation: {
      home: {
        nearMeTitle: '近くの場所',
        nearMeSubtitle: '（{{km}}km以内）',
        allowLocation: '位置情報を許可',
        loadingCategories: 'カテゴリを読み込み中...',
        increaseRadius: '半径を広げる',
        neighborhoodsTitle: '地域別',
        neighborhoodsTagline: 'これらの地域のどれかにいますか？近くに良い場所があります！',
        viewMoreNeighborhoods: 'もっと見る >',
        noNearbyResultsRadius: '選択した半径内に場所がありません。'
      },
      header: {
        title: 'Role Paulista',
        tagline: '私が行った場所のおすすめ — ワンタップで'
      },
      common: {
        back: '戻る',
        details: '詳細を見る',
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
      footer: { home: 'ホーム', search: '検索', about: '概要' },
      placeDetail: {
        openNow: '営業中',
        closedNow: '閉店'
      },
      whereIsToday: { title: 'さて、今日はどこに行く？' },
      placeType: {
        RESTAURANT: 'レストラン',
        BAR: 'バー',
        COFFEE: 'カフェ',
        NIGHTLIFE: 'ナイトライフ',
        NATURE: '自然',
        TOURIST_SPOT: '観光名所',
        FREE: '無料'
      }
    }
  }
  ,
  ar: {
    translation: {
      home: {
        nearMeTitle: 'بالقرب مني',
        nearMeSubtitle: '(ضمن {{km}} كم)',
        allowLocation: 'السماح بالموقع',
        loadingCategories: 'جارٍ تحميل الفئات...',
        increaseRadius: 'زيادة النطاق',
        neighborhoodsTitle: 'حسب الحي',
        neighborhoodsTagline: 'هل أنت في أحد هذه الأحياء؟ هناك أماكن جيدة بالقرب منك!',
        viewMoreNeighborhoods: 'عرض المزيد من الأحياء >',
        noNearbyResultsRadius: 'لا توجد أماكن ضمن النطاق المحدد.'
      },
      header: {
        title: 'Role Paulista',
        tagline: 'أفضل توصية للأماكن التي زرتها — بنقرة واحدة'
      },
      common: {
        back: 'رجوع',
        details: 'عرض التفاصيل',
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
      footer: { home: 'الرئيسية', search: 'بحث', about: 'حول' },
      placeDetail: {
        openNow: 'مفتوح الآن',
        closedNow: 'مغلق الآن'
      },
      whereIsToday: { title: 'فأين نذهب اليوم؟' },
      placeType: {
        RESTAURANT: 'مطاعم',
        BAR: 'بارات',
        COFFEE: 'مقاهي',
        NIGHTLIFE: 'الحياة الليلية',
        NATURE: 'طبيعة',
        TOURIST_SPOT: 'معالم سياحية',
        FREE: 'مجاني'
      },
      nearbyMap: { title: 'خريطة القرب', noneInRadius: 'لا توجد نقاط ضمن النطاق الحالي.', pointsDisplayed: '{{count}} نقطة معروضة.', you: 'أنت' }
    }
  }
  ,
  it: {
    translation: {
      home: {
        nearMeTitle: 'Vicino a me',
        nearMeSubtitle: '(entro {{km}} km)',
        allowLocation: 'Consenti posizione',
        loadingCategories: 'Caricamento categorie...',
        increaseRadius: 'Aumenta raggio',
        neighborhoodsTitle: 'Per quartiere',
        neighborhoodsTagline: 'Sei in uno di questi quartieri? Ci sono bei posti nelle vicinanze!',
        viewMoreNeighborhoods: 'vedi altri quartieri >',
        noNearbyResultsRadius: 'Nessun luogo nel raggio selezionato.'
      },
      header: { title: 'Role Paulista', tagline: 'La migliore raccomandazione dei posti che ho visitato, a portata di tocco' },
      common: {
        back: 'Indietro',
        details: 'vedi dettagli',
        selectLanguage: 'Seleziona una lingua',
        changeDistance: 'Cambia distanza',
        all: 'Tutto',
        filter: 'Filtro:',
        close: 'Chiudi',
        loading: 'Caricamento…',
        loadError: "Errore nel caricamento dei dati.",
        noPlaces: 'Nessun luogo trovato.',
        version: 'Versione'
      },
      footer: { home: 'Home', search: 'Cerca', about: 'Info' },
      placeDetail: {
        openNow: 'Aperto ora',
        closedNow: 'Chiuso'
      },
      whereIsToday: { title: 'Allora, dove si va oggi?' },
      placeType: {
        RESTAURANT: 'Ristoranti',
        BAR: 'Bar',
        COFFEE: 'Caffetterie',
        NIGHTLIFE: 'Vita notturna',
        NATURE: 'Natura',
        TOURIST_SPOT: 'Luoghi turistici',
        FREE: 'Gratuito'
      },
      nearbyMap: { title: 'Mappa vicinanza', noneInRadius: 'Nessun punto nel raggio corrente.', pointsDisplayed: '{{count}} punto(i) mostrati.', you: 'Tu' }
    }
  },
  nl: {
    translation: {
      home: {
        nearMeTitle: 'Bij mij in de buurt',
        nearMeSubtitle: '(binnen {{km}} km afstand)',
        allowLocation: 'Locatie toestaan',
        loadingCategories: 'Categorieën laden...',
        increaseRadius: 'Vergroot straal',
        neighborhoodsTitle: 'Per buurt',
        neighborhoodsTagline: 'Ben je in een van deze buurten? Leuke plekken in de buurt!',
        viewMoreNeighborhoods: 'meer buurten bekijken >',
        noNearbyResultsRadius: 'Geen plaatsen binnen de gekozen straal.'
      },
      header: { title: 'Role Paulista', tagline: 'De beste aanbeveling van plekken waar ik ben geweest, binnen handbereik' },
      common: {
        back: 'Terug',
        details: 'bekijk details',
        selectLanguage: 'Selecteer een taal',
        changeDistance: 'Afstand wijzigen',
        all: 'Alles',
        filter: 'Filter:',
        close: 'Sluiten',
        loading: 'Laden…',
        loadError: 'Fout bij het laden van gegevens.',
        noPlaces: 'Geen plaatsen gevonden.',
        version: 'Versie'
      },
      footer: { home: 'Home', search: 'Zoeken', about: 'Over' },
      placeDetail: {
        openNow: 'Nu open',
        closedNow: 'Gesloten'
      },
      whereIsToday: { title: 'Dus, waar is het vandaag?' },
      placeType: {
        RESTAURANT: 'Restaurants',
        BAR: 'Bars',
        COFFEE: 'Koffiebars',
        NIGHTLIFE: 'Uitgaansleven',
        NATURE: 'Natuur',
        TOURIST_SPOT: 'Toeristische bezienswaardigheden',
        FREE: 'Gratis'
      },
      nearbyMap: { title: 'Kaart in de buurt', noneInRadius: 'Geen punten binnen de huidige straal.', pointsDisplayed: '{{count}} punten weergegeven.', you: 'Jij' }
    }
  }
  ,
  tr: {
    translation: {
      home: {
        nearMeTitle: 'Yakınımda',
        nearMeSubtitle: '({{km}} km içinde)',
        allowLocation: 'Konuma izin ver',
        loadingCategories: 'Kategoriler yükleniyor...',
        increaseRadius: 'Yarıçapı artır',
        neighborhoodsTitle: 'Mahalleye göre',
        neighborhoodsTagline: 'Bu mahallelerden birindeyseniz? Yakında güzel yerler var!',
        viewMoreNeighborhoods: 'daha fazla mahalle göster >',
        noNearbyResultsRadius: 'Seçilen yarıçap içinde yer yok.'
      },
      header: { title: 'Role Paulista', tagline: 'Gittiğim yerlerin en iyi önerisi — tek dokunuşla' },
      common: {
        back: 'Geri', details: 'detayları gör', selectLanguage: 'Bir dil seçin', changeDistance: 'Mesafeyi değiştir', all: 'Hepsi', filter: 'Filtre:', close: 'Kapat', loading: 'Yükleniyor…', loadError: 'Veri yüklenirken hata oluştu.', noPlaces: 'Hiç yer bulunamadı.', version: 'Sürüm'
      },
      footer: { home: 'Anasayfa', search: 'Ara', about: 'Hakkında' },
      placeDetail: {
        openNow: 'Şu anda açık',
        closedNow: 'Kapalı'
      },
      whereIsToday: { title: 'Peki, bugün nereye gidiyoruz?' },
      placeType: {
        RESTAURANT: 'Restoranlar',
        BAR: 'Barlar',
        COFFEE: 'Kafeler',
        NIGHTLIFE: 'Gece hayatı',
        NATURE: 'Doğa',
        TOURIST_SPOT: 'Turistik noktalar',
        FREE: 'Ücretsiz'
      },
      nearbyMap: { title: 'Yakındaki Harita', noneInRadius: 'Mevcut yarıçap içinde nokta yok.', pointsDisplayed: '{{count}} nokta gösterildi.', you: 'Sen' }
    }
  },
  pl: {
    translation: {
      home: {
        nearMeTitle: 'W pobliżu',
        nearMeSubtitle: '(w promieniu {{km}} km)',
        allowLocation: 'Zezwól na lokalizację',
        loadingCategories: 'Ładowanie kategorii...',
        increaseRadius: 'Zwiększ promień',
        neighborhoodsTitle: 'Według dzielnicy',
        neighborhoodsTagline: 'Jesteś w jednej z tych dzielnic? Dobre miejsca w pobliżu!',
        viewMoreNeighborhoods: 'zobacz więcej dzielnic >',
        noNearbyResultsRadius: 'Brak miejsc w wybranym promieniu.'
      },
      header: { title: 'Role Paulista', tagline: 'Najlepsze rekomendacje miejsc, w których byłem — na wyciągnięcie ręki' },
      common: {
        back: 'Wstecz', details: 'zobacz szczegóły', selectLanguage: 'Wybierz język', changeDistance: 'Zmień odległość', all: 'Wszystko', filter: 'Filtr:', close: 'Zamknij', loading: 'Ładowanie…', loadError: 'Błąd ładowania danych.', noPlaces: 'Nie znaleziono miejsc.', version: 'Wersja'
      },
      footer: { home: 'Strona główna', search: 'Szukaj', about: 'O nas' },
      placeDetail: {
        openNow: 'Otwarte teraz',
        closedNow: 'Zamknięte'
      },
      whereIsToday: { title: 'A więc, gdzie dziś?' },
      placeType: {
        RESTAURANT: 'Restauracje',
        BAR: 'Bary',
        COFFEE: 'Kawiarnie',
        NIGHTLIFE: 'Życie nocne',
        NATURE: 'Przyroda',
        TOURIST_SPOT: 'Atrakcje turystyczne',
        FREE: 'Darmowe'
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
