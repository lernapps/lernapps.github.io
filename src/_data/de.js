// All texts of the home page (German). Taken from the former edugo landing page
// (edugo/src/i18n/de.ts, section "landing"); brand renamed edugo → lernapps.net, link targets
// point to the lernapps sites on this origin. Templates contain no copy of their own.
export default {
  meta: {
    title: "lernapps.net — Die fehlende Infrastruktur für Bildungsinnovation",
    description:
      "lernapps.net verbindet gute Bildungs-Tools mit den Schulen, die sie brauchen — über eine lebendige Kompetenzkarte und kuratierte Apps.",
    skipLink: "Zum Inhalt springen",
  },

  landing: {
    // ── HERO ──────────────────────────────────────────────────────────────────
    hero: {
      headline: "Deutschlands Schulen haben ein\nDigitalisierungsproblem.",
      subtitle: "Und da geht es nicht um WLAN oder iPads, sondern um passende Lösungen.",
    },

    // Order of the persona tabs (problems and solutions share it).
    personas: ["teacher", "navigator", "builder"],

    // ── SECTION 1: Problem cards ───────────────────────────────────────────────
    problems: {
      tabsAriaLabel: "Perspektiven",
      scrollCue: "Klingt das vertraut?",
      teacher: {
        role: "Lehrkraft",
        icon: "📚",
        quote:
          "Ich suche seit einer Stunde nach einem Tool, mit dem meine Klasse gemeinsam Argumente strukturieren kann. Alles, was ich finde, läuft entweder über US-Server oder will eine Einwilligung der Eltern. Ich gebe auf. Wir machen es wieder auf Papier.",
      },
      navigator: {
        role: "Schulleitung",
        icon: "🗺️",
        quote:
          "Wir haben jetzt 40 iPads im Haus. Jede Lehrkraft nutzt andere Apps. Ich weiß nicht, welche Kompetenzen wir damit eigentlich fördern — und welche komplett auf der Strecke bleiben. Im nächsten Schulentwicklungsgespräch soll ich das beantworten können.",
      },
      builder: {
        role: "Elternteil",
        icon: "🔧",
        quote:
          "Ich habe an einem Wochenende eine kleine App gebaut, mit der Schüler Wahrscheinlichkeiten durch Simulationen entdecken können. Meine Tochter liebt sie. Aber wie bekomme ich das zu anderen Schulen? Ich habe keine Zeit für Marketing. Das Ding liegt auf GitHub und wird nicht gefunden.",
      },
    },

    // ── SECTION 2: Ecosystem problem reveal ───────────────────────────────────
    ecosystemProblem: {
      headline: "Das ist kein Einzelproblem.\nDas ist ein Ökosystem-Problem.",
      body:
        "Engagierte Lehrkräfte und Entwickler bauen gute Dinge — aber isoliert, ohne Verbindung. Gute Tools sind unsichtbar, schwer einzuschätzen, nicht aufeinander aufgebaut. Gute Arbeit verschwindet, weil sie nirgends zusammenkommt.",
      bridge:
        "Wir können nicht alles auf einmal lösen. Aber wir können anfangen, diese drei Probleme zu verbinden.",
    },

    // ── SECTION 3: Solution cards ──────────────────────────────────────────────
    solutions: {
      intro: "Was lernapps.net für dich tut",
      tabsAriaLabel: "Was lernapps.net für dich tut",
      mapPreviewAriaLabel: "Vorschau der Kompetenzkarte",
      mapPreviewLabel: "Kompetenzkarte — Vorschau",
      teacher: {
        role: "Für Lehrkräfte",
        icon: "📚",
        headline: "Finde Tools, denen du vertrauen kannst.",
        story:
          "lernapps.net bietet dir einen einfach zu durchsuchenden Katalog mit Apps, die sicher nutzbar sind. Keine dubiosen Seiten — einfache, zielgerichtete Apps mit einem klaren Bildungsbezug.\n\nJedes Tool zeigt sofort seinen Datenschutzstatus. Kein Backend heißt: Schülerdaten können gar nicht erst abfließen.",
        cta: "Tools entdecken",
        ctaHref: "/map/#/apps",
        // New: the first real app, so the page leads to something usable today.
        tryIt: {
          label: "Ausprobieren:",
          linkText: "Mathe-Karte",
          href: "/mathe-karte/",
          text: "Mathematik der Sekundarstufe I mit Trainern und KI-Tutor.",
        },
      },
      navigator: {
        role: "Für Schulen & Koordinatoren",
        icon: "🗺️",
        headline: "Sieh, was abgedeckt ist — und was fehlt.",
        story:
          "Die Kompetenzkarte zeigt, welche Lernziele durch digitale Tools unterstützt werden — und wo die Lücken sind. Nicht als statisches Dokument, sondern als lebendige Karte, die wächst.\n\nDu bekommst eine ehrliche Antwort auf die Frage, die du im nächsten Schulentwicklungsgespräch beantworten musst.",
        cta: "Kompetenzkarte ansehen",
        ctaHref: "/map/#/catalog",
      },
      builder: {
        role: "Für Digital Schaffende",
        icon: "🔧",
        headline: "Bau in eine reale Lücke — und werde gefunden.",
        story:
          "„It's the age of personal software.\" Aber wäre es nicht cool, wenn noch mehr Menschen davon profitieren könnten?\n\nlernapps.net zeigt dir, wo Bedarf ist: welche Lernziele keine passenden Tools haben. Du trägst dein Tool in wenigen Minuten ein — es landet auf der Karte, für alle Schulen findbar, ohne Marketing, ohne Vertrieb.",
        cta: "Lücken ansehen",
        ctaHref: "/map/#/catalog?gap=true",
      },
    },

    // ── SECTION 4: How it works ────────────────────────────────────────────────
    howItWorks: {
      // Visually hidden; names the section for screen readers.
      heading: "So funktioniert es",
      steps: [
        {
          number: "01",
          title: "Kompetenzkarte",
          description:
            "Lernziele als lebendige Karte. Jeder Knoten zeigt, ob es gute Tools gibt — oder eine Lücke.",
        },
        {
          number: "02",
          title: "Tool-Katalog",
          description:
            "Jedes Tool mit Datenschutzstatus, Teaser und Link. Gefiltert nach dem, was Schüler dabei tun.",
        },
        {
          number: "03",
          title: "Beitragen per Pull Request",
          description:
            "Ein neues Tool eintragen dauert wenige Minuten. GitHub als Backend — auditierbar, forkbar, kein Login.",
        },
      ],
      // Static capability map mockup. tone: missing | partial | covered
      mockNodes: [
        { title: "Kollaborativ schreiben", statusLabel: "Fehlend", count: "Noch kein Tool", tone: "missing" },
        { title: "Daten visualisieren", statusLabel: "Teilweise", count: "1 Tool", tone: "partial" },
        { title: "Quellen bewerten", statusLabel: "Fehlend", count: "Noch kein Tool", tone: "missing" },
        { title: "Präsentation erstellen", statusLabel: "Gut abgedeckt", count: "3 Tools", tone: "covered" },
        { title: "Programmieren lernen", statusLabel: "Gut abgedeckt", count: "2 Tools", tone: "covered" },
        { title: "Feedback geben & empfangen", statusLabel: "Fehlend", count: "Noch kein Tool", tone: "missing" },
      ],
    },

    // ── SECTION 5: Final CTA ───────────────────────────────────────────────────
    cta: {
      title: "Mit Machern mitmachen.",
      description:
        "Es hilft nichts, sich über schlechte Digitalisierung zu beschweren. Wenn zukünftige Generationen nicht das beherrschen, was die Welt von ihnen verlangt, haben wir alle ein Problem. Lasst es uns ändern.",
      primary: "Tools entdecken",
      primaryHref: "/map/#/apps",
      secondary: "Auf GitHub ansehen",
      secondaryHref: "https://github.com/lernapps",
    },

    nav: {
      ariaLabel: "Hauptnavigation",
      homeLabel: "lernapps.net – Startseite",
      menuLabel: "Menü",
      links: [
        { label: "Tools", href: "/map/#/apps" },
        { label: "Kompetenzkarte", href: "/map/#/catalog" },
        { label: "Vision", href: "/docs/vision/" },
        { label: "Mitmachen", href: "https://github.com/lernapps/.github/blob/main/CONTRIBUTING.md" },
        { label: "GitHub", href: "https://github.com/lernapps" },
      ],
    },

    footer: {
      brand: "lernapps.net",
      tagline: "lernapps.net — die fehlende Infrastruktur für Bildungsinnovation.",
      navAriaLabel: "Footer-Navigation",
      links: [
        { label: "Vision", href: "/docs/vision/" },
        { label: "Beitragen", href: "https://github.com/lernapps/.github/blob/main/CONTRIBUTING.md" },
        { label: "Architektur", href: "/map/architecture/" },
        { label: "GitHub", href: "https://github.com/lernapps" },
        { label: "Datenschutz", href: "/privacy/" },
        { label: "Impressum", href: "/imprint/" },
      ],
      dsgvo: "Keine Cookies, kein Tracking, keine Konten.",
    },
  },
};
