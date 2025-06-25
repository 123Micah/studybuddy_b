// testHf.js
require('dotenv').config();
const { InferenceClient } = require('@huggingface/inference');

const token = process.env.HF_TOKEN;
console.log('HF_TOKEN type:', typeof token, token?.slice(0,6)+'...');

if (!token || typeof token !== 'string') {
  console.error('❌ HF_TOKEN missing or not a string');
  process.exit(1);
}

const client = new InferenceClient(token);
console.log('✅ InferenceClient initialized');

(async () => {
  try {
    console.log('🔄 Testing summarization with supported model...');
    const result = await client.summarization({
      model: 'facebook/bart-large-cnn',
      provider: 'hf-inference',
      inputs: 'Paris is the capital of France and is known for its art, gastronomy, and culture.'
    });
    console.log('✅ Summary:', result);
  } catch (err) {
    console.error('❌ Error in summarization:', err);
  }
})();
