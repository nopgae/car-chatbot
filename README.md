# Car Information Chatbot

A simple, interactive web-based chatbot that provides information about cars, including prices, specifications, and comparisons. This project demonstrates how to create a chatbot interface that could be connected to Claude's API for enhanced natural language understanding.

![Car Chatbot Demo](screenshot.png)

## Features

- Clean, responsive user interface
- Text-based queries about car information
- Image upload capability (simulated car recognition)
- Sample car database with basic information
- Example questions to guide users

## Live Demo

You can try the chatbot here: [https://yourusername.github.io/car-chatbot](https://yourusername.github.io/car-chatbot)

## How It Works

This demo includes:

1. **Simple Car Database**: A JavaScript object containing information about popular car models.
2. **Query Processing**: Basic natural language processing to understand user queries about car prices, general information, and comparisons.
3. **Simulated API Integration**: Placeholder for Claude API integration.
4. **Image Upload**: Interface for uploading car images (with simulated recognition response).

## Getting Started

### Prerequisites

- A GitHub account
- Basic knowledge of HTML, CSS, and JavaScript

### Installation and Deployment

1. Fork this repository
2. Clone your fork to your local machine
3. Modify the files as needed
4. Update the links in the footer and README to point to your GitHub username
5. Commit and push your changes to GitHub
6. Enable GitHub Pages in your repository settings:
   - Go to Settings > Pages
   - Select the main branch as the source
   - Click Save

Your chatbot will be available at `https://yourusername.github.io/car-chatbot`

## Connecting to Claude API

To connect this chatbot to Claude's API for more advanced natural language processing:

1. Sign up for an API key at [Anthropic's website](https://www.anthropic.com/)
2. Create a server-side component to handle API requests securely (using Node.js, Python, etc.)
3. Update the `callClaudeAPI` function in `script.js` to make actual API calls
4. Enhance the prompt with car-specific context and examples

## Expanding the Project

Here are some ways to enhance this chatbot:

- **Expanded Database**: Add more car models, specifications, and details
- **Advanced NLP**: Implement more sophisticated query understanding
- **Real Image Recognition**: Integrate with car recognition APIs
- **User Preferences**: Add the ability to save favorite cars or preferences
- **Dealer Integration**: Connect with local dealership information
- **Comparison Tools**: Create more visual car comparison features

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Font Awesome](https://fontawesome.com/) for the icons
- [Claude API](https://www.anthropic.com/) for natural language processing capabilities