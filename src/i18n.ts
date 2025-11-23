import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Load persisted language or default
const savedLang = (typeof window !== 'undefined' && localStorage.getItem('lang')) || 'pt';

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
        title: 'Busca Sampa',
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
      whereIsToday: { title: 'E aí, onde é hoje?', subtitle: 'lista de lugares onde fui, por categoria, dá uma olhada ;)' },
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
        openNow: 'Aberto agora',
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
        intro: 'Lugares neste bairro (todas as categorias). Filtre por tipo usando os botões abaixo.'
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
        authorTag: 'Criador do Busca Sampa',
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
        TOURIST_SPOT: 'Pontos Turísticos',
        FREE: 'Gratuitos'
      },
      placeList: {
        environmentTitle: 'Tipo de ambiente:',
        subtitleTemplate: 'Descubra {{article}} {{noun}} com o seu tipo\nmais perto de você :)',
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
        title: 'Busca Sampa',
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
      whereIsToday: { title: '¿Y entonces, dónde es hoy?' },
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
        openNow: 'Abierto ahora',
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
      recommendationsOrigin: { title: '¿De dónde vienen estas recomendaciones?' },
      support: { title: 'Apoya el sitio' },
      about: { title: '¿Quién soy?', paragraph: 'Página sobre ti. Diseño vendrá después.' },
      aboutMe: {
        authorTag: 'Creador de Busca Sampa',
        aboutHeading: 'Sobre mí',
        socialHeading: 'Redes sociales',
        bio: 'Desarrollador móvil hace más de 8 años. Apasionado por tecnología, viajes y explorar São Paulo.'
      },
      howToRecommend: { title: '¿Cómo recomiendo un lugar?' },
      placeType: {
        RESTAURANT: 'Restaurantes', BAR: 'Bares', COFFEE: 'Cafeterías', NIGHTLIFE: 'Vida nocturna', NATURE: 'Naturaleza', TOURIST_SPOT: 'Puntos turísticos', FREE: 'Gratuitos'
      }
      ,
      placeList: {
        environmentTitle: 'Tipo de ambiente:',
        subtitleTemplate: 'Descubra {{article}} {{noun}} cerca de ti\nmás cerca de ti :)',
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
      header: { title: 'Busca Sampa', tagline: 'La meilleure recommandation des lieux visités, à portée de main' },
      common: {
        back: 'Retour', details: 'voir détails', selectLanguage: 'Choisir une langue', changeDistance: 'Changer distance', all: 'Tout', filter: 'Filtre:', close: 'Fermer', loading: 'Chargement…', loadError: 'Erreur de chargement.', noPlaces: 'Aucun lieu trouvé.', version: 'Version'
      },
      whereIsToday: { title: 'Alors, c’est où aujourd’hui?' },
      list: {
        nameHeader: 'Nom', neighborhoodHeader: 'Quartier', typeHeader: 'Type', orderNameAsc: 'NOM A-Z', orderNameDesc: 'NOM Z-A', orderNeighborhoodAsc: 'QUARTIER A-Z', orderNeighborhoodDesc: 'QUARTIER Z-A'
      },
      placeDetail: {
        loading: 'Chargement des détails...', notFound: 'Lieu introuvable.', opensMonday: 'ouvert le lundi', opensSunday: 'ouvert le dimanche', opensHoliday: 'ouvert les jours fériés', alreadyVisited: '✓ Déjà visité et recommandé', notVisited: '⚠️ Pas encore visité', visitModalTitle: 'À propos des lieux visités', visitModalParagraph: 'Toutes les recommandations sont des lieux que j’ai visités et recommande, plus d’autres encore non visités.', neverEmphasis: 'JAMAIS', priceLabel: 'Prix :', environmentTypeLabel: 'Type d’ambiance :', hoursTitle: 'Horaires', viewHours: 'voir horaires ▼', locationTitle: 'Localisation', openNow: 'Ouvert maintenant', closedNow: 'Fermé maintenant', locationDescription: 'Unité et adresse ici; tracez la route via le bouton ci-dessous', streetPrefix: 'Rue :', googleMapsButton: 'Ouvrir Google Maps', instagramTitle: 'Instagram', instagramSubtitle: 'Suivez le profil officiel :', follow: 'Suivre', menuTitle: 'Menu', menuSubtitle: 'Voir le menu', menuButton: 'Ouvrir menu', notesTitle: 'Notes', reportProblem: 'Signaler un problème', visitModalEnding: 'recommanderais des lieux à éviter :)'
      },
      openingHours: { title: 'Horaires', closed: 'Fermé', range: 'de {{open}} à {{close}}', notProvided: 'Horaires non fournis.', followButton: 'Suivre' },
      footer: { home: 'Accueil', search: 'Chercher', about: 'À propos' },
      distanceSelect: { title: 'Sélectionnez la distance', searchButton: 'Chercher' },
      nearbyMap: { title: 'Carte proximité', noneInRadius: 'Aucun point dans le rayon.', pointsDisplayed: '{{count}} point(s) affiché(s).', you: 'Vous' },
      recommendationsOrigin: { title: 'D’où viennent ces recommandations ?' },
      support: { title: 'Soutenir le site' },
      about: { title: 'Qui suis-je ?', paragraph: 'Page à propos. Maquette à venir.' },
      aboutMe: { authorTag: 'Créateur de Busca Sampa', aboutHeading: 'À propos de moi', socialHeading: 'Réseaux sociaux', bio: 'Développeur mobile depuis plus de 8 ans, passionné de technologie et d’exploration de São Paulo.' },
      howToRecommend: { title: 'Comment recommander un lieu ?' },
      placeType: { RESTAURANT: 'Restaurants', BAR: 'Bars', COFFEE: 'Cafés', NIGHTLIFE: 'Vie nocturne', NATURE: 'Nature', TOURIST_SPOT: 'Sites touristiques', FREE: 'Gratuit' }
    }
  },
  ru: {
    translation: {
      home: { nearMeTitle: 'Рядом со мной', allowLocation: 'Разрешить геолокацию', loadingCategories: 'Загрузка категорий...', increaseRadius: 'Увеличить радиус', neighborhoodsTitle: 'По району', neighborhoodsTagline: 'Вы в одном из этих районов? Рядом есть интересное!', viewMoreNeighborhoods: 'ещё районы >', noNearbyResultsRadius: 'Нет мест в выбранном радиусе.' },
      header: { title: 'Busca Sampa', tagline: 'Лучшие рекомендации мест, где я был — в один клик' },
      common: { back: 'Назад', details: 'подробнее', selectLanguage: 'Выберите язык', changeDistance: 'Изменить расстояние', all: 'Все', filter: 'Фильтр:', close: 'Закрыть', loading: 'Загрузка…', loadError: 'Ошибка загрузки данных.', noPlaces: 'Ничего не найдено.', version: 'Версия' },
      whereIsToday: { title: 'Ну что, где сегодня?'},
      list: { nameHeader: 'Название', neighborhoodHeader: 'Район', typeHeader: 'Тип', orderNameAsc: 'ИМЯ A-Z', orderNameDesc: 'ИМЯ Z-A', orderNeighborhoodAsc: 'РАЙОН A-Z', orderNeighborhoodDesc: 'РАЙОН Z-A' },
      placeDetail: { loading: 'Загрузка деталей...', notFound: 'Место не найдено.', opensMonday: 'открыто по понедельникам', opensSunday: 'открыто по воскресеньям', opensHoliday: 'открыто в праздники', alreadyVisited: '✓ Был и рекомендую', notVisited: '⚠️ Еще не был', visitModalTitle: 'О посещенных местах', visitModalParagraph: 'Все рекомендации — места где я был и рекомендую, плюс те, что мне советовали и я еще не посетил.', neverEmphasis: 'НИКОГДА', priceLabel: 'Цена:', environmentTypeLabel: 'Тип атмосферы:', hoursTitle: 'Время работы', viewHours: 'смотреть часы ▼', locationTitle: 'Локация', openNow: 'Открыто сейчас', closedNow: 'Закрыто сейчас', locationDescription: 'Здесь адрес и можно проложить маршрут кнопкой ниже', streetPrefix: 'Улица:', googleMapsButton: 'Открыть в Google Maps', instagramTitle: 'Instagram', instagramSubtitle: 'Подписаться на официальный профиль:', follow: 'Подписаться', menuTitle: 'Меню', menuSubtitle: 'Посмотреть меню', menuButton: 'Открыть меню', notesTitle: 'Заметки', reportProblem: 'Сообщить о проблеме', visitModalEnding: 'рекомендовал бы места куда не стоит идти :)' },
      openingHours: { title: 'Время работы', closed: 'Закрыто', range: 'с {{open}} до {{close}}', notProvided: 'Время не указано.', followButton: 'Подписаться' },
      footer: { home: 'Главная', search: 'Поиск', about: 'О сайте' },
      distanceSelect: { title: 'Выберите расстояние', searchButton: 'Искать' },
      nearbyMap: { title: 'Карта рядом', noneInRadius: 'Нет точек в текущем радиусе.', pointsDisplayed: '{{count}} точк(и).', you: 'Вы' },
      recommendationsOrigin: { title: 'Откуда эти рекомендации?' },
      support: { title: 'Поддержите сайт' },
      about: { title: 'Кто я?', paragraph: 'Страница о вас. Макет позже.' },
      aboutMe: { authorTag: 'Создатель Busca Sampa', aboutHeading: 'Обо мне', socialHeading: 'Соцсети', bio: 'Мобильный разработчик 8+ лет. Люблю технологии, путешествия и исследовать Сан-Паулу.' },
      howToRecommend: { title: 'Как порекомендовать место?' },
      placeType: { RESTAURANT: 'Рестораны', BAR: 'Бары', COFFEE: 'Кофейни', NIGHTLIFE: 'Ночная жизнь', NATURE: 'Природа', TOURIST_SPOT: 'Достопримечательности', FREE: 'Бесплатно' }
    }
  },
  zh: {
    translation: {
      home: { nearMeTitle: '附近', allowLocation: '允许定位', loadingCategories: '正在加载分类...', increaseRadius: '增加半径', neighborhoodsTitle: '按街区', neighborhoodsTagline: '你在这些街区之一吗？附近有好地方！', viewMoreNeighborhoods: '更多街区 >', noNearbyResultsRadius: '所选半径内没有地点。' },
      header: { title: 'Busca Sampa', tagline: '我去过的最佳推荐，一触即达' },
      common: { back: '返回', details: '查看详情', selectLanguage: '选择语言', changeDistance: '更改距离', all: '全部', filter: '筛选:', close: '关闭', loading: '加载中…', loadError: '加载数据出错。', noPlaces: '未找到地点。', version: '版本' },
      whereIsToday: { title: '那今天去哪儿?'},
      list: { nameHeader: '名称', neighborhoodHeader: '街区', typeHeader: '类型', orderNameAsc: '名称 A-Z', orderNameDesc: '名称 Z-A', orderNeighborhoodAsc: '街区 A-Z', orderNeighborhoodDesc: '街区 Z-A' },
      placeDetail: { loading: '正在加载详情...', notFound: '未找到地点。', opensMonday: '周一营业', opensSunday: '周日营业', opensHoliday: '节假日营业', alreadyVisited: '✓ 我去过并推荐', notVisited: '⚠️ 还没去过', visitModalTitle: '关于我去过的地方', visitModalParagraph: '所有推荐都是我去过并推荐的地方，另有一些别人推荐我还没去。', neverEmphasis: '绝不', priceLabel: '价格:', environmentTypeLabel: '环境类型:', hoursTitle: '营业时间', viewHours: '查看时间 ▼', locationTitle: '位置', openNow: '正在营业', closedNow: '已打烊', locationDescription: '这里是地址，点击下方按钮可规划路线', streetPrefix: '街道:', googleMapsButton: '打开 Google 地图', instagramTitle: 'Instagram', instagramSubtitle: '关注官方账号：', follow: '关注', menuTitle: '菜单', menuSubtitle: '查看店铺菜单', menuButton: '打开菜单', notesTitle: '备注', reportProblem: '报告问题', visitModalEnding: '会推荐你不该去的地方 :)' },
      openingHours: { title: '营业时间', closed: '关闭', range: '{{open}} - {{close}}', notProvided: '未提供时间。', followButton: '关注' },
      footer: { home: '首页', search: '搜索', about: '关于' },
      distanceSelect: { title: '选择距离', searchButton: '搜索' },
      nearbyMap: { title: '附近地图', noneInRadius: '当前半径内无点。', pointsDisplayed: '显示 {{count}} 个点。', you: '你' },
      recommendationsOrigin: { title: '这些推荐来自哪里？' },
      support: { title: '支持本网站' },
      about: { title: '我是谁？', paragraph: '关于页面。稍后提供设计。' },
      aboutMe: { authorTag: 'Busca Sampa 创作者', aboutHeading: '关于我', socialHeading: '社交网络', bio: '8+年移动开发，热爱技术、旅行、美食及探索圣保罗。' },
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
        title: 'Busca Sampa',
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
        openNow: 'Open now',
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
        intro: 'Places in this neighborhood (all categories). Filter by type using the buttons below.'
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
        authorTag: 'Creator of Busca Sampa',
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
        subtitleTemplate: 'Discover {{article}} {{noun}} of your type\nclosest to you :)',
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
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLang,
    fallbackLng: 'pt',
    interpolation: { escapeValue: false }
  });

i18n.on('languageChanged', (lng) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('lang', lng);
    document.documentElement.lang = lng;
  }
});

export default i18n;
