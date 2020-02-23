const dayIndexToString = (dayIndex: number, upperCase?: false): string => {
  let dayString = ''

  if (dayIndex === 0) {
    dayString = 'sun'
  } else if (dayIndex === 1) {
    dayString = 'mon'
  } else if (dayIndex === 2) {
    dayString = 'tue'
  } else if (dayIndex === 3) {
    dayString = 'wed'
  } else if (dayIndex === 4) {
    dayString = 'thu'
  } else if (dayIndex === 5) {
    dayString = 'fri'
  } else if (dayIndex === 6) {
    dayString = 'sat'
  }

  return upperCase ? dayString.toUpperCase() : dayString
}

export default dayIndexToString
