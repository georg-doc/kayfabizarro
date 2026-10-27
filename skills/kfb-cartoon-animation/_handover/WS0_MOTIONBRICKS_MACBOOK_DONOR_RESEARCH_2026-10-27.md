# KFB Motion / WS0 — NVIDIA MotionBricks donor assessment (MacBook Pro)
Date: 2026-10-27
Status: **RESEARCH / SOURCE-INSPECTED · NOT IMPLEMENTED · NOT ADOPTED · NO MAC TEST**
Owner: **KFB shared Cartoon Animation / existing Motion authoring method**, not a new movement/runtime owner
Receiver: **WS0 for later research/proof**, only when Georg resumes it
Repository: `georg-doc/kayfabizarro`
Research branch: `research/motionbricks-macbook-ws0-2026-10-27`
Outcome: preserve a source-backed, NVIDIA-free feasibility path and one bounded WS0 donor evaluation.

## Human summary
NVIDIA MotionBricks is worth investigating for natural transitions between character poses, starts/stops/pivots, locomotion, traversal (e.g. vault, duck) and object interaction. The released pretrained SOMA-human and Unitree-G1 models are available as ONNX; each generation uses four recent poses and up to four target poses. Smart Primitives assemble behaviors around pose targets without requiring retraining for every interaction.

**Do not infer that the published TensorRT demo works on a Mac.** The released interactive demos use NVIDIA TensorRT and were tested on an NVIDIA RTX 4090 under Windows/Linux. The performance headlines (including 2 ms / 15,000 FPS) are not Mac/CPU/browser benchmarks. The model's 30 Hz motion sampling is distinct from inference throughput and game render FPS.

Georg has a **MacBook Pro, precise model/chip unknown**. Do not assume Apple Silicon or NVIDIA graphics. WS0 can identify this later via Apple menu → About This Mac, if the local test is actually authorized.

## Source-verified facts (2026-10-27)
1. Official repo: https://github.com/NVlabs/motionbricks — trained SOMA + G1 models; bundled ONNX FP32 and mixed FP16; TensorRT/Warp/Newton Python demos, scene preview, Smart Primitive tooling.
2. Hugging Face: https://huggingface.co/nvidia/MotionBricks — checkpoint/model family, NVIDIA Open Model Agreement; demos separately require NVIDIA GPU.
3. ONNX inference: https://github.com/NVlabs/motionbricks/blob/main/docs/onnx_inference.md — supported tensor names/layouts, model manifests, batching, and explicit **ONNX Runtime CPUExecutionProvider** example (shown with G1). This demonstrates a non-CUDA model inference interface, **not** full SOMA-to-KFB motion playback on macOS.
4. SOMA model card: https://github.com/NVlabs/motionbricks/blob/main/docs/soma_model.md — documented implementation tested with TensorRT / RTX 4090; no CPU-vs-GPU inference benchmark provided.
5. Warp platform note: https://nvidia.github.io/warp/latest/user_guide/installation.html — macOS Apple Silicon Warp wheel supports CPU but not Metal acceleration. This is about Warp, and does not establish compatibility for the full MotionBricks demo.
6. NVIDIA software/model/sample licenses are distinct: code **Apache-2.0**, models/ONNX **NVIDIA Open Model Agreement**, bundled BONES samples **NVIDIA Sample Data Evaluation License**. Evaluation-only samples must not be silently imported as commercially reusable KFB assets. Third-party model/rig/sample and generated-output terms need explicit review.

## MacBook Pro feasibility matrix (hypotheses, not tested)
| Option | Readiness | KFB role |
| --- | --- | --- |
| Official TensorRT interactive demo on this Mac | **NOT SUPPORTED AS DOCUMENTED** (NVIDIA GPU needed) | No assumption of local demo |
| Local ONNX Runtime CPU, FP32, standalone SOMA | **CANDIDATE / UNTESTED ON THIS MAC** | First isolated feasibility probe |
| Local CoreML acceleration / Apple Neural Engine | **RESEARCH ONLY / UNTESTED** | Optional optimization only after CPU correctness |
| Local WebGPU/ONNX browser inference | **RESEARCH ONLY / UNTESTED** | Not the first gate |
| External NVIDIA machine, then baked motion export | **FALLBACK / UNTESTED END-TO-END** | If local CPU is too slow or unsupported |
| Bake and retarget accepted motion into GLB clips | **PREFERRED INTEGRATION CONCEPT / NOT IMPLEMENTED** | Normal KFB Motion Library consumption, no runtime model needed |

