const form = document.getElementById('parameter-form');
const nextStepButton = document.getElementById('next-step');
const visualizationDiv = document.getElementById('visualization');

let currentStep = 0;
let algorithmParams = {};

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const crossover = parseFloat(document.getElementById('crossover-probability').value);
  const mutation = parseFloat(document.getElementById('mutation-probability').value);
  const initialPoint = Number(document.getElementById('initial-point').value);

  algorithmParams = { crossover_prob: crossover, mutation_prob: mutation, initial_point: initialPoint };
  currentStep = 0;

  try {
    const response = await fetch('http://127.0.0.1:8000/initialize',
        {
            method: 'POST',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify(algorithmParams),
        }
    );
    const data = await response.json();
    console.log('Server response:', data); // 서버 응답 디버깅
    console.log('Sending data:', JSON.stringify(algorithmParams));

    visualizationDiv.innerHTML = `
      <p>${data.message}</p>
      <p>Population: ${data.population}</p>
      <p>Crossover Probability: ${data.crossover_prob}</p>
      <p>Mutation Probability: ${data.mutation_prob}</p>
    `;
    nextStepButton.disabled = false;
  }
  catch(error) {
    console.error('Error:', error);
    visualizationDiv.innerHTML = '<p>Error occurred while initializing.</p>';
  }

//   visualizationDiv.innerHTML = '<p>Starting algorithm...</p>';
});

nextStepButton.addEventListener('click', async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/step', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...algorithmParams, current_step: currentStep }),
    });
    const data = await response.json();
    currentStep = data.step;

    // Update visualization
    visualizationDiv.innerHTML = `
      <p>Step: ${data.step}</p>
      <p>Point: (${data.point[0].toFixed(2)}, ${data.point[1].toFixed(2)})</p>
      <p>Loss: ${data.loss.toFixed(2)}</p>
    `;
  } catch (error) {
    console.error('Error:', error);
    visualizationDiv.innerHTML = '<p>Error occurred while processing.</p>';
  }
});
