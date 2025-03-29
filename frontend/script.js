// Car database (simple version - in a real app, this would come from a backend)
const carDatabase = {
    "toyota camry": {
        name: "Toyota Camry",
        price: 26220,
        specs: {
            engine: "2.5L 4-Cylinder",
            horsepower: 203,
            mpg: "28 city / 39 highway",
            transmission: "8-speed Automatic",
            drivetrain: "Front-Wheel Drive",
            seating: 5
        },
        features: ["Lane Departure Alert", "Dynamic Radar Cruise Control", "Apple CarPlay & Android Auto"],
        imageUrl: "https://via.placeholder.com/300?text=Toyota+Camry"
    },
    "honda accord": {
        name: "Honda Accord",
        price: 27895,
        specs: {
            engine: "1.5L Turbocharged 4-Cylinder",
            horsepower: 192,
            mpg: "30 city / 38 highway",
            transmission: "Continuously Variable",
            drivetrain: "Front-Wheel Drive",
            seating: 5
        },
        features: ["Honda Sensing Suite", "8-inch Touchscreen", "Wireless Apple CarPlay & Android Auto"],
        imageUrl: "https://via.placeholder.com/300?text=Honda+Accord"
    },
    "tesla model 3": {
        name: "Tesla Model 3",
        price: 38990,
        specs: {
            engine: "Electric Motor",
            horsepower: 271,
            range: "272 miles",
            transmission: "Single-speed fixed gear",
            drivetrain: "Rear-Wheel Drive",
            seating: 5
        },
        features: ["Autopilot", "15-inch Touchscreen", "Over-the-air Updates"],
        imageUrl: "https://via.placeholder.com/300?text=Tesla+Model+3"
    },
    "ford f-150": {
        name: "Ford F-150",
        price: 34585,
        specs: {
            engine: "3.3L V6",
            horsepower: 290,
            mpg: "20 city / 24 highway",
            transmission: "10-speed Automatic",
            drivetrain: "Rear-Wheel Drive (4x4 available)",
            seating: 6
        },
        features: ["Pro Power Onboard", "SYNC 4", "Pre-Collision Assist"],
        imageUrl: "https://via.placeholder.com/300?text=Ford+F-150"
    },
    "hyundai tucson": {
        name: "Hyundai Tucson",
        price: 27250,
        specs: {
            engine: "2.5L 4-Cylinder",
            horsepower: 187,
            mpg: "26 city / 33 highway",
            transmission: "8-speed Automatic",
            drivetrain: "Front-Wheel Drive (AWD available)",
            seating: 5
        },
        features: ["SmartSense Safety Suite", "10.25-inch Touchscreen", "Bluelink Connected Car System"],
        imageUrl: "https://via.placeholder.com/300?text=Hyundai+Tucson"
    }
};

// DOM elements
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatMessages = document.getElementById('chat-messages');
const imageUpload = document.getElementById('image-upload');
const imagePreview = document.getElementById('image-preview');
const previewImg = document.getElementById('preview-img');
const removeImage = document.getElementById('remove-image');
const suggestionChips = document.querySelectorAll('.chip');

// Backend API endpoint (replace with your actual backend URL in production)
const API_ENDPOINT = 'https://your-car-chatbot-backend.herokuapp.com/api/chat';
// For development/testing
const LOCAL_API_ENDPOINT = 'http://localhost:3000/api/chat';

