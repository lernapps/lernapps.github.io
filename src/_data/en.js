// All texts of the home page (English), the translation of de.js: same structure, same order. Templates contain
// no copy of their own. German is the source; keep both files in step.
// Language: plain English, short sentences, active voice, no jargon, "you". Links point to the English tree of a
// site (/apps/en/); the platform design and the vision are English only and keep their addresses.
export default {
  meta: {
    title: "lernapps.net — small learning apps, free and without sign-up",
    description:
      "lernapps.net helps you find small learning apps that work right away: free, without sign-up and without secret data collection. And it helps everyone who builds such apps.",
  },

  landing: {
    // ── HERO ──────────────────────────────────────────────────────────────────
    hero: {
      headline: "Germany's schools have a\ndigitalisation problem.", // line break for narrow screens
      subtitle: "And it is not about Wi-Fi or iPads, but about solutions that fit.",
    },

    // Order of the persona tabs (problems and solutions share it).
    personas: ["teacher", "parent", "creator", "learner"],

    // ── SECTION 1: Problem quotes ──────────────────────────────────────────────
    problems: {
      tabsAriaLabel: "Perspectives",
      scrollCue: "Sounds familiar?",
      teacher: {
        role: "Teacher",
        icon: "📚",
        quote:
          "The lesson starts in ten minutes. I am looking for something my class can use to try out fractions themselves. Everything I find wants a sign-up or runs on servers I don't know. Am I even allowed to use it? I'll take the worksheet again.",
      },
      parent: {
        role: "Parent",
        icon: "🏠",
        quote:
          "Tomorrow my son has a maths test. He is sitting at the kitchen table and doesn't understand percentages. I am looking for an app he can practise with. All I find is ads, subscriptions and apps that want an account first.",
      },
      creator: {
        role: "Built it myself",
        icon: "🔧",
        quote:
          "Over the weekend I built a small app my daughter can use to play with probability. She loves it. Would it help other children too? No idea. It sits on GitHub, and nobody finds it.",
      },
      learner: {
        role: "Student",
        icon: "🎒",
        quote:
          "The test is the day after tomorrow, and I just don't get functions. Videos don't help me. I want to try it out myself.",
      },
    },

    // ── SECTION 2: Ecosystem ───────────────────────────────────────────────────
    ecosystemProblem: {
      headline: "Good apps exist.\nThey just don't arrive.",
      body:
        "People build small learning apps for their class or their child. With the help of AI this often takes a weekend. But the apps don't reach other classes. Whoever wants to use one carries the risk alone: Am I allowed to? Is it safe? And whoever builds one never learns whether it helped anywhere else.",
      bridge: "lernapps.net brings these sides together.",
    },

    // ── SECTION 3: Portraits, one per persona ──────────────────────────────────
    solutions: {
      intro: "What lernapps.net does for you",
      tabsAriaLabel: "What lernapps.net does for you",
      askBox: {
        title: "Ask your AI assistant",
        intro: "Copy this text into your AI assistant. It reads lernapps.net and explains what the platform does for you.",
        copy: "Copy text",
        copied: "Copied",
      },
      teacher: {
        role: "If you teach",
        icon: "📚",
        headline: "A fitting app, in your lesson in a few minutes.",
        ask:
          "I teach and I am looking for digital learning material. Read https://lernapps.net/llms.txt and the pages it links to. Explain to me in plain words what lernapps.net is and what the platform offers me as a teacher. Also explain how lernapps.net checks apps, including those that run on other people's servers, and what I need to know about data protection. I can look for suitable apps myself in the catalogue: https://lernapps.net/apps/en/. Be honest about the limits.",
        story:
          "The lesson is about to start. You need an app for exactly this topic. On lernapps.net you search by topic and grade. The app runs right away in the browser: without installation and without sign-up.\n\nWe only list apps that need no server of their own. What your class types in stays on their devices.\n\nAfter the lesson you can say thanks with one click, or briefly tell us how it went. We don't need more.",
        cta: "Find apps",
        ctaHref: "/apps/en/",
      },
      parent: {
        role: "If your child has a test tomorrow",
        icon: "🏠",
        headline: "Practise tonight.",
        ask:
          "I am a parent and I am looking for safe learning apps for my child. Read https://lernapps.net/llms.txt and the pages it links to. Explain to me in plain words what lernapps.net is and what the platform offers me as a parent. Also explain how lernapps.net checks apps, including those that run on other people's servers, and what I need to know about cost, sign-up and data protection. I can look for suitable apps myself in the catalogue: https://lernapps.net/apps/en/. Be honest about the limits.",
        story:
          "Your child should practise tonight. On lernapps.net you find an app for the topic of the test. Your child can start right away. No account is needed, and nobody learns who they are.\n\nIf the app helped, say thanks. One click is enough.",
        cta: "Find apps",
        ctaHref: "/apps/en/",
      },
      creator: {
        role: "If you build apps",
        icon: "🔧",
        headline: "You are building anyway. We make it easier.",
        ask:
          "I like building small learning apps with AI help. Read https://lernapps.net/llms.txt and the pages it links to. Explain to me in plain words what lernapps.net is and what the platform offers people like me. What do I get back when someone uses my app? What does lernapps.net require of an app, including one that runs on my own server, and how do I list it? Tell me honestly whether it is worth it for me.",
        story:
          "You build your app anyway: for your class or for your child. lernapps.net makes that easier. You get guides that help your AI assistant build an app faster, one that others can use well too.\n\nYou list your app in a few minutes. You need no website of your own and no ads. The app stays yours.\n\nWhen someone uses your app and clicks “Thanks”, you hear about it. So you see when your app helped another class or another child.\n\nWe are only just starting. If you want to be among the first, join in.",
        cta: "Build an app",
        ctaHref: "/apps/en/build/",
      },
      learner: {
        role: "If you are learning",
        icon: "🎒",
        headline: "Try it yourself instead of just watching.",
        ask:
          "I am learning something right now and I am looking for something to try out. Read https://lernapps.net/llms.txt and the pages it links to. Explain to me briefly what lernapps.net is and what it does for my learning. I can check the catalogue myself to see whether there is already something on my topic: https://lernapps.net/apps/en/. Also tell me whether I have to sign up and whether anyone learns anything about me. And if nothing fits: think with me about whether we can build a small app for it together.",
        story:
          "You want to understand the topic, for example before the next test. Here you find small apps that let you try things out yourself. You need no account. We don't know who you are.\n\nDid an app help you? Click “Thanks”. The person who built it will be glad.",
        cta: "Find apps",
        ctaHref: "/apps/en/",
      },
    },

    // ── SECTION 4: Principles ──────────────────────────────────────────────────
    principles: {
      id: "how-it-works",
      heading: "How lernapps.net works",
      intro:
        "lernapps.net is free. Nobody earns money from it. There are no ads, and we collect no data in secret. The platform lives on two things: people build good learning apps. And others say thanks for them.",
      items: [
        {
          title: "Free and without ads",
          text: "The apps run in your browser. That needs no expensive servers. This is why lernapps.net costs nothing.",
        },
        {
          title: "What you type in stays on your device",
          text: "We only list apps that need no server of their own. They need no installation and no sign-up.",
        },
        {
          title: "We count openly, not in secret",
          text: "We only count clicks that someone makes on purpose, for example “Thanks”. We only store the total. We don't know who clicked.",
        },
        {
          title: "Thanks keeps it all alive",
          text: "A thanks shows the people who build apps that their work is worth it. Without this thanks there would soon be no new apps.",
        },
      ],
      privacy: {
        title: "If you look after data protection at your school",
        text:
          "The apps only run in the browser. They have no server of their own, no accounts and no cookies.\n\nOn the platform we only count clicks that someone makes on purpose: “Thanks”, “Used in class”, “I'll take a look” and short feedback. We only store the total of these clicks. We store no IP addresses and nothing in the browser. No data of students is created.",
      },
    },

    // ── SECTION 5: Why it is free, and why I do this ───────────────────────────
    whyFree: {
      id: "why-free",
      heading: "Why is this free?",
      text:
        "The apps run in your browser. We don't need expensive servers for that. Whoever builds apps does it anyway for their own class or their own child. That is why lernapps.net can be free, without ads and without selling data.\n\nWhat the platform needs is your thanks. It shows the people who build apps that their work is worth it.",
      personal: {
        heading: "Why I do this",
        text:
          "I am a software developer. For some time now I have seen how easy it has become to build small apps. Whoever knows what they are doing hardly needs time or money for it.\n\nVery little of this reaches schools. Whether a teacher uses a new app depends mostly on how much risk they are willing to carry themselves. Good apps exist, but they don't find their way into classes. I see a whole ecosystem with its tensions: between those who build, those who use, and the rules that are meant to protect everyone.\n\nComplaining about bad digitalisation in schools gets us nowhere. So I am trying something.\n\nI don't want to earn money with it. First I want to see whether the need is real. If lernapps.net carries, it could become an association, for example. Then the platform belongs to those who fill it with life.",
        signature: "Oliver Jägle",
      },
    },

    // ── SECTION 6: For sceptics ────────────────────────────────────────────────
    sceptics: {
      id: "does-it-work",
      heading: "“This won't work anyway.”",
      text:
        "Maybe. We don't know yet. That is why we start small: with a few apps and a few people who build and use them. We wrote down beforehand how we will notice whether it works. And how we will notice that it doesn't.\n\nWe planned lernapps.net with the Platform Design Toolkit, a method for designing platforms. It states who takes part, what everyone gets out of it and what we try first. Everything is public.",
      links: [
        { label: "What we try first", href: "/docs/platform-design/#2-design/d8-mvp.pdt42.md" },
        { label: "The whole platform design", href: "/docs/platform-design/" },
        { label: "The vision", href: "/docs/vision/" },
      ],
      note: "The documents are in English.",
    },

    // ── SECTION 7: Final CTA ───────────────────────────────────────────────────
    cta: {
      title: "Join the makers.",
      description:
        "Do you build apps, teach or want to practise? Try lernapps.net. And if an app helped you: say thanks.",
      primary: "Find apps",
      primaryHref: "/apps/en/",
      secondary: "See it on GitHub",
      secondaryHref: "https://github.com/lernapps",
    },
  },
};
