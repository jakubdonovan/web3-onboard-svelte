<script>
	// import { ethers } from 'ethers';
	import { defaultEvmStores, connected, provider, chainId, chainData, signer, signerAddress, contracts } from 'svelte-ethers-store';

	import Onboard from '@web3-onboard/core';
	import injectedModule from '@web3-onboard/injected-wallets';
	import walletConnectModule from '@web3-onboard/walletconnect';

	const injected = injectedModule();
	const walletConnect = walletConnectModule();

	const onboard = Onboard({
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
			icon: '<SVG_ICON_STRING>',
			logo: '<SVG_LOGO_STRING>',
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

	const connect = async () => {
		let wallets;
		defaultEvmStores.setProvider(wallets);
		wallets = await onboard.connectWallet();

		console.log('CONNECTED:', $connected, $signerAddress, $signer, $provider);
	};

	const disconnect = async () => {
		const [primaryWallet] = onboard.state.get().wallets;
		await onboard.disconnectWallet({ label: primaryWallet.label });

		console.log('DISCONNECTED:', $connected, $signerAddress, $signer, $provider);
	};
</script>

<div class="mx-4 flex h-10 items-center justify-center">
	{#if !$connected}
		<button on:click={connect} class="h-full rounded-2xl border-2 border-solid border-transparent bg-blue-100 py-1 px-4 font-RedHatMono text-sm font-semibold transition-all ease-out hover:border-blue-200">Connect Wallet</button>
	{:else}
		<button on:click={disconnect} class="h-full rounded-2xl border-2 border-solid border-transparent bg-blue-100 py-1 px-4 font-RedHatMono text-sm font-semibold transition-all ease-out hover:border-blue-200">Disconnect</button>
	{/if}
</div>
