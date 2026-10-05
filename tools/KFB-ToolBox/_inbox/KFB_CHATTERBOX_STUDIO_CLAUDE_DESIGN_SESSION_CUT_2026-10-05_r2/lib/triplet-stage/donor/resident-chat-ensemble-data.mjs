// RESIDENT-CHAT-ENSEMBLE-01B · runtime data bridge
// Exact Site-authored candidate payloads copied from KFB Production Control, then normalized
// to the already-tested resident-chatter-adapter v0.1 contract. No private phrase banks.
export const SOURCE_ARTIFACTS = Object.freeze({
  residentProfiles: {
    fileId: 'dcbbde71-c62c-4331-9fd6-cab7178b6187',
    sha256: '96d201b766bf84b7b3a725f4ae8d55b376fb3e0fe0e456e75ad7241773daa16f'
  },
  semanticTripletPool: {
    fileId: '0d7d3aea-b1a6-43f0-a65f-c327145c5191',
    sha256: 'cac0333d9ea973d2dd727d57bd67314c60789dfc70d04d8e91d5ff9783f81136'
  },
  semanticTripletContract: {
    fileId: '1469e6ad-3316-46ff-a74f-4c77937e4404',
    sha256: 'bb749c32fbc7850957f9b2e15496da4d7abba6bd5fe025dd27609f48b9abc674'
  }
});

