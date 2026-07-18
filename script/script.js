const pickerButton =
	document.getElementById(
		"color-picker"
	);


const colorList =
	document.getElementById(
		"all-colors"
	);


const clearButton =
	document.getElementById(
		"clearAll"
	);


const pickedSection =
	document.getElementById(
		"picked-color"
	);


const preview =
	document.getElementById(
		"preview"
	);



let colors=[];




// Load history

async function loadColors(){


	const data =
		await chrome.storage.local.get(
			"colors"
		);


	colors =
		data.colors || [];


	renderColors();


}




// Save history

async function saveColors(){


	await chrome.storage.local.set({

		colors:colors

	});


}




// Copy HEX

async function copyColor(hex){


	await navigator.clipboard.writeText(hex);


}




// Render history

function renderColors(){


	if(colors.length===0){

		pickedSection.classList.add(
			"hidden"
		);

		return;

	}



	pickedSection.classList.remove(
		"hidden"
	);



	colorList.innerHTML =

		colors.map(color=>{


			return `

<li class="color-item"
style="background:${color}">


<span data-color="${color}">
${color}
</span>


</li>

`;


		}).join("");





	document
		.querySelectorAll(
			".color-item span"
		)
		.forEach(item=>{


			item.onclick=async()=>{


				await copyColor(
					item.dataset.color
				);


				item.innerText =
					"Copied ✓";



				setTimeout(()=>{


					item.innerText =
						item.dataset.color;


				},1000);



			};


		});



}




// Pick color

async function pickColor(){


	try{


		const eyeDropper =
			new EyeDropper();



		const result =
			await eyeDropper.open();



		const hex =
			result.sRGBHex;



// preview

		preview.style.background =
			hex;


		preview.innerText =
			hex;




// copy automatically

		await copyColor(hex);





// save history

		if(!colors.includes(hex)){


			colors.unshift(hex);


			await saveColors();


			renderColors();


		}



	}


	catch(err){

		console.log(
			"Picker cancelled"
		);

	}



}




// Clear

async function clearColors(){


	colors=[];


	await chrome.storage.local.remove(
		"colors"
	);


	renderColors();


}





pickerButton.onclick =
	pickColor;


clearButton.onclick =
	clearColors;



loadColors();