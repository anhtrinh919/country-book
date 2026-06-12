/* i18n.ts — UI string catalog for the connective-tissue pages (everything that is NOT
   country-spread data). Country content lives in data/ data-vi/ data-fr/; this file covers
   the cover, passport, dividers, quizzes, map, glossary, records, reader chrome, etc.

   Three locales: en (English book), vi (Vietnamese toggle), fr (young-reader French build).
   Logic files (book.config, profile, progress) stay English-keyed; display strings are looked
   up here by the English key / id, so behaviour never changes — only what the child reads. */
import type { Lang } from "./lang";
import type { Continent } from "../book.config";

/* ════════════════ chrome / page strings ════════════════ */
export interface UIBundle {
  cover: {
    kicker: string; anAtlasOf: string; title: [string, string, string];
    subtitle: (n: number) => string; journeyStarts: string; fieldEdition: string;
    belongsTo: string; chiefExplorer: (age: number) => string; quote: string;
  };
  passport: {
    title: string; typeTag: string; tagline: string; memberSince: (no: string) => string;
    officialRecord: string;
    rec: {
      passportNo: string; dateIssued: string; dateIssuedVal: string; nationality: string;
      homeCountry: string; age: string; ageVal: (a: number) => string; rank: string;
      mission: string; missionVal: (n: number) => string; issuingAuthority: string; authority: string;
    };
    stat: { countries: string; badges: string; pages: string };
    pledgeTitle: string; pledge: string;
    recentJourneys: string; drawFlags: string; journeysEmpty: string;
    signature: string; dateOfIssue: string;
    stampsCollected: string; badgesTag: (e: number, t: number) => string; collectAll: (t: number) => string;
    dash: {
      journal: string; latest: string; stampAsExplore: string; noStamps: string;
      nameStop: (name: string, stop: string) => string; fillHint: string;
      stampedOn: (date: string) => string; openAny: string; countriesVisited: string;
      drawFav: string; andMore: (n: number) => string; appearHere: string; gatherHere: string; begin: string;
    };
    contKicker: (print: boolean) => string; sixLands: string;
    treasureKicker: string; eightHunts: string;
    mileKicker: string; allTheWay: string; places: string;
    nudge: {
      howToFill: string; nextRank: (t: string) => string; master: string;
      howToFillBody: string; nextBody: (rem: number, at: number) => string; masterBody: string;
    };
  };
  divider: {
    partOf: (i: number) => string; stops: (a: number, b: number) => string;
    continentN: (i: number) => string; countriesAhead: string;
    countries: string; quizStop: string; quizStops: string; ofTrip: string;
  };
  planet: {
    title: string; tag: string;
    lead: (n: number) => string; stats: [string, string][];
    oceansLine: string; sixTitle: string; countriesUnit: string;
  };
  howto: {
    title: string; guide: string; lead: string; parts: [string, string][];
    quizzesTitle: string; quizzesLead: string;
    stampsTitle: string; stampsBody: (n: number) => string; ready: (name: string) => string;
  };
  superlatives: { title: string; titleR: string; tag: string };
  glossary: { titleL: string; titleR: string };
  complete: {
    youDidItPre: string; keepGoingPre: string;
    doneBody: (n: number) => string; progBody: (c: number, n: number) => string;
    ofCountries: (n: number) => string; ofStamps: (n: number) => string;
    master: string; stampWall: string; earnedTag: (e: number, t: number) => string;
    continents: string; specialCollections: string; milestones: string;
  };
  index: { title: string; continued: string; az: string; countries: (n: number) => string };
  toc: {
    title: string; continued: string; sub: (print: boolean) => string;
    countries: (n: number) => string;
  };
  quiz: {
    stopNo: (i: string) => string; challenge: (cont: string) => string;
    answersBack: string; score: (s: number, t: number) => string;
    leadPrint: string; lead: string; keepGoing: string; countriesTag: (n: number) => string;
    kind: Record<string, string>;
    perfect: string; great: string; tryAgain: string;
    flagPrompt: string; capitalPrompt: (c: string) => string;
    animalPrompt: (a: string) => string; landmarkPrompt: (l: string) => string;
    answerKeyTitle: string; answerKeyContinued: string; howDidYouDo: string; quizzesTag: (n: number) => string;
  };
  worldmap: {
    kickerPrint: string; kicker: string; title: string;
    subPrint: string; sub: string;
    tinyTitle: (print: boolean) => string; stop: string; goToPage: (n: number) => string;
  };
  reader: {
    prev: string; next: string; markVisited: string; visited: string; map: string;
    page: string; reset: string;
    resetTitle: string; resetBody: (name: string) => string; cancel: string; resetAll: string;
  };
  onboard: {
    title: string; lead: string; yourName: string; age: string; nationality: string;
    homeCountry: string; cancel: string; start: string;
    namePh: string; agePh: string; nationalityPh: string;
  };
}

