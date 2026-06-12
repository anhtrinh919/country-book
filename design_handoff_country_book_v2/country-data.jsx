/* country-data.jsx — one record per continent, feeding CountrySpread.
   Japan (Asia) uses real CC photos; the five new templates use labeled
   photo slots ready for CC images (see the handoff schema). */

const JP_PHOTO = "https://commons.wikimedia.org/wiki/Special:FilePath/";
const CC = "Photo · Wikimedia Commons · CC BY-SA";

const JAPAN = {
  name: "JAPAN", romaji: "NIPPON", stampGlyph: "日本", tagline: "Land of the Rising Sun",
  region: "East Asia · Pacific Ocean", coords: "36°N · 138°E", fileNo: "081", stop: 1,
  theme: { paper: "#F6EFE1", dot: "#cdbfa6", ink: "#2a2420", faint: "#8a7a5e", line: "#dccfb4", accent: "#C0202E", accent2: "#23406b" }, motif: "sun", langName: "Japanese", layout: "atlas",
  flag: { file: "Flag of Japan.svg", title: "The Hinomaru", note: "a red sun on white · official since 1999" },
  log: "“First stop on our trip around the world — 194 countries still to go!”",
  lead: "Japan is an island country in East Asia, out in the Pacific Ocean near Korea, China and Russia. People here call it Nihon or Nippon — “sun origin” — which is why it’s nicknamed the Land of the Rising Sun. It’s a place where ancient wooden temples sit beside neon cities, and monkeys take hot baths in the snow.",
  facts: [
    { label: "Capital", value: "Tokyo", sub: "~14.2 million people" },
    { label: "People", value: "123 million", sub: "2025 census · shrinking" },
    { label: "Money", value: "Yen ¥", sub: "the Japanese yen" },
    { label: "Language", value: "Japanese", sub: "kanji · hiragana · katakana" },
    { label: "Land area", value: "377,975 km²", sub: "≈ size of California" },
    { label: "Highest pt", value: "Mt Fuji", sub: "3,776 m · erupted 1707" }
  ],
  islandsLabel: "FOUR BIG ISLANDS:", islands: ["Honshu", "Hokkaido", "Kyushu", "Shikoku"],
  sections: { geography: "A land of islands & fire", animals: "Bathing monkeys & bowing deer", culture: "Blossoms, sushi & sumo", history: "Samurai, ninja & emperors", wows: "Seven true surprises" },
  geo: [
    "Japan isn’t one island but an archipelago — a chain of thousands. Four big ones hold almost everybody: Honshu (the biggest, home to Tokyo), snowy Hokkaido in the north, Kyushu and Shikoku. The country runs so far north-to-south that it has snowy winters at one end and warm beaches at the other.",
    "Its most famous sight is Mount Fuji, a near-perfect cone and the tallest peak at 3,776 metres. Fuji is a volcano, though it hasn’t erupted since 1707. Japan sits on the “Ring of Fire,” which is why it has so many volcanoes, hot springs and earthquakes."
  ],
  animals: [
    "High in the Nagano mountains, Japanese macaques — snow monkeys — climb into steaming hot springs to keep warm in winter. They’re the only wild monkeys known to bathe like this, and they live farther north than any monkey except humans.",
    "In Nara Park, more than a thousand tame sika deer roam free, and some bow their heads to ask for crackers. Overhead flies the red-crowned crane, a symbol of luck, while the raccoon-like tanuki turns up in folk tales as a shape-shifting trickster."
  ],
  culture: [
    "In spring, families picnic under clouds of pink cherry blossom (sakura) — a tradition called hanami. Japanese food is loved everywhere: sushi, steaming ramen, chewy mochi and neat bento lunch boxes. The traditional robe is the kimono, and Japan gave the world origami, manga comics and anime.",
    "The oldest national sport is sumo, where two huge wrestlers try to push each other out of a ring — a match can be over in seconds — while baseball is the most popular game to watch. Everyday life is full of clever touches too: vending machines everywhere, helpful robots, and the famous bullet trains."
  ],
  history: [
    "For hundreds of years — from about the 1100s to the late 1800s — Japan was guarded by the samurai, warriors famous for their swords and a code of honour called bushido. Working quietly in the shadows were the ninja, real spies and secret agents.",
    "Japan still has an emperor today, though the role is now mostly ceremonial, and its line of emperors is one of the oldest in the world. To see old and new, travellers visit Tokyo, the temple-filled city of Kyoto, and Mount Fuji."
  ],
  wows: [
    "Snow monkeys take hot baths — the only wild monkeys known to do it.",
    "The Hayabusa bullet train runs at 320 km/h and is famous for arriving on time to the second.",
    "The world’s oldest company was Japanese: Kongō Gumi built temples for over 1,400 years.",
    "The world’s oldest hotel is here too — a hot-spring inn open since 705 AD.",
    "Square watermelons are real — ordinary melons grown inside box-shaped moulds.",
    "Japan has around 2.6 million vending machines — about one for every 23–30 people.",
    "Capsule hotels let travellers sleep in cosy stacked pods; the first opened in 1979."
  ],
  myths: [
    { myth: "Ninjas always wore black and had magic powers.", fact: "Real ninjas were spies who dressed like ordinary farmers and travellers to blend in. The dramatic “ninja vs. samurai” battles came from films, long after their time." },
    { myth: "Square watermelons grow from special seeds.", fact: "Nope — there’s no special seed. They’re ordinary melons grown inside clear boxes so they fill out into a cube." }
  ],
  words: [
    { en: "Hello", jp: "Konnichiwa", say: "kohn-nee-chee-wah" },
    { en: "Thank you", jp: "Arigatō", say: "ah-ree-gah-toh" },
    { en: "Yes", jp: "Hai", say: "high" },
    { en: "Goodbye", jp: "Sayōnara", say: "sah-yoh-nah-rah" },
    { en: "Delicious", jp: "Oishii", say: "oy-shee" }
  ],
  photos: {
    landmark: { src: JP_PHOTO + "Mount%20Fuji%20from%20Lake%20Kawaguchi.jpg", alt: "Mount Fuji reflected in a lake", caption: "MT FUJI — 3,776 m, the tallest peak and a sacred volcano.", credit: CC },
    animalA: { src: JP_PHOTO + "Jigokudani%20hotspring%20in%20Nagano%20Japan%20001.jpg", alt: "Snow monkey in a hot spring", caption: "SNOW MONKEYS bathe in Nagano’s hot springs in winter.", credit: CC },
    animalB: { src: JP_PHOTO + "2016-11-12%20A%20male%20Shika%20deer%20in%20the%20park.jpg", alt: "A sika deer in Nara Park", caption: "SIKA DEER in Nara bow to ask for crackers.", credit: CC },
    hero: { src: JP_PHOTO + "Shinkansen%20series%20E5%20set%20U9%20at%20Shin-Hakodate-Hokuto%20Station%202018-02-09%20(25312601527).jpg", alt: "E5 Shinkansen bullet train", caption: "THE SHINKANSEN — Japan’s Hayabusa “bullet train” runs at 320 km/h and is famous for arriving on time to the second.", credit: CC }
  }
};