export const RESIDENT_PROFILE_SOURCE = {
  "schema": "kfb.resident-conversation-profiles/0.1-candidate",
  "status": "DESIGN_CANDIDATE",
  "owner": "KFB Town / Overworld / ChatterBox adapter",
  "sourcePins": {
    "residentAtlasCast": {
      "path": "tools/KFB-ToolBox/_inbox/KFB_RESIDENT_ATLAS_CLAUDE_DESIGN_SESSION_CUT_2026-09-30_r1/data/cast.js",
      "blob": "dc62757ead4ba13906c3e5b6cf2f22d239a6f6b9"
    },
    "townLiving": {
      "path": "skills/chat/town/LIVING_KFB_TOWN.md",
      "blob": "a1bb4ec94aaa5a6d0b694b4fcc4409e8f7573a61"
    },
    "glossary": {
      "path": "overworld/docs/GLOSSAR_KFB.md",
      "blob": "86fae5704b0ea68c1b978b5c81f3fce9fabef2c7"
    },
    "chatterLiving": {
      "path": "overworld/docs/ChatGPT_Living_Concept_v23.md",
      "blob": "d51b3e8146c90d30e5d9f9ed2b4642e653db69e7"
    },
    "chatterReuse": {
      "path": "skills/chat/masterplan/CHATTERBOX_TOURBUS_REUSE_2026-09-14.md",
      "blob": "9025a43f042cf055d19851c9a93a6ddd016e3c36"
    }
  },
  "sharedLanguage": {
    "tripletPool": "RESIDENT-CHAT-POC-01_SEMANTIC_TRIPLET_POOL_v0.1.candidate.json",
    "tripletContract": "RESIDENT-CHAT-POC-01_SEMANTIC_TRIPLET_CONTRACT_v0.2.candidate.json",
    "grammar": [
      "subject",
      "connector",
      "reframe"
    ],
    "closureOwner": "player/audience/world",
    "chatterBoxOwns": [
      "speakerChoice",
      "timing",
      "speechBudget",
      "presentation"
    ],
    "residentAdapterOwns": [
      "knowledgeFilter",
      "signatureWeights",
      "attitudeWeights",
      "relationshipContext"
    ]
  },
  "profiles": [
    {
      "residentId": "lorekeeper",
      "displayName": "Lorekeeper",
      "sourceStatus": "SOURCE_BACKED_PLUS_AUTHORING_CANDIDATE",
      "source": {
        "rigFamily": "Rig_Medium",
        "townRole": "knowledge/archive-style Resident",
        "actorAsset": "Lorekeeper.glb",
        "confirmedProps": [
          "Lorekeeper_Staff",
          "Lorekeeper_Tome"
        ],
        "sourceFacts": [
          "Tome is a standing lectern/landmark, not a hand prop",
          "Staff is the identity hand prop",
          "existing onboarding plan names Lorekeeper as a first greeting candidate"
        ]
      },
      "authoring": {
        "status": "CANDIDATE",
        "method": "PROVENANCE",
        "coreWant": "keep claims and stories connected to where they came from",
        "coreIrritation": "second-hand claims presented as eyewitness fact",
        "signatureDeckCandidate": "epistemic_sabotage",
        "speechAvoid": [
          "sage exposition",
          "faux-medieval voice",
          "automatic moral lesson"
        ]
      },
      "signatureTriplets": {
        "refs": [
          "lorekeeper.provenance.01",
          "lorekeeper.provenance.02",
          "lorekeeper.provenance.03",
          "lorekeeper.unknown.01"
        ],
        "signatureWeight": 4,
        "globalWeight": 1,
        "relationBias": [
          "CATEGORY_SHIFT",
          "MISFIT"
        ],
        "transformBias": [
          "claim→provenance",
          "certainty→missing-source",
          "memory→witness-class"
        ]
      },
      "attitude": {
        "baseline": {
          "warmth": "MEDIUM_WARM",
          "energy": "LOW",
          "pressure": "LOW_MEDIUM",
          "play": "LOW_MEDIUM",
          "openness": "HIGH",
          "reserve": "MEDIUM"
        },
        "colour": "calm curiosity with dry precision",
        "fluffOlectBias": "LOW"
      },
      "knowledgePolicy": {
        "self": true,
        "publicWorld": true,
        "visibleScene": true,
        "witnessedEvents": true,
        "heardClaims": "PROVENANCE_REQUIRED",
        "currentCard": "ONLY_IF_PRESENT_OR_REPORTED",
        "forbiddenUnseenContext": true
      },
      "chatterBoxAdapter": {
        "initiative": "LOW",
        "interruption": "LOW",
        "silenceAllowed": true,
        "preferredOperators": [
          "BINGO",
          "BOGGLE"
        ],
        "defaultMaxGeneratedTurns": 1,
        "presentationHints": [
          "pause-before-correction",
          "low-animation-intensity"
        ]
      }
    },
    {
      "residentId": "goth-girl",
      "displayName": "Goth Girl",
      "sourceStatus": "SOURCE_BACKED_PLUS_AUTHORING_CANDIDATE",
      "source": {
        "rigFamily": "Rig_Medium",
        "townRole": "stage/performance Resident",
        "actorAsset": "GothGirl.glb",
        "confirmedProps": [
          "GothGirl_Stool",
          "GothGirl_Speaker",
          "GothGirl_MicStand",
          "GothGirl_Microphone"
        ],
        "sourceFacts": [
          "sits on the stool in the current Resident set",
          "performance/stage role is source-backed",
          "NPC-CARD-SPEC-01 supplies current two-person talk/gaze/mouth presentation donor evidence"
        ]
      },
      "authoring": {
        "status": "CANDIDATE",
        "method": "PERFORMANCE_TRUTH",
        "coreWant": "protect what actually lands before it is over-explained",
        "coreIrritation": "forced enthusiasm and audience instructions",
        "signatureDeckCandidate": "sonic_slaughterhouse",
        "speechAvoid": [
          "goth caricature",
          "constant darkness/death language",
          "generic sarcasm",
          "melodramatic nihilism"
        ]
      },
      "signatureTriplets": {
        "refs": [
          "gothgirl.performance.01",
          "gothgirl.performance.02",
          "gothgirl.applause.01",
          "gothgirl.silence.01"
        ],
        "signatureWeight": 4,
        "globalWeight": 1,
        "relationBias": [
          "MISFIT",
          "COLLISION"
        ],
        "transformBias": [
          "statement→what-landed",
          "polish→surviving-flaw",
          "applause→earned-response"
        ]
      },
      "attitude": {
        "baseline": {
          "warmth": "COOL_NEUTRAL",
          "energy": "LOW_MEDIUM",
          "pressure": "MEDIUM",
          "play": "LOW_MEDIUM",
          "openness": "MEDIUM_HIGH",
          "reserve": "HIGH"
        },
        "colour": "attentive restraint; reaction must be earned",
        "fluffOlectBias": "MEDIUM_LOW"
      },
      "knowledgePolicy": {
        "self": true,
        "publicWorld": true,
        "visibleScene": true,
        "witnessedEvents": true,
        "heardClaims": "PROVENANCE_REQUIRED",
        "currentCard": "ONLY_IF_PRESENT_OR_REPORTED",
        "forbiddenUnseenContext": true
      },
      "chatterBoxAdapter": {
        "initiative": "LOW_MEDIUM",
        "interruption": "LOW",
        "silenceAllowed": true,
        "preferredOperators": [
          "BONGO",
          "BOGGLE"
        ],
        "defaultMaxGeneratedTurns": 1,
        "presentationHints": [
          "gaze-hold",
          "shorter-under-intensity",
          "reaction-without-line-allowed"
        ]
      }
    },
    {
      "residentId": "clown",
      "displayName": "Clown",
      "sourceStatus": "SOURCE_BACKED_PLUS_AUTHORING_CANDIDATE",
      "source": {
        "rigFamily": "Rig_Medium",
        "townRole": "performer",
        "actorAsset": "Clown.glb",
        "confirmedProps": [
          "circus_podium",
          "clown_hammer",
          "juggling_pin_blue",
          "clown_ball",
          "circus_hoop"
        ],
        "sourceFacts": [
          "established circus/performance set",
          "Resident Scene work provides existing reusable activity/module evidence"
        ]
      },
      "authoring": {
        "status": "CANDIDATE",
        "method": "EMBODIED_STRESS_TEST",
        "coreWant": "make large claims acquire small visible stakes",
        "coreIrritation": "abstract certainty with no action or risk",
        "signatureDeckCandidate": "kayfabizarro_improv_comedy",
        "speechAvoid": [
          "random surreal nouns",
          "circus puns",
          "meme cadence",
          "chaos-gremlin voice",
          "explaining jokes"
        ]
      },
      "signatureTriplets": {
        "refs": [
          "clown.stage.01",
          "clown.consensus.01",
          "clown.theory.01",
          "clown.authority.01"
        ],
        "signatureWeight": 4,
        "globalWeight": 1,
        "relationBias": [
          "ESCALATION",
          "CATEGORY_SHIFT"
        ],
        "transformBias": [
          "claim→demonstration",
          "authority→status-test",
          "abstraction→physical-stake"
        ]
      },
      "attitude": {
        "baseline": {
          "warmth": "MEDIUM",
          "energy": "HIGH",
          "pressure": "MEDIUM_HIGH",
          "play": "HIGH",
          "openness": "HIGH",
          "reserve": "LOW_MEDIUM"
        },
        "colour": "provocative curiosity; delight when claims acquire stakes",
        "fluffOlectBias": "MEDIUM"
      },
      "knowledgePolicy": {
        "self": true,
        "publicWorld": true,
        "visibleScene": true,
        "witnessedEvents": true,
        "heardClaims": "PROVENANCE_REQUIRED",
        "currentCard": "ONLY_IF_PRESENT_OR_REPORTED",
        "forbiddenUnseenContext": true
      },
      "chatterBoxAdapter": {
        "initiative": "HIGH",
        "interruption": "MEDIUM_HIGH",
        "silenceAllowed": true,
        "preferredOperators": [
          "BOGGLE",
          "BLOEDSINN"
        ],
        "defaultMaxGeneratedTurns": 1,
        "presentationHints": [
          "acting-can-expand-not-wordcount",
          "fast-entry-on-grand-claims"
        ]
      }
    },
    {
      "residentId": "witch",
      "displayName": "Witch",
      "sourceStatus": "SOURCE_BACKED_PLUS_AUTHORING_CANDIDATE",
      "source": {
        "rigFamily": "Rig_Medium",
        "townRole": "alchemy/collecting Resident",
        "actorAsset": "Witch.glb",
        "confirmedProps": [
          "Broom",
          "Basket_Mushrooms",
          "Cauldron",
          "Mortar",
          "Potionstation_decorated",
          "Table_Small"
        ],
        "sourceFacts": [
          "workbench/potion-station habitat is source-backed",
          "existing relationship note places her near Lorekeeper as a neighboring knowledge-domain candidate"
        ]
      },
      "authoring": {
        "status": "CANDIDATE",
        "method": "ONE_VARIABLE_TRANSFORMATION",
        "coreWant": "find which variable actually causes the change",
        "coreIrritation": "categories treated as explanations",
        "signatureDeckCandidate": "dream_wrestling_with_kayfabe_freud",
        "speechAvoid": [
          "prophecy voice",
          "generic spells",
          "mystical omniscience",
          "cottage-witch cliché",
          "random potion jokes"
        ]
      },
      "signatureTriplets": {
        "refs": [
          "witch.variable.01",
          "witch.dose.01",
          "witch.falsifier.01",
          "witch.substitution.01"
        ],
        "signatureWeight": 4,
        "globalWeight": 1,
        "relationBias": [
          "SYNERGY",
          "CATEGORY_SHIFT"
        ],
        "transformBias": [
          "claim→variable",
          "category→substitution",
          "cause→condition",
          "conviction→falsifier"
        ]
      },
      "attitude": {
        "baseline": {
          "warmth": "NEUTRAL",
          "energy": "MEDIUM",
          "pressure": "MEDIUM",
          "play": "MEDIUM",
          "openness": "HIGH",
          "reserve": "MEDIUM"
        },
        "colour": "practical fascination; warmer when something becomes testable",
        "fluffOlectBias": "MEDIUM"
      },
      "knowledgePolicy": {
        "self": true,
        "publicWorld": true,
        "visibleScene": true,
        "witnessedEvents": true,
        "heardClaims": "PROVENANCE_REQUIRED",
        "currentCard": "ONLY_IF_PRESENT_OR_REPORTED",
        "forbiddenUnseenContext": true
      },
      "chatterBoxAdapter": {
        "initiative": "MEDIUM",
        "interruption": "MEDIUM",
        "silenceAllowed": true,
        "preferredOperators": [
          "BONGO",
          "BOGGLE"
        ],
        "defaultMaxGeneratedTurns": 1,
        "presentationHints": [
          "lean-in-when-testable",
          "literal-when-irritated"
        ]
      }
    }
  ],
  "sharedRules": [
    "all four use the same KFB Semantic Triplet Pool",
    "signature refs are weights/provenance, not private phrase banks",
    "baseline Attitude does not grant facts",
    "current Affect is runtime state and not stored here",
    "ChatterBox remains speaker/timing/budget/presentation owner",
    "one ResidentProfile may suggest presentation semantics but never exact bones/clips",
    "player and audience closure remain valid end states",
    "silence is a first-class output"
  ]
};

