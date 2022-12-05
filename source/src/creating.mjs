import setText, { appendText, hideWaiting } from "./results.mjs"

export function timeout() {
  const wait = new Promise(resolve =>
    setTimeout(() => resolve("Some Text"), 1500)
  )

  wait
    .then(text => {
      setText(text)
      return text
    })
    .then(text => setTimeout(() => setText(`${text} and ${text}`), 1500))
}

export function interval() {
  let counter = 0
  const wait = new Promise(resolve =>
    setInterval(() => {
      console.log(++counter)
      resolve("Some Text" + counter)
    }, 1000)
  )

  wait
    .then(text => {
      setText(text)
      return text
    })
    .finally(() => appendText(" im done " + counter))
}

export function clearIntervalChain() {
  let counter = 0
  let interval

  const wait = new Promise(
    resolve =>
      (interval = setInterval(() => {
        console.log(++counter)
        resolve("Some Text" + counter)
      }, 1000))
  )

  wait
    .then(text => {
      setText(text)
    })
    .finally(() => {
      appendText(" im done " + counter)
      clearInterval(interval)
    })
}

export function xhr() {
  let request = new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest()
    xhr.open("GET", "http://localhost:3000/users/777")

    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.responseText)
      } else {
        reject(xhr.statusText)
      }
    }

    xhr.onerror = () => reject("Request Failed")
    xhr.send()
  })

  request.then(res => setText(res)).catch(err => setText(err))
}

export function allPromises() {
  let categories = axios.get("http://localhost:3000/itemCategories")
  let statuses = axios.get("http://localhost:3000/orderStatuses")
  let userTypes = axios.get("http://localhost:3000/userTypes")
  let failedRequest = axios.get("http://localhost:3000/addressTypes")

  Promise.all([categories, statuses, userTypes, failedRequest])
    .then(resArr => {
      setText("")

      resArr.map(item => appendText(JSON.stringify(item.data)))
    })
    .catch(err => setText(err))
}

export function allSettled() {
  let categories = axios.get("http://localhost:3000/itemCategories")
  let statuses = axios.get("http://localhost:3000/orderStatuses")
  let userTypes = axios.get("http://localhost:3000/userTypes")
  let failedRequest = axios.get("http://localhost:3000/addressTypes")

  Promise.allSettled([categories, statuses, userTypes, failedRequest])
    .then(resArr => {
      setText("")

      const results = resArr.map(item => {
        if (item.status === "fulfilled")
          return `FULFILLED ${JSON.stringify(item.value.data)}`

        return `REJECTED: ${item.reason.message}`
      })

      setText(results)
    })

    .catch(err => setText(err))
}

export function race() {
  let users = axios.get("http://localhost:3000/users")
  let backup = axios.get("http://localhost:3001/users")

  Promise.race([users, backup])
    .then(users => setText(JSON.stringify(users.data)))
    .catch(err => setText(err))
}
