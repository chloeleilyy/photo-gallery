document.addEventListener('DOMContentLoaded', function() {
    loadImages();
    setupToggleView();
    setupSearch();
    // setupUpload(); // 如果你计划实现上传功能，可以添加这行代码
});

function loadImages() {
    const gallery = document.getElementById('gallery');

    const images = [
        { url: 'https://th.bing.com/th/id/OIP.HOGkv77hC306cbdcYR7x8QHaFm?rs=1&pid=ImgDetMain', username: 'User1', topic: 'Nature', timestamp: '2023-12-07 12:00' },
        { url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaMeK_cr7_TH_olPqXaKOymih3YDd_ZYTK9g&usqp=CAU', username: 'User2', topic: 'City', timestamp: '2023-12-07 13:00' },
        { url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBJaMN1rNkeV8vdicADn7NpDU-SpLtOR53Yg&usqp=CAU', username: 'User2', topic: 'City', timestamp: '2023-12-07 13:00' }
        // ... 更多图片 ...
    ];

    images.forEach(image => {
        const imgContainer = document.createElement('div');
        imgContainer.classList.add('gallery-item');
        imgContainer.addEventListener('click', function() {
            showImageDetail(image);
        });

        const img = document.createElement('img');
        img.src = image.url;
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
}

function showImageDetail(imageData) {
    localStorage.setItem('imageDetail', JSON.stringify(imageData));
    window.location.href = 'image-detail.html';
}

function setupToggleView() {
    const toggleButton = document.getElementById('toggleView');
    const gallery = document.getElementById('gallery');

    toggleButton.addEventListener('click', function() {
        if (gallery.classList.contains('list-view')) {
            gallery.classList.remove('list-view');
            gallery.classList.add('gallery-view');
            toggleButton.textContent = 'Switch to List View';
        } else {
            gallery.classList.remove('gallery-view');
            gallery.classList.add('list-view');
            toggleButton.textContent = 'Switch to Gallery View';
        }
    });
}


function setupSearch() {
    const searchButton = document.getElementById('searchButton');
    const searchBox = document.getElementById('searchBox');

    searchButton.addEventListener('click', function() {
        const searchTerm = searchBox.value.toLowerCase();
        filterImagesByTopic(searchTerm);
    });
}

function filterImagesByTopic(topic) {
    const gallery = document.getElementById('gallery');
    const images = gallery.getElementsByClassName('gallery-item');

    for (let i = 0; i < images.length; i++) {
        const item = images[i];
        const topicText = item.getElementsByClassName('gallery-info')[0].textContent.toLowerCase();
        if (topicText.includes(topic)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    }
}

// function setupUpload() {
//     // 如果你计划实现上传功能，可以在这里添加逻辑
// }
