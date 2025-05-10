// origina file site.js taken from: https://github.com/paulcuth/netpbm-viewer
	
export class NetPBM {
	width:number;
	height:number;
	_parser:Parser;
	_formatter: Formatter;

	constructor (data:string) {
		
		var exp = /^(\S+)\s+(\#.*?\n)*\s*(\d+)\s+(\d+)\s+(\d+)?\s*/,
			match = data.match (exp);

		if (match) {
			var width = this.width = parseInt (match[3], 10),
				height = this.height = parseInt (match[4], 10),
				maxVal = parseInt (match[5], 10),
				bytes = (maxVal < 256)? 1 : 2,
				data = data.substr (match[0].length);

			switch (match[1]) {
				
				case 'P1':
					this._parser = new ASCIIParser (maxVal + ' ' + data, bytes);
					this._formatter = new PBMFormatter (width, height, maxVal);
					break;

				case 'P2':
					this._parser = new ASCIIParser (data, bytes);
					this._formatter = new PGMFormatter (width, height, maxVal);
					break;

				case 'P3':
					this._parser = new ASCIIParser (data, bytes);
					this._formatter = new PPMFormatter (width, height, maxVal);
					break;

				case 'P4':
					this._parser = new BinaryParser (data, bytes);
					this._formatter = new PBMFormatter (width, height, maxVal);
					break;

				case 'P5':
					this._parser = new BinaryParser (data, bytes);
					this._formatter = new PGMFormatter (width, height, maxVal);
					break;

				case 'P6':
					this._parser = new BinaryParser (data, bytes);
					this._formatter = new PPMFormatter (width, height, maxVal);
					break;
				
				default:
					throw new TypeError ('Sorry, your file format is not supported. [' + match[1] + ']');
					// return false;
			}
			
		} else {			
			throw new TypeError ('Sorry, file does not appear to be a Netpbm file.');
			// return false;
		}
	};
	
	
	// getPNG() {
	// 	var canvas = this._formatter.getCanvas (this._parser);
	// 	return Canvas2Image.saveAsPNG (canvas, true);
	// };
	
	getMonochromeBytes(): number[]{
		return this._formatter.getMonochromeBytes(this._parser)
	}
	getMonochromeBytes0(): number[]{
		console.log('parser.data=', this._parser._data)
		const result:number[]=[]
		let byte = 0;
		let bitCount = 0;
		let i = 0;

		for (let y = 0; y < this.height; y++) {
	
			for (let x = 0; x < this.width; x++) {
				let sample = this._parser.getNextSample();
				console.log(i++, sample)
	
				// Threshold: jika > 127 (abu-abu), anggap putih (0); jika gelap, anggap hitam (1)
				let bit = sample < 128 ? 0 : 1;
	
				byte = (byte << 1) | bit;
				bitCount++;
	
				if (bitCount === 8) {
					result.push(byte);
					byte = 0;
					bitCount = 0;
				}
			}
	
			// Jika ada sisa piksel < 8 di akhir baris, pad kanan dengan 0
			// if (bitCount > 0) {
			// 	byte <<= (8 - bitCount);
			// 	result.push(byte);
			// }
		}

		return result

	}
}

// type Parser = Function(data:string, bytes)
	
	

abstract class Parser {
	_data: number[];
	_bytes: number;
	_pointer: number;

    constructor(data:string, bytes:number) {
    	this._data = this.extractData(data);
    	this._bytes = bytes;
    	this._pointer = 0;
    }
	abstract extractData(data:string):number[];
	abstract getNextSample():number;


}



class ASCIIParser extends Parser {
	extractData(data:string):number[]{
		return data.split(/\s+/).map(i => parseInt(i))
	}

    getNextSample():number {
    	if (this._pointer >= this._data.length) return -1;

    	var val = 0;
    	for (var i = 0; i < this._bytes; i++) {
    		val = val * 255 + this._data[this._pointer++];
    	}

    	return val;
    }
}

class BinaryParser extends Parser {

