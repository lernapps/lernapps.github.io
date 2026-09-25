// docToolchain-Konfiguration für die Architekturdokumentation (arc42) des Monorepos lern-apps.
// Aufruf: scripts/dtc-v4.sh generateSite  →  build/microsite/output/ (Pages-Workflow legt es nach _site/docs/).
// Theme-Overrides liegen in src/site/ (siteFolder); Eleventy ignoriert src/docs und src/site.

outputPath = 'build'
inputPath = 'src/docs'

inputFiles = [
    [file: 'arc42/arc42.adoc', formats: ['html']],
]

imageDirs = [
    'images/.',
]

failOnMissingImages = true

taskInputsDirs = ["${inputPath}"]
taskInputsFiles = []

customTasks = []

microsite = [:]
microsite.with {
    // Die Doku liegt auf GitHub Pages unter https://lernapps.github.io/docs/.
    // contextPath bleibt '/': das Theme macht daraus relative Pfade, die unter jedem Unterordner funktionieren.
    contextPath = '/'
    siteFolder = '../site'
    title = 'Lern-Apps · Architektur'
    footerMail = ''
    footerTwitter = ''
    footerSO = ''
    footerGithub = 'https://github.com/lernapps/lernapps.github.io'
    footerSlack = ''
    footerText = '<small class="text-white">Gebaut mit <a href="https://doctoolchain.org">docToolchain</a> und <a href="https://asciidoctor.org">Asciidoctor</a> · Vorlage: <a href="https://arc42.org">arc42</a></small>'
    issueUrl = 'https://github.com/lernapps/lernapps.github.io/issues/new'
    branch = System.getenv("DTC_PROJECT_BRANCH") ?: 'main'
    gitRepoUrl = 'https://github.com/lernapps/lernapps.github.io/edit/main/src/docs'
    landingPage = 'landingpage.gsp'
    // Markenfarbe der Lern-App (wie favicon.svg und theme_color im Web-Manifest).
    // Kontrast: #1d4ed8 auf Karte/Hintergrund 6,0-6,7:1, weiße Schrift auf Button 6,7:1; Links #1e40af 7,9:1.
    colorPrimary     = '#1d4ed8'
    colorPrimaryDark = '#1e3a8a'
    colorLink        = '#1e40af'
    menu = [uebersicht: 'Übersicht', abgrenzung: 'Was lernapps anders macht', arc42: 'Architektur (arc42)']
    additionalConverters = [:]
}

jbake = [:]
jbake.with {
    plugins = []
    asciidoctorAttributes = []
}
