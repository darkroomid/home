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
	description: "Just Room without Light",
	useViewTransitions: true,
	// Your information!
	author: {
		name: "Andrea Ross",
		email: "lurah.milan@gmail.com",
		twitter: "dark.room.id",
	},

	// default image for meta tags if the page doesn't have an image already
	defaultImage: {
		src: "/images/plane.jpg",
		alt: "Darkroom Id",
	},
};

export default siteData;
