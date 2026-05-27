import { type Movie } from '../types';

export const initialHomeMovies: Movie[] = [
  {
    id: 'tt15398776',
    title: 'Oppenheimer',
    year: 2023,
    quality: '4K',
    rating: 8.4,
    poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&auto=format&fit=crop&q=80',
    backdrop: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1920&auto=format&fit=crop&q=80',
    logo: '',
    genre: ['Biography', 'Drama', 'History'],
    description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
    isTrending: true,
    type: 'movie'
  },
  {
    id: 'tt1160419',
    title: 'Dune',
    year: 2021,
    quality: '4K',
    rating: 8.0,
    poster: 'https://images.unsplash.com/photo-1547483238-f400e65ccd56?w=800&auto=format&fit=crop&q=80',
    backdrop: 'https://images.unsplash.com/photo-1547483238-f400e65ccd56?w=1920&auto=format&fit=crop&q=80',
    logo: '',
    genre: ['Action', 'Adventure', 'Sci-Fi'],
    description: 'A noble family becomes embroiled in a war for control over the galaxy\'s most valuable asset while its heir is haunted by visions of a dark future.',
    isTrending: true,
    type: 'movie'
  },
  {
    id: 'tt10872600',
    title: 'Spider-Man: No Way Home',
    year: 2021,
    quality: 'HD',
    rating: 8.2,
    poster: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800&auto=format&fit=crop&q=80',
    backdrop: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=1920&auto=format&fit=crop&q=80',
    logo: '',
    genre: ['Action', 'Adventure', 'Fantasy'],
    description: 'With Spider-Man\'s identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear.',
    isTrending: true,
    type: 'movie'
  },
  {
    id: 'tt0499549',
    title: 'Avatar',
    year: 2009,
    quality: '4K',
    rating: 7.9,
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&auto=format&fit=crop&q=80',
    logo: '',
    genre: ['Action', 'Adventure', 'Fantasy'],
    description: 'A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.',
    isTrending: true,
    type: 'movie'
  },
  {
    id: 'tt1375666',
    title: 'Inception',
    year: 2010,
    quality: '4K',
    rating: 8.8,
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80',
    backdrop: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&auto=format&fit=crop&q=80',
    logo: '',
    genre: ['Action', 'Sci-Fi', 'Adventure'],
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    isTrending: true,
    type: 'movie'
  }
];

export const initialTopRatedMovies: Movie[] = [
  {
    id: 'tt0111161',
    title: 'The Shawshank Redemption',
    year: 1994,
    quality: 'HD',
    rating: 9.3,
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
    backdrop: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1920&auto=format&fit=crop&q=80',
    logo: '',
    genre: ['Drama'],
    description: 'Over the course of several years, two convicts form a friendship, seeking consolation and, eventually, redemption through basic compassion.',
    type: 'movie'
  },
  {
    id: 'tt0068646',
    title: 'The Godfather',
    year: 1972,
    quality: 'HD',
    rating: 9.2,
    poster: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=800&auto=format&fit=crop&q=80',
    backdrop: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=1920&auto=format&fit=crop&q=80',
    logo: '',
    genre: ['Crime', 'Drama'],
    description: 'The aging patriarch of an organized crime dynasty in postwar New York City transfers control of his clandestine empire to his reluctant youngest son.',
    type: 'movie'
  },
  {
    id: 'tt0468569',
    title: 'The Dark Knight',
    year: 2008,
    quality: '4K',
    rating: 9.0,
    poster: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=800&auto=format&fit=crop&q=80',
    backdrop: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1920&auto=format&fit=crop&q=80',
    logo: '',
    genre: ['Action', 'Crime', 'Drama'],
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    type: 'movie'
  },
  {
    id: 'tt0137523',
    title: 'Fight Club',
    year: 1999,
    quality: 'HD',
    rating: 8.8,
    poster: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=80',
    backdrop: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1920&auto=format&fit=crop&q=80',
    logo: '',
    genre: ['Drama'],
    description: 'An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.',
    type: 'movie'
  },
  {
    id: 'tt0109830',
    title: 'Forrest Gump',
    year: 1994,
    quality: 'HD',
    rating: 8.8,
    poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80',
    backdrop: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1920&auto=format&fit=crop&q=80',
    logo: '',
    genre: ['Drama', 'Romance'],
    description: 'The history of the United States from the 1950s to the \'70s unfolds from the perspective of an Alabama man with an IQ of 75, who yearns to be reunited with his childhood sweetheart.',
    type: 'movie'
  }
];

