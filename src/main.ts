import "./style.css";
import { Artwork } from "./artwork/registry";
import {
  characters,
  characterNames,
  boatIds,
  type BoatId,
} from "./artwork/config";
import { drawBoat, drawImage } from "./rendering/composite";
import {
  challenges,
  boats,
  offers,
  nextOffer,
  random,
  type Challenge,
} from "./game/model";
import {
  equipment,
  createScramble,
  claim,
  release,
  type Scramble,
  equippedStats,
} from "./game/equipment";
import {
  createRace,
  stepRace,
  action,
  rank,
  resultText,
  stoppingDistance,
  tied,
  STEP,
  type Race,
} from "./game/race";
import { RaceScene } from "./rendering/scene";
const app = document.querySelector<HTMLDivElement>("#app")!;
const art = new Artwork();
app.innerHTML =
  '<main class="shell"><p class="eyebrow">SPECIAL SPARKS</p><h1>Waking up the river…</h1><p role="status">Getting the official artwork ready.</p></main>';
let screen: "home" | "selection" | "scramble" | "ready" | "race" | "results" =
    "home",
  challenge: Challenge = "fastest",
  seed =
    Number(new URLSearchParams(location.search).get("seed")) ||
    Date.now() >>> 0;
let offerList = offers(seed),
  offerIndex = 0,
  selected: BoatId = "bathtub",
  scramble: Scramble = createScramble(seed),
  untimed = false,
  paused = false;
let race: Race | null = null,
  accumulator = 0,
  finishHold = 0;
const raceScene = new RaceScene(art);
const portableEdition = Boolean(
  (window as Window & { __BOAT_ART__?: unknown }).__BOAT_ART__,
);
let offlineStatus = portableEdition
  ? "Portable · offline ready"
  : "Preparing offline play…";
let soundEnabled = false;
let audio: AudioContext | undefined;
function chime(pitch = 440) {
  if (!soundEnabled) return;
  try {
    audio ??= new AudioContext();
    void audio.resume();
    const oscillator = audio.createOscillator(),
      gain = audio.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = pitch;
    gain.gain.setValueAtTime(0.045, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.18);
    oscillator.connect(gain);
    gain.connect(audio.destination);
    oscillator.start();
    oscillator.stop(audio.currentTime + 0.2);
  } catch {
    soundEnabled = false;
  }
}
let equipmentFilter = "all";
let rivalBoats: BoatId[] = [],
  last = performance.now(),
  notice = "",
  aiTurn = 0,
  showRules = false;
const reduced = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
  document.documentElement.dataset.motion === "reduce";
const image = (id: string, cls = "", alt?: string) =>
  `<img class="${cls}" src="${art.entries[id]?.url || ""}" alt="${alt ?? art.entries[id]?.name ?? id}">`;
const header = () =>
  `<header class="topbar"><a class="brand" href="#" id="brand-home" aria-label="Special Sparks home">SPECIAL <span>SPARKS</span><small>HOMEROOM PLAY CLUB</small></a><div class="header-right"><span class="edition">THE RIVER IS OPEN • ALL ABILITIES WELCOME</span><button class="quiet" id="sound" aria-pressed="${soundEnabled}">Sound ${soundEnabled ? "on" : "off"}</button><button class="quiet" id="motion" aria-pressed="${reduced()}">${reduced() ? "Motion: gentle" : "Reduce motion"}</button>${screen !== "home" ? '<button class="quiet" id="pause">' + (paused ? "Resume" : "Pause") + "</button>" : ""}</div></header>`;