export const UI: Record<Lang, UIBundle> = {
  /* ──────────────────────────── ENGLISH ──────────────────────────── */
  en: {
    cover: {
      kicker: "World Country Book", anAtlasOf: "AN ATLAS OF", title: ["THE", "WHOLE", "WORLD"],
      subtitle: (n) => `${n} countries · 6 continents · one big trip`,
      journeyStarts: "The journey starts in Vietnam.", fieldEdition: "Field edition",
      belongsTo: "This atlas belongs to", chiefExplorer: (age) => `Chief Explorer · age ${age}`,
      quote: "Somewhere, something incredible is waiting to be known.",
    },
    passport: {
      title: "Explorer Passport", typeTag: "Type E · Planet Earth",
      tagline: "Collector of countries · friend to every animal",
      memberSince: (no) => `Member since 2026 · No. ${no}`, officialRecord: "Passport · Official Record",
      rec: {
        passportNo: "Passport No.", dateIssued: "Date Issued", dateIssuedVal: "2026 · Earth",
        nationality: "Nationality", homeCountry: "Home Country", age: "Age",
        ageVal: (a) => `${a} years old`, rank: "Rank", mission: "Mission",
        missionVal: (n) => `Visit all ${n} places`, issuingAuthority: "Issuing Authority",
        authority: "The World Country Book",
      },
      stat: { countries: "Countries", badges: "Badges Earned", pages: "Pages Explored" },
      pledgeTitle: "The Explorer's Pledge",
      pledge: "I promise to read about every country, learn one hello in every language, and find the most surprising animal on each page. No place is too small and no fact too strange!",
      recentJourneys: "Recent journeys · flags in the book", drawFlags: "Draw your favourite flags here",
      journeysEmpty: "Your collected flags will appear here as you read the book.",
      signature: "Explorer's Signature", dateOfIssue: "Date of Issue",
      stampsCollected: "Stamps Collected", badgesTag: (e, t) => `${e} / ${t} Badges Earned`,
      collectAll: (t) => `Collect all ${t} badges`,
      dash: {
        journal: "Your stamp journal", latest: "Latest Entry", stampAsExplore: "Stamp as you explore!",
        noStamps: "No stamps yet", nameStop: (name, stop) => `${name} · Stop ${stop}`,
        fillHint: "Colour in a stamp each time you finish a country — and fill in the total below.",
        stampedOn: (date) => `Stamped on ${date} 2026 — keep going!`,
        openAny: "Open any country and stay a little while to earn your first stamp.",
        countriesVisited: "Countries visited", drawFav: "Draw or stamp your favourite stops here.",
        andMore: (n) => `…and ${n} more stamps already in the book.`,
        appearHere: "Your stamps appear here as you explore.",
        gatherHere: "Your recent stamps will gather here.", begin: "Begin!",
      },
      contKicker: (print) => print ? "Continents · colour one in when you finish it" : "Continents · finish one to earn its badge",
      sixLands: "Six Lands to Conquer",
      treasureKicker: "Special collections · themed quests", eightHunts: "Eight Treasure Hunts",
      mileKicker: "Milestones · the long road", allTheWay: "All the Way Around the World", places: "places",
      nudge: {
        howToFill: "How to fill your passport", nextRank: (t) => `Next rank: ${t}`, master: "You're a Master Explorer!",
        howToFillBody: "Colour in a stamp each time you finish a country or a whole continent — and watch your passport fill up!",
        nextBody: (rem, at) => `Just ${rem} more ${rem === 1 ? "country" : "countries"} to reach ${at} and rank up — you can do it!`,
        masterBody: "You've explored every country on Earth. Incredible!",
      },
    },
    divider: {
      partOf: (i) => `Part ${i} of 6`, stops: (a, b) => `Stops ${a}–${b}`,
      continentN: (i) => `CONTINENT ${String(i).padStart(2, "0")}`, countriesAhead: "Countries ahead",
      countries: "countries", quizStop: "quiz stop", quizStops: "quiz stops", ofTrip: "of the trip",
    },
    planet: {
      title: "Our Planet at a Glance", tag: "Planet Earth",
      lead: (n) => `Earth is a giant ball of rock and water spinning through space. Its land is split into 6 continents, surrounded by 5 great oceans. On those continents live ${n} countries — and you're about to visit every one!`,
      stats: [["8 billion", "people on Earth"], ["~7,000", "languages spoken"], ["71%", "covered by ocean"], ["24 hours", "for one full spin"]],
      oceansLine: "The 5 oceans: Pacific · Atlantic · Indian · Southern · Arctic.",
      sixTitle: "The 6 continents", countriesUnit: "countries",
    },
    howto: {
      title: "How to Read This Book", guide: "Explorer's guide",
      lead: "Every country gets two facing pages. The left page introduces the country; the right page is your “field notes”. Here's what each part means:",
      parts: [
        ["The masthead", "The country's name, its flag, and how to say its name."],
        ["Country data", "Quick facts — capital, people, money, language, and more."],
        ["Explorer's log", "Your stamp! It shows which stop you're on around the world."],
        ["Field notes", "Stories about the land, animals, culture, and history."],
        ["WOW facts", "Seven surprising true things you can share with friends."],
        ["Translation log", "Five words you can actually say in the local language."],
      ],
      quizzesTitle: "How the quizzes work",
      quizzesLead: "Every dozen countries or so, you reach a Quiz Stop. On screen you can tap your answer and watch your score climb. In the printed book, circle your answer and check the Answer Key at the back.",
      stampsTitle: "Collect your stamps!",
      stampsBody: (n) => `Each country adds a stop to your Explorer's Log. Finish a whole continent and you earn its stamp on your passport. Visit all ${n} and you become a true Master Explorer.`,
      ready: (name) => `Ready, ${name}? Turn the page and let's go! →`,
    },
    superlatives: { title: "World Records", titleR: "…and more!", tag: "Champions of Earth" },
    glossary: { titleL: "Little Explorer's Glossary", titleR: "…words to know" },
    complete: {
      youDidItPre: "You did it,", keepGoingPre: "Keep going,",
      doneBody: (n) => `You explored all ${n} countries and circled the whole world.`,
      progBody: (c, n) => `You've explored ${c} of ${n} countries so far. The journey continues!`,
      ofCountries: (n) => `of ${n} countries`, ofStamps: (n) => `of ${n} stamps`,
      master: "★ MASTER EXPLORER ★", stampWall: "Your stamp wall",
      earnedTag: (e, t) => `${e} / ${t} earned`,
      continents: "Continents", specialCollections: "Special collections", milestones: "Milestones",
    },
    index: { title: "Index", continued: "…continued", az: "A–Z", countries: (n) => `${n} countries` },
    toc: {
      title: "Table of Contents", continued: "…the journey continues",
      sub: (print) => `${print ? "find every country" : "tap to jump"} · pg`,
      countries: (n) => `${n} countries`,
    },
    quiz: {
      stopNo: (i) => `QUIZ STOP №${i}`, challenge: (cont) => `${cont} Challenge`,
      answersBack: "answers in the back →", score: (s, t) => `Score ${s} / ${t}`,
      leadPrint: "Circle your answer. Check the back of the book to see how you did!",
      lead: "Tap an answer — green means right! Test what you remember from the countries you just visited.",
      keepGoing: "…keep going!", countriesTag: (n) => `${n} COUNTRIES`,
      kind: { flag: "Guess the flag", capital: "Match the capital", animal: "Which animal lives here", landmark: "Spot the landmark" },
      perfect: "🌟 Perfect score! Master Explorer!", great: "Great exploring! 🎒", tryAgain: "Good try — flip back and look again!",
      flagPrompt: "Which country flies this flag?", capitalPrompt: (c) => `What is the capital of ${c}?`,
      animalPrompt: (a) => `Which country is home to the ${a}?`, landmarkPrompt: (l) => `Where would you find ${l}?`,
      answerKeyTitle: "Quiz Answer Key", answerKeyContinued: "…continued", howDidYouDo: "HOW DID YOU DO?", quizzesTag: (n) => `${n} QUIZZES`,
    },
    worldmap: {
      kickerPrint: "MAP OF THE WORLD", kicker: "THE WORLD MAP", title: "The Whole World, One Map",
      subPrint: "Every country, coloured by continent.", sub: "Tap any country to jump to its page →",
      tinyTitle: (print) => `SMALL ISLANDS & MICRO-NATIONS — ${print ? "find them in the index" : "tap a flag"}`,
      stop: "STOP", goToPage: (n) => `Go to page ${n} →`,
    },
    reader: {
      prev: "← Prev", next: "Next →", markVisited: "Mark visited", visited: "✓ Visited", map: "Map",
      page: "page", reset: "Reset",
      resetTitle: "Reset all progress?",
      resetBody: (name) => `This clears every visited page and all collected stamps for ${name}. This can't be undone.`,
      cancel: "Cancel", resetAll: "Reset everything",
    },
    onboard: {
      title: "Make this book yours",
      lead: "Tell us who's exploring. Your name appears on the cover and passport, and your journey starts at home.",
      yourName: "Your name", age: "Age", nationality: "Nationality",
      homeCountry: "Home country — your journey starts here", cancel: "Cancel", start: "Start exploring →",
      namePh: "e.g. Momo", agePh: "7", nationalityPh: "e.g. Vietnamese",
    },
  },

  /* ──────────────────────────── VIETNAMESE ──────────────────────────── */
  vi: {
    cover: {
      kicker: "Sách Thế Giới", anAtlasOf: "TẬP BẢN ĐỒ VỀ", title: ["CẢ", "THẾ", "GIỚI"],
      subtitle: (n) => `${n} quốc gia · 6 châu lục · một chuyến đi lớn`,
      journeyStarts: "Hành trình bắt đầu từ Việt Nam.", fieldEdition: "Ấn bản thực địa",
      belongsTo: "Tập bản đồ này thuộc về", chiefExplorer: (age) => `Trưởng đoàn thám hiểm · ${age} tuổi`,
      quote: "Ở một nơi nào đó, có điều kỳ diệu đang chờ ta khám phá.",
    },
    passport: {
      title: "Hộ chiếu Thám hiểm", typeTag: "Loại E · Hành tinh Trái Đất",
      tagline: "Người sưu tầm các quốc gia · bạn của muôn loài",
      memberSince: (no) => `Thành viên từ 2026 · Số ${no}`, officialRecord: "Hộ chiếu · Hồ sơ chính thức",
      rec: {
        passportNo: "Số hộ chiếu", dateIssued: "Ngày cấp", dateIssuedVal: "2026 · Trái Đất",
        nationality: "Quốc tịch", homeCountry: "Quê hương", age: "Tuổi",
        ageVal: (a) => `${a} tuổi`, rank: "Cấp bậc", mission: "Nhiệm vụ",
        missionVal: (n) => `Đến thăm cả ${n} nơi`, issuingAuthority: "Nơi cấp",
        authority: "Sách Thế Giới",
      },
      stat: { countries: "Quốc gia", badges: "Huy hiệu", pages: "Trang đã đọc" },
      pledgeTitle: "Lời hứa của nhà thám hiểm",
      pledge: "Tớ hứa sẽ đọc về mọi quốc gia, học một lời chào trong mỗi thứ tiếng, và tìm ra con vật bất ngờ nhất trên mỗi trang. Không nơi nào là quá nhỏ và không điều gì là quá lạ!",
      recentJourneys: "Hành trình gần đây · lá cờ trong sách", drawFlags: "Vẽ những lá cờ em thích vào đây",
      journeysEmpty: "Những lá cờ em sưu tầm sẽ hiện ở đây khi em đọc sách.",
      signature: "Chữ ký nhà thám hiểm", dateOfIssue: "Ngày cấp",
      stampsCollected: "Con dấu đã sưu tầm", badgesTag: (e, t) => `${e} / ${t} huy hiệu`,
      collectAll: (t) => `Sưu tầm đủ ${t} huy hiệu`,
      dash: {
        journal: "Sổ con dấu của em", latest: "Mục mới nhất", stampAsExplore: "Đóng dấu khi em khám phá!",
        noStamps: "Chưa có con dấu nào", nameStop: (name, stop) => `${name} · Chặng ${stop}`,
        fillHint: "Tô màu một con dấu mỗi khi em đọc xong một nước — rồi điền tổng số bên dưới.",
        stampedOn: (date) => `Đóng dấu ngày ${date} 2026 — cố lên nào!`,
        openAny: "Mở bất kỳ quốc gia nào và ở lại một lúc để nhận con dấu đầu tiên.",
        countriesVisited: "Số nước đã thăm", drawFav: "Vẽ hoặc đóng dấu những chặng em thích nhất vào đây.",
        andMore: (n) => `…và ${n} con dấu nữa đã có trong sách.`,
        appearHere: "Con dấu của em sẽ hiện ở đây khi em khám phá.",
        gatherHere: "Những con dấu gần đây của em sẽ tụ về đây.", begin: "Bắt đầu!",
      },
      contKicker: (print) => print ? "Châu lục · tô màu một châu khi em đi hết" : "Châu lục · đi hết một châu để nhận huy hiệu",
      sixLands: "Sáu vùng đất cần chinh phục",
      treasureKicker: "Bộ sưu tập đặc biệt · nhiệm vụ theo chủ đề", eightHunts: "Tám cuộc săn kho báu",
      mileKicker: "Cột mốc · chặng đường dài", allTheWay: "Đi vòng quanh cả thế giới", places: "nơi",
      nudge: {
        howToFill: "Cách điền hộ chiếu của em", nextRank: (t) => `Cấp tiếp theo: ${t}`, master: "Em là Bậc thầy thám hiểm rồi!",
        howToFillBody: "Tô màu một con dấu mỗi khi em đọc xong một nước hay cả một châu lục — và xem hộ chiếu của em đầy dần lên!",
        nextBody: (rem, at) => `Chỉ cần ${rem} nước nữa là đến ${at} và lên cấp — em làm được mà!`,
        masterBody: "Em đã khám phá mọi quốc gia trên Trái Đất. Tuyệt vời!",
      },
    },
    divider: {
      partOf: (i) => `Phần ${i} / 6`, stops: (a, b) => `Chặng ${a}–${b}`,
      continentN: (i) => `CHÂU LỤC ${String(i).padStart(2, "0")}`, countriesAhead: "Các nước phía trước",
      countries: "quốc gia", quizStop: "chặng đố vui", quizStops: "chặng đố vui", ofTrip: "của hành trình",
    },
    planet: {
      title: "Hành tinh của chúng ta", tag: "Hành tinh Trái Đất",
      lead: (n) => `Trái Đất là một quả cầu khổng lồ bằng đá và nước đang quay giữa không gian. Đất của nó chia thành 6 châu lục, được 5 đại dương lớn bao quanh. Trên các châu lục ấy có ${n} quốc gia — và em sắp đến thăm tất cả!`,
      stats: [["8 tỉ", "người trên Trái Đất"], ["~7.000", "ngôn ngữ"], ["71%", "là đại dương"], ["24 giờ", "cho một vòng quay"]],
      oceansLine: "5 đại dương: Thái Bình Dương · Đại Tây Dương · Ấn Độ Dương · Nam Đại Dương · Bắc Băng Dương.",
      sixTitle: "Sáu châu lục", countriesUnit: "quốc gia",
    },
    howto: {
      title: "Cách đọc cuốn sách này", guide: "Hướng dẫn thám hiểm",
      lead: "Mỗi quốc gia có hai trang đối diện nhau. Trang bên trái giới thiệu đất nước; trang bên phải là “ghi chép thực địa” của em. Đây là ý nghĩa của từng phần:",
      parts: [
        ["Tiêu đề trang", "Tên nước, lá cờ, và cách đọc tên nước đó."],
        ["Dữ liệu quốc gia", "Thông tin nhanh — thủ đô, dân số, tiền tệ, ngôn ngữ và hơn thế."],
        ["Nhật ký thám hiểm", "Con dấu của em! Nó cho biết em đang ở chặng nào quanh thế giới."],
        ["Ghi chép thực địa", "Câu chuyện về đất đai, động vật, văn hóa và lịch sử."],
        ["Điều bất ngờ", "Bảy điều có thật thú vị em có thể kể cho bạn bè."],
        ["Học nói", "Năm từ em có thể nói thật sự bằng tiếng địa phương."],
      ],
      quizzesTitle: "Đố vui hoạt động ra sao",
      quizzesLead: "Cứ khoảng một chục quốc gia, em lại tới một Chặng đố vui. Trên màn hình, em chạm vào đáp án và xem điểm tăng lên. Trong sách in, hãy khoanh đáp án và xem Đáp án ở cuối sách.",
      stampsTitle: "Sưu tầm con dấu nào!",
      stampsBody: (n) => `Mỗi quốc gia thêm một chặng vào Nhật ký thám hiểm của em. Đi hết một châu lục là em nhận con dấu của châu đó lên hộ chiếu. Thăm đủ ${n} nơi là em trở thành Bậc thầy thám hiểm thật sự.`,
      ready: (name) => `Sẵn sàng chưa, ${name}? Lật trang và lên đường thôi! →`,
    },
    superlatives: { title: "Kỷ lục thế giới", titleR: "…và nhiều hơn nữa!", tag: "Nhà vô địch của Trái Đất" },
    glossary: { titleL: "Từ điển nhỏ của nhà thám hiểm", titleR: "…những từ nên biết" },
    complete: {
      youDidItPre: "Em làm được rồi,", keepGoingPre: "Cố lên nào,",
      doneBody: (n) => `Em đã khám phá cả ${n} quốc gia và đi vòng quanh cả thế giới.`,
      progBody: (c, n) => `Đến giờ em đã khám phá ${c} trong ${n} quốc gia. Hành trình vẫn tiếp tục!`,
      ofCountries: (n) => `trong ${n} quốc gia`, ofStamps: (n) => `trong ${n} con dấu`,
      master: "★ BẬC THẦY THÁM HIỂM ★", stampWall: "Bức tường con dấu của em",
      earnedTag: (e, t) => `${e} / ${t} đã đạt`,
      continents: "Châu lục", specialCollections: "Bộ sưu tập đặc biệt", milestones: "Cột mốc",
    },
    index: { title: "Mục lục", continued: "…tiếp theo", az: "A–Z", countries: (n) => `${n} quốc gia` },
    toc: {
      title: "Mục lục", continued: "…hành trình tiếp tục",
      sub: (print) => `${print ? "tìm mọi quốc gia" : "chạm để nhảy đến"} · trang`,
      countries: (n) => `${n} quốc gia`,
    },
    quiz: {
      stopNo: (i) => `CHẶNG ĐỐ VUI №${i}`, challenge: (cont) => `Thử thách ${cont}`,
      answersBack: "đáp án ở cuối sách →", score: (s, t) => `Điểm ${s} / ${t}`,
      leadPrint: "Khoanh tròn đáp án của em. Xem cuối sách để biết em làm đúng bao nhiêu!",
      lead: "Chạm vào một đáp án — màu xanh là đúng! Thử xem em nhớ gì về các nước vừa thăm.",
      keepGoing: "…cố lên nào!", countriesTag: (n) => `${n} QUỐC GIA`,
      kind: { flag: "Đoán lá cờ", capital: "Ghép thủ đô", animal: "Con vật nào sống ở đây", landmark: "Tìm địa danh" },
      perfect: "🌟 Điểm tuyệt đối! Bậc thầy thám hiểm!", great: "Khám phá giỏi lắm! 🎒", tryAgain: "Cố gắng tốt — lật lại xem nào!",
      flagPrompt: "Lá cờ này là của nước nào?", capitalPrompt: (c) => `Thủ đô của ${c} là gì?`,
      animalPrompt: (a) => `${a} sống ở nước nào?`, landmarkPrompt: (l) => `Em sẽ tìm thấy ${l} ở đâu?`,
      answerKeyTitle: "Đáp án đố vui", answerKeyContinued: "…tiếp theo", howDidYouDo: "EM LÀM ĐƯỢC BAO NHIÊU?", quizzesTag: (n) => `${n} BÀI ĐỐ`,
    },
    worldmap: {
      kickerPrint: "BẢN ĐỒ THẾ GIỚI", kicker: "BẢN ĐỒ THẾ GIỚI", title: "Cả thế giới trên một tấm bản đồ",
      subPrint: "Mọi quốc gia, tô màu theo châu lục.", sub: "Chạm vào một nước để nhảy đến trang của nó →",
      tinyTitle: (print) => `ĐẢO NHỎ & TIỂU QUỐC GIA — ${print ? "tìm trong mục lục" : "chạm vào lá cờ"}`,
      stop: "CHẶNG", goToPage: (n) => `Đến trang ${n} →`,
    },
    reader: {
      prev: "← Trước", next: "Sau →", markVisited: "Đánh dấu đã xem", visited: "✓ Đã xem", map: "Bản đồ",
      page: "trang", reset: "Đặt lại",
      resetTitle: "Đặt lại toàn bộ tiến trình?",
      resetBody: (name) => `Thao tác này xóa mọi trang đã xem và mọi con dấu của ${name}. Không thể hoàn tác.`,
      cancel: "Hủy", resetAll: "Đặt lại tất cả",
    },
    onboard: {
      title: "Biến cuốn sách này thành của em",
      lead: "Cho chúng tớ biết ai đang khám phá nhé. Tên của em sẽ hiện trên bìa và hộ chiếu, và hành trình bắt đầu từ quê nhà.",
      yourName: "Tên của em", age: "Tuổi", nationality: "Quốc tịch",
      homeCountry: "Quê hương — hành trình bắt đầu tại đây", cancel: "Hủy", start: "Bắt đầu khám phá →",
      namePh: "ví dụ: Momo", agePh: "7", nationalityPh: "ví dụ: Việt Nam",
    },
  },

  /* ──────────────────────────── FRENCH (young reader) ──────────────────────────── */
  fr: {
    cover: {
      kicker: "Encyclopédie du monde", anAtlasOf: "UN ATLAS DU", title: ["LE", "MONDE", "ENTIER"],
      subtitle: (n) => `${n} pays · 6 continents · un grand voyage`,
      journeyStarts: "Le voyage commence au Vietnam.", fieldEdition: "Édition de voyage",
      belongsTo: "Cet atlas appartient à", chiefExplorer: (age) => `Chef Explorateur · ${age} ans`,
      quote: "Quelque part, quelque chose de merveilleux attend d'être découvert.",
    },
    passport: {
      title: "Passeport d'Explorateur", typeTag: "Type E · Planète Terre",
      tagline: "Collectionneur de pays · ami de tous les animaux",
      memberSince: (no) => `Membre depuis 2026 · Nº ${no}`, officialRecord: "Passeport · Dossier officiel",
      rec: {
        passportNo: "Nº de passeport", dateIssued: "Date d'émission", dateIssuedVal: "2026 · Terre",
        nationality: "Nationalité", homeCountry: "Pays d'origine", age: "Âge",
        ageVal: (a) => `${a} ans`, rank: "Rang", mission: "Mission",
        missionVal: (n) => `Visiter les ${n} lieux`, issuingAuthority: "Autorité émettrice",
        authority: "L'Encyclopédie du monde",
      },
      stat: { countries: "Pays", badges: "Badges gagnés", pages: "Pages lues" },
      pledgeTitle: "La promesse de l'explorateur",
      pledge: "Je promets de lire chaque pays, d'apprendre un bonjour dans chaque langue, et de trouver l'animal le plus surprenant à chaque page. Aucun lieu n'est trop petit, aucun fait trop étrange !",
      recentJourneys: "Voyages récents · drapeaux du livre", drawFlags: "Dessine tes drapeaux préférés ici",
      journeysEmpty: "Tes drapeaux apparaîtront ici au fil de ta lecture.",
      signature: "Signature de l'explorateur", dateOfIssue: "Date d'émission",
      stampsCollected: "Tampons collectés", badgesTag: (e, t) => `${e} / ${t} badges gagnés`,
      collectAll: (t) => `Gagne les ${t} badges`,
      dash: {
        journal: "Ton carnet de tampons", latest: "Dernier tampon", stampAsExplore: "Tamponne en explorant !",
        noStamps: "Aucun tampon", nameStop: (name, stop) => `${name} · Étape ${stop}`,
        fillHint: "Colorie un tampon chaque fois que tu finis un pays — et écris le total en bas.",
        stampedOn: (date) => `Tamponné le ${date} 2026 — continue !`,
        openAny: "Ouvre un pays et reste un moment pour gagner ton premier tampon.",
        countriesVisited: "Pays visités", drawFav: "Dessine ou tamponne tes étapes préférées ici.",
        andMore: (n) => `…et ${n} autres tampons déjà dans le livre.`,
        appearHere: "Tes tampons apparaîtront ici au fil de l'exploration.",
        gatherHere: "Tes tampons récents se rassembleront ici.", begin: "Commence !",
      },
      contKicker: (print) => print ? "Continents · colorie-en un quand tu le finis" : "Continents · finis-en un pour gagner son badge",
      sixLands: "Six terres à conquérir",
      treasureKicker: "Collections spéciales · quêtes à thème", eightHunts: "Huit chasses au trésor",
      mileKicker: "Étapes · la longue route", allTheWay: "Le tour complet du monde", places: "lieux",
      nudge: {
        howToFill: "Comment remplir ton passeport", nextRank: (t) => `Rang suivant : ${t}`, master: "Tu es Maître Explorateur !",
        howToFillBody: "Colorie un tampon chaque fois que tu finis un pays ou un continent — et regarde ton passeport se remplir !",
        nextBody: (rem, at) => `Encore ${rem} pays pour atteindre ${at} et monter de rang — tu peux le faire !`,
        masterBody: "Tu as exploré tous les pays de la Terre. Incroyable !",
      },
    },
    divider: {
      partOf: (i) => `Partie ${i} sur 6`, stops: (a, b) => `Étapes ${a}–${b}`,
      continentN: (i) => `CONTINENT ${String(i).padStart(2, "0")}`, countriesAhead: "Les pays à venir",
      countries: "pays", quizStop: "quiz", quizStops: "quiz", ofTrip: "du voyage",
    },
    planet: {
      title: "Notre planète en un clin d'œil", tag: "Planète Terre",
      lead: (n) => `La Terre est une grande boule de roche et d'eau qui tourne dans l'espace. Sa terre est partagée en 6 continents, entourés de 5 grands océans. Sur ces continents vivent ${n} pays — et tu vas tous les visiter !`,
      stats: [["8 milliards", "de personnes"], ["~7 000", "langues parlées"], ["71 %", "couvert d'océan"], ["24 heures", "pour un tour"]],
      oceansLine: "Les 5 océans : Pacifique · Atlantique · Indien · Austral · Arctique.",
      sixTitle: "Les 6 continents", countriesUnit: "pays",
    },
    howto: {
      title: "Comment lire ce livre", guide: "Guide de l'explorateur",
      lead: "Chaque pays a deux pages côte à côte. La page de gauche présente le pays ; la page de droite, ce sont tes « notes de voyage ». Voici ce que veut dire chaque partie :",
      parts: [
        ["Le titre", "Le nom du pays, son drapeau, et comment dire son nom."],
        ["Données du pays", "Des faits rapides — capitale, habitants, monnaie, langue et plus."],
        ["Journal de l'explorateur", "Ton tampon ! Il montre à quelle étape tu es dans le monde."],
        ["Notes de voyage", "Des histoires sur la terre, les animaux, la culture et l'histoire."],
        ["Faits étonnants", "Sept choses vraies et surprenantes à raconter à tes amis."],
        ["Journal de mots", "Cinq mots que tu peux vraiment dire dans la langue locale."],
      ],
      quizzesTitle: "Comment marchent les quiz",
      quizzesLead: "Tous les douze pays environ, tu arrives à un Quiz. À l'écran, tu touches ta réponse et ton score grimpe. Dans le livre papier, entoure ta réponse et regarde les Réponses à la fin.",
      stampsTitle: "Collectionne tes tampons !",
      stampsBody: (n) => `Chaque pays ajoute une étape à ton journal. Finis un continent entier et tu gagnes son tampon sur ton passeport. Visite les ${n} lieux et tu deviens un vrai Maître Explorateur.`,
      ready: (name) => `Prêt, ${name} ? Tourne la page et c'est parti ! →`,
    },
    superlatives: { title: "Records du monde", titleR: "…et encore plus !", tag: "Champions de la Terre" },
    glossary: { titleL: "Le petit glossaire de l'explorateur", titleR: "…des mots à connaître" },
    complete: {
      youDidItPre: "Tu as réussi,", keepGoingPre: "Continue,",
      doneBody: (n) => `Tu as exploré les ${n} pays et fait le tour du monde entier.`,
      progBody: (c, n) => `Tu as exploré ${c} pays sur ${n} jusqu'ici. Le voyage continue !`,
      ofCountries: (n) => `sur ${n} pays`, ofStamps: (n) => `sur ${n} tampons`,
      master: "★ MAÎTRE EXPLORATEUR ★", stampWall: "Ton mur de tampons",
      earnedTag: (e, t) => `${e} / ${t} gagnés`,
      continents: "Continents", specialCollections: "Collections spéciales", milestones: "Étapes",
    },
    index: { title: "Index", continued: "…suite", az: "A–Z", countries: (n) => `${n} pays` },
    toc: {
      title: "Table des matières", continued: "…le voyage continue",
      sub: (print) => `${print ? "trouve chaque pays" : "touche pour aller"} · p.`,
      countries: (n) => `${n} pays`,
    },
    quiz: {
      stopNo: (i) => `QUIZ Nº${i}`, challenge: (cont) => `Défi ${cont}`,
      answersBack: "réponses à la fin →", score: (s, t) => `Score ${s} / ${t}`,
      leadPrint: "Entoure ta réponse. Regarde à la fin du livre pour voir ton score !",
      lead: "Touche une réponse — le vert, c'est juste ! Teste ce que tu retiens des pays visités.",
      keepGoing: "…continue !", countriesTag: (n) => `${n} PAYS`,
      kind: { flag: "Devine le drapeau", capital: "Trouve la capitale", animal: "Quel animal vit ici", landmark: "Repère le monument" },
      perfect: "🌟 Score parfait ! Maître Explorateur !", great: "Belle exploration ! 🎒", tryAgain: "Bien essayé — retourne voir !",
      flagPrompt: "Quel pays a ce drapeau ?", capitalPrompt: (c) => `Quelle est la capitale de ${c} ?`,
      animalPrompt: (a) => `Dans quel pays vit ${a} ?`, landmarkPrompt: (l) => `Où trouve-t-on ${l} ?`,
      answerKeyTitle: "Réponses des quiz", answerKeyContinued: "…suite", howDidYouDo: "TON SCORE ?", quizzesTag: (n) => `${n} QUIZ`,
    },
    worldmap: {
      kickerPrint: "CARTE DU MONDE", kicker: "LA CARTE DU MONDE", title: "Le monde entier sur une carte",
      subPrint: "Chaque pays, coloré par continent.", sub: "Touche un pays pour aller à sa page →",
      tinyTitle: (print) => `PETITES ÎLES & MICRO-PAYS — ${print ? "trouve-les dans l'index" : "touche un drapeau"}`,
      stop: "ÉTAPE", goToPage: (n) => `Aller à la page ${n} →`,
    },
    reader: {
      prev: "← Préc.", next: "Suiv. →", markVisited: "Marquer lu", visited: "✓ Lu", map: "Carte",
      page: "page", reset: "Réinit.",
      resetTitle: "Tout réinitialiser ?",
      resetBody: (name) => `Cela efface toutes les pages lues et tous les tampons de ${name}. Impossible d'annuler.`,
      cancel: "Annuler", resetAll: "Tout réinitialiser",
    },
    onboard: {
      title: "Fais de ce livre le tien",
      lead: "Dis-nous qui explore. Ton nom apparaît sur la couverture et le passeport, et ton voyage commence à la maison.",
      yourName: "Ton prénom", age: "Âge", nationality: "Nationalité",
      homeCountry: "Pays d'origine — ton voyage commence ici", cancel: "Annuler", start: "Partir explorer →",
      namePh: "ex. Momo", agePh: "7", nationalityPh: "ex. Vietnamien",
    },
  },
};

