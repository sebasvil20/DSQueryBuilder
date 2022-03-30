let button = document.getElementById('copyButton')

button.addEventListener('click', generateAndCopyQuery)

function getNumber(n) {
  return n < 10 ? '0' + n : '' + n
}

function generateAndCopyQuery() {
  let margin = document.getElementById('margin_select').value
  let app = document.getElementById('app_select').value
  let minute = document.getElementById('minute').value
  let hour = document.getElementById('hour').value
  let day = document.getElementById('day').value
  let month = document.getElementById('month').value
  let defDate = new Date(2022, month, day)
  let date = dayjs(defDate).hour(hour).minute(minute)
  date = localToGMT4(defDate, date)
  let query = `SELECT request_method, request_uri, status, request_time, ds, pool_to FROM traffic.access_logs_${margin} WHERE status >= 499 AND ds >= '2022-${getNumber(
    date.subtract(10, 'm').month()
  )}-${getNumber(date.subtract(10, 'm').date())}T${getNumber(
    date.subtract(10, 'm').hour()
  )}_${getNumber(
    date.subtract(10, 'm').minute()
  )}_00' AND ds <= '2022-${getNumber(date.add(10, 'm').month())}-${getNumber(
    date.add(10, 'm').date()
  )}T${getNumber(date.add(10, 'm').hour())}_${getNumber(
    date.add(10, 'm').minute()
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

function localToGMT4(defDate, date) {
  const minsInHour = 60

  if ((defDate.getTimezoneOffset() / minsInHour) == 5)  {
    return date.add(1, 'h')
  }
  else return date.subtract(1, 'h')
}