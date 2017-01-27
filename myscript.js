listen()
re_matched = new RegExp(/:[0-9a-z_+-]+:/, "i")

observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
  	var node = mutation.target.parentElement
  	var interested = null
  	if (node) {
	    interested = node.hasAttribute("data-offset-key") || node.hasAttribute("data-text")
  	}

  	if(interested) { 
  		clearList()
	  	var matched = node.innerText.match(re_matched)

	  	if (matched){
	  		matched = matched[0]
	  		char = getCharacterEmoji(matched)
	  		if(char)
			  	node.innerText = node.innerText.replace(matched, char + " ")
	  	}
	}

});

function getCharacterEmoji(key) {
	var key = key.split(":")[1]
	var emoji = emojis[key]
	var value = null
	if(emoji) {
		value = emoji["unified"].split("-")
	  	value = String.fromCodePoint("0x"+ value[0])
	}
	return value
}

function listen() {
	var config = {characterData: true, subtree: true, childList: true, characterDataOldValue: true}

	setTimeout(function() {
		observer.observe(document, config)
	}, 1000)
}