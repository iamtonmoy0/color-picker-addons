/* ==========================================================
   COLOR PICKER PRO
   SCRIPT.JS PART 1/3

   - Storage
   - Color utilities
   - HEX/RGBA conversion
   - EyeDropper
   - Basic state
========================================================== */


/* ===============================
   DOM ELEMENTS
================================ */

const pickerButton =
	document.getElementById("color-picker");


const preview =
	document.getElementById("preview");


const previewHex =
	document.getElementById("previewHex");


const previewRGBA =
	document.getElementById("previewRGBA");


const hexInput =
	document.getElementById("hexInput");


const rgbaInput =
	document.getElementById("rgbaInput");


const pickedSection =
	document.getElementById("picked-color");


const colorList =
	document.getElementById("all-colors");


const clearButton =
	document.getElementById("clearAll");


const creatorPreview =
	document.getElementById("creatorPreview");


const creatorHex =
	document.getElementById("creatorHex");


const creatorRGBA =
	document.getElementById("creatorRGBA");



/* ===============================
   GLOBAL STATE
================================ */

let colors = [];


let currentColor = {

	r:255,

	g:255,

	b:255,

	a:1

};



/* ===============================
   STORAGE
================================ */


async function loadColors(){

	const data =
		await chrome.storage.local.get(
			"colors"
		);


	colors =
		data.colors || [];


}



async function saveColors(){

	await chrome.storage.local.set({

		colors:colors

	});

}



/* ===============================
   COPY FUNCTION
================================ */


async function copyText(text){

	try{

		await navigator.clipboard.writeText(text);


		return true;


	}
	catch(error){

		console.log(error);

		return false;

	}

}





/* ===============================
   COLOR UTILITIES
================================ */


/*
    Remove #
*/

function cleanHex(hex){

	return hex
		.replace("#","")
		.trim();

}




/*
    Validate HEX
*/


function isValidHex(hex){

	return /^#?([A-Fa-f0-9]{6})$/.test(hex);

}




/*
    HEX TO RGB
*/


function hexToRGB(hex){


	hex =
		cleanHex(hex);


	if(hex.length !== 6){

		return null;

	}


	return {

		r:parseInt(
			hex.substring(0,2),
			16
		),


		g:parseInt(
			hex.substring(2,4),
			16
		),


		b:parseInt(
			hex.substring(4,6),
			16
		)

	};


}




/*
    RGB TO HEX
*/


function rgbToHex(r,g,b){


	return (

		"#" +

		[r,g,b]

			.map(
				value => {

					return Number(value)
						.toString(16)
						.padStart(2,"0");

				}

			)

			.join("")

	)

		.toUpperCase();


}





/*
    RGB + Alpha TO RGBA
*/


function rgbToRGBA(r,g,b,a=1){


	return `rgba(${r},${g},${b},${a})`;


}






/*
    RGBA Parser

    rgba(255,255,255,1)

*/


function parseRGBA(value){


	const result =
		value.match(
			/rgba?\(([^)]+)\)/
		);


	if(!result){

		return null;

	}


	const values =
		result[1]
			.split(",")
			.map(
				item =>
					Number(
						item.trim()
					)
			);



	return {


		r:values[0],

		g:values[1],

		b:values[2],

		a:
			values[3] !== undefined
				?
				values[3]
				:
				1

	};


}




/* ===============================
   COLOR STATE UPDATE
================================ */


function updateColorState(
	r,
	g,
	b,
	a=1
){


	currentColor = {

		r:Number(r),

		g:Number(g),

		b:Number(b),

		a:Number(a)

	};


}




function getCurrentHex(){


	return rgbToHex(

		currentColor.r,

		currentColor.g,

		currentColor.b

	);


}





function getCurrentRGBA(){


	return rgbToRGBA(

		currentColor.r,

		currentColor.g,

		currentColor.b,

		currentColor.a

	);


}







