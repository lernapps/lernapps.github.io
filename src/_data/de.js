// All texts of the home page (German). Templates contain no copy of their own.
// The story follows the platform design (https://lernapps.net/docs/platform-design/):
// adults look for an app in an acute moment, people who build apps do it for their own class or child,
// the platform is free and lives on thanks, and nothing is collected in secret.
// Language: plain German (ISO 24495-1): short sentences, active voice, no jargon, "du".
export default {
  meta: {
    title: "lernapps.net — kleine Lern-Apps, kostenlos und ohne Anmeldung",
    description:
      "lernapps.net hilft, kleine Lern-Apps zu finden, die sofort laufen: kostenlos, ohne Anmeldung und ohne heimliche Datensammlung. Und es hilft allen, die solche Apps bauen.",
  },

  landing: {
    // ── HERO ──────────────────────────────────────────────────────────────────
    hero: {
      headline: "Deutschlands Schulen haben ein\nDigitalisierungs\u00ADproblem.", // soft hyphen for narrow screens
      subtitle: "Und da geht es nicht um WLAN oder iPads, sondern um passende Lösungen.",
    },

    // Order of the persona tabs (problems and solutions share it).
    personas: ["teacher", "parent", "creator", "learner"],

    // ── SECTION 1: Problem quotes ──────────────────────────────────────────────
    problems: {
      tabsAriaLabel: "Perspektiven",
      scrollCue: "Klingt das vertraut?",
      teacher: {
        role: "Lehrkraft",
        icon: "📚",
        quote:
          "In zehn Minuten beginnt die Stunde. Ich suche etwas, mit dem meine Klasse Brüche selbst ausprobieren kann. Alles, was ich finde, will eine Anmeldung oder läuft über fremde Server. Darf ich das überhaupt einsetzen? Ich nehme doch wieder das Arbeitsblatt.",
      },
      parent: {
        role: "Elternteil",
        icon: "🏠",
        quote:
          "Morgen schreibt mein Sohn eine Mathearbeit. Er sitzt am Küchentisch und versteht Prozentrechnung nicht. Ich suche eine App, mit der er üben kann. Ich finde nur Werbung, Abos und Apps, die zuerst ein Konto wollen.",
      },
      creator: {
        role: "Selbst gebaut",
        icon: "🔧",
        quote:
          "Ich habe am Wochenende eine kleine App gebaut, mit der meine Tochter Wahrscheinlichkeiten ausprobieren kann. Sie liebt sie. Ob sie auch anderen Kindern helfen würde? Keine Ahnung. Sie liegt auf GitHub, und niemand findet sie.",
      },
      learner: {
        role: "Schülerin",
        icon: "🎒",
        quote:
          "Übermorgen ist die Arbeit, und ich verstehe das mit den Funktionen einfach nicht. Videos bringen mir nichts. Ich will es selbst ausprobieren.",
      },
    },

    // ── SECTION 2: Ecosystem ───────────────────────────────────────────────────
    ecosystemProblem: {
      headline: "Gute Apps gibt es.\nSie kommen nur nicht an.",
      body:
        "Menschen bauen kleine Lern-Apps für ihre Klasse oder ihr Kind. Mit KI-Hilfe geht das oft an einem Wochenende. Aber die Apps kommen nicht in andere Klassen. Wer sie einsetzen will, trägt das Risiko allein: Darf ich das? Ist das sicher? Und wer sie baut, erfährt nie, ob sie anderswo geholfen haben.",
      bridge: "lernapps.net bringt diese Seiten zusammen.",
    },

    // ── SECTION 3: Portraits, one per persona ──────────────────────────────────
    solutions: {
      intro: "Was lernapps.net für dich tut",
      tabsAriaLabel: "Was lernapps.net für dich tut",
      teacher: {
        role: "Wenn du unterrichtest",
        icon: "📚",
        headline: "Eine passende App, in wenigen Minuten im Unterricht.",
        story:
          "Gleich beginnt die Stunde. Du brauchst eine App zu genau diesem Thema. Bei lernapps.net suchst du nach Thema und Klassenstufe. Die App läuft sofort im Browser: ohne Installation und ohne Anmeldung.\n\nWir nehmen nur Apps auf, die ohne eigenen Server auskommen. Was deine Klasse eingibt, bleibt auf ihren Geräten.\n\nNach der Stunde kannst du mit einem Klick Danke sagen oder kurz rückmelden, wie es lief. Mehr brauchen wir nicht.",
        cta: "Apps finden",
        ctaHref: "/apps/",
        tryIt: {
          label: "Ausprobieren:",
          linkText: "Mathe-Karte",
          href: "/mathe-karte/",
          text: "Mathematik der Sekundarstufe I mit Trainern und KI-Tutor.",
        },
      },
      parent: {
        role: "Wenn dein Kind morgen eine Arbeit schreibt",
        icon: "🏠",
        headline: "Heute Abend noch üben.",
        story:
          "Heute Abend soll dein Kind noch üben. Bei lernapps.net findest du eine App zum Thema der Arbeit. Dein Kind kann sofort anfangen. Es braucht kein Konto, und niemand erfährt, wer es ist.\n\nWenn die App geholfen hat, sag Danke. Ein Klick genügt.",
        cta: "Apps finden",
        ctaHref: "/apps/",
      },
      creator: {
        role: "Wenn du Apps baust",
        icon: "🔧",
        headline: "Du baust ohnehin. Wir machen es dir leichter.",
        story:
          "Du baust deine App ohnehin: für deine Klasse oder für dein Kind. lernapps.net macht dir das leichter. Du bekommst Anleitungen, mit denen dein KI-Assistent schneller eine App baut, die auch andere gut nutzen können.\n\nDeine App trägst du in wenigen Minuten ein. Du brauchst keine eigene Website und keine Werbung. Die App bleibt deine.\n\nWenn jemand deine App nutzt und auf „Danke“ klickt, erfährst du davon. So siehst du, wenn deine App einer anderen Klasse oder einem anderen Kind geholfen hat.\n\nWir fangen gerade erst an. Wenn du zu den Ersten gehören willst, mach mit.",
        cta: "Deine App eintragen",
        ctaHref: "/apps/eintragen/",
      },
      learner: {
        role: "Wenn du selbst lernst",
        icon: "🎒",
        headline: "Selbst ausprobieren statt nur zuschauen.",
        story:
          "Du willst den Stoff verstehen, zum Beispiel vor der nächsten Arbeit. Hier findest du kleine Apps, mit denen du selbst etwas ausprobierst. Du brauchst kein Konto. Wir wissen nicht, wer du bist.\n\nHat dir eine App geholfen? Klick auf „Danke“. Die Person, die sie gebaut hat, freut sich darüber.",
        cta: "Apps finden",
        ctaHref: "/apps/",
        tryIt: {
          label: "Ausprobieren:",
          linkText: "Mathe-Karte",
          href: "/mathe-karte/",
          text: "Mathematik der Sekundarstufe I mit Trainern und KI-Tutor.",
        },
      },
    },

    // ── SECTION 4: Principles ──────────────────────────────────────────────────
    principles: {
      id: "so-funktioniert-es",
      heading: "So funktioniert lernapps.net",
      intro:
        "lernapps.net ist kostenlos. Niemand verdient daran. Es gibt keine Werbung, und wir sammeln keine Daten im Verborgenen. Die Plattform lebt von zwei Dingen: Menschen bauen gute Lern-Apps. Und andere sagen Danke dafür.",
      items: [
        {
          title: "Kostenlos und ohne Werbung",
          text: "Die Apps laufen in deinem Browser. Dafür braucht es keine teuren Server. Deshalb kostet lernapps.net nichts.",
        },
        {
          title: "Was du eingibst, bleibt auf deinem Gerät",
          text: "Wir nehmen nur Apps auf, die ohne eigenen Server auskommen. Sie brauchen keine Installation und keine Anmeldung.",
        },
        {
          title: "Wir zählen offen, nicht heimlich",
          text: "Wir zählen nur Klicks, die jemand bewusst macht, zum Beispiel „Danke“. Wir speichern nur die Summe. Wir wissen nicht, wer geklickt hat.",
        },
        {
          title: "Danke hält alles am Leben",
          text: "Ein Danke zeigt den Menschen, die Apps bauen, dass sich ihre Arbeit lohnt. Ohne diesen Dank gäbe es bald keine neuen Apps mehr.",
        },
      ],
      privacy: {
        title: "Wenn du an deiner Schule auf den Datenschutz achtest",
        text:
          "Die Apps laufen nur im Browser. Sie haben keinen eigenen Server, keine Konten und keine Cookies.\n\nAuf der Plattform zählen wir nur Klicks, die jemand bewusst macht: „Danke“, „Im Unterricht genutzt“, „Ich schau mir das an“ und kurze Rückmeldungen. Wir speichern nur die Summe dieser Klicks. Wir speichern keine IP-Adressen und nichts im Browser. Daten von Schülerinnen und Schülern entstehen nicht.",
      },
    },

    // ── SECTION 5: Why it is free, and why I do this ───────────────────────────
    whyFree: {
      id: "warum-kostenlos",
      heading: "Warum ist das kostenlos?",
      text:
        "Die Apps laufen in deinem Browser. Dafür brauchen wir keine teuren Server. Wer Apps baut, macht das ohnehin für die eigene Klasse oder das eigene Kind. Deshalb kann lernapps.net kostenlos sein, ohne Werbung und ohne Daten zu verkaufen.\n\nWas die Plattform braucht, ist dein Danke. Es zeigt den Menschen, die Apps bauen, dass sich ihre Arbeit lohnt.",
      personal: {
        heading: "Warum ich das mache",
        text:
          "Ich bin Softwareentwickler. Seit einiger Zeit sehe ich, wie leicht es geworden ist, kleine Apps zu bauen. Wer weiß, was er tut, braucht dafür kaum noch Zeit und Geld.\n\nIn der Schule kommt davon wenig an. Ob eine Lehrkraft eine neue App einsetzt, hängt vor allem davon ab, wie viel Risiko sie selbst tragen will. Gute Apps gibt es, aber sie finden nicht in die Klassen. Ich sehe da ein ganzes Ökosystem mit seinen Spannungen: zwischen denen, die bauen, denen, die einsetzen, und den Regeln, die alle schützen sollen.\n\nSich nur über schlechte Digitalisierung an Schulen zu beschweren, bringt nichts. Also versuche ich etwas.\n\nGeld will ich damit nicht verdienen. Ich will erst einmal sehen, ob es den Bedarf wirklich gibt. Wenn lernapps.net trägt, kann daraus zum Beispiel ein Verein werden. Dann gehört die Plattform denen, die sie mit Leben füllen.",
        signature: "Oliver Jägle",
      },
    },

    // ── SECTION 6: For sceptics ────────────────────────────────────────────────
    sceptics: {
      id: "funktioniert-das",
      heading: "„Das funktioniert doch sowieso nicht.“",
      text:
        "Vielleicht. Wir wissen es noch nicht. Darum fangen wir klein an: mit wenigen Apps und wenigen Menschen, die sie bauen und einsetzen. Wir haben vorher aufgeschrieben, woran wir merken, ob es klappt. Und woran nicht.\n\nGeplant haben wir lernapps.net mit dem Platform Design Toolkit, einer Methode für den Entwurf von Plattformen. Dort steht, wer beteiligt ist, was alle davon haben und was wir als Erstes ausprobieren. Alles ist öffentlich.",
      links: [
        { label: "Was wir als Erstes ausprobieren", href: "/docs/platform-design/#2-design/d8-mvp.pdt42.md" },
        { label: "Das ganze Plattform-Design", href: "/docs/platform-design/" },
        { label: "Die Vision", href: "/docs/vision/" },
      ],
      note: "Die Unterlagen sind auf Englisch.",
    },

    // ── SECTION 7: Final CTA ───────────────────────────────────────────────────
    cta: {
      title: "Mit Machern mitmachen.",
      description:
        "Du baust Apps, du unterrichtest oder du willst üben? Probier lernapps.net aus. Und wenn dir eine App geholfen hat: Sag Danke.",
      primary: "Apps finden",
      primaryHref: "/apps/",
      secondary: "Auf GitHub ansehen",
      secondaryHref: "https://github.com/lernapps",
    },
  },
};
