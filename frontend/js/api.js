// upload image and metadata.
function setupUpload() {
    const btnSubmitUpload = document.getElementById('submitUpload');
    btnSubmitUpload.addEventListener('click', function () {
        const fileInput = document.getElementById('modalFileUpload');
        const topicInput = document.getElementById('topicInput');

        if (fileInput.files.length === 0) {
            console.log('No file selected.');
            return;
        }
        const file = fileInput.files[0];
        const topic = topicInput.value.trim();
        if (!topic) {
            console.log('No topic entered.');
            return;
        }
        const username = localStorage.getItem('username');
        if (!username) {
            console.log('Username not found.');
            return;
        }
        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);

        const formData = new FormData();
        formData.append('filename', file.name);
        formData.append('file', file);
        formData.append('username', username);
        formData.append('topic', topic);
        formData.append('timestamp', timestamp);

        fetch('https://myxv2esyw5.execute-api.us-east-2.amazonaws.com/upload_image', {
            method: 'POST',
            body: formData
        }).then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok.');
        }).then(data => {
            console.log('File uploaded successfully.');
            console.log('Response from Lambda:', data);
        }).catch(err => console.log(err));

        // Close the modal after upload
        document.getElementById('uploadModal').style.display = "none";
    });
}
