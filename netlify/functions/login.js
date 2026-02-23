import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

exports.handler = async (event) => {
  const { email, password } = JSON.parse(event.body)

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: false,
        error: "invalid_credentials"
      })
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      success: true,
      user: data.user
    })
  }
}
