

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  webpack: function(config, options) {
    config.experiments = { asyncWebAssembly: true, layers: true };
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300
    };
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })
    return config;
  },
  rewrites() {
    return {
      beforeFiles: [
        {
          source: '/:path*',
          has: [
            {
              type: 'host',
              value: 'editor',
            },
          ],
          destination: '/',
        },
      ]
    }
  }
};

export default config;
