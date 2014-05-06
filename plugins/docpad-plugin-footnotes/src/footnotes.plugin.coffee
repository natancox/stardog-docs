module.exports = (BasePlugin) ->
  cheerio = require("cheerio")
  path = require('path')
  fs = require('fs')
  #url = require('url')
  util = require('util')
  #balUtil = require('bal-util')

  class FootnotesPlugin extends BasePlugin
  
    name: 'footnotes'

    #should be part of defaultConfig
    FN_CONTAINER = "#fn"
    RETURN_MARKER = "&#8618;"
    FN_ID_MASK = "fn-ref-"
    FN_ANCHOR_MASK = "footnote-"
    FN_SUP = true
    FN_CLASS = "footnote"

    processFootnotes= (content) ->
      $ = cheerio.load(content.attributes.contentRendered)
      $("fn").each (index, elem) ->
        theNumber = index + 1
        theLink = $("<a></a>").attr(
          id: FN_ID_MASK + theNumber
          href: "#" + FN_ANCHOR_MASK + theNumber
          class: "skip fn-marker"
          "gumby-easing": "easeOutQuad"
          "gumby-duration": "400"
          "gumby-goto": "#" + FN_ANCHOR_MASK + theNumber
          )
        theNum = $("<span class='ref-mark'></span>").text(theNumber)
        sequence_marker1 = theNumber
        sequence_marker2 = theNumber + ". "
        if FN_SUP
          theSup = $("<sup></sup>")
          theSup.append sequence_marker1
          theLink.append theSup
        else
          theLink.append theNum
        $(this).replaceWith theLink
        target1 = FN_ANCHOR_MASK + theNumber
        target2 = "#" + FN_ID_MASK + theNumber
        theReturn = $("<a></a>").attr(
          class: "skip fn-marker"
          "gumby-easing": "easeOutQuad"
          "gumby-duration": "400"
          "gumby-goto": target2
          ).html("&nbsp;" + RETURN_MARKER)
        #because marked ignores markdown children of any html element (<fn>)
        marked = require('marked')
        #marked.setOptions(config.markedOptions)
        theText = cheerio.load(marked($(this).html()))("p")
        theText.prepend(sequence_marker2).append theReturn
        theBigLink = $("<div></div>").attr(class: FN_CLASS, id: target1).prepend theText 
        $("#footnote-container").append theBigLink 
        #if we get something, set footnote container to display: block
        #also, it never shows up in the sidebar because that's already been built
        #by the time we're doing this stuff (writeBefore event fires after)
        if index >= 0
          $("#footnote-container").attr(class: "", style: "display: block;")
      return $.html()

    processDocStructure= (document) ->
      $ = cheerio.load(document.attributes.contentRendered)
      toc = $("<ol></ol>").attr(id: "", class: "chapter-toc")
      outputPath = docpad.getConfig().srcPath + "/partials/"
      outputFileName = document.attributes.name
      fileOut = outputPath + outputFileName
      slug = document.attributes.slug
      $('#mdblock > h2').each (index, elem) -> 
        txt = $(this).text()
        id = $(this).attr("id")
        name = "h2"
        theLink = $("<a>#{txt}</a>").attr(href: "/#{slug}/##{id}")
        toc.append($("<li></li>").append theLink)
      #write to a file in partials
      m = "---\ncacheable: false\n---\n\n"
      fs.writeFile fileOut, m + cheerio.load(toc).html(), (err) ->
        # bail on error? Should really do something here
        return next?(err)  if err
        docpad.log("debug", "Wrote the #{outputFileName} partial to: #{outputPath}")

    writeBefore: (opts,next) ->
      me = @
      docpad = @docpad
      defaultConfig = @defaultConfig
      config = @config
      templateData = docpad.getTemplateData()
      #we can use this to check to see if we should suppress footnotes in any particular doc
      #or to use a special sequence marker, etc
      # loop over just the html files in the resulting collection
      docpad.getCollection('html').sortCollection(date:9).forEach (document) ->
        document.attributes.contentRendered = processFootnotes document
        processDocStructure document
      # Done, let DocPad proceed
      next()