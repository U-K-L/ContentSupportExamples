var AudioManager;

AudioManager = (function() {

  /**
  * Manages the audio playback of the game. 
  *
  * @module gs
  * @class AudioManager
  * @memberof gs
  * @constructor
   */
  function AudioManager() {

    /**
    * Stores all audio buffers.
    * @property buffers
    * @type gs.AudioBuffer[]
    * @protected
     */
    this.audioBuffers = [];

    /**
    * Stores all audio buffers by layer.
    * @property buffers
    * @type gs.AudioBuffer[]
    * @protected
     */
    this.audioBuffersByLayer = [];

    /**
    * Stores all audio buffer references for sounds.
    * @property soundReferences
    * @type gs.AudioBufferReference[]
    * @protected
     */
    this.soundReferences = {};

    /**
    * Current Music (Layer 0)
    * @property music
    * @type Object
    * @protected
     */
    this.music = null;

    /**
    * Current music volume.
    * @property musicVolume
    * @type number
    * @protected
     */
    this.musicVolume = 100;

    /**
    * Current sound volume.
    * @property soundVolume
    * @type number
    * @protected
     */
    this.soundVolume = 100;

    /**
    * Current voice volume.
    * @property voiceVolume
    * @type number
    * @protected
     */
    this.voiceVolume = 100;

    /**
    * General music volume
    * @property generalMusicVolume
    * @type number
    * @protected
     */
    this.generalMusicVolume = 100;

    /**
    * General sound volume
    * @property generalSoundVolume
    * @type number
    * @protected
     */
    this.generalSoundVolume = 100;

    /**
    * General voice volume
    * @property generalVoiceVolume
    * @type number
    * @protected
     */
    this.generalVoiceVolume = 100;

    /**
    * Stores audio layer info-data for each layer.
    * @property audioLayers
    * @type gs.AudioLayerInfo[]
    * @protected
     */
    this.audioLayers = [];
  }


  /**
  * Restores audio-playback from a specified array of audio layers.
  *
  * @method restore
  * @param {gs.AudioLayerInfo[]} layers - An array of audio layer info objects.
   */

  AudioManager.prototype.restore = function(layers) {
    var i, j, layer, len, results;
    this.audioLayers = layers;
    results = [];
    for (i = j = 0, len = layers.length; j < len; i = ++j) {
      layer = layers[i];
      if (layer && layer.playing) {
        if (layer.customData) {
          results.push(this.playMusicRandom(layer, layer.customData.fadeTime, i, layer.customData.playTime, layer.customData.playRange));
        } else {
          results.push(this.playMusic(layer, layer.fadeInTime, i));
        }
      } else {
        results.push(void 0);
      }
    }
    return results;
  };


  /**
  * Loads the specified music.
  *
  * @method loadMusic
  * @param {String} name - The name of the music to load.
   */

  AudioManager.prototype.loadMusic = function(name) {
    name = name != null ? name.name || name : name;
    if (name && name.length > 0) {
      return ResourceManager.getAudioStream("Audio/Music/" + name);
    }
  };


  /**
  * Loads the specified sound.
  *
  * @method loadSound
  * @param {String} name - The name of the sound to load.
   */

  AudioManager.prototype.loadSound = function(name) {
    name = name != null ? name.name || name : name;
    if (name && name.length > 0) {
      return ResourceManager.getAudioBuffer("Audio/Sounds/" + name);
    }
  };


  /**
  * Updates a randomly played audio buffer.
  *
  * @method updateRandomAudio
  * @param {gs.AudioBuffer} buffer - The audio buffer to update.
  * @protected
   */

  AudioManager.prototype.updateRandomAudio = function(buffer) {
    var currentTime, timeLeft;
    if (buffer.customData.startTimer > 0) {
      buffer.customData.startTimer--;
      if (buffer.customData.startTimer <= 0) {
        buffer.fadeInVolume = 1.0 / (buffer.customData.fadeTime || 1);
        buffer.fadeInTime = buffer.customData.fadeTime || 1;
        buffer.fadeOutTime = buffer.customData.fadeTime || 1;
        buffer.playTime = buffer.customData.playTime.min + Math.random() * (buffer.customData.playTime.max - buffer.customData.playTime.min);
        currentTime = buffer.currentTime;
        timeLeft = buffer.duration - currentTime;
        buffer.playTime = Math.min(timeLeft * 1000 / 16.6, buffer.playTime);
        return buffer.customData.startTimer = buffer.playTime + buffer.customData.playRange.start + Math.random() * (buffer.customData.playRange.end - buffer.customData.playRange.start);
      }
    }
  };


  /**
  * Updates all audio-buffers depending on the play-type.
  *
  * @method updateAudioBuffers
  * @protected
   */

  AudioManager.prototype.updateAudioBuffers = function() {
    var buffer, j, len, ref, results;
    ref = this.audioBuffers;
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      buffer = ref[j];
      if (buffer != null) {
        if (buffer.customData.playType === 1) {
          this.updateRandomAudio(buffer);
        }
        if (GameManager.settings.bgmVolume !== this.generalMusicVolume) {
          buffer.volume = (this.musicVolume * GameManager.settings.bgmVolume / 100) / 100;
          this.generalMusicVolume = GameManager.settings.bgmVolume;
        }
        results.push(buffer.update());
      } else {
        results.push(void 0);
      }
    }
    return results;
  };


  /**
  * Updates all audio-buffers depending on the play-type.
  *
  * @method updateAudioBuffers
  * @protected
   */

  AudioManager.prototype.updateGeneralVolume = function() {
    var k, reference, results;
    if (GameManager.settings.seVolume !== this.generalSoundVolume || GameManager.settings.voiceVolume !== this.generalVoiceVolume) {
      this.generalSoundVolume = GameManager.settings.seVolume;
      this.generalVoiceVolume = GameManager.settings.voiceVolume;
      results = [];
      for (k in this.soundReferences) {
        results.push((function() {
          var j, len, ref, results1;
          ref = this.soundReferences[k];
          results1 = [];
          for (j = 0, len = ref.length; j < len; j++) {
            reference = ref[j];
            if (reference.voice) {
              results1.push(reference.volume = (this.voiceVolume * GameManager.settings.voiceVolume / 100) / 100);
            } else {
              results1.push(reference.volume = (this.soundVolume * GameManager.settings.seVolume / 100) / 100);
            }
          }
          return results1;
        }).call(this));
      }
      return results;
    }
  };


  /**
  * Updates the audio-playback.
  *
  * @method update
   */

  AudioManager.prototype.update = function() {
    this.updateAudioBuffers();
    return this.updateGeneralVolume();
  };


  /**
  * Changes the current music to the specified one.
  *
  * @method changeMusic
  * @param {Object} music - The music to play. If <b>null</b> the current music will stop playing.
   */

  AudioManager.prototype.changeMusic = function(music) {
    if ((music != null) && (music.name != null)) {
      if ((this.music != null) && this.music.name !== music.name) {
        return this.playMusic(music);
      } else if (this.music == null) {
        return this.playMusic(music);
      }
    } else {
      return this.stopMusic();
    }
  };


  /**
  * Prepares. 
  *
  * @method prepare
  * @param {Object} music - The music to play. If <b>null</b> the current music will stop playing.
   */

  AudioManager.prototype.prepare = function(path, volume, rate) {
    var buffer;
    buffer = ResourceManager.getAudioBuffer(path);
    if (buffer.decoded) {
      buffer.volume = volume != null ? volume / 100 : 1.0;
      buffer.playbackRate = rate != null ? rate / 100 : 1.0;
    } else {
      buffer.onFinishDecode = (function(_this) {
        return function(source) {
          source.volume = volume != null ? volume / 100 : 1.0;
          return source.playbackRate = rate != null ? rate / 100 : 1.0;
        };
      })(this);
      buffer.decode();
    }
    return buffer;
  };


  /**
  * Plays an audio resource.
  *
  * @method play
  * @param {String} path - The path to the audio resource.
  * @param {number} volume - The volume.
  * @param {number} rate - The playback rate.
  * @param {number} fadeInTime - The fade-in time in frames.
   */

  AudioManager.prototype.play = function(path, volume, rate, fadeInTime) {
    var buffer;
    buffer = ResourceManager.getAudioStream(path);
    if (buffer.decoded) {
      buffer.volume = volume != null ? volume / 100 : 1.0;
      buffer.playbackRate = rate != null ? rate / 100 : 1.0;
      if (GameManager.settings.bgmEnabled) {
        buffer.play(fadeInTime);
      }
    } else {
      buffer.onFinishDecode = (function(_this) {
        return function(source) {
          source.volume = volume != null ? volume / 100 : 1.0;
          source.playbackRate = rate != null ? rate / 100 : 1.0;
          if (GameManager.settings.bgmEnabled) {
            return source.play(fadeInTime);
          }
        };
      })(this);
      buffer.decode();
    }
    return buffer;
  };


  /**
  * Stops all sounds.
  *
  * @method stopAllSounds
   */

  AudioManager.prototype.stopAllSounds = function() {
    var k, reference, results;
    results = [];
    for (k in this.soundReferences) {
      results.push((function() {
        var j, len, ref, results1;
        ref = this.soundReferences[k];
        results1 = [];
        for (j = 0, len = ref.length; j < len; j++) {
          reference = ref[j];
          results1.push(reference != null ? reference.stop() : void 0);
        }
        return results1;
      }).call(this));
    }
    return results;
  };


  /**
  * Stops a sound and all references of it.
  *
  * @method stopSound
  * @param {String} name - The name of the sound to stop.
   */

  AudioManager.prototype.stopSound = function(name) {
    var j, len, ref, reference, results;
    if (this.soundReferences[name] != null) {
      ref = this.soundReferences[name];
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        reference = ref[j];
        results.push(reference.stop());
      }
      return results;
    }
  };


  /**
  * Stops a voice.
  *
  * @method stopVoice
  * @param {String} name - The name of the voice to stop.
   */

  AudioManager.prototype.stopVoice = function(name) {
    return this.stopSound(name);
  };


  /**
  * Stops all voices.
  *
  * @method stopAllVoices
   */

  AudioManager.prototype.stopAllVoices = function() {
    var k, reference, results;
    results = [];
    for (k in this.soundReferences) {
      results.push((function() {
        var j, len, ref, results1;
        ref = this.soundReferences[k];
        results1 = [];
        for (j = 0, len = ref.length; j < len; j++) {
          reference = ref[j];
          if (reference.voice) {
            results1.push(reference.stop());
          } else {
            results1.push(void 0);
          }
        }
        return results1;
      }).call(this));
    }
    return results;
  };


  /**
  * Plays a voice.
  *
  * @method playVoice
  * @param {String} name - The name of the voice to play.
  * @param {number} volume - The voice volume.
  * @param {number} rate - The voice playback rate.
   */

  AudioManager.prototype.playVoice = function(name, volume, rate) {
    var ref, voice;
    voice = null;
    if (GameManager.settings.voiceEnabled && !((ref = $PARAMS.preview) != null ? ref.settings.voiceDisabled : void 0)) {
      voice = this.playSound(name != null ? name.name : void 0, volume || GameManager.defaults.audio.voiceVolume, rate || GameManager.defaults.audio.voicePlaybackRate, false, true);
    }
    return voice;
  };


  /**
  * Plays a sound.
  *
  * @method playSound
  * @param {String} name - The name of the sound to play.
  * @param {number} volume - The sound's volume.
  * @param {number} rate - The sound's playback rate.
  * @param {boolean} musicEffect - Indicates if the sound should be played as a music effect. In that case, the current music
  * at audio-layer will be paused until the sound finishes playing.
  * @param {boolean} voice - Indicates if the sound should be handled as a voice.
   */

  AudioManager.prototype.playSound = function(name, volume, rate, musicEffect, voice) {
    var buffer, j, len, r, ref, ref1, reference;
    if ((ref = $PARAMS.preview) != null ? ref.settings.soundDisabled : void 0) {
      return;
    }
    if ((name == null) || (!voice && !GameManager.settings.soundEnabled)) {
      return;
    }
    if (name.name != null) {
      volume = name.volume;
      rate = name.playbackRate;
      name = name.name;
    }
    if (name.length === 0) {
      return;
    }
    if (musicEffect) {
      this.stopMusic();
    }
    if (this.soundReferences[name] == null) {
      this.soundReferences[name] = [];
    }
    volume = volume != null ? volume : 100;
    volume *= voice ? this.generalVoiceVolume / 100 : this.generalSoundVolume / 100;
    reference = null;
    ref1 = this.soundReferences[name];
    for (j = 0, len = ref1.length; j < len; j++) {
      r = ref1[j];
      if (!r.isPlaying) {
        reference = r;
        if (musicEffect) {
          reference.onEnd = (function(_this) {
            return function() {
              return _this.resumeMusic(40);
            };
          })(this);
        }
        reference.voice = voice;
        reference.volume = volume / 100;
        reference.playbackRate = rate / 100;
        if (voice) {
          this.voice = reference;
        }
        reference.play();
        break;
      }
    }
    if (reference == null) {
      buffer = ResourceManager.getAudioBuffer("Audio/Sounds/" + name);
      if (buffer && buffer.loaded) {
        if (buffer.decoded) {
          reference = new GS.AudioBufferReference(buffer, voice);
          if (musicEffect) {
            reference.onEnd = (function(_this) {
              return function() {
                return _this.resumeMusic(40);
              };
            })(this);
          }
          reference.volume = volume / 100;
          reference.playbackRate = rate / 100;
          reference.voice = voice;
          reference.play();
          if (voice) {
            this.voice = reference;
          }
          this.soundReferences[name].push(reference);
        } else {
          buffer.name = name;
          buffer.onDecodeFinish = (function(_this) {
            return function(source) {
              reference = new GS.AudioBufferReference(source, voice);
              if (musicEffect) {
                reference.onEnd = function() {
                  return _this.resumeMusic(40);
                };
              }
              reference.voice = voice;
              reference.volume = volume / 100;
              reference.playbackRate = rate / 100;
              if (voice) {
                _this.voice = reference;
              }
              reference.play();
              return _this.soundReferences[source.name].push(reference);
            };
          })(this);
          buffer.decode();
        }
      }
    }
    return reference;
  };


  /**
  * Plays a music as a random music. A random music will fade-in and fade-out
  * at random times. That can be combined with other audio-layers to create a
  * much better looping of an audio track.
  *
  * @method playMusicRandom
  * @param {Object} music - The music to play.
  * @param {number} fadeTime - The time for a single fade-in/out in frames.
  * @param {number} layer - The audio layer to use.
  * @param {gs.Range} playTime - Play-Time range like 10s to 30s.
  * @param {gs.Range} playRange - Play-Range.
   */

  AudioManager.prototype.playMusicRandom = function(music, fadeTime, layer, playTime, playRange) {
    var musicBuffer, ref, volume;
    if ((ref = $PARAMS.preview) != null ? ref.settings.musicDisabled : void 0) {
      return;
    }
    layer = layer != null ? layer : 0;
    volume = music.volume != null ? music.volume : 100;
    volume = volume * (this.generalMusicVolume / 100);
    this.musicVolume = volume;
    this.disposeMusic(layer);
    if ((music.name != null) && music.name.length > 0) {
      musicBuffer = this.play("Audio/Music/" + music.name, volume, music.rate);
      musicBuffer.loop = true;
      musicBuffer.volume = 0;
      musicBuffer.duration = Math.round(musicBuffer.duration * 1000 / 16.6);
      musicBuffer.customData.playType = 1;
      musicBuffer.customData.playTime = playTime;
      if (playRange.end === 0) {
        musicBuffer.customData.playRange = {
          start: playRange.start,
          end: musicBuffer.duration
        };
      } else {
        musicBuffer.customData.playRange = playRange;
      }
      musicBuffer.customData.fadeTime = fadeTime;
      musicBuffer.customData.startTimer = Math.round(musicBuffer.customData.playRange.start + Math.random() * (musicBuffer.customData.playRange.end - musicBuffer.customData.playRange.start));
      if (!this.audioBuffers.contains(musicBuffer)) {
        this.audioBuffers.push(musicBuffer);
      }
      this.audioBuffersByLayer[layer] = musicBuffer;
      return this.audioLayers[layer] = {
        name: music.name,
        time: music.currentTime,
        volume: music.volume,
        rate: music.playbackRate,
        fadeInTime: fadeTime,
        customData: musicBuffer.customData
      };
    }
  };


  /**
  * Plays a music.
  *
  * @method playMusic
  * @param {string|Object} name - The music to play. Can be just a name or a music data-object.
  * @param {number} volume - The music's volume in percent.
  * @param {number} rate - The music's playback rate in percent.
  * @param {number} fadeInTime - The fade-in time.
  * @param {number} layer - The layer to play the music on.
   */

  AudioManager.prototype.playMusic = function(name, volume, rate, fadeInTime, layer) {
    var musicBuffer, ref;
    if ((ref = $PARAMS.preview) != null ? ref.settings.musicDisabled : void 0) {
      return;
    }
    if ((name != null) && (name.name != null)) {
      layer = layer != null ? layer : rate || 0;
      fadeInTime = volume;
      volume = name.volume;
      rate = name.playbackRate;
      name = name.name;
    } else {
      layer = layer != null ? layer : 0;
    }
    this.disposeMusic(layer);
    this.audioLayers[layer] = {
      name: name,
      volume: volume,
      rate: rate,
      fadeInTime: fadeInTime,
      playing: true
    };
    volume = volume != null ? volume : 100;
    volume = volume * (this.generalMusicVolume / 100);
    this.musicVolume = volume;
    if ((name != null) && name.length > 0) {
      this.music = {
        name: name
      };
      musicBuffer = this.play("Audio/Music/" + name, volume, rate, fadeInTime);
      musicBuffer.loop = true;
      if (!this.audioBuffers.contains(musicBuffer)) {
        this.audioBuffers.push(musicBuffer);
      }
      return this.audioBuffersByLayer[layer] = musicBuffer;
    }
  };


  /**
  * Resumes a paused music.
  *
  * @method resumeMusic
  * @param {number} fadeInTime - The fade-in time in frames.
  * @param {number} layer - The audio layer to resume.
   */

  AudioManager.prototype.resumeMusic = function(fadeInTime, layer) {
    var ref;
    layer = layer != null ? layer : 0;
    if ((this.audioBuffersByLayer[layer] != null) && !this.audioBuffersByLayer[layer].isPlaying) {
      this.audioBuffersByLayer[layer].resume(fadeInTime);
      return (ref = this.audioLayers[layer]) != null ? ref.playing = true : void 0;
    }
  };


  /**
  * Stops a music.
  *
  * @method stopMusic
  * @param {number} fadeOutTime - The fade-out time in frames.
  * @param {number} layer - The audio layer to stop.
   */

  AudioManager.prototype.stopMusic = function(fadeOutTime, layer) {
    var ref, ref1, ref2;
    layer = layer != null ? layer : 0;
    if ((ref = this.audioBuffersByLayer[layer]) != null) {
      ref.stop(fadeOutTime);
    }
    if ((ref1 = this.audioBuffersByLayer[layer]) != null) {
      ref1.customData = {};
    }
    if ((ref2 = this.audioLayers[layer]) != null) {
      ref2.playing = false;
    }
    return this.music = null;
  };


  /**
  * Stops all music/audio layers.
  *
  * @method stopAllMusic
  * @param {number} fadeOutTime - The fade-out time in frames.
   */

  AudioManager.prototype.stopAllMusic = function(fadeOutTime) {
    var buffer, j, len, ref;
    ref = this.audioBuffers;
    for (j = 0, len = ref.length; j < len; j++) {
      buffer = ref[j];
      if (buffer != null) {
        buffer.stop(fadeOutTime);
        buffer.customData = {};
      }
    }
    return this.music = null;
  };

  AudioManager.prototype.dispose = function(context) {
    var buffer, data, j, layer, len, ref, results;
    data = context.resources.select(function(r) {
      return r.data;
    });
    ref = this.audioBuffersByLayer;
    results = [];
    for (layer = j = 0, len = ref.length; j < len; layer = ++j) {
      buffer = ref[layer];
      if (buffer && data.indexOf(buffer) !== -1) {
        buffer.dispose();
        this.audioBuffers.remove(buffer);
        this.audioBuffersByLayer[layer] = null;
        results.push(this.audioLayers[layer] = null);
      } else {
        results.push(void 0);
      }
    }
    return results;
  };


  /**
  * Disposes a music.
  *
  * @method disposeMusic
  * @param {number} layer - The audio layer of the music to dispose.
   */

  AudioManager.prototype.disposeMusic = function(layer) {
    layer = layer != null ? layer : 0;
    this.stopMusic(0, layer);
    this.audioBuffers.remove(this.audioBuffersByLayer[layer]);
    this.audioBuffersByLayer[layer] = null;
    return this.audioLayers[layer] = null;
  };

  return AudioManager;

})();

