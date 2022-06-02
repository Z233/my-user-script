// ==UserScript==
// @name         MOji-to-Supermemo
// @namespace    http://tampermonkey.net/
// @version      0.1.1
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
		const word = wordEl.textContent

		const pronEl = document.querySelector('#__layout > div > div.searchPage-container.nuxt > div.main-content.division > div.box-detail > div > div > div.head > div.pron.jp-font')
		const pron = pronEl.textContent

		const detailListEls = document.querySelectorAll('.el-collapse[role=tablist]')
		const detailList = [...detailListEls].reduce((acc, el) => {
			const detail = el.querySelector('div > p').textContent
			acc = { ...acc, [detail]: [] }

			const exampleEls = el.querySelectorAll('.example-info')
			Array.from(exampleEls).forEach(exampleEl => acc[detail].push(exampleEl.textContent))
			return acc
		}, {})

		let detailStr = ``
		for (const detail in detailList) {
			detailStr += detail + '\n\n'
			detailList[detail].forEach(example => detailStr += '- ' + example + '\n')
			detailStr += '\n'
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
