const mongoose = require('mongoose');
const Event = require('../models/event.model');
const User = require('../models/user.model');
require('dotenv').config();

// Movies
const INCEPTION_IMG = 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX700.jpg';
const DARK_KNIGHT_IMG = 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX700.jpg';
const INTERSTELLAR_IMG = 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX700.jpg';
const DUNE_IMG = 'https://m.media-amazon.com/images/M/MV5BMDQ0NjgyN2YtNWViNS00YjA3LTkxNDktYzFkZTExZGMxZDkxXkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_SX700.jpg';
const DEADPOOL_IMG = 'https://m.media-amazon.com/images/M/MV5BYzE3ODhiNzAtN2Y5MC00NzRiLWJlMTEtYjg2OTYxMTkwZDkwXkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_SX700.jpg';

// Shows
const HAMILTON_IMG = 'https://m.media-amazon.com/images/M/MV5BNjViNWRjYWEtZTI0NC00N2E3LTk0NGQtMjY4NTM3OGNkZjY0XkEyXkFqcGdeQXVyMjUxMTY3ODM@._V1_SX700.jpg';
const LION_KING_IMG = 'https://m.media-amazon.com/images/M/MV5BYTYxNGMyZTYtMjE3MS00MzNjLWFjNmYtMDk3N2FmM2JiM2M1XkEyXkFqcGdeQXVyNjY5NDU4NzI@._V1_SX700.jpg';

// Sports & Concerts
const MUSIC_FESTIVAL_IMG = 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80';
const NBA_FINALS_IMG = 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=800&q=80';
const CRICKET_IMG = 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80';
const UFC_FIGHT_IMG = 'https://images.unsplash.com/photo-1587398559288-1e4c4e39d476?w=800&q=80';

// Comedy
const CHAPPELLE_IMG = 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&q=80';
const TREVOR_NOAH_IMG = 'https://images.unsplash.com/photo-1603190287605-e6ade32fa852?w=800&q=80';

const events = [
  {
    title: 'Inception',
    date: 'Mar 15, 2024',
    time: '7:00 PM',
    location: 'IMAX Theater, Downtown',
    price: 15.99,
    interested: '2.5K',
    image: INCEPTION_IMG,
    category: 'movies',
    description: 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    imdbRating: '8.8'
  },
  {
    title: 'The Dark Knight',
    date: 'Mar 16, 2024',
    time: '8:00 PM',
    location: 'Cineplex Central',
    price: 14.99,
    interested: '3.2K',
    image: DARK_KNIGHT_IMG,
    category: 'movies',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    imdbRating: '9.0'
  },
  {
    title: 'Hamilton',
    date: 'Mar 20, 2024',
    time: '7:30 PM',
    location: 'Broadway Theater',
    price: 89.99,
    interested: '5.1K',
    image: HAMILTON_IMG,
    category: 'shows',
    description: 'An American Musical is a sung-and-rapped-through musical by Lin-Manuel Miranda. It tells the story of American Founding Father Alexander Hamilton.'
  },
  {
    title: 'Interstellar',
    date: 'Mar 18, 2024',
    time: '6:30 PM',
    location: 'AMC Premium',
    price: 16.99,
    interested: '2.8K',
    image: INTERSTELLAR_IMG,
    category: 'movies',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    imdbRating: '8.7'
  },
  {
    title: 'The Lion King',
    date: 'Mar 25, 2024',
    time: '8:00 PM',
    location: 'Theater District',
    price: 79.99,
    interested: '4.7K',
    image: LION_KING_IMG,
    category: 'shows',
    description: 'Disney\'s award-winning musical will redefine your expectations of theatre. Set against the majesty of the Serengeti Plains, this breathtaking production explodes with glorious colors, stunning effects, and enchanting music.'
  },
  {
    title: 'Summer Music Festival',
    date: 'March 15, 2024',
    time: '7:00 PM',
    location: 'Central Park, New York',
    price: 29.99,
    interested: '2.5k',
    image: MUSIC_FESTIVAL_IMG,
    category: 'concerts',
    description: 'Join us for the biggest summer music festival featuring top artists from around the world. Experience live performances across multiple stages, food vendors, and interactive art installations.'
  },
  {
    title: 'NBA Finals 2024',
    date: 'June 15, 2024',
    time: '8:00 PM',
    location: 'Madison Square Garden',
    price: 299.99,
    interested: '8.5k',
    image: NBA_FINALS_IMG,
    category: 'sports',
    description: 'Don\'t miss the highly anticipated NBA Finals. Two of the best teams in the league face off for the championship.'
  },
  {
    title: 'World Cup Cricket Final',
    date: 'April 8, 2024',
    time: '2:00 PM',
    location: 'Lords Cricket Ground',
    price: 149.99,
    interested: '12.3k',
    image: CRICKET_IMG,
    category: 'sports',
    description: 'Witness the thrilling conclusion of the World Cup Cricket tournament. Two teams battle it out for the title.'
  },
  {
    title: 'UFC Championship Fight',
    date: 'May 1, 2024',
    time: '10:00 PM',
    location: 'T-Mobile Arena',
    price: 199.99,
    interested: '6.7k',
    image: UFC_FIGHT_IMG,
    category: 'sports',
    description: 'Don\'t miss the UFC Championship Fight. Witness the best fighters in the world compete for the title.'
  },
  {
    title: 'Dune: Part Two IMAX',
    date: 'March 22, 2024',
    time: '7:00 PM',
    location: 'IMAX Theater Downtown',
    price: 24.99,
    interested: '4.2k',
    image: DUNE_IMG,
    category: 'movies',
    description: 'Continue the epic journey of Paul Atreides as he unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
    imdbRating: '8.9'
  },
  {
    title: 'Deadpool & Wolverine',
    date: 'July 26, 2024',
    time: '8:00 PM',
    location: 'Regal Cinemas',
    price: 21.99,
    interested: '5.6k',
    image: DEADPOOL_IMG,
    category: 'movies',
    description: 'The Merc with a Mouth teams up with everyone\'s favorite clawed mutant in this highly anticipated MCU adventure.',
    imdbRating: 'Coming Soon'
  },
  {
    title: 'Dave Chappelle Live',
    date: 'April 15, 2024',
    time: '9:00 PM',
    location: 'Comedy Cellar',
    price: 89.99,
    interested: '3.9k',
    image: CHAPPELLE_IMG,
    category: 'theater',
    description: 'Don\'t miss Dave Chappelle\'s live performance at the Comedy Cellar. Expect hilarious jokes and unforgettable moments.'
  },
  {
    title: 'Trevor Noah World Tour',
    date: 'May 5, 2024',
    time: '8:30 PM',
    location: 'Radio City Music Hall',
    price: 79.99,
    interested: '4.5k',
    image: TREVOR_NOAH_IMG,
    category: 'theater',
    description: 'Trevor Noah brings his World Tour to Radio City Music Hall. Expect a night of laughter and insightful commentary.'
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing events
    await Event.deleteMany({});
    console.log('Cleared existing events');

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123', // This will be hashed automatically
      role: 'admin'
    });
    await adminUser.save();
    console.log('Admin user created');

    // Insert new events
    const result = await Event.insertMany(events);
    console.log(`Seeded ${result.length} events`);

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase(); 