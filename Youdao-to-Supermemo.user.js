// ==UserScript==
// @name         Youdao-to-Supermemo
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @updateURL    https://github.com/Z233/userscript/raw/main/Youdao-to-Supermemo.user.js
// @downloadURL  https://github.com/Z233/userscript/raw/main/Youdao-to-Supermemo.user.js
// @description  https://getquicker.net/Sharedaction?code=f4d4f1b3-11b8-4d48-7e17-08da43e01676
// @author       Fronz
// @match        https://www.youdao.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youdao.com
// @require      https://gist.githubusercontent.com/adamhotep/7c9068f2196326ab79145ae308b68f9e/raw/waitForKeyElements.js
// @grant        none
// ==/UserScript==

(function(waitForKeyElements) {
	'use strict';
	waitForKeyElements('.word-book_operate', function(el) {
		console.log(el)
		const dummyDiv = document.createElement('div')
		dummyDiv.innerHTML = `<span style="cursor: pointer; font-size: 24px; position: relative; bottom: 4px; left: 6px;" title="导入 SuperMemo"><i style="color: var(--color-primary);" class="el-icon-download"></i></span>`

		const importButton = dummyDiv.firstChild
		importButton.onclick = function handleImport() {
			const data = getWordCard()
			importToSuperMemo(data)
		}
		el.appendChild(importButton)
	})

	function getWordCard() {
		const wordEl = document.querySelector('.word-head .title')
		const word = wordEl.innerText

		const symbolEl = document.querySelectorAll('.per-phone')[0]
		const symbol = symbolEl.textContent

		const definitionEls = document.querySelectorAll('.trans-container .basic .word-exp')
		const definitions = Array.from(definitionEls).map(el => el.textContent)

		const sentenceEls = document.querySelectorAll('.blng_sents_part .trans-container .col2')
		const sentences = Array.from(sentenceEls).map(el => '-&nbsp;' + el.textContent)

		return {
			front: `${word}<br><div style="color: #a0a0a0; font-size: 14px;">${symbol}</div>`,
			back: definitions.join('<br>') + '<br><br>' + sentences.join('<br>'),
			word: word,
			audioUrl: `https://dict.youdao.com/dictvoice?audio=${word}&type=1`
		}
	
	}

	function importToSuperMemo(data) {
			const dataJson = JSON.stringify(data)
			const type = 'text/plain'
			const blob = new Blob([dataJson], { type })
			const clipboardData = [new ClipboardItem({ [type]: blob })]
			navigator.clipboard.write(clipboardData).then(
				function () {
					window.open(`quicker:runaction:从有道词典导入单词`, '_self'
					)
				},
				function (e) {
					/* failure */
					console.log(e)
					alert('Import Fail!')
				}
			).catch(e => thorw(e))
	}

})(waitForKeyElements);