const EGYPT = {
  name: "EGYPT", romaji: "MISR", stampGlyph: "MISR", tagline: "Gift of the Nile",
  region: "North Africa · on the Nile", coords: "30°N · 31°E", fileNo: "818", stop: 2,
  theme: { paper: "#F2E4BD", dot: "#cdb784", ink: "#3b2f16", faint: "#9a8553", line: "#dcc998", accent: "#B5862A", accent2: "#1C7F86" }, motif: "chevron", langName: "Arabic", layout: "hero",
  flag: { file: "Flag of Egypt.svg", title: "The Egyptian flag", note: "red, white & black with a golden eagle" },
  log: "“Stop two — into Africa, following the Nile across the desert.”",
  lead: "Egypt sits in the north-east corner of Africa, where the mighty River Nile winds through a vast desert all the way to the sea. It’s one of the oldest countries on Earth — the land of the pharaohs, the pyramids and the Sphinx. People have lived along the Nile for more than 5,000 years, writing in picture-letters called hieroglyphs.",
  facts: [
    { label: "Capital", value: "Cairo", sub: "~22 million people" },
    { label: "People", value: "114 million", sub: "2024 estimate" },
    { label: "Money", value: "Pound E£", sub: "the Egyptian pound" },
    { label: "Language", value: "Arabic", sub: "written right-to-left" },
    { label: "Land area", value: "1,001,450 km²", sub: "mostly Sahara Desert" },
    { label: "Highest pt", value: "Mt Catherine", sub: "2,629 m · in Sinai" }
  ],
  islandsLabel: "FAMOUS PLACES:", islands: ["Cairo", "Giza", "Luxor", "Sinai"],
  sections: { geography: "A river through the desert", animals: "Camels, cats & crocodiles", culture: "Pharaohs to football", history: "Pyramids, mummies & kings", wows: "Seven ancient wonders" },
  geo: [
    "Almost all of Egypt is the hot, sandy Sahara Desert — but a thin green ribbon of farmland follows the River Nile, the longest river in the world. Nearly everyone lives close to its banks, because the Nile brings the water that makes crops grow.",
    "Each summer the river once flooded and left behind rich black mud, which is why the ancient Egyptians called their home the “Gift of the Nile.” In the north the river fans out into a wide, marshy delta before reaching the Mediterranean Sea."
  ],
  animals: [
    "The desert is home to camels — “ships of the desert” — that can travel for days without water, plus fennec foxes with enormous ears and shiny scarab beetles the Egyptians believed were lucky.",
    "In the River Nile lurks the Nile crocodile, one of the largest reptiles alive. Cats were so loved in ancient Egypt that they were treated as sacred animals, and harming one was a serious crime."
  ],
  culture: [
    "Most Egyptians live in busy cities like Cairo and enjoy dishes such as koshari (rice, pasta and lentils), warm flatbread and sweet, syrupy basbousa. Bustling markets called bazaars sell spices, lanterns and crafts.",
    "Egyptians love football (soccer) more than any other sport, and music and storytelling fill the streets during festivals. The country is famous for its ancient temples and tombs, which millions of visitors come to see every year."
  ],
  history: [
    "Thousands of years ago, kings and queens called pharaohs — like Tutankhamun and Cleopatra — ruled Egypt. They built giant stone pyramids as tombs and had their bodies carefully preserved as mummies for the afterlife.",
    "The Egyptians wrote in hieroglyphs, picture-symbols carved into stone. For ages nobody could read them — until a clue called the Rosetta Stone helped scholars crack the code about 200 years ago."
  ],
  wows: [
    "The Great Pyramid of Giza was the tallest building on Earth for nearly 4,000 years.",
    "The pyramids were built by paid, well-fed workers — not slaves, and definitely not aliens.",
    "Ancient Egyptians used one of the first 365-day calendars.",
    "They loved cats so much they mummified them and mourned a pet cat by shaving their eyebrows.",
    "Tutankhamun became king when he was only about nine years old.",
    "The Nile is the longest river in the world, flowing over 6,650 km.",
    "Cleopatra lived closer in time to the Moon landing than to the building of the Great Pyramid."
  ],
  myths: [
    { myth: "Aliens or slaves built the pyramids.", fact: "Neither! They were built by thousands of skilled, paid Egyptian workers who lived in nearby towns — we’ve even found their bakeries and tools." },
    { myth: "Mummies are monsters that come back to life.", fact: "Mummies are simply ancient people carefully preserved long ago. The spooky “mummy’s curse” was mostly invented by newspapers and movies." }
  ],
  words: [
    { en: "Hello", jp: "Salām", say: "sa-laam" },
    { en: "Thank you", jp: "Shukran", say: "shook-ran" },
    { en: "Yes", jp: "Aywa", say: "eye-wa" },
    { en: "Goodbye", jp: "Ma’a salāma", say: "maa sa-laa-ma" },
    { en: "Delicious", jp: "Lazīz", say: "la-zeez" }
  ],
  photos: {
    landmark: { alt: "The Pyramids of Giza & the Sphinx", caption: "THE PYRAMIDS of Giza — 4,500-year-old royal tombs guarded by the Sphinx." },
    animalA: { alt: "A camel in the desert", caption: "CAMELS cross the Sahara and can go days without water." },
    animalB: { alt: "An ancient Egyptian cat statue", caption: "CATS were sacred in ancient Egypt — even mummified." },
    hero: { alt: "Tutankhamun’s golden mask", caption: "TUTANKHAMUN’s golden mask — the boy-king buried with treasure 3,300 years ago." }
  }
};

