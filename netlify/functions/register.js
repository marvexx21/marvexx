const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" }
  }

  const { name, email, password } = JSON.parse(event.body || "{}")

  if (!email || !password) {
    return {
      statusCode: 200,
      body: JSON.stringify({ success: false, error: "missing_fields" })
    }
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name }
    }
  })

  if (error) {
    // email already used, invalid, etc.
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: false,
        error: "email_exists"
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
