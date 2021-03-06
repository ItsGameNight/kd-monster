<template>
  <div class="SettlementInspector" @dblclick="toggleAll">
    <h2 class="SettlementInspector__settlementName">
      {{ currentSettlement.name }}
    </h2>
    <h5 class="SettlementInspector__settlementLabel" :class="[themeClass, highlightColor]">
      Settlement Inspector
    </h5>
    <div class="SettlementInspector__settlementStats">
      <div class="SettlementInspector__statbox" @dblclick.stop>
        <editable-stat
          :statDisplayName="'Lantern Year'"
          :initValue="currentSettlement.lanternYear"
          :minValue="0"
          large
          @update="update('lanternYear', $event)" />
      </div>
      <div class="SettlementInspector__statbox" @dblclick.stop>
        <editable-stat
          :statDisplayName="'Survival Limit'"
          :initValue="currentSettlement.survivalLimit"
          :minValue="0"
          large
          @update="update('survivalLimit', $event)" />
      </div>
      <div class="SettlementInspector__statbox" @dblclick.stop>
        <editable-stat
          :statDisplayName="'Survival on Depart'"
          :initValue="currentSettlement.survivalOnDepart"
          :minValue="0"
          large
          @update="update('survivalOnDepart', $event)" />
      </div>
    </div>
    <div
      class="SettlementInspector__topScrollFade"
      :class="[themeClass, topScrollFade, altColor]"
      :style="titleAdjust">
    </div>
    <div class="SettlementInspector__scrollbox" :style="titleAdjust" @dblclick.stop>
      <div class="SettlementInspector__populationStats">
        <collapse-group :title="'Settlement Stats'" ref="cg1">
          <div slot="body">
            <ul class="SettlementInspector__populationList">
              <li>Population: <strong>{{ numberAliveInSettlement }}</strong></li>
              <li>Death Count: <strong>{{ settlementDeathCount }}</strong></li>
              <li>Male/Female Ratio: <strong>{{ settlementMaleCount }} / {{ settlementFemaleCount }}</strong></li>
            </ul>
          </div>
        </collapse-group>
      </div>
      <div class="SettlementInspector__statlist">
        <collapse-group :title="'Milestone Story Events'" ref="cg2">
          <div slot="body" class="SettlementInspector__editableListWrapper" style="padding-bottom: 6px;">
            <div class="SettlementInspector__milestoneToggle">
              <square-toggle
                :initValue="currentSettlement.milestoneBirth"
                :statDisplayName="'First child is born'"
                :squareSize="11"
                @update="update('milestoneBirth', $event); milestoneAlert($event, 'birth')" />
            </div>
            <div class="SettlementInspector__milestoneToggle">
              <square-toggle
                :initValue="currentSettlement.milestoneDeath"
                :statDisplayName="'First time death count is updated'"
                :squareSize="11"
                @update="update('milestoneDeath', $event); milestoneAlert($event, 'death')" />
            </div>
            <div class="SettlementInspector__milestoneToggle">
              <square-toggle
                :initValue="currentSettlement.milestonePopulation"
                :statDisplayName="'Population reaches 15'"
                :squareSize="11"
                @update="update('milestonePopulation', $event); milestoneAlert($event, 'population')" />
            </div>
            <div class="SettlementInspector__milestoneToggle">
              <square-toggle
                :initValue="currentSettlement.milestoneInnovation"
                :statDisplayName="'Settlement has 5 innovations'"
                :squareSize="11"
                @update="update('milestoneInnovation', $event); milestoneAlert($event, 'innovation')" />
            </div>
            <div class="SettlementInspector__milestoneToggle">
              <square-toggle
                :initValue="currentSettlement.milestoneGameOver"
                :statDisplayName="'Population reaches 0'"
                :squareSize="11"
                @update="update('milestoneGameOver', $event); milestoneAlert($event, 'over')" />
            </div>
          </div>
        </collapse-group>
      </div>
      <div class="SettlementInspector__statlist">
        <collapse-group :title="'Principles'" ref="cg3">
          <div slot="body" class="SettlementInspector__editableListWrapper">
            <editable-list
              :listItems="currentSettlement.principles"
              :autocompleteList="principleNames"
              :parentHeight="height"
              @update="update('principles', $event)" />
          </div>
        </collapse-group>
      </div>
      <div class="SettlementInspector__statlist">
        <collapse-group :title="'Innovations'" ref="cg4">
          <div slot="body" class="SettlementInspector__editableListWrapper">
            <editable-list
              :listItems="currentSettlement.innovations"
              :autocompleteList="innovationNames"
              :parentHeight="height"
              @update="update('innovations', $event)" />
          </div>
        </collapse-group>
      </div>
      <div class="SettlementInspector__statlist">
        <collapse-group :title="'Settlement Locations'" ref="cg5">
          <div slot="body" class="SettlementInspector__editableListWrapper">
            <editable-list
              :listItems="currentSettlement.locations"
              :autocompleteList="settlementLocationNames"
              :parentHeight="height"
              @update="update('locations', $event)" />
          </div>
        </collapse-group>
      </div>
      <div class="SettlementInspector__statlist">
        <collapse-group :title="'Quarries'" ref="cg6">
          <div slot="body" class="SettlementInspector__editableListWrapper">
            <editable-list
              :listItems="currentSettlement.quarries"
              :autocompleteList="quarryNames"
              :parentHeight="height"
              @update="update('quarries', $event)" />
          </div>
        </collapse-group>
      </div>
      <div class="SettlementInspector__statlist">
        <collapse-group :title="'Nemesis Monsters'" ref="cg7">
          <div slot="body" class="SettlementInspector__editableListWrapper">
            <editable-list
              :listItems="currentSettlement.nemeses"
              :parentHeight="height"
              @update="update('nemeses', $event)" />
          </div>
        </collapse-group>
      </div>
      <div class="SettlementInspector__statlist">
        <collapse-group :title="'Lantern Research Level'" :initCollapse="true" ref="cg8">
          <div slot="body" class="SettlementInspector__editableListWrapper">
            <editable-stat
              :statDisplayName="'Lantern Research Level'"
              :initValue="currentSettlement.researchLevel"
              :minValue="0"
              @update="update('researchLevel', $event)" />
            <h4>Monster Volumes</h4>
            <editable-list
              :listItems="currentSettlement.monsterVolumes"
              :parentHeight="height"
              @update="update('monsterVolumes', $event)" />
          </div>
        </collapse-group>
      </div>
      <div class="SettlementInspector__statlist">
        <collapse-group :title="'Lost Settlements'" :initCollapse="true" ref="cg9">
          <div slot="body" class="SettlementInspector__editableListWrapper">
            <editable-stat
              :statDisplayName="'Lost Settlement Count'"
              :initValue="currentSettlement.lostSettlementCount"
              :minValue="0"
              @update="update('lostSettlementCount', $event)" />
          </div>
        </collapse-group>
      </div>
      <div class="SettlementInspector__listPadding">
      </div>
    </div>
    <div class="SettlementInspector__bottomScrollFade" :class="[themeClass, bottomScrollFade, altColor]">
    </div>
  </div>
