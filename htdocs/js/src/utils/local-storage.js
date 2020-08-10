 /*
  * This file is part of evQueue
  *
  * evQueue is free software: you can redistribute it and/or modify
  * it under the terms of the GNU General Public License as published by
  * the Free Software Foundation, either version 3 of the License, or
  * (at your option) any later version.
  *
  * evQueue is distributed in the hope that it will be useful,
  * but WITHOUT ANY WARRANTY; without even the implied warranty of
  * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  * GNU General Public License for more details.
  *
  * You should have received a copy of the GNU General Public License
  * along with evQueue. If not, see <http://www.gnu.org/licenses/>.
  *
  * Author: Thibault Kummer
  */
 
'use strict';

export class LS {
	static get(key) {
		if(typeof(browser)=='undefined')
		{
			return new Promise((resolve, reject) => {
				chrome.storage.local.get(key, (data) => {
					resolve(data);
				});
			});
		}
		
		return browser.storage.local.get(key);
	}
	
	static set(obj) {
		if(typeof(browser)=='undefined')
			return chrome.storage.local.set(obj);
		return browser.storage.local.set(obj);
	}
}