import { getSession } from 'next-auth/client'
import { query as q } from 'faunadb'

import { stripe } from '../../services/stripe'
import { fauna } from '../../services/fauna'
import { NextApiRoute } from './_lib/types'

type User = {
  ref: {
    id: string
  }
  data: {
    stripe_customer_id: string
  }
}

const Subscribe: NextApiRoute = async (req, res) => {
  if (req.method === 'POST') {
    const session = await getSession({ req })
    const { email } = session.user

    const user = await fauna.query<User>(
      q.Get(q.Match(q.Index('user_by_email'), q.Casefold(email)))
    )

    let customer_id = user.data.stripe_customer_id

    if (!customer_id) {
      const stripeCustomer = await stripe.customers.create({
        email: email
      })

      await fauna.query(
        q.Update(q.Ref(q.Collection('users'), user.ref.id), {
          data: {
            stripe_customer_id: stripeCustomer.id
          }
        })
      )

      customer_id = stripeCustomer.id
    }

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: customer_id,
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      line_items: [{ price: 'price_1IZjLYIFWnW7hwozeAbrQS2V', quantity: 1 }],
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL
    })

    res.status(201).json({ sessionId: stripeCheckoutSession.id })
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method not allowed')
  }
}

export default Subscribe