/* ════════════════ continent / rank / badge / content lookups ════════════════
   Keyed by the English identifier so logic files stay untouched. */

export const CONTINENT_NAME: Record<Lang, Record<Continent, string>> = {
  en: { "Asia": "Asia", "Africa": "Africa", "Europe": "Europe", "North America": "North America", "South America": "South America", "Oceania": "Oceania" },
  vi: { "Asia": "Châu Á", "Africa": "Châu Phi", "Europe": "Châu Âu", "North America": "Bắc Mỹ", "South America": "Nam Mỹ", "Oceania": "Châu Đại Dương" },
  fr: { "Asia": "Asie", "Africa": "Afrique", "Europe": "Europe", "North America": "Amérique du Nord", "South America": "Amérique du Sud", "Oceania": "Océanie" },
};

export const CONTINENT_SHORT: Record<Lang, Record<Continent, string>> = {
  en: { "Asia": "Asia", "Africa": "Africa", "Europe": "Europe", "North America": "N. America", "South America": "S. America", "Oceania": "Oceania" },
  vi: { "Asia": "Châu Á", "Africa": "Châu Phi", "Europe": "Châu Âu", "North America": "Bắc Mỹ", "South America": "Nam Mỹ", "Oceania": "Châu ĐD" },
  fr: { "Asia": "Asie", "Africa": "Afrique", "Europe": "Europe", "North America": "Am. Nord", "South America": "Am. Sud", "Oceania": "Océanie" },
};