const ITALY = {
  name: "ITALY", romaji: "ITALIA", stampGlyph: "ITALIA", tagline: "Home of the Romans",
  region: "Southern Europe · Mediterranean", coords: "42°N · 12°E", fileNo: "039", stop: 3,
  theme: { paper: "#ECEBDC", dot: "#bfc0a4", ink: "#23302a", faint: "#7e8674", line: "#cdcdb6", accent: "#1E7A43", accent2: "#B5202F" }, motif: "tricolore", langName: "Italian", layout: "modular",
  flag: { file: "Flag of Italy.svg", title: "Il Tricolore", note: "three stripes: green, white & red" },
  log: "“Now in Europe — ancient ruins, pizza and a leaning tower!”",
  lead: "Italy is a long, boot-shaped country in southern Europe that kicks out into the warm Mediterranean Sea. Thousands of years ago it was the heart of the mighty Roman Empire, and today it’s famous for pizza and pasta, breathtaking art, and cities built on canals and ancient ruins.",
  facts: [
    { label: "Capital", value: "Rome", sub: "~2.7 million people" },
    { label: "People", value: "59 million", sub: "2024 estimate" },
    { label: "Money", value: "Euro €", sub: "shared across Europe" },
    { label: "Language", value: "Italian", sub: "a Romance language" },
    { label: "Land area", value: "301,340 km²", sub: "≈ bigger than Arizona" },
    { label: "Highest pt", value: "Mont Blanc", sub: "4,808 m · in the Alps" }
  ],
  islandsLabel: "FAMOUS PLACES:", islands: ["Rome", "Venice", "Florence", "Sicily"],
  sections: { geography: "Mountains, coasts & volcanoes", animals: "Wolves, ibex & sea turtles", culture: "Pizza, art & football", history: "Romans, gladiators & artists", wows: "Seven true surprises" },
  geo: [
    "Italy is easy to spot on a map — it’s shaped like a boot kicking a ball (the island of Sicily). Tall, snowy mountains called the Alps run along the top, and a long ridge, the Apennines, forms the boot’s rocky “backbone.”",
    "Italy also has fiery volcanoes: Mount Vesuvius near Naples and Mount Etna on Sicily are both still active. The rest of the country enjoys plenty of sunny coastline along the blue Mediterranean Sea."
  ],
  animals: [
    "High in the mountains live the Alpine ibex, a wild goat with enormous curved horns, and the grey wolf, Italy’s national animal, which once nearly vanished but is slowly returning to the forests.",
    "Off the coast swim dolphins and loggerhead sea turtles, which crawl onto warm beaches to lay their eggs. On summer evenings the countryside twinkles with thousands of glowing fireflies."
  ],
  culture: [
    "Italy gave the world pizza, pasta and gelato (creamy Italian ice cream), and a meal is a big, happy family event. Italians are proud of their language, their music — including opera — and their beautiful handmade clothes and cars.",
    "Football (calcio) is the favourite sport by far. Italy is also the home of world-famous art: geniuses like Leonardo da Vinci and Michelangelo created paintings and statues that people still travel from everywhere to see."
  ],
  history: [
    "Two thousand years ago, Rome ruled a vast empire stretching across Europe. The Romans were brilliant builders, making straight roads, water-carrying aqueducts and the huge Colosseum, where crowds watched gladiators.",
    "In AD 79 the volcano Vesuvius buried the city of Pompeii under ash, freezing it in time for us to dig up today. Centuries later, Italy led the Renaissance — a great burst of art, science and discovery."
  ],
  wows: [
    "The Romans built the Colosseum 1,900 years ago — it could hold about 50,000 cheering fans.",
    "The Leaning Tower of Pisa tilts because its ground was too soft; engineers stopped it falling but kept the lean.",
    "Venice is a city built on water, with canals instead of roads and boats instead of cars.",
    "Italy has more UNESCO World Heritage sites than any other country on Earth.",
    "Ancient Romans had heated floors and public baths long before modern plumbing.",
    "Tiny Vatican City, inside Rome, is the smallest country in the world.",
    "Pizza was born in Naples — the classic Margherita is coloured like the Italian flag."
  ],
  myths: [
    { myth: "Gladiators always fought to the death.", fact: "Not usually — gladiators were expensive to train, so most fights ended without anyone dying, and the best fighters became famous superstars." },
    { myth: "The Leaning Tower of Pisa is about to topple over.", fact: "It was carefully straightened a little and made safe in the 1990s, so it should keep standing — and leaning — for centuries to come." }
  ],
  words: [
    { en: "Hello", jp: "Ciao", say: "chow" },
    { en: "Thank you", jp: "Grazie", say: "grah-tsee-eh" },
    { en: "Yes", jp: "Sì", say: "see" },
    { en: "Goodbye", jp: "Arrivederci", say: "a-ree-veh-dair-chee" },
    { en: "Delicious", jp: "Delizioso", say: "deh-lee-tsyoh-zoh" }
  ],
  photos: {
    landmark: { alt: "The Colosseum in Rome", caption: "THE COLOSSEUM — a 1,900-year-old Roman arena in the heart of Rome." },
    animalA: { alt: "The Leaning Tower of Pisa", caption: "THE LEANING TOWER of Pisa tilts — but won’t fall." },
    animalB: { alt: "Gondolas on a Venice canal", caption: "VENICE — a city of canals, with boats instead of cars." },
    hero: { alt: "A Margherita pizza", caption: "PIZZA was born in Naples — the Margherita is coloured like the flag." }
  }
};

