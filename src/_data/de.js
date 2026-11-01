// All texts of the site's pages (German); en.js is the English translation, with the same structure. Templates contain no copy of their own.
// The home page tells one story: the promise, what each role gets (teachers, parents, students; the details on one page
// per role), real apps, a solid foundation for makers, why another platform (it belongs to no company), how to join,
// and why the founder does this. Details live on two pages:
// features (principles, what the apps can do, and technical transparency for developers) and about (the long story).
// Language: plain German (ISO 24495-1): short sentences, active voice, no jargon, "du".
export default {
  meta: {
    title: "lernapps.net — Lern-Apps ohne Haken",
    description:
      "Kleine Lern-Apps, gemacht von Eltern und Lehrkräften: kostenlos im Browser, ohne Konto, ohne Werbung, ohne Abo. Und ein solides Fundament für alle, die selbst eine App bauen wollen.",
  },

  landing: {
    // Einstieg nach Rollen: Lehrkräfte, Eltern und Schüler sehen auf einen Blick, was sie davon haben. Je Rolle die
    // stärksten Motivatoren (Plattform-Design, E2), die übrigen auf der Seite der Rolle. Eine leise Zeile spricht alle
    // an, die schon mit einem Coding-Agenten gearbeitet haben: Sie können eine eigene App bauen.
    hero: {
      headline: "Lern-Apps, die [[sofort helfen]].",
      subtitle: "Gemacht von Lehrkräften und Eltern, für alle. Kostenlos im Browser, ohne Konto.",
      pick: "Ich bin …",
      roles: [
        {
          id: "teachers", tab: "Ich unterrichte", tabShort: "Lehrkräfte",
          value: "Apps, mit denen deine Schüler selbst lernen.",
          points: [
            "Du findest in Minuten eine App zu Fach und Klassenstufe, auch für die Vertretung.",
            "Lass deine Schüler ausprobieren und üben, jeden mit sofortiger Rückmeldung.",
            "Du gibst keine Daten deiner Schüler heraus: kein Konto, keine Werbung, kein Tracking.",
          ],
          actions: [{ label: "App-Katalog", href: "/apps/" }],
          more: "Mehr für Lehrkräfte", moreHref: "/teachers/",
        },
        {
          id: "parents", tab: "Ich bin Mutter oder Vater", tabShort: "Eltern",
          value: "Hilfe für dein Kind, wo du nicht weiterkommst.",
          points: [
            "Du findest eine App, die deinem Kind Schritt für Schritt erklärt, was es gerade lernt.",
            "Fotografier vor der Klassenarbeit das Arbeitsblatt: Dein KI-Assistent macht daraus eine Übung.",
            "Du zahlst nichts, auch später nicht: keine Werbung, kein Abo, keine Anmeldung.",
          ],
          actions: [{ label: "App-Katalog", href: "/apps/" }, { label: "Für eine Arbeit üben", href: "/practice/" }],
          more: "Mehr für Eltern", moreHref: "/parents/",
        },
        {
          id: "students", tab: "Ich gehe zur Schule", tabShort: "Schüler",
          value: "Lern in deinem Tempo, bis es sitzt.",
          points: [
            "Such dein Thema und lass es dir Schritt für Schritt erklären.",
            "Üb vor der Arbeit genau den Stoff, der drankommt.",
            "Du bekommst Tipps von deiner KI, auch der kostenlosen, bis du es selbst schaffst.",
            "Probier dich aus: kein Konto, keine Note, keiner schaut zu.",
          ],
          actions: [{ label: "App-Katalog", href: "/apps/" }, { label: "Für eine Arbeit üben", href: "/practice/" }],
          more: "Mehr für Schüler", moreHref: "/students/",
        },
      ],
      maker: {
        text: "Du hast schon mal mit einem Coding-Agenten gearbeitet? Dann kannst du deine eigene Lern-App bauen. Unsere Grundgerüste und Anleitungen geben ihm, was er braucht, und die App bleibt deine.",
        link: "Eine App bauen",
        href: "/apps/build/",
      },
    },

    // Galerie: eine App groß, die anderen als Vorrat daneben. Nur Beispiele, der Katalog hat mehr.
    gallery: {
      id: "beispiele",
      heading: "Aus dem Katalog",
      label: "Beispiele",
      more: "Mehr im App-Katalog",
      moreHref: "/apps/",
      apps: [
        { id: "mathe-karte", dark: true, title: "Mathe-Karte", field: "Mathematik", line: "Mathe Schritt für Schritt erklärt, mit Bild und Aufgaben.", href: "/apps/mathe-karte/", altDesktop: "Mathe-Karte am Computer: Aufgabe zum Prozentsatz mit Rechnung und Balkenbild", altPhone: "Mathe-Karte am Handy: Rechnung und Balkenbild" },
        { id: "kniffel-trainer", title: "Kniffel-Trainer", field: "Mathematik", line: "Wahrscheinlichkeit spielerisch verstehen beim Kniffeln.", href: "/apps/kniffel-trainer/", altDesktop: "Kniffel-Trainer am Computer: Würfel und Kniffelblock im Erklärmodus", altPhone: "Kniffel-Trainer am Handy: Würfel und Kniffelblock" },
        { id: "textcheck", dark: true, title: "Textcheck", field: "Deutsch", line: "Aufmerksam lesen: Fehler im Text finden.", href: "/apps/textcheck/", altDesktop: "Textcheck am Computer: Text über Pyramiden mit einem markierten Wort", altPhone: "Textcheck am Handy: Text über Pyramiden mit einem markierten Wort" },
        { id: "naturwunder-quiz", dark: true, title: "Naturwunder-Quiz", field: "Erdkunde", line: "Erdkunde-Quiz mit einer Erklärung zu jeder Antwort.", href: "/apps/naturwunder-quiz/", altDesktop: "Naturwunder-Quiz am Computer: Frage zur Höhe des Mount Everest mit Foto", altPhone: "Naturwunder-Quiz am Handy: Frage zur Höhe des Mount Everest mit Foto" },
      ],
    },

    // KI: nur der Tutor, in einem Satz. Die Details stehen auf /tutor/ (tutor).
    ki: {
      id: "ki",
      heading: "Dein eigener [[Tutor]].",
      text: "Jede Erklär-App gibt deinem KI-Assistenten die Aufgabe. Er begleitet dich geduldig, und lernapps.net erfährt nichts davon.",
      cta: "So funktioniert der Tutor",
      ctaHref: "/tutor/",
    },

    // Für Macher: Mitmachen und Fundament in einem Abschnitt. Die id "mitmachen" steht im Hero-Knopf "Selbst bauen".
    maker: {
      id: "mitmachen",
      heading: "Du bringst die [[Idee]]. Wir bringen das Fundament.",
      you: { title: "Du", text: "Idee, Fachwissen, Erfahrung aus Klasse und Küchentisch." },
      we: { title: "Wir", text: "Grundgerüste, Methodik, Werkzeuge zum Bauen, Prüfen und Eintragen." },
      note: "Dein KI-Assistent hilft beim Bauen, und die App bleibt deine.",
      cta: "Eine App bauen",
      ctaHref: "/apps/build/",
      link: "Was die Apps können",
      linkHref: "/features/#nutzer",
    },

    platform: {
      id: "plattform",
      heading: "Noch eine Plattform? Diese gehört [[keiner Firma]].",
      points: [
        { title: "Niemand verdient daran", text: "Kein Abo, keine Werbung, kein Datenverkauf." },
        { title: "Ein Ort zum Austausch", text: "Rückmeldung und Danke kommen bei den Machern an." },
        { title: "Offen", text: "Regeln, Plan und Quellcode sind öffentlich." },
      ],
      link: "Alle Prinzipien",
      linkHref: "/features/#prinzipien",
    },

    founder: {
      quote: "Es fehlt nicht an Tablets und WLAN. Es fehlt ein Ökosystem, das gute Ideen dorthin bringt, wo sie gebraucht werden.",
      signature: "Oliver Jägle",
      role: "Gründer von lernapps.net",
      link: "Mehr über uns",
      linkHref: "/about/",
    },

    cta: {
      title: "Finde eine App für morgen. Oder bau die, die fehlt.",
      primary: "App finden",
      primaryHref: "/apps/",
      secondary: "Eine App bauen",
      secondaryHref: "/apps/build/",
    },
  },

  // ── ROLLEN: je eine Seite für Lehrkräfte, Eltern und Schüler ────────────────
  // Alle Motivatoren der Rolle (Plattform-Design, E2). Zwei Teile: Apps nutzen (auch eine App nur für sich, etwa vor
  // einer Arbeit) und eine App für andere bauen. Die Schüler-Seite hat nur den ersten Teil.
  roles: {
    home: "Startseite",
    parts: { use: "Apps nutzen", build: "Eine App für andere bauen" },
    teachers: {
      name: "Lehrkräfte",
      meta: {
        title: "Für Lehrkräfte — lernapps.net",
        description: "Lern-Apps für den Unterricht: in Minuten zu Thema und Klasse, Datenschutz geklärt, die Klasse probiert selbst aus. Und dein eigenes Material als App.",
      },
      crumb: "Für Lehrkräfte",
      headline: "Apps, mit denen deine Schüler [[selbst lernen]].",
      subtitle: "Kleine Apps zum Ausprobieren und Üben, gemacht von Kolleginnen und Kollegen. Im Browser, ohne Konto, auf den Geräten, die deine Schule hat.",
      primary: "App-Katalog", primaryHref: "/apps/",
      partHints: { use: "Für die nächste Stunde", build: "Aus deinem Material" },
      use: {
        heading: "Apps finden und einsetzen",
        lead: "Für die nächste Stunde, ohne Vorbereitung am Vorabend.",
        items: [
          { title: "Du übernimmst kurzfristig eine Klasse, vielleicht fachfremd", text: "Wähle Fach, Thema und Klasse. Die Apps erklären selbst, was zu tun ist, auch wenn es nicht dein Fach ist.", points: ["Per Link, QR-Code oder Beamer in die Klasse", "Läuft auf Tablet, Laptop und Handy"], link: "Katalog durchsuchen", href: "/apps/" },
          { title: "Für die nächste Stunde fehlt eine passende Übung", text: "Dein KI-Assistent macht aus deinem Material eine Übungs-App, genau zu deinem Stoff. Sie läuft für eine Weile unter lernapps.net, ohne dass du etwas veröffentlichst.", link: "Eine Übung machen lassen", href: "/practice/" },
          { title: "Deine Klasse soll selbst etwas tun", text: "In den Apps probieren die Kinder aus, entscheiden und üben. Sie sehen sofort, ob es stimmt, statt nur zuzuschauen.", link: "Beispiel: Wahrscheinlichkeit mit dem Kniffel-Trainer", href: "/apps/kniffel-trainer/" },
          { title: "Du trägst die Verantwortung für den Datenschutz", text: "Jede App läuft unter lernapps.net, mit einer Datenschutzerklärung für alle. Du kannst sie deiner Schulleitung weitergeben.", points: ["Kein Konto, keine Cookies, kein Tracking", "Nichts geht ohne Klick an Dritte; was eine App lädt, wird geprüft"], link: "Datenschutzerklärung für die Schule", href: "/privacy/" },
          { title: "Einige Kinder brauchen gerade dich", text: "Die App begleitet die Klasse beim Üben, jedes Kind in seinem Tempo und mit Rückmeldung. So hast du die Hände frei für die Kinder, die besondere Aufmerksamkeit brauchen." },
        ],
      },
      build: {
        heading: "Eine App für andere bauen",
        lead: "Dein KI-Assistent baut, du bringst Stoff und Erfahrung. Andere Klassen lernen mit, und die App bleibt deine.",
        items: [
          { title: "Du willst dein Material digital machen", text: "Wähle die Inhalte, die digital am meisten gewinnen. Nach und nach entsteht dein eigener digitaler Bestand, den auch andere Klassen nutzen können.", points: ["Selbstkontrolle: Die Kinder sehen selbst, ob es stimmt", "Interaktivität: ausprobieren, verschieben, entscheiden", "KI-Tutor: begleitet bei der Aufgabe, mit Hinweisen statt Lösungen"], link: "Eine App bauen", href: "/apps/build/" },
        ],
      },
      thanks: { heading: "Hat es geholfen? Sag Danke.", text: "lernapps.net ist kostenlos. Ein Danke nach der Stunde kostet einen Klick und zeigt denen, die die App gemacht haben, dass sie hilft." },
    },
    parents: {
      name: "Eltern",
      meta: {
        title: "Für Eltern — lernapps.net",
        description: "Lern-Apps für dein Kind: erklären Schritt für Schritt, ohne Werbung und ohne Konto. Übungs-Apps vor der Arbeit. Und dein Wissen als App für viele Kinder.",
      },
      crumb: "Für Eltern",
      headline: "Hilfe für dein Kind, wo du [[nicht weiterkommst]].",
      subtitle: "Kleine Apps, die erklären und üben lassen, gemacht von Lehrkräften und Eltern. Kostenlos im Browser, ohne Konto.",
      primary: "App-Katalog", primaryHref: "/apps/",
      partHints: { use: "Für dein Kind, auch vor der Arbeit", build: "Aus deinem Wissen" },
      use: {
        heading: "Eine App für dein Kind",
        lead: "Wenn dir die Zeit fehlt oder das Thema zu lange her ist.",
        items: [
          { title: "Dein Kind versteht ein Thema nicht, und du kannst nicht helfen", text: "Wähle Thema und Klasse. Die App erklärt Schritt für Schritt, mit Bildern, Übungen und Rückmeldung. Du musst den Stoff nicht selbst können.", link: "Katalog durchsuchen", href: "/apps/" },
          { title: "Bald ist die Arbeit", text: "Fotografiere die Arbeitsblätter. Dein KI-Assistent macht daraus eine Übungs-App genau zum Stoff, in wenigen Minuten. Die Fotos gehen nur an deinen Assistenten.", link: "Für eine Arbeit üben", href: "/practice/" },
          { title: "Du fragst dich, was die App mit deinem Kind macht", text: "Alle Apps laufen unter lernapps.net und folgen denselben Regeln. Du musst keine fremde Seite beurteilen.", points: ["Keine Werbung, kein Abo, keine Käufe in der App", "Kein Konto; Eingaben bleiben auf dem Gerät"], link: "Unsere Regeln", href: "/features/#prinzipien" },
          { title: "Dein Kind soll allein weiterkommen", text: "Dein Kind kommt wieder, so oft es braucht, und findet die nächste App selbst. Ein Lesezeichen genügt." },
        ],
      },
      build: {
        heading: "Eine App für andere bauen",
        lead: "Mit deinem KI-Assistenten, auch ohne Programmierkenntnisse. Viele Kinder lernen mit, und die App bleibt deine.",
        items: [
          { title: "Du kannst etwas gut und willst es weitergeben", text: "Aus deinem Wissen wird eine App, dort wo sie digital am meisten gewinnt: Die Kinder kontrollieren sich selbst, probieren aus oder fragen einen KI-Tutor. Viele Kinder lernen damit, nicht nur deins, und du erfährst, dass sie geholfen hat.", link: "Eine App bauen", href: "/apps/build/" },
        ],
      },
      thanks: { heading: "Hat es geholfen? Sag Danke.", text: "lernapps.net ist kostenlos. Ein Danke kostet einen Klick und zeigt denen, die die App gemacht haben, dass sie hilft." },
    },
    students: {
      name: "Schüler",
      meta: {
        title: "Für Schüler — lernapps.net",
        description: "Lern-Apps für dich: ein Thema in deinem Tempo verstehen, vor der Arbeit üben, mit einem geduldigen KI-Tutor. Ohne Konto, ohne Note.",
      },
      crumb: "Für Schüler",
      headline: "Lern in deinem Tempo, [[bis es sitzt]].",
      subtitle: "Kleine Apps zum Ausprobieren und Üben. Öffnen und loslegen, ohne Anmeldung.",
      primary: "App-Katalog", primaryHref: "/apps/",
      use: {
        heading: "So helfen dir die Apps",
        lead: "Such dein Thema, öffne die App, leg los.",
        items: [
          { title: "Du verstehst ein Thema noch nicht", text: "Such dein Thema und deine Klasse. Die App erklärt Schritt für Schritt. Du kannst es dir so oft ansehen, wie du willst.", link: "Katalog durchsuchen", href: "/apps/" },
          { title: "Bald ist die Arbeit", text: "Üb genau den Stoff, der drankommt, bis er sitzt. Findest du keine passende App, macht dein KI-Assistent dir eine aus deinen Arbeitsblättern, nur für dich.", link: "Für eine Arbeit üben", href: "/practice/" },
          { title: "Du brauchst jemanden, der geduldig erklärt", text: "In jeder Erklär-App kannst du die Aufgabe an deinen KI-Assistenten geben. Er gibt dir Hinweise statt Lösungen, auch abends. lernapps.net erfährt nichts davon.", link: "So funktioniert der Tutor", href: "/tutor/" },
          { title: "Du willst üben, ohne dass jemand zuschaut", text: "Kein Konto, keine Note. Niemand weiß, wer du bist. Fehler sind erlaubt, so lernst du." },
          { title: "Du willst selbst ausprobieren", text: "Viele Apps lassen dich etwas tun: würfeln, verschieben, entscheiden. So merkst du selbst, wie es funktioniert.", link: "Beispiel: Kniffel-Trainer", href: "/apps/kniffel-trainer/" },
        ],
      },
      thanks: { heading: "Hat es geholfen? Sag Danke.", text: "Ein Klick genügt. So erfahren die, die die App gemacht haben, dass sie dir geholfen hat." },
    },
    also: "Auch für:",
  },

  // ── FEATURES: for users, for developers, and what makes the platform unique ─
  features: {
    meta: {
      title: "Features — lernapps.net",
      description: "Was die Apps können, was du beim Bauen bekommst, und was lernapps.net einzigartig macht: ohne Server, ohne Firma, ohne Datensammeln, mit GitHub als kostenlosem Rückgrat.",
    },
    hero: {
      headline: "Was lernapps ausmacht",
      subtitle: "Für alle, die Apps einsetzen. Für alle, die Apps bauen. Und was die Plattform dahinter einzigartig macht.",
      jump: [
        { label: "Für Nutzer", href: "#nutzer" },
        { label: "Für Entwickler", href: "#entwickler" },
        { label: "Die Plattform", href: "#plattform" },
      ],
    },
    users: {
      id: "nutzer",
      kicker: "Für Lehrkräfte, Eltern und Lernende",
      heading: "Was die Apps können",
      intro: "Jede App baut auf einem von drei Grundgerüsten auf. Darum bedient man sie überall ähnlich, und in jeder steckt dieselbe Sorgfalt.",
      archetypes: [
        { icon: "circle-help", title: "Quiz", text: "Fragen mit Antworten zur Auswahl. Nach jeder Antwort steht, warum sie stimmt oder nicht, und wo man weiterlesen kann." },
        { icon: "book-open", title: "Erklär-App", text: "Kapitel mit Seiten, die erklären. Auf jeder Seite gibt es Übungen. Die Seiten sind auch ohne JavaScript lesbar.", extra: "Wer will, nimmt einen KI-Tutor dazu: Die App gibt dem eigenen KI-Assistenten die Aufgabe, die Lösung und die typischen Fehler. Das ist freiwillig. Die App funktioniert ganz ohne KI und sendet selbst nichts." },
        { icon: "gamepad-2", title: "Interaktive App", text: "Lernen durch Tun: ein Spiel, ein Training, ein Versuch. Was die Lernenden tun, ist der Inhalt." },
      ],
      items: [
        { title: "Am Lehrplan orientiert", text: "Der Inhalt kommt aus dem Lehrplan des Landes und dem Material der Lehrkraft. Jede App sagt, was man danach kann." },
        { title: "Übungen mit Rückmeldung", text: "Eine falsche Antwort erklärt, warum sie falsch ist. Dann kann man es noch einmal versuchen." },
        { title: "Ein Link führt genau dorthin", text: "Zum Thema, zum Abschnitt oder zu genau der Aufgabe, die die ganze Klasse rechnen soll. Auch als QR-Code." },
        { title: "Von Menschen gemacht", text: "Jede App kommt von einer Lehrkraft, einem Elternteil oder jemandem, der gern baut. Wir helfen beim Bauen, aber eine Garantie für die Qualität ist das nicht. Fehler im Inhalt meldest du mit einem Klick auf der Seite der App." },
        { title: "Barrierearm", text: "Die Apps erfüllen WCAG 2.1 AA und laufen ab 360 Pixel Breite. Wo eine App das nicht kann, sagt sie es im Katalog." },
        { title: "Läuft auf jedem Gerät", text: "Im Browser, ohne Installation: am Beamer, auf Tablets der Klasse oder auf dem Handy zu Hause." },
      ],
      cta: "Apps finden",
      ctaHref: "/apps/",
    },
    developers: {
      id: "entwickler",
      kicker: "Für Entwicklerinnen und Entwickler",
      heading: "Was du beim Bauen bekommst",
      intro: "Du bringst die Idee und den Inhalt. lernapps.net gibt dir Grundgerüste, Werkzeuge und Anleitungen für deinen KI-Assistenten. Und es sagt offen, was du einhältst, wenn du eine App beiträgst.",
      blocks: [
        {
          id: "stack",
          title: "Grundgerüste, oder dein eigener Stack",
          text: "Mit unserem Tooling legst du eine App aus einem Grundgerüst an: Quiz, Erklär-App oder interaktive App. Prüfungen laufen dann schon beim Commit und in der CI.\n\nDu kannst aber auch frei bauen, mit jedem Stack. Dann gelten nur die Plattformregeln: nichts sammeln, kein Konto, keine Werbung, barrierearm, ab 360 Pixel nutzbar, keine fremden Server vor einem Klick. Abhängigkeiten brauchen eine offene Lizenz.",
        },
        {
          id: "assistent",
          title: "Gemacht für deinen KI-Assistenten",
          text: "Skills, ein Plan und Regeln mit festen IDs führen deinen Assistenten durch die Arbeit: fragen, planen, bauen, prüfen, veröffentlichen, eintragen. Du entscheidest an festen Punkten mit.\n\nWie genau verschiedene Assistenten diesen Anleitungen folgen, testen wir und veröffentlichen die Ergebnisse.",
        },
        {
          id: "pruefung",
          title: "Wie eine App in den Katalog kommt",
          steps: [
            "Du veröffentlichst die App in deinem eigenen Repository, unter deiner eigenen Adresse.",
            "Du reichst sie ein: als Pull Request an lernapps/apps, ohne GitHub auch per Formular oder E-Mail. Einreichen kann jeder.",
            "Eine automatische Prüfung öffnet die App wie Lernende und vergleicht sie mit dem Eintrag: Lassen sich alle Themen öffnen, stimmen die Angaben?",
            "Geprüft wird gegen die Regeln für jede App. Sie sind Ausschlusskriterien: Wer etwas sammelt, ein Konto verlangt oder Werbung zeigt, kommt nicht in den Katalog. Ein KI-Agent kann die App zusätzlich anhand einer Checkliste begutachten.",
            "Erfüllt die App die Regeln, wird sie aufgenommen, und lernapps.net liefert eine Kopie von ihr aus. Für eine fertige App dauert das alles zusammen wenige Stunden.",
          ],
        },
        {
          id: "rueckmeldung",
          title: "Rückmeldungen kommen bei dir an",
          text: "Wer deine App nutzt, kann Danke sagen oder zurückmelden, wie es lief, bis hin zu „Fehler im Inhalt“. Heute ist das eine E-Mail an lernapps.net, und wir geben sie an dich weiter.\n\nLiegt dein Quellcode auf GitHub, kann man dir außerdem direkt von der Seite der App ein Issue in deinem Repository anlegen.",
        },
        {
          id: "eigentum",
          title: "Eigentum und Lizenz",
          text: "Deine App liegt in deinem Repository, unter deiner Adresse und deiner Lizenz. Der Katalog verlinkt sie nur. Wir empfehlen offene Lizenzen: MIT oder Apache 2.0 für den Code, CC BY 4.0 für die Inhalte. So können andere deine App weiterentwickeln, und dein Name bleibt dabei.\n\nInhalte anderer, etwa Texte oder Bilder, nutzt du nur mit passender Lizenz und nennst Quelle und Lizenz. Die Plattform selbst und das Tooling stehen unter der MIT-Lizenz.",
        },
      ],
      links: [
        { label: "Die Regeln für jede App", href: "/tooling/rules/" },
        { label: "Das Tooling", href: "/tooling/" },
        { label: "Wie wir die Anleitungen testen", href: "/tooling/prompt-engineering/" },
      ],
      note: "Die technischen Unterlagen sind auf Englisch.",
      cta: "Eine App bauen",
      ctaHref: "/apps/build/",
    },
    platform: {
      id: "plattform",
      kicker: "Was lernapps.net einzigartig macht",
      heading: "Ohne Server. Ohne Firma. Ohne Datensammeln.",
      intro: "Die meisten Lernplattformen brauchen Server, Konten und ein Geschäftsmodell. lernapps.net ist anders gebaut. Darum kann es kostenlos bleiben.",
      unique: [
        { id: "kosten", icon: "git-branch", title: "GitHub als kostenloses Rückgrat", text: "Darum funktioniert es ohne Geld: Apps und Katalog sind statische Seiten auf GitHub Pages. Ein Eintrag ist ein Pull Request, die Prüfung läuft in GitHub Actions. Es gibt keinen eigenen Server, der Geld kostet." },
        { id: "daten", icon: "lock", title: "Datenschutz als Feature", text: "Jede App läuft ganz im Browser. Es gibt keinen Server mit Daten, keine Datenbank und keine Konten. Was nicht gesammelt wird, kann auch nicht verloren gehen oder verkauft werden.", link: { label: "Die Datenschutzerklärung", href: "/privacy/" } },
        { id: "ki", icon: "bot", title: "Lesbar für KI-Assistenten", text: "Jeder Bereich von lernapps.net hat eine llms.txt. So findet ein Assistent die passende App, erklärt die Plattform oder baut selbst eine App. Ohne dass jemand eine Schnittstelle betreiben muss." },
        { id: "offen", icon: "compass", title: "Offen geplant", text: "Wir haben lernapps.net mit dem Platform Design Toolkit entworfen: wer beteiligt ist, was alle davon haben, was wir als Erstes ausprobieren. Alles ist öffentlich, auch was wir noch nicht wissen." },
      ],
      principles: {
        id: "prinzipien",
        heading: "Die Prinzipien",
        intro: "Sie gelten für alle gleich: für die, die Apps bauen, und für die, die sie einsetzen.",
        items: [
          { icon: "handshake", title: "Keine Firma dahinter", text: "Niemand verdient an lernapps.net. Kein Abo, keine Werbung, kein Verkauf von Daten. Auch später nicht." },
          { icon: "folder-open", title: "Offen statt geschlossen", text: "Die Regeln, der Plan und der Quellcode sind öffentlich. Jeder kann nachlesen, wie hier entschieden wird." },
          { icon: "house", title: "Deine App bleibt deine", text: "Jede App liegt bei dem, der sie gebaut hat. lernapps.net zeigt sie, besitzt sie aber nicht." },
          { icon: "lock", title: "Die Apps sammeln nichts", text: "Kein Konto, keine Cookies, kein Tracking. Was eingegeben wird, bleibt auf dem Gerät." },
          { icon: "message-circle", title: "Ehrlich über Grenzen", text: "Jede App sagt, was sie kann und was nicht. Wir sagen offen, was wir noch nicht wissen." },
          { icon: "heart", title: "Danke statt Geld", text: "Wer eine App nutzt, kann Danke sagen. Heute öffnet ein Klick eine fertige E-Mail an lernapps.net, und wir geben das Danke an den weiter, der die App gebaut hat. Später soll ein Klick genügen, ganz ohne E-Mail." },
        ],
      },
      links: [
        { label: "So ist es gedacht", href: "/docs/" },
        { label: "Das Plattform-Design", href: "/docs/platform-design/" },
        { label: "Der Quellcode", href: "https://github.com/lernapps" },
      ],
    },
  },


  // ── TUTOR: die Lernbegleitung der Erklär-Apps, parallel zum Tooling (KI beim Bauen) ─
  // Beschreibt ein Feature des Explainers, keinen Dienst der Plattform: Es gibt keine KI auf lernapps.net, keinen Server und keinen Chatbot.
  // Die Lerninhalte sind lesbar und referenzierbar; der Assistent des Lernenden nutzt sie, lernapps.net erfährt nichts davon.
  tutor: {
    meta: {
      title: "Tutor — lernapps.net",
      description: "Lern mit dem KI-Assistenten, den du schon hast: Er kennt jede Seite und jede Aufgabe der Erklär-Apps und hilft dir genau dort, wo es hakt. lernapps.net bekommt davon nichts mit.",
    },
    hero: {
      headline: "Dein Tutor, nicht unserer.",
      subtitle: "Lern mit dem KI-Assistenten, den du schon hast. Er kennt jede Seite und jede Aufgabe der App. Er erklärt dir, wo es hakt, und schickt dich zur passenden Übung. lernapps.net bekommt davon nichts mit.",
      jump: [
        { label: "Datenschutz", href: "#datenschutz" },
        { label: "So funktioniert's", href: "#tutor" },
        { label: "Wie der Tutor arbeitet", href: "#regeln" },
        { label: "Grenzen", href: "#grenzen" },
      ],
    },
    about: {
      id: "tutor",
      label: "So funktioniert's",
      heading: "Hilfe genau bei deiner Aufgabe",
      text: "Allgemeine Erklärungen findest du überall. Dein Tutor weiß mehr: Er kann jede Seite der App lesen. Er sieht, welche Aufgabe du gerade machst und was du eingegeben hast. Darum hilft er dir genau an der Stelle, an der du hängst. Geduldig, und wann immer du ihn brauchst.",
      cta: "Selbsteinschätzung ausprobieren",
      ctaHref: "/mathe-karte/einschaetzung/",
    },
    dialog: {
      label: "Beispiel: Gespräch mit einem Tutor",
      you: "Du",
      assistant: "Assistent",
      lines: [
        { mine: true, parts: ["Ich habe auf ", { label: "Laplace-Formel", href: "/mathe-karte/zufall/laplace/" }, " geübt:\n- laplace-zaehlen, Nr. 54: richtig im 1. Versuch.\n- laplace-urne, Nr. 56: noch nicht gelöst (1 Versuch, Eingabe 0,16). Die App sagt: „Lies dazu noch einmal den Text über der Aufgabe.“\nSitzung: 1 von 2 richtig."] },
        { parts: ["Ich schaue mir die Aufgabe 56 direkt an, um dir gezielt zu helfen."] },
        { step: "Seite geöffnet", link: { label: "Laplace-Formel", href: "/mathe-karte/zufall/laplace/" } },
        { parts: ["Stark, dass Nummer 54 gleich im ersten Versuch saß! Bei Nummer 56: Deine Zahl 0,16 liegt ganz knapp daneben – vermutlich hast du die Nachkommastellen abgeschnitten, statt auf zwei Stellen zu runden. Rechne noch mal: Wie viele Kugeln liegen insgesamt in der Urne, und wie viele davon sind blau? Dann teile die blauen durch alle und runde sauber auf zwei Nachkommastellen, und tippe das Ergebnis in der App ein."] },
        { mine: true, parts: ["ah, 0,17 – habe falsch gerundet"] },
      ],
      link: { label: "Das ganze Gespräch", href: "https://chat.mistral.ai/work/8d08a4d7-65ce-4a23-80b4-5ed9a581988d" },
    },
    process: {
      id: "ablauf",
      heading: "So läuft es ab",
      steps: [
        { title: "Finde heraus, wo du stehst", text: "Mach die Selbsteinschätzung. Danach weißt du für jede Seite, ob du sie schon kannst, noch einmal anschauen oder genau lesen solltest. Das Ergebnis bleibt auf deinem Gerät." },
        { title: "Nimm deinen Assistenten", text: "Claude, ChatGPT, Mistral Vibe oder jeden anderen über „Text kopieren“. Du nutzt das Konto, das du schon hast." },
        { title: "Lass dich führen", text: "Ein Klick gibt deinem Tutor dein Ergebnis. Er schickt dich gezielt zu den Seiten, die noch nicht sitzen. Du musst nicht selbst suchen." },
        { title: "Hol dir Hilfe, wenn es hakt", text: "Falsche Antwort? „Warum?“ gibt dem Tutor die Aufgabe, deine Eingabe und die Meldung der App. So hilft er dir genau dort weiter. „Zurück zum Tutor“ erzählt ihm, was du geschafft hast." },
        { title: "Sieh, was du dazugelernt hast", text: "Sitzt ein Kapitel, machst du eine neue Runde. Dann siehst du, was du jetzt kannst, und dein Tutor plant mit dir den nächsten Schritt." },
      ],
    },
    rules: {
      id: "regeln",
      label: "Wie der Tutor arbeitet",
      heading: "Ein Tutor, der dich selbst denken lässt",
      intro: "Ein KI-Assistent verrät dir sonst gern einfach die Lösung. Davon lernst du wenig. Darum gibt die App ihm klare Regeln mit.",
      items: [
        { icon: "circle-help", title: "Er verrät keine Lösung", text: "Er fragt, was du nicht verstehst, und führt dich mit kurzen Fragen Schritt für Schritt weiter. Den Weg gehst du selbst. Darum bleibt er hängen." },
        { icon: "book-open", title: "Er hält sich an die App", text: "Er erklärt mit den Seiten und Aufgaben der App, nicht mit erfundenen Beispielen. So passt seine Hilfe zu dem, was du gerade lernst." },
        { icon: "circle-check", title: "Gelöst wird in der App", text: "Zum Lösen schickt er dich zurück auf die Seite. Dort prüft die App deine Antwort, nicht der Chat." },
      ],
    },
    transparency: {
      id: "transparenz",
      heading: "Nichts davon ist versteckt",
      text: "Auf jeder Seite und bei der Selbsteinschätzung steht der Link „Ansehen, was dein Tutor bekommt“. Er zeigt den ganzen Auftrag, auch die Regeln, die eine App für ihr Fach ergänzt. Eltern und Lehrkräfte können ihn lesen, bevor ein Kind ihn weitergibt.",
      link: "Beispiel: der Auftrag zur Selbsteinschätzung „Wahrscheinlichkeit“",
      href: "/mathe-karte/zufall/einschaetzung/tutor/",
    },
    flow: {
      label: "Der Weg deiner Daten",
      steps: ["Selbsteinschätzung in der App", "Ein Klick kopiert dein Ergebnis", "Du fügst es bei deinem Assistenten ein", "Er schickt dich zur nächsten Seite"],
      noServer: "Kein Server von lernapps.net dazwischen.",
    },
    privacy: {
      id: "datenschutz",
      label: "Datenschutz",
      heading: "Ein KI-Tutor und Datenschutz? Wie passt das zusammen?",
      title: "Keine KI in lernapps.net",
      text: "Auf lernapps.net ist keine KI eingebaut, und wir betreiben keinen Chatbot. Die Apps machen ihre Lerninhalte nur für deinen Assistenten lesbar. Alles Weitere geschieht in deinem Assistenten, bei deinem Anbieter, dem du dort separat zugestimmt hast. lernapps.net erfährt davon nichts.\n\nDie App sendet nichts. Ein Klick gibt dem Assistenten dein Ergebnis und deine Eingaben, den Auftrag kannst du vorher lesen. Das ist freiwillig. Ohne KI geht alles auch.",
      link: "Zur Datenschutzerklärung",
      href: "/privacy/#de-ki",
    },
    limits: {
      id: "grenzen",
      heading: "Was ein KI-Tutor nicht kann",
      items: [
        { title: "Menschen ersetzen.", text: "Gemeinsam lernen ist etwas Soziales, und das ist wichtig für uns als Gesellschaft. Ein KI-Assistent ist geduldig und immer da. Kommst du nicht weiter, such dir ruhig auch einen echten Menschen, am besten jemanden, den du magst. Vielleicht schafft ihr es zusammen mit dem KI-Tutor, auch wenn sich der andere gar nicht so genau auskennt." },
        { title: "Fehlerfrei sein.", text: "KI-Modelle werden immer besser, und auch Menschen machen Fehler. Garantieren kann aber niemand, dass dein Tutor sich nie irrt. Geprüft sind die Seiten der App: Widerspricht dein Tutor einer Seite, gilt die Seite." },
        { title: "Sich an jede Regel halten.", text: "Wir können deinen Assistenten nicht kontrollieren. Die Regeln sind eine Bitte an ihn, keine Garantie." },
        { title: "Unverzichtbar sein.", text: "Du brauchst ihn nicht. Die Seiten, die Übungen und die Rückmeldungen der App („Leider nicht richtig. Zähle zuerst alle möglichen Ergebnisse …“) funktionieren auch ohne Assistent." },
      ],
    },
    cta: {
      title: "Probier es aus.",
      description: "Mach die Selbsteinschätzung. Ob du danach einen Tutor dazunimmst, entscheidest du.",
      primary: "Selbsteinschätzung der Mathe-Karte",
      primaryHref: "/mathe-karte/einschaetzung/",
      secondary: "Alle Apps",
      secondaryHref: "/apps/",
    },
  },


  // ── JOIN: one block per persona, each with a prompt for their AI assistant ─
  join: {
    meta: {
      title: "Mitmachen — lernapps.net",
      description: "Wie du bei lernapps.net mitmachst: als Lehrkraft, als Elternteil, beim Lernen, mit einer eigenen App oder an der Plattform selbst. Mit einem Auftrag für deinen KI-Assistenten.",
    },
    hero: {
      headline: "Mitmachen",
      subtitle: "lernapps.net lebt von Menschen, die Apps bauen, und von Menschen, die sie einsetzen und Danke sagen. Such dir aus, wo du stehst.",
    },
    askBox: {
      title: "Frag deinen KI-Assistenten",
      intro: "Kopier diesen Text in deinen KI-Assistenten. Er liest lernapps.net und erklärt dir, was die Plattform für dich tut.",
      copy: "Text kopieren",
      copied: "Kopiert",
    },
    personas: [
      {
        id: "lehrkraefte", icon: "library", role: "Wenn du unterrichtest",
        headline: "Setz Apps ein und sag, wie es lief.",
        text: "Nutz eine App im Unterricht oder in der Vertretungsstunde. Danach kannst du mit einem Klick Danke sagen oder kurz rückmelden, ob sie gepasst hat. Erzähl Kolleginnen und Kollegen davon. Und wenn dir eine App fehlt: Sag es uns, oder bau sie selbst.",
        cta: "Apps finden", ctaHref: "/apps/",
        ask: "Ich unterrichte und suche digitale Lernangebote. Lies https://lernapps.net/llms.txt und die dort verlinkten Seiten. Erkläre mir in einfachen Worten, was lernapps.net ist, was die Plattform mir als Lehrkraft bietet und wie sie für Sicherheit sorgt. Wirf auch einen Blick in den Katalog: https://lernapps.net/apps/. Sei ehrlich über die Grenzen.",
      },
      {
        id: "eltern", icon: "house", role: "Wenn du ein Kind beim Lernen begleitest",
        headline: "Übt zusammen und sagt Danke.",
        text: "Such eine App zu dem Thema, bei dem dein Kind Hilfe braucht. Hat sie geholfen? Ein Danke zeigt dem, der sie gebaut hat, dass sich seine Arbeit lohnt. Und teil den Link mit anderen Eltern, etwa in der Klassengruppe.",
        cta: "Apps finden", ctaHref: "/apps/",
        ask: "Ich bin Elternteil und suche sichere Lern-Apps für mein Kind. Lies https://lernapps.net/llms.txt und die dort verlinkten Seiten. Erkläre mir in einfachen Worten, was lernapps.net ist, was die Plattform mir als Elternteil bietet und wie sie für Sicherheit sorgt. Wirf auch einen Blick in den Katalog: https://lernapps.net/apps/. Sei ehrlich über die Grenzen.",
      },
      {
        id: "lernende", icon: "backpack", role: "Wenn du selbst lernst",
        headline: "Probier aus, statt nur zuzuschauen.",
        text: "Such dir eine App zu deinem Thema. Du brauchst kein Konto, und niemand weiß, wer du bist. Gibt es noch keine? Vielleicht baust du mit deinem KI-Assistenten selbst eine.",
        cta: "Apps finden", ctaHref: "/apps/",
        ask: "Ich lerne gerade und suche etwas zum Ausprobieren. Lies https://lernapps.net/llms.txt und die dort verlinkten Seiten. Erkläre mir kurz, was lernapps.net ist, was es mir beim Lernen bringt und wie es für Sicherheit sorgt. Wirf auch einen Blick in den Katalog (https://lernapps.net/apps/): Gibt es dort schon etwas zu meinem Thema? Falls nicht: Überlege mit mir, ob wir zusammen selbst eine kleine App dafür bauen können.",
      },
      {
        id: "macher", icon: "wrench", role: "Wenn du eine App bauen willst",
        headline: "Bau die App, die noch fehlt.",
        text: "Du bringst die Idee und den Inhalt, dein KI-Assistent baut mit dir. lernapps.net gibt dir Grundgerüste, Werkzeuge und Prüfungen. Deine App bleibt deine. Wer sie nutzt, kann Danke sagen, und du erfährst davon.",
        cta: "Eine App bauen", ctaHref: "/apps/build/",
        secondary: "Du hast schon eine App? Trag sie ein, in wenigen Stunden", secondaryHref: "/apps/build/#eintragen",
        ask: "Ich baue gern kleine Lern-Apps mit KI-Hilfe. Lies https://lernapps.net/llms.txt und die dort verlinkten Seiten. Erkläre mir in einfachen Worten, was lernapps.net ist, was die Plattform Menschen wie mir bietet und was ich zurückbekomme, wenn jemand meine App nutzt. Sag mir ehrlich, ob sich das für mich lohnt.",
      },
      {
        id: "plattform", icon: "puzzle", role: "Wenn du an der Plattform mitarbeiten willst",
        headline: "Mach lernapps.net besser.",
        text: "Die Plattform ist offen: Doku, Tooling, Katalog und diese Seite liegen auf GitHub. Du kannst Fehler melden, Texte verbessern, am Tooling mitbauen oder mitdenken, wie es weitergeht.",
        cta: "So arbeitest du mit", ctaHref: "https://github.com/lernapps/.github/blob/main/CONTRIBUTING.md",
        secondary: "So ist es gedacht", secondaryHref: "/docs/",
        ask: "Ich möchte an lernapps.net mitarbeiten. Lies https://lernapps.net/llms.txt, https://lernapps.net/docs/llms.txt und https://github.com/lernapps/.github/blob/main/CONTRIBUTING.md. Erkläre mir in einfachen Worten, wie die Plattform aufgebaut ist, welche Repositories es gibt und wie ich einen ersten kleinen Beitrag leisten kann. Sei ehrlich, wo noch etwas fehlt.",
      },
    ],
  },


  // ── ABOUT: the long story behind lernapps.net ──────────────────────────────
  about: {
    meta: {
      title: "Über uns — lernapps.net",
      description: "Warum es lernapps.net gibt: Digitale Bildung in Deutschland hat kein Geräteproblem, sondern ein Ökosystem-Problem. Und eine ehrliche Antwort für Skeptiker.",
    },
    founder: {
      heading: "Seit Jahren reden alle vom Digitalisierungs\u00ADproblem der Schulen. Ich glaube, wir haben ein anderes.",
      text: "Politiker kündigen Programme an, Milliarden für Tablets und WLAN. Und dann heißt es wieder: Die Schulen hängen hinterher. Dabei fehlt es nicht an Geräten. Es fehlt an einem Ökosystem, das gute Ideen dorthin bringt, wo sie gebraucht werden.\n\nDiese Ideen gibt es längst. Eltern und Lehrkräfte bauen mit Leidenschaft Lern-Apps für ihr Kind oder ihre Klasse. Aber die Apps bleiben, wo sie entstanden sind. Wer sie einsetzen will, trägt das Risiko allein. Und wer sie gebaut hat, erfährt nie, ob sie geholfen hat.\n\nIch bin Softwareentwickler. Seit einiger Zeit sehe ich, wie leicht es geworden ist, kleine Apps zu bauen. Mit einem KI-Assistenten braucht man dafür kaum noch Zeit und Geld. In der Schule kommt davon trotzdem wenig an.\n\nIch will nicht weiter klagen. Ich will etwas tun. Und ich will, dass alle, denen gute Bildung am Herzen liegt, auch etwas tun können. Gerade jetzt, wo man sich an so vielen Stellen machtlos fühlt, ist das wichtig: zu sehen, dass die eigene Arbeit bei einem Kind ankommt, das man nie getroffen hat.\n\nDarum gründe ich lernapps.net. Geld will ich damit nicht verdienen. Ich will erst einmal sehen, ob es den Bedarf wirklich gibt. Wenn lernapps.net trägt, kann daraus zum Beispiel ein Verein werden. Dann gehört die Plattform denen, die sie mit Leben füllen.",
      signature: "Oliver Jägle",
      role: "Gründer von lernapps.net",
    },
    sceptics: {
      heading: "„Das funktioniert doch sowieso nicht.“",
      text: "Vielleicht. Wir wissen es noch nicht. Darum fangen wir klein an: mit wenigen Apps und wenigen Menschen, die sie bauen und einsetzen. Wir haben vorher aufgeschrieben, woran wir merken, ob es klappt. Und woran nicht.\n\nGeplant haben wir lernapps.net mit dem Platform Design Toolkit, einer Methode für den Entwurf von Plattformen. Dort steht, wer beteiligt ist, was alle davon haben und was wir als Erstes ausprobieren. Alles ist öffentlich.",
      links: [
        { label: "Was wir als Erstes ausprobieren", href: "/docs/platform-design/#2-design/d8-mvp.pdt42.md" },
        { label: "Das ganze Plattform-Design", href: "/docs/platform-design/" },
        { label: "Die Vision", href: "/docs/vision/" },
      ],
      note: "Die Unterlagen sind auf Englisch.",
    },
    cta: {
      title: "Mach mit.",
      description: "Finde eine App für morgen. Oder bau die, die noch fehlt.",
      primary: "App finden",
      primaryHref: "/apps/",
      secondary: "Eine App bauen",
      secondaryHref: "/apps/build/",
    },
  },
};
