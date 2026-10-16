"""KFB Opener-Pool R2 (Georg 16.10.): freigegebener Pool + Anekdoten-Formen + Story-Mode-Pools.
Eintrag: opener -> (Klasse, Story-Modes, Anschluss). Anschluss: ' ' (direkt), ': ' (Doppelpunkt), ', ' (Komma).
Klassen nach OPENER_ARC_MODEL_R1: A Ansprache, Q Frage, F Rahmung/Anekdote, R Rückruf, D Zweifel/Wende,
P Prämisse/Ironie, E Steigerung, M Meta, X Entlastung. Modes: any | tragic comic absurd heroic mystical forbidden."""
ANY = ("any",)
POOL = {
 # --- freigegebener Pool R2 ---
 "Welcome to": ("A", ANY, " "), "You with the card in your hand": ("A", ANY, ": "), "You played": ("A", ANY, " "),
 "Did you ever try": ("A", ANY, " "), "You know": ("Q", ANY, " "), "Do you know": ("Q", ANY, " "),
 "Have you heard of": ("Q", ANY, " "), "Did you hear of": ("Q", ANY, " "), "You know the thing with": ("Q", ANY, " "),
 "Ever tasted": ("Q", ANY, " "), "Let me tell you about": ("F", ANY, " "), "I once met": ("F", ANY, " "),
 "Remember": ("R", ANY, " "), "No wait": ("D", ANY, ", "), "I used to believe": ("D", ANY, " "),
 "Everyone agrees": ("P", ANY, ": "), "The thing about": ("P", ANY, " "), "What if": ("P", ANY, " "),
 "Nobody warned us about": ("E", ANY, " "), "This one has a rule": ("E", ANY, ": "),
 "Here is something nobody asked for": ("E", ANY, ": "), "The deck insists on": ("M", ANY, " "),
 "Not a metaphor": ("M", ANY, ": "), "Anyway": ("X", ANY, ", "), "Which brings us to": ("X", ANY, " "),
 "Meanwhile elsewhere": ("X", ANY, ": "), "Before we continue": ("X", ANY, ": "),
 # --- Anekdoten (V-325, Georg 16.10.) ---
 "A friend told me about": ("F", ANY, " "), "I read a book about": ("F", ANY, " "),
 "Someone wrote in my diary": ("F", ANY, ": "), "I found a note saying": ("F", ANY, ": "), "My diary says": ("F", ANY, ": "),
 "A neighbour told me about": ("F", ("comic", "absurd"), " "), "Did you see the film about": ("Q", ANY, " "),
 "I found this under my bed": ("F", ("absurd", "mystical"), ": "),
 "Someone wrote in my friendship book": ("F", ("comic", "tragic"), ": "),
 "My aunt used to say": ("F", ("comic", "tragic"), ": "), "On the back of a napkin": ("F", ("comic", "absurd"), ": "),
 "An unsigned letter said": ("F", ("forbidden", "mystical"), ": "), "In my old sketchbook": ("F", ("mystical", "tragic"), ": "),
 "I saw a painting of": ("F", ("mystical", "heroic"), " "), "A stranger on the bus told me about": ("F", ("absurd", "forbidden"), " "),
 "My grandmother swore by": ("F", ("comic", "mystical"), " "), "Overheard at the bakery": ("F", ("comic",), ": "),
 "A fortune cookie said": ("F", ("absurd", "mystical"), ": "), "The radio kept talking about": ("F", ("forbidden", "tragic"), " "),
 # --- Story-Mode-Pools ---
 "I still think about": ("R", ("tragic",), " "), "Long ago there was": ("F", ("tragic", "heroic", "mystical"), " "),
 "Nobody came back for": ("E", ("tragic",), " "), "If only someone had warned": ("D", ("tragic",), " "),
 "You'll laugh, but": ("A", ("comic",), " "), "True story": ("P", ("comic", "absurd"), ": "), "Picture this": ("A", ("comic", "heroic"), ": "),
 "In a dream last Tuesday": ("F", ("absurd", "mystical"), ": "), "My goldfish insists on": ("M", ("absurd",), " "),
 "They wrote songs about": ("P", ("heroic",), " "), "Against all odds": ("E", ("heroic",), ": "), "Stand back for": ("E", ("heroic",), " "),
 "Here comes": ("A", ("heroic", "comic"), " "), "The stars mention": ("P", ("mystical",), " "),
 "Whispered in the attic": ("F", ("mystical", "forbidden"), ": "), "Behind the mirror": ("M", ("mystical",), ": "),
 "Don't tell anyone about": ("E", ("forbidden",), " "), "Off the record": ("D", ("forbidden",), ": "),
 "Strictly between us": ("D", ("forbidden", "comic"), ": "), "Behind the locked door": ("E", ("forbidden", "mystical"), ": "),
}
FAMILIES = {"heard": ["Did you hear of", "Have you heard of"], "know": ["You know", "Do you know", "You know the thing with"],
 "try": ["Did you ever try", "Ever tasted"], "nobody": ["Nobody warned us about", "Here is something nobody asked for", "Nobody came back for"],
 "thing": ["The thing about", "You know the thing with"],
 "told": ["A friend told me about", "A neighbour told me about", "A stranger on the bus told me about"],
 "diary": ["Someone wrote in my diary", "My diary says", "Someone wrote in my friendship book"],
 "found": ["I found a note saying", "I found this under my bed"],
 "saw": ["Did you see the film about", "I saw a painting of"],
 "secret": ["Don't tell anyone about", "Off the record", "Strictly between us"]}
