# DocPad Configuration File
# http://docpad.org/docs/config

# Define the DocPad Configuration
docpadConfig = {
    # Out Path
    # Where should we put our generated website files?
    # If it is a relative path, it will have the resolved `rootPath` prepended to it
    outPath: 'published'  # default

    # Src Path
    # Where can we find our source website files?
    # If it is a relative path, it will have the resolved `rootPath` prepended to it
    srcPath: 'src'  # default

    # Documents Paths
    # An array of paths which contents will be treated as documents
    # If it is a relative path, it will have the resolved `srcPath` prepended to it
    documentsPaths: [  # default
        'docs'
    ]

    # Files Paths
    # An array of paths which contents will be treated as files
    # If it is a relative path, it will have the resolved `srcPath` prepended to it
    filesPaths: [  # default
        'files'
        'public'
    ]

    # Layouts Paths
    # An array of paths which contents will be treated as layouts
    # If it is a relative path, it will have the resolved `srcPath` prepended to it
    layoutsPaths: [  # default
        'layouts'
    ]

    # Render Passes
    # How many times should we render documents that reference other documents?
    renderPasses: 1  # default

    # Check Version
    # Whether or not to check for newer versions of DocPad
    checkVersion: true # default

    # =================================
    # Template Configuration

    # Template Data
    # Use to define your own template data and helpers that will be accessible to your templates
    # Complete listing of default values can be found here: http://docpad.org/docs/template-data
    templateData:
        # Specify some site properties
        version: "2.2" #update me on new release
        springVersion: "2.1.2"
        reldate: "2 July 2014"
        secnote: '<div class="metro danger label">Security Notice</div>'
        shout: '<div class="metro warning btn">NOTE</div>'
        new2: ""
        FIXME: "<div class='metro large btn warning'>@FIXME</div>"
        v: "<div class='metro success label'>VALID</div>"
        i: "<div class='metro danger label'>INVALID</div>"
        site:
            scripts: [
                      "http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"
                      "/js/libs/gumby.js"
                      "/js/libs/ui/gumby.fittext.js"
                      "/js/libs/ui/gumby.fixed.js"
                      "/js/libs/ui/gumby.navbar.js"
                      "/js/libs/ui/gumby.retina.js"
                      "/js/libs/ui/gumby.skiplink.js"
                      "/js/libs/ui/gumby.tabs.js"
                      "/js/libs/ui/gumby.toggleswitch.js"
                      "/js/libs/gumby.init.js"
                      "/js/plugins.js"
                      "/js/main.js"
                      ]
            styles: [
                      "/css/gumby.css"
                     ]
            # The production url of our website
            url: "http://docs.stardog.com/"

            # The default title of our website
            title: "Stardog Documentation"

            # The website description (for SEO)
            description: """ """

            # The website keywords (for SEO) separated by commas
            keywords: """ """

        # -----------------------------
        # Helper Functions

        # Get the prepared site/document title
        # Often we would like to specify particular formatting to our page's title
        # we can apply that formatting here
        getPreparedTitle: ->
            # if we have a document title, then we should use that and suffix the site's title onto it
            if @document.title
                "Stardog #{@version} Docs: #{@document.title}"
            # if our document does not have it's own title, then we should just use the site's title
            else
                @site.title

        # Get the prepared site/document description
        getPreparedDescription: ->
            # if we have a document description, then we should use that, otherwise use the site's description
            @document.description or @site.description

        # Get the prepared site/document keywords
        getPreparedKeywords: ->
            # Merge the document keywords with the site keywords
            @document.keywords or @site.keywords

    # =================================
    # Plugin Configuration

    # Skip Unsupported Plugins
    # Set to `false` to load all plugins whether or not they are compatible with our DocPad version or not
    skipUnsupportedPlugins: false  # default

    # Enable Unlisted Plugins
    # Set to false to only enable plugins that have been explicity set to `true` inside `enabledPlugins`
    enabledUnlistedPlugins: true  # default

    # Enabled Plugins
    enabledPlugins:  # example
        # Disable the Pokemon Plugin
        pokemon: false
        footnotes: true
        # Enable the Digimon Plugin
        # Unless, enableUnlistedPlugins is set to false, all plugins are enabled by default
        digimon: true
        frontmatter: false

    # Configure Plugins
    # Should contain the plugin short names on the left, and the configuration to pass the plugin on the right
    plugins:  # example
        footnotes:
            test: true
        markedOptions:
            gfm: true
            tables: true
            sanitize: false
            smartypants: true
        tableofcontents:
            requiredMetadataField: "toc"
            headerIdPrefix: "sd-"
            headerSelectors: "h2"
        watchOptions: preferredMethods: ['watchFile','watch']

    # =================================
    # Event Configuration

    # Events
    # Allows us to bind listeners to the events that DocPad emits
    # Complete event listing can be found here: http://docpad.org/docs/events
    events:  # example

        # Server Extend
        # Used to add our own custom routes to the server before the docpad routes are added
        serverExtend: (opts) ->
            # Extract the server from the options
            {server} = opts
            docpad = @docpad


    # =================================
    # Environment Configuration

    # Locale Code
    # The code we shall use for our locale (e.g. `en`, `fr`, etc)
    # If not set, we will attempt to detect the system's locale, if the locale can't be detected or if our locale file is not found for it, we will revert to `en`
    localeCode: null  # default

    # Environment
    # Which environment we should load up
    # If not set, we will default the `NODE_ENV` environment variable, if that isn't set, we will default to `development`
    env: null  # default

    # Environments
    # Allows us to set custom configuration for specific environments
    environments:  # default
        development:  # default
            # Always refresh from server
            maxAge: false  # default

            # Only do these if we are running standalone via the `docpad` executable
            checkVersion: process.argv.length >= 2 and /docpad$/.test(process.argv[1])  # default
            welcome: process.argv.length >= 2 and /docpad$/.test(process.argv[1])  # default
            prompts: process.argv.length >= 2 and /docpad$/.test(process.argv[1])  # default

            # Listen to port 9005 on the development environment
            port: 9005  # example
}

# Export the DocPad Configuration
module.exports = docpadConfig