</template>

<script type="text/javascript">
import { mapGetters, mapActions } from 'vuex'
import {
  EditableList,
  EditableStat,
  CollapseGroup,
  SquareToggle } from '@/components/GUIComponents'
import ThemeClass from '@/mixins/ThemeClass'
import {
  Innovations,
  Principles,
  SettlementLocations,
  Quarries
} from '../assets/StaticGameData'

export default {
  name: 'settlement-inspector',
  components: { EditableList, EditableStat, CollapseGroup, SquareToggle },
  mixins: [ThemeClass],
  data: function () {
    return {
      height: 0,
      titleHeight: 41,
      collapseState: false
    }
  },
  mounted: function () {
    this.height = this.$el.getBoundingClientRect().height + this.$el.getBoundingClientRect().top
    this.titleHeight = this.$el.querySelector('.SettlementInspector__settlementName').getBoundingClientRect().bottom
    this.$nextTick(() => {
      // Detect window resizes
      window.addEventListener('resize', (e) => {
        this.height = this.$el.getBoundingClientRect().height + this.$el.getBoundingClientRect().top
        this.titleHeight = this.$el.querySelector('.SettlementInspector__settlementName').getBoundingClientRect().bottom
      })
      // Detect scrolls
      window.addEventListener('scroll', (e) => {
        this.height = this.$el.getBoundingClientRect().height + this.$el.getBoundingClientRect().top
      })
    })
  },
  computed: {
    ...mapGetters([
      'inHistoryMode',
      'numberAliveInSettlement',
      'settlementDeathCount',
      'settlementMaleCount',
      'settlementFemaleCount',
      'currentSettlement'
    ]),
    principleNames: function () {
      return this.getNames(Principles)
    },
    innovationNames: function () {
      return this.getNames(Innovations)
    },
    settlementLocationNames: function () {
      return this.getNames(SettlementLocations)
    },
    quarryNames: function () {
      return this.getNames(Quarries)
    },
    titleAdjust: function () {
      return { top: 165 + (this.titleHeight - 41) + 'px' }
    }
  },
  methods: {
    ...mapActions([
      'updateSettlement'
    ]),
    update: function (stat, val) {
      var update = {}
      update[stat] = val
      this.updateSettlement({ id: this.currentSettlement._id, update: update })
    },
    getNames: function (obj) {
      return Object.values(obj).map((o) => { return o.name })
    },
    milestoneAlert: function (set, milestone) {
      if (!set) {
        return
      }
      if (milestone === 'birth') {
        alert('The first child of ' + this.currentSettlement.name + ' was born! Read story event Principle: New Life.')
      } else if (milestone === 'death') {
        alert('The first death of ' + this.currentSettlement.name + ' has occured. Read story event Principle: Death.')
      } else if (milestone === 'population') {
        alert('The population of ' + this.currentSettlement.name + ' has reached 15! Read story event Principle: Society.')
      } else if (milestone === 'innovation') {
        alert(this.currentSettlement.name + ' has completed 5 innovations! Read story event Hooded Knight.')
      } else if (milestone === 'over') {
        alert(this.currentSettlement.name + ' has been wiped out. Read story event Game Over.')
      }
    },
    toggleAll: function () {
      this.collapseState = !this.collapseState
      for (var i = 1; i <= 9; i++) {
        this.$refs['cg' + i].setCollapseState(this.collapseState)
      }
    },
    setSectionToggleState: function (sections, state) {
      for (var section of sections) {
        switch (section) {
          case 'stats':
            this.$refs.cg1.setCollapseState(state)
            break
          case 'milestones':
            this.$refs.cg2.setCollapseState(state)
            break
          case 'principles':
            this.$refs.cg3.setCollapseState(state)
            break
          case 'innovations':
            this.$refs.cg4.setCollapseState(state)
            break
          case 'locations':
            this.$refs.cg5.setCollapseState(state)
            break
          case 'quarries':
            this.$refs.cg6.setCollapseState(state)
            break
          case 'nemeses':
            this.$refs.cg7.setCollapseState(state)
            break
          case 'research':
            this.$refs.cg8.setCollapseState(state)
            break
          case 'lost':
            this.$refs.cg9.setCollapseState(state)
            break
          default:
            break
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.SettlementInspector {
  position: relative;
  min-width: 230px;

  &__settlementName {
    margin: 0 auto;
    text-transform: capitalize;
  }

  &__settlementLabel {
    margin: 0 auto;
    line-height: 6pt;
  }

  &__settlementStats {
    display: flex;
    flex-direction: row;
    margin-top: 10px;
  }

  &__statbox {
    width: 33%;
  }

  &__topScrollFade {
    position: absolute;
    top: 165px;
    left: 0;
    right: 5px;
    height: 20px;
    z-index: 12;
  }

  &__bottomScrollFade {
    position: absolute;
    bottom: 5px;
    left: 0;
    right: 5px;
    height: 40px;
    z-index: 12;
  }

  &__scrollbox {
    position: absolute;
    top: 165px;
    bottom: 5px;
    right: 5px;
    left: 10px;
    padding-top: 20px;
    overflow-y: scroll;
    z-index: 11;

    &::-webkit-scrollbar { 
      display: none; 
    }
  }

  &__populationStats {
    width: 95%;
  }

  &__populationList {
    list-style-type: none;
    padding: 0;
    margin: 0 auto;

    li {
      font-size: 11pt;
    }

    strong {
      font-style: normal;
      padding-left: 4px;
    }
  }

  &__statlist {
    margin-top: 10px;
    width: 95%;
  }

  &__editableListWrapper {
    padding-bottom: 25px;
  }

  &__milestoneToggle {
    padding: 4px 0;
  }

  &__listPadding {
    height: 120px;
  }
}
</style>
