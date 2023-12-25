const getDueDateSuffix = (day) => {
    if (day >= 11 && day <= 13) {
      return 'th'
    }
    const lastDigit = day % 10
    switch (lastDigit) {
      case 1:
        return 'ˢᵗ'
      case 2:
        return 'ⁿᵈ'
      case 3:
        return 'ʳᵈ'
      default:
        return 'ᵗʰ'
    }
  }

  const sanitizeFiat = (newValue, isDeletion) => {
    const newStr = newValue.toString()
    return parseFloat(isDeletion ? newStr / 10 : newStr * 10)
      .toFixed(2)
      .toString()
  }
  
  const isNumber = (text) => {
    return !Number.isNaN(text.replace('.', '').replace('-', ''))
  }

  export default{ getDueDateSuffix, sanitizeFiat, isNumber}