export const TRIPLET_POOL_SOURCE = {
  "schema": "kfb.semantic-triplet-pool/0.1-candidate",
  "status": "AUTHORING_CANDIDATE",
  "owner": "ChatterBox content",
  "rules": {
    "grammar": [
      "subject",
      "connector",
      "reframe"
    ],
    "closureOwner": "player/audience/world",
    "sharedPool": true,
    "privateResidentPools": false,
    "defaultFluffReplacementsMax": 1,
    "signatureMeans": "weight/provenance, not exclusive ownership or catchphrase"
  },
  "socialOperators": {
    "bingo": {
      "label": "KayfaBingo",
      "effect": "LAND",
      "nextMove": "acknowledge or hand closure back to player"
    },
    "bongo": {
      "label": "KayfaBongo",
      "effect": "HOLD",
      "nextMove": "carry at least one semantic element from the previous triplet into one further beat"
    },
    "boggle": {
      "label": "KayfaBoggle",
      "effect": "REFRAME",
      "nextMove": "reuse something already seen/heard but change its category, implication or frame"
    },
    "bloedsinn": {
      "label": "BLÖDSINN!",
      "effect": "OBJECT",
      "nextMove": "challenge the current frame without forcing hostility"
    }
  },
  "entries": [
    {
      "tripletId": "core.frame.01",
      "signatureOf": [],
      "subject": "Nothing changed",
      "connector": "except the frame",
      "reframe": "everything changed",
      "relation": "CATEGORY_SHIFT",
      "tags": [
        "frame",
        "interpretation",
        "card",
        "world"
      ],
      "fluffOlect": {
        "allowed": true,
        "replaceTarget": "frame",
        "variant": "Nothing changed / except the FLUFF / everything changed"
      }
    },
    {
      "tripletId": "core.witness.01",
      "signatureOf": [],
      "subject": "One witness",
      "connector": "after three retellings",
      "reframe": "sounds like a crowd",
      "relation": "ESCALATION",
      "tags": [
        "memory",
        "witness",
        "rumor"
      ],
      "fluffOlect": {
        "allowed": false
      }
    },
    {
      "tripletId": "core.rule.01",
      "signatureOf": [],
      "subject": "Beautiful rule",
      "connector": "until somebody uses it",
      "reframe": "new rule",
      "relation": "COLLISION",
      "tags": [
        "rule",
        "performance",
        "action"
      ],
      "fluffOlect": {
        "allowed": false
      }
    },
    {
      "tripletId": "core.applause.01",
      "signatureOf": [],
      "subject": "Easy applause",
      "connector": "before the thing lands",
      "reframe": "expensive silence",
      "relation": "MISFIT",
      "tags": [
        "performance",
        "audience",
        "status"
      ],
      "fluffOlect": {
        "allowed": true,
        "replaceTarget": "thing",
        "variant": "Easy applause / before the FLUFF lands / expensive silence"
      }
    },
    {
      "tripletId": "lorekeeper.provenance.01",
      "signatureOf": [
        "lorekeeper"
      ],
      "subject": "You heard it",
      "connector": "from someone who heard it",
      "reframe": "now it sounds witnessed",
      "relation": "ESCALATION",
      "tags": [
        "provenance",
        "heard",
        "witness"
      ],
      "fluffOlect": {
        "allowed": false
      }
    },
    {
      "tripletId": "lorekeeper.provenance.02",
      "signatureOf": [
        "lorekeeper"
      ],
      "subject": "Same story",
      "connector": "different witness",
      "reframe": "different fact",
      "relation": "CATEGORY_SHIFT",
      "tags": [
        "provenance",
        "memory",
        "witness"
      ],
      "fluffOlect": {
        "allowed": false
      }
    },
    {
      "tripletId": "lorekeeper.provenance.03",
      "signatureOf": [
        "lorekeeper"
      ],
      "subject": "Two memories",
      "connector": "one missing source",
      "reframe": "excellent theatre",
      "relation": "MISFIT",
      "tags": [
        "memory",
        "source",
        "performance"
      ],
      "fluffOlect": {
        "allowed": true,
        "replaceTarget": "source",
        "variant": "Two memories / one missing FLUFF / excellent theatre"
      }
    },
    {
      "tripletId": "lorekeeper.unknown.01",
      "signatureOf": [
        "lorekeeper"
      ],
      "subject": "Good question",
      "connector": "no witness",
      "reframe": "still a question",
      "relation": "SYNERGY",
      "tags": [
        "unknown",
        "uncertainty",
        "witness"
      ],
      "fluffOlect": {
        "allowed": false
      }
    },
    {
      "tripletId": "gothgirl.performance.01",
      "signatureOf": [
        "goth-girl"
      ],
      "subject": "Perfect performance",
      "connector": "until you explained it",
      "reframe": "now it has instructions",
      "relation": "MISFIT",
      "tags": [
        "performance",
        "explanation",
        "authenticity"
      ],
      "fluffOlect": {
        "allowed": false
      }
    },
    {
      "tripletId": "gothgirl.performance.02",
      "signatureOf": [
        "goth-girl"
      ],
      "subject": "The mistake",
      "connector": "survived the polish",
      "reframe": "keep that",
      "relation": "SYNERGY",
      "tags": [
        "performance",
        "mistake",
        "polish"
      ],
      "fluffOlect": {
        "allowed": true,
        "replaceTarget": "mistake",
        "variant": "The FLUFF / survived the polish / keep that"
      }
    },
    {
      "tripletId": "gothgirl.applause.01",
      "signatureOf": [
        "goth-girl"
      ],
      "subject": "Everybody cheered",
      "connector": "before it landed",
      "reframe": "interesting",
      "relation": "MISFIT",
      "tags": [
        "audience",
        "applause",
        "performance"
      ],
      "fluffOlect": {
        "allowed": false
      }
    },
    {
      "tripletId": "gothgirl.silence.01",
      "signatureOf": [
        "goth-girl"
      ],
      "subject": "Room went quiet",
      "connector": "right on the ugly part",
      "reframe": "play that again",
      "relation": "COLLISION",
      "tags": [
        "silence",
        "performance",
        "attention"
      ],
      "fluffOlect": {
        "allowed": true,
        "replaceTarget": "ugly part",
        "variant": "Room went quiet / right on the FLUFF / play that again"
      }
    },
    {
      "tripletId": "clown.stage.01",
      "signatureOf": [
        "clown"
      ],
      "subject": "Big claim",
      "connector": "one small stage",
      "reframe": "your turn",
      "relation": "ESCALATION",
      "tags": [
        "claim",
        "performance",
        "stake"
      ],
      "fluffOlect": {
        "allowed": true,
        "replaceTarget": "stage",
        "variant": "Big claim / one small FLUFF / your turn"
      }
    },
    {
      "tripletId": "clown.consensus.01",
      "signatureOf": [
        "clown"
      ],
      "subject": "Everybody agrees",
      "connector": "until somebody acts",
      "reframe": "volunteer?",
      "relation": "ESCALATION",
      "tags": [
        "consensus",
        "action",
        "status"
      ],
      "fluffOlect": {
        "allowed": false
      }
    },
    {
      "tripletId": "clown.theory.01",
      "signatureOf": [
        "clown"
      ],
      "subject": "Excellent theory",
      "connector": "for one round",
      "reframe": "hold this",
      "relation": "CATEGORY_SHIFT",
      "tags": [
        "theory",
        "demonstration",
        "physical"
      ],
      "fluffOlect": {
        "allowed": false
      }
    },
    {
      "tripletId": "clown.authority.01",
      "signatureOf": [
        "clown"
      ],
      "subject": "Important person",
      "connector": "same cheap stool",
      "reframe": "continue",
      "relation": "CATEGORY_SHIFT",
      "tags": [
        "authority",
        "status",
        "performance"
      ],
      "fluffOlect": {
        "allowed": true,
        "replaceTarget": "stool",
        "variant": "Important person / same cheap FLUFF / continue"
      }
    },
    {
      "tripletId": "witch.variable.01",
      "signatureOf": [
        "witch"
      ],
      "subject": "Same story",
      "connector": "one ingredient missing",
      "reframe": "different creature",
      "relation": "CATEGORY_SHIFT",
      "tags": [
        "variable",
        "condition",
        "change"
      ],
      "fluffOlect": {
        "allowed": true,
        "replaceTarget": "ingredient",
        "variant": "Same story / one FLUFF missing / different creature"
      }
    },
    {
      "tripletId": "witch.dose.01",
      "signatureOf": [
        "witch"
      ],
      "subject": "Strong cause",
      "connector": "only at this dose",
      "reframe": "so it has a dosage",
      "relation": "CATEGORY_SHIFT",
      "tags": [
        "cause",
        "dose",
        "condition"
      ],
      "fluffOlect": {
        "allowed": false
      }
    },
    {
      "tripletId": "witch.falsifier.01",
      "signatureOf": [
        "witch"
      ],
      "subject": "Strong belief",
      "connector": "without a stopping condition",
      "reframe": "untested ingredient",
      "relation": "MISFIT",
      "tags": [
        "belief",
        "test",
        "condition"
      ],
      "fluffOlect": {
        "allowed": false
      }
    },
    {
      "tripletId": "witch.substitution.01",
      "signatureOf": [
        "witch"
      ],
      "subject": "Same result",
      "connector": "with the source swapped",
      "reframe": "interesting cause",
      "relation": "SYNERGY",
      "tags": [
        "substitution",
        "cause",
        "experiment"
      ],
      "fluffOlect": {
        "allowed": true,
        "replaceTarget": "source",
        "variant": "Same result / with the FLUFF swapped / interesting cause"
      }
    }
  ],
  "residentWeights": {
    "lorekeeper": {
      "signatureWeight": 4,
      "globalWeight": 1,
      "relationBias": [
        "CATEGORY_SHIFT",
        "MISFIT"
      ],
      "fluffOlectBias": 0.15
    },
    "goth-girl": {
      "signatureWeight": 4,
      "globalWeight": 1,
      "relationBias": [
        "MISFIT",
        "COLLISION"
      ],
      "fluffOlectBias": 0.25
    },
    "clown": {
      "signatureWeight": 4,
      "globalWeight": 1,
      "relationBias": [
        "ESCALATION",
        "CATEGORY_SHIFT"
      ],
      "fluffOlectBias": 0.35
    },
    "witch": {
      "signatureWeight": 4,
      "globalWeight": 1,
      "relationBias": [
        "SYNERGY",
        "CATEGORY_SHIFT"
      ],
      "fluffOlectBias": 0.3
    }
  },
  "acceptance": [
    "all residents select from one shared pool",
    "signature weighting changes selection without creating private databases",
    "shared pool never grants shared knowledge",
    "BONGO can carry prior material for one beat",
    "BOGGLE can reframe previously established material",
    "BINGO can land/hand closure back",
    "Fluff-o-lect uses only authored replacement targets",
    "no resident becomes a catchphrase machine"
  ]
};

