const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { Anthropic } = require('@anthropic/sdk');
require('dotenv').config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Configure CORS
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : ['http://localhost:8080'];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

// Configure middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Configure file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function(req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed!"));
  }
});

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

// Car database (expanded version with more details)
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
    pros: ["Excellent reliability", "Comfortable ride", "Good fuel economy"],
    cons: ["Not as sporty as some rivals", "Interior materials could be better"],
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
    pros: ["Engaging handling", "Spacious interior", "Refined powertrain"],
    cons: ["Road noise at highway speeds", "Some find CVT operation unnatural"],
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
    pros: ["Instant acceleration", "Innovative tech features", "Low operating costs"],
    cons: ["Limited service centers", "Build quality concerns"],
    imageUrl: "https://via.placeholder.com/300?text=Tesla+Model+3"
  },
  // Add more cars here
};

// Helper function to get car information 
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

// API endpoint for chat
app.post('/api/chat', upload.single('image'), async (req, res) => {
  try {
    const { message } = req.body;
    const imageFile = req.file;
    let imageUrl = null;
    
    if (!message) {
      return res.status(400).json({ error: 'No message provided' });
    }
    
    // Store image URL if one was uploaded
    if (imageFile) {
      // In production, you would store this in cloud storage
      // For demo, we'll just use the local path
      imageUrl = `${req.protocol}://${req.get('host')}/uploads/${imageFile.filename}`;
    }
    
    // Process images or specific car questions locally if possible
    // This reduces API calls to Claude for common queries
    
    // Process direct car queries locally
    const carInfo = lookupCarInfo(message);
    if (carInfo) {
      let response = `Here's information about the ${carInfo.name}:\n\n`;
      response += `Starting at $${carInfo.price.toLocaleString()}\n\n`;
      
      response += `Key Specs:\n`;
      for (const [key, value] of Object.entries(carInfo.specs)) {
        response += `• ${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}\n`;
      }
      
      response += `\nKey Features:\n`;
      carInfo.features.forEach(feature => {
        response += `• ${feature}\n`;
      });
      
      response += `\nPros:\n`;
      carInfo.pros.forEach(pro => {
        response += `• ${pro}\n`;
      });
      
      response += `\nCons:\n`;
      carInfo.cons.forEach(con => {
        response += `• ${con}\n`;
      });
      
      return res.json({
        text: response,
        imageUrl: carInfo.imageUrl
      });
    }
    
    // Handle car comparison queries locally
    if (message.toLowerCase().includes("compare") || 
        message.toLowerCase().includes(" vs ") || 
        message.toLowerCase().includes("versus")) {
      
      const cars = [];
      
      for (const carKey in carDatabase) {
        if (message.toLowerCase().includes(carKey)) {
          cars.push(carDatabase[carKey]);
        }
      }
      
      if (cars.length >= 2) {
        let response = `Here's a comparison between ${cars[0].name} and ${cars[1].name}:\n\n`;
        
        response += `Price:\n`;
        response += `• ${cars[0].name}: $${cars[0].price.toLocaleString()}\n`;
        response += `• ${cars[1].name}: $${cars[1].price.toLocaleString()}\n\n`;
        
        response += `Performance:\n`;
        response += `• ${cars[0].name}: ${cars[0].specs.horsepower} hp, ${cars[0].specs.mpg || cars[0].specs.range}\n`;
        response += `• ${cars[1].name}: ${cars[1].specs.horsepower} hp, ${cars[1].specs.mpg || cars[1].specs.range}\n\n`;
        
        // Add more comparison points
        
        return res.json({
          text: response
        });
      }
    }
    
    // If image was uploaded but no car detected, we'll use Claude to help identify
    if (imageUrl) {
      // In a real app, you might use a computer vision API to detect the car
      // For demo purposes, we'll use Claude to "simulate" car recognition
      const prompt = `I've uploaded an image of a car. Can you help identify what make and model it might be? ${message}`;
      
      // Call Claude API with the image context
      const completion = await anthropic.messages.create({
        model: "claude-3-opus-20240229",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt
              }
            ]
          }
        ],
        system: "You are AutoAssist, a helpful car assistant. You provide information about cars, their features, prices, and specifications. Keep responses concise, informative, and focused on helping customers find the right car. If you don't know something specific about a car, be honest and suggest where they might find that information."
      });
      
      return res.json({
        text: completion.content[0].text,
        imageUrl: null
      });
    }
    
    // For all other queries, use Claude API
    const completion = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: message
        }
      ],
      system: "You are AutoAssist, a helpful car assistant. You provide information about cars, their features, prices, and specifications. Keep responses concise, informative, and focused on helping customers find the right car. If you don't know something specific about a car, be honest and suggest where they might find that information. Here's some specific information about 2025 car models that you know:\n\n- The Toyota Camry starts at $26,220 and is known for reliability and good fuel economy.\n- The Honda Accord starts at $27,895 and is praised for handling and interior space.\n- The Tesla Model 3 starts at $38,990 with around 272 miles of range.\n- The Ford F-150 starts at $34,585 and is the best-selling truck in America.\n- The Hyundai Tucson starts at $27,250 and offers good value with many standard features."
    });
    
    return res.json({
      text: completion.content[0].text,
      imageUrl: null
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'An error occurred processing your request',
      details: error.message 
    });
  }
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});