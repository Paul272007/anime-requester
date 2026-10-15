export const AUTHOR_WORKS = {
  'eiichiro oda': ['One Piece'],
  oda: ['One Piece'],
  'masashi kishimoto': ['Naruto', 'Boruto'],
  kishimoto: ['Naruto', 'Boruto'],
  'akira toriyama': ['Dragon Ball', 'Dr. Slump', 'Sand Land'],
  toriyama: ['Dragon Ball', 'Dr. Slump', 'Sand Land'],
  'tite kubo': ['Bleach', 'Burn the Witch'],
  kubo: ['Bleach', 'Burn the Witch'],
  'hajime isayama': ['Attack on Titan', 'Shingeki no Kyojin'],
  isayama: ['Attack on Titan', 'Shingeki no Kyojin'],
  'hiromu arakawa': ['Fullmetal Alchemist', 'Silver Spoon'],
  arakawa: ['Fullmetal Alchemist', 'Silver Spoon'],
  'yoshihiro togashi': ['Hunter x Hunter', 'Yu Yu Hakusho'],
  togashi: ['Hunter x Hunter', 'Yu Yu Hakusho'],
  'kentaro miura': ['Berserk'],
  miura: ['Berserk'],
  'hirohiko araki': ["JoJo's Bizarre Adventure"],
  araki: ["JoJo's Bizarre Adventure"],
  'tsugumi ohba': ['Death Note', 'Bakuman'],
  'takeshi obata': ['Death Note', 'Bakuman'],
  ohba: ['Death Note', 'Bakuman'],
  obata: ['Death Note', 'Bakuman'],
  'rumiko takahashi': ['Inuyasha', 'Ranma'],
  takahashi: ['Inuyasha', 'Ranma'],
  'koyoharu gotouge': ['Demon Slayer', 'Kimetsu no Yaiba'],
  gotouge: ['Demon Slayer', 'Kimetsu no Yaiba'],
  'gege akutami': ['Jujutsu Kaisen'],
  akutami: ['Jujutsu Kaisen'],
  'kohei horikoshi': ['My Hero Academia', 'Boku no Hero Academia'],
  horikoshi: ['My Hero Academia', 'Boku no Hero Academia'],
  'tatsuki fujimoto': ['Chainsaw Man', 'Look Back'],
  fujimoto: ['Chainsaw Man', 'Look Back'],
  'sui ishida': ['Tokyo Ghoul'],
  ishida: ['Tokyo Ghoul'],
  'takehiko inoue': ['Slam Dunk', 'Vagabond'],
  inoue: ['Slam Dunk', 'Vagabond'],
  'ken wakui': ['Tokyo Revengers'],
  wakui: ['Tokyo Revengers'],
  'riichiro inagaki': ['Dr. Stone', 'Eyeshield 21'],
  inagaki: ['Dr. Stone', 'Eyeshield 21'],
  boichi: ['Dr. Stone'],
  'gosho aoyama': ['Detective Conan'],
  aoyama: ['Detective Conan'],
  'katsura hoshino': ['D.Gray-man'],
  hoshino: ['D.Gray-man'],
  'yuki tabata': ['Black Clover'],
  tabata: ['Black Clover'],
  'nakaba suzuki': ['The Seven Deadly Sins', 'Nanatsu no Taizai'],
  suzuki: ['The Seven Deadly Sins', 'Nanatsu no Taizai'],
  'atsushi ohkubo': ['Soul Eater', 'Fire Force'],
  ohkubo: ['Soul Eater', 'Fire Force'],
  one: ['One Punch Man', 'Mob Psycho 100'],
  'yusuke murata': ['One Punch Man', 'Eyeshield 21'],
  murata: ['One Punch Man', 'Eyeshield 21'],
  'osamu tezuka': ['Astro Boy', 'Black Jack', 'Dororo'],
  tezuka: ['Astro Boy', 'Black Jack', 'Dororo'],
  'naoki urasawa': ['Monster', 'Pluto', '20th Century Boys'],
  urasawa: ['Monster', 'Pluto'],
  clamp: ['Cardcaptor Sakura', 'Code Geass', 'Chobits'],
  'junji ito': ['Uzumaki', 'Junji Ito Collection'],
  'katsuhiro otomo': ['Akira'],
  otomo: ['Akira'],
  'kanehito yamada': ['Sousou no Frieren', 'Frieren'],
  yamada: ['Sousou no Frieren', 'Frieren'],
  'aka akasaka': ['Kaguya-sama', 'Oshi no Ko'],
  akasaka: ['Kaguya-sama', 'Oshi no Ko'],
  'hayao miyazaki': ['Sen to Chihiro', 'Mononoke Hime', 'Tonari no Totoro'],
  miyazaki: ['Sen to Chihiro', 'Mononoke Hime', 'Tonari no Totoro'],
  'makoto shinkai': ['Kimi no Na wa', 'Your Name', 'Suzume'],
  shinkai: ['Kimi no Na wa', 'Your Name', 'Suzume'],
  'hideaki anno': ['Neon Genesis Evangelion', 'Evangelion'],
  anno: ['Neon Genesis Evangelion', 'Evangelion'],
  'satoshi kon': ['Perfect Blue', 'Paprika', 'Tokyo Godfathers'],
  kon: ['Perfect Blue', 'Paprika'],
  'shinichiro watanabe': ['Cowboy Bebop', 'Samurai Champloo'],
  watanabe: ['Cowboy Bebop', 'Samurai Champloo'],
  'mamoru hosoda': ['Toki wo Kakeru Shoujo', 'Summer Wars', 'Belle'],
  hosoda: ['Toki wo Kakeru Shoujo', 'Summer Wars', 'Belle'],
}

export function getWorksByAuthor(authorInput) {
  if (!authorInput || typeof authorInput !== 'string') return null

  const cleaned = authorInput.toLowerCase().trim()
  if (AUTHOR_WORKS[cleaned]) {
    return AUTHOR_WORKS[cleaned]
  }

  for (const [authorKey, works] of Object.entries(AUTHOR_WORKS)) {
    if (
      cleaned === authorKey ||
      cleaned.includes(authorKey) ||
      authorKey.includes(cleaned)
    ) {
      return works
    }
  }

  return null
}

export async function searchByAuthor(authorName, searchFn) {
  const works = getWorksByAuthor(authorName)
  if (works && works.length > 0) {
    const allResults = []
    for (const work of works) {
      try {
        const res = await searchFn({ search: work, size: 10 })
        const items = res?.data || (Array.isArray(res) ? res : [])
        for (const item of items) {
          if (
            !allResults.some(
              (a) =>
                (a._id && a._id === item._id) ||
                (a.id && a.id === item.id) ||
                a.title === item.title,
            )
          ) {
            allResults.push(item)
          }
        }
      } catch {
        // Ignorer l'erreur individuelle et continuer
      }
    }
    if (allResults.length > 0) {
      return { data: allResults }
    }
  }

  return await searchFn({ search: authorName, size: 10 })
}
