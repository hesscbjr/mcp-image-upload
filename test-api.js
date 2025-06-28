import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

async function testImgurAPI() {
  console.log('Testing Imgur API with Client ID:', process.env.IMGUR_CLIENT_ID);
  
  try {
    // Test API endpoint to check credits
    const response = await axios.get('https://api.imgur.com/3/credits', {
      headers: {
        'Authorization': `Client-ID ${process.env.IMGUR_CLIENT_ID}`
      }
    });
    
    console.log('API Response:', response.data);
    
    if (response.headers) {
      console.log('\nRate Limit Headers:');
      console.log('X-RateLimit-UserLimit:', response.headers['x-ratelimit-userlimit']);
      console.log('X-RateLimit-UserRemaining:', response.headers['x-ratelimit-userremaining']);
      console.log('X-RateLimit-UserReset:', response.headers['x-ratelimit-userreset']);
      console.log('X-RateLimit-ClientLimit:', response.headers['x-ratelimit-clientlimit']);
      console.log('X-RateLimit-ClientRemaining:', response.headers['x-ratelimit-clientremaining']);
      
      if (response.headers['x-ratelimit-userreset']) {
        const resetTime = new Date(response.headers['x-ratelimit-userreset'] * 1000);
        console.log('Reset Time:', resetTime.toLocaleString());
      }
    }
  } catch (error) {
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.statusText);
      console.error('Error Data:', error.response.data);
      
      if (error.response.headers) {
        console.log('\nRate Limit Headers from Error:');
        console.log('X-RateLimit-UserRemaining:', error.response.headers['x-ratelimit-userremaining']);
        console.log('X-RateLimit-ClientRemaining:', error.response.headers['x-ratelimit-clientremaining']);
      }
    } else {
      console.error('Error:', error.message);
    }
  }
}

testImgurAPI();