
const nextConfig = {
  images: {
    remotePatterns: [
      new URL('https://open.spotify.com/**/*'),
      // new URL('https://image-cdn-fa.spotifycdn.com/**/*'),
      // new URL('https://image-cdn-ak.spotifycdn.com/**/*'),
      // new URL('https://mosaic.scdn.co/**/*'),
      {
        protocol: 'https',
        hostname: '*.**.com',
      },
      {
        protocol: 'https',
        hostname: '*.**.co',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.API_URL}/api/:path*`,
      },
    ];
  },
  // allowedDevOrigins: ['localhost:3000', '127.0.0.1:3000', 'http://server:3000'],
};

export default nextConfig;
