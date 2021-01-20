'use strict';

function bigChungus(input) {
	//
	//  		             DO NOT ROLL YOUR OWN CRYPTO
	//
	//               DO NOT USE THIS FOR ANYTHING IMPORTANT
	//
	// the sum of the 4 components is less than 9 * 10 ** 15, aka BigInt.
	// the sum is always greater than 10**7, so 9_999_991 is a prime that is less
	// than that.
	//
	// this function has slightly different output in chrome v firefox
	//
	const num = Math.floor(input);
	const val = Math.floor( ( ((21 ** (0.5)) ** (11 + (num % 13))) +
														((7 ** (1/4)) ** (26 + (num % 47))) + 
														((2 ** (1/4)) ** (96 + (num % 109))) +
														((2 ** (1/8)) ** (187 + (num % 223)))
													) % 9999991
												);
	return val;
}

function createAvatar(inputID) {
	const seed = bigChungus(inputID);
	const colors = selectColors(seed, 4);
	console.log('these are the colors', colors);
	const svg = setBg(seed);
	const width = svg.width.baseVal.value;
	const height = svg.height.baseVal.value;
	const bg = drawRect(2 * width, 2 * height, colors[0]);
	svg.appendChild(bg);
	const dimensions = [width, height];
	const layer = selectLayer(seed, dimensions, colors[1], colors[2]);
	svg.appendChild(layer)
	const emblem = selectEmblem(seed, dimensions, colors[3], svg.isCircle, layer.isBlank);
	svg.appendChild(emblem)
	return svg;
}

function createSvg() {
	const svg = document.createElementNS(svgNameSpace, 'svg');
	svg.setAttribute('version', '1.1');
	svg.setAttribute('baseProfile', 'full');
	return svg;
}

function setBg(seed) {
	const svg = createSvg();
	const determiner = (bigChungus(seed) + 93) % 101;
	svg.isCircle = false;
	if (determiner < 39) {
		svg.setAttribute('width', 50);
		svg.setAttribute('height', 50);
	} else if (determiner < 49) {
		svg.setAttribute('width', 59);
		svg.setAttribute('height', 42);
	} else if (determiner < 59) {
		svg.setAttribute('width', 42);
		svg.setAttribute('height', 59);
	} else if (determiner < 69) {
		svg.setAttribute('width', 67);
		svg.setAttribute('height', 37);
	} else {
		svg.setAttribute('width', 56);
		svg.setAttribute('height', 56);
		svg.style.borderRadius = '28px'
		svg.isCircle = true;
	}
	return svg;
}

function selectLayer(seed, dimensions, color1, color2) {
	let smallestSide = dimensions[0];
	if (dimensions[0] > dimensions[1]) { smallestSide = dimensions[1] }
	const determiner = (bigChungus(seed) + 883) % 1009;
	const layerGroup = document.createElementNS(svgNameSpace, 'g');
	const solidBg = drawRect(2 * dimensions[0], 2 * dimensions[1], color1);
	layerGroup.isBlank = false;
	let layer
	if				(determiner < 180) {
		// half horizontal band 
		layerGroup.appendChild(solidBg);
		layer = drawRect(dimensions[0] * 3, dimensions[1], color2);
	} else if (determiner < 360) {
		// half vertical band
		layerGroup.appendChild(solidBg);
		layer = drawRect(dimensions[0], dimensions[1] * 3, color2);
	} else if (determiner < 800) {
		// diagonal bands and crosses
		layerGroup.appendChild(solidBg);
		let a = [0, dimensions[1]];
		let b = [dimensions[0], 0];
		const thickness = 3 + (bigChungus(seed + 1) % 31);
		const miniDeterminer = (bigChungus(seed + 289) % 643);
		if (miniDeterminer < 201) {
			layer = drawLine([0, 0], [b[0], a[1]], thickness, color2);
		} else if (miniDeterminer < 441) {
			layer = drawLine([0, 0], [b[0], a[1]], (thickness / 3) + 3, color2);
			const second = drawLine(a, b, (thickness / 3) + 3, color2);
			layerGroup.appendChild(second);
		} else {
			layer = drawLine(a, b, thickness, color2);
		}
	} else {
		// the null layer, for plain backgrounds.
		// remember this ends at 1009 !!!
		layer = drawRect(2 * dimensions[0], 2 * dimensions[1], color2);
		layerGroup.isBlank = true; // emblem will be generated for blank bg
	}
	layerGroup.appendChild(layer);
	return layerGroup;
}

