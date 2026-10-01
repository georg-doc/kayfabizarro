import { afterAll, describe, expect, test } from 'vitest'
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { BoneAutoMapper } from './BoneAutoMapper'
import { BoneChainResolver, type RawBoneRecord } from './BoneChainResolver'
import { HumanChainConfig } from '../human-retargeting/HumanChainConfig'

type GlbJson = {
  nodes?: Array<{ name?: string, children?: number[], translation?: number[] }>
  skins?: Array<{ joints?: number[] }>
  meshes?: unknown[]
  animations?: Array<{ name?: string, channels?: unknown[] }>
}

const KFB_REPO = process.env.KFB_REPO
if (KFB_REPO === undefined || KFB_REPO.length === 0) {
  throw new Error('KFB_REPO must point to the checked-out kayfabizarro repository')
}

const gothPath = join(
  KFB_REPO,
  'media/3D_Assets/KayKit_Mystery_Series6/GothGirl/characters/GothGirl.glb'
)
const generalPath = join(
  KFB_REPO,
  'media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/Rig_Medium/Rig_Medium_General.glb'
)
const m2mRigPath = join(process.cwd(), 'static/rigs/rig-human.glb')

function parseGlbJson (path: string): GlbJson {
  const data = readFileSync(path)
  if (data.readUInt32LE(0) !== 0x46546c67) throw new Error(`Not a GLB: ${path}`)
  const totalLength = data.readUInt32LE(8)
  let offset = 12

  while (offset < totalLength) {
    const chunkLength = data.readUInt32LE(offset)
    const chunkType = data.readUInt32LE(offset + 4)
    offset += 8

    if (chunkType === 0x4E4F534A) {
      const text = data.subarray(offset, offset + chunkLength)
        .toString('utf8')
        .replace(/\u0000+$/g, '')
        .trim()
      return JSON.parse(text) as GlbJson
    }
    offset += chunkLength
  }
  throw new Error(`No JSON chunk in GLB: ${path}`)
}

function boneRecords (json: GlbJson): RawBoneRecord[] {
  const nodes = json.nodes ?? []
  const jointIndices = new Set<number>(
    (json.skins ?? []).flatMap(skin => skin.joints ?? [])
  )
  const parent = new Map<number, number>()

  nodes.forEach((node, index) => {
    for (const child of node.children ?? []) parent.set(child, index)
  })

  return [...jointIndices].map((index) => {
    const parentIndex = parent.get(index)
    return {
      name: nodes[index]?.name ?? `#${index}`,
      parent_name: parentIndex !== undefined && jointIndices.has(parentIndex)
        ? (nodes[parentIndex]?.name ?? `#${parentIndex}`)
        : null
    }
  })
}

function translationLength (json: GlbJson, nodeName: string): number {
  const node = (json.nodes ?? []).find(n => n.name === nodeName)
  if (node === undefined) throw new Error(`Missing node ${nodeName}`)
  const t = node.translation ?? [0, 0, 0]
  return Math.sqrt(t.reduce((sum, value) => sum + value * value, 0))
}

const goth = parseGlbJson(gothPath)
const general = parseGlbJson(generalPath)
const m2m = parseGlbJson(m2mRigPath)

const gothRecords = boneRecords(goth)
const m2mRecords = boneRecords(m2m)

const sourceMeta = BoneChainResolver.build_metadata(m2mRecords)
const targetMeta = BoneChainResolver.build_metadata(gothRecords)
const mapping = BoneAutoMapper.map_by_canonical_slots(sourceMeta, targetMeta)
const sourceConfig = HumanChainConfig.build_custom_source_config(mapping)
const targetConfig = HumanChainConfig.build_custom_target_config(sourceConfig, mapping)

const unmappedTarget = gothRecords
  .map(b => b.name)
  .filter(name => !mapping.has(name))
  .sort()

const result = {
  donorHead: '79f3f61a9852ef70234a5a4a7c13ed87f7a71833',
  kfbBase: '1c9c9706764ce41ce1282f60e358195afed207e5',
  goth: {
    bones: gothRecords.length,
    meshes: goth.meshes?.length ?? 0
  },
  m2mHuman: {
    bones: m2mRecords.length
  },
  kfbGeneral: {
    animations: general.animations?.length ?? 0
  },
  mapping: {
    count: mapping.size,
    targetBones: gothRecords.length,
    entries: Object.fromEntries(mapping),
    unmappedTarget
  },
  targetConfig,
  distances: {
    m2mLowerarmToHand: translationLength(m2m, 'hand_l'),
    kaykitLowerarmToWrist: translationLength(goth, 'wrist.l'),
    kaykitWristToHand: translationLength(goth, 'hand.l')
  }
}

afterAll(() => {
  writeFileSync(
    join(KFB_REPO, 'm2m-kfb-retarget-p0-result.json'),
    JSON.stringify(result, null, 2) + '\n'
  )
})

describe('M2M-KFB-RETARGET-P0 · GothGirl / Rig_Medium', () => {
  test('reads exact structural ground truth', () => {
    expect(gothRecords).toHaveLength(23)
    expect(goth.meshes).toHaveLength(6)
    expect(m2mRecords).toHaveLength(66)
    expect(general.animations).toHaveLength(15)
  })

  test('uses Mesh2Motion canonical mapper to cover the KayKit core skeleton', () => {
    expect(mapping.size).toBe(19)
    expect(mapping.get('root')).toBe('root')
    expect(mapping.get('hips')).toBe('pelvis')
    expect(mapping.get('spine')).toBe('spine_01')
    expect(mapping.get('chest')).toBe('spine_03')
    expect(mapping.get('head')).toBe('head')
    expect(mapping.get('upperleg.l')).toBe('thigh_l')
    expect(mapping.get('lowerleg.l')).toBe('calf_l')
    expect(mapping.get('foot.l')).toBe('foot_l')
    expect(mapping.get('upperarm.l')).toBe('upperarm_l')
    expect(mapping.get('lowerarm.l')).toBe('lowerarm_l')
    expect(mapping.get('wrist.l')).toBe('hand_l')
  })

  test('leaves only KayKit downstream hand / attachment nodes unmapped', () => {
    expect(unmappedTarget).toEqual([
      'hand.l',
      'hand.r',
      'handslot.l',
      'handslot.r'
    ])
  })

  test('builds usable Mesh2Motion human retarget chains for KayKit', () => {
    expect(targetConfig.pelvis).toEqual(['hips'])
    expect(targetConfig.spine).toEqual(['spine', '', 'chest'])
    expect(targetConfig.head).toEqual(['', 'head'])
    expect(targetConfig.armL).toEqual(['upperarm.l', 'lowerarm.l', 'wrist.l'])
    expect(targetConfig.armR).toEqual(['upperarm.r', 'lowerarm.r', 'wrist.r'])
    expect(targetConfig.legL).toEqual(['upperleg.l', 'lowerleg.l', 'foot.l'])
    expect(targetConfig.legR).toEqual(['upperleg.r', 'lowerleg.r', 'foot.r'])
  })

  test('confirms the donor hand maps geometrically to the KayKit wrist', () => {
    const sourceHand = result.distances.m2mLowerarmToHand
    const targetWrist = result.distances.kaykitLowerarmToWrist
    const targetHand = result.distances.kaykitWristToHand

    expect(Math.abs(sourceHand - targetWrist)).toBeLessThan(0.03)
    expect(targetHand).toBeLessThan(0.08)
  })
})
