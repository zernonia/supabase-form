<script setup lang="ts">
import HeroImage from "@/assets/hero.png"
</script>

<template>
  <section class="flex flex-col items-center justify-center">
    <div>
      <h1 class="mt-20 text-6xl font-bold text-center">
        Turn your Supabase Table <br />
        into a form easily
      </h1>
      <p class="text-3xl mt-4 text-center text-gray-300">Just like how you do with Airtable</p>
    </div>

    <router-link class="button mt-20" to="/login">Take a peek!</router-link>

    <img class="my-20" :src="HeroImage" alt="Supaform - Turn your supabase table info a form easily" />
  </section>
</template>
