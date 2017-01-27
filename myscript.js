listen()
re_matched = new RegExp(/:[0-9a-z_+-]+:/, "i")
re_unmatched = new RegExp(/:[0-9a-z_+-]*/, "i")

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
		    var unmatched = node.innerText.match(re_unmatched)

		  	if (matched){
		  		matched = matched[0]
		  		char = getCharacterEmoji(matched)
		  		if(char)
				  	node.innerText = node.innerText.replace(matched, char + " ")
		  	}
		  	else if(unmatched){
		    	found = search(unmatched[0].split(":")[1])
		    	if(found.length > 0)
				    createList(found, node)
		    }
		}
	});
});

function clearList() {
	    old = document.getElementById("suggestions")
	    if(old)
	    	old.remove();
	    node = document.querySelector("[typing=true]")
	    if(node) {
		    node.removeAttribute("typing")
	    }
}

function createList(items, node) {
		clearList()
		setTypingAttribute(node)

		var rect = node.getBoundingClientRect()

    	var div = document.createElement("div")
    	div.id = "suggestions"

    	var offset = 30
    	if(rect.top > window.screen.availHeight - 300)
    		offset = -items.length * 48 - 10
    	div.style.top = rect.top + window.scrollY + offset + "px"
    	div.style.left = rect.left  + "px"
    	if(node.closest("._48gf")) div.style.position = "fixed";		//stupid solution

    	var ul = document.createElement("ul")
    	for(var item in items) {
			var name = items[item]["short_name"]
			var img_url = getEmojiImage(items[item])

    		var li = document.createElement("li")
    		if(item == 0){
    			li.className = "active"
    		}
    		
	    	var p = document.createElement("p")
	    	p.innerHTML = ":" + name + ":"

	    	var img = document.createElement("img")
	    	img.src = img_url

    		li.append(p)
    		li.append(img)

    		
    		ul.append(li)
    	}
    	div.append(ul)
    	document.body.appendChild(div)

}

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

function search(s) {
	var s = s.replace("+", "\\+")
	var re = new RegExp("[0-9a-z_+-]*" + s + "[0-9a-z_+-]*")

	var found = []
	for(var key in emojis) {
		if (re.test(key)) {
			found.push(emojis[key])
		}
		if(found.length == 4)
			break;
	}
	return found.sort(function(a, b) {
		return a.short_name.length - b.short_name.length
	})
}

function getEmojiImage(item) {
	var file_name = item["image"]
	var folder_name = item["has_img_emojione"] ? "img-emojione-64" : item["has_img_apple"] ? "img-apple-64" : "img-google-64"
	return chrome.extension.getURL("assets/images/" + folder_name + "/" + file_name)
}

function setTypingAttribute(node) {
	var typing = node
	if(!node.hasAttribute("data-text"))
		typing = node.querySelector("[data-text]")
	typing.setAttribute("typing", true)
}

function listen() {
	var config = {characterData: true, subtree: true, childList: true, characterDataOldValue: true}

	setTimeout(function() {
		observer.observe(document, config)
	}, 1000)
}

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}