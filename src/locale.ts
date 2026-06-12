export interface LocaleBundle {
  explorersLog: string
  stopLabel: (stop: number, total: number) => string
  tripLine: (name: string, stop: number, total: number) => string
  fileNo: (no: string) => string
  fieldNotes: string
  journeyThrough: string
  countryData: string
  kicker: {
    geography: string
    animals: string
    cultureHeader: string
    culture: string
    history: string
    wows: string
    myths: string
    phrasebook: (langName: string) => string
    welcome: string
    postcards: string
  }
}

export const LOCALES: Record<string, LocaleBundle> = {
  en: {
    explorersLog: "Explorer's log",
    stopLabel: (stop, total) => `STOP ${String(stop).padStart(2, "0")} / ${total}`,
    tripLine: (name, stop, total) => {
      const trip = name ? `${name}'s trip around the world` : "our trip around the world"
      const rem = total - stop
      return stop === 1
        ? `"First stop on ${trip} — ${rem} countries still to go!"`
        : `"Stop ${stop} on ${trip} — ${rem} countries still to go!"`
    },
    fileNo: (no) => `World Country Book · File No. ${no}`,
    fieldNotes: "Field Notes",
    journeyThrough: "A journey through the country",
    countryData: "Country Data · checked",
    kicker: {
      geography: "Geography",
      animals: "Animals & Nature",
      cultureHeader: "Culture · history · wonders",
      culture: "Culture & Daily Life",
      history: "History & Landmarks",
      wows: "WOW Facts · all checked",
      myths: "Myth → Fact",
      phrasebook: (langName) => `Translation log · say it in ${langName}`,
      welcome: "Welcome",
      postcards: "Postcards · culture · wonders",
    },
  },

  fr: {
    explorersLog: "Journal de l'explorateur",
    stopLabel: (stop, total) => `ÉTAPE ${String(stop).padStart(2, "0")} / ${total}`,
    tripLine: (name, stop, total) => {
      const rem = total - stop
      const explorer = name || "l'explorateur"
      return stop === 1
        ? `"Première étape du voyage de ${explorer} — encore ${rem} pays à découvrir !"`
        : `"Étape ${stop} — encore ${rem} pays à découvrir, ${explorer} !"`
    },
    fileNo: (no) => `Encyclopédie du monde · Dossier ${no}`,
    fieldNotes: "Notes de voyage",
    journeyThrough: "Un voyage à travers ce pays",
    countryData: "Données du pays · vérifiées",
    kicker: {
      geography: "Géographie",
      animals: "Animaux & Nature",
      cultureHeader: "Culture · histoire · merveilles",
      culture: "Culture & Vie quotidienne",
      history: "Histoire & Monuments",
      wows: "Le savais-tu ?",
      myths: "Idée reçue → Vérité",
      phrasebook: (langName) => `On parle ${langName} ici — essaie ces mots !`,
      welcome: "Bienvenue",
      postcards: "Cartes postales · culture · merveilles",
    },
  },

  vi: {
    explorersLog: "Nhật ký thám hiểm",
    stopLabel: (stop, total) => `CHẶNG ${String(stop).padStart(2, "0")} / ${total}`,
    tripLine: (name, stop, total) => {
      const rem = total - stop
      const explorer = name || "chúng ta"
      return stop === 1
        ? `"Chặng đầu tiên trong hành trình của ${explorer} — còn ${rem} quốc gia đang chờ!"`
        : `"Chặng ${stop} — còn ${rem} quốc gia trên hành trình của ${explorer}!"`
    },
    fileNo: (no) => `Sách Thế Giới · Hồ sơ ${no}`,
    fieldNotes: "Ghi chép thực địa",
    journeyThrough: "Hành trình qua đất nước",
    countryData: "Dữ liệu quốc gia · đã kiểm tra",
    kicker: {
      geography: "Địa lý",
      animals: "Động vật & Thiên nhiên",
      cultureHeader: "Văn hóa · lịch sử · kỳ quan",
      culture: "Văn hóa & Đời sống",
      history: "Lịch sử & Địa danh",
      wows: "Bạn có biết không?",
      myths: "Sự thật bất ngờ",
      phrasebook: (langName) => `Học nói tiếng ${langName}`,
      welcome: "Chào mừng đến",
      postcards: "Bưu ảnh · văn hóa · kỳ quan",
    },
  },
}

export const DEFAULT_LOCALE = LOCALES.en
