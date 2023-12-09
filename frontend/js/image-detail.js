document.addEventListener('DOMContentLoaded', function () {
    const imageData = JSON.parse(localStorage.getItem('imageDetail'));
    if (imageData) {
        // get the original image url.
        updated_image_url = imageData.image_url.replace('/thumbnail/', '/original/')
        document.getElementById('detailImage').src = updated_image_url;
        document.getElementById('imageInfo').innerHTML = `
            <strong>Username:</strong> ${imageData.username}<br>
            <strong>Topic:</strong> ${imageData.topic}<br>
            <strong>Timestamp:</strong> ${imageData.timestamp}`;
    }
});