export function tContinent(c: Continent, lang: Lang): string { return (CONTINENT_NAME[lang] ?? CONTINENT_NAME.en)[c] ?? c; }
export function tContinentShort(c: Continent, lang: Lang): string { return (CONTINENT_SHORT[lang] ?? CONTINENT_SHORT.en)[c] ?? c; }

/* ranks (keyed by English title used in profile.ts) */
export const RANK_TITLE: Record<Lang, Record<string, string>> = {
  en: { "Cadet Explorer": "Cadet Explorer", "Scout": "Scout", "Pathfinder": "Pathfinder", "Navigator": "Navigator", "Voyager": "Voyager", "Chief Explorer": "Chief Explorer", "Master Explorer": "Master Explorer" },
  vi: { "Cadet Explorer": "Thám hiểm tập sự", "Scout": "Hướng đạo sinh", "Pathfinder": "Người mở đường", "Navigator": "Hoa tiêu", "Voyager": "Lữ khách", "Chief Explorer": "Trưởng đoàn thám hiểm", "Master Explorer": "Bậc thầy thám hiểm" },
  fr: { "Cadet Explorer": "Explorateur cadet", "Scout": "Éclaireur", "Pathfinder": "Pisteur", "Navigator": "Navigateur", "Voyager": "Voyageur", "Chief Explorer": "Chef Explorateur", "Master Explorer": "Maître Explorateur" },
};
export function tRank(title: string, lang: Lang): string { return (RANK_TITLE[lang] ?? {})[title] ?? title; }

