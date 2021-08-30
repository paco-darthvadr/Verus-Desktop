module.exports = (api) => {
  // TODO: Expand to work beyond just native mode
  api.is_pbaas = (chainTicker) => {
    return (
      chainTicker !== "VRSC" &&
      (api.native.launchConfigs[chainTicker] != null
        ? api.native.launchConfigs[chainTicker].daemon != null &&
          api.native.launchConfigs[chainTicker].daemon === "verusd"
        : false)
    );
  };

  return api;
};
