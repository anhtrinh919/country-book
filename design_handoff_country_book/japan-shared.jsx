/* japan-shared.jsx — content data + shared geometric building blocks
   for the Japan country-book spreads. Exports to window. */

// ---- Confirmed Creative-Commons photos (Wikimedia Commons originals) ----
const PHOTOS = {
  fuji:  "https://commons.wikimedia.org/wiki/Special:FilePath/Mount%20Fuji%20from%20Lake%20Kawaguchi.jpg",
  monkey:"https://commons.wikimedia.org/wiki/Special:FilePath/Jigokudani%20hotspring%20in%20Nagano%20Japan%20001.jpg",
  train: "https://commons.wikimedia.org/wiki/Special:FilePath/Shinkansen%20series%20E5%20set%20U9%20at%20Shin-Hakodate-Hokuto%20Station%202018-02-09%20(25312601527).jpg",
  deer:  "https://commons.wikimedia.org/wiki/Special:FilePath/2016-11-12%20A%20male%20Shika%20deer%20in%20the%20park.jpg",
};
const CREDIT = {
  fuji:  "Photo · Wikimedia Commons · CC BY-SA",
  monkey:"Photo · Wikimedia Commons · CC BY-SA",
  train: "Photo · Wikimedia Commons · CC BY-SA",
  deer:  "Photo · Wikimedia Commons · CC BY-SA",
};

// ---- Content (checked against the brief; myths flagged) ----
const JAPAN = {
  name: "JAPAN",
  kana: "日本",
  romaji: "NIPPON",
  tagline: "Land of the Rising Sun",
  region: "East Asia · Pacific Ocean",
  fileNo: "081",
  coords: "36°N · 138°E",

  lead: "Japan is an island country in East Asia, out in the Pacific Ocean near Korea, China and Russia. People here call it Nihon or Nippon — “sun origin” — which is why it’s nicknamed the Land of the Rising Sun. It’s a place where ancient wooden temples sit beside neon cities, and monkeys take hot baths in the snow.",

  facts: [
    { label: "Capital",    value: "Tokyo",        sub: "~14.2 million people" },
    { label: "People",     value: "123 million",  sub: "2025 census · slowly shrinking" },
    { label: "Money",      value: "Yen ¥",        sub: "the Japanese yen" },
    { label: "Language",   value: "Japanese",     sub: "kanji · hiragana · katakana" },
    { label: "Land area",  value: "377,975 km²",  sub: "about the size of California" },
    { label: "Highest pt", value: "Mt Fuji",      sub: "3,776 m · last erupted 1707" },
  ],
  islands: ["Honshu", "Hokkaido", "Kyushu", "Shikoku"],

  geo: [
    "Japan isn’t one island but an archipelago — a chain of thousands. Four big ones hold almost everybody: Honshu (the biggest, home to Tokyo), snowy Hokkaido in the north, Kyushu and Shikoku. The country runs so far north-to-south that it has snowy winters at one end and warm beaches at the other.",
    "Its most famous sight is Mount Fuji, a near-perfect cone and the tallest peak at 3,776 metres. Fuji is a volcano, though it hasn’t erupted since 1707. Japan sits on the “Ring of Fire,” which is why it has so many volcanoes, hot springs and earthquakes.",
  ],

  animals: [
    "High in the Nagano mountains, Japanese macaques — snow monkeys — climb into steaming hot springs to keep warm in winter. They’re the only wild monkeys known to bathe like this, and they live farther north than any monkey except humans.",
    "In Nara Park, more than a thousand tame sika deer roam free, and some bow their heads to ask for crackers. Overhead flies the red-crowned crane, a symbol of luck, while the raccoon-like tanuki turns up in folk tales as a shape-shifting trickster.",
  ],

  culture: [
    "In spring, families picnic under clouds of pink cherry blossom (sakura) — a tradition called hanami. Japanese food is loved everywhere: sushi, steaming ramen, chewy mochi and neat bento lunch boxes. The traditional robe is the kimono, and Japan gave the world origami, manga comics and anime.",
    "The oldest national sport is sumo, where two huge wrestlers try to push each other out of a ring — a match can be over in seconds — while baseball is the most popular game to watch. Everyday life is full of clever touches too: vending machines everywhere, helpful robots, and the famous bullet trains.",
  ],

  history: [
    "For hundreds of years — from about the 1100s to the late 1800s — Japan was guarded by the samurai, warriors famous for their swords and a code of honour called bushido. Working quietly in the shadows were the ninja, real spies and secret agents.",
    "Japan still has an emperor today, though the role is now mostly ceremonial, and its line of emperors is one of the oldest in the world. To see old and new, travellers visit Tokyo, the temple-filled city of Kyoto, and Mount Fuji.",
  ],

  wows: [
    "Snow monkeys take hot baths — the only wild monkeys known to do it.",
    "The Hayabusa bullet train runs at 320 km/h and is famous for arriving on time to the second.",
    "The world’s oldest company was Japanese: Kongō Gumi built temples for over 1,400 years.",
    "The world’s oldest hotel is here too — a hot-spring inn open since 705 AD.",
    "Square watermelons are real — ordinary melons grown inside box-shaped moulds.",
    "Japan has around 2.6 million vending machines — about one for every 23–30 people.",
    "Capsule hotels let travellers sleep in cosy stacked pods; the first opened in 1979.",
  ],

  myths: [
    { myth: "Ninjas always wore black and had magic powers.", fact: "Real ninjas were spies who dressed like ordinary farmers and travellers to blend in. The dramatic “ninja vs. samurai” battles came from films, long after their time." },
    { myth: "Square watermelons grow from special seeds.", fact: "Nope — there’s no special seed. They’re ordinary melons grown inside clear boxes so they fill out into a cube." },
  ],

  words: [
    { en: "Hello",     jp: "Konnichiwa", say: "kohn-nee-chee-wah" },
    { en: "Thank you", jp: "Arigatō",    say: "ah-ree-gah-toh" },
    { en: "Yes",       jp: "Hai",        say: "high" },
    { en: "Goodbye",   jp: "Sayōnara",   say: "sah-yoh-nah-rah" },
    { en: "Delicious", jp: "Oishii",     say: "oy-shee" },
  ],
};

