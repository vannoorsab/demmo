document.getElementById('studentForm').addEventListener('submit', function(event) {
    event.preventDefault(); 
    console.log("Form submitted!"); 

    const formData = {
        name: document.getElementById('name').value,
        batch: document.getElementById('batch').value,
        academic: parseFloat(document.getElementById('academic').value),
        core_courses: parseFloat(document.getElementById('core_courses').value),
        hackathons: parseInt(document.getElementById('hackathons').value),
        papers: parseInt(document.getElementById('papers').value),
        contributions: parseInt(document.getElementById('contributions').value)
    };

    console.log("Form Data:", formData); 

    fetch('/submit', {  
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        document.getElementById('predictedScore').innerText = `Predicted Score: ${data.predicted_score}`;
    })
    .catch(error => console.error('Error:', error));
});