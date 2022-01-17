// deploy/00_deploy_my_registry.js
module.exports = async ({getNamedAccounts, deployments}) => {
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();
    await deploy('Registry', {
      from: deployer,
      log: true,
    });
  };
  module.exports.tags = ['Registry'];