/* ===============================
   PREVIEW UPDATE
================================ */


function updatePreview(){


	const hex =
		getCurrentHex();


	const rgba =
		getCurrentRGBA();



	if(preview){

		preview.style.background =
			rgba;


		preview.innerText =
			hex;

	}



	if(previewHex){

		previewHex.value =
			hex;

	}



	if(previewRGBA){

		previewRGBA.value =
			rgba;

	}



	if(creatorPreview){

		creatorPreview.style.background =
			rgba;

	}



	if(creatorHex){

		creatorHex.value =
			hex;

	}



	if(creatorRGBA){

		creatorRGBA.value =
			rgba;

	}



}





/* ===============================
   EYE DROPPER
================================ */


async function pickColor(){


	try{


		const eyeDropper =
			new EyeDropper();



		const result =
			await eyeDropper.open();



		const hex =
			result.sRGBHex;



		const rgb =
			hexToRGB(hex);



		if(!rgb){

			return;

		}



		updateColorState(

			rgb.r,

			rgb.g,

			rgb.b,

			1

		);



		updatePreview();



		await addColorHistory(
			hex
		);



	}

	catch(error){

		console.log(
			"Picker cancelled"
		);

	}


}






/* ===============================
   HISTORY ADD
================================ */


async function addColorHistory(hex){


	if(
		!colors.includes(hex)
	){

		colors.unshift(hex);


		if(colors.length > 20){

			colors.pop();

		}


		await saveColors();

	}


}




/* ===============================
   INITIAL LOAD
================================ */


loadColors();


updatePreview();
/* ==========================================================
   COLOR PICKER PRO
   SCRIPT.JS PART 2/3

   - Sliders
   - Color Creator
   - HEX/RGBA Converter
   - Random Colors
   - Save Colors
========================================================== */



/* ===============================
   SLIDER ELEMENTS
================================ */


const redSlider =
	document.getElementById("red");


const greenSlider =
	document.getElementById("green");


const blueSlider =
	document.getElementById("blue");


const alphaSlider =
	document.getElementById("alpha");



const rValue =
	document.getElementById("rValue");


const gValue =
	document.getElementById("gValue");


const bValue =
	document.getElementById("bValue");


const aValue =
	document.getElementById("aValue");




/* ===============================
   UPDATE SLIDER DISPLAY
================================ */


function updateSliderValues(){


	if(rValue){

		rValue.innerText =
			currentColor.r;

	}


	if(gValue){

		gValue.innerText =
			currentColor.g;

	}


	if(bValue){

		bValue.innerText =
			currentColor.b;

	}


	if(aValue){

		aValue.innerText =
			currentColor.a;

	}


}






/* ===============================
   SYNC SLIDERS
================================ */


function syncSliders(){


	if(redSlider){

		redSlider.value =
			currentColor.r;

	}


	if(greenSlider){

		greenSlider.value =
			currentColor.g;

	}


	if(blueSlider){

		blueSlider.value =
			currentColor.b;

	}


	if(alphaSlider){

		alphaSlider.value =
			currentColor.a;

	}


	updateSliderValues();


}






/* ===============================
   SLIDER CHANGE EVENTS
================================ */


function sliderChanged(){


	updateColorState(

		redSlider.value,

		greenSlider.value,

		blueSlider.value,

		alphaSlider.value

	);


	updateSliderValues();


	updatePreview();


}





if(redSlider){

	redSlider.addEventListener(
		"input",
		sliderChanged
	);

}


if(greenSlider){

	greenSlider.addEventListener(
		"input",
		sliderChanged
	);

}


if(blueSlider){

	blueSlider.addEventListener(
		"input",
		sliderChanged
	);

}


if(alphaSlider){

	alphaSlider.addEventListener(
		"input",
		sliderChanged
	);

}






/* ===============================
   HEX INPUT
================================ */