// ---- Geometric Hinomaru flag (white field + red sun disc) ----
function Flag({ w = 150, radius = 12, ring = "#e7ddc8" }) {
  const h = w * 2 / 3;
  return (
    <div style={{
      width: w, height: h, background: "#fff", borderRadius: radius,
      position: "relative", boxShadow: "0 6px 20px rgba(0,0,0,.12)",
      border: `1px solid ${ring}`, overflow: "hidden", flex: "0 0 auto",
    }}>
      <div style={{
        position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)",
        width: h * 0.6, height: h * 0.6, borderRadius: "50%", background: "#BC002D",
      }}></div>
    </div>
  );
}

// ---- Big decorative rising sun (disc + optional rays via conic gradient) ----
function Sun({ size = 320, color = "#E4002B", rays = true, rayColor = "rgba(228,0,43,.13)" }) {
  return (
    <div style={{ width: size, height: size, position: "relative", flex: "0 0 auto" }}>
      {rays && (
        <div style={{
          position: "absolute", inset: -size * 0.35, borderRadius: "50%",
          background: `repeating-conic-gradient(${rayColor} 0deg 7deg, transparent 7deg 14deg)`,
          WebkitMaskImage: "radial-gradient(circle, #000 38%, transparent 70%)",
          maskImage: "radial-gradient(circle, #000 38%, transparent 70%)",
        }}></div>
      )}
      <div style={{
        position: "absolute", inset: 0, borderRadius: "50%", background: color,
      }}></div>
    </div>
  );
}

Object.assign(window, { PHOTOS, CREDIT, JAPAN, Flag, Sun });
