// Klaro consent configuration.
// Docs: https://github.com/klaro-org/klaro-js
//
// Each service's onAccept/onDecline hook pushes the corresponding Google Consent
// Mode v2 signal. Defaults are all "denied" (set in ConsentScripts.astro) until the
// visitor makes an explicit choice.

var klaroConfig = {
	version: 1,
	elementID: "klaro",
	styling: {
		theme: ["light", "top", "wide"],
	},
	mustConsent: false,
	acceptAll: true,
	hideDeclineAll: false,
	default: false,
	cookieExpiresIn: 365,

	services: [
		{
			name: "google-analytics",
			title: "Analytics (Google Analytics 4)",
			purposes: ["analytics"],
			cookies: [/^_ga/, /^_gid/],
			onAccept: function () {
				window.dataLayer = window.dataLayer || [];
				function gtag() {
					dataLayer.push(arguments);
				}
				gtag("consent", "update", { analytics_storage: "granted" });
			},
			onDecline: function () {
				window.dataLayer = window.dataLayer || [];
				function gtag() {
					dataLayer.push(arguments);
				}
				gtag("consent", "update", { analytics_storage: "denied" });
			},
		},
		{
			name: "google-adsense",
			title: "Personalized advertising (Google AdSense)",
			purposes: ["advertising"],
			cookies: [/^__gads/, /^__gpi/],
			onAccept: function () {
				window.dataLayer = window.dataLayer || [];
				function gtag() {
					dataLayer.push(arguments);
				}
				gtag("consent", "update", {
					ad_storage: "granted",
					ad_user_data: "granted",
					ad_personalization: "granted",
				});
			},
			onDecline: function () {
				window.dataLayer = window.dataLayer || [];
				function gtag() {
					dataLayer.push(arguments);
				}
				gtag("consent", "update", {
					ad_storage: "denied",
					ad_user_data: "denied",
					ad_personalization: "denied",
				});
			},
		},
	],

	translations: {
		en: {
			consentModal: {
				title: "Your privacy choices",
				description:
					"We use cookies for analytics and, once you consent, personalized ads. You can change your choice anytime.",
			},
			purposes: {
				analytics: "Analytics",
				advertising: "Advertising",
			},
		},
	},
};