if(hexInput){


	hexInput.addEventListener(
		"input",
		()=>{


			let value =
				hexInput.value.trim();



			if(
				!isValidHex(value)
			){

				return;

			}



			const rgb =
				hexToRGB(value);



			updateColorState(

				rgb.r,

				rgb.g,

				rgb.b,

				currentColor.a

			);



			syncSliders();

			updatePreview();



		}
	);


}







/* ===============================
   RGBA INPUT
================================ */


if(rgbaInput){


	rgbaInput.addEventListener(
		"input",
		()=>{


			const rgb =
				parseRGBA(
					rgbaInput.value
				);



			if(!rgb){

				return;

			}



			updateColorState(

				rgb.r,

				rgb.g,

				rgb.b,

				rgb.a

			);



			syncSliders();

			updatePreview();



		}
	);


}








/* ===============================
   HEX BUTTON
================================ */


const convertHexButton =
	document.getElementById(
		"convertHex"
	);



if(convertHexButton){


	convertHexButton.onclick =
		()=>{


			const rgb =
				hexToRGB(
					hexInput.value
				);



			if(!rgb){

				alert(
					"Invalid HEX color"
				);

				return;

			}



			updateColorState(

				rgb.r,

				rgb.g,

				rgb.b,

				currentColor.a

			);



			rgbaInput.value =
				getCurrentRGBA();



			syncSliders();

			updatePreview();


		};


}








/* ===============================
   RGBA BUTTON
================================ */


const convertRGBAButton =
	document.getElementById(
		"convertRGBA"
	);



if(convertRGBAButton){


	convertRGBAButton.onclick =
		()=>{


			const rgb =
				parseRGBA(
					rgbaInput.value
				);



			if(!rgb){

				alert(
					"Invalid RGBA format"
				);

				return;

			}



			updateColorState(

				rgb.r,

				rgb.g,

				rgb.b,

				rgb.a

			);



			hexInput.value =
				getCurrentHex();



			syncSliders();

			updatePreview();


		};


}








/* ===============================
   RANDOM COLOR
================================ */


const randomButton =
	document.getElementById(
		"randomColor"
	);



function randomNumber(){

	return Math.floor(
		Math.random()*256
	);

}





if(randomButton){


	randomButton.onclick =
		()=>{


			updateColorState(

				randomNumber(),

				randomNumber(),

				randomNumber(),

				1

			);



			syncSliders();


			updatePreview();


		};


}








/* ===============================
   SAVE COLOR BUTTON
================================ */


const saveButton =
	document.getElementById(
		"saveColor"
	);



if(saveButton){


	saveButton.onclick =
		async()=>{


			const hex =
				getCurrentHex();



			await addColorHistory(
				hex
			);


			saveButton.innerText =
				"Saved ✓";



			setTimeout(()=>{


				saveButton.innerText =
					"⭐ Save Color";


			},1500);



		};


}






/* ===============================
   INITIAL SYNC
================================ */


syncSliders();
updateSliderValues();
/* ==========================================================
   COLOR PICKER PRO
   SCRIPT.JS PART 3/3

   - History UI
   - Copy Actions
   - Buttons
   - Ads
   - Final Init
========================================================== */



/* ===============================
   TOAST MESSAGE
================================ */


function showToast(message){


	const old =
		document.querySelector(
			".toast"
		);


	if(old){

		old.remove();

	}



	const toast =
		document.createElement(
			"div"
		);


	toast.className =
		"toast";


	toast.innerText =
		message;



	document.body.appendChild(
		toast
	);



	setTimeout(()=>{


		toast.classList.add(
			"show"
		);


	},50);



	setTimeout(()=>{


		toast.classList.remove(
			"show"
		);


		setTimeout(()=>{

			toast.remove();

		},300);



	},1500);


}







/* ===============================
   RENDER HISTORY
================================ */


