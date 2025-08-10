
import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;

app.set('view engine', 'ejs');
app.use(express.static("public"));

app.get('/', (req, res) => {
  res.render('index');
});


// Helper functions
const getClothingAdvice = (temp) => {
  if (temp > 30) return "Light clothing, shorts and t-shirt";
  if (temp > 20) return "T-shirt with light jacket";
  if (temp > 10) return "Sweater or jacket";
  if (temp > 0) return "Winter coat with layers";
  return "Heavy winter coat, gloves, and hat";
};

const getTimeAdvice = (description) => {
  if (description.includes('rain')) return "Best to stay indoors";
  if (description.includes('sun')) return "Perfect for outdoor activities";
  if (description.includes('cloud')) return "Good for walks";
  return "Any time is fine";
};

// Routes
app.get('/weather', async (req, res) => {
  const city = req.query.city;

  if (!city) {
    return res.render('error', { message: 'Please enter a city name!' });
  }

  try {
    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric'
      }
    });

    console.log("API Response:", response.data); // Add this line
    
    console.log("City name in API response:", response.data.name);

    const weather = {
      city: response.data.name,
      temp: response.data.main.temp,
      description: response.data.weather[0].description,
      icon: `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    };

    res.render('result', { 
      weather,
      getClothingAdvice,
      getTimeAdvice
    });

  } catch (error) {
    console.error("Error fetching weather:", error);
    const funnyMessages = [
      "Our weather hamsters are on strike!",
      "404: City not found in our cloud database!",
      "Even meteorologists need coffee breaks!",
      "The forecast is forecasting an error!"
    ];
    const randomMessage = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
    
    res.render('error', { 
      message: 'Could not fetch weather. ' + randomMessage 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});