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

    const toggleBtn = player.querySelector('.music-player-toggle');
    const toggleIcon = toggleBtn ? toggleBtn.querySelector('i') : null;

    const mini = player.querySelector('.music-player-pill');

    if (!mini) return;

    const collapseBtn = mini.querySelector('.music-player-pill-collapse');
    const collapseIcon = collapseBtn ? collapseBtn.querySelector('i') : null;

    let isPlaying = false;

    function updateIcons() {
      const collapsed = player.classList.contains('collapsed');
      if (toggleIcon) {
        toggleIcon.className = collapsed
          ? (isPlaying ? 'fas fa-pause' : 'fas fa-play')
          : 'fas fa-music';
      }
      if (collapseIcon) {
        collapseIcon.className = collapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left';
      }
    }

    function togglePlayer() {
      player.classList.toggle('collapsed');
      updateIcons();
      try {
        localStorage.setItem('music-player-collapsed', player.classList.contains('collapsed'));
      } catch (e) {}
    }

    if (toggleBtn) {
      toggleBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        togglePlayer();
      });
    }

    if (collapseBtn) {
      collapseBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        togglePlayer();
      });
    }

    // Restore collapsed state from localStorage
    try {
      if (localStorage.getItem('music-player-collapsed') === 'true') {
        player.classList.add('collapsed');
        updateIcons();
      }
    } catch (e) {}

    // Controls
    const playBtn = mini.querySelector('.music-player-play');
    const prevBtn = mini.querySelector('.music-player-prev');
    const nextBtn = mini.querySelector('.music-player-next');
    const volumeBtn = mini.querySelector('.music-player-volume-btn');
    const volumeSlider = mini.querySelector('.music-player-volume-slider');

    // Info elements
    const titleEl = mini.querySelector('.music-player-pill-title');
    const artistEl = mini.querySelector('.music-player-pill-artist');
    const coverEl = mini.querySelector('.music-player-pill-cover img');

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
      if (titleEl) titleEl.textContent = '未在播放';
      if (artistEl) artistEl.textContent = '请在 _config.yml 中配置歌曲';
      return;
    }

    let currentIndex = 0;

    // Initialize
    loadSong(0);

    // Set initial volume to 30%
    audio.volume = 0.3;
    if (volumeSlider) volumeSlider.value = 30;

    function updateVolumeIcon() {
      if (!volumeBtn) return;
      const icon = volumeBtn.querySelector('i');
      if (!icon) return;
      if (audio.volume === 0 || audio.muted) {
        icon.className = 'fas fa-volume-off';
      } else if (audio.volume < 0.5) {
        icon.className = 'fas fa-volume-down';
      } else {
        icon.className = 'fas fa-volume-up';
      }
    }

    function setVolume(value) {
      const vol = Math.max(0, Math.min(100, value)) / 100;
      audio.volume = vol;
      audio.muted = vol === 0;
      if (volumeSlider) volumeSlider.value = value;
      updateVolumeIcon();
    }

    if (volumeSlider) {
      volumeSlider.addEventListener('input', function(e) {
        e.stopPropagation();
        setVolume(parseInt(e.target.value, 10));
      });
    }

    if (volumeBtn) {
      volumeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (audio.volume > 0) {
          audio.dataset.lastVolume = audio.volume;
          setVolume(0);
        } else {
          const last = parseFloat(audio.dataset.lastVolume || '0.3');
          setVolume(Math.round(last * 100));
        }
      });
    }

    updateVolumeIcon();

    function togglePlay() {
      if (isPlaying) {
        audio.pause();
        isPlaying = false;
      } else {
        audio.play().catch(function(err) {
          console.warn('Audio play failed:', err);
        });
        isPlaying = true;
      }
      updatePlayButton();
    }

    function updatePlayButton() {
      if (!playBtn) return;
      playBtn.innerHTML = isPlaying
        ? '<i class="fas fa-pause"></i>'
        : '<i class="fas fa-play"></i>';
      updateIcons();
    }

    if (playBtn) {
      playBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        togglePlay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        prevSong();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        nextSong();
      });
    }

    function resumeIfPlaying() {
      if (isPlaying) audio.play().catch(function(){});
    }

    function prevSong() {
      currentIndex = (currentIndex - 1 + songs.length) % songs.length;
      loadSong(currentIndex);
      resumeIfPlaying();
    }

    function nextSong() {
      currentIndex = (currentIndex + 1) % songs.length;
      loadSong(currentIndex);
      resumeIfPlaying();
    }

    function loadSong(index) {
      const song = songs[index];
      if (!song) return;

      audio.src = song.src;
      if (titleEl) titleEl.textContent = song.title;
      if (artistEl) artistEl.textContent = song.artist || '-';
      if (coverEl && song.cover) {
        coverEl.src = song.cover;
      }
    }

    // Audio events
    audio.addEventListener('ended', function() {
      nextSong();
      audio.play().catch(function(){});
      isPlaying = true;
      updatePlayButton();
    });

    audio.addEventListener('error', function() {
      console.warn('Audio load error for:', audio.src);
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      switch(e.code) {
        case 'Space':
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
    if (player.dataset.autoplay === 'true') {
      setTimeout(function() {
        togglePlay();
      }, 500);
    }
  }
})();
