<%/* Startseite der Architektur-Doku. Aufbau und CSS-Klassen (dtc-*) stammen aus der
     Vorlage von docToolchain v4 (Task copyLandingPage); das Theme liefert Kopf, Menü und Fuß. */%>
<style>
    /* Workaround: Ab 768 px ist die Navigationsleiste des v4-Themes fixiert (75 px hoch),
       .dtc-landing hat aber nur 30 px Abstand nach oben; ohne diese Zeile verdeckt sie den Kopf.
       Refs docToolchain/docToolchain#1699 */
    @media (min-width: 768px) { .dtc-landing { padding-top: 100px; } }
</style>
<div class="dtc-landing">

    <section class="dtc-hero">
        <span class="dtc-tag">§ ARC42 / LERN-APPS</span>
        <h1>Ein Repository, ein Kern, <span class="grad">kein Server.</span></h1>
        <p class="lead">
            Alle Lern-Apps in einem Monorepo: Eleventy baut statisches HTML, Claude kommt als Tutor dazu.
        </p>
        <p class="dtc-hero-intro">
            Jede App liegt als Ordner unter <code>src/&lt;app&gt;/</code> und liefert nur Fachliches: Konfiguration,
            Kompetenzseiten, Generatoren, Bilder. Kern, Layout und Prüfungen gibt es einmal für alle. GitHub Pages
            liefert das Ergebnis aus; es gibt kein Backend, kein Konto und kein Tracking. <code>llms.txt</code> und
            <code>tutor.md</code> je App binden Claude als Tutor an.
        </p>
        <div class="dtc-cta">
            <a class="dtc-btn dtc-btn-primary" href="arc42/chapters/01_introduction_and_goals.html">Mit Kapitel 1 beginnen</a>
            <a class="dtc-btn dtc-btn-ghost" href="uebersicht/">Übersicht auf einen Blick</a>
            <a class="dtc-btn dtc-btn-ghost" href="../">Alle Apps öffnen</a>
        </div>
    </section>

    <div class="dtc-sec-head">
        <h2>Die Architektur läuft schon</h2>
        <p>Drei Apps, die Mathe-Karte und der Quellcode.</p>
    </div>
    <section class="dtc-features">
        <div class="dtc-card">
            <h3><a href="../binom/">Binomische Formeln</a></h3>
            <p>Mathe, Klasse 8: Klammern und binomische Formeln.</p>
        </div>
        <div class="dtc-card">
            <h3><a href="../prozent/">Prozent-Trainer</a></h3>
            <p>Mathe, Klasse 8: Prozentrechnung.</p>
        </div>
        <div class="dtc-card">
            <h3><a href="../zufall/">Zufall-Trainer</a></h3>
            <p>Mathe, Klasse 8: Wahrscheinlichkeitsrechnung.</p>
        </div>
        <div class="dtc-card">
            <h3><a href="../karte/">Mathe-Karte</a></h3>
            <p>Mathe-Kompetenzen der Sekundarstufe I nach Lehrplan, mit Apps und Lücken.</p>
        </div>
        <div class="dtc-card">
            <h3><a href="https://github.com/lernapps/lernapps.github.io">Quellcode auf GitHub</a></h3>
            <p>Das Monorepo samt dieser Doku (src/docs).</p>
        </div>
    </section>

    <div class="dtc-sec-head" style="margin-top:48px">
        <h2>Fünf Kapitel erklären die Architektur</h2>
        <p>Der schnelle Einstieg in die arc42-Dokumentation.</p>
    </div>
    <section class="dtc-features">
        <div class="dtc-card">
            <h3><a href="arc42/chapters/01_introduction_and_goals.html">Ziele</a></h3>
            <p>Kapitel 1: Aufgabe, Qualitätsziele, Stakeholder.</p>
        </div>
        <div class="dtc-card">
            <h3><a href="arc42/chapters/03_context_and_scope.html">Kontext</a></h3>
            <p>Kapitel 3: Zwei Menschen, fünf Nachbarsysteme, alles hängt an Links.</p>
        </div>
        <div class="dtc-card">
            <h3><a href="arc42/chapters/05_building_block_view.html">Bausteine</a></h3>
            <p>Kapitel 5: Build, Layout, Kern, Apps, Karte, Doku.</p>
        </div>
        <div class="dtc-card">
            <h3><a href="arc42/chapters/09_architecture_decisions.html">Entscheidungen</a></h3>
            <p>Kapitel 9: 19 ADRs mit Pugh-Matrix.</p>
        </div>
        <div class="dtc-card">
            <h3><a href="arc42/chapters/11_technical_risks.html">Risiken</a></h3>
            <p>Kapitel 11: Risiken, technische Schulden, offene Fragen.</p>
        </div>
    </section>

</div>
