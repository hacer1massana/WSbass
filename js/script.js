// se instancia el aCtx fuera, para activarlo solo en el onclick ya que se queja el navegador, las funciones de audio son mejor que se hagan por interaccion no automaticamente.
let audioContext = new Object(null);

// como si encendieramos una maquina, pero en este caso es solo para el testing
function startStop()
{

	audioContext = audioContext =! null ? new AudioContext : null;

	return;//test(audioContext);
}

// primer paso para el refactoring posterior, entendiendo que params o que objetos son mas globales y cuales pueden ser más constantes.
function audioParams()
{
	return { 	
				oscillator : audioContext.createOscillator(), 
				gainNode : audioContext.createGain()
			};

}

// tratando de desglosar el filter, primer testing para poder entender el filter
function desfrag()
{
	startStop();
	time = audioContext.currentTime;
	frequency = 79.80;
	duration = 10;

	aCtx = new audioParams();

	aCtx.oscillator.type = 'sine';
	aCtx.oscillator.frequency.setValueAtTime(frequency, time);


	//amplitude

	aCtx.gainNode.gain.setValueAtTime(0, time);
	aCtx.gainNode.gain.linearRampToValueAtTime(3, time + 0.2);

	//quick attack

	aCtx.gainNode.gain.exponentialRampToValueAtTime(0.5, time + duration + 0.5);//sustain
	aCtx.gainNode.gain.exponentialRampToValueAtTime(0.1, time + duration);//attack




	aCtx.oscillator.connect(aCtx.gainNode);
	aCtx.gainNode.connect(audioContext.destination);


	aCtx.oscillator.start(time);
	aCtx.oscillator.stop(time + duration);

}


//const audioContext = new AudioContext();



//generar una nota de bajo simple sin efectos (filtros o pluck so on)
function playBassNote(frequency, duration, time)
{

	aContext = new audioParams();

	aContext.oscillator.type = 'sine';
	aContext.oscillator.frequency.setValueAtTime(frequency, time);


	//amplitude

	aContext.gainNode.gain.setValueAtTime(0, time);
	aContext.gainNode.gain.linearRampToValueAtTime(1, time + 0.02);

	//quick attack

	aContext.gainNode.gain.exponentialRampToValueAtTime(0.5, time + duration + 0.5);//sustain
	aContext.gainNode.gain.exponentialRampToValueAtTime(0.001, time + duration);//attack

	aContext.oscillator.connect(aContext.gainNode);
	aContext.gainNode.connect(audioContext.destination);


	aContext.oscillator.start(time);
	aContext.oscillator.stop(time + duration);


	return;//test(duration, frequency);
}

// function que nos da el deepseek para generar un filtro 
function playBassNoteWFilter(frequency, duration, time)
{
	const oscillator = audioContext.createOscillator();
	const gainNode = audioContext.createGain();
	const filter = audioContext.createBiquadFilter();

	oscillator.type = 'sine';
	oscillator.frequency.setValueAtTime(frequency, time);

	//filter settings

	filter.type = 'lowpass';
	filter.frequency.setValueAtTime(200, time); //start cutoff
	filter.frequency.exponentialRampToValueAtTime(1000, time + 0.1);//slight sweep

	//amplitude

	gainNode.gain.setValueAtTime(0, time);
	gainNode.gain.linearRampToValueAtTime(1, time + 0.02);
	gainNode.gain.exponentialRampToValueAtTime(0.5, time + duration * 0.5);
	gainNode.gain.exponentialRampToValueAtTime(0.001, time + duration);

// posibilidad de refactorizar los connect y los start/stop

	oscillator.connect(filter);
	filter.connect(gainNode);
	gainNode.connect(audioContext.destination);

	oscillator.start(time);
	oscillator.stop(time +  duration);

	return;//test(duration, frequency);
}

