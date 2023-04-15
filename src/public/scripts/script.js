
const imageContainer = document.getElementById('image-container');
const columnOne = document.getElementById('column-1');
const columnTwo = document.getElementById('column-2');
const loader = document.getElementById('loader');

const apiUrl = `${window.origin}/api`;

let loadMore = false;
let imagesLoaded = 0;
let totalImages = 0;


// on load
window.addEventListener('load', () => {
    getImages();
})


window.addEventListener('scroll', () => {
    if (window.scrollY + window.innerHeight - document.body.offsetHeight > 0 && loadMore) {
        loadMore = false; // stopped multiple request 
        getImages();
    };
})


async function getImages() {
    loading();
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (response.status !== 200) {
            throw new Error(`${data.err} status: ${response.status}`);
        }
        
        const images = JSON.parse(data);
        totalImages += images.length;
        displayImages(images);
    }
    catch (e) {
        console.error(e);
        const errorMessage = document.createElement('p');
        errorMessage.classList.add('error-message');
        errorMessage.innerText = e;
        imageContainer.appendChild(errorMessage);
    }
}


function displayImages(imageArray) {
    contentLoaded();
    for (let i = 0; i < imageArray.length; i++) {
        const item = document.createElement('a');
        const img = document.createElement('img');

        setAttributes(item, {
            href: imageArray[i].links.html,
            target: "_blank",
            class: 'image-link'
        })

        setAttributes(img, {
            src: imageArray[i].urls.regular,
            alt: imageArray[i].alt_description,
            title: imageArray[i].alt_description
        })

        // Event listener, check if the image has loaded 
        img.addEventListener('load', imageLoaded);

        item.appendChild(img);
        // Based on index even or odd appending the item for 2 column layout
        i % 2 === 0 ? columnOne.appendChild(item) : columnTwo.appendChild(item);
    }
}

function imageLoaded() {
    imagesLoaded++;

    // if last image has been loaded load more images
    if (imagesLoaded === totalImages) {
        loadMore = true;
    }
}

/* Helpers */

function setAttributes(element, attributes) {

    for (const key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
}

// loading animation
function loading() {
    loader.style.display = 'flex';
}

function contentLoaded() {
    loader.style.display = 'none';
}