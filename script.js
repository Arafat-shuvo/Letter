async function fetchCorpus() {
  const response = await fetch('corpus.json');
  return await response.json();
}

async function generateLetter() {
  const type = document.getElementById('letterType').value;
  const userInput = document.getElementById('userInput').value;
  const output = document.getElementById('output');

  // Step 1: Retrieve relevant samples (RAG part)
  const corpus = await fetchCorpus();
  const relevantDocs = corpus.filter(doc => doc.type === type);
  const context = relevantDocs.map(doc => doc.content).join("\n---\n");

  // Step 2: Generate prompt
  const prompt = `
You are a professional letter writer. Use the following examples to write a new ${type} letter.

Examples:
${context}

Instructions from user:
${userInput}

Write the new letter below:
`;

  // Step 3: Call OpenAI API (replace with your key)
  const apiKey = 'YOUR_OPENAI_API_KEY';
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    })
  });

  const data = await response.json();
  const generatedLetter = data.choices[0].message.content;
  output.textContent = generatedLetter;
}
