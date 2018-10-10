import storage from 'good-storage'

// 存储搜索历史
const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15

// 存储播放历史
const PLAY_KEY = '__play__'
const PLAY_MAX_LENGTH = 200

// 收藏列表
const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LENGTH = 200

function insertArray(arr, val, compare, maxLen) {
	const index = arr.findIndex(compare)
	if (index === 0) {
		return
	}
	if (index > 0) {
		arr.splice(index, 1)
	}
	arr.unshift(val)
	if (maxLen && arr.length > maxLen) {
		arr.pop()
	}
}

function deleteSearchArray(arr, compare) {
	const index = arr.findIndex(compare)
	if (index > -1) {
		arr.splice(index, 1)
	}
}

// 存入缓存
export function saveSearch(query) {
	let searches = storage.get(SEARCH_KEY, [])
	insertArray(searches, query, (item) => {
		return item === query
	}, SEARCH_MAX_LENGTH)
	storage.set(SEARCH_KEY, searches)
	return searches
}

// 取缓存
export function loadSearch() {
	return storage.get(SEARCH_KEY, [])
}

// 删除某一条缓存
export function deleteSearch(query) {
	let searches = storage.get(SEARCH_KEY, [])
	deleteSearchArray(searches, (item) => {
		return item === query
	})
	storage.set(SEARCH_KEY, searches)
	return searches
}

// 清空缓存
export function clearSearch() {
	storage.remove(SEARCH_KEY)
	return []
}

// 存储播放历史
export function savePlay(song) {
	let songs = storage.get(PLAY_KEY, [])
	insertArray(songs, song, (item) => {
		return item.id === song.id
	}, PLAY_MAX_LENGTH)
	storage.set(PLAY_KEY, songs)
	return songs
}

// 获取播放历史
export function loadPlay() {
	return storage.get(PLAY_KEY, [])
}

// 收藏歌曲
export function saveFavorite(song) {
	let songs = storage.get(FAVORITE_KEY, [])
	insertArray(songs, song, (item) => {
		return item.id === song.id
	}, FAVORITE_MAX_LENGTH)
	storage.set(FAVORITE_KEY, songs)
	return songs
}

// 取消收藏歌曲
export function deleteFavorite(song) {
	let songs = storage.get(FAVORITE_KEY, [])
	deleteSearchArray(songs, (item) => {
		return item.id === song.id
	})
	storage.set(FAVORITE_KEY, songs)
	return songs
}

// 获取收藏歌曲
export function loadFavorite() {
	return storage.get(FAVORITE_KEY, [])
}