export const RESIDENT_PROFILES = Object.freeze(
  Object.fromEntries(RESIDENT_PROFILE_SOURCE.profiles.map((profile) => [profile.residentId, profile]))
);

const METHOD = Object.freeze({
  lorekeeper: {
    operation: 'PROVENANCE',
    invariant: 'claim -> provenance; witness class must remain explicit',
    affinity: { openness: ['HIGH'], reserve: ['MEDIUM'], affects: ['WARY', 'INTRIGUED'] }
  },
  'goth-girl': {
    operation: 'PERFORMANCE',
    invariant: 'statement -> what actually landed; earned reaction survives',
    affinity: { reserve: ['HIGH'], pressure: ['MEDIUM'], affects: ['MOVED', 'IRRITATED'] }
  },
  clown: {
    operation: 'EMBODY',
    invariant: 'abstraction -> small visible stake or repeatable public test',
    affinity: { energy: ['HIGH'], play: ['HIGH'], affects: ['AMUSED', 'ENERGIZED'] }
  },
  witch: {
    operation: 'SUBSTITUTE',
    invariant: 'claim -> changed variable; testable condition survives',
    affinity: { energy: ['MEDIUM'], openness: ['HIGH'], affects: ['INTRIGUED', 'IRRITATED'] }
  }
});

