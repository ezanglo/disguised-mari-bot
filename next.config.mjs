/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [{
			protocol: 'https',
			hostname: 'media.discordapp.net',
		}, {
			protocol: 'https',
			hostname: 'cdn.discordapp.com',
		}, {
			protocol: "https",
			hostname: "utfs.io",
			pathname: "/a/1te70qyjma/*",
		},
		{
			protocol: "https",
			hostname: "static.wikia.nocookie.net",
		}]
	},
	async rewrites() {
		return [
			{
				source: '/admin',
				destination: '/admin/settings',
			},
		]
	},
};

export default nextConfig;
