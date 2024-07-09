import { writable } from "svelte/store";

export const openDropdown = writable<string | null>(null);
