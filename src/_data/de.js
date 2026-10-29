// All texts of the site's pages (German); en.js is the English translation, with the same structure. Templates contain no copy of their own.
// The home page tells one story: the promise, real apps, what adults get, a solid foundation for makers, why another
// platform (it belongs to no company), how to join, and why the founder does this. Details live on two pages:
// features (principles, what the apps can do, and technical transparency for developers) and about (the long story).
// Language: plain German (ISO 24495-1): short sentences, active voice, no jargon, "du".
export default {
  meta: {
    title: "lernapps.net — Lern-Apps ohne Haken",
    description:
      "Kleine Lern-Apps, gemacht von Eltern und Lehrkräften: kostenlos im Browser, ohne Konto, ohne Werbung, ohne Abo. Und ein solides Fundament für alle, die selbst eine App bauen wollen.",
  },

  landing: {
    hero: {
      headline: "Lern-Apps [[ohne Haken]].",
      subtitle: "Kostenlos im Browser, sofort startklar.",
      badges: ["Kein Konto", "Keine Werbung", "Kein Abo", "Eingaben bleiben auf dem Gerät", "Auch auf dem Handy"],
      primary: "App finden",
      primaryHref: "/apps/",
      secondary: "Selbst bauen",
      secondaryHref: "#mitmachen",
      // Ein kleiner Spaß am Rand: Das Video lädt erst nach dem Klick. Ohne JavaScript bleibt der Knopf weg.
      cat: {
        open: "Lieber Katzenvideos",
        label: "Video: Kater Minka und das Mathebuch",
        description: "Videobeschreibung: Das Video ist mit KI erzeugt. Im Kinderzimmer sitzt ein Kater zwischen Spielzeug. Er öffnet mit der Pfote ein Mathebuch, schaut auf die Formeln und dann mit leerem Blick in die Kamera. Er zuckt mit den Schultern, klappt das Buch zu und geht zurück auf seinen Platz. Im Video ist nur Umgebungsgeräusch zu hören, es wird nicht gesprochen.",
        fallback: "Video ansehen (MP4)",
        endTitle: "Fühlst du dich wie Minka?",
        endText: "Lernen muss nicht so sein. Hier findest du Apps, die wirklich etwas vermitteln.",
        primary: "App finden",
        primaryHref: "/apps/",
        close: "Schließen",
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

    forYou: {
      id: "fuer-dich",
      heading: "Was du davon hast",
      privacy: { text: "Kein Konto, keine Cookies, kein Tracking.", link: "Datenschutzerklärung", href: "/privacy/" },
      items: [
        { headline: "Vertretungsstunde in der 7b?", text: "Fach und Klasse wählen, Link teilen oder QR-Code zeigen. Jedes Kind bekommt Rückmeldung, niemand braucht ein Konto.", cta: "Apps für den Unterricht", ctaHref: "/apps/" },
        { headline: "Dein Kind hängt in einem Thema?", text: "Apps erklären Schritt für Schritt, mit Übungen und Rückmeldung. Kostenlos und jederzeit wieder.", cta: "Apps zum Lernen", ctaHref: "/apps/" },
        { headline: "Nächste Woche ist die Arbeit?", text: "Dein KI-Assistent macht aus den Arbeitsblättern eine Übungs-App. In Minuten, ohne Fachwissen.", cta: "Zum Üben", ctaHref: "/practice/" },
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
        { icon: "❓", title: "Quiz", text: "Fragen mit Antworten zur Auswahl. Nach jeder Antwort steht, warum sie stimmt oder nicht, und wo man weiterlesen kann." },
        { icon: "📖", title: "Erklär-App", text: "Kapitel mit Seiten, die erklären. Auf jeder Seite gibt es Übungen. Die Seiten sind auch ohne JavaScript lesbar.", extra: "Wer will, nimmt einen KI-Tutor dazu: Die App gibt dem eigenen KI-Assistenten die Aufgabe, die Lösung und die typischen Fehler. Das ist freiwillig. Die App funktioniert ganz ohne KI und sendet selbst nichts." },
        { icon: "🎮", title: "Interaktive App", text: "Lernen durch Tun: ein Spiel, ein Training, ein Versuch. Was die Lernenden tun, ist der Inhalt." },
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
        { id: "kosten", icon: "🐙", title: "GitHub als kostenloses Rückgrat", text: "Darum funktioniert es ohne Geld: Apps und Katalog sind statische Seiten auf GitHub Pages. Ein Eintrag ist ein Pull Request, die Prüfung läuft in GitHub Actions. Es gibt keinen eigenen Server, der Geld kostet." },
        { id: "daten", icon: "🔒", title: "Datenschutz als Feature", text: "Jede App läuft ganz im Browser. Es gibt keinen Server mit Daten, keine Datenbank und keine Konten. Was nicht gesammelt wird, kann auch nicht verloren gehen oder verkauft werden.", link: { label: "Die Datenschutzerklärung", href: "/privacy/" } },
        { id: "ki", icon: "🤖", title: "Lesbar für KI-Assistenten", text: "Jeder Bereich von lernapps.net hat eine llms.txt. So findet ein Assistent die passende App, erklärt die Plattform oder baut selbst eine App. Ohne dass jemand eine Schnittstelle betreiben muss." },
        { id: "offen", icon: "🧭", title: "Offen geplant", text: "Wir haben lernapps.net mit dem Platform Design Toolkit entworfen: wer beteiligt ist, was alle davon haben, was wir als Erstes ausprobieren. Alles ist öffentlich, auch was wir noch nicht wissen." },
      ],
      principles: {
        id: "prinzipien",
        heading: "Die Prinzipien",
        intro: "Sie gelten für alle gleich: für die, die Apps bauen, und für die, die sie einsetzen.",
        items: [
          { icon: "🤝", title: "Keine Firma dahinter", text: "Niemand verdient an lernapps.net. Kein Abo, keine Werbung, kein Verkauf von Daten. Auch später nicht." },
          { icon: "📂", title: "Offen statt geschlossen", text: "Die Regeln, der Plan und der Quellcode sind öffentlich. Jeder kann nachlesen, wie hier entschieden wird." },
          { icon: "🏡", title: "Deine App bleibt deine", text: "Jede App liegt bei dem, der sie gebaut hat. lernapps.net zeigt sie, besitzt sie aber nicht." },
          { icon: "🔒", title: "Die Apps sammeln nichts", text: "Kein Konto, keine Cookies, kein Tracking. Was eingegeben wird, bleibt auf dem Gerät." },
          { icon: "💬", title: "Ehrlich über Grenzen", text: "Jede App sagt, was sie kann und was nicht. Wir sagen offen, was wir noch nicht wissen." },
          { icon: "💙", title: "Danke statt Geld", text: "Wer eine App nutzt, kann Danke sagen. Heute öffnet ein Klick eine fertige E-Mail an lernapps.net, und wir geben das Danke an den weiter, der die App gebaut hat. Später soll ein Klick genügen, ganz ohne E-Mail." },
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
      description: "Dein eigener KI-Assistent als Tutor: Die Lerninhalte der Apps sind für ihn lesbar. Er begleitet dich, führt dich und unterstützt dich. lernapps.net erfährt davon nichts.",
    },
    hero: {
      headline: "Dein Tutor, nicht unserer.",
      subtitle: "Die Lerninhalte sind für deinen eigenen KI-Assistenten lesbar. Er begleitet dich, führt dich und unterstützt dich. lernapps.net erfährt davon nichts.",
      jump: [
        { label: "Dein Tutor", href: "#tutor" },
        { label: "Ablauf", href: "#ablauf" },
        { label: "Regeln", href: "#regeln" },
        { label: "Datenschutz", href: "#datenschutz" },
        { label: "Grenzen", href: "#grenzen" },
      ],
    },
    about: {
      id: "tutor",
      heading: "Ein persönlicher Tutor auf deinem Weg",
      text: "Jede Seite und jede Aufgabe einer Erklär-App hat eine Adresse und liegt als lesbarer Text vor. Dein KI-Assistent kann sie öffnen, lesen und sich darauf beziehen. So weiß er, was erklärt wird, welche Aufgabe du gelöst hast und was du eingegeben hast.\n\nDamit kann er dich begleiten, führen und unterstützen: geduldig, persönlich und immer da. Das geschieht in deinem Assistenten, bei deinem Anbieter. lernapps.net erfährt davon nichts.",
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
      intro: "So läuft es in der Mathe-Karte, einer Erklär-App.",
      steps: [
        { title: "Selbst einschätzen", text: "Du machst die Selbsteinschätzung einer App. Am Ende zeigt sie für jede Seite: „Kannst du wahrscheinlich schon“, „Schau sie dir noch einmal an“ oder „Lies sie genau“. Das Ergebnis bleibt auf deinem Gerät." },
        { title: "Assistenten wählen", text: "Du wählst deinen Assistenten: Claude, ChatGPT, Mistral Vibe oder „Text kopieren“ für jeden anderen. Du nutzt dein eigenes Konto beim Anbieter." },
        { title: "Dich führen lassen", text: "Ein Klick gibt dem Assistenten dein Ergebnis und deine Eingaben. Er schickt dich Seite für Seite zu dem, was noch nicht sitzt. Erklärt und geübt wird auf den Seiten der App." },
        { title: "Auf der Seite lernen", text: "Oben auf jeder Seite schaltest du „Mit einem KI-Tutor lernen“ ein. Nach einer falschen Antwort gibt „Warum?“ dem Tutor die Aufgabe, deine Eingabe und die Meldung der App. „Zurück zum Tutor“ meldet ihm, was du geübt hast." },
        { title: "Noch einmal einschätzen", text: "Sitzen die Seiten eines Kapitels, machst du eine neue Runde. Der Assistent entscheidet nach dem Ergebnis, wie es weitergeht." },
      ],
    },
    rules: {
      id: "regeln",
      heading: "Wie der Tutor arbeitet",
      intro: "Diese Regeln bekommt dein Assistent von der App. Du kannst sie vorher lesen.",
      items: [
        { icon: "❓", title: "Er fragt, statt zu lösen", text: "Der Tutor nennt die Idee hinter dem Fehler und stellt eine Leitfrage. Die Lösung sagt er nicht." },
        { icon: "🖼️", title: "Er beginnt beim Bild", text: "Er erklärt am Bild der Seite und fragt zuerst: Was siehst du?" },
        { icon: "✏️", title: "Gerechnet wird auf Papier", text: "Das Ergebnis tippst du in die App. Im Chat gibt es Überschlags- und Warum-Fragen." },
        { icon: "✅", title: "Geschafft ist, was du erklären kannst", text: "Eine Seite gilt als geschafft, wenn drei Aufgaben richtig waren und du eine davon erklären kannst. Dann bittet er um eine Aufgabe von Hand: ein Foto nur vom Blatt, ohne Namen. Er prüft jeden Schritt und nennt den ersten falschen, statt ihn zu verbessern." },
        { icon: "🎬", title: "Das Video kommt zuletzt", text: "Zuerst gibt es Aufgaben. Das Video empfiehlt er, wenn du die Erklärung zweimal nicht wiedergeben kannst." },
        { icon: "🧭", title: "Nach dem Einschätzen fasst er sich kurz", text: "Er antwortet mit höchstens drei Sätzen, einer Frage und einem Link zur nächsten Seite." },
      ],
    },
    transparency: {
      id: "transparenz",
      heading: "Du siehst, was dein Tutor bekommt",
      text: "Auf jeder Seite und bei der Selbsteinschätzung gibt es den Link „Ansehen, was dein Tutor bekommt“. Eltern und Lehrkräfte können den ganzen Auftrag vorher lesen, bevor ein Kind ihn weitergibt.",
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
      heading: "Datenschutz",
      title: "Keine KI in lernapps.net",
      text: "Auf lernapps.net ist keine KI eingebaut, und wir betreiben keinen Chatbot. Die Apps machen ihre Lerninhalte nur für deinen Assistenten lesbar. Alles Weitere geschieht in deinem Assistenten, bei deinem Anbieter, dem du dort separat zugestimmt hast. lernapps.net erfährt davon nichts.\n\nDie App sendet nichts. Ein Klick gibt dem Assistenten dein Ergebnis und deine Eingaben, den Auftrag kannst du vorher lesen. Das ist freiwillig. Ohne KI geht alles auch.",
      link: "Zur Datenschutzerklärung",
      href: "/privacy/#de-ki",
    },
    limits: {
      id: "grenzen",
      heading: "Ehrlich über Grenzen",
      items: [
        { title: "Ein Assistent kann sich irren.", text: "Die geprüfte Quelle sind die Seiten der App. Stimmt etwas nicht, gilt die Seite." },
        { title: "KI ersetzt keine Menschen.", text: "Lernen ist auch eine gemeinsame Erfahrung: mit Freunden, Eltern, Lehrkräften. Ein Assistent ist geduldig und immer da, aber er ist nicht dabei, wenn ihr zusammen übt." },
        { title: "Wir können nicht prüfen, wie sich dein Assistent verhält.", text: "Die Regeln sind eine Bitte an ihn. Eine Garantie ist das nicht." },
        { title: "Ohne KI geht alles.", text: "Die Seiten, die Übungen und die Meldungen der App („Leider nicht richtig. Zähle zuerst alle möglichen Ergebnisse …“) funktionieren ohne Assistent." },
      ],
    },
    cta: {
      title: "Probier es aus.",
      description: "Mach eine Selbsteinschätzung. Du entscheidest danach, ob du einen Tutor dazunimmst.",
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
        id: "lehrkraefte", icon: "📚", role: "Wenn du unterrichtest",
        headline: "Setz Apps ein und sag, wie es lief.",
        text: "Nutz eine App im Unterricht oder in der Vertretungsstunde. Danach kannst du mit einem Klick Danke sagen oder kurz rückmelden, ob sie gepasst hat. Erzähl Kolleginnen und Kollegen davon. Und wenn dir eine App fehlt: Sag es uns, oder bau sie selbst.",
        cta: "Apps finden", ctaHref: "/apps/",
        ask: "Ich unterrichte und suche digitale Lernangebote. Lies https://lernapps.net/llms.txt und die dort verlinkten Seiten. Erkläre mir in einfachen Worten, was lernapps.net ist, was die Plattform mir als Lehrkraft bietet und wie sie für Sicherheit sorgt. Wirf auch einen Blick in den Katalog: https://lernapps.net/apps/. Sei ehrlich über die Grenzen.",
      },
      {
        id: "eltern", icon: "🏠", role: "Wenn du ein Kind beim Lernen begleitest",
        headline: "Übt zusammen und sagt Danke.",
        text: "Such eine App zu dem Thema, bei dem dein Kind Hilfe braucht. Hat sie geholfen? Ein Danke zeigt dem, der sie gebaut hat, dass sich seine Arbeit lohnt. Und teil den Link mit anderen Eltern, etwa in der Klassengruppe.",
        cta: "Apps finden", ctaHref: "/apps/",
        ask: "Ich bin Elternteil und suche sichere Lern-Apps für mein Kind. Lies https://lernapps.net/llms.txt und die dort verlinkten Seiten. Erkläre mir in einfachen Worten, was lernapps.net ist, was die Plattform mir als Elternteil bietet und wie sie für Sicherheit sorgt. Wirf auch einen Blick in den Katalog: https://lernapps.net/apps/. Sei ehrlich über die Grenzen.",
      },
      {
        id: "lernende", icon: "🎒", role: "Wenn du selbst lernst",
        headline: "Probier aus, statt nur zuzuschauen.",
        text: "Such dir eine App zu deinem Thema. Du brauchst kein Konto, und niemand weiß, wer du bist. Gibt es noch keine? Vielleicht baust du mit deinem KI-Assistenten selbst eine.",
        cta: "Apps finden", ctaHref: "/apps/",
        ask: "Ich lerne gerade und suche etwas zum Ausprobieren. Lies https://lernapps.net/llms.txt und die dort verlinkten Seiten. Erkläre mir kurz, was lernapps.net ist, was es mir beim Lernen bringt und wie es für Sicherheit sorgt. Wirf auch einen Blick in den Katalog (https://lernapps.net/apps/): Gibt es dort schon etwas zu meinem Thema? Falls nicht: Überlege mit mir, ob wir zusammen selbst eine kleine App dafür bauen können.",
      },
      {
        id: "macher", icon: "🔧", role: "Wenn du eine App bauen willst",
        headline: "Bau die App, die noch fehlt.",
        text: "Du bringst die Idee und den Inhalt, dein KI-Assistent baut mit dir. lernapps.net gibt dir Grundgerüste, Werkzeuge und Prüfungen. Deine App bleibt deine. Wer sie nutzt, kann Danke sagen, und du erfährst davon.",
        cta: "Eine App bauen", ctaHref: "/apps/build/",
        secondary: "Du hast schon eine App? Trag sie ein, in wenigen Stunden", secondaryHref: "/apps/build/#eintragen",
        ask: "Ich baue gern kleine Lern-Apps mit KI-Hilfe. Lies https://lernapps.net/llms.txt und die dort verlinkten Seiten. Erkläre mir in einfachen Worten, was lernapps.net ist, was die Plattform Menschen wie mir bietet und was ich zurückbekomme, wenn jemand meine App nutzt. Sag mir ehrlich, ob sich das für mich lohnt.",
      },
      {
        id: "plattform", icon: "🧩", role: "Wenn du an der Plattform mitarbeiten willst",
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