function render() {
  const focus = document.activeElement as HTMLElement | null;
  const focusId = focus?.id;
  const partFocus = focus?.dataset.part;
  app.innerHTML = `<main class="shell">${header()}${art.errors.size ? '<p class="loading-error" role="alert">Some artwork could not load. Your game still works; reload when connected to restore the illustrations.</p>' : ""}${screen === "home" ? home() : screen === "selection" ? selection() : screen === "scramble" ? scrambleView() : screen === "race" ? raceView() : screen === "results" ? results() : ready()}<footer class="footer"><span>A little ingenuity goes a long way. Probably. <b class="offline-status">${offlineStatus}</b></span>${portableEdition ? "<span>155 official illustrations · portable edition</span>" : '<a href="./gallery.html">Artwork workshop →</a>'}</footer>${paused ? '<div class="paused-overlay" role="dialog" aria-modal="true" aria-label="Game paused"><section class="panel"><p class="eyebrow">EVERYONE IS CATCHING THEIR BREATH</p><h2>Paused. No hurry.</h2><p>The clock and all rivals are waiting.</p><button id="resume">Back to the river →</button><button id="quit" class="secondary">Choose another challenge</button></section></div>' : ""}</main>`;
  document.getElementById("sound")?.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    chime(660);
    render();
  });
  document.getElementById("brand-home")?.addEventListener("click", (e) => {
    e.preventDefault();
    if (screen === "race" || screen === "scramble") {
      paused = true;
      render();
    } else {
      screen = "home";
      render();
    }
  });
  document.getElementById("quit")?.addEventListener("click", () => {
    screen = "home";
    paused = false;
    render();
  });
  document.getElementById("resume")?.addEventListener("click", () => {
    paused = false;
    render();
  });
  document
    .getElementById("launch")
    ?.addEventListener("click", () => void launchRace());
  document.getElementById("race-action")?.addEventListener("click", () => {
    if (race && !paused) {
      action(race);
      chime(520);
      updateHUD();
    }
  });
  document.getElementById("replay")?.addEventListener("click", () => {
    screen = "scramble";
    scramble = createScramble(++seed);
    aiTurn = 0;
    notice = "Same boat. Fresh ideas.";
    paused = false;
    render();
  });
  document.getElementById("motion")!.onclick = () => {
    document.documentElement.dataset.motion = reduced() ? "full" : "reduce";
    render();
  };
  document.getElementById("pause")?.addEventListener("click", () => {
    paused = !paused;
    render();
  });
  document.querySelectorAll<HTMLButtonElement>("[data-challenge]").forEach(
    (b) =>
      (b.onclick = () => {
        challenge = b.dataset.challenge as Challenge;
        startSelection();
      }),
  );
  document.getElementById("rules")?.addEventListener("click", () => {
    showRules = !showRules;
    render();
  });
  document
    .getElementById("untimed")
    ?.addEventListener(
      "change",
      (e) => (untimed = (e.target as HTMLInputElement).checked),
    );
  document.getElementById("accept")?.addEventListener("click", () => {
    selected = offerList[offerIndex];
    scramble = createScramble(seed);
    aiTurn = 0;
    rivalBoats = characters.map((_, i) =>
      i === 0 ? selected : boatIds[Math.floor(random(seed + i * 119)() * 7)],
    );
    screen = "scramble";
    notice = "Pick up to three. Rivals are eyeing the shelves.";
    void art.load(equipment.map((e) => "equipment." + e.id)).then(render);
    render();
  });
  document.getElementById("reject")?.addEventListener("click", () => {
    offerIndex = nextOffer(offerList, offerIndex);
    render();
  });
  document.querySelectorAll<HTMLButtonElement>("[data-filter]").forEach(
    (b) =>
      (b.onclick = () => {
        equipmentFilter = b.dataset.filter!;
        render();
      }),
  );
  document.querySelectorAll<HTMLButtonElement>("[data-part]").forEach(
    (b) =>
      (b.onclick = () => {
        const id = b.dataset.part!;
        if (scramble.claimed[0].includes(id)) release(scramble, id);
        else if (!claim(scramble, 0, id))
          notice = "Your boat holds three parts. Put one back to try another.";
        render();
      }),
  );
  document.getElementById("ready")?.addEventListener("click", finishScramble);
  document.getElementById("home")?.addEventListener("click", () => {
    screen = "home";
    paused = false;
    render();
  });
  document.getElementById("save-result")?.addEventListener("click", () => {
    if (!race) return;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(
      new Blob(
        [
          JSON.stringify(
            {
              seed: race.seed,
              challenge,
              boats: rivalBoats,
              equipment: scramble.claimed,
              results: rank(race).map((i) => ({
                character: characters[i],
                result: resultText(race!, race!.racers[i]),
              })),
              events: race.events,
              actions: race.actions,
            },
            null,
            2,
          ),
        ],
        { type: "application/json" },
      ),
    );
    a.download = "very-serious-race-log.json";
    a.click();
    URL.revokeObjectURL(a.href);
  });
  if (focusId) document.getElementById(focusId)?.focus({ preventScroll: true });
  else if (partFocus)
    document
      .querySelector<HTMLButtonElement>(
        `[data-part="${partFocus}"]:not(:disabled)`,
      )
      ?.focus({ preventScroll: true });
  if (paused) document.getElementById("resume")?.focus();
  drawPreview();
  if (screen === "race" && race) {
    updateHUD();
    const canvas = document.querySelector<HTMLCanvasElement>("#race-canvas");
    if (canvas) raceScene.draw(canvas, race, reduced());
  }
}
function home() {
  return `<section class="hero"><div class="hero-copy"><p class="eyebrow">THE SPECIAL SPARKS COLLECTION · NO. 01</p><h1>The Very Serious<br><span>Boat Race.</span><em>(Not Really)</em></h1><p class="intro">Questionable boats. Excellent company.<br>A river full of very good bad ideas.</p><div class="hero-actions"><button id="rules" class="secondary">${showRules ? "Hide the unofficial rules" : "How does this work?"}</button><span class="age-note">AGES 8+<br>1 PLAYER + 5 RIVALS</span></div>${showRules ? '<div class="rule-note">Choose a challenge. Accept a boat or risk the next offer. Grab three parts before your rivals do. Then see if your brilliant plan floats.<br><strong>Mouse, touch or keyboard. Space activates your race action. P pauses.</strong></div>' : ""}<label class="check"><input type="checkbox" id="untimed" ${untimed ? "checked" : ""}> Take your time: untimed equipment picking</label></div><div class="hero-art"><span class="sticker">OFFICIALLY<br>PROBABLY SAFE</span><canvas id="preview" aria-label="Lantern in a bathtub, ready for a ridiculous river race"></canvas><div class="art-caption"><span>MEET YOUR CAPTAIN</span><strong>Lantern</strong><small>Optimism: unsinkable. Boat: debatable.</small></div></div></section><section class="challenge-section"><div class="section-title"><div><p class="eyebrow">PICK YOUR KIND OF RIDICULOUS</p><h2>Four ways to make a splash.</h2></div><span class="small-note">Same river. Very different plans.</span></div><div class="challenge-grid">${(Object.entries(challenges) as [Challenge, typeof challenges.fastest][]).map(([key, c], i) => `<button class="challenge-card" data-challenge="${key}" style="--accent:${c.colour}"><span class="card-number">0${i + 1}</span>${image(c.art, "challenge-art")}<span class="card-kicker">${c.kicker}</span><strong>${c.name}</strong><span>${c.description}</span><b class="card-arrow" aria-hidden="true">→</b></button>`).join("")}</div></section>`;
}
function selection() {
  const id = offerList[offerIndex],
    b = boats[id];
  return `<div class="stage-heading"><div><p class="eyebrow">${challenges[challenge].name} · STEP 1 OF 3</p><h1>Your first gamble.</h1><p>Keep it… or see what washes up next.</p></div><div class="offer-dots" aria-label="Offer ${offerIndex + 1} of 4">${offerList.map((_, i) => `<i class="${i <= offerIndex ? "active" : ""}"></i>`).join("")}</div></div><section class="selection-scene" style="background-image:url('${art.entries["background.boat-room"].url}')"><div class="selection-preview"><canvas id="preview" aria-label="Lantern seated in ${b.name}"></canvas></div><article class="offer-panel"><p class="eyebrow">OFFER ${offerIndex + 1} OF 4 ${offerIndex === 3 ? "· THIS ONE IS YOURS" : ""}</p><h2>${b.name}</h2><p>${b.description}</p><div class="traits">${b.traits.map((t) => `<span>${t}</span>`).join("")}</div><div class="challenge-tip">${challenges[challenge].rule}</div><button id="accept">${offerIndex === 3 ? "Make it work →" : "That’s my boat →"}</button>${offerIndex < 3 ? `<button id="reject" class="secondary">Risk another (${3 - offerIndex} left)</button>` : '<p class="muted">No more swaps. Destiny has excellent taste.</p>'}</article></section>`;
}
function scrambleView() {
  return `<div class="stage-heading"><div><p class="eyebrow">${challenges[challenge].name} · STEP 2 OF 3</p><h1>A very civilised scramble.</h1><p>Claim up to three parts. One of each. No elbows, please.</p></div><div class="timer" aria-label="Time remaining">${image("supporting-effect.20-second-stopwatch", "timer-art")}<strong id="countdown">${untimed ? "∞" : Math.max(0, 20 - Math.floor(scramble.elapsed))}</strong><span>${untimed ? "TAKE YOUR TIME" : "SECONDS LEFT"}</span></div></div><section class="scramble-board"><aside class="loadout panel"><p class="eyebrow">YOUR ${boats[selected].name.replace("The ", "").toUpperCase()}</p><div class="small-boat">${image("boat." + selected)}</div><h2>Your bright ideas <span>${scramble.claimed[0].length}/3</span></h2><div class="slots">${[
    0, 1, 2,
  ]
    .map((i) => {
      const id = scramble.claimed[0][i];
      return id
        ? `<button class="slot filled" data-part="${id}" aria-label="Put back ${equipment.find((e) => e.id === id)!.name}">${image("equipment." + id)}<span>${equipment.find((e) => e.id === id)!.name}</span><b>×</b></button>`
        : '<div class="slot">An excellent idea goes here</div>';
    })
    .join(
      "",
    )}</div><button id="ready">Ready to race →</button><p class="muted">Tap a chosen part to put it back. You can race with fewer than three.</p><div class="rival-claims">${characters
    .slice(1)
    .map(
      (c, i) =>
        `<div>${image("character." + c + ".full-body-neutral")}<span>${characterNames[i + 1]}</span><b>${scramble.claimed[i + 1].length}/3</b></div>`,
    )
    .join(
      "",
    )}</div></aside><div class="equipment-room" style="background-image:linear-gradient(#fff8e7ec,#fff8e7f5),url('${art.entries["background.boat-room"].url}')"><p class="scramble-notice" role="status">${image("supporting-effect.equipment-crate", "crate-art")}${paused ? "Paused. Your ideas are safe." : notice}</p><div class="equipment-filters" aria-label="Equipment shelves">${[
    ["all", "All 28"],
    ["drive", "Propulsion"],
    ["float", "Stay afloat"],
    ["wild", "Wild inventions"],
    ["brake", "Brakes & surprises"],
  ]
    .map(
      ([id, name]) =>
        `<button data-filter="${id}" aria-pressed="${equipmentFilter === id}">${name}</button>`,
    )
    .join("")}</div><div class="equipment-grid">${equipment
    .filter((e) => equipmentFilter === "all" || e.role === equipmentFilter)
    .map((e) => {
      const yours = scramble.claimed[0].includes(e.id),
        owner = scramble.claimed.findIndex((parts) => parts.includes(e.id)),
        taken = owner > 0;
      return `<button class="equipment-card ${yours ? "chosen" : ""} ${taken ? "taken" : ""}" data-part="${e.id}" ${taken ? "disabled" : ""} aria-pressed="${yours}" aria-label="${e.name}. ${e.hint}${taken ? " Claimed by " + characterNames[owner] : ""}">${image("equipment." + e.id)}<strong>${e.name}</strong><span>${taken ? characterNames[owner] + " got it!" : e.hint}</span></button>`;
    })
    .join("")}</div></div></section>`;
}
function ready() {
  const combo = equippedStats(
    boats[selected].stats,
    scramble.claimed[0],
    challenge,
  );
  return `<section class="race-brief panel"><p class="eyebrow">${challenges[challenge].name} · STEP 3 OF 3</p><h1>Let’s test that theory.</h1><p class="intro">${challenges[challenge].rule}</p><div class="brief-loadout">${scramble.claimed[0].map((id) => image("equipment." + id)).join("")}</div>${combo.combos.map((c) => `<p class="combo-note">${c}</p>`).join("")}<p class="muted">Space or the big action button. P pauses. Your rivals have their own bright ideas.</p><button id="launch">Launch the extremely official race →</button><div class="standby">${image("encounter.teddy-bear-captain.initial")}<span>Teddy’s on standby.<br>Every experiment gets a friendly way home.</span>${image("supporting-effect.ringing-bell")}</div></section>`;
}
async function launchRace() {
  const b = document.getElementById("launch") as HTMLButtonElement;
  if (b) {
    b.disabled = true;
    b.textContent = "Getting the river ready…";
  }
  await art.load(Object.keys(art.entries));
  race = createRace(challenge, seed, rivalBoats, scramble.claimed);
  accumulator = 0;
  finishHold = 0;
  raceScene.camera = 0;
  screen = "race";
  paused = false;
  chime(720);
  render();
  window.scrollTo({ top: 0 });
}
function raceView() {
  return `<section class="race-header"><div><p class="eyebrow">THE SPECIAL SPARKS RIVER CHAMPIONSHIPS</p><h1>${challenges[challenge].name}</h1></div><div class="race-clock"><strong id="race-time">0.0</strong><span>SECONDS OF GLORY</span></div></section><div class="race-canvas"><canvas id="race-canvas" aria-label="Six illustrated competitors racing on the river"></canvas><div class="race-hint">${challenge === "picnic" ? "Watch the target. Brake early enough to glide." : challenge === "wobbly" ? "Watch the warning. Brace just before the wave." : challenge === "slowest" ? "Finish last. Keep moving. Teddy does not count as a strategy." : "A little paddle burst goes a long way."}</div></div><section class="race-dashboard"><div class="player-readout"><p class="eyebrow">LANTERN · ${boats[selected].name}</p><strong id="race-metric"></strong><span id="race-secondary"></span></div><button id="race-action" class="action-button">${actionLabel()}</button><div class="race-event" role="status" aria-live="polite" id="race-event">And they’re off. Approximately.</div></section><section class="live-standings" aria-label="Live fleet status" id="live-standings"></section><details class="race-rules"><summary>The unofficial rules</summary><p>${challenges[challenge].rule}</p></details>`;
}
function actionLabel() {
  return challenge === "fastest"
    ? "Paddle burst · Space"
    : challenge === "slowest"
      ? "Gently brake · Space"
      : challenge === "picnic"
        ? "BRAKE NOW · Space"
        : "Brace for the wave · Space";
}
function updateHUD() {
  if (!race || screen !== "race") return;
  const p = race.racers[0],
    metric = document.getElementById("race-metric")!,
    secondary = document.getElementById("race-secondary")!,
    button = document.getElementById("race-action") as HTMLButtonElement;
  document.getElementById("race-time")!.textContent = race.time.toFixed(1);
  const distance = race.target - p.x;
  metric.textContent =
    challenge === "wobbly"
      ? `Wave ${race.wave} of 10 · ${Math.max(0, Math.ceil(race.nextWave - race.time))}s to next`
      : challenge === "picnic"
        ? `${Math.abs(distance).toFixed(0)} m ${distance >= 0 ? "to the picnic" : "past the picnic"}`
        : `${Math.max(0, distance).toFixed(0)} m to finish`;
  secondary.textContent =
    challenge === "wobbly"
      ? `Hull ${Math.round(p.hull)} · Water aboard ${Math.round(p.water)}`
      : challenge === "picnic"
        ? `Estimated stopping distance: ${stoppingDistance(p).toFixed(0)} m${p.brake ? " · Brakes are on" : ""}`
        : challenge === "slowest"
          ? `Moving ${p.speed.toFixed(1)} m/s${p.stranded > 0 ? " · Stranded " + Math.floor(p.stranded) + "/8s" : ""}`
          : `Speed ${p.speed.toFixed(1)} m/s`;
  const cooldown = Math.max(0, p.cooldown - race.time);
  button.disabled =
    p.status !== "sailing" ||
    (challenge === "picnic" ? p.brake : cooldown > 0) ||
    paused;
  button.textContent =
    p.status === "rescued"
      ? "Teddy’s taking you home"
      : p.status === "finished"
        ? "Nicely done. Watch the fleet!"
        : challenge === "picnic" && p.brake
          ? "Brakes on. Sandwiches ahead."
          : cooldown > 0
            ? `Catch your breath · ${cooldown.toFixed(1)}s`
            : actionLabel();
  const latest = race.events[race.events.length - 1];
  if (
    latest &&
    document.getElementById("race-event")!.dataset.event !== String(latest.id)
  ) {
    document.getElementById("race-event")!.textContent = latest.text;
    document.getElementById("race-event")!.dataset.event = String(latest.id);
  }
  const order =
    challenge === "wobbly"
      ? rank(race)
      : race.racers
          .map((_, i) => i)
          .sort((a, b) => race!.racers[b].x - race!.racers[a].x);
  document.getElementById("live-standings")!.innerHTML = order
    .map(
      (i, n) =>
        `<div class="${i === 0 ? "you" : ""}"><b>${n + 1}</b><span>${characterNames[i]}${i === 0 ? " · YOU" : ""}</span><small>${race!.racers[i].status === "rescued" ? "Friendly tow" : race!.racers[i].status === "finished" ? "Finished" : challenge === "wobbly" ? race!.racers[i].waves + " waves" : Math.round(race!.racers[i].x) + " m"}</small></div>`,
    )
    .join("");
}
function results() {
  if (!race) return "";
  const order = rank(race),
    winner = order[0],
    p = race.racers[0],
    place = order.indexOf(0) + 1;
  const title =
    winner === 0
      ? "A very serious victory!"
      : challenge === "picnic"
        ? "The sandwiches have spoken."
        : challenge === "wobbly"
          ? "A splash of courage."
          : "A magnificent experiment.";
  const combo = equippedStats(boats[selected].stats, p.equipment, challenge);
  return `<section class="results-header"><p class="eyebrow">${challenges[challenge].name} · THE OFFICIAL-ISH RESULTS</p><h1>${title}</h1><p>${characterNames[winner]} ${challenge === "slowest" ? "took their time beautifully." : challenge === "picnic" ? "parked closest to the picnic." : challenge === "wobbly" ? "handled the waves best." : "was first across the line."} Lantern placed ${place} of 6.</p></section><section class="results-layout"><div class="celebration-scene" style="background-image:url('${art.entries["background.celebration"].url}')">${order
    .map((index, podium) => {
      const c = characters[index];
      return `<div class="celebrant podium-${podium} character-${c}" style="--delay:${-index * 0.19}s;--rhythm:${1.7 + index * 0.17}s"><img class="neutral" src="${art.entries["character." + c + ".full-body-neutral"].url}" alt=""><img class="celebrate" src="${art.entries["character." + c + ".full-body-celebrating"].url}" alt="${characterNames[index]} celebrating"></div>`;
    })
    .join(
      "",
    )}${image(challenge === "picnic" ? "supporting-effect.sandwich-trophy" : "fastest-race.golden-winner-trophy", "result-trophy")}</div><div class="panel results-table"><h2>The finishing committee</h2><ol>${order.map((i, n) => `<li class="${i === 0 ? "you" : ""}"><b>${n > 0 && tied(race!, i, order[n - 1]) ? "=" : n + 1}</b><div><strong>${characterNames[i]}${i === 0 ? " · YOU" : ""}</strong><span>${resultText(race!, race!.racers[i])}</span></div></li>`).join("")}</ol></div></section><section class="experiment-note panel"><div><p class="eyebrow">YOUR EXPERIMENT</p><h2>${boats[selected].name}</h2><p>${p.equipment.map((id) => equipment.find((e) => e.id === id)!.name).join(" + ") || "No equipment. A bold minimalist statement."}</p>${combo.combos.map((c) => `<p>${c}</p>`).join("")}<p class="muted">${p.status === "rescued" ? "A friendly tow is an excellent excuse to try a steadier boat or more flotation." : challenge === "picnic" ? "Try different glide and braking equipment. Stopping early is a very useful discovery." : challenge === "wobbly" ? "Stability, flotation and a well-timed brace all help. Extra speed won’t save a soggy hull." : challenge === "slowest" ? "Braking helps, but a stranded boat cannot win. Try drag without losing all forward motion." : "A burst helps. A combination might help more. What would you try next?"}</p></div><div class="result-actions"><button id="replay">Same boat, new bright ideas →</button><button class="secondary" id="home">Choose another challenge</button><button class="quiet" id="save-result">Save race log</button></div></section>`;
}
async function startSelection() {
  seed = (seed + 1) >>> 0;
  offerList = offers(seed);
  offerIndex = 0;
  paused = false;
  screen = "selection";
  await art.load(offerList.map((b) => "boat." + b));
  render();
}
function finishScramble() {
  const rng = random(seed + 71);
  for (let i = 1; i < 6; i++)
    while (scramble.claimed[i].length < 3 && scramble.available.length)
      claim(
        scramble,
        i,
        scramble.available[Math.floor(rng() * scramble.available.length)],
      );
  screen = "ready";
  render();
}
function drawPreview() {
  const canvas = document.querySelector<HTMLCanvasElement>("#preview");
  if (!canvas) return;
  canvas.width = 1000;
  canvas.height = 600;
  const ctx = canvas.getContext("2d")!;
  if (screen === "home") {
    const bg = art.image("background.lake");
    if (bg) {
      const scale = Math.max(1000 / bg.width, 600 / bg.height);
      ctx.drawImage(
        bg,
        (1000 - bg.width * scale) / 2,
        0,
        bg.width * scale,
        bg.height * scale,
      );
    }
    drawBoat(ctx, art, "bathtub", "lantern", 220, 170, 570, "excited");
  } else
    drawBoat(
      ctx,
      art,
      offerList[offerIndex],
      "lantern",
      180,
      130,
      650,
      "neutral",
    );
}
function frame(now: number) {
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;
  if (screen === "scramble" && !paused) {
    scramble.elapsed += dt;
    if (scramble.elapsed >= scramble.nextClaim) {
      const rival = 1 + (aiTurn % 5);
      const rng = random(seed + aiTurn * 139);
      if (scramble.claimed[rival].length < 3 && scramble.available.length) {
        const id =
          scramble.available[Math.floor(rng() * scramble.available.length)];
        claim(scramble, rival, id);
        notice =
          characterNames[rival] +
          " claimed " +
          equipment.find((e) => e.id === id)!.name +
          ".";
      }
      aiTurn++;
      scramble.nextClaim += untimed ? 3.2 : 1.05;
      render();
    }
    const clock = document.getElementById("countdown");
    if (clock)
      clock.textContent = untimed
        ? "∞"
        : String(Math.max(0, Math.ceil(20 - scramble.elapsed)));
    if (!untimed && scramble.elapsed >= 20) finishScramble();
  }
  if (screen === "race" && race && !paused) {
    accumulator += dt;
    while (accumulator >= STEP && !race.done) {
      stepRace(race);
      accumulator -= STEP;
    }
    const canvas = document.querySelector<HTMLCanvasElement>("#race-canvas");
    if (canvas) raceScene.draw(canvas, race, reduced());
    if (race.tick % 4 === 0 || race.done) updateHUD();
    if (race.done) {
      finishHold += dt;
      if (finishHold > 1.8) {
        screen = "results";
        chime(880);
        render();
        window.scrollTo({ top: 0 });
      }
    }
  }
  requestAnimationFrame(frame);
}
document.addEventListener("visibilitychange", () => {
  if (document.hidden && screen !== "home") {
    paused = true;
    render();
  }
});
document.addEventListener("keydown", (e) => {
  if (paused && e.key === "Tab") {
    const buttons = [
      ...document.querySelectorAll<HTMLButtonElement>(".paused-overlay button"),
    ];
    const first = buttons[0],
      last = buttons[buttons.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last?.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first?.focus();
    }
  }
  if (e.key === "Escape" && paused) {
    paused = false;
    render();
  }
  if (e.repeat) return;
  if (
    e.code === "Space" &&
    screen === "race" &&
    !(e.target instanceof HTMLButtonElement)
  ) {
    e.preventDefault();
    if (race && !paused) {
      action(race);
      chime(520);
    }
  }
  if (e.key.toLowerCase() === "p" && screen !== "home") {
    paused = !paused;
    render();
  }
});
try {
  await art.init();
  await art.load([
    "background.lake",
    "background.boat-room",
    "boat.bathtub",
    ...characters.flatMap((c) => [
      "character." + c + ".neutral",
      "character." + c + ".full-body-neutral",
    ]),
    "character.lantern.excited",
    ...Object.values(challenges).map((c) => c.art),
  ]);
  render();
  requestAnimationFrame(frame);
} catch {
  app.innerHTML =
    '<main class="shell"><h1>The artwork took a wrong turn.</h1><p role="alert">Please reconnect and reload, or open the self-contained portable edition.</p><button id="reload">Try again</button></main>';
  document.getElementById("reload")!.onclick = () => location.reload();
}

async function prepareOffline() {
  if (portableEdition) {
    offlineStatus = "Portable · offline ready";
    return;
  }
  if (!("serviceWorker" in navigator)) {
    offlineStatus = "Portable download available";
    return;
  }
  try {
    const registration = await navigator.serviceWorker.register("./sw.js");
    await navigator.serviceWorker.ready;
    const worker = registration.active;
    if (worker)
      await new Promise<void>((resolve) => {
        const channel = new MessageChannel();
        channel.port1.onmessage = () => resolve();
        worker.postMessage("ready", [channel.port2]);
      });
    offlineStatus = "Offline ready";
  } catch {
    offlineStatus = "Online · portable edition also available";
  }
  document
    .querySelectorAll(".offline-status")
    .forEach((e) => (e.textContent = offlineStatus));
}
void prepareOffline();
