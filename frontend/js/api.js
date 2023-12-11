function compressImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = event => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // 设置固定宽度为128像素
                const thumbnailWidth = 128;
                // 按原始图像的宽高比计算新高度
                const scale = thumbnailWidth / img.width;
                const thumbnailHeight = img.height * scale;

                canvas.width = thumbnailWidth;
                canvas.height = thumbnailHeight;

                // 在画布上绘制按比例缩放的图像
                ctx.drawImage(img, 0, 0, thumbnailWidth, thumbnailHeight);
                canvas.toBlob(blob => {
                    resolve(blob);
                }, file.type, 0.7);
            };
            img.src = event.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}



// upload image and metadata to the server.
function uploadImage() {
    const btnSubmitUpload = document.getElementById('submitUpload');
    btnSubmitUpload.addEventListener('click', async function () {
        const fileInput = document.getElementById('modalFileUpload');
        const topicSelect = document.getElementById('topicSelect');
        const newTopicInput = document.getElementById('newTopicInput');

        if (fileInput.files.length === 0) {
            alert('Please upload an image.');
            console.log('No file selected.');
            return;
        }
        const image = fileInput.files[0];

        let topic = topicSelect.value;
        if (topic === "newTopic") {
            topic = newTopicInput.value; // Get value from new topic input
        }
        if (!topic) {
            alert('Please choose/enter a topic.');
            console.log('No topic entered.');
            return;
        }

        const username = localStorage.getItem('username');
        if (!username) {
            console.log('Username not found.');
            return;
        }
        // TODO: change timestamp to be the local time zone.
        // const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);

        // 获取当前时间的Date对象
        const currentTimestamp = new Date();
        // 创建纽约时区的DateTimeFormat对象
        const nyTimeZone = new Intl.DateTimeFormat('en-US', {
            timeZone: 'America/New_York',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
        // 使用DateTimeFormat对象将当前时间转换为纽约时区的本地时间
        const timestamp = nyTimeZone.format(currentTimestamp);

        const formData = new FormData();

        try {
            const thumbnailImage = await compressImage(image);
            formData.append('thumbnail', thumbnailImage);
        } catch (error) {
            console.error('Error compressing image:', error);
        }

        formData.append('filename', image.name);
        formData.append('image', image);

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
            alert('Error uploading image!');
            throw new Error('Error uploading image');
        }).then(data => {
            console.log('Image uploaded successfully. Response from Lambda: ' + data);
            alert('Image uploaded successfully!');
            window.location.reload();
        }).catch(err => console.log(err));

        // Close the modal after upload
        document.getElementById('uploadModal').style.display = "none";
        // window.location.reload();
    });
}

// get images from the server.
function getImages() {
    const gallery = document.getElementById('gallery');

    fetch('https://myxv2esyw5.execute-api.us-east-2.amazonaws.com/get_images')
        .then(response => response.json())
        .then(images => {
            // console.log(images);
            images.sort((a, b) => {
                const dateA = new Date(a.timestamp);
                // console.log("dateA:", dateA);
                const dateB = new Date(b.timestamp);
                // console.log("dateB:", dateA);
                return dateB - dateA;
              });
            // console.log(images);
            images.forEach(image => {
                const imgContainer = document.createElement('div');
                imgContainer.classList.add('gallery-item');
                imgContainer.addEventListener('click', function () {
                    showOriginalImage(image);
                });

                const img = document.createElement('img');
                img.src = image.image_url;
                img.classList.add('gallery-img');
                imgContainer.appendChild(img);

                const info = document.createElement('div');
                info.classList.add('gallery-info');
                info.innerHTML = `
                    <strong>Topic:</strong> ${image.topic}<br>
                    <strong>User:</strong> ${image.username}<br>
                    <strong></strong> ${image.timestamp}`;
                imgContainer.appendChild(info);

                gallery.appendChild(imgContainer);
            });
        })
        .catch(error => {
            console.error('Error fetching images:', error);
        });
}

function showOriginalImage(imageData) {
    localStorage.setItem('imageDetail', JSON.stringify(imageData));
    window.location.href = 'image-detail.html';
}

// get topics from the server.
function getTopics() {
    const topicSelect = document.getElementById('topicSelect');

    fetch('https://myxv2esyw5.execute-api.us-east-2.amazonaws.com/get_topics')
        .then(response => {
            // Check if the response is successful
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.topicList && data.topicList.length > 0) {
                data.topicList.forEach(topic => {
                    const option = document.createElement('option');
                    option.value = topic;
                    option.textContent = topic;
                    topicSelect.appendChild(option);
                });
            } else {
                // Handle cases where topicList might be empty or not present
                console.error('No topics found or topicList is missing in the response');
            }
        })
        .catch(error => {
            console.error('Error fetching topics:', error);
        });
}

// function getTopicSearchResult() {
//     const searchBtn = document.getElementById('searchButton');
//     searchBtn.addEventListener('click', function () {
//         const topic = document.getElementById('searchBox').value;
//         if (topic) {
//             fetch(`https://myxv2esyw5.execute-api.us-east-2.amazonaws.com/topic_search_result?topic=${encodeURIComponent(topic)}`)
//                 .then(response => response.json())
//                 .then(images => {
//                     console.log(images);
//                 })
//                 .catch(error => {
//                     console.error('Error fetching images:', error);
//                 });
//         } else {
//             alert("Please enter a topic to search.");
//         }
//     });
// }