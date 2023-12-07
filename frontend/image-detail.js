document.addEventListener('DOMContentLoaded', function () {
    const imageData = JSON.parse(localStorage.getItem('imageDetail'));
    if (imageData) {
        document.getElementById('detailImage').src = imageData.url;
        document.getElementById('imageInfo').innerHTML = `
            <strong>Username:</strong> ${imageData.username}<br>
            <strong>Topic:</strong> ${imageData.topic}<br>
            <strong>Timestamp:</strong> ${imageData.timestamp}`;
    }
});
