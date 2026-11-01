// All texts of the site's pages (English), the translation of de.js: same structure, same order. Templates contain
// no copy of their own. German is the source; keep both files in step.
// Language: plain English, short sentences, active voice, no jargon, "you". Links point to the English tree of a
// site (/apps/en/, /tooling/en/, /docs/en/platform-design/): the frame stays English there, also where the text
// exists in English only.
export default {
  meta: {
    title: "lernapps.net — meaningful apps that teach you something",
    description:
      "Small learning apps, made by parents and teachers: free in the browser, no account, no ads, no subscription. And a solid foundation for everyone who wants to build an app themselves.",
  },

  landing: {
    // Entry by role: teachers, parents and students see at a glance what they get. Per role the strongest motivators
    // (platform design, E2); the others on the role's page. A quiet line addresses everyone who has worked with a
    // coding agent: they can build an app of their own.
    hero: {
      headline: "Meaningful apps that [[teach]] you something.",
      subtitle: "Made by teachers and parents, for everyone. Free in the browser, no account.",
      pick: "I am …",
      roles: [
        {
          id: "teachers", tab: "I teach", tabShort: "Teachers",
          value: "Apps your students learn with on their own.",
          points: [
            "You find an app for subject and grade in minutes, also for a lesson you cover.",
            "Let your students try things out and practise, each with instant feedback.",
            "You share no data about your students: no account, no ads, no tracking.",
          ],
          actions: [{ label: "App catalog", href: "/apps/en/" }],
          more: "More for teachers", moreHref: "/en/teachers/",
        },
        {
          id: "parents", tab: "I'm a parent", tabShort: "Parents",
          value: "Help for your child where you can't help any further.",
          points: [
            "You find an app that explains step by step what your child is learning right now.",
            "Before a test, take a photo of the worksheet: your AI assistant turns it into an exercise.",
            "You pay nothing, now or later: no ads, no subscription, no sign-up.",
          ],
          actions: [{ label: "App catalog", href: "/apps/en/" }, { label: "Practise for a test", href: "/practice/en/" }],
          more: "More for parents", moreHref: "/en/parents/",
        },
        {
          id: "students", tab: "I go to school", tabShort: "Students",
          value: "Learn at your own pace, until it sticks.",
          points: [
            "Find your topic and have it explained step by step.",
            "Before a test, practise exactly the material that will come up.",
            "You get hints from your AI, even a free one, until you manage on your own.",
            "Try things out: no account, no grade, nobody watching.",
          ],
          actions: [{ label: "App catalog", href: "/apps/en/" }, { label: "Practise for a test", href: "/practice/en/" }],
          more: "More for students", moreHref: "/en/students/",
        },
      ],
      maker: {
        text: "Have you worked with a coding agent before? Then you can build a learning app of your own. Our foundations and guides give it what it needs, and the app stays yours.",
        link: "Build an app",
        href: "/apps/en/build/",
      },
    },

    // Gallery: one app large, the others beside it. Examples only, the catalog has more.
    gallery: {
      id: "examples",
      heading: "From the catalog",
      label: "Examples",
      more: "More in the app catalog",
      moreHref: "/apps/en/",
      apps: [
        { id: "mathe-karte", dark: true, title: "Mathe-Karte", field: "Maths", line: "Maths explained step by step, with pictures and exercises.", href: "/apps/en/mathe-karte/", altDesktop: "Mathe-Karte on a computer: a percentage exercise with the calculation and a bar picture", altPhone: "Mathe-Karte on a phone: the calculation and a bar picture" },
        { id: "kniffel-trainer", title: "Kniffel-Trainer", field: "Maths", line: "Understand probability by playing Yahtzee.", href: "/apps/en/kniffel-trainer/", altDesktop: "Yahtzee Trainer on a computer: dice and score sheet in explain mode", altPhone: "Yahtzee Trainer on a phone: dice and score sheet" },
        { id: "textcheck", dark: true, title: "Textcheck", field: "German", line: "Read carefully: find the mistakes in a text.", href: "/apps/en/textcheck/", altDesktop: "Textcheck on a computer: a text about pyramids with one word marked", altPhone: "Textcheck on a phone: a text about pyramids with one word marked" },
        { id: "naturwunder-quiz", dark: true, title: "Naturwunder-Quiz", field: "Geography", line: "A geography quiz with an explanation for every answer.", href: "/apps/en/naturwunder-quiz/", altDesktop: "Naturwunder-Quiz on a computer: a question about the height of Mount Everest with a photo", altPhone: "Naturwunder-Quiz on a phone: a question about the height of Mount Everest with a photo" },
      ],
    },

    // AI: just the tutor, in one sentence. The details are on /tutor/ (tutor).
    ki: {
      id: "ai",
      heading: "Your own [[tutor]].",
      text: "Every explainer app gives your AI assistant the task. It accompanies you patiently, and lernapps.net learns nothing about it.",
      cta: "How the tutor works",
      ctaHref: "/tutor/",
    },

    // For makers: joining and the foundation in one section. The id "get-involved" is the target of the hero button "Build one".
    maker: {
      id: "get-involved",
      heading: "You bring the [[idea]]. We bring the foundation.",
      you: { title: "You", text: "An idea, subject knowledge, experience from the classroom and the kitchen table." },
      we: { title: "We", text: "Foundations, a method, and tools to build, check and list an app." },
      note: "Your AI assistant helps you build, and the app stays yours.",
      cta: "Build an app",
      ctaHref: "/apps/en/build/",
      link: "What the apps can do",
      linkHref: "/features/#users",
    },

    platform: {
      id: "platform",
      heading: "Another platform? This one belongs to [[no company]].",
      points: [
        { title: "Nobody earns money from it", text: "No subscription, no ads, no selling of data." },
        { title: "A place to share", text: "Feedback and thanks reach the people who built the apps." },
        { title: "Open", text: "The rules, the plan and the source code are public." },
      ],
      link: "All principles",
      linkHref: "/features/#principles",
    },

    founder: {
      quote: "There is no lack of tablets and Wi-Fi. What is missing is an ecosystem that brings good ideas to where they are needed.",
      signature: "Oliver Jägle",
      role: "Founder of lernapps.net",
      link: "More about us",
      linkHref: "/about/",
    },

    cta: {
      title: "Find an app for tomorrow. Or build the one that is missing.",
      primary: "Find an app",
      primaryHref: "/apps/en/",
      secondary: "Build an app",
      secondaryHref: "/apps/en/build/",
    },
  },

  // ── ROLES: one page each for teachers, parents and students ─────────────────
  // All motivators of the role (platform design, E2). Two parts: using apps (including an app just for oneself, such
  // as before a test) and building an app for others. The students' page has the first part only.
  roles: {
    home: "Home",
    parts: { use: "Use apps", build: "Build an app for others" },
    teachers: {
      name: "Teachers",
      meta: {
        title: "For teachers — lernapps.net",
        description: "Learning apps for class: for topic and grade in minutes, data protection settled, the class tries things out itself. And your own material as an app.",
      },
      crumb: "For teachers",
      headline: "Apps your students [[learn with on their own]].",
      subtitle: "Small apps to try out and practise, made by colleagues. In the browser, no account, on the devices your school has.",
      primary: "App catalog", primaryHref: "/apps/en/",
      partHints: { use: "For the next lesson", build: "From your material" },
      use: {
        heading: "Find and use apps",
        lead: "For the next lesson, without preparing the night before.",
        items: [
          { title: "You take over a class at short notice, perhaps outside your subject", text: "Pick subject, topic and grade. The apps explain themselves what to do, even if it isn't your subject.", points: ["Into class by link, QR code or projector", "Runs on tablet, laptop and phone"], link: "Search the catalog", href: "/apps/en/" },
          { title: "The next lesson lacks a fitting exercise", text: "Your AI assistant turns your material into a practice app for exactly your topic. It runs under lernapps.net for a while, without you publishing anything.", link: "Have an exercise made", href: "/practice/en/" },
          { title: "Your class should do something itself", text: "In the apps the children try things out, decide and practise. They see right away whether it is right, instead of only watching.", link: "Example: reading closely with Textcheck", href: "/apps/en/textcheck/" },
          { title: "You are responsible for data protection", text: "Every app runs under lernapps.net, with one privacy notice for all. You can pass it on to your head teacher.", points: ["No account, no cookies, no tracking", "Nothing goes to third parties without a click; what an app loads is checked"], link: "Privacy notice for your school", href: "/en/privacy/" },
          { title: "Some children need you right now", text: "The app accompanies the class while it practises, each child at their own pace and with feedback. So your hands are free for the children who need particular attention." },
        ],
      },
      build: {
        heading: "Build an app for others",
        lead: "Your AI assistant builds, you bring the material and the experience. Other classes learn with it, and the app stays yours.",
        items: [
          { title: "You want to make your material digital", text: "Choose the content that gains most from being digital. Step by step you build your own digital collection, which other classes can use too.", points: ["Self-checking: the children see for themselves whether it is right", "Interactivity: try out, move, decide", "AI tutor: accompanies the task, with hints instead of answers"], link: "Build an app", href: "/apps/en/build/" },
        ],
      },
      thanks: { heading: "Did it help? Say thanks.", text: "lernapps.net is free. On each app's page in the catalog you say thanks after the lesson with one click. So the people who made it learn that it helps." },
    },
    parents: {
      name: "Parents",
      meta: {
        title: "For parents — lernapps.net",
        description: "Learning apps for your child: they explain step by step, without ads and without an account. Practice apps before a test. And what you know as an app for many children.",
      },
      crumb: "For parents",
      headline: "Help for your child where you [[can't help any further]].",
      subtitle: "Small apps that explain and let children practise, made by teachers and parents. Free in the browser, no account.",
      primary: "App catalog", primaryHref: "/apps/en/",
      partHints: { use: "For your child, also before a test", build: "From what you know" },
      use: {
        heading: "An app for your child",
        lead: "When you lack the time or the topic was too long ago.",
        items: [
          { title: "Your child doesn't understand a topic, and you can't help", text: "Pick topic and grade. The app explains step by step, with pictures, exercises and feedback. You don't need to know the material yourself.", link: "Search the catalog", href: "/apps/en/" },
          { title: "A test is coming up", text: "Take photos of the worksheets. Your AI assistant turns them into a practice app for exactly that material, in a few minutes. The photos go to your assistant only.", link: "Practise for a test", href: "/practice/en/" },
          { title: "You wonder what the app does with your child", text: "All apps run under lernapps.net and follow the same rules. You don't have to judge a stranger's website.", points: ["No ads, no subscription, no in-app purchases", "No account; input stays on the device"], link: "Our rules", href: "/en/features/#principles" },
          { title: "Your child should get on alone", text: "Your child comes back as often as needed and finds the next app alone. A bookmark is enough." },
        ],
      },
      build: {
        heading: "Build an app for others",
        lead: "With your AI assistant, no programming needed. Many children learn with it, and the app stays yours.",
        items: [
          { title: "You are good at something and want to pass it on", text: "What you know becomes an app, where being digital gains most: the children check their own answers, try things out or ask an AI tutor. Many children learn with it, not only yours, and you hear that it helped.", link: "Build an app", href: "/apps/en/build/" },
        ],
      },
      thanks: { heading: "Did it help? Say thanks.", text: "lernapps.net is free. On each app's page in the catalog you say thanks with one click. So the people who made it learn that it helps." },
    },
    students: {
      name: "Students",
      meta: {
        title: "For students — lernapps.net",
        description: "Learning apps for you: understand a topic at your own pace, practise before a test, with a patient AI tutor. No account, no grade.",
      },
      crumb: "For students",
      headline: "Learn at your own pace, [[until it sticks]].",
      subtitle: "Small apps to try out and practise. Open one and start, no sign-up.",
      primary: "App catalog", primaryHref: "/apps/en/",
      use: {
        heading: "How the apps help you",
        lead: "Find your topic, open the app, start.",
        items: [
          { title: "You don't understand a topic yet", text: "Find your topic and grade. The app explains step by step. You can look at it as often as you like.", link: "Search the catalog", href: "/apps/en/" },
          { title: "A test is coming up", text: "Practise exactly the material that will come up, until it sticks. If no app fits, your AI assistant makes one from your worksheets, just for you.", link: "Practise for a test", href: "/practice/en/" },
          { title: "You need someone who explains patiently", text: "In every explainer app you can hand the task to your AI assistant. It gives you hints instead of answers, also in the evening. lernapps.net learns nothing about it.", link: "How the tutor works", href: "/en/tutor/" },
          { title: "You want to practise without anyone watching", text: "No account, no grade. Nobody knows who you are. Mistakes are allowed; that is how you learn." },
          { title: "You like to play", text: "Some apps let you play and learn along the way, such as probability while playing Yahtzee.", link: "Kniffel trainer", href: "/apps/en/kniffel-trainer/" },
        ],
      },
      thanks: { heading: "Did it help? Say thanks.", text: "On each app's page in the catalog you say thanks with one click. So the people who made it learn that it helped you." },
    },
    also: "Also for:",
  },

  // ── FEATURES: for users, for developers, and what makes the platform unique ─
  features: {
    meta: {
      title: "Features — lernapps.net",
      description: "What the apps can do, what you get when you build one, and what makes lernapps.net unique: no server, no company, no data collection, with GitHub as a free backbone.",
    },
    hero: {
      headline: "What lernapps is made of",
      subtitle: "For everyone who uses apps. For everyone who builds apps. And what makes the platform behind them unique.",
      jump: [
        { label: "For users", href: "#users" },
        { label: "For developers", href: "#developers" },
        { label: "The platform", href: "#platform" },
      ],
    },
    users: {
      id: "users",
      kicker: "For teachers, parents and learners",
      heading: "What the apps can do",
      intro: "Every app is built on one of three foundations. That is why they work in a similar way everywhere, and every one is made with the same care.",
      archetypes: [
        { icon: "circle-help", title: "Quiz", text: "Questions with answers to choose from. After every answer it says why it is right or wrong, and where to read on." },
        { icon: "book-open", title: "Explainer", text: "Chapters of pages that explain. Every page has exercises. The pages can be read without JavaScript too.", extra: "If you like, add an AI tutor: the app gives your own AI assistant the task, the solution and the typical mistakes. This is optional. The app works entirely without AI and sends nothing itself." },
        { icon: "gamepad-2", title: "Interactive app", text: "Learning by doing: a game, a training, an experiment. What the learners do is the content." },
      ],
      items: [
        { title: "Based on the curriculum", text: "The content comes from the state curriculum and the teacher's material. Every app says what you can do afterwards." },
        { title: "Exercises with feedback", text: "A wrong answer explains why it is wrong. Then you can try again." },
        { title: "One link takes you right there", text: "To the topic, to the section or to exactly the task the whole class should work on. As a QR code too." },
        { title: "Made by people", text: "Every app comes from a teacher, a parent or someone who likes to build. We help them build it, but that is no guarantee of quality. You report a mistake in the content with one click on the app's page." },
        { title: "Accessible", text: "The apps meet WCAG 2.1 AA and work from 360 pixels wide. Where an app can't, it says so in the catalog." },
        { title: "Runs on every device", text: "In the browser, without installing anything: on the projector, on the class tablets or on a phone at home." },
      ],
      cta: "Find apps",
      ctaHref: "/apps/en/",
    },
    developers: {
      id: "developers",
      kicker: "For developers",
      heading: "What you get when you build",
      intro: "You bring the idea and the content. lernapps.net gives you foundations, tools and guidance for your AI assistant. And it says openly what you agree to when you contribute an app.",
      blocks: [
        {
          id: "stack",
          title: "Foundations, or your own stack",
          text: "With our tooling you create an app from a foundation: quiz, explainer or interactive app. Checks then run on every commit and in CI.\n\nBut you can also build freely, with any stack. Then only the platform rules apply: collect nothing, no account, no ads, accessible, usable from 360 pixels, no other servers before a click. Dependencies need an open licence.",
        },
        {
          id: "assistant",
          title: "Made for your AI assistant",
          text: "Skills, a plan and rules with fixed IDs guide your assistant through the work: ask, plan, build, check, publish, list. You decide along with it at fixed points.\n\nWe test how closely different assistants follow this guidance and publish the results.",
        },
        {
          id: "review",
          title: "How an app gets into the catalog",
          steps: [
            "You publish the app in your own repository, at your own address.",
            "You submit it: as a pull request to lernapps/apps, or by form or email without GitHub. Anyone can submit an app.",
            "An automatic check opens the app the way learners do and compares it with the entry: do all topics open, are the details right?",
            "It is checked against the rules for every app. They are exclusion criteria: an app that collects data, needs an account or shows ads does not get into the catalog. An AI agent can also review the app against a checklist.",
            "If the app keeps the rules, it is listed, and lernapps.net serves a copy of it. For a finished app, all of this takes a few hours.",
          ],
        },
        {
          id: "feedback",
          title: "Feedback reaches you",
          text: "Whoever uses your app can say thanks or tell you how it went, up to “mistake in the content”. Today this is an email to lernapps.net, and we pass it on to you.\n\nIf your source code is on GitHub, people can also open an issue in your repository straight from the app's page.",
        },
        {
          id: "ownership",
          title: "Ownership and licence",
          text: "Your app lives in your repository, at your address and under your licence. The catalog only links to it. We recommend open licences: MIT or Apache 2.0 for the code, CC BY 4.0 for the content. That way others can build on your app, and your name stays with it.\n\nYou use content by others, such as texts or pictures, only with a suitable licence and name the source and licence. The platform itself and the tooling are under the MIT licence.",
        },
      ],
      links: [
        { label: "The rules for every app", href: "/tooling/en/rules/" },
        { label: "The tooling", href: "/tooling/en/" },
        { label: "How we test the guidance", href: "/tooling/en/prompt-engineering/" },
      ],
      note: "The technical documents are in English.",
      cta: "Build an app",
      ctaHref: "/apps/en/build/",
    },
    platform: {
      id: "platform",
      kicker: "What makes lernapps.net unique",
      heading: "No server. No company. No data collection.",
      intro: "Most learning platforms need servers, accounts and a business model. lernapps.net is built differently. That is why it can stay free.",
      unique: [
        { id: "costs", icon: "git-branch", title: "GitHub as a free backbone", text: "This is why it works without money: the apps and the catalog are static pages on GitHub Pages. An entry is a pull request, the check runs in GitHub Actions. There is no server of our own that costs money." },
        { id: "data", icon: "lock", title: "Privacy as a feature", text: "Every app runs entirely in the browser. There is no server with data, no database and no account. What is not collected cannot be lost or sold.", link: { label: "The privacy notice", href: "/privacy/" } },
        { id: "ai", icon: "bot", title: "Readable for AI assistants", text: "Every part of lernapps.net has an llms.txt. So an assistant can find the right app, explain the platform or build an app itself. Without anyone having to run an API." },
        { id: "open", icon: "compass", title: "Planned in the open", text: "We designed lernapps.net with the Platform Design Toolkit: who takes part, what everyone gets out of it, what we try first. Everything is public, including what we don't know yet." },
      ],
      principles: {
        id: "principles",
        heading: "The principles",
        intro: "They apply to everyone alike: to those who build apps and to those who use them.",
        items: [
          { icon: "handshake", title: "No company behind it", text: "Nobody earns money from lernapps.net. No subscription, no ads, no selling of data. Not later either." },
          { icon: "folder-open", title: "Open, not closed", text: "The rules, the plan and the source code are public. Anyone can read how decisions are made here." },
          { icon: "house", title: "Your app stays yours", text: "Every app stays with the person who built it. lernapps.net shows it but does not own it." },
          { icon: "lock", title: "The apps collect nothing", text: "No account, no cookies, no tracking. What someone types stays on their device." },
          { icon: "message-circle", title: "Honest about limits", text: "Every app says what it can do and what it can't. We say openly what we don't know yet." },
          { icon: "heart", title: "Thanks instead of money", text: "Whoever uses an app can say thanks. Today one click opens a ready-made email to lernapps.net, and we pass the thanks on to the person who built the app. Later one click will be enough, without any email." },
        ],
      },
      links: [
        { label: "How it is meant", href: "/docs/en/" },
        { label: "The platform design", href: "/docs/en/platform-design/" },
        { label: "The source code", href: "https://github.com/lernapps" },
      ],
    },
  },


  // ── TUTOR: the learning companion of the explainer apps, parallel to the tooling (AI for building) ─
  // Describes a feature of the explainer, not a service of the platform: there is no AI on lernapps.net, no server and no chatbot.
  // The learning content is readable and referable; the learner's assistant uses it, lernapps.net learns nothing about it.
  tutor: {
    meta: {
      title: "Tutor — lernapps.net",
      description: "Learn with the AI assistant you already have: it knows every page and every exercise of the explainer apps and helps you right where you are stuck. lernapps.net learns nothing about it.",
    },
    hero: {
      headline: "Your tutor, not ours.",
      subtitle: "Learn with the AI assistant you already have. It knows every page and every exercise of the app. It explains where you are stuck and sends you to the right exercise. lernapps.net learns nothing about it.",
      jump: [
        { label: "Privacy", href: "#privacy" },
        { label: "How it works", href: "#tutor" },
        { label: "How the tutor works", href: "#rules" },
        { label: "Limits", href: "#limits" },
      ],
    },
    about: {
      id: "tutor",
      label: "How it works",
      heading: "Help with exactly your exercise",
      text: "General explanations are everywhere. Your tutor knows more: it can read every page of the app. It sees which exercise you are on and what you typed. So it helps you right at the spot where you are stuck. Patiently, and whenever you need it.",
      cta: "Try the self-assessment",
      ctaHref: "/mathe-karte/einschaetzung/",
    },
    dialog: {
      label: "Example: a conversation with a tutor",
      you: "You",
      assistant: "Assistant",
      lines: [
        { mine: true, parts: ["I practised on ", { label: "Laplace formula", href: "/mathe-karte/zufall/laplace/" }, ":\n- laplace-zaehlen, no. 54: right on the first try.\n- laplace-urne, no. 56: not solved yet (1 try, input 0.16). The app says: “Read the text above the exercise again.”\nSession: 1 of 2 right."] },
        { parts: ["I'll look at exercise 56 directly, to help you precisely."] },
        { step: "Page opened", link: { label: "Laplace formula", href: "/mathe-karte/zufall/laplace/" } },
        { parts: ["Great that number 54 worked on the first try! On number 56: your 0.16 is very close – you probably cut off the decimals instead of rounding to two places. Work it out again: how many balls are in the urn in total, and how many of them are blue? Then divide the blue ones by all of them, round properly to two decimals, and type the result into the app."] },
        { mine: true, parts: ["ah, 0.17 – I rounded wrong"] },
      ],
      link: { label: "The whole conversation (in German)", href: "https://chat.mistral.ai/work/8d08a4d7-65ce-4a23-80b4-5ed9a581988d" },
    },
    process: {
      id: "how",
      heading: "Step by step",
      steps: [
        { title: "Find out where you stand", text: "Do the self-assessment. Afterwards you know for each page whether you already know it, should have another look or should read it closely. The result stays on your device." },
        { title: "Bring your assistant", text: "Claude, ChatGPT, Mistral Vibe, or any other with “Copy text”. You use the account you already have." },
        { title: "Let it guide you", text: "One click gives your tutor your result. It sends you straight to the pages that do not stick yet. You do not have to search yourself." },
        { title: "Get help when you are stuck", text: "Wrong answer? “Why?” gives the tutor the exercise, your input and the app's message. So it helps you right there. “Back to the tutor” tells it what you managed." },
        { title: "See what you have learned", text: "When a chapter sticks, you do a new round. Then you see what you can do now, and your tutor plans the next step with you." },
      ],
    },
    rules: {
      id: "rules",
      label: "How the tutor works",
      heading: "A tutor that lets you think for yourself",
      intro: "Left alone, an AI assistant likes to just give you the answer. You learn little from that. So the app gives it clear rules.",
      items: [
        { icon: "circle-help", title: "It does not give away the answer", text: "It asks what you do not understand and leads you on step by step with short questions. You walk the way yourself. That is why it sticks." },
        { icon: "book-open", title: "It sticks to the app", text: "It explains with the app's pages and exercises, not with made-up examples. So its help fits what you are learning right now." },
        { icon: "circle-check", title: "Solving happens in the app", text: "To solve, it sends you back to the page. There the app checks your answer, not the chat." },
      ],
    },
    transparency: {
      id: "transparency",
      heading: "None of it is hidden",
      text: "On every page and in the self-assessment there is the link “See what your tutor gets”. It shows the whole brief, including the rules an app adds for its subject. Parents and teachers can read it before a child passes it on.",
      link: "Example: the brief for the self-assessment “Probability”",
      href: "/mathe-karte/zufall/einschaetzung/tutor/",
    },
    flow: {
      label: "The way your data takes",
      steps: ["Self-assessment in the app", "One click copies your result", "You paste it into your assistant", "It sends you to the next page"],
      noServer: "No lernapps.net server in between.",
    },
    privacy: {
      id: "privacy",
      label: "Privacy",
      heading: "An AI tutor and privacy? How does that fit together?",
      title: "No AI in lernapps.net",
      text: "There is no AI built into lernapps.net, and we run no chatbot. The apps only make their learning content readable for your assistant. Everything else happens in your assistant, with your provider, to whom you agreed separately there. lernapps.net learns nothing about it.\n\nThe app sends nothing. One click gives the assistant your result and what you typed, and you can read the brief first. This is voluntary. Everything works without AI too.",
      link: "To the privacy notice",
      href: "/privacy/#en-ai",
    },
    limits: {
      id: "limits",
      heading: "What an AI tutor cannot do",
      items: [
        { title: "Replace people.", text: "Learning together is a social thing, and that matters for us as a society. An AI assistant is patient and always there. When you are stuck, go ahead and find a real person too, ideally someone you like. Maybe the two of you get there together with the AI tutor, even if the other person does not know the topic that well." },
        { title: "Be free of mistakes.", text: "AI models keep getting better, and people make mistakes too. But nobody can guarantee that your tutor is never wrong. The app's pages are checked: if your tutor contradicts a page, the page counts." },
        { title: "Follow every rule.", text: "We cannot control your assistant. The rules are a request to it, not a guarantee." },
        { title: "Be indispensable.", text: "You do not need it. The pages, the exercises and the app's feedback (“Not right. First count all possible outcomes …”) work without an assistant too." },
      ],
    },
    cta: {
      title: "Try it.",
      description: "Do the self-assessment. Whether you add a tutor afterwards is up to you.",
      primary: "Self-assessment of Mathe-Karte",
      primaryHref: "/mathe-karte/einschaetzung/",
      secondary: "All apps",
      secondaryHref: "/apps/en/",
    },
  },


  // ── JOIN: one block per persona, each with a prompt for their AI assistant ─
  join: {
    meta: {
      title: "Get involved — lernapps.net",
      description: "How you can take part in lernapps.net: as a teacher, as a parent, as a learner, with an app of your own or on the platform itself. With a prompt for your AI assistant.",
    },
    hero: {
      headline: "Get involved",
      subtitle: "lernapps.net lives on people who build apps, and on people who use them and say thanks. Pick where you stand.",
    },
    askBox: {
      title: "Ask your AI assistant",
      intro: "Copy this text into your AI assistant. It reads lernapps.net and explains what the platform does for you.",
      copy: "Copy text",
      copied: "Copied",
    },
    personas: [
      {
        id: "teachers", icon: "library", role: "If you teach",
        headline: "Use apps and tell us how it went.",
        text: "Use an app in class or when you cover a lesson. Afterwards you can say thanks with one click or give short feedback on whether it fitted. Tell your colleagues about it. And if an app is missing: tell us, or build it yourself.",
        cta: "Find apps", ctaHref: "/apps/en/",
        ask: "I teach and I am looking for digital learning material. Read https://lernapps.net/llms.txt and the pages it links to. Explain to me in plain words what lernapps.net is, what the platform offers me as a teacher and how it keeps things safe. Also have a look at the catalogue: https://lernapps.net/apps/en/. Be honest about the limits.",
      },
      {
        id: "parents", icon: "house", role: "If you help a child learn",
        headline: "Practise together and say thanks.",
        text: "Look for an app on the topic your child needs help with. Did it help? A thank-you shows the person who built it that their work is worth it. And share the link with other parents, for example in the class group.",
        cta: "Find apps", ctaHref: "/apps/en/",
        ask: "I am a parent and I am looking for safe learning apps for my child. Read https://lernapps.net/llms.txt and the pages it links to. Explain to me in plain words what lernapps.net is, what the platform offers me as a parent and how it keeps things safe. Also have a look at the catalogue: https://lernapps.net/apps/en/. Be honest about the limits.",
      },
      {
        id: "learners", icon: "backpack", role: "If you are learning yourself",
        headline: "Try things out instead of just watching.",
        text: "Find an app on your topic. You don't need an account, and nobody knows who you are. Is there none yet? Maybe you build one yourself, with your AI assistant.",
        cta: "Find apps", ctaHref: "/apps/en/",
        ask: "I am learning something right now and I am looking for something to try out. Read https://lernapps.net/llms.txt and the pages it links to. Explain to me briefly what lernapps.net is, what it does for my learning and how it keeps things safe. Also have a look at the catalogue (https://lernapps.net/apps/en/): is there already something on my topic? If not: think with me about whether we can build a small app for it together.",
      },
      {
        id: "makers", icon: "wrench", role: "If you want to build an app",
        headline: "Build the app that is still missing.",
        text: "You bring the idea and the content, your AI assistant builds it with you. lernapps.net gives you foundations, tools and checks. Your app stays yours. Whoever uses it can say thanks, and you hear about it.",
        cta: "Build an app", ctaHref: "/apps/en/build/",
        secondary: "Already have an app? List it in a few hours", secondaryHref: "/apps/en/build/#eintragen",
        ask: "I like building small learning apps with AI help. Read https://lernapps.net/llms.txt and the pages it links to. Explain to me in plain words what lernapps.net is, what the platform offers people like me and what I get back when someone uses my app. Tell me honestly whether it is worth it for me.",
      },
      {
        id: "platform", icon: "puzzle", role: "If you want to work on the platform",
        headline: "Make lernapps.net better.",
        text: "The platform is open: docs, tooling, catalog and this site are on GitHub. You can report bugs, improve texts, help build the tooling or think along about where it goes next.",
        cta: "How to contribute", ctaHref: "https://github.com/lernapps/.github/blob/main/CONTRIBUTING.md",
        secondary: "How it is meant", secondaryHref: "/docs/en/",
        ask: "I would like to work on lernapps.net. Read https://lernapps.net/llms.txt, https://lernapps.net/docs/llms.txt and https://github.com/lernapps/.github/blob/main/CONTRIBUTING.md. Explain to me in plain words how the platform is built, which repositories there are and how I can make a first small contribution. Be honest about what is still missing.",
      },
    ],
  },


  // ── ABOUT: the long story behind lernapps.net ──────────────────────────────
  about: {
    meta: {
      title: "About us — lernapps.net",
      description: "Why lernapps.net exists: digital education in Germany does not have a device problem but an ecosystem problem. And an honest answer for sceptics.",
    },
    founder: {
      heading: "For years, everyone has talked about the digitalisation problem of schools. I believe we have a different one.",
      text: "Politicians announce programmes, billions for tablets and Wi-Fi. And then we hear it again: schools are lagging behind. Yet there is no lack of devices. What is missing is an ecosystem that brings good ideas to where they are needed.\n\nThese ideas have existed for a long time. Parents and teachers build learning apps for their child or their class, with passion. But the apps stay where they were made. Whoever wants to use them carries the risk alone. And whoever built them never learns whether they helped.\n\nI am a software developer. For some time now I have seen how easy it has become to build small apps. With an AI assistant it hardly takes any time or money. Yet very little of this reaches schools.\n\nI don't want to keep complaining. I want to do something. And I want everyone who cares about good education to be able to do something too. Especially now, when you feel powerless in so many places, this matters: to see that your own work reaches a child you have never met.\n\nThat is why I am founding lernapps.net. I don't want to earn money with it. First I want to see whether the need is real. If lernapps.net carries, it could become an association, for example. Then the platform belongs to those who fill it with life.",
      signature: "Oliver Jägle",
      role: "Founder of lernapps.net",
    },
    sceptics: {
      heading: "“This won't work anyway.”",
      text: "Maybe. We don't know yet. That is why we start small: with a few apps and a few people who build and use them. We wrote down beforehand how we will notice whether it works. And how we will notice that it doesn't.\n\nWe planned lernapps.net with the Platform Design Toolkit, a method for designing platforms. It states who takes part, what everyone gets out of it and what we try first. Everything is public.",
      links: [
        { label: "What we try first", href: "/docs/en/platform-design/#2-design/d8-mvp.pdt42.md" },
        { label: "The whole platform design", href: "/docs/en/platform-design/" },
        { label: "The vision", href: "/docs/en/vision/" },
      ],
      note: "The documents are in English.",
    },
    cta: {
      title: "Join in.",
      description: "Find an app for tomorrow. Or build the one that is still missing.",
      primary: "Find an app",
      primaryHref: "/apps/en/",
      secondary: "Build an app",
      secondaryHref: "/apps/en/build/",
    },
  },
};
