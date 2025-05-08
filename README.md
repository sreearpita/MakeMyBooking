# MakeMyBooking

A modern event booking and ticketing platform built with Angular, allowing users to discover, search, and book various events including concerts, movies, theater shows, and sports events.

## Features

- **Smart Search**: Search events by name and location
- **Category Filtering**: Browse events by categories (Concerts, Movies, Theater, Sports)
- **Interactive UI**: Modern and responsive design with smooth animations
- **User-friendly Interface**: Intuitive navigation and booking process

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Angular CLI (v15 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/MakeMyBooking.git
cd MakeMyBooking
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
ng serve
```

4. Open your browser and navigate to `http://localhost:4200`

## Built With

- [Angular](https://angular.io/) - Frontend Framework
- [Angular Material](https://material.angular.io/) - UI Component Library
- [TypeScript](https://www.typescriptlang.org/) - Programming Language

## 📁 Project Structure

```
src/
├── app/
│   ├── home/              # Home page component
│   ├── shared/            # Shared components and services
│   └── core/              # Core functionality
├── assets/               # Static assets
└── environments/         # Environment configurations
```

## 🔧 Configuration

1. Environment Setup:
   - Copy `src/environments/environment.example.ts` to `src/environments/environment.ts`
   - Update the API endpoints and other configurations

2. API Integration:
   - Configure your backend API endpoints in the environment files
   - Set up proxy configuration if needed

## 💾 Database Setup

### MongoDB Setup

1. Install MongoDB:
   ```bash
   # For macOS using Homebrew
   brew tap mongodb/brew
   brew install mongodb-community

   # For Ubuntu
   sudo apt-get install mongodb

   # For Windows
   # Download and install from MongoDB website
   ```

2. Start MongoDB service:
   ```bash
   # macOS
   brew services start mongodb-community

   # Ubuntu
   sudo service mongodb start

   # Windows
   # MongoDB runs as a service automatically
   ```

3. Create Database and Collections:
   ```bash
   # Connect to MongoDB
   mongosh

   # Create and use database
   use makemybooking

   # Create collections
   db.createCollection('events')
   db.createCollection('users')
   db.createCollection('bookings')
   ```

4. Database Schema:

   Events Collection:
   ```javascript
   {
     _id: ObjectId,
     title: String,
     description: String,
     image: String,
     price: Number,
     date: Date,
     time: String,
     location: String,
     category: String,
     interested: Number,
     availableTickets: Number,
     createdAt: Date,
     updatedAt: Date
   }
   ```

   Users Collection:
   ```javascript
   {
     _id: ObjectId,
     name: String,
     email: String,
     password: String (hashed),
     role: String,
     createdAt: Date,
     updatedAt: Date
   }
   ```

   Bookings Collection:
   ```javascript
   {
     _id: ObjectId,
     eventId: ObjectId,
     userId: ObjectId,
     quantity: Number,
     totalPrice: Number,
     status: String,
     createdAt: Date,
     updatedAt: Date
   }
   ```

5. Environment Variables:
   Add the following to your `environment.ts`:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:3000/api',
     mongoUri: 'mongodb://localhost:27017/makemybooking'
   };
   ```

6. Indexes:
   ```javascript
   // Create indexes for better query performance
   db.events.createIndex({ title: 'text', description: 'text' })
   db.events.createIndex({ category: 1 })
   db.events.createIndex({ date: 1 })
   db.bookings.createIndex({ eventId: 1, userId: 1 })
   ```

### Database Backup

1. Create a backup:
   ```bash
   mongodump --db makemybooking --out ./backup
   ```

2. Restore from backup:
   ```bash
   mongorestore --db makemybooking ./backup/makemybooking
   ```

##  Running Tests

```bash
# Unit tests
ng test

# End-to-end tests
ng e2e
```

## 📦 Building for Production

```bash
ng build --prod
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
