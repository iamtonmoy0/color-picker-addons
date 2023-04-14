const pickerButton = document.getElementById('color-picker')
const colorList = document.getElementById('all-colors')
const clearColor = document.getElementById('clearAll')
const pickedColors = JSON.parse(localStorage.getItem("selected-colors") || "[]"); //empty array
const copyColor = elem => {
	navigator.clipboard.writeText(elem.dataset.color)
	elem.innerText='Copied!!';
	setTimeout(()=>elem.innerText=elem.dataset.color,1000)

}
const showColors = () => {
	colorList.innerHTML = pickedColors.map(color =>
		`<li class="color" style="cursor:pointer;">

					<span
						class="text-blue-800 text-sm font-semibold inline-flex items-center p-2 rounded-full dark:bg-gray-700 dark:text-blue-400" style="background:${color};">
						<!-- svg area -->
						<svg aria-hidden="true" class="w-3.5 h-3.5" fill="currentColor"
							viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
							<path fill-rule="evenodd"
								d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
								clip-rule="evenodd"></path>
						</svg>
						<span class="sr-only">Icon description</span>
					</span>
					<span id="value" data-color="${color}">${color}</span>
				</li>`
	).join("");
	document.querySelector('.picked-color').classList.remove("hidden"); //remove the element after color selected
	// event for copy the color code
	document.querySelectorAll('.color').forEach(li => {
		li.addEventListener('click', e => copyColor(e.currentTarget.lastElementChild))
		
	})

};
showColors();
const activateEyeDropper = async () => {
	try {
		const eyeDropper = new EyeDropper(); //eyedropper added
		const {
			sRGBHex
		} = await eyeDropper.open();
		navigator.clipboard.writeText(sRGBHex) //copy value
		if (!pickedColors.includes(sRGBHex)) { //if the color already exists
			pickedColors.push(sRGBHex) //pushing colors to the array
			localStorage.setItem('selected-colors', JSON.stringify(pickedColors)) //storing to local storage
			showColors();
		}
	} catch (error) {
		console.log(error) //error catch
	}
}
const clearAllColor=()=>{
	pickedColors.length=0;
	localStorage.setItem("selected-colors",JSON.stringify(pickedColors));
	document.querySelector('.picked-color').classList.add('hidden')
}
pickerButton.addEventListener('click', activateEyeDropper)
clearColor.addEventListener('click',clearAllColor)