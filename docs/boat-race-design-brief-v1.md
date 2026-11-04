# Special Sparks — The Very Serious Boat Race (Not Really)
## Game Design & Development Brief — Version 1.0

### 1. Project overview

We are building a playful, illustrated browser game called **The Very Serious Boat Race (Not Really)**, part of the wider Special Sparks collection associated with Homeroom.

The game is designed primarily for children approximately 8–12 years old, but should be enjoyable for younger children with support and for adults playing alongside them.

It should work on desktop computers, tablets and classroom interactive displays, with mouse, touch and keyboard support where appropriate.

**The central idea:** Players participate in a ridiculous boat race where they must choose a questionable boat, scramble to collect unusual equipment, and discover whether their decisions help or hinder them in different racing challenges.

The game should encourage experimentation, creative thinking, prediction, adaptability and playful discovery.

It is not intended to feel like a formal educational exercise. The learning comes naturally through the choices, consequences, surprises and opportunities to try different approaches.

### 2. Creative direction

The tone should be imaginative, warm, humorous and slightly absurd.

The world takes its ridiculous competitions very seriously. Characters behave as though racing a bathtub against a picnic basket is a perfectly respectable sporting event.

Examples of the humour:
- A race judge taking their responsibilities far too seriously.
- A boat being rescued by a teddy bear operating a tiny tow boat.
- A sleeping frog being disturbed during the Slowest Race.
- An official warning sign reading "Probably Safe".
- A heavy pet rock cancelling out the lifting effect of party balloons.

Humour should arise from visual storytelling, character reactions and gameplay consequences, not excessive dialogue.

Use short, readable text appropriate for children aged 8–12. Avoid cluttered interfaces and lengthy instructions.

**Visual direction:** Use the official illustrated assets provided by the creator. They feature bold outlines, bright colours, cheerful cartoon characters and expressive details.

Do not replace official artwork with generic emojis, stock graphics or newly invented placeholder illustrations. Temporary simple shapes may be used for technical debugging where artwork has not yet been supplied.

### 3. Player and competitors

The player controls **Lantern**, a cheerful green lantern character.

Five animal competitors participate in the races:

| Character | Personality direction |
|---|---|
| Foxy | Clever, competitive and occasionally cheeky |
| Ruby | Enthusiastic, friendly and energetic |
| Dizzy | Distractible, unpredictable and playful |
| Nibbles | Resourceful, eager and occasionally overconfident |
| Tilly | Calm, patient and surprisingly capable |

These personalities should influence occasional reactions, decisions and funny moments without making race outcomes entirely predetermined.

Each character has six official illustrated poses, supplied as separate PNG files.

The poses include neutral, excited, worried, paddling, celebrating and character-specific reactions such as looking back, singing or surprise.

Create a configurable character pose system that can select an appropriate illustration for a gameplay event.

Not every character has exactly the same poses, so provide sensible fallback mappings.

### 4. Boat selection — The first gamble

Before each race, Lantern must choose a boat.

There are seven official boats:

1. The Good Old Bathtub
2. A Very Brave Cardboard Box
3. The Stick-Together Raft
4. The Doughnut of Destiny
5. An Enormous Teacup
6. The Left Welly
7. The Picnic Basket

**The flying saucer is permanently excluded.**

The player receives a sequence of up to four boat offers.

For each offer, they can:
- Accept the boat.
- Reject it and risk receiving another.

Rejected boats cannot return during that selection round.

If the player reaches the final offer, they must accept it.

Each boat has recognisable characteristics, including speed, stability, durability, handling and glide.

These characteristics should be meaningful but not perfectly balanced. A boat that is excellent in one challenge may be a poor choice in another.

Display a short humorous description and a few easy-to-understand characteristics.

The selection should create anticipation without overwhelming the player with numerical statistics.

### 5. Boat Room — The equipment scramble

After selecting a boat, the player enters the Boat Room.

The Boat Room is a playful illustrated workshop containing shelves, improvised equipment, tools and a central parts area.

The player and animal competitors scramble to claim equipment before the timer runs out.

**Default scramble duration: 20 seconds.**

The player should feel a sense of urgency, but the controls must remain accessible and suitable for touchscreens.

The game has **28 official equipment parts**, organised into four groups of seven illustrations.

The four groups broadly cover propulsion, flotation/stability, steering/braking and unusual wildcards.

The equipment artwork will be supplied with an exact page-number mapping and names. Use that inventory as the authoritative reference rather than inventing or substituting parts.

Each part should have:
- A recognisable primary function.
- A potential disadvantage or failure.
- Situational usefulness depending on the challenge.
- Optional interactions with other equipment.
- A visible consequence during the race.

Examples:

**Super Sponge:** Helps absorb water or withstand a wave, but becomes heavier as it gets waterlogged.

**Party Balloons:** May increase speed or lift, but strong wind can push the boat off course.

**Helpful Duck:** Provides relatively steady propulsion, but may become distracted.

