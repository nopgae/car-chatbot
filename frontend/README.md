# AutoAssist - Car Chatbot

A web-based chatbot that helps users with car information, comparisons, pricing, and specifications.

![AutoAssist Demo](https://via.placeholder.com/800x400?text=AutoAssist+Demo)

## Features

- 💬 Interactive chat interface with car-themed design
- 🚗 Information about popular car models, prices, and specifications
- 📊 Car comparisons and recommendations
- 📷 Image upload capability for car identification
- 🧠 Natural language processing powered by Claude AI
- 📱 Responsive design for desktop and mobile devices

## Project Structure

```
car-chatbot/
├── frontend/              # GitHub Pages frontend
│   ├── index.html         # Chat interface
│   ├── styles.css         # Responsive styling
│   ├── script.js          # Frontend functionality
│   └── README.md          # Documentation
│
├── backend/               # Node.js backend
│   ├── server.js          # Express.js server
│   ├── package.json       # Dependencies
│   ├── .env.example       # Environment variables template
│   └── README.md          # Backend documentation
```

## Setup Instructions

### Backend Setup (Node.js + Express)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on the template:
   ```bash
   cp .env.example .env
   ```

4. Edit the `.env` file with your Anthropic Claude API key:
   ```
   PORT=3000
   CLAUDE_API_KEY=your_api_key_here
   CORS_ORIGIN=http://localhost:8080,https://nopgae.github.io
   ```

5. Start the server:
   ```bash
   npm start
   ```

6. The API will be available at `http://localhost:3000`.

### Connecting Frontend to Backend

1. In `script.js`, update the `API_ENDPOINT` variable with your deployed backend URL:
   ```javascript
   const API_ENDPOINT = 'https://your-car-chatbot-backend.herokuapp.com/api/chat';
   ```

## Deployment

### Frontend Deployment (GitHub Pages)

GitHub Pages automatically deploys your site when you push changes to your repository. Your site will be available at:
```
https://your-username.github.io/car-chatbot/
```

### Backend Deployment (Render.com)

1. Create a new Web Service on Render.com.
2. Connect your GitHub repository.
3. Set the build command:
   ```
   cd backend && npm install
   ```
4. Set the start command:
   ```
   cd backend && npm start
   ```
5. Add environment variables (PORT, CLAUDE_API_KEY, CORS_ORIGIN).
6. Deploy the service.

### Backend Deployment (Heroku)

1. Install the Heroku CLI and log in:
   ```bash
   npm install -g heroku
   heroku login
   ```

2. Create a new Heroku app:
   ```bash
   heroku create your-car-chatbot-backend
   ```

3. Add a `Procfile` to the backend directory:
   ```
   web: node server.js
   ```

4. Set environment variables:
   ```bash
   heroku config:set CLAUDE_API_KEY=your_api_key_here
   heroku config:set CORS_ORIGIN=https://your-username.github.io/car-chatbot
   ```

5. Deploy to Heroku:
   ```bash
   git subtree push --prefix backend heroku main
   ```

## Getting a Claude API Key

To use Claude AI for natural language understanding:

1. Visit [Anthropic's website](https://www.anthropic.com/product).
2. Sign up for an API key through their developer platform.
3. Once approved, you'll receive an API key that you can use in your `.env` file.

## Customizing the Car Database

The chatbot comes with a basic car database in `script.js`. To add more cars or update information:

1. Edit the `carDatabase` object in `script.js`.
2. For a production application, consider moving this database to the backend.

## License

MIT License - See LICENSE file for details.

## Contact

For questions or feedback, please open an issue on GitHub or contact [your-email@example.com]. Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- GitHub account
- [Anthropic Claude API key](https://www.anthropic.com/product) (for the chatbot)

### Frontend Setup (GitHub Pages)

1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/car-chatbot.git
   cd car-chatbot
   ```

2. For local testing, you can use any simple HTTP server:
   ```bash
   # Using Node.js http-server
   npm install -g http-server
   cd frontend
   http-server
   ```

3. Visit `http://localhost:8080` in your browser to see the chatbot interface.

4. To deploy to GitHub Pages:
   - Push your code to GitHub
   - Go to your repository on GitHub
   - Navigate to Settings > Pages
   - Set the source to your main branch and the folder to `/frontend`
   - Click Save

###