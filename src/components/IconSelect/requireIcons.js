
const req = require.context('../../assets/icons/svg', false, /\.svg$/)
console.log(req,'req----')
const requireAll = requireContext => requireContext.keys()
const re = /\.\/(.*)\.svg/

const icons = requireAll(req).map(i => {
  return i.match(re)[1]
})
console.log(icons,'icons----')
export default icons
