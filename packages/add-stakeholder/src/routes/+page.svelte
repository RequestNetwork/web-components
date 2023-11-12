<script>
    import AddStakeholder from "../components/add-stakeholder.svelte";

    let rf = {
        show: false,
        builderKey: `026c0594b192ebfda22706bff76ee5fb34a65fe93fde779ade3dfafbf77375cd2e`,
        webhookURL: `http://localhost:3001`,
        open() {
            rf.show = !rf.show
        }
    }
</script>

<style>
    div.card {
        width: 400px;
        margin: 5em auto;
    }
</style>

<div class="card">
    <div class="card-body">
        <div class="mb-3">
            <label for="builder-key" class="form-label">Builder Key</label>
            <input class="form-control" id="builder-key" placeholder={rf.builderKey}>
        </div>
        <div class="mb-3">
            <label for="webhook-url" class="form-label">Webhook URL</label>
            <input class="form-control" id="webhook-url" bind:value={rf.webhookURL}>
        </div>
        <div class="mt-3">
            <button class="btn btn-primary w-100" on:click={rf.open}>Open</button>
        </div>
    </div>
</div>
{#if rf.show}
    <AddStakeholder
        builderKey={rf.builderKey}
        webhookUrl={rf.webhookURL}/>
{/if}
