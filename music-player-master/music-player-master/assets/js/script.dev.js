"use strict";
/**
 * all music information
 */

var musicData = [{
  backgroundImage: "./assets/images/poster-1.jpg",
  posterUrl: "./assets/images/poster-1.jpg",
  title: "Happy Moments (Master)",
  album: "No Spirit",
  year: 2022,
  artist: "No Spirit x Tonion",
  musicPath: "./assets/music/music-1.mp3"
}, {
  backgroundImage: "./assets/images/poster-2.jpg",
  posterUrl: "./assets/images/poster-2.jpg",
  title: "Ai là người thương em",
  album: "Quân A.P",
  year: 2024,
  artist: "",
  musicPath: "./assets/music/music-2.mp3"
}, {
  backgroundImage: "./assets/images/poster-3.jpg",
  posterUrl: "./assets/images/poster-3.jpg",
  title: "Như anh đã thấy em",
  album: "P H U C X P",
  year: 2024,
  artist: "",
  musicPath: "./assets/music/music-3.mp3"
}, {
  backgroundImage: "./assets/images/poster-4.jpg",
  posterUrl: "./assets/images/poster-4.jpg",
  title: "Sợ rằng em biết anh còn yêu em",
  album: "Jun Đặng",
  year: 2022,
  artist: "",
  musicPath: "./assets/music/music-4.mp3"
}, {
  backgroundImage: "./assets/images/poster-5.jpg",
  posterUrl: "./assets/images/poster-5.jpg",
  title: "Vì ngày hôm nay em cưới rồi",
  album: "Khải Đăng",
  year: 2024,
  artist: "",
  musicPath: "./assets/music/music-5.mp3"
}];
/**
 * add eventListnere on all elements that are passed
 */

var addEventOnElements = function addEventOnElements(elements, eventType, callback) {
  for (var i = 0, len = elements.length; i < len; i++) {
    elements[i].addEventListener(eventType, callback);
  }
};
/**
 * PLAYLIST
 *
 * add all music in playlist, from 'musicData'
 */


var playlist = document.querySelector("[data-music-list]");

for (var i = 0, len = musicData.length; i < len; i++) {
  playlist.innerHTML += "\n  <li>\n    <button class=\"music-item ".concat(i === 0 ? "playing" : "", "\" data-playlist-toggler data-playlist-item=\"").concat(i, "\">\n      <img src=\"").concat(musicData[i].posterUrl, "\" width=\"800\" height=\"800\" alt=\"").concat(musicData[i].title, " Album Poster\"\n        class=\"img-cover\">\n\n      <div class=\"item-icon\">\n        <span class=\"material-symbols-rounded\">equalizer</span>\n      </div>\n    </button>\n  </li>\n  ");
}
/**
 * PLAYLIST MODAL SIDEBAR TOGGLE
 *
 * show 'playlist' modal sidebar when click on playlist button in top app bar
 * and hide when click on overlay or any playlist-item
 */


var playlistSideModal = document.querySelector("[data-playlist]");
var playlistTogglers = document.querySelectorAll("[data-playlist-toggler]");
var overlay = document.querySelector("[data-overlay]");

var togglePlaylist = function togglePlaylist() {
  playlistSideModal.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.classList.toggle("modalActive");
};

addEventOnElements(playlistTogglers, "click", togglePlaylist);
/**
 * PLAYLIST ITEM
 *
 * remove active state from last time played music
 * and add active state in clicked music
 */

var playlistItems = document.querySelectorAll("[data-playlist-item]");
var currentMusic = 0;
var lastPlayedMusic = 0;

var changePlaylistItem = function changePlaylistItem() {
  playlistItems[lastPlayedMusic].classList.remove("playing");
  playlistItems[currentMusic].classList.add("playing");
};

addEventOnElements(playlistItems, "click", function () {
  lastPlayedMusic = currentMusic;
  currentMusic = Number(this.dataset.playlistItem);
  changePlaylistItem();
});
/**
 * PLAYER
 *
 * change all visual information on player, based on current music
 */

var playerBanner = document.querySelector("[data-player-banner]");
var playerTitle = document.querySelector("[data-title]");
var playerAlbum = document.querySelector("[data-album]");
var playerYear = document.querySelector("[data-year]");
var playerArtist = document.querySelector("[data-artist]");
var audioSource = new Audio(musicData[currentMusic].musicPath);

var changePlayerInfo = function changePlayerInfo() {
  playerBanner.src = musicData[currentMusic].posterUrl;
  playerBanner.setAttribute("alt", "".concat(musicData[currentMusic].title, " Album Poster"));
  document.body.style.backgroundImage = "url(".concat(musicData[currentMusic].backgroundImage, ")");
  playerTitle.textContent = musicData[currentMusic].title;
  playerAlbum.textContent = musicData[currentMusic].album;
  playerYear.textContent = musicData[currentMusic].year;
  playerArtist.textContent = musicData[currentMusic].artist;
  audioSource.src = musicData[currentMusic].musicPath;
  audioSource.addEventListener("loadeddata", updateDuration);
  playMusic();
};

addEventOnElements(playlistItems, "click", changePlayerInfo);
/** update player duration */

var playerDuration = document.querySelector("[data-duration]");
var playerSeekRange = document.querySelector("[data-seek]");
/** pass seconds and get timcode formate */

