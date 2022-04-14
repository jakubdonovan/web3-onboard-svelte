<script>
	import { onMount, onDestroy } from 'svelte';
	import { ethers } from 'ethers';
	import { defaultEvmStores, connected, provider, chainId, chainData, signer, signerAddress, contracts } from 'svelte-ethers-store';

	import Onboard from '@web3-onboard/core';
	import injectedModule from '@web3-onboard/injected-wallets';
	import walletConnectModule from '@web3-onboard/walletconnect';

	const injected = injectedModule();
	const walletConnect = walletConnectModule();

	let onboard;
	let state;

	onMount(async () => {
		onboard = Onboard({
			wallets: [injected, walletConnect],
			chains: [
				{
					id: '0x1',
					token: 'ETH',
					label: 'Ethereum Mainnet',
					rpcUrl: 'https://mainnet.infura.io/v3/0ef6bd5de679422084aab6bc04e10fcc'
				}
			],
			appMetadata: {
				name: 'Shield Protocol',
				icon: 'logo-icon-black.svg',
				logo: 'logo-black.svg',
				description: 'Research tokens smarter and faster.'
				// recommendedInjectedWallets: [
				// 	{ name: 'MetaMask', url: 'https://metamask.io' },
				// 	{ name: 'WalletConnect', url: 'https://walletconnect.com/' }
				// ]
			},
			accountCenter: {
				desktop: {
					position: 'topRight',
					enabled: true
				}
			}
		});

		state = onboard.state.select();
		const { unsubscribe } = state.subscribe(async (update) => {
			// connected event
			if (update.wallets) {
				console.log('CONNECTED EVENT TRIGGERED');

				// set svelte-ethers-stores provider to make stores usable
				await defaultEvmStores.setProvider(update.wallets[0].provider);
				console.log('STORES SET:', $connected, $signerAddress, $signer, $provider);

				// add wallet to localstorage
				const connectedWallets = update.wallets.map(({ label }) => label);
				window.localStorage.setItem('connectedWallets', JSON.stringify(connectedWallets));
			}
			// disconnected event
			if (!update.wallets) {
				console.log('DISCONNECTED');
			}

			// account changed event ??????
			// contract transaction filter event ??????
		});

		// unsubscribe() // should probably go in onDestroy but not sure how to use this function outside of the scope of onMount

		// reconnect from localstorage on reload
		const previouslyConnectedWallets = JSON.parse(window.localStorage.getItem('connectedWallets'));
		if (previouslyConnectedWallets) {
			await onboard.connectWallet({
				autoSelect: { label: previouslyConnectedWallets[0], disableModals: true }
			});
		}
	});

	const connect = async () => await onboard.connectWallet();

	const disconnect = async () => {
		const [primaryWallet] = await onboard.state.get().wallets;
		await onboard.disconnectWallet({ label: primaryWallet.label });

		console.log('DISCONNECTED: (stores should be undefined)', $connected, $signerAddress, $signer, $provider);
	};
</script>

<div class="mx-4 flex h-10 items-center justify-center">
	{#if !$connected}
		<button on:click={connect} class="h-full rounded-2xl border-2 border-solid border-transparent bg-blue-100 py-1 px-4 font-RedHatMono text-sm font-semibold transition-all ease-out hover:border-blue-200">Connect Wallet</button>
	{:else}
		<button on:click={disconnect} class="h-full rounded-2xl border-2 border-solid border-transparent bg-blue-100 py-1 px-4 font-RedHatMono text-sm font-semibold transition-all ease-out hover:border-blue-200">Disconnect</button>
	{/if}
</div>
