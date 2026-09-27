const assetUrl = (fileName) => new URL(`./home/${fileName}`, import.meta.url).href

export const homeAssets = Object.freeze({
  logo: assetUrl('rihlati-logo.svg'),
  jordanMap: assetUrl('jordan-map.png'),
  petra: assetUrl('petra.png'),
  wadiRum: assetUrl('wadi-rum.png'),
  deadSea: assetUrl('dead-sea.png'),
  deadSeaPhoto: assetUrl('dead-sea-photo.png'),
  investorNew: assetUrl('investor-new.png'),
  investorExisting: assetUrl('investor-existing.png'),
})