	extractData(data:string):number[]{
		const res: number[] = [];
		for (let i = 0; i < data.length; i++) {
			res.push(data.charCodeAt(i)) ;
		}
		return res
	}

    getNextSample():number {
    	if (this._pointer >= this._data.length) return -1;

    	var val = 0;
    	for (var i = 0; i < this._bytes; i++) {
    		val = val * 255 + this._data[this._pointer++];
    	}

    	return val;
    }
}
	

	
abstract class Formatter {
    constructor(public width:number, public height:number, public maxVal:number) {}
	abstract getCanvas(parser:Parser):HTMLCanvasElement;
	abstract getMonochromeBytes(parser:Parser): number[];
}	

	
	

class PPMFormatter extends Formatter {

    getCanvas(parser:Parser) {
    	var canvas = document.createElement ('canvas'),
    		ctx:CanvasRenderingContext2D = canvas.getContext ('2d'),
    		img;

    	canvas.width =  this.width;
    	canvas.height = this.height;

    	img = ctx.getImageData (0, 0, this.width, this.height);

    	for (var row = 0; row < this.height; row++) {
    		for (var col = 0; col < this.width; col++) {

    			var factor = 255 / this.maxVal,
    				r = factor * parser.getNextSample (),
    				g = factor * parser.getNextSample (),
    				b = factor * parser.getNextSample (),
    				pos = (row * this.width + col) * 4;

    			img.data[pos] = r;
    			img.data[pos + 1] = g;
    			img.data[pos + 2] = b;
    			img.data[pos + 3] = 255;
    		}	
    	}

    	ctx.putImageData (img, 0, 0);
    	return canvas;
    }
}





class PGMFormatter extends Formatter {

    getCanvas(parser:Parser) {
    	var canvas = document.createElement ('canvas'),
    		ctx = canvas.getContext ('2d'),
    		img;

    	canvas.width = this.width;
    	canvas.height = this.height;

    	img = ctx.getImageData (0, 0, this.width, this.height);

    	for (var row = 0; row < this.height; row++) {
    		for (var col = 0; col < this.width; col++) {

    			var d = parser.getNextSample () * (255 / this.maxVal),
    				pos = (row * this.width + col) * 4;

    			img.data[pos] = d;
    			img.data[pos + 1] = d;
    			img.data[pos + 2] = d;
    			img.data[pos + 3] = 255;
    		}	
    	}

    	ctx.putImageData (img, 0, 0);
    	return canvas;
    }
}


	



class PBMFormatter extends Formatter {
	getMonochromeBytes(parser:Parser): number[] {
		const result: number[] = [];
	
		for (let y = 0; y < this.height; y++) {
			let byte = 0;
			let bitCount = 0;
			let row = []
	
			// for (let x = this.width-1; x >=0; x--) {
			for (let x = 0; x < this.width; x++) {
				let sample = parser.getNextSample();
	
				// Threshold: jika > 127 (abu-abu), anggap putih (0); jika gelap, anggap hitam (1)
				let bit = sample == 1 ? 1 : 0;
	
				// byte = (byte << 1) | bit;
				// byte |=  (bit << (8 - bitCount));
				byte |=  (bit << ( bitCount));
				bitCount++;
	
				if (bitCount === 8) {
					// row.push(byte);
					result.push(byte);
					byte = 0;
					bitCount = 0;
				}
			}
	
			// Jika ada sisa piksel < 8 di akhir baris, pad kanan dengan 0
			if (bitCount > 0) {
				// byte <<= (8 - bitCount);
				// row.push(byte);
				result.push(byte);
			}
			// row = row.reverse()
			// result.push(...row)
			// row = []
		}
	
		return result;
	}
	getMonochromeBytes0(parser:Parser): number[]{
		console.log('parser.data=', JSON.stringify( parser._data))
		const result:number[]=[]
		let byte = 0;
		let bitCount = 0;
		let i = 0;

		for (let y = 0; y < this.height; y++) {
	
			for (let x = 0; x < this.width; x++) {
				let sample = parser.getNextSample();
				console.log(i++, sample)
	
				// Threshold: jika > 127 (abu-abu), anggap putih (0); jika gelap, anggap hitam (1)
				let bit = sample == 1 ? 1 : 0;
	
				byte = (byte << 1) | bit;
				bitCount++;
	
				if (bitCount === 8) {
					result.push(byte);
					byte = 0;
					bitCount = 0;
				}
			}
	
		}
		// Jika ada sisa piksel < 8 di akhir baris, pad kanan dengan 0
		if (bitCount > 0) {
			byte <<= (8 - bitCount);
			result.push(byte);
		}

		return result

	}