const MEXICO = {
  name: "MEXICO", romaji: "MÉXICO", stampGlyph: "MÉXICO", tagline: "Land of the Aztecs & Maya",
  region: "North America · two oceans", coords: "19°N · 99°W", fileNo: "052", stop: 4,
  theme: { paper: "#F7E3CA", dot: "#e0bf95", ink: "#3d2018", faint: "#a07a5c", line: "#e6caa6", accent: "#D1402B", accent2: "#1E8A7B" }, motif: "papel", langName: "Spanish", layout: "postcard",
  flag: { file: "Flag of Mexico.svg", title: "The Mexican flag", note: "green, white & red with an eagle" },
  log: "“Across to North America — pyramids, axolotls and fiestas!”",
  lead: "Mexico is a big, sunny country in North America, with the Pacific Ocean on one side and the Gulf of Mexico on the other. Long before today’s cities, great civilisations — the Maya and the Aztecs — built towering stone pyramids here. Mexico is famous for its colour, its food, and its joyful festivals.",
  facts: [
    { label: "Capital", value: "Mexico City", sub: "~22 million people" },
    { label: "People", value: "130 million", sub: "2024 estimate" },
    { label: "Money", value: "Peso $", sub: "the Mexican peso" },
    { label: "Language", value: "Spanish", sub: "most-spoken in the world" },
    { label: "Land area", value: "1,964,375 km²", sub: "13th-largest country" },
    { label: "Highest pt", value: "Orizaba", sub: "5,636 m · a volcano" }
  ],
  islandsLabel: "FAMOUS PLACES:", islands: ["Mexico City", "Yucatán", "Oaxaca", "Cancún"],
  sections: { geography: "Deserts, jungles & volcanoes", animals: "Axolotls & butterflies", culture: "Tacos, music & murals", history: "Maya, Aztecs & pyramids", wows: "Seven true surprises" },
  geo: [
    "Mexico has almost every kind of landscape: dry deserts and cactus in the north, steamy rainforests in the south, long beaches on two coasts, and tall volcanoes down the middle — some of them still smoking.",
    "Mexico City, the huge, busy capital, was built on top of the ancient Aztec city of Tenochtitlan, which once stood on an island in a lake. Today it’s one of the largest cities on the whole planet."
  ],
  animals: [
    "Mexico is the only wild home of the axolotl, a smiling salamander that can regrow its own legs. Tiny chihuahua dogs come from here too, along with powerful jaguars that prowl the southern jungles.",
    "Every winter, millions of orange monarch butterflies fly thousands of kilometres from Canada and the United States to rest in the same Mexican forests — one of the greatest journeys in all of nature."
  ],
  culture: [
    "Mexican food — tacos, tortillas, beans and spicy chillies — is loved all over the world, and chocolate was first made here from cacao beans long ago. Bright colours, woven blankets and painted pottery fill the markets.",
    "Cheerful mariachi bands play trumpets and guitars, and giant murals tell stories on city walls. Football is the top sport, and a high-flying masked wrestling show called lucha libre packs out arenas."
  ],
  history: [
    "More than a thousand years ago the Maya built stone pyramids and studied the stars, while the Aztecs ruled a mighty empire. You can still climb pyramids like El Castillo at Chichén Itzá today.",
    "In the 1500s, Spanish explorers arrived and Mexico became part of Spain for about 300 years — which is why most people speak Spanish. Mexico won its independence in 1821."
  ],
  wows: [
    "The axolotl can regrow lost legs, its tail — even parts of its heart and brain.",
    "Chocolate comes from Mexico: the Aztecs drank it as a bitter, spicy treat.",
    "Each year millions of monarch butterflies migrate to the very same Mexican forests.",
    "The Maya pyramid at Chichén Itzá casts a snake-shaped shadow twice a year.",
    "Mexico City is slowly sinking, because it was built on an old lake bed.",
    "Mexico gave the world tomatoes, chillies, corn and vanilla.",
    "Cuexcomate, in Mexico, is one of the world’s smallest volcanoes — only about 13 m tall."
  ],
  myths: [
    { myth: "The Day of the Dead is just Mexican Halloween.", fact: "It’s actually a happy, colourful festival where families remember loved ones with flowers, food and music — not a spooky, scary night." },
    { myth: "Axolotls are a kind of fish.", fact: "Nope — they’re amphibians, a type of salamander. They keep their feathery gills and stay “babyish” their whole lives." }
  ],
  words: [
    { en: "Hello", jp: "Hola", say: "oh-lah" },
    { en: "Thank you", jp: "Gracias", say: "grah-syas" },
    { en: "Yes", jp: "Sí", say: "see" },
    { en: "Goodbye", jp: "Adiós", say: "ah-dyohs" },
    { en: "Delicious", jp: "Delicioso", say: "deh-lee-syoh-soh" }
  ],
  photos: {
    landmark: { alt: "El Castillo pyramid, Chichén Itzá", caption: "CHICHÉN ITZÁ — a great Maya pyramid in the Yucatán jungle." },
    animalA: { alt: "An axolotl", caption: "THE AXOLOTL — a smiling salamander that regrows its limbs." },
    animalB: { alt: "Monarch butterflies on a tree", caption: "MONARCH BUTTERFLIES migrate to Mexico in their millions." },
    hero: { alt: "A Day of the Dead celebration", caption: "DAY OF THE DEAD — a joyful festival remembering loved ones." }
  }
};

