let button = document.getElementById('copyButton')
button.addEventListener('click', getFormValues)

let marginElem = document.getElementById('margin_select')
marginElem.addEventListener('change', renderInputs)

function getNumber(n) {
  return n < 10 ? '0' + n : '' + n
}

const twelveMinutes = 12 * 60000
const sixtyMinutes = 60 * 60000
const minsInHour = 60

function isCurrent() {
  return marginElem.value == 'current'
}

function renderInputs() {
  const hoursMinutes = document.getElementById('hoursMinutes')
  const hoursRounded = document.getElementById('hoursRounded')
  if (isCurrent()) {
    hoursMinutes.classList.remove('hidden')
    hoursRounded.classList.add('hidden')
    return
  }
  hoursRounded.classList.remove('hidden')
  hoursMinutes.classList.add('hidden')
}

function getFormValues() {
  const margin = marginElem.value
  const app = document.getElementById('app_select').value
  let minute = 00
  let hour = 00
  let day = 00
  let month = 00
  var majorDate = new Date()
  var minorDate = new Date()

  if (isCurrent()) {
    minute = document.getElementById('minute').value
    hour = document.getElementById('hour').value
    day = document.getElementById('day').value
    month = document.getElementById('month').value
    let date = localToGMT4(
      new Date(
        `2022-${getNumber(month)}-${getNumber(day)}T${getNumber(
          hour
        )}:${getNumber(minute)}:00`
      )
    )

    actualDateInMLs = date.getTime()
    majorDate = new Date(actualDateInMLs + twelveMinutes)
    minorDate = new Date(actualDateInMLs - twelveMinutes)
  } else {
    initialHour = document.getElementById('initialHour').value
    day = document.getElementById('day').value
    month = document.getElementById('month').value
    let date = localToGMT4(
      new Date(
        `2022-${getNumber(month)}-${getNumber(day)}T${getNumber(
          initialHour
        )}:00:00`
      )
    )
    minorDate = new Date(date.getTime() - sixtyMinutes)
    majorDate = new Date(date.getTime() + sixtyMinutes)
  }

  generateAndCopyQuery(majorDate, minorDate, margin, app)
}

function localToGMT4(defDate) {
  var numberOfMlSeconds = defDate.getTime()

  if (defDate.getTimezoneOffset() / minsInHour == 5) {
    return new Date(numberOfMlSeconds + sixtyMinutes)
  } else return new Date(numberOfMlSeconds - sixtyMinutes)
}

function generateAndCopyQuery(majorDate, minorDate, margin, app) {
  let query = `SELECT request_method, request_uri, status, request_time, ds, pool_to FROM traffic.access_logs_${margin} WHERE status >= 499 AND ds >= '2022-${getNumber(
    minorDate.getMonth() + 1
  )}-${getNumber(minorDate.getDate())}T${getNumber(
    minorDate.getHours()
  )}_${getNumber(minorDate.getMinutes())}_00' AND ds <= '2022-${getNumber(
    majorDate.getMonth() + 1
  )}-${getNumber(majorDate.getDate())}T${getNumber(
    majorDate.getHours()
  )}_${getNumber(majorDate.getMinutes())}_00' AND pool_to LIKE '${app}'`
  navigator.clipboard.writeText(query)
  changeButtonText()
}

function changeButtonText() {
  const originalText = button.textContent || button.innerText
  button.innerText = 'Copied! :)'
  button.style.backgroundColor = '#00BA88'
  setTimeout(function () {
    button.innerText = originalText
    button.style.backgroundColor = 'rgba(177, 196, 248, 0.39)'
  }, 3000)
}
