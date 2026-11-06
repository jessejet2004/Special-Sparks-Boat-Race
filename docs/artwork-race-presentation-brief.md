# Special Sparks — Boat Race: Artwork and Race Presentation Overhaul

I want to improve the visual quality and presentation of the existing playable game, **The Very Serious Boat Race (Not Really)**.

The homepage, boat-selection sequence and general Special Sparks visual identity are working well. Preserve these. This task focuses on how the boats, characters and equipment appear during the actual race.

**Important:** Do not redesign the gameplay, replace the artwork library or introduce new race mechanics yet. This is the first of two development passes.

## 1. Investigate and fix pixelated artwork

The boats, characters and equipment look noticeably pixelated, blurry and poorly defined during races, despite looking significantly better in the boat-selection illustrations.

Investigate the actual cause rather than applying a cosmetic workaround.

Check:
- Original image dimensions and whether higher-resolution versions already exist.
- Whether the game is rendering thumbnails instead of full-resolution assets.
- Canvas internal resolution versus CSS display size and device pixel ratio.
- Image interpolation, scaling and any pixel-art rendering settings.
- Whether sprites are being repeatedly resized or scaled beyond their source resolution.

Implement the appropriate fixes to make the artwork as crisp as the source assets reasonably allow.

Preserve the original cartoon illustration style, bold outlines and bright colours. Do not use pixel-art styling or artificial sharpening as a substitute for fixing the rendering pipeline.

If some original assets genuinely lack sufficient resolution, identify them clearly rather than silently substituting or regenerating artwork.

## 2. Fix character positioning inside every boat

Currently, characters often appear incorrectly positioned, partially hidden behind sails, crowded into equipment or floating awkwardly over their boats.

The boat-selection illustrations demonstrate the intended visual quality and composition.

Create a consistent character-and-boat composition system for gameplay.

Requirements:
- Each of the seven boats should have its own character seating or standing position.
- Characters must be correctly scaled relative to each boat.
- Characters should appear naturally seated or positioned inside the boat, not simply pasted on top.
- Where necessary, implement appropriate foreground/background layering so boat structures can appear in front of or behind characters.
- Character faces should remain clearly visible.
- Equipment should not obscure faces or important character features.
- Positioning must remain consistent during movement, animation and camera scrolling.

Review all seven boat types:
1. The Good Old Bathtub
2. A Very Brave Cardboard Box
3. The Stick-Together Raft
4. The Doughnut of Destiny
5. An Enormous Teacup
6. The Left Welly
7. The Picnic Basket

Review all six characters: Lantern, Foxy, Ruby, Dizzy, Nibbles and Tilly.

Do not assume one universal character offset will work for every boat.

## 3. Improve equipment attachment and visibility

The chosen boat parts currently appear crowded together or attached at awkward positions.

Introduce sensible equipment attachment locations for each boat.

For example, equipment may attach to the front, sides, rear or mast area, depending on the item.

Requirements:
- Parts should look physically connected to the boat where appropriate.
- Equipment must not overwhelm the boat illustration.
- Avoid overlapping character faces.
- Preserve recognisable silhouettes.
- Maintain clear visual hierarchy between boat, character and equipment.
- Equipment must move correctly with the boat.

Use existing artwork wherever possible.

## 4. Reduce active racers to four

Change each race to feature **four competitors total: Lantern and three rivals**.

The three rivals should be selected from Foxy, Ruby, Dizzy, Nibbles and Tilly, allowing different combinations across races.

All six characters should remain available within the game. Characters not participating in a particular race can still appear in celebration scenes or other suitable contexts.

Reasons for this change:
- Allow larger, clearer boat illustrations.
- Reduce visual clutter.
- Make competitors easier to follow.
- Create more space for environmental encounters and equipment effects.

Adjust boat sizes, lane spacing, labels and camera framing accordingly.

Do not simply remove two racers without reconsidering the presentation.

## 5. Improve the race camera and composition

The race should feel like a colourful, animated river adventure, not a collection of tiny illustrations moving across a background.

Review:
- Boat scale relative to the visible river.
- Spacing between racers.
- Camera tracking and scrolling.
- Character and boat visibility.
- How labels follow competitors.
- Foreground and background layering.
- How the player identifies Lantern's boat.
- Whether important obstacles or finish markers remain visible at the right moments.

Aim for a clear, polished presentation suitable for children aged approximately 8–12, including smartboard and tablet use.

Keep the river artwork and existing environmental illustrations.

## 6. Preserve existing successful features

Do not unnecessarily modify:
- Special Sparks / Homeroom Play Club branding.
- Homepage layout and challenge selection.
- Boat-selection gamble and its illustrations.
- The seven existing boat choices.
- The four existing challenge modes.
- Existing artwork files.
- Existing results calculations and dynamic podium positions.
- Accessibility controls.
- Offline functionality.
- GitHub Pages deployment.

## 7. Verification

Before finishing:

1. Inspect the existing rendering architecture and identify the causes of the visual problems.
2. Implement the fixes.
3. Test all seven boat types with multiple characters.
4. Test boats with different equipment combinations.
5. Verify character and equipment placement throughout an actual moving race.
6. Check desktop and tablet-sized viewports.
7. Run the existing unit tests, browser checks and artwork audits.
8. Add or update visual regression checks where practical.
9. Ensure the production build works at the GitHub Pages repository subpath.

If browser screenshots are available, use them to visually inspect the actual gameplay rather than relying only on passing automated tests.

## Deliverables

Report:
- What caused the pixelation or blurriness.
- What was changed to improve image quality.
- How boat-specific character positioning now works.
- How equipment attachment was improved.
- How the four-racer layout works.
- Any remaining asset limitations.
- Test results and any outstanding issues.

**Do not claim visual issues are fully resolved without checking rendered gameplay.**

Commit and push the completed changes to the existing `work` branch so the established GitHub Pages workflow can deploy them.

The goal is simple: **make the existing artwork look as good during the race as it does in the boat-selection screens.**