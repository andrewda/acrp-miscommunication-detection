<template>
  <div class="flow-root">
    <ul role="list" class="-mb-8">
      <li v-for="(event, eventIdx) in timeline" :key="event.id">
        <div class="relative pb-8">
          <span
            v-if="eventIdx !== timeline.length - 1"
            class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
            aria-hidden="true"
          />
          <div class="relative flex space-x-3">
            <div>
              <span
                :class="[
                  event.iconBackground,
                  'h-10 w-10 rounded-full flex items-center justify-center ring-10 ring-white',
                ]"
              >
                <component
                  :is="event.icon"
                  :src="event.src"
                  class="h-6 w-6 text-white"
                  aria-hidden="true"
                />
              </span>
            </div>
            <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
              <div>
                <p class="text-sm text-gray-500">
                  <span class="font-bold text-gray-900"
                    >{{ event.target }}:
                  </span>
                  <span v-html="event.content"></span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { CheckIcon, ThumbUpIcon, UserIcon } from '@heroicons/vue/solid';
import ControlTower from '../../assets/control-tower.svg';
import Plane from '../../assets/plane.svg';

const timeline = [
  {
    id: 0,
    content:
      'ALASKA TWO THREE THREE DESCEND <span class="text-green-600">FLIGHT LEVEL TWO TWO ONE</span> TURN LEFT HEADING ZERO SIX ZERO',
    target: 'KPDX Approach',
    icon: 'img',
    src: ControlTower,
    iconBackground: 'bg-green-300',
  },
  {
    id: 1,
    content:
      'DESCEND <span class="text-red-600">FLIGHT LEVEL TWO ONE ONE</span> AND UH LEFT HEADING ZERO SIX ZERO ALASKA TWO THREE THREE',
    target: 'ASA 233',
    icon: 'img',
    src: Plane,
    iconBackground: 'bg-blue-300',
  },
];

export default {
  setup() {
    return {
      timeline,
    };
  },
};
</script>
