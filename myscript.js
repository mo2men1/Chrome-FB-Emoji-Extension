listen()

observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
  	console.log(mutation)

});


function listen() {
	var config = {characterData: true, subtree: true, childList: true, characterDataOldValue: true}

	setTimeout(function() {
		observer.observe(document, config)
	}, 1000)
}