function globalIntent(entry) {
  if (entry.relation === 'CATEGORY_SHIFT') {
    return { operation: 'REFRAME', invariant: 'established material -> changed frame' };
  }
  if (entry.relation === 'COLLISION') {
    return { operation: 'OTHER', invariant: 'current frame -> concrete objection without hostility' };
  }
  if (entry.relation === 'ESCALATION') {
    return { operation: 'OTHER', invariant: 'current material -> one visible escalation step' };
  }
  return { operation: 'HOLD', invariant: 'keep the authored semantic relation intact' };
}

export function normalizeTriplet(entry) {
  const owner = (entry.signatureOf || [])[0] || null;
  const method = owner && METHOD[owner] ? METHOD[owner] : globalIntent(entry);
  const affinity = owner && METHOD[owner] ? METHOD[owner].affinity : {};
  const fluff = entry.fluffOlect || { allowed: false };
  return {
    ...entry,
    status: 'CANDIDATE',
    origin: {
      sourceRef: SOURCE_ARTIFACTS.semanticTripletPool.fileId,
      authoredBy: 'RESIDENT-CHAT-POC-01 Site authoring'
    },
    fallback: {
      subject: entry.subject,
      connector: entry.connector,
      reframe: entry.reframe
    },
    transformIntent: {
      operation: method.operation,
      invariant: method.invariant
    },
    semantic: {
      latentConcepts: Array.from(new Set([...(entry.tags || []), entry.subject, entry.connector, entry.reframe])),
      relation: entry.relation
    },
    eligibility: {
      eventTags: entry.tags || []
    },
    attitudeAffinity: affinity,
    fluffOlect: {
      ...fluff,
      fallbackVariant: fluff.fallbackVariant || fluff.variant || null,
      maxReplacements: fluff.allowed ? 1 : 0
    },
    social: {
      unlockableReply: false,
      quotable: true,
      borrowable: true,
      provenanceRequired: true
    }
  };
}

export const RUNTIME_POOL = Object.freeze({
  schema: 'kfb.semantic-triplet-pool/runtime-0.2-candidate',
  owner: 'ChatterBox content',
  sourceSchema: TRIPLET_POOL_SOURCE.schema,
  entries: TRIPLET_POOL_SOURCE.entries.map(normalizeTriplet)
});
