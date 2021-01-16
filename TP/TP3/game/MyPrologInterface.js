class MyPrologInterface {
	constructor(gameOrchestrator) {
		this.gameOrchestrator = gameOrchestrator;
		this.getPrologRequest('handshake');
		this.receivedResponse = false;
	}
	getPrologRequest(requestString, onSuccess, onError) {
		var request = new XMLHttpRequest();
		console.log('Send request :' + requestString);
		request.open('GET', 'http://localhost:' + 8081 + '/' + requestString, true);

		request.onload = onSuccess || function (data) { console.log("Request successful. Reply: " + data.target.response); };
		request.onerror = onError || function () { console.log("Error waiting for response"); };

		request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
		request.send();
	}
}