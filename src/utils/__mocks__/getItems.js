import mockData from './mockData';

function getItems() {
  return new Promise(resolve => setTimeout(() => resolve(mockData), 1500));
}

export default getItems;