var getTimecode = function getTimecode(duration) {
  var minutes = Math.floor(duration / 60);
  var seconds = Math.ceil(duration - minutes * 60);
  var timecode = "".concat(minutes, ":").concat(seconds < 10 ? "0" : "").concat(seconds);
  return timecode;
};

var updateDuration = function updateDuration() {
  playerSeekRange.max = Math.ceil(audioSource.duration);
  playerDuration.textContent = getTimecode(Number(playerSeekRange.max));
};

audioSource.addEventListener("loadeddata", updateDuration);
/**
 * PLAY MUSIC
 *
 * play and pause music when click on play button
 */

var playBtn = document.querySelector("[data-play-btn]");
var playInterval;

var playMusic = function playMusic() {
  if (audioSource.paused) {
    audioSource.play();
    playBtn.classList.add("active");
    playInterval = setInterval(updateRunningTime, 500);
  } else {
    audioSource.pause();
    playBtn.classList.remove("active");
    clearInterval(playInterval);
  }
};

playBtn.addEventListener("click", playMusic);
/** update running time while playing music */

var playerRunningTime = document.querySelector("[data-running-time");

var updateRunningTime = function updateRunningTime() {
  playerSeekRange.value = audioSource.currentTime;
  playerRunningTime.textContent = getTimecode(audioSource.currentTime);
  updateRangeFill();
  isMusicEnd();
};
/**
 * RANGE FILL WIDTH
 *
 * change 'rangeFill' width, while changing range value
 */


var ranges = document.querySelectorAll("[data-range]");
var rangeFill = document.querySelector("[data-range-fill]");

var updateRangeFill = function updateRangeFill() {
  var element = this || ranges[0];
  var rangeValue = element.value / element.max * 100;
  element.nextElementSibling.style.width = "".concat(rangeValue, "%");
};

addEventOnElements(ranges, "input", updateRangeFill);
/**
 * SEEK MUSIC
 *
 * seek music while changing player seek range
 */

var seek = function seek() {
  audioSource.currentTime = playerSeekRange.value;
  playerRunningTime.textContent = getTimecode(playerSeekRange.value);
};

playerSeekRange.addEventListener("input", seek);
/**
 * END MUSIC
 */

var isMusicEnd = function isMusicEnd() {
  if (audioSource.ended) {
    playBtn.classList.remove("active");
    audioSource.currentTime = 0;
    playerSeekRange.value = audioSource.currentTime;
    playerRunningTime.textContent = getTimecode(audioSource.currentTime);
    updateRangeFill();
  }
};
/**
 * SKIP TO NEXT MUSIC
 */


var playerSkipNextBtn = document.querySelector("[data-skip-next]");

var skipNext = function skipNext() {
  lastPlayedMusic = currentMusic;

  if (isShuffled) {
    shuffleMusic();
  } else {
    currentMusic >= musicData.length - 1 ? currentMusic = 0 : currentMusic++;
  }

  changePlayerInfo();
  changePlaylistItem();
};

playerSkipNextBtn.addEventListener("click", skipNext);
/**
 * SKIP TO PREVIOUS MUSIC
 */

var playerSkipPrevBtn = document.querySelector("[data-skip-prev]");

var skipPrev = function skipPrev() {
  lastPlayedMusic = currentMusic;

  if (isShuffled) {
    shuffleMusic();
  } else {
    currentMusic <= 0 ? currentMusic = musicData.length - 1 : currentMusic--;
  }

  changePlayerInfo();
  changePlaylistItem();
};

playerSkipPrevBtn.addEventListener("click", skipPrev);
/**
 * SHUFFLE MUSIC
 */

/** get random number for shuffle */

var getRandomMusic = function getRandomMusic() {
  return Math.floor(Math.random() * musicData.length);
};

var shuffleMusic = function shuffleMusic() {
  return currentMusic = getRandomMusic();
};

var playerShuffleBtn = document.querySelector("[data-shuffle]");
var isShuffled = false;

var shuffle = function shuffle() {
  playerShuffleBtn.classList.toggle("active");
  isShuffled = isShuffled ? false : true;
};

playerShuffleBtn.addEventListener("click", shuffle);
/**
 * REPEAT MUSIC
 */

var playerRepeatBtn = document.querySelector("[data-repeat]");

var repeat = function repeat() {
  if (!audioSource.loop) {
    audioSource.loop = true;
    this.classList.add("active");
  } else {
    audioSource.loop = false;
    this.classList.remove("active");
  }
};

playerRepeatBtn.addEventListener("click", repeat);
/**
 * MUSIC VOLUME
 *
 * increase or decrease music volume when change the volume range
 */

var playerVolumeRange = document.querySelector("[data-volume]");
var playerVolumeBtn = document.querySelector("[data-volume-btn]");

var changeVolume = function changeVolume() {
  audioSource.volume = playerVolumeRange.value;
  audioSource.muted = false;

  if (audioSource.volume <= 0.1) {
    playerVolumeBtn.children[0].textContent = "volume_mute";
  } else if (audioSource.volume <= 0.5) {
    playerVolumeBtn.children[0].textContent = "volume_down";
  } else {
    playerVolumeBtn.children[0].textContent = "volume_up";
  }
};

playerVolumeRange.addEventListener("input", changeVolume);
/**
 * MUTE MUSIC
 */

var muteVolume = function muteVolume() {
  if (!audioSource.muted) {
    audioSource.muted = true;
    playerVolumeBtn.children[0].textContent = "volume_off";
  } else {
    changeVolume();
  }
};

playerVolumeBtn.addEventListener("click", muteVolume);