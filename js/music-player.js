// Music Player - Floating Music Player
// Place audio files in themes/magazine/source/music/ directory

(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    initMusicPlayer();
  });

  function initMusicPlayer() {
    const player = document.querySelector('.music-player');
    if (!player) return;

    const audio = document.querySelector('.music-player-audio');
    const mini = player.querySelector('.music-player-mini');

    // Mini controls
    const miniPlayBtn = mini.querySelector('.music-player-play');
    const miniPrevBtn = mini.querySelector('.music-player-prev');
    const miniNextBtn = mini.querySelector('.music-player-next');
    const miniTitle = mini.querySelector('.music-player-title');
    const miniArtist = mini.querySelector('.music-player-artist');
    const miniCover = mini.querySelector('.music-player-cover img');

    // Playlist data from config (stored in data attributes on the player element)
    // Since we removed the panel, we need another way to get song data.
    // We'll store it in a script tag or use the player's data attributes.
    // For simplicity, let's read from a data-songs attribute if available,
    // otherwise fallback to the old method if panel exists (it won't).

    let songs = [];
    const songsData = player.dataset.songs;
    if (songsData) {
      try {
        songs = JSON.parse(songsData);
      } catch (e) {
        console.warn('Failed to parse songs data:', e);
      }
    }

    if (songs.length === 0) {
      // No songs configured
      miniTitle.textContent = '未在播放';
      miniArtist.textContent = '请在 _config.yml 中配置歌曲';
      return;
    }

    let currentIndex = 0;
    let isPlaying = false;

    // Initialize
    loadSong(0);

    // Play/Pause
    function togglePlay() {
      if (isPlaying) {
        pause();
      } else {
        play();
      }
    }

    function play() {
      const promise = audio.play();
      if (promise !== undefined) {
        promise.then(function() {
          isPlaying = true;
          updatePlayButton();
        }).catch(function(err) {
          console.warn('Audio play failed:', err);
        });
      }
    }

    function pause() {
      audio.pause();
      isPlaying = false;
      updatePlayButton();
    }

    function updatePlayButton() {
      const icon = isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
      miniPlayBtn.innerHTML = icon;
    }

    miniPlayBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      togglePlay();
    });

    // Previous / Next
    miniPrevBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      prevSong();
    });

    miniNextBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      nextSong();
    });

    function prevSong() {
      currentIndex = (currentIndex - 1 + songs.length) % songs.length;
      loadSong(currentIndex);
      if (isPlaying) play();
    }

    function nextSong() {
      currentIndex = (currentIndex + 1) % songs.length;
      loadSong(currentIndex);
      if (isPlaying) play();
    }

    function loadSong(index) {
      const song = songs[index];
      if (!song) return;

      audio.src = song.src;
      miniTitle.textContent = song.title;
      miniArtist.textContent = song.artist || '-';
      if (song.cover) {
        miniCover.src = song.cover;
      }
    }

    // Audio events
    audio.addEventListener('ended', function() {
      nextSong();
      play();
    });

    audio.addEventListener('error', function() {
      console.warn('Audio load error for:', audio.src);
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      switch(e.code) {
        case 'Space':
          if (player.contains(document.activeElement)) return;
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            prevSong();
          }
          break;
        case 'ArrowRight':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            nextSong();
          }
          break;
      }
    });

    // Autoplay if enabled
    const autoplay = player.dataset.autoplay === 'true';
    if (autoplay && songs.length > 0) {
      setTimeout(function() {
        play();
      }, 500);
    }
  }
})();
