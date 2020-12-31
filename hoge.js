(() => {
	let canvas = null;
	let ctx = null;
	let img = null;
	let next = null;
	let setting = null;
	let wrapper = null;
	let outer = null;
	let modalOk = null;
	let modalCancel = null;
	let modalReset = null;
	let hueInputElm = null;
	let maxInputElm = null;
	let verticalInputElm = null;
	let horizonalInputElm = null;
	let radiusInputElm = null;
	let height = window.screen.height*window.devicePixelRatio;
	let width = window.screen.width*window.devicePixelRatio;
	let range = width;
	let radius = 0.8;
	let rangex = width;
	let rangey = height;


	window.addEventListener('load',() => {
	initialize();
	imgToCanvas();
	render();
	canvasToImg();
},false);

function initialize() {
	canvas = document.querySelector('#mainCanvas');
	img = document.querySelector('#img');
	next = document.querySelector('#next');
	setting = document.querySelector('#setting');
	wrapper = document.querySelector('#wrapper');
	outer = document.querySelector('#outer');
	modalOk = document.querySelector('#ok');
	modalCancel = document.querySelector('#cancel');
	modalReset = document.querySelector('#reset');
	hueInputElm = document.querySelector('#h');
	maxInputElm = document.querySelector('#max');
	verticalInputElm = document.querySelector('#vertical');
	horizonalInputElm = document.querySelector('#horizonal');
  radiusInputElm = document.querySelector('#radius');
  
  /*データをもとにwidthとheightを入れ直す*/
	canvas.height = height;
	canvas.width = width;
	ctx = canvas.getContext('2d');
	
	img.addEventListener('click',() => {
		let jpg = canvas.toDataURL('image/jpeg', 1.0);
		img.href = jpg;
		// let w = window.open('about:blank', '_blank', `width=${rangex},height=${rangey},menubar=no,toolbar=no,location=no,status=no,resizable=no,scrollbars=no`);
		// w.document.write(`<img src='${jpg}'/>`);
	},false);

  let inputMax = null;
  let inputH = null;
  

  
	next.addEventListener('click', () => {
		let max = null;
		let h = null;
		if (inputMax === null) {
			max = 1000;
		}else {
			max = Number(inputMax);
		}

		if (inputH === null) {
			h = false;
		} else {
			h = Number(inputH);
		}
		imgToCanvas();
		render(max, h);
		canvasToImg();
	}, false)

	let showModal = () => {
		wrapper.style.visibility = 'visible'
		setTimeout( () => wrapper.style.opacity = 1, 10);
	};
	let delModal = () => {
		wrapper.style.opacity = 0;
		setTimeout( () => wrapper.style.visibility = 'hidden', 510);
	};
	
	
	setting.addEventListener("click", () => {
		showModal();
	},false);

	outer.addEventListener("click", () => {
		delModal();
	},false);

  let inputChecker = (value, ans) => {
    if(value === '') {
	     return ans;
	  } else {
	    return value;
	  }
  }

	ok.addEventListener("click", () => {
    inputH = inputChecker(hueInputElm.value, null);
		inputMax = inputChecker(maxInputElm.value, null);
	  canvas.height = inputChecker(verticalInputElm.value, height);
    canvas.width = inputChecker(horizonalInputElm.value, width);
    if(radiusInputElm.value !== '') {
      radius = 0.01*Number(radiusInputElm.value);
	  }
		let max = null;
		let h = null;
		if (inputMax === null) {
			max = 1000;
		}else {
			max = Number(inputMax);
		}

		if (inputH === null) {
			h = false;
		} else {
			h = Number(inputH);
		}
		imgToCanvas();
		render(max, h);
		canvasToImg();
		delModal();
	},false);

	cancel.addEventListener("click", () => {
		delModal();
	},false);

	reset.addEventListener("click", () => {
		delModal();
    inputH = null;
    inputMax = null;
	  canvas.width = width;
    canvas.height = height;
    hueInputElm.value = '';
    maxInputElm.value = '';
    verticalInputElm.value = '';
    horizonalInputElm.value = '';
    radiusInputElm.value = '';
    radius = 0.8;
		imgToCanvas();
    render();
		canvasToImg();
	},false);

  maxInputElm.addEventListener('input', () => {
    if (Number(maxInputElm.value) > 3000) {
      maxInputElm.value = 3000;
    } else if (Number(maxInputElm.value) < 0) {
      maxInputElm.value = 0;
    }
  }, false);
  
  radiusInputElm.addEventListener('focusout', () => {
    if (0.01*Number(radiusInputElm.value) > 1 || 0.01*Number(radiusInputElm.value) < 0.1) {
      radiusInputElm.value = radius*100;
    }
  }, false);
  
  
  hueInputElm.addEventListener('input', () => {
    let hueValue = Number(hueInputElm.value);
     if (hueValue < 0) {
       hueInputElm.value = 0;
     } else if (hueValue > 360) {
       hueInputElm.value = 360;
     }
    
    document.querySelector('#hueIcon').style.color = `hsl(${hueValue}, 100%, 50%)`;
  }, false)

  hueInputElm.addEventListener('focusout', () => {
    let hueValue = Number(hueInputElm.value);
    if (hueInputElm.value === '') {
      document.querySelector('#hueIcon').style.color = 'white';
    } else {
      document.querySelector('#hueIcon').style.color = `hsl(${hueValue}, 100%, 50%)`;
    }
  }, false);
  
}


let canvasToImg = () => {
	let jpg = canvas.toDataURL('image/jpeg', 1.0);
  document.querySelector('body').insertAdjacentHTML('afterbegin',`<img src='${jpg}' id="mainImg"/>`);
  let mainImg = document.querySelector('#mainImg');
  mainImg.height = window.innerHeight*0.8;
  // mainImg.style.marginTop = window.innerHeight*0.05 + 'px';
}

let imgToCanvas = () => {
  let mainImg = document.querySelector('#mainImg');
  mainImg.remove();
}

function render(max = 1000, h = false){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
  rangex = canvas.width;
  rangey = canvas.height;
  if (rangey >= rangex) {
    range = rangex;
  } else {
    range = rangey;
  }
	const pointCount = generateRandomInt(max);
	let ox = rangex/2;
	let oy = rangey/2;
	let r = ((range/2)*radius)**2;
	let points = [];

	generateRandomPoints(points, pointCount, ox, oy, r);
	randomHslFillandDraw(points, h);

}

let generateRandomPoints = (points, pointCount, ox, oy, r) => {
	for(let i = 0; i < pointCount; i++){
		let alpha = generateRandomInt(rangex);
		let beta = generateRandomInt(rangey);
		let x = null;
		let y = null;
		while((alpha-ox)**2 + (beta-oy)**2 > r){
			alpha = generateRandomInt(rangex);
			beta = generateRandomInt(rangey);
		}
		x = alpha;
		y = beta;
		points.push(x, y)
	}
}

let randomHslFillandDraw = (points, color) => {
	let hue = null;
	if (color === false) {
		hue = generateRandomInt(360);
	} else {
		let pm = generateRandomInt(9);
		if (pm >4) {
			pm = -1;
		} else {
			pm = 1;
		}
		hue = color + pm*generateRandomInt(5)
		if (hue < 0) {
			hue = 0;
		} else if (h > 360) {
			hue = 360;
		}
	}
	let s = generateRandomInt(100);
	let l = generateRandomInt(100);
	let ll = generateRandomInt(100);

while ((l <= ll && (ll+5)/(l+5) < 4) || (l >= ll && (l+5)/(ll+5) < 4)) {
	l  = generateRandomInt(100);
	ll = generateRandomInt(100);
}

	ctx.fillStyle = `hsl(${hue},${s}%,${ll}%)`;
	ctx.fillRect(0, 0, rangex, rangey);
	drawPolygon(points, `hsl(${hue}, ${s}%, ${l}%)`);
	
// 	document.querySelector('body').style.backgroundColor = `hsl(${hue},${s}%,${ll}%)`;
  let bgcolor = null;
  bgGradient = `hsl(${hue},${s/5}%,${(l+ll)/2}%)`;
	document.querySelector('body').style.background = bgGradient;
}


function generateRandomInt(range){
	let random = Math.random();
	return Math.floor(random * range);
}

function drawPolygon(points, color){
	if(Array.isArray(points) !== true || points.length < 6){
		return;
	}
	if(color != null){
		ctx.strokeStyle = color;
		ctx.fillStyle = color;
	}
	ctx.lineWidth = 0.25;
	ctx.beginPath();
	ctx.moveTo(points[0], points[1]);
	for(let i = 2; i < points.length; i += 2){
		ctx.lineTo(points[i], points[i + 1]);
	}
	ctx.closePath();
	ctx.stroke();
}

})();
