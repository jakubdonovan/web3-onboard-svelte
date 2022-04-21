<script>
	import { onMount, onDestroy } from 'svelte';
	import { ethers } from 'ethers';
	import { defaultEvmStores, connected, provider, chainId, chainData, signer, signerAddress, contracts } from 'svelte-ethers-store';
	import Onboard from '@web3-onboard/core';
	import injectedModule from '@web3-onboard/injected-wallets';
	import walletConnectModule from '@web3-onboard/walletconnect';
	import ledgerModule from '@web3-onboard/ledger';
	import trezorModule from '@web3-onboard/trezor';
	// import gnosisModule from '@web3-onboard/gnosis';
	// import coinbaseModule from '@web3-onboard/coinbase'
	// import keystoneModule from '@web3-onboard/keystone'
	// import torusModule from '@web3-onboard/torus'
	import fortmaticModule from '@web3-onboard/fortmatic';
	import portisModule from '@web3-onboard/portis';
	import magicModule from '@web3-onboard/magic';

	const injected = injectedModule();
	const walletConnect = walletConnectModule();
	const ledger = ledgerModule();
	const trezor = trezorModule({
		email: 'admin@shieldprotocol.io',
		appUrl: 'shieldprotocol.io'
	});
	// const gnosis = gnosisModule();
	// const coinbase = coinbaseModule()
	// const keystone = keystoneModule()
	// const torus = torusModule()
	const portis = portisModule({
		apiKey: 'b2b7586f-2b1e-4c30-a7fb-c2d1533b153b'
	});
	const fortmatic = fortmaticModule({
		apiKey: 'pk_test_886ADCAB855632AA'
	});
	const magic = magicModule({
		apiKey: 'pk_live_02207D744E81C2BA'
		// userEmail: 'test@test.com'
		// userEmail is optional - if user has already logged in and/or session is still active a login modal will not appear
		// for more info see the @web3-onboard/magic docs
	});

	// let onboard;
	let onboard = Onboard({
		wallets: [
			injected,
			walletConnect,
			ledger,
			trezor,
			// gnosis,
			// coinbase //coinbaseSDK is not a constructor
			// keystone, //AirGappedKeyring.getEmptyKeyring is not a function
			// torus //https.Agent is not a constructor
			portis,
			fortmatic,
			magic
		],
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
				enabled: true,
				position: 'topRight'
			}
		},
		i18n: {
			en: {
				connect: {
					selectingWallet: {
						// header: '',
						sidebar: {
							heading: '',
							subheading: 'Connect your wallet'
							// paragraph: ''
						},
						recommendedWalletsPart1: '',
						recommendedWalletsPart2: ''
						// installWallet: ''
						// agreement: {
						// 	agree: '',
						// 	terms: '',
						// 	and: '',
						// 	privacy: ''
						// }
					}
				}
			}
		}
	});
	let state = onboard.state.select();

	onMount(async () => {
		// onboard = Onboard({
		// 	wallets: [
		// 		injected,
		// 		walletConnect,
		// 		ledger,
		// 		trezor,
		// 		// gnosis,
		// 		// coinbase //coinbaseSDK is not a constructor
		// 		// keystone, //AirGappedKeyring.getEmptyKeyring is not a function
		// 		// torus //https.Agent is not a constructor
		// 		portis,
		// 		fortmatic,
		// 		magic
		// 	],
		// 	chains: [
		// 		{
		// 			id: '0x1',
		// 			token: 'ETH',
		// 			label: 'Ethereum Mainnet',
		// 			rpcUrl: 'https://mainnet.infura.io/v3/0ef6bd5de679422084aab6bc04e10fcc'
		// 		}
		// 	],
		// 	appMetadata: {
		// 		name: 'Shield Protocol',
		// 		icon: 'logo-icon-black.svg',
		// 		logo: 'logo-black.svg',
		// 		description: 'Research tokens smarter and faster.'
		// 		// recommendedInjectedWallets: [
		// 		// 	{ name: 'MetaMask', url: 'https://metamask.io' },
		// 		// 	{ name: 'WalletConnect', url: 'https://walletconnect.com/' }
		// 		// ]
		// 	},
		// 	accountCenter: {
		// 		desktop: {
		// 			enabled: true,
		// 			position: 'topRight'
		// 		}
		// 	},
		// 	i18n: {
		// 		en: {
		// 			connect: {
		// 				selectingWallet: {
		// 					// header: '',
		// 					sidebar: {
		// 						heading: '',
		// 						subheading: 'Connect your wallet'
		// 						// paragraph: ''
		// 					},
		// 					recommendedWalletsPart1: '',
		// 					recommendedWalletsPart2: ''
		// 					// installWallet: ''
		// 					// agreement: {
		// 					// 	agree: '',
		// 					// 	terms: '',
		// 					// 	and: '',
		// 					// 	privacy: ''
		// 					// }
		// 				}
		// 			}
		// 		}
		// 	}
		// });

		// attach shield contract to contracts store
		const abi = [
			// Read-Only Functions
			'function balanceOf(address owner) view returns (uint256)',
			'function decimals() view returns (uint8)',
			'function symbol() view returns (string)',

			// Authenticated Functions
			'function transfer(address to, uint amount) returns (bool)',

			// Events
			'event Transfer(address indexed from, address indexed to, uint amount)'
		];
		defaultEvmStores.attachContract('SHIELD', '0x24861414c8845b8115397302e9dcfaab3f239826', abi);

		// reconnect from localstorage on reload
		const previouslyConnectedWallets = JSON.parse(window.localStorage.getItem('connectedWallets'));
		if (previouslyConnectedWallets) {
			await onboard.connectWallet({
				autoSelect: { label: previouslyConnectedWallets[0], disableModals: true }
			});
		}

		// set svelte-ethers-stores provider to make stores usable
		if (onboard.state.get().wallets.length !== 0) {
			const instance = onboard.state.get().wallets[0].provider;
			await defaultEvmStores.setProvider(instance);
		}

		// subscribe to state changes
		const { unsubscribe } = state.subscribe(async (update) => {
			// connected event
			if (update.wallets.length !== 0) {
				// add wallet to localstorage
				const connectedWallets = update.wallets.map(({ label }) => label);
				window.localStorage.setItem('connectedWallets', JSON.stringify(connectedWallets));
			}

			if (update.wallets.length === 0) {
				defaultEvmStores.disconnect();
			}

			// account changed event ??????
			// contract transaction filter event ??????
		});
	});

	const connect = async () => {
		const instance = await onboard.connectWallet();
		if (instance.length === 1) {
			defaultEvmStores.setProvider(instance[0].provider);
		}
	};

	const disconnect = async () => {
		const [primaryWallet] = await onboard.state.get().wallets;
		await onboard.disconnectWallet({ label: primaryWallet.label });
		defaultEvmStores.disconnect();

		// remove from localstorage
		window.localStorage.removeItem('connectedWallets');
	};

	const getShieldBalance = async () => {
		const balance = await $contracts.SHIELD.balanceOf($signerAddress);

		console.log(balance / 10 ** 9);
		return balance / 10 ** 9;
	};
