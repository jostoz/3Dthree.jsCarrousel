const nextConfig = {
    webpack: (config) => {
      config.externals = [...config.externals, { canvas: 'canvas' }];
      return config;
    },
    transpilePackages: ['three'],
  };
  
  module.exports = nextConfig;