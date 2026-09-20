# CA2-02b · Test Report

Status: **PENDING**

Runtime candidate: `d32b71d800a8d5ffc7c58828b1544e6d47731143`

New checks added for the bounded human pitch correction:

- Studio base remains `[-14,77,0]`;
- human delta is exactly `-5°`;
- effective grip is `[-19,77,0]`;
- both actors expose finite world muzzle pitch;
- Aim is within ±3.5° of horizontal;
- FB/GothGirl Aim pitches match within 0.15°;
- Release frame remains `0.150 s`;
- Release muzzle pitch must be at least 3.5° above that actor's Aim pitch, preserving visible recoil;
- all previous source, grip, muzzle, single-release, reload, ownership and browser/resource checks remain active.
