import './css/main.css'
import clipboardIcon from './images/clipboard-copy.svg'
const seedColor = document.getElementById('seed-color')
const colorMode = document.getElementById('color-scheme-mode')
const button = document.querySelector('button')

const state = {
  seedColor: '#0000FF',
  colorMode: 'monochrome',
  colors: []
}

const createApiUrl = () => {
  const endpoint = 'https://www.thecolorapi.com/scheme'
  const hexParam = `hex=${state.seedColor.slice(1)}`
  const modeParam = `mode=${state.colorMode}`
  const params = hexParam + '&' + modeParam
  const query = '?' + params
  const composedApiUrl = endpoint + query
  return composedApiUrl
}

const fetchColorScheme = async () => {
  const response = await fetch(createApiUrl())
  const data = await response.json()
  return data.colors
}

const getColorValues = (colors) => {
  const colorValues = colors.map((color) => {
    return color.hex.value
  })
  return colorValues
}

const renderColorItems = (colors) => {
  const colorItems = document.querySelector('.colorItems')
  colorItems.innerHTML = ''

  async function copyToClipboard() {
    const prevInnerHTML = this.innerHTML
    await navigator.clipboard.writeText(this.dataset.color)
    this.innerHTML = 'COPIED!'
    this.style.backgroundColor = 'var(--gray-9)'
    this.style.fontWeight = 'bold'
    setTimeout(() => {
      this.innerHTML = prevInnerHTML
      this.style.backgroundColor = this.dataset.color
      this.style.fontWeight = 'normal'
    }, 1000)
  }

  const createButton = (color) => {
    const buttonEl = document.createElement('button')
    buttonEl.dataset.color = color
    buttonEl.classList.add('colorButton')
    buttonEl.setAttribute('title', 'Copy to clipboard')
    buttonEl.style.backgroundColor = color
    buttonEl.innerHTML = /*html*/ `<span>${color}</span>
    <img src='${clipboardIcon}' width='24' height='24' alt='copy to clipboard icon'>`
    buttonEl.addEventListener('click', copyToClipboard)
    return buttonEl
  }

  colors.forEach((color) => {
    const liEl = document.createElement('li')
    liEl.appendChild(createButton(color))
    colorItems.appendChild(liEl)
  })
}

const displayColorScheme = async () => {
  const colorScheme = await fetchColorScheme()
  const colorValues = getColorValues(colorScheme)
  renderColorItems(colorValues)
}

seedColor.addEventListener('change', (e) => {
  state.seedColor = e.target.value
})

colorMode.addEventListener('change', (e) => {
  state.colorMode = e.target.value
})

button.addEventListener('click', async () => {
  if (state.seedColor && state.colorMode) {
    displayColorScheme()
  }

  return
})

const renderSelectOptions = () => {
  const selectEl = document.getElementById('color-scheme-mode')
  const colorModes = [
    'monochrome',
    'monochrome-dark',
    'monochrome-light',
    'analogic',
    'complement',
    'analogic-complement',
    'triad',
    'quad'
  ]

  const options = colorModes.map((colorMode) => {
    return /*html*/ `
      <option value="${colorMode}">${
      colorMode[0].toUpperCase() + colorMode.slice(1)
    }</option>
    `
  })

  selectEl.innerHTML = options
}

renderSelectOptions()
displayColorScheme()
