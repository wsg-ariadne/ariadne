<template>
    <button class="rounded-full font-bold px-2 py-4 text-lg">
        <slot></slot>
    </button>
</template>

<style scoped>
button {
    background: var(--vt-c-cyan);
    color: var(--vt-c-indigo);
    border: 1px solid var(--vt-c-cyan);
    transition: all 0.2s ease-in-out;
}
button:hover {
    background: var(--vt-c-indigo);
    color: var(--vt-c-cyan);
}
</style>
