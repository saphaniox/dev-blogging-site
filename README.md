# DevBlog

A simple blogging platform for developers to share their coding journey, tutorials, and experiences.

## Features

- ✨ Create and publish blog posts with images
- 📝 Rich text editing for content
- 👤 User authentication and profiles
- 📱 Responsive design for mobile and desktop
- 🎨 Clean, modern UI

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/saphaniox/devblogging.git
cd devblogging/blog-site
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file with your configuration
```env
VITE_API_URL=your_backend_url
VITE_APP_NAME=DevBlog
```

4. Start the development server
```bash
npm run dev
```

5. Open [http://localhost:3001](http://localhost:3001) in your browser

## Build for Production

```bash
npm run build:production
```

## Tech Stack

- **Frontend**: React 19, Vite, React Router
- **Styling**: CSS3 with custom properties
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **Linting**: ESLint

## Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React context providers
├── pages/          # Page components
├── utils/          # Utility functions and API client
├── assets/         # Static assets
└── App.jsx         # Main app component
```

## Contributing

Feel free to submit issues and pull requests. Make sure to run the linter before submitting:

```bash
npm run lint
```

## License

This project is open source and available under the [MIT License](LICENSE).