const BRAZIL = {
  name: "BRAZIL", romaji: "BRASIL", stampGlyph: "BRASIL", tagline: "Heart of the Amazon",
  region: "South America · the tropics", coords: "15°S · 47°W", fileNo: "076", stop: 5,
  theme: { paper: "#E9E9C9", dot: "#bcc295", ink: "#1f3526", faint: "#7c8a63", line: "#cdd2a6", accent: "#159A4C", accent2: "#E0A800" }, motif: "diamond", langName: "Portuguese", layout: "timeline",
  flag: { file: "Flag of Brazil.svg", title: "The Brazilian flag", note: "green & yellow with a starry blue globe" },
  log: "“Deep into South America — the Amazon is calling!”",
  lead: "Brazil is the biggest country in South America — so large it touches almost every other country on the continent. Most of the world’s largest rainforest, the Amazon, grows here, home to more kinds of animal than anywhere else on Earth. Brazilians love football, music and the world’s biggest party, Carnival.",
  facts: [
    { label: "Capital", value: "Brasília", sub: "~3 million people" },
    { label: "People", value: "212 million", sub: "2024 estimate" },
    { label: "Money", value: "Real R$", sub: "the Brazilian real" },
    { label: "Language", value: "Portuguese", sub: "the only one in the Americas" },
    { label: "Land area", value: "8,515,767 km²", sub: "5th-largest country" },
    { label: "Highest pt", value: "Neblina", sub: "2,995 m · on the border" }
  ],
  islandsLabel: "FAMOUS PLACES:", islands: ["Rio", "São Paulo", "Amazon", "Brasília"],
  sections: { geography: "Rainforest, rivers & beaches", animals: "Jaguars, sloths & toucans", culture: "Football, samba & Carnival", history: "Forest peoples & explorers", wows: "Seven true surprises" },
  geo: [
    "Brazil is enormous — the fifth-largest country in the world. Across its north spreads the Amazon rainforest, a steamy green jungle so vast it makes its own rain and is often called the “lungs of the planet.”",
    "Winding through it is the Amazon River, which carries more water than any other river on Earth. Brazil also has golden beaches, wide grasslands and the thundering Iguaçu Falls on its southern border."
  ],
  animals: [
    "The Amazon bursts with life: jaguars prowl the forest floor, sloths hang upside-down in the trees, and colourful toucans and macaws flap overhead. Even pink river dolphins swim in the muddy water.",
    "Brazil is also home to the capybara, the largest rodent in the world — a calm, dog-sized cousin of the guinea pig that loves to swim and happily lets little birds perch on its back."
  ],
  culture: [
    "Brazilians are mad about football (futebol) and have won the World Cup more times than any other country. Music and dance, especially the fast, drum-driven samba, are everywhere, and people speak Portuguese.",
    "Each year the city of Rio de Janeiro throws Carnival, a giant street party with glittering costumes, floats and parades. Favourite foods include rice and beans, grilled meats and sweet tropical fruit."
  ],
  history: [
    "For thousands of years, hundreds of Indigenous peoples have lived in the Amazon, knowing its plants and animals better than anyone on Earth. Many of their communities still make the rainforest their home today.",
    "Portuguese explorers arrived in the year 1500, which is why Brazil speaks Portuguese — the only country in the Americas that does. Brazil became an independent nation in 1822."
  ],
  wows: [
    "The Amazon is home to about one in ten of all the known animal species on Earth.",
    "The Amazon River is so wide in places that you cannot see the other bank.",
    "The capybara is the world’s largest rodent — about the size of a big dog.",
    "Brazil has won the football World Cup five times, more than any other country.",
    "The statue of Christ the Redeemer stands 30 metres tall on a mountain above Rio.",
    "Some Amazon trees are so tall their tops form a green “roof” called the canopy.",
    "A new kind of plant or animal is discovered in the Amazon every couple of days."
  ],
  myths: [
    { myth: "Piranhas can strip a cow to the bone in minutes.", fact: "Real piranhas mostly eat insects, plants and small fish. Attacks on big animals or people are very rare — the “feeding frenzy” is mostly Hollywood." },
    { myth: "The Amazon makes 20% of the world’s oxygen.", fact: "Scientists think the rainforest uses up almost as much oxygen as it makes. It’s still precious — for rain, climate and millions of species." }
  ],
  words: [
    { en: "Hello", jp: "Olá", say: "oh-lah" },
    { en: "Thank you", jp: "Obrigado", say: "oh-bree-gah-doo" },
    { en: "Yes", jp: "Sim", say: "seeng" },
    { en: "Goodbye", jp: "Tchau", say: "chow" },
    { en: "Delicious", jp: "Delicioso", say: "deh-lee-see-oh-zoo" }
  ],
  photos: {
    landmark: { alt: "Christ the Redeemer, Rio", caption: "CHRIST THE REDEEMER watches over Rio from a mountain top." },
    animalA: { alt: "A sloth in a tree", caption: "SLOTHS hang in the Amazon trees, moving super-slowly." },
    animalB: { alt: "A toucan", caption: "TOUCANS show off huge, colourful beaks in the rainforest." },
    hero: { alt: "Carnival parade in Rio", caption: "CARNIVAL — Rio throws the world’s biggest street party each year." }
  }
};