    getCanvas(parser:Parser) {
    	var canvas = document.createElement ('canvas'),
    		ctx = canvas.getContext ('2d'),
    		img;

    	if (parser instanceof BinaryParser) {
    		var data = '',
    			byte,
    			bytesPerLine = Math.ceil (this.width / 8);

    		for (var i = 0; i < this.height; i++) {
    			var line = parser._data.substr (i * bytesPerLine, bytesPerLine),
    				lineData = '';

    			for (var j = 0; j < line.length; j++) lineData += ('0000000' + line.charCodeAt (j).toString (2)).substr (-8);
    			data += lineData.substr (0, this.width);
    		}

    		while ((byte = (parser.getNextSample ())) !== -1) {
    			data += ('0000000' + byte.toString (2)).substr (-8);
    		}

    		parser = new ASCIIParser (data.split ('').join (' '), 1);
    	}

    	canvas.width = this.width;
    	canvas.height = this.height;

    	img = ctx.getImageData (0, 0, this.width, this.height);

    	for (var row = 0; row < this.height; row++) {
    		for (var col = 0; col < this.width; col++) {

    			var d = (1 - parser.getNextSample ()) * 255,
    				pos = (row * this.width + col) * 4;
    			img.data[pos] = d;
    			img.data[pos + 1] = d;
    			img.data[pos + 2] = d;
    			img.data[pos + 3] = 255;
    		}	
    	}

    	ctx.putImageData (img, 0, 0);
    	return canvas;
    }
}


	


	

/*
	
	var landingZone = document.getElementById ('landing-zone'),
		imageList = document.getElementById ('image-list'),
		holder = document.getElementById ('holder');
	

	landingZone.ondragover = function (e) {
		e.preventDefault ();
		return false;	
	};

	
	landingZone.ondrop = function (e) {
		e.preventDefault ();
		
		var outstanding = 0,
			checkOutstanding = function () {
				if (!outstanding) $(landingZone).removeClass ('busy');
			};
			
		$(landingZone).addClass ('busy');
		
		
		for (var i = 0, l = e.dataTransfer.files.length; i < l; i++) {
			outstanding++;
			
			var file = e.dataTransfer.files[i],
				reader = new FileReader();
	
			reader.onload = function (event) {
				var data = event.target.result,
					img;
					
				try {
					img = new Image (data);
					addImage (img);

				} catch (e) {
					alert (e.message);
				}
			
				outstanding--;
				checkOutstanding ();
			};
		
			reader.readAsText (file);
		}
				
		return false;
	};




	function addImage (img) {
		
		var height = img.height,
			width = img.width,
			png = img.getPNG ();

		$(png).height (0).css ({
			left: '-25px'
		}).animate ({
			top: (-height / 2) + 'px',
			left: '25px',
			height: height + 'px'
		}); 
		
		var $li = $('<li>').append (png).prependTo (imageList);

		var holderHeight = height + 50;
		if ($(holder).height () < holderHeight) $(holder).animate ({ height: holderHeight + 'px' });

		var listWidth = $(imageList).width () + width + 25;
		$(imageList).width (listWidth);

		$('<span>').css ({paddingLeft:0}).appendTo ($li).animate ({ paddingLeft: width + 'px' });
	}

	
*/