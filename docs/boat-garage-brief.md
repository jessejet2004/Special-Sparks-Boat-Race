# Special Sparks — Boat Race
## Pass 2: Redesign the Boat Garage

I want to redesign the equipment-selection stage of **The Very Serious Boat Race (Not Really)**.

The current 20-second equipment scramble is visually busy and places too much emphasis on choosing quickly rather than thinking creatively.

Replace it with a playful, untimed **Boat Garage**, where children can experiment with equipment combinations before taking their boat onto the river.

This should feel like a little invention workshop, not a conventional game inventory screen.

**Important:** Preserve the existing Special Sparks visual identity, original artwork, boat-selection gamble and four challenge modes.

### 1. Replace the timed equipment scramble

Remove the 20-second countdown and the mechanic where rival characters claim equipment before the player can select it.

Instead:

- Present 10 randomly selected equipment options from the existing library of 28 parts.
- Let the player choose up to three parts for their boat.
- No timer or pressure to choose quickly.
- Players can remove or replace their choices freely.
- Each part can only be selected once.
- Players can launch with zero, one, two or three parts.
- Rivals still receive their own equipment automatically, but do not compete with the player for the available parts.

Keep the equipment selection meaningful. Different combinations should still affect the boat's performance.

### 2. Make the garage visually engaging

Use the existing boat garage artwork and environment.

The garage should have two clear areas:

**Your Boat**

Display a large illustration of the player's chosen boat, with Lantern correctly positioned inside it.

As equipment is selected, it should visibly appear attached to the boat.

Requirements:
- Preserve the boat's proportions and original illustration quality.
- Use the boat-specific character seating and equipment attachment systems established in Pass 1.
- Keep Lantern's face visible.
- Equipment should attach at sensible locations.
- Avoid overlapping or stacking equipment awkwardly.
- Ensure the boat remains large and visually recognisable.
- Show the equipment being added or removed with subtle, playful animation.

The boat preview should be the visual centrepiece of the garage.

**Your Inventions**

Display the 10 available parts as illustrated cards.

Each card should include:
- Existing equipment illustration.
- Equipment name.
- Short, playful description.
- A clear indication of its gameplay effect.
- Selected or unselected state.

Use the existing 28 equipment illustrations. Do not replace or regenerate them.

### 3. Make the choices understandable

Children should be able to make decisions based on what equipment actually does.

For example:

- **Whisk-o-matic:** A burst of speed, with a little wobble.
- **Helpful Duck:** A gentle, reliable push.
- **Anchor:** Strong braking, but extra weight.
- **Party Balloons:** Less weight, but more drifting.
- **Super Sponge:** Absorbs trouble, but becomes heavier when wet.

These are illustrative examples. Review the existing equipment definitions and preserve their established mechanics wherever possible.

Avoid displaying complicated numerical statistics.

Instead, use simple descriptions such as:
- Helps you go faster.
- Makes turning easier.
- Helps you stay afloat.
- Useful for stopping.
- A little unpredictable.

Where useful, show trade-offs so there isn't always one obvious best choice.

### 4. Introduce a simple equipment selection system

The player should be able to:

1. Browse the 10 available inventions.
2. Select a part to attach it to the boat.
3. See it appear on the boat preview.
4. Select up to three parts.
5. Remove a part by clicking it again or using a clear remove control.
6. Launch the race when satisfied.

The selected parts should remain visible in three clearly labelled equipment slots.

Do not make the user scroll excessively between the boat preview and equipment options.

On desktop, consider a two-column layout with a large boat preview and an equipment grid.

On tablets, create a responsive layout that keeps the main actions easy to reach.

Avoid unnecessarily small illustrations, text or buttons.

### 5. Make each garage visit slightly different

Randomly offer 10 parts from the existing 28 each time the player starts a new equipment-selection session.

The selection should provide a reasonable mixture of equipment types rather than accidentally presenting 10 nearly identical options.

Aim for a balance of:
- Propulsion and speed.
- Flotation and stability.
- Steering and braking.
- Wildcards and unusual inventions.

Use the existing equipment categories where practical.

Do not change the full equipment library or permanently remove any parts.

The goal is to encourage experimentation and replayability.

### 6. Prepare for future in-race equipment activation

In the next development pass, I want players to be able to decide when to activate certain equipment during the race.

For example, the Whisk-o-matic might provide a temporary speed boost when activated, while an Anchor could be deployed at the right moment to brake.

For this pass:

- Organise equipment data so each part can support passive or player-activated behaviour.
- Preserve the three selected equipment slots through the transition into the race.
- Keep the system flexible enough to add activation durations, cooldowns and one-use abilities later.
- Do not introduce new in-race activation controls yet.
- Do not change existing race physics unless necessary to preserve compatibility.

The objective is to establish a clean foundation for Pass 3 without implementing it prematurely.

### 7. Preserve rival personalities

Rivals should still choose their own equipment automatically.

However, their selections should no longer remove equipment from the player's available choices.

Since races now feature Lantern and three rotating rivals, make sure the equipment system supports exactly those four racers.

Rivals can have different equipment preferences or tendencies to give them a little personality, provided this doesn't create unnecessary complexity.

### 8. Preserve the game's humour and identity

The existing Special Sparks presentation has a lovely balance of playful humour, colourful artwork and simple interaction.

Keep that character.

Use short, imaginative text throughout the garage.

For example:
- "Three inventions. One questionable boat."
- "An excellent idea. Probably."
- "Ready to test your masterpiece?"
- "What could possibly go wrong?"

These are suggestions, not mandatory wording.

Avoid making the garage feel like a technical equipment management system.

### 9. Testing and verification

Before completing:

- Verify all 28 equipment parts remain available in the random selection pool.
- Confirm each garage session offers 10 unique parts.
- Test selecting, removing and replacing parts.
- Test launching with zero to three parts.
- Verify all seven boat types can display their equipment.
- Check character visibility and equipment attachment.
- Verify selected equipment carries into the race correctly.
- Verify rivals receive their equipment independently.
- Check desktop and tablet layouts.
- Run existing unit tests, browser tests and artwork audits.
- Confirm GitHub Pages deployment compatibility.

Use browser screenshots to inspect the actual garage presentation.

Do not rely