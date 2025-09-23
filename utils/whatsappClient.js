import venom from "venom-bot"

let client

async function getClient() {
  if (client) return client

  client = await venom.create({
    session: 'bookstore-session',
    puppeteerOptions: { headless: true }
  })

  return client
}

export default getClient