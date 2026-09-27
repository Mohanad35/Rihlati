const assetUrl = (fileName) => new URL(`./tourist/${fileName}`, import.meta.url).href

export const touristAssets = Object.freeze({
  routeMarkers: assetUrl('route-markers.png'),
})
