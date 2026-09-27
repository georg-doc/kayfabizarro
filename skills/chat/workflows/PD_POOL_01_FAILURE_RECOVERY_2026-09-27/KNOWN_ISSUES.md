# KNOWN ISSUES · PD-POOL-01

1. **Frozen Python syntax defect**
   - file: `tools/public_domain/fetch_pool.py`
   - frozen blob: `509a3458a815a71b2759bb2788b045a3256c4f00`
   - defect: literal `\\n` between `UA` and `AIC_UA`;
   - impact: current branch cannot execute provider gate.

2. **AIC IIIF transport**
   - initial gate returned HTTP 403;
   - exact transport cause remains unproven;
   - provider-header repair is a hypothesis, not tested evidence.

3. **No original selected-hit manifest**
   - source ZIP contains only README + fetcher;
   - historical pool counts cannot be converted into exact GitHub files from this package alone.

4. **No durable downloaded assets**
   - 3/4 files existed only inside failed runner 36283860675;
   - persistence was correctly skipped.

5. **Asset Librarian registration remains blocked**
   - the brief permits registration only after 4/4 smoke PASS.