// Bot is typing indicator
function addTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot';
    typingDiv.id = 'typing-indicator';
    
    typingDiv.innerHTML = `
        <div class="avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <p><i class="fas fa-ellipsis-h"></i> AutoAssist is thinking...</p>
        </div>
    `;
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Add a message to the chat display
function addMessage(message, isUser = false, imageUrl = null) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
    
    let avatarIcon = isUser ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
    
    let messageContent = `<p>${message}</p>`;
    if (imageUrl) {
        messageContent += `<img src="${imageUrl}" class="message-image" alt="Uploaded image">`;
    }
    
    messageDiv.innerHTML = `
        <div class="avatar">
            ${avatarIcon}
        </div>
        <div class="message-content">
            ${messageContent}
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Simple car lookup function (in a real app, this would be more sophisticated)
function lookupCarInfo(query) {
    const normalizedQuery = query.toLowerCase();
    
    // Check if query directly matches a car in our database
    for (const carKey in carDatabase) {
        if (normalizedQuery.includes(carKey)) {
            return carDatabase[carKey];
        }
    }
    
    return null;
}

// Handle common car queries locally (for demo purposes)
function handleLocalCarQuery(query) {
    const normalizedQuery = query.toLowerCase();
    
    // Check if it's a direct query about a specific car
    const carInfo = lookupCarInfo(query);
    if (carInfo) {
        let response = `<strong>${carInfo.name}</strong><br>`;
        response += `Starting at $${carInfo.price.toLocaleString()}<br><br>`;
        
        response += `<strong>Key Specs:</strong><br>`;
        for (const [key, value] of Object.entries(carInfo.specs)) {
            response += `• ${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}<br>`;
        }
        
        response += `<br><strong>Key Features:</strong><br>`;
        carInfo.features.forEach(feature => {
            response += `• ${feature}<br>`;
        });
        
        return {
            text: response,
            imageUrl: carInfo.imageUrl
        };
    }
    
    // Handle comparison queries
    if (normalizedQuery.includes("compare") || normalizedQuery.includes("vs") || normalizedQuery.includes("versus")) {
        const cars = [];
        
        for (const carKey in carDatabase) {
            if (normalizedQuery.includes(carKey)) {
                cars.push(carDatabase[carKey]);
            }
        }
        
        if (cars.length >= 2) {
            let response = `<strong>Comparison: ${cars[0].name} vs ${cars[1].name}</strong><br><br>`;
            
            response += `<strong>Price:</strong><br>`;
            response += `• ${cars[0].name}: $${cars[0].price.toLocaleString()}<br>`;
            response += `• ${cars[1].name}: $${cars[1].price.toLocaleString()}<br><br>`;
            
            response += `<strong>Performance:</strong><br>`;
            response += `• ${cars[0].name}: ${cars[0].specs.horsepower} hp, ${cars[0].specs.mpg}<br>`;
            response += `• ${cars[1].name}: ${cars[1].specs.horsepower} hp, ${cars[1].specs.mpg || cars[1].specs.range}<br><br>`;
            
            return {
                text: response
            };
        }
    }
    
    // Return null if we couldn't handle the query locally
    return null;
}

// Process the user's message and get a response
async function processMessage(userMessage, imageData = null) {
    // First try to handle common queries locally
    const localResponse = handleLocalCarQuery(userMessage);
    
    if (localResponse) {
        return localResponse;
    }
    
    // If we can't handle locally, send to backend API
    try {
        const apiUrl = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') 
            ? LOCAL_API_ENDPOINT 
            : API_ENDPOINT;
            
        // In a real implementation, we would send the message to our backend
        // For demo purposes, we'll just simulate a response
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Generate a simulated response based on the query
        let response = "I don't have specific information about that. In a real implementation, this question would be processed by Claude AI for a detailed response.";
        
        if (userMessage.toLowerCase().includes("best family sedan")) {
            response = "Based on current ratings, the Honda Accord and Toyota Camry are consistently top-rated family sedans. The Accord is praised for its refined driving experience and fuel efficiency, while the Camry is known for reliability and resale value.";
        } else if (userMessage.toLowerCase().includes("electric") || userMessage.toLowerCase().includes("ev")) {
            response = "For electric vehicles with the best range, the Tesla Model S leads with up to 405 miles, followed by the Lucid Air with approximately 520 miles, and the Mercedes EQS with about 350 miles of range.";
        } else if (userMessage.toLowerCase().includes("suv") || userMessage.toLowerCase().includes("crossover")) {
            response = "Some of the most affordable SUVs in 2025 include the Kia Seltos ($24,390), Hyundai Tucson ($27,250), and Mazda CX-5 ($27,975). All offer good value with standard safety features.";
        }
        
        return {
            text: response
        };
        
        /* In real implementation with backend:
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: userMessage,
                image: imageData
            })
        });
        
        if (!response.ok) {
            throw new Error('API request failed');
        }
        
        return await response.json();
        */
    } catch (error) {
        console.error('Error processing message:', error);
        return {
            text: "Sorry, I'm having trouble connecting to my knowledge base right now. Please try again later."
        };
    }
}

// Handle form submission
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const message = userInput.value.trim();
    if (!message) return;
    
    // Get image data if an image was uploaded
    let imageData = null;
    if (!imagePreview.classList.contains('hidden')) {
        imageData = previewImg.src;
    }
    
    // Add user message to chat
    addMessage(message, true, imageData);
    
    // Clear input
    userInput.value = '';
    clearImagePreview();
    
    // Show typing indicator
    addTypingIndicator();
    
    // Process the message
    const response = await processMessage(message, imageData);
    
    // Remove typing indicator
    removeTypingIndicator();
    
    // Add bot response to chat
    addMessage(response.text, false, response.imageUrl);
});

// Handle image uploads
imageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
        previewImg.src = event.target.result;
        imagePreview.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
});

// Remove image preview
removeImage.addEventListener('click', () => {
    clearImagePreview();
});

function clearImagePreview() {
    imagePreview.classList.add('hidden');
    previewImg.src = '';
    imageUpload.value = '';
}

// Handle suggestion chips
suggestionChips.forEach(chip => {
    chip.addEventListener('click', () => {
        const query = chip.getAttribute('data-query');
        userInput.value = query;
        chatForm.dispatchEvent(new Event('submit'));
    });
});

// Initial greeting (delayed slightly for effect)
window.addEventListener('load', () => {
    setTimeout(() => {
        addMessage("I can help you find information about car prices, specifications, and features. What are you looking for today?", false);
    }, 500);
});