/* theme badges (keyed by id in progress.ts RAW_THEMES) */
type BadgeText = { name: string; blurb: string; hint: string };
export const THEME_BADGE: Record<Lang, Record<string, BadgeText>> = {
  en: {
    home: { name: "Home & Neighbours", blurb: "Vietnam and the lands next door", hint: "Visit your own country and the lands next door." },
    island: { name: "Island Hoppers", blurb: "Nations made of islands", hint: "Collect ten island nations across the seas." },
    roof: { name: "Roof of the World", blurb: "Home to the highest mountains", hint: "Reach the highest mountain countries." },
    desert: { name: "Desert Wanderers", blurb: "Lands of vast sand and sun", hint: "Cross the great deserts of the planet." },
    safari: { name: "Safari Lands", blurb: "Where the big wild animals roam", hint: "Meet the big animals of the wild lands." },
    tiny: { name: "Tiny Treasures", blurb: "The smallest countries of all", hint: "Find the smallest countries of all." },
    giants: { name: "Mega Lands", blurb: "The biggest countries on Earth", hint: "Explore the largest countries on Earth." },
    amazon: { name: "Amazon & Andes", blurb: "Rainforests and the longest mountains", hint: "Trek lands of jungle and high peaks." },
  },
  vi: {
    home: { name: "Quê hương & Láng giềng", blurb: "Việt Nam và các nước kề bên", hint: "Thăm đất nước của em và các nước kề bên." },
    island: { name: "Người nhảy đảo", blurb: "Những quốc gia làm từ các hòn đảo", hint: "Sưu tầm mười quốc đảo trên khắp các biển." },
    roof: { name: "Nóc nhà thế giới", blurb: "Nơi có những ngọn núi cao nhất", hint: "Chinh phục các nước có núi cao nhất." },
    desert: { name: "Kẻ lang thang sa mạc", blurb: "Vùng đất của cát và nắng bao la", hint: "Băng qua những sa mạc lớn của hành tinh." },
    safari: { name: "Vùng đất safari", blurb: "Nơi các loài thú hoang lớn rong ruổi", hint: "Gặp những con thú lớn của vùng hoang dã." },
    tiny: { name: "Kho báu tí hon", blurb: "Những quốc gia nhỏ nhất", hint: "Tìm những quốc gia nhỏ nhất." },
    giants: { name: "Vùng đất khổng lồ", blurb: "Những quốc gia lớn nhất Trái Đất", hint: "Khám phá những nước lớn nhất Trái Đất." },
    amazon: { name: "Amazon & Andes", blurb: "Rừng mưa và dãy núi dài nhất", hint: "Đi qua vùng rừng rậm và núi cao." },
  },
  fr: {
    home: { name: "Maison & Voisins", blurb: "Le Vietnam et les pays voisins", hint: "Visite ton pays et les pays voisins." },
    island: { name: "Sauteurs d'îles", blurb: "Des pays faits d'îles", hint: "Collectionne dix pays-îles à travers les mers." },
    roof: { name: "Toit du monde", blurb: "Là où sont les plus hautes montagnes", hint: "Atteins les pays aux plus hautes montagnes." },
    desert: { name: "Nomades du désert", blurb: "Des terres de sable et de soleil", hint: "Traverse les grands déserts de la planète." },
    safari: { name: "Terres de safari", blurb: "Où vivent les grands animaux sauvages", hint: "Rencontre les grands animaux sauvages." },
    tiny: { name: "Petits trésors", blurb: "Les plus petits pays de tous", hint: "Trouve les plus petits pays de tous." },
    giants: { name: "Terres géantes", blurb: "Les plus grands pays de la Terre", hint: "Explore les plus grands pays de la Terre." },
    amazon: { name: "Amazonie & Andes", blurb: "Forêts et plus longues montagnes", hint: "Parcours jungles et hauts sommets." },
  },
};
export function tThemeBadge(id: string, lang: Lang): BadgeText | undefined { return (THEME_BADGE[lang] ?? THEME_BADGE.en)[id] ?? THEME_BADGE.en[id]; }

