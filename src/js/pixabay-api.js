import axios from 'axios';

const API_KEY = '46206766-d6f3ed66bf4f64987a1edf465';
const BASE_URL = 'https://pixabay.com/api/';

export async function fetchImages(query, page = 1, perPage = 15) { 
  const pageNum = Number(page);
  const perPageNum = Number(perPage);

  const url = `${BASE_URL}?key=${API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&orientation=horizontal&safesearch=true&page=${pageNum}&per_page=${perPageNum}`;

  try {
    const response = await axios.get(url);
    
    console.log('Response data:', response.data); 

    return response.data;
  } catch (error) {
    console.error('Fetching images failed:', error);
    throw error; 
  }
}