export const initialTvShows: Movie[] = [
  {
    id: 'tt0903747',
    title: 'Breaking Bad',
    year: 2008,
    quality: '4K',
    rating: 9.5,
    poster: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&auto=format&fit=crop&q=80',
    backdrop: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=1920&auto=format&fit=crop&q=80',
    logo: '',
    genre: ['Crime', 'Drama', 'Thriller'],
    description: 'A chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine with a former student in order to secure his family\'s future.',
    type: 'tv'
  },
  {
    id: 'tt0944947',
    title: 'Game of Thrones',
    year: 2011,
    quality: '4K',
    rating: 9.2,
    poster: 'https://images.unsplash.com/photo-1560942485-b2a11cc13456?w=800&auto=format&fit=crop&q=80',
    backdrop: 'https://images.unsplash.com/photo-1560942485-b2a11cc13456?w=1920&auto=format&fit=crop&q=80',
    logo: '',
    genre: ['Action', 'Adventure', 'Drama'],
    description: 'Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.',
    type: 'tv'
  },
  {
    id: 'tt10048342',
    title: 'The Last of Us',
    year: 2023,
    quality: '4K',
    rating: 8.8,
    poster: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=800&auto=format&fit=crop&q=80',
    backdrop: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=1920&auto=format&fit=crop&q=80',
    logo: '',
    genre: ['Action', 'Adventure', 'Drama'],
    description: 'After a global pandemic destroys civilization, a hardened survivor takes charge of a 14-year-old girl who may be humanity\'s last hope.',
    type: 'tv'
  },
  {
    id: 'tt0472954',
    title: 'The Office',
    year: 2005,
    quality: 'HD',
    rating: 9.0,
    poster: 'https://images.unsplash.com/photo-1585699324551-f6c309eed262?w=800&auto=format&fit=crop&q=80',
    backdrop: 'https://images.unsplash.com/photo-1585699324551-f6c309eed262?w=1920&auto=format&fit=crop&q=80',
    logo: '',
    genre: ['Comedy'],
    description: 'A mockumentary on a group of typical office workers, where the workday consists of ego clashes, inappropriate behavior, and tedium.',
    type: 'tv'
  },
  {
    id: 'tt1190634',
    title: 'The Boys',
    year: 2019,
    quality: '4K',
    rating: 8.7,
    poster: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop&q=80',
    backdrop: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1920&auto=format&fit=crop&q=80',
    logo: '',
    genre: ['Action', 'Comedy', 'Drama'],
    description: 'A team of vigilantes set out to take down corrupt superheroes who abuse their superpowers.',
    type: 'tv'
  }
];

export const initialAnimeList: Movie[] = [
  {
    id: 'tt2560140',
    title: 'Attack on Titan',
    year: 2013,
    quality: 'HD',
    rating: 9.1,
    poster: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80',
    backdrop: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1920&auto=format&fit=crop&q=80',
    logo: '',
    genre: ['Animation', 'Action', 'Adventure'],
    description: 'After his hometown is destroyed and his mother is killed, young Eren Jaeger vows to cleanse the earth of the giant humanoid Titans that have brought humanity to the brink of extinction.',
    type: 'anime'
  },
  {
    id: 'tt0409591',
    title: 'Naruto',
    year: 2002,
    quality: 'HD',
    rating: 8.4,
    poster: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
    backdrop: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1920&auto=format&fit=crop&q=80',
    logo: '',
    genre: ['Animation', 'Action', 'Adventure'],
    description: 'Naruto Uzumaki, a mischievous adolescent ninja, struggles as he searches for recognition and dreams of becoming the Hokage, the leader of his village.',
    type: 'anime'
  },
  {
    id: 'tt2098220',
    title: 'Demon Slayer',
    year: 2019,
    quality: '4K',
    rating: 8.6,
    poster: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=800&auto=format&fit=crop&q=80',
    backdrop: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=1920&auto=format&fit=crop&q=80',
    logo: '',
    genre: ['Animation', 'Action', 'Adventure'],
    description: 'A family is attacked by demons and only two members survive - Tanjiro and his sister Nezuko, who is turning into a demon slowly. Tanjiro sets out to become a demon slayer to avenge his family and cure his sister.',
    type: 'anime'
  },
  {
    id: 'tt0877057',
    title: 'Death Note',
    year: 2006,
    quality: 'HD',
    rating: 9.0,
    poster: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=800&auto=format&fit=crop&q=80',
    backdrop: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=1920&auto=format&fit=crop&q=80',
    logo: '',
    genre: ['Animation', 'Crime', 'Drama'],
    description: 'An intelligent high school student goes on a secret crusade to eliminate criminals from the world after discovering a notebook capable of killing anyone whose name is written in it.',
    type: 'anime'
  },
  {
    id: 'tt0388629',
    title: 'One Piece',
    year: 1999,
    quality: 'HD',
    rating: 8.9,
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
    backdrop: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1920&auto=format&fit=crop&q=80',
    logo: '',
    genre: ['Animation', 'Action', 'Adventure'],
    description: 'Follows the adventures of Monkey D. Luffy and his pirate crew in order to find the greatest treasure ever left by the legendary Pirate, Gold Roger.',
    type: 'anime'
  }
];
