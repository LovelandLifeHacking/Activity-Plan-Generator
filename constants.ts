
export const allLearningOutcomes: Record<string, { code: string; desc: string }[]> = {
    English: [
        { code: "AC9E5LA03", desc: "describe how spoken, written and multimodal texts use language features and are typically organised" },
        { code: "AC9E5LA05", desc: "understand that the structure of a complex sentence includes a main clause and at least one dependent clause" },
        { code: "AC9E5LA08", desc: "understand how vocabulary is used to express greater precision of meaning, including specialist terms" },
        { code: "AC9E5LY01", desc: "listen to and explain information, ideas and opinions presented by others in formal and informal situations" },
        { code: "AC9E5LY05", desc: "use comprehension strategies such as visualising, predicting, connecting, summarising, monitoring and questioning" },
        { code: "AC9E5LY06", desc: "plan, create, edit and publish written and multimodal texts whose purposes may be imaginative, informative and persuasive" },
        { code: "AC9E5LY09", desc: "build and spell new words from knowledge of known words, base words, prefixes and suffixes, word origins" },
    ],
    Maths: [
        { code: "AC9M5N01", desc: "interpret, compare and order numbers with more than 2 decimal places" },
        { code: "AC9M5N03", desc: "compare and order fractions with the same and related denominators including mixed numerals" },
        { code: "AC9M5N06", desc: "solve problems involving multiplication of larger numbers by one- or two-digit numbers" },
        { code: "AC9M5N07", desc: "solve problems involving division, choosing efficient strategies and using digital tools" },
        { code: "AC9M5A01", desc: "recognise and explain patterns in sequences of fractions, decimals and whole numbers" },
        { code: "AC9M5M01", desc: "choose appropriate unformatted units of measurement for length, area, volume, capacity and mass" },
        { code: "AC9M5SP01", desc: "recognise that probabilities range from 0 to 1" },
        { code: "AC9M5ST02", desc: "interpret line graphs representing change over time" },
    ],
    Science: [
        { code: "AC9S5U01", desc: "examine how particular structural features and behaviours of living things enable their survival" },
        { code: "AC9S5U02", desc: "describe how weathering, erosion, transportation and deposition cause slow or rapid change to Earth’s surface" },
        { code: "AC9S5U03", desc: "identify sources of light, recognise that light travels in a straight path and describe how shadows are formed" },
        { code: "AC9S5U04", desc: "explain observable properties of solids, liquids and gases by modelling the motion and arrangement of particles" },
        { code: "AC9S5I01", desc: "pose investigable questions to identify patterns and test relationships and make reasoned predictions" },
        { code: "AC9S5I02", desc: "plan and conduct repeatable investigations to answer questions, including deciding variables" },
        { code: "AC9S5I05", desc: "compare methods and findings with those of others, recognise possible sources of error" },
    ],
    HASS: [
        { code: "AC9HS5K01", desc: "the economic, political and social causes of the establishment of British colonies in Australia after 1800" },
        { code: "AC9HS5K02", desc: "the impact of the development of British colonies in Australia on the lives of First Nations Australians" },
        { code: "AC9HS5K04", desc: "the influence of people, including First Nations Australians, on the characteristics of a place" },
        { code: "AC9HS5K05", desc: "the management of Australian environments, including managing severe weather events" },
        { code: "AC9HS5K08", desc: "types of resources, including natural, human and capital, and how they satisfy needs and wants" },
        { code: "AC9HS5S01", desc: "develop questions to investigate people, events, developments, places and systems" },
        { code: "AC9HS5S03", desc: "evaluate information and data in a range of formats to identify and describe patterns and trends" },
    ],
    Technologies: [
        { code: "AC9TDE6K01", desc: "explain how people in design and technologies occupations consider competing factors including sustainability" },
        { code: "AC9TDE6K02", desc: "explain how electrical energy can be transformed into movement, sound or light in a product" },
        { code: "AC9TDE6K05", desc: "explain how characteristics and properties of materials, systems, components, tools and equipment affect their use" },
        { code: "AC9TDE6P01", desc: "investigate needs or opportunities for designing, and the materials, components, tools... needed" },
        { code: "AC9TDI6K01", desc: "explain how data is represented in digital systems and transmitted as digital signals" },
        { code: "AC9TDI6P02", desc: "design algorithms involving multiple alternatives (branching) and iteration" },
        { code: "AC9TDI6P05", desc: "implement algorithms as visual programs involving control structures, variables and input" },
    ],
    "The Arts": [
        { code: "AC9ADA6E01", desc: "explore ways that the elements of dance are combined to communicate ideas, perspectives" },
        { code: "AC9ADR6E01", desc: "explore ways that the elements of drama are combined to communicate ideas, perspectives" },
        { code: "AC9AMU6E01", desc: "explore ways that the elements of music are combined to communicate ideas, perspectives" },
        { code: "AC9AMU6C01", desc: "manipulate elements of music and use compositional devices to communicate ideas... when composing" },
        { code: "AC9AVA6E01", desc: "explore ways that visual conventions, visual arts processes and materials are combined to communicate ideas" },
        { code: "AC9AVA6C01", desc: "use visual conventions, visual arts processes and materials to plan and create artworks" },
    ],
    HPE: [
        { code: "AC9HP6P01", desc: "explain how identities can be influenced by people and places, and how we can create positive self-identities" },
        { code: "AC9HP6P02", desc: "investigate resources and strategies to manage changes and transitions, including puberty" },
        { code: "AC9HP6P04", desc: "describe and demonstrate how respect and empathy can be expressed to positively influence relationships" },
        { code: "AC9HP6P07", desc: "describe strategies for seeking, giving or denying consent and rehearse how to communicate intentions" },
        { code: "AC9HP6M01", desc: "demonstrate fundamental movement skills in a variety of situations" },
        { code: "AC9HP6M04", desc: "participate in physical activities to investigate the body’s reaction to different levels of intensity" },
        { code: "AC9HP6M09", desc: "participate positively in groups and teams by contributing to group activities, encouraging others" },
    ]
};

export const existingThemes = [
    "Intersectionality", "Sustainability", "First Nations Australians", "Ethics", 
    "Belonging", "Gratitude", "Story", "STEAM", "Diversity", "Community", 
    "Advocacy", "Identity", "Colonialism", "Design Thinking", "Kindness & Compassion", 
    "Birds", "Capitalism", "Activism", "Sewing", "Nature", "Animals", "Country", "Safety"
];

export const SUBJECT_ORDER = ["English", "Maths", "Science", "HASS", "Technologies", "The Arts", "HPE"];
