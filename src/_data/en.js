// All texts of the site's pages (English), the translation of de.js: same structure, same order. Templates contain
// no copy of their own. German is the source; keep both files in step.
// Language: plain English, short sentences, active voice, no jargon, "you". Links point to the English tree of a
// site (/apps/en/, /tooling/en/, /docs/en/platform-design/): the frame stays English there, also where the text
// exists in English only.
export default {
  meta: {
    title: "lernapps.net — learning apps with no strings attached",
    description:
      "Small learning apps, made by parents and teachers: free in the browser, no account, no ads, no subscription. And a solid foundation for everyone who wants to build an app themselves.",
  },

  landing: {
    hero: {
      headline: "Learning apps with [[no strings]] attached.",
      subtitle: "Free in the browser, ready to go.",
      badges: ["No account", "No ads", "No subscription", "What you type stays on the device", "Works on phones too"],
      primary: "Find an app",
      primaryHref: "/apps/en/",
      secondary: "Build one",
      secondaryHref: "#get-involved",
      // A small joke on the side: the video loads only after the click. Without JavaScript the button stays hidden.
      cat: {
        open: "Cat videos instead",
        label: "Video: Minka the cat and the maths book",
        description: "Video description: The video is AI-generated. In a child's bedroom a cat sits among toys. It opens a maths book with its paw, looks at the equations, then looks into the camera with a blank face. It shrugs, closes the book and walks back to its place. The video has ambient sound only, nobody speaks.",
        fallback: "Watch the video (MP4)",
        endTitle: "Do you feel like Minka?",
        endText: "Learning does not have to be like this. Here you find apps that really teach something.",
        primary: "Find an app",
        primaryHref: "/apps/en/",
        close: "Close",
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
        { id: "mathe-karte", title: "Mathe-Karte", field: "Maths", line: "Maths explained step by step, with pictures and exercises.", href: "/apps/en/mathe-karte/", altDesktop: "Mathe-Karte on a computer: a percentage exercise with the calculation and a bar picture", altPhone: "Mathe-Karte on a phone: the calculation and a bar picture" },
        { id: "kniffel-trainer", title: "Kniffel-Trainer", field: "Maths", line: "Understand probability by playing Yahtzee.", href: "/apps/en/kniffel-trainer/", altDesktop: "Yahtzee Trainer on a computer: dice and score sheet in explain mode", altPhone: "Yahtzee Trainer on a phone: dice and score sheet" },
        { id: "textcheck", title: "Textcheck", field: "German", line: "Read carefully: find the mistakes in a text.", href: "/apps/en/textcheck/", altDesktop: "Textcheck on a computer: a text about pyramids with one word marked", altPhone: "Textcheck on a phone: a text about pyramids with one word marked" },
        { id: "naturwunder-quiz", title: "Naturwunder-Quiz", field: "Geography", line: "A geography quiz with an explanation for every answer.", href: "/apps/en/naturwunder-quiz/", altDesktop: "Naturwunder-Quiz on a computer: a question about the height of Mount Everest with a photo", altPhone: "Naturwunder-Quiz on a phone: a question about the height of Mount Everest with a photo" },
      ],
    },

    forYou: {
      id: "for-you",
      heading: "What you get",
      privacy: { text: "No account, no cookies, no tracking.", link: "Privacy notice", href: "/privacy/" },
      items: [
        { headline: "Covering a lesson in 7b?", text: "Pick subject and grade, share a link or show the QR code. Every child gets feedback, nobody needs an account.", cta: "Apps for class", ctaHref: "/apps/en/" },
        { headline: "Is your child stuck on a topic?", text: "Apps explain it step by step, with exercises and feedback. Free, and always there to come back to.", cta: "Apps to learn", ctaHref: "/apps/en/" },
        { headline: "Test next week?", text: "Your AI assistant turns the worksheets into a practice app. In minutes, no subject knowledge needed.", cta: "To practise", ctaHref: "/practice/en/" },
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
        { icon: "❓", title: "Quiz", text: "Questions with answers to choose from. After every answer it says why it is right or wrong, and where to read on." },
        { icon: "📖", title: "Explainer", text: "Chapters of pages that explain. Every page has exercises. The pages can be read without JavaScript too.", extra: "If you like, add an AI tutor: the app gives your own AI assistant the task, the solution and the typical mistakes. This is optional. The app works entirely without AI and sends nothing itself." },
        { icon: "🎮", title: "Interactive app", text: "Learning by doing: a game, a training, an experiment. What the learners do is the content." },
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
        { id: "costs", icon: "🐙", title: "GitHub as a free backbone", text: "This is why it works without money: the apps and the catalog are static pages on GitHub Pages. An entry is a pull request, the check runs in GitHub Actions. There is no server of our own that costs money." },
        { id: "data", icon: "🔒", title: "Privacy as a feature", text: "Every app runs entirely in the browser. There is no server with data, no database and no account. What is not collected cannot be lost or sold.", link: { label: "The privacy notice", href: "/privacy/" } },
        { id: "ai", icon: "🤖", title: "Readable for AI assistants", text: "Every part of lernapps.net has an llms.txt. So an assistant can find the right app, explain the platform or build an app itself. Without anyone having to run an API." },
        { id: "open", icon: "🧭", title: "Planned in the open", text: "We designed lernapps.net with the Platform Design Toolkit: who takes part, what everyone gets out of it, what we try first. Everything is public, including what we don't know yet." },
      ],
      principles: {
        id: "principles",
        heading: "The principles",
        intro: "They apply to everyone alike: to those who build apps and to those who use them.",
        items: [
          { icon: "🤝", title: "No company behind it", text: "Nobody earns money from lernapps.net. No subscription, no ads, no selling of data. Not later either." },
          { icon: "📂", title: "Open, not closed", text: "The rules, the plan and the source code are public. Anyone can read how decisions are made here." },
          { icon: "🏡", title: "Your app stays yours", text: "Every app stays with the person who built it. lernapps.net shows it but does not own it." },
          { icon: "🔒", title: "The apps collect nothing", text: "No account, no cookies, no tracking. What someone types stays on their device." },
          { icon: "💬", title: "Honest about limits", text: "Every app says what it can do and what it can't. We say openly what we don't know yet." },
          { icon: "💙", title: "Thanks instead of money", text: "Whoever uses an app can say thanks. Today one click opens a ready-made email to lernapps.net, and we pass the thanks on to the person who built the app. Later one click will be enough, without any email." },
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
      description: "Your own AI assistant as a tutor: the learning content of the apps can be read by it. It accompanies, guides and supports you. lernapps.net learns nothing about it.",
    },
    hero: {
      headline: "Your tutor, not ours.",
      subtitle: "The learning content can be read by your own AI assistant. It accompanies, guides and supports you. lernapps.net learns nothing about it.",
      jump: [
        { label: "Your tutor", href: "#tutor" },
        { label: "How it works", href: "#how" },
        { label: "Rules", href: "#rules" },
        { label: "Privacy", href: "#privacy" },
        { label: "Limits", href: "#limits" },
      ],
    },
    about: {
      id: "tutor",
      heading: "A personal tutor who can help you on your journey",
      text: "Every page and every exercise of an explainer app has an address and exists as readable text. Your AI assistant can open it, read it and refer to it. So it knows what is explained, which exercise you solved and what you typed.\n\nThat lets it accompany, guide and support you: patient, personal and always there. This happens in your assistant, with your provider. lernapps.net learns nothing about it.",
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
      heading: "How it works",
      intro: "This is how it runs in Mathe-Karte, an explainer app.",
      steps: [
        { title: "Assess yourself", text: "You do the self-assessment of an app. At the end it shows for each page: “You probably know this”, “Have another look” or “Read it closely”. The result stays on your device." },
        { title: "Choose an assistant", text: "You choose your assistant: Claude, ChatGPT, Mistral Vibe, or “Copy text” for any other. You use your own account with the provider." },
        { title: "Let it guide you", text: "One click gives the assistant your result and what you typed. It sends you page by page to what does not stick yet. Explaining and practising happen on the app's pages." },
        { title: "Learn on the page", text: "At the top of each page you switch on “Learn with an AI tutor”. After a wrong answer, “Why?” gives the tutor the exercise, your input and the app's message. “Back to the tutor” tells it what you practised." },
        { title: "Assess again", text: "When the pages of a chapter stick, you do a new round. After the result, the assistant decides how to go on." },
      ],
    },
    rules: {
      id: "rules",
      heading: "How the tutor works",
      intro: "Your assistant gets these rules from the app. You can read them first.",
      items: [
        { icon: "❓", title: "It asks instead of solving", text: "The tutor names the idea behind the mistake and asks a guiding question. It does not give the answer." },
        { icon: "🖼️", title: "It starts with the picture", text: "It explains with the picture on the page and asks first: what do you see?" },
        { icon: "✏️", title: "Calculating happens on paper", text: "You type the result into the app. In the chat there are estimating and why questions." },
        { icon: "✅", title: "Done is what you can explain", text: "A page counts as done when three exercises were right and you can explain one of them. Then it asks for an exercise by hand: a photo of the sheet only, without a name. It checks every step and names the first wrong one instead of correcting it." },
        { icon: "🎬", title: "The video comes last", text: "Exercises come first. It recommends the video when you cannot repeat the explanation after two tries." },
        { icon: "🧭", title: "After assessing, it keeps it short", text: "It answers with three sentences at most, one question and a link to the next page." },
      ],
    },
    transparency: {
      id: "transparency",
      heading: "You see what your tutor gets",
      text: "On every page and in the self-assessment there is the link “See what your tutor gets”. Parents and teachers can read the whole brief before a child passes it on.",
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
      heading: "Privacy",
      title: "No AI in lernapps.net",
      text: "There is no AI built into lernapps.net, and we run no chatbot. The apps only make their learning content readable for your assistant. Everything else happens in your assistant, with your provider, to whom you agreed separately there. lernapps.net learns nothing about it.\n\nThe app sends nothing. One click gives the assistant your result and what you typed, and you can read the brief first. This is voluntary. Everything works without AI too.",
      link: "To the privacy notice",
      href: "/privacy/#en-ai",
    },
    limits: {
      id: "limits",
      heading: "Honest about limits",
      items: [
        { title: "An assistant can be wrong.", text: "The checked source is the app's pages. If something does not match, the page counts." },
        { title: "AI does not replace people.", text: "Learning is also a shared experience: with friends, parents, teachers. An assistant is patient and always there, but it is not in the room when you practise together." },
        { title: "We cannot check how your assistant behaves.", text: "The rules are a request to it. That is not a guarantee." },
        { title: "Everything works without AI.", text: "The pages, the exercises and the app's messages (“Not right. First count all possible outcomes …”) work without an assistant." },
      ],
    },
    cta: {
      title: "Try it.",
      description: "Do a self-assessment. Afterwards you decide whether to add a tutor.",
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
        id: "teachers", icon: "📚", role: "If you teach",
        headline: "Use apps and tell us how it went.",
        text: "Use an app in class or when you cover a lesson. Afterwards you can say thanks with one click or give short feedback on whether it fitted. Tell your colleagues about it. And if an app is missing: tell us, or build it yourself.",
        cta: "Find apps", ctaHref: "/apps/en/",
        ask: "I teach and I am looking for digital learning material. Read https://lernapps.net/llms.txt and the pages it links to. Explain to me in plain words what lernapps.net is, what the platform offers me as a teacher and how it keeps things safe. Also have a look at the catalogue: https://lernapps.net/apps/en/. Be honest about the limits.",
      },
      {
        id: "parents", icon: "🏠", role: "If you help a child learn",
        headline: "Practise together and say thanks.",
        text: "Look for an app on the topic your child needs help with. Did it help? A thank-you shows the person who built it that their work is worth it. And share the link with other parents, for example in the class group.",
        cta: "Find apps", ctaHref: "/apps/en/",
        ask: "I am a parent and I am looking for safe learning apps for my child. Read https://lernapps.net/llms.txt and the pages it links to. Explain to me in plain words what lernapps.net is, what the platform offers me as a parent and how it keeps things safe. Also have a look at the catalogue: https://lernapps.net/apps/en/. Be honest about the limits.",
      },
      {
        id: "learners", icon: "🎒", role: "If you are learning yourself",
        headline: "Try things out instead of just watching.",
        text: "Find an app on your topic. You don't need an account, and nobody knows who you are. Is there none yet? Maybe you build one yourself, with your AI assistant.",
        cta: "Find apps", ctaHref: "/apps/en/",
        ask: "I am learning something right now and I am looking for something to try out. Read https://lernapps.net/llms.txt and the pages it links to. Explain to me briefly what lernapps.net is, what it does for my learning and how it keeps things safe. Also have a look at the catalogue (https://lernapps.net/apps/en/): is there already something on my topic? If not: think with me about whether we can build a small app for it together.",
      },
      {
        id: "makers", icon: "🔧", role: "If you want to build an app",
        headline: "Build the app that is still missing.",
        text: "You bring the idea and the content, your AI assistant builds it with you. lernapps.net gives you foundations, tools and checks. Your app stays yours. Whoever uses it can say thanks, and you hear about it.",
        cta: "Build an app", ctaHref: "/apps/en/build/",
        secondary: "Already have an app? List it in a few hours", secondaryHref: "/apps/en/build/#eintragen",
        ask: "I like building small learning apps with AI help. Read https://lernapps.net/llms.txt and the pages it links to. Explain to me in plain words what lernapps.net is, what the platform offers people like me and what I get back when someone uses my app. Tell me honestly whether it is worth it for me.",
      },
      {
        id: "platform", icon: "🧩", role: "If you want to work on the platform",
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
