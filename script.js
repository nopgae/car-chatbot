document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chatBox');
    const chatForm = document.getElementById('chatForm');
    const userInput = document.getElementById('userInput');
    const imageUpload = document.getElementById('imageUpload');
    const exampleQuestions = document.querySelectorAll('.info-section li');

    // Sample car database (in a real app, this would come from an API or larger dataset)
    const carDatabase = {
        "toyota camry": {
            make: "Toyota",
            model: "Camry",
            price: "$26,420",
            type: "Sedan",
            mpg: "28/39",
            horsepower: "203",
            features: ["Apple CarPlay", "Android Auto", "Toyota Safety Sense 2.5+"]
        },
        "honda accord": {
            make: "Honda",
            model: "Accord",
            price: "$27,295",
            type: "Sedan",
            mpg: "30/38",
            horsepower: "192",
            features: ["Honda Sensing", "8-inch touchscreen", "Wireless Apple CarPlay"]
        },
        "ford mustang": {
            make: "Ford",
            model: "Mustang",
            price: "$29,165",
            type: "Sports Car",
            mpg: "22/32",
            horsepower: "310",
            features: ["SYNC 4", "FordPass Connect", "Track Apps"]
        },
        "chevrolet camaro": {
            make: "Chevrolet",
            model: "Camaro",
            price: "$26,100",
            type: "Sports Car",
            mpg: "19/29",
            horsepower: "275",
            features: ["Wireless charging", "Bose premium audio", "Head-Up Display"]
        },
        "tesla model 3": {
            make: "Tesla",
            model: "Model 3",
            price: "$40,240",
            type: "Electric Sedan",
            mpg: "132/138 MPGe",
            horsepower: "283",
            features: ["Autopilot", "15-inch touchscreen", "Over-the-air updates"]
        }
    };

    // Click example questions to fill input
    exampleQuestions.forEach(question => {
        question.addEventListener('click', () => {
            userInput.value = question.textContent;
            userInput.focus();
        });
    });

    // Function to add message to chat
    function addMessage(message, isUser = false, isImage = false) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(isUser ? 'user' : 'bot');

        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');

        if (isImage) {
            const img = document.createElement('img');
            img.src = message;
            img.classList.add('user-image');
            messageContent.appendChild(img);
        } else {
            const p = document.createElement('p');
            p.textContent = message;
            messageContent.appendChild(p);
        }

        messageDiv.appendChild(messageContent);
        chatBox.appendChild(messageDiv);

        // Scroll to bottom of chat
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Function to show loading indicator
    function showLoading() {
        const loadingDiv = document.createElement('div');
        loadingDiv.classList.add('message', 'bot');
        loadingDiv.id = 'loadingIndicator';

        const loadingContent = document.createElement('div');
        loadingContent.classList.add('message-content', 'loading');

        for (let i = 0; i < 3; i++) {
            const span = document.createElement('span');
            loadingContent.appendChild(span);
        }

        loadingDiv.appendChild(loadingContent);
        chatBox.appendChild(loadingDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Function to hide loading indicator
    function hideLoading() {
        const loadingIndicator = document.getElementById('loadingIndicator');
        if (loadingIndicator) {
            loadingIndicator.remove();
        }
    }

    // Function to get car info from the database
    function getCarInfo(query) {
        // Convert query to lowercase for case-insensitive matching
        query = query.toLowerCase();
        
        // Check for price-specific queries
        if (query.includes('price of') || query.includes('cost of') || query.includes('how much is')) {
            // Extract car name from query
            let carName = '';
            
            for (const car in carDatabase) {
                if (query.includes(car)) {
                    carName = car;
                    break;
                }
            }
            
            if (carName) {
                const car = carDatabase[carName];
                return `The starting price of the ${car.make} ${car.model} is ${car.price}.`;
            }
        }
        
        // Check for general car info queries
        for (const car in carDatabase) {
            if (query.includes(car)) {
                const carInfo = carDatabase[car];
                return `
                    Here's information about the ${carInfo.make} ${carInfo.model}:
                    - Price: ${carInfo.price}
                    - Type: ${carInfo.type}
                    - Fuel Economy: ${carInfo.mpg}
                    - Horsepower: ${carInfo.horsepower}
                    - Key Features: ${carInfo.features.join(', ')}
                `;
            }
        }
        
        // Check for comparison queries
        if (query.includes('compare')) {
            const carsToCompare = [];
            
            for (const car in carDatabase) {
                if (query.includes(car)) {
                    carsToCompare.push(car);
                }
            }
            
            if (carsToCompare.length >= 2) {
                const car1 = carDatabase[carsToCompare[0]];
                const car2 = carDatabase[carsToCompare[1]];
                
                return `
                    Comparison between ${car1.make} ${car1.model} and ${car2.make} ${car2.model}:
                    
                    ${car1.make} ${car1.model}:
                    - Price: ${car1.price}
                    - Type: ${car1.type}
                    - Fuel Economy: ${car1.mpg}
                    - Horsepower: ${car1.horsepower}
                    
                    ${car2.make} ${car2.model}:
                    - Price: ${car2.price}
                    - Type: ${car2.type}
                    - Fuel Economy: ${car2.mpg}
                    - Horsepower: ${car2.horsepower}
                `;
            }
        }
        
        // Fallback for unknown queries
        // In a real application, you would call the Claude API here
        return `I'm sorry, I don't have that information in my database yet. In a full implementation, this query would be sent to the Claude API: "${query}"`;
    }

    // Function to handle Claude API call (simulated in this demo)
    async function callClaudeAPI(query) {
        // Simulate API call delay
        showLoading();
        
        // In a real application, you would make an actual API call here
        // const response = await fetch('your-api-endpoint', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'x-api-key': 'your-claude-api-key'
        //     },
        //     body: JSON.stringify({
        //         prompt: `Car information query: ${query}`,
        //         max_tokens_to_sample: 300
        //     })
        // });
        // const data = await response.json();
        // return data.completion;
        
        return new Promise(resolve => {
            setTimeout(() => {
                hideLoading();
                resolve(getCarInfo(query));
            }, 1000);
        });
    }

    // Handle form submission
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const query = userInput.value.trim();
        if (!query) return;
        
        // Add user message to chat
        addMessage(query, true);
        userInput.value = '';
        
        // Get response from Claude (simulated)
        const response = await callClaudeAPI(query);
        
        // Add bot response to chat
        addMessage(response);
    });

    // Handle image upload
    imageUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = async (event) => {
            // Display the uploaded image in the chat
            addMessage(event.target.result, true, true);
            
            // Simulate processing the image
            showLoading();
            setTimeout(() => {
                hideLoading();
                addMessage("I've analyzed your image. In a full implementation, I would use computer vision APIs and Claude to identify the car model and provide details.");
            }, 2000);
        };
        reader.readAsDataURL(file);
    });
});