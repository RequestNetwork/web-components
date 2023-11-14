<script>
    import { AddStakeholder } from '$lib/index.js'

    import { onMount } from 'svelte';

    let form = {
        show: false,
        builderKey: `026c0594b192ebfda22706bff76ee5fb34a65fe93fde779ade3dfafbf77375cd2e`,
        webhookURL: `http://localhost:3001`,
        open() {
            form.show = !form.show
        },
        ready: false
    }

    onMount(() => {
        form.ready = true
    })
</script>

<style>
    div.card {
        width: 400px;
        margin: 5em auto;
    }
</style>

{#if form.ready}
    <div class="card">
        <div class="card-body">
            <div class="mb-3">
                <label for="builder-key" class="form-label">Builder Key</label>
                <input class="form-control" id="builder-key" placeholder={form.builderKey}>
            </div>
            <div class="mb-3">
                <label for="webhook-url" class="form-label">Webhook URL</label>
                <input class="form-control" id="webhook-url" bind:value={form.webhookURL}>
            </div>
            <div class="mt-3">
                <button class="btn btn-primary w-100" on:click={form.open}>Open</button>
            </div>
        </div>
    </div>
    {#if form.show}
        <AddStakeholder
            builderKey={form.builderKey}
            webhookUrl={form.webhookURL}/>
    {/if}
{/if}
