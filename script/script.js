const pickerButton = document.getElementById('color-picker')
const colorList = document.getElementById('all-colors')
const pickedColors = JSON.parse(localStorage.getItem("selected-colors")||"[]"); //empty array
const showColors=()=>{
	colorList.innerHTML=pickedColors.map(color=>
		`<li id="color" class="">

					<span
						class="text-blue-800 text-sm font-semibold inline-flex items-center p-2 rounded-full dark:bg-gray-700 dark:text-blue-400" style="background:${color}">
						<!-- svg area -->
						<svg aria-hidden="true" class="w-3.5 h-3.5" fill="currentColor"
							viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
							<path fill-rule="evenodd"
								d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
								clip-rule="evenodd"></path>
						</svg>
						<span class="sr-only">Icon description</span>
					</span>
					<span id="value">${color}</span>
				</li>`
	).join("");
}
const activateEyeDropper = async () => {
	try {
		const eyeDropper = new EyeDropper(); //eyedropper added
		const {
			sRGBHex
		} = await eyeDropper.open();
		navigator.clipboard.writeText(sRGBHex) //copy value
		pickedColors.push(sRGBHex) //pushing colors to the array
		localStorage.setItem('selected-colors', JSON.stringify(pickedColors)) //storing to local storage
		showColors();
	} catch (error) {
		console.log(error)
	}
}
pickerButton.addEventListener('click', activateEyeDropper)