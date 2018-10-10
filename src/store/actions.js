import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import {saveSearch, deleteSearch, clearSearch, savePlay, saveFavorite, deleteFavorite} from 'common/js/cache'

// 获取随机状态下，顺序列表歌曲id和随机列表歌曲id相同，返回随机列表歌曲的index
function findIndex(list, song) {
	return list.findIndex((item) => {
		return item.id === song.id
	})
}

// 顺序播放
export const selectPlay = function ({commit, state}, {list, index}) {
	commit(types.SET_SEQUENCE_LIST, list)
	if (state.mode === playMode.random) {
		let randomList = shuffle(list)
		commit(types.SET_PLAYLIST, randomList)
		index = findIndex(randomList, list[index])
	} else {
		commit(types.SET_PLAYLIST, list)
	}
	commit(types.SET_CURRENT_INDEX, index)
	commit(types.SET_FULL_SCREEN, true)
	commit(types.SET_PLAYING_STATE, true)
}

// 随机播放
export const randomPlay = function({commit}, {list}) {
	commit(types.SET_PLAY_MODE, playMode.random)
	commit(types.SET_SEQUENCE_LIST, list)
	let randomList = shuffle(list)
	commit(types.SET_PLAYLIST, randomList)
	commit(types.SET_CURRENT_INDEX, 0)
	commit(types.SET_FULL_SCREEN, true)
	commit(types.SET_PLAYING_STATE, true)
}

// 插入歌曲
export const insertSong = function({commit, state}, song) {
	let playlist = state.playlist.slice()
	let sequenceList = state.sequenceList.slice()
	let currentIndex = state.currentIndex
	// 记录当前播放歌曲
	let currentSong = playlist[currentIndex]
	// 获取带插入歌曲在播放列表中位置
	let fpIndex = findIndex(playlist, song)
	// 因为是插入歌曲到当前歌曲后面，所以索引要+1
	currentIndex++
	// 将歌曲插入到当前播放歌曲的后面
	playlist.splice(currentIndex, 0, song)
	// 如果已经包含了这首歌
	if (fpIndex > -1) {
		// 如果当前插入歌曲的索引>已存在歌曲的索引
		if (currentIndex > fpIndex) {
			playlist.splice(fpIndex, 1)
			currentIndex--
		} else {
			playlist.splice(fpIndex + 1, 1)
		}
	}

	// 获取currentSong在sequenceList中的位置，返回其坐标
	let currentSIndex = findIndex(sequenceList, currentSong) + 1

	// 获取要插入歌曲在sequenceList中的位置，返回其坐标
	let fsIndex = findIndex(sequenceList, song)

	// 将插入歌曲插入到sequenceList中
	sequenceList.splice(currentSIndex, 0, song)

	// 如果在插入歌曲前，在sequenceList中已经存在该歌曲，就进行删除
	if (fsIndex > -1) {
		if (currentIndex > fsIndex) {
			sequenceList.splice(fsIndex, 1)
		} else {
			sequenceList.splice(fsIndex + 1, 1)
		}
	}

	commit(types.SET_PLAYLIST, playlist)
	commit(types.SET_SEQUENCE_LIST, sequenceList)
	commit(types.SET_CURRENT_INDEX, currentIndex)
	commit(types.SET_FULL_SCREEN, true)
	commit(types.SET_PLAYING_STATE, true)
}

// 加入缓存
export const saveSearchHistory = function({commit}, query) {
	commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

// 删除缓存
export const deleteSearchHistory = function({commit}, query) {
	commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

export const clearSearchHistory = function({commit}) {
	commit(types.SET_SEARCH_HISTORY, clearSearch())
}

// 删除歌曲
export const deleteSong = function({commit, state}, song) {
	let playlist = state.playlist.slice()
	let sequenceList = state.sequenceList.slice()
	let currentIndex = state.currentIndex
	const pIndex = findIndex(playlist, song)
	playlist.splice(pIndex, 1)
	const sIndex = findIndex(sequenceList, song)
	sequenceList.splice(sIndex, 1)
	if (currentIndex > pIndex || currentIndex === playlist.length) {
		currentIndex--
	}
	commit(types.SET_PLAYLIST, playlist)
	commit(types.SET_SEQUENCE_LIST, sequenceList)
	commit(types.SET_CURRENT_INDEX, currentIndex)
	if (!playlist.length) {
		commit(types.SET_PLAYING_STATE, false)
	} else {
		commit(types.SET_PLAYING_STATE, true)
	}
}

export const cleatPlaylist = function({commit}) {
	commit(types.SET_PLAYLIST, [])
	commit(types.SET_SEQUENCE_LIST, [])
	commit(types.SET_CURRENT_INDEX, -1)
	commit(types.SET_PLAYING_STATE, false)
}

export const savePlayHistory = function({commit}, song) {
	commit(types.SET_PLAY_HISTORY, savePlay(song))
}

// 添加收藏
export const saveFavoriteList = function({commit}, song) {
	commit(types.SET_FAVORITE_LIST, saveFavorite(song))
}

// 删除收藏歌曲
export const deleteFavoriteList = function({commit}, song) {
	commit(types.SET_FAVORITE_LIST, deleteFavorite(song))
}
