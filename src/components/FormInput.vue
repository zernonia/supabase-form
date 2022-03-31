<script setup lang="ts">
import { ConfigColumn } from "@/interface"
import { PropType } from "vue"

const props = defineProps({
  item: { type: Object as PropType<ConfigColumn>, required: true },
  modelValue: { type: String || Boolean || Number },
})
</script>

<template>
  <select v-if="item.inputType == 'select'" class="input" v-model="modelValue">
    <option disabled value="undefined">Please select one</option>
    <option v-for="opt in item.reference.enum" :value="opt">{{ opt }}</option>
  </select>
  <textarea v-else-if="item.inputType == 'textarea'" class="input" v-model="modelValue"></textarea>
  <Toggle v-else-if="item.inputType == 'checkbox'" v-model="modelValue"></Toggle>
  <input class="input" v-else :type="item.inputType" v-model="modelValue" />
</template>
