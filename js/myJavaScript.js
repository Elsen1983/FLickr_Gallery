
window.addEventListener("load", init);

let buttonsArray = ["Ivan Aivazovsky", "Henry Pether", "Robin Jacques"];

var loader = new Image();
loader.src="img/loaderGif.gif";

var image;
var counter = 10;
var photosArrayLength;
let currentImage = null;

//var imageObject;

function init() {

    createButtons();

    //when localStorage lastRequest isn't empty --> done a search earlier
    if (localStorage.getItem("pressedButton")!== null) {

        //last pressed button value from localStorage
        let buttonName = localStorage.getItem("pressedButton");
        console.log("Stored search tag was: " + buttonName);
        getPhotos(buttonName);

    }
    ///when localStorage lastRequest is empty --> wasn't any search earlier
    else {
        console.log("Empty localStorage");
    }

}


function createButtons(){

    const buttonNav = document.getElementById("buttons_Nav");

    //open a new div
    let holderDiv = document.createElement("div");
    holderDiv.id="buttonsHolder_Div";



    //add buttons into html from array by loop
    for(let i = 0; i < buttonsArray.length; i++)
    {
        let nameBtn = buttonsArray[i];

        let newButton = document.createElement("input");
        newButton.type="button";
        newButton.id = nameBtn;
        newButton.className = "generatedButtons";
        newButton.value = nameBtn;
        newButton.onclick = function(){
            console.log("Value of the pressed button: " + nameBtn);

            //clear the img area if there are any other tag as last search result (images)
            //select the image holder div
            let imageHolder = document.getElementById("imagesArea_Div");
            //and remove every element from that until there is any element
            while (imageHolder.hasChildNodes()) {
                imageHolder.removeChild(imageHolder.firstChild);
            }

            //now gets the photos
            getPhotos(nameBtn);
        };

        holderDiv.appendChild(newButton);
    }

    buttonNav.appendChild(holderDiv);

}


function getPhotos(buttonName) {

    let loadDiv = document.getElementById("loadingDiv");
    loadDiv.style.display="none";

    let script = document.createElement('script');

    let request = "https://www.flickr.com/services/rest/?";
    request += "method=flickr.photos.search";
    //maximum 100 image
    request += "&per_page=100";
    //my key = 22303ae620835b04e5c55988c44ed6d3
    request += "&api_key=" + "22303ae620835b04e5c55988c44ed6d3";

    request += "&tags=" + buttonName;
    request += "&format=json";
    request += "&tag_mode=all";

    //LOCALStorage
    localStorage.setItem("pressedButton", buttonName);
    console.log(localStorage);

    script.setAttribute("src", request);

    const head = document.getElementsByTagName('head')[0];

    head.appendChild(script);

}

function jsonFlickrApi(images)
{
    let url;

    for (let i = 0; i < images.photos.photo.length; i++ )
    {
        photosArrayLength = images.photos.photo.length -1;
        console.log("Photos array length: " + photosArrayLength);

        //build up the url with small img
        url = "http://farm" + images.photos.photo[i].farm ;
        url += ".static.flickr.com/" ;
        url += images.photos.photo[i].server + "/";
        url += images.photos.photo[i].id + "_";
        url += images.photos.photo[i].secret;
        let thubnailurl = url + "_s.jpg";
        //url += "_z.jpg";

        //image position in the array of photo
        let imgPosition = i+"_img";

        let newImage = document.createElement("img");
        newImage.className = "imageTag";
        newImage.id = imgPosition;
        newImage.src = "img/loaderGif.gif";
        newImage.dataset.urlbody = url;

        document.getElementById('imagesArea_Div').appendChild(newImage);

        //create a new Image
        let imageObject = new Image();

        //onload on the imgObject
        imageObject.onload = function(){
            let imagediv = document.getElementById("imagesArea_Div");
            let img = imagediv.getElementsByTagName("img")[i];
            img.src = thubnailurl;
        };

        imageObject.src = url + "_s.jpg";

        //get the actual img
        let actualImg = document.getElementById(imgPosition);

        //resource: https://www.codeproject.com/Questions/422485/createElement-set-onclick-function-in-a-loop
        let onclickStr;
        onclickStr = " getModalAndZoomImages('" + imgPosition + "');";
        actualImg.setAttribute("onclick", onclickStr);
        //console.log("Actual image url: " + actualImg.dataset.urlbody);
    }
}

