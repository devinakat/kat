export interface ItineraryStopItem {
  id: number;
  time: string;
  title: string;
  location: string;
  description: string;
  badge: string;
  icon: 'car' | 'food' | 'hotel' | 'art' | 'shop';
  x: number; // percentage on map 0-100
  y: number; // percentage on map 0-100
  tip: string;
}

export interface FoodMealItem {
  timing: string;
  name: string;
  desc: string;
  photo: string;
}

export interface FoodOptionConfig {
  id: number;
  title: string;
  tag: string;
  isCustom?: boolean;
  meals?: FoodMealItem[];
}

export interface DateAppConfig {
  recipientNickname: string; // e.g. "my love", "hansome", etc.
  senderName: string;
  creatorEmail: string; // Email where respondent answers will be sent
  questionTitleLine1: string;
  questionTitleLine2: string;
  questionSubtitle: string;
  screen2HighlightLine1: string;
  screen2HighlightLine2: string;
  screen2ButtonText: string;
  thankYouTitle: string;
  tripTitle: string;
  tripSubtitle: string;
  drawing1Url: string;
  drawing2Url: string;
  bgmYoutubeUrl?: string;
  bgmTrackTitle?: string;
  supportDevUrl: string;
  itinerary: ItineraryStopItem[];
  foodOptions: FoodOptionConfig[];
}

// Example Romantic Date Itinerary for Custom Mode
export const ROMANTIC_DATE_EXAMPLE_STOPS: ItineraryStopItem[] = [
  {
    id: 1,
    time: '10:00',
    title: 'Kopi Pagi di Kawasan Eropa Tua',
    location: 'Kota Lama Surabaya (Zona Eropa) / Lodji Besar',
    description: 'Awali hari dengan berjalan santai di Kota Lama Surabaya (Zona Eropa). Mampirlah ke Lodji Besar untuk menikmati kopi atau es cokelat di dalam bangunan kolonial yang telah direvitalisasi. Suasananya yang tenang dan kental akan sejarah sangat pas untuk deep talk pembuka hari.',
    badge: 'Morning Coffee ☕🏛️',
    icon: 'food',
    x: 20,
    y: 75,
    tip: 'Suasana kolonial sangat estetik buat foto & deep talk!',
  },
  {
    id: 2,
    time: '12:30',
    title: 'Makan Siang Cultured & Belanja Streetwear',
    location: 'Carpentier Kitchen & ORE, Tegalsari',
    description: 'Bergeser ke area Tegalsari menuju Carpentier Kitchen. Kafe legendaris ini menyatu dengan toko pakaian streetwear lokal (ORE). Anda bisa mengajak pasangan melihat-lihat koleksi kurasi pakaian sebelum makan siang di area teras belakang mereka yang rimbun oleh tanaman menjalar dengan vibes rumahan yang sangat hangat. Must-try: Ultimate Burger atau Creamy Pasta-nya.',
    badge: 'Cultured Lunch 🍔🛍️',
    icon: 'shop',
    x: 42,
    y: 52,
    tip: 'Cobain Ultimate Burger atau Creamy Pasta di kebun belakang!',
  },
  {
    id: 3,
    time: '16:00',
    title: 'Afternoon Tea & Flower Hunt',
    location: 'ONNI House Surabaya',
    description: 'Manjakan pasangan Anda di ONNI House Surabaya. Kafe berkonsep home living ini juga berfungsi sebagai flower shop. Di sini Anda bisa memesan artisan tea dan kue, sembari memilihkan buket bunga kecil yang cantik di sudut toko bunga mereka demi memberikan kejutan manis di tengah kencan.',
    badge: 'Flower & Tea 🌸🍰',
    icon: 'art',
    x: 65,
    y: 35,
    tip: 'Pilihkan buket bunga kecil yang manis di sudut toko bunga!',
  },
  {
    id: 4,
    time: '19:00',
    title: 'Romantic Rooftop Dinner & City Lights',
    location: 'Sky 36 Restaurant, Gubeng',
    description: 'Tutup kencan Anda dengan makan malam elegan di Sky 36 Restaurant. Terletak di area Gubeng, restoran rooftop ini menawarkan pemandangan malam berupa city light gedung-gedung pencakar langit Surabaya yang sangat memukau. Suasana meja dengan pencahayaan temaram dan alunan musik lembut akan menyempurnakan malam kencan Anda.',
    badge: 'Rooftop Dinner 🍷🌃',
    icon: 'food',
    x: 82,
    y: 20,
    tip: 'Pemandangan city light gedung Surabaya dari rooftop sangat memukau!',
  },
];