</script>

<div class="mx-4 flex h-10 items-center justify-center">
	{#if !$connected}
		<button on:click={connect} class="h-full rounded-2xl border-2 border-solid border-transparent bg-blue-100 py-1 px-4 font-RedHatMono text-sm font-semibold transition-all ease-out hover:border-blue-200">Connect Wallet</button>
	{/if}
</div>

<style>
	:global(:root) {
		/* CUSTOMIZE THE COLOR  PALLETTE */
		--onboard-white: white;
		--onboard-black: black;
		--onboard-primary-1: #2f80ed;
		--onboard-primary-100: #eff1fc;
		--onboard-primary-200: #d0d4f7;
		--onboard-primary-300: #b1b8f2;
		--onboard-primary-400: #929bed;
		--onboard-primary-500: #6370e5;
		--onboard-primary-600: #454ea0;
		--onboard-primary-700: #323873;
		--onboard-gray-100: #ebebed;
		--onboard-gray-200: #c2c4c9;
		--onboard-gray-300: #999ca5;
		--onboard-gray-400: #707481;
		--onboard-gray-500: #33394b;
		--onboard-gray-600: #242835;
		--onboard-gray-700: #1a1d26;
		--onboard-success-100: #d1fae3;
		--onboard-success-200: #baf7d5;
		--onboard-success-300: #a4f4c6;
		--onboard-success-400: #8df2b8;
		--onboard-success-500: #5aec99;
		--onboard-success-600: #18ce66;
		--onboard-success-700: #129b4d;
		--onboard-danger-100: #ffe5e6;
		--onboard-danger-200: #ffcccc;
		--onboard-danger-300: #ffb3b3;
		--onboard-danger-400: #ff8080;
		--onboard-danger-500: #ff4f4f;
		--onboard-danger-600: #cc0000;
		--onboard-danger-700: #660000;
		--onboard-warning-100: #ffefcc;
		--onboard-warning-200: #ffe7b3;
		--onboard-warning-300: #ffd780;
		--onboard-warning-400: #ffc74c;
		--onboard-warning-500: #ffaf00;
		--onboard-warning-600: #cc8c00;
		--onboard-warning-700: #664600;

		/* CUSTOMIZE SECTIONS OF THE CONNECT MODAL */
		/* --onboard-connect-content-width */
		/* --onboard-connect-content-height */

		--onboard-wallet-columns: 2;
		/* --onboard-connect-sidebar-background
        /* --onboard-connect-sidebar-color */
		/* --onboard-connect-sidebar-progress-background */
		/* --onboard-connect-sidebar-progress-color */
		/* --onboard-connect-header-background */
		/* --onboard-connect-header-color */
		/* --onboard-link-color */
		--onboard-close-button-background: transparent;
		--onboard-close-button-color: transparent;
		/* --onboard-checkbox-background */
		/* --onboard-checkbox-color */
		/* --onboard-wallet-button-background */
		--onboard-wallet-button-background-hover: rgba(195, 195, 195, 0.14);
		/* --onboard-wallet-button-color */
		--onboard-wallet-button-border-color: rgba(195, 195, 195, 0.14);
		--onboard-wallet-app-icon-border-color: transparent;

		/* FONTS */
		/* --onboard-font-family-normal: Sofia Pro; */
		/* --onboard-font-family-semibold: Sofia Pro Semibold; */
		/* --onboard-font-family-light: Sofia Pro Light; */

		/* --onboard-font-size-1: 3rem; */
		/* --onboard-font-size-2: 2.25rem; */
		/* --onboard-font-size-3: 1.5rem; */
		/* --onboard-font-size-4: 1.25rem; */
		/* --onboard-font-size-5: 1rem; */
		/* --onboard-font-size-6: 0.875rem; */
		/* --onboard-font-size-7: 0.75rem; */

		/* SPACING */
		/* --onboard-spacing-1: 3rem; */
		/* --onboard-spacing-2: 2rem; */
		/* --onboard-spacing-3: 1.5rem; */
		/* --onboard-spacing-4: 1rem; */
		/* --onboard-spacing-5: 0.5rem; */

		/* SHADOWS */
		--onboard-shadow-1: 0px 4px 12px rgba(0, 0, 0, 0.1);
		--onboard-shadow-2: inset 0px -1px 0px rgba(0, 0, 0, 0.1);
		/* --onboard-modal-z-index */
	}
</style>