/* milestone badges (keyed by id in progress.ts MILESTONES) */
export const MILESTONE_BADGE: Record<Lang, Record<string, { name: string; blurb: string }>> = {
  en: {
    m5: { name: "First Steps", blurb: "Visit your first 5 countries" },
    m25: { name: "Pathfinder", blurb: "Visit 25 countries" },
    m100: { name: "Halfway Around", blurb: "Visit 100 countries" },
    m201: { name: "Master Explorer", blurb: "Visit all countries" },
  },
  vi: {
    m5: { name: "Bước đầu tiên", blurb: "Thăm 5 nước đầu tiên" },
    m25: { name: "Người mở đường", blurb: "Thăm 25 nước" },
    m100: { name: "Nửa vòng Trái Đất", blurb: "Thăm 100 nước" },
    m201: { name: "Bậc thầy thám hiểm", blurb: "Thăm tất cả các nước" },
  },
  fr: {
    m5: { name: "Premiers pas", blurb: "Visite tes 5 premiers pays" },
    m25: { name: "Pisteur", blurb: "Visite 25 pays" },
    m100: { name: "Mi-chemin", blurb: "Visite 100 pays" },
    m201: { name: "Maître Explorateur", blurb: "Visite tous les pays" },
  },
};
export function tMilestone(id: string, lang: Lang): { name: string; blurb: string } | undefined { return (MILESTONE_BADGE[lang] ?? MILESTONE_BADGE.en)[id] ?? MILESTONE_BADGE.en[id]; }