//looks never used but calls as onclick on images (around line 155)
function getModalAndZoomImages(getID){

    let selectedImageID = getID;

    const imageSelected = document.getElementById(selectedImageID);

    //console.log(imageSelected.id);

    //select the main-tag for put the modal into that
    const modalPlace = document.getElementById("mainTag");
    //console.log(url);

    //create modal main
    let modal = document.createElement("div");
    modal.setAttribute("id", "modal");

    //create sub-modal
    let subModal = document.createElement("div");
    subModal.setAttribute("id", "subModal");

    //create image
    image = document.createElement("img");
    image.id = "largeImgVersion";
    image.className = "largeImg";
    image.src = "img/loaderGif.gif";

    onloadFunction(imageSelected.dataset.urlbody +"_z.jpg");

    //CREATE LEFT BUTTON (PREVIOUS)
    let leftBtn = document.createElement("button");
    leftBtn.setAttribute("id", "moveLeft");
    leftBtn.textContent = "<";
    //onclick on left button
    leftBtn.onclick = function(){
        //change the img tag source to the loader gif
        image.src = "img/loaderGif.gif";
        //call moveLeft function
        moveLeft();

    };
    //left btn mousedown
    leftBtn.onmousedown= function() {
        mouseDown("moveLeft");
    };
    //left btn mouseup
    leftBtn.onmouseup=function(){
        mouseUp("moveLeft");
    };

    //create close button
    let closeBtn = document.createElement("button");
    closeBtn.setAttribute("id", "closeBtn");
    closeBtn.textContent = "X";
    closeBtn.onclick = function(){
        modalPlace.removeChild(modalPlace.lastChild);
    };

    //CREATE RIGHT BUTTON (NEXT)
    let rightBtn = document.createElement("button");
    rightBtn.setAttribute("id", "moveRight");
    rightBtn.textContent = ">";
    // onclick on right button
    rightBtn.onclick = function(){
        //change the img tag source to the loader gif
        image.src = "img/loaderGif.gif";
        //call moveRight function
        moveRight();
    };
    //right btn mousedown
    rightBtn.onmousedown= function() {
        mouseDown("moveRight");
    };
    //right btn mouseup
    rightBtn.onmouseup=function(){
        mouseUp("moveRight");
    };


    // ---- ONLOAD-FUNCTION ----
    // for this onload function I let everything here what u show me in the lab
    // but I don't know why it is not working properly (worked in the lab)
    // The problem is maybe the setTimeout function in keyup listener, because until I used keyup and keydown to separate
    // the actions on buttons it worked well (without setTimeout).
    //now it works well sometimes, but still downloading all the image in the background (I mean if I press 10 times then only last one displayed,
    //but just after all other 9 is downloaded in background)
    //var currentImage = null;
    function onloadFunction(prevOrnextImgUrl){

            if (currentImage)
            {
                console.log("removing event handler");
                currentImage.onload = null;
            }

        let imageObject = new Image();

        currentImage = imageObject;

        //onload on the imgObject
        imageObject.onload = (function(url) { return function(){
            image.src = url;
        };})(prevOrnextImgUrl);

        imageObject.src = prevOrnextImgUrl;

    }

    // ---- MOVE TO LEFT FUNCTION ----
    function moveLeft(){
        //previous image id -> parse to integer (img3 to 3) and -1
        let lastImgIdNumber = (parseInt(selectedImageID))-1;
        //get the previous image from DOM with lastIdNumber+img
        const previousImg = document.getElementById(lastImgIdNumber + "_img");
        //get previous image urlbody dataset value
        let previousImgUrlLarge = previousImg.dataset.urlbody;
        //and expand that by _z.jpg for the large image
        previousImgUrlLarge += "_z.jpg";
        //check for button right
        let right = document.getElementById("moveRight");
        //if button Right does not exist in the DOM then...
        if (right === null)
        {
            console.log("add right button");
            //add the button right into the DOM after the submodal tag
            subModal.after(rightBtn);
            rightBtn.style.backgroundColor = "lightgrey";
        }else{
            //right button is exists
            console.log("right button is there");
        }
        //if the previous image id number is not 0, then change image
        if(lastImgIdNumber !== 0) {
            //call onload function with the previous img url
            onloadFunction(previousImgUrlLarge);
        }
        // else remove the moveLeft button (firstChild of modal) and set up the first image on submodal
        else{
            //remove buttonleft
            modal.removeChild(modal.firstChild);
            image.src = previousImgUrlLarge;
        }
        selectedImageID = lastImgIdNumber;
       // document.getElementById(selectedImageID).onload=null;
    }

    // ---- MOVE TO RIGHT FUNCTION ----
    function moveRight(){
        //next image id -> parse to integer (img3 to 3)
        let lastImgIdNumber = (parseInt(selectedImageID))+1;
        //get the next image from DOM with lastIdNumber+img
        const nextImg = document.getElementById(lastImgIdNumber + "_img");
        //get next image urlbody dataset value
        let nextImgUrlLarge = nextImg.dataset.urlbody;
        //and expand that by _z.jpg for the large image
        nextImgUrlLarge += "_z.jpg";
        //check for button left
        let left = document.getElementById("moveLeft");
        //if button Left does not exist in the DOM then...
        if (left === null)
        {
            console.log("add left button");
            //add the button left into the DOM before the submodal tag
            subModal.before(leftBtn);
            leftBtn.style.backgroundColor = "lightgrey";

        }else{
            // left button is exists
            console.log("left button is there");
        }
        //if the next image id number is bigger or equal with the photos array last index position
        if(lastImgIdNumber !== photosArrayLength) {
           //call onload function with the next img url
            onloadFunction(nextImgUrlLarge);
        }
        // else remove the moveLeft button (firstChild of modal) and set up the first image on submodal
        else{
            modal.removeChild(modal.lastChild);
            image.src = nextImgUrlLarge;
        }
        selectedImageID = lastImgIdNumber;
    }

    // ---- BUTTONS MOUSE-DOWN/UP FUNCTIONS ----
    function mouseDown(way){
        let btn = document.getElementById(way);
        if(btn !==null) {
            btn.style.backgroundColor = "red";
            // console.log("mouseDown");
            // let color = btn.style.backgroundColor;
            // console.log(color);
        }
    }
    function mouseUp(way) {
        let btn = document.getElementById(way);
        if (btn !== null) {
            btn.style.backgroundColor = "lightgrey";
            // console.log("mouseUp");
            // let color = btn.style.backgroundColor;
            // console.log(color);
        }
    }

    //----  ADD ELEMENTS TO MODAL  ----
    //get the converted id number from selected img
    let convertedGetID = (parseInt(selectedImageID));
    //if the converted id not 0 (so not the first img was selected) then add left button
    if(convertedGetID !==0){
        //add left button into modal
        modal.appendChild(leftBtn);
    }

    //add image and close button into the sub-modal
    subModal.appendChild(image);
    subModal.appendChild(closeBtn);
    //add sub-modal into modal
    modal.appendChild(subModal);

    //if the converted id not arraylength-1 (so not the last img was selected) then add right button
    if(convertedGetID !== photosArrayLength){
        //add right button into modal
        modal.appendChild(rightBtn);
    }

    //append the modal into body tag
    modalPlace.appendChild(modal);


    //add eventListener for left and right arrow buttons
    window.addEventListener("keyup", pressKeyUpCheck);

    //method for left and right arrow buttons eventListener key-up function
    function pressKeyUpCheck(key){

        if (key.keyCode == 37) {

            let leftbutton = document.getElementById("moveLeft");

            if(leftbutton !== null) {
                image.src = "img/loaderGif.gif";

                mouseDown("moveLeft");
                moveLeft();
                setTimeout(function () {
                    mouseUp("moveLeft");
                }, 200);

            }else{
                console.log("left button missing");
            }
        }
        else if (key.keyCode == 39) {
            let rightbutton = document.getElementById("moveRight");
            if(rightbutton !== null) {
                image.src = "img/loaderGif.gif";
                mouseDown("moveRight");
                moveRight();
                setTimeout(function () {
                    mouseUp("moveRight");
                }, 200);

            }else{
                console.log("right button missing");
            }
        }
        else
        {
            modalPlace.removeChild(modalPlace.lastChild);
        }
    }



}