const AUSTRALIA = {
  name: "AUSTRALIA", titleSize: 50, romaji: "AUSTRALIA", stampGlyph: "AUS", tagline: "The land Down Under",
  region: "Oceania · the South Pacific", coords: "25°S · 133°E", fileNo: "061", stop: 6,
  theme: { paper: "#F1DEC0", dot: "#dcbd92", ink: "#3a271a", faint: "#a07f5b", line: "#e6caa0", accent: "#C0532A", accent2: "#2C6FB0" }, motif: "dots", langName: "Aussie English", layout: "modular",
  flag: { file: "Flag of Australia.svg", title: "The Australian flag", note: "Union Jack & the Southern Cross stars" },
  log: "“Last stop, Oceania — G’day from Down Under!”",
  lead: "Australia is a giant island country in the South Pacific — the only country that is also a whole continent. Most of the middle is hot, red desert called the Outback, so nearly everyone lives near the green coast. It’s a land of strange and wonderful animals found nowhere else on Earth.",
  facts: [
    { label: "Capital", value: "Canberra", sub: "~460,000 people" },
    { label: "People", value: "27 million", sub: "2024 estimate" },
    { label: "Money", value: "Dollar A$", sub: "the Australian dollar" },
    { label: "Language", value: "English", sub: "with lots of slang" },
    { label: "Land area", value: "7,692,024 km²", sub: "6th-largest country" },
    { label: "Highest pt", value: "Mt Kosciuszko", sub: "2,228 m" }
  ],
  islandsLabel: "FAMOUS PLACES:", islands: ["Sydney", "Uluru", "Outback", "the Reef"],
  sections: { geography: "Outback, reef & red rock", animals: "Kangaroos, koalas & platypus", culture: "Beaches, sport & barbies", history: "The oldest living culture", wows: "Seven true surprises" },
  geo: [
    "Australia is both a country and a continent, surrounded on every side by ocean. The huge, dry centre — the Outback — is famous for its red soil and a giant rock called Uluru that glows orange at sunset.",
    "Most Australians live in cities near the cooler coast, like Sydney and Melbourne. Off the north-east shore lies the Great Barrier Reef, the largest living structure anywhere on the planet."
  ],
  animals: [
    "Australia’s animals are like nowhere else. Kangaroos and koalas are marsupials that carry their babies in a pouch, and the platypus is a furry animal that lays eggs and has a bill like a duck.",
    "There are stout, burrowing wombats, laughing kookaburra birds and wild dingoes. The warm seas hold clownfish, sea turtles and the colourful coral of the world’s greatest reef."
  ],
  culture: [
    "Australians love the outdoors: swimming and surfing at the beach, playing cricket and footy (Australian rules football), and cooking on a “barbie” (barbecue). They’re famous for being friendly and laid-back.",
    "Most people speak English, often with fun shortened words — afternoon becomes “arvo.” Australia’s towns blend busy modern city life with a deep love of nature and the wild bush."
  ],
  history: [
    "Aboriginal and Torres Strait Islander peoples have lived in Australia for at least 65,000 years — the oldest continuous culture in the world — passing on knowledge through art and Dreamtime stories.",
    "British ships arrived in 1788, and Australia later joined together as its own nation in 1901. Today people come from all over the world, but the First Peoples’ heritage remains at its heart."
  ],
  wows: [
    "Australia is the only country that is also a whole continent.",
    "There are almost twice as many kangaroos as there are people in Australia.",
    "The Great Barrier Reef is so big it can be seen from space.",
    "The platypus lays eggs, has a duck’s bill, and the males have venomous spurs.",
    "Uluru is a single giant rock standing 348 metres tall in the desert.",
    "Australia’s Aboriginal culture is the oldest living culture on Earth — over 65,000 years.",
    "A baby kangaroo, called a joey, is the size of a jellybean when it is born."
  ],
  myths: [
    { myth: "Koalas are a kind of bear.", fact: "Koalas aren’t bears at all — they’re marsupials, more closely related to kangaroos, and they carry their babies in a cosy pouch." },
    { myth: "Drop bears hunt visitors from the trees.", fact: "Drop bears are a made-up Aussie joke! There’s no such animal — it’s a tall tale Australians love to tell tourists." }
  ],
  words: [
    { en: "Hello", jp: "G’day", say: "g-day" },
    { en: "Thank you", jp: "Ta", say: "tah" },
    { en: "Friend", jp: "Mate", say: "mayt" },
    { en: "Afternoon", jp: "Arvo", say: "ah-voh" },
    { en: "Great", jp: "Ripper", say: "rip-uh" }
  ],
  photos: {
    landmark: { alt: "Uluru at sunset", caption: "ULURU — a giant red rock that glows orange in the Outback." },
    animalA: { alt: "A kangaroo", caption: "KANGAROOS bound across Australia — and carry joeys in a pouch." },
    animalB: { alt: "A koala in a tree", caption: "KOALAS doze in gum trees — they’re marsupials, not bears." },
    hero: { alt: "The Great Barrier Reef", caption: "THE GREAT BARRIER REEF — the largest living structure on Earth." }
  }
};

window.COUNTRIES = [
  { continent: "Asia", C: JAPAN },
  { continent: "Africa", C: EGYPT },
  { continent: "Europe", C: ITALY },
  { continent: "North America", C: MEXICO },
  { continent: "South America", C: BRAZIL },
  { continent: "Oceania", C: AUSTRALIA }
];
