// get images from the server.
function getImages() {
    const gallery = document.getElementById('gallery');

    fetch('https://myxv2esyw5.execute-api.us-east-2.amazonaws.com/get_images')
        .then(response => response.json())
        .then(images => {
            images.forEach(image => {
                const imgContainer = document.createElement('div');
                imgContainer.classList.add('gallery-item');
                imgContainer.addEventListener('click', function () {
                    showImageDetail(image);
                });

                const img = document.createElement('img');
                img.src = image.image_url;
                img.classList.add('gallery-img');
                imgContainer.appendChild(img);

                const info = document.createElement('div');
                info.classList.add('gallery-info');
                info.innerHTML = `<strong>Username:</strong> ${image.username}<br>
                                  <strong>Topic:</strong> ${image.topic}<br>
                                  <strong>Timestamp:</strong> ${image.timestamp}`;
                imgContainer.appendChild(info);

                gallery.appendChild(imgContainer);
            });
        })
        .catch(error => {
            console.error('Error fetching images:', error);
        });
}


// upload image and metadata to the server.
function uploadImage() {
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
        // TODO: change timestamp to be the local time zone.
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
