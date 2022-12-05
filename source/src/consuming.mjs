import setText, { appendText, showWaiting, hideWaiting } from "./results.mjs"

export function get() {
  axios
    .get("http://localhost:3000/orders/1")
    .then(({ data }) => setText(JSON.stringify(data)))
}

export function getCatch() {
  axios
    .get("http://localhost:3000/orders/1")
    .then(res => {
      console.log("RRRES", res)

      if (res.status === 200) {
        setText(JSON.stringify(res.data))
      } else {
        setText("Error")
      }

      return "Some Random Text"
    })
    .then(res => console.log(res))
    .catch(err => setText(err))
}

export function chain() {
  axios
    .get("http://localhost:3000/orders/1")
    .then(({ data }) =>
      axios.get(`http://localhost:3000/addresses/${data.shippingAddress}`)
    )
    .then(({ data }) => setText(`City: ${data.city}`))
}

export function chainCatch() {
  axios
    .get("http://localhost:3000/orders/1")
    .then(({ data }) => {
      // throw new Error("Error")
      return axios.get(
        `http://localhost:3000/addresses/${
          Math.random() > 0.5 ? data.shippingAddress : 123
        }`
      )
    })
    .catch(err => {
      setText(err)
      return { data: {} }
    })
    .then(({ data }) => setText(`City: ${data.UNDEFINED.city}`))
    .catch(err => setText(err))
}

export function final() {
  showWaiting()
  axios
    .get("http://localhost:3000/orders/1")
    .then(({ data }) => {
      // throw new Error("Error")
      return axios.get(
        `http://localhost:3000/addresses/${
          Math.random() > 0.5 ? data.shippingAddress : 123
        }`
      )
    })
    .then(({ data }) => setText(`City: ${data.city}`))
    .catch(err => setText(err))
    .finally(() => setTimeout(() => hideWaiting(), 500))
  // .finally(() => hideWaiting())
}