export const DEFAULT_DATE_CONFIG: DateAppConfig = {
  recipientNickname: 'my love',
  senderName: 'Your Princess',
  creatorEmail: 'devinakaty@gmail.com',
  questionTitleLine1: 'Will you',
  questionTitleLine2: 'DATE ME?',
  questionSubtitle: 'Take your time. Choose carefully. There is definitely a right answer.',
  screen2HighlightLine1: 'YESSS',
  screen2HighlightLine2: 'YOU CHOOSE THE DATE ❤️',
  screen2ButtonText: 'Lets make it ✨',
  thankYouTitle: 'sweets lets make it come true.',
  tripTitle: 'Surabaya Heritage & Rooftop Romance',
  tripSubtitle: 'Dari kopi kolonial di Kota Lama, makan siang & belanja streetwear di Carpentier Kitchen, artisan tea & flower hunt di ONNI House, hingga candlelit rooftop dinner di Sky 36!',
  drawing1Url: '/assets/fantasy/knight_princess_kneel.png',
  drawing2Url: '/assets/fantasy/knight_princess_hug.png',
  bgmYoutubeUrl: 'https://youtu.be/9hIi-VPoYbs?si=8QUM3IL375c1bAW2',
  bgmTrackTitle: 'Congratulations (Piano Version) - goated.',
  supportDevUrl: 'https://saweria.co/katenivore',
  itinerary: [
    {
      id: 1,
      time: '10:00',
      title: 'Kopi Pagi di Kawasan Eropa Tua',
      location: 'Kota Lama Surabaya (Zona Eropa) / Lodji Besar',
      description: 'Awali hari dengan berjalan santai di Kota Lama Surabaya (Zona Eropa). Mampirlah ke Lodji Besar untuk menikmati kopi atau es cokelat di dalam bangunan kolonial yang telah direvitalisasi. Suasananya yang tenang dan kental akan sejarah sangat pas untuk deep talk pembuka hari.',
      badge: 'Morning Coffee ☕🏛️',
      icon: 'food',
      x: 18,
      y: 78,
      tip: 'Suasana kolonial sangat estetik buat foto & deep talk!',
    },
    {
      id: 2,
      time: '12:30',
      title: 'Makan Siang Cultured & Belanja Streetwear',
      location: 'Carpentier Kitchen & ORE, Tegalsari',
      description: 'Bergeser ke area Tegalsari menuju Carpentier Kitchen. Kafe legendaris ini menyatu dengan toko pakaian streetwear lokal (ORE). Anda bisa mengajak pasangan melihat-lihat koleksi kurasi pakaian sebelum makan siang di area teras belakang mereka yang rimbun oleh tanaman menjalar dengan vibes rumahan yang sangat hangat. Must-try: Ultimate Burger atau Creamy Pasta-nya.',
      badge: 'Cultured Lunch 🍔🛍️',
      icon: 'shop',
      x: 42,
      y: 52,
      tip: 'Cobain Ultimate Burger atau Creamy Pasta di kebun belakang!',
    },
    {
      id: 3,
      time: '16:00',
      title: 'Afternoon Tea & Flower Hunt',
      location: 'ONNI House Surabaya',
      description: 'Manjakan pasangan Anda di ONNI House Surabaya. Kafe berkonsep home living ini juga berfungsi sebagai flower shop. Di sini Anda bisa memesan artisan tea dan kue, sembari memilihkan buket bunga kecil yang cantik di sudut toko bunga mereka demi memberikan kejutan manis di tengah kencan.',
      badge: 'Flower & Tea 🌸🍰',
      icon: 'art',
      x: 65,
      y: 35,
      tip: 'Pilihkan buket bunga kecil yang manis di sudut toko bunga!',
    },
    {
      id: 4,
      time: '19:00',
      title: 'Romantic Rooftop Dinner & City Lights',
      location: 'Sky 36 Restaurant, Gubeng',
      description: 'Tutup kencan Anda dengan makan malam elegan di Sky 36 Restaurant. Terletak di area Gubeng, restoran rooftop ini menawarkan pemandangan malam berupa city light gedung-gedung pencakar langit Surabaya yang sangat memukau. Suasana meja dengan pencahayaan temaram dan alunan musik lembut akan menyempurnakan malam kencan Anda.',
      badge: 'Rooftop Dinner 🍷🌃',
      icon: 'food',
      x: 82,
      y: 20,
      tip: 'Pemandangan city light gedung Surabaya dari rooftop sangat memukau!',
    },
  ],
  foodOptions: [
    {
      id: 1,
      title: 'Option 1: Carpentier Ultimate Burger & Sky 36 Rooftop Steak',
      tag: 'Gourmet Bistro & Rooftop 🍔🥩',
      meals: [
        {
          timing: 'Siang (Lunch @ Carpentier)',
          name: 'Ultimate Homemade Beef Burger',
          desc: 'Signature beef patty juicy di teras rimbun Carpentier Kitchen, melted cheddar, caramelized onions, & crispy curly fries.',
          photo: '/assets/food_new/carpentier_burger.jpg',
        },
        {
          timing: 'Malam (Dinner @ Sky 36)',
          name: 'Prime Ribeye Steak & Wine',
          desc: 'Tender grilled ribeye steak with truffle butter, potato gratin & romantic glass of wine dengan pemandangan city light Surabaya dari rooftop.',
          photo: '/assets/food_new/sky36_steak.jpg',
        },
      ],
    },
    {
      id: 2,
      title: 'Option 2: Carpentier Creamy Pasta & Sky 36 Norwegian Salmon',
      tag: 'Creamy Pasta & Fresh Salmon 🍝🐟',
      meals: [
        {
          timing: 'Siang (Lunch @ Carpentier)',
          name: 'Creamy Smoked Beef Pasta',
          desc: 'Fettuccine pasta dengan saus cream kental wangi oregano, smoked beef gurih, & parmigiano reggiano khas Carpentier Kitchen.',
          photo: '/assets/food_new/carpentier_pasta.jpg',
        },
        {
          timing: 'Malam (Dinner @ Sky 36)',
          name: 'Pan-Seared Norwegian Salmon',
          desc: 'Fresh Atlantic salmon fillet renyah di luar lembut di dalam, saus lemon dill butter, baby asparagus & pemandangan malam romantis.',
          photo: '/assets/food_new/sky36_salmon.jpg',
        },
      ],
    },
    {
      id: 3,
      title: 'Option 3: Lodji Besar Kopi & ONNI House Artisan Tea & Cake',
      tag: 'Heritage Coffee & Flower Cafe ☕🌸',
      meals: [
        {
          timing: 'Pagi (Coffee @ Lodji Besar)',
          name: 'Kopi Susu Kolonial & Es Cokelat',
          desc: 'Kopi tubruk susu khas Lodji Besar di kawasan Eropa Kota Lama, es cokelat pekat nikmat, & suasana bangunan bersejarah yang syahdu.',
          photo: '/assets/food_new/lodji_coffee.jpg',
        },
        {
          timing: 'Sore (Afternoon Tea @ ONNI House)',
          name: 'Artisan Rose Berry Tea & Choux',
          desc: 'Seduhan teh artisan bunga mawar & berry segar, pastry lembut choux vanila, sembari memilihkan buket bunga cantik.',
          photo: '/assets/food_new/onni_tea.jpg',
        },
      ],
    },
    {
      id: 4,
      title: 'Option 4: Please fill this (Respondent fills himself)',
      tag: 'Your Special Request ✨✍️',
      isCustom: true,
    },
  ],
};
