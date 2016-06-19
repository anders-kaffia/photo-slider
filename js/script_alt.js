/*=======================================================
# 						VARIABLES 						#
=======================================================*/
// ------------Laddar in XML-filen med hjälp av ajax------------
var ajax = new XMLHttpRequest();
ajax.onreadystatechange = function () {
	if( ajax.readyState == 4 && ajax.status == 200 ) {
		console.log("OK, XML-fil inladdad.");
		parseXML();
		document.getElementById('imgHolder').src = images[step].children[1].innerHTML;
	}
}
ajax.open("GET", "images.xml", true);
ajax.send();
//----------------------------/ ajax----------------------------
var step = 0;
var slideImage = document.getElementById("imgHolder");
// Deklarera variabler för att slippa errormeddelanden.
var xml, images;

/*=======================================================
# 						FUNCTIONS 						#
=======================================================*/
function parseXML() {
	xml = ajax.responseXML;
	images = xml.getElementsByTagName("image");	
	var imgSrc = images[0].children[1].innerHTML; // Tar emot bildens path.
	var imgCaptDate = 'Titel: ' + images[0].children[0].innerHTML; // Tar emot Caption
	imgCaptDate += ' Datum: ' + images[0].children[2].innerHTML; // Tar emot Date
	addImageElement(imgSrc);
	addImgCaptDate(imgCaptDate);
}

function addImageElement(src) { // funktionsparameter som får sitt värde från parseXML()
	var attr = document.createAttribute("src"); // Skapar ett nytt attribut, src som ska höra ihop såhär: <img src="">
	attr.value = src; // Sätt src till bildens adress, typ "bild1.jpg"
	slideImage.setAttributeNode(attr); // Haka på attributet på img-taggen så att vi de facto får <img src="bild1.jpg">
	injectControls(slideImage);
}

// Skapar en span till Caption och Date
function addImgCaptDate(e) {
	// skapar span och document fragment
    var spanCaptDate = document.createElement("span");
    /*
	Document fragment är också DOM noder, men de är inte en del av DOM trädet. I DOM-trädet ersätts
	document fragment av dess barn. När man fäster(append) barn till D-F behöver inte sidan "reflow", alltså
	räkna ut elementens position. Detta gör ofta att sidan laddas fortare.
    */
    var docFrag = document.createDocumentFragment();
    // Fyller på span med Caption och Date
    spanCaptDate.innerHTML = e;
    // lägger till id
    spanCaptDate.setAttribute("id", "imgCaptDate");
    // fäster span vid docFrag, och fäster sedan docFrag till DOM
    docFrag.appendChild(spanCaptDate);
    document.getElementById("slideshow").appendChild(docFrag);
}

// lägger till span med "pilar" för bläddring
function injectControls(e) {
    // skapar span och document fragment
    var spanPrev = document.createElement("span");
    var spanNext = document.createElement("span");
    var docFrag = document.createDocumentFragment();
    // lägger till id
    spanPrev.setAttribute("id", "prevPic");
    spanNext.setAttribute("id", "nextPic");
    // lägger till innehåll i spans
    spanPrev.innerHTML = '&laquo;';
    spanNext.innerHTML = '&raquo;';
    // fäster spans vid docFrag, och fäster sedan docFrag till DOM
    docFrag.appendChild(spanPrev);
    docFrag.appendChild(spanNext);
    document.getElementById("slideshow").appendChild(docFrag);
    // Gör span-knapparna klickbara
    var nextPic = document.getElementById("nextPic");
	var prevPic = document.getElementById("prevPic");
	nextPic.addEventListener("click", handleImageChange ); 
	prevPic.addEventListener("click", handleImageChange );
}

function handleImageChange(e) {
	if(e.currentTarget.id == "nextPic" || e.keyCode == 39) {
		step++;
	} else if(e.currentTarget.id == "prevPic" || e.keyCode == 37) {
		step--;
	}

	// Pressed backwards, reached start of array, start at back
	if(step < 0) {
		step = images.length - 1;
	}

	// At the end of images array, reset to 0
	if(step >= images.length) {
		step = 0;
	}

	var imgCaptDateStepF = document.getElementById("imgCaptDate");
	document.getElementById('imgHolder').src = images[step].children[1].innerHTML;
	imgCaptDateStepF.innerHTML = 'Titel: ' + images[step].children[0].innerHTML + ' Datum: ';
	imgCaptDateStepF.insertAdjacentHTML("beforeend", images[step].children[2].innerHTML);
}

/*=======================================================
# 					  	WIRING 							#
=======================================================*/
	          
document.addEventListener("keydown", handleImageChange);