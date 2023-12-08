// API.
function setupUpload() {
    const uploadButton = document.getElementById('uploadButton');
    uploadButton.addEventListener('click', function () {
        const fileInput = document.getElementById('fileUpload');
        if (fileInput.files.length === 0) {
            console.log('No file selected.');
            return;
        }
        const file = fileInput.files[0];
        const formData = new FormData();
        formData.append('filename', file.name);
        formData.append('file', file);
        fetch('https://myxv2esyw5.execute-api.us-east-2.amazonaws.com/upload_image', {
            method: 'POST',
            body: formData
        }).then(response => {
            if (response.ok) {
                return response.json(); // Parsing response body as JSON
            }
            throw new Error('Network response was not ok.');
        }).then(data => {
            console.log('File uploaded successfully.');
            console.log('Response from Lambda:', data); // Outputting data from Lambda
        }).catch(err => console.log(err));
    });
}