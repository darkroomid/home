export interface SiteDataProps {
	name: String;
	title: string;
	description: string;
	useViewTransitions?: boolean; // defaults to false. Set to true to enable some Astro 3.0 view transitions
	author: {
		name: string;
		email: string;
		twitter: string; // used for twitter cards when sharing a blog post on twitter
	};
	defaultImage: {
		src: string;
		alt: string;
	};
}

// Update this file with your site specific information
const siteData: SiteDataProps = {
	name: "Darkroom.id",
	// Your website's title and description (meta fields)
	title: "Darkroom.id",
	// This is the homepage's meta description — was just the tagline ("Just Room
	// without Light"), which reads well as a hero headline but tells a search
	// engine nothing about what the site actually offers. Kept the tagline as
	// on-page copy (see Hero.astro) and made this actually descriptive instead.
	description:
		"Original analog and digital photography, gear reviews, and editing tutorials from darkroom.id.",
	useViewTransitions: true,
	// Your information!
	author: {
		name: "Andrea Ross",
		email: "hi@darkroom.id",
		twitter: "darkroomid__",
	},

	// default image for meta tags if the page doesn't have an image already
	defaultImage: {
		src: "/images/plane.jpg",
		alt: "Darkroom Id",
	},
};

export default siteData;