// semi refactorizado ya que pluck es una continuacion del filter mas buffer.
function playBassNoteWPluck(frequency, duration, time)
{

	playBassNoteWFilter(frequency, duration, time);

	//adding the pluck

	const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.02, audioContext.sampleRate);
	const noiseData = noiseBuffer.getChannelData(0);
	
	for (let i = 0; i < noiseData.length; i++) 
	{
		noiseData[i] = Math.random() * 2 - 1;
	}

	const noiseSource = audioContext.createBufferSource();
	const noiseGain = audioContext.createGain();

	noiseSource.buffer = noiseBuffer;
	noiseGain.gain.setValueAtTime(0.5, time);
	noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.02);

	noiseSource.connect(noiseGain);
	noiseGain.connect(audioContext.destination);

	noiseSource.start(time);
	noiseSource.stop(time + 0.02);

	return;//test(duration, frequency);
}

// aqui es donde se le puede pasar una "partitura"
function playBassLine(notesObj)
{

	//TODO const tabToFrequency;

	const tempo = 120;
	const secondsPerBeat = 60 / tempo;
	const startTime = audioContext.currentTime + 0.1;

	const notes = notesObj ? notesObj : [ { frequency : 82.41, duration : 0.5 } ];
	
	//for(var i = 0; i< 3; i++){

		notes.forEach((note, index) => 
		{
			playBassNote(note.frequency, note.duration, startTime + index * secondsPerBeat);
		});
	//}
}

// los valores actuales son referecnias de la frecuencia en gh en contraste con las notas existentes
// pero aun no se han unido las notas reales con las frecuencias es decir, E = ?,
// faltaria el TODO de tab to Frequency.

const wsBass = 
[
	{ frequency : 73.42, duration : 1 },
	{ frequency : 73.42, duration : 1 },
	{ frequency : 116.54, duration : 1 },
	{ frequency : 73.42, duration : 1 },
	{ frequency : 65.41, duration : 1 },
	{ frequency : 61.74, duration : 2 },
	{ frequency : 58.27, duration : 2 },
	{ frequency : 73.42, duration : 0.5 },
	{ frequency : 73.42, duration : 0.5 },
	{ frequency : 116.54, duration : 0.5 },
	{ frequency : 73.42, duration : 0.5 },
	{ frequency : 65.41, duration : 0.5 },
	{ frequency : 61.74, duration : 2 },
	{ frequency : 58.27, duration : 2 },
	{ frequency : 73.42, duration : 0.5 },
	{ frequency : 73.42, duration : 0.5 },
	{ frequency : 116.54, duration : 0.5 },
	{ frequency : 73.42, duration : 0.5 },
	{ frequency : 65.41, duration : 0.5 },
	{ frequency : 61.74, duration : 2 },
	{ frequency : 58.27, duration : 2 },
	{ frequency : 73.42, duration : 1 },
	{ frequency : 73.42, duration : 1 },
	{ frequency : 116.54, duration : 1 },
	{ frequency : 73.42, duration : 1 },
	{ frequency : 65.41, duration : 1 },
	{ frequency : 61.74, duration : 2 },
	{ frequency : 58.27, duration : 2 }
];

// testing dos, con el setInterval, para que la melodia o el oscilador 
// toque una y otra vez lo mismo
// resultados de como se solapan y se unen 
// aun por entender pero mola.

let setTime;
let counter = 0;
function tryIt()
{
	if(counter == 0)
	{
	playBassNoteWFilter(41.20, 5, audioContext.currentTime);
	
	counter++;
	} else if (counter == 1)
	{
	playBassNoteWFilter(73.42, 2, audioContext.currentTime);
	counter++;
	} else if (counter == 2)
	{
	playBassNoteWPluck(41.20, 5, audioContext.currentTime);
	counter = 0;
	}
	desfrag();

}

function startTime()
{
	setTime = setInterval(tryIt, 1000 );
}


function clearTime()
{
	clearInterval(setTime);
}



















