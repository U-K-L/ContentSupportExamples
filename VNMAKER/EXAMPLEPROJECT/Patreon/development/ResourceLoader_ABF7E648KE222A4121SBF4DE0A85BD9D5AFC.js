var ResourceLoader;

ResourceLoader = (function() {

  /**
  * The resource helps to load a bunch of resources from different kind of
  * data structures.
  *
  * @module gs
  * @class ResourceLoader
  * @memberof gs
  * @constructor
  * @static
   */
  function ResourceLoader() {
    this.loadedScenesByUid = {};
    this.loadedCommonEventsById = [];
  }


  /**
  * Loads all graphics for the specified list of custom layout types/templates
  *
  * @method loadUiTypesGraphics
  * @param {Object[]} types - An array of custom layout types/templates
  * @static
   */

  ResourceLoader.prototype.loadUiTypesGraphics = function(types) {
    var k;
    for (k in types) {
      this.loadUiLayoutGraphics(types[k]);
    }
    return null;
  };


  /**
  * Loads all graphics for the specified layout-descriptor.
  *
  * @method loadUiGraphicsFromObject
  * @param {Object} layout - The layout descriptor.
  * @static
   */

  ResourceLoader.prototype.loadUiGraphicsFromObject = function(layout) {
    var k;
    for (k in layout) {
      if (k === "image" || k === "fullImage") {
        ResourceManager.getBitmap("Graphics/Pictures/" + layout[k]);
      } else if (k === "video") {
        ResourceManager.getVideo("Movies/" + layout[k]);
      }
    }
    return null;
  };


  /**
  * Loads all graphics for the specified layout-descriptor.
  *
  * @method loadUiDataFieldsGraphics
  * @param {Object} layout - The layout descriptor.
  * @static
   */

  ResourceLoader.prototype.loadUiDataFieldsGraphics = function(layout) {
    var image, j, k, l, len, o, ref;
    for (k in layout) {
      if (layout[k] instanceof Array) {
        ref = layout[k];
        for (l = 0, len = ref.length; l < len; l++) {
          o = ref[l];
          for (j in o) {
            if (j === "image" || j === "fullImage") {
              image = o[j];
              if (image != null ? image.startsWith("data:") : void 0) {
                ResourceManager.getBitmap(o[j]);
              } else {
                ResourceManager.getBitmap("Graphics/Pictures/" + o[j]);
              }
            }
          }
        }
      }
    }
    return null;
  };


  /**
  * Loads all graphics for the specified layout-descriptor.
  *
  * @method loadUiDataFieldsGraphics
  * @param {Object} layout - The layout descriptor.
  * @static
   */

  ResourceLoader.prototype.loadUiLayoutGraphics = function(layout) {
    var action, actions, animation, control, descriptor, graphic, image, l, len, len1, len10, len11, len2, len3, len4, len5, len6, len7, len8, len9, m, music, n, object, p, q, r, ref, ref1, ref10, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, results, s, sel, sound, style, sub, t, u, v, video, w, x;
    if (layout.preload != null) {
      if (layout.preload.graphics != null) {
        ref = layout.preload.graphics;
        for (l = 0, len = ref.length; l < len; l++) {
          graphic = ref[l];
          if (graphic.name != null) {
            ResourceManager.getBitmap((graphic.folder || 'Graphics/Pictures') + "/" + (ui.Component_FormulaHandler.fieldValue(null, graphic.name)));
          } else {
            object = ui.Component_FormulaHandler.fieldValue(null, graphic.path);
            for (m = 0, len1 = object.length; m < len1; m++) {
              sub = object[m];
              if (sub != null) {
                image = ui.Component_FormulaHandler.fieldValue(sub, graphic.image);
                if (image != null) {
                  ResourceManager.getBitmap("Graphics/Pictures/" + image);
                }
              }
            }
          }
        }
      }
      if (layout.preload.videos != null) {
        ref1 = layout.preload.videos;
        for (n = 0, len2 = ref1.length; n < len2; n++) {
          video = ref1[n];
          if (video.name != null) {
            ResourceManager.getVideo((video.folder || 'Movies') + "/" + video.name);
          }
        }
      }
      if (layout.preload.music != null) {
        ref2 = layout.preload.music;
        for (p = 0, len3 = ref2.length; p < len3; p++) {
          music = ref2[p];
          if (music != null) {
            ResourceManager.getVideo((music.folder || 'Audio/Music') + "/" + (music.name || music));
          }
        }
      }
      if (layout.preload.sounds != null) {
        ref3 = layout.preload.sounds;
        for (q = 0, len4 = ref3.length; q < len4; q++) {
          sound = ref3[q];
          if (sound != null) {
            ResourceManager.getAudioBuffer((sound.folder || 'Audio/Sounds') + "/" + (ui.Component_FormulaHandler.fieldValue(layout, sound.name || sound)));
          }
        }
      }
    }
    if (layout.images != null) {
      ref4 = layout.images;
      for (r = 0, len5 = ref4.length; r < len5; r++) {
        image = ref4[r];
        ResourceManager.getBitmap("Graphics/Pictures/" + image);
      }
    }
    if (layout.animations != null) {
      ref5 = layout.animations;
      for (s = 0, len6 = ref5.length; s < len6; s++) {
        descriptor = ref5[s];
        ref6 = descriptor.flow;
        for (t = 0, len7 = ref6.length; t < len7; t++) {
          animation = ref6[t];
          switch (animation.type) {
            case "sound":
              ResourceManager.getAudioBuffer("Audio/Sounds/" + animation.sound);
              break;
            case "changeImages":
              ref7 = animation.images;
              for (u = 0, len8 = ref7.length; u < len8; u++) {
                image = ref7[u];
                ResourceManager.getBitmap("Graphics/Pictures/" + image);
              }
              break;
            case "maskTo":
              ResourceManager.getBitmap("Graphics/Masks/" + animation.mask);
          }
          if (animation.sound != null) {
            ResourceManager.getAudioBuffer("Audio/Sounds/" + animation.sound);
          }
        }
      }
    }
    if (layout.image != null) {
      ResourceManager.getBitmap("Graphics/Pictures/" + layout.image);
    }
    if (layout.video != null) {
      ResourceManager.getBitmap("Graphics/Movies/" + layout.video);
    }
    if (layout.customFields != null) {
      this.loadUiGraphicsFromObject(layout.customFields);
    }
    if (((ref8 = layout.customFields) != null ? ref8.actions : void 0) != null) {
      ref9 = layout.customFields.actions;
      for (v = 0, len9 = ref9.length; v < len9; v++) {
        action = ref9[v];
        if (action.name === "playVoice" || action.name === "playSound") {
          AudioManager.loadSound(action.params.name);
        }
      }
    }
    if ((layout.actions != null) || (layout.action != null)) {
      actions = layout.action != null ? [layout.action] : layout.actions;
      for (w = 0, len10 = actions.length; w < len10; w++) {
        action = actions[w];
        if (action.name === "playVoice" || action.name === "playSound") {
          AudioManager.loadSound(action.params.name);
        }
      }
    }
    if (layout.params) {
      this.loadUiLayoutGraphics(layout.params);
    }
    if (layout.template != null) {
      this.loadUiLayoutGraphics(layout.template);
    }
    if ((layout.style != null) && (ui.UiFactory.styles[layout.style] != null)) {
      this.loadUiLayoutGraphics(ui.UiFactory.styles[layout.style]);
      for (sel in ui.UIManager.selectors) {
        style = ui.UIManager.styles[layout.style + ":" + sel];
        if (style) {
          this.loadUiLayoutGraphics(style);
        }
      }
    }
    if (ui.UiFactory.customTypes[layout.type] != null) {
      this.loadUiLayoutGraphics(ui.UiFactory.customTypes[layout.type]);
    }
    if (layout.controls != null) {
      ref10 = layout.controls;
      results = [];
      for (x = 0, len11 = ref10.length; x < len11; x++) {
        control = ref10[x];
        results.push(this.loadUiLayoutGraphics(control));
      }
      return results;
    }
  };


  /**
  * Loads all system sounds.
  *
  * @method loadSystemSounds
  * @static
   */

  ResourceLoader.prototype.loadSystemSounds = function() {
    var l, len, ref, results, sound;
    ref = RecordManager.system.sounds;
    results = [];
    for (l = 0, len = ref.length; l < len; l++) {
      sound = ref[l];
      results.push(AudioManager.loadSound(sound));
    }
    return results;
  };


  /**
  * Loads all system graphics.
  *
  * @method loadSystemGraphics
  * @static
   */

  ResourceLoader.prototype.loadSystemGraphics = function() {
    var l, len, ref, ref1, ref2, ref3, ref4, slot;
    ref = GameManager.saveGameSlots;
    for (l = 0, len = ref.length; l < len; l++) {
      slot = ref[l];
      if ((slot.thumb != null) && slot.thumb.length > 0) {
        ResourceManager.getBitmap(slot.thumb);
      }
    }
    if ((ref1 = RecordManager.system.cursor) != null ? ref1.name : void 0) {
      ResourceManager.getBitmap("Graphics/Pictures/" + RecordManager.system.cursor.name);
    }
    if ((ref2 = RecordManager.system.titleScreen) != null ? ref2.name : void 0) {
      ResourceManager.getBitmap("Graphics/Pictures/" + RecordManager.system.titleScreen.name);
    }
    if ((ref3 = RecordManager.system.languageScreen) != null ? ref3.name : void 0) {
      ResourceManager.getBitmap("Graphics/Pictures/" + RecordManager.system.languageScreen.name);
    }
    if ((ref4 = RecordManager.system.menuBackground) != null ? ref4.name : void 0) {
      ResourceManager.getBitmap("Graphics/Pictures/" + RecordManager.system.menuBackground.name);
    }
    return null;
  };


  /**
  * Loads all resources needed by the specified list of commands.
  *
  * @method loadEventCommandsGraphics
  * @param {Object[]} commands - The list of commands.
  * @return {boolean} Indicates if data needs to be loaded. 
  * @static
   */

  ResourceLoader.prototype.loadEventCommandsData = function(commands) {
    this.loadedScenesByUid = {};
    return this._loadEventCommandsData(commands);
  };

  ResourceLoader.prototype._loadEventCommandsData = function(commands) {
    var command, l, len, result, sceneDocument;
    if (commands == null) {
      return false;
    }
    result = false;
    for (l = 0, len = commands.length; l < len; l++) {
      command = commands[l];
      switch (command.id) {
        case "vn.Choice":
          if (command.params.action.scene) {
            sceneDocument = DataManager.getDocument(command.params.action.scene.uid);
            if (sceneDocument) {
              if (!result) {
                result = !sceneDocument.loaded;
              }
              if (sceneDocument.loaded && !this.loadedScenesByUid[sceneDocument.uid]) {
                this.loadedScenesByUid[sceneDocument.uid] = true;
                if (!result) {
                  result = this._loadEventCommandsData(sceneDocument.items.commands);
                }
              }
            }
          }
          break;
        case "vn.CallScene":
          if (command.params.scene) {
            sceneDocument = DataManager.getDocument(command.params.scene.uid);
            if (sceneDocument) {
              if (!result) {
                result = !sceneDocument.loaded;
              }
              if (sceneDocument.loaded && !this.loadedScenesByUid[sceneDocument.uid]) {
                this.loadedScenesByUid[sceneDocument.uid] = true;
                if (!result) {
                  result = this._loadEventCommandsData(sceneDocument.items.commands);
                }
              }
            }
          }
      }
    }
    return result;
  };


  /**
  * Loads all resources needed by the specified list of commands.
  *
  * @method loadEventCommandsGraphics
  * @param {Object[]} commands - The list of commands.
  * @static
   */

  ResourceLoader.prototype.loadEventCommandsGraphics = function(commands) {
    this.loadedScenesByUid = {};
    this.loadedCommonEventsById = [];
    return this._loadEventCommandsGraphics(commands);
  };

  ResourceLoader.prototype._loadEventCommandsGraphics = function(commands) {
    var actor, actorId, animation, animationId, character, command, commonEvent, effect, eid, enemy, expression, expressionId, hotspot, i, i1, image, j1, l, len, len1, len10, len11, len12, len13, len14, len15, len2, len3, len4, len5, len6, len7, len8, len9, m, moveCommand, n, p, param, q, r, record, ref, ref1, ref10, ref11, ref12, ref13, ref14, ref15, ref16, ref17, ref18, ref19, ref2, ref20, ref21, ref22, ref23, ref24, ref25, ref3, ref4, ref5, ref6, ref7, ref8, ref9, s, sceneDocument, sound, t, u, v, w, x, y, z;
    if (commands == null) {
      return;
    }
    for (l = 0, len = commands.length; l < len; l++) {
      command = commands[l];
      switch (command.id) {
        case "gs.CallCommonEvent":
          commonEvent = RecordManager.commonEvents[command.params.commonEventId];
          if (commonEvent != null) {
            ref = commonEvent.parameters;
            for (i = m = 0, len1 = ref.length; m < len1; i = ++m) {
              param = ref[i];
              if (param.stringValueType === "sceneId" && ((ref1 = command.params.parameters) != null ? ref1.values[i] : void 0)) {
                sceneDocument = DataManager.getDocument(command.params.parameters.values[i]);
                if (sceneDocument && !this.loadedScenesByUid[sceneDocument.uid]) {
                  this.loadedScenesByUid[sceneDocument.uid] = true;
                  this._loadEventCommandsGraphics(sceneDocument.items.commands);
                }
              }
            }
            if (!this.loadedCommonEventsById[command.params.commonEventId]) {
              this.loadedCommonEventsById[command.params.commonEventId] = true;
              this._loadEventCommandsGraphics(commonEvent.commands);
            }
          }
          break;
        case "vn.CallScene":
          sceneDocument = DataManager.getDocument(command.params.scene.uid);
          if (sceneDocument && !this.loadedScenesByUid[sceneDocument.uid]) {
            this.loadedScenesByUid[sceneDocument.uid] = true;
            this._loadEventCommandsGraphics(sceneDocument.items.commands);
          }
          break;
        case "gs.ChangeTransition":
          ResourceManager.getBitmap("Graphics/Masks/" + ((ref2 = command.params.graphic) != null ? ref2.name : void 0));
          break;
        case "gs.ScreenTransition":
          ResourceManager.getBitmap("Graphics/Masks/" + ((ref3 = command.params.graphic) != null ? ref3.name : void 0));
          break;
        case "vn.ChangeBackground":
          if (command.params.graphic != null) {
            ResourceManager.getBitmap("Graphics/Backgrounds/" + command.params.graphic.name);
          }
          if (((ref4 = command.params.animation) != null ? ref4.type : void 0) === gs.AnimationTypes.MASKING && ((ref5 = command.params.animation.mask) != null ? ref5.graphic : void 0)) {
            ResourceManager.getBitmap("Graphics/Masks/" + command.params.animation.mask.graphic.name);
          }
          break;
        case "vn.L2DJoinScene":
          if (command.params.model != null) {
            ResourceManager.getLive2DModel("Live2D/" + command.params.model.name);
          }
          break;
        case "vn.CharacterJoinScene":
          character = RecordManager.characters[command.params.characterId];
          if (character != null) {
            expressionId = (ref6 = command.params.expressionId) != null ? ref6 : character.defaultExpressionId;
            if (expressionId != null) {
              record = RecordManager.characterExpressions[expressionId];
              if (record != null) {
                if (record.idle) {
                  ref7 = record.idle;
                  for (n = 0, len2 = ref7.length; n < len2; n++) {
                    image = ref7[n];
                    ResourceManager.getBitmap("Graphics/Characters/" + image.resource.name);
                  }
                }
                if (record.talking) {
                  ref8 = record.talking;
                  for (p = 0, len3 = ref8.length; p < len3; p++) {
                    image = ref8[p];
                    ResourceManager.getBitmap("Graphics/Characters/" + image.resource.name);
                  }
                }
              }
            }
          }
          if (command.params.animation.type === gs.AnimationTypes.MASKING && (command.params.animation.mask.graphic != null)) {
            ResourceManager.getBitmap("Graphics/Masks/" + command.params.animation.mask.graphic.name);
          }
          break;
        case "vn.CharacterChangeExpression":
          record = RecordManager.characterExpressions[command.params.expressionId];
          if (record != null) {
            ref9 = record.idle;
            for (q = 0, len4 = ref9.length; q < len4; q++) {
              image = ref9[q];
              ResourceManager.getBitmap("Graphics/Characters/" + image.resource.name);
            }
            ref10 = record.talking;
            for (r = 0, len5 = ref10.length; r < len5; r++) {
              image = ref10[r];
              ResourceManager.getBitmap("Graphics/Characters/" + image.resource.name);
            }
          }
          if (command.params.animation.type === gs.AnimationTypes.MASKING && (command.params.animation.mask.graphic != null)) {
            ResourceManager.getBitmap("Graphics/Masks/" + command.params.animation.mask.graphic.name);
          }
          break;
        case "gs.ShowPartialMessage":
          if (command.params.voice != null) {
            AudioManager.loadSound(command.params.voice);
          }
          break;
        case "vn.Choice":
          if (command.params.action.scene) {
            sceneDocument = DataManager.getDocument(command.params.action.scene.uid);
            if (sceneDocument && !this.loadedScenesByUid[sceneDocument.uid]) {
              this.loadedScenesByUid[sceneDocument.uid] = true;
              this._loadEventCommandsGraphics(sceneDocument.items.commands);
            }
          }
          break;
        case "gs.ShowMessage":
        case "gs.ShowMessageNVL":
        case "gs.ShowText":
          if (command.params.animations != null) {
            ref11 = command.params.animations;
            for (s = 0, len6 = ref11.length; s < len6; s++) {
              eid = ref11[s];
              animation = RecordManager.animations[eid];
              if ((animation != null) && animation.graphic.name) {
                ResourceManager.getBitmap("Graphics/Pictures/" + animation.graphic.name);
              }
            }
          }
          if (command.params.expressions != null) {
            ref12 = command.params.expressions;
            for (t = 0, len7 = ref12.length; t < len7; t++) {
              eid = ref12[t];
              expression = RecordManager.characterExpressions[eid];
              if (expression != null) {
                if (expression.idle) {
                  ref13 = expression.idle;
                  for (u = 0, len8 = ref13.length; u < len8; u++) {
                    image = ref13[u];
                    ResourceManager.getBitmap("Graphics/Characters/" + image.resource.name);
                  }
                }
                if (expression.talking) {
                  ref14 = expression.talking;
                  for (v = 0, len9 = ref14.length; v < len9; v++) {
                    image = ref14[v];
                    ResourceManager.getBitmap("Graphics/Characters/" + image.resource.name);
                  }
                }
              }
            }
          }
          if (command.params.voice != null) {
            AudioManager.loadSound(command.params.voice);
          }
          record = RecordManager.characterExpressions[command.params.expressionId];
          if (record != null) {
            if (record.idle) {
              ref15 = record.idle;
              for (w = 0, len10 = ref15.length; w < len10; w++) {
                image = ref15[w];
                ResourceManager.getBitmap("Graphics/Characters/" + image.resource.name);
              }
            }
            if (record.talking) {
              ref16 = record.talking;
              for (x = 0, len11 = ref16.length; x < len11; x++) {
                image = ref16[x];
                ResourceManager.getBitmap("Graphics/Characters/" + image.resource.name);
              }
            }
          }
          break;
        case "gs.AddHotspot":
          if ((command.params.baseGraphic != null) && (command.params.baseGraphic.name != null)) {
            ResourceManager.getBitmap("Graphics/Pictures/" + command.params.baseGraphic.name);
          }
          if ((command.params.hoverGraphic != null) && (command.params.hoverGraphic.name != null)) {
            ResourceManager.getBitmap("Graphics/Pictures/" + command.params.hoverGraphic.name);
          }
          if ((command.params.selectedGraphic != null) && (command.params.selectedGraphic.name != null)) {
            ResourceManager.getBitmap("Graphics/Pictures/" + command.params.selectedGraphic.name);
          }
          if ((command.params.selectedHoverGraphic != null) && (command.params.selectedHoverGraphic.name != null)) {
            ResourceManager.getBitmap("Graphics/Pictures/" + command.params.selectedHoverGraphic.name);
          }
          if ((command.params.unselectedGraphic != null) && (command.params.unselectedGraphic.name != null)) {
            ResourceManager.getBitmap("Graphics/Pictures/" + command.params.unselectedGraphic.name);
          }
          break;
        case "gs.ShowPicture":
          if (command.params.graphic != null) {
            ResourceManager.getBitmap("Graphics/Pictures/" + command.params.graphic.name);
          }
          if (((ref17 = command.params.animation) != null ? ref17.type : void 0) === gs.AnimationTypes.MASKING) {
            ResourceManager.getBitmap("Graphics/Masks/" + command.params.animation.mask.graphic.name);
          }
          break;
        case "gs.ShowImageMap":
          if (command.params.ground != null) {
            ResourceManager.getBitmap("Graphics/Pictures/" + command.params.ground.name);
          }
          if (command.params.hover != null) {
            ResourceManager.getBitmap("Graphics/Pictures/" + command.params.hover.name);
          }
          if (command.params.unselected != null) {
            ResourceManager.getBitmap("Graphics/Pictures/" + command.params.unselected.name);
          }
          if (command.params.selected != null) {
            ResourceManager.getBitmap("Graphics/Pictures/" + command.params.selected.name);
          }
          if (command.params.selectedHover != null) {
            ResourceManager.getBitmap("Graphics/Pictures/" + command.params.selectedHover.name);
          }
          ref18 = command.params.hotspots;
          for (y = 0, len12 = ref18.length; y < len12; y++) {
            hotspot = ref18[y];
            if (hotspot.data.action === 2) {
              commonEvent = RecordManager.commonEvents[hotspot.data.commonEventId];
              if ((commonEvent != null) && !this.loadedCommonEventsById[hotspot.data.commonEventId]) {
                this.loadedCommonEventsById[hotspot.data.commonEventId] = true;
                this._loadEventCommandsGraphics(commonEvent.commands);
              }
            }
          }
          break;
        case "gs.MovePicturePath":
        case "vn.MoveCharacterPath":
        case "vn.ScrollBackgroundPath":
        case "gs.MoveVideoPath":
          if (command.params.path.effects != null) {
            ref19 = command.params.path.effects.data;
            for (z = 0, len13 = ref19.length; z < len13; z++) {
              effect = ref19[z];
              AudioManager.loadSound(effect.sound);
            }
          }
          break;
        case "gs.MaskPicture":
        case "vn.MaskCharacter":
        case "vn.MaskBackground":
        case "gs.MaskVideo":
          if (command.params.mask.sourceType === 0 && (command.params.mask.graphic != null)) {
            ResourceManager.getBitmap("Graphics/Masks/" + command.params.mask.graphic.name);
          }
          if (command.params.mask.sourceType === 1 && (command.params.mask.video != null)) {
            ResourceManager.getVideo("Movies/" + command.params.mask.video.name);
          }
          break;
        case "gs.PlayPictureAnimation":
          animationId = command.params.animationId;
          if ((animationId != null) && (animationId.scope == null)) {
            animation = RecordManager.animations[animationId];
            if (animation && animation.graphic) {
              ResourceManager.getBitmap("Graphics/Pictures/" + animation.graphic.name);
            }
          }
          break;
        case "gs.ShowBattleAnimation":
          animationId = command.params.animationId;
          if ((animationId != null) && (animationId.scope == null)) {
            animation = RecordManager.animations[animationId];
            this.loadComplexAnimation(animation);
          }
          break;
        case "gs.InputName":
          actorId = command.params.actorId;
          if ((actorId != null) && (actorId.scope == null)) {
            actor = RecordManager.actors[actorId];
            if (actor != null) {
              ResourceManager.getBitmap("Graphics/Faces/" + ((ref20 = actor.faceGraphic) != null ? ref20.name : void 0));
            }
          }
          break;
        case "gs.ChangeTileset":
          if (command.params.graphic != null) {
            ResourceManager.getBitmap("Graphics/Tilesets/" + command.params.graphic.name);
          }
          break;
        case "gs.ChangeMapParallaxBackground":
          if (command.params.parallaxBackground != null) {
            ResourceManager.getBitmap("Graphics/Pictures/" + command.params.parallaxBackground.name);
          }
          break;
        case "gs.ChangeActorGraphic":
          if (command.params.changeCharacter && (command.params.characterGraphic != null)) {
            ResourceManager.getBitmap("Graphics/Characters/" + command.params.characterGraphic.name);
          }
          if (command.params.changeFace && (command.params.faceGraphic != null)) {
            ResourceManager.getBitmap("Graphics/Faces/" + command.params.faceGraphic.name);
          }
          break;
        case "gs.MoveEvent":
          ref21 = command.params.commands;
          for (i1 = 0, len14 = ref21.length; i1 < len14; i1++) {
            moveCommand = ref21[i1];
            switch (moveCommand.id) {
              case 44:
                ResourceManager.getBitmap("Graphics/Characters/" + moveCommand.resource.name);
                break;
              case 47:
                AudioManager.loadSound(moveCommand.resource);
            }
          }
          break;
        case "gs.TransformEnemy":
          if (((ref22 = command.params) != null ? ref22.targetId.scope : void 0) == null) {
            enemy = RecordManager.enemies[command.params.targetId];
            this.loadActorBattleAnimations(enemy);
          }
          break;
        case "gs.PlayMusic":
          if (command.params.music != null) {
            AudioManager.loadMusic(command.params.music);
          }
          break;
        case "gs.PlayVideo":
        case "gs.ShowVideo":
          if (command.params.video != null) {
            ResourceManager.getVideo("Movies/" + command.params.video.name);
          }
          if (((ref23 = command.params.animation) != null ? ref23.type : void 0) === gs.AnimationTypes.MASKING) {
            ResourceManager.getBitmap("Graphics/Masks/" + command.params.animation.mask.graphic.name);
          }
          break;
        case "gs.PlaySound":
          if (command.params.sound != null) {
            AudioManager.loadSound(command.params.sound);
            ResourceManager.getAudioBuffer("Audio/Sound/" + command.params.sound.name);
          }
          break;
        case "vn.ChangeSounds":
          ref24 = command.params.sounds;
          for (j1 = 0, len15 = ref24.length; j1 < len15; j1++) {
            sound = ref24[j1];
            if (sound != null) {
              AudioManager.loadSound(sound);
            }
          }
          break;
        case "gs.ChangeScreenCursor":
          if (((ref25 = command.params.graphic) != null ? ref25.name : void 0) != null) {
            ResourceManager.getBitmap("Graphics/Pictures/" + command.params.graphic.name);
          }
      }
    }
    return null;
  };


  /**
  * Loads all resources for the specified animation.
  *
  * @method loadAnimation
  * @param {Object} animation - The animation-record.
  * @static
   */

  ResourceLoader.prototype.loadAnimation = function(animation) {
    if ((animation != null) && (animation.graphic != null)) {
      return ResourceManager.getBitmap("Graphics/SimpleAnimations/" + animation.graphic.name);
    }
  };

  return ResourceLoader;

})();

gs.ResourceLoader = new ResourceLoader();

window.ResourceLoader = gs.ResourceLoader;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUE7O0FBQU07O0FBQ0Y7Ozs7Ozs7Ozs7RUFVYSx3QkFBQTtJQUNULElBQUMsQ0FBQSxpQkFBRCxHQUFxQjtJQUNyQixJQUFDLENBQUEsc0JBQUQsR0FBMEI7RUFGakI7OztBQUliOzs7Ozs7OzsyQkFPQSxtQkFBQSxHQUFxQixTQUFDLEtBQUQ7QUFDakIsUUFBQTtBQUFBLFNBQUEsVUFBQTtNQUNJLElBQUMsQ0FBQSxvQkFBRCxDQUFzQixLQUFNLENBQUEsQ0FBQSxDQUE1QjtBQURKO0FBR0EsV0FBTztFQUpVOzs7QUFNckI7Ozs7Ozs7OzJCQU9BLHdCQUFBLEdBQTBCLFNBQUMsTUFBRDtBQUN0QixRQUFBO0FBQUEsU0FBQSxXQUFBO01BQ0ksSUFBRyxDQUFBLEtBQUssT0FBTCxJQUFnQixDQUFBLEtBQUssV0FBeEI7UUFDSSxlQUFlLENBQUMsU0FBaEIsQ0FBMEIsb0JBQUEsR0FBcUIsTUFBTyxDQUFBLENBQUEsQ0FBdEQsRUFESjtPQUFBLE1BRUssSUFBRyxDQUFBLEtBQUssT0FBUjtRQUNELGVBQWUsQ0FBQyxRQUFoQixDQUF5QixTQUFBLEdBQVUsTUFBTyxDQUFBLENBQUEsQ0FBMUMsRUFEQzs7QUFIVDtBQUtBLFdBQU87RUFOZTs7O0FBUTFCOzs7Ozs7OzsyQkFPQSx3QkFBQSxHQUEwQixTQUFDLE1BQUQ7QUFDdEIsUUFBQTtBQUFBLFNBQUEsV0FBQTtNQUNJLElBQUcsTUFBTyxDQUFBLENBQUEsQ0FBUCxZQUFxQixLQUF4QjtBQUNJO0FBQUEsYUFBQSxxQ0FBQTs7QUFDSSxlQUFBLE1BQUE7WUFDSSxJQUFHLENBQUEsS0FBSyxPQUFMLElBQWdCLENBQUEsS0FBSyxXQUF4QjtjQUNJLEtBQUEsR0FBUSxDQUFFLENBQUEsQ0FBQTtjQUVWLG9CQUFHLEtBQUssQ0FBRSxVQUFQLENBQWtCLE9BQWxCLFVBQUg7Z0JBQ0ksZUFBZSxDQUFDLFNBQWhC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QyxJQUF4RCxFQURKOztVQUVBLHVEQUEyQixDQUFFLGNBQTFCLEtBQWtDLEVBQUUsQ0FBQyxjQUFjLENBQUMsT0FBdkQ7WUFDSSxlQUFlLENBQUMsU0FBaEIsQ0FBMEIsaUJBQUEsR0FBa0IsT0FBTyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFsRixFQURKOztBQUhpQjtBQXhMekIsYUE2TFMsY0E3TFQ7VUE4TFEsSUFBRyw0QkFBSDtZQUNJLFlBQVksQ0FBQyxTQUFiLENBQXVCLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBdEM7WUFDQSxlQUFlLENBQUMsY0FBaEIsQ0FBK0IsY0FBQSxHQUFlLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQW5FLEVBRko7O0FBREM7QUE3TFQsYUFrTVMsaUJBbE1UO0FBbU1RO0FBQUEsZUFBQSw4Q0FBQTs7WUFDSSxJQUFHLGFBQUg7Y0FDSSxZQUFZLENBQUMsU0FBYixDQUF1QixLQUF2QixFQURKOztBQURKO0FBREM7QUFsTVQsYUF1TVMsdUJBdk1UO1VBd01RLElBQUcsd0VBQUg7WUFDSSxlQUFlLENBQUMsU0FBaEIsQ0FBMEIsb0JBQUEsR0FBcUIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBdEUsRUFESjs7QUF4TVI7QUFESjtBQTJNQSxXQUFPO0VBOU1pQjs7O0FBZ041Qjs7Ozs7Ozs7MkJBT0EsYUFBQSxHQUFlLFNBQUMsU0FBRDtJQUNYLElBQUcsbUJBQUEsSUFBZSwyQkFBbEI7YUFDSSxlQUFlLENBQUMsU0FBaEIsQ0FBMEIsNEJBQUEsR0FBNkIsU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUF6RSxFQURKOztFQURXOzs7Ozs7QUFNbkIsRUFBRSxDQUFDLGNBQUgsR0FBd0IsSUFBQSxjQUFBLENBQUE7O0FBQ3hCLE1BQU0sQ0FBQyxjQUFQLEdBQXdCLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuI1xuIyAgIFNjcmlwdDogUmVzb3VyY2VMb2FkZXJcbiNcbiMgICAkJENPUFlSSUdIVCQkXG4jXG4jID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmNsYXNzIFJlc291cmNlTG9hZGVyXG4gICAgIyMjKlxuICAgICogVGhlIHJlc291cmNlIGhlbHBzIHRvIGxvYWQgYSBidW5jaCBvZiByZXNvdXJjZXMgZnJvbSBkaWZmZXJlbnQga2luZCBvZlxuICAgICogZGF0YSBzdHJ1Y3R1cmVzLlxuICAgICpcbiAgICAqIEBtb2R1bGUgZ3NcbiAgICAqIEBjbGFzcyBSZXNvdXJjZUxvYWRlclxuICAgICogQG1lbWJlcm9mIGdzXG4gICAgKiBAY29uc3RydWN0b3JcbiAgICAqIEBzdGF0aWNcbiAgICAjIyNcbiAgICBjb25zdHJ1Y3RvcjogLT5cbiAgICAgICAgQGxvYWRlZFNjZW5lc0J5VWlkID0ge31cbiAgICAgICAgQGxvYWRlZENvbW1vbkV2ZW50c0J5SWQgPSBbXVxuICAgIFxuICAgICMjIypcbiAgICAqIExvYWRzIGFsbCBncmFwaGljcyBmb3IgdGhlIHNwZWNpZmllZCBsaXN0IG9mIGN1c3RvbSBsYXlvdXQgdHlwZXMvdGVtcGxhdGVzXG4gICAgKlxuICAgICogQG1ldGhvZCBsb2FkVWlUeXBlc0dyYXBoaWNzXG4gICAgKiBAcGFyYW0ge09iamVjdFtdfSB0eXBlcyAtIEFuIGFycmF5IG9mIGN1c3RvbSBsYXlvdXQgdHlwZXMvdGVtcGxhdGVzXG4gICAgKiBAc3RhdGljXG4gICAgIyMjIFxuICAgIGxvYWRVaVR5cGVzR3JhcGhpY3M6ICh0eXBlcykgLT5cbiAgICAgICAgZm9yIGsgb2YgdHlwZXNcbiAgICAgICAgICAgIEBsb2FkVWlMYXlvdXRHcmFwaGljcyh0eXBlc1trXSlcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICByZXR1cm4gbnVsbFxuICAgIFxuICAgICMjIypcbiAgICAqIExvYWRzIGFsbCBncmFwaGljcyBmb3IgdGhlIHNwZWNpZmllZCBsYXlvdXQtZGVzY3JpcHRvci5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGxvYWRVaUdyYXBoaWNzRnJvbU9iamVjdFxuICAgICogQHBhcmFtIHtPYmplY3R9IGxheW91dCAtIFRoZSBsYXlvdXQgZGVzY3JpcHRvci5cbiAgICAqIEBzdGF0aWNcbiAgICAjIyMgXG4gICAgbG9hZFVpR3JhcGhpY3NGcm9tT2JqZWN0OiAobGF5b3V0KSAtPlxuICAgICAgICBmb3IgayBvZiBsYXlvdXRcbiAgICAgICAgICAgIGlmIGsgPT0gXCJpbWFnZVwiIG9yIGsgPT0gXCJmdWxsSW1hZ2VcIlxuICAgICAgICAgICAgICAgIFJlc291cmNlTWFuYWdlci5nZXRCaXRtYXAoXCJHcmFwaGljcy9QaWN0dXJlcy8je2xheW91dFtrXX1cIilcbiAgICAgICAgICAgIGVsc2UgaWYgayA9PSBcInZpZGVvXCJcbiAgICAgICAgICAgICAgICBSZXNvdXJjZU1hbmFnZXIuZ2V0VmlkZW8oXCJNb3ZpZXMvI3tsYXlvdXRba119XCIpICAgICAgICBcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICBcbiAgICAjIyMqXG4gICAgKiBMb2FkcyBhbGwgZ3JhcGhpY3MgZm9yIHRoZSBzcGVjaWZpZWQgbGF5b3V0LWRlc2NyaXB0b3IuXG4gICAgKlxuICAgICogQG1ldGhvZCBsb2FkVWlEYXRhRmllbGRzR3JhcGhpY3NcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBsYXlvdXQgLSBUaGUgbGF5b3V0IGRlc2NyaXB0b3IuXG4gICAgKiBAc3RhdGljXG4gICAgIyMjICAgICBcbiAgICBsb2FkVWlEYXRhRmllbGRzR3JhcGhpY3M6IChsYXlvdXQpIC0+XG4gICAgICAgIGZvciBrIG9mIGxheW91dFxuICAgICAgICAgICAgaWYgbGF5b3V0W2tdIGluc3RhbmNlb2YgQXJyYXlcbiAgICAgICAgICAgICAgICBmb3IgbyBpbiBsYXlvdXRba11cbiAgICAgICAgICAgICAgICAgICAgZm9yIGogb2Ygb1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgaiA9PSBcImltYWdlXCIgb3IgaiA9PSBcImZ1bGxJbWFnZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2UgPSBvW2pdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgaW1hZ2U/LnN0YXJ0c1dpdGgoXCJkYXRhOlwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZXNvdXJjZU1hbmFnZXIuZ2V0Qml0bWFwKG9bal0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZXNvdXJjZU1hbmFnZXIuZ2V0Qml0bWFwKFwiR3JhcGhpY3MvUGljdHVyZXMvI3tvW2pdfVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgIHJldHVybiBudWxsXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIExvYWRzIGFsbCBncmFwaGljcyBmb3IgdGhlIHNwZWNpZmllZCBsYXlvdXQtZGVzY3JpcHRvci5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGxvYWRVaURhdGFGaWVsZHNHcmFwaGljc1xuICAgICogQHBhcmFtIHtPYmplY3R9IGxheW91dCAtIFRoZSBsYXlvdXQgZGVzY3JpcHRvci5cbiAgICAqIEBzdGF0aWNcbiAgICAjIyMgICAgIFxuICAgIGxvYWRVaUxheW91dEdyYXBoaWNzOiAobGF5b3V0KSAtPlxuICAgICAgICBpZiBsYXlvdXQucHJlbG9hZD9cbiAgICAgICAgICAgIGlmIGxheW91dC5wcmVsb2FkLmdyYXBoaWNzP1xuICAgICAgICAgICAgICAgIGZvciBncmFwaGljIGluIGxheW91dC5wcmVsb2FkLmdyYXBoaWNzXG4gICAgICAgICAgICAgICAgICAgIGlmIGdyYXBoaWMubmFtZT9cbiAgICAgICAgICAgICAgICAgICAgICAgIFJlc291cmNlTWFuYWdlci5nZXRCaXRtYXAoXCIje2dyYXBoaWMuZm9sZGVyfHwnR3JhcGhpY3MvUGljdHVyZXMnfS8je3VpLkNvbXBvbmVudF9Gb3JtdWxhSGFuZGxlci5maWVsZFZhbHVlKG51bGwsIGdyYXBoaWMubmFtZSl9XCIpXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdCA9IHVpLkNvbXBvbmVudF9Gb3JtdWxhSGFuZGxlci5maWVsZFZhbHVlKG51bGwsIGdyYXBoaWMucGF0aClcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciBzdWIgaW4gb2JqZWN0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgc3ViP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWFnZSA9IHVpLkNvbXBvbmVudF9Gb3JtdWxhSGFuZGxlci5maWVsZFZhbHVlKHN1YiwgZ3JhcGhpYy5pbWFnZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgaW1hZ2U/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZXNvdXJjZU1hbmFnZXIuZ2V0Qml0bWFwKFwiR3JhcGhpY3MvUGljdHVyZXMvI3tpbWFnZX1cIilcbiAgICAgICAgICAgIGlmIGxheW91dC5wcmVsb2FkLnZpZGVvcz9cbiAgICAgICAgICAgICAgICBmb3IgdmlkZW8gaW4gbGF5b3V0LnByZWxvYWQudmlkZW9zXG4gICAgICAgICAgICAgICAgICAgIGlmIHZpZGVvLm5hbWU/XG4gICAgICAgICAgICAgICAgICAgICAgICBSZXNvdXJjZU1hbmFnZXIuZ2V0VmlkZW8oXCIje3ZpZGVvLmZvbGRlcnx8J01vdmllcyd9LyN7dmlkZW8ubmFtZX1cIilcbiAgICAgICAgICAgIGlmIGxheW91dC5wcmVsb2FkLm11c2ljP1xuICAgICAgICAgICAgICAgIGZvciBtdXNpYyBpbiBsYXlvdXQucHJlbG9hZC5tdXNpY1xuICAgICAgICAgICAgICAgICAgICBpZiBtdXNpYz9cbiAgICAgICAgICAgICAgICAgICAgICAgIFJlc291cmNlTWFuYWdlci5nZXRWaWRlbyhcIiN7bXVzaWMuZm9sZGVyfHwnQXVkaW8vTXVzaWMnfS8je211c2ljLm5hbWUgfHwgbXVzaWN9XCIpXG4gICAgICAgICAgICBpZiBsYXlvdXQucHJlbG9hZC5zb3VuZHM/XG4gICAgICAgICAgICAgICAgZm9yIHNvdW5kIGluIGxheW91dC5wcmVsb2FkLnNvdW5kc1xuICAgICAgICAgICAgICAgICAgICBpZiBzb3VuZD9cbiAgICAgICAgICAgICAgICAgICAgICAgIFJlc291cmNlTWFuYWdlci5nZXRBdWRpb0J1ZmZlcihcIiN7c291bmQuZm9sZGVyfHwnQXVkaW8vU291bmRzJ30vI3t1aS5Db21wb25lbnRfRm9ybXVsYUhhbmRsZXIuZmllbGRWYWx1ZShsYXlvdXQsIHNvdW5kLm5hbWUgfHwgc291bmQpfVwiKVxuICAgICAgICBpZiBsYXlvdXQuaW1hZ2VzP1xuICAgICAgICAgICAgZm9yIGltYWdlIGluIGxheW91dC5pbWFnZXNcbiAgICAgICAgICAgICAgICBSZXNvdXJjZU1hbmFnZXIuZ2V0Qml0bWFwKFwiR3JhcGhpY3MvUGljdHVyZXMvI3tpbWFnZX1cIilcbiAgICAgICAgaWYgbGF5b3V0LmFuaW1hdGlvbnM/XG4gICAgICAgICAgICBmb3IgZGVzY3JpcHRvciBpbiBsYXlvdXQuYW5pbWF0aW9uc1xuICAgICAgICAgICAgICAgIGZvciBhbmltYXRpb24gaW4gZGVzY3JpcHRvci5mbG93XG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCBhbmltYXRpb24udHlwZVxuICAgICAgICAgICAgICAgICAgICAgICAgd2hlbiBcInNvdW5kXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZXNvdXJjZU1hbmFnZXIuZ2V0QXVkaW9CdWZmZXIoXCJBdWRpby9Tb3VuZHMvI3thbmltYXRpb24uc291bmR9XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICB3aGVuIFwiY2hhbmdlSW1hZ2VzXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgaW1hZ2UgaW4gYW5pbWF0aW9uLmltYWdlc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZXNvdXJjZU1hbmFnZXIuZ2V0Qml0bWFwKFwiR3JhcGhpY3MvUGljdHVyZXMvI3tpbWFnZX1cIilcbiAgICAgICAgICAgICAgICAgICAgICAgIHdoZW4gXCJtYXNrVG9cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlc291cmNlTWFuYWdlci5nZXRCaXRtYXAoXCJHcmFwaGljcy9NYXNrcy8je2FuaW1hdGlvbi5tYXNrfVwiKVxuICAgICAgICAgICAgICAgICAgICBpZiBhbmltYXRpb24uc291bmQ/XG4gICAgICAgICAgICAgICAgICAgICAgICBSZXNvdXJjZU1hbmFnZXIuZ2V0QXVkaW9CdWZmZXIoXCJBdWRpby9Tb3VuZHMvI3thbmltYXRpb24uc291bmR9XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgXG4gICAgICAgIGlmIGxheW91dC5pbWFnZT9cbiAgICAgICAgICAgIFJlc291cmNlTWFuYWdlci5nZXRCaXRtYXAoXCJHcmFwaGljcy9QaWN0dXJlcy8je2xheW91dC5pbWFnZX1cIilcbiAgICAgICAgaWYgbGF5b3V0LnZpZGVvP1xuICAgICAgICAgICAgUmVzb3VyY2VNYW5hZ2VyLmdldEJpdG1hcChcIkdyYXBoaWNzL01vdmllcy8je2xheW91dC52aWRlb31cIilcbiAgICAgICAgaWYgbGF5b3V0LmN1c3RvbUZpZWxkcz9cbiAgICAgICAgICAgIEBsb2FkVWlHcmFwaGljc0Zyb21PYmplY3QobGF5b3V0LmN1c3RvbUZpZWxkcylcbiAgICAgICAgaWYgbGF5b3V0LmN1c3RvbUZpZWxkcz8uYWN0aW9ucz9cbiAgICAgICAgICAgIGZvciBhY3Rpb24gaW4gbGF5b3V0LmN1c3RvbUZpZWxkcy5hY3Rpb25zXG4gICAgICAgICAgICAgICAgaWYgYWN0aW9uLm5hbWUgPT0gXCJwbGF5Vm9pY2VcIiBvciBhY3Rpb24ubmFtZSA9PSBcInBsYXlTb3VuZFwiXG4gICAgICAgICAgICAgICAgICAgIEF1ZGlvTWFuYWdlci5sb2FkU291bmQoYWN0aW9uLnBhcmFtcy5uYW1lKVxuICAgICAgICBpZiBsYXlvdXQuYWN0aW9ucz8gb3IgbGF5b3V0LmFjdGlvbj9cbiAgICAgICAgICAgIGFjdGlvbnMgPSBpZiBsYXlvdXQuYWN0aW9uPyB0aGVuIFtsYXlvdXQuYWN0aW9uXSBlbHNlIGxheW91dC5hY3Rpb25zXG4gICAgICAgICAgICBmb3IgYWN0aW9uIGluIGFjdGlvbnNcbiAgICAgICAgICAgICAgICBpZiBhY3Rpb24ubmFtZSA9PSBcInBsYXlWb2ljZVwiIG9yIGFjdGlvbi5uYW1lID09IFwicGxheVNvdW5kXCJcbiAgICAgICAgICAgICAgICAgICAgQXVkaW9NYW5hZ2VyLmxvYWRTb3VuZChhY3Rpb24ucGFyYW1zLm5hbWUpXG4gICAgICAgIGlmIGxheW91dC5wYXJhbXNcbiAgICAgICAgICAgIEBsb2FkVWlMYXlvdXRHcmFwaGljcyhsYXlvdXQucGFyYW1zKVxuICAgICAgICBpZiBsYXlvdXQudGVtcGxhdGU/XG4gICAgICAgICAgICBAbG9hZFVpTGF5b3V0R3JhcGhpY3MobGF5b3V0LnRlbXBsYXRlKVxuICAgICAgICBpZiBsYXlvdXQuc3R5bGU/IGFuZCB1aS5VaUZhY3Rvcnkuc3R5bGVzW2xheW91dC5zdHlsZV0/XG4gICAgICAgICAgICBAbG9hZFVpTGF5b3V0R3JhcGhpY3ModWkuVWlGYWN0b3J5LnN0eWxlc1tsYXlvdXQuc3R5bGVdKVxuICAgICAgICAgICAgZm9yIHNlbCBvZiB1aS5VSU1hbmFnZXIuc2VsZWN0b3JzXG4gICAgICAgICAgICAgICAgc3R5bGUgPSB1aS5VSU1hbmFnZXIuc3R5bGVzW2xheW91dC5zdHlsZSArIFwiOlwiK3NlbF1cbiAgICAgICAgICAgICAgICBpZiBzdHlsZSB0aGVuIEBsb2FkVWlMYXlvdXRHcmFwaGljcyhzdHlsZSlcbiAgICAgICAgaWYgdWkuVWlGYWN0b3J5LmN1c3RvbVR5cGVzW2xheW91dC50eXBlXT9cbiAgICAgICAgICAgIEBsb2FkVWlMYXlvdXRHcmFwaGljcyh1aS5VaUZhY3RvcnkuY3VzdG9tVHlwZXNbbGF5b3V0LnR5cGVdKVxuICAgICAgICBpZiBsYXlvdXQuY29udHJvbHM/XG4gICAgICAgICAgICBmb3IgY29udHJvbCBpbiBsYXlvdXQuY29udHJvbHNcbiAgICAgICAgICAgICAgICBAbG9hZFVpTGF5b3V0R3JhcGhpY3MoY29udHJvbClcbiAgICBcbiAgICAjIyMqXG4gICAgKiBMb2FkcyBhbGwgc3lzdGVtIHNvdW5kcy5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGxvYWRTeXN0ZW1Tb3VuZHNcbiAgICAqIEBzdGF0aWNcbiAgICAjIyMgICAgICAgICAgICAgICAgXG4gICAgbG9hZFN5c3RlbVNvdW5kczogLT5cbiAgICAgICAgZm9yIHNvdW5kIGluIFJlY29yZE1hbmFnZXIuc3lzdGVtLnNvdW5kc1xuICAgICAgICAgICAgQXVkaW9NYW5hZ2VyLmxvYWRTb3VuZChzb3VuZClcbiAgICAgXG4gICAgIyMjKlxuICAgICogTG9hZHMgYWxsIHN5c3RlbSBncmFwaGljcy5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGxvYWRTeXN0ZW1HcmFwaGljc1xuICAgICogQHN0YXRpY1xuICAgICMjIyAgICAgXG4gICAgbG9hZFN5c3RlbUdyYXBoaWNzOiAtPlxuICAgICAgICBmb3Igc2xvdCBpbiBHYW1lTWFuYWdlci5zYXZlR2FtZVNsb3RzXG4gICAgICAgICAgICBpZiBzbG90LnRodW1iPyBhbmQgc2xvdC50aHVtYi5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICAgUmVzb3VyY2VNYW5hZ2VyLmdldEJpdG1hcChzbG90LnRodW1iKVxuICAgICAgICBpZiBSZWNvcmRNYW5hZ2VyLnN5c3RlbS5jdXJzb3I/Lm5hbWVcbiAgICAgICAgICAgIFJlc291cmNlTWFuYWdlci5nZXRCaXRtYXAoXCJHcmFwaGljcy9QaWN0dXJlcy8je1JlY29yZE1hbmFnZXIuc3lzdGVtLmN1cnNvci5uYW1lfVwiKVxuICAgICAgICBpZiBSZWNvcmRNYW5hZ2VyLnN5c3RlbS50aXRsZVNjcmVlbj8ubmFtZVxuICAgICAgICAgICAgUmVzb3VyY2VNYW5hZ2VyLmdldEJpdG1hcChcIkdyYXBoaWNzL1BpY3R1cmVzLyN7UmVjb3JkTWFuYWdlci5zeXN0ZW0udGl0bGVTY3JlZW4ubmFtZX1cIilcbiAgICAgICAgaWYgUmVjb3JkTWFuYWdlci5zeXN0ZW0ubGFuZ3VhZ2VTY3JlZW4/Lm5hbWVcbiAgICAgICAgICAgIFJlc291cmNlTWFuYWdlci5nZXRCaXRtYXAoXCJHcmFwaGljcy9QaWN0dXJlcy8je1JlY29yZE1hbmFnZXIuc3lzdGVtLmxhbmd1YWdlU2NyZWVuLm5hbWV9XCIpXG4gICAgICAgIGlmIFJlY29yZE1hbmFnZXIuc3lzdGVtLm1lbnVCYWNrZ3JvdW5kPy5uYW1lXG4gICAgICAgICAgICBSZXNvdXJjZU1hbmFnZXIuZ2V0Qml0bWFwKFwiR3JhcGhpY3MvUGljdHVyZXMvI3tSZWNvcmRNYW5hZ2VyLnN5c3RlbS5tZW51QmFja2dyb3VuZC5uYW1lfVwiKVxuICAgICAgICByZXR1cm4gbnVsbFxuICAgIFxuICAgICMjIypcbiAgICAqIExvYWRzIGFsbCByZXNvdXJjZXMgbmVlZGVkIGJ5IHRoZSBzcGVjaWZpZWQgbGlzdCBvZiBjb21tYW5kcy5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGxvYWRFdmVudENvbW1hbmRzR3JhcGhpY3NcbiAgICAqIEBwYXJhbSB7T2JqZWN0W119IGNvbW1hbmRzIC0gVGhlIGxpc3Qgb2YgY29tbWFuZHMuXG4gICAgKiBAcmV0dXJuIHtib29sZWFufSBJbmRpY2F0ZXMgaWYgZGF0YSBuZWVkcyB0byBiZSBsb2FkZWQuIFxuICAgICogQHN0YXRpY1xuICAgICMjIyBcbiAgICBsb2FkRXZlbnRDb21tYW5kc0RhdGE6IChjb21tYW5kcykgLT5cbiAgICAgICAgQGxvYWRlZFNjZW5lc0J5VWlkID0ge31cbiAgICAgICAgcmV0dXJuIEBfbG9hZEV2ZW50Q29tbWFuZHNEYXRhKGNvbW1hbmRzKVxuICAgICAgICBcbiAgICBfbG9hZEV2ZW50Q29tbWFuZHNEYXRhOiAoY29tbWFuZHMpIC0+XG4gICAgICAgIHJldHVybiBubyBpZiBub3QgY29tbWFuZHM/XG4gICAgICAgIFxuICAgICAgICByZXN1bHQgPSBub1xuICAgICAgICBcbiAgICAgICAgZm9yIGNvbW1hbmQgaW4gY29tbWFuZHNcbiAgICAgICAgICAgIHN3aXRjaCBjb21tYW5kLmlkXG4gICAgICAgICAgICAgICAgd2hlbiBcInZuLkNob2ljZVwiXG4gICAgICAgICAgICAgICAgICAgIGlmIGNvbW1hbmQucGFyYW1zLmFjdGlvbi5zY2VuZVxuICAgICAgICAgICAgICAgICAgICAgICAgc2NlbmVEb2N1bWVudCA9IERhdGFNYW5hZ2VyLmdldERvY3VtZW50KGNvbW1hbmQucGFyYW1zLmFjdGlvbi5zY2VuZS51aWQpXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBzY2VuZURvY3VtZW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gIXNjZW5lRG9jdW1lbnQubG9hZGVkIGlmICFyZXN1bHRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiBzY2VuZURvY3VtZW50LmxvYWRlZCBhbmQgIUBsb2FkZWRTY2VuZXNCeVVpZFtzY2VuZURvY3VtZW50LnVpZF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQGxvYWRlZFNjZW5lc0J5VWlkW3NjZW5lRG9jdW1lbnQudWlkXSA9IHllc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBAX2xvYWRFdmVudENvbW1hbmRzRGF0YShzY2VuZURvY3VtZW50Lml0ZW1zLmNvbW1hbmRzKSBpZiAhcmVzdWx0XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB3aGVuIFwidm4uQ2FsbFNjZW5lXCJcbiAgICAgICAgICAgICAgICAgICAgaWYgY29tbWFuZC5wYXJhbXMuc2NlbmVcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjZW5lRG9jdW1lbnQgPSBEYXRhTWFuYWdlci5nZXREb2N1bWVudChjb21tYW5kLnBhcmFtcy5zY2VuZS51aWQpXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBzY2VuZURvY3VtZW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gIXNjZW5lRG9jdW1lbnQubG9hZGVkIGlmICFyZXN1bHRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiBzY2VuZURvY3VtZW50LmxvYWRlZCBhbmQgIUBsb2FkZWRTY2VuZXNCeVVpZFtzY2VuZURvY3VtZW50LnVpZF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQGxvYWRlZFNjZW5lc0J5VWlkW3NjZW5lRG9jdW1lbnQudWlkXSA9IHllc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBAX2xvYWRFdmVudENvbW1hbmRzRGF0YShzY2VuZURvY3VtZW50Lml0ZW1zLmNvbW1hbmRzKSBpZiAhcmVzdWx0XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gcmVzdWx0ICBcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogTG9hZHMgYWxsIHJlc291cmNlcyBuZWVkZWQgYnkgdGhlIHNwZWNpZmllZCBsaXN0IG9mIGNvbW1hbmRzLlxuICAgICpcbiAgICAqIEBtZXRob2QgbG9hZEV2ZW50Q29tbWFuZHNHcmFwaGljc1xuICAgICogQHBhcmFtIHtPYmplY3RbXX0gY29tbWFuZHMgLSBUaGUgbGlzdCBvZiBjb21tYW5kcy5cbiAgICAqIEBzdGF0aWNcbiAgICAjIyMgICAgIFxuICAgIGxvYWRFdmVudENvbW1hbmRzR3JhcGhpY3M6IChjb21tYW5kcykgLT5cbiAgICAgICAgQGxvYWRlZFNjZW5lc0J5VWlkID0ge31cbiAgICAgICAgQGxvYWRlZENvbW1vbkV2ZW50c0J5SWQgPSBbXVxuICAgICAgICBAX2xvYWRFdmVudENvbW1hbmRzR3JhcGhpY3MoY29tbWFuZHMpXG4gICAgICAgIFxuICAgIF9sb2FkRXZlbnRDb21tYW5kc0dyYXBoaWNzOiAoY29tbWFuZHMpIC0+XG4gICAgICAgIHJldHVybiBpZiBub3QgY29tbWFuZHM/XG4gICAgICAgIFxuICAgICAgICBmb3IgY29tbWFuZCBpbiBjb21tYW5kc1xuICAgICAgICAgICAgc3dpdGNoIGNvbW1hbmQuaWRcbiAgICAgICAgICAgICAgICB3aGVuIFwiZ3MuQ2FsbENvbW1vbkV2ZW50XCJcbiAgICAgICAgICAgICAgICAgICAgY29tbW9uRXZlbnQgPSBSZWNvcmRNYW5hZ2VyLmNvbW1vbkV2ZW50c1tjb21tYW5kLnBhcmFtcy5jb21tb25FdmVudElkXVxuICAgICAgICAgICAgICAgICAgICBpZiBjb21tb25FdmVudD9cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciBwYXJhbSwgaSBpbiBjb21tb25FdmVudC5wYXJhbWV0ZXJzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgcGFyYW0uc3RyaW5nVmFsdWVUeXBlID09IFwic2NlbmVJZFwiIGFuZCBjb21tYW5kLnBhcmFtcy5wYXJhbWV0ZXJzPy52YWx1ZXNbaV1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NlbmVEb2N1bWVudCA9IERhdGFNYW5hZ2VyLmdldERvY3VtZW50KGNvbW1hbmQucGFyYW1zLnBhcmFtZXRlcnMudmFsdWVzW2ldKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiBzY2VuZURvY3VtZW50IGFuZCAhQGxvYWRlZFNjZW5lc0J5VWlkW3NjZW5lRG9jdW1lbnQudWlkXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQGxvYWRlZFNjZW5lc0J5VWlkW3NjZW5lRG9jdW1lbnQudWlkXSA9IHllc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQF9sb2FkRXZlbnRDb21tYW5kc0dyYXBoaWNzKHNjZW5lRG9jdW1lbnQuaXRlbXMuY29tbWFuZHMpXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAhQGxvYWRlZENvbW1vbkV2ZW50c0J5SWRbY29tbWFuZC5wYXJhbXMuY29tbW9uRXZlbnRJZF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBAbG9hZGVkQ29tbW9uRXZlbnRzQnlJZFtjb21tYW5kLnBhcmFtcy5jb21tb25FdmVudElkXSA9IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBAX2xvYWRFdmVudENvbW1hbmRzR3JhcGhpY3MoY29tbW9uRXZlbnQuY29tbWFuZHMpXG4gICAgICAgICAgICAgICAgd2hlbiBcInZuLkNhbGxTY2VuZVwiXG4gICAgICAgICAgICAgICAgICAgIHNjZW5lRG9jdW1lbnQgPSBEYXRhTWFuYWdlci5nZXREb2N1bWVudChjb21tYW5kLnBhcmFtcy5zY2VuZS51aWQpXG4gICAgICAgICAgICAgICAgICAgIGlmIHNjZW5lRG9jdW1lbnQgYW5kICFAbG9hZGVkU2NlbmVzQnlVaWRbc2NlbmVEb2N1bWVudC51aWRdXG4gICAgICAgICAgICAgICAgICAgICAgICBAbG9hZGVkU2NlbmVzQnlVaWRbc2NlbmVEb2N1bWVudC51aWRdID0geWVzXG4gICAgICAgICAgICAgICAgICAgICAgICBAX2xvYWRFdmVudENvbW1hbmRzR3JhcGhpY3Moc2NlbmVEb2N1bWVudC5pdGVtcy5jb21tYW5kcylcbiAgICAgICAgICAgICAgICB3aGVuIFwiZ3MuQ2hhbmdlVHJhbnNpdGlvblwiXG4gICAgICAgICAgICAgICAgICAgIFJlc291cmNlTWFuYWdlci5nZXRCaXRtYXAoXCJHcmFwaGljcy9NYXNrcy8je2NvbW1hbmQucGFyYW1zLmdyYXBoaWM/Lm5hbWV9XCIpXG4gICAgICAgICAgICAgICAgd2hlbiBcImdzLlNjcmVlblRyYW5zaXRpb25cIlxuICAgICAgICAgICAgICAgICAgICBSZXNvdXJjZU1hbmFnZXIuZ2V0Qml0bWFwKFwiR3JhcGhpY3MvTWFza3MvI3tjb21tYW5kLnBhcmFtcy5ncmFwaGljPy5uYW1lfVwiKVxuICAgICAgICAgICAgICAgIHdoZW4gXCJ2bi5DaGFuZ2VCYWNrZ3JvdW5kXCJcbiAgICAgICAgICAgICAgICAgICAgaWYgY29tbWFuZC5wYXJhbXMuZ3JhcGhpYz9cbiAgICAgICAgICAgICAgICAgICAgICAgIFJlc291cmNlTWFuYWdlci5nZXRCaXRtYXAoXCJHcmFwaGljcy9CYWNrZ3JvdW5kcy8je2NvbW1hbmQucGFyYW1zLmdyYXBoaWMubmFtZX1cIilcbiAgICAgICAgICAgICAgICAgICAgaWYgY29tbWFuZC5wYXJhbXMuYW5pbWF0aW9uPy50eXBlID09IGdzLkFuaW1hdGlvblR5cGVzLk1BU0tJTkcgYW5kIGNvbW1hbmQucGFyYW1zLmFuaW1hdGlvbi5tYXNrPy5ncmFwaGljXG4gICAgICAgICAgICAgICAgICAgICAgICBSZXNvdXJjZU1hbmFnZXIuZ2V0Qml0bWFwKFwiR3JhcGhpY3MvTWFza3MvI3tjb21tYW5kLnBhcmFtcy5hbmltYXRpb24ubWFzay5ncmFwaGljLm5hbWV9XCIpXG4gICAgICAgICAgICAgICAgd2hlbiBcInZuLkwyREpvaW5TY2VuZVwiXG4gICAgICAgICAgICAgICAgICAgIGlmIGNvbW1hbmQucGFyYW1zLm1vZGVsP1xuICAgICAgICAgICAgICAgICAgICAgICAgUmVzb3VyY2VNYW5hZ2VyLmdldExpdmUyRE1vZGVsKFwiTGl2ZTJELyN7Y29tbWFuZC5wYXJhbXMubW9kZWwubmFtZX1cIilcbiAgICAgICAgICAgICAgICB3aGVuIFwidm4uQ2hhcmFjdGVySm9pblNjZW5lXCJcbiAgICAgICAgICAgICAgICAgICAgY2hhcmFjdGVyID0gUmVjb3JkTWFuYWdlci5jaGFyYWN0ZXJzW2NvbW1hbmQucGFyYW1zLmNoYXJhY3RlcklkXVxuICAgICAgICAgICAgICAgICAgICBpZiBjaGFyYWN0ZXI/XG4gICAgICAgICAgICAgICAgICAgICAgICBleHByZXNzaW9uSWQgPSBjb21tYW5kLnBhcmFtcy5leHByZXNzaW9uSWQgPyBjaGFyYWN0ZXIuZGVmYXVsdEV4cHJlc3Npb25JZFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgZXhwcmVzc2lvbklkP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlY29yZCA9IFJlY29yZE1hbmFnZXIuY2hhcmFjdGVyRXhwcmVzc2lvbnNbZXhwcmVzc2lvbklkXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIHJlY29yZD9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgcmVjb3JkLmlkbGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciBpbWFnZSBpbiByZWNvcmQuaWRsZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlc291cmNlTWFuYWdlci5nZXRCaXRtYXAoXCJHcmFwaGljcy9DaGFyYWN0ZXJzLyN7aW1hZ2UucmVzb3VyY2UubmFtZX1cIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgcmVjb3JkLnRhbGtpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciBpbWFnZSBpbiByZWNvcmQudGFsa2luZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlc291cmNlTWFuYWdlci5nZXRCaXRtYXAoXCJHcmFwaGljcy9DaGFyYWN0ZXJzLyN7aW1hZ2UucmVzb3VyY2UubmFtZX1cIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgaWYgY29tbWFuZC5wYXJhbXMuYW5pbWF0aW9uLnR5cGUgPT0gZ3MuQW5pbWF0aW9uVHlwZXMuTUFTS0lORyBhbmQgY29tbWFuZC5wYXJhbXMuYW5pbWF0aW9uLm1hc2suZ3JhcGhpYz9cbiAgICAgICAgICAgICAgICAgICAgICAgIFJlc291cmNlTWFuYWdlci5nZXRCaXRtYXAoXCJHcmFwaGljcy9NYXNrcy8je2NvbW1hbmQucGFyYW1zLmFuaW1hdGlvbi5tYXNrLmdyYXBoaWMubmFtZX1cIilcbiAgICAgICAgICAgICAgICB3aGVuIFwidm4uQ2hhcmFjdGVyQ2hhbmdlRXhwcmVzc2lvblwiXG4gICAgICAgICAgICAgICAgICAgIHJlY29yZCA9IFJlY29yZE1hbmFnZXIuY2hhcmFjdGVyRXhwcmVzc2lvbnNbY29tbWFuZC5wYXJhbXMuZXhwcmVzc2lvbklkXVxuICAgICAgICAgICAgICAgICAgICBpZiByZWNvcmQ/XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgaW1hZ2UgaW4gcmVjb3JkLmlkbGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZXNvdXJjZU1hbmFnZXIuZ2V0Qml0bWFwKFwiR3JhcGhpY3MvQ2hhcmFjdGVycy8je2ltYWdlLnJlc291cmNlLm5hbWV9XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgaW1hZ2UgaW4gcmVjb3JkLnRhbGtpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZXNvdXJjZU1hbmFnZXIuZ2V0Qml0bWFwKFwiR3JhcGhpY3MvQ2hhcmFjdGVycy8je2ltYWdlLnJlc291cmNlLm5hbWV9XCIpXG4gICAgICAgICAgICAgICAgICAgIGlmIGNvbW1hbmQucGFyYW1zLmFuaW1hdGlvbi50eXBlID09IGdzLkFuaW1hdGlvblR5cGVzLk1BU0tJTkcgYW5kIGNvbW1hbmQucGFyYW1zLmFuaW1hdGlvbi5tYXNrLmdyYXBoaWM/XG4gICAgICAgICAgICAgICAgICAgICAgICBSZXNvdXJjZU1hbmFnZXIuZ2V0Qml0bWFwKFwiR3JhcGhpY3MvTWFza3MvI3tjb21tYW5kLnBhcmFtcy5hbmltYXRpb24ubWFzay5ncmFwaGljLm5hbWV9XCIpICAgICAgICBcbiAgICAgICAgICAgICAgICB3aGVuIFwiZ3MuU2hvd1BhcnRpYWxNZXNzYWdlXCJcbiAgICAgICAgICAgICAgICAgICAgaWYgY29tbWFuZC5wYXJhbXMudm9pY2U/XG4gICAgICAgICAgICAgICAgICAgICAgICBBdWRpb01hbmFnZXIubG9hZFNvdW5kKGNvbW1hbmQucGFyYW1zLnZvaWNlKVxuICAgICAgICAgICAgICAgICAgICAgICAgI1Jlc291cmNlTWFuYWdlci5nZXRBdWRpb0J1ZmZlcihcIkF1ZGlvL1NvdW5kLyN7Y29tbWFuZC5wYXJhbXMudm9pY2UubmFtZX1cIilcbiAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgd2hlbiBcInZuLkNob2ljZVwiXG4gICAgICAgICAgICAgICAgICAgIGlmIGNvbW1hbmQucGFyYW1zLmFjdGlvbi5zY2VuZVxuICAgICAgICAgICAgICAgICAgICAgICAgc2NlbmVEb2N1bWVudCA9IERhdGFNYW5hZ2VyLmdldERvY3VtZW50KGNvbW1hbmQucGFyYW1zLmFjdGlvbi5zY2VuZS51aWQpXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBzY2VuZURvY3VtZW50IGFuZCAhQGxvYWRlZFNjZW5lc0J5VWlkW3NjZW5lRG9jdW1lbnQudWlkXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEBsb2FkZWRTY2VuZXNCeVVpZFtzY2VuZURvY3VtZW50LnVpZF0gPSB5ZXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBAX2xvYWRFdmVudENvbW1hbmRzR3JhcGhpY3Moc2NlbmVEb2N1bWVudC5pdGVtcy5jb21tYW5kcylcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHdoZW4gXCJncy5TaG93TWVzc2FnZVwiLCBcImdzLlNob3dNZXNzYWdlTlZMXCIsIFwiZ3MuU2hvd1RleHRcIlxuICAgICAgICAgICAgICAgICAgICBpZiBjb21tYW5kLnBhcmFtcy5hbmltYXRpb25zP1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIGVpZCBpbiBjb21tYW5kLnBhcmFtcy5hbmltYXRpb25zXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uID0gUmVjb3JkTWFuYWdlci5hbmltYXRpb25zW2VpZF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiBhbmltYXRpb24/IGFuZCBhbmltYXRpb24uZ3JhcGhpYy5uYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlc291cmNlTWFuYWdlci5nZXRCaXRtYXAoXCJHcmFwaGljcy9QaWN0dXJlcy8je2FuaW1hdGlvbi5ncmFwaGljLm5hbWV9XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBpZiBjb21tYW5kLnBhcmFtcy5leHByZXNzaW9ucz9cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciBlaWQgaW4gY29tbWFuZC5wYXJhbXMuZXhwcmVzc2lvbnNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHByZXNzaW9uID0gUmVjb3JkTWFuYWdlci5jaGFyYWN0ZXJFeHByZXNzaW9uc1tlaWRdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgZXhwcmVzc2lvbj9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgZXhwcmVzc2lvbi5pZGxlIHRoZW4gZm9yIGltYWdlIGluIGV4cHJlc3Npb24uaWRsZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVzb3VyY2VNYW5hZ2VyLmdldEJpdG1hcChcIkdyYXBoaWNzL0NoYXJhY3RlcnMvI3tpbWFnZS5yZXNvdXJjZS5uYW1lfVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiBleHByZXNzaW9uLnRhbGtpbmcgdGhlbiBmb3IgaW1hZ2UgaW4gZXhwcmVzc2lvbi50YWxraW5nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZXNvdXJjZU1hbmFnZXIuZ2V0Qml0bWFwKFwiR3JhcGhpY3MvQ2hhcmFjdGVycy8je2ltYWdlLnJlc291cmNlLm5hbWV9XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGlmIGNvbW1hbmQucGFyYW1zLnZvaWNlP1xuICAgICAgICAgICAgICAgICAgICAgICAgQXVkaW9NYW5hZ2VyLmxvYWRTb3VuZChjb21tYW5kLnBhcmFtcy52b2ljZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICNSZXNvdXJjZU1hbmFnZXIuZ2V0QXVkaW9CdWZmZXIoXCJBdWRpby9Tb3VuZC8je2NvbW1hbmQucGFyYW1zLnZvaWNlLm5hbWV9XCIpXG4gICAgICAgICAgICAgICAgICAgIHJlY29yZCA9IFJlY29yZE1hbmFnZXIuY2hhcmFjdGVyRXhwcmVzc2lvbnNbY29tbWFuZC5wYXJhbXMuZXhwcmVzc2lvbklkXVxuICAgICAgICAgICAgICAgICAgICBpZiByZWNvcmQ/XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiByZWNvcmQuaWRsZSB0aGVuIGZvciBpbWFnZSBpbiByZWNvcmQuaWRsZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlc291cmNlTWFuYWdlci5nZXRCaXRtYXAoXCJHcmFwaGljcy9DaGFyYWN0ZXJzLyN7aW1hZ2UucmVzb3VyY2UubmFtZX1cIilcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIHJlY29yZC50YWxraW5nIHRoZW4gZm9yIGltYWdlIGluIHJlY29yZC50YWxraW5nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVzb3VyY2VNYW5hZ2VyLmdldEJpdG1hcChcIkdyYXBoaWNzL0NoYXJhY3RlcnMvI3tpbWFnZS5yZXNvdXJjZS5uYW1lfVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgXG4gICAgICAgICAgICAgICAgd2hlbiBcImdzLkFkZEhvdHNwb3RcIlxuICAgICAgICAgICAgICAgICAgICBpZiBjb21tYW5kLnBhcmFtcy5iYXNlR3JhcGhpYz8gYW5kIGNvbW1hbmQucGFyYW1zLmJhc2VHcmFwaGljLm5hbWU/XG4gICAgICAgICAgICAgICAgICAgICAgICBSZXNvdXJjZU1hbmFnZXIuZ2V0Qml0bWFwKFwiR3JhcGhpY3MvUGljdHVyZXMvI3tjb21tYW5kLnBhcmFtcy5iYXNlR3JhcGhpYy5uYW1lfVwiKVxuICAgICAgICAgICAgICAgICAgICBpZiBjb21tYW5kLnBhcmFtcy5ob3ZlckdyYXBoaWM/IGFuZCBjb21tYW5kLnBhcmFtcy5ob3ZlckdyYXBoaWMubmFtZT9cbiAgICAgICAgICAgICAgICAgICAgICAgIFJlc291cmNlTWFuYWdlci5nZXRCaXRtYXAoXCJHcmFwaGljcy9QaWN0dXJlcy8je2NvbW1hbmQucGFyYW1zLmhvdmVyR3JhcGhpYy5uYW1lfVwiKVxuICAgICAgICAgICAgICAgICAgICBpZiBjb21tYW5kLnBhcmFtcy5zZWxlY3RlZEdyYXBoaWM/IGFuZCBjb21tYW5kLnBhcmFtcy5zZWxlY3RlZEdyYXBoaWMubmFtZT9cbiAgICAgICAgICAgICAgICAgICAgICAgIFJlc291cmNlTWFuYWdlci5nZXRCaXRtYXAoXCJHcmFwaGljcy9QaWN0dXJlcy8je2NvbW1hbmQucGFyYW1zLnNlbGVjdGVkR3JhcGhpYy5uYW1lfVwiKVxuICAgICAgICAgICAgICAgICAgICBpZiBjb21tYW5kLnBhcmFtcy5zZWxlY3RlZEhvdmVyR3JhcGhpYz8gYW5kIGNvbW1hbmQucGFyYW1zLnNlbGVjdGVkSG92ZXJHcmFwaGljLm5hbWU/XG4gICAgICAgICAgICAgICAgICAgICAgICBSZXNvdXJjZU1hbmFnZXIuZ2V0Qml0bWFwKFwiR3JhcGhpY3MvUGljdHVyZXMvI3tjb21tYW5kLnBhcmFtcy5zZWxlY3RlZEhvdmVyR3JhcGhpYy5uYW1lfVwiKVxuICAgICAgICAgICAgICAgICAgICBpZiBjb21tYW5kLnBhcmFtcy51bnNlbGVjdGVkR3JhcGhpYz8gYW5kIGNvbW1hbmQucGFyYW1zLnVuc2VsZWN0ZWRHcmFwaGljLm5hbWU/XG4gICAgICAgICAgICAgICAgICAgICAgICBSZXNvdXJjZU1hbmFnZXIuZ2V0Qml0bWFwKFwiR3JhcGhpY3MvUGljdHVyZXMvI3tjb21tYW5kLnBhcmFtcy51bnNlbGVjdGVkR3JhcGhpYy5uYW1lfVwiKVxuICAgICAgICAgICAgICAgIHdoZW4gXCJncy5TaG93UGljdHVyZVwiXG4gICAgICAgICAgICAgICAgICAgIGlmIGNvbW1hbmQucGFyYW1zLmdyYXBoaWM/XG4gICAgICAgICAgICAgICAgICAgICAgICBSZXNvdXJjZU1hbmFnZXIuZ2V0Qml0bWFwKFwiR3JhcGhpY3MvUGljdHVyZXMvI3tjb21tYW5kLnBhcmFtcy5ncmFwaGljLm5hbWV9XCIpXG4gICAgICAgICAgICAgICAgICAgIGlmIGNvbW1hbmQucGFyYW1zLmFuaW1hdGlvbj8udHlwZSA9PSBncy5BbmltYXRpb25UeXBlcy5NQVNLSU5HXG4gICAgICAgICAgICAgICAgICAgICAgICBSZXNvdXJjZU1hbmFnZXIuZ2V0Qml0bWFwKFwiR3JhcGhpY3MvTWFza3MvI3tjb21tYW5kLnBhcmFtcy5hbmltYXRpb24ubWFzay5ncmFwaGljLm5hbWV9XCIpXG4gICAgICAgICAgICAgICAgd2hlbiBcImdzLlNob3dJbWFnZU1hcFwiXG4gICAgICAgICAgICAgICAgICAgIGlmIGNvbW1hbmQucGFyYW1zLmdyb3VuZD9cbiAgICAgICAgICAgICAgICAgICAgICAgIFJlc291cmNlTWFuYWdlci5nZXRCaXRtYXAoXCJHcmFwaGljcy9QaWN0dXJlcy8je2NvbW1hbmQucGFyYW1zLmdyb3VuZC5uYW1lfVwiKVxuICAgICAgICAgICAgICAgICAgICBpZiBjb21tYW5kLnBhcmFtcy5ob3Zlcj9cbiAgICAgICAgICAgICAgICAgICAgICAgIFJlc291cmNlTWFuYWdlci5nZXRCaXRtYXAoXCJHcmFwaGljcy9QaWN0dXJlcy8je2NvbW1hbmQucGFyYW1zLmhvdmVyLm5hbWV9XCIpXG4gICAgICAgICAgICAgICAgICAgIGlmIGNvbW1hbmQucGFyYW1zLnVuc2VsZWN0ZWQ/XG4gICAgICAgICAgICAgICAgICAgICAgICBSZXNvdXJjZU1hbmFnZXIuZ2V0Qml0bWFwKFwiR3JhcGhpY3MvUGljdHVyZXMvI3tjb21tYW5kLnBhcmFtcy51bnNlbGVjdGVkLm5hbWV9XCIpXG4gICAgICAgICAgICAgICAgICAgIGlmIGNvbW1hbmQucGFyYW1zLnNlbGVjdGVkP1xuICAgICAgICAgICAgICAgICAgICAgICAgUmVzb3VyY2VNYW5hZ2VyLmdldEJpdG1hcChcIkdyYXBoaWNzL1BpY3R1cmVzLyN7Y29tbWFuZC5wYXJhbXMuc2VsZWN0ZWQubmFtZX1cIilcbiAgICAgICAgICAgICAgICAgICAgaWYgY29tbWFuZC5wYXJhbXMuc2VsZWN0ZWRIb3Zlcj9cbiAgICAgICAgICAgICAgICAgICAgICAgIFJlc291cmNlTWFuYWdlci5nZXRCaXRtYXAoXCJHcmFwaGljcy9QaWN0dXJlcy8je2NvbW1hbmQucGFyYW1zLnNlbGVjdGVkSG92ZXIubmFtZX1cIilcbiAgICAgICAgICAgICAgICAgICAgZm9yIGhvdHNwb3QgaW4gY29tbWFuZC5wYXJhbXMuaG90c3BvdHNcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIGhvdHNwb3QuZGF0YS5hY3Rpb24gPT0gMiAjIENvbW1vbiBFdmVudFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1vbkV2ZW50ID0gUmVjb3JkTWFuYWdlci5jb21tb25FdmVudHNbaG90c3BvdC5kYXRhLmNvbW1vbkV2ZW50SWRdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgY29tbW9uRXZlbnQ/IGFuZCAhQGxvYWRlZENvbW1vbkV2ZW50c0J5SWRbaG90c3BvdC5kYXRhLmNvbW1vbkV2ZW50SWRdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEBsb2FkZWRDb21tb25FdmVudHNCeUlkW2hvdHNwb3QuZGF0YS5jb21tb25FdmVudElkXSA9IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQF9sb2FkRXZlbnRDb21tYW5kc0dyYXBoaWNzKGNvbW1vbkV2ZW50LmNvbW1hbmRzKVxuICAgICAgICAgICAgICAgIHdoZW4gXCJncy5Nb3ZlUGljdHVyZVBhdGhcIiwgXCJ2bi5Nb3ZlQ2hhcmFjdGVyUGF0aFwiLCBcInZuLlNjcm9sbEJhY2tncm91bmRQYXRoXCIsIFwiZ3MuTW92ZVZpZGVvUGF0aFwiICAgXG4gICAgICAgICAgICAgICAgICAgIGlmIGNvbW1hbmQucGFyYW1zLnBhdGguZWZmZWN0cz9cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciBlZmZlY3QgaW4gY29tbWFuZC5wYXJhbXMucGF0aC5lZmZlY3RzLmRhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBdWRpb01hbmFnZXIubG9hZFNvdW5kKGVmZmVjdC5zb3VuZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB3aGVuIFwiZ3MuTWFza1BpY3R1cmVcIiwgXCJ2bi5NYXNrQ2hhcmFjdGVyXCIsIFwidm4uTWFza0JhY2tncm91bmRcIiwgXCJncy5NYXNrVmlkZW9cIlxuICAgICAgICAgICAgICAgICAgICBpZiBjb21tYW5kLnBhcmFtcy5tYXNrLnNvdXJjZVR5cGUgPT0gMCBhbmQgY29tbWFuZC5wYXJhbXMubWFzay5ncmFwaGljP1xuICAgICAgICAgICAgICAgICAgICAgICAgUmVzb3VyY2VNYW5hZ2VyLmdldEJpdG1hcChcIkdyYXBoaWNzL01hc2tzLyN7Y29tbWFuZC5wYXJhbXMubWFzay5ncmFwaGljLm5hbWV9XCIpXG4gICAgICAgICAgICAgICAgICAgIGlmIGNvbW1hbmQucGFyYW1zLm1hc2suc291cmNlVHlwZSA9PSAxIGFuZCBjb21tYW5kLnBhcmFtcy5tYXNrLnZpZGVvP1xuICAgICAgICAgICAgICAgICAgICAgICAgUmVzb3VyY2VNYW5hZ2VyLmdldFZpZGVvKFwiTW92aWVzLyN7Y29tbWFuZC5wYXJhbXMubWFzay52aWRlby5uYW1lfVwiKVxuICAgICAgICAgICAgICAgIHdoZW4gXCJncy5QbGF5UGljdHVyZUFuaW1hdGlvblwiXG4gICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvbklkID0gY29tbWFuZC5wYXJhbXMuYW5pbWF0aW9uSWRcbiAgICAgICAgICAgICAgICAgICAgaWYgYW5pbWF0aW9uSWQ/IGFuZCBub3QgYW5pbWF0aW9uSWQuc2NvcGU/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uID0gUmVjb3JkTWFuYWdlci5hbmltYXRpb25zW2FuaW1hdGlvbklkXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIGFuaW1hdGlvbiBhbmQgYW5pbWF0aW9uLmdyYXBoaWNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVzb3VyY2VNYW5hZ2VyLmdldEJpdG1hcChcIkdyYXBoaWNzL1BpY3R1cmVzLyN7YW5pbWF0aW9uLmdyYXBoaWMubmFtZX1cIilcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB3aGVuIFwiZ3MuU2hvd0JhdHRsZUFuaW1hdGlvblwiXG4gICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvbklkID0gY29tbWFuZC5wYXJhbXMuYW5pbWF0aW9uSWRcbiAgICAgICAgICAgICAgICAgICAgaWYgYW5pbWF0aW9uSWQ/IGFuZCBub3QgYW5pbWF0aW9uSWQuc2NvcGU/XG4gICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRpb24gPSBSZWNvcmRNYW5hZ2VyLmFuaW1hdGlvbnNbYW5pbWF0aW9uSWRdXG4gICAgICAgICAgICAgICAgICAgICAgICBAbG9hZENvbXBsZXhBbmltYXRpb24oYW5pbWF0aW9uKVxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgd2hlbiBcImdzLklucHV0TmFtZVwiXG4gICAgICAgICAgICAgICAgICAgIGFjdG9ySWQgPSBjb21tYW5kLnBhcmFtcy5hY3RvcklkXG4gICAgICAgICAgICAgICAgICAgIGlmIGFjdG9ySWQ/IGFuZCBub3QgYWN0b3JJZC5zY29wZT9cbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdG9yID0gUmVjb3JkTWFuYWdlci5hY3RvcnNbYWN0b3JJZF1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIGFjdG9yP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlc291cmNlTWFuYWdlci5nZXRCaXRtYXAoXCJHcmFwaGljcy9GYWNlcy8je2FjdG9yLmZhY2VHcmFwaGljPy5uYW1lfVwiKVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB3aGVuIFwiZ3MuQ2hhbmdlVGlsZXNldFwiXG4gICAgICAgICAgICAgICAgICAgIGlmIGNvbW1hbmQucGFyYW1zLmdyYXBoaWM/XG4gICAgICAgICAgICAgICAgICAgICAgICBSZXNvdXJjZU1hbmFnZXIuZ2V0Qml0bWFwKFwiR3JhcGhpY3MvVGlsZXNldHMvI3tjb21tYW5kLnBhcmFtcy5ncmFwaGljLm5hbWV9XCIpXG4gICAgICAgICAgICAgICAgd2hlbiBcImdzLkNoYW5nZU1hcFBhcmFsbGF4QmFja2dyb3VuZFwiXG4gICAgICAgICAgICAgICAgICAgIGlmIGNvbW1hbmQucGFyYW1zLnBhcmFsbGF4QmFja2dyb3VuZD9cbiAgICAgICAgICAgICAgICAgICAgICAgIFJlc291cmNlTWFuYWdlci5nZXRCaXRtYXAoXCJHcmFwaGljcy9QaWN0dXJlcy8je2NvbW1hbmQucGFyYW1zLnBhcmFsbGF4QmFja2dyb3VuZC5uYW1lfVwiKVxuICAgICAgICAgICAgICAgIHdoZW4gXCJncy5DaGFuZ2VBY3RvckdyYXBoaWNcIlxuICAgICAgICAgICAgICAgICAgICBpZiBjb21tYW5kLnBhcmFtcy5jaGFuZ2VDaGFyYWN0ZXIgYW5kIGNvbW1hbmQucGFyYW1zLmNoYXJhY3RlckdyYXBoaWM/XG4gICAgICAgICAgICAgICAgICAgICAgICBSZXNvdXJjZU1hbmFnZXIuZ2V0Qml0bWFwKFwiR3JhcGhpY3MvQ2hhcmFjdGVycy8je2NvbW1hbmQucGFyYW1zLmNoYXJhY3RlckdyYXBoaWMubmFtZX1cIilcbiAgICAgICAgICAgICAgICAgICAgaWYgY29tbWFuZC5wYXJhbXMuY2hhbmdlRmFjZSBhbmQgY29tbWFuZC5wYXJhbXMuZmFjZUdyYXBoaWM/XG4gICAgICAgICAgICAgICAgICAgICAgICBSZXNvdXJjZU1hbmFnZXIuZ2V0Qml0bWFwKFwiR3JhcGhpY3MvRmFjZXMvI3tjb21tYW5kLnBhcmFtcy5mYWNlR3JhcGhpYy5uYW1lfVwiKVxuICAgICAgICAgICAgICAgIHdoZW4gXCJncy5Nb3ZlRXZlbnRcIlxuICAgICAgICAgICAgICAgICAgICBmb3IgbW92ZUNvbW1hbmQgaW4gY29tbWFuZC5wYXJhbXMuY29tbWFuZHNcbiAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCBtb3ZlQ29tbWFuZC5pZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoZW4gNDQgIyBDaGFuZ2UgR3JhcGhpY1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZXNvdXJjZU1hbmFnZXIuZ2V0Qml0bWFwKFwiR3JhcGhpY3MvQ2hhcmFjdGVycy8je21vdmVDb21tYW5kLnJlc291cmNlLm5hbWV9XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2hlbiA0NyAjIFBsYXkgU291bmRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQXVkaW9NYW5hZ2VyLmxvYWRTb3VuZChtb3ZlQ29tbWFuZC5yZXNvdXJjZSlcbiAgICAgICAgICAgICAgICB3aGVuIFwiZ3MuVHJhbnNmb3JtRW5lbXlcIlxuICAgICAgICAgICAgICAgICAgICBpZiBub3QgY29tbWFuZC5wYXJhbXM/LnRhcmdldElkLnNjb3BlPyAjIEZJWE1FOiBNYXliZSBqdXN0IHVzZSB0aGUgY3VycmVudCB2YXJpYWJsZSB2YWx1ZT9cbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZW15ID0gUmVjb3JkTWFuYWdlci5lbmVtaWVzW2NvbW1hbmQucGFyYW1zLnRhcmdldElkXVxuICAgICAgICAgICAgICAgICAgICAgICAgQGxvYWRBY3RvckJhdHRsZUFuaW1hdGlvbnMoZW5lbXkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgd2hlbiBcImdzLlBsYXlNdXNpY1wiXG4gICAgICAgICAgICAgICAgICAgIGlmIGNvbW1hbmQucGFyYW1zLm11c2ljP1xuICAgICAgICAgICAgICAgICAgICAgICAgQXVkaW9NYW5hZ2VyLmxvYWRNdXNpYyhjb21tYW5kLnBhcmFtcy5tdXNpYylcbiAgICAgICAgICAgICAgICB3aGVuIFwiZ3MuUGxheVZpZGVvXCIsIFwiZ3MuU2hvd1ZpZGVvXCJcbiAgICAgICAgICAgICAgICAgICAgaWYgY29tbWFuZC5wYXJhbXMudmlkZW8/XG4gICAgICAgICAgICAgICAgICAgICAgICBSZXNvdXJjZU1hbmFnZXIuZ2V0VmlkZW8oXCJNb3ZpZXMvI3tjb21tYW5kLnBhcmFtcy52aWRlby5uYW1lfVwiKVxuICAgICAgICAgICAgICAgICAgICBpZiBjb21tYW5kLnBhcmFtcy5hbmltYXRpb24/LnR5cGUgPT0gZ3MuQW5pbWF0aW9uVHlwZXMuTUFTS0lOR1xuICAgICAgICAgICAgICAgICAgICAgICAgUmVzb3VyY2VNYW5hZ2VyLmdldEJpdG1hcChcIkdyYXBoaWNzL01hc2tzLyN7Y29tbWFuZC5wYXJhbXMuYW5pbWF0aW9uLm1hc2suZ3JhcGhpYy5uYW1lfVwiKVxuICAgICAgICAgICAgICAgIHdoZW4gXCJncy5QbGF5U291bmRcIlxuICAgICAgICAgICAgICAgICAgICBpZiBjb21tYW5kLnBhcmFtcy5zb3VuZD9cbiAgICAgICAgICAgICAgICAgICAgICAgIEF1ZGlvTWFuYWdlci5sb2FkU291bmQoY29tbWFuZC5wYXJhbXMuc291bmQpXG4gICAgICAgICAgICAgICAgICAgICAgICBSZXNvdXJjZU1hbmFnZXIuZ2V0QXVkaW9CdWZmZXIoXCJBdWRpby9Tb3VuZC8je2NvbW1hbmQucGFyYW1zLnNvdW5kLm5hbWV9XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB3aGVuIFwidm4uQ2hhbmdlU291bmRzXCJcbiAgICAgICAgICAgICAgICAgICAgZm9yIHNvdW5kIGluIGNvbW1hbmQucGFyYW1zLnNvdW5kc1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgc291bmQ/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQXVkaW9NYW5hZ2VyLmxvYWRTb3VuZChzb3VuZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB3aGVuIFwiZ3MuQ2hhbmdlU2NyZWVuQ3Vyc29yXCJcbiAgICAgICAgICAgICAgICAgICAgaWYgY29tbWFuZC5wYXJhbXMuZ3JhcGhpYz8ubmFtZT9cbiAgICAgICAgICAgICAgICAgICAgICAgIFJlc291cmNlTWFuYWdlci5nZXRCaXRtYXAoXCJHcmFwaGljcy9QaWN0dXJlcy8je2NvbW1hbmQucGFyYW1zLmdyYXBoaWMubmFtZX1cIilcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgXG4gICAgIyMjKlxuICAgICogTG9hZHMgYWxsIHJlc291cmNlcyBmb3IgdGhlIHNwZWNpZmllZCBhbmltYXRpb24uXG4gICAgKlxuICAgICogQG1ldGhvZCBsb2FkQW5pbWF0aW9uXG4gICAgKiBAcGFyYW0ge09iamVjdH0gYW5pbWF0aW9uIC0gVGhlIGFuaW1hdGlvbi1yZWNvcmQuXG4gICAgKiBAc3RhdGljXG4gICAgIyMjIFxuICAgIGxvYWRBbmltYXRpb246IChhbmltYXRpb24pIC0+XG4gICAgICAgIGlmIGFuaW1hdGlvbj8gYW5kIGFuaW1hdGlvbi5ncmFwaGljP1xuICAgICAgICAgICAgUmVzb3VyY2VNYW5hZ2VyLmdldEJpdG1hcChcIkdyYXBoaWNzL1NpbXBsZUFuaW1hdGlvbnMvI3thbmltYXRpb24uZ3JhcGhpYy5uYW1lfVwiKVxuICAgICAgICAgICAgXG4gICAgXG5cbmdzLlJlc291cmNlTG9hZGVyID0gbmV3IFJlc291cmNlTG9hZGVyKCkgICAgICAgIFxud2luZG93LlJlc291cmNlTG9hZGVyID0gZ3MuUmVzb3VyY2VMb2FkZXIiXX0=
//# sourceURL=ResourceLoader_30.js