function renderColors(){


	if(!colorList){

		return;

	}



	if(colors.length===0){


		pickedSection.classList.add(
			"hidden"
		);


		colorList.innerHTML =
			"";


		return;

	}



	pickedSection.classList.remove(
		"hidden"
	);



	colorList.innerHTML =

		colors.map(color=>{


			const rgb =
				hexToRGB(color);



			const rgba =
				rgbToRGBA(

					rgb.r,

					rgb.g,

					rgb.b,

					1

				);



			return `


        <li class="color-item">


            <div class="color-left">


                <div 
                class="color-circle"
                style="background:${color}">
                </div>



                <div class="color-text">


                    <strong>
                        ${color}
                    </strong>


                    <small>
                        ${rgba}
                    </small>


                </div>


            </div>



            <button
            class="copy-history"
            data-color="${color}">

                Copy

            </button>


        </li>


        `;


		}).join("");





	document
		.querySelectorAll(
			".copy-history"
		)
		.forEach(button=>{


			button.onclick =
				async()=>{


					await copyText(
						button.dataset.color
					);


					button.innerText =
						"✓";


					showToast(
						"HEX copied"
					);



					setTimeout(()=>{


						button.innerText =
							"Copy";


					},1000);



				};


		});


}







/* ===============================
   PICK BUTTON
================================ */


if(pickerButton){


	pickerButton.onclick =
		pickColor;


}






/* ===============================
   CLEAR HISTORY
================================ */


if(clearButton){


	clearButton.onclick =
		async()=>{


			colors=[];


			await chrome.storage.local.remove(
				"colors"
			);



			renderColors();



			showToast(
				"History cleared"
			);


		};


}







/* ===============================
   COPY PREVIEW HEX
================================ */


const copyHexPreview =
	document.getElementById(
		"copyHexPreview"
	);


if(copyHexPreview){


	copyHexPreview.onclick =
		async()=>{


			await copyText(
				getCurrentHex()
			);


			showToast(
				"HEX copied"
			);


		};


}







/* ===============================
   COPY PREVIEW RGBA
================================ */


const copyRGBAPreview =
	document.getElementById(
		"copyRGBAPreview"
	);



if(copyRGBAPreview){


	copyRGBAPreview.onclick =
		async()=>{


			await copyText(
				getCurrentRGBA()
			);


			showToast(
				"RGBA copied"
			);


		};


}







/* ===============================
   COPY CREATOR HEX
================================ */


const copyCreatorHex =
	document.getElementById(
		"copyCreatorHex"
	);


if(copyCreatorHex){


	copyCreatorHex.onclick =
		async()=>{


			await copyText(
				creatorHex.value
			);


			showToast(
				"HEX copied"
			);


		};


}







/* ===============================
   COPY CREATOR RGBA
================================ */


const copyCreatorRGBA =
	document.getElementById(
		"copyCreatorRGBA"
	);


if(copyCreatorRGBA){


	copyCreatorRGBA.onclick =
		async()=>{


			await copyText(
				creatorRGBA.value
			);


			showToast(
				"RGBA copied"
			);


		};


}







/* ===============================
   UPDATE HISTORY AFTER PICK
================================ */


const oldAddHistory =
	addColorHistory;


addColorHistory =
	async function(hex){


		await oldAddHistory(hex);


		renderColors();


	};








/* ===============================
   PLAYAYIELD ADS
================================ */


try{


	if(
		typeof PlayaYield !== "undefined"
	){


		PlayaYield.init({

			publisherId:
				"pk_live_30e070f775644ba1a161e41c7f3376bd"

		});



		PlayaYield.showAd({

			container:"#py-ad",

			size:"300x250"

		});



	}



	if(
		typeof py !== "undefined"
	){


		py.displayAd({

			element:
				document.getElementById(
					"py-ad"
				)

		});


	}


}
catch(error){

	console.log(
		"Ad loading skipped"
	);

}








/* ===============================
   FINAL INITIALIZATION
================================ */


(async function(){


	await loadColors();


	renderColors();


	updatePreview();


	syncSliders();


})();
