const assetUrl = (fileName) => new URL(`./investor/${fileName}`, import.meta.url).href

export const investorAssets = Object.freeze({
  ecoLodge: assetUrl('eco-lodge.png'),
})
