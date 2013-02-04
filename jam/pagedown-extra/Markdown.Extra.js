(function () {
  Markdown.Extra = function() {

    // for converting internal markdown (in tables for instance).
    // this is necessary since these methods are meant to be called as
    // preConversion hooks, and the Markdown converter passed to init()
    // won't convert any markdown contained in the html we return
    this.sanitizingConverter = Markdown.getSanitizingConverter();

    // to store blocks of code we generate in preConversion, so
    // they're not destroyed if the user is using a sanitizing converter
    this.hashBlocks = [];

    // fenced code block options
    this.googleCodePrettify = false;
    this.highlightJs = false;

    // table options
    this.tableClass = 'wmd-table';
  };


  // Each call to init creates a new instance of Markdown.Extra so it's
  // safe to have multiple editors/converters on a single page
  Markdown.Extra.init = function(converter, options) {
    var extra = new Markdown.Extra();

    options = options || {};
    options.extensions = options.extensions || [];
    if (options.extensions.length == 0 || options.extensions.indexOf("all") != -1) {
      converter.hooks.chain("preConversion", function(text) {
        return extra.all(text);
      });
    } else {
      if (options.extensions.indexOf("tables") != -1) {
        converter.hooks.chain("preConversion", function(text) {
          return extra.tables(text);
        });
      }
      if (options.extensions.indexOf("fencedCodeBlocks") != -1) {
        converter.hooks.chain("preConversion", function(text) {
          return extra.fencedCodeBlocks(text);
        });
      }
    }

    converter.hooks.chain("postConversion", function(text) {
      return extra.unHashBlocks(text);
    });

    if (typeof options.highlighter != "undefined") {
        extra.googleCodePrettify = options.highlighter === 'prettify';
        extra.highlightJs = options.highlighter === 'highlight';
    }

    if (typeof options.tableClass != "undefined") {
        extra.tableClass = options.tableClass;
    }
  };

  function strip(str) {
    return str.replace(/^\s+|\s+$/g, '');
  }

  function sanitizeTag(tag, whitelist) {
    if (tag.match(whitelist))
      return tag;
    return '';
  }

  function sanitizeHtml(html, whitelist) {
    return html.replace(/<[^>]*>?/gi, function(match) {
      return sanitizeTag(match, whitelist);
    });
  }

  Markdown.Extra.prototype.hashBlock = function(text, block) {
    var key = this.hashBlocks.push(block) - 1;
    var rep = '<p>{{wmd-block-key=' + key + '}}</p>';
    return text.replace(block, rep);
  };

  Markdown.Extra.prototype.unHashBlocks = function(text) {
    var re = new RegExp('<p>{{wmd-block-key=(\\d+)}}</p>', 'gm');
    while(match = re.exec(text)) {
      key = parseInt(match[1], 10);
      text = text.replace(match[0], this.hashBlocks[key]);
    }
    return text;
  };

  Markdown.Extra.prototype.tables = function(text) {
    // Whitelist used as a post-processing step after calling convert.makeHtml()
    // to keep only span-level tags inside tables per the PHP Markdown Extra spec.
    var whitelist = /^(<\/?(b|del|em|i|s|sup|sub|strong|strike)>|<(br)\s?\/?>)$/i;
    var that = this;

    function convertInline(text) {
      var html = that.sanitizingConverter.makeHtml(text);
      return sanitizeHtml(html, whitelist);
    }

    function splitRow(row, border) {
      var r = strip(row);
      if (border) {
        if (r.indexOf('|') === 0)
          r = r.slice(1);
        if (r.lastIndexOf('|') === r.length - 1)
          r = r.slice(0, -1);
      }

      var cols = r.split('|');
      for (var i = 0; i < cols.length; i++)
        cols[i] = strip(cols[i]);

      return cols; }

    function buildRow(line, border, align, isHeader) {
      var rowHtml = '<tr>';
      var cols = splitRow(line, border);
      var style, cellStart, cellEnd, content;

      // use align to ensure each row has same number of columns
      for (var i = 0; i < align.length; i++) {
        style = align[i] && !isHeader ? ' style="text-align:' + align[i] + ';"' : '';
        cellStart = isHeader ? '<th'+style+'>' : '<td'+style+'>';
        cellEnd = isHeader ? "</th>" : "</td>";
        content = i < cols.length ? convertInline(cols[i]) : '';
        rowHtml += cellStart + content + cellEnd;
      }

      return rowHtml + "</tr>";
    }

   // find next block (group of lines matching our definition of a table)
   function findNextBlock(text) {
      lines = text.split('\n');
      var block = [], ndx = 0, bounds = {};
      for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        // TODO: add ability to escape |, : per PHP Markdown Extra spec
        // TODO: use a regex to find blocks. make sure blocks end with blank line
        // TODO: ignore within gfm code blocks and all block-level tags
        if (line.indexOf('|') != -1 && (ndx != 1 || line.indexOf('-') != -1)) {
            if (typeof bounds.start == "undefined")
              bounds.start = i;
            block.push(line);
            ndx++;
        } else { // invalid line
          if (block.length > 2) {// need head, sep, body
            bounds.end = i - 1;
            return {block: block, bounds: bounds, lines: lines};
          }
          block = [];
          bounds = {};
          ndx = 0;
        }
      }
      return null;
    }

    function makeTables(text) {
      var blockdata;
      while ((blockdata = findNextBlock(text)) !== null) {
        var block = blockdata.block,
            bounds = blockdata.bounds,
            lines = blockdata.lines,
            header = strip(block[0]),
            sep = strip(block[1]),
            rows = strip(block[2]),
            border = false;

        if (header.indexOf('|') === 0 ||
            header.lastIndexOf('|') === header.length-1)
          border = true;

        var align = [],
            cols = splitRow(sep, border);

        // determine alignment of columns
        for (var j = 0; j < cols.length; j++) {
          var c = cols[j];
          if (c.indexOf(':') === 0 && c.lastIndexOf(':') == c.length - 1)
            align.push('center');
          else if (c.indexOf(':') === 0)
            align.push('left');
          else if (c.lastIndexOf(':') === c.length - 1)
            align.push('right');
          else
            align.push(null);
        }

        // build html. the id here is only temporary
        var cls = that.tableClass === '' ? '' : ' class="'+that.tableClass+'"';
        var tableHtml = '<table' + cls + '>' +
          buildRow(block[0], border, align, true);
        for (j = 2; j < block.length; j++)
          tableHtml += buildRow(block[j], border, align, false);
        tableHtml += "</table>\n";

        // replace table markdown with html
        var toRemove = bounds.end - bounds.start + 1;
        lines.splice(bounds.start, toRemove, tableHtml);

        // replace html with placeholder until postConversion step
        text = lines.join('\n');
        text = that.hashBlock(text, tableHtml);
      }

      return text;
    }

    return makeTables(text);
  }; // Markdown.Extra.tables

  // gfm-inspired fenced code blocks
  Markdown.Extra.prototype.fencedCodeBlocks = function(text) {
    // Next three functions stolen from Markdown.Converter.js.
    // Could've modified the converter source to make them
    // available but we want this to work with stock pagedown.
    function encodeCode(code) {
      code = code.replace(/&/g, "&amp;");
      code = code.replace(/</g, "&lt;");
      code = code.replace(/>/g, "&gt;");
      return code;
    }

    // TODO: ignore within block-level tags
    var re = new RegExp(
      '(\\n\\n|^\\n?)' +         // separator, $1 = leading whitespace
      '^```(\\w+)?\\s*\\n' +     // opening fence, $2 = optional lang
      '([\\s\\S]*?)' +           // $3 = code block content (no dotAll in js - dot doesn't match newline)
      '^```\\s*\\n',             // closing fence
      'gm');                     // Flags : global, multiline

    var match, codeblock, codeclass, first, last;
    while (match = re.exec(text)) {
      preclass = this.googleCodePrettify ? ' class="prettyprint"' : '';
      codeclass = '';
      if (typeof match[2] != "undefined" && (this.googleCodePrettify || this.highlightJs))
        codeclass = ' class="language-' + match[2] + '"';
      codeblock = '<pre' + preclass + '><code' + codeclass + '>';
      codeblock += encodeCode(match[3]) + '</code></pre>';

      // replace markdwon with generated html code block
      first = text.substring(0, match.index) + '\n\n';
      last = '\n\n' + text.substr(match.index + match[0].length);
      text = first + codeblock + last;

      // replace codeblock with placeholder until postConversion step
      text = this.hashBlock(text, codeblock);
    }

    return text;
  };

  Markdown.Extra.prototype.all = function(text) {
    text = this.tables(text);
    text = this.fencedCodeBlocks(text);
    return text;
  };

})();