/* world-records page (same order + iso as RECORDS in BookPages; only text translated) */
export const RECORDS_T: Record<Lang, Array<{ title: string; holder: string; fact: string }>> = {
  en: [
    { title: "Biggest country", holder: "Russia", fact: "17 million km² — spans 11 time zones." },
    { title: "Smallest country", holder: "Vatican City", fact: "Just 0.49 km² — smaller than many parks." },
    { title: "Most people", holder: "India", fact: "Over 1.4 billion people call it home." },
    { title: "Longest river", holder: "Egypt / Nile", fact: "The Nile runs about 6,650 km." },
    { title: "Tallest mountain", holder: "Nepal / Everest", fact: "Everest reaches 8,849 m into the sky." },
    { title: "Driest desert", holder: "Chile / Atacama", fact: "Some parts have never seen rain." },
    { title: "Most islands", holder: "Sweden", fact: "Around 270,000 islands dot its coast." },
    { title: "Hottest place", holder: "USA / Death Valley", fact: "Reached a scorching 56.7°C." },
    { title: "Largest rainforest", holder: "Brazil / Amazon", fact: "Home to 10% of all known species." },
    { title: "Highest waterfall", holder: "Venezuela / Angel Falls", fact: "Water drops 979 m — that's huge!" },
  ],
  vi: [
    { title: "Nước lớn nhất", holder: "Nga", fact: "17 triệu km² — trải dài 11 múi giờ." },
    { title: "Nước nhỏ nhất", holder: "Thành Vatican", fact: "Chỉ 0,49 km² — nhỏ hơn nhiều công viên." },
    { title: "Đông dân nhất", holder: "Ấn Độ", fact: "Hơn 1,4 tỉ người sinh sống ở đây." },
    { title: "Sông dài nhất", holder: "Ai Cập / Sông Nin", fact: "Sông Nin dài khoảng 6.650 km." },
    { title: "Núi cao nhất", holder: "Nepal / Everest", fact: "Everest vươn cao 8.849 m lên trời." },
    { title: "Sa mạc khô nhất", holder: "Chile / Atacama", fact: "Có nơi chưa từng thấy mưa." },
    { title: "Nhiều đảo nhất", holder: "Thụy Điển", fact: "Khoảng 270.000 hòn đảo ven bờ." },
    { title: "Nơi nóng nhất", holder: "Mỹ / Thung lũng Chết", fact: "Từng nóng tới 56,7°C." },
    { title: "Rừng mưa lớn nhất", holder: "Brazil / Amazon", fact: "Là nhà của 10% loài đã biết." },
    { title: "Thác cao nhất", holder: "Venezuela / Thác Thiên Thần", fact: "Nước rơi 979 m — cao khủng khiếp!" },
  ],
  fr: [
    { title: "Plus grand pays", holder: "Russie", fact: "17 millions de km² — 11 fuseaux horaires." },
    { title: "Plus petit pays", holder: "Cité du Vatican", fact: "Juste 0,49 km² — plus petit que des parcs." },
    { title: "Le plus d'habitants", holder: "Inde", fact: "Plus de 1,4 milliard d'habitants." },
    { title: "Plus long fleuve", holder: "Égypte / Nil", fact: "Le Nil fait environ 6 650 km." },
    { title: "Plus haute montagne", holder: "Népal / Everest", fact: "L'Everest monte à 8 849 m." },
    { title: "Désert le plus sec", holder: "Chili / Atacama", fact: "Certains coins n'ont jamais vu la pluie." },
    { title: "Le plus d'îles", holder: "Suède", fact: "Environ 270 000 îles le long des côtes." },
    { title: "Endroit le plus chaud", holder: "USA / Vallée de la Mort", fact: "A atteint 56,7°C — brûlant !" },
    { title: "Plus grande forêt", holder: "Brésil / Amazonie", fact: "Abrite 10% des espèces connues." },
    { title: "Plus haute cascade", holder: "Venezuela / Salto Ángel", fact: "L'eau tombe de 979 m — énorme !" },
  ],
};

/* glossary (same order as GLOSSARY in BookPages) */
export const GLOSSARY_T: Record<Lang, [string, string][]> = {
  en: [
    ["Continent", "One of Earth's 6 huge areas of land, like Asia or Africa."],
    ["Country", "A land with its own government, flag, and borders."],
    ["Capital", "The main city of a country, where its leaders work."],
    ["Currency", "The kind of money people use to buy things."],
    ["Population", "How many people live somewhere."],
    ["Equator", "An imaginary line around the middle of Earth."],
    ["Border", "The line where one country ends and another begins."],
    ["Native language", "The main language people grow up speaking."],
    ["Landmark", "A famous place people travel far to see."],
    ["Ocean", "One of the 5 giant bodies of salt water."],
    ["Peninsula", "Land with water on three sides."],
    ["Archipelago", "A group or chain of many islands."],
  ],
  vi: [
    ["Châu lục", "Một trong 6 vùng đất khổng lồ của Trái Đất, như Châu Á hay Châu Phi."],
    ["Quốc gia", "Một vùng đất có chính quyền, lá cờ và biên giới riêng."],
    ["Thủ đô", "Thành phố chính của một nước, nơi các nhà lãnh đạo làm việc."],
    ["Tiền tệ", "Loại tiền người ta dùng để mua đồ."],
    ["Dân số", "Số người sống ở một nơi nào đó."],
    ["Xích đạo", "Đường tưởng tượng vòng quanh giữa Trái Đất."],
    ["Biên giới", "Ranh giới nơi nước này kết thúc và nước khác bắt đầu."],
    ["Tiếng mẹ đẻ", "Ngôn ngữ chính mà người ta lớn lên cùng."],
    ["Địa danh", "Một nơi nổi tiếng mà người ta đi xa để ngắm."],
    ["Đại dương", "Một trong 5 vùng nước mặn khổng lồ."],
    ["Bán đảo", "Vùng đất có nước bao quanh ba phía."],
    ["Quần đảo", "Một nhóm hay chuỗi gồm nhiều hòn đảo."],
  ],
  fr: [
    ["Continent", "L'une des 6 immenses terres de la Terre, comme l'Asie."],
    ["Pays", "Une terre avec son gouvernement, son drapeau et ses frontières."],
    ["Capitale", "La ville principale d'un pays, où travaillent ses chefs."],
    ["Monnaie", "L'argent que les gens utilisent pour acheter."],
    ["Population", "Le nombre de personnes qui vivent quelque part."],
    ["Équateur", "Une ligne imaginaire autour du milieu de la Terre."],
    ["Frontière", "La ligne où un pays finit et un autre commence."],
    ["Langue maternelle", "La langue principale qu'on apprend petit."],
    ["Monument", "Un lieu célèbre qu'on vient voir de loin."],
    ["Océan", "L'une des 5 grandes étendues d'eau salée."],
    ["Péninsule", "Une terre entourée d'eau sur trois côtés."],
    ["Archipel", "Un groupe ou une chaîne de plusieurs îles."],
  ],
};

/* continent-divider blurb + special line (keyed by English continent) */
export const CONTINENT_META_T: Record<Lang, Record<Continent, { blurb: string; special: string }>> = {
  en: {
    "Asia": { blurb: "The biggest continent of all — home to more people than everywhere else combined.", special: "Tallest mountains, oldest cities, and the most languages on Earth." },
    "Africa": { blurb: "A giant land of deserts, rainforests, and the greatest wild animals anywhere.", special: "The longest river, the biggest desert, and where all humans first came from." },
    "Europe": { blurb: "Small but packed — castles, fairy tales, and countries you can cross in an hour.", special: "Tiny nations, big history, and trains that zoom between them." },
    "North America": { blurb: "From frozen Arctic to steamy jungle, with islands strung across warm seas.", special: "Canyons, volcanoes, and the wildest weather on the planet." },
    "South America": { blurb: "The Amazon, the Andes, and more kinds of creatures than you can count.", special: "The driest desert, the highest waterfall, and the longest mountain chain." },
    "Oceania": { blurb: "Thousands of islands sprinkled across the world's biggest ocean.", special: "Coral reefs, kangaroos, and beaches that go on forever." },
  },
  vi: {
    "Asia": { blurb: "Châu lục lớn nhất — đông dân hơn tất cả các nơi khác cộng lại.", special: "Núi cao nhất, thành phố cổ nhất, và nhiều ngôn ngữ nhất Trái Đất." },
    "Africa": { blurb: "Vùng đất khổng lồ của sa mạc, rừng mưa và những loài thú hoang vĩ đại nhất.", special: "Sông dài nhất, sa mạc lớn nhất, và là nơi loài người đầu tiên ra đời." },
    "Europe": { blurb: "Nhỏ mà đầy ắp — lâu đài, chuyện cổ tích, và những nước băng qua chỉ trong một giờ.", special: "Những nước tí hon, lịch sử lớn lao, và những chuyến tàu lao vun vút." },
    "North America": { blurb: "Từ Bắc Cực băng giá đến rừng rậm oi nồng, với những hòn đảo rải khắp biển ấm.", special: "Hẻm núi, núi lửa, và thời tiết dữ dội nhất hành tinh." },
    "South America": { blurb: "Rừng Amazon, dãy Andes, và nhiều loài sinh vật đến không đếm xuể.", special: "Sa mạc khô nhất, thác cao nhất, và dãy núi dài nhất." },
    "Oceania": { blurb: "Hàng nghìn hòn đảo rải rác trên đại dương lớn nhất thế giới.", special: "Rạn san hô, chuột túi, và những bãi biển dài bất tận." },
  },
  fr: {
    "Asia": { blurb: "Le plus grand continent — plus d'habitants que partout ailleurs réuni.", special: "Les plus hautes montagnes, les plus vieilles villes, et le plus de langues." },
    "Africa": { blurb: "Une terre géante de déserts, de forêts et des plus grands animaux sauvages.", special: "Le plus long fleuve, le plus grand désert, et le berceau des humains." },
    "Europe": { blurb: "Petite mais pleine — châteaux, contes, et des pays traversés en une heure.", special: "De minuscules pays, une grande histoire, et des trains très rapides." },
    "North America": { blurb: "De l'Arctique gelé à la jungle chaude, avec des îles sur des mers tièdes.", special: "Des canyons, des volcans, et la météo la plus folle de la planète." },
    "South America": { blurb: "L'Amazonie, les Andes, et plus d'animaux qu'on ne peut compter.", special: "Le désert le plus sec, la plus haute cascade, la plus longue chaîne de montagnes." },
    "Oceania": { blurb: "Des milliers d'îles parsemées sur le plus grand océan du monde.", special: "Des récifs de corail, des kangourous, et des plages sans fin." },
  },
};

export function getUI(lang: Lang): UIBundle { return UI[lang] ?? UI.en; }