window.AudioManager = new AudioManager();

gs.AudioManager = AudioManager;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUE7O0FBQU07O0FBQ0Y7Ozs7Ozs7O0VBUWEsc0JBQUE7O0FBQ1Q7Ozs7OztJQU1BLElBQUMsQ0FBQSxZQUFELEdBQWdCOztBQUVoQjs7Ozs7O0lBTUEsSUFBQyxDQUFBLG1CQUFELEdBQXVCOztBQUV2Qjs7Ozs7O0lBTUEsSUFBQyxDQUFBLGVBQUQsR0FBbUI7O0FBRW5COzs7Ozs7SUFNQSxJQUFDLENBQUEsS0FBRCxHQUFTOztBQUVUOzs7Ozs7SUFNQSxJQUFDLENBQUEsV0FBRCxHQUFlOztBQUVmOzs7Ozs7SUFNQSxJQUFDLENBQUEsV0FBRCxHQUFlOztBQUVmOzs7Ozs7SUFNQSxJQUFDLENBQUEsV0FBRCxHQUFlOztBQUVmOzs7Ozs7SUFNQSxJQUFDLENBQUEsa0JBQUQsR0FBc0I7O0FBRXRCOzs7Ozs7SUFNQSxJQUFDLENBQUEsa0JBQUQsR0FBc0I7O0FBRXRCOzs7Ozs7SUFNQSxJQUFDLENBQUEsa0JBQUQsR0FBc0I7O0FBRXRCOzs7Ozs7SUFNQSxJQUFDLENBQUEsV0FBRCxHQUFlO0VBdkZOOzs7QUF5RmI7Ozs7Ozs7eUJBTUEsT0FBQSxHQUFTLFNBQUMsTUFBRDtBQUNMLFFBQUE7SUFBQSxJQUFDLENBQUEsV0FBRCxHQUFlO0FBRWY7U0FBQSxnREFBQTs7TUFDSSxJQUFHLEtBQUEsSUFBVSxLQUFLLENBQUMsT0FBbkI7UUFDSSxJQUFHLEtBQUssQ0FBQyxVQUFUO3VCQUNJLElBQUMsQ0FBQSxlQUFELENBQWlCLEtBQWpCLEVBQXdCLEtBQUssQ0FBQyxVQUFVLENBQUMsUUFBekMsRUFBbUQsQ0FBbkQsRUFBc0QsS0FBSyxDQUFDLFVBQVUsQ0FBQyxRQUF2RSxFQUFpRixLQUFLLENBQUMsVUFBVSxDQUFDLFNBQWxHLEdBREo7U0FBQSxNQUFBO3VCQUdJLElBQUMsQ0FBQSxTQUFELENBQVcsS0FBWCxFQUFrQixLQUFLLENBQUMsVUFBeEIsRUFB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QUEsQ0FBckIsR0FBOEI7V0FDOUIsSUFBQyxDQUFBLFdBQVksQ0FBQSxLQUFBLENBQWIsR0FBc0I7RUFQWjs7Ozs7O0FBU2xCLE1BQU0sQ0FBQyxZQUFQLEdBQTBCLElBQUEsWUFBQSxDQUFBOztBQUMxQixFQUFFLENBQUMsWUFBSCxHQUFrQiIsInNvdXJjZXNDb250ZW50IjpbIiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuI1xuIyAgIFNjcmlwdDogQXVkaW9NYW5hZ2VyXG4jXG4jICAgJCRDT1BZUklHSFQkJFxuI1xuIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5jbGFzcyBBdWRpb01hbmFnZXJcbiAgICAjIyMqXG4gICAgKiBNYW5hZ2VzIHRoZSBhdWRpbyBwbGF5YmFjayBvZiB0aGUgZ2FtZS4gXG4gICAgKlxuICAgICogQG1vZHVsZSBnc1xuICAgICogQGNsYXNzIEF1ZGlvTWFuYWdlclxuICAgICogQG1lbWJlcm9mIGdzXG4gICAgKiBAY29uc3RydWN0b3JcbiAgICAjIyNcbiAgICBjb25zdHJ1Y3RvcjogLT5cbiAgICAgICAgIyMjKlxuICAgICAgICAqIFN0b3JlcyBhbGwgYXVkaW8gYnVmZmVycy5cbiAgICAgICAgKiBAcHJvcGVydHkgYnVmZmVyc1xuICAgICAgICAqIEB0eXBlIGdzLkF1ZGlvQnVmZmVyW11cbiAgICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgICMjIyAgXG4gICAgICAgIEBhdWRpb0J1ZmZlcnMgPSBbXVxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFN0b3JlcyBhbGwgYXVkaW8gYnVmZmVycyBieSBsYXllci5cbiAgICAgICAgKiBAcHJvcGVydHkgYnVmZmVyc1xuICAgICAgICAqIEB0eXBlIGdzLkF1ZGlvQnVmZmVyW11cbiAgICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgICMjIyAgXG4gICAgICAgIEBhdWRpb0J1ZmZlcnNCeUxheWVyID0gW11cbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBTdG9yZXMgYWxsIGF1ZGlvIGJ1ZmZlciByZWZlcmVuY2VzIGZvciBzb3VuZHMuXG4gICAgICAgICogQHByb3BlcnR5IHNvdW5kUmVmZXJlbmNlc1xuICAgICAgICAqIEB0eXBlIGdzLkF1ZGlvQnVmZmVyUmVmZXJlbmNlW11cbiAgICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgICMjIyAgXG4gICAgICAgIEBzb3VuZFJlZmVyZW5jZXMgPSB7fVxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIEN1cnJlbnQgTXVzaWMgKExheWVyIDApXG4gICAgICAgICogQHByb3BlcnR5IG11c2ljXG4gICAgICAgICogQHR5cGUgT2JqZWN0XG4gICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAjIyMgXG4gICAgICAgIEBtdXNpYyA9IG51bGxcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBDdXJyZW50IG11c2ljIHZvbHVtZS5cbiAgICAgICAgKiBAcHJvcGVydHkgbXVzaWNWb2x1bWVcbiAgICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgICMjIyBcbiAgICAgICAgQG11c2ljVm9sdW1lID0gMTAwXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogQ3VycmVudCBzb3VuZCB2b2x1bWUuXG4gICAgICAgICogQHByb3BlcnR5IHNvdW5kVm9sdW1lXG4gICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAjIyMgXG4gICAgICAgIEBzb3VuZFZvbHVtZSA9IDEwMFxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIEN1cnJlbnQgdm9pY2Ugdm9sdW1lLlxuICAgICAgICAqIEBwcm9wZXJ0eSB2b2ljZVZvbHVtZVxuICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgIyMjIFxuICAgICAgICBAdm9pY2VWb2x1bWUgPSAxMDBcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBHZW5lcmFsIG11c2ljIHZvbHVtZVxuICAgICAgICAqIEBwcm9wZXJ0eSBnZW5lcmFsTXVzaWNWb2x1bWVcbiAgICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgICMjIyBcbiAgICAgICAgQGdlbmVyYWxNdXNpY1ZvbHVtZSA9IDEwMFxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIEdlbmVyYWwgc291bmQgdm9sdW1lXG4gICAgICAgICogQHByb3BlcnR5IGdlbmVyYWxTb3VuZFZvbHVtZVxuICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgIyMjIFxuICAgICAgICBAZ2VuZXJhbFNvdW5kVm9sdW1lID0gMTAwXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogR2VuZXJhbCB2b2ljZSB2b2x1bWVcbiAgICAgICAgKiBAcHJvcGVydHkgZ2VuZXJhbFZvaWNlVm9sdW1lXG4gICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAjIyMgXG4gICAgICAgIEBnZW5lcmFsVm9pY2VWb2x1bWUgPSAxMDBcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBTdG9yZXMgYXVkaW8gbGF5ZXIgaW5mby1kYXRhIGZvciBlYWNoIGxheWVyLlxuICAgICAgICAqIEBwcm9wZXJ0eSBhdWRpb0xheWVyc1xuICAgICAgICAqIEB0eXBlIGdzLkF1ZGlvTGF5ZXJJbmZvW11cbiAgICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgICMjIyBcbiAgICAgICAgQGF1ZGlvTGF5ZXJzID0gW11cbiAgICAgIFxuICAgICMjIypcbiAgICAqIFJlc3RvcmVzIGF1ZGlvLXBsYXliYWNrIGZyb20gYSBzcGVjaWZpZWQgYXJyYXkgb2YgYXVkaW8gbGF5ZXJzLlxuICAgICpcbiAgICAqIEBtZXRob2QgcmVzdG9yZVxuICAgICogQHBhcmFtIHtncy5BdWRpb0xheWVySW5mb1tdfSBsYXllcnMgLSBBbiBhcnJheSBvZiBhdWRpbyBsYXllciBpbmZvIG9iamVjdHMuXG4gICAgIyMjICBcbiAgICByZXN0b3JlOiAobGF5ZXJzKSAtPlxuICAgICAgICBAYXVkaW9MYXllcnMgPSBsYXllcnNcbiAgICAgICAgXG4gICAgICAgIGZvciBsYXllciwgaSBpbiBsYXllcnNcbiAgICAgICAgICAgIGlmIGxheWVyIGFuZCBsYXllci5wbGF5aW5nXG4gICAgICAgICAgICAgICAgaWYgbGF5ZXIuY3VzdG9tRGF0YVxuICAgICAgICAgICAgICAgICAgICBAcGxheU11c2ljUmFuZG9tKGxheWVyLCBsYXllci5jdXN0b21EYXRhLmZhZGVUaW1lLCBpLCBsYXllci5jdXN0b21EYXRhLnBsYXlUaW1lLCBsYXllci5jdXN0b21EYXRhLnBsYXlSYW5nZSlcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIEBwbGF5TXVzaWMobGF5ZXIsIGxheWVyLmZhZGVJblRpbWUsIGkpXG4gICAgIFxuICAgICMjIypcbiAgICAqIExvYWRzIHRoZSBzcGVjaWZpZWQgbXVzaWMuXG4gICAgKlxuICAgICogQG1ldGhvZCBsb2FkTXVzaWNcbiAgICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gVGhlIG5hbWUgb2YgdGhlIG11c2ljIHRvIGxvYWQuXG4gICAgIyMjICAgIFxuICAgIGxvYWRNdXNpYzogKG5hbWUpIC0+IFxuICAgICAgICBuYW1lID0gaWYgbmFtZT8gdGhlbiAobmFtZS5uYW1lIHx8IG5hbWUpIGVsc2UgbmFtZVxuICAgICAgICBpZiBuYW1lIGFuZCBuYW1lLmxlbmd0aCA+IDBcbiAgICAgICAgICAgIFJlc291cmNlTWFuYWdlci5nZXRBdWRpb1N0cmVhbShcIkF1ZGlvL011c2ljLyN7bmFtZX1cIilcbiAgICAgXG4gICAgIyMjKlxuICAgICogTG9hZHMgdGhlIHNwZWNpZmllZCBzb3VuZC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGxvYWRTb3VuZFxuICAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBUaGUgbmFtZSBvZiB0aGUgc291bmQgdG8gbG9hZC5cbiAgICAjIyMgICAgICAgICAgIFxuICAgIGxvYWRTb3VuZDogKG5hbWUpIC0+IFxuICAgICAgICBuYW1lID0gaWYgbmFtZT8gdGhlbiBuYW1lLm5hbWUgfHwgbmFtZSBlbHNlIG5hbWVcbiAgICAgICAgaWYgbmFtZSBhbmQgbmFtZS5sZW5ndGggPiAwXG4gICAgICAgICAgICBSZXNvdXJjZU1hbmFnZXIuZ2V0QXVkaW9CdWZmZXIoXCJBdWRpby9Tb3VuZHMvI3tuYW1lfVwiKVxuICAgIFxuICAgICMjIypcbiAgICAqIFVwZGF0ZXMgYSByYW5kb21seSBwbGF5ZWQgYXVkaW8gYnVmZmVyLlxuICAgICpcbiAgICAqIEBtZXRob2QgdXBkYXRlUmFuZG9tQXVkaW9cbiAgICAqIEBwYXJhbSB7Z3MuQXVkaW9CdWZmZXJ9IGJ1ZmZlciAtIFRoZSBhdWRpbyBidWZmZXIgdG8gdXBkYXRlLlxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgICBcbiAgICAjIEZJWE1FOiBSZWZhY3RvcmluZyBuZWNlc3NhcnkuICAgICAgXG4gICAgdXBkYXRlUmFuZG9tQXVkaW86IChidWZmZXIpIC0+XG4gICAgICAgIGlmIGJ1ZmZlci5jdXN0b21EYXRhLnN0YXJ0VGltZXIgPiAwXG4gICAgICAgICAgICBidWZmZXIuY3VzdG9tRGF0YS5zdGFydFRpbWVyLS1cbiAgICAgICAgICAgIGlmIGJ1ZmZlci5jdXN0b21EYXRhLnN0YXJ0VGltZXIgPD0gMFxuICAgICAgICAgICAgICAgIGJ1ZmZlci5mYWRlSW5Wb2x1bWUgPSAxLjAgLyAoYnVmZmVyLmN1c3RvbURhdGEuZmFkZVRpbWV8fDEpXG4gICAgICAgICAgICAgICAgYnVmZmVyLmZhZGVJblRpbWUgPSBidWZmZXIuY3VzdG9tRGF0YS5mYWRlVGltZXx8MVxuICAgICAgICAgICAgICAgIGJ1ZmZlci5mYWRlT3V0VGltZSA9IGJ1ZmZlci5jdXN0b21EYXRhLmZhZGVUaW1lfHwxXG4gICAgICAgICAgICAgICAgYnVmZmVyLnBsYXlUaW1lID0gYnVmZmVyLmN1c3RvbURhdGEucGxheVRpbWUubWluICsgTWF0aC5yYW5kb20oKSAqIChidWZmZXIuY3VzdG9tRGF0YS5wbGF5VGltZS5tYXggLSBidWZmZXIuY3VzdG9tRGF0YS5wbGF5VGltZS5taW4pXG4gICAgICAgICAgICAgICAgY3VycmVudFRpbWUgPSBidWZmZXIuY3VycmVudFRpbWUgIyAtIGJ1ZmZlci5zdGFydFRpbWVcbiAgICAgICAgICAgICAgICB0aW1lTGVmdCA9IGJ1ZmZlci5kdXJhdGlvbiAtIGN1cnJlbnRUaW1lXG4gICAgICAgICAgICAgICAgYnVmZmVyLnBsYXlUaW1lID0gTWF0aC5taW4odGltZUxlZnQgKiAxMDAwIC8gMTYuNiwgYnVmZmVyLnBsYXlUaW1lKVxuICAgIFxuICAgICAgICAgICAgICAgIGJ1ZmZlci5jdXN0b21EYXRhLnN0YXJ0VGltZXIgPSBidWZmZXIucGxheVRpbWUgKyBidWZmZXIuY3VzdG9tRGF0YS5wbGF5UmFuZ2Uuc3RhcnQgKyBNYXRoLnJhbmRvbSgpICogKGJ1ZmZlci5jdXN0b21EYXRhLnBsYXlSYW5nZS5lbmQgLSBidWZmZXIuY3VzdG9tRGF0YS5wbGF5UmFuZ2Uuc3RhcnQpXG4gICAgXG4gICAgIyMjKlxuICAgICogVXBkYXRlcyBhbGwgYXVkaW8tYnVmZmVycyBkZXBlbmRpbmcgb24gdGhlIHBsYXktdHlwZS5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHVwZGF0ZUF1ZGlvQnVmZmVyc1xuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgIFxuICAgIHVwZGF0ZUF1ZGlvQnVmZmVyczogLT5cbiAgICAgICAgZm9yIGJ1ZmZlciBpbiBAYXVkaW9CdWZmZXJzXG4gICAgICAgICAgICBpZiBidWZmZXI/XG4gICAgICAgICAgICAgICAgaWYgYnVmZmVyLmN1c3RvbURhdGEucGxheVR5cGUgPT0gMVxuICAgICAgICAgICAgICAgICAgICBAdXBkYXRlUmFuZG9tQXVkaW8oYnVmZmVyKVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiBHYW1lTWFuYWdlci5zZXR0aW5ncy5iZ21Wb2x1bWUgIT0gQGdlbmVyYWxNdXNpY1ZvbHVtZVxuICAgICAgICAgICAgICAgICAgICBidWZmZXIudm9sdW1lID0gKEBtdXNpY1ZvbHVtZSAqIEdhbWVNYW5hZ2VyLnNldHRpbmdzLmJnbVZvbHVtZSAvIDEwMCkgLyAxMDBcbiAgICAgICAgICAgICAgICAgICAgQGdlbmVyYWxNdXNpY1ZvbHVtZSA9IEdhbWVNYW5hZ2VyLnNldHRpbmdzLmJnbVZvbHVtZVxuICAgICAgICAgICAgICAgIGJ1ZmZlci51cGRhdGUoKVxuICAgIFxuICAgIFxuICAgICMjIypcbiAgICAqIFVwZGF0ZXMgYWxsIGF1ZGlvLWJ1ZmZlcnMgZGVwZW5kaW5nIG9uIHRoZSBwbGF5LXR5cGUuXG4gICAgKlxuICAgICogQG1ldGhvZCB1cGRhdGVBdWRpb0J1ZmZlcnNcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyMgICAgICAgICAgICAgXG4gICAgdXBkYXRlR2VuZXJhbFZvbHVtZTogLT5cbiAgICAgICAgaWYgR2FtZU1hbmFnZXIuc2V0dGluZ3Muc2VWb2x1bWUgIT0gQGdlbmVyYWxTb3VuZFZvbHVtZSBvciBHYW1lTWFuYWdlci5zZXR0aW5ncy52b2ljZVZvbHVtZSAhPSBAZ2VuZXJhbFZvaWNlVm9sdW1lXG4gICAgICAgICAgICBAZ2VuZXJhbFNvdW5kVm9sdW1lID0gR2FtZU1hbmFnZXIuc2V0dGluZ3Muc2VWb2x1bWVcbiAgICAgICAgICAgIEBnZW5lcmFsVm9pY2VWb2x1bWUgPSBHYW1lTWFuYWdlci5zZXR0aW5ncy52b2ljZVZvbHVtZVxuICAgICAgICAgICAgZm9yIGsgb2YgQHNvdW5kUmVmZXJlbmNlc1xuICAgICAgICAgICAgICAgIGZvciByZWZlcmVuY2UgaW4gQHNvdW5kUmVmZXJlbmNlc1trXVxuICAgICAgICAgICAgICAgICAgICBpZiByZWZlcmVuY2Uudm9pY2VcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZmVyZW5jZS52b2x1bWUgPSAoQHZvaWNlVm9sdW1lICogR2FtZU1hbmFnZXIuc2V0dGluZ3Mudm9pY2VWb2x1bWUgLyAxMDApIC8gMTAwXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZmVyZW5jZS52b2x1bWUgPSAoQHNvdW5kVm9sdW1lICogR2FtZU1hbmFnZXIuc2V0dGluZ3Muc2VWb2x1bWUgLyAxMDApIC8gMTAwXG4gICAgIyMjKlxuICAgICogVXBkYXRlcyB0aGUgYXVkaW8tcGxheWJhY2suXG4gICAgKlxuICAgICogQG1ldGhvZCB1cGRhdGVcbiAgICAjIyMgICAgICAgICAgICAgICAgXG4gICAgdXBkYXRlOiAtPlxuICAgICAgICBAdXBkYXRlQXVkaW9CdWZmZXJzKClcbiAgICAgICAgQHVwZGF0ZUdlbmVyYWxWb2x1bWUoKVxuICAgICBcbiAgICAjIyMqXG4gICAgKiBDaGFuZ2VzIHRoZSBjdXJyZW50IG11c2ljIHRvIHRoZSBzcGVjaWZpZWQgb25lLlxuICAgICpcbiAgICAqIEBtZXRob2QgY2hhbmdlTXVzaWNcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBtdXNpYyAtIFRoZSBtdXNpYyB0byBwbGF5LiBJZiA8Yj5udWxsPC9iPiB0aGUgY3VycmVudCBtdXNpYyB3aWxsIHN0b3AgcGxheWluZy5cbiAgICAjIyMgICAgICAgICAgIFxuICAgIGNoYW5nZU11c2ljOiAobXVzaWMpIC0+XG4gICAgICAgIGlmIG11c2ljPyBhbmQgbXVzaWMubmFtZT9cbiAgICAgICAgICAgIGlmIEBtdXNpYz8gYW5kIEBtdXNpYy5uYW1lICE9IG11c2ljLm5hbWVcbiAgICAgICAgICAgICAgICBAcGxheU11c2ljKG11c2ljKVxuICAgICAgICAgICAgZWxzZSBpZiBub3QgQG11c2ljP1xuICAgICAgICAgICAgICAgIEBwbGF5TXVzaWMobXVzaWMpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIEBzdG9wTXVzaWMoKVxuICAgICBcbiAgICAjIEZJWE1FOiBJcyB0aGlzIHN0aWxsIHVzZWQ/XG4gICAgIyMjKlxuICAgICogUHJlcGFyZXMuIFxuICAgICpcbiAgICAqIEBtZXRob2QgcHJlcGFyZVxuICAgICogQHBhcmFtIHtPYmplY3R9IG11c2ljIC0gVGhlIG11c2ljIHRvIHBsYXkuIElmIDxiPm51bGw8L2I+IHRoZSBjdXJyZW50IG11c2ljIHdpbGwgc3RvcCBwbGF5aW5nLlxuICAgICMjIyAgICAgICAgICAgIFxuICAgIHByZXBhcmU6IChwYXRoLCB2b2x1bWUsIHJhdGUpIC0+IFxuICAgICAgICBidWZmZXIgPSBSZXNvdXJjZU1hbmFnZXIuZ2V0QXVkaW9CdWZmZXIocGF0aClcbiAgICAgICAgXG4gICAgICAgIGlmIGJ1ZmZlci5kZWNvZGVkXG4gICAgICAgICAgICBidWZmZXIudm9sdW1lID0gaWYgdm9sdW1lPyB0aGVuIHZvbHVtZSAvIDEwMCBlbHNlIDEuMFxuICAgICAgICAgICAgYnVmZmVyLnBsYXliYWNrUmF0ZSA9IGlmIHJhdGU/IHRoZW4gcmF0ZSAvIDEwMCBlbHNlIDEuMFxuICAgICAgICBlbHNlXG4gICAgICAgICAgIGJ1ZmZlci5vbkZpbmlzaERlY29kZSA9IChzb3VyY2UpID0+IFxuICAgICAgICAgICAgICAgc291cmNlLnZvbHVtZSA9IGlmIHZvbHVtZT8gdGhlbiB2b2x1bWUgLyAxMDAgZWxzZSAxLjBcbiAgICAgICAgICAgICAgIHNvdXJjZS5wbGF5YmFja1JhdGUgPSBpZiByYXRlPyB0aGVuIHJhdGUgLyAxMDAgZWxzZSAxLjBcbiAgICAgICAgICAgYnVmZmVyLmRlY29kZSgpXG4gICAgICAgICAgIFxuICAgICAgICByZXR1cm4gYnVmZmVyXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIFBsYXlzIGFuIGF1ZGlvIHJlc291cmNlLlxuICAgICpcbiAgICAqIEBtZXRob2QgcGxheVxuICAgICogQHBhcmFtIHtTdHJpbmd9IHBhdGggLSBUaGUgcGF0aCB0byB0aGUgYXVkaW8gcmVzb3VyY2UuXG4gICAgKiBAcGFyYW0ge251bWJlcn0gdm9sdW1lIC0gVGhlIHZvbHVtZS5cbiAgICAqIEBwYXJhbSB7bnVtYmVyfSByYXRlIC0gVGhlIHBsYXliYWNrIHJhdGUuXG4gICAgKiBAcGFyYW0ge251bWJlcn0gZmFkZUluVGltZSAtIFRoZSBmYWRlLWluIHRpbWUgaW4gZnJhbWVzLlxuICAgICMjIyAgICAgXG4gICAgcGxheTogKHBhdGgsIHZvbHVtZSwgcmF0ZSwgZmFkZUluVGltZSkgLT5cbiAgICAgICAgYnVmZmVyID0gUmVzb3VyY2VNYW5hZ2VyLmdldEF1ZGlvU3RyZWFtKHBhdGgpXG4gICAgXG4gICAgICAgIGlmIGJ1ZmZlci5kZWNvZGVkXG4gICAgICAgICAgICBidWZmZXIudm9sdW1lID0gaWYgdm9sdW1lPyB0aGVuIHZvbHVtZSAvIDEwMCBlbHNlIDEuMFxuICAgICAgICAgICAgYnVmZmVyLnBsYXliYWNrUmF0ZSA9IGlmIHJhdGU/IHRoZW4gcmF0ZSAvIDEwMCBlbHNlIDEuMFxuICAgICAgICAgICAgYnVmZmVyLnBsYXkoZmFkZUluVGltZSkgaWYgR2FtZU1hbmFnZXIuc2V0dGluZ3MuYmdtRW5hYmxlZFxuICAgICAgICBlbHNlXG4gICAgICAgICAgIGJ1ZmZlci5vbkZpbmlzaERlY29kZSA9IChzb3VyY2UpID0+IFxuICAgICAgICAgICAgICAgc291cmNlLnZvbHVtZSA9IGlmIHZvbHVtZT8gdGhlbiB2b2x1bWUgLyAxMDAgZWxzZSAxLjBcbiAgICAgICAgICAgICAgIHNvdXJjZS5wbGF5YmFja1JhdGUgPSBpZiByYXRlPyB0aGVuIHJhdGUgLyAxMDAgZWxzZSAxLjBcbiAgICAgICAgICAgICAgIHNvdXJjZS5wbGF5KGZhZGVJblRpbWUpIGlmIEdhbWVNYW5hZ2VyLnNldHRpbmdzLmJnbUVuYWJsZWRcbiAgICAgICAgICAgYnVmZmVyLmRlY29kZSgpXG4gICAgICAgICAgIFxuICAgICAgICByZXR1cm4gYnVmZmVyXG4gICAgIFxuICAgICMjIypcbiAgICAqIFN0b3BzIGFsbCBzb3VuZHMuXG4gICAgKlxuICAgICogQG1ldGhvZCBzdG9wQWxsU291bmRzXG4gICAgIyMjICAgIFxuICAgIHN0b3BBbGxTb3VuZHM6IC0+XG4gICAgICAgIGZvciBrIG9mIEBzb3VuZFJlZmVyZW5jZXNcbiAgICAgICAgICAgIGZvciByZWZlcmVuY2UgaW4gQHNvdW5kUmVmZXJlbmNlc1trXVxuICAgICAgICAgICAgICAgIHJlZmVyZW5jZT8uc3RvcCgpXG4gICAgXG4gICAgIyMjKlxuICAgICogU3RvcHMgYSBzb3VuZCBhbmQgYWxsIHJlZmVyZW5jZXMgb2YgaXQuXG4gICAgKlxuICAgICogQG1ldGhvZCBzdG9wU291bmRcbiAgICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gVGhlIG5hbWUgb2YgdGhlIHNvdW5kIHRvIHN0b3AuXG4gICAgIyMjICAgICAgICAgICAgIFxuICAgIHN0b3BTb3VuZDogKG5hbWUpIC0+XG4gICAgICAgIGlmIEBzb3VuZFJlZmVyZW5jZXNbbmFtZV0/XG4gICAgICAgICAgICBmb3IgcmVmZXJlbmNlIGluIEBzb3VuZFJlZmVyZW5jZXNbbmFtZV1cbiAgICAgICAgICAgICAgICByZWZlcmVuY2Uuc3RvcCgpXG4gICAgXG4gICAgXG4gICAgIyMjKlxuICAgICogU3RvcHMgYSB2b2ljZS5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHN0b3BWb2ljZVxuICAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBUaGUgbmFtZSBvZiB0aGUgdm9pY2UgdG8gc3RvcC5cbiAgICAjIyMgICAgICAgICAgICAgXG4gICAgc3RvcFZvaWNlOiAobmFtZSkgLT5cbiAgICAgICAgQHN0b3BTb3VuZChuYW1lKVxuICAgIFxuICAgICMjIypcbiAgICAqIFN0b3BzIGFsbCB2b2ljZXMuXG4gICAgKlxuICAgICogQG1ldGhvZCBzdG9wQWxsVm9pY2VzXG4gICAgIyMjICAgICBcbiAgICBzdG9wQWxsVm9pY2VzOiAtPlxuICAgICAgICBmb3IgayBvZiBAc291bmRSZWZlcmVuY2VzXG4gICAgICAgICAgICBmb3IgcmVmZXJlbmNlIGluIEBzb3VuZFJlZmVyZW5jZXNba11cbiAgICAgICAgICAgICAgICByZWZlcmVuY2Uuc3RvcCgpIGlmIHJlZmVyZW5jZS52b2ljZVxuICAgIFxuICAgICMjIypcbiAgICAqIFBsYXlzIGEgdm9pY2UuXG4gICAgKlxuICAgICogQG1ldGhvZCBwbGF5Vm9pY2VcbiAgICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gVGhlIG5hbWUgb2YgdGhlIHZvaWNlIHRvIHBsYXkuXG4gICAgKiBAcGFyYW0ge251bWJlcn0gdm9sdW1lIC0gVGhlIHZvaWNlIHZvbHVtZS5cbiAgICAqIEBwYXJhbSB7bnVtYmVyfSByYXRlIC0gVGhlIHZvaWNlIHBsYXliYWNrIHJhdGUuXG4gICAgIyMjICAgICBcbiAgICBwbGF5Vm9pY2U6IChuYW1lLCB2b2x1bWUsIHJhdGUpIC0+XG4gICAgICAgIHZvaWNlID0gbnVsbFxuICAgICAgICBpZiBHYW1lTWFuYWdlci5zZXR0aW5ncy52b2ljZUVuYWJsZWQgYW5kIG5vdCAkUEFSQU1TLnByZXZpZXc/LnNldHRpbmdzLnZvaWNlRGlzYWJsZWRcbiAgICAgICAgICAgIHZvaWNlID0gQHBsYXlTb3VuZChuYW1lPy5uYW1lLCB2b2x1bWUgfHwgR2FtZU1hbmFnZXIuZGVmYXVsdHMuYXVkaW8udm9pY2VWb2x1bWUsIHJhdGUgfHwgR2FtZU1hbmFnZXIuZGVmYXVsdHMuYXVkaW8udm9pY2VQbGF5YmFja1JhdGUsIG5vLCB5ZXMpXG4gICAgICAgIFxuICAgICAgICByZXR1cm4gdm9pY2UgICAgXG4gICAgXG4gICAgIyMjKlxuICAgICogUGxheXMgYSBzb3VuZC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHBsYXlTb3VuZFxuICAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBUaGUgbmFtZSBvZiB0aGUgc291bmQgdG8gcGxheS5cbiAgICAqIEBwYXJhbSB7bnVtYmVyfSB2b2x1bWUgLSBUaGUgc291bmQncyB2b2x1bWUuXG4gICAgKiBAcGFyYW0ge251bWJlcn0gcmF0ZSAtIFRoZSBzb3VuZCdzIHBsYXliYWNrIHJhdGUuXG4gICAgKiBAcGFyYW0ge2Jvb2xlYW59IG11c2ljRWZmZWN0IC0gSW5kaWNhdGVzIGlmIHRoZSBzb3VuZCBzaG91bGQgYmUgcGxheWVkIGFzIGEgbXVzaWMgZWZmZWN0LiBJbiB0aGF0IGNhc2UsIHRoZSBjdXJyZW50IG11c2ljXG4gICAgKiBhdCBhdWRpby1sYXllciB3aWxsIGJlIHBhdXNlZCB1bnRpbCB0aGUgc291bmQgZmluaXNoZXMgcGxheWluZy5cbiAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gdm9pY2UgLSBJbmRpY2F0ZXMgaWYgdGhlIHNvdW5kIHNob3VsZCBiZSBoYW5kbGVkIGFzIGEgdm9pY2UuXG4gICAgIyMjICAgICAgICAgIFxuICAgIHBsYXlTb3VuZDogKG5hbWUsIHZvbHVtZSwgcmF0ZSwgbXVzaWNFZmZlY3QsIHZvaWNlKSAtPlxuICAgICAgICBpZiAkUEFSQU1TLnByZXZpZXc/LnNldHRpbmdzLnNvdW5kRGlzYWJsZWQgdGhlbiByZXR1cm5cbiAgICAgICAgaWYgbm90IG5hbWU/IG9yICghdm9pY2UgYW5kICFHYW1lTWFuYWdlci5zZXR0aW5ncy5zb3VuZEVuYWJsZWQpIHRoZW4gcmV0dXJuXG4gICAgICAgIGlmIG5hbWUubmFtZT9cbiAgICAgICAgICAgIHZvbHVtZSA9IG5hbWUudm9sdW1lXG4gICAgICAgICAgICByYXRlID0gbmFtZS5wbGF5YmFja1JhdGVcbiAgICAgICAgICAgIG5hbWUgPSBuYW1lLm5hbWVcbiAgICAgICAgIFxuICAgICAgICBpZiBuYW1lLmxlbmd0aCA9PSAwIHRoZW4gcmV0dXJuXG4gICAgICAgIFxuICAgICAgICBpZiBtdXNpY0VmZmVjdFxuICAgICAgICAgICAgQHN0b3BNdXNpYygpXG4gICAgICAgIFxuICAgICAgICBpZiBub3QgQHNvdW5kUmVmZXJlbmNlc1tuYW1lXT9cbiAgICAgICAgICAgIEBzb3VuZFJlZmVyZW5jZXNbbmFtZV0gPSBbXVxuICAgICAgICBcbiAgICAgICAgdm9sdW1lID0gdm9sdW1lID8gMTAwXG4gICAgICAgIHZvbHVtZSAqPSBpZiB2b2ljZSB0aGVuIEBnZW5lcmFsVm9pY2VWb2x1bWUgLyAxMDAgZWxzZSBAZ2VuZXJhbFNvdW5kVm9sdW1lIC8gMTAwXG4gICAgICAgIFxuICAgICAgICByZWZlcmVuY2UgPSBudWxsXG4gICAgICAgIGZvciByIGluIEBzb3VuZFJlZmVyZW5jZXNbbmFtZV1cbiAgICAgICAgICAgIGlmIG5vdCByLmlzUGxheWluZ1xuICAgICAgICAgICAgICAgIHJlZmVyZW5jZSA9IHJcbiAgICAgICAgICAgICAgICBpZiBtdXNpY0VmZmVjdCB0aGVuIHJlZmVyZW5jZS5vbkVuZCA9ID0+IEByZXN1bWVNdXNpYyg0MClcbiAgICAgICAgICAgICAgICByZWZlcmVuY2Uudm9pY2UgPSB2b2ljZVxuICAgICAgICAgICAgICAgIHJlZmVyZW5jZS52b2x1bWUgPSB2b2x1bWUgLyAxMDBcbiAgICAgICAgICAgICAgICByZWZlcmVuY2UucGxheWJhY2tSYXRlID0gcmF0ZSAvIDEwMFxuICAgICAgICAgICAgICAgIEB2b2ljZSA9IHJlZmVyZW5jZSBpZiB2b2ljZVxuICAgICAgICAgICAgICAgIHJlZmVyZW5jZS5wbGF5KClcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgXG4gICAgICAgIGlmIG5vdCByZWZlcmVuY2U/XG4gICAgICAgICAgICBidWZmZXIgPSBSZXNvdXJjZU1hbmFnZXIuZ2V0QXVkaW9CdWZmZXIoXCJBdWRpby9Tb3VuZHMvI3tuYW1lfVwiKVxuICAgICAgICAgICAgaWYgYnVmZmVyIGFuZCBidWZmZXIubG9hZGVkXG4gICAgICAgICAgICAgICAgaWYgYnVmZmVyLmRlY29kZWRcbiAgICAgICAgICAgICAgICAgICAgcmVmZXJlbmNlID0gbmV3IEdTLkF1ZGlvQnVmZmVyUmVmZXJlbmNlKGJ1ZmZlciwgdm9pY2UpXG4gICAgICAgICAgICAgICAgICAgIGlmIG11c2ljRWZmZWN0IHRoZW4gcmVmZXJlbmNlLm9uRW5kID0gPT4gQHJlc3VtZU11c2ljKDQwKVxuICAgICAgICAgICAgICAgICAgICByZWZlcmVuY2Uudm9sdW1lID0gdm9sdW1lIC8gMTAwXG4gICAgICAgICAgICAgICAgICAgIHJlZmVyZW5jZS5wbGF5YmFja1JhdGUgPSByYXRlIC8gMTAwXG4gICAgICAgICAgICAgICAgICAgIHJlZmVyZW5jZS52b2ljZSA9IHZvaWNlXG4gICAgICAgICAgICAgICAgICAgIHJlZmVyZW5jZS5wbGF5KClcbiAgICAgICAgICAgICAgICAgICAgQHZvaWNlID0gcmVmZXJlbmNlIGlmIHZvaWNlXG4gICAgICAgICAgICAgICAgICAgIEBzb3VuZFJlZmVyZW5jZXNbbmFtZV0ucHVzaChyZWZlcmVuY2UpXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBidWZmZXIubmFtZSA9IG5hbWVcbiAgICAgICAgICAgICAgICAgICAgYnVmZmVyLm9uRGVjb2RlRmluaXNoID0gKHNvdXJjZSkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZmVyZW5jZSA9IG5ldyBHUy5BdWRpb0J1ZmZlclJlZmVyZW5jZShzb3VyY2UsIHZvaWNlKVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgbXVzaWNFZmZlY3QgdGhlbiByZWZlcmVuY2Uub25FbmQgPSA9PiBAcmVzdW1lTXVzaWMoNDApXG4gICAgICAgICAgICAgICAgICAgICAgICByZWZlcmVuY2Uudm9pY2UgPSB2b2ljZVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVmZXJlbmNlLnZvbHVtZSA9IHZvbHVtZSAvIDEwMFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVmZXJlbmNlLnBsYXliYWNrUmF0ZSA9IHJhdGUgLyAxMDBcbiAgICAgICAgICAgICAgICAgICAgICAgIEB2b2ljZSA9IHJlZmVyZW5jZSBpZiB2b2ljZVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVmZXJlbmNlLnBsYXkoKVxuICAgICAgICAgICAgICAgICAgICAgICAgQHNvdW5kUmVmZXJlbmNlc1tzb3VyY2UubmFtZV0ucHVzaChyZWZlcmVuY2UpXG4gICAgICAgICAgICAgICAgICAgIGJ1ZmZlci5kZWNvZGUoKVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHJlZmVyZW5jZSAgICAgICAgICAgIFxuICAgIFxuICAgICMjIypcbiAgICAqIFBsYXlzIGEgbXVzaWMgYXMgYSByYW5kb20gbXVzaWMuIEEgcmFuZG9tIG11c2ljIHdpbGwgZmFkZS1pbiBhbmQgZmFkZS1vdXRcbiAgICAqIGF0IHJhbmRvbSB0aW1lcy4gVGhhdCBjYW4gYmUgY29tYmluZWQgd2l0aCBvdGhlciBhdWRpby1sYXllcnMgdG8gY3JlYXRlIGFcbiAgICAqIG11Y2ggYmV0dGVyIGxvb3Bpbmcgb2YgYW4gYXVkaW8gdHJhY2suXG4gICAgKlxuICAgICogQG1ldGhvZCBwbGF5TXVzaWNSYW5kb21cbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBtdXNpYyAtIFRoZSBtdXNpYyB0byBwbGF5LlxuICAgICogQHBhcmFtIHtudW1iZXJ9IGZhZGVUaW1lIC0gVGhlIHRpbWUgZm9yIGEgc2luZ2xlIGZhZGUtaW4vb3V0IGluIGZyYW1lcy5cbiAgICAqIEBwYXJhbSB7bnVtYmVyfSBsYXllciAtIFRoZSBhdWRpbyBsYXllciB0byB1c2UuXG4gICAgKiBAcGFyYW0ge2dzLlJhbmdlfSBwbGF5VGltZSAtIFBsYXktVGltZSByYW5nZSBsaWtlIDEwcyB0byAzMHMuXG4gICAgKiBAcGFyYW0ge2dzLlJhbmdlfSBwbGF5UmFuZ2UgLSBQbGF5LVJhbmdlLlxuICAgICMjIyAgICAgXG4gICAgcGxheU11c2ljUmFuZG9tOiAobXVzaWMsIGZhZGVUaW1lLCBsYXllciwgcGxheVRpbWUsIHBsYXlSYW5nZSkgLT5cbiAgICAgICAgcmV0dXJuIGlmICRQQVJBTVMucHJldmlldz8uc2V0dGluZ3MubXVzaWNEaXNhYmxlZFxuICAgICAgICBsYXllciA9IGxheWVyID8gMFxuXG4gICAgICAgIHZvbHVtZSA9IGlmIG11c2ljLnZvbHVtZT8gdGhlbiBtdXNpYy52b2x1bWUgZWxzZSAxMDBcbiAgICAgICAgdm9sdW1lID0gdm9sdW1lICogKEBnZW5lcmFsTXVzaWNWb2x1bWUgLyAxMDApXG4gICAgICAgIEBtdXNpY1ZvbHVtZSA9IHZvbHVtZVxuICAgICAgICBAZGlzcG9zZU11c2ljKGxheWVyKVxuICAgICAgICBcbiAgICAgICAgaWYgbXVzaWMubmFtZT8gYW5kIG11c2ljLm5hbWUubGVuZ3RoID4gMFxuICAgICAgICAgICAgbXVzaWNCdWZmZXIgPSBAcGxheShcIkF1ZGlvL011c2ljLyN7bXVzaWMubmFtZX1cIiwgdm9sdW1lLCBtdXNpYy5yYXRlKVxuICAgICAgICAgICAgbXVzaWNCdWZmZXIubG9vcCA9IHllc1xuICAgICAgICAgICAgbXVzaWNCdWZmZXIudm9sdW1lID0gMFxuICAgICAgICAgICAgbXVzaWNCdWZmZXIuZHVyYXRpb24gPSBNYXRoLnJvdW5kKG11c2ljQnVmZmVyLmR1cmF0aW9uICogMTAwMCAvIDE2LjYpXG4gICAgICAgICAgICBtdXNpY0J1ZmZlci5jdXN0b21EYXRhLnBsYXlUeXBlID0gMVxuICAgICAgICAgICAgbXVzaWNCdWZmZXIuY3VzdG9tRGF0YS5wbGF5VGltZSA9IHBsYXlUaW1lXG4gICAgICAgICAgICBpZiBwbGF5UmFuZ2UuZW5kID09IDBcbiAgICAgICAgICAgICAgICBtdXNpY0J1ZmZlci5jdXN0b21EYXRhLnBsYXlSYW5nZSA9IHsgc3RhcnQ6IHBsYXlSYW5nZS5zdGFydCwgZW5kOiBtdXNpY0J1ZmZlci5kdXJhdGlvbiB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgbXVzaWNCdWZmZXIuY3VzdG9tRGF0YS5wbGF5UmFuZ2UgPSBwbGF5UmFuZ2VcbiAgICAgICAgICAgIG11c2ljQnVmZmVyLmN1c3RvbURhdGEuZmFkZVRpbWUgPSBmYWRlVGltZVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBtdXNpY0J1ZmZlci5jdXN0b21EYXRhLnN0YXJ0VGltZXIgPSBNYXRoLnJvdW5kKG11c2ljQnVmZmVyLmN1c3RvbURhdGEucGxheVJhbmdlLnN0YXJ0ICsgTWF0aC5yYW5kb20oKSAqIChtdXNpY0J1ZmZlci5jdXN0b21EYXRhLnBsYXlSYW5nZS5lbmQgLSBtdXNpY0J1ZmZlci5jdXN0b21EYXRhLnBsYXlSYW5nZS5zdGFydCkpXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIEBhdWRpb0J1ZmZlcnMucHVzaChtdXNpY0J1ZmZlcikgaWYgbm90IEBhdWRpb0J1ZmZlcnMuY29udGFpbnMobXVzaWNCdWZmZXIpXG4gICAgICAgICAgICBAYXVkaW9CdWZmZXJzQnlMYXllcltsYXllcl0gPSBtdXNpY0J1ZmZlclxuICAgICAgICAgICAgQGF1ZGlvTGF5ZXJzW2xheWVyXSA9IG5hbWU6IG11c2ljLm5hbWUsIHRpbWU6IG11c2ljLmN1cnJlbnRUaW1lLCB2b2x1bWU6IG11c2ljLnZvbHVtZSwgcmF0ZTogbXVzaWMucGxheWJhY2tSYXRlLCBmYWRlSW5UaW1lOiBmYWRlVGltZSwgY3VzdG9tRGF0YTogbXVzaWNCdWZmZXIuY3VzdG9tRGF0YVxuICAgICBcbiAgICAjIyMqXG4gICAgKiBQbGF5cyBhIG11c2ljLlxuICAgICpcbiAgICAqIEBtZXRob2QgcGxheU11c2ljXG4gICAgKiBAcGFyYW0ge3N0cmluZ3xPYmplY3R9IG5hbWUgLSBUaGUgbXVzaWMgdG8gcGxheS4gQ2FuIGJlIGp1c3QgYSBuYW1lIG9yIGEgbXVzaWMgZGF0YS1vYmplY3QuXG4gICAgKiBAcGFyYW0ge251bWJlcn0gdm9sdW1lIC0gVGhlIG11c2ljJ3Mgdm9sdW1lIGluIHBlcmNlbnQuXG4gICAgKiBAcGFyYW0ge251bWJlcn0gcmF0ZSAtIFRoZSBtdXNpYydzIHBsYXliYWNrIHJhdGUgaW4gcGVyY2VudC5cbiAgICAqIEBwYXJhbSB7bnVtYmVyfSBmYWRlSW5UaW1lIC0gVGhlIGZhZGUtaW4gdGltZS5cbiAgICAqIEBwYXJhbSB7bnVtYmVyfSBsYXllciAtIFRoZSBsYXllciB0byBwbGF5IHRoZSBtdXNpYyBvbi5cbiAgICAjIyMgICAgICAgICAgXG4gICAgcGxheU11c2ljOiAobmFtZSwgdm9sdW1lLCByYXRlLCBmYWRlSW5UaW1lLCBsYXllcikgLT5cbiAgICAgICAgcmV0dXJuIGlmICRQQVJBTVMucHJldmlldz8uc2V0dGluZ3MubXVzaWNEaXNhYmxlZFxuICAgICAgICBcbiAgICAgICAgaWYgbmFtZT8gYW5kIG5hbWUubmFtZT9cbiAgICAgICAgICAgIGxheWVyID0gaWYgbGF5ZXI/IHRoZW4gbGF5ZXIgZWxzZSByYXRlIHx8IDBcbiAgICAgICAgICAgIGZhZGVJblRpbWUgPSB2b2x1bWVcbiAgICAgICAgICAgIHZvbHVtZSA9IG5hbWUudm9sdW1lXG4gICAgICAgICAgICByYXRlID0gbmFtZS5wbGF5YmFja1JhdGVcbiAgICAgICAgICAgIG5hbWUgPSBuYW1lLm5hbWVcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgbGF5ZXIgPSBsYXllciA/IDBcbiAgICAgICAgICAgIFxuICAgICAgICBAZGlzcG9zZU11c2ljKGxheWVyKVxuICAgICAgICBAYXVkaW9MYXllcnNbbGF5ZXJdID0gbmFtZTogbmFtZSwgdm9sdW1lOiB2b2x1bWUsIHJhdGU6IHJhdGUsIGZhZGVJblRpbWU6IGZhZGVJblRpbWUsIHBsYXlpbmc6IHRydWVcbiAgICAgICAgICAgXG4gICAgICAgIHZvbHVtZSA9IGlmIHZvbHVtZT8gdGhlbiB2b2x1bWUgZWxzZSAxMDBcbiAgICAgICAgdm9sdW1lID0gdm9sdW1lICogKEBnZW5lcmFsTXVzaWNWb2x1bWUgLyAxMDApXG4gICAgICAgIEBtdXNpY1ZvbHVtZSA9IHZvbHVtZVxuICAgICAgICBcbiAgICAgICAgXG4gICAgICAgIGlmIG5hbWU/IGFuZCBuYW1lLmxlbmd0aCA+IDBcbiAgICAgICAgICAgIEBtdXNpYyA9IG5hbWU6IG5hbWVcbiAgICAgICAgICAgIG11c2ljQnVmZmVyID0gQHBsYXkoXCJBdWRpby9NdXNpYy8je25hbWV9XCIsIHZvbHVtZSwgcmF0ZSwgZmFkZUluVGltZSlcbiAgICAgICAgICAgIG11c2ljQnVmZmVyLmxvb3AgPSB5ZXNcbiAgICAgICAgICAgIEBhdWRpb0J1ZmZlcnMucHVzaChtdXNpY0J1ZmZlcikgaWYgbm90IEBhdWRpb0J1ZmZlcnMuY29udGFpbnMobXVzaWNCdWZmZXIpXG4gICAgICAgICAgICBAYXVkaW9CdWZmZXJzQnlMYXllcltsYXllcl0gPSBtdXNpY0J1ZmZlclxuICAgICAgICAgICAgXG4gICAgIyMjKlxuICAgICogUmVzdW1lcyBhIHBhdXNlZCBtdXNpYy5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHJlc3VtZU11c2ljXG4gICAgKiBAcGFyYW0ge251bWJlcn0gZmFkZUluVGltZSAtIFRoZSBmYWRlLWluIHRpbWUgaW4gZnJhbWVzLlxuICAgICogQHBhcmFtIHtudW1iZXJ9IGxheWVyIC0gVGhlIGF1ZGlvIGxheWVyIHRvIHJlc3VtZS5cbiAgICAjIyMgICBcbiAgICByZXN1bWVNdXNpYzogKGZhZGVJblRpbWUsIGxheWVyKSAtPlxuICAgICAgICBsYXllciA9IGxheWVyID8gMFxuICAgICAgICBpZiBAYXVkaW9CdWZmZXJzQnlMYXllcltsYXllcl0/IGFuZCBub3QgQGF1ZGlvQnVmZmVyc0J5TGF5ZXJbbGF5ZXJdLmlzUGxheWluZ1xuICAgICAgICAgICAgQGF1ZGlvQnVmZmVyc0J5TGF5ZXJbbGF5ZXJdLnJlc3VtZShmYWRlSW5UaW1lKVxuICAgICAgICAgICAgQGF1ZGlvTGF5ZXJzW2xheWVyXT8ucGxheWluZyA9IHRydWVcbiAgICBcbiAgICAjIyMqXG4gICAgKiBTdG9wcyBhIG11c2ljLlxuICAgICpcbiAgICAqIEBtZXRob2Qgc3RvcE11c2ljXG4gICAgKiBAcGFyYW0ge251bWJlcn0gZmFkZU91dFRpbWUgLSBUaGUgZmFkZS1vdXQgdGltZSBpbiBmcmFtZXMuXG4gICAgKiBAcGFyYW0ge251bWJlcn0gbGF5ZXIgLSBUaGUgYXVkaW8gbGF5ZXIgdG8gc3RvcC5cbiAgICAjIyMgICAgICAgICBcbiAgICBzdG9wTXVzaWM6IChmYWRlT3V0VGltZSwgbGF5ZXIpIC0+IFxuICAgICAgICBsYXllciA9IGxheWVyID8gMFxuICAgICAgICBAYXVkaW9CdWZmZXJzQnlMYXllcltsYXllcl0/LnN0b3AoZmFkZU91dFRpbWUpXG4gICAgICAgIEBhdWRpb0J1ZmZlcnNCeUxheWVyW2xheWVyXT8uY3VzdG9tRGF0YSA9IHt9XG4gICAgICAgIEBhdWRpb0xheWVyc1tsYXllcl0/LnBsYXlpbmcgPSBmYWxzZVxuICAgICAgICBAbXVzaWMgPSBudWxsXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIFN0b3BzIGFsbCBtdXNpYy9hdWRpbyBsYXllcnMuXG4gICAgKlxuICAgICogQG1ldGhvZCBzdG9wQWxsTXVzaWNcbiAgICAqIEBwYXJhbSB7bnVtYmVyfSBmYWRlT3V0VGltZSAtIFRoZSBmYWRlLW91dCB0aW1lIGluIGZyYW1lcy5cbiAgICAjIyMgICAgICAgICBcbiAgICBzdG9wQWxsTXVzaWM6IChmYWRlT3V0VGltZSkgLT4gXG4gICAgICAgIGZvciBidWZmZXIgaW4gQGF1ZGlvQnVmZmVyc1xuICAgICAgICAgICAgaWYgYnVmZmVyP1xuICAgICAgICAgICAgICAgIGJ1ZmZlci5zdG9wKGZhZGVPdXRUaW1lKVxuICAgICAgICAgICAgICAgIGJ1ZmZlci5jdXN0b21EYXRhID0ge31cbiAgICAgICAgQG11c2ljID0gbnVsbFxuXG5cbiAgICBkaXNwb3NlOiAoY29udGV4dCkgLT5cbiAgICAgICAgZGF0YSA9IGNvbnRleHQucmVzb3VyY2VzLnNlbGVjdCAocikgLT4gci5kYXRhXG4gICAgICAgIGZvciBidWZmZXIsIGxheWVyIGluIEBhdWRpb0J1ZmZlcnNCeUxheWVyXG4gICAgICAgICAgICBpZiBidWZmZXIgYW5kIGRhdGEuaW5kZXhPZihidWZmZXIpICE9IC0xXG4gICAgICAgICAgICAgICAgYnVmZmVyLmRpc3Bvc2UoKVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIEBhdWRpb0J1ZmZlcnMucmVtb3ZlKGJ1ZmZlcilcbiAgICAgICAgICAgICAgICBAYXVkaW9CdWZmZXJzQnlMYXllcltsYXllcl0gPSBudWxsXG4gICAgICAgICAgICAgICAgQGF1ZGlvTGF5ZXJzW2xheWVyXSA9IG51bGxcbiAgICAgICAgICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBEaXNwb3NlcyBhIG11c2ljLlxuICAgICpcbiAgICAqIEBtZXRob2QgZGlzcG9zZU11c2ljXG4gICAgKiBAcGFyYW0ge251bWJlcn0gbGF5ZXIgLSBUaGUgYXVkaW8gbGF5ZXIgb2YgdGhlIG11c2ljIHRvIGRpc3Bvc2UuXG4gICAgIyMjIFxuICAgIGRpc3Bvc2VNdXNpYzogKGxheWVyKSAtPlxuICAgICAgICBsYXllciA9IGxheWVyID8gMFxuICAgICAgICBcbiAgICAgICAgQHN0b3BNdXNpYygwLCBsYXllcilcbiAgICAgICAgI0BhdWRpb0J1ZmZlcnNbbGF5ZXJdPy5kaXNwb3NlKClcbiAgICAgICAgQGF1ZGlvQnVmZmVycy5yZW1vdmUoQGF1ZGlvQnVmZmVyc0J5TGF5ZXJbbGF5ZXJdKVxuICAgICAgICBAYXVkaW9CdWZmZXJzQnlMYXllcltsYXllcl0gPSBudWxsXG4gICAgICAgIEBhdWRpb0xheWVyc1tsYXllcl0gPSBudWxsXG4gICAgXG53aW5kb3cuQXVkaW9NYW5hZ2VyID0gbmV3IEF1ZGlvTWFuYWdlcigpXG5ncy5BdWRpb01hbmFnZXIgPSBBdWRpb01hbmFnZXIiXX0=
//# sourceURL=AudioManager_71.js