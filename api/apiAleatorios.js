const generarNumerosAleatorios = require("../helpers/generarNumerosAleatorios");
const contarRepetidos = require("../helpers/contarRepetidos");

const apiAleatorios = (cantidad) => {
  
    const arrayAleatorios = new Array(cantidad);

    for (let index = 0; index < cantidad; index++)
      arrayAleatorios[index] = generarNumerosAleatorios();

	console.log("-------------------------------ARRAY----------------------");
	console.log(arrayAleatorios);

	const objetoRepetidos = contarRepetidos(arrayAleatorios);
	console.log("---------------------OBJETO REPETIDOS----------------------");
	console.log(objetoRepetidos);
	return objetoRepetidos;

};

process.on("message", (cantidad) =>{
	if(cantidad){
		const objRepetidos = apiAleatorios(cantidad);
		process.send(objRepetidos);
	}else{
		console.log("No inicio la funcion");
	}
	

})
