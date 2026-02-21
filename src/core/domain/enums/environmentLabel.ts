import i18n from '@/i18n';

function normalizeTag(tag: string) {
  if (!tag) return tag;
  return tag.replace(/-/g, '_').toUpperCase();
}

const FALLBACK_MAP: Record<string, string> = {
    PET_FRIENDLY: "Permite animais",
    BISTRO: "Bistrô",
    THEMED: "Temático",
    TOUR: "Tours",
    STADIUM: "Estádio",
    LIVE_MUSIC: "Música Ao Vivo",
    KARAOKE: "Karaokê",
    ROCK_BAR: "Rock Bar",
    BOTECO: "Boteco",
    RUSSO: "Russo",
    JAPANESE: "Japonês",
    ITALIAN: "Italiano",
    CHINESE: "Chinês",
    AMERICAN: "Americano",
    FASTFOOD: "Fast Food",
    VEGETARIAN: "Vegetariano",
    VEGAN: "Vegano",
    BRAZILIAN: "Brasileiro",
    SEAFOOD: "Frutos do Mar",
    ASIAN: "Asiático",
    KOREAN: "Coreano",
    MEXICAN: "Mexicano",
    INDIAN: "Indiano",
    LEBANESE: "Libanês",
    TURKISH: "Turco",
    GERMAN: "Alemão",
    SPANISH: "Espanhol",
    FRENCH: "Francês",
    THAI: "Tailandês",
    AMBIANCE: "Ambiente Decorado",
    GREEK: "Grego",
    FILIPINO: "Filipino",
    MALAYSIAN: "Malaio",
    PERUVIAN: "Peruano",
    ARGENTINIAN: "Argentino",
    AFRICAN: "Africano",
    TAIWANESE: "Taiwanês",
    HAMBURGUER: "Hamburgueria",
    MOLECULAR_GASTRONOMY: "Gastronomia Molecular",
    EXPERIENCE: "Jantar com Experiência",
    NORDIC: "Nórdico",
    IRANIAN: "Iraniano",
    ARGENTINE: "Argentino",
    VIETNAMESE: "Vietnamita",
    BOLIVIAN: "Boliviano",
    RUSSIAN: "Russo",
    HISTORIC_PLACE: "Histórico",
    SAMBA: "Samba",
    FORRO: "Forró",
    PAGODE: "Pagode",
    ALLYOUCAN_EAT: "Rodízio",
    URUGUAYAN: "Uruguaio",
    OPEN_24_HOURS: "24 Horas",
    ARMENIAN: "Armênio",
    COLOMBIAN: "Colombiano",
    MILKSHAKE: "Milkshake",
    CULTURE: "Cultural",
    ART_EXHIBITION: "Exposições",
    MUSEUM: "Museu",
    PARK: "Parque",
    ZOO: "Zoológico",
    THEATER: "Teatro",
    RELIGIOUS_SITE: "Religioso",
    SHOP_LOCATION: "Compras",
    OPENED_SPACE: "Espaço Aberto",
    MONUMENT: "Monumento",
    SINGLE_ACTIVITY: "Individual",
    FAMILY_ACTIVITY: "Família",
    GROUP_ACTIVITY: "Grupos",
    COWORKING: "Coworking",
    OTHERS: "Outros",
};

export function getEnvironmentLabel(tag: string): string {
  const key = normalizeTag(tag);
  const path = `environment.${key}`;
  try {
    if (i18n && i18n.exists(path)) return i18n.t(path);
  } catch (_) {}
  return FALLBACK_MAP[key] || tag;
}
