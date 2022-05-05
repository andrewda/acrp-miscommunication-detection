<template>
  <div class="bg-white shadow overflow-hidden sm:rounded-lg">
    <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
      <dl class="sm:divide-y sm:divide-gray-200">
        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Instructed</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-3">
            SKYHAWK SEVEN NINER
            <span class="bg-green-400 p-0.5">FOUR ONE</span> SIX
          </dd>
        </div>
        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Read Back</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-3">
            SKYHAWK SEVEN NINER
            <span class="bg-red-400 p-0.5">ONE FOUR</span> SIX
          </dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<script setup>
import { PaperClipIcon } from '@heroicons/vue/solid';
</script>