For an Intel MacBook Pro, support for the standalone ONNX CPU path must be checked independently; contemporary Warp macOS wheels target Apple Silicon. Do not conflate the CPU-only ONNX example with full-platform support. Memory usage, model loading time, ONNX operator support, actual latency and thermal behavior remain unknown.

## KFB ownership and protected constraints
Read first:
- `skills/chat/START_HERE.md`
- `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
- `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
- `skills/kfb-cartoon-animation/SKILL.md`
- `skills/kfb-cartoon-animation/references/kfb-integration-current-ssot.md`
- Current Motion SSOT / PR #344: `coworker/kaykit-native-locomotion-baseline-01-2026-10-03`, current branch/head to be re-read before use.
- WB2 receiving world PR #348: **R4 STOPPED / NO MVP**; do not use MotionBricks to bypass the visual world-design human gate.

**Preserve Georg's already decided KayKit-native Medium locomotion:**
- Walk `Walking_B`, Run `Running_A`, Sprint `Running_B`, Jog by speed/phase blending.
- Baseline source review: **21 KEEP / 3 HOLD / 0 REJECT**.
- Existing Motion authoring, clip-catalog, semantic state and retargeting owners remain authoritative. World/Combat/Travel continue owning their own input, world transforms, contact, collisions and game rules.
- MotionBricks remains a **supplementary donor only for verified gaps**, notably start/stop/pivot, turn-in-place or traversal; no re-picking approved gaits, no second movement state machine, no new actor/camera/physics owner.
- Source object/pose must be shown **in isolation** before KFB rig integration. A downloaded ONNX/GLB file or successful asset URL is not visual proof.

## One bounded WS0 research/proof (only on later resumption)
**Gate: MOTIONBRICKS-MAC-ONNX-SOMA-ISOLATION-01 (RESEARCH/POC, no adoption).**

1. Read the current project SSOT, Motion owner and Recovery. Determine the Mac's exact chip, macOS, RAM and architecture; distinguish Apple Silicon from Intel.
2. Identify exact upstream repo revision, SHA/checksums and SOMA FP32 ONNX tensor manifest. Review terms for models, example clips, and derivative motions separately. Do not download/re-host licensed sample media in KFB.
3. Attempt **standalone SOMA FP32 inference with ONNX Runtime CPUExecutionProvider** with known-valid pose inputs on the local machine, **outside** the full TensorRT/Newton demo. Report dependency installation, tensor-shape sanity, load/memory/latency and exact failures; no invented benchmark.
4. **Show original SOMA source motion/rig isolated** with a reproducible pose sequence before changing any KFB rig. Verify continuity, root trajectory and contact; avoid claiming a model load equals a motion proof.
5. Only if step 4 is demonstrably good: retarget **one** generated start/stop/pivot or interaction sequence to existing accepted Mannequin_Medium/KayKit family using the current Motion Library path. Compare it against accepted native clips for foot slide/contact, root drift, pose quality, timing, deformation, silhouette and cartoon readability.
6. Decide `KEEP_DONOR / HOLD / REJECT` for this **specific use case**, not for MotionBricks generally. If CPU unsuitable, record an external GPU/offline clip-baking fallback without reworking World/Combat.
7. Persist real tests/counts and visual proof on owning branch; update owner Return when a verified material result exists. No staging, publication, merge or Live without the appropriate gate.

## KFB potential, strictly exploratory
- WorldBuilder/Residents: object pickup, sitting, traversal, activity interactions.
- Combat: evade, turn and transitions **only** if Combat consumer accepts exported animations.
- Mindscapes: separate motion style/acting as presentation, never rewrite world simulation.
- Claymation: generated natural motion needs KFB-specific authored squash/stretch, anticipation, timing and stylization. MotionBricks is not a turnkey KFB cartoon acting model.

## What is actually checked
- Source/documentary verification: NVIDIA README, Hugging Face model card, ONNX inference docs, SOMA model card, Warp platform/install docs — **5 primary source families read**.
- Local Mac runs: **0**; downloaded models: **0**; retargets: **0**; visual donor proof: **0**.
- KFB runtime edits: **0**; test runs: **0**; Stage/Site publication: **0**; human acceptance: **NONE**.

## Handoff
Georg needs to do **nothing now**. Later, WS0 reads this file and executes only **MOTIONBRICKS-MAC-ONNX-SOMA-ISOLATION-01**, unless the current Motion SSOT/Recovery has superseded this research proposal. No additional project/runtime owner is authorized.
