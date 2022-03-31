let button = document.getElementById('copyButton')

button.addEventListener('click', generateAndCopyQuery)

function getNumber(n) {
  return n < 10 ? '0' + n : '' + n
}

const twelveMinutes = 12 * 60000
const sixtyMinutes = 60 * 60000
const minsInHour = 60

function generateAndCopyQuery() {
  let margin = document.getElementById('margin_select').value
  let app = document.getElementById('app_select').value
  let minute = document.getElementById('minute').value
  let hour = document.getElementById('hour').value
  let day = document.getElementById('day').value
  let month = document.getElementById('month').value
  var date = localToGMT4(new Date(`2022-${getNumber(month)}-${getNumber(day)}T${getNumber(hour)}:${getNumber(minute)}:00`))
  var actualDateMLs = date.getTime()
  var dateMore = new Date(actualDateMLs + twelveMinutes)
  var dateLess = new Date(actualDateMLs - twelveMinutes)
  let query = `SELECT request_method, request_uri, status, request_time, ds, pool_to FROM traffic.access_logs_${margin} WHERE status >= 499 AND ds >= '2022-${getNumber(
    dateLess.getMonth() + 1
  )}-${getNumber(dateLess.getDate())}T${getNumber(
    dateLess.getHours()
  )}_${getNumber(
    dateLess.getMinutes()
  )}_00' AND ds <= '2022-${getNumber(dateLess.getMonth() + 1)}-${getNumber(
    dateMore.getDate()
  )}T${getNumber(dateMore.getHours())}_${getNumber(
    dateMore.getMinutes()
  )}_00' AND pool_to LIKE '${app}'`
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

function localToGMT4(defDate) {
  var numberOfMlSeconds = defDate.getTime()

  if ((defDate.getTimezoneOffset() / minsInHour) == 5)  {
    return new Date(numberOfMlSeconds + sixtyMinutes)
  }
  else return new Date(numberOfMlSeconds - sixtyMinutes)
}