function selectEmblem(seed, dimensions, color, bgIsCircle, layerIsBlank) {
	let smallestSide = dimensions[0];
	if (dimensions[0] > dimensions[1]) { smallestSide = dimensions[1] }
	if (bgIsCircle) { smallestSide *= .82 }
	let modulus = 997
	if (layerIsBlank) { modulus = 749 }
	const determiner = (bigChungus(seed) + 303) % modulus;
	const layerGroup = document.createElementNS(svgNameSpace, 'g');
	let emblem
	if				(determiner < 150) {
		emblem = drawCircle((smallestSide * .28), color);
	} else if (determiner < 220) {
		emblem = drawHex((smallestSide * .3), color);
	} else if (determiner < 290) {
		emblem = drawPent((smallestSide * .39), color);
	} else if (determiner < 350) {
		emblem = drawRhombus((smallestSide * .43), (smallestSide * .74), color);
	} else if (determiner < 410) {
		emblem = drawRhombus((smallestSide * .47), (smallestSide * .67), color);
	} else if (determiner < 530) {
		emblem = drawStar((smallestSide * .44), color);
	} else if (determiner < 620) {
		emblem = drawRect((smallestSide * .56), (smallestSide * .56), color);
	} else if (determiner < 750) {
		emblem = drawTriangle((smallestSide * .65), color);
	} else {
		// the null emblem
		// object needs to exist, but it can be invisible.
		// remember this ends at 997!!!
		emblem = drawRect(0, 0, color);
		emblem.style.display = 'none';
	}
	emblem.setAttribute('transform', `translate(${dimensions[0]/2},${dimensions[1]/2})`);
	layerGroup.appendChild(emblem);
	return layerGroup; 
}

function drawCircle(radius, inputColor) {
	const circle = document.createElementNS(svgNameSpace, 'circle');
	const color = `hsl(${inputColor[0]}, ${inputColor[1]}%, ${inputColor[2]}%)`;
	circle.setAttribute('r', radius);
	circle.setAttribute('fill', color);
	return circle;
}

function drawLine(start, finish, thickness, inputColor) {
	const line = document.createElementNS(svgNameSpace, 'line');
	const color = `hsl(${inputColor[0]}, ${inputColor[1]}%, ${inputColor[2]}%)`;
	line.setAttribute('x1', start[0]);
	line.setAttribute('y1', start[1]);
	line.setAttribute('x2', finish[0]);
	line.setAttribute('y2', finish[1]);
	line.setAttribute('stroke-width', thickness);
	line.setAttribute('stroke', color);
	return line;
}

function drawRect(width, height, inputColor) {
	const rect = document.createElementNS(svgNameSpace, 'rect');
	const color = `hsl(${inputColor[0]}, ${inputColor[1]}%, ${inputColor[2]}%)`;
	rect.setAttribute('x', -width / 2);
	rect.setAttribute('y', -height / 2);
	rect.setAttribute('width', width);
	rect.setAttribute('height', height);
	rect.setAttribute('fill', color);
	return rect
}

function drawRhombus(axisX, axisY, inputColor) {
	const rhom = document.createElementNS(svgNameSpace, 'polygon');
	const color = `hsl(${inputColor[0]}, ${inputColor[1]}%, ${inputColor[2]}%)`;
	const points = [
		`0,${-axisX / 2}`,
		`${axisX / 2},0`,
		`0,${axisY / 2}`,
		`${-axisY / 2},0`,
	];
	rhom.setAttribute('points', points.join(' '));
	rhom.setAttribute('fill', color);
	return rhom;
}

function drawTriangle(sideLength, inputColor) {
	const triangle = document.createElementNS(svgNameSpace, 'polygon');
	const color = `hsl(${inputColor[0]}, ${inputColor[1]}%, ${inputColor[2]}%)`;
	const pt1 = `0,${sideLength / (3 ** 0.5)}`
	const pt2 = `${sideLength / 2},${-(sideLength / (2 * (3 ** 0.5)))}`
	const pt3 = `${-(sideLength / 2)},${-(sideLength / (2 * (3 ** 0.5)))}`
	triangle.setAttribute('points', pt1 + ' ' + pt2 + ' ' + pt3);
	triangle.setAttribute('fill', color);
	return triangle;
}

function drawPent(sideLength, inputColor) {
	const pent = document.createElementNS(svgNameSpace, 'polygon');
	const color = `hsl(${inputColor[0]}, ${inputColor[1]}%, ${inputColor[2]}%)`;
	const points = [
		`0,${-sideLength * .85}`,
		`${sideLength * 0.81},${-sideLength * .26}`,
		`${sideLength / 2},${sideLength * .69}`,
		`${-sideLength / 2},${sideLength * .69}`,
		`${-sideLength * 0.81},${-sideLength * .26}`
	]
	pent.setAttribute('points', points.join(' '));
	pent.setAttribute('fill', color);
	return pent;
}

function drawStar(sideLength, inputColor) {
	const pent = document.createElementNS(svgNameSpace, 'polygon');
	const color = `hsl(${inputColor[0]}, ${inputColor[1]}%, ${inputColor[2]}%)`;
	// sideLength in this case refers to distance from star-end to neighboring 
	// (non-connected) end.  aka, the length of one point edge plus a central 
	// pentagon edge.  aka, one point edge * 1.618
	const points = [
		`0,${-sideLength * .85}`,
		`${sideLength / 2},${sideLength * .69}`,
		`${-sideLength * 0.81},${-sideLength * .26}`,
		`${sideLength * 0.81},${-sideLength * .26}`,
		`${-sideLength / 2},${sideLength * .69}`
	];
	pent.setAttribute('points', points.join(' '));
	pent.setAttribute('fill', color);
	return pent;
}

