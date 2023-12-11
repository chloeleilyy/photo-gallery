document.addEventListener('DOMContentLoaded', function () {
    // setup login.
    const savedUsername = localStorage.getItem('username');
    const uploadModal = document.getElementById('uploadModal');
    const btnOpenModal = document.getElementById('uploadButton');
    const btnCloseModal = document.querySelector('.close-button');
    // const btnSubmitUpload = document.getElementById('submitUpload');

    if (savedUsername) {
        showGallery(savedUsername);
    } else {
        setupLogin();
    }
    // upload modal
    btnOpenModal.onclick = function () {
        uploadModal.style.display = "block";
    }
    btnCloseModal.onclick = function () {
        uploadModal.style.display = "none";
    }
    // 当用户点击模态框外部时关闭它
    window.onclick = function (event) {
        if (event.target == uploadModal) {
            uploadModal.style.display = "none";
        }
    }

    uploadImage();
    getImages();
    getTopics();
    
    setupToggleView();
    setupSearch();
});

// login
function setupLogin() {
    const loginButton = document.getElementById('loginButton');
    const usernameInput = document.getElementById('usernameInput');

    loginButton.addEventListener('click', function () {
        const username = usernameInput.value.trim();
        if (username) {
            localStorage.setItem('username', username);
            showGallery(username);
        } else {
            alert('Please enter a username.');
        }
    });
}

function showGallery(username) {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('galleryContainer').style.display = 'block';
    document.getElementById('userContainer').style.display = 'block';
    document.getElementById('usernameDisplay').textContent = 'Hello, ' + username;
    setupLogout();
}

function setupLogout() {
    const logoutButton = document.getElementById('logoutButton');
    logoutButton.addEventListener('click', function () {
        localStorage.removeItem('username');
        window.location.reload(); // 重新加载页面
    });
}


function setupToggleView() {
    const toggleButton = document.getElementById('toggleView');
    const gallery = document.getElementById('gallery');

    toggleButton.addEventListener('click', function () {
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

    searchBox.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            // event.preventDefault();
            const searchTerm = searchBox.value.toLowerCase();
            filterImagesByTopic(searchTerm);
        }
    });

    searchButton.addEventListener('click', function () {
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

// check if the user wants to enter a new topic.
function checkForNewTopic(select) {
    const newTopicInput = document.getElementById('newTopicInput');
    if (select.value === "newTopic") {
        newTopicInput.style.display = '';
    } else {
        newTopicInput.style.display = 'none';
    }
}



