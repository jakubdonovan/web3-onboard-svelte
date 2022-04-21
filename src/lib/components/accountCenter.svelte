<script>
	import { fade } from 'svelte/transition';

	let open = false;
	const toggle = () => (open = !open);

	let address = '0x7e9c...dba1';
	let balance;

	setInterval(() => {
		balance = '0.1';
	}, 1000);

	// export let state;
</script>

{#if !open}
	<div on:click|stopPropagation={toggle} class="cursor-pointer w-52 bg-white shadow-sm border border-solid border-[#ebebed] rounded-2xl p-2" in:fade={{ duration: 250 }} out:fade={{ duration: 100 }}>
		<div class="flex items-center justify-between px-1">
			<div class="flex items-center w-full">
				<!-- app and wallet icon badge -->
				<div class="flex items-center relative">
					<div class="drop-shadow">
						<!-- <WalletAppBadge size={32} padding={4} background={'white'} border="darkGreen" radius={8} icon={appIcon} /> -->
					</div>

					<div style="right: 0.5rem;" class="drop-shadow relative">
						<!-- <WalletAppBadge size={32} padding={4} background="green" border="darkGreen" radius={8} icon={primaryWallet ? primaryWallet.icon : ''} /> -->
					</div>

					<div style="right: 5px; bottom: -5px;" class="drop-shadow absolute">
						<!-- <SuccessStatusIcon size={14} /> -->
					</div>
				</div>
			</div>

			<!-- address and balance -->
			<div class="flex flex-col w-full">
				<div class="font-bold leading-5">
					{address}
				</div>
				{#if balance}
					<div in:fade class="font-normal text-[#707481] leading-5">
						{balance} SHIELD
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.radius {
		border-radius: 16px;
	}

	.padding-5 {
		padding: var(--onboard-spacing-5, var(--spacing-5));
	}

	.drop-shadow {
		filter: drop-shadow(0px 1px 4px rgba(0, 0, 0, 0.2));
	}
</style>
