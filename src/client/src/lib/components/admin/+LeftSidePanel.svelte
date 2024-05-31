<script lang="ts">
    import Activities from "$lib/components/admin/+Activities.svelte";
    import Notifications from "$lib/components/admin/+Notifications.svelte";

</script>

<div class="w-full">
    <div class="h-1/2">
        <Notifications />
    </div>
    <div class="h-1/2">
        <Activities />
    </div>
</div>