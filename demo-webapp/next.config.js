/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
            { protocol: "https", hostname: "loremflickr.com", pathname: "/**" },
            { protocol: "https", hostname: "via.placeholder.com", pathname: "/**" }
        ],
    },
};

module.exports = nextConfig;