**Giant Spoon + Fizzy Bottle Engine:** A potentially powerful, unexpected propulsion combination.

**Party Balloons + Pet Rock:** Opposing effects that can largely cancel one another.

Equipment should not always be beneficial. Some choices should be funny, risky or surprisingly effective.

Avoid turning every part into a simple numerical upgrade.

### 6. Four racing challenges

Each challenge should require a different approach to boat selection and equipment.

#### Challenge A — Fastest Race

**Objective:** Reach the finish line first.

The fleet races along a scrolling river.

Important features:
- Speed and acceleration.
- Overtaking.
- Equipment-driven advantages and setbacks.
- An actual finish line that starts off-screen and enters view as the fleet approaches.
- A clear finishing order.

The camera should follow the fleet at a consistent scale rather than zooming out to fit every competitor.

If boats spread far apart, use discreet edge indicators.

Possible encounters include an overly serious race judge, an annoyed fisherman or an unexpected obstacle.

#### Challenge B — Slowest Race

**Objective:** Finish last while still completing the course.

The challenge should reward control, restraint and strategic braking rather than simply making the boat incapable of moving.

Possible features:
- Unwanted speed boosts.
- Currents that push boats forward.
- A sleeping frog on a floating chair.
- A snail-themed course marker.
- A "NO RUSH" sign.
- A slow-clap celebration.

The challenge must have clear rules for boats that stop completely, become stranded or fail to finish.

The teddy bear tow boat may rescue stranded competitors.

#### Challenge C — Picnic Panic

**Objective:** Stop as close as possible to the picnic target.

The player approaches an illustrated picnic area and chooses when to brake.

Important features:
- Momentum and glide.
- Equipment that changes stopping distance.
- A clear, deliberate braking interaction.
- A picnic target that initially starts off-screen and enters view.
- A readable approach phase so players can make an informed decision.

The final result should show how close each competitor stopped to the target.

Humorous outcomes could include stopping far too early, overshooting the picnic or nearly landing in the sandwiches.

#### Challenge D — Wobbly Waters

**Objective:** Survive increasingly difficult waves while keeping the boat intact.

This is the endurance and survival challenge.

Important features:
- Waves increasing in difficulty.
- Stability and flotation.
- Waterlogging.
- Equipment failures.
- Damage and falling boat pieces.
- Competitors being rescued when their boats fail.

The teddy bear captain and tow boat should be especially prominent here.

A small "Probably Safe" warning sign sets the tone.

Survival should involve visible consequences rather than unexplained health-bar reductions.

### 7. Encounters and environmental surprises

The river should feel like a playful, living world.

Official encounter artwork includes:
- Teddy bear tow boat captain and tow boat.
- Disgruntled fisherman and fishing boat.
- Clumsy seal.
- Friendly long-necked water creature.
- Potato cannon.
- Alternate action illustrations for these encounters.

Potential behaviours:
- The fisherman casts a line that can temporarily catch or disrupt a boat.
- The seal pops out of the water with a ball, then playfully nudges a boat.
- The water creature unexpectedly appears in a competitor's path.
- The potato cannon launches an unpredictable projectile.
- The teddy bear captain rescues stranded or wrecked boats.

These encounters should be understandable, visually entertaining and reasonably fair.

Not every encounter needs to happen in every race.

Where multiple illustrations exist for one encounter, use them as animation states.

### 8. Damage, rescue and consequences

Each of the seven boats has a matching fallen-piece illustration.

Examples include a rubber duck falling from the bathtub and a fragment breaking away from the cardboard box.

When a boat is damaged, an appropriate piece may detach, fall into the water and drift away.

The boat should visibly react to damage.

Where appropriate, characters should react using worried, surprised or recovering poses.

For wrecked or stranded boats:
- Clearly communicate what happened.
- Show the teddy bear tow boat arriving.
- Allow the race to continue for remaining competitors.
- Avoid harsh or distressing failure presentations.

Failures should feel amusing and memorable rather than punitive.

### 9. Camera and race presentation

Retain the successful scrolling-camera principles from the original prototype.

For Fastest and Slowest:
- Use smooth horizontal scrolling.
- Follow the fleet rather than Lantern alone.
- Maintain a consistent visual scale.
- Allow the finish line to enter the scene naturally.
- Preserve actual distances between boats.

For Picnic Panic:
- Reveal the picnic target as the boats approach.
- Settle the camera sufficiently before the braking decision.

For Wobbly Waters:
- A more stationary framing is acceptable, with waves entering from off-screen.

Provide a reduced-motion presentation that limits camera movement and decorative animations.

The game must remain understandable on tablet screens and interactive classroom displays.

### 10. Artwork and scene system

Official artwork will be supplied in several ZIP batches, primarily as transparent PNG files exported from Canva.

The current source illustrations are approximately 2000 × 2000 pixels.

Artwork categories include:
- Six characters with six poses each.
- Seven boats.
- Seven fallen boat pieces.
- Twenty-eight equipment illustrations.
- Encounter characters and action poses.
- Seven reusable lake environment assets.
- Four groups of seven challenge-specific illustrations.
- Boat Room background.
- Celebration background.
- Additional effects, props and interface illustrations.

Use a central artwork registry or manifest to manage paths and metadata.

Support configurable:
- Cropping and transparent padding.
- Scaling.
- Character seating positions.
- Boat foreground/background layering.
- Waterline positioning.
- Equipment mounting points.
- Pose alignment.
- Animation states.

Different boats require different seating arrangements.

The cardboard box, doughnut, picnic basket and bathtub have previously worked well with Lantern.

The raft requires a sitting-on-top arrangement; the teacup and welly need character placement inside their openings.

Keep original artwork unchanged wherever possible.

Do not assume the PNG filename identifies the asset. Canva exports may use numbered filenames, so use the supplied page-number mapping.

### 11. Artwork preview gallery

Build a developer-facing artwork preview gallery early in development.

It should allow inspection of:
- Every character and pose.
- Every boat.
- Characters seated in different boats.
- Equipment illustrations.
- Boat/equipment combinations.
- Environment and encounter assets.

This gallery should help us adjust scale, layering, cropping and positioning without replaying the entire game.

It does not need to be part of the public player interface.

### 12. Results and celebrations

After each challenge, show a clear, entertaining results screen.

Use the official celebration background.

Results should explain the outcome in child-friendly language.

Examples:
- Who finished first.
- Who successfully finished last.
- Who stopped closest to the picnic.
- Who survived the most waves.

Where useful, highlight the effect of the player's equipment choices.

Use celebratory character poses and playful visual effects.

Avoid making winning the only rewarding outcome. Unexpected experiments and entertaining failures should also feel worthwhile.

### 13. Accessibility and usability

The game should support:
- Desktop and tablet layouts.
- Touch, mouse and relevant keyboard controls.
- Large, readable buttons.
- Clear focus indicators.
- Reduced-motion preferences.
- Good text contrast.
- Short, age-appropriate instructions.
- A replay option without unnecessary setup.
- Offline play once the game has loaded or through a portable build.

Avoid requiring precise drag-and-drop gestures as the only method of interaction.

### 14. Technical and development expectations

This is a browser-based game.

Choose a lightweight architecture suitable for an illustrated, interactive 2D experience.

Keep the simulation and gameplay rules separate from visual rendering and artwork configuration.

Use deterministic or seeded simulations where practical so gameplay can be tested reliably.

Maintain automated tests for:
- Boat selection.
- Equipment allocation.
- Equipment effects and combinations.
- All four challenge rules.
- Race results.
- Asset loading and fallbacks.
- Responsive behaviour.

Keep the original PNG files as source assets. Optimised runtime copies such as WebP may be generated later where beneficial.

Avoid unnecessary dependencies and ensure the game can be built from a fresh checkout.

### 15. GitHub and project preservation

Follow the existing project instructions in AGENTS.md.

At the end of each completed development stage:
- Commit the source, configuration, tests and documentation.
- Push the changes to the connected GitHub repository.
- Confirm the branch, commit ID and push result.
- Verify that the remote repository contains the changes.

Do not rely on temporary cloud workspace files as the only copy of the game.

If a push fails, explicitly report that the work has not yet been backed up.

### 16. Development sequence

Build the game incrementally.

**Stage 1 — Illustrated foundation**
- Project architecture.
- Artwork registry and manifest.
- Character and boat loading.
- Lake background.
- Artwork preview gallery.
- Responsive scene rendering.

**Stage 2 — Boat selection**
- Four-offer selection system.
- Seven boat characteristics.
- Character and boat previews.

**Stage 3 — Boat Room**
- Equipment scramble.
- Twenty-eight equipment parts.
- Equipment selection and combination logic.

**Stage 4 — Fastest Race**
- Scrolling camera.
- Race simulation.
- Overtaking and finish results.

**Stage 5 — Other three challenges**
- Slowest Race.
- Picnic Panic.
- Wobbly Waters.

**Stage 6 — Encounters and consequences**
- Environmental surprises.
- Equipment failures.
- Fallen pieces.
- Tow boat rescues.

**Stage 7 — Polish**
- Animations.
- Character reactions.
- Celebration scenes.
- Sound and optional effects.
- Accessibility and performance improvements.

### 17. What I want you to do now

**Do not implement the complete game yet.**

First, review this design brief and the current repository.

Please:

1. Propose the technical architecture and file structure.
2. Identify any important gameplay decisions that need clarification before implementation.
3. Recommend how to structure the artwork registry, character seating and equipment mounting systems.
4. Identify which Stage 1 assets you need first.
5. Suggest a small, achievable Stage 1 milestone with clear acceptance criteria.
6. Explain how you will preserve and push work to GitHub throughout development.

Do not invent missing equipment names or mechanics where an authoritative artwork inventory is still to be provided.

Do not create placeholder versions of the complete game.

Wait for my approval and the first official artwork ZIP before implementing Stage 1.