function drawHex(sideLength, inputColor) {
	const hex = document.createElementNS(svgNameSpace, 'polygon');
	const color = `hsl(${inputColor[0]}, ${inputColor[1]}%, ${inputColor[2]}%)`;
	const points = [
		`${-sideLength / 2},${-sideLength * (3 ** 0.5) / 2}`,
		`${sideLength / 2},${-sideLength * (3 ** 0.5) / 2}`,
		`${sideLength}, 0`,
		`${sideLength / 2},${sideLength * (3 ** 0.5) / 2}`,
		`${-sideLength / 2},${sideLength * (3 ** 0.5) / 2}`,
		`${-sideLength}, 0`
	];
	hex.setAttribute('points', points.join(' '));
	hex.setAttribute('fill', color);
	return hex;
}

function selectLightness(seed, num) {
	const colors = [];
	let colorCount = 0;
	// sometimes this loop will run with no effect.  it's not count i up to num
	for (let i = 0; colors.length < num; i++) {
		const determiner = bigChungus(seed + 809 + i) % 251
		if ((determiner < 32) && (!colors.includes('black'))) {
			colors.push('black');
		} else if ((determiner < 61) && (!colors.includes('white'))) {
			colors.push('white');
		} else if ((determiner < 81) && (!colors.includes('gray'))) {
			colors.push('gray');
		} else if (determiner < (250 - (colorCount * 43))) {
			// colorCount decreases the chances of multiple colors being selected
			colorCount++;
			colors.push('color');
		}
		if (i > 49) {break;}
	}
	return colors
}

function selectHues(inputColors, seed) {
	// only guanateed to pass when you have less than 5 hues to select.  
	// (you could get more if you narrowed the hue contrast.  
	// current min contrast val = 44)
	const colors = inputColors;
	const hues = [];
	for (let index = 0; index < colors.length; index++) {
		if				(colors[index] == 'white') {
			colors[index] = [0, 0, 100]
		} else if (colors[index] == 'black') {
			colors[index] = [0, 0, 0]
		} else if (colors[index] == 'gray') {
			colors[index] = [0, 0, 25 + (bigChungus(seed + 19 + index) % 47)]
		} else if (colors[index] == 'color' ) {
			// lightness
			colors[index] = [0, 0, 25 + (bigChungus(seed + 33 + index) % 47)]
			// saturation
			colors[index][1] = 100 - (bigChungus(seed + 17 + index) % 53);
			// if no hues exist yet
			if (hues[0] == null) {
				const hue = bigChungus(seed + 931 + index) % 360;
				colors[index][0] = hue;
				hues.push(hue);
			} else {
				// generate new hue with minimum hue contrast 
				const huesNeeded = hues.length + 1
				for (let salt = 0; hues.length < huesNeeded; salt++) {
					const hue = bigChungus(seed + 613 + (index * 100) + salt) % 360;
					let hueAllowed = true;
					const minContrast = 44;
					hues.forEach((oldHue) => {
						if ( ( (hue > (oldHue - minContrast			 )	)
								 &&(hue < (oldHue + minContrast			 )	)	)
							 ||( (hue > (oldHue - minContrast + 360)	)
								 &&(hue < (oldHue + minContrast + 360)	)	)
							 ||( (hue > (oldHue - minContrast - 360)	)
								 &&(hue < (oldHue + minContrast - 360)	)	)
							 ) {
							hueAllowed = false
						}
					});
					if (hueAllowed) {
						colors[index][0] = hue;
						hues.push(hue);
					}
					if (salt > 99) {
						colors[index][0] = hue;
						hues.push(699);
						console.log('hue selection broke somehow');
						break;
					}
				}
			}
		}
	};
	let salt = 0;
	for (let i = 0; i + 1 < colors.length; i++) {
		if (Math.abs(colors[i][2] - colors[i + 1][2]) < 15) {
			colors[i + 1][2] = 20 + (bigChungus(seed + 3 + salt) % 61);
			i--;
		}
		salt++;
	}
	return colors;
}

function selectColors(seed, layers) {
	const lightVals = selectLightness(seed, 4);
	const colors = selectHues(lightVals, seed);
	return colors;
}

function styleComments(commentNodeList) {
	commentNodeList.forEach(commentNode => {
		let userID = commentNode.href.match(/\d+\/$/)[0];
		userID = userID.slice(0, (userID.length - 1));
		const div = createAvatarContainer();
		console.log(commentNode.innerText); // that's the user's username >:3
		const avatar = createAvatar(userID);
		avatar.style.position = 'relative';
		avatar.style.right = `${avatar.width.baseVal.value + 16}px`;
		div.appendChild(avatar);
		const commentContainer= commentNode.parentElement.parentElement.parentElement;
		if ( commentContainer.querySelector('.comment__prediction') !== null) {
			movePrediction(commentContainer, avatar.width.baseVal.value);
		}
		commentNode.prepend(div);
	});
}

function main() {
	const avatar = createAvatar(5);

}

const svgNameSpace = 'http://www.w3.org/2000/svg';

main();










