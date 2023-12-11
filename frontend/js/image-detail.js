document.addEventListener('DOMContentLoaded', function () {
    deleteImage();
});

document.addEventListener('DOMContentLoaded', function () {
    const imageData = JSON.parse(localStorage.getItem('imageDetail'));
    if (imageData) {
        // const utcTime = new Date(imageData.timestamp);
        // const nyTimeZone = new Intl.DateTimeFormat('en-US', {
        //     timeZone: 'America/New_York',
        //     year: 'numeric',
        //     month: '2-digit',
        //     day: '2-digit',
        //     hour: '2-digit',
        //     minute: '2-digit'
        // });
        // const nyLocalTime = nyTimeZone.format(utcTime);
        // get the original image url.
        updated_image_url = imageData.image_url.replace('/thumbnail/', '/original/')
        document.getElementById('detailImage').src = updated_image_url;
        document.getElementById('imageInfo').innerHTML = `
            <strong>Topic:</strong> ${imageData.topic} 
            <strong>  User:</strong> ${imageData.username} 
            <strong>  </strong> [ ${imageData.timestamp} ]`;
    }
});

// delete image from the server.
function deleteImage() {
    const deleteImageBtn = document.getElementById('deleteImageBtn');

    deleteImageBtn.addEventListener('click', function () {
        const imageData = JSON.parse(localStorage.getItem('imageDetail'));

        if (imageData && imageData.image_url) {
            const s3_object_key = imageData.image_url.split('/').pop();
            const requestData = { s3_object_key };

            fetch('https://myxv2esyw5.execute-api.us-east-2.amazonaws.com/delete_image', {
                method: 'DELETE',
                body: JSON.stringify(requestData)
            })
                .then(response => {
                    if (response.status === 204) {
                        alert('Image deleted successfully.');
                        window.location.href = 'index.html';
                        console.log('Image deleted successfully.');
                    } else {
                        alert('Failed to delete image.');
                        console.error('Failed to delete image.');
                    }
                })
                .catch(error => {
                    console.error('Error deleting image:', error);
                });
        }
    });
}