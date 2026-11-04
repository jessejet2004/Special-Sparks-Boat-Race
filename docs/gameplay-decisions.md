# Implemented design defaults

The creator authorised autonomous implementation. These defaults resolve the proposal's open routine questions and are intended for the first playtest, not final balancing.

- Reveal the challenge before boat selection. Shuffle seven official boats with a seeded RNG, offer four without repetition, allow three rejections, then require acceptance. Rival boats are sampled independently; matching hulls are allowed.
- Six racers share 28 unique equipment parts. Each racer can hold three; player clicks/taps to claim or release a part during the scramble. Rival claims are exclusive and visibly announced. At simultaneous input boundaries, process actions sequentially. Standard scramble is 20 seconds; optional untimed mode and pause improve accessibility. Early ready is allowed; unfilled rival slots draw only remaining parts.
- All races use seeded pure simulation and fixed steps. Fastest offers a short paddling burst with cooldown; Slowest offers gentle braking while requiring forward progress; Picnic uses one deliberate irreversible brake; Wobbly offers a timed brace for each wave. No precise dragging or continuous button mashing is required.
- Slowest: unassisted finishers rank by descending finish time. Stranded for eight seconds triggers a friendly tow and disqualification; a clear overall time limit prevents infinite races. Picnic ranks absolute stopping distance, with unfinished/towed boats below legal stops. Wobbly ranks survived waves, then remaining hull, then less water aboard. Ties are stable by racer index and explicitly shown as ties when equal.
- Pause freezes all gameplay timers, and switching away automatically pauses play. Reduced motion removes bobbing/bounces and background pan while keeping course progress readable. No accounts, analytics or online services.
- Equipment examples become documented first-playtest rules with visible event feedback. Cosmetic fallen pieces are separate from damage and never trigger for every slowdown. Encounters are limited and signalled, with rescues friendly. Runtime seating/mount configuration is independent of gameplay effects.

## Runtime presentation and delivery

- All 155 active sources have reproducible cropped/resized WebP runtime copies. Archived source versions are preserved but not shipped as active artwork. Registry generation verifies source hashes.
- Canvas dimensions follow the scene viewport; boats use a consistent world scale, fleet distances stay meaningful and out-of-view racers receive edge labels. Reduced motion uses stepwise course camera changes and a fixed scenic backdrop rather than decorative panning. Picnic camera settles before the target; Wobbly uses stationary survival framing.
- Encounters are selected twice per race with warnings. Picnic encounters remain visual so a late random penalty does not invalidate a deliberate stop. Wobbly waves supply primary damage. Cosmetic detachment remains separate from actual hull loss. Lily pads can fold in late waves, fizz exhausts, batteries/wind-up drives fade and waterlogged sponge slows progress.
- Synthesised quiet cues are opt-in and local; no music or online audio assets. Celebration is intentionally simple cutout-style pose switching and small bounce, with static reduced motion.
- Web edition has an atomic versioned all-file cache; standalone HTML embeds all active art and script. Portable ZIP also includes a web edition and launch instructions. No runtime API or network asset is required.
- Result ties are marked with `=` while ordering stays deterministic. Replay keeps the boat but starts a fresh scramble and seed. Exported race logs include setup, accepted action ticks, events and results; an action-replay viewer is not implemented.
