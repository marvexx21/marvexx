const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

exports.handler = async (event) => {
  const { name, email, password } = JSON.parse(event.body || "{}")

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } }
  })

  if (error) {
    return {
      statusCode: 200,
      body: JSON.stringify({ success: false, error: error.message })
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true, user: data.user })
  }
}
