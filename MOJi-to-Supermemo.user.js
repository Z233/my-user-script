// ==UserScript==
// @name         MOJi-to-Supermemo
// @namespace    http://tampermonkey.net/
// @version      0.1.6
// @updateURL    https://github.com/Z233/userscript/raw/main/MOji-to-Supermemo.user.js
// @downloadURL  https://github.com/Z233/userscript/raw/main/MOji-to-Supermemo.user.js
// @description  https://getquicker.net/Sharedaction?code=f4d4f1b3-11b8-4d48-7e17-08da43e01676
// @author       Fronz
// @match        https://www.mojidict.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mojidict.com
// @require      https://gist.githubusercontent.com/adamhotep/7c9068f2196326ab79145ae308b68f9e/raw/waitForKeyElements.js
// @grant        none
// ==/UserScript==

(function(waitForKeyElements) {
	'use strict';
	waitForKeyElements('.tools-container', function(el) {
		console.log(el)
		const dummyDiv = document.createElement('div')
		dummyDiv.innerHTML = `<div style="cursor: pointer" class="icon-wrap" title="导入 SuperMemo"><i style="color: var(--color-primary); font-size: 20px" class="el-icon-download"></i></div>`

		const importButton = dummyDiv.firstChild
		importButton.onclick = function handleImport() {
			const { front, back } = getWordCard()
			importToSuperMemo(front, back)
		}
		el.appendChild(importButton)
	})

	function getWordCard() {
		const wordEl = document.querySelector('#spell')
		const word = wordEl.innerText.replace('\n', '')

		const pronEl = document.querySelector('div.head div.pron')
		const pron = pronEl.innerText.replace('\n', '')

		const detailListEls = document.querySelectorAll('.trans-box > div[id]')
		const detailList = [...detailListEls].reduce((acc, el) => {
			const detail = el.querySelector('div > p').textContent
			acc = { ...acc, [detail]: [] }

			const exampleEls = el.querySelectorAll('.example-info')
			Array.from(exampleEls).forEach(exampleEl => acc[detail].push(exampleEl.firstChild.innerHTML + ' | ' + exampleEl.lastChild.innerText))
			return acc
		}, {})

		let detailStr = ``
		for (const detail in detailList) {
			detailStr += `<p>${detail}</p>`
			detailList[detail].forEach(example => detailStr += '- ' + example + '<br>')
			detailStr += '<br>'
		}

		const front = word
		const back = `${pron}\n\n${detailStr}`

		console.log(front)
		console.log(back)

		return {
			front, back
		}
	}

	function importToSuperMemo(front, back) {
			const dataJson = JSON.stringify({ front, back })
			const type = 'text/plain'
			const blob = new Blob([dataJson], { type })
			const data = [new ClipboardItem({ [type]: blob })]
			navigator.clipboard.write(data).then(
				function () {
					window.open(`quicker:runaction:从剪贴板创建问答卡`, '_self'
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
