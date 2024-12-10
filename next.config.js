// next.config.js

module.exports = {
    images: {
      domains: ['avatars.mds.yandex.net', 'localhost', 'your-domain.com'], // Add your domain here
    },
    async rewrites() {
      return [
        {
          source: '/privacy/:path*',
          destination: '/app/privacy/:path*',
        },
      ];
    },
};
  