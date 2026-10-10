/* KFB ChatterBox Voice · output-only asset identity contract R1.
 * Deliberately NOT a second dialogue, audio or Resident state owner.
 * Source status and usage rights are approval gates, never inferred from a key.
 */
(function(root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.KFBVoiceAssetIdentity = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function() {
  'use strict';
  const SCHEMA = 'kfb.voice-asset-identity/1';
  const text = (value, name) => {
    if (typeof value !== 'string' || !value.trim()) throw new Error(name + ' required');
    return value;
  };
  function makeKey(request, recipe) {
    if (!request || !recipe) throw new Error('VoiceRequest and render recipe required');
    if (!Array.isArray(request.sourceRefs) || request.sourceRefs.length === 0)
      throw new Error('sourceRefs required');
    const refs = request.sourceRefs.map((ref, i) => [
      text(ref.sourceId, 'sourceRefs[' + i + '].sourceId'),
      text(ref.sourceRevision, 'sourceRefs[' + i + '].sourceRevision'),
      text(ref.textRevision, 'sourceRefs[' + i + '].textRevision')
    ]);
    // An array is deliberate: preserves order and is unambiguous if text contains delimiters.
    const dimensions = [
      SCHEMA, refs, text(request.text, 'exact visible text'),
      text(request.voicePreset, 'voicePreset'),
      text(request.emotion, 'emotion'),
      recipe.segmentRole === 'whole' ? 'whole' : text(recipe.segmentRole, 'segmentRole'),
      text(recipe.locale, 'locale'), text(recipe.provider, 'provider'),
      text(recipe.model, 'model'), text(recipe.voiceId, 'voiceId'),
      text(recipe.recipeRevision, 'recipeRevision'),
      text(recipe.settingsRevision, 'settingsRevision')
    ];
    return JSON.stringify(dimensions);
  }
  // Only actual accepted source+rights+voice allow shipping. Audition is explicit and remains private.
  function evaluateAsset(asset, expectedKey, {mode = 'audition'} = {}) {
    const reasons = [];
    if (!asset || asset.identityKey !== expectedKey) reasons.push('IDENTITY_MISMATCH');
    if (mode === 'public') {
      if (asset?.sourceStatus !== 'APPROVED') reasons.push('SOURCE_NOT_APPROVED');
      if (asset?.rightsStatus !== 'CLEARED') reasons.push('RIGHTS_NOT_CLEARED');
      if (asset?.castingStatus !== 'KEEP') reasons.push('CAST_NOT_APPROVED');
    } else if (mode !== 'audition') {
      reasons.push('INVALID_MODE');
    }
    return {eligible: reasons.length === 0, reasons};
  }
  return Object.freeze({SCHEMA, makeKey, evaluateAsset});
});
