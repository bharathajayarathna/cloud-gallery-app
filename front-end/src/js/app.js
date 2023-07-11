import { saveAs } from 'file-saver';

const overlay = $("#overlay");
const btnUpload = $("#btn-upload");
const dropZoneElm = $("#drop-zone");
const mainElm = $("main");
const REST_API_URL = `http://localhost:8080/gallery`;
const cssLoaderHtml = `<div class="lds-facebook"><div></div><div></div><div></div></div>`;
const btnDelete = $(".btn-delete")

loadAllImages();

btnUpload.on('click', () => overlay.removeClass('d-none'));
overlay.on('click', (evt) => {
    if (evt.target === overlay[0]) overlay.addClass('d-none');
});
$(document).on('keydown', (evt) => {
    if (evt.key === 'Escape' && !overlay.hasClass('d-none')) {
        overlay.addClass('d-none');
    }
});
overlay.on('dragover', (evt) => evt.preventDefault());
overlay.on('drop', (evt) => evt.preventDefault());
dropZoneElm.on('dragover', (evt) => {
    evt.preventDefault();
});
dropZoneElm.on('drop', (evt) => {
    evt.preventDefault();
    const droppedFiles = evt.originalEvent
        .dataTransfer.files;
    const imageFiles = Array.from(droppedFiles)
        .filter(file => file.type.startsWith("image/"));
    if (!imageFiles.length) return;
    overlay.addClass("d-none");
    uploadImages(imageFiles);
});
mainElm.on('click', '.image:not(.loader)', (evt)=> {
    if ($(evt.target).hasClass('image')) {
        evt.target.requestFullscreen();
    }
});

mainElm.on('click', (evt)=> {
    if((evt?.target.classList.contains("btn-download"))){
        const downUrl = $(evt.target).parents('div').css('background-image').replace('url("', '').replace('")', '');
        const imageName = downUrl.replace(`${REST_API_URL}/images/`, "");
        saveAs(downUrl, imageName);
    }
});

function uploadImages(imageFiles){
    const formData = new FormData();
    imageFiles.forEach(imageFile => {
        const divElm = $(`<div class="image loader"></div>`);
        divElm.append(cssLoaderHtml);
        mainElm.append(divElm);

        formData.append("images", imageFile);
    });
    const jqxhr = $.ajax(`${REST_API_URL}/images`, {
        method: 'POST',
        data: formData,
        contentType: false,
        processData: false
    });

    jqxhr.done((imageUrlList)=> {
        console.log(imageUrlList);
        imageUrlList.forEach(imageUrl => {
            const divElm = $(".image.loader").first();
            divElm.css('background-image', `url('${imageUrl}')`);
            divElm.removeClass('loader');
            const btnElm = $(`<div class="image d-flex justify-content-end align-items-end ">
                                    <button class="btn-download z-3 d-none m-3" style="background-color: rgba(128,128,128,0.4)">
                                        <svg  xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-download btn-download" viewBox="0 0 16 16">
                                          <path class="btn-download" d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                                          <path class="btn-download" d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                                        </svg>
                                    </button>
                               </button>`);
            divElm.append(btnElm);
        });
    });
    jqxhr.always(()=> $(".image.loader").remove());
}

function loadAllImages() {
    const jqxhr = $.ajax(`${REST_API_URL}/images`);
    jqxhr.done((imageUrlList) => {
        imageUrlList.forEach(imageUrl => {
            const divElm = $(`<div class="image d-flex justify-content-end align-items-start ">
                                    <button class="btn-download z-3 d-none m-3" style="background-color: rgba(128,128,128,0.4)">
                                        <svg  xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-download btn-download" viewBox="0 0 16 16">
                                          <path class="btn-download" d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                                          <path class="btn-download" d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                                        </svg>
                                    </button>
                               </button>`);
            divElm.css('background-image', `url(${imageUrl})`);
            mainElm.append(divElm);
        });
    });
    jqxhr.fail(() => {
    });
}