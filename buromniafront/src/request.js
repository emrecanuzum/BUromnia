import axios from 'axios';

export async function getUrl() {
  try {
    const response = await axios.get('http://localhost:1453/token');
    return response.data;
  } catch (error) {
    console.error(error);
  }
}