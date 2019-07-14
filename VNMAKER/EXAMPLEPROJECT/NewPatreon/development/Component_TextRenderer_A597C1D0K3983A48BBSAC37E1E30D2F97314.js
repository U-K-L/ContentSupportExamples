var Component_TextRenderer, RendererTextLine, RendererToken,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

RendererTextLine = (function() {

  /**
  * Stores a text line.
  * 
  * @module gs.RendererTextLine
  * @class RendererTextLine
  * @memberof gs.RendererTextLine
  * @constructor
   */
  function RendererTextLine() {

    /*
    * The width of the line in pixels.
    * @property width
    * @type number
    * @protected
     */
    this.width = 0;

    /*
    * The height of the line in pixels.
    * @property width
    * @type number
    * @protected
     */
    this.height = 0;

    /*
    * The descent of the line in pixels.
    * @property descent
    * @type number
    * @protected
     */
    this.descent = 0;

    /*
    * The content of the line as token objects.
    * @property content
    * @type Object[]
    * @protected
     */
    this.content = [];
  }

  return RendererTextLine;

})();

gs.RendererTextLine = RendererTextLine;

RendererToken = (function() {

  /**
  * Stores a token.
  * 
  * @module gs
  * @class RendererToken
  * @memberof gs
  * @constructor
   */
  function RendererToken(code, value, font) {

    /*
    * The value of the token. That value depends on the token type. For text-tokens, it stores
    * the actual text.
    * @property content
    * @type string
     */
    this.value = value;

    /*
    * The code describes what kind of token it is. For example, if the code is "Y" it means it is a
    * style-token. If the code is <b>null</b>, it means it is a text-token.
    * @property code
    * @type string
     */
    this.code = code;

    /*
    * The format stores the font-style properties of the token like if it is italic, bold, etc. It can be <b>null</b>.
    * @property format
    * @type Object
     */
    this.format = null;
    if (font != null) {
      this.takeFormat(font);
    }
  }


  /**
  * Takes the style from the specified font and stores it into the format-property. The token will
  * will be rendered with that style then.
  * 
  * @method takeFormat
  * @param {gs.Font} font - The font to take the style from.
   */

  RendererToken.prototype.takeFormat = function(font) {
    return this.format = font.toDataBundle();
  };


  /**
  * Applies the format-style of the token on the specified font. The font will have the style from
  * then token then.
  * 
  * @method applyFormat
  * @param {gs.Font} font - The font to apply the format-style on.
   */

  RendererToken.prototype.applyFormat = function(font) {
    return font.set(this.format);
  };

  return RendererToken;

})();

gs.RendererToken = RendererToken;

Component_TextRenderer = (function(superClass) {
  extend(Component_TextRenderer, superClass);


  /**
  * A text-renderer component allow to draw plain or formatted text on a
  * game object's bitmap. For formatted text, different text-codes can be
  * used to add formatting or define a placeholder.<br><br>
  * 
  * A text-code uses the following syntax:<br><br>
  * 
  * {code:value} <- Single Value<br />
  * {code:value1,value2,...} <- Multiple Values<br><br>
  * 
  * Example:<br><br>
  * 
  * "This is {Y:I}a Text{Y:N}" <- "a Text" will be italic here.<br>
  * "The value is {GN:1}" <- "{GN:1}" will be replaced for the value of the global number variable 0001.<br><br>
  * 
  * For a list of all available text-codes with examples, just take a look into the offical help-file.
  * 
  * @module gs
  * @class Component_TextRenderer
  * @extends gs.Component
  * @memberof gs
  * @constructor
   */

  function Component_TextRenderer() {
    Component_TextRenderer.__super__.constructor.apply(this, arguments);

    /**
    * @property currentX
    * @type number
    * @protected
     */
    this.currentX = 0;

    /**
    * @property currentY
    * @type number
    * @protected
     */
    this.currentY = 0;

    /**
    * @property currentLineHeight
    * @type number
    * @protected
     */
    this.currentLineHeight = 0;

    /**
    * @property font
    * @type gs.Font
    * @protected
     */
    this.font = new Font("Times New Roman", 22);

    /**
    * @property spaceSize
    * @type number
    * @protected
     */
    this.spaceSize = 0;

    /**
    * @property fontSize
    * @type number
    * @protected
     */
    this.fontSize = 0;

    /**
    * The left and right padding per line.
    * @property padding
    * @type number
     */
    this.padding = 0;

    /**
    * The spacing between text lines in pixels.
    * @property lineSpacing
    * @type number
     */
    this.lineSpacing = 0;
  }


  /**
  * Creates the token-object for a list-placeholder. A list-placeholder
  * allows to insert a value from a list-variable.
  * 
  * @method createListToken
  * @param {Array} list - The list.
  * @param {Array} values - The values of the list-placeholder text-code.
  * @return {string} The token-object.
   */

  Component_TextRenderer.prototype.createListToken = function(list, values) {
    var index;
    index = 0;
    if (values[1] != null) {
      values = values[1].split(":");
      index = values[0];
      if (values[0] === "G") {
        index = GameManager.variableStore.numbers[parseInt(values[1]) - 1];
      } else if (values[0] === "P") {
        index = GameManager.variableStore.persistentNumbers[parseInt(values[1]) - 1];
      } else if (values[0] === "L") {
        index = GameManager.variableStore.numberValueOf({
          scope: 0,
          index: parseInt(values[1]) - 1
        });
      }
    }
    return "" + list[index];
  };

  Component_TextRenderer.prototype.parseVariableIdentifier = function(identifier) {
    var index, result;
    result = [0, identifier];
    if (isNaN(identifier)) {
      index = identifier.lastIndexOf(".");
      if (index !== -1) {
        result[0] = identifier.substring(0, index);
        result[1] = parseInt(identifier.substring(index + 1));
      }
    }
    return result;
  };


  /**
  * Creates a token-object for a specified text-code.
  * 
  * @method createToken
  * @param {string} code - The code/type of the text-code.
  * @param {string} value - The value of the text-code.
  * @return {Object} The token-object.
   */

  Component_TextRenderer.prototype.createToken = function(code, value) {
    var format, listIdentifier, macro, pair, ref, ref1, ref2, ref3, tokenObject, values;
    tokenObject = null;
    value = isNaN(value) ? value : parseInt(value);
    switch (code) {
      case "SZ":
        tokenObject = new gs.RendererToken(code, value);
        this.font.size = tokenObject.value || this.fontSize;
        this.spaceSize = this.font.measureTextPlain(" ");
        break;
      case "Y":
        tokenObject = {
          code: code,
          value: value
        };
        switch (value) {
          case "U":
            this.font.underline = true;
            break;
          case "S":
            this.font.strikeThrough = true;
            break;
          case "I":
            this.font.italic = true;
            break;
          case "B":
            this.font.bold = true;
            break;
          case "C":
            this.font.smallCaps = true;
            break;
          case "NU":
            this.font.underline = false;
            break;
          case "NS":
            this.font.strikeThrough = false;
            break;
          case "NI":
            this.font.italic = false;
            break;
          case "NB":
            this.font.bold = false;
            break;
          case "NC":
            this.font.smallCaps = false;
            break;
          case "N":
            this.font.underline = false;
            this.font.strikeThrough = false;
            this.font.italic = false;
            this.font.bold = false;
            this.font.smallCaps = false;
        }
        this.spaceSize = this.font.measureTextPlain(" ");
        break;
      case "C":
        tokenObject = new gs.RendererToken(code, value);
        if (value <= 0) {
          this.font.color = Font.defaultColor;
        } else {
          this.font.color = gs.Color.fromObject(RecordManager.system.colors[value - 1] || Font.defaultColor);
        }
        break;
      case "GN":
        values = isNaN(value) ? value.split(",") : [value];
        if (values[1]) {
          format = values[1];
          values = this.parseVariableIdentifier(values[0]);
          tokenObject = sprintf("%" + format + "d", GameManager.variableStore.numbersByDomain[values[0] || 0][values[1] - 1] || 0);
        } else {
          values = this.parseVariableIdentifier(values[0]);
          tokenObject = (GameManager.variableStore.numbersByDomain[values[0] || 0][values[1] - 1] || 0).toString();
        }
        break;
      case "GT":
        values = this.parseVariableIdentifier(value);
        tokenObject = GameManager.variableStore.stringsByDomain[values[0] || 0][values[1] - 1] || "";
        tokenObject = tokenObject.split(/\{([A-z]+):([^\{\}]+)\}|(\n)/gm);
        if (tokenObject.length > 1) {
          tokenObject.pop();
        } else {
          tokenObject = (ref = tokenObject[0]) != null ? ref : "";
        }
        break;
      case "GS":
        values = this.parseVariableIdentifier(value);
        tokenObject = (GameManager.variableStore.booleansByDomain[values[0] || 0][values[1] - 1] || false).toString();
        break;
      case "GL":
        values = value.split(",");
        listIdentifier = this.parseVariableIdentifier(values[0]);
        tokenObject = this.createListToken(GameManager.variableStore.listsByDomain[listIdentifier[0]][listIdentifier[1] - 1] || [], values);
        break;
      case "PN":
        values = isNaN(value) ? value.split(",") : [value];
        if (values[1]) {
          format = values[1];
          values = this.parseVariableIdentifier(values[0]);
          tokenObject = sprintf("%" + format + "d", GameManager.variableStore.persistentNumbers[values[0]][values[1] - 1] || 0);
        } else {
          tokenObject = (GameManager.variableStore.persistentNumbers[0][values[0] - 1] || 0).toString();
        }
        break;
      case "PT":
        values = this.parseVariableIdentifier(value);
        tokenObject = GameManager.variableStore.persistentStrings[values[0]][values[1] - 1] || "";
        tokenObject = tokenObject.split(/\{([A-z]+):([^\{\}]+)\}|(\n)/gm);
        if (tokenObject.length > 1) {
          tokenObject.pop();
        } else {
          tokenObject = (ref1 = tokenObject[0]) != null ? ref1 : "";
        }
        break;
      case "PS":
        values = this.parseVariableIdentifier(value);
        tokenObject = (GameManager.variableStore.persistentBooleans[values[0]][values[1] - 1] || false).toString();
        break;
      case "PL":
        values = value.split(",");
        listIdentifier = this.parseVariableIdentifier(values[0]);
        tokenObject = this.createListToken(GameManager.variableStore.persistentLists[listIdentifier[0]][listIdentifier[1] - 1] || [], values);
        break;
      case "LN":
        values = isNaN(value) ? value.split(",") : [value];
        if (values[1]) {
          tokenObject = sprintf("%" + values[1] + "d", GameManager.variableStore.numberValueOf({
            scope: 0,
            index: value - 1
          }) || 0);
        } else {
          tokenObject = (GameManager.variableStore.numberValueOf({
            scope: 0,
            index: value - 1
          }) || 0).toString();
        }
        break;
      case "LT":
        tokenObject = (GameManager.variableStore.stringValueOf({
          scope: 0,
          index: value - 1
        }) || "").toString();
        tokenObject = tokenObject.split(/\{([A-z]+):([^\{\}]+)\}|(\n)/gm);
        if (tokenObject.length > 1) {
          tokenObject.pop();
        } else {
          tokenObject = (ref2 = tokenObject[0]) != null ? ref2 : "";
        }
        break;
      case "LS":
        tokenObject = (GameManager.variableStore.booleanValueOf({
          scope: 0,
          index: value - 1
        }) || false).toString();
        break;
      case "LL":
        values = value.split(",");
        tokenObject = this.createListToken(GameManager.variableStore.listValueOf({
          scope: 0,
          index: values[0] - 1
        }) || [], values);
        break;
      case "N":
        tokenObject = (RecordManager.characters[value] != null ? lcs(RecordManager.characters[value].name) : "");
        break;
      case "RT":
        pair = value.split("/");
        tokenObject = {
          code: code,
          rtStyleId: (ref3 = pair[2]) != null ? ref3 : 0,
          rb: pair[0],
          rt: pair[1],
          rbSize: {
            width: 0,
            height: 0
          },
          rtSize: {
            width: 0,
            height: 0
          }
        };
        break;
      case "M":
        macro = RecordManager.system.textMacros.first(function(m) {
          return m.name === value;
        });
        if (macro) {
          if (macro.type === 0) {
            tokenObject = macro.content.split(/\{([A-z]+):([^\{\}]+)\}|(\n)/gm);
            tokenObject.pop();
          } else if (macro.type === 1) {
            if (!macro.contentFunc) {
              macro.contentFunc = eval("(function(object, value){ " + macro.content + " })");
            }
            tokenObject = macro.contentFunc(this.object, value);
            tokenObject = tokenObject.split(/\{([A-z]+):([^\{\}]+)\}|(\n)/gm);
            if (tokenObject.length > 1) {
              tokenObject.pop();
            }
          } else {
            if (!macro.contentFunc) {
              macro.contentFunc = eval("(function(object){ " + macro.content + " })");
            }
            tokenObject = new gs.RendererToken("X", macro.contentFunc);
          }
        } else {
          tokenObject = "";
        }
        break;
      default:
        tokenObject = new gs.RendererToken(code, value);
    }
    return tokenObject;
  };


  /**
  * <p>Gets the correct font for the specified ruby-text token.</p> 
  *
  * @param {Object} token - A ruby-text token.
  * @return {gs.Font} The font for the ruby-text which is shown above the original text.
  * @method getRubyTextFont
   */

  Component_TextRenderer.prototype.getRubyTextFont = function(token) {
    var font, ref, style;
    style = null;
    font = null;
    if (token.rtStyleId) {
      style = ui.UIManager.styles["rubyText-" + token.rtStyleId];
    }
    if (!style) {
      style = ui.UIManager.styles["rubyText"];
    }
    font = (ref = style != null ? style.font : void 0) != null ? ref : this.font;
    font.size = font.size || this.font.size / 2;
    return font;
  };


  /**
  * <p>Measures a control-token. If a token produces a visual result like displaying an icon then it must return the size taken by
  * the visual result. If the token has no visual result, <b>null</b> must be returned. This method is called for every token when the message is initialized.</p> 
  *
  * @param {Object} token - A control-token.
  * @return {gs.Size} The size of the area taken by the visual result of the token or <b>null</b> if the token has no visual result.
  * @method measureControlToken
  * @protected
   */

  Component_TextRenderer.prototype.measureControlToken = function(token) {
    var animation, font, fs, imageBitmap, size;
    size = null;
    switch (token.code) {
      case "A":
        animation = RecordManager.animations[Math.max(token.value - 1, 0)];
        if ((animation != null ? animation.graphic.name : void 0) != null) {
          imageBitmap = ResourceManager.getBitmap("Graphics/Pictures/" + animation.graphic.name);
          if (imageBitmap != null) {
            size = {
              width: Math.round(imageBitmap.width / animation.framesX),
              height: Math.round(imageBitmap.height / animation.framesY)
            };
          }
        }
        break;
      case "RT":
        font = this.getRubyTextFont(token);
        fs = font.size;
        font.size = font.size || this.font.size / 2;
        token.rbSize = this.font.measureTextPlain(token.rb);
        token.rtSize = font.measureTextPlain(token.rt);
        font.size = fs;
        size = {
          width: Math.max(token.rbSize.width, token.rtSize.width),
          height: token.rbSize.height + token.rtSize.height
        };
    }
    return size;
  };


  /**
  * <p>Draws the visual result of a token, like an icon for example, to the specified bitmap. This method is called for every token while the text is rendered.</p> 
  *
  * @param {Object} token - A control-token.
  * @param {gs.Bitmap} bitmap - The bitmap used for the current text-line. Can be used to draw something on it like an icon, etc.
  * @param {number} offset - An x-offset for the draw-routine.
  * @method drawControlToken
  * @protected
   */

  Component_TextRenderer.prototype.drawControlToken = function(token, bitmap, offset) {
    var animation, font, fs, imageBitmap, rect, ref, ref1, style;
    switch (token.code) {
      case "A":
        animation = RecordManager.animations[Math.max(token.value - 1, 0)];
        if ((animation != null ? animation.graphic.name : void 0) != null) {
          imageBitmap = ResourceManager.getBitmap("Graphics/Pictures/" + animation.graphic.name);
          if (imageBitmap != null) {
            rect = new gs.Rect(0, 0, Math.round(imageBitmap.width / animation.framesX), Math.round(imageBitmap.height / animation.framesY));
            return bitmap.blt(offset, this.currentY, imageBitmap, rect);
          }
        }
        break;
      case "RT":
        style = null;
        if (token.rtStyleId) {
          style = ui.UIManager.styles["rubyText-" + token.rtStyleId];
        }
        if (!style) {
          style = ui.UIManager.styles["rubyText"];
        }
        font = (ref = style != null ? style.font : void 0) != null ? ref : this.font;
        fs = font.size;
        font.size = font.size || this.font.size / 2;
        if (style && !((ref1 = style.descriptor.font) != null ? ref1.color : void 0)) {
          font.color.set(this.font.color);
        }
        bitmap.font = font;
        bitmap.drawText(offset, bitmap.font.descent, Math.max(token.rbSize.width, token.rtSize.width), bitmap.height, token.rt, 1, 0);
        bitmap.font = this.font;
        font.size = fs;
        return bitmap.drawText(offset, token.rtSize.height, Math.max(token.rbSize.width, token.rtSize.width), bitmap.height, token.rb, 1, 0);
    }
  };


  /**
  * Splits up the specified token using a japanese word-wrap technique.
  * 
  * @method wordWrapJapanese
  * @param {Object} token - The token to split up.
  * @param {gs.RendererTextLine} line - The current line.
  * @param {number} width - The width of the current line.
  * @param {number} height - The height of the current line.
  * @param {gs.RendererTextLine[]} - An array of lines. If the token is split up into multiple lines, all new
  * lines are added to this result array.
  * @return {gs.RendererTextLine} The current line, that may be the same as the <b>line</b> parameters but if new lines
  * are created it has to be the last new created line.
   */

  Component_TextRenderer.prototype.wordWrapJapanese = function(token, line, width, height, result) {
    var ch, depth, depthLevel, descent, endOfLine, i, j, lastCharacterIndex, moved, noSplit, size, startOfLine;
    startOfLine = '—…‥〳〴〵。.・、:;, ?!‼⁇⁈⁉‐゠–〜)]｝〕〉》」』】〙〗〟’"｠»ヽヾーァィゥェォッャュョヮヵヶぁぃぅぇぉっゃゅょゎゕゖㇰㇱㇲㇳㇴㇵㇶㇷㇸㇹㇺㇻㇼㇽㇾㇿ々〻';
    endOfLine = '([｛〔〈《「『【〘〖〝‘"｟«';
    noSplit = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789０１２３４５６７８９—…‥〳〴〵';
    descent = this.font.descent;
    size = this.font.measureTextPlain(token);
    depth = 8;
    depthLevel = 0;
    i = 0;
    j = 0;
    lastCharacterIndex = 0;
    if (size.width > this.object.dstRect.width - this.spaceSize.width * 3 - this.padding * 2) {
      while (i < token.length) {
        ch = token[i];
        size = this.font.measureTextPlain(ch);
        width += size.width;
        moved = false;
        if (width > this.object.dstRect.width - this.padding * 2) {
          depthLevel = 0;
          j = i;
          while (true) {
            moved = false;
            while (j > 0 && startOfLine.indexOf(token[j]) !== -1) {
              j--;
              moved = true;
            }
            while (j > 0 && endOfLine.indexOf(token[j - 1]) !== -1) {
              j--;
              moved = true;
            }
            while (j > 0 && noSplit.indexOf(token[j - 1]) !== -1) {
              j--;
              moved = true;
            }
            if (j === 0 && moved) {
              break;
            } else {
              i = j;
            }
            depthLevel++;
            if (depthLevel >= depth || !moved) {
              break;
            }
          }
          line.content.push(new gs.RendererToken(null, token.substring(lastCharacterIndex, i), this.font));
          lastCharacterIndex = i;
          line.height = Math.max(height, this.font.lineHeight);
          line.width = width - size.width;
          line.descent = descent;
          descent = this.font.descent;
          height = size.height;
          result.push(line);
          line = new gs.RendererTextLine();
          width = width - (width - size.width);
        }
        i++;
      }
    } else {
      line.content.push(new gs.RendererToken(null, token, this.font));
      line.height = Math.max(height, this.font.lineHeight);
      line.width = width + size.width;
      line.descent = descent;
    }
    height = Math.max(height, this.font.lineHeight);
    if (lastCharacterIndex !== i) {
      line.content.push(new gs.RendererToken(null, token.substring(lastCharacterIndex, i), this.font));
      line.width = width;
      line.height = Math.max(height, line.height);
      line.descent = descent;
    }
    return line;
  };


  /**
  * Does not word-wrapping at all. It just adds the text token to the line as is.
  * 
  * @method wordWrapNone
  * @param {Object} token - The token to split up.
  * @param {gs.RendererTextLine} line - The current line.
  * @param {number} width - The width of the current line.
  * @param {number} height - The height of the current line.
  * @param {gs.RendererTextLine[]} - An array of lines. If the token is split up into multiple lines, all new
  * lines are added to this result array.
  * @return {gs.RendererTextLine} The current line, that may be the same as the <b>line</b> parameters but if new lines
  * are created it has to be the last new created line.
   */

  Component_TextRenderer.prototype.wordWrapNone = function(token, line, width, height, result) {
    var size;
    size = this.font.measureTextPlain(token);
    height = Math.max(size.height, height || this.font.lineHeight);
    if (token.length > 0) {
      line.width += size.width;
      line.height = Math.max(height, line.height);
      line.descent = this.font.descent;
      line.content.push(new gs.RendererToken(null, token));
    }
    return line;
  };


  /**
  * Splits up the specified token using a space-based word-wrap technique.
  * 
  * @method wordWrapSpaceBased
  * @param {Object} token - The token to split up.
  * @param {gs.RendererTextLine} line - The current line.
  * @param {number} width - The width of the current line.
  * @param {number} height - The height of the current line.
  * @param {gs.RendererTextLine[]} - An array of lines. If the token is split up into multiple lines, all new
  * lines are added to this result array.
  * @return {gs.RendererTextLine} The current line, that may be the same as the <b>line</b> parameters but if new lines
  * are created it has to be the last new created line.
   */

  Component_TextRenderer.prototype.wordWrapSpaceBased = function(token, line, width, height, result) {
    var currentWords, descent, i, k, len, size, word, words;
    currentWords = [];
    words = token.split(" ");
    descent = this.font.descent;
    this.spaceSize = this.font.measureTextPlain(" ");
    for (i = k = 0, len = words.length; k < len; i = ++k) {
      word = words[i];
      size = this.font.measureTextPlain(word);
      width += size.width + this.spaceSize.width;
      if (width > this.object.dstRect.width - this.padding * 2) {
        token = new gs.RendererToken(null, currentWords.join(" "));
        token.takeFormat(this.font);
        line.content.push(token);
        line.height = Math.max(height, line.height);
        line.width = width - size.width;
        line.descent = Math.max(line.descent, descent);
        descent = Math.max(descent, this.font.descent);
        height = size.height;
        result.push(line);
        line = new gs.RendererTextLine();
        currentWords = [word];
        width = width - (width - size.width);
      } else {
        currentWords.push(word);
      }
      height = Math.max(height, this.font.lineHeight);
    }
    if (currentWords.length > 0) {
      token = new gs.RendererToken(null, currentWords.join(" "));
      token.takeFormat(this.font);
      line.content.push(token);
      line.width = width;
      line.height = Math.max(height, line.height);
      line.descent = Math.max(descent, line.descent);
    }
    return line;
  };


  /**
  * Splits up the specified token using a word-wrap technique. The kind of word-wrap technique
  * depends on the selected language. You can overwrite this method in derived classes to implement your
  * own custom word-wrap techniques.
  * 
  * @method executeWordWrap
  * @param {Object} token - The token to split up.
  * @param {gs.RendererTextLine} line - The current line.
  * @param {number} width - The width of the current line.
  * @param {number} height - The height of the current line.
  * @param {gs.RendererTextLine[]} - An array of lines. If the token is split up into multiple lines, all new
  * lines are added to this result array.
  * @return {gs.RendererTextLine} The current line, that may be the same as the <b>line</b> parameters but if new lines
  * are created it has to be the last new created line.
   */

  Component_TextRenderer.prototype.executeWordWrap = function(token, line, width, height, result, wordWrap) {
    if (wordWrap) {
      switch (LanguageManager.language.wordWrap) {
        case "spaceBased":
          return this.wordWrapSpaceBased(token, line, width, height, result);
        case "japanese":
          return this.wordWrapJapanese(token, line, width, height, result);
      }
    } else {
      return this.wordWrapNone(token, line, width, height, result);
    }
  };


  /**
  * Creates an a of line-objects. Each line-object is a list of token-objects. 
  * A token-object can be just a string or an object containing more information
  * about how to process the token at runtime.
  * 
  * A line-object also contains additional information like the width and height
  * of the line(in pixels).
  * 
  * If the wordWrap param is set, line-breaks are automatically created if a line
  * doesn't fit into the width of the game object's bitmap.
  * 
  * @method calculateLines
  * @param {string} message - A message creating the line-objects for.
  * @param {boolean} wordWrap - If wordWrap is set to true, line-breaks are automatically created.
  * @param {number} [firstLineWidth=0] - The current width of the first line.
  * @return {Array} An array of line-objects.
   */

  Component_TextRenderer.prototype.calculateLines = function(message, wordWrap, firstLineWidth) {
    var bold, currentWords, descent, height, italic, line, result, size, smallCaps, strikeThrough, t, token, tokenObject, tokens, underline, width;
    result = [];
    line = new gs.RendererTextLine();
    width = firstLineWidth || 0;
    height = 0;
    descent = this.font.descent;
    currentWords = [];
    size = null;
    this.spaceSize = this.font.measureChar(" ");
    this.fontSize = this.font.size;
    tokens = message.split(/\{([A-z]+):([^\{\}]+)\}|(\n)/gm);
    token = null;
    t = 0;
    underline = this.font.underline;
    strikeThrough = this.font.strikeThrough;
    italic = this.font.italic;
    bold = this.font.bold;
    smallCaps = this.font.smallCaps;
    while (t < tokens.length) {
      token = tokens[t];
      if (t % 4 !== 0) {
        if (token != null) {
          tokenObject = this.createToken(token, tokens[t + 1]);
          if (tokenObject.push != null) {
            Array.prototype.splice.apply(tokens, [t + 3, 0].concat(tokenObject));
          } else if (tokenObject.code == null) {
            tokens[t + 3] = tokenObject + tokens[t + 3];
          } else {
            size = this.measureControlToken(tokenObject);
            if (size) {
              width += size.width;
              height = Math.max(height, size.height);
            }
            line.content.push(tokenObject);
          }
        } else {
          line.height = height || this.font.lineHeight;
          line.width = width;
          line.descent = descent;
          result.push(line);
          line = new gs.RendererTextLine();
          line.content.push(new gs.RendererToken(null, "\n", this.font));
          width = 0;
          height = 0;
          descent = this.font.descent;
        }
        t += 2;
      } else if (token.length > 0) {
        line = this.executeWordWrap(token, line, width, height, result, wordWrap);
        width = line.width;
        height = line.height;
        descent = line.descent;
      }
      t++;
    }
    if (line.content.length > 0 || result.length === 0) {
      line.height = height;
      line.width = width;
      line.descent = descent;
      result.push(line);
    }
    this.font.size = this.fontSize;
    this.font.underline = underline;
    this.font.strikeThrough = strikeThrough;
    this.font.italic = italic;
    this.font.bold = bold;
    this.font.smallCaps = smallCaps;
    return result;
  };


  /**
  * Measures the dimensions of formatted lines in pixels. The result is not
  * pixel-perfect.
  * 
  * @method measureFormattedLines
  * @param {gs.RendererTextLine[]} lines - An array of text lines to measure.
  * @param {boolean} wordWrap - If wordWrap is set to true, automatically created line-breaks will be calculated.
  * @result {Object} An object containing the width and height of the text.
   */

  Component_TextRenderer.prototype.measureFormattedLines = function(lines, wordWrap) {
    var k, len, line, size;
    size = {
      width: 0,
      height: 0
    };
    for (k = 0, len = lines.length; k < len; k++) {
      line = lines[k];
      size.width = Math.max(line.width + 2, size.width);
      size.height += line.height + this.lineSpacing;
    }
    size.height -= this.lineSpacing;
    return size;
  };


  /**
  * Measures the dimensions of a formatted text in pixels. The result is not
  * pixel-perfect.
  * 
  * @method measureFormattedText
  * @param {string} text - The text to measure.
  * @param {boolean} wordWrap - If wordWrap is set to true, automatically created line-breaks will be calculated.
  * @result {Object} An object containing the width and height of the text.
   */

  Component_TextRenderer.prototype.measureFormattedText = function(text, wordWrap) {
    var lines, size;
    this.font.set(this.object.font);
    size = null;
    lines = this.calculateLines(text, wordWrap);
    size = this.measureFormattedLines(lines, wordWrap);
    return size;
  };


  /**
  * Measures the dimensions of a plain text in pixels. Formatting and
  * word-wrapping are not supported.
  *
  * @method measureText
  * @param {string} text - The text to measure.
  * @result {Object} An object containing the width and height of the text.
   */

  Component_TextRenderer.prototype.measureText = function(text) {
    var k, len, line, lineSize, lines, size;
    size = {
      width: 0,
      height: 0
    };
    lines = text.toString().split("\n");
    for (k = 0, len = lines.length; k < len; k++) {
      line = lines[k];
      lineSize = this.object.font.measureText(text);
      size.width = Math.max(size.width, lineSize.width);
      size.height += this.object.font.lineHeight + this.lineSpacing;
    }
    size.height -= this.lineSpacing;
    return size;
  };


  /**
  * Searches for a token in a list of tokens and returns the first match.
  *
  * @method findToken
  * @param {number} startIndex - The index in the list of tokens where the search will start.
  * @param {string} code - The code of the token to search for.
  * @param {number} direction - The search direction, can be forward(1) or backward(-1).
  * @param {Object[]} tokens - The list of tokens to search.
  * @result {Object} The first token which matches the specified code or <b>null</b> if the token cannot be found.
   */

  Component_TextRenderer.prototype.findToken = function(startIndex, code, direction, tokens) {
    var i, t, token;
    token = null;
    i = startIndex;
    if (direction === -1) {
      while (i >= 0) {
        t = tokens[i];
        if (t.code === code) {
          token = t;
          break;
        }
        i--;
      }
    }
    return token;
  };


  /**
  * Searches for a specific kind of tokens between a start and an end token.
  *
  * @method findTokensBetween
  * @param {number} startIndex - The index where the search will start.
  * @param {number} endIndex - The index where the search will end.
  * @param {string} code - The code of the token-type to search for.
  * @param {Object[]} tokens - The list of tokens to search.
  * @result {Object[]} List of tokens matching the specified code. Its an empty list if no tokens were found.
   */

  Component_TextRenderer.prototype.findTokensBetween = function(startIndex, endIndex, code, tokens) {
    var e, result, s, token;
    result = [];
    s = startIndex;
    e = endIndex;
    while (s < e) {
      token = tokens[s];
      if (token.code == code) {
        result.push(token);
      }
      s++;
    }
    return result;
  };


  /**
  * Processes a control-token. A control-token is a token which influences
  * the text-rendering like changing the fonts color, size or style.
  *
  * Changes will be automatically applied to the game object's font.
  *
  * @method processControlToken
  * @param {Object} token - A control-token.
  * @return {Object} An object which can contain additional info needed for processing.
   */

  Component_TextRenderer.prototype.processControlToken = function(token) {
    var result;
    result = null;
    switch (token.code) {
      case "SZ":
        this.object.font.size = token.value || this.fontSize;
        break;
      case "C":
        if (token.value <= 0) {
          this.object.font.color = Font.defaultColor;
        } else {
          this.object.font.color = RecordManager.system.colors[token.value - 1] || Font.defaultColor;
        }
        break;
      case "Y":
        switch (token.value) {
          case "U":
            this.object.font.underline = true;
            break;
          case "S":
            this.object.font.strikeThrough = true;
            break;
          case "I":
            this.object.font.italic = true;
            break;
          case "B":
            this.object.font.bold = true;
            break;
          case "C":
            this.object.font.smallCaps = true;
            break;
          case "NU":
            this.object.font.underline = false;
            break;
          case "NS":
            this.object.font.strikeThrough = false;
            break;
          case "NI":
            this.object.font.underline = false;
            break;
          case "NB":
            this.object.font.bold = false;
            break;
          case "NC":
            this.object.font.smallCaps = false;
            break;
          case "N":
            this.object.font.underline = false;
            this.object.font.strikeThrough = false;
            this.object.font.italic = false;
            this.object.font.bold = false;
            this.object.font.smallCaps = false;
        }
    }
    return result;
  };


  /**
  * Draws a plain text. Formatting and word-wrapping are not supported.
  *
  * @method drawText
  * @param {number} x - The x-coordinate of the text's position.
  * @param {number} y - The y-coordinate of the text's position.
  * @param {number} width - Deprecated. Can be null.
  * @param {number} height - Deprecated. Can be null.
  * @param {string} text - The text to draw.
   */

  Component_TextRenderer.prototype.drawText = function(pl, pt, pr, pb, text) {
    var font, height, i, k, len, line, lines, size;
    lines = text.toString().split("\n");
    font = this.object.font;
    height = font.lineHeight;
    for (i = k = 0, len = lines.length; k < len; i = ++k) {
      line = lines[i];
      size = font.measureText(line);
      this.object.bitmap.drawText(pl, i * height + pt, size.width + pr + pl, height + pt + pb, line, 0, 0);
    }
    return null;
  };


  /**
  * Draws an array of formatted text lines. 
  * If the wordWrap param is set, line-breaks are automatically created if a line
  * doesn't fit into the width of the game object's bitmap.
  *
  * @method drawFormattedLines
  * @param {number} pl - The left-padding of the text's position.
  * @param {number} pt - The top-padding of the text's position.
  * @param {number} pr - The right-padding of the text's position.
  * @param {number} pb - The bottom-padding of the text's position.
  * @param {gs.RendererTextLine[]} lines - An array of lines to draw.
  * @param {boolean} wordWrap - If wordWrap is set to true, line-breaks are automatically created.
   */

  Component_TextRenderer.prototype.drawFormattedLines = function(pl, pt, pr, pb, lines, wordWrap) {
    var font, height, k, l, len, len1, line, ref, size, token;
    this.currentX = pl;
    this.currentY = pt;
    this.currentLineHeight = 0;
    for (k = 0, len = lines.length; k < len; k++) {
      line = lines[k];
      ref = line.content;
      for (l = 0, len1 = ref.length; l < len1; l++) {
        token = ref[l];
        if (token.code != null) {
          this.processControlToken(token);
          size = this.measureControlToken(token);
          if (size) {
            this.drawControlToken(token, this.object.bitmap, this.currentX);
            this.currentX += size.width;
          }
        } else if (token.value.length > 0) {
          font = this.object.font;
          height = line.height;
          if (token.value !== "\n") {
            size = font.measureTextPlain(token.value);
            this.object.bitmap.drawText(this.currentX, this.currentY + height - size.height + font.descent - line.descent, size.width + pl + pr, height + pt + pb, token.value, 0, 0);
            this.currentX += size.width;
          }
          this.currentLineHeight = Math.max(this.currentLineHeight, height);
        }
      }
      this.currentY += (this.currentLineHeight || this.object.font.lineHeight) + this.lineSpacing;
      this.currentX = pl;
      this.currentLineHeight = 0;
    }
    return null;
  };


  /**
  * Draws a formatted text. 
  * If the wordWrap param is set, line-breaks are automatically created if a line
  * doesn't fit into the width of the game object's bitmap.
  *
  * @method drawFormattedText
  * @param {number} x - The x-coordinate of the text's position.
  * @param {number} y - The y-coordinate of the text's position.
  * @param {number} width - Deprecated. Can be null.
  * @param {number} height - Deprecated. Can be null.
  * @param {string} text - The text to draw.
  * @param {boolean} wordWrap - If wordWrap is set to true, line-breaks are automatically created.
  * @return {gs.RendererTextLine[]} The drawn text lines.
   */

  Component_TextRenderer.prototype.drawFormattedText = function(pl, pt, pr, pb, text, wordWrap) {
    var lines;
    lines = this.calculateLines(text.toString(), wordWrap);
    this.drawFormattedLines(pl, pt, pr, pb, lines, wordWrap);
    return lines;
  };

  return Component_TextRenderer;

})(gs.Component);

gs.Component_TextRenderer = Component_TextRenderer;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVFBLElBQUEsdURBQUE7RUFBQTs7O0FBQU07O0FBQ0Y7Ozs7Ozs7O0VBUWEsMEJBQUE7O0FBQ1Q7Ozs7OztJQU1BLElBQUMsQ0FBQSxLQUFELEdBQVM7O0FBQ1Q7Ozs7OztJQU1BLElBQUMsQ0FBQSxNQUFELEdBQVU7O0FBQ1Y7Ozs7OztJQU1BLElBQUMsQ0FBQSxPQUFELEdBQVc7O0FBQ1g7Ozs7OztJQU1BLElBQUMsQ0FBQSxPQUFELEdBQVc7RUE1QkY7Ozs7OztBQThCakIsRUFBRSxDQUFDLGdCQUFILEdBQXNCOztBQUVoQjs7QUFDRjs7Ozs7Ozs7RUFRYSx1QkFBQyxJQUFELEVBQU8sS0FBUCxFQUFjLElBQWQ7O0FBQ1Q7Ozs7OztJQU1BLElBQUMsQ0FBQSxLQUFELEdBQVM7O0FBQ1Q7Ozs7OztJQU1BLElBQUMsQ0FBQSxJQUFELEdBQVE7O0FBQ1I7Ozs7O0lBS0EsSUFBQyxDQUFBLE1BQUQsR0FBVTtJQUVWLElBQXFCLFlBQXJCO01BQUEsSUFBQyxDQUFBLFVBQUQsQ0FBWSxJQUFaLEVBQUE7O0VBdEJTOzs7QUF3QmI7Ozs7Ozs7OzBCQU9BLFVBQUEsR0FBWSxTQUFDLElBQUQ7V0FDUixJQUFDLENBQUEsTUFBRCxHQUFVLElBQUksQ0FBQyxZQUFMLENBQUE7RUFERjs7O0FBR1o7Ozs7Ozs7OzBCQU9BLFdBQUEsR0FBYSxTQUFDLElBQUQ7V0FDVCxJQUFJLENBQUMsR0FBTCxDQUFTLElBQUMsQ0FBQSxNQUFWO0VBRFM7Ozs7OztBQUdqQixFQUFFLENBQUMsYUFBSCxHQUFtQjs7QUFFYjs7OztBQUNGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUF1QmEsZ0NBQUE7SUFDVCx5REFBQSxTQUFBOztBQUVBOzs7OztJQUtBLElBQUMsQ0FBQSxRQUFELEdBQVk7O0FBRVo7Ozs7O0lBS0EsSUFBQyxDQUFBLFFBQUQsR0FBWTs7QUFFWjs7Ozs7SUFLQSxJQUFDLENBQUEsaUJBQUQsR0FBcUI7O0FBRXJCOzs7OztJQUtBLElBQUMsQ0FBQSxJQUFELEdBQVksSUFBQSxJQUFBLENBQUssaUJBQUwsRUFBd0IsRUFBeEI7O0FBRVo7Ozs7O0lBS0EsSUFBQyxDQUFBLFNBQUQsR0FBYTs7QUFFYjs7Ozs7SUFLQSxJQUFDLENBQUEsUUFBRCxHQUFZOztBQUVaOzs7OztJQUtBLElBQUMsQ0FBQSxPQUFELEdBQVc7O0FBRVg7Ozs7O0lBS0EsSUFBQyxDQUFBLFdBQUQsR0FBZTtFQXpETjs7O0FBMkRiOzs7Ozs7Ozs7O21DQVNBLGVBQUEsR0FBaUIsU0FBQyxJQUFELEVBQU8sTUFBUDtBQUNiLFFBQUE7SUFBQSxLQUFBLEdBQVE7SUFDUixJQUFHLGlCQUFIO01BQ0ksTUFBQSxHQUFTLE1BQU8sQ0FBQSxDQUFBLENBQUUsQ0FBQyxLQUFWLENBQWdCLEdBQWhCO01BQ1QsS0FBQSxHQUFRLE1BQU8sQ0FBQSxDQUFBO01BQ2YsSUFBRyxNQUFPLENBQUEsQ0FBQSxDQUFQLEtBQWEsR0FBaEI7UUFDSSxLQUFBLEdBQVEsV0FBVyxDQUFDLGFBQWEsQ0FBQyxPQUFRLENBQUEsUUFBQSxDQUFTLE1BQU8sQ0FBQSxDQUFBLENBQWhCLENBQUEsR0FBb0IsQ0FBcEIsRUFEOUM7T0FBQSxNQUVLLElBQUcsTUFBTyxDQUFBLENBQUEsQ0FBUCxLQUFhLEdBQWhCO1FBQ0QsS0FBQSxHQUFRLFdBQVcsQ0FBQyxhQUFhLENBQUMsaUJBQWtCLENBQUEsUUFBQSxDQUFTLE1BQU8sQ0FBQSxDQUFBLENBQWhCLENBQUEsR0FBb0IsQ0FBcEIsRUFEbkQ7T0FBQSxNQUVBLElBQUcsTUFBTyxDQUFBLENBQUEsQ0FBUCxLQUFhLEdBQWhCO1FBQ0QsS0FBQSxHQUFRLFdBQVcsQ0FBQyxhQUFhLENBQUMsYUFBMUIsQ0FBd0M7VUFBRSxLQUFBLEVBQU8sQ0FBVDtVQUFZLEtBQUEsRUFBTyxRQUFBLENBQVMsTUFBTyxDQUFBLENBQUEsQ0FBaEIsQ0FBQSxHQUFvQixDQUF2QztTQUF4QyxFQURQO09BUFQ7O0FBVUEsV0FBTyxFQUFBLEdBQUssSUFBSyxDQUFBLEtBQUE7RUFaSjs7bUNBZWpCLHVCQUFBLEdBQXlCLFNBQUMsVUFBRDtBQUNyQixRQUFBO0lBQUEsTUFBQSxHQUFTLENBQUMsQ0FBRCxFQUFJLFVBQUo7SUFFVCxJQUFHLEtBQUEsQ0FBTSxVQUFOLENBQUg7TUFDSSxLQUFBLEdBQVEsVUFBVSxDQUFDLFdBQVgsQ0FBdUIsR0FBdkI7TUFDUixJQUFHLEtBQUEsS0FBUyxDQUFDLENBQWI7UUFDSSxNQUFPLENBQUEsQ0FBQSxDQUFQLEdBQVksVUFBVSxDQUFDLFNBQVgsQ0FBcUIsQ0FBckIsRUFBd0IsS0FBeEI7UUFDWixNQUFPLENBQUEsQ0FBQSxDQUFQLEdBQVksUUFBQSxDQUFTLFVBQVUsQ0FBQyxTQUFYLENBQXFCLEtBQUEsR0FBTSxDQUEzQixDQUFULEVBRmhCO09BRko7O0FBTUEsV0FBTztFQVRjOzs7QUFVekI7Ozs7Ozs7OzttQ0FRQSxXQUFBLEdBQWEsU0FBQyxJQUFELEVBQU8sS0FBUDtBQUNULFFBQUE7SUFBQSxXQUFBLEdBQWM7SUFDZCxLQUFBLEdBQVcsS0FBQSxDQUFNLEtBQU4sQ0FBSCxHQUFxQixLQUFyQixHQUFnQyxRQUFBLENBQVMsS0FBVDtBQUN4QyxZQUFPLElBQVA7QUFBQSxXQUNTLElBRFQ7UUFFUSxXQUFBLEdBQWtCLElBQUEsRUFBRSxDQUFDLGFBQUgsQ0FBaUIsSUFBakIsRUFBdUIsS0FBdkI7UUFDbEIsSUFBQyxDQUFBLElBQUksQ0FBQyxJQUFOLEdBQWEsV0FBVyxDQUFDLEtBQVosSUFBcUIsSUFBQyxDQUFBO1FBQ25DLElBQUMsQ0FBQSxTQUFELEdBQWEsSUFBQyxDQUFBLElBQUksQ0FBQyxnQkFBTixDQUF1QixHQUF2QjtBQUhaO0FBRFQsV0FLUyxHQUxUO1FBTVEsV0FBQSxHQUFjO1VBQUUsSUFBQSxFQUFNLElBQVI7VUFBYyxLQUFBLEVBQU8sS0FBckI7O0FBQ2QsZ0JBQU8sS0FBUDtBQUFBLGVBQ1MsR0FEVDtZQUNrQixJQUFDLENBQUEsSUFBSSxDQUFDLFNBQU4sR0FBa0I7QUFBM0I7QUFEVCxlQUVTLEdBRlQ7WUFFa0IsSUFBQyxDQUFBLElBQUksQ0FBQyxhQUFOLEdBQXNCO0FBQS9CO0FBRlQsZUFHUyxHQUhUO1lBR2tCLElBQUMsQ0FBQSxJQUFJLENBQUMsTUFBTixHQUFlO0FBQXhCO0FBSFQsZUFJUyxHQUpUO1lBSWtCLElBQUMsQ0FBQSxJQUFJLENBQUMsSUFBTixHQUFhO0FBQXRCO0FBSlQsZUFLUyxHQUxUO1lBS2tCLElBQUMsQ0FBQSxJQUFJLENBQUMsU0FBTixHQUFrQjtBQUEzQjtBQUxULGVBTVMsSUFOVDtZQU1tQixJQUFDLENBQUEsSUFBSSxDQUFDLFNBQU4sR0FBa0I7QUFBNUI7QUFOVCxlQU9TLElBUFQ7WUFPbUIsSUFBQyxDQUFBLElBQUksQ0FBQyxhQUFOLEdBQXNCO0FBQWhDO0FBUFQsZUFRUyxJQVJUO1lBUW1CLElBQUMsQ0FBQSxJQUFJLENBQUMsTUFBTixHQUFlO0FBQXpCO0FBUlQsZUFTUyxJQVRUO1lBU21CLElBQUMsQ0FBQSxJQUFJLENBQUMsSUFBTixHQUFhO0FBQXZCO0FBVFQsZUFVUyxJQVZUO1lBVW1CLElBQUMsQ0FBQSxJQUFJLENBQUMsU0FBTixHQUFrQjtBQUE1QjtBQVZULGVBV1MsR0FYVDtZQVlRLElBQUMsQ0FBQSxJQUFJLENBQUMsU0FBTixHQUFrQjtZQUNsQixJQUFDLENBQUEsSUFBSSxDQUFDLGFBQU4sR0FBc0I7WUFDdEIsSUFBQyxDQUFBLElBQUksQ0FBQyxNQUFOLEdBQWU7WUFDZixJQUFDLENBQUEsSUFBSSxDQUFDLElBQU4sR0FBYTtZQUNiLElBQUMsQ0FBQSxJQUFJLENBQUMsU0FBTixHQUFrQjtBQWhCMUI7UUFpQkEsSUFBQyxDQUFBLFNBQUQsR0FBYSxJQUFDLENBQUEsSUFBSSxDQUFDLGdCQUFOLENBQXVCLEdBQXZCO0FBbkJaO0FBTFQsV0F5QlMsR0F6QlQ7UUEwQlEsV0FBQSxHQUFrQixJQUFBLEVBQUUsQ0FBQyxhQUFILENBQWlCLElBQWpCLEVBQXVCLEtBQXZCO1FBQ2xCLElBQUcsS0FBQSxJQUFTLENBQVo7VUFDSSxJQUFDLENBQUEsSUFBSSxDQUFDLEtBQU4sR0FBYyxJQUFJLENBQUMsYUFEdkI7U0FBQSxNQUFBO1VBR0ksSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFOLEdBQWMsRUFBRSxDQUFDLEtBQUssQ0FBQyxVQUFULENBQW9CLGFBQWEsQ0FBQyxNQUFNLENBQUMsTUFBTyxDQUFBLEtBQUEsR0FBTSxDQUFOLENBQTVCLElBQXdDLElBQUksQ0FBQyxZQUFqRSxFQUhsQjs7QUFGQztBQXpCVCxXQStCUyxJQS9CVDtRQWdDUSxNQUFBLEdBQVksS0FBQSxDQUFNLEtBQU4sQ0FBSCxHQUFxQixLQUFLLENBQUMsS0FBTixDQUFZLEdBQVosQ0FBckIsR0FBMkMsQ0FBQyxLQUFEO1FBQ3BELElBQUcsTUFBTyxDQUFBLENBQUEsQ0FBVjtVQUNJLE1BQUEsR0FBUyxNQUFPLENBQUEsQ0FBQTtVQUNoQixNQUFBLEdBQVMsSUFBQyxDQUFBLHVCQUFELENBQXlCLE1BQU8sQ0FBQSxDQUFBLENBQWhDO1VBQ1QsV0FBQSxHQUFjLE9BQUEsQ0FBUSxHQUFBLEdBQUksTUFBSixHQUFXLEdBQW5CLEVBQXlCLFdBQVcsQ0FBQyxhQUFhLENBQUMsZUFBZ0IsQ0FBQSxNQUFPLENBQUEsQ0FBQSxDQUFQLElBQVcsQ0FBWCxDQUFjLENBQUEsTUFBTyxDQUFBLENBQUEsQ0FBUCxHQUFVLENBQVYsQ0FBeEQsSUFBd0UsQ0FBakcsRUFIbEI7U0FBQSxNQUFBO1VBS0ksTUFBQSxHQUFTLElBQUMsQ0FBQSx1QkFBRCxDQUF5QixNQUFPLENBQUEsQ0FBQSxDQUFoQztVQUNULFdBQUEsR0FBYyxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsZUFBZ0IsQ0FBQSxNQUFPLENBQUEsQ0FBQSxDQUFQLElBQVcsQ0FBWCxDQUFjLENBQUEsTUFBTyxDQUFBLENBQUEsQ0FBUCxHQUFVLENBQVYsQ0FBeEQsSUFBd0UsQ0FBekUsQ0FBMkUsQ0FBQyxRQUE1RSxDQUFBLEVBTmxCOztBQUZDO0FBL0JULFdBd0NTLElBeENUO1FBeUNRLE1BQUEsR0FBUyxJQUFDLENBQUEsdUJBQUQsQ0FBeUIsS0FBekI7UUFDVCxXQUFBLEdBQWUsV0FBVyxDQUFDLGFBQWEsQ0FBQyxlQUFnQixDQUFBLE1BQU8sQ0FBQSxDQUFBLENBQVAsSUFBVyxDQUFYLENBQWMsQ0FBQSxNQUFPLENBQUEsQ0FBQSxDQUFQLEdBQVUsQ0FBVixDQUF4RCxJQUF3RTtRQUN2RixXQUFBLEdBQWMsV0FBVyxDQUFDLEtBQVosQ0FBa0IsZ0NBQWxCO1FBQ2QsSUFBRyxXQUFXLENBQUMsTUFBWixHQUFxQixDQUF4QjtVQUNJLFdBQVcsQ0FBQyxHQUFaLENBQUEsRUFESjtTQUFBLE1BQUE7VUFHSSxXQUFBLDBDQUErQixHQUhuQzs7QUFKQztBQXhDVCxXQWdEUyxJQWhEVDtRQWlEUSxNQUFBLEdBQVMsSUFBQyxDQUFBLHVCQUFELENBQXlCLEtBQXpCO1FBQ1QsV0FBQSxHQUFjLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxnQkFBaUIsQ0FBQSxNQUFPLENBQUEsQ0FBQSxDQUFQLElBQVcsQ0FBWCxDQUFjLENBQUEsTUFBTyxDQUFBLENBQUEsQ0FBUCxHQUFVLENBQVYsQ0FBekQsSUFBeUUsS0FBMUUsQ0FBZ0YsQ0FBQyxRQUFqRixDQUFBO0FBRmI7QUFoRFQsV0FtRFMsSUFuRFQ7UUFvRFEsTUFBQSxHQUFTLEtBQUssQ0FBQyxLQUFOLENBQVksR0FBWjtRQUNULGNBQUEsR0FBaUIsSUFBQyxDQUFBLHVCQUFELENBQXlCLE1BQU8sQ0FBQSxDQUFBLENBQWhDO1FBQ2pCLFdBQUEsR0FBYyxJQUFDLENBQUEsZUFBRCxDQUFpQixXQUFXLENBQUMsYUFBYSxDQUFDLGFBQWMsQ0FBQSxjQUFlLENBQUEsQ0FBQSxDQUFmLENBQW1CLENBQUEsY0FBZSxDQUFBLENBQUEsQ0FBZixHQUFrQixDQUFsQixDQUEzRCxJQUFtRixFQUFwRyxFQUF3RyxNQUF4RztBQUhiO0FBbkRULFdBdURTLElBdkRUO1FBd0RRLE1BQUEsR0FBWSxLQUFBLENBQU0sS0FBTixDQUFILEdBQXFCLEtBQUssQ0FBQyxLQUFOLENBQVksR0FBWixDQUFyQixHQUEyQyxDQUFDLEtBQUQ7UUFDcEQsSUFBRyxNQUFPLENBQUEsQ0FBQSxDQUFWO1VBQ0ksTUFBQSxHQUFTLE1BQU8sQ0FBQSxDQUFBO1VBQ2hCLE1BQUEsR0FBUyxJQUFDLENBQUEsdUJBQUQsQ0FBeUIsTUFBTyxDQUFBLENBQUEsQ0FBaEM7VUFDVCxXQUFBLEdBQWMsT0FBQSxDQUFRLEdBQUEsR0FBSSxNQUFKLEdBQVcsR0FBbkIsRUFBeUIsV0FBVyxDQUFDLGFBQWEsQ0FBQyxpQkFBa0IsQ0FBQSxNQUFPLENBQUEsQ0FBQSxDQUFQLENBQVcsQ0FBQSxNQUFPLENBQUEsQ0FBQSxDQUFQLEdBQVUsQ0FBVixDQUF2RCxJQUF1RSxDQUFoRyxFQUhsQjtTQUFBLE1BQUE7VUFLSSxXQUFBLEdBQWMsQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLGlCQUFrQixDQUFBLENBQUEsQ0FBRyxDQUFBLE1BQU8sQ0FBQSxDQUFBLENBQVAsR0FBVSxDQUFWLENBQS9DLElBQStELENBQWhFLENBQWtFLENBQUMsUUFBbkUsQ0FBQSxFQUxsQjs7QUFGQztBQXZEVCxXQStEUyxJQS9EVDtRQWdFUSxNQUFBLEdBQVMsSUFBQyxDQUFBLHVCQUFELENBQXlCLEtBQXpCO1FBQ1QsV0FBQSxHQUFlLFdBQVcsQ0FBQyxhQUFhLENBQUMsaUJBQWtCLENBQUEsTUFBTyxDQUFBLENBQUEsQ0FBUCxDQUFXLENBQUEsTUFBTyxDQUFBLENBQUEsQ0FBUCxHQUFVLENBQVYsQ0FBdkQsSUFBdUU7UUFDdEYsV0FBQSxHQUFjLFdBQVcsQ0FBQyxLQUFaLENBQWtCLGdDQUFsQjtRQUNkLElBQUcsV0FBVyxDQUFDLE1BQVosR0FBcUIsQ0FBeEI7VUFDSSxXQUFXLENBQUMsR0FBWixDQUFBLEVBREo7U0FBQSxNQUFBO1VBR0ksV0FBQSw0Q0FBK0IsR0FIbkM7O0FBSkM7QUEvRFQsV0F1RVMsSUF2RVQ7UUF3RVEsTUFBQSxHQUFTLElBQUMsQ0FBQSx1QkFBRCxDQUF5QixLQUF6QjtRQUNULFdBQUEsR0FBYyxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsa0JBQW1CLENBQUEsTUFBTyxDQUFBLENBQUEsQ0FBUCxDQUFXLENBQUEsTUFBTyxDQUFBLENBQUEsQ0FBUCxHQUFVLENBQVYsQ0FBeEQsSUFBd0UsS0FBekUsQ0FBK0UsQ0FBQyxRQUFoRixDQUFBO0FBRmI7QUF2RVQsV0EwRVMsSUExRVQ7UUEyRVEsTUFBQSxHQUFTLEtBQUssQ0FBQyxLQUFOLENBQVksR0FBWjtRQUNULGNBQUEsR0FBaUIsSUFBQyxDQUFBLHVCQUFELENBQXlCLE1BQU8sQ0FBQSxDQUFBLENBQWhDO1FBQ2pCLFdBQUEsR0FBYyxJQUFDLENBQUEsZUFBRCxDQUFpQixXQUFXLENBQUMsYUFBYSxDQUFDLGVBQWdCLENBQUEsY0FBZSxDQUFBLENBQUEsQ0FBZixDQUFtQixDQUFBLGNBQWUsQ0FBQSxDQUFBLENBQWYsR0FBa0IsQ0FBbEIsQ0FBN0QsSUFBcUYsRUFBdEcsRUFBMEcsTUFBMUc7QUFIYjtBQTFFVCxXQThFUyxJQTlFVDtRQStFUSxNQUFBLEdBQVksS0FBQSxDQUFNLEtBQU4sQ0FBSCxHQUFxQixLQUFLLENBQUMsS0FBTixDQUFZLEdBQVosQ0FBckIsR0FBMkMsQ0FBQyxLQUFEO1FBQ3BELElBQUcsTUFBTyxDQUFBLENBQUEsQ0FBVjtVQUNJLFdBQUEsR0FBYyxPQUFBLENBQVEsR0FBQSxHQUFJLE1BQU8sQ0FBQSxDQUFBLENBQVgsR0FBYyxHQUF0QixFQUE0QixXQUFXLENBQUMsYUFBYSxDQUFDLGFBQTFCLENBQXdDO1lBQUUsS0FBQSxFQUFPLENBQVQ7WUFBWSxLQUFBLEVBQU8sS0FBQSxHQUFNLENBQXpCO1dBQXhDLENBQUEsSUFBd0UsQ0FBcEcsRUFEbEI7U0FBQSxNQUFBO1VBR0ksV0FBQSxHQUFjLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxhQUExQixDQUF3QztZQUFFLEtBQUEsRUFBTyxDQUFUO1lBQVksS0FBQSxFQUFPLEtBQUEsR0FBTSxDQUF6QjtXQUF4QyxDQUFBLElBQXdFLENBQXpFLENBQTJFLENBQUMsUUFBNUUsQ0FBQSxFQUhsQjs7QUFGQztBQTlFVCxXQW9GUyxJQXBGVDtRQXFGUSxXQUFBLEdBQWMsQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLGFBQTFCLENBQXdDO1VBQUUsS0FBQSxFQUFPLENBQVQ7VUFBWSxLQUFBLEVBQU8sS0FBQSxHQUFNLENBQXpCO1NBQXhDLENBQUEsSUFBd0UsRUFBekUsQ0FBNEUsQ0FBQyxRQUE3RSxDQUFBO1FBQ2QsV0FBQSxHQUFjLFdBQVcsQ0FBQyxLQUFaLENBQWtCLGdDQUFsQjtRQUNkLElBQUcsV0FBVyxDQUFDLE1BQVosR0FBcUIsQ0FBeEI7VUFDSSxXQUFXLENBQUMsR0FBWixDQUFBLEVBREo7U0FBQSxNQUFBO1VBR0ksV0FBQSw0Q0FBK0IsR0FIbkM7O0FBSEM7QUFwRlQsV0EyRlMsSUEzRlQ7UUE0RlEsV0FBQSxHQUFjLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxjQUExQixDQUF5QztVQUFFLEtBQUEsRUFBTyxDQUFUO1VBQVksS0FBQSxFQUFPLEtBQUEsR0FBTSxDQUF6QjtTQUF6QyxDQUFBLElBQXlFLEtBQTFFLENBQWdGLENBQUMsUUFBakYsQ0FBQTtBQURiO0FBM0ZULFdBNkZTLElBN0ZUO1FBOEZRLE1BQUEsR0FBUyxLQUFLLENBQUMsS0FBTixDQUFZLEdBQVo7UUFDVCxXQUFBLEdBQWMsSUFBQyxDQUFBLGVBQUQsQ0FBaUIsV0FBVyxDQUFDLGFBQWEsQ0FBQyxXQUExQixDQUFzQztVQUFFLEtBQUEsRUFBTyxDQUFUO1VBQVksS0FBQSxFQUFPLE1BQU8sQ0FBQSxDQUFBLENBQVAsR0FBVSxDQUE3QjtTQUF0QyxDQUFBLElBQTBFLEVBQTNGLEVBQStGLE1BQS9GO0FBRmI7QUE3RlQsV0FnR1MsR0FoR1Q7UUFpR1EsV0FBQSxHQUFjLENBQUksdUNBQUgsR0FBeUMsR0FBQSxDQUFJLGFBQWEsQ0FBQyxVQUFXLENBQUEsS0FBQSxDQUFNLENBQUMsSUFBcEMsQ0FBekMsR0FBd0YsRUFBekY7QUFEYjtBQWhHVCxXQWtHUyxJQWxHVDtRQW1HUSxJQUFBLEdBQU8sS0FBSyxDQUFDLEtBQU4sQ0FBWSxHQUFaO1FBQ1AsV0FBQSxHQUFjO1VBQUUsSUFBQSxFQUFNLElBQVI7VUFBYyxTQUFBLG9DQUFxQixDQUFuQztVQUFzQyxFQUFBLEVBQUksSUFBSyxDQUFBLENBQUEsQ0FBL0M7VUFBbUQsRUFBQSxFQUFJLElBQUssQ0FBQSxDQUFBLENBQTVEO1VBQWdFLE1BQUEsRUFBUTtZQUFFLEtBQUEsRUFBTyxDQUFUO1lBQVksTUFBQSxFQUFRLENBQXBCO1dBQXhFO1VBQWlHLE1BQUEsRUFBUTtZQUFFLEtBQUEsRUFBTyxDQUFUO1lBQVksTUFBQSxFQUFRLENBQXBCO1dBQXpHOztBQUZiO0FBbEdULFdBcUdTLEdBckdUO1FBc0dRLEtBQUEsR0FBUSxhQUFhLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxLQUFoQyxDQUFzQyxTQUFDLENBQUQ7aUJBQU8sQ0FBQyxDQUFDLElBQUYsS0FBVTtRQUFqQixDQUF0QztRQUNSLElBQUcsS0FBSDtVQUNJLElBQUcsS0FBSyxDQUFDLElBQU4sS0FBYyxDQUFqQjtZQUNJLFdBQUEsR0FBYyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQWQsQ0FBb0IsZ0NBQXBCO1lBQ2QsV0FBVyxDQUFDLEdBQVosQ0FBQSxFQUZKO1dBQUEsTUFHSyxJQUFHLEtBQUssQ0FBQyxJQUFOLEtBQWMsQ0FBakI7WUFDRCxJQUFHLENBQUMsS0FBSyxDQUFDLFdBQVY7Y0FDSSxLQUFLLENBQUMsV0FBTixHQUFvQixJQUFBLENBQUssNEJBQUEsR0FBNkIsS0FBSyxDQUFDLE9BQW5DLEdBQTJDLEtBQWhELEVBRHhCOztZQUVBLFdBQUEsR0FBYyxLQUFLLENBQUMsV0FBTixDQUFrQixJQUFDLENBQUEsTUFBbkIsRUFBMkIsS0FBM0I7WUFDZCxXQUFBLEdBQWMsV0FBVyxDQUFDLEtBQVosQ0FBa0IsZ0NBQWxCO1lBQ2QsSUFBRyxXQUFXLENBQUMsTUFBWixHQUFxQixDQUF4QjtjQUNJLFdBQVcsQ0FBQyxHQUFaLENBQUEsRUFESjthQUxDO1dBQUEsTUFBQTtZQVFELElBQUcsQ0FBQyxLQUFLLENBQUMsV0FBVjtjQUNJLEtBQUssQ0FBQyxXQUFOLEdBQW9CLElBQUEsQ0FBSyxxQkFBQSxHQUFzQixLQUFLLENBQUMsT0FBNUIsR0FBb0MsS0FBekMsRUFEeEI7O1lBRUEsV0FBQSxHQUFrQixJQUFBLEVBQUUsQ0FBQyxhQUFILENBQWlCLEdBQWpCLEVBQXNCLEtBQUssQ0FBQyxXQUE1QixFQVZqQjtXQUpUO1NBQUEsTUFBQTtVQWdCSSxXQUFBLEdBQWMsR0FoQmxCOztBQUZDO0FBckdUO1FBeUhRLFdBQUEsR0FBa0IsSUFBQSxFQUFFLENBQUMsYUFBSCxDQUFpQixJQUFqQixFQUF1QixLQUF2QjtBQXpIMUI7QUEySEEsV0FBTztFQTlIRTs7O0FBaUliOzs7Ozs7OzttQ0FPQSxlQUFBLEdBQWlCLFNBQUMsS0FBRDtBQUNiLFFBQUE7SUFBQSxLQUFBLEdBQVE7SUFDUixJQUFBLEdBQU87SUFFUCxJQUFHLEtBQUssQ0FBQyxTQUFUO01BQ0ksS0FBQSxHQUFRLEVBQUUsQ0FBQyxTQUFTLENBQUMsTUFBTyxDQUFBLFdBQUEsR0FBWSxLQUFLLENBQUMsU0FBbEIsRUFEaEM7O0lBR0EsSUFBRyxDQUFDLEtBQUo7TUFDSSxLQUFBLEdBQVEsRUFBRSxDQUFDLFNBQVMsQ0FBQyxNQUFPLENBQUEsVUFBQSxFQURoQzs7SUFHQSxJQUFBLCtEQUFxQixJQUFDLENBQUE7SUFDdEIsSUFBSSxDQUFDLElBQUwsR0FBWSxJQUFJLENBQUMsSUFBTCxJQUFhLElBQUMsQ0FBQSxJQUFJLENBQUMsSUFBTixHQUFhO0FBRXRDLFdBQU87RUFiTTs7O0FBZWpCOzs7Ozs7Ozs7O21DQVNBLG1CQUFBLEdBQXFCLFNBQUMsS0FBRDtBQUNqQixRQUFBO0lBQUEsSUFBQSxHQUFPO0FBRVAsWUFBTyxLQUFLLENBQUMsSUFBYjtBQUFBLFdBQ1MsR0FEVDtRQUVRLFNBQUEsR0FBWSxhQUFhLENBQUMsVUFBVyxDQUFBLElBQUksQ0FBQyxHQUFMLENBQVMsS0FBSyxDQUFDLEtBQU4sR0FBWSxDQUFyQixFQUF3QixDQUF4QixDQUFBO1FBQ3JDLElBQUcsNkRBQUg7VUFDSSxXQUFBLEdBQWMsZUFBZSxDQUFDLFNBQWhCLENBQTBCLG9CQUFBLEdBQXFCLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBakU7VUFDZCxJQUFHLG1CQUFIO1lBQ0ksSUFBQSxHQUFPO2NBQUEsS0FBQSxFQUFPLElBQUksQ0FBQyxLQUFMLENBQVcsV0FBVyxDQUFDLEtBQVosR0FBb0IsU0FBUyxDQUFDLE9BQXpDLENBQVA7Y0FBMEQsTUFBQSxFQUFRLElBQUksQ0FBQyxLQUFMLENBQVcsV0FBVyxDQUFDLE1BQVosR0FBcUIsU0FBUyxDQUFDLE9BQTFDLENBQWxFO2NBRFg7V0FGSjs7QUFGQztBQURULFdBT1MsSUFQVDtRQVFRLElBQUEsR0FBTyxJQUFDLENBQUEsZUFBRCxDQUFpQixLQUFqQjtRQUNQLEVBQUEsR0FBSyxJQUFJLENBQUM7UUFDVixJQUFJLENBQUMsSUFBTCxHQUFZLElBQUksQ0FBQyxJQUFMLElBQWEsSUFBQyxDQUFBLElBQUksQ0FBQyxJQUFOLEdBQWE7UUFDdEMsS0FBSyxDQUFDLE1BQU4sR0FBZSxJQUFDLENBQUEsSUFBSSxDQUFDLGdCQUFOLENBQXVCLEtBQUssQ0FBQyxFQUE3QjtRQUNmLEtBQUssQ0FBQyxNQUFOLEdBQWUsSUFBSSxDQUFDLGdCQUFMLENBQXNCLEtBQUssQ0FBQyxFQUE1QjtRQUNmLElBQUksQ0FBQyxJQUFMLEdBQVk7UUFFWixJQUFBLEdBQU87VUFBQSxLQUFBLEVBQU8sSUFBSSxDQUFDLEdBQUwsQ0FBUyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQXRCLEVBQTZCLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBMUMsQ0FBUDtVQUF5RCxNQUFBLEVBQVEsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFiLEdBQXNCLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBcEc7O0FBZmY7QUFpQkEsV0FBTztFQXBCVTs7O0FBc0JyQjs7Ozs7Ozs7OzttQ0FTQSxnQkFBQSxHQUFrQixTQUFDLEtBQUQsRUFBUSxNQUFSLEVBQWdCLE1BQWhCO0FBQ2QsUUFBQTtBQUFBLFlBQU8sS0FBSyxDQUFDLElBQWI7QUFBQSxXQUNTLEdBRFQ7UUFFUSxTQUFBLEdBQVksYUFBYSxDQUFDLFVBQVcsQ0FBQSxJQUFJLENBQUMsR0FBTCxDQUFTLEtBQUssQ0FBQyxLQUFOLEdBQVksQ0FBckIsRUFBd0IsQ0FBeEIsQ0FBQTtRQUNyQyxJQUFHLDZEQUFIO1VBQ0ksV0FBQSxHQUFjLGVBQWUsQ0FBQyxTQUFoQixDQUEwQixvQkFBQSxHQUFxQixTQUFTLENBQUMsT0FBTyxDQUFDLElBQWpFO1VBQ2QsSUFBRyxtQkFBSDtZQUNJLElBQUEsR0FBVyxJQUFBLEVBQUUsQ0FBQyxJQUFILENBQVEsQ0FBUixFQUFXLENBQVgsRUFBYyxJQUFJLENBQUMsS0FBTCxDQUFXLFdBQVcsQ0FBQyxLQUFaLEdBQW9CLFNBQVMsQ0FBQyxPQUF6QyxDQUFkLEVBQWlFLElBQUksQ0FBQyxLQUFMLENBQVcsV0FBVyxDQUFDLE1BQVosR0FBcUIsU0FBUyxDQUFDLE9BQTFDLENBQWpFO21CQUNYLE1BQU0sQ0FBQyxHQUFQLENBQVcsTUFBWCxFQUFtQixJQUFDLENBQUEsUUFBcEIsRUFBOEIsV0FBOUIsRUFBMkMsSUFBM0MsRUFGSjtXQUZKOztBQUZDO0FBRFQsV0FRUyxJQVJUO1FBU1EsS0FBQSxHQUFRO1FBQ1IsSUFBRyxLQUFLLENBQUMsU0FBVDtVQUNJLEtBQUEsR0FBUSxFQUFFLENBQUMsU0FBUyxDQUFDLE1BQU8sQ0FBQSxXQUFBLEdBQVksS0FBSyxDQUFDLFNBQWxCLEVBRGhDOztRQUVBLElBQUcsQ0FBQyxLQUFKO1VBQ0ksS0FBQSxHQUFRLEVBQUUsQ0FBQyxTQUFTLENBQUMsTUFBTyxDQUFBLFVBQUEsRUFEaEM7O1FBR0EsSUFBQSwrREFBcUIsSUFBQyxDQUFBO1FBQ3RCLEVBQUEsR0FBSyxJQUFJLENBQUM7UUFDVixJQUFJLENBQUMsSUFBTCxHQUFZLElBQUksQ0FBQyxJQUFMLElBQWEsSUFBQyxDQUFBLElBQUksQ0FBQyxJQUFOLEdBQWE7UUFFdEMsSUFBRyxLQUFBLElBQVUsK0NBQXNCLENBQUUsZUFBckM7VUFDSSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQVgsQ0FBZSxJQUFDLENBQUEsSUFBSSxDQUFDLEtBQXJCLEVBREo7O1FBR0EsTUFBTSxDQUFDLElBQVAsR0FBYztRQUNkLE1BQU0sQ0FBQyxRQUFQLENBQWdCLE1BQWhCLEVBQXdCLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBcEMsRUFBNkMsSUFBSSxDQUFDLEdBQUwsQ0FBUyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQXRCLEVBQTZCLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBMUMsQ0FBN0MsRUFBK0YsTUFBTSxDQUFDLE1BQXRHLEVBQThHLEtBQUssQ0FBQyxFQUFwSCxFQUF3SCxDQUF4SCxFQUEySCxDQUEzSDtRQUNBLE1BQU0sQ0FBQyxJQUFQLEdBQWMsSUFBQyxDQUFBO1FBQ2YsSUFBSSxDQUFDLElBQUwsR0FBWTtlQUNaLE1BQU0sQ0FBQyxRQUFQLENBQWdCLE1BQWhCLEVBQXdCLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBckMsRUFBNkMsSUFBSSxDQUFDLEdBQUwsQ0FBUyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQXRCLEVBQTZCLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBMUMsQ0FBN0MsRUFBK0YsTUFBTSxDQUFDLE1BQXRHLEVBQThHLEtBQUssQ0FBQyxFQUFwSCxFQUF3SCxDQUF4SCxFQUEySCxDQUEzSDtBQTFCUjtFQURjOzs7QUE4QmxCOzs7Ozs7Ozs7Ozs7OzttQ0FhQSxnQkFBQSxHQUFrQixTQUFDLEtBQUQsRUFBUSxJQUFSLEVBQWMsS0FBZCxFQUFxQixNQUFyQixFQUE2QixNQUE3QjtBQUNkLFFBQUE7SUFBQSxXQUFBLEdBQWM7SUFDZCxTQUFBLEdBQVk7SUFDWixPQUFBLEdBQVU7SUFDVixPQUFBLEdBQVUsSUFBQyxDQUFBLElBQUksQ0FBQztJQUNoQixJQUFBLEdBQU8sSUFBQyxDQUFBLElBQUksQ0FBQyxnQkFBTixDQUF1QixLQUF2QjtJQUNQLEtBQUEsR0FBUTtJQUNSLFVBQUEsR0FBYTtJQUNiLENBQUEsR0FBSTtJQUNKLENBQUEsR0FBSTtJQUNKLGtCQUFBLEdBQXFCO0lBRXJCLElBQUcsSUFBSSxDQUFDLEtBQUwsR0FBYSxJQUFDLENBQUEsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFoQixHQUFzQixJQUFDLENBQUEsU0FBUyxDQUFDLEtBQVgsR0FBaUIsQ0FBdkMsR0FBeUMsSUFBQyxDQUFBLE9BQUQsR0FBUyxDQUFsRTtBQUNJLGFBQU0sQ0FBQSxHQUFJLEtBQUssQ0FBQyxNQUFoQjtRQUNJLEVBQUEsR0FBSyxLQUFNLENBQUEsQ0FBQTtRQUNYLElBQUEsR0FBTyxJQUFDLENBQUEsSUFBSSxDQUFDLGdCQUFOLENBQXVCLEVBQXZCO1FBQ1AsS0FBQSxJQUFTLElBQUksQ0FBQztRQUNkLEtBQUEsR0FBUTtRQUNSLElBQUcsS0FBQSxHQUFRLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQWhCLEdBQXdCLElBQUMsQ0FBQSxPQUFELEdBQVMsQ0FBNUM7VUFDSSxVQUFBLEdBQWE7VUFDYixDQUFBLEdBQUk7QUFFSixpQkFBQSxJQUFBO1lBQ0ksS0FBQSxHQUFRO0FBRVIsbUJBQU0sQ0FBQSxHQUFJLENBQUosSUFBVSxXQUFXLENBQUMsT0FBWixDQUFvQixLQUFNLENBQUEsQ0FBQSxDQUExQixDQUFBLEtBQWlDLENBQUMsQ0FBbEQ7Y0FDSSxDQUFBO2NBQ0EsS0FBQSxHQUFRO1lBRlo7QUFJQSxtQkFBTSxDQUFBLEdBQUksQ0FBSixJQUFVLFNBQVMsQ0FBQyxPQUFWLENBQWtCLEtBQU0sQ0FBQSxDQUFBLEdBQUUsQ0FBRixDQUF4QixDQUFBLEtBQWlDLENBQUMsQ0FBbEQ7Y0FDSSxDQUFBO2NBQ0EsS0FBQSxHQUFRO1lBRlo7QUFJQSxtQkFBTSxDQUFBLEdBQUksQ0FBSixJQUFVLE9BQU8sQ0FBQyxPQUFSLENBQWdCLEtBQU0sQ0FBQSxDQUFBLEdBQUUsQ0FBRixDQUF0QixDQUFBLEtBQStCLENBQUMsQ0FBaEQ7Y0FDSSxDQUFBO2NBQ0EsS0FBQSxHQUFRO1lBRlo7WUFJQSxJQUFHLENBQUEsS0FBSyxDQUFMLElBQVcsS0FBZDtBQUNJLG9CQURKO2FBQUEsTUFBQTtjQUdJLENBQUEsR0FBSSxFQUhSOztZQUtBLFVBQUE7WUFDQSxJQUFTLFVBQUEsSUFBYyxLQUFkLElBQXVCLENBQUMsS0FBakM7QUFBQSxvQkFBQTs7VUFyQko7VUF1QkEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFiLENBQXNCLElBQUEsRUFBRSxDQUFDLGFBQUgsQ0FBaUIsSUFBakIsRUFBdUIsS0FBSyxDQUFDLFNBQU4sQ0FBZ0Isa0JBQWhCLEVBQW9DLENBQXBDLENBQXZCLEVBQStELElBQUMsQ0FBQSxJQUFoRSxDQUF0QjtVQUNBLGtCQUFBLEdBQXFCO1VBQ3JCLElBQUksQ0FBQyxNQUFMLEdBQWMsSUFBSSxDQUFDLEdBQUwsQ0FBUyxNQUFULEVBQWlCLElBQUMsQ0FBQSxJQUFJLENBQUMsVUFBdkI7VUFDZCxJQUFJLENBQUMsS0FBTCxHQUFhLEtBQUEsR0FBUSxJQUFJLENBQUM7VUFDMUIsSUFBSSxDQUFDLE9BQUwsR0FBZTtVQUNmLE9BQUEsR0FBVSxJQUFDLENBQUEsSUFBSSxDQUFDO1VBQ2hCLE1BQUEsR0FBUyxJQUFJLENBQUM7VUFDZCxNQUFNLENBQUMsSUFBUCxDQUFZLElBQVo7VUFDQSxJQUFBLEdBQVcsSUFBQSxFQUFFLENBQUMsZ0JBQUgsQ0FBQTtVQUNYLEtBQUEsR0FBUSxLQUFBLEdBQVEsQ0FBQyxLQUFBLEdBQVEsSUFBSSxDQUFDLEtBQWQsRUFwQ3BCOztRQXNDQSxDQUFBO01BM0NKLENBREo7S0FBQSxNQUFBO01BOENJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBYixDQUFzQixJQUFBLEVBQUUsQ0FBQyxhQUFILENBQWlCLElBQWpCLEVBQXVCLEtBQXZCLEVBQThCLElBQUMsQ0FBQSxJQUEvQixDQUF0QjtNQUNBLElBQUksQ0FBQyxNQUFMLEdBQWMsSUFBSSxDQUFDLEdBQUwsQ0FBUyxNQUFULEVBQWlCLElBQUMsQ0FBQSxJQUFJLENBQUMsVUFBdkI7TUFDZCxJQUFJLENBQUMsS0FBTCxHQUFhLEtBQUEsR0FBUSxJQUFJLENBQUM7TUFDMUIsSUFBSSxDQUFDLE9BQUwsR0FBZSxRQWpEbkI7O0lBbURBLE1BQUEsR0FBUyxJQUFJLENBQUMsR0FBTCxDQUFTLE1BQVQsRUFBaUIsSUFBQyxDQUFBLElBQUksQ0FBQyxVQUF2QjtJQUVULElBQUcsa0JBQUEsS0FBc0IsQ0FBekI7TUFDSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQWIsQ0FBc0IsSUFBQSxFQUFFLENBQUMsYUFBSCxDQUFpQixJQUFqQixFQUF1QixLQUFLLENBQUMsU0FBTixDQUFnQixrQkFBaEIsRUFBb0MsQ0FBcEMsQ0FBdkIsRUFBK0QsSUFBQyxDQUFBLElBQWhFLENBQXRCO01BQ0EsSUFBSSxDQUFDLEtBQUwsR0FBYTtNQUNiLElBQUksQ0FBQyxNQUFMLEdBQWMsSUFBSSxDQUFDLEdBQUwsQ0FBUyxNQUFULEVBQWlCLElBQUksQ0FBQyxNQUF0QjtNQUNkLElBQUksQ0FBQyxPQUFMLEdBQWUsUUFKbkI7O0FBTUEsV0FBTztFQXZFTzs7O0FBMEVsQjs7Ozs7Ozs7Ozs7Ozs7bUNBYUEsWUFBQSxHQUFjLFNBQUMsS0FBRCxFQUFRLElBQVIsRUFBYyxLQUFkLEVBQXFCLE1BQXJCLEVBQTZCLE1BQTdCO0FBQ1YsUUFBQTtJQUFBLElBQUEsR0FBTyxJQUFDLENBQUEsSUFBSSxDQUFDLGdCQUFOLENBQXVCLEtBQXZCO0lBQ1AsTUFBQSxHQUFTLElBQUksQ0FBQyxHQUFMLENBQVMsSUFBSSxDQUFDLE1BQWQsRUFBc0IsTUFBQSxJQUFVLElBQUMsQ0FBQSxJQUFJLENBQUMsVUFBdEM7SUFFVCxJQUFHLEtBQUssQ0FBQyxNQUFOLEdBQWUsQ0FBbEI7TUFDSSxJQUFJLENBQUMsS0FBTCxJQUFjLElBQUksQ0FBQztNQUNuQixJQUFJLENBQUMsTUFBTCxHQUFjLElBQUksQ0FBQyxHQUFMLENBQVMsTUFBVCxFQUFpQixJQUFJLENBQUMsTUFBdEI7TUFDZCxJQUFJLENBQUMsT0FBTCxHQUFlLElBQUMsQ0FBQSxJQUFJLENBQUM7TUFDckIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFiLENBQXNCLElBQUEsRUFBRSxDQUFDLGFBQUgsQ0FBaUIsSUFBakIsRUFBdUIsS0FBdkIsQ0FBdEIsRUFKSjs7QUFNQSxXQUFPO0VBVkc7OztBQVlkOzs7Ozs7Ozs7Ozs7OzttQ0FhQSxrQkFBQSxHQUFvQixTQUFDLEtBQUQsRUFBUSxJQUFSLEVBQWMsS0FBZCxFQUFxQixNQUFyQixFQUE2QixNQUE3QjtBQUNoQixRQUFBO0lBQUEsWUFBQSxHQUFlO0lBQ2YsS0FBQSxHQUFRLEtBQUssQ0FBQyxLQUFOLENBQVksR0FBWjtJQUNSLE9BQUEsR0FBVSxJQUFDLENBQUEsSUFBSSxDQUFDO0lBQ2hCLElBQUMsQ0FBQSxTQUFELEdBQWEsSUFBQyxDQUFBLElBQUksQ0FBQyxnQkFBTixDQUF1QixHQUF2QjtBQUViLFNBQUEsK0NBQUE7O01BQ0ksSUFBQSxHQUFPLElBQUMsQ0FBQSxJQUFJLENBQUMsZ0JBQU4sQ0FBdUIsSUFBdkI7TUFDUCxLQUFBLElBQVMsSUFBSSxDQUFDLEtBQUwsR0FBYSxJQUFDLENBQUEsU0FBUyxDQUFDO01BRWpDLElBQUcsS0FBQSxHQUFRLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQWhCLEdBQXdCLElBQUMsQ0FBQSxPQUFELEdBQVMsQ0FBNUM7UUFDSSxLQUFBLEdBQVksSUFBQSxFQUFFLENBQUMsYUFBSCxDQUFpQixJQUFqQixFQUF1QixZQUFZLENBQUMsSUFBYixDQUFrQixHQUFsQixDQUF2QjtRQUNaLEtBQUssQ0FBQyxVQUFOLENBQWlCLElBQUMsQ0FBQSxJQUFsQjtRQUNBLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBYixDQUFrQixLQUFsQjtRQUNBLElBQUksQ0FBQyxNQUFMLEdBQWMsSUFBSSxDQUFDLEdBQUwsQ0FBUyxNQUFULEVBQWlCLElBQUksQ0FBQyxNQUF0QjtRQUNkLElBQUksQ0FBQyxLQUFMLEdBQWEsS0FBQSxHQUFRLElBQUksQ0FBQztRQUMxQixJQUFJLENBQUMsT0FBTCxHQUFlLElBQUksQ0FBQyxHQUFMLENBQVMsSUFBSSxDQUFDLE9BQWQsRUFBdUIsT0FBdkI7UUFDZixPQUFBLEdBQVUsSUFBSSxDQUFDLEdBQUwsQ0FBUyxPQUFULEVBQWtCLElBQUMsQ0FBQSxJQUFJLENBQUMsT0FBeEI7UUFDVixNQUFBLEdBQVMsSUFBSSxDQUFDO1FBQ2QsTUFBTSxDQUFDLElBQVAsQ0FBWSxJQUFaO1FBQ0EsSUFBQSxHQUFXLElBQUEsRUFBRSxDQUFDLGdCQUFILENBQUE7UUFDWCxZQUFBLEdBQWUsQ0FBQyxJQUFEO1FBQ2YsS0FBQSxHQUFRLEtBQUEsR0FBUSxDQUFDLEtBQUEsR0FBUSxJQUFJLENBQUMsS0FBZCxFQVpwQjtPQUFBLE1BQUE7UUFjSSxZQUFZLENBQUMsSUFBYixDQUFrQixJQUFsQixFQWRKOztNQWdCQSxNQUFBLEdBQVMsSUFBSSxDQUFDLEdBQUwsQ0FBUyxNQUFULEVBQWlCLElBQUMsQ0FBQSxJQUFJLENBQUMsVUFBdkI7QUFwQmI7SUFzQkEsSUFBRyxZQUFZLENBQUMsTUFBYixHQUFzQixDQUF6QjtNQUNJLEtBQUEsR0FBWSxJQUFBLEVBQUUsQ0FBQyxhQUFILENBQWlCLElBQWpCLEVBQXVCLFlBQVksQ0FBQyxJQUFiLENBQWtCLEdBQWxCLENBQXZCO01BQ1osS0FBSyxDQUFDLFVBQU4sQ0FBaUIsSUFBQyxDQUFBLElBQWxCO01BQ0EsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFiLENBQWtCLEtBQWxCO01BQ0EsSUFBSSxDQUFDLEtBQUwsR0FBYTtNQUNiLElBQUksQ0FBQyxNQUFMLEdBQWMsSUFBSSxDQUFDLEdBQUwsQ0FBUyxNQUFULEVBQWlCLElBQUksQ0FBQyxNQUF0QjtNQUNkLElBQUksQ0FBQyxPQUFMLEdBQWUsSUFBSSxDQUFDLEdBQUwsQ0FBUyxPQUFULEVBQWtCLElBQUksQ0FBQyxPQUF2QixFQU5uQjs7QUFRQSxXQUFPO0VBcENTOzs7QUFzQ3BCOzs7Ozs7Ozs7Ozs7Ozs7O21DQWVBLGVBQUEsR0FBaUIsU0FBQyxLQUFELEVBQVEsSUFBUixFQUFjLEtBQWQsRUFBcUIsTUFBckIsRUFBNkIsTUFBN0IsRUFBcUMsUUFBckM7SUFDYixJQUFHLFFBQUg7QUFDSSxjQUFPLGVBQWUsQ0FBQyxRQUFRLENBQUMsUUFBaEM7QUFBQSxhQUNTLFlBRFQ7aUJBRVEsSUFBQyxDQUFBLGtCQUFELENBQW9CLEtBQXBCLEVBQTJCLElBQTNCLEVBQWlDLEtBQWpDLEVBQXdDLE1BQXhDLEVBQWdELE1BQWhEO0FBRlIsYUFHUyxVQUhUO2lCQUlRLElBQUMsQ0FBQSxnQkFBRCxDQUFrQixLQUFsQixFQUF5QixJQUF6QixFQUErQixLQUEvQixFQUFzQyxNQUF0QyxFQUE4QyxNQUE5QztBQUpSLE9BREo7S0FBQSxNQUFBO2FBT0ksSUFBQyxDQUFBLFlBQUQsQ0FBYyxLQUFkLEVBQXFCLElBQXJCLEVBQTJCLEtBQTNCLEVBQWtDLE1BQWxDLEVBQTBDLE1BQTFDLEVBUEo7O0VBRGE7OztBQVdqQjs7Ozs7Ozs7Ozs7Ozs7Ozs7O21DQWlCQSxjQUFBLEdBQWdCLFNBQUMsT0FBRCxFQUFVLFFBQVYsRUFBb0IsY0FBcEI7QUFDWixRQUFBO0lBQUEsTUFBQSxHQUFTO0lBQ1QsSUFBQSxHQUFXLElBQUEsRUFBRSxDQUFDLGdCQUFILENBQUE7SUFDWCxLQUFBLEdBQVEsY0FBQSxJQUFrQjtJQUMxQixNQUFBLEdBQVM7SUFDVCxPQUFBLEdBQVUsSUFBQyxDQUFBLElBQUksQ0FBQztJQUNoQixZQUFBLEdBQWU7SUFDZixJQUFBLEdBQU87SUFDUCxJQUFDLENBQUEsU0FBRCxHQUFhLElBQUMsQ0FBQSxJQUFJLENBQUMsV0FBTixDQUFrQixHQUFsQjtJQUNiLElBQUMsQ0FBQSxRQUFELEdBQVksSUFBQyxDQUFBLElBQUksQ0FBQztJQUVsQixNQUFBLEdBQVMsT0FBTyxDQUFDLEtBQVIsQ0FBYyxnQ0FBZDtJQUNULEtBQUEsR0FBUTtJQUNSLENBQUEsR0FBSTtJQUVKLFNBQUEsR0FBWSxJQUFDLENBQUEsSUFBSSxDQUFDO0lBQ2xCLGFBQUEsR0FBZ0IsSUFBQyxDQUFBLElBQUksQ0FBQztJQUN0QixNQUFBLEdBQVMsSUFBQyxDQUFBLElBQUksQ0FBQztJQUNmLElBQUEsR0FBTyxJQUFDLENBQUEsSUFBSSxDQUFDO0lBQ2IsU0FBQSxHQUFZLElBQUMsQ0FBQSxJQUFJLENBQUM7QUFFbEIsV0FBTSxDQUFBLEdBQUksTUFBTSxDQUFDLE1BQWpCO01BQ0ksS0FBQSxHQUFRLE1BQU8sQ0FBQSxDQUFBO01BRWYsSUFBRyxDQUFBLEdBQUksQ0FBSixLQUFTLENBQVo7UUFDSSxJQUFHLGFBQUg7VUFDSSxXQUFBLEdBQWMsSUFBQyxDQUFBLFdBQUQsQ0FBYSxLQUFiLEVBQW9CLE1BQU8sQ0FBQSxDQUFBLEdBQUUsQ0FBRixDQUEzQjtVQUVkLElBQUcsd0JBQUg7WUFDSSxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUF2QixDQUE2QixNQUE3QixFQUFxQyxDQUFDLENBQUEsR0FBRSxDQUFILEVBQU0sQ0FBTixDQUFRLENBQUMsTUFBVCxDQUFnQixXQUFoQixDQUFyQyxFQURKO1dBQUEsTUFFSyxJQUFPLHdCQUFQO1lBQ0QsTUFBTyxDQUFBLENBQUEsR0FBRSxDQUFGLENBQVAsR0FBYyxXQUFBLEdBQWMsTUFBTyxDQUFBLENBQUEsR0FBRSxDQUFGLEVBRGxDO1dBQUEsTUFBQTtZQUdELElBQUEsR0FBTyxJQUFDLENBQUEsbUJBQUQsQ0FBcUIsV0FBckI7WUFDUCxJQUFHLElBQUg7Y0FDSSxLQUFBLElBQVMsSUFBSSxDQUFDO2NBQ2QsTUFBQSxHQUFTLElBQUksQ0FBQyxHQUFMLENBQVMsTUFBVCxFQUFpQixJQUFJLENBQUMsTUFBdEIsRUFGYjs7WUFJQSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQWIsQ0FBa0IsV0FBbEIsRUFSQztXQUxUO1NBQUEsTUFBQTtVQWVJLElBQUksQ0FBQyxNQUFMLEdBQWMsTUFBQSxJQUFVLElBQUMsQ0FBQSxJQUFJLENBQUM7VUFDOUIsSUFBSSxDQUFDLEtBQUwsR0FBYTtVQUNiLElBQUksQ0FBQyxPQUFMLEdBQWU7VUFDZixNQUFNLENBQUMsSUFBUCxDQUFZLElBQVo7VUFDQSxJQUFBLEdBQVcsSUFBQSxFQUFFLENBQUMsZ0JBQUgsQ0FBQTtVQUNYLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBYixDQUFzQixJQUFBLEVBQUUsQ0FBQyxhQUFILENBQWlCLElBQWpCLEVBQXVCLElBQXZCLEVBQTZCLElBQUMsQ0FBQSxJQUE5QixDQUF0QjtVQUNBLEtBQUEsR0FBUTtVQUNSLE1BQUEsR0FBUztVQUNULE9BQUEsR0FBVSxJQUFDLENBQUEsSUFBSSxDQUFDLFFBdkJwQjs7UUF3QkEsQ0FBQSxJQUFLLEVBekJUO09BQUEsTUEwQkssSUFBRyxLQUFLLENBQUMsTUFBTixHQUFlLENBQWxCO1FBQ0QsSUFBQSxHQUFPLElBQUMsQ0FBQSxlQUFELENBQWlCLEtBQWpCLEVBQXdCLElBQXhCLEVBQThCLEtBQTlCLEVBQXFDLE1BQXJDLEVBQTZDLE1BQTdDLEVBQXFELFFBQXJEO1FBQ1AsS0FBQSxHQUFRLElBQUksQ0FBQztRQUNiLE1BQUEsR0FBUyxJQUFJLENBQUM7UUFDZCxPQUFBLEdBQVUsSUFBSSxDQUFDLFFBSmQ7O01BTUwsQ0FBQTtJQW5DSjtJQXFDQSxJQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBYixHQUFzQixDQUF0QixJQUEyQixNQUFNLENBQUMsTUFBUCxLQUFpQixDQUEvQztNQUNJLElBQUksQ0FBQyxNQUFMLEdBQWM7TUFDZCxJQUFJLENBQUMsS0FBTCxHQUFhO01BQ2IsSUFBSSxDQUFDLE9BQUwsR0FBZTtNQUNmLE1BQU0sQ0FBQyxJQUFQLENBQVksSUFBWixFQUpKOztJQU9BLElBQUMsQ0FBQSxJQUFJLENBQUMsSUFBTixHQUFhLElBQUMsQ0FBQTtJQUNkLElBQUMsQ0FBQSxJQUFJLENBQUMsU0FBTixHQUFrQjtJQUNsQixJQUFDLENBQUEsSUFBSSxDQUFDLGFBQU4sR0FBc0I7SUFDdEIsSUFBQyxDQUFBLElBQUksQ0FBQyxNQUFOLEdBQWU7SUFDZixJQUFDLENBQUEsSUFBSSxDQUFDLElBQU4sR0FBYTtJQUNiLElBQUMsQ0FBQSxJQUFJLENBQUMsU0FBTixHQUFrQjtBQUVsQixXQUFPO0VBeEVLOzs7QUEyRWhCOzs7Ozs7Ozs7O21DQVNBLHFCQUFBLEdBQXVCLFNBQUMsS0FBRCxFQUFRLFFBQVI7QUFDbkIsUUFBQTtJQUFBLElBQUEsR0FBTztNQUFBLEtBQUEsRUFBTyxDQUFQO01BQVUsTUFBQSxFQUFRLENBQWxCOztBQUVQLFNBQUEsdUNBQUE7O01BQ0ksSUFBSSxDQUFDLEtBQUwsR0FBYSxJQUFJLENBQUMsR0FBTCxDQUFTLElBQUksQ0FBQyxLQUFMLEdBQVcsQ0FBcEIsRUFBdUIsSUFBSSxDQUFDLEtBQTVCO01BQ2IsSUFBSSxDQUFDLE1BQUwsSUFBZSxJQUFJLENBQUMsTUFBTCxHQUFjLElBQUMsQ0FBQTtBQUZsQztJQUlBLElBQUksQ0FBQyxNQUFMLElBQWUsSUFBQyxDQUFBO0FBRWhCLFdBQU87RUFUWTs7O0FBV3ZCOzs7Ozs7Ozs7O21DQVNBLG9CQUFBLEdBQXNCLFNBQUMsSUFBRCxFQUFPLFFBQVA7QUFDbEIsUUFBQTtJQUFBLElBQUMsQ0FBQSxJQUFJLENBQUMsR0FBTixDQUFVLElBQUMsQ0FBQSxNQUFNLENBQUMsSUFBbEI7SUFDQSxJQUFBLEdBQU87SUFDUCxLQUFBLEdBQVEsSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsSUFBaEIsRUFBc0IsUUFBdEI7SUFFUixJQUFBLEdBQU8sSUFBQyxDQUFBLHFCQUFELENBQXVCLEtBQXZCLEVBQThCLFFBQTlCO0FBRVAsV0FBTztFQVBXOzs7QUFTdEI7Ozs7Ozs7OzttQ0FRQSxXQUFBLEdBQWEsU0FBQyxJQUFEO0FBQ1QsUUFBQTtJQUFBLElBQUEsR0FBTztNQUFBLEtBQUEsRUFBTyxDQUFQO01BQVUsTUFBQSxFQUFRLENBQWxCOztJQUNQLEtBQUEsR0FBUSxJQUFJLENBQUMsUUFBTCxDQUFBLENBQWUsQ0FBQyxLQUFoQixDQUFzQixJQUF0QjtBQUVSLFNBQUEsdUNBQUE7O01BQ0ksUUFBQSxHQUFXLElBQUMsQ0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQWIsQ0FBeUIsSUFBekI7TUFDWCxJQUFJLENBQUMsS0FBTCxHQUFhLElBQUksQ0FBQyxHQUFMLENBQVMsSUFBSSxDQUFDLEtBQWQsRUFBcUIsUUFBUSxDQUFDLEtBQTlCO01BQ2IsSUFBSSxDQUFDLE1BQUwsSUFBZSxJQUFDLENBQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFiLEdBQTBCLElBQUMsQ0FBQTtBQUg5QztJQUtBLElBQUksQ0FBQyxNQUFMLElBQWUsSUFBQyxDQUFBO0FBRWhCLFdBQU87RUFYRTs7O0FBYWI7Ozs7Ozs7Ozs7O21DQVVBLFNBQUEsR0FBVyxTQUFDLFVBQUQsRUFBYSxJQUFiLEVBQW1CLFNBQW5CLEVBQThCLE1BQTlCO0FBQ1AsUUFBQTtJQUFBLEtBQUEsR0FBUTtJQUNSLENBQUEsR0FBSTtJQUNKLElBQUcsU0FBQSxLQUFhLENBQUMsQ0FBakI7QUFDSSxhQUFNLENBQUEsSUFBSyxDQUFYO1FBQ0ksQ0FBQSxHQUFJLE1BQU8sQ0FBQSxDQUFBO1FBQ1gsSUFBRyxDQUFDLENBQUMsSUFBRixLQUFVLElBQWI7VUFDSSxLQUFBLEdBQVE7QUFDUixnQkFGSjs7UUFHQSxDQUFBO01BTEosQ0FESjs7QUFRQSxXQUFPO0VBWEE7OztBQWFYOzs7Ozs7Ozs7OzttQ0FVQSxpQkFBQSxHQUFtQixTQUFDLFVBQUQsRUFBYSxRQUFiLEVBQXVCLElBQXZCLEVBQTZCLE1BQTdCO0FBQ2YsUUFBQTtJQUFBLE1BQUEsR0FBUztJQUNULENBQUEsR0FBSTtJQUNKLENBQUEsR0FBSTtBQUVKLFdBQU0sQ0FBQSxHQUFJLENBQVY7TUFDSSxLQUFBLEdBQVEsTUFBTyxDQUFBLENBQUE7TUFDZixJQUFHLGtCQUFIO1FBQ0ksTUFBTSxDQUFDLElBQVAsQ0FBWSxLQUFaLEVBREo7O01BRUEsQ0FBQTtJQUpKO0FBTUEsV0FBTztFQVhROzs7QUFhbkI7Ozs7Ozs7Ozs7O21DQVVBLG1CQUFBLEdBQXFCLFNBQUMsS0FBRDtBQUNqQixRQUFBO0lBQUEsTUFBQSxHQUFTO0FBRVQsWUFBTyxLQUFLLENBQUMsSUFBYjtBQUFBLFdBQ1MsSUFEVDtRQUVRLElBQUMsQ0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQWIsR0FBb0IsS0FBSyxDQUFDLEtBQU4sSUFBZSxJQUFDLENBQUE7QUFEbkM7QUFEVCxXQUdTLEdBSFQ7UUFJUSxJQUFHLEtBQUssQ0FBQyxLQUFOLElBQWUsQ0FBbEI7VUFDSSxJQUFDLENBQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFiLEdBQXFCLElBQUksQ0FBQyxhQUQ5QjtTQUFBLE1BQUE7VUFHSSxJQUFDLENBQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFiLEdBQXFCLGFBQWEsQ0FBQyxNQUFNLENBQUMsTUFBTyxDQUFBLEtBQUssQ0FBQyxLQUFOLEdBQVksQ0FBWixDQUE1QixJQUE4QyxJQUFJLENBQUMsYUFINUU7O0FBREM7QUFIVCxXQVFTLEdBUlQ7QUFTUSxnQkFBTyxLQUFLLENBQUMsS0FBYjtBQUFBLGVBQ1MsR0FEVDtZQUNrQixJQUFDLENBQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFiLEdBQXlCO0FBQWxDO0FBRFQsZUFFUyxHQUZUO1lBRWtCLElBQUMsQ0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWIsR0FBNkI7QUFBdEM7QUFGVCxlQUdTLEdBSFQ7WUFHa0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBYixHQUFzQjtBQUEvQjtBQUhULGVBSVMsR0FKVDtZQUlrQixJQUFDLENBQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFiLEdBQW9CO0FBQTdCO0FBSlQsZUFLUyxHQUxUO1lBS2tCLElBQUMsQ0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQWIsR0FBeUI7QUFBbEM7QUFMVCxlQU1TLElBTlQ7WUFNbUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBYixHQUF5QjtBQUFuQztBQU5ULGVBT1MsSUFQVDtZQU9tQixJQUFDLENBQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFiLEdBQTZCO0FBQXZDO0FBUFQsZUFRUyxJQVJUO1lBUW1CLElBQUMsQ0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQWIsR0FBeUI7QUFBbkM7QUFSVCxlQVNTLElBVFQ7WUFTbUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBYixHQUFvQjtBQUE5QjtBQVRULGVBVVMsSUFWVDtZQVVtQixJQUFDLENBQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFiLEdBQXlCO0FBQW5DO0FBVlQsZUFXUyxHQVhUO1lBWVEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBYixHQUF5QjtZQUN6QixJQUFDLENBQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFiLEdBQTZCO1lBQzdCLElBQUMsQ0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQWIsR0FBc0I7WUFDdEIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBYixHQUFvQjtZQUNwQixJQUFDLENBQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFiLEdBQXlCO0FBaEJqQztBQVRSO0FBMkJBLFdBQU87RUE5QlU7OztBQWdDckI7Ozs7Ozs7Ozs7O21DQVVBLFFBQUEsR0FBVSxTQUFDLEVBQUQsRUFBSyxFQUFMLEVBQVMsRUFBVCxFQUFhLEVBQWIsRUFBaUIsSUFBakI7QUFDTixRQUFBO0lBQUEsS0FBQSxHQUFRLElBQUksQ0FBQyxRQUFMLENBQUEsQ0FBZSxDQUFDLEtBQWhCLENBQXNCLElBQXRCO0lBQ1IsSUFBQSxHQUFPLElBQUMsQ0FBQSxNQUFNLENBQUM7SUFDZixNQUFBLEdBQVMsSUFBSSxDQUFDO0FBRWQsU0FBQSwrQ0FBQTs7TUFDSSxJQUFBLEdBQU8sSUFBSSxDQUFDLFdBQUwsQ0FBaUIsSUFBakI7TUFDUCxJQUFDLENBQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFmLENBQXdCLEVBQXhCLEVBQTRCLENBQUEsR0FBSSxNQUFKLEdBQWEsRUFBekMsRUFBNkMsSUFBSSxDQUFDLEtBQUwsR0FBYSxFQUFiLEdBQWdCLEVBQTdELEVBQWlFLE1BQUEsR0FBTyxFQUFQLEdBQVUsRUFBM0UsRUFBK0UsSUFBL0UsRUFBcUYsQ0FBckYsRUFBd0YsQ0FBeEY7QUFGSjtBQUlBLFdBQU87RUFURDs7O0FBV1Y7Ozs7Ozs7Ozs7Ozs7O21DQWFBLGtCQUFBLEdBQW9CLFNBQUMsRUFBRCxFQUFLLEVBQUwsRUFBUyxFQUFULEVBQWEsRUFBYixFQUFpQixLQUFqQixFQUF3QixRQUF4QjtBQUNoQixRQUFBO0lBQUEsSUFBQyxDQUFBLFFBQUQsR0FBWTtJQUNaLElBQUMsQ0FBQSxRQUFELEdBQVk7SUFDWixJQUFDLENBQUEsaUJBQUQsR0FBcUI7QUFFckIsU0FBQSx1Q0FBQTs7QUFDSTtBQUFBLFdBQUEsdUNBQUE7O1FBQ0ksSUFBRyxrQkFBSDtVQUNJLElBQUMsQ0FBQSxtQkFBRCxDQUFxQixLQUFyQjtVQUNBLElBQUEsR0FBTyxJQUFDLENBQUEsbUJBQUQsQ0FBcUIsS0FBckI7VUFDUCxJQUFHLElBQUg7WUFDSSxJQUFDLENBQUEsZ0JBQUQsQ0FBa0IsS0FBbEIsRUFBeUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFqQyxFQUF5QyxJQUFDLENBQUEsUUFBMUM7WUFDQSxJQUFDLENBQUEsUUFBRCxJQUFhLElBQUksQ0FBQyxNQUZ0QjtXQUhKO1NBQUEsTUFNSyxJQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBWixHQUFxQixDQUF4QjtVQUNELElBQUEsR0FBTyxJQUFDLENBQUEsTUFBTSxDQUFDO1VBQ2YsTUFBQSxHQUFTLElBQUksQ0FBQztVQUNkLElBQUcsS0FBSyxDQUFDLEtBQU4sS0FBZSxJQUFsQjtZQUNJLElBQUEsR0FBTyxJQUFJLENBQUMsZ0JBQUwsQ0FBc0IsS0FBSyxDQUFDLEtBQTVCO1lBQ1AsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBZixDQUF3QixJQUFDLENBQUEsUUFBekIsRUFBbUMsSUFBQyxDQUFBLFFBQUQsR0FBWSxNQUFaLEdBQXFCLElBQUksQ0FBQyxNQUExQixHQUFtQyxJQUFJLENBQUMsT0FBeEMsR0FBa0QsSUFBSSxDQUFDLE9BQTFGLEVBQW1HLElBQUksQ0FBQyxLQUFMLEdBQVcsRUFBWCxHQUFjLEVBQWpILEVBQXFILE1BQUEsR0FBTyxFQUFQLEdBQVUsRUFBL0gsRUFBbUksS0FBSyxDQUFDLEtBQXpJLEVBQWdKLENBQWhKLEVBQW1KLENBQW5KO1lBQ0EsSUFBQyxDQUFBLFFBQUQsSUFBYSxJQUFJLENBQUMsTUFIdEI7O1VBSUEsSUFBQyxDQUFBLGlCQUFELEdBQXFCLElBQUksQ0FBQyxHQUFMLENBQVMsSUFBQyxDQUFBLGlCQUFWLEVBQTZCLE1BQTdCLEVBUHBCOztBQVBUO01BZUEsSUFBQyxDQUFBLFFBQUQsSUFBYSxDQUFDLElBQUMsQ0FBQSxpQkFBRCxJQUFzQixJQUFDLENBQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFwQyxDQUFBLEdBQWtELElBQUMsQ0FBQTtNQUNoRSxJQUFDLENBQUEsUUFBRCxHQUFZO01BQ1osSUFBQyxDQUFBLGlCQUFELEdBQXFCO0FBbEJ6QjtBQW9CQSxXQUFPO0VBekJTOzs7QUEyQnBCOzs7Ozs7Ozs7Ozs7Ozs7bUNBY0EsaUJBQUEsR0FBbUIsU0FBQyxFQUFELEVBQUssRUFBTCxFQUFTLEVBQVQsRUFBYSxFQUFiLEVBQWlCLElBQWpCLEVBQXVCLFFBQXZCO0FBQ2YsUUFBQTtJQUFBLEtBQUEsR0FBUSxJQUFDLENBQUEsY0FBRCxDQUFnQixJQUFJLENBQUMsUUFBTCxDQUFBLENBQWhCLEVBQWlDLFFBQWpDO0lBRVIsSUFBQyxDQUFBLGtCQUFELENBQW9CLEVBQXBCLEVBQXdCLEVBQXhCLEVBQTRCLEVBQTVCLEVBQWdDLEVBQWhDLEVBQW9DLEtBQXBDLEVBQTJDLFFBQTNDO0FBRUEsV0FBTztFQUxROzs7O0dBajFCYyxFQUFFLENBQUM7O0FBdzFCeEMsRUFBRSxDQUFDLHNCQUFILEdBQTRCIiwic291cmNlc0NvbnRlbnQiOlsiIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4jXG4jICAgU2NyaXB0OiBDb21wb25lbnRfVGV4dFJlbmRlcmVyXG4jXG4jICAgJCRDT1BZUklHSFQkJFxuI1xuIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmNsYXNzIFJlbmRlcmVyVGV4dExpbmVcbiAgICAjIyMqXG4gICAgKiBTdG9yZXMgYSB0ZXh0IGxpbmUuXG4gICAgKiBcbiAgICAqIEBtb2R1bGUgZ3MuUmVuZGVyZXJUZXh0TGluZVxuICAgICogQGNsYXNzIFJlbmRlcmVyVGV4dExpbmVcbiAgICAqIEBtZW1iZXJvZiBncy5SZW5kZXJlclRleHRMaW5lXG4gICAgKiBAY29uc3RydWN0b3JcbiAgICAjIyNcbiAgICBjb25zdHJ1Y3RvcjogLT5cbiAgICAgICAgIyMjXG4gICAgICAgICogVGhlIHdpZHRoIG9mIHRoZSBsaW5lIGluIHBpeGVscy5cbiAgICAgICAgKiBAcHJvcGVydHkgd2lkdGhcbiAgICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgICMjI1xuICAgICAgICBAd2lkdGggPSAwXG4gICAgICAgICMjI1xuICAgICAgICAqIFRoZSBoZWlnaHQgb2YgdGhlIGxpbmUgaW4gcGl4ZWxzLlxuICAgICAgICAqIEBwcm9wZXJ0eSB3aWR0aFxuICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgIyMjXG4gICAgICAgIEBoZWlnaHQgPSAwXG4gICAgICAgICMjI1xuICAgICAgICAqIFRoZSBkZXNjZW50IG9mIHRoZSBsaW5lIGluIHBpeGVscy5cbiAgICAgICAgKiBAcHJvcGVydHkgZGVzY2VudFxuICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgIyMjXG4gICAgICAgIEBkZXNjZW50ID0gMFxuICAgICAgICAjIyNcbiAgICAgICAgKiBUaGUgY29udGVudCBvZiB0aGUgbGluZSBhcyB0b2tlbiBvYmplY3RzLlxuICAgICAgICAqIEBwcm9wZXJ0eSBjb250ZW50XG4gICAgICAgICogQHR5cGUgT2JqZWN0W11cbiAgICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgICMjI1xuICAgICAgICBAY29udGVudCA9IFtdXG4gICAgICAgIFxuZ3MuUmVuZGVyZXJUZXh0TGluZSA9IFJlbmRlcmVyVGV4dExpbmVcblxuY2xhc3MgUmVuZGVyZXJUb2tlblxuICAgICMjIypcbiAgICAqIFN0b3JlcyBhIHRva2VuLlxuICAgICogXG4gICAgKiBAbW9kdWxlIGdzXG4gICAgKiBAY2xhc3MgUmVuZGVyZXJUb2tlblxuICAgICogQG1lbWJlcm9mIGdzXG4gICAgKiBAY29uc3RydWN0b3JcbiAgICAjIyNcbiAgICBjb25zdHJ1Y3RvcjogKGNvZGUsIHZhbHVlLCBmb250KSAtPlxuICAgICAgICAjIyNcbiAgICAgICAgKiBUaGUgdmFsdWUgb2YgdGhlIHRva2VuLiBUaGF0IHZhbHVlIGRlcGVuZHMgb24gdGhlIHRva2VuIHR5cGUuIEZvciB0ZXh0LXRva2VucywgaXQgc3RvcmVzXG4gICAgICAgICogdGhlIGFjdHVhbCB0ZXh0LlxuICAgICAgICAqIEBwcm9wZXJ0eSBjb250ZW50XG4gICAgICAgICogQHR5cGUgc3RyaW5nXG4gICAgICAgICMjI1xuICAgICAgICBAdmFsdWUgPSB2YWx1ZVxuICAgICAgICAjIyNcbiAgICAgICAgKiBUaGUgY29kZSBkZXNjcmliZXMgd2hhdCBraW5kIG9mIHRva2VuIGl0IGlzLiBGb3IgZXhhbXBsZSwgaWYgdGhlIGNvZGUgaXMgXCJZXCIgaXQgbWVhbnMgaXQgaXMgYVxuICAgICAgICAqIHN0eWxlLXRva2VuLiBJZiB0aGUgY29kZSBpcyA8Yj5udWxsPC9iPiwgaXQgbWVhbnMgaXQgaXMgYSB0ZXh0LXRva2VuLlxuICAgICAgICAqIEBwcm9wZXJ0eSBjb2RlXG4gICAgICAgICogQHR5cGUgc3RyaW5nXG4gICAgICAgICMjI1xuICAgICAgICBAY29kZSA9IGNvZGVcbiAgICAgICAgIyMjXG4gICAgICAgICogVGhlIGZvcm1hdCBzdG9yZXMgdGhlIGZvbnQtc3R5bGUgcHJvcGVydGllcyBvZiB0aGUgdG9rZW4gbGlrZSBpZiBpdCBpcyBpdGFsaWMsIGJvbGQsIGV0Yy4gSXQgY2FuIGJlIDxiPm51bGw8L2I+LlxuICAgICAgICAqIEBwcm9wZXJ0eSBmb3JtYXRcbiAgICAgICAgKiBAdHlwZSBPYmplY3RcbiAgICAgICAgIyMjXG4gICAgICAgIEBmb3JtYXQgPSBudWxsXG4gICAgICAgIFxuICAgICAgICBAdGFrZUZvcm1hdChmb250KSBpZiBmb250P1xuICAgICAgICAgICAgXG4gICAgIyMjKlxuICAgICogVGFrZXMgdGhlIHN0eWxlIGZyb20gdGhlIHNwZWNpZmllZCBmb250IGFuZCBzdG9yZXMgaXQgaW50byB0aGUgZm9ybWF0LXByb3BlcnR5LiBUaGUgdG9rZW4gd2lsbFxuICAgICogd2lsbCBiZSByZW5kZXJlZCB3aXRoIHRoYXQgc3R5bGUgdGhlbi5cbiAgICAqIFxuICAgICogQG1ldGhvZCB0YWtlRm9ybWF0XG4gICAgKiBAcGFyYW0ge2dzLkZvbnR9IGZvbnQgLSBUaGUgZm9udCB0byB0YWtlIHRoZSBzdHlsZSBmcm9tLlxuICAgICMjI1xuICAgIHRha2VGb3JtYXQ6IChmb250KSAtPlxuICAgICAgICBAZm9ybWF0ID0gZm9udC50b0RhdGFCdW5kbGUoKVxuICAgIFxuICAgICMjIypcbiAgICAqIEFwcGxpZXMgdGhlIGZvcm1hdC1zdHlsZSBvZiB0aGUgdG9rZW4gb24gdGhlIHNwZWNpZmllZCBmb250LiBUaGUgZm9udCB3aWxsIGhhdmUgdGhlIHN0eWxlIGZyb21cbiAgICAqIHRoZW4gdG9rZW4gdGhlbi5cbiAgICAqIFxuICAgICogQG1ldGhvZCBhcHBseUZvcm1hdFxuICAgICogQHBhcmFtIHtncy5Gb250fSBmb250IC0gVGhlIGZvbnQgdG8gYXBwbHkgdGhlIGZvcm1hdC1zdHlsZSBvbi5cbiAgICAjIyMgICAgXG4gICAgYXBwbHlGb3JtYXQ6IChmb250KSAtPlxuICAgICAgICBmb250LnNldChAZm9ybWF0KVxuICAgICAgICBcbmdzLlJlbmRlcmVyVG9rZW4gPSBSZW5kZXJlclRva2VuXG5cbmNsYXNzIENvbXBvbmVudF9UZXh0UmVuZGVyZXIgZXh0ZW5kcyBncy5Db21wb25lbnRcbiAgICAjIyMqXG4gICAgKiBBIHRleHQtcmVuZGVyZXIgY29tcG9uZW50IGFsbG93IHRvIGRyYXcgcGxhaW4gb3IgZm9ybWF0dGVkIHRleHQgb24gYVxuICAgICogZ2FtZSBvYmplY3QncyBiaXRtYXAuIEZvciBmb3JtYXR0ZWQgdGV4dCwgZGlmZmVyZW50IHRleHQtY29kZXMgY2FuIGJlXG4gICAgKiB1c2VkIHRvIGFkZCBmb3JtYXR0aW5nIG9yIGRlZmluZSBhIHBsYWNlaG9sZGVyLjxicj48YnI+XG4gICAgKiBcbiAgICAqIEEgdGV4dC1jb2RlIHVzZXMgdGhlIGZvbGxvd2luZyBzeW50YXg6PGJyPjxicj5cbiAgICAqIFxuICAgICoge2NvZGU6dmFsdWV9IDwtIFNpbmdsZSBWYWx1ZTxiciAvPlxuICAgICoge2NvZGU6dmFsdWUxLHZhbHVlMiwuLi59IDwtIE11bHRpcGxlIFZhbHVlczxicj48YnI+XG4gICAgKiBcbiAgICAqIEV4YW1wbGU6PGJyPjxicj5cbiAgICAqIFxuICAgICogXCJUaGlzIGlzIHtZOkl9YSBUZXh0e1k6Tn1cIiA8LSBcImEgVGV4dFwiIHdpbGwgYmUgaXRhbGljIGhlcmUuPGJyPlxuICAgICogXCJUaGUgdmFsdWUgaXMge0dOOjF9XCIgPC0gXCJ7R046MX1cIiB3aWxsIGJlIHJlcGxhY2VkIGZvciB0aGUgdmFsdWUgb2YgdGhlIGdsb2JhbCBudW1iZXIgdmFyaWFibGUgMDAwMS48YnI+PGJyPlxuICAgICogXG4gICAgKiBGb3IgYSBsaXN0IG9mIGFsbCBhdmFpbGFibGUgdGV4dC1jb2RlcyB3aXRoIGV4YW1wbGVzLCBqdXN0IHRha2UgYSBsb29rIGludG8gdGhlIG9mZmljYWwgaGVscC1maWxlLlxuICAgICogXG4gICAgKiBAbW9kdWxlIGdzXG4gICAgKiBAY2xhc3MgQ29tcG9uZW50X1RleHRSZW5kZXJlclxuICAgICogQGV4dGVuZHMgZ3MuQ29tcG9uZW50XG4gICAgKiBAbWVtYmVyb2YgZ3NcbiAgICAqIEBjb25zdHJ1Y3RvclxuICAgICMjI1xuICAgIGNvbnN0cnVjdG9yOiAtPlxuICAgICAgICBzdXBlclxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIEBwcm9wZXJ0eSBjdXJyZW50WFxuICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgIyMjXG4gICAgICAgIEBjdXJyZW50WCA9IDBcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBAcHJvcGVydHkgY3VycmVudFlcbiAgICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgICMjI1xuICAgICAgICBAY3VycmVudFkgPSAwXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogQHByb3BlcnR5IGN1cnJlbnRMaW5lSGVpZ2h0XG4gICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAjIyNcbiAgICAgICAgQGN1cnJlbnRMaW5lSGVpZ2h0ID0gMFxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIEBwcm9wZXJ0eSBmb250XG4gICAgICAgICogQHR5cGUgZ3MuRm9udFxuICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgIyMjXG4gICAgICAgIEBmb250ID0gbmV3IEZvbnQoXCJUaW1lcyBOZXcgUm9tYW5cIiwgMjIpXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogQHByb3BlcnR5IHNwYWNlU2l6ZVxuICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgIyMjXG4gICAgICAgIEBzcGFjZVNpemUgPSAwXG4gICAgICAgIFxuICAgICAgICAjIyMqXG4gICAgICAgICogQHByb3BlcnR5IGZvbnRTaXplXG4gICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAjIyNcbiAgICAgICAgQGZvbnRTaXplID0gMFxuICAgICAgICBcbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSBsZWZ0IGFuZCByaWdodCBwYWRkaW5nIHBlciBsaW5lLlxuICAgICAgICAqIEBwcm9wZXJ0eSBwYWRkaW5nXG4gICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgICMjI1xuICAgICAgICBAcGFkZGluZyA9IDBcbiAgICAgICAgXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgc3BhY2luZyBiZXR3ZWVuIHRleHQgbGluZXMgaW4gcGl4ZWxzLlxuICAgICAgICAqIEBwcm9wZXJ0eSBsaW5lU3BhY2luZ1xuICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAjIyNcbiAgICAgICAgQGxpbmVTcGFjaW5nID0gMFxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBDcmVhdGVzIHRoZSB0b2tlbi1vYmplY3QgZm9yIGEgbGlzdC1wbGFjZWhvbGRlci4gQSBsaXN0LXBsYWNlaG9sZGVyXG4gICAgKiBhbGxvd3MgdG8gaW5zZXJ0IGEgdmFsdWUgZnJvbSBhIGxpc3QtdmFyaWFibGUuXG4gICAgKiBcbiAgICAqIEBtZXRob2QgY3JlYXRlTGlzdFRva2VuXG4gICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0IC0gVGhlIGxpc3QuXG4gICAgKiBAcGFyYW0ge0FycmF5fSB2YWx1ZXMgLSBUaGUgdmFsdWVzIG9mIHRoZSBsaXN0LXBsYWNlaG9sZGVyIHRleHQtY29kZS5cbiAgICAqIEByZXR1cm4ge3N0cmluZ30gVGhlIHRva2VuLW9iamVjdC5cbiAgICAjIyNcbiAgICBjcmVhdGVMaXN0VG9rZW46IChsaXN0LCB2YWx1ZXMpIC0+XG4gICAgICAgIGluZGV4ID0gMFxuICAgICAgICBpZiB2YWx1ZXNbMV0/XG4gICAgICAgICAgICB2YWx1ZXMgPSB2YWx1ZXNbMV0uc3BsaXQoXCI6XCIpXG4gICAgICAgICAgICBpbmRleCA9IHZhbHVlc1swXVxuICAgICAgICAgICAgaWYgdmFsdWVzWzBdID09IFwiR1wiXG4gICAgICAgICAgICAgICAgaW5kZXggPSBHYW1lTWFuYWdlci52YXJpYWJsZVN0b3JlLm51bWJlcnNbcGFyc2VJbnQodmFsdWVzWzFdKS0xXVxuICAgICAgICAgICAgZWxzZSBpZiB2YWx1ZXNbMF0gPT0gXCJQXCJcbiAgICAgICAgICAgICAgICBpbmRleCA9IEdhbWVNYW5hZ2VyLnZhcmlhYmxlU3RvcmUucGVyc2lzdGVudE51bWJlcnNbcGFyc2VJbnQodmFsdWVzWzFdKS0xXVxuICAgICAgICAgICAgZWxzZSBpZiB2YWx1ZXNbMF0gPT0gXCJMXCJcbiAgICAgICAgICAgICAgICBpbmRleCA9IEdhbWVNYW5hZ2VyLnZhcmlhYmxlU3RvcmUubnVtYmVyVmFsdWVPZih7IHNjb3BlOiAwLCBpbmRleDogcGFyc2VJbnQodmFsdWVzWzFdKS0xfSlcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgcmV0dXJuIFwiXCIgKyBsaXN0W2luZGV4XVxuICAgICAgIFxuICAgICAgIFxuICAgIHBhcnNlVmFyaWFibGVJZGVudGlmaWVyOiAoaWRlbnRpZmllcikgLT5cbiAgICAgICAgcmVzdWx0ID0gWzAsIGlkZW50aWZpZXJdXG4gICAgICAgIFxuICAgICAgICBpZiBpc05hTihpZGVudGlmaWVyKVxuICAgICAgICAgICAgaW5kZXggPSBpZGVudGlmaWVyLmxhc3RJbmRleE9mKFwiLlwiKVxuICAgICAgICAgICAgaWYgaW5kZXggIT0gLTFcbiAgICAgICAgICAgICAgICByZXN1bHRbMF0gPSBpZGVudGlmaWVyLnN1YnN0cmluZygwLCBpbmRleClcbiAgICAgICAgICAgICAgICByZXN1bHRbMV0gPSBwYXJzZUludChpZGVudGlmaWVyLnN1YnN0cmluZyhpbmRleCsxKSlcbiAgICAgICAgICAgIFxuICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgIyMjKlxuICAgICogQ3JlYXRlcyBhIHRva2VuLW9iamVjdCBmb3IgYSBzcGVjaWZpZWQgdGV4dC1jb2RlLlxuICAgICogXG4gICAgKiBAbWV0aG9kIGNyZWF0ZVRva2VuXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gY29kZSAtIFRoZSBjb2RlL3R5cGUgb2YgdGhlIHRleHQtY29kZS5cbiAgICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSAtIFRoZSB2YWx1ZSBvZiB0aGUgdGV4dC1jb2RlLlxuICAgICogQHJldHVybiB7T2JqZWN0fSBUaGUgdG9rZW4tb2JqZWN0LlxuICAgICMjI1xuICAgIGNyZWF0ZVRva2VuOiAoY29kZSwgdmFsdWUpIC0+XG4gICAgICAgIHRva2VuT2JqZWN0ID0gbnVsbFxuICAgICAgICB2YWx1ZSA9IGlmIGlzTmFOKHZhbHVlKSB0aGVuIHZhbHVlIGVsc2UgcGFyc2VJbnQodmFsdWUpXG4gICAgICAgIHN3aXRjaCBjb2RlXG4gICAgICAgICAgICB3aGVuIFwiU1pcIiBcbiAgICAgICAgICAgICAgICB0b2tlbk9iamVjdCA9IG5ldyBncy5SZW5kZXJlclRva2VuKGNvZGUsIHZhbHVlKVxuICAgICAgICAgICAgICAgIEBmb250LnNpemUgPSB0b2tlbk9iamVjdC52YWx1ZSB8fCBAZm9udFNpemVcbiAgICAgICAgICAgICAgICBAc3BhY2VTaXplID0gQGZvbnQubWVhc3VyZVRleHRQbGFpbihcIiBcIilcbiAgICAgICAgICAgIHdoZW4gXCJZXCJcbiAgICAgICAgICAgICAgICB0b2tlbk9iamVjdCA9IHsgY29kZTogY29kZSwgdmFsdWU6IHZhbHVlIH1cbiAgICAgICAgICAgICAgICBzd2l0Y2ggdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgd2hlbiBcIlVcIiB0aGVuIEBmb250LnVuZGVybGluZSA9IHllc1xuICAgICAgICAgICAgICAgICAgICB3aGVuIFwiU1wiIHRoZW4gQGZvbnQuc3RyaWtlVGhyb3VnaCA9IHllc1xuICAgICAgICAgICAgICAgICAgICB3aGVuIFwiSVwiIHRoZW4gQGZvbnQuaXRhbGljID0geWVzXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gXCJCXCIgdGhlbiBAZm9udC5ib2xkID0geWVzXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gXCJDXCIgdGhlbiBAZm9udC5zbWFsbENhcHMgPSB5ZXNcbiAgICAgICAgICAgICAgICAgICAgd2hlbiBcIk5VXCIgdGhlbiBAZm9udC51bmRlcmxpbmUgPSBub1xuICAgICAgICAgICAgICAgICAgICB3aGVuIFwiTlNcIiB0aGVuIEBmb250LnN0cmlrZVRocm91Z2ggPSBub1xuICAgICAgICAgICAgICAgICAgICB3aGVuIFwiTklcIiB0aGVuIEBmb250Lml0YWxpYyA9IG5vXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gXCJOQlwiIHRoZW4gQGZvbnQuYm9sZCA9IG5vXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gXCJOQ1wiIHRoZW4gQGZvbnQuc21hbGxDYXBzID0gbm9cbiAgICAgICAgICAgICAgICAgICAgd2hlbiBcIk5cIlxuICAgICAgICAgICAgICAgICAgICAgICAgQGZvbnQudW5kZXJsaW5lID0gbm9cbiAgICAgICAgICAgICAgICAgICAgICAgIEBmb250LnN0cmlrZVRocm91Z2ggPSBub1xuICAgICAgICAgICAgICAgICAgICAgICAgQGZvbnQuaXRhbGljID0gbm9cbiAgICAgICAgICAgICAgICAgICAgICAgIEBmb250LmJvbGQgPSBub1xuICAgICAgICAgICAgICAgICAgICAgICAgQGZvbnQuc21hbGxDYXBzID0gbm9cbiAgICAgICAgICAgICAgICBAc3BhY2VTaXplID0gQGZvbnQubWVhc3VyZVRleHRQbGFpbihcIiBcIilcbiAgICAgICAgICAgIHdoZW4gXCJDXCJcbiAgICAgICAgICAgICAgICB0b2tlbk9iamVjdCA9IG5ldyBncy5SZW5kZXJlclRva2VuKGNvZGUsIHZhbHVlKVxuICAgICAgICAgICAgICAgIGlmIHZhbHVlIDw9IDBcbiAgICAgICAgICAgICAgICAgICAgQGZvbnQuY29sb3IgPSBGb250LmRlZmF1bHRDb2xvclxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgQGZvbnQuY29sb3IgPSBncy5Db2xvci5mcm9tT2JqZWN0KFJlY29yZE1hbmFnZXIuc3lzdGVtLmNvbG9yc1t2YWx1ZS0xXSB8fCBGb250LmRlZmF1bHRDb2xvcilcbiAgICAgICAgICAgIHdoZW4gXCJHTlwiXG4gICAgICAgICAgICAgICAgdmFsdWVzID0gaWYgaXNOYU4odmFsdWUpIHRoZW4gdmFsdWUuc3BsaXQoXCIsXCIpIGVsc2UgW3ZhbHVlXVxuICAgICAgICAgICAgICAgIGlmIHZhbHVlc1sxXVxuICAgICAgICAgICAgICAgICAgICBmb3JtYXQgPSB2YWx1ZXNbMV1cbiAgICAgICAgICAgICAgICAgICAgdmFsdWVzID0gQHBhcnNlVmFyaWFibGVJZGVudGlmaWVyKHZhbHVlc1swXSlcbiAgICAgICAgICAgICAgICAgICAgdG9rZW5PYmplY3QgPSBzcHJpbnRmKFwiJVwiK2Zvcm1hdCtcImRcIiwgKEdhbWVNYW5hZ2VyLnZhcmlhYmxlU3RvcmUubnVtYmVyc0J5RG9tYWluW3ZhbHVlc1swXXx8MF1bdmFsdWVzWzFdLTFdIHx8IDApKVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVzID0gQHBhcnNlVmFyaWFibGVJZGVudGlmaWVyKHZhbHVlc1swXSlcbiAgICAgICAgICAgICAgICAgICAgdG9rZW5PYmplY3QgPSAoR2FtZU1hbmFnZXIudmFyaWFibGVTdG9yZS5udW1iZXJzQnlEb21haW5bdmFsdWVzWzBdfHwwXVt2YWx1ZXNbMV0tMV0gfHwgMCkudG9TdHJpbmcoKVxuICAgICAgICAgICAgd2hlbiBcIkdUXCIgXG4gICAgICAgICAgICAgICAgdmFsdWVzID0gQHBhcnNlVmFyaWFibGVJZGVudGlmaWVyKHZhbHVlKVxuICAgICAgICAgICAgICAgIHRva2VuT2JqZWN0ID0gKEdhbWVNYW5hZ2VyLnZhcmlhYmxlU3RvcmUuc3RyaW5nc0J5RG9tYWluW3ZhbHVlc1swXXx8MF1bdmFsdWVzWzFdLTFdIHx8IFwiXCIpXG4gICAgICAgICAgICAgICAgdG9rZW5PYmplY3QgPSB0b2tlbk9iamVjdC5zcGxpdCgvXFx7KFtBLXpdKyk6KFteXFx7XFx9XSspXFx9fChcXG4pL2dtKVxuICAgICAgICAgICAgICAgIGlmIHRva2VuT2JqZWN0Lmxlbmd0aCA+IDFcbiAgICAgICAgICAgICAgICAgICAgdG9rZW5PYmplY3QucG9wKClcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHRva2VuT2JqZWN0ID0gdG9rZW5PYmplY3RbMF0gPyBcIlwiXG4gICAgICAgICAgICB3aGVuIFwiR1NcIlxuICAgICAgICAgICAgICAgIHZhbHVlcyA9IEBwYXJzZVZhcmlhYmxlSWRlbnRpZmllcih2YWx1ZSlcbiAgICAgICAgICAgICAgICB0b2tlbk9iamVjdCA9IChHYW1lTWFuYWdlci52YXJpYWJsZVN0b3JlLmJvb2xlYW5zQnlEb21haW5bdmFsdWVzWzBdfHwwXVt2YWx1ZXNbMV0tMV0gfHwgZmFsc2UpLnRvU3RyaW5nKClcbiAgICAgICAgICAgIHdoZW4gXCJHTFwiXG4gICAgICAgICAgICAgICAgdmFsdWVzID0gdmFsdWUuc3BsaXQoXCIsXCIpXG4gICAgICAgICAgICAgICAgbGlzdElkZW50aWZpZXIgPSBAcGFyc2VWYXJpYWJsZUlkZW50aWZpZXIodmFsdWVzWzBdKVxuICAgICAgICAgICAgICAgIHRva2VuT2JqZWN0ID0gQGNyZWF0ZUxpc3RUb2tlbihHYW1lTWFuYWdlci52YXJpYWJsZVN0b3JlLmxpc3RzQnlEb21haW5bbGlzdElkZW50aWZpZXJbMF1dW2xpc3RJZGVudGlmaWVyWzFdLTFdIHx8IFtdLCB2YWx1ZXMpXG4gICAgICAgICAgICB3aGVuIFwiUE5cIlxuICAgICAgICAgICAgICAgIHZhbHVlcyA9IGlmIGlzTmFOKHZhbHVlKSB0aGVuIHZhbHVlLnNwbGl0KFwiLFwiKSBlbHNlIFt2YWx1ZV1cbiAgICAgICAgICAgICAgICBpZiB2YWx1ZXNbMV1cbiAgICAgICAgICAgICAgICAgICAgZm9ybWF0ID0gdmFsdWVzWzFdXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlcyA9IEBwYXJzZVZhcmlhYmxlSWRlbnRpZmllcih2YWx1ZXNbMF0pXG4gICAgICAgICAgICAgICAgICAgIHRva2VuT2JqZWN0ID0gc3ByaW50ZihcIiVcIitmb3JtYXQrXCJkXCIsIChHYW1lTWFuYWdlci52YXJpYWJsZVN0b3JlLnBlcnNpc3RlbnROdW1iZXJzW3ZhbHVlc1swXV1bdmFsdWVzWzFdLTFdIHx8IDApKVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgdG9rZW5PYmplY3QgPSAoR2FtZU1hbmFnZXIudmFyaWFibGVTdG9yZS5wZXJzaXN0ZW50TnVtYmVyc1swXVt2YWx1ZXNbMF0tMV0gfHwgMCkudG9TdHJpbmcoKVxuICAgICAgICAgICAgd2hlbiBcIlBUXCIgIFxuICAgICAgICAgICAgICAgIHZhbHVlcyA9IEBwYXJzZVZhcmlhYmxlSWRlbnRpZmllcih2YWx1ZSlcbiAgICAgICAgICAgICAgICB0b2tlbk9iamVjdCA9IChHYW1lTWFuYWdlci52YXJpYWJsZVN0b3JlLnBlcnNpc3RlbnRTdHJpbmdzW3ZhbHVlc1swXV1bdmFsdWVzWzFdLTFdIHx8IFwiXCIpXG4gICAgICAgICAgICAgICAgdG9rZW5PYmplY3QgPSB0b2tlbk9iamVjdC5zcGxpdCgvXFx7KFtBLXpdKyk6KFteXFx7XFx9XSspXFx9fChcXG4pL2dtKVxuICAgICAgICAgICAgICAgIGlmIHRva2VuT2JqZWN0Lmxlbmd0aCA+IDFcbiAgICAgICAgICAgICAgICAgICAgdG9rZW5PYmplY3QucG9wKClcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHRva2VuT2JqZWN0ID0gdG9rZW5PYmplY3RbMF0gPyBcIlwiXG4gICAgICAgICAgICB3aGVuIFwiUFNcIlxuICAgICAgICAgICAgICAgIHZhbHVlcyA9IEBwYXJzZVZhcmlhYmxlSWRlbnRpZmllcih2YWx1ZSlcbiAgICAgICAgICAgICAgICB0b2tlbk9iamVjdCA9IChHYW1lTWFuYWdlci52YXJpYWJsZVN0b3JlLnBlcnNpc3RlbnRCb29sZWFuc1t2YWx1ZXNbMF1dW3ZhbHVlc1sxXS0xXSB8fCBmYWxzZSkudG9TdHJpbmcoKVxuICAgICAgICAgICAgd2hlbiBcIlBMXCJcbiAgICAgICAgICAgICAgICB2YWx1ZXMgPSB2YWx1ZS5zcGxpdChcIixcIilcbiAgICAgICAgICAgICAgICBsaXN0SWRlbnRpZmllciA9IEBwYXJzZVZhcmlhYmxlSWRlbnRpZmllcih2YWx1ZXNbMF0pXG4gICAgICAgICAgICAgICAgdG9rZW5PYmplY3QgPSBAY3JlYXRlTGlzdFRva2VuKEdhbWVNYW5hZ2VyLnZhcmlhYmxlU3RvcmUucGVyc2lzdGVudExpc3RzW2xpc3RJZGVudGlmaWVyWzBdXVtsaXN0SWRlbnRpZmllclsxXS0xXSB8fCBbXSwgdmFsdWVzKVxuICAgICAgICAgICAgd2hlbiBcIkxOXCIgXG4gICAgICAgICAgICAgICAgdmFsdWVzID0gaWYgaXNOYU4odmFsdWUpIHRoZW4gdmFsdWUuc3BsaXQoXCIsXCIpIGVsc2UgW3ZhbHVlXVxuICAgICAgICAgICAgICAgIGlmIHZhbHVlc1sxXSBcbiAgICAgICAgICAgICAgICAgICAgdG9rZW5PYmplY3QgPSBzcHJpbnRmKFwiJVwiK3ZhbHVlc1sxXStcImRcIiwgKEdhbWVNYW5hZ2VyLnZhcmlhYmxlU3RvcmUubnVtYmVyVmFsdWVPZih7IHNjb3BlOiAwLCBpbmRleDogdmFsdWUtMX0pIHx8IDApKVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgdG9rZW5PYmplY3QgPSAoR2FtZU1hbmFnZXIudmFyaWFibGVTdG9yZS5udW1iZXJWYWx1ZU9mKHsgc2NvcGU6IDAsIGluZGV4OiB2YWx1ZS0xfSkgfHwgMCkudG9TdHJpbmcoKVxuICAgICAgICAgICAgd2hlbiBcIkxUXCIgXG4gICAgICAgICAgICAgICAgdG9rZW5PYmplY3QgPSAoR2FtZU1hbmFnZXIudmFyaWFibGVTdG9yZS5zdHJpbmdWYWx1ZU9mKHsgc2NvcGU6IDAsIGluZGV4OiB2YWx1ZS0xfSkgfHwgXCJcIikudG9TdHJpbmcoKVxuICAgICAgICAgICAgICAgIHRva2VuT2JqZWN0ID0gdG9rZW5PYmplY3Quc3BsaXQoL1xceyhbQS16XSspOihbXlxce1xcfV0rKVxcfXwoXFxuKS9nbSlcbiAgICAgICAgICAgICAgICBpZiB0b2tlbk9iamVjdC5sZW5ndGggPiAxXG4gICAgICAgICAgICAgICAgICAgIHRva2VuT2JqZWN0LnBvcCgpXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICB0b2tlbk9iamVjdCA9IHRva2VuT2JqZWN0WzBdID8gXCJcIlxuICAgICAgICAgICAgd2hlbiBcIkxTXCJcbiAgICAgICAgICAgICAgICB0b2tlbk9iamVjdCA9IChHYW1lTWFuYWdlci52YXJpYWJsZVN0b3JlLmJvb2xlYW5WYWx1ZU9mKHsgc2NvcGU6IDAsIGluZGV4OiB2YWx1ZS0xfSkgfHwgZmFsc2UpLnRvU3RyaW5nKClcbiAgICAgICAgICAgIHdoZW4gXCJMTFwiXG4gICAgICAgICAgICAgICAgdmFsdWVzID0gdmFsdWUuc3BsaXQoXCIsXCIpXG4gICAgICAgICAgICAgICAgdG9rZW5PYmplY3QgPSBAY3JlYXRlTGlzdFRva2VuKEdhbWVNYW5hZ2VyLnZhcmlhYmxlU3RvcmUubGlzdFZhbHVlT2YoeyBzY29wZTogMCwgaW5kZXg6IHZhbHVlc1swXS0xfSkgfHwgW10sIHZhbHVlcylcbiAgICAgICAgICAgIHdoZW4gXCJOXCIgXG4gICAgICAgICAgICAgICAgdG9rZW5PYmplY3QgPSAoaWYgUmVjb3JkTWFuYWdlci5jaGFyYWN0ZXJzW3ZhbHVlXT8gdGhlbiBsY3MoUmVjb3JkTWFuYWdlci5jaGFyYWN0ZXJzW3ZhbHVlXS5uYW1lKSBlbHNlIFwiXCIpXG4gICAgICAgICAgICB3aGVuIFwiUlRcIlxuICAgICAgICAgICAgICAgIHBhaXIgPSB2YWx1ZS5zcGxpdChcIi9cIilcbiAgICAgICAgICAgICAgICB0b2tlbk9iamVjdCA9IHsgY29kZTogY29kZSwgcnRTdHlsZUlkOiBwYWlyWzJdID8gMCwgcmI6IHBhaXJbMF0sIHJ0OiBwYWlyWzFdLCByYlNpemU6IHsgd2lkdGg6IDAsIGhlaWdodDogMCB9LCBydFNpemU6IHsgd2lkdGg6IDAsIGhlaWdodDogMCB9IH1cbiAgICAgICAgICAgIHdoZW4gXCJNXCJcbiAgICAgICAgICAgICAgICBtYWNybyA9IFJlY29yZE1hbmFnZXIuc3lzdGVtLnRleHRNYWNyb3MuZmlyc3QgKG0pIC0+IG0ubmFtZSA9PSB2YWx1ZVxuICAgICAgICAgICAgICAgIGlmIG1hY3JvXG4gICAgICAgICAgICAgICAgICAgIGlmIG1hY3JvLnR5cGUgPT0gMCAjIFRleHQgKyBDb2Rlc1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9rZW5PYmplY3QgPSBtYWNyby5jb250ZW50LnNwbGl0KC9cXHsoW0Etel0rKTooW15cXHtcXH1dKylcXH18KFxcbikvZ20pXG4gICAgICAgICAgICAgICAgICAgICAgICB0b2tlbk9iamVjdC5wb3AoKVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIG1hY3JvLnR5cGUgPT0gMSAjIFBsYWNlaG9sZGVyIFNjcmlwdCBNYWNyb1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgIW1hY3JvLmNvbnRlbnRGdW5jXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFjcm8uY29udGVudEZ1bmMgPSBldmFsKFwiKGZ1bmN0aW9uKG9iamVjdCwgdmFsdWUpeyAje21hY3JvLmNvbnRlbnR9IH0pXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICB0b2tlbk9iamVjdCA9IG1hY3JvLmNvbnRlbnRGdW5jKEBvYmplY3QsIHZhbHVlKVxuICAgICAgICAgICAgICAgICAgICAgICAgdG9rZW5PYmplY3QgPSB0b2tlbk9iamVjdC5zcGxpdCgvXFx7KFtBLXpdKyk6KFteXFx7XFx9XSspXFx9fChcXG4pL2dtKVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgdG9rZW5PYmplY3QubGVuZ3RoID4gMVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRva2VuT2JqZWN0LnBvcCgpXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgIyBTY3JpcHQgTWFjcm9cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICFtYWNyby5jb250ZW50RnVuY1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hY3JvLmNvbnRlbnRGdW5jID0gZXZhbChcIihmdW5jdGlvbihvYmplY3QpeyAje21hY3JvLmNvbnRlbnR9IH0pXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICB0b2tlbk9iamVjdCA9IG5ldyBncy5SZW5kZXJlclRva2VuKFwiWFwiLCBtYWNyby5jb250ZW50RnVuYylcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHRva2VuT2JqZWN0ID0gXCJcIlxuICAgICAgICAgICAgZWxzZSAgICBcbiAgICAgICAgICAgICAgICB0b2tlbk9iamVjdCA9IG5ldyBncy5SZW5kZXJlclRva2VuKGNvZGUsIHZhbHVlKVxuICAgICAgICAgICAgICAgIFxuICAgICAgICByZXR1cm4gdG9rZW5PYmplY3RcbiAgICBcbiAgICBcbiAgICAjIyMqXG4gICAgKiA8cD5HZXRzIHRoZSBjb3JyZWN0IGZvbnQgZm9yIHRoZSBzcGVjaWZpZWQgcnVieS10ZXh0IHRva2VuLjwvcD4gXG4gICAgKlxuICAgICogQHBhcmFtIHtPYmplY3R9IHRva2VuIC0gQSBydWJ5LXRleHQgdG9rZW4uXG4gICAgKiBAcmV0dXJuIHtncy5Gb250fSBUaGUgZm9udCBmb3IgdGhlIHJ1YnktdGV4dCB3aGljaCBpcyBzaG93biBhYm92ZSB0aGUgb3JpZ2luYWwgdGV4dC5cbiAgICAqIEBtZXRob2QgZ2V0UnVieVRleHRGb250XG4gICAgIyMjICAgXG4gICAgZ2V0UnVieVRleHRGb250OiAodG9rZW4pIC0+XG4gICAgICAgIHN0eWxlID0gbnVsbFxuICAgICAgICBmb250ID0gbnVsbFxuICAgICAgICAgICAgICAgIFxuICAgICAgICBpZiB0b2tlbi5ydFN0eWxlSWRcbiAgICAgICAgICAgIHN0eWxlID0gdWkuVUlNYW5hZ2VyLnN0eWxlc1tcInJ1YnlUZXh0LVwiK3Rva2VuLnJ0U3R5bGVJZF1cbiAgICAgICAgXG4gICAgICAgIGlmICFzdHlsZVxuICAgICAgICAgICAgc3R5bGUgPSB1aS5VSU1hbmFnZXIuc3R5bGVzW1wicnVieVRleHRcIl1cbiAgICAgICAgICAgIFxuICAgICAgICBmb250ID0gc3R5bGU/LmZvbnQgPyBAZm9udFxuICAgICAgICBmb250LnNpemUgPSBmb250LnNpemUgfHwgQGZvbnQuc2l6ZSAvIDJcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBmb250XG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIDxwPk1lYXN1cmVzIGEgY29udHJvbC10b2tlbi4gSWYgYSB0b2tlbiBwcm9kdWNlcyBhIHZpc3VhbCByZXN1bHQgbGlrZSBkaXNwbGF5aW5nIGFuIGljb24gdGhlbiBpdCBtdXN0IHJldHVybiB0aGUgc2l6ZSB0YWtlbiBieVxuICAgICogdGhlIHZpc3VhbCByZXN1bHQuIElmIHRoZSB0b2tlbiBoYXMgbm8gdmlzdWFsIHJlc3VsdCwgPGI+bnVsbDwvYj4gbXVzdCBiZSByZXR1cm5lZC4gVGhpcyBtZXRob2QgaXMgY2FsbGVkIGZvciBldmVyeSB0b2tlbiB3aGVuIHRoZSBtZXNzYWdlIGlzIGluaXRpYWxpemVkLjwvcD4gXG4gICAgKlxuICAgICogQHBhcmFtIHtPYmplY3R9IHRva2VuIC0gQSBjb250cm9sLXRva2VuLlxuICAgICogQHJldHVybiB7Z3MuU2l6ZX0gVGhlIHNpemUgb2YgdGhlIGFyZWEgdGFrZW4gYnkgdGhlIHZpc3VhbCByZXN1bHQgb2YgdGhlIHRva2VuIG9yIDxiPm51bGw8L2I+IGlmIHRoZSB0b2tlbiBoYXMgbm8gdmlzdWFsIHJlc3VsdC5cbiAgICAqIEBtZXRob2QgbWVhc3VyZUNvbnRyb2xUb2tlblxuICAgICogQHByb3RlY3RlZFxuICAgICMjIyAgIFxuICAgIG1lYXN1cmVDb250cm9sVG9rZW46ICh0b2tlbikgLT4gIyBDYW4gYmUgaW1wbGVtZW50ZWQgYnkgZGVyaXZlZCBjbGFzc2VzXG4gICAgICAgIHNpemUgPSBudWxsXG4gICAgICAgIFxuICAgICAgICBzd2l0Y2ggdG9rZW4uY29kZVxuICAgICAgICAgICAgd2hlbiBcIkFcIiAjIEFuaW1hdGlvblxuICAgICAgICAgICAgICAgIGFuaW1hdGlvbiA9IFJlY29yZE1hbmFnZXIuYW5pbWF0aW9uc1tNYXRoLm1heCh0b2tlbi52YWx1ZS0xLCAwKV1cbiAgICAgICAgICAgICAgICBpZiBhbmltYXRpb24/LmdyYXBoaWMubmFtZT9cbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VCaXRtYXAgPSBSZXNvdXJjZU1hbmFnZXIuZ2V0Qml0bWFwKFwiR3JhcGhpY3MvUGljdHVyZXMvI3thbmltYXRpb24uZ3JhcGhpYy5uYW1lfVwiKVxuICAgICAgICAgICAgICAgICAgICBpZiBpbWFnZUJpdG1hcD9cbiAgICAgICAgICAgICAgICAgICAgICAgIHNpemUgPSB3aWR0aDogTWF0aC5yb3VuZChpbWFnZUJpdG1hcC53aWR0aCAvIGFuaW1hdGlvbi5mcmFtZXNYKSwgaGVpZ2h0OiBNYXRoLnJvdW5kKGltYWdlQml0bWFwLmhlaWdodCAvIGFuaW1hdGlvbi5mcmFtZXNZKVxuICAgICAgICAgICAgd2hlbiBcIlJUXCIgIyBSdWJ5IFRleHRcbiAgICAgICAgICAgICAgICBmb250ID0gQGdldFJ1YnlUZXh0Rm9udCh0b2tlbilcbiAgICAgICAgICAgICAgICBmcyA9IGZvbnQuc2l6ZVxuICAgICAgICAgICAgICAgIGZvbnQuc2l6ZSA9IGZvbnQuc2l6ZSB8fCBAZm9udC5zaXplIC8gMlxuICAgICAgICAgICAgICAgIHRva2VuLnJiU2l6ZSA9IEBmb250Lm1lYXN1cmVUZXh0UGxhaW4odG9rZW4ucmIpXG4gICAgICAgICAgICAgICAgdG9rZW4ucnRTaXplID0gZm9udC5tZWFzdXJlVGV4dFBsYWluKHRva2VuLnJ0KVxuICAgICAgICAgICAgICAgIGZvbnQuc2l6ZSA9IGZzXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgc2l6ZSA9IHdpZHRoOiBNYXRoLm1heCh0b2tlbi5yYlNpemUud2lkdGgsIHRva2VuLnJ0U2l6ZS53aWR0aCksIGhlaWdodDogdG9rZW4ucmJTaXplLmhlaWdodCArIHRva2VuLnJ0U2l6ZS5oZWlnaHRcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgcmV0dXJuIHNpemVcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogPHA+RHJhd3MgdGhlIHZpc3VhbCByZXN1bHQgb2YgYSB0b2tlbiwgbGlrZSBhbiBpY29uIGZvciBleGFtcGxlLCB0byB0aGUgc3BlY2lmaWVkIGJpdG1hcC4gVGhpcyBtZXRob2QgaXMgY2FsbGVkIGZvciBldmVyeSB0b2tlbiB3aGlsZSB0aGUgdGV4dCBpcyByZW5kZXJlZC48L3A+IFxuICAgICpcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSB0b2tlbiAtIEEgY29udHJvbC10b2tlbi5cbiAgICAqIEBwYXJhbSB7Z3MuQml0bWFwfSBiaXRtYXAgLSBUaGUgYml0bWFwIHVzZWQgZm9yIHRoZSBjdXJyZW50IHRleHQtbGluZS4gQ2FuIGJlIHVzZWQgdG8gZHJhdyBzb21ldGhpbmcgb24gaXQgbGlrZSBhbiBpY29uLCBldGMuXG4gICAgKiBAcGFyYW0ge251bWJlcn0gb2Zmc2V0IC0gQW4geC1vZmZzZXQgZm9yIHRoZSBkcmF3LXJvdXRpbmUuXG4gICAgKiBAbWV0aG9kIGRyYXdDb250cm9sVG9rZW5cbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyNcbiAgICBkcmF3Q29udHJvbFRva2VuOiAodG9rZW4sIGJpdG1hcCwgb2Zmc2V0KSAtPlxuICAgICAgICBzd2l0Y2ggdG9rZW4uY29kZVxuICAgICAgICAgICAgd2hlbiBcIkFcIiAjIEFuaW1hdGlvblxuICAgICAgICAgICAgICAgIGFuaW1hdGlvbiA9IFJlY29yZE1hbmFnZXIuYW5pbWF0aW9uc1tNYXRoLm1heCh0b2tlbi52YWx1ZS0xLCAwKV1cbiAgICAgICAgICAgICAgICBpZiBhbmltYXRpb24/LmdyYXBoaWMubmFtZT9cbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VCaXRtYXAgPSBSZXNvdXJjZU1hbmFnZXIuZ2V0Qml0bWFwKFwiR3JhcGhpY3MvUGljdHVyZXMvI3thbmltYXRpb24uZ3JhcGhpYy5uYW1lfVwiKVxuICAgICAgICAgICAgICAgICAgICBpZiBpbWFnZUJpdG1hcD9cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlY3QgPSBuZXcgZ3MuUmVjdCgwLCAwLCBNYXRoLnJvdW5kKGltYWdlQml0bWFwLndpZHRoIC8gYW5pbWF0aW9uLmZyYW1lc1gpLCBNYXRoLnJvdW5kKGltYWdlQml0bWFwLmhlaWdodCAvIGFuaW1hdGlvbi5mcmFtZXNZKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGJpdG1hcC5ibHQob2Zmc2V0LCBAY3VycmVudFksIGltYWdlQml0bWFwLCByZWN0KVxuICAgICAgICAgICAgd2hlbiBcIlJUXCIgXG4gICAgICAgICAgICAgICAgc3R5bGUgPSBudWxsXG4gICAgICAgICAgICAgICAgaWYgdG9rZW4ucnRTdHlsZUlkXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlID0gdWkuVUlNYW5hZ2VyLnN0eWxlc1tcInJ1YnlUZXh0LVwiK3Rva2VuLnJ0U3R5bGVJZF1cbiAgICAgICAgICAgICAgICBpZiAhc3R5bGVcbiAgICAgICAgICAgICAgICAgICAgc3R5bGUgPSB1aS5VSU1hbmFnZXIuc3R5bGVzW1wicnVieVRleHRcIl1cbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgZm9udCA9IHN0eWxlPy5mb250ID8gQGZvbnRcbiAgICAgICAgICAgICAgICBmcyA9IGZvbnQuc2l6ZVxuICAgICAgICAgICAgICAgIGZvbnQuc2l6ZSA9IGZvbnQuc2l6ZSB8fCBAZm9udC5zaXplIC8gMlxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIHN0eWxlIGFuZCAhc3R5bGUuZGVzY3JpcHRvci5mb250Py5jb2xvclxuICAgICAgICAgICAgICAgICAgICBmb250LmNvbG9yLnNldChAZm9udC5jb2xvcilcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgYml0bWFwLmZvbnQgPSBmb250XG4gICAgICAgICAgICAgICAgYml0bWFwLmRyYXdUZXh0KG9mZnNldCwgYml0bWFwLmZvbnQuZGVzY2VudCwgTWF0aC5tYXgodG9rZW4ucmJTaXplLndpZHRoLCB0b2tlbi5ydFNpemUud2lkdGgpLCBiaXRtYXAuaGVpZ2h0LCB0b2tlbi5ydCwgMSwgMClcbiAgICAgICAgICAgICAgICBiaXRtYXAuZm9udCA9IEBmb250XG4gICAgICAgICAgICAgICAgZm9udC5zaXplID0gZnNcbiAgICAgICAgICAgICAgICBiaXRtYXAuZHJhd1RleHQob2Zmc2V0LCB0b2tlbi5ydFNpemUuaGVpZ2h0LCBNYXRoLm1heCh0b2tlbi5yYlNpemUud2lkdGgsIHRva2VuLnJ0U2l6ZS53aWR0aCksIGJpdG1hcC5oZWlnaHQsIHRva2VuLnJiLCAxLCAwKVxuICAgIFxuICAgIFxuICAgICMjIypcbiAgICAqIFNwbGl0cyB1cCB0aGUgc3BlY2lmaWVkIHRva2VuIHVzaW5nIGEgamFwYW5lc2Ugd29yZC13cmFwIHRlY2huaXF1ZS5cbiAgICAqIFxuICAgICogQG1ldGhvZCB3b3JkV3JhcEphcGFuZXNlXG4gICAgKiBAcGFyYW0ge09iamVjdH0gdG9rZW4gLSBUaGUgdG9rZW4gdG8gc3BsaXQgdXAuXG4gICAgKiBAcGFyYW0ge2dzLlJlbmRlcmVyVGV4dExpbmV9IGxpbmUgLSBUaGUgY3VycmVudCBsaW5lLlxuICAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoIC0gVGhlIHdpZHRoIG9mIHRoZSBjdXJyZW50IGxpbmUuXG4gICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0IC0gVGhlIGhlaWdodCBvZiB0aGUgY3VycmVudCBsaW5lLlxuICAgICogQHBhcmFtIHtncy5SZW5kZXJlclRleHRMaW5lW119IC0gQW4gYXJyYXkgb2YgbGluZXMuIElmIHRoZSB0b2tlbiBpcyBzcGxpdCB1cCBpbnRvIG11bHRpcGxlIGxpbmVzLCBhbGwgbmV3XG4gICAgKiBsaW5lcyBhcmUgYWRkZWQgdG8gdGhpcyByZXN1bHQgYXJyYXkuXG4gICAgKiBAcmV0dXJuIHtncy5SZW5kZXJlclRleHRMaW5lfSBUaGUgY3VycmVudCBsaW5lLCB0aGF0IG1heSBiZSB0aGUgc2FtZSBhcyB0aGUgPGI+bGluZTwvYj4gcGFyYW1ldGVycyBidXQgaWYgbmV3IGxpbmVzXG4gICAgKiBhcmUgY3JlYXRlZCBpdCBoYXMgdG8gYmUgdGhlIGxhc3QgbmV3IGNyZWF0ZWQgbGluZS5cbiAgICAjIyMgICAgIFxuICAgIHdvcmRXcmFwSmFwYW5lc2U6ICh0b2tlbiwgbGluZSwgd2lkdGgsIGhlaWdodCwgcmVzdWx0KSAtPlxuICAgICAgICBzdGFydE9mTGluZSA9ICfigJTigKbigKXjgLPjgLTjgLXjgIIu44O744CBOjssID8h4oC84oGH4oGI4oGJ4oCQ44Kg4oCT44CcKV3vvZ3jgJXjgInjgIvjgI3jgI/jgJHjgJnjgJfjgJ/igJlcIu+9oMK744O944O+44O844Kh44Kj44Kl44Kn44Kp44OD44Oj44Ol44On44Ou44O144O244GB44GD44GF44GH44GJ44Gj44KD44KF44KH44KO44KV44KW44ew44ex44ey44ez44e044e144e244e344e444e544e644e744e844e944e+44e/44CF44C7J1xuICAgICAgICBlbmRPZkxpbmUgPSAnKFvvvZvjgJTjgIjjgIrjgIzjgI7jgJDjgJjjgJbjgJ3igJhcIu+9n8KrJ1xuICAgICAgICBub1NwbGl0ID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg577yQ77yR77yS77yT77yU77yV77yW77yX77yY77yZ4oCU4oCm4oCl44Cz44C044C1J1xuICAgICAgICBkZXNjZW50ID0gQGZvbnQuZGVzY2VudFxuICAgICAgICBzaXplID0gQGZvbnQubWVhc3VyZVRleHRQbGFpbih0b2tlbilcbiAgICAgICAgZGVwdGggPSA4XG4gICAgICAgIGRlcHRoTGV2ZWwgPSAwXG4gICAgICAgIGkgPSAwXG4gICAgICAgIGogPSAwXG4gICAgICAgIGxhc3RDaGFyYWN0ZXJJbmRleCA9IDBcbiAgICAgICAgXG4gICAgICAgIGlmIHNpemUud2lkdGggPiBAb2JqZWN0LmRzdFJlY3Qud2lkdGgtQHNwYWNlU2l6ZS53aWR0aCozLUBwYWRkaW5nKjJcbiAgICAgICAgICAgIHdoaWxlIGkgPCB0b2tlbi5sZW5ndGhcbiAgICAgICAgICAgICAgICBjaCA9IHRva2VuW2ldXG4gICAgICAgICAgICAgICAgc2l6ZSA9IEBmb250Lm1lYXN1cmVUZXh0UGxhaW4oY2gpXG4gICAgICAgICAgICAgICAgd2lkdGggKz0gc2l6ZS53aWR0aFxuICAgICAgICAgICAgICAgIG1vdmVkID0gbm9cbiAgICAgICAgICAgICAgICBpZiB3aWR0aCA+IEBvYmplY3QuZHN0UmVjdC53aWR0aCAtIEBwYWRkaW5nKjJcbiAgICAgICAgICAgICAgICAgICAgZGVwdGhMZXZlbCA9IDBcbiAgICAgICAgICAgICAgICAgICAgaiA9IGlcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGxvb3BcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vdmVkID0gbm9cbiAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlIGogPiAwIGFuZCBzdGFydE9mTGluZS5pbmRleE9mKHRva2VuW2pdKSAhPSAtMVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGotLVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vdmVkID0geWVzXG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlIGogPiAwIGFuZCBlbmRPZkxpbmUuaW5kZXhPZih0b2tlbltqLTFdKSAhPSAtMVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGotLVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vdmVkID0geWVzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSBqID4gMCBhbmQgbm9TcGxpdC5pbmRleE9mKHRva2VuW2otMV0pICE9IC0xXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgai0tXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbW92ZWQgPSB5ZXNcbiAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBqID09IDAgYW5kIG1vdmVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpID0galxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVwdGhMZXZlbCsrXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhayBpZiBkZXB0aExldmVsID49IGRlcHRoIG9yICFtb3ZlZFxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGxpbmUuY29udGVudC5wdXNoKG5ldyBncy5SZW5kZXJlclRva2VuKG51bGwsIHRva2VuLnN1YnN0cmluZyhsYXN0Q2hhcmFjdGVySW5kZXgsIGkpLCBAZm9udCkpXG4gICAgICAgICAgICAgICAgICAgIGxhc3RDaGFyYWN0ZXJJbmRleCA9IGlcbiAgICAgICAgICAgICAgICAgICAgbGluZS5oZWlnaHQgPSBNYXRoLm1heChoZWlnaHQsIEBmb250LmxpbmVIZWlnaHQpXG4gICAgICAgICAgICAgICAgICAgIGxpbmUud2lkdGggPSB3aWR0aCAtIHNpemUud2lkdGhcbiAgICAgICAgICAgICAgICAgICAgbGluZS5kZXNjZW50ID0gZGVzY2VudFxuICAgICAgICAgICAgICAgICAgICBkZXNjZW50ID0gQGZvbnQuZGVzY2VudFxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQgPSBzaXplLmhlaWdodFxuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChsaW5lKVxuICAgICAgICAgICAgICAgICAgICBsaW5lID0gbmV3IGdzLlJlbmRlcmVyVGV4dExpbmUoKVxuICAgICAgICAgICAgICAgICAgICB3aWR0aCA9IHdpZHRoIC0gKHdpZHRoIC0gc2l6ZS53aWR0aClcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpKytcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgbGluZS5jb250ZW50LnB1c2gobmV3IGdzLlJlbmRlcmVyVG9rZW4obnVsbCwgdG9rZW4sIEBmb250KSlcbiAgICAgICAgICAgIGxpbmUuaGVpZ2h0ID0gTWF0aC5tYXgoaGVpZ2h0LCBAZm9udC5saW5lSGVpZ2h0KVxuICAgICAgICAgICAgbGluZS53aWR0aCA9IHdpZHRoICsgc2l6ZS53aWR0aFxuICAgICAgICAgICAgbGluZS5kZXNjZW50ID0gZGVzY2VudFxuICAgICAgICAgICAgXG4gICAgICAgIGhlaWdodCA9IE1hdGgubWF4KGhlaWdodCwgQGZvbnQubGluZUhlaWdodCkgICBcbiAgICAgICAgICAgIFxuICAgICAgICBpZiBsYXN0Q2hhcmFjdGVySW5kZXggIT0gaVxuICAgICAgICAgICAgbGluZS5jb250ZW50LnB1c2gobmV3IGdzLlJlbmRlcmVyVG9rZW4obnVsbCwgdG9rZW4uc3Vic3RyaW5nKGxhc3RDaGFyYWN0ZXJJbmRleCwgaSksIEBmb250KSlcbiAgICAgICAgICAgIGxpbmUud2lkdGggPSB3aWR0aFxuICAgICAgICAgICAgbGluZS5oZWlnaHQgPSBNYXRoLm1heChoZWlnaHQsIGxpbmUuaGVpZ2h0KVxuICAgICAgICAgICAgbGluZS5kZXNjZW50ID0gZGVzY2VudFxuICAgICAgICAgICAgXG4gICAgICAgIHJldHVybiBsaW5lXG4gICAgICAgIFxuICAgIFxuICAgICMjIypcbiAgICAqIERvZXMgbm90IHdvcmQtd3JhcHBpbmcgYXQgYWxsLiBJdCBqdXN0IGFkZHMgdGhlIHRleHQgdG9rZW4gdG8gdGhlIGxpbmUgYXMgaXMuXG4gICAgKiBcbiAgICAqIEBtZXRob2Qgd29yZFdyYXBOb25lXG4gICAgKiBAcGFyYW0ge09iamVjdH0gdG9rZW4gLSBUaGUgdG9rZW4gdG8gc3BsaXQgdXAuXG4gICAgKiBAcGFyYW0ge2dzLlJlbmRlcmVyVGV4dExpbmV9IGxpbmUgLSBUaGUgY3VycmVudCBsaW5lLlxuICAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoIC0gVGhlIHdpZHRoIG9mIHRoZSBjdXJyZW50IGxpbmUuXG4gICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0IC0gVGhlIGhlaWdodCBvZiB0aGUgY3VycmVudCBsaW5lLlxuICAgICogQHBhcmFtIHtncy5SZW5kZXJlclRleHRMaW5lW119IC0gQW4gYXJyYXkgb2YgbGluZXMuIElmIHRoZSB0b2tlbiBpcyBzcGxpdCB1cCBpbnRvIG11bHRpcGxlIGxpbmVzLCBhbGwgbmV3XG4gICAgKiBsaW5lcyBhcmUgYWRkZWQgdG8gdGhpcyByZXN1bHQgYXJyYXkuXG4gICAgKiBAcmV0dXJuIHtncy5SZW5kZXJlclRleHRMaW5lfSBUaGUgY3VycmVudCBsaW5lLCB0aGF0IG1heSBiZSB0aGUgc2FtZSBhcyB0aGUgPGI+bGluZTwvYj4gcGFyYW1ldGVycyBidXQgaWYgbmV3IGxpbmVzXG4gICAgKiBhcmUgY3JlYXRlZCBpdCBoYXMgdG8gYmUgdGhlIGxhc3QgbmV3IGNyZWF0ZWQgbGluZS5cbiAgICAjIyMgIFxuICAgIHdvcmRXcmFwTm9uZTogKHRva2VuLCBsaW5lLCB3aWR0aCwgaGVpZ2h0LCByZXN1bHQpIC0+XG4gICAgICAgIHNpemUgPSBAZm9udC5tZWFzdXJlVGV4dFBsYWluKHRva2VuKVxuICAgICAgICBoZWlnaHQgPSBNYXRoLm1heChzaXplLmhlaWdodCwgaGVpZ2h0IHx8IEBmb250LmxpbmVIZWlnaHQpICAgXG4gICAgICAgIFxuICAgICAgICBpZiB0b2tlbi5sZW5ndGggPiAwICAgIFxuICAgICAgICAgICAgbGluZS53aWR0aCArPSBzaXplLndpZHRoXG4gICAgICAgICAgICBsaW5lLmhlaWdodCA9IE1hdGgubWF4KGhlaWdodCwgbGluZS5oZWlnaHQpXG4gICAgICAgICAgICBsaW5lLmRlc2NlbnQgPSBAZm9udC5kZXNjZW50XG4gICAgICAgICAgICBsaW5lLmNvbnRlbnQucHVzaChuZXcgZ3MuUmVuZGVyZXJUb2tlbihudWxsLCB0b2tlbikpXG4gICAgICAgICAgICBcbiAgICAgICAgcmV0dXJuIGxpbmVcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogU3BsaXRzIHVwIHRoZSBzcGVjaWZpZWQgdG9rZW4gdXNpbmcgYSBzcGFjZS1iYXNlZCB3b3JkLXdyYXAgdGVjaG5pcXVlLlxuICAgICogXG4gICAgKiBAbWV0aG9kIHdvcmRXcmFwU3BhY2VCYXNlZFxuICAgICogQHBhcmFtIHtPYmplY3R9IHRva2VuIC0gVGhlIHRva2VuIHRvIHNwbGl0IHVwLlxuICAgICogQHBhcmFtIHtncy5SZW5kZXJlclRleHRMaW5lfSBsaW5lIC0gVGhlIGN1cnJlbnQgbGluZS5cbiAgICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCAtIFRoZSB3aWR0aCBvZiB0aGUgY3VycmVudCBsaW5lLlxuICAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodCAtIFRoZSBoZWlnaHQgb2YgdGhlIGN1cnJlbnQgbGluZS5cbiAgICAqIEBwYXJhbSB7Z3MuUmVuZGVyZXJUZXh0TGluZVtdfSAtIEFuIGFycmF5IG9mIGxpbmVzLiBJZiB0aGUgdG9rZW4gaXMgc3BsaXQgdXAgaW50byBtdWx0aXBsZSBsaW5lcywgYWxsIG5ld1xuICAgICogbGluZXMgYXJlIGFkZGVkIHRvIHRoaXMgcmVzdWx0IGFycmF5LlxuICAgICogQHJldHVybiB7Z3MuUmVuZGVyZXJUZXh0TGluZX0gVGhlIGN1cnJlbnQgbGluZSwgdGhhdCBtYXkgYmUgdGhlIHNhbWUgYXMgdGhlIDxiPmxpbmU8L2I+IHBhcmFtZXRlcnMgYnV0IGlmIG5ldyBsaW5lc1xuICAgICogYXJlIGNyZWF0ZWQgaXQgaGFzIHRvIGJlIHRoZSBsYXN0IG5ldyBjcmVhdGVkIGxpbmUuXG4gICAgIyMjICAgIFxuICAgIHdvcmRXcmFwU3BhY2VCYXNlZDogKHRva2VuLCBsaW5lLCB3aWR0aCwgaGVpZ2h0LCByZXN1bHQpIC0+XG4gICAgICAgIGN1cnJlbnRXb3JkcyA9IFtdXG4gICAgICAgIHdvcmRzID0gdG9rZW4uc3BsaXQoXCIgXCIpXG4gICAgICAgIGRlc2NlbnQgPSBAZm9udC5kZXNjZW50XG4gICAgICAgIEBzcGFjZVNpemUgPSBAZm9udC5tZWFzdXJlVGV4dFBsYWluKFwiIFwiKVxuICAgICAgICBcbiAgICAgICAgZm9yIHdvcmQsIGkgaW4gd29yZHNcbiAgICAgICAgICAgIHNpemUgPSBAZm9udC5tZWFzdXJlVGV4dFBsYWluKHdvcmQpXG4gICAgICAgICAgICB3aWR0aCArPSBzaXplLndpZHRoICsgQHNwYWNlU2l6ZS53aWR0aFxuICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIHdpZHRoID4gQG9iamVjdC5kc3RSZWN0LndpZHRoIC0gQHBhZGRpbmcqMlxuICAgICAgICAgICAgICAgIHRva2VuID0gbmV3IGdzLlJlbmRlcmVyVG9rZW4obnVsbCwgY3VycmVudFdvcmRzLmpvaW4oXCIgXCIpKVxuICAgICAgICAgICAgICAgIHRva2VuLnRha2VGb3JtYXQoQGZvbnQpXG4gICAgICAgICAgICAgICAgbGluZS5jb250ZW50LnB1c2godG9rZW4pXG4gICAgICAgICAgICAgICAgbGluZS5oZWlnaHQgPSBNYXRoLm1heChoZWlnaHQsIGxpbmUuaGVpZ2h0KVxuICAgICAgICAgICAgICAgIGxpbmUud2lkdGggPSB3aWR0aCAtIHNpemUud2lkdGhcbiAgICAgICAgICAgICAgICBsaW5lLmRlc2NlbnQgPSBNYXRoLm1heChsaW5lLmRlc2NlbnQsIGRlc2NlbnQpXG4gICAgICAgICAgICAgICAgZGVzY2VudCA9IE1hdGgubWF4KGRlc2NlbnQsIEBmb250LmRlc2NlbnQpXG4gICAgICAgICAgICAgICAgaGVpZ2h0ID0gc2l6ZS5oZWlnaHRcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChsaW5lKVxuICAgICAgICAgICAgICAgIGxpbmUgPSBuZXcgZ3MuUmVuZGVyZXJUZXh0TGluZSgpXG4gICAgICAgICAgICAgICAgY3VycmVudFdvcmRzID0gW3dvcmRdXG4gICAgICAgICAgICAgICAgd2lkdGggPSB3aWR0aCAtICh3aWR0aCAtIHNpemUud2lkdGgpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgY3VycmVudFdvcmRzLnB1c2god29yZClcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIGhlaWdodCA9IE1hdGgubWF4KGhlaWdodCwgQGZvbnQubGluZUhlaWdodCkgICBcbiAgICAgICAgICAgIFxuICAgICAgICBpZiBjdXJyZW50V29yZHMubGVuZ3RoID4gMFxuICAgICAgICAgICAgdG9rZW4gPSBuZXcgZ3MuUmVuZGVyZXJUb2tlbihudWxsLCBjdXJyZW50V29yZHMuam9pbihcIiBcIikpXG4gICAgICAgICAgICB0b2tlbi50YWtlRm9ybWF0KEBmb250KVxuICAgICAgICAgICAgbGluZS5jb250ZW50LnB1c2godG9rZW4pXG4gICAgICAgICAgICBsaW5lLndpZHRoID0gd2lkdGhcbiAgICAgICAgICAgIGxpbmUuaGVpZ2h0ID0gTWF0aC5tYXgoaGVpZ2h0LCBsaW5lLmhlaWdodClcbiAgICAgICAgICAgIGxpbmUuZGVzY2VudCA9IE1hdGgubWF4KGRlc2NlbnQsIGxpbmUuZGVzY2VudClcbiAgICAgICAgICAgIFxuICAgICAgICByZXR1cm4gbGluZVxuICAgIFxuICAgICMjIypcbiAgICAqIFNwbGl0cyB1cCB0aGUgc3BlY2lmaWVkIHRva2VuIHVzaW5nIGEgd29yZC13cmFwIHRlY2huaXF1ZS4gVGhlIGtpbmQgb2Ygd29yZC13cmFwIHRlY2huaXF1ZVxuICAgICogZGVwZW5kcyBvbiB0aGUgc2VsZWN0ZWQgbGFuZ3VhZ2UuIFlvdSBjYW4gb3ZlcndyaXRlIHRoaXMgbWV0aG9kIGluIGRlcml2ZWQgY2xhc3NlcyB0byBpbXBsZW1lbnQgeW91clxuICAgICogb3duIGN1c3RvbSB3b3JkLXdyYXAgdGVjaG5pcXVlcy5cbiAgICAqIFxuICAgICogQG1ldGhvZCBleGVjdXRlV29yZFdyYXBcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSB0b2tlbiAtIFRoZSB0b2tlbiB0byBzcGxpdCB1cC5cbiAgICAqIEBwYXJhbSB7Z3MuUmVuZGVyZXJUZXh0TGluZX0gbGluZSAtIFRoZSBjdXJyZW50IGxpbmUuXG4gICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGggLSBUaGUgd2lkdGggb2YgdGhlIGN1cnJlbnQgbGluZS5cbiAgICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHQgLSBUaGUgaGVpZ2h0IG9mIHRoZSBjdXJyZW50IGxpbmUuXG4gICAgKiBAcGFyYW0ge2dzLlJlbmRlcmVyVGV4dExpbmVbXX0gLSBBbiBhcnJheSBvZiBsaW5lcy4gSWYgdGhlIHRva2VuIGlzIHNwbGl0IHVwIGludG8gbXVsdGlwbGUgbGluZXMsIGFsbCBuZXdcbiAgICAqIGxpbmVzIGFyZSBhZGRlZCB0byB0aGlzIHJlc3VsdCBhcnJheS5cbiAgICAqIEByZXR1cm4ge2dzLlJlbmRlcmVyVGV4dExpbmV9IFRoZSBjdXJyZW50IGxpbmUsIHRoYXQgbWF5IGJlIHRoZSBzYW1lIGFzIHRoZSA8Yj5saW5lPC9iPiBwYXJhbWV0ZXJzIGJ1dCBpZiBuZXcgbGluZXNcbiAgICAqIGFyZSBjcmVhdGVkIGl0IGhhcyB0byBiZSB0aGUgbGFzdCBuZXcgY3JlYXRlZCBsaW5lLlxuICAgICMjI1xuICAgIGV4ZWN1dGVXb3JkV3JhcDogKHRva2VuLCBsaW5lLCB3aWR0aCwgaGVpZ2h0LCByZXN1bHQsIHdvcmRXcmFwKSAtPlxuICAgICAgICBpZiB3b3JkV3JhcFxuICAgICAgICAgICAgc3dpdGNoIExhbmd1YWdlTWFuYWdlci5sYW5ndWFnZS53b3JkV3JhcFxuICAgICAgICAgICAgICAgIHdoZW4gXCJzcGFjZUJhc2VkXCJcbiAgICAgICAgICAgICAgICAgICAgQHdvcmRXcmFwU3BhY2VCYXNlZCh0b2tlbiwgbGluZSwgd2lkdGgsIGhlaWdodCwgcmVzdWx0KVxuICAgICAgICAgICAgICAgIHdoZW4gXCJqYXBhbmVzZVwiXG4gICAgICAgICAgICAgICAgICAgIEB3b3JkV3JhcEphcGFuZXNlKHRva2VuLCBsaW5lLCB3aWR0aCwgaGVpZ2h0LCByZXN1bHQpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIEB3b3JkV3JhcE5vbmUodG9rZW4sIGxpbmUsIHdpZHRoLCBoZWlnaHQsIHJlc3VsdClcbiAgICAgICAgICAgIFxuICBcbiAgICAjIyMqXG4gICAgKiBDcmVhdGVzIGFuIGEgb2YgbGluZS1vYmplY3RzLiBFYWNoIGxpbmUtb2JqZWN0IGlzIGEgbGlzdCBvZiB0b2tlbi1vYmplY3RzLiBcbiAgICAqIEEgdG9rZW4tb2JqZWN0IGNhbiBiZSBqdXN0IGEgc3RyaW5nIG9yIGFuIG9iamVjdCBjb250YWluaW5nIG1vcmUgaW5mb3JtYXRpb25cbiAgICAqIGFib3V0IGhvdyB0byBwcm9jZXNzIHRoZSB0b2tlbiBhdCBydW50aW1lLlxuICAgICogXG4gICAgKiBBIGxpbmUtb2JqZWN0IGFsc28gY29udGFpbnMgYWRkaXRpb25hbCBpbmZvcm1hdGlvbiBsaWtlIHRoZSB3aWR0aCBhbmQgaGVpZ2h0XG4gICAgKiBvZiB0aGUgbGluZShpbiBwaXhlbHMpLlxuICAgICogXG4gICAgKiBJZiB0aGUgd29yZFdyYXAgcGFyYW0gaXMgc2V0LCBsaW5lLWJyZWFrcyBhcmUgYXV0b21hdGljYWxseSBjcmVhdGVkIGlmIGEgbGluZVxuICAgICogZG9lc24ndCBmaXQgaW50byB0aGUgd2lkdGggb2YgdGhlIGdhbWUgb2JqZWN0J3MgYml0bWFwLlxuICAgICogXG4gICAgKiBAbWV0aG9kIGNhbGN1bGF0ZUxpbmVzXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZSAtIEEgbWVzc2FnZSBjcmVhdGluZyB0aGUgbGluZS1vYmplY3RzIGZvci5cbiAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gd29yZFdyYXAgLSBJZiB3b3JkV3JhcCBpcyBzZXQgdG8gdHJ1ZSwgbGluZS1icmVha3MgYXJlIGF1dG9tYXRpY2FsbHkgY3JlYXRlZC5cbiAgICAqIEBwYXJhbSB7bnVtYmVyfSBbZmlyc3RMaW5lV2lkdGg9MF0gLSBUaGUgY3VycmVudCB3aWR0aCBvZiB0aGUgZmlyc3QgbGluZS5cbiAgICAqIEByZXR1cm4ge0FycmF5fSBBbiBhcnJheSBvZiBsaW5lLW9iamVjdHMuXG4gICAgIyMjXG4gICAgY2FsY3VsYXRlTGluZXM6IChtZXNzYWdlLCB3b3JkV3JhcCwgZmlyc3RMaW5lV2lkdGgpIC0+XG4gICAgICAgIHJlc3VsdCA9IFtdXG4gICAgICAgIGxpbmUgPSBuZXcgZ3MuUmVuZGVyZXJUZXh0TGluZSgpXG4gICAgICAgIHdpZHRoID0gZmlyc3RMaW5lV2lkdGggfHwgMFxuICAgICAgICBoZWlnaHQgPSAwXG4gICAgICAgIGRlc2NlbnQgPSBAZm9udC5kZXNjZW50XG4gICAgICAgIGN1cnJlbnRXb3JkcyA9IFtdXG4gICAgICAgIHNpemUgPSBudWxsXG4gICAgICAgIEBzcGFjZVNpemUgPSBAZm9udC5tZWFzdXJlQ2hhcihcIiBcIilcbiAgICAgICAgQGZvbnRTaXplID0gQGZvbnQuc2l6ZVxuICAgICAgICBcbiAgICAgICAgdG9rZW5zID0gbWVzc2FnZS5zcGxpdCgvXFx7KFtBLXpdKyk6KFteXFx7XFx9XSspXFx9fChcXG4pL2dtKVxuICAgICAgICB0b2tlbiA9IG51bGxcbiAgICAgICAgdCA9IDBcbiAgICAgICAgXG4gICAgICAgIHVuZGVybGluZSA9IEBmb250LnVuZGVybGluZVxuICAgICAgICBzdHJpa2VUaHJvdWdoID0gQGZvbnQuc3RyaWtlVGhyb3VnaFxuICAgICAgICBpdGFsaWMgPSBAZm9udC5pdGFsaWNcbiAgICAgICAgYm9sZCA9IEBmb250LmJvbGRcbiAgICAgICAgc21hbGxDYXBzID0gQGZvbnQuc21hbGxDYXBzXG4gICAgICAgIFxuICAgICAgICB3aGlsZSB0IDwgdG9rZW5zLmxlbmd0aFxuICAgICAgICAgICAgdG9rZW4gPSB0b2tlbnNbdF1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgdCAlIDQgIT0gMFxuICAgICAgICAgICAgICAgIGlmIHRva2VuP1xuICAgICAgICAgICAgICAgICAgICB0b2tlbk9iamVjdCA9IEBjcmVhdGVUb2tlbih0b2tlbiwgdG9rZW5zW3QrMV0pXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBpZiB0b2tlbk9iamVjdC5wdXNoP1xuICAgICAgICAgICAgICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnNwbGljZS5hcHBseSh0b2tlbnMsIFt0KzMsIDBdLmNvbmNhdCh0b2tlbk9iamVjdCkpXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgbm90IHRva2VuT2JqZWN0LmNvZGU/XG4gICAgICAgICAgICAgICAgICAgICAgICB0b2tlbnNbdCszXSA9IHRva2VuT2JqZWN0ICsgdG9rZW5zW3QrM11cbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgc2l6ZSA9IEBtZWFzdXJlQ29udHJvbFRva2VuKHRva2VuT2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgc2l6ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoICs9IHNpemUud2lkdGhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQgPSBNYXRoLm1heChoZWlnaHQsIHNpemUuaGVpZ2h0KVxuICAgICAgICAgICAgICAgICAgICAgICAgI2Rlc2NlbnQgPSBNYXRoLm1heChAZm9udC5kZXNjZW50LCBkZXNjZW50KVxuICAgICAgICAgICAgICAgICAgICAgICAgbGluZS5jb250ZW50LnB1c2godG9rZW5PYmplY3QpXG4gICAgICAgICAgICAgICAgZWxzZSAjIE11c3QgYmUgYSBuZXctbGluZVxuICAgICAgICAgICAgICAgICAgICBsaW5lLmhlaWdodCA9IGhlaWdodCB8fCBAZm9udC5saW5lSGVpZ2h0XG4gICAgICAgICAgICAgICAgICAgIGxpbmUud2lkdGggPSB3aWR0aFxuICAgICAgICAgICAgICAgICAgICBsaW5lLmRlc2NlbnQgPSBkZXNjZW50XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGxpbmUpXG4gICAgICAgICAgICAgICAgICAgIGxpbmUgPSBuZXcgZ3MuUmVuZGVyZXJUZXh0TGluZSgpXG4gICAgICAgICAgICAgICAgICAgIGxpbmUuY29udGVudC5wdXNoKG5ldyBncy5SZW5kZXJlclRva2VuKG51bGwsIFwiXFxuXCIsIEBmb250KSlcbiAgICAgICAgICAgICAgICAgICAgd2lkdGggPSAwXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodCA9IDBcbiAgICAgICAgICAgICAgICAgICAgZGVzY2VudCA9IEBmb250LmRlc2NlbnRcbiAgICAgICAgICAgICAgICB0ICs9IDJcbiAgICAgICAgICAgIGVsc2UgaWYgdG9rZW4ubGVuZ3RoID4gMFxuICAgICAgICAgICAgICAgIGxpbmUgPSBAZXhlY3V0ZVdvcmRXcmFwKHRva2VuLCBsaW5lLCB3aWR0aCwgaGVpZ2h0LCByZXN1bHQsIHdvcmRXcmFwKVxuICAgICAgICAgICAgICAgIHdpZHRoID0gbGluZS53aWR0aFxuICAgICAgICAgICAgICAgIGhlaWdodCA9IGxpbmUuaGVpZ2h0XG4gICAgICAgICAgICAgICAgZGVzY2VudCA9IGxpbmUuZGVzY2VudFxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgdCsrXG4gICAgICAgICAgICBcbiAgICAgICAgaWYgbGluZS5jb250ZW50Lmxlbmd0aCA+IDAgb3IgcmVzdWx0Lmxlbmd0aCA9PSAwXG4gICAgICAgICAgICBsaW5lLmhlaWdodCA9IGhlaWdodFxuICAgICAgICAgICAgbGluZS53aWR0aCA9IHdpZHRoXG4gICAgICAgICAgICBsaW5lLmRlc2NlbnQgPSBkZXNjZW50XG4gICAgICAgICAgICByZXN1bHQucHVzaChsaW5lKVxuICAgICAgIFxuICAgICAgICAgXG4gICAgICAgIEBmb250LnNpemUgPSBAZm9udFNpemUgIFxuICAgICAgICBAZm9udC51bmRlcmxpbmUgPSB1bmRlcmxpbmVcbiAgICAgICAgQGZvbnQuc3RyaWtlVGhyb3VnaCA9IHN0cmlrZVRocm91Z2hcbiAgICAgICAgQGZvbnQuaXRhbGljID0gaXRhbGljXG4gICAgICAgIEBmb250LmJvbGQgPSBib2xkXG4gICAgICAgIEBmb250LnNtYWxsQ2FwcyA9IHNtYWxsQ2Fwc1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgIFxuICAgIFxuICAgICMjIypcbiAgICAqIE1lYXN1cmVzIHRoZSBkaW1lbnNpb25zIG9mIGZvcm1hdHRlZCBsaW5lcyBpbiBwaXhlbHMuIFRoZSByZXN1bHQgaXMgbm90XG4gICAgKiBwaXhlbC1wZXJmZWN0LlxuICAgICogXG4gICAgKiBAbWV0aG9kIG1lYXN1cmVGb3JtYXR0ZWRMaW5lc1xuICAgICogQHBhcmFtIHtncy5SZW5kZXJlclRleHRMaW5lW119IGxpbmVzIC0gQW4gYXJyYXkgb2YgdGV4dCBsaW5lcyB0byBtZWFzdXJlLlxuICAgICogQHBhcmFtIHtib29sZWFufSB3b3JkV3JhcCAtIElmIHdvcmRXcmFwIGlzIHNldCB0byB0cnVlLCBhdXRvbWF0aWNhbGx5IGNyZWF0ZWQgbGluZS1icmVha3Mgd2lsbCBiZSBjYWxjdWxhdGVkLlxuICAgICogQHJlc3VsdCB7T2JqZWN0fSBBbiBvYmplY3QgY29udGFpbmluZyB0aGUgd2lkdGggYW5kIGhlaWdodCBvZiB0aGUgdGV4dC5cbiAgICAjIyNcbiAgICBtZWFzdXJlRm9ybWF0dGVkTGluZXM6IChsaW5lcywgd29yZFdyYXApIC0+XG4gICAgICAgIHNpemUgPSB3aWR0aDogMCwgaGVpZ2h0OiAwXG4gICAgICAgIFxuICAgICAgICBmb3IgbGluZSBpbiBsaW5lc1xuICAgICAgICAgICAgc2l6ZS53aWR0aCA9IE1hdGgubWF4KGxpbmUud2lkdGgrMiwgc2l6ZS53aWR0aClcbiAgICAgICAgICAgIHNpemUuaGVpZ2h0ICs9IGxpbmUuaGVpZ2h0ICsgQGxpbmVTcGFjaW5nXG5cbiAgICAgICAgc2l6ZS5oZWlnaHQgLT0gQGxpbmVTcGFjaW5nXG4gICAgICAgIFxuICAgICAgICByZXR1cm4gc2l6ZVxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBNZWFzdXJlcyB0aGUgZGltZW5zaW9ucyBvZiBhIGZvcm1hdHRlZCB0ZXh0IGluIHBpeGVscy4gVGhlIHJlc3VsdCBpcyBub3RcbiAgICAqIHBpeGVsLXBlcmZlY3QuXG4gICAgKiBcbiAgICAqIEBtZXRob2QgbWVhc3VyZUZvcm1hdHRlZFRleHRcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IC0gVGhlIHRleHQgdG8gbWVhc3VyZS5cbiAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gd29yZFdyYXAgLSBJZiB3b3JkV3JhcCBpcyBzZXQgdG8gdHJ1ZSwgYXV0b21hdGljYWxseSBjcmVhdGVkIGxpbmUtYnJlYWtzIHdpbGwgYmUgY2FsY3VsYXRlZC5cbiAgICAqIEByZXN1bHQge09iamVjdH0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIHdpZHRoIGFuZCBoZWlnaHQgb2YgdGhlIHRleHQuXG4gICAgIyMjXG4gICAgbWVhc3VyZUZvcm1hdHRlZFRleHQ6ICh0ZXh0LCB3b3JkV3JhcCkgLT5cbiAgICAgICAgQGZvbnQuc2V0KEBvYmplY3QuZm9udClcbiAgICAgICAgc2l6ZSA9IG51bGxcbiAgICAgICAgbGluZXMgPSBAY2FsY3VsYXRlTGluZXModGV4dCwgd29yZFdyYXApXG4gICAgICAgIFxuICAgICAgICBzaXplID0gQG1lYXN1cmVGb3JtYXR0ZWRMaW5lcyhsaW5lcywgd29yZFdyYXApXG4gICAgICAgIFxuICAgICAgICByZXR1cm4gc2l6ZVxuICAgICAgICBcbiAgICAjIyMqXG4gICAgKiBNZWFzdXJlcyB0aGUgZGltZW5zaW9ucyBvZiBhIHBsYWluIHRleHQgaW4gcGl4ZWxzLiBGb3JtYXR0aW5nIGFuZFxuICAgICogd29yZC13cmFwcGluZyBhcmUgbm90IHN1cHBvcnRlZC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIG1lYXN1cmVUZXh0XG4gICAgKiBAcGFyYW0ge3N0cmluZ30gdGV4dCAtIFRoZSB0ZXh0IHRvIG1lYXN1cmUuXG4gICAgKiBAcmVzdWx0IHtPYmplY3R9IEFuIG9iamVjdCBjb250YWluaW5nIHRoZSB3aWR0aCBhbmQgaGVpZ2h0IG9mIHRoZSB0ZXh0LlxuICAgICMjI1xuICAgIG1lYXN1cmVUZXh0OiAodGV4dCkgLT5cbiAgICAgICAgc2l6ZSA9IHdpZHRoOiAwLCBoZWlnaHQ6IDBcbiAgICAgICAgbGluZXMgPSB0ZXh0LnRvU3RyaW5nKCkuc3BsaXQoXCJcXG5cIilcblxuICAgICAgICBmb3IgbGluZSBpbiBsaW5lc1xuICAgICAgICAgICAgbGluZVNpemUgPSBAb2JqZWN0LmZvbnQubWVhc3VyZVRleHQodGV4dClcbiAgICAgICAgICAgIHNpemUud2lkdGggPSBNYXRoLm1heChzaXplLndpZHRoLCBsaW5lU2l6ZS53aWR0aClcbiAgICAgICAgICAgIHNpemUuaGVpZ2h0ICs9IEBvYmplY3QuZm9udC5saW5lSGVpZ2h0ICsgQGxpbmVTcGFjaW5nXG4gICAgICAgICAgICBcbiAgICAgICAgc2l6ZS5oZWlnaHQgLT0gQGxpbmVTcGFjaW5nXG4gICAgICAgIFxuICAgICAgICByZXR1cm4gc2l6ZVxuICAgIFxuICAgICMjIypcbiAgICAqIFNlYXJjaGVzIGZvciBhIHRva2VuIGluIGEgbGlzdCBvZiB0b2tlbnMgYW5kIHJldHVybnMgdGhlIGZpcnN0IG1hdGNoLlxuICAgICpcbiAgICAqIEBtZXRob2QgZmluZFRva2VuXG4gICAgKiBAcGFyYW0ge251bWJlcn0gc3RhcnRJbmRleCAtIFRoZSBpbmRleCBpbiB0aGUgbGlzdCBvZiB0b2tlbnMgd2hlcmUgdGhlIHNlYXJjaCB3aWxsIHN0YXJ0LlxuICAgICogQHBhcmFtIHtzdHJpbmd9IGNvZGUgLSBUaGUgY29kZSBvZiB0aGUgdG9rZW4gdG8gc2VhcmNoIGZvci5cbiAgICAqIEBwYXJhbSB7bnVtYmVyfSBkaXJlY3Rpb24gLSBUaGUgc2VhcmNoIGRpcmVjdGlvbiwgY2FuIGJlIGZvcndhcmQoMSkgb3IgYmFja3dhcmQoLTEpLlxuICAgICogQHBhcmFtIHtPYmplY3RbXX0gdG9rZW5zIC0gVGhlIGxpc3Qgb2YgdG9rZW5zIHRvIHNlYXJjaC5cbiAgICAqIEByZXN1bHQge09iamVjdH0gVGhlIGZpcnN0IHRva2VuIHdoaWNoIG1hdGNoZXMgdGhlIHNwZWNpZmllZCBjb2RlIG9yIDxiPm51bGw8L2I+IGlmIHRoZSB0b2tlbiBjYW5ub3QgYmUgZm91bmQuXG4gICAgIyMjICBcbiAgICBmaW5kVG9rZW46IChzdGFydEluZGV4LCBjb2RlLCBkaXJlY3Rpb24sIHRva2VucykgLT5cbiAgICAgICAgdG9rZW4gPSBudWxsXG4gICAgICAgIGkgPSBzdGFydEluZGV4XG4gICAgICAgIGlmIGRpcmVjdGlvbiA9PSAtMVxuICAgICAgICAgICAgd2hpbGUgaSA+PSAwXG4gICAgICAgICAgICAgICAgdCA9IHRva2Vuc1tpXVxuICAgICAgICAgICAgICAgIGlmIHQuY29kZSA9PSBjb2RlXG4gICAgICAgICAgICAgICAgICAgIHRva2VuID0gdFxuICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgIGktLVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHRva2VuXG4gICAgIFxuICAgICMjIypcbiAgICAqIFNlYXJjaGVzIGZvciBhIHNwZWNpZmljIGtpbmQgb2YgdG9rZW5zIGJldHdlZW4gYSBzdGFydCBhbmQgYW4gZW5kIHRva2VuLlxuICAgICpcbiAgICAqIEBtZXRob2QgZmluZFRva2Vuc0JldHdlZW5cbiAgICAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydEluZGV4IC0gVGhlIGluZGV4IHdoZXJlIHRoZSBzZWFyY2ggd2lsbCBzdGFydC5cbiAgICAqIEBwYXJhbSB7bnVtYmVyfSBlbmRJbmRleCAtIFRoZSBpbmRleCB3aGVyZSB0aGUgc2VhcmNoIHdpbGwgZW5kLlxuICAgICogQHBhcmFtIHtzdHJpbmd9IGNvZGUgLSBUaGUgY29kZSBvZiB0aGUgdG9rZW4tdHlwZSB0byBzZWFyY2ggZm9yLlxuICAgICogQHBhcmFtIHtPYmplY3RbXX0gdG9rZW5zIC0gVGhlIGxpc3Qgb2YgdG9rZW5zIHRvIHNlYXJjaC5cbiAgICAqIEByZXN1bHQge09iamVjdFtdfSBMaXN0IG9mIHRva2VucyBtYXRjaGluZyB0aGUgc3BlY2lmaWVkIGNvZGUuIEl0cyBhbiBlbXB0eSBsaXN0IGlmIG5vIHRva2VucyB3ZXJlIGZvdW5kLlxuICAgICMjIyAgICAgXG4gICAgZmluZFRva2Vuc0JldHdlZW46IChzdGFydEluZGV4LCBlbmRJbmRleCwgY29kZSwgdG9rZW5zKSAtPlxuICAgICAgICByZXN1bHQgPSBbXVxuICAgICAgICBzID0gc3RhcnRJbmRleFxuICAgICAgICBlID0gZW5kSW5kZXhcbiAgICAgICAgXG4gICAgICAgIHdoaWxlIHMgPCBlXG4gICAgICAgICAgICB0b2tlbiA9IHRva2Vuc1tzXVxuICAgICAgICAgICAgaWYgYHRva2VuLmNvZGUgPT0gY29kZWBcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh0b2tlbilcbiAgICAgICAgICAgIHMrK1xuICAgICAgICAgICAgXG4gICAgICAgIHJldHVybiByZXN1bHRcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogUHJvY2Vzc2VzIGEgY29udHJvbC10b2tlbi4gQSBjb250cm9sLXRva2VuIGlzIGEgdG9rZW4gd2hpY2ggaW5mbHVlbmNlc1xuICAgICogdGhlIHRleHQtcmVuZGVyaW5nIGxpa2UgY2hhbmdpbmcgdGhlIGZvbnRzIGNvbG9yLCBzaXplIG9yIHN0eWxlLlxuICAgICpcbiAgICAqIENoYW5nZXMgd2lsbCBiZSBhdXRvbWF0aWNhbGx5IGFwcGxpZWQgdG8gdGhlIGdhbWUgb2JqZWN0J3MgZm9udC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHByb2Nlc3NDb250cm9sVG9rZW5cbiAgICAqIEBwYXJhbSB7T2JqZWN0fSB0b2tlbiAtIEEgY29udHJvbC10b2tlbi5cbiAgICAqIEByZXR1cm4ge09iamVjdH0gQW4gb2JqZWN0IHdoaWNoIGNhbiBjb250YWluIGFkZGl0aW9uYWwgaW5mbyBuZWVkZWQgZm9yIHByb2Nlc3NpbmcuXG4gICAgIyMjXG4gICAgcHJvY2Vzc0NvbnRyb2xUb2tlbjogKHRva2VuKSAtPlxuICAgICAgICByZXN1bHQgPSBudWxsXG4gICAgICAgIFxuICAgICAgICBzd2l0Y2ggdG9rZW4uY29kZVxuICAgICAgICAgICAgd2hlbiBcIlNaXCJcbiAgICAgICAgICAgICAgICBAb2JqZWN0LmZvbnQuc2l6ZSA9IHRva2VuLnZhbHVlIHx8IEBmb250U2l6ZVxuICAgICAgICAgICAgd2hlbiBcIkNcIlxuICAgICAgICAgICAgICAgIGlmIHRva2VuLnZhbHVlIDw9IDBcbiAgICAgICAgICAgICAgICAgICAgQG9iamVjdC5mb250LmNvbG9yID0gRm9udC5kZWZhdWx0Q29sb3JcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIEBvYmplY3QuZm9udC5jb2xvciA9IFJlY29yZE1hbmFnZXIuc3lzdGVtLmNvbG9yc1t0b2tlbi52YWx1ZS0xXSB8fCBGb250LmRlZmF1bHRDb2xvclxuICAgICAgICAgICAgd2hlbiBcIllcIlxuICAgICAgICAgICAgICAgIHN3aXRjaCB0b2tlbi52YWx1ZVxuICAgICAgICAgICAgICAgICAgICB3aGVuIFwiVVwiIHRoZW4gQG9iamVjdC5mb250LnVuZGVybGluZSA9IHllc1xuICAgICAgICAgICAgICAgICAgICB3aGVuIFwiU1wiIHRoZW4gQG9iamVjdC5mb250LnN0cmlrZVRocm91Z2ggPSB5ZXNcbiAgICAgICAgICAgICAgICAgICAgd2hlbiBcIklcIiB0aGVuIEBvYmplY3QuZm9udC5pdGFsaWMgPSB5ZXNcbiAgICAgICAgICAgICAgICAgICAgd2hlbiBcIkJcIiB0aGVuIEBvYmplY3QuZm9udC5ib2xkID0geWVzXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gXCJDXCIgdGhlbiBAb2JqZWN0LmZvbnQuc21hbGxDYXBzID0geWVzXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gXCJOVVwiIHRoZW4gQG9iamVjdC5mb250LnVuZGVybGluZSA9IG5vXG4gICAgICAgICAgICAgICAgICAgIHdoZW4gXCJOU1wiIHRoZW4gQG9iamVjdC5mb250LnN0cmlrZVRocm91Z2ggPSBub1xuICAgICAgICAgICAgICAgICAgICB3aGVuIFwiTklcIiB0aGVuIEBvYmplY3QuZm9udC51bmRlcmxpbmUgPSBub1xuICAgICAgICAgICAgICAgICAgICB3aGVuIFwiTkJcIiB0aGVuIEBvYmplY3QuZm9udC5ib2xkID0gbm9cbiAgICAgICAgICAgICAgICAgICAgd2hlbiBcIk5DXCIgdGhlbiBAb2JqZWN0LmZvbnQuc21hbGxDYXBzID0gbm9cbiAgICAgICAgICAgICAgICAgICAgd2hlbiBcIk5cIlxuICAgICAgICAgICAgICAgICAgICAgICAgQG9iamVjdC5mb250LnVuZGVybGluZSA9IG5vXG4gICAgICAgICAgICAgICAgICAgICAgICBAb2JqZWN0LmZvbnQuc3RyaWtlVGhyb3VnaCA9IG5vXG4gICAgICAgICAgICAgICAgICAgICAgICBAb2JqZWN0LmZvbnQuaXRhbGljID0gbm9cbiAgICAgICAgICAgICAgICAgICAgICAgIEBvYmplY3QuZm9udC5ib2xkID0gbm9cbiAgICAgICAgICAgICAgICAgICAgICAgIEBvYmplY3QuZm9udC5zbWFsbENhcHMgPSBub1xuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgIHJldHVybiByZXN1bHRcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogRHJhd3MgYSBwbGFpbiB0ZXh0LiBGb3JtYXR0aW5nIGFuZCB3b3JkLXdyYXBwaW5nIGFyZSBub3Qgc3VwcG9ydGVkLlxuICAgICpcbiAgICAqIEBtZXRob2QgZHJhd1RleHRcbiAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IC0gVGhlIHgtY29vcmRpbmF0ZSBvZiB0aGUgdGV4dCdzIHBvc2l0aW9uLlxuICAgICogQHBhcmFtIHtudW1iZXJ9IHkgLSBUaGUgeS1jb29yZGluYXRlIG9mIHRoZSB0ZXh0J3MgcG9zaXRpb24uXG4gICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGggLSBEZXByZWNhdGVkLiBDYW4gYmUgbnVsbC5cbiAgICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHQgLSBEZXByZWNhdGVkLiBDYW4gYmUgbnVsbC5cbiAgICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IC0gVGhlIHRleHQgdG8gZHJhdy5cbiAgICAjIyNcbiAgICBkcmF3VGV4dDogKHBsLCBwdCwgcHIsIHBiLCB0ZXh0KSAtPlxuICAgICAgICBsaW5lcyA9IHRleHQudG9TdHJpbmcoKS5zcGxpdChcIlxcblwiKVxuICAgICAgICBmb250ID0gQG9iamVjdC5mb250XG4gICAgICAgIGhlaWdodCA9IGZvbnQubGluZUhlaWdodFxuICAgICAgICBcbiAgICAgICAgZm9yIGxpbmUsIGkgaW4gbGluZXNcbiAgICAgICAgICAgIHNpemUgPSBmb250Lm1lYXN1cmVUZXh0KGxpbmUpXG4gICAgICAgICAgICBAb2JqZWN0LmJpdG1hcC5kcmF3VGV4dChwbCwgaSAqIGhlaWdodCArIHB0LCBzaXplLndpZHRoICsgcHIrcGwsIGhlaWdodCtwdCtwYiwgbGluZSwgMCwgMClcbiAgICAgICAgICAgIFxuICAgICAgICByZXR1cm4gbnVsbFxuICAgIFxuICAgICMjIypcbiAgICAqIERyYXdzIGFuIGFycmF5IG9mIGZvcm1hdHRlZCB0ZXh0IGxpbmVzLiBcbiAgICAqIElmIHRoZSB3b3JkV3JhcCBwYXJhbSBpcyBzZXQsIGxpbmUtYnJlYWtzIGFyZSBhdXRvbWF0aWNhbGx5IGNyZWF0ZWQgaWYgYSBsaW5lXG4gICAgKiBkb2Vzbid0IGZpdCBpbnRvIHRoZSB3aWR0aCBvZiB0aGUgZ2FtZSBvYmplY3QncyBiaXRtYXAuXG4gICAgKlxuICAgICogQG1ldGhvZCBkcmF3Rm9ybWF0dGVkTGluZXNcbiAgICAqIEBwYXJhbSB7bnVtYmVyfSBwbCAtIFRoZSBsZWZ0LXBhZGRpbmcgb2YgdGhlIHRleHQncyBwb3NpdGlvbi5cbiAgICAqIEBwYXJhbSB7bnVtYmVyfSBwdCAtIFRoZSB0b3AtcGFkZGluZyBvZiB0aGUgdGV4dCdzIHBvc2l0aW9uLlxuICAgICogQHBhcmFtIHtudW1iZXJ9IHByIC0gVGhlIHJpZ2h0LXBhZGRpbmcgb2YgdGhlIHRleHQncyBwb3NpdGlvbi5cbiAgICAqIEBwYXJhbSB7bnVtYmVyfSBwYiAtIFRoZSBib3R0b20tcGFkZGluZyBvZiB0aGUgdGV4dCdzIHBvc2l0aW9uLlxuICAgICogQHBhcmFtIHtncy5SZW5kZXJlclRleHRMaW5lW119IGxpbmVzIC0gQW4gYXJyYXkgb2YgbGluZXMgdG8gZHJhdy5cbiAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gd29yZFdyYXAgLSBJZiB3b3JkV3JhcCBpcyBzZXQgdG8gdHJ1ZSwgbGluZS1icmVha3MgYXJlIGF1dG9tYXRpY2FsbHkgY3JlYXRlZC5cbiAgICAjIyMgXG4gICAgZHJhd0Zvcm1hdHRlZExpbmVzOiAocGwsIHB0LCBwciwgcGIsIGxpbmVzLCB3b3JkV3JhcCkgLT5cbiAgICAgICAgQGN1cnJlbnRYID0gcGxcbiAgICAgICAgQGN1cnJlbnRZID0gcHRcbiAgICAgICAgQGN1cnJlbnRMaW5lSGVpZ2h0ID0gMFxuICAgIFxuICAgICAgICBmb3IgbGluZSBpbiBsaW5lc1xuICAgICAgICAgICAgZm9yIHRva2VuIGluIGxpbmUuY29udGVudFxuICAgICAgICAgICAgICAgIGlmIHRva2VuLmNvZGU/XG4gICAgICAgICAgICAgICAgICAgIEBwcm9jZXNzQ29udHJvbFRva2VuKHRva2VuKVxuICAgICAgICAgICAgICAgICAgICBzaXplID0gQG1lYXN1cmVDb250cm9sVG9rZW4odG9rZW4pXG4gICAgICAgICAgICAgICAgICAgIGlmIHNpemVcbiAgICAgICAgICAgICAgICAgICAgICAgIEBkcmF3Q29udHJvbFRva2VuKHRva2VuLCBAb2JqZWN0LmJpdG1hcCwgQGN1cnJlbnRYKVxuICAgICAgICAgICAgICAgICAgICAgICAgQGN1cnJlbnRYICs9IHNpemUud2lkdGhcbiAgICAgICAgICAgICAgICBlbHNlIGlmIHRva2VuLnZhbHVlLmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgICAgICAgZm9udCA9IEBvYmplY3QuZm9udFxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQgPSBsaW5lLmhlaWdodFxuICAgICAgICAgICAgICAgICAgICBpZiB0b2tlbi52YWx1ZSAhPSBcIlxcblwiXG4gICAgICAgICAgICAgICAgICAgICAgICBzaXplID0gZm9udC5tZWFzdXJlVGV4dFBsYWluKHRva2VuLnZhbHVlKVxuICAgICAgICAgICAgICAgICAgICAgICAgQG9iamVjdC5iaXRtYXAuZHJhd1RleHQoQGN1cnJlbnRYLCBAY3VycmVudFkgKyBoZWlnaHQgLSBzaXplLmhlaWdodCArIGZvbnQuZGVzY2VudCAtIGxpbmUuZGVzY2VudCwgc2l6ZS53aWR0aCtwbCtwciwgaGVpZ2h0K3B0K3BiLCB0b2tlbi52YWx1ZSwgMCwgMClcbiAgICAgICAgICAgICAgICAgICAgICAgIEBjdXJyZW50WCArPSBzaXplLndpZHRoXG4gICAgICAgICAgICAgICAgICAgIEBjdXJyZW50TGluZUhlaWdodCA9IE1hdGgubWF4KEBjdXJyZW50TGluZUhlaWdodCwgaGVpZ2h0KVxuICAgICAgICAgICAgQGN1cnJlbnRZICs9IChAY3VycmVudExpbmVIZWlnaHQgfHwgQG9iamVjdC5mb250LmxpbmVIZWlnaHQpICsgQGxpbmVTcGFjaW5nXG4gICAgICAgICAgICBAY3VycmVudFggPSBwbFxuICAgICAgICAgICAgQGN1cnJlbnRMaW5lSGVpZ2h0ID0gMFxuICAgICAgICAgICAgXG4gICAgICAgIHJldHVybiBudWxsXG4gICAgICAgIFxuICAgICMjIypcbiAgICAqIERyYXdzIGEgZm9ybWF0dGVkIHRleHQuIFxuICAgICogSWYgdGhlIHdvcmRXcmFwIHBhcmFtIGlzIHNldCwgbGluZS1icmVha3MgYXJlIGF1dG9tYXRpY2FsbHkgY3JlYXRlZCBpZiBhIGxpbmVcbiAgICAqIGRvZXNuJ3QgZml0IGludG8gdGhlIHdpZHRoIG9mIHRoZSBnYW1lIG9iamVjdCdzIGJpdG1hcC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGRyYXdGb3JtYXR0ZWRUZXh0XG4gICAgKiBAcGFyYW0ge251bWJlcn0geCAtIFRoZSB4LWNvb3JkaW5hdGUgb2YgdGhlIHRleHQncyBwb3NpdGlvbi5cbiAgICAqIEBwYXJhbSB7bnVtYmVyfSB5IC0gVGhlIHktY29vcmRpbmF0ZSBvZiB0aGUgdGV4dCdzIHBvc2l0aW9uLlxuICAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoIC0gRGVwcmVjYXRlZC4gQ2FuIGJlIG51bGwuXG4gICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0IC0gRGVwcmVjYXRlZC4gQ2FuIGJlIG51bGwuXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gdGV4dCAtIFRoZSB0ZXh0IHRvIGRyYXcuXG4gICAgKiBAcGFyYW0ge2Jvb2xlYW59IHdvcmRXcmFwIC0gSWYgd29yZFdyYXAgaXMgc2V0IHRvIHRydWUsIGxpbmUtYnJlYWtzIGFyZSBhdXRvbWF0aWNhbGx5IGNyZWF0ZWQuXG4gICAgKiBAcmV0dXJuIHtncy5SZW5kZXJlclRleHRMaW5lW119IFRoZSBkcmF3biB0ZXh0IGxpbmVzLlxuICAgICMjI1xuICAgIGRyYXdGb3JtYXR0ZWRUZXh0OiAocGwsIHB0LCBwciwgcGIsIHRleHQsIHdvcmRXcmFwKSAtPlxuICAgICAgICBsaW5lcyA9IEBjYWxjdWxhdGVMaW5lcyh0ZXh0LnRvU3RyaW5nKCksIHdvcmRXcmFwKVxuICAgICAgICBcbiAgICAgICAgQGRyYXdGb3JtYXR0ZWRMaW5lcyhwbCwgcHQsIHByLCBwYiwgbGluZXMsIHdvcmRXcmFwKVxuICAgICAgICAgICAgXG4gICAgICAgIHJldHVybiBsaW5lc1xuICAgICAgICBcbmdzLkNvbXBvbmVudF9UZXh0UmVuZGVyZXIgPSBDb21wb25lbnRfVGV4dFJlbmRlcmVyIl19
//# sourceURL=Component_TextRenderer_120.js