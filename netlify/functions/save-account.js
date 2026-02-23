const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

exports.handler = async (event) => {
  try {
    const { user_id, type, name } = JSON.parse(event.body || "{}")

    if (!user_id || !type || !name) {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: false, error: "missing_fields" })
      }
    }

    const { error } = await supabase
      .from("accounts")
      .insert([
        { user_id, type, name }
      ])

    if (error) {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: false, error: error.message })
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    }

  } catch (err) {
    return {
      statusCode: 200,
      body: JSON.stringify({ success: false, error: err.message })
    }
  }
}
