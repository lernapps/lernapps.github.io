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
      headline: "Lern-Apps ohne Haken.",
      subtitle: "Gemacht von Eltern und Lehrkräften, mit Leidenschaft. Kostenlos im Browser und sofort startklar.",
      badges: ["Kein Konto", "Keine Werbung", "Kein Abo", "Nichts verlässt das Gerät"],
      primary: "App finden",
      primaryHref: "/apps/",
      secondary: "Selbst eine App bauen",
      secondaryHref: "#mitmachen",
    },

    showcase: {
      heading: "Ein paar Apps aus dem Katalog",
      intro: "Von der umfassenden Übungs-App bis zum Spiel. Jede ist für eine echte Klasse oder ein echtes Kind entstanden.",
      early: "Wir fangen gerade erst an. Der Katalog wächst mit jeder App, die jemand einträgt.",
      honest: "Jede App kommt von einem Menschen. Wir helfen beim Bauen, aber eine Garantie für die Qualität ist das nicht. Siehst du einen Fehler im Inhalt, melde ihn auf der Seite der App.",
      apps: [
        { icon: "🗺️", meta: "Mathematik · Klasse 8", title: "Mathe-Karte", text: "Prozent, binomische Formeln und Wahrscheinlichkeit: erklärt, mit Bild und vielen Aufgaben.", href: "/apps/mathe-karte/" },
        { icon: "🎲", meta: "Mathematik · Klasse 7 und 8", title: "Kniffel-Trainer", text: "Kniffel spielen und dabei Chancen als Bruch und Prozent verstehen.", href: "/apps/kniffel-trainer/" },
        { icon: "🔍", meta: "Deutsch · Klasse 3 bis 13", title: "Textcheck", text: "Fehler in Texten finden, bis hin zu Meinungen, die wie Tatsachen klingen.", href: "/apps/textcheck/" },
        { icon: "🌋", meta: "Erdkunde · Klasse 5 bis 10", title: "Naturwunder-Quiz", text: "Vulkane, Wasserfälle, Wüsten: zu jeder Antwort eine Erklärung und Wikipedia zum Weiterlesen.", href: "/apps/naturwunder-quiz/" },
      ],
      all: "Alle Apps ansehen",
      allHref: "/apps/",
    },

    forYou: {
      heading: "Was du davon hast",
      next: "Mehr musst du nicht wissen. Der Rest der Seite ist für alle, die selbst eine App bauen wollen.",
      nextLink: "Zu den Apps",
      nextHref: "/apps/",
      items: [
        {
          icon: "📚", role: "Wenn du unterrichtest", headline: "Vertretungsstunde in der 7b?",
          text: "Du übernimmst kurzfristig eine Klasse, vielleicht nicht einmal in deinem Fach. Such nach Fach und Klasse, teile einen Link oder zeig den QR-Code. Die Klasse arbeitet sinnvoll am Thema, und die App gibt jedem Kind Rückmeldung.\n\nNiemand braucht ein Konto, und es entstehen keine Daten deiner Schülerinnen und Schüler.",
          cta: "Apps für den Unterricht", ctaHref: "/apps/",
        },
        {
          icon: "🏠", role: "Wenn dein Kind morgen eine Arbeit schreibt", headline: "Heute Abend noch üben.",
          text: "Such eine App zum Thema der Arbeit. Dein Kind kann sofort anfangen: ohne Abo, ohne Werbung, ohne Konto. Niemand erfährt, wer es ist.",
          cta: "Apps zum Üben", ctaHref: "/apps/",
        },
      ],
    },

    different: {
      heading: "Ein solides Fundament für Macher.",
      intro: "lernapps sind keine Produkte eines Verlags. Eltern und Lehrkräfte bauen sie, weil ihrem Kind oder ihrer Klasse etwas gefehlt hat. lernapps.net gibt ihnen ein Fundament, auf dem daraus gute Apps werden.",
      makers: { title: "Die Macher bringen", items: ["ihre Idee", "ihr Wissen über das Fach", "ihre Erfahrung aus Klasse und Küchentisch"] },
      platform: { title: "Die Plattform bringt", items: ["Grundgerüste für Quiz, Erklär-App und interaktive App", "eine Methodik: am Lehrplan orientiert, Übungen mit Rückmeldung", "Werkzeuge zum Bauen, Prüfen und Eintragen"] },
      result: "So fühlt sich jede App vertraut an. Und jede bringt ihre eigene Idee mit.",
      link: "Was die Apps können",
      linkHref: "/features/#nutzer",
    },

    platform: {
      objection: "Noch eine Plattform? Davon gibt es doch genug.",
      heading: "Stimmt. Aber diese gehört keiner Firma.",
      intro: "lernapps.net ist kein Produkt eines Anbieters und keiner Agentur. Es ist ein gemeinsamer Ort: Eltern und Lehrkräfte bauen hier Apps, teilen sie und setzen sie ein. Dabei gelten für alle dieselben Prinzipien.",
      points: [
        { title: "Niemand verdient daran.", text: "Kein Abo, keine Werbung, kein Verkauf von Daten. Auch später nicht. Die Apps brauchen keinen eigenen Server, darum kostet der Betrieb fast nichts.", link: { label: "Mehr dazu", href: "/features/#kosten" } },
        { title: "Ein Ort für den Austausch.", text: "Die einen bauen Apps, die anderen setzen sie ein. Rückmeldung und Danke kommen bei denen an, die gebaut haben." },
        { title: "Offen, nach festen Prinzipien.", text: "Kein Konto, nichts wird gesammelt. Die Regeln, der Plan und der Quellcode der Plattform sind öffentlich." },
      ],
      links: [
        { label: "Alle Prinzipien", href: "/features/#prinzipien" },
        { label: "Wie die Plattform funktioniert", href: "/features/#plattform" },
      ],
    },

    join: {
      id: "mitmachen",
      heading: "Du willst nicht warten, bis sich etwas ändert?",
      text: "Bau die App, die deiner Klasse oder deinem Kind fehlt. Du bringst die Idee und den Inhalt. Wir geben dir den Rahmen, die Methodik und die Werkzeuge. Dein KI-Assistent hilft dir beim Bauen. Und deine App bleibt deine.\n\nWer deine App nutzt, kann Danke sagen. Du erfährst davon und siehst, wo deine Arbeit ankommt.",
      cta: "Eine App bauen",
      ctaHref: "/apps/build/",
    },

    founder: {
      heading: "Seit Jahren reden alle vom Digitalisierungs\u00ADproblem der Schulen. Ich glaube, wir haben ein anderes.",
      text: "Es fehlt nicht an Tablets und WLAN. Es fehlt an einem Ökosystem, das gute Ideen dorthin bringt, wo sie gebraucht werden. Eltern und Lehrkräfte bauen längst Lern-Apps für ihr Kind oder ihre Klasse. Aber die Apps bleiben, wo sie entstanden sind.\n\nIch will nicht weiter klagen, sondern etwas tun. Und ich will, dass alle, denen gute Bildung am Herzen liegt, auch etwas tun können. Darum gründe ich lernapps.net.",
      signature: "Oliver Jägle",
      role: "Gründer von lernapps.net",
      link: "Mehr über uns und die Idee",
      linkHref: "/about/",
    },

    cta: {
      title: "Lebt von Leidenschaft. Und von deinem Danke.",
      description: "Finde eine App für morgen. Oder bau die, die noch fehlt.",
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
          ],
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
        { id: "daten", icon: "🔒", title: "Kein Server, keine Daten", text: "Jede App läuft ganz im Browser. Es gibt keine Datenbank und keine Konten. Was nicht gesammelt wird, kann auch nicht verloren gehen oder verkauft werden." },
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
          { icon: "🔒", title: "Nichts wird gesammelt", text: "Kein Konto, keine Cookies, kein Tracking. Was eingegeben wird, bleibt auf dem Gerät." },
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
        text: "Such eine App zum Thema der nächsten Arbeit. Hat sie geholfen? Ein Danke zeigt dem, der sie gebaut hat, dass sich seine Arbeit lohnt. Und teil den Link mit anderen Eltern, etwa in der Klassengruppe.",
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
        secondary: "Du hast schon eine App? Trag sie ein", secondaryHref: "/apps/build/#eintragen",
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
