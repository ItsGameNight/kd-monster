import Database from './db'

class SettlementsDatabase extends Database {
  constructor (dbpath) {
    super(dbpath, 'settlements.db')
    this.baseSmt = {
      name: null,
      timeline: null,
      principles: [],
      locations: [],
      innovations: [],
      resources: [],
      storedGear: [],
      quarries: [],
      nemeses: [],
      monsterVolumes: [],
      researchLevel: 0,
      lostSettlementCount: 0,
      storyNotes: [],
      lanternYear: 0,
      survivalLimit: 1,
      survivalOnDepart: 0,
      milestoneBirth: false,
      milestoneDeath: false,
      milestonePopulation: false,
      milestoneInnovation: false,
      milestoneGameOver: false,
      notes: [],
      currentStep: 0,
      baseSurvivor: {
        settlementID: null,
        name: null,
        sex: null,
        alive: true,
        survival: 0,
        cannotSpendSurvival: false,
        movement: 5,
        accuracy: 0,
        strength: 0,
        evasion: 0,
        luck: 0,
        speed: 0,
        insanity: 0,
        xp: 0,
        courage: 0,
        boldSkill: null,
        understanding: 0,
        insightSkill: null,
        weaponProficiency: null,
        weaponProficiencyLevel: 0,
        fightingArts: [],
        cannotUseFighting: false,
        disorders: [],
        abilities: [],
        impairments: [],
        departing: false,
        mother: null,
        father: null,
        nickname: null,
        surname: null,
        skipHunt: false,
        dodge: true,
        encourage: false,
        dash: false,
        surge: false,
        endure: false,
        birthYear: 0,
        deathYear: null,
        brainHP: 0,
        headHP: 0,
        armsHP: 0,
        bodyHP: 0,
        waistHP: 0,
        legsHP: 0,
        headArmor: 0,
        armsArmor: 0,
        bodyArmor: 0,
        waistArmor: 0,
        legsArmor: 0,
        other: null
      }
    }
  }

  // Create a new settlement
  createNew (cb) {
    super.createNew(this.baseSmt, cb)
  }
}

export default SettlementsDatabase
