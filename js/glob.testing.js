
function test(data, obj)
{
	
	let bTest = data ? data : "simpleTest";
	let objTest = obj ? obj : { testing : `${bTest}`};

	console.log(bTest);
	console.table(objTest);

	return;
}

