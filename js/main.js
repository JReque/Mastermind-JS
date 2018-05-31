{
	var code=[], // Secuencia de colores que se necesitan intentoFila
		codeCopy=[],
		intentoFila=[], // La secuencia de colores de la fila
		options=document.getElementsByClassName('option'),
		filas=document.getElementsByClassName('intentoFila'),
		resContent=document.getElementsByClassName('pista'),
		secretSockets=document.getElementsByClassName('secret socket'),
		pantallaFin=document.getElementById('pantallaFin'),
		mensajeFinal= document.getElementById('mensajeFinal'),
		incrementarFila = 0,
		incrementarIntento = 0,
		contador = 0,
		borrado = false;
		
		colores = {
			1: 'red',
			2: 'white',
			3: 'black',
			4: 'yellow',
			5: 'orange',
			6: 'brown',
			7: 'blue',
			8: 'green'
		};

	var mastermind=(function(){
		let init = function(){

			generateCode(1, 9);
		};

		let mostrar = function(){
			revealCode();
		}
		let comprobarCoincidencia = function() {
			let isMatch = true;
			codeCopy = code.slice(0);

			// Comprueba si posición y color son correctas
			for (let i = 0; i < code.length; i++) {
				if (intentoFila[i] === code[i]) {
					insertCheck('acierto');
					codeCopy[i] = 0;
					intentoFila[i] = -1;
				}else{
					isMatch = false;
				}
			}

			// Comprueba si la posición es correcta
			for (let j = 0; j < code.length; j++) {
				if (codeCopy.indexOf(intentoFila[j]) !== -1) {
					insertCheck('cerca');
					codeCopy[codeCopy.indexOf(intentoFila[j])] = 0;
				}
			}
			incrementarIntento += 1; 
			intentoFila = [];  // Reset intentoFila 

			return isMatch;
		}

		// Genera el código secreto
		let generateCode = function(min, max) {
			for (let i = 0; i < 4; i++)
				code[i] = Math.floor(Math.random() * (max - min)) + min;
		}

		return{
			init:init,
			generateCode:generateCode,
			mostrar:mostrar,
			comprobarCoincidencia:comprobarCoincidencia
		}
	})();

	let pintarContenedor = function() {

		//Pintamos las filas
			let fila = document.createElement('div');
			fila.className = 'intentoFila';
			document.getElementById('contentFilas').appendChild(fila);
			for (let b= 0; b < 4; b++) {
				bola = document.createElement('div');
				bola.className = 'socket';
				filas[contador].appendChild(bola);
			}
		//pintamos casillas de verificación
			intento = document.createElement('div');
			intento.className = 'pista';
			document.getElementById('contentPistas').appendChild(intento);

			for (let b = 0; b < 2; b++) {
				filaIntento = document.createElement('div');
				filaIntento.className = 'row';
				document.getElementsByClassName('pista')[contador].appendChild(filaIntento);
			}
		for (let d = 0; d < 2; d++) {
			for (let c = 0; c < 2; c++) {
				celdaIntento = document.createElement('div');
				celdaIntento.className = 'pista-socket socket';

				document.getElementsByClassName('row')[contador*2].appendChild(celdaIntento);
			}
		}
	}

	//Inserta la fila puesta por el jugador
	let insertarIntento = function() {
		borrar();

		pantallaFin=document.getElementById('pantallaFin');
		mensajeFinal= document.getElementById('mensajeFinal');
		let self = this;
		let slots = filas[(incrementarFila)].getElementsByClassName('socket');
		let slotsRemove = filas[(incrementarFila)].getElementsByClassName('socket removed');
		
		try {
			if (slotsRemove.length > 0 ) {
				for (let i = 0; i < intentoFila.length; i++) 
				{
					if (slots[i].className === 'socket removed') 
					{
						intentoFila.splice(i, 1, 'removed');
						borrado=true;			
					}
					if (intentoFila[i] == 'removed' && slots[i].className === 'socket removed') 
					{
						slots[i].className = 'socket color ' + self.id;
						intentoFila.splice(i, 1, Number(self.value));
						borrado=true;
						break;
					}				
				}
			}else {
				slots[intentoFila.length].className = slots[intentoFila.length].className + ' color ' + self.id;
				intentoFila.push(+(self.value));
				borrado === false;
			}	
		} catch( err ) {}

		//Comprobamos al pulsar el boton
		document.getElementById('comprobar').addEventListener('click', function(){
			if (intentoFila.length === 4 && borrado === false) {
					if (mastermind.comprobarCoincidencia()){
						pantallaFin.className = 'victoria';
						mensajeFinal.innerHTML = '<h2>Has descubierto el código!</h2><p>Bien! Ahora podrás dormir tranquilo</p><button class="btnfin" id="hideModal">Salir</button> <button id="restartGame" class="btnfin res">Reiniciar</button>';
						document.getElementById('hideModal').addEventListener('click', cerrar);
						document.getElementById('restartGame').addEventListener('click', reiniciar);
					}else{
						incrementarFila += 1;				
					}
					contador += 1;
					for (let i = 0; i <= filas.length-1 ; i++) {
						filas[i].disabled = true;
						filas[i].className = 'intentoFila disabledbutton';
					};
					pintarContenedor();	
			}			
		});
	}

	//Borra al hacer click
	var borrar = function() {
		let classname = document.getElementsByClassName('socket');
		
		let myFunction = function() {
			
			let classtype = this.getAttribute('class');
			if (classtype.substring(0, 12) == 'socket color' ) {
				classtype = this.className = 'socket removed';
			}
		};
		Array.from(classname).forEach(function(element) {
			element.addEventListener('click', myFunction);
		});
	}
	
	//Inserta la respuesta de la comprobación
	let insertCheck = function(type) { 
		let sockets = resContent[incrementarIntento].getElementsByClassName('pista-socket');
		sockets[0].className = 'socket ' + type;
	}

	// borrar el ultimo
	let deleteLast = function() {
		if (intentoFila.length !== 0) {
			let slots = filas[incrementarFila].getElementsByClassName('socket');
			slots[intentoFila.length - 1].className = 'socket';
			intentoFila.pop();
		}
	}

	// Revela el resultado
	let revealCode = function() {
		for (let i = 0; i < secretSockets.length; i++) {
			secretSockets[i].className += ' ' + colores[code[i]];
			secretSockets[i].innerHTML = '';
		}
	}
  
	// Funcion para reiniciar
	let reiniciar = function() {
		location.reload();
	}

	// Configuracion del juego
	let gameSetup = function () {
		//Pintamos código a revelar
		let fila = document.createElement('div');
		fila.className = 'code';
		document.getElementById('contentFilas').appendChild(fila);
		for (b= 0; b < 4; b++) {
			bola = document.createElement('div');
			bola.className = 'secret socket';
			let secret = document.createTextNode('?');   
			bola.appendChild(secret);   
			document.getElementsByClassName('code')[0].appendChild(bola);
		}

		pintarContenedor();
		// Añadir colores al contenedor
		for (let i = 0; i < options.length; i++)
			options[i].addEventListener('click', insertarIntento, false);

		document.getElementById('newGame').addEventListener('click', reiniciar, false);
		document.getElementById('delete').addEventListener('click', deleteLast, false);
	}

	let cerrar = function  () {
		window.close();
	}

	// Ejecutar juego
	var init=function(){
		mastermind.init();
		gameSetup();
		borrar();
		//pintarContenedor();

	}
	window.addEventListener